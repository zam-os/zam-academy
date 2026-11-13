// Uses disposable libraries only. Installs the new Mathematik 7 cell alongside
// both legacy de-by:gymnasium-7-mathematik-* cells to prove zero interference
// while the mapping stays proposal-only (no replaces, no retired_items).
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

assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.ok(!("retired_items" in tile));
assert.ok(
  tile.atoms.every((atom) =>
    atom.practice_items.every((item) => !("replaces" in item)),
  ),
);

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

const bySlug = new Map(
  tile.atoms.flatMap((atom) => atom.practice_items.map((item) => [item.slug, item])),
);
for (const row of mapping.rows) {
  const entry = oldById.get(row.de_by_id);
  assert.equal(row.de_by_cell, entry.tileId);
  assert.equal(row.de_by_question, zam.kvtItemPlainTexts(entry.item).question);
  assert.ok(typeof row.reason === "string" && row.reason.trim().length > 10, `missing reason for ${row.de_by_id}`);
  if (row.category === "C") {
    assert.equal(row.academy_slug, null);
    assert.ok(
      row.action === "keep-active" || row.action === "propose-retire-after-approval",
      `unexpected C action for ${row.de_by_id}: ${row.action}`,
    );
  } else {
    assert.ok(row.category === "A" || row.category === "B");
    assert.equal(row.action, "propose-replace-after-approval");
    assert.ok(bySlug.has(row.academy_slug), `missing proposed slug: ${row.academy_slug}`);
  }
}

const dir = mkdtempSync(join(tmpdir(), "zam-mathe-gy7-"));
const user = tile.atoms[0].id;
let db;
try {
  db = await zam.openDatabase({
    dbPath: join(dir, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  for (const legacy of legacyTiles) await zam.installKvtTile(db, legacy);
  for (const id of oldById.keys()) await zam.ensureCard(db, id, user);
  const legacyCardsBefore = await db.prepare("SELECT * FROM cards ORDER BY id").all();
  assert.equal(legacyCardsBefore.length, oldById.size);

  await zam.installKvtTile(db, tile);
  const cardsWithNew = await db.prepare("SELECT * FROM cards ORDER BY id").all();
  assert.deepEqual(cardsWithNew, legacyCardsBefore, "installing M7 without replaces leaves old cards untouched");

  const ids = tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id));
  for (const id of ids) await zam.ensureCard(db, id, user);
  const allBefore = await db.prepare("SELECT * FROM cards ORDER BY id").all();
  assert.equal(allBefore.length, oldById.size + ids.length);

  await zam.installKvtTile(db, tile);
  const allAfter = await db.prepare("SELECT * FROM cards ORDER BY id").all();
  assert.deepEqual(allAfter, allBefore);

  for (const item of tile.atoms.flatMap((atom) => atom.practice_items)) {
    const token = await zam.getTokenById(db, item.id);
    assert.equal(token.source_link, item.source_link);
  }
  console.log(
    `ok: ${tile.atoms.length} atoms / ${ids.length} cards installed alongside ${oldById.size} untouched legacy cards.`,
  );
} finally {
  if (db) await db.close();
  rmSync(dir, { recursive: true, force: true });
}
