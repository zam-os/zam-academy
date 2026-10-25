#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const cell = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(readFileSync(join(root, "replaces-de-by.json"), "utf8"));
const legacy = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/, "the cell declares an approved mapping");
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const itemCount = items.length;
const bySlug = new Map(items.map((item) => [item.slug, item]));
const oldIds = legacy.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
assert.deepEqual([...oldIds].sort(), mapping.rows.map((row) => row.de_by_id).sort());
const moved = new Map(
  mapping.rows
    .filter((row) => row.category !== "C")
    .map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
);
const retired = mapping.rows.filter((row) => row.category === "C").map((row) => row.de_by_id);
// The cell declares exactly the approved rows, nothing more.
assert.deepEqual(
  items.flatMap((item) => (item.replaces ?? []).map((id) => [id, item.id])).sort(),
  [...moved.entries()].sort(),
);
assert.deepEqual(cell.retired_items.map((entry) => entry.id).sort(), [...retired].sort());
// The first public version, 2026.10.1, declared no history change.
const previous = structuredClone(cell);
previous.version = "2026.10.1";
delete previous.retired_items;
for (const item of previous.atoms.flatMap((atom) => atom.practice_items)) delete item.replaces;

const dir = mkdtempSync(join(tmpdir(), "zam-geschichte10-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;
const open = (name) =>
  zam.openDatabase({ dbPath: join(dir, name), initialize: true, useConfiguredCloud: false });

async function reviewedCard(db, tokenId, userId, index) {
  const card = await zam.ensureCard(db, tokenId, userId);
  const now = new Date(Date.UTC(2026, 8, 1));
  await zam.evaluateRating(db, {
    cardId: card.id,
    tokenId,
    userId,
    rating: index % 3 === 0 ? 1 : 3,
    answerFormat: "recall",
    responseTimeMs: 1000 + index * 300,
    now,
  });
  await zam.evaluateRating(db, {
    cardId: card.id,
    tokenId,
    userId,
    rating: index % 2 === 0 ? 3 : 4,
    answerFormat: "recall",
    responseTimeMs: 1600 + index * 200,
    now: new Date(now.getTime() + (index + 1) * 86_400_000),
  });
}

async function snapshot(db) {
  return {
    cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
    reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
  };
}

try {
  // 1. A learner with the four old cards installs the approved cell.
  const db = await open("history.db");
  try {
    for (const tile of legacy) await zam.installKvtTile(db, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries()) await reviewedCard(db, id, userId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, oldIds.length);
    assert.equal(before.reviews.length, 2 * oldIds.length);
    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.equal(after.cards.length, before.cards.length, "installing must not enrol fresh cards");
    assert.equal(after.reviews.length, before.reviews.length);
    for (const table of ["cards", "reviews"])
      for (const old of before[table]) {
        const fresh = after[table].find((row) => row.id === old.id);
        assert.deepEqual(withoutToken(fresh), withoutToken(old), `${table}: evidence preserved`);
        assert.equal(fresh.token_id, moved.get(old.token_id) ?? old.token_id);
      }
    for (const id of oldIds) {
      const token = await zam.getTokenById(db, id);
      assert.ok(token, "an old token must never be deleted");
      assert.ok(token.deprecated_at, "superseded and retired old items leave active use");
    }
    const queue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: retired,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(queue.items.length, 0, "retired old questions never return to active reviews");
    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "a repeated install changes no schedule or review");
    const atoms = cell.atoms.map((atom) => atom.id);
    for (let round = 0; round < 5; round++)
      if ((await zam.materialiseKvtCards(db, userId, atoms)).cardsCreated === 0) break;
    const complete = await snapshot(db);
    assert.equal(complete.cards.length, itemCount + retired.length, "moved histories are reused");
    assert.deepEqual(complete.reviews, after.reviews);
    for (const old of after.cards)
      assert.deepEqual(complete.cards.find((card) => card.id === old.id), old);
    console.log(
      `ok   Geschichte 10: ${moved.size} complete histories moved, ${retired.length} histories kept and retired from active review, ${before.reviews.length} review events preserved; repeated install and enrolment idempotent`,
    );
  } finally {
    await db.close();
  }

  // 2. A learner who enrolled 2026.10.1 without the old cell upgrades: nothing changes.
  const upgrade = await open("upgrade.db");
  try {
    await zam.installKvtTile(upgrade, previous);
    const userId = cell.atoms[1].id;
    const atoms = cell.atoms.map((atom) => atom.id);
    assert.deepEqual(await zam.materialiseKvtCards(upgrade, userId, atoms), {
      cardsCreated: itemCount,
      cardsReused: 0,
    });
    for (const [index, item] of items.slice(0, 6).entries())
      await reviewedCard(upgrade, item.id, userId, index);
    const before = await snapshot(upgrade);
    await zam.installKvtTile(upgrade, cell);
    assert.deepEqual(await snapshot(upgrade), before, "the upgrade leaves every card and review");
    console.log("ok   Geschichte 10: upgrade from 2026.10.1 without the old cell changes no card or review");
  } finally {
    await upgrade.close();
  }

  // 3. A learner holding cards on an old id and on its successor: zam-core refuses to merge.
  const collision = await open("collision.db");
  try {
    for (const tile of legacy) await zam.installKvtTile(collision, tile);
    await zam.installKvtTile(collision, previous);
    const [oldId, newId] = [...moved.entries()][0];
    const userId = cell.atoms[2].id;
    await reviewedCard(collision, oldId, userId, 1);
    await reviewedCard(collision, newId, userId, 3);
    const before = await snapshot(collision);
    await assert.rejects(() => zam.installKvtTile(collision, cell), /holds a card on both|merge/i);
    assert.deepEqual(await snapshot(collision), before, "a collision leaves both histories intact");
    console.log("ok   Geschichte 10: two existing histories refuse an automatic merge and remain unchanged");
  } finally {
    await collision.close();
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
