import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const cell = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");

assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
const legacyTiles = mapping.sources.map((source) => {
  const bytes = read(source.file);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  return JSON.parse(bytes);
});
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const approved = new Map(mapping.rows
  .filter((row) => row.action === "replace")
  .map((row) => [row.de_by_id, items.find((item) => item.slug === row.academy_slug).id]));
const oldItems = legacyTiles.flatMap((tile) => tile.atoms.flatMap((atom) => atom.practice_items));
assert.equal(approved.size, 2);
assert.equal(oldItems.length - approved.size, 6);
assert.deepEqual(mapping.rows.map((row) => row.de_by_id).sort(), oldItems.map((item) => item.id).sort());
assert.deepEqual(
  items.flatMap((item) => (item.replaces ?? []).map((id) => [id, item.id])).sort(),
  [...approved].sort(),
);
assert.deepEqual(cell.retired_items ?? [], []);

// Reconstruct the first published edition. Its only differences are the
// cell version and the two approved replacements in this update.
const previousCell = {
  ...cell,
  version: "2026.11.1",
  atoms: cell.atoms.map((atom) => ({
    ...atom,
    practice_items: atom.practice_items.map(({ replaces, ...item }) => item),
  })),
};

const directory = mkdtempSync(join(tmpdir(), "zam-geschichte-gymnasium-8-migration-"));
const legacyLearner = cell.atoms[0].id;
const academyLearner = cell.atoms[1].id;

async function withLibrary(name, check) {
  const db = await zam.openDatabase({
    dbPath: join(directory, `${name}.db`),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of legacyTiles) await zam.installKvtTile(db, tile);
    await check(db);
  } finally {
    await db.close();
  }
}

async function review(db, tokenId, userId) {
  const card = await zam.ensureCard(db, tokenId, userId);
  for (const [day, rating] of [[26, 2], [27, 3]]) {
    await zam.evaluateRating(db, {
      cardId: card.id,
      tokenId,
      userId,
      rating,
      answerFormat: "recall",
      responseTimeMs: 1500,
      now: new Date(Date.UTC(2026, 10, day, 12)),
    });
  }
}

const snapshot = async (db) => ({
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const rebind = (rows) => rows.map((row) => ({
  ...row,
  token_id: approved.get(row.token_id) ?? row.token_id,
}));

try {
  for (const priorVersion of [false, true]) {
    await withLibrary(priorVersion ? "upgrade" : "first-install", async (db) => {
      if (priorVersion) {
        await zam.installKvtTile(db, previousCell);
        for (const id of approved.values()) await review(db, id, academyLearner);
      }
      for (const { id } of oldItems) await review(db, id, legacyLearner);
      const before = await snapshot(db);
      assert.equal(before.cards.length, oldItems.length + (priorVersion ? approved.size : 0));
      assert.equal(before.reviews.length, 2 * before.cards.length);

      await zam.installKvtTile(db, cell);
      const after = await snapshot(db);
      assert.deepEqual(after.cards, rebind(before.cards), "card IDs and FSRS state must be preserved");
      assert.deepEqual(after.reviews, rebind(before.reviews), "every review event must be preserved");
      for (const { id } of oldItems) {
        const token = await zam.getTokenById(db, id);
        assert.ok(token, "legacy tokens must remain available for historical references");
        assert.equal(Boolean(token.deprecated_at), approved.has(id), id);
      }
      for (const id of approved.values()) {
        const token = await zam.getTokenById(db, id);
        assert.equal(Boolean(token.deprecated_at), false);
      }
      await zam.installKvtTile(db, cell);
      assert.deepEqual(await snapshot(db), after, "reinstallation must leave all histories intact");
    });
  }

  for (const [oldId, successor] of approved) {
    await withLibrary(`collision-${oldId}`, async (db) => {
      await zam.installKvtTile(db, previousCell);
      for (const id of approved.keys()) await review(db, id, legacyLearner);
      await review(db, successor, legacyLearner);
      const before = await snapshot(db);

      await assert.rejects(() => zam.installKvtTile(db, cell), /holds a card on both|merge/i);
      assert.deepEqual(await snapshot(db), before, "a conflict must preserve both histories");
      for (const id of approved.keys()) {
        const token = await zam.getTokenById(db, id);
        assert.equal(Boolean(token.deprecated_at), false, "a conflict must roll back legacy deactivation");
      }
    });
  }
  console.log("ok: 2 Grade 8 histories move on first install and upgrade, 6 C cards stay active, repeat installs preserve state and each collision rolls back");
} finally {
  rmSync(directory, { recursive: true, force: true });
}
