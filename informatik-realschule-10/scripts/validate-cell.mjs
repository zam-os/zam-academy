// Uses disposable libraries only. Existing Academy cards and reviews must not
// change when this additional (not replacing) cell is installed or enrolled.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const siblings = ["algorithmen", "datennetze", "sql", "uml"].map((app) =>
  JSON.parse(readFileSync(join(root, "..", app, "cell.json"), "utf8")),
);
const dir = mkdtempSync(join(tmpdir(), "zam-informatik10-"));
const user = tile.atoms[0].id;
const snapshot = async (db) => ({
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
let db;
try {
  db = await zam.openDatabase({
    dbPath: join(dir, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  for (const sibling of siblings) {
    await zam.installKvtTile(db, sibling);
    const tokenId = sibling.atoms[0].practice_items[0].id;
    const card = await zam.ensureCard(db, tokenId, user);
    for (const day of [0, 1])
      await zam.evaluateRating(db, {
        cardId: card.id,
        tokenId,
        userId: user,
        rating: 3,
        answerFormat: "recall",
        now: new Date(Date.UTC(2026, 9, 24 + day)),
      });
  }
  const before = await snapshot(db);
  assert.equal(before.cards.length, 4);
  assert.equal(before.reviews.length, 8);
  for (let attempt = 0; attempt < 2; attempt++) {
    await zam.installKvtTile(db, tile);
    assert.deepEqual(
      await snapshot(db),
      before,
      "installation must preserve existing cards and every review without enrolling new cards",
    );
  }
  const ids = tile.atoms.flatMap((atom) =>
    atom.practice_items.map((item) => item.id),
  );
  for (const id of ids) await zam.ensureCard(db, id, user);
  const enrolled = await snapshot(db);
  assert.equal(enrolled.cards.length, 76);
  assert.equal(enrolled.reviews.length, 8);
  for (const old of before.cards)
    assert.deepEqual(
      enrolled.cards.find((card) => card.id === old.id),
      old,
      "existing FSRS state must stay identical",
    );
  for (const card of enrolled.cards.filter((card) =>
    ids.includes(card.token_id),
  )) {
    assert.equal(card.reps, 0);
    assert.equal(card.stability, 0);
  }
  await zam.installKvtTile(db, tile);
  for (const id of ids) await zam.ensureCard(db, id, user);
  assert.deepEqual(
    await snapshot(db),
    enrolled,
    "repeated installation and card creation must be idempotent",
  );
  for (const item of tile.atoms.flatMap((atom) => atom.practice_items)) {
    const token = await zam.getTokenById(db, item.id);
    assert.equal(token.source_link, item.source_link);
  }
  console.log(
    "ok: 36 atoms / 72 new cards, four existing IT histories and eight reviews unchanged; installation and explicit card creation repeat safely.",
  );
} finally {
  if (db) await db.close();
  rmSync(dir, { recursive: true, force: true });
}
