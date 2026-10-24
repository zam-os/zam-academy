#!/usr/bin/env node
// Rehearse only in throw-away databases. Neither the cell nor the approval
// record is changed; no learner library is opened.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (file) => JSON.parse(readFileSync(join(root, file), "utf8"));
const cell = read("cell.json"),
	mapping = read("replaces-de-by.json");
assert.equal(mapping.approved, null);
const items = cell.atoms.flatMap((atom) => atom.practice_items);
assert.ok(items.every((item) => !item.replaces?.length));
assert.ok(!cell.retired_items?.length);
const old = mapping.sources.map((source) => {
	const bytes = readFileSync(join(root, source.file));
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	return JSON.parse(bytes);
});
const proposal = structuredClone(cell);
proposal.version = "2026.10.2";
const bySlug = new Map(
	proposal.atoms
		.flatMap((atom) => atom.practice_items)
		.map((item) => [item.slug, item]),
);
const targets = new Map();
// Rehearse C retirements only in memory, alongside the proposed A transfers.
proposal.retired_items = mapping.rows
	.filter((row) => row.category === "C")
	.map((row) => ({ id: row.de_by_id, reason: row.reason }));
for (const row of mapping.rows) {
	if (row.category === "C") {
		assert.equal(row.academy_slug, null);
		continue;
	}
	assert.equal(row.category, "A");
	const item = bySlug.get(row.academy_slug);
	assert.ok(item && !item.replaces);
	item.replaces = [row.de_by_id];
	targets.set(row.de_by_id, item.id);
}
assert.equal(targets.size, 3);
const dir = mkdtempSync(join(tmpdir(), "zam-english9-proposal-"));
const userId = cell.atoms[0].id;
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const withoutToken = ({ token_id, ...rest }) => rest;
async function open(name) {
	const db = await zam.openDatabase({
		dbPath: join(dir, `${name}.db`),
		initialize: true,
		useConfiguredCloud: false,
	});
	for (const tile of old) await zam.installKvtTile(db, tile);
	return db;
}
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
				now: new Date(Date.UTC(2026, 9, 20 + day)),
			});
	}
}
try {
	for (const [name, tile, transfers] of [
		["unchanged-draft", cell, new Map()],
		["in-memory-rehearsal", proposal, targets],
	]) {
		const db = await open(name);
		try {
			await seed(
				db,
				mapping.rows.map((row) => row.de_by_id),
			);
			const before = await snapshot(db);
			assert.equal(before.cards.length, 8);
			assert.equal(before.reviews.length, 16);
			const oldIds = mapping.rows.map((row) => row.de_by_id);
			const queueOptions = {
				userId,
				tokenIds: oldIds,
				now: new Date(
					Math.max(...before.cards.map((card) => Date.parse(card.due_at))) +
						86_400_000,
				),
				buryNewSiblings: false,
				buryReviewSiblings: false,
			};
			assert.equal(
				(await zam.buildReviewQueue(db, queueOptions)).items.length,
				8,
				"All old cards must be eligible before the rehearsal",
			);
			await zam.installKvtTile(db, tile);
			const after = await snapshot(db);
			assert.equal(after.cards.length, 8);
			assert.equal(after.reviews.length, 16);
			for (const [key, records] of Object.entries(before))
				for (const original of records) {
					const current = after[key].find(
						(record) => record.id === original.id,
					);
					assert.ok(current);
					assert.deepEqual(withoutToken(current), withoutToken(original));
					assert.equal(
						current.token_id,
						transfers.get(original.token_id) ?? original.token_id,
					);
				}
			for (const row of mapping.rows) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(token, "Old knowledge and review evidence are never deleted");
				assert.equal(
					Boolean(token.deprecated_at),
					transfers.size > 0,
					"Only the in-memory proposal removes superseded and corrected items from active use",
				);
				if (transfers.size > 0 && row.category === "C")
					assert.equal(token.editorial_state, "deprecated");
			}
			assert.equal(
				(await zam.buildReviewQueue(db, queueOptions)).items.length,
				transfers.size > 0 ? 0 : 8,
				"Rehearsed retirements leave active reviews; the published cell keeps all old cards active",
			);
			await zam.installKvtTile(db, tile);
			assert.deepEqual(
				await snapshot(db),
				after,
				"Installation is repeatable and reschedules nothing",
			);
			const atoms = tile.atoms.map((atom) => atom.id);
			let previous = after;
			for (let pass = 0; pass < 3; pass++) {
				const result = await zam.materialiseKvtCards(db, userId, atoms);
				const current = await snapshot(db);
				for (const card of previous.cards)
					assert.deepEqual(
						current.cards.find((entry) => entry.id === card.id),
						card,
					);
				assert.deepEqual(
					current.reviews,
					before.reviews.map((review) => ({
						...review,
						token_id: transfers.get(review.token_id) ?? review.token_id,
					})),
				);
				previous = current;
				if (result.cardsCreated === 0) break;
				assert.ok(pass < 2, "Enrolment must converge");
			}
			const final = await snapshot(db),
				oldCardIds = new Set(before.cards.map((card) => card.id));
			for (const fresh of final.cards.filter(
				(card) => !oldCardIds.has(card.id),
			)) {
				assert.equal(fresh.state, "new");
				assert.equal(fresh.stability, 0);
				assert.equal(fresh.reps, 0);
				assert.equal(fresh.last_review_at, null);
			}
			assert.equal(
				final.cards.filter((card) =>
					items.some((item) => item.id === card.token_id),
				).length,
				80,
			);
			assert.deepEqual(await zam.materialiseKvtCards(db, userId, atoms), {
				cardsCreated: 0,
				cardsReused: 80,
			});
			assert.deepEqual(await snapshot(db), final);
			console.log(
				`ok   ${name}: 8 card states / 16 review events intact; ${transfers.size} rehearsed transfers; ${transfers.size ? "8 old items leave active reviews" : "8 old items remain active"}; fresh cards have no mastery`,
			);
		} finally {
			await db.close();
		}
	}
	const db = await open("collision");
	try {
		await zam.installKvtTile(db, cell);
		const row = mapping.rows.find((entry) => entry.category === "A");
		await seed(db, [row.de_by_id, bySlug.get(row.academy_slug).id]);
		const before = await snapshot(db);
		await assert.rejects(
			() => zam.installKvtTile(db, proposal),
			/holds a card on both|merge/i,
		);
		assert.deepEqual(
			await snapshot(db),
			before,
			"A collision preserves both complete histories",
		);
		console.log(
			"ok   proposed transfer refuses to merge two existing histories; committed proposal stays unapproved",
		);
	} finally {
		await db.close();
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}
