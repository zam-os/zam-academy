#!/usr/bin/env node
// Runs against the same pinned published zam-core as the Academy's cell checks.
// Uses only disposable libraries. No learner library or configuration is opened.
//
// Version 2026.10.1 ships without replaces and retired_items: the mapping in
// replaces-de-by.json is a proposal that Thomas has not approved. Part 1 checks
// the shipped cell: the three old Informatik cells keep every card and review,
// installing enrols nothing, enrolment adds 87 fresh cards once. Part 2
// rehearses the proposal in memory (A/B rows replaced by their successor, C
// rows retired) so the approval decision rests on a tested migration, and
// checks that a learner holding cards on an old id and its successor makes the
// later install refuse an automatic merge.
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

assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.approved, null);
assert.equal(cell.version, "2026.10.1");
assert.equal(items.length, 87);
assert.ok(items.every((item) => !item.replaces), "the unapproved cell must not replace old cards");
assert.equal(cell.retired_items, undefined, "the unapproved cell must not retire old cards");
assert.equal(mapping.rows.length, 24);
assert.deepEqual(
	mapping.rows.map((row) => row.de_by_id).sort(),
	legacy.flatMap((tile) => tile.atoms.flatMap((atom) => atom.practice_items.map((item) => item.id))).sort(),
	"every old item is mapped exactly once",
);

/** The proposal as it would ship after approval: one successor per A/B row, C rows retired. */
function proposedVersion() {
	const copy = structuredClone(cell);
	copy.version = "2026.10.2";
	const successors = new Map(
		mapping.rows.filter((row) => row.category !== "C").map((row) => [row.academy_slug, row.de_by_id]),
	);
	for (const atom of copy.atoms)
		for (const item of atom.practice_items)
			if (successors.has(item.slug)) item.replaces = [successors.get(item.slug)];
	copy.retired_items = mapping.rows
		.filter((row) => row.category === "C")
		.map((row) => ({ id: row.de_by_id, reason: row.reason }));
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
	// Part 1: the shipped cell leaves every old history alone.
	{
		const { db, userId } = await libraryWithHistories("shipped.db");
		try {
			const before = await snapshot(db);
			assert.equal(before.cards.length, 24);
			assert.equal(before.reviews.length, 48);
			for (let i = 0; i < 2; i++) {
				await zam.installKvtTile(db, cell);
				assert.deepEqual(await snapshot(db), before, "installing the cell must not enrol or alter personal cards");
			}
			for (const row of mapping.rows) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(token && !token.deprecated_at, "old cards stay active until the mapping is approved");
			}
			let created = 0;
			for (let round = 0; round < 5; round++) {
				const step = await zam.materialiseKvtCards(db, userId, atomIds);
				created += step.cardsCreated;
				if (step.cardsCreated === 0) break;
			}
			assert.equal(created, items.length);
			const enrolled = await snapshot(db);
			assert.equal(enrolled.cards.length, 24 + items.length);
			assert.deepEqual(enrolled.reviews, before.reviews, "enrolment invents no review evidence");
			const freshIds = new Set(items.map((item) => item.id));
			for (const card of enrolled.cards.filter((c) => freshIds.has(c.token_id))) {
				assert.equal(card.reps, 0);
				assert.equal(card.stability, 0);
			}
			await zam.installKvtTile(db, cell);
			assert.deepEqual(await zam.materialiseKvtCards(db, userId, atomIds), { cardsCreated: 0, cardsReused: items.length });
			assert.deepEqual(await snapshot(db), enrolled, "repeated installation and enrolment must be idempotent");
			for (const item of items) {
				const token = await zam.getTokenById(db, item.id);
				assert.equal(token.source_link, item.source_link);
			}
			console.log(
				"ok   Informatik 8 (2026.10.1): 24 old cards and 48 reviews unchanged and active; 87 fresh cards start unlearned; install and enrolment repeat safely",
			);
		} finally {
			await db.close();
		}
	}

	// Part 2: rehearse the proposed mapping and its collision guard.
	{
		const proposal = proposedVersion();
		const { db } = await libraryWithHistories("proposal.db");
		try {
			const before = await snapshot(db);
			await zam.installKvtTile(db, proposal);
			const after = await snapshot(db);
			assert.equal(after.cards.length, before.cards.length);
			const expected = new Map(
				mapping.rows.filter((row) => row.category !== "C").map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
			);
			assert.equal(expected.size, 11);
			for (const oldCard of before.cards) {
				const fresh = after.cards.find((card) => card.id === oldCard.id);
				assert.deepEqual(withoutToken(fresh), withoutToken(oldCard), `FSRS state changed on ${oldCard.token_id}`);
				assert.equal(fresh.token_id, expected.get(oldCard.token_id) ?? oldCard.token_id);
			}
			for (const row of mapping.rows) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(token?.deprecated_at, "superseded and retired old items leave active use");
			}
			await zam.installKvtTile(db, proposal);
			assert.deepEqual(await snapshot(db), after, "a repeated install preserves every schedule and review");
			console.log("ok   Proposal (rehearsal only): 11 histories would move to their successors, 13 old cards would retire with their reviews kept");
		} finally {
			await db.close();
		}

		const collision = await zam.openDatabase({ dbPath: join(dir, "collision.db"), initialize: true, useConfiguredCloud: false });
		try {
			await zam.installKvtTile(collision, cell);
			for (const tile of legacy) await zam.installKvtTile(collision, tile);
			const row = mapping.rows.find((entry) => entry.category === "A");
			const userId = cell.atoms[1].id;
			await reviewedCard(collision, row.de_by_id, userId, 1);
			await reviewedCard(collision, bySlug.get(row.academy_slug).id, userId, 3);
			const before = await snapshot(collision);
			// Matches zam-core 0.54.0's wording; check it again when the pinned version is raised.
			await assert.rejects(() => zam.installKvtTile(collision, proposal), /holds a card on both|merge/i);
			assert.deepEqual(await snapshot(collision), before, "a collision must leave both histories intact");
			console.log("ok   Proposal (rehearsal only): a learner with cards on an old id and its successor makes the later install refuse an automatic merge");
		} finally {
			await collision.close();
		}
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}
