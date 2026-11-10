#!/usr/bin/env node
// Runs with the same published zam-core as CI. No command here opens a learner library.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertMappingApproved } from "../../scripts/mapping-approval.mjs";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const newItems = tile.atoms.flatMap((atom) => atom.practice_items);
assert.equal(mapping.approved, "2026-11-10");
assert.equal(mapping.status, "approved");
assertMappingApproved(fileURLToPath(new URL("..", import.meta.url)), tile, "biologie-gymnasium-11");
assert.equal(mapping.sources.length, 2);
assert.ok(!("retired_items" in tile));

const legacy = mapping.sources.map((source) => {
  const bytes = read(source.file);
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  const cell = JSON.parse(bytes);
  assert.equal(cell.tile_id, source.tile_id);
  assert.equal(cell.version, source.version);
  return cell;
});
const sorted = (ids) => [...ids].sort();
const oldIds = legacy.flatMap((cell) =>
  cell.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
assert.equal(oldIds.length, 8);
assert.deepEqual(sorted(mapping.rows.map((row) => row.de_by_id)), sorted(oldIds));
for (const row of mapping.rows) {
  const cell = legacy.find((entry) => entry.tile_id === row.de_by_cell);
  assert.ok(
    cell?.atoms.some((atom) => atom.practice_items.some((item) => item.id === row.de_by_id)),
  );
  assert.ok(row.reason.length > 25);
}

const [transfer] = mapping.rows.filter((row) => row.category === "A");
assert.deepEqual(
  mapping.rows.filter((row) => row.category !== "C"),
  [transfer],
);
assert.equal(transfer.action, "replace");
assert.ok(
  mapping.rows
    .filter((row) => row.category === "C")
    .every((row) => row.action === "keep-active" && row.academy_slug === null),
);
const oldId = transfer.de_by_id;
const kept = oldIds.filter((id) => id !== oldId);
const successor = newItems.find((item) => item.slug === transfer.academy_slug);
assert.ok(successor && successor.id !== oldId);
assert.deepEqual(
  newItems.filter((item) => item.replaces).map((item) => [item.slug, item.replaces]),
  [[transfer.academy_slug, [oldId]]],
);

// Recreate the previous draft in memory to test upgrades and conflicting histories.
const previous = structuredClone(tile);
previous.version = "2026.11.2";
delete previous.atoms
  .flatMap((atom) => atom.practice_items)
  .find((item) => item.id === successor.id).replaces;
const moved = (rows) =>
  rows.map((row) => ({
    ...row,
    token_id: row.token_id === oldId ? successor.id : row.token_id,
  }));

const userId = tile.atoms[0].id;
const snapshot = async (db) => ({
  tokens: await db.prepare("SELECT * FROM tokens ORDER BY id").all(),
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
  replacements: await db
    .prepare("SELECT * FROM practice_item_replacements ORDER BY old_item_id")
    .all(),
});
const activeQueue = async (db, tokenIds) => {
  const queue = await zam.buildReviewQueue(db, {
    userId,
    tokenIds,
    maxNew: tokenIds.length,
    maxReviews: tokenIds.length,
    now: new Date("2030-01-01T00:00:00Z"),
    buryNewSiblings: false,
    buryReviewSiblings: false,
  });
  return sorted(queue.items.map((item) => item.tokenId));
};
async function review(db, tokenId, rating) {
  const card = await zam.ensureCard(db, tokenId, userId);
  for (const day of [1, 2]) {
    await zam.evaluateRating(db, {
      cardId: card.id,
      tokenId,
      userId,
      rating,
      answerFormat: "recall",
      responseTimeMs: 2100 + day * 100,
      now: new Date(Date.UTC(2026, 10, day)),
    });
  }
}
async function seedLegacy(db) {
  for (const cell of legacy) await zam.installKvtTile(db, cell);
  for (const [i, id] of oldIds.entries()) await review(db, id, i % 2 ? 3 : 1);
  const before = await snapshot(db);
  assert.equal(before.cards.length, oldIds.length);
  assert.equal(before.reviews.length, oldIds.length * 2);
  return before;
}
const directory = mkdtempSync(join(tmpdir(), "zam-bio11-migration-"));
async function withLibrary(name, run) {
  const db = await zam.openDatabase({
    dbPath: join(directory, name + ".db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    await run(db);
  } finally {
    await db.close();
  }
}

try {
  await withLibrary("current", async (db) => {
    const before = await seedLegacy(db);
    await zam.installKvtTile(db, tile);
    const installed = await snapshot(db);
    assert.deepEqual(installed.cards, moved(before.cards));
    assert.deepEqual(installed.reviews, moved(before.reviews));
    assert.deepEqual(
      installed.replacements.map(({ old_item_id, new_item_id }) => [old_item_id, new_item_id]),
      [[oldId, successor.id]],
    );
    for (const id of oldIds)
      assert.equal(Boolean((await zam.getTokenById(db, id)).deprecated_at), id === oldId);
    assert.deepEqual(await activeQueue(db, [...oldIds, successor.id]), sorted([...kept, successor.id]));
    const enroll = async () => {
      for (const item of newItems) {
        await zam.ensureCard(db, item.id, userId);
        assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
      }
    };
    await enroll();
    const enrolled = await snapshot(db);
    assert.equal(enrolled.cards.length, kept.length + newItems.length);
    assert.deepEqual(enrolled.reviews, installed.reviews);
    assert.deepEqual(
      enrolled.cards.filter((card) => installed.cards.some((old) => old.id === card.id)),
      installed.cards,
    );
    for (const card of enrolled.cards.filter((card) => !installed.cards.some((old) => old.id === card.id))) {
      assert.equal(card.state, "new");
      assert.equal(card.stability, 0);
      assert.equal(card.reps, 0);
      assert.equal(card.last_review_at, null);
    }
    assert.deepEqual(
      await activeQueue(db, [...oldIds, ...newItems.map((item) => item.id)]),
      sorted([
        ...kept,
        ...newItems.filter((item) => item.tier === "tier1_fast").map((item) => item.id),
      ]),
    );
    await zam.installKvtTile(db, tile);
    await enroll();
    assert.deepEqual(await snapshot(db), enrolled);
    console.log(
      `ok: one approved history moved; all 8 card histories and 16 reviews preserved; ${newItems.length - 1} fresh cards enrolled; 7 C cards stay active; reinstall and enrolment are idempotent`,
    );
  });

  await withLibrary("upgrade", async (db) => {
    const before = await seedLegacy(db);
    await zam.installKvtTile(db, previous);
    await zam.installKvtTile(db, tile);
    const after = await snapshot(db);
    assert.deepEqual(after.cards, moved(before.cards));
    assert.deepEqual(after.reviews, moved(before.reviews));
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [old_item_id, new_item_id]),
      [[oldId, successor.id]],
    );
    assert.ok((await zam.getTokenById(db, oldId)).deprecated_at);
    assert.deepEqual(
      await activeQueue(db, [...oldIds, successor.id]),
      sorted([...kept, successor.id]),
    );
    await zam.installKvtTile(db, tile);
    assert.deepEqual(await snapshot(db), after);
    console.log(
      "ok: upgrading the previous draft moves one history unchanged, leaves the seven C cards active, and can be repeated",
    );
  });

  await withLibrary("collision", async (db) => {
    await seedLegacy(db);
    await zam.installKvtTile(db, previous);
    await review(db, successor.id, 3);
    const before = await snapshot(db);
    await assert.rejects(() => zam.installKvtTile(db, tile), /holds a card on both/);
    assert.deepEqual(await snapshot(db), before);
    console.log("ok: approved upgrade refuses an automatic merge of conflicting histories and rolls back");
  });
} finally {
  rmSync(directory, { recursive: true, force: true });
}
