// Uses disposable libraries only. Installs both legacy de-by:gymnasium-7-mathematik-*
// cells, creates reviewed cards, installs Mathematik 7 with Thomas's approved
// mapping (2026-11-14: 4 A replaces, 0 B, 8 C kept active), and verifies
// FSRS/review preservation, C-card retention, idempotency, and collision refusal.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
  readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);

assert.equal(mapping.approved, "2026-11-14");
assert.equal(mapping.status, "approved");
assert.ok(!("retired_items" in tile));

const legacyTiles = [];
const oldById = new Map();
for (const src of mapping.sources) {
  const bytes = readFileSync(join(root, src.file));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), src.sha256);
  const legacy = JSON.parse(bytes.toString("utf8"));
  assert.equal(src.tile_id, legacy.tile_id);
  legacyTiles.push(legacy);
  for (const atom of legacy.atoms) {
    for (const item of atom.practice_items) oldById.set(item.id, { item, tileId: legacy.tile_id });
  }
}

assert.equal(mapping.rows.length, oldById.size);
assert.deepEqual(
  new Set(mapping.rows.map((r) => r.de_by_id)),
  new Set(oldById.keys()),
);

const items = tile.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const expectedTransfers = new Map();
for (const row of mapping.rows) {
  const entry = oldById.get(row.de_by_id);
  assert.equal(row.de_by_cell, entry.tileId);
  assert.equal(row.de_by_question, zam.kvtItemPlainTexts(entry.item).question);
  assert.ok(typeof row.reason === "string" && row.reason.trim().length > 10, `missing reason for ${row.de_by_id}`);
  if (row.category === "C") {
    assert.equal(row.academy_slug, null);
    assert.equal(row.action, "keep-active", `unexpected C action for ${row.de_by_id}: ${row.action}`);
  } else {
    assert.equal(row.category, "A");
    assert.equal(row.action, "replace");
    const successor = bySlug.get(row.academy_slug);
    assert.ok(successor, `missing approved successor slug: ${row.academy_slug}`);
    assert.deepEqual(successor.replaces, [row.de_by_id], row.academy_slug);
    expectedTransfers.set(row.de_by_id, successor.id);
  }
}
assert.deepEqual(
  items.filter((item) => item.replaces?.length).map((item) => item.id).sort(),
  [...expectedTransfers.values()].sort(),
  "replaces must match approved A rows",
);

const dir = mkdtempSync(join(tmpdir(), "zam-mathe-gy7-"));
const user = tile.atoms[0].id;
const open = (name) =>
  zam.openDatabase({
    dbPath: join(dir, name),
    initialize: true,
    useConfiguredCloud: false,
  });
const snapshot = async (database) => ({
  tokens: await database.prepare("SELECT * FROM tokens ORDER BY id").all(),
  replacements: await database
    .prepare("SELECT * FROM practice_item_replacements ORDER BY old_item_id, new_item_id")
    .all(),
  cards: await database.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await database.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const withoutToken = ({ token_id, ...fields }) => fields;
const reviewed = async (database, tokenId, rating, day) => {
  const card = await zam.ensureCard(database, tokenId, user);
  await zam.evaluateRating(database, {
    cardId: card.id,
    tokenId,
    userId: user,
    rating,
    answerFormat: "recall",
    responseTimeMs: 2400,
    now: new Date(Date.UTC(2026, 10, day)),
  });
};

try {
  // 1. Transfer approved A rows while keeping C rows active and adding remaining fresh cards.
  const db = await open("migration.db");
  try {
    for (const legacy of legacyTiles) await zam.installKvtTile(db, legacy);
    const oldIds = [...oldById.keys()];
    for (const [index, id] of oldIds.entries()) {
      await reviewed(db, id, index % 3 === 0 ? 1 : 3, 1);
      await reviewed(db, id, index % 2 === 0 ? 3 : 4, 11);
    }
    const before = await snapshot(db);
    assert.equal(before.cards.length, oldIds.length);
    assert.equal(before.reviews.length, 2 * oldIds.length);

    await zam.installKvtTile(db, tile);
    const after = await snapshot(db);
    assert.equal(after.cards.length, before.cards.length);
    assert.equal(after.reviews.length, before.reviews.length);
    for (const table of ["cards", "reviews"]) {
      for (const old of before[table]) {
        const fresh = after[table].find((row) => row.id === old.id);
        assert.ok(fresh);
        assert.deepEqual(withoutToken(fresh), withoutToken(old), `${table}: evidence preserved`);
        assert.equal(fresh.token_id, expectedTransfers.get(old.token_id) ?? old.token_id);
      }
    }
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [old_item_id, new_item_id]),
      [...expectedTransfers.entries()].sort(([a], [b]) => a.localeCompare(b)),
    );

    await zam.installKvtTile(db, tile);
    assert.deepEqual(await snapshot(db), after, "repeated install changes nothing");

    for (const item of items) await zam.ensureCard(db, item.id, user);
    const enrolled = await snapshot(db);
    assert.equal(enrolled.cards.length, items.length + 8);
    assert.deepEqual(enrolled.reviews, after.reviews);
    for (const old of after.cards) {
      assert.deepEqual(enrolled.cards.find((card) => card.id === old.id), old);
    }
    for (const fresh of enrolled.cards.filter((card) => !after.cards.some((old) => old.id === card.id))) {
      assert.equal(fresh.reps, 0);
      assert.equal(fresh.stability, 0);
    }

    await zam.installKvtTile(db, tile);
    for (const item of items) await zam.ensureCard(db, item.id, user);
    assert.deepEqual(await snapshot(db), enrolled, "repeated install/enrolment is idempotent");

    for (const item of items) {
      const token = await zam.getTokenById(db, item.id);
      assert.equal(token.source_link, item.source_link);
    }
  } finally {
    await db.close();
  }

  // 2. Refuse and roll back if a learner holds cards on both old and successor IDs.
  const withoutReplaces = structuredClone(tile);
  for (const item of withoutReplaces.atoms.flatMap((atom) => atom.practice_items)) {
    delete item.replaces;
  }
  for (const [oldId, newId] of expectedTransfers.entries()) {
    const cdb = await open(`collision-${oldId}.db`);
    try {
      for (const legacy of legacyTiles) await zam.installKvtTile(cdb, legacy);
      await zam.installKvtTile(cdb, withoutReplaces);
      await reviewed(cdb, oldId, 1, 10);
      await reviewed(cdb, newId, 3, 10);
      const before = await snapshot(cdb);
      await assert.rejects(
        () => zam.installKvtTile(cdb, tile),
        (err) => err.message.includes(oldId) && err.message.includes(newId) && err.message.includes(user),
      );
      assert.deepEqual(await snapshot(cdb), before, `collision rolled back for ${oldId}`);
    } finally {
      await cdb.close();
    }
  }

  console.log(
    `ok: ${tile.atoms.length} atoms / ${items.length} cards (${tile.version}); 4 A histories transferred, 8 C active, 128 fresh cards, collision refused.`,
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
