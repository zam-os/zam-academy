// Uses disposable libraries only. The shipped cell adds fresh cards and must
// leave the four old Englisch-8 cards and their reviews untouched. The proposed
// A row is rehearsed on an in-memory copy of the cell; neither cell.json nor
// replaces-de-by.json is changed, and no learner library is opened.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
	readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);
const source = mapping.sources[0];
const snapshotBytes = readFileSync(join(root, source.file));
const legacy = JSON.parse(snapshotBytes.toString("utf8"));
assert.equal(
	createHash("sha256").update(snapshotBytes).digest("hex"),
	source.sha256,
);
assert.equal(source.tile_id, legacy.tile_id);
assert.equal(source.version, legacy.version);
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.equal(tile.retired_items, undefined);
const items = tile.atoms.flatMap((atom) => atom.practice_items);
assert.ok(items.every((item) => !item.replaces));
const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);
const oldById = new Map(oldItems.map((item) => [item.id, item]));
assert.equal(mapping.rows.length, oldItems.length);
assert.deepEqual(
	new Set(mapping.rows.map((row) => row.de_by_id)),
	new Set(oldById.keys()),
);
for (const row of mapping.rows) {
	assert.equal(row.de_by_cell, legacy.tile_id);
	assert.equal(
		row.de_by_question,
		zam.kvtItemPlainTexts(oldById.get(row.de_by_id)).question,
	);
	if (row.category === "C") {
		assert.equal(row.academy_slug, null);
		assert.equal(row.action, "keep-active");
	} else {
		assert.equal(row.category, "A");
		assert.equal(row.action, "propose-replace-after-approval");
	}
}
const proposed = mapping.rows.filter((row) => row.category === "A");
assert.equal(proposed.length, 1);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const transfers = new Map(
	proposed.map((row) => [row.de_by_id, bySlug.get(row.academy_slug).id]),
);

// What an approved later version would declare: only the named A successor.
const approvedCell = structuredClone(tile);
approvedCell.version = "2026.10.2";
for (const atom of approvedCell.atoms)
	for (const item of atom.practice_items) {
		const row = proposed.find((entry) => entry.academy_slug === item.slug);
		if (row) item.replaces = [row.de_by_id];
	}

const dir = mkdtempSync(join(tmpdir(), "zam-englisch8-"));
const user = tile.atoms[0].id;
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
	await zam.installKvtTile(db, legacy);
	return db;
}
async function seed(db, ids) {
	for (const tokenId of ids) {
		const card = await zam.ensureCard(db, tokenId, user);
		for (const day of [0, 1])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 9, 24 + day)),
			});
	}
}
const ids = items.map((item) => item.id);
try {
	// 1. The shipped cell: no history moves, fresh cards start without mastery.
	let db = await open("shipped");
	try {
		await seed(db, [...oldById.keys()]);
		const before = await snapshot(db);
		assert.equal(before.cards.length, 4);
		assert.equal(before.reviews.length, 8);
		for (let attempt = 0; attempt < 2; attempt++) {
			await zam.installKvtTile(db, tile);
			assert.deepEqual(
				await snapshot(db),
				before,
				"installation must preserve existing cards and every review without enrolling new cards",
			);
		}
		for (const id of oldById.keys()) {
			const token = await zam.getTokenById(db, id);
			assert.ok(token);
			assert.ok(!token.deprecated_at, "old cards stay active");
		}
		for (const id of ids) await zam.ensureCard(db, id, user);
		const enrolled = await snapshot(db);
		assert.equal(enrolled.cards.length, 4 + items.length);
		assert.equal(enrolled.reviews.length, 8);
		for (const old of before.cards)
			assert.deepEqual(
				enrolled.cards.find((card) => card.id === old.id),
				old,
				"existing FSRS state must stay identical",
			);
		for (const card of enrolled.cards.filter((card) =>
			ids.includes(card.token_id),
		)) {
			assert.equal(card.reps, 0);
			assert.equal(card.stability, 0);
		}
		await zam.installKvtTile(db, tile);
		for (const id of ids) await zam.ensureCard(db, id, user);
		assert.deepEqual(
			await snapshot(db),
			enrolled,
			"repeated installation and card creation must be idempotent",
		);
		for (const item of items) {
			const token = await zam.getTokenById(db, item.id);
			assert.equal(token.source_link, item.source_link);
		}
		console.log(
			`ok   shipped cell: ${tile.atoms.length} atoms / ${items.length} new cards; four Englisch-8 histories and eight reviews unchanged and active; installation and card creation repeat safely.`,
		);
	} finally {
		await db.close();
	}

	// 2. Rehearsal of the proposal: first install and upgrade from the shipped cell.
	for (const name of ["proposal-first-install", "proposal-upgrade"]) {
		db = await open(name);
		try {
			if (name === "proposal-upgrade") await zam.installKvtTile(db, tile);
			await seed(db, [...oldById.keys()]);
			const before = await snapshot(db);
			await zam.installKvtTile(db, approvedCell);
			const after = await snapshot(db);
			assert.equal(after.cards.length, before.cards.length);
			assert.equal(after.reviews.length, before.reviews.length);
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
						"only the A row moves its history, unchanged, to its one successor",
					);
				}
			for (const row of mapping.rows.filter((entry) => entry.category === "C")) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(!token.deprecated_at, "C rows stay active");
			}
			await zam.installKvtTile(db, approvedCell);
			assert.deepEqual(await snapshot(db), after, "repeatable");
			console.log(
				`ok   ${name}: the A history (2 reviews) moves unchanged to e8-if-type3-check; three C cards stay active; repeat install changes nothing.`,
			);
		} finally {
			await db.close();
		}
	}

	// 3. A learner who already reviews both ids must not be merged automatically.
	db = await open("collision");
	try {
		await zam.installKvtTile(db, tile);
		const [oldId, newId] = [...transfers.entries()][0];
		await seed(db, [oldId, newId]);
		const before = await snapshot(db);
		await assert.rejects(
			() => zam.installKvtTile(db, approvedCell),
			/holds a card on both|merge/i,
		);
		assert.deepEqual(
			await snapshot(db),
			before,
			"a collision preserves both complete histories",
		);
		console.log(
			"ok   collision: a learner holding cards on the old id and its successor makes the approved version refuse; both histories stay intact.",
		);
	} finally {
		await db.close();
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}
