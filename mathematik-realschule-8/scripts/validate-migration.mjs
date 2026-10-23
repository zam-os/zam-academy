#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Thomas approved the mapping (replaces-de-by.json, approved 2026-10-23), so
// the committed cell declares the replaces of the 9 A and 8 B rows: their
// histories move unchanged, the 7 C cards stay active. While a mapping is
// still a proposal (approved: null), the committed cell must declare no
// replaces and the A and B rows are only rehearsed on an in-memory copy.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node mathematik-realschule-8/scripts/validate-migration.mjs
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
const approved = mapping.approved !== null;
const legacy = mapping.sources.map((source) => {
  // The repository stores LF; a Windows checkout may hold CRLF.
  const bytes = Buffer.from(readFileSync(join(root, source.file), "utf8").replace(/\r\n/g, "\n"), "utf8");
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
const items = cell.atoms.flatMap((atom) => atom.practice_items);
assert.ok(!cell.retired_items?.length, "the C cards stay active: the cell retires nothing");
const moved = mapping.rows.filter((row) => row.category !== "C");
if (approved) {
  const declared = items.flatMap((item) => (item.replaces ?? []).map((id) => `${item.slug} ${id}`)).sort();
  assert.deepEqual(declared, moved.map((row) => `${row.academy_slug} ${row.de_by_id}`).sort(), "the cell declares exactly the approved replaces");
} else {
  assert.ok(items.every((item) => !item.replaces?.length), "an unapproved mapping ships no replaces");
}

// The cell that moves the histories: the committed one once approved,
// otherwise an in-memory copy with exactly the A and B replaces.
const moving = structuredClone(cell);
const movingBySlug = new Map(moving.atoms.flatMap((atom) => atom.practice_items).map((item) => [item.slug, item]));
const targets = new Map();
for (const row of moved) {
  const item = movingBySlug.get(row.academy_slug);
  assert.ok(item, `${row.de_by_id}: successor ${row.academy_slug} exists in the cell`);
  if (!approved) {
    assert.ok(!item.replaces, `${row.academy_slug} takes one history only`);
    item.replaces = [row.de_by_id];
  }
  targets.set(row.de_by_id, item.id);
}
// A later version of the cell, for the collision check.
const later = { ...moving, version: `${cell.version}.1` };

const dir = mkdtempSync(join(tmpdir(), "zam-m8-migration-"));
const userId = cell.atoms[0].id;
const withoutToken = ({ token_id, ...rest }) => rest;
const snapshot = async (db) => ({
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});

async function reviewed(db, ids) {
  for (const [index, tokenId] of ids.entries()) {
    const card = await zam.ensureCard(db, tokenId, userId);
    for (const day of [0, 3])
      await zam.evaluateRating(db, {
        cardId: card.id,
        tokenId,
        userId,
        rating: index % 3 === 0 ? 2 : 3,
        answerFormat: "recall",
        responseTimeMs: 1100 + index * 100,
        now: new Date(Date.UTC(2026, 9, 22 + day)),
      });
  }
}

async function open(name) {
  const db = await zam.openDatabase({ dbPath: join(dir, `${name}.db`), initialize: true, useConfiguredCloud: false });
  for (const tile of legacy) await zam.installKvtTile(db, tile);
  return db;
}

try {
  const scenarios = approved
    ? [["approved cell", cell, targets]]
    : [
        ["committed cell", cell, new Map()],
        ["rehearsal of the A and B rows", moving, targets],
      ];
  for (const [name, tile, expected] of scenarios) {
    const db = await open(name.replace(/\W+/g, "-"));
    try {
      await reviewed(db, mapping.rows.map((row) => row.de_by_id));
      const before = await snapshot(db);
      assert.equal(before.cards.length, mapping.rows.length);
      assert.equal(before.reviews.length, 2 * mapping.rows.length);
      await zam.installKvtTile(db, tile);
      const after = await snapshot(db);
      assert.equal(after.cards.length, before.cards.length, `${name}: installing a cell must not enrol fresh cards`);
      assert.equal(after.reviews.length, before.reviews.length);
      for (const [key, records] of Object.entries(before))
        for (const old of records) {
          const fresh = after[key].find((record) => record.id === old.id);
          assert.deepEqual(withoutToken(fresh), withoutToken(old), `${name}: ${key} state changed on ${old.token_id}`);
          assert.equal(fresh.token_id, expected.get(old.token_id) ?? old.token_id, `${name}: ${old.token_id} lands on its successor`);
        }
      for (const row of mapping.rows) {
        const token = await zam.getTokenById(db, row.de_by_id);
        assert.ok(token, "an old token must never be deleted");
        if (expected.has(row.de_by_id)) assert.ok(token.deprecated_at, `${name}: a moved old item leaves active use`);
        else assert.ok(!token.deprecated_at, `${name}: ${row.de_by_id} stays active and untouched`);
      }
      if (expected.size > 0) {
        const queue = await zam.buildReviewQueue(db, {
          userId,
          tokenIds: [...expected.keys()],
          now: new Date(Math.max(...after.cards.map((card) => Date.parse(card.due_at))) + 86_400_000),
          buryNewSiblings: false,
          buryReviewSiblings: false,
        });
        assert.equal(queue.items.length, 0, "moved old ids never return to active reviews");
      }
      await zam.installKvtTile(db, tile);
      assert.deepEqual(await snapshot(db), after, `${name}: a repeated install changes nothing`);

      // zam-core enrols an atom the learner already holds cards on one new
      // card at a time; atoms with a moved history fill up over several rounds.
      const atomIds = tile.atoms.map((atom) => atom.id);
      const movedIds = new Set(expected.values());
      const trickle = tile.atoms
        .map((atom) => ({ size: atom.practice_items.length, held: atom.practice_items.filter((item) => movedIds.has(item.id)).length }))
        .filter((atom) => atom.held > 0)
        .map((atom) => atom.size - atom.held);
      const firstNew = items.length - movedIds.size - trickle.reduce((sum, n) => sum + n, 0) + trickle.filter((n) => n > 0).length;
      let enrolled = await zam.materialiseKvtCards(db, userId, atomIds);
      assert.deepEqual(enrolled, { cardsCreated: firstNew, cardsReused: movedIds.size });
      let rounds = 1;
      while (enrolled.cardsCreated > 0) {
        enrolled = await zam.materialiseKvtCards(db, userId, atomIds);
        rounds += 1;
      }
      // One call creates the first cards, each held atom then gains one per
      // call, and the last call creates nothing.
      assert.equal(rounds, Math.max(1, ...trickle) + 1, "held atoms fill up one card per enrolment");
      const complete = await snapshot(db);
      assert.equal(complete.cards.length, mapping.rows.length - movedIds.size + items.length, "every new card once, the old cards kept");
      assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
      const kept = new Set(after.cards.map((card) => card.id));
      for (const card of after.cards) assert.deepEqual(complete.cards.find((c) => c.id === card.id), card, "enrolment reschedules no card");
      for (const fresh of complete.cards.filter((card) => !kept.has(card.id))) {
        assert.equal(fresh.state, "new");
        assert.equal(fresh.stability, 0);
        assert.equal(fresh.reps, 0);
        assert.equal(fresh.last_review_at, null);
      }
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), { cardsCreated: 0, cardsReused: items.length });
      assert.deepEqual(await snapshot(db), complete, "repeated enrolment changes nothing");
      console.log(
        `ok   Mathematik 8, ${name}: ${mapping.rows.length} card states and ${before.reviews.length} review events preserved; ${expected.size} histories moved, ${mapping.rows.length - expected.size} old cards stay active; ${items.length - movedIds.size} new cards start unlearned`,
      );
    } finally {
      await db.close();
    }
  }

  // A learner who already holds cards on an old id and on its successor (the
  // cell was installed before the old cell, or before the approval) gets no
  // automatic merge from the next install.
  const db = await zam.openDatabase({ dbPath: join(dir, "collision.db"), initialize: true, useConfiguredCloud: false });
  try {
    if (approved) {
      await zam.installKvtTile(db, cell);
      for (const tile of legacy) await zam.installKvtTile(db, tile);
    } else {
      for (const tile of legacy) await zam.installKvtTile(db, tile);
      await zam.installKvtTile(db, cell);
    }
    const row = moved.find((entry) => entry.category === "A");
    await reviewed(db, [row.de_by_id, targets.get(row.de_by_id)]);
    const before = await snapshot(db);
    await assert.rejects(() => zam.installKvtTile(db, approved ? later : moving), /holds a card on both|merge/i);
    assert.deepEqual(await snapshot(db), before, "a collision must leave both histories intact");
    console.log("ok   Mathematik 8: a learner with cards on an old id and its successor refuses an automatic merge; both histories stay unchanged");
  } finally {
    await db.close();
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
