#!/usr/bin/env node
// Public cell with Thomas's approved mapping: seven histories move unchanged
// (5 A, 2 B), the nine C cards stay active, and a learner who holds cards on
// both an old id and its successor makes the install refuse an automatic merge.
// Reads only snapshots and opens only disposable databases, never a learner library.
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
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/, "mapping approved by Thomas");
assert.equal(mapping.status, "approved");
assert.equal(cell.retired_items, undefined, "no C card is retired");

const itemCount = cell.atoms.reduce(
  (n, atom) => n + atom.practice_items.length,
  0,
);
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
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

// The cell declares exactly the approved A/B rows, one history per successor.
const rows = mapping.rows.filter(
  (row) => row.category === "A" || row.category === "B",
);
const expected = new Map();
for (const row of rows) {
  const successor = items.find((item) => item.slug === row.academy_slug);
  assert.ok(successor, `missing successor ${row.academy_slug}`);
  assert.deepEqual(successor.replaces, [row.de_by_id], row.academy_slug);
  expected.set(row.de_by_id, successor.id);
}
assert.deepEqual(
  items.filter((item) => item.replaces).map((item) => item.id).sort(),
  [...expected.values()].sort(),
  "no undocumented replaces",
);
for (const row of mapping.rows.filter((row) => row.category === "C"))
  assert.equal(row.action, "keep-active", `${row.de_by_id} stays active`);
const cIds = new Set(
  mapping.rows.filter((row) => row.category === "C").map((row) => row.de_by_id),
);

const dir = mkdtempSync(join(tmpdir(), "zam-chemie10-history-"));
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
const open = (name) =>
  zam.openDatabase({
    dbPath: join(dir, name),
    initialize: true,
    useConfiguredCloud: false,
  });
const withoutToken = ({ token_id, ...fields }) => fields;
const reviewed = async (database, tokenId, userId, rating, day) => {
  const card = await zam.ensureCard(database, tokenId, userId);
  await zam.evaluateRating(database, {
    cardId: card.id,
    tokenId,
    userId,
    rating,
    answerFormat: "recall",
    responseTimeMs: 2400,
    now: new Date(Date.UTC(2026, 8, day)),
  });
};
const userId = cell.atoms[0].id;

try {
  await migrate();
  await collisions();
} finally {
  rmSync(dir, { recursive: true, force: true });
}

/** A learner with reviews on all 16 old cards installs the public cell. */
async function migrate() {
  const db = await open("history.db");
  try {
    for (const tile of oldCells) await zam.installKvtTile(db, tile);
    for (const [index, id] of oldIds.entries()) {
      await reviewed(db, id, userId, index % 3 === 0 ? 1 : 3, 1);
      await reviewed(db, id, userId, index % 2 === 0 ? 3 : 4, 11);
    }
    const before = await snapshot(db);
    assert.equal(before.cards.length, 16);
    assert.equal(before.reviews.length, 32);
    await zam.installKvtTile(db, cell);
    const after = await snapshot(db);
    assert.equal(after.cards.length, before.cards.length);
    assert.equal(after.reviews.length, before.reviews.length);
    for (const table of ["cards", "reviews"])
      for (const old of before[table]) {
        const fresh = after[table].find((row) => row.id === old.id);
        assert.ok(fresh);
        assert.deepEqual(
          withoutToken(fresh),
          withoutToken(old),
          `${table}: every evidence field preserved`,
        );
        assert.equal(fresh.token_id, expected.get(old.token_id) ?? old.token_id);
      }
    for (const id of oldIds) {
      const token = await zam.getTokenById(db, id);
      assert.ok(token);
      assert.equal(Boolean(token.deprecated_at), expected.has(id), id);
    }
    assert.deepEqual(
      after.replacements.map(({ old_item_id, new_item_id }) => [
        old_item_id,
        new_item_id,
      ]),
      [...expected.entries()].sort(([a], [b]) => a.localeCompare(b)),
      "exactly the seven approved transfers (5 A, 2 B), never one for a C card",
    );
    const queue = await zam.buildReviewQueue(db, {
      userId,
      tokenIds: oldIds,
      now: new Date("2030-01-01T00:00:00Z"),
      buryNewSiblings: false,
      buryReviewSiblings: false,
    });
    assert.deepEqual(
      queue.items.map((item) => item.tokenId ?? item.token_id ?? item.token?.id).sort(),
      [...cIds].sort(),
      "the nine C cards stay in active review",
    );
    await zam.installKvtTile(db, cell);
    assert.deepEqual(await snapshot(db), after, "repeated install changes nothing");
    const atoms = cell.atoms.map((atom) => atom.id);
    for (let round = 0; round < 5; round++) {
      const result = await zam.materialiseKvtCards(db, userId, atoms);
      if (result.cardsCreated === 0) break;
    }
    const complete = await snapshot(db);
    assert.equal(complete.cards.length, itemCount + cIds.size);
    assert.deepEqual(complete.reviews, after.reviews);
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
    assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
      cardsCreated: 0,
      cardsReused: itemCount,
    });
    await zam.installKvtTile(db, cell);
    assert.deepEqual(
      await snapshot(db),
      complete,
      "repeated install and enrolment change nothing",
    );
    console.log(
      `ok   Chemie 10 public cell: ${rows.length} histories moved with all FSRS fields and 32 reviews intact; ${cIds.size} C cards active; ${itemCount - rows.length} fresh unlearned cards; repeat install/enrolment idempotent`,
    );
  } finally {
    await db.close();
  }
}

/**
 * For every approved row: a learner who already holds cards on the old id and
 * on its successor (e.g. from a local preview without replaces) makes the
 * install refuse, and nothing changes.
 */
async function collisions() {
  const preview = structuredClone(cell);
  for (const item of preview.atoms.flatMap((atom) => atom.practice_items))
    delete item.replaces;
  for (const [index, row] of rows.entries()) {
    const db = await open(`collision-${index}.db`);
    try {
      for (const tile of oldCells) await zam.installKvtTile(db, tile);
      await zam.installKvtTile(db, preview);
      await reviewed(db, row.de_by_id, userId, 1, 10);
      await reviewed(db, expected.get(row.de_by_id), userId, 3, 10);
      const before = await snapshot(db);
      await assert.rejects(
        () => zam.installKvtTile(db, cell),
        (error) => {
          // Check the facts the message must name, not zam-core's wording.
          for (const part of [row.de_by_id, expected.get(row.de_by_id), userId])
            assert.ok(error.message.includes(part), `${error.message} names ${part}`);
          return true;
        },
      );
      assert.deepEqual(await snapshot(db), before, `${row.de_by_id}: rolled back`);
    } finally {
      await db.close();
    }
  }
  console.log(
    `ok   collision for each of the ${rows.length} approved rows: install refused naming old id, successor and learner; tokens, replacements and all evidence rolled back`,
  );
}
