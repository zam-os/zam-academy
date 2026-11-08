#!/usr/bin/env node
// Approved mapping: the published cell moves the two A histories, keeps the ten
// C cards active and changes no other evidence. Uses disposable libraries only;
// no learner library or configuration is opened.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node mathematik-gymnasium-12/scripts/validate-migration.mjs
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
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(mapping.status, "approved");
assert.equal(cell.retired_items, undefined, "C cards stay active");
assert.deepEqual(
  cell.atoms
    .flatMap((atom) => atom.practice_items)
    .filter((item) => item.replaces)
    .map((item) => [item.slug, item.replaces])
    .sort(),
  mapping.rows
    .filter((row) => row.category === "A" || row.category === "B")
    .map((row) => [row.academy_slug, [row.de_by_id]])
    .sort(),
  "the cell declares exactly the approved A/B transfers",
);
const itemCount = cell.atoms.reduce(
  (n, atom) => n + atom.practice_items.length,
  0,
);
const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
  );
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

const dir = mkdtempSync(join(tmpdir(), "zam-mathe12-gym-history-"));
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
    assert.deepEqual({ ...fresh, updated_at: token.updated_at }, token);
    assert.ok(Date.parse(fresh.updated_at) >= Date.parse(token.updated_at));
  }
}

try {
  await validateTransfer();
} finally {
  await db.close();
  rmSync(dir, { recursive: true, force: true });
}

/** The published cell itself: approved histories move, everything else stays as it was. */
async function validateTransfer() {
  const rows = mapping.rows.filter(
    (row) => row.category === "A" || row.category === "B",
  );
  const proposed = cell;
  const retired = new Set();
  const items = proposed.atoms.flatMap((atom) => atom.practice_items);
  const expected = new Map();
  for (const row of rows) {
    const successor = items.find((item) => item.slug === row.academy_slug);
    assert.ok(successor, `missing successor ${row.academy_slug}`);
    assert.deepEqual(successor.replaces, [row.de_by_id]);
    expected.set(row.de_by_id, successor.id);
  }
  assert.equal(
    new Set(expected.values()).size,
    rows.length,
    "one history per successor",
  );
  // A pre-release without the declarations, for the collision case below.
  const prerelease = structuredClone(cell);
  prerelease.version = "2026.11.0";
  for (const atom of prerelease.atoms)
    for (const item of atom.practice_items) delete item.replaces;
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
    dbPath: join(dir, "transfer.db"),
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
      "exactly the approved A transfers, never a replacement for a C card",
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
      `ok   Mathematik 12 approved transfer: ${rows.length} histories moved with all FSRS fields and reviews; ${oldIds.length - rows.length} C cards active; ${itemCount} cards after enrolment, new ones unlearned; repeated install idempotent`,
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
    await zam.installKvtTile(collision, prerelease);
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
      "ok   collision after a pre-release: exact old/new/user error; tokens, replacement declarations and all evidence rolled back",
    );
  } finally {
    await collision.close();
  }
}
