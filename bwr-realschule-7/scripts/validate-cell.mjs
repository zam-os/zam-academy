// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(
  readFileSync(new URL("../cell.json", import.meta.url), "utf8"),
);
const dir = mkdtempSync(join(tmpdir(), "zam-bwr-rs7-"));
let db;
try {
  db = await zam.openDatabase({
    dbPath: join(dir, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  await zam.installKvtTile(db, tile);
  assert.equal(
    (await db.prepare("SELECT id FROM cards").all()).length,
    0,
    "installation must not enrol",
  );
  const user = tile.atoms[0].id;
  const items = tile.atoms.flatMap((a) => a.practice_items);
  assert.equal(items.length, 72);
  for (const item of items) {
    const card = await zam.ensureCard(db, item.id, user);
    assert.equal(card.reps, 0);
    assert.equal(card.stability, 0);
    assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
  }
  const first = await zam.ensureCard(db, items[0].id, user);
  await zam.evaluateRating(db, {
    cardId: first.id,
    tokenId: items[0].id,
    userId: user,
    rating: 3,
    answerFormat: "recall",
    now: new Date("2026-11-21T15:00:00Z"),
  });
  const snapshot = async () => ({
    cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
    reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
  });
  const before = await snapshot();
  assert.equal(before.cards.length, 72);
  assert.equal(before.reviews.length, 1);
  for (let repeat = 0; repeat < 2; repeat++) {
    await zam.installKvtTile(db, tile);
    for (const item of items) await zam.ensureCard(db, item.id, user);
    assert.deepEqual(await snapshot(), before);
  }
  // Approved mapping transfers 4 A-row histories to their Academy successors
  // and keeps the 6 C-row legacy cards intact.
  const mapping = JSON.parse(
    readFileSync(new URL("../replaces-de-by.json", import.meta.url), "utf8"),
  );
  const oldItems = [];
  for (const source of mapping.sources) {
    const old = JSON.parse(
      readFileSync(new URL(`../${source.file}`, import.meta.url), "utf8"),
    );
    await zam.installKvtTile(db, old);
    for (const atom of old.atoms) {
      for (const item of atom.practice_items) {
        oldItems.push(item);
      }
    }
  }
  assert.equal(oldItems.length, 10);
  const dir2 = mkdtempSync(join(tmpdir(), "zam-bwr-rs7-migrate-"));
  const db2 = await zam.openDatabase({
    dbPath: join(dir2, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const source of mapping.sources) {
      const old = JSON.parse(
        readFileSync(new URL(`../${source.file}`, import.meta.url), "utf8"),
      );
      await zam.installKvtTile(db2, old);
    }
    for (const item of oldItems) {
      const card = await zam.ensureCard(db2, item.id, user);
      await zam.evaluateRating(db2, {
        cardId: card.id,
        tokenId: item.id,
        userId: user,
        rating: 3,
        answerFormat: "recall",
        now: new Date("2026-11-21T15:00:00Z"),
      });
    }
    await zam.installKvtTile(db2, tile);
    for (const item of items) await zam.ensureCard(db2, item.id, user);
    const allCards = await db2.prepare("SELECT token_id, reps FROM cards").all();
    assert.equal(allCards.length, 72 + 6, "4 A cards transferred, 6 C cards kept");
    assert.equal(allCards.filter((c) => c.reps > 0).length, 10, "all 10 histories preserved");
  } finally {
    await db2.close();
    rmSync(dir2, { recursive: true, force: true });
  }
  console.log(
    "ok: install creates no cards; 72 fresh cards enrol; repeated install/enrol preserves recall; 4 approved A-rows transfer history and 6 C-rows stay intact.",
  );
} finally {
  if (db) await db.close();
  rmSync(dir, { recursive: true, force: true });
}
