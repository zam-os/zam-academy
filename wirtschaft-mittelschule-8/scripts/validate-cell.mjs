import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(new URL("../cell.json", import.meta.url), "utf8"));
const user = "local";
const dir = mkdtempSync(join(tmpdir(), "zam-wib-ms8-"));
let db;

try {
  db = await zam.openDatabase({
    dbPath: join(dir, "library.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  await zam.installKvtTile(db, tile);
  assert.equal((await db.prepare("SELECT count(*) AS n FROM cards").get()).n, 0);

  const items = tile.atoms.flatMap((a) => a.practice_items);
  assert.equal(items.length, 62);
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
    now: new Date("2026-11-28T08:00:00Z"),
  });
  const snapshot = async () => ({
    cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
    reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
  });
  const before = await snapshot();
  assert.equal(before.cards.length, 62);
  assert.equal(before.reviews.length, 1);
  for (let repeat = 0; repeat < 2; repeat++) {
    await zam.installKvtTile(db, tile);
    for (const item of items) await zam.ensureCard(db, item.id, user);
    assert.deepEqual(await snapshot(), before);
  }
  console.log(
    "ok: install creates no cards; 62 fresh cards enrol; repeated install/enrol preserves recall.",
  );
} finally {
  if (db) await db.close();
  rmSync(dir, { recursive: true, force: true });
}
