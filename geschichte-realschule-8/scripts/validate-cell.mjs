import { createHash } from "node:crypto";
// Only disposable databases; never use a configured or personal library.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (file) => JSON.parse(readFileSync(join(root, file), "utf8"));
const tile = read("cell.json"),
  old = read("tests/fixtures/de-by-geschichte-8.json");
const mapping = read("replaces-de-by.json");
assert.equal(mapping.approved, null);
assert.equal(
  mapping.sources[0].sha256,
  createHash("sha256")
    .update(readFileSync(join(root, mapping.sources[0].file)))
    .digest("hex"),
);
assert.deepEqual(
  new Set(mapping.rows.map((r) => r.de_by_id)),
  new Set(old.atoms.flatMap((a) => a.practice_items.map((i) => i.id))),
);
const dir = mkdtempSync(join(tmpdir(), "zam-geschichte8-"));
const user = tile.atoms[0].id;
let db;
const snapshot = async () => ({
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
try {
  db = await zam.openDatabase({
    dbPath: join(dir, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  await zam.installKvtTile(db, old);
  const oldIds = old.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
  for (const id of oldIds) {
    const card = await zam.ensureCard(db, id, user);
    for (const day of [26, 27])
      await zam.evaluateRating(db, {
        cardId: card.id,
        tokenId: id,
        userId: user,
        rating: 3,
        answerFormat: "recall",
        now: new Date(Date.UTC(2026, 9, day)),
      });
  }
  const before = await snapshot();
  assert.equal(before.cards.length, 8);
  assert.equal(before.reviews.length, 16);
  for (let repeat = 0; repeat < 2; repeat++) {
    await zam.installKvtTile(db, tile);
    assert.deepEqual(
      await snapshot(),
      before,
      "install must preserve history and not enrol",
    );
  }
  const newItems = tile.atoms.flatMap((a) => a.practice_items);
  for (const item of newItems) await zam.ensureCard(db, item.id, user);
  const enrolled = await snapshot();
  assert.equal(enrolled.cards.length, 84);
  assert.deepEqual(enrolled.reviews, before.reviews);
  for (const card of before.cards)
    assert.deepEqual(
      enrolled.cards.find((c) => c.id === card.id),
      card,
    );
  for (const card of enrolled.cards.filter(
    (c) => !oldIds.includes(c.token_id),
  )) {
    assert.equal(card.reps, 0);
    assert.equal(card.stability, 0);
  }
  await zam.installKvtTile(db, tile);
  for (const item of newItems) {
    await zam.ensureCard(db, item.id, user);
    const token = await zam.getTokenById(db, item.id);
    assert.equal(token.source_link, item.source_link);
  }
  assert.deepEqual(
    await snapshot(),
    enrolled,
    "repeat install and enrol must be idempotent",
  );
  console.log(
    "ok: 76 new cards; eight legacy cards and 16 reviews unchanged; installation and enrollment are idempotent.",
  );
} finally {
  if (db) await db.close();
  rmSync(dir, { recursive: true, force: true });
}
