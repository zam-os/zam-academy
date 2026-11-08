#!/usr/bin/env node
// Public cell: no replaces and no retired_items yet (package standard, decision
// of 2026-10-22), so every old history stays untouched. The proposed mapping is
// rehearsed in disposable databases only, never in a learner library.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node mathematik-gymnasium-13/scripts/validate-migration.mjs
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
assert.equal(mapping.approved, null, "Thomas has not approved the mapping yet");
assert.equal(mapping.status, "proposal-only");
assert.equal(cell.retired_items, undefined, "no old card is retired");
assert.ok(
  cell.atoms.every((atom) =>
    atom.practice_items.every((item) => !item.replaces),
  ),
  "the public cell declares no history transfer",
);
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const itemCount = items.length;
const bySlug = new Map(items.map((item) => [item.slug, item]));
const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
const oldItems = oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items),
);
const oldIds = oldItems.map((item) => item.id);
for (const item of oldItems) {
  const row = mapping.rows.find((entry) => entry.de_by_id === item.id);
  assert.ok(row, `every old item is mapped: ${item.id}`);
  assert.deepEqual(
    row.de_by_question,
    item.question_segments ?? item.question,
    `exact original question, including segments: ${item.id}`,
  );
}
assert.deepEqual(
  [...oldIds].sort(),
  mapping.rows.map((row) => row.de_by_id).sort(),
  "every old item, and only old items, has one mapping row",
);
const dir = mkdtempSync(join(tmpdir(), "zam-gy13-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

const snapshot = async (database) => ({
  tokens: await database.prepare("SELECT * FROM tokens ORDER BY id").all(),
  replacements: await database
    .prepare(
      "SELECT * FROM practice_item_replacements ORDER BY old_item_id, new_item_id",
    )
    .all(),
  cards: await database.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await database.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});

async function reviewedCard(database, tokenId, userId, index) {
  const card = await zam.ensureCard(database, tokenId, userId);
  await zam.evaluateRating(database, {
    cardId: card.id,
    tokenId,
    userId,
    rating: index % 3 === 0 ? 1 : 3,
    answerFormat: "recall",
    responseTimeMs: 1200 + index * 100,
    now: new Date(Date.UTC(2026, 8, 1 + (index % 7))),
  });
  await zam.evaluateRating(database, {
    cardId: card.id,
    tokenId,
    userId,
    rating: index % 2 === 0 ? 3 : 4,
    answerFormat: "recall",
    responseTimeMs: 1600 + index * 120,
    now: new Date(Date.UTC(2026, 8, 11 + (index % 7))),
  });
}

/** Repeated installs must never move a schedule or touch review evidence. */
function assertRepeatedProposal(before, after) {
  assert.deepEqual(after.cards, before.cards);
  assert.deepEqual(after.reviews, before.reviews);
  assert.deepEqual(after.replacements, before.replacements);
  assert.deepEqual(after.tokens, before.tokens);
}

try {
  // ── The published cell: it keeps every history exactly as it is ──────────
  const db = await zam.openDatabase({
    dbPath: join(dir, "history.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(db, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries())
      await reviewedCard(db, id, userId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, oldIds.length);
    assert.equal(before.reviews.length, 2 * oldIds.length);
    await zam.installKvtTile(db, cell);
    const installed = await snapshot(db);
    assert.deepEqual(
      installed.cards,
      before.cards,
      "installing the public cell invents no enrolment or mastery",
    );
    assert.deepEqual(installed.reviews, before.reviews, "every review stays");
    assert.deepEqual(installed.replacements, [], "no transfer is declared");
    for (const token of before.tokens)
      assert.deepEqual(
        installed.tokens.find((candidate) => candidate.id === token.id),
        token,
        "no old token is touched",
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
    assert.equal(
      queue.items.length,
      oldIds.length,
      "every old card remains active",
    );
    const atoms = cell.atoms.map((atom) => atom.id);
    assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
      cardsCreated: itemCount,
      cardsReused: 0,
    });
    const complete = await snapshot(db);
    assert.equal(complete.cards.length, oldIds.length + itemCount);
    assert.deepEqual(complete.reviews, before.reviews);
    for (const card of before.cards)
      assert.deepEqual(
        complete.cards.find((candidate) => candidate.id === card.id),
        card,
      );
    for (const card of complete.cards.filter(
      (candidate) => !oldIds.includes(candidate.token_id),
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
      await snapshot(db),
      complete,
      "repeated install and enrolment change nothing",
    );
    console.log(
      `ok   Mathematik 13 public cell: ${oldIds.length} old cards active, all FSRS fields and ${before.reviews.length} reviews unchanged; ${itemCount} fresh unlearned cards; repeat install/enrolment idempotent`,
    );
    await rehearseProposal();
  } finally {
    await db.close();
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

/** The proposed A transfers are exercised without touching the cell or its approval. */
async function rehearseProposal() {
  const moved = mapping.rows.filter((row) => row.category !== "C");
  const retired = new Set(
    mapping.rows
      .filter((row) => row.action === "propose-retire-after-approval")
      .map((row) => row.de_by_id),
  );
  const proposed = structuredClone(cell);
  proposed.version = "2026.11.2";
  if (retired.size > 0)
    proposed.retired_items = mapping.rows
      .filter((row) => row.action === "propose-retire-after-approval")
      .map((row) => ({ id: row.de_by_id, reason: row.reason }));
  const expected = new Map();
  for (const row of moved) {
    const successor = bySlug.get(row.academy_slug);
    assert.ok(successor, `missing proposed successor ${row.academy_slug}`);
    successor.replaces = [row.de_by_id];
    proposed.atoms
      .flatMap((atom) => atom.practice_items)
      .find((item) => item.slug === row.academy_slug).replaces = [row.de_by_id];
    expected.set(row.de_by_id, successor.id);
  }
  assert.equal(
    new Set(expected.values()).size,
    moved.length,
    "one history per successor",
  );

  const trial = await zam.openDatabase({
    dbPath: join(dir, "proposal.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(trial, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries())
      await reviewedCard(trial, id, userId, index);
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
          "the history moves to its one successor",
        );
      }
    for (const id of oldIds) {
      const token = await zam.getTokenById(trial, id);
      assert.ok(token, "an old token is never deleted");
      assert.equal(
        Boolean(token.deprecated_at),
        expected.has(id) || retired.has(id),
        "only transferred or retired items leave active use",
      );
    }
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [
        old_item_id,
        new_item_id,
      ]),
      [...expected.entries()].sort(([a], [b]) => a.localeCompare(b)),
      "only the proposed transfers are declared",
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
      oldIds.length - moved.length - retired.size,
      "transferred and retired ids leave active reviews",
    );
    await zam.installKvtTile(trial, proposed);
    assertRepeatedProposal(after, await snapshot(trial));
    const atoms = proposed.atoms.map((atom) => atom.id);
    for (let round = 0; round < 6; round++) {
      const result = await zam.materialiseKvtCards(trial, userId, atoms);
      if (result.cardsCreated === 0) break;
    }
    const complete = await snapshot(trial);
    assert.equal(
      complete.cards.length,
      itemCount + oldIds.length - moved.length,
      "every card once, the moved histories included",
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
      `ok   proposal rehearsal only: ${moved.length} histories move unchanged (${mapping.rows.filter((r) => r.category === "A").length} A, ${mapping.rows.filter((r) => r.category === "B").length} B), ${retired.size} retired; ${oldIds.length - moved.length - retired.size} C cards stay active; repeated state stable`,
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
    const userId = cell.atoms[1].id;
    const row = moved[0];
    await reviewedCard(collision, row.de_by_id, userId, 1);
    await reviewedCard(collision, expected.get(row.de_by_id), userId, 3);
    const before = await snapshot(collision);
    await assert.rejects(
      () => zam.installKvtTile(collision, proposed),
      /holds a card on both|merge/i,
    );
    assert.deepEqual(
      await snapshot(collision),
      before,
      "a collision must leave both histories intact",
    );
    console.log(
      "ok   proposal collision: a learner holding both cards refuses the automatic merge and remains unchanged",
    );
  } finally {
    await collision.close();
  }
}
