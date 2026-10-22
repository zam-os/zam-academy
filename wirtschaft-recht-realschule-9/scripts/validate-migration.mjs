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

// The repository stores LF; a Windows checkout may hold CRLF. Hash the LF bytes.
const legacy = mapping.sources.map((source) => {
  const text = readFileSync(join(root, source.file), "utf8").replaceAll("\r\n", "\n");
  assert.equal(
    createHash("sha256").update(text).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(text);
});

// The cell as first published (2026.10.1): the same bytes without the
// history declarations and the version bump that this change adds.
const published = structuredClone(cell);
published.version = "2026.10.1";
delete published.retired_items;
for (const atom of published.atoms)
  for (const item of atom.practice_items) delete item.replaces;

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const moved = mapping.rows.filter((row) => row.category !== "C");
const retired = mapping.rows.filter((row) => row.category === "C");
const dir = mkdtempSync(join(tmpdir(), "zam-wr9-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

async function openDb(name) {
  return zam.openDatabase({
    dbPath: join(dir, name),
    initialize: true,
    useConfiguredCloud: false,
  });
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

function laterThanAllDue(cards) {
  return new Date(Math.max(...cards.map((card) => Date.parse(card.due_at))) + 86_400_000);
}

try {
  assert.equal(mapping.rows.length, 8);
  assert.equal(moved.length, 3);
  assert.equal(retired.length, 5);
  assert.equal(cell.retired_items.length, retired.length);

  {
    const db = await openDb("history.db");
    try {
      for (const tile of legacy) await zam.installKvtTile(db, tile);
      const userId = cell.atoms[0].id;
      for (const [index, row] of mapping.rows.entries())
        await reviewedCard(db, row.de_by_id, userId, index);
      const before = await snapshot(db);
      assert.equal(before.cards.length, 8);
      assert.equal(before.reviews.length, 16);
      const oldQueue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: cell.retired_items.map((entry) => entry.id),
        now: laterThanAllDue(before.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(
        oldQueue.items.length,
        5,
        "all five split or out-of-curriculum questions were active before migration",
      );

      await zam.installKvtTile(db, cell);
      const after = await snapshot(db);
      assert.equal(
        after.cards.length,
        before.cards.length,
        "installing a cell must not enrol fresh cards",
      );
      assert.equal(after.reviews.length, before.reviews.length);
      const expected = new Map(
        moved.map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
      );
      for (const oldCard of before.cards) {
        const fresh = after.cards.find((card) => card.id === oldCard.id);
        assert.deepEqual(
          withoutToken(fresh),
          withoutToken(oldCard),
          `FSRS state changed on ${oldCard.token_id}`,
        );
        assert.equal(fresh.token_id, expected.get(oldCard.token_id) ?? oldCard.token_id);
      }
      for (const oldReview of before.reviews) {
        const fresh = after.reviews.find((review) => review.id === oldReview.id);
        assert.deepEqual(
          withoutToken(fresh),
          withoutToken(oldReview),
          `review evidence changed on ${oldReview.id}`,
        );
        assert.equal(fresh.token_id, expected.get(oldReview.token_id) ?? oldReview.token_id);
      }
      for (const row of mapping.rows) {
        const token = await zam.getTokenById(db, row.de_by_id);
        assert.ok(token, "an old token must never be deleted");
        assert.ok(token.deprecated_at, "superseded and retired old items must leave active use");
        if (row.category === "C") assert.equal(token.editorial_state, "deprecated");
      }
      const retiredQueue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: retired.map((row) => row.de_by_id),
        now: laterThanAllDue(after.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(
        retiredQueue.items.length,
        0,
        "retired old questions must never return to active reviews",
      );
      const successorQueue = await zam.buildReviewQueue(db, {
        userId,
        tokenIds: [...expected.values()],
        now: laterThanAllDue(after.cards),
        buryNewSiblings: false,
        buryReviewSiblings: false,
      });
      assert.equal(
        successorQueue.items.length,
        3,
        "the three moved histories are due under their successors",
      );

      await zam.installKvtTile(db, cell);
      assert.deepEqual(
        await snapshot(db),
        after,
        "a repeated install must preserve every schedule and review",
      );
      const atomIds = cell.atoms.map((atom) => atom.id);
      // zam-core adds only one more card to an atom on which the learner already
      // holds a card, per call: the three atoms with a moved history get their
      // remaining tier 2 card with the next enrolment.
      const enrolled = await zam.materialiseKvtCards(db, userId, atomIds);
      assert.deepEqual(enrolled, { cardsCreated: 144, cardsReused: 3 });
      const first = await snapshot(db);
      assert.equal(first.cards.length, 152, "147 active cards plus 5 preserved retired histories");
      assert.deepEqual(first.reviews, after.reviews, "enrolment invents no review evidence");
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
        cardsCreated: 3,
        cardsReused: 147,
      });
      const complete = await snapshot(db);
      assert.equal(complete.cards.length, 155, "150 active cards plus 5 preserved retired histories");
      assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
      for (const oldCard of after.cards) {
        assert.deepEqual(
          complete.cards.find((card) => card.id === oldCard.id),
          oldCard,
        );
      }
      const originalIds = new Set(after.cards.map((card) => card.id));
      for (const fresh of complete.cards.filter((card) => !originalIds.has(card.id))) {
        assert.equal(fresh.state, "new");
        assert.equal(fresh.stability, 0);
        assert.equal(fresh.reps, 0);
        assert.equal(fresh.last_review_at, null);
      }
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
        cardsCreated: 0,
        cardsReused: 150,
      });
      assert.deepEqual(
        await snapshot(db),
        complete,
        "repeat enrolment must not duplicate or reschedule",
      );
      console.log(
        "ok   WR 9: 3 atomic histories moved, 5 split or out-of-curriculum histories untouched and retired, 16 review events preserved; 147 fresh cards start unlearned (the last three one enrolment later); repeated install/enrolment is idempotent",
      );
    } finally {
      await db.close();
    }
  }

  {
    const collision = await openDb("A-collision.db");
    try {
      await zam.installKvtTile(collision, published);
      for (const tile of legacy) await zam.installKvtTile(collision, tile);
      const row = moved[0];
      const userId = cell.atoms[1].id;
      await reviewedCard(collision, row.de_by_id, userId, 1);
      await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
      const before = await snapshot(collision);
      await assert.rejects(
        () => zam.installKvtTile(collision, cell),
        /holds a card on both|merge/i,
      );
      assert.deepEqual(
        await snapshot(collision),
        before,
        "a collision must leave both histories intact",
      );
      console.log(
        "ok   WR 9: two existing histories refuse an automatic merge and remain unchanged",
      );
    } finally {
      await collision.close();
    }
  }

  {
    const upgrade = await openDb("upgrade-without-old-cell.db");
    try {
      await zam.installKvtTile(upgrade, published);
      const userId = cell.atoms[2].id;
      const atomIds = cell.atoms.map((atom) => atom.id);
      await zam.materialiseKvtCards(upgrade, userId, atomIds);
      for (const [index, row] of moved.entries())
        await reviewedCard(upgrade, bySlug.get(row.academy_slug).id, userId, index);
      const before = await snapshot(upgrade);
      assert.equal(before.cards.length, 150);
      await zam.installKvtTile(upgrade, cell);
      assert.deepEqual(
        await snapshot(upgrade),
        before,
        "a learner who never had the old cell keeps every card and review through the upgrade",
      );
      console.log(
        "ok   WR 9: upgrading from 2026.10.1 without the old cell changes no card and no review",
      );
    } finally {
      await upgrade.close();
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
