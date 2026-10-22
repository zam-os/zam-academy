#!/usr/bin/env node
// The committed cell changes no history. The A mapping is only rehearsed in
// an in-memory copy installed into temporary libraries, never published here.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const cell = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(readFileSync(join(root, "replaces-de-by.json"), "utf8"));
assert.equal(mapping.approved, null, "This verifier describes the unapproved proposal only");
const items = cell.atoms.flatMap((a) => a.practice_items),
  bySlug = new Map(items.map((i) => [i.slug, i]));
assert.ok(items.every((i) => !i.replaces?.length));
assert.ok(!cell.retired_items?.length);
const legacy = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "Legacy snapshots must be byte-identical",
  );
  return JSON.parse(bytes);
});
const proposal = structuredClone(cell);
proposal.version = "2026.10.2";
const proposedItems = new Map(
  proposal.atoms.flatMap((a) => a.practice_items).map((i) => [i.slug, i]),
);
const proposedTargets = new Map();
for (const row of mapping.rows) {
  if (row.category !== "A") {
    assert.equal(row.academy_slug, null);
    continue;
  }
  const item = proposedItems.get(row.academy_slug);
  assert.ok(item && !item.replaces, "One old history per unique proposed successor");
  item.replaces = [row.de_by_id];
  proposedTargets.set(row.de_by_id, item.id);
}
assert.equal(proposedTargets.size, 9);

const dir = mkdtempSync(join(tmpdir(), "zam-mathe8-proposal-"));
const userId = cell.atoms[0].id;
const snapshot = async (db) => ({
  cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const withoutToken = ({ token_id, ...rest }) => rest;
async function seed(db, ids) {
  for (const [index, id] of ids.entries()) {
    const card = await zam.ensureCard(db, id, userId);
    for (const day of [0, 3])
      await zam.evaluateRating(db, {
        cardId: card.id,
        tokenId: id,
        userId,
        rating: index % 3 === 0 ? 2 : 3,
        answerFormat: "recall",
        responseTimeMs: 1100 + index * 100,
        now: new Date(Date.UTC(2026, 9, 22 + day)),
      });
  }
}
async function open(name) {
  const db = await zam.openDatabase({
    dbPath: join(dir, `${name}.db`),
    initialize: true,
    useConfiguredCloud: false,
  });
  for (const tile of legacy) await zam.installKvtTile(db, tile);
  return db;
}

try {
  for (const [name, tile, targets] of [
    ["draft", cell, new Map()],
    ["rehearsal-only", proposal, proposedTargets],
  ]) {
    const db = await open(name);
    try {
      await seed(
        db,
        mapping.rows.map((r) => r.de_by_id),
      );
      const before = await snapshot(db);
      assert.equal(before.cards.length, 24);
      assert.equal(before.reviews.length, 48);
      await zam.installKvtTile(db, tile);
      const after = await snapshot(db);
      assert.equal(after.cards.length, 24);
      assert.equal(after.reviews.length, 48);
      for (const [key, records] of Object.entries(before))
        for (const old of records) {
          const fresh = after[key].find((r) => r.id === old.id);
          assert.deepEqual(withoutToken(fresh), withoutToken(old), `${name}: ${key} changed`);
          assert.equal(fresh.token_id, targets.get(old.token_id) ?? old.token_id);
        }
      for (const row of mapping.rows.filter((r) => r.category === "C")) {
        const old = await zam.getTokenById(db, row.de_by_id);
        assert.ok(
          old && !old.deprecated_at,
          "C histories remain active and untouched in this proposal",
        );
      }
      await zam.installKvtTile(db, tile);
      assert.deepEqual(await snapshot(db), after, "Repeated installation reschedules nothing");
      const atoms = tile.atoms.map((a) => a.id),
        enrolled = await zam.materialiseKvtCards(db, userId, atoms);
      // zam-core 0.54 adds only one missing sibling at a time on an atom a
      // learner already holds. Each of the nine A atoms has two new siblings.
      assert.deepEqual(enrolled, {
        cardsCreated: 99 - 2 * targets.size,
        cardsReused: targets.size,
      });
      const firstEnrolment = await snapshot(db);
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
        cardsCreated: targets.size,
        cardsReused: 99 - targets.size,
      });
      const complete = await snapshot(db),
        oldIds = new Set(before.cards.map((c) => c.id));
      for (const existing of firstEnrolment.cards)
        assert.deepEqual(
          complete.cards.find((c) => c.id === existing.id),
          existing,
          "Adding another sibling must not reschedule existing cards",
        );
      assert.deepEqual(complete.reviews, after.reviews, "Enrolment invents no evidence");
      for (const fresh of complete.cards.filter((c) => !oldIds.has(c.id))) {
        assert.equal(fresh.state, "new");
        assert.equal(fresh.stability, 0);
        assert.equal(fresh.reps, 0);
        assert.equal(fresh.last_review_at, null);
      }
      assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
        cardsCreated: 0,
        cardsReused: 99,
      });
      assert.deepEqual(await snapshot(db), complete);
      console.log(
        `ok   ${name}: 24 card states and 48 review events preserved; ${targets.size} explicit A transfers only in rehearsal; fresh cards have no mastery`,
      );
    } finally {
      await db.close();
    }
  }
  const db = await open("collision");
  try {
    await zam.installKvtTile(db, cell);
    const row = mapping.rows.find((r) => r.category === "A");
    await seed(db, [row.de_by_id, bySlug.get(row.academy_slug).id]);
    const before = await snapshot(db);
    await assert.rejects(() => zam.installKvtTile(db, proposal), /holds a card on both|merge/i);
    assert.deepEqual(await snapshot(db), before, "Collision must preserve both histories");
    console.log(
      "ok   rehearsal refuses to merge two existing histories; committed cell and proposal file unchanged",
    );
  } finally {
    await db.close();
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
