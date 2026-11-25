// Run with the zam-core version pinned in CI. All libraries are disposable.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const cell = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldTiles = mapping.sources.map((source) => {
  const bytes = read(source.file);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  const tile = JSON.parse(bytes);
  assert.equal(tile.tile_id, source.tile_id);
  assert.equal(tile.version, source.version);
  return tile;
});
const oldIds = oldTiles.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
assert.deepEqual(mapping.rows.map((row) => row.de_by_id).sort(), [...oldIds].sort());
assert.deepEqual(cell.retired_items ?? [], []);

const approved = new Map();
for (const row of mapping.rows) {
  if (row.category === "C") {
    assert.equal(row.action, "keep-active");
    continue;
  }
  assert.equal(row.category, "A");
  assert.equal(row.action, "replace");
  const successors = items.filter((item) => item.slug === row.academy_slug);
  assert.equal(successors.length, 1);
  approved.set(row.de_by_id, successors[0].id);
}
assert.equal(approved.size, 2);
assert.deepEqual(
  items.flatMap((item) => (item.replaces ?? []).map((old) => [old, item.id])).sort(),
  [...approved].sort(),
);

const dir = mkdtempSync(join(tmpdir(), "zam-geo7-migration-"));
const userId = cell.atoms[0].id;
const open = (name) => zam.openDatabase({
  dbPath: join(dir, name),
  initialize: true,
  useConfiguredCloud: false,
});
const snapshot = async (db) => ({
  tokens: await db.prepare("SELECT * FROM tokens ORDER BY id").all(),
  replacements: await db.prepare("SELECT * FROM practice_item_replacements ORDER BY old_item_id").all(),
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const rebind = (rows) => rows.map((row) => ({
  ...row,
  token_id: approved.get(row.token_id) ?? row.token_id,
}));
async function review(db, tokenId, rating, day) {
  const card = await zam.ensureCard(db, tokenId, userId);
  await zam.evaluateRating(db, {
    cardId: card.id,
    tokenId,
    userId,
    rating,
    answerFormat: "recall",
    responseTimeMs: 2400,
    now: new Date(Date.UTC(2026, 10, day)),
  });
}

async function transferHistories() {
  const db = await open("histories.db");
  try {
    for (const tile of oldTiles) await zam.installKvtTile(db, tile);
    for (const [index, id] of oldIds.entries()) {
      await review(db, id, index % 3 === 0 ? 1 : 3, 1);
      await review(db, id, index % 2 === 0 ? 3 : 4, 11);
    }
    const before = await snapshot(db);
    assert.equal(before.cards.length, 12);
    assert.equal(before.reviews.length, 24);
    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.deepEqual(after.cards, rebind(before.cards));
    assert.deepEqual(after.reviews, rebind(before.reviews));
    assert.deepEqual(after.replacements.map(({ old_item_id, new_item_id }) =>
      [old_item_id, new_item_id]), [...approved].sort());
    for (const id of oldIds)
      assert.equal(Boolean((await zam.getTokenById(db, id)).deprecated_at), approved.has(id), id);
    const queue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: oldIds,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(queue.items.length, 10);
    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after);
  } finally {
    await db.close();
  }
}

async function rejectCollisions() {
  const proposal = {
    ...cell,
    version: "2026.11.1",
    atoms: cell.atoms.map((atom) => ({
      ...atom,
      practice_items: atom.practice_items.map(({ replaces, ...item }) => item),
    })),
  };
  for (const [oldId, newId] of approved) {
    const db = await open(`collision-${oldId}.db`);
    try {
      for (const tile of oldTiles) await zam.installKvtTile(db, tile);
      await zam.installKvtTile(db, proposal);
      await review(db, oldId, 1, 10);
      await review(db, newId, 3, 10);
      const before = await snapshot(db);
      await assert.rejects(() => zam.installKvtTile(db, cell), (error) => {
        assert.ok(error.message.includes(oldId));
        assert.ok(error.message.includes(newId));
        return true;
      });
      assert.deepEqual(await snapshot(db), before);
    } finally {
      await db.close();
    }
  }
}

try {
  await transferHistories();
  await rejectCollisions();
  console.log("ok: two approved histories moved, all 24 review rows and FSRS fields preserved, ten legacy cards stayed in review, reinstallation was idempotent, and both collisions rolled back.");
} finally {
  rmSync(dir, { recursive: true, force: true });
}
