#!/usr/bin/env node
// Public cell: preserve every old history. Proposal: rehearse in disposable DBs only.
// Reads only snapshots and opens only a disposable database, never a learner library.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const cell = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
  readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);
assert.equal(mapping.approved, null);
assert.equal(cell.retired_items, undefined);
assert.ok(
  cell.atoms.every((atom) =>
    atom.practice_items.every((item) => !item.replaces),
  ),
);
const itemCount = cell.atoms.reduce(
  (n, atom) => n + atom.practice_items.length,
  0,
);
const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  return JSON.parse(bytes.toString("utf8"));
});
const oldIds = oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
for (const item of oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items),
)) {
  assert.deepEqual(
    mapping.rows.find((row) => row.de_by_id === item.id).de_by_question,
    item.question_segments ?? item.question,
    `exact original question, including segments: ${item.id}`,
  );
}
assert.deepEqual(
  [...oldIds].sort(),
  mapping.rows.map((row) => row.de_by_id).sort(),
);
const dir = mkdtempSync(join(tmpdir(), "zam-geschichte10-history-"));
const db = await zam.openDatabase({
  dbPath: join(dir, "history.db"),
  initialize: true,
  useConfiguredCloud: false,
});
const snapshot = async (database = db) => ({
  tokens: await database.prepare("SELECT * FROM tokens ORDER BY id").all(),
  replacements: await database
    .prepare(
      "SELECT * FROM practice_item_replacements ORDER BY old_item_id, new_item_id",
    )
    .all(),
  cards: await database.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await database
    .prepare("SELECT * FROM review_logs ORDER BY id")
    .all(),
});
function assertRepeatedProposal(before, after, retired) {
  assert.deepEqual(after.cards, before.cards);
  assert.deepEqual(after.reviews, before.reviews);
  assert.deepEqual(after.replacements, before.replacements);
  assert.equal(after.tokens.length, before.tokens.length);
  for (const token of before.tokens) {
    const fresh = after.tokens.find((candidate) => candidate.id === token.id);
    assert.ok(fresh);
    if (!retired.has(token.id)) {
      assert.deepEqual(fresh, token);
      continue;
    }
    // zam-core 0.54.0 stamps updated_at on every retired_items application.
    // Record this exact limitation; no other token field or history may drift.
    assert.deepEqual({ ...fresh, updated_at: token.updated_at }, token);
    assert.ok(Date.parse(fresh.updated_at) >= Date.parse(token.updated_at));
  }
}
try {
  for (const tile of oldCells) await zam.installKvtTile(db, tile);
  const userId = cell.atoms[0].id;
  for (const [index, tokenId] of oldIds.entries()) {
    const card = await zam.ensureCard(db, tokenId, userId);
    for (const [pass, rating] of [
      index % 3 === 0 ? 1 : 3,
      index % 2 === 0 ? 3 : 4,
    ].entries()) {
      await zam.evaluateRating(db, {
        cardId: card.id,
        tokenId,
        userId,
        rating,
        answerFormat: "recall",
        responseTimeMs: 1200 + index * 100,
        now: new Date(Date.UTC(2026, 8, 1 + pass * 10)),
      });
    }
  }
  const before = await snapshot();
  assert.equal(before.cards.length, oldIds.length);
  assert.equal(before.reviews.length, 2 * oldIds.length);
  await zam.installKvtTile(db, cell);
  const installed = await snapshot();
  assert.deepEqual(
    installed.cards,
    before.cards,
    "install invents no enrolment or mastery",
  );
  assert.deepEqual(
    installed.reviews,
    before.reviews,
    "every review stays unchanged",
  );
  assert.deepEqual(
    installed.replacements,
    before.replacements,
    "no transfer declared",
  );
  for (const token of before.tokens)
    assert.deepEqual(
      installed.tokens.find((candidate) => candidate.id === token.id),
      token,
    );
  for (const id of oldIds)
    assert.equal((await zam.getTokenById(db, id)).deprecated_at, null);
  const queue = await zam.buildReviewQueue(db, {
    userId,
    tokenIds: oldIds,
    now: new Date("2030-01-01T00:00:00Z"),
    buryNewSiblings: false,
    buryReviewSiblings: false,
  });
  assert.equal(queue.items.length, oldIds.length, "every old card remains active");
  const atoms = cell.atoms.map((atom) => atom.id);
  assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
    cardsCreated: itemCount,
    cardsReused: 0,
  });
  const complete = await snapshot();
  assert.equal(complete.cards.length, oldIds.length + itemCount);
  assert.deepEqual(complete.reviews, before.reviews);
  for (const card of before.cards)
    assert.deepEqual(
      complete.cards.find((candidate) => candidate.id === card.id),
      card,
    );
  for (const card of complete.cards.filter(
    (card) => !oldIds.includes(card.token_id),
  )) {
    assert.equal(card.state, "new");
    assert.equal(card.stability, 0);
    assert.equal(card.reps, 0);
    assert.equal(card.last_review_at, null);
  }
  await zam.installKvtTile(db, cell);
  assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
    cardsCreated: 0,
    cardsReused: itemCount,
  });
  assert.deepEqual(
    await snapshot(),
    complete,
    "repeated install and enrolment change nothing",
  );
  console.log(
    `ok   Geschichte 10 public cell: ${oldIds.length} old cards active; all FSRS fields and ${2 * oldIds.length} reviews unchanged; ${itemCount} fresh unlearned cards; repeat install/enrolment idempotent`,
  );
  await rehearseProposal();
} finally {
  await db.close();
  rmSync(dir, { recursive: true, force: true });
}

/** Explicit proposal data is exercised without changing the cell or its approval. */
async function rehearseProposal() {
  const rows = mapping.rows.filter(
    (row) => row.category === "A" || row.category === "B",
  );
  const proposed = structuredClone(cell);
  proposed.version = "2026.10.2";
  const retirements = mapping.rows.filter(
    (row) => row.action === "propose-retire-after-approval",
  );
  const retired = new Set(retirements.map((row) => row.de_by_id));
  proposed.retired_items = retirements.map((row) => ({
    id: row.de_by_id,
    reason: row.reason,
  }));
  const items = proposed.atoms.flatMap((atom) => atom.practice_items);
  const expected = new Map();
  for (const row of rows) {
    const successor = items.find((item) => item.slug === row.academy_slug);
    assert.ok(successor, `missing proposed successor ${row.academy_slug}`);
    successor.replaces = [row.de_by_id];
    expected.set(row.de_by_id, successor.id);
  }
  assert.equal(
    new Set(expected.values()).size,
    rows.length,
    "one history per successor",
  );
  const withoutToken = ({ token_id, ...fields }) => fields;
  const reviewed = async (database, tokenId, userId, rating) => {
    const card = await zam.ensureCard(database, tokenId, userId);
    await zam.evaluateRating(database, {
      cardId: card.id,
      tokenId,
      userId,
      rating,
      answerFormat: "recall",
      responseTimeMs: 2400,
      now: new Date("2026-09-10T00:00:00Z"),
    });
  };
  const trial = await zam.openDatabase({
    dbPath: join(dir, "proposal.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(trial, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries())
      await reviewed(trial, id, userId, index % 2 ? 3 : 1);
    const before = await snapshot(trial);
    await zam.installKvtTile(trial, proposed);
    const after = await snapshot(trial);
    assert.equal(after.cards.length, before.cards.length);
    assert.equal(after.reviews.length, before.reviews.length);
    for (const table of ["cards", "reviews"])
      for (const old of before[table]) {
        const fresh = after[table].find((row) => row.id === old.id);
        assert.ok(fresh);
        assert.deepEqual(
          withoutToken(fresh),
          withoutToken(old),
          `${table}: every evidence field preserved`,
        );
        assert.equal(
          fresh.token_id,
          expected.get(old.token_id) ?? old.token_id,
        );
      }
    for (const id of oldIds) {
      const token = await zam.getTokenById(trial, id);
      assert.ok(token);
      assert.equal(
        Boolean(token.deprecated_at),
        expected.has(id) || retired.has(id),
      );
    }
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [
        old_item_id,
        new_item_id,
      ]),
      [...expected.entries()].sort(([a], [b]) => a.localeCompare(b)),
      "only the proposed A transfers, never a replacement for a C card",
    );
    const queue = await zam.buildReviewQueue(trial, {
      userId,
      tokenIds: oldIds,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(
      queue.items.length,
      oldIds.length - rows.length - retired.size,
    );
    await zam.installKvtTile(trial, proposed);
    assertRepeatedProposal(after, await snapshot(trial), retired);
    const atoms = proposed.atoms.map((atom) => atom.id);
    for (let round = 0; round < 5; round++) {
      const result = await zam.materialiseKvtCards(trial, userId, atoms);
      if (result.cardsCreated === 0) break;
    }
    const complete = await snapshot(trial);
    assert.equal(
      complete.cards.length,
      itemCount + oldIds.length - rows.length,
    );
    assert.deepEqual(complete.reviews, after.reviews);
    for (const old of after.cards)
      assert.deepEqual(
        complete.cards.find((card) => card.id === old.id),
        old,
      );
    for (const fresh of complete.cards.filter(
      (card) => !after.cards.some((old) => old.id === card.id),
    )) {
      assert.equal(fresh.state, "new");
      assert.equal(fresh.stability, 0);
      assert.equal(fresh.reps, 0);
    }
    assert.deepEqual(await zam.materialiseKvtCards(trial, userId, atoms), {
      cardsCreated: 0,
      cardsReused: itemCount,
    });
    assert.deepEqual(await snapshot(trial), complete);
    console.log(
      `ok   proposal simulation only: ${rows.length} histories moved; ${retired.size} C card retired with history intact; ${oldIds.length - rows.length - retired.size} C cards active; all repeated state stable except zam-core 0.54.0 refreshing retired token updated_at`,
    );
  } finally {
    await trial.close();
  }
  const collision = await zam.openDatabase({
    dbPath: join(dir, "collision.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(collision, tile);
    await zam.installKvtTile(collision, cell);
    const userId = cell.atoms[0].id,
      row = rows[0];
    await reviewed(collision, row.de_by_id, userId, 1);
    await reviewed(collision, expected.get(row.de_by_id), userId, 3);
    const before = await snapshot(collision);
    await assert.rejects(
      () => zam.installKvtTile(collision, proposed),
      (error) => {
        assert.equal(
          error.message,
          `Cannot move ${row.de_by_id} to ${expected.get(row.de_by_id)}: ${userId} holds a card on both. That is a merge, and mastery is never merged automatically — resolve it explicitly and re-test.`,
        );
        return true;
      },
    );
    assert.deepEqual(await snapshot(collision), before);
    console.log(
      "ok   proposal collision: exact old/new/user error; tokens, replacement declarations and all evidence rolled back",
    );
  } finally {
    await collision.close();
  }
}
