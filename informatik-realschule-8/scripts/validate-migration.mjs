#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Since version 2026.10.2 the cell ships the mapping Thomas approved on 2026-10-27
// (replaces-de-by.json): each of the 10 A rows and the 1 B row is replaced by
// its one successor, the 13 C rows are retired. Part 1 installs the cell over
// the three old Informatik cells with reviewed cards: eleven histories move
// unchanged, every old id leaves active reviews, enrolment adds only the
// missing fresh cards, and repeated installs change nothing. Part 2 checks
// that a learner holding cards on an old id and its successor (from an
// install without the mapping) makes the install refuse an automatic merge.
// Part 3 upgrades a library from 2026.10.2 (bound to grade 8 only) to 2026.10.3
// (grades 6, 7 and 8): the new bindings move no card and change no review.
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
const dir = mkdtempSync(join(tmpdir(), "zam-it8-migration-"));
const withoutToken = ({ token_id, ...rest }) => rest;

assert.equal(mapping.status, "approved");
assert.equal(mapping.approved, "2026-10-27");
assert.equal(cell.version, "2026.10.3");
assert.equal(items.length, 87);
assert.equal(mapping.rows.length, 24);
assert.deepEqual(
	mapping.rows.map((row) => row.de_by_id).sort(),
	legacy.flatMap((tile) => tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id))).sort(),
	"every old item is mapped exactly once",
);
const expected = new Map(
	mapping.rows.filter((row) => row.category !== "C").map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
);
assert.equal(expected.size, 11);
assert.deepEqual(
	new Map(items.filter((item) => item.replaces).map((item) => [item.replaces[0], item.id])),
	expected,
	"the cell replaces exactly the approved A/B rows",
);
assert.deepEqual(
	cell.retired_items.map((entry) => entry.id).sort(),
	mapping.rows.filter((row) => row.category === "C").map((row) => row.de_by_id).sort(),
	"the cell retires exactly the approved C rows",
);

/** The published 2026.10.2: the same cell, bound to LehrplanPLUS grade 8 only. */
function gradeEightOnly() {
	const copy = structuredClone(cell);
	copy.version = "2026.10.2";
	for (const atom of copy.atoms) {
		atom.curricula = atom.curricula.filter((entry) => entry.provider !== "lehrplanplus-bayern" || entry.grade === 8);
	}
	return copy;
}

/** The same cell before the mapping: no replaces, no retired items. */
function withoutMapping() {
	const copy = structuredClone(cell);
	copy.version = "2026.10.1";
	delete copy.retired_items;
	for (const atom of copy.atoms) for (const item of atom.practice_items) delete item.replaces;
	return copy;
}

async function reviewedCard(db, tokenId, userId, index) {
	const card = await zam.ensureCard(db, tokenId, userId);
	const now = new Date(Date.UTC(2026, 9, 20));
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
	const db = await zam.openDatabase({ dbPath: join(dir, name), initialize: true, useConfiguredCloud: false });
	for (const tile of legacy) await zam.installKvtTile(db, tile);
	const userId = cell.atoms[0].id;
	for (const [index, row] of mapping.rows.entries()) await reviewedCard(db, row.de_by_id, userId, index);
	return { db, userId };
}

try {
	// Part 1: the approved mapping moves eleven histories and retires thirteen old cards.
	{
		const { db, userId } = await libraryWithHistories("approved.db");
		try {
			const before = await snapshot(db);
			assert.equal(before.cards.length, 24);
			assert.equal(before.reviews.length, 48);
			await zam.installKvtTile(db, cell);
			const after = await snapshot(db);
			assert.equal(after.cards.length, before.cards.length, "installing enrols nothing");
			assert.deepEqual(after.reviews.map(withoutToken), before.reviews.map(withoutToken), "every review is kept unchanged");
			for (const review of before.reviews) {
				const moved = after.reviews.find((entry) => entry.id === review.id);
				assert.equal(moved.token_id, expected.get(review.token_id) ?? review.token_id, "a review follows its card");
			}
			for (const oldCard of before.cards) {
				const fresh = after.cards.find((card) => card.id === oldCard.id);
				assert.deepEqual(withoutToken(fresh), withoutToken(oldCard), `FSRS state changed on ${oldCard.token_id}`);
				assert.equal(fresh.token_id, expected.get(oldCard.token_id) ?? oldCard.token_id);
			}
			for (const row of mapping.rows) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(token?.deprecated_at, `${row.de_by_id} leaves active reviews`);
			}
			await zam.installKvtTile(db, cell);
			assert.deepEqual(await snapshot(db), after, "a repeated install preserves every schedule and review");
			let created = 0;
			for (let round = 0; round < 5; round++) {
				const step = await zam.materialiseKvtCards(db, userId, atomIds);
				created += step.cardsCreated;
				if (step.cardsCreated === 0) break;
			}
			assert.equal(created, items.length - expected.size, "enrolment adds only the cards without a moved history");
			const enrolled = await snapshot(db);
			assert.deepEqual(enrolled.reviews, after.reviews, "enrolment invents no review evidence");
			await zam.installKvtTile(db, cell);
			assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
				cardsCreated: 0,
				cardsReused: items.length,
			});
			assert.deepEqual(await snapshot(db), enrolled, "repeated installation and enrolment must be idempotent");
			for (const item of items) {
				const token = await zam.getTokenById(db, item.id);
				assert.equal(token.source_link, item.source_link);
			}
			console.log(
				"ok   Informatik 8 (2026.10.3): 11 histories move to their successors, 13 old cards retire, 48 reviews kept; enrolment adds 76 fresh cards; install and enrolment repeat safely",
			);
		} finally {
			await db.close();
		}
	}

	// Part 2: a learner with cards on an old id and its successor blocks the automatic merge.
	{
		const collision = await zam.openDatabase({ dbPath: join(dir, "collision.db"), initialize: true, useConfiguredCloud: false });
		try {
			for (const tile of legacy) await zam.installKvtTile(collision, tile);
			await zam.installKvtTile(collision, withoutMapping());
			const row = mapping.rows.find((entry) => entry.category === "A");
			const userId = cell.atoms[1].id;
			await reviewedCard(collision, row.de_by_id, userId, 1);
			await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
			const before = await snapshot(collision);
			// Matches zam-core 0.54.0's wording; check it again when the pinned version is raised.
			await assert.rejects(() => zam.installKvtTile(collision, cell), /holds a card on both|merge/i);
			assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
			console.log("ok   Informatik 8 (2026.10.3): a learner with cards on an old id and its successor makes the install refuse an automatic merge");
		} finally {
			await collision.close();
		}
	}

	// Part 3: upgrading from 2026.10.2 adds the grade 6 and 7 bindings and nothing else.
	{
		const { db, userId } = await libraryWithHistories("upgrade.db");
		try {
			await zam.installKvtTile(db, gradeEightOnly());
			for (let round = 0; round < 5; round++) {
				if ((await zam.materialiseKvtCards(db, userId, atomIds)).cardsCreated === 0) break;
			}
			const before = await snapshot(db);
			await zam.installKvtTile(db, cell);
			assert.deepEqual(await snapshot(db), before, "the upgrade keeps every card, schedule and review");
			assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), {
				cardsCreated: 0,
				cardsReused: items.length,
			});
			assert.deepEqual(await snapshot(db), before, "enrolment after the upgrade adds nothing");
			console.log(
				`ok   Informatik 8 (2026.10.2 → 2026.10.3): the upgrade keeps all ${before.cards.length} cards and ${before.reviews.length} reviews unchanged and enrols nothing new`,
			);
		} finally {
			await db.close();
		}
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}
