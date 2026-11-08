#!/usr/bin/env node
// Approved mapping (Thomas, 2026-11-08): the one A history moves to its
// successor, the 15 C cards stay active. Runs against the same pinned
// published zam-core as the Academy's cell checks. Reads only snapshots and
// opens only disposable databases, never a learner library or configuration.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node mathematik-gymnasium-11/scripts/validate-migration.mjs
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
assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
assert.equal(cell.retired_items, undefined, "no card is retired");

const items = cell.atoms.flatMap((atom) => atom.practice_items);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const moved = mapping.rows.filter((row) => row.category !== "C");
const kept = mapping.rows.filter((row) => row.category === "C");
// Exactly the approved A/B rows declare replaces, each on its one successor.
assert.deepEqual(
  items
    .filter((item) => item.replaces)
    .map((item) => [item.slug, item.replaces])
    .sort(),
  moved.map((row) => [row.academy_slug, [row.de_by_id]]).sort(),
);

const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    source.sha256,
    "legacy source snapshots must not drift",
  );
  return JSON.parse(bytes.toString("utf8"));
});
const oldIds = oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
for (const item of oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items),
)) {
  assert.deepEqual(
    mapping.rows.find((row) => row.de_by_id === item.id).de_by_question,
    item.question_segments ?? item.question,
    `exact original question, including segments: ${item.id}`,
  );
}
assert.deepEqual(
  [...oldIds].sort(),
  mapping.rows.map((row) => row.de_by_id).sort(),
);
const expected = new Map(
  moved.map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
);
const withoutToken = ({ token_id, ...fields }) => fields;
const dir = mkdtempSync(join(tmpdir(), "zam-mathe-gym11-history-"));

const snapshot = async (database) => ({
  tokens: await database.prepare("SELECT * FROM tokens ORDER BY id").all(),
  replacements: await database
    .prepare(
      "SELECT * FROM practice_item_replacements ORDER BY old_item_id, new_item_id",
    )
    .all(),
  cards: await database.prepare("SELECT * FROM cards ORDER BY id").all(),
  reviews: await database
    .prepare("SELECT * FROM review_logs ORDER BY id")
    .all(),
});

async function reviewedCard(database, tokenId, userId, index) {
  const card = await zam.ensureCard(database, tokenId, userId);
  for (const [pass, rating] of [
    index % 3 === 0 ? 1 : 3,
    index % 2 === 0 ? 3 : 4,
  ].entries()) {
    await zam.evaluateRating(database, {
      cardId: card.id,
      tokenId,
      userId,
      rating,
      answerFormat: "recall",
      responseTimeMs: 1200 + index * 100,
      now: new Date(Date.UTC(2026, 8, 1 + pass * 10)),
    });
  }
}

try {
  const db = await zam.openDatabase({
    dbPath: join(dir, "history.db"),
    initialize: true,
    useConfiguredCloud: false,
  });
  try {
    for (const tile of oldCells) await zam.installKvtTile(db, tile);
    const userId = cell.atoms[0].id;
    for (const [index, id] of oldIds.entries())
      await reviewedCard(db, id, userId, index);
    const before = await snapshot(db);
    assert.equal(before.cards.length, oldIds.length);
    assert.equal(before.reviews.length, 2 * oldIds.length);

    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.equal(
      after.cards.length,
      before.cards.length,
      "installing a cell must not enrol fresh cards",
    );
    assert.equal(after.reviews.length, before.reviews.length);
    for (const table of ["cards", "reviews"])
      for (const old of before[table]) {
        const fresh = after[table].find((row) => row.id === old.id);
        assert.ok(fresh, `${table}: ${old.id} kept`);
        assert.deepEqual(
          withoutToken(fresh),
          withoutToken(old),
          `${table}: every evidence field preserved on ${old.id}`,
        );
        assert.equal(
          fresh.token_id,
          expected.get(old.token_id) ?? old.token_id,
          "only the approved A history moves",
        );
      }
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [
        old_item_id,
        new_item_id,
      ]),
      [...expected.entries()].sort(([a], [b]) => a.localeCompare(b)),
      "exactly the approved transfer, never one for a C card",
    );
    for (const id of oldIds) {
      const token = await zam.getTokenById(db, id);
      assert.ok(token, "an old token is never deleted");
      assert.equal(
        Boolean(token.deprecated_at),
        expected.has(id),
        `${id}: only replaced items leave active use`,
      );
    }
    const queue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: oldIds,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.equal(
      queue.items.length,
      kept.length,
      "every C card stays in active reviews, the replaced id does not",
    );

    await zam.installKvtTile(db, cell);
    assert.deepEqual(
      await snapshot(db),
      after,
      "a repeated install changes nothing",
    );

    // zam-core enrols an atom the learner already holds cards on one new card
    // at a time, so atoms with a moved history fill up over several rounds.
    const atomIds = cell.atoms.map((atom) => atom.id);
    let rounds = 0;
    for (; rounds < 10; rounds++) {
      const result = await zam.materialiseKvtCards(db, userId, atomIds);
      if (result.cardsCreated === 0) break;
    }
    assert.ok(rounds < 10, "enrolment settles");
    const complete = await snapshot(db);
    assert.equal(
      complete.cards.length,
      oldIds.length - moved.length + items.length,
      "every card once, the moved history included",
    );
    assert.deepEqual(complete.reviews, after.reviews, "enrolment invents no review evidence");
    for (const old of after.cards)
      assert.deepEqual(
        complete.cards.find((card) => card.id === old.id),
        old,
      );
    for (const fresh of complete.cards.filter(
      (card) => !after.cards.some((old) => old.id === card.id),
    )) {
      assert.equal(fresh.state, "new");
      assert.equal(fresh.stability, 0);
      assert.equal(fresh.reps, 0);
      assert.equal(fresh.last_review_at, null);
    }
    assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
      cardsCreated: 0,
      cardsReused: items.length,
    });
    assert.deepEqual(
      await snapshot(db),
      complete,
      "repeat enrolment must not duplicate or reschedule",
    );
    console.log(
      `ok   Mathematik 11 Gymnasium: ${moved.length} history moved (${moved.filter((r) => r.category === "A").length} A, ${moved.filter((r) => r.category === "B").length} B), ${kept.length} C cards stay active; all ${before.reviews.length} reviews preserved; ${items.length - moved.length} fresh cards start unlearned; repeated install/enrolment idempotent`,
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
    // A learner who already holds cards on the old id and on its successor
    // (e.g. from an install without replaces) must not be merged silently.
    const withoutReplaces = structuredClone(cell);
    for (const atom of withoutReplaces.atoms)
      for (const item of atom.practice_items) delete item.replaces;
    for (const tile of oldCells) await zam.installKvtTile(collision, tile);
    await zam.installKvtTile(collision, withoutReplaces);
    const userId = cell.atoms[1].id;
    const row = moved[0];
    await reviewedCard(collision, row.de_by_id, userId, 1);
    await reviewedCard(collision, expected.get(row.de_by_id), userId, 3);
    const before = await snapshot(collision);
    await assert.rejects(
      () => zam.installKvtTile(collision, { ...cell, version: `${cell.version}-next` }),
      (error) => {
        assert.equal(
          error.message,
          `Cannot move ${row.de_by_id} to ${expected.get(row.de_by_id)}: ${userId} holds a card on both. That is a merge, and mastery is never merged automatically — resolve it explicitly and re-test.`,
        );
        return true;
      },
    );
    assert.deepEqual(
      await snapshot(collision),
      before,
      "a refused install leaves tokens, declarations and both histories unchanged",
    );
    console.log(
      "ok   collision: a learner holding both ids makes the install refuse an automatic merge; everything rolled back",
    );
  } finally {
    await collision.close();
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
