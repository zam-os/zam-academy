#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Physik 8 takes over four single facts (category A, `replaces`), retires ten
// multi-part cards (C, `retired_items`) and leaves two cards of Jahrgangsstufe 9
// alone (C, keep). Nobody's schedule or review may change in any of the three.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const cell = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
  readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);
const legacy = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
const legacyItems = new Map(
  legacy.flatMap((tile) =>
    tile.atoms.flatMap((atom) => atom.practice_items.map((item) => [item.id, item])),
  ),
);
for (const row of mapping.rows) {
  assert.equal(
    legacyItems.get(row.de_by_id)?.question,
    row.de_by_question,
    `${row.de_by_id}: the mapping quotes the legacy question`,
  );
}
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const replaced = mapping.rows.filter((row) => row.category === "A");
const retired = mapping.rows.filter((row) => row.action === "retire");
const kept = mapping.rows.filter((row) => row.action === "keep");
assert.equal(legacyItems.size, 16);
assert.equal(replaced.length + retired.length + kept.length, 16);
assert.deepEqual(
  cell.retired_items.map((entry) => entry.id).sort(),
  retired.map((row) => row.de_by_id).sort(),
  "the cell retires exactly the rows marked retire",
);

const dir = mkdtempSync(join(tmpdir(), "zam-physik8-migration-"));
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
    assert.equal(before.cards.length, 16);
    assert.equal(before.reviews.length, 32);
    const dueLater = new Date(
      Math.max(...before.cards.map((card) => Date.parse(card.due_at))) + 86_400_000,
    );
    const oldQueue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: retired.map((row) => row.de_by_id),
      now: dueLater,
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(oldQueue.items.length, 10, "all ten retired questions were active before migration");

    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.equal(after.cards.length, before.cards.length, "installing a cell must not enrol fresh cards");
    assert.equal(after.reviews.length, before.reviews.length);
    const expected = new Map(
      replaced.map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
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
      if (row.action === "keep") {
        assert.ok(!token.deprecated_at, "a card outside the Physik 8 curriculum stays active");
      } else {
        assert.ok(token.deprecated_at, "superseded and retired old items must leave active use");
        if (row.action === "retire") assert.equal(token.editorial_state, "deprecated");
      }
    }
    const retiredQueue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: retired.map((row) => row.de_by_id),
      now: new Date(Math.max(...after.cards.map((card) => Date.parse(card.due_at))) + 86_400_000),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(retiredQueue.items.length, 0, "retired old questions must never return to active reviews");

    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "a repeated install must preserve every schedule and review");

    const atomIds = cell.atoms.map((atom) => atom.id);
    // ZAM paces new cards: an atom that already holds a card (here a moved
    // history) gets one further card per enrolment, an untouched atom all of them.
    const movedIds = new Set(replaced.map((row) => bySlug.get(row.academy_slug).id));
    let expectedCreated = 0;
    for (const atom of cell.atoms) {
      const moved = atom.practice_items.filter((item) => movedIds.has(item.id)).length;
      const missing = atom.practice_items.length - moved;
      expectedCreated += moved > 0 ? Math.min(1, missing) : missing;
    }
    const enrolled = await zam.materialiseKvtCards(db, userId, atomIds);
    assert.deepEqual(enrolled, { cardsCreated: expectedCreated, cardsReused: replaced.length });
    const first = await snapshot(db);
    assert.deepEqual(first.reviews, after.reviews, "enrolment invents no review evidence");
    for (let pass = 0; pass < 8; pass++) {
      const next = await zam.materialiseKvtCards(db, userId, atomIds);
      if (next.cardsCreated === 0) break;
    }
    const complete = await snapshot(db);
    assert.equal(
      complete.cards.length,
      items.length + retired.length + kept.length,
      "every active card plus the preserved histories of retired and kept cards",
    );
    assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
    for (const oldCard of after.cards) {
      assert.deepEqual(complete.cards.find((card) => card.id === oldCard.id), oldCard);
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
      cardsReused: items.length,
    });
    assert.deepEqual(await snapshot(db), complete, "repeat enrolment must not duplicate or reschedule");
    console.log(
      `ok   Physik 8: ${replaced.length} atomic histories moved, ${retired.length} multi-part histories untouched and retired, ${kept.length} Jahrgangsstufe-9 histories left active, ${before.reviews.length} review events preserved; ${items.length - replaced.length} fresh cards start unlearned (paced by ZAM per atom); repeated install/enrolment is idempotent`,
    );
  } finally {
    await db.close();
  }

  {
    const collision = await zam.openDatabase({
      dbPath: join(dir, "A-collision.db"),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      await zam.installKvtTile(collision, cell);
      for (const tile of legacy) await zam.installKvtTile(collision, tile);
      const row = replaced[0];
      const userId = cell.atoms[1].id;
      await reviewedCard(collision, row.de_by_id, userId, 1);
      await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
      const before = await snapshot(collision);
      await assert.rejects(
        () => zam.installKvtTile(collision, { ...cell, version: "2026.10.2" }),
        /holds a card on both|merge/i,
      );
      assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
      console.log("ok   Physik 8: two existing histories refuse an automatic merge and remain unchanged");
    } finally {
      await collision.close();
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
