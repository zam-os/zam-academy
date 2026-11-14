#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Checks the mapping Thomas approved on 2026-11-14 (replaces-de-by.json):
// 4 A histories move unchanged onto their successors, the retired composite
// (pflanzen J04) keeps its history but leaves active reviews, the 19 other C
// cards stay active and untouched, repeated installs change nothing, and a
// learner holding cards on both an old id and its successor makes the install
// refuse an automatic merge.
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
assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
const legacy = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const replaced = mapping.rows.filter((row) => row.action === "replace");
const retired = mapping.rows.filter((row) => row.action === "retire");
const kept = mapping.rows.filter((row) => row.action === "keep-active");
assert.equal(replaced.length, 4);
assert.equal(retired.length, 1);
assert.equal(kept.length, 19);
assert.deepEqual(
  cell.retired_items.map((entry) => entry.id),
  retired.map((row) => row.de_by_id),
);
const dir = mkdtempSync(join(tmpdir(), "zam-bio-gy5-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

async function reviewedCard(db, tokenId, userId, index) {
  const card = await zam.ensureCard(db, tokenId, userId);
  const now = new Date();
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

async function queued(db, userId, tokenIds, cards) {
  const queue = await zam.buildReviewQueue(db, {
    userId,
    tokenIds,
    now: new Date(Math.max(...cards.map((card) => Date.parse(card.due_at))) + 86_400_000),
    buryNewSiblings: false,
    buryReviewSiblings: false,
  });
  return queue.items.length;
}

try {
  const db = await zam.openDatabase({
    dbPath: join(dir, "history.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of legacy) await zam.installKvtTile(db, tile);
    const userId = cell.atoms[0].id;
    for (const [index, row] of mapping.rows.entries())
      await reviewedCard(db, row.de_by_id, userId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, 24);
    assert.equal(before.reviews.length, 48);
    assert.equal(
      await queued(db, userId, retired.map((row) => row.de_by_id), before.cards),
      1,
      "the retired composite was active before migration",
    );

    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.equal(after.cards.length, before.cards.length, "installing a cell must not enrol fresh cards");
    assert.equal(after.reviews.length, before.reviews.length);
    const expected = new Map(replaced.map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]));
    for (const oldCard of before.cards) {
      const fresh = after.cards.find((card) => card.id === oldCard.id);
      assert.deepEqual(withoutToken(fresh), withoutToken(oldCard), `FSRS state changed on ${oldCard.token_id}`);
      assert.equal(fresh.token_id, expected.get(oldCard.token_id) ?? oldCard.token_id);
    }
    for (const oldReview of before.reviews) {
      const fresh = after.reviews.find((review) => review.id === oldReview.id);
      assert.deepEqual(withoutToken(fresh), withoutToken(oldReview), `review evidence changed on ${oldReview.id}`);
      assert.equal(fresh.token_id, expected.get(oldReview.token_id) ?? oldReview.token_id);
    }
    for (const row of mapping.rows) {
      const token = await zam.getTokenById(db, row.de_by_id);
      assert.ok(token, "an old token must never be deleted");
      if (row.action === "keep-active")
        assert.equal(token.deprecated_at ?? null, null, `${row.de_by_id} must stay active`);
      else assert.ok(token.deprecated_at, `${row.de_by_id} must leave active use`);
    }
    assert.equal(
      await queued(db, userId, retired.map((row) => row.de_by_id), after.cards),
      0,
      "the retired composite must never return to active reviews",
    );
    assert.equal(
      await queued(db, userId, kept.map((row) => row.de_by_id), after.cards),
      kept.length,
      "the 19 keep-active C cards stay in active reviews",
    );
    assert.equal(
      await queued(db, userId, replaced.map((row) => bySlug.get(row.academy_slug).id), after.cards),
      replaced.length,
      "the moved histories are reviewed on their successors",
    );

    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "a repeated install must preserve every schedule and review");

    const atomIds = cell.atoms.map((atom) => atom.id);
    const enrolled = await zam.materialiseKvtCards(db, userId, atomIds);
    assert.deepEqual(enrolled, { cardsCreated: items.length - 4, cardsReused: 4 });
    const complete = await snapshot(db);
    assert.equal(complete.cards.length, 24 + items.length - 4, "88 Academy cards plus 20 untouched C histories");
    assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
    for (const oldCard of after.cards)
      assert.deepEqual(complete.cards.find((card) => card.id === oldCard.id), oldCard);
    const originalIds = new Set(after.cards.map((card) => card.id));
    for (const fresh of complete.cards.filter((card) => !originalIds.has(card.id))) {
      assert.equal(fresh.state, "new");
      assert.equal(fresh.stability, 0);
      assert.equal(fresh.reps, 0);
      assert.equal(fresh.last_review_at, null);
    }
    assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
      cardsCreated: 0,
      cardsReused: items.length,
    });
    assert.deepEqual(await snapshot(db), complete, "repeat enrolment must not duplicate or reschedule");
    for (const item of items) {
      const token = await zam.getTokenById(db, item.id);
      assert.equal(token.source_link, item.source_link);
    }
    console.log(
      `ok   Biologie 5 Gymnasium: 4 A histories moved, 1 retired history kept out of reviews, 19 C cards active and untouched, 48 review events preserved; ${items.length - 4} fresh cards start unlearned; repeated install/enrolment is idempotent`,
    );
  } finally {
    await db.close();
  }

  for (const row of replaced) {
    const collision = await zam.openDatabase({
      dbPath: join(dir, `collision-${row.de_by_id}.db`),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      for (const tile of legacy) await zam.installKvtTile(collision, tile);
      await zam.installKvtTile(collision, { ...cell, atoms: cell.atoms.map((atom) => ({ ...atom, practice_items: atom.practice_items.map(({ replaces, ...item }) => item) })), retired_items: [] });
      const userId = cell.atoms[1].id;
      await reviewedCard(collision, row.de_by_id, userId, 1);
      await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
      const before = await snapshot(collision);
      await assert.rejects(() => zam.installKvtTile(collision, cell), /holds a card on both|merge/i);
      assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
    } finally {
      await collision.close();
    }
  }
  console.log(
    "ok   Biologie 5 Gymnasium: for each of the 4 A rows, cards on both old and new id refuse an automatic merge and remain unchanged",
  );
} finally {
  rmSync(dir, { recursive: true, force: true });
}
