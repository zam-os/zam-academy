#!/usr/bin/env node
// Public cell: preserve every old history. The mapping is proposal-only (four C rows,
// no A or B), so the cell declares no replaces and no retired_items.
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
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.equal(cell.retired_items, undefined);
assert.ok(
  cell.atoms.every((atom) =>
    atom.practice_items.every((item) => !item.replaces),
  ),
);
assert.ok(
  mapping.rows.every(
    (row) => row.category === "C" && row.action === "keep-active",
  ),
  "only C rows that keep the old card active: nothing to move or retire",
);
const itemCount = cell.atoms.reduce(
  (n, atom) => n + atom.practice_items.length,
  0,
);
const oldCells = mapping.sources.map((source) => {
  const bytes = readFileSync(join(root, source.file));
  assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
  return JSON.parse(bytes.toString("utf8"));
});
const oldItems = oldCells.flatMap((tile) =>
  tile.atoms.flatMap((atom) => atom.practice_items),
);
const oldIds = oldItems.map((item) => item.id);
for (const item of oldItems) {
  assert.deepEqual(
    mapping.rows.find((row) => row.de_by_id === item.id).de_by_question,
    item.question_segments ?? item.question,
    `exact original question: ${item.id}`,
  );
}
assert.deepEqual(
  [...oldIds].sort(),
  mapping.rows.map((row) => row.de_by_id).sort(),
);
const newIds = new Set(
  cell.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id)),
);
for (const id of oldIds)
  assert.ok(!newIds.has(id), `no id of the old cell is reused: ${id}`);

const dir = mkdtempSync(join(tmpdir(), "zam-franzoesisch9-history-"));
const db = await zam.openDatabase({
  dbPath: join(dir, "history.db"),
  initialize: true,
  useConfiguredCloud: false,
});
const snapshot = async (database = db) => ({
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
try {
  for (const tile of oldCells) await zam.installKvtTile(db, tile);
  const userId = cell.atoms[0].id;
  for (const [index, tokenId] of oldIds.entries()) {
    const card = await zam.ensureCard(db, tokenId, userId);
    for (const [pass, rating] of [
      index % 3 === 0 ? 1 : 3,
      index % 2 === 0 ? 3 : 4,
    ].entries()) {
      await zam.evaluateRating(db, {
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
  const before = await snapshot();
  assert.equal(before.cards.length, oldIds.length);
  assert.equal(before.reviews.length, oldIds.length * 2);
  await zam.installKvtTile(db, cell);
  const installed = await snapshot();
  assert.deepEqual(
    installed.cards,
    before.cards,
    "install invents no enrolment or mastery",
  );
  assert.deepEqual(
    installed.reviews,
    before.reviews,
    "every review stays unchanged",
  );
  assert.deepEqual(
    installed.replacements,
    before.replacements,
    "no transfer declared",
  );
  for (const token of before.tokens)
    assert.deepEqual(
      installed.tokens.find((candidate) => candidate.id === token.id),
      token,
      "old tokens untouched",
    );
  for (const id of oldIds)
    assert.equal((await zam.getTokenById(db, id)).deprecated_at, null);
  const queue = await zam.buildReviewQueue(db, {
    userId,
    tokenIds: oldIds,
    now: new Date("2030-01-01T00:00:00Z"),
    buryNewSiblings: false,
    buryReviewSiblings: false,
  });
  assert.equal(queue.items.length, oldIds.length, "every old card stays active");
  const atoms = cell.atoms.map((atom) => atom.id);
  assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
    cardsCreated: itemCount,
    cardsReused: 0,
  });
  const complete = await snapshot();
  assert.equal(complete.cards.length, oldIds.length + itemCount);
  assert.deepEqual(complete.reviews, before.reviews);
  for (const card of before.cards)
    assert.deepEqual(
      complete.cards.find((candidate) => candidate.id === card.id),
      card,
    );
  for (const card of complete.cards.filter(
    (card) => !oldIds.includes(card.token_id),
  )) {
    assert.equal(card.state, "new");
    assert.equal(card.stability, 0);
    assert.equal(card.reps, 0);
    assert.equal(card.last_review_at, null);
  }
  await zam.installKvtTile(db, cell);
  assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
    cardsCreated: 0,
    cardsReused: itemCount,
  });
  assert.deepEqual(
    await snapshot(),
    complete,
    "repeated install and enrolment change nothing",
  );
  console.log(
    `ok   Französisch 9 public cell: ${oldIds.length} old cards active; all FSRS fields and ${before.reviews.length} reviews unchanged; ${itemCount} fresh unlearned cards; repeat install/enrolment idempotent`,
  );
} finally {
  await db.close();
}

// Collision protection: a learner who already holds a card on a token the cell tries to
// take over must never get an automatic merge. Reached only through an explicit
// replaces declaration, which this cell does not make; the probe shows the guard holds.
const collision = await zam.openDatabase({
  dbPath: join(dir, "collision.db"),
  initialize: true,
  useConfiguredCloud: false,
});
try {
  for (const tile of oldCells) await zam.installKvtTile(collision, tile);
  await zam.installKvtTile(collision, cell);
  const userId = cell.atoms[0].id;
  const oldId = oldIds[0];
  const successor = cell.atoms[0].practice_items[0];
  const reviewed = async (tokenId, rating) => {
    const card = await zam.ensureCard(collision, tokenId, userId);
    await zam.evaluateRating(collision, {
      cardId: card.id,
      tokenId,
      userId,
      rating,
      answerFormat: "recall",
      responseTimeMs: 2400,
      now: new Date("2026-09-10T00:00:00Z"),
    });
  };
  await reviewed(oldId, 1);
  await reviewed(successor.id, 3);
  const before = await snapshot(collision);
  const attempt = structuredClone(cell);
  attempt.version = "2026.10.99";
  attempt.atoms[0].practice_items[0].replaces = [oldId];
  await assert.rejects(
    () => zam.installKvtTile(collision, attempt),
    (error) => {
      assert.match(error.message, /holds a card on both/);
      return true;
    },
  );
  assert.deepEqual(await snapshot(collision), before);
  console.log(
    "ok   collision guard: an explicit replaces onto a doubly held token is refused and rolled back; the shipped cell declares none",
  );
} finally {
  await collision.close();
  rmSync(dir, { recursive: true, force: true });
}
