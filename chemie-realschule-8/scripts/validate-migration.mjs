#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Version 2026.10.2 carries the mapping Thomas approved on 2026-10-26: eight A
// rows move their histories to one successor each, eight C rows leave active
// reviews with their histories kept. Part 1 checks a learner who only holds the
// old cards. Part 2 checks a learner who already enrolled 2026.10.1 (the first
// publication, built here in memory without replaces and retired_items) and
// holds cards on an old id and its successor: the install must refuse.
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
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const atomIds = cell.atoms.map((atom) => atom.id);
const dir = mkdtempSync(join(tmpdir(), "zam-c8-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(cell.version, "2026.10.2");

/** The first publication 2026.10.1: same cards, no history change. */
function firstPublication() {
  const copy = structuredClone(cell);
  copy.version = "2026.10.1";
  for (const atom of copy.atoms) for (const item of atom.practice_items) delete item.replaces;
  delete copy.retired_items;
  return copy;
}

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

async function libraryWithHistories(name) {
  const db = await zam.openDatabase({
    dbPath: join(dir, name),
    initialize: true,
    useConfiguredCloud: false,
  });
  for (const tile of legacy) await zam.installKvtTile(db, tile);
  const userId = cell.atoms[0].id;
  for (const [index, row] of mapping.rows.entries()) await reviewedCard(db, row.de_by_id, userId, index);
  return { db, userId };
}

const lastDue = (cards) => new Date(Math.max(...cards.map((card) => Date.parse(card.due_at))) + 86_400_000);

try {
  // Part 1: histories move or retire as approved.
  {
    const { db, userId } = await libraryWithHistories("history.db");
    try {
      const before = await snapshot(db);
      assert.equal(before.cards.length, 16);
      assert.equal(before.reviews.length, 32);
      await zam.installKvtTile(db, cell);
      const after = await snapshot(db);
      assert.equal(after.cards.length, before.cards.length, "installing a cell must not enrol fresh cards");
      assert.equal(after.reviews.length, before.reviews.length);
      const expected = new Map(
        mapping.rows
          .filter((row) => row.category === "A")
          .map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
      );
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
        assert.ok(token.deprecated_at, "superseded and retired old items must leave active use");
      }
      const retired = cell.retired_items.map((entry) => entry.id);
      assert.deepEqual(
        retired,
        mapping.rows.filter((row) => row.category === "C").map((row) => row.de_by_id),
      );
      const queue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: retired,
        now: lastDue(after.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(queue.items.length, 0, "retired old questions must never return to active reviews");
      await zam.installKvtTile(db, cell);
      assert.deepEqual(await snapshot(db), after, "a repeated install must preserve every schedule and review");
      let createdTotal = 0;
      for (let round = 0; round < 5; round++) {
        const step = await zam.materialiseKvtCards(db, userId, atomIds);
        createdTotal += step.cardsCreated;
        if (step.cardsCreated === 0) break;
      }
      assert.equal(createdTotal, items.length - 8);
      const complete = await snapshot(db);
      assert.equal(complete.cards.length, items.length + 8, "66 active cards plus 8 preserved retired histories");
      assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
        cardsCreated: 0,
        cardsReused: items.length,
      });
      assert.deepEqual(await snapshot(db), complete, "repeat enrolment must not duplicate or reschedule");
      console.log(
        "ok   Chemie 8: 8 atomic histories moved, 8 split histories retired with their reviews kept, 32 review events preserved; 58 fresh cards start unlearned; repeated install and enrolment are idempotent",
      );
    } finally {
      await db.close();
    }
  }

  // Part 2: a learner who enrolled the first publication and holds both ids.
  {
    const collision = await zam.openDatabase({
      dbPath: join(dir, "collision.db"),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      await zam.installKvtTile(collision, firstPublication());
      for (const tile of legacy) await zam.installKvtTile(collision, tile);
      const row = mapping.rows.find((entry) => entry.category === "A");
      const userId = cell.atoms[1].id;
      await reviewedCard(collision, row.de_by_id, userId, 1);
      await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
      const before = await snapshot(collision);
      // Matches zam-core 0.54.0's wording; check it again when the pinned version is raised.
      await assert.rejects(() => zam.installKvtTile(collision, cell), /holds a card on both|merge/i);
      assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
      console.log(
        "ok   Chemie 8: a learner with cards on both an old id and its successor makes the install of 2026.10.2 refuse an automatic merge",
      );
    } finally {
      await collision.close();
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
