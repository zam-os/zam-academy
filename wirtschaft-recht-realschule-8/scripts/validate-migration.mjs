#!/usr/bin/env node
// Exercise the approved mapping with the CI-pinned zam-core in disposable libraries.
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
const bySlug = new Map(items.map((item) => [item.slug, item.id]));
const replaced = new Map(
  mapping.rows.filter((row) => row.action === "replace").map((row) => [
    row.de_by_id, bySlug.get(row.academy_slug),
  ]),
);
const retired = mapping.rows.filter((row) => row.action === "retire").map((row) => row.de_by_id);
const kept = mapping.rows.filter((row) => row.action === "keep-active").map((row) => row.de_by_id);
const originalIds = mapping.rows.map((row) => row.de_by_id);
const userId = cell.atoms[0].id;
const dir = mkdtempSync(join(tmpdir(), "zam-wr8-migration-"));

const draft = structuredClone(cell);
draft.version = "2026.11.1";
delete draft.retired_items;
for (const atom of draft.atoms)
  for (const item of atom.practice_items) delete item.replaces;

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
  assert.equal(originalIds.length, 8);
  assert.equal(replaced.size, 3);
  assert.equal(retired.length, 3);
  assert.equal(kept.length, 2);
  assert.equal(new Set(replaced.values()).size, 3);
  assert.ok([...replaced.values()].every(Boolean));

  await inLibrary("legacy.db", async (db) => {
    for (const tile of legacy) await zam.installKvtTile(db, tile);
    for (const [index, tokenId] of originalIds.entries()) await review(db, tokenId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, 8);
    assert.equal(before.reviews.length, 16);
    assert.deepEqual(await dueTokens(db, originalIds, before.cards), [...originalIds].sort());

    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    const move = (row) => ({ ...row, token_id: replaced.get(row.token_id) ?? row.token_id });
    assert.deepEqual(after.cards, before.cards.map(move), "card IDs and FSRS state must survive");
    assert.deepEqual(after.reviews, before.reviews.map(move), "review IDs and evidence must survive");

    for (const tokenId of [...replaced.keys(), ...retired]) {
      const token = await zam.getTokenById(db, tokenId);
      assert.ok(token?.deprecated_at, `${tokenId} must leave active reviews and remain in storage`);
      if (retired.includes(tokenId)) assert.equal(token.editorial_state, "deprecated");
    }
    const expectedDue = [...kept, ...replaced.values()].sort();
    const candidates = [...originalIds, ...replaced.values()];
    assert.deepEqual(await dueTokens(db, candidates, after.cards), expectedDue);

    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "a repeated install must preserve all history");
    assert.deepEqual(await dueTokens(db, candidates, after.cards), expectedDue);
    console.log("ok   WR 8: 3 histories transfer, 3 cards retire, 2 stay active and all 16 reviews survive");
  });

  await inLibrary("collision.db", async (db) => {
    for (const tile of legacy) await zam.installKvtTile(db, tile);
    await zam.installKvtTile(db, draft);
    const [oldId, successorId] = replaced.entries().next().value;
    await review(db, oldId, 1);
    await review(db, successorId, 3);
    const before = await snapshot(db);
    await assert.rejects(() => zam.installKvtTile(db, cell), /holds a card on both|merge/i);
    assert.deepEqual(await snapshot(db), before, "a collision must preserve both histories");
    assert.equal((await zam.getTokenById(db, oldId)).deprecated_at, null);
    console.log("ok   WR 8: a collision refuses the automatic merge and leaves both histories intact");
  });

  await inLibrary("without-legacy.db", async (db) => {
    await zam.installKvtTile(db, draft);
    await zam.materialiseKvtCards(db, userId, cell.atoms.map((atom) => atom.id));
    await review(db, replaced.values().next().value, 2);
    const before = await snapshot(db);
    assert.equal(before.cards.length, 117);
    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), before, "learners who never held legacy cards retain their progress");
    console.log("ok   WR 8: updating the draft without the old tile preserves all 117 cards and reviews");
  });
} finally {
  rmSync(dir, { recursive: true, force: true });
}
