#!/usr/bin/env node
// Approved cell: transfer the 7 A histories and retire the 1 faulty C card; keep 22 C cards active.
// Reads only snapshots and opens only disposable databases, never a learner library.
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
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const itemCount = items.length;
const rows = mapping.rows.filter(
  (row) => row.category === "A" || row.category === "B",
);
const retirements = mapping.rows.filter((row) => row.action === "retire");
const retired = new Set(retirements.map((row) => row.de_by_id));
assert.equal(rows.length, 7);
assert.equal(retired.size, 1);
assert.deepEqual(
  cell.retired_items,
  retirements.map((row) => ({ id: row.de_by_id, reason: row.reason })),
);
const expected = new Map();
for (const row of rows) {
  assert.equal(row.action, "replace");
  const successor = items.find((item) => item.slug === row.academy_slug);
  assert.ok(successor, `missing successor ${row.academy_slug}`);
  assert.deepEqual(successor.replaces, [row.de_by_id], row.academy_slug);
  expected.set(row.de_by_id, successor.id);
}
assert.deepEqual(
  items
    .filter((item) => item.replaces)
    .map((item) => item.id)
    .sort(),
  [...expected.values()].sort(),
  "no undocumented replaces",
);
for (const row of mapping.rows.filter((row) => row.category === "C")) {
  if (!retired.has(row.de_by_id)) assert.equal(row.action, "keep-active");
}
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
const dir = mkdtempSync(join(tmpdir(), "zam-mathe7-history-"));
const snapshot = async (database) => ({
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
function assertRepeatedInstall(before, after) {
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
try {
  const db = await zam.openDatabase({
    dbPath: join(dir, "history.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(db, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries())
      await reviewed(db, id, userId, index % 2 ? 3 : 1);
    const before = await snapshot(db);
    assert.equal(before.cards.length, 30);
    assert.equal(before.reviews.length, 30);
    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
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
      const token = await zam.getTokenById(db, id);
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
    );
    const queue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: oldIds,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(queue.items.length, oldIds.length - rows.length - retired.size);
    await zam.installKvtTile(db, cell);
    assertRepeatedInstall(after, await snapshot(db));
    const atoms = cell.atoms.map((atom) => atom.id);
    for (let round = 0; round < 5; round++) {
      const result = await zam.materialiseKvtCards(db, userId, atoms);
      if (result.cardsCreated === 0) break;
    }
    const complete = await snapshot(db);
    assert.equal(complete.cards.length, itemCount + oldIds.length - rows.length);
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
    assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
      cardsCreated: 0,
      cardsReused: itemCount,
    });
    assert.deepEqual(await snapshot(db), complete);
    console.log(
      `ok   Mathematik 7 approved cell ${cell.version}: ${rows.length} histories moved; ${retired.size} C card retired with history intact; ${oldIds.length - rows.length - retired.size} C cards active`,
    );
  } finally {
    await db.close();
  }

  const published = structuredClone(cell);
  published.version = "2026.10.1";
  delete published.retired_items;
  for (const item of published.atoms.flatMap((atom) => atom.practice_items))
    delete item.replaces;
  for (const [index, row] of rows.entries()) {
    const collision = await zam.openDatabase({
      dbPath: join(dir, `collision-${index}.db`),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      for (const tile of oldCells) await zam.installKvtTile(collision, tile);
      await zam.installKvtTile(collision, published);
      const userId = cell.atoms[0].id;
      await reviewed(collision, row.de_by_id, userId, 1);
      await reviewed(collision, expected.get(row.de_by_id), userId, 3);
      const before = await snapshot(collision);
      await assert.rejects(
        () => zam.installKvtTile(collision, cell),
        (error) => {
          assert.equal(
            error.message,
            `Cannot move ${row.de_by_id} to ${expected.get(row.de_by_id)}: ${userId} holds a card on both. That is a merge, and mastery is never merged automatically — resolve it explicitly and re-test.`,
          );
          return true;
        },
      );
      assert.deepEqual(await snapshot(collision), before);
    } finally {
      await collision.close();
    }
  }
  console.log(
    `ok   Mathematik 7 collision check for ${rows.length} approved rows: install refused and rolled back`,
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
