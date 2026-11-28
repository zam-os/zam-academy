#!/usr/bin/env node
// Exercise the approved mapping with the CI-pinned zam-core in disposable libraries.
// The mapping retires one old card (J04) and keeps three active; no history moves,
// because no card of this cell declares `replaces`.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8").replaceAll("\r\n", "\n");
const cell = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const legacy = mapping.sources.map((source) => {
  const bytes = read(source.file);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  const tile = JSON.parse(bytes);
  assert.equal(tile.tile_id, source.tile_id);
  assert.equal(tile.version, source.version);
  return tile;
});
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const retired = mapping.rows.filter((row) => row.action === "retire").map((row) => row.de_by_id);
const kept = mapping.rows.filter((row) => row.action === "keep-active").map((row) => row.de_by_id);
const originalIds = mapping.rows.map((row) => row.de_by_id);
const userId = cell.atoms[0].id;
const dir = mkdtempSync(join(tmpdir(), "zam-wrg8-migration-"));

async function inLibrary(name, check) {
  const db = await zam.openDatabase({
    dbPath: join(dir, name),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    await check(db);
  } finally {
    await db.close();
  }
}

async function review(db, tokenId, index) {
  const { id: cardId } = await zam.ensureCard(db, tokenId, userId);
  const now = new Date();
  const base = { cardId, tokenId, userId, answerFormat: "recall" };
  await zam.evaluateRating(db, {
    ...base, rating: index % 3 === 0 ? 1 : 3, responseTimeMs: 1000 + index * 300, now,
  });
  await zam.evaluateRating(db, {
    ...base, rating: index % 2 === 0 ? 3 : 4, responseTimeMs: 1600 + index * 200,
    now: new Date(now.getTime() + (index + 1) * 86_400_000),
  });
}

async function snapshot(db) {
  return {
    cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
    reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
  };
}

async function dueTokens(db, tokenIds, cards) {
  const now = new Date(Math.max(...cards.map((card) => Date.parse(card.due_at))) + 86_400_000);
  const queue = await zam.buildReviewQueue(db, {
    userId, tokenIds, now, buryNewSiblings: false, buryReviewSiblings: false,
  });
  return queue.items.map((item) => item.tokenId).sort();
}

try {
  assert.equal(mapping.status, "approved");
  assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
  assert.equal(originalIds.length, 4);
  assert.deepEqual(retired, ["01K8G8S0000000000000000J04"]);
  assert.equal(kept.length, 3);
  assert.ok(items.every((item) => !("replaces" in item)), "no card of this cell may transfer a history");
  assert.deepEqual(cell.retired_items.map((item) => item.id), retired);

  await inLibrary("legacy.db", async (db) => {
    for (const tile of legacy) await zam.installKvtTile(db, tile);
    for (const [index, tokenId] of originalIds.entries()) await review(db, tokenId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, 4);
    assert.equal(before.reviews.length, 8);
    assert.deepEqual(await dueTokens(db, originalIds, before.cards), [...originalIds].sort());

    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.deepEqual(after.cards, before.cards, "old cards and their FSRS state must stay unchanged");
    assert.deepEqual(after.reviews, before.reviews, "old reviews must stay unchanged");

    for (const tokenId of retired) {
      const token = await zam.getTokenById(db, tokenId);
      assert.ok(token?.deprecated_at, `${tokenId} must leave active reviews and remain in storage`);
      assert.equal(token.editorial_state, "deprecated");
    }
    for (const tokenId of kept) {
      const token = await zam.getTokenById(db, tokenId);
      assert.equal(token?.deprecated_at, null, `${tokenId} must stay active`);
    }
    assert.deepEqual(await dueTokens(db, originalIds, after.cards), [...kept].sort());

    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "a repeated install must preserve all history");
    assert.deepEqual(await dueTokens(db, originalIds, after.cards), [...kept].sort());
    console.log("ok   WR 8 Gymnasium: 1 card retires, 3 stay active, all 8 reviews survive, reinstall is a no-op");
  });

  await inLibrary("without-legacy.db", async (db) => {
    await zam.installKvtTile(db, cell);
    await zam.materialiseKvtCards(db, userId, cell.atoms.map((atom) => atom.id));
    await review(db, items[0].id, 2);
    const before = await snapshot(db);
    assert.equal(before.cards.length, items.length);
    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), before, "learners without the old cell keep their progress");
    console.log(`ok   WR 8 Gymnasium: a learner without the old cell keeps all ${items.length} cards and reviews on reinstall`);
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
