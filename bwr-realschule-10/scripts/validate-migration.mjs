#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Part 1 checks the cell as it ships: without replaces or retired_items it must
// leave every history of the old BwR 10 cell untouched and only add fresh cards.
// Part 2 rehearses the proposed mapping in replaces-de-by.json on an in-memory
// copy of the cell (two A rows replaced, two C rows retired), so the later,
// approved version is known to move histories correctly. Nothing of part 2 is
// published; the shipped cell.json is never changed by this script.
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
const dir = mkdtempSync(join(tmpdir(), "zam-bwr10-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.approved, null);
assert.ok(!items.some((item) => item.replaces?.length), "the shipped cell declares no replaces");
assert.ok(!cell.retired_items?.length, "the shipped cell retires nothing");

/** The approved follow-up version would look like this; built in memory only. */
function rehearsedCell() {
  const copy = structuredClone(cell);
  copy.version = "2026.10.2";
  for (const row of mapping.rows.filter((r) => r.category === "A"))
    for (const atom of copy.atoms)
      for (const item of atom.practice_items)
        if (item.slug === row.academy_slug) item.replaces = [row.de_by_id];
  copy.retired_items = mapping.rows
    .filter((r) => r.category === "C" && r.proposed_action === "retire")
    .map((r) => ({ id: r.de_by_id, reason: r.reason }));
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
  // Part 1: the cell as published.
  {
    const { db, userId } = await libraryWithHistories("shipped.db");
    try {
      const before = await snapshot(db);
      assert.equal(before.cards.length, 4);
      assert.equal(before.reviews.length, 8);
      await zam.installKvtTile(db, cell);
      await zam.installKvtTile(db, cell);
      assert.deepEqual(await snapshot(db), before, "installing the new cell must not touch old cards or reviews");
      for (const row of mapping.rows) {
        const token = await zam.getTokenById(db, row.de_by_id);
        assert.ok(token, "an old token must never be deleted");
        assert.ok(!token.deprecated_at, "without approval no old card leaves active use");
      }
      const queue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: mapping.rows.map((row) => row.de_by_id),
        now: lastDue(before.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(queue.items.length, 4, "all four old cards stay in active review");
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), { cardsCreated: 76, cardsReused: 0 });
      const complete = await snapshot(db);
      assert.equal(complete.cards.length, 80);
      assert.deepEqual(complete.reviews, before.reviews, "enrolment invents no review evidence");
      const originalIds = new Set(before.cards.map((card) => card.id));
      for (const fresh of complete.cards.filter((card) => !originalIds.has(card.id))) {
        assert.equal(fresh.state, "new");
        assert.equal(fresh.reps, 0);
        assert.equal(fresh.last_review_at, null);
      }
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), { cardsCreated: 0, cardsReused: 76 });
      assert.deepEqual(await snapshot(db), complete, "repeat enrolment must not duplicate or reschedule");
      console.log(
        "ok   BwR 10 (shipped): 4 old cards and 8 reviews unchanged and active; 76 fresh cards start unlearned; repeated install and enrolment change nothing",
      );
    } finally {
      await db.close();
    }
  }

  // Part 2: rehearsal of the proposed mapping (not published).
  {
    const proposed = rehearsedCell();
    const { db, userId } = await libraryWithHistories("rehearsal.db");
    try {
      const before = await snapshot(db);
      await zam.installKvtTile(db, proposed);
      const after = await snapshot(db);
      assert.equal(after.cards.length, before.cards.length, "installing a cell must not enrol fresh cards");
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
      const retired = proposed.retired_items.map((entry) => entry.id);
      const queue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: retired,
        now: lastDue(after.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(queue.items.length, 0, "retired old questions must never return to active reviews");
      await zam.installKvtTile(db, proposed);
      assert.deepEqual(await snapshot(db), after, "a repeated install must preserve every schedule and review");
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), { cardsCreated: 74, cardsReused: 2 });
      console.log(
        "ok   BwR 10 (rehearsed proposal): 2 atomic histories would move, 2 split histories would be retired with their reviews kept; 74 fresh cards",
      );
    } finally {
      await db.close();
    }

    const collision = await zam.openDatabase({
      dbPath: join(dir, "collision.db"),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      await zam.installKvtTile(collision, cell);
      for (const tile of legacy) await zam.installKvtTile(collision, tile);
      const row = mapping.rows.find((entry) => entry.category === "A");
      const userId = cell.atoms[1].id;
      await reviewedCard(collision, row.de_by_id, userId, 1);
      await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
      const before = await snapshot(collision);
      await assert.rejects(() => zam.installKvtTile(collision, proposed), /holds a card on both|merge/i);
      assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
      console.log(
        "ok   BwR 10 (rehearsed proposal): a learner with cards on both ids makes the install refuse an automatic merge",
      );
    } finally {
      await collision.close();
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
