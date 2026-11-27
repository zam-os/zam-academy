// Uses disposable libraries only. Thomas approved two history transfers on
// 2026-11-21 (replaces-de-by.json): the two histories move unchanged to their
// successors, the old ids leave active reviews, all other legacy cards keep
// their histories, repeated installs change nothing, and a learner who holds
// cards on both an old id and its successor makes the install refuse an
// automatic merge.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-migration.mjs
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const cell = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");

assert.equal(mapping.status, "approved");
assert.match(mapping.approved, /^\d{4}-\d{2}-\d{2}$/);
const oldTiles = mapping.sources.map((source) => {
	const bytes = read(source.file);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	const tile = JSON.parse(bytes.toString("utf8"));
	assert.equal(tile.tile_id, source.tile_id);
	assert.equal(tile.version, source.version);
	return tile;
});
const oldItems = oldTiles.flatMap((tile) =>
	tile.atoms.flatMap((atom) => atom.practice_items),
);
const oldById = new Map(oldItems.map((item) => [item.id, item]));
const items = cell.atoms.flatMap((atom) => atom.practice_items);
assert.deepEqual(
	mapping.rows.map((row) => row.de_by_id).sort(),
	[...oldById.keys()].sort(),
);
for (const row of mapping.rows) {
	assert.ok(["replace", "keep-active"].includes(row.action), row.de_by_id);
	assert.equal(
		row.de_by_question,
		zam.kvtItemPlainTexts(oldById.get(row.de_by_id)).question,
	);
}
const approved = new Map(
	mapping.rows
		.filter((row) => row.action === "replace")
		.map((row) => {
			const successor = items.find((item) => item.slug === row.academy_slug);
			// A category A successor asks the same retrieval, word for word.
			assert.equal(
				zam.kvtItemPlainTexts(successor).question,
				row.de_by_question,
			);
			return [row.de_by_id, successor.id];
		}),
);
assert.equal(approved.size, 2);
assert.deepEqual(
	items
		.flatMap((item) => (item.replaces ?? []).map((old) => [old, item.id]))
		.sort(),
	[...approved].sort(),
);
assert.deepEqual(cell.retired_items ?? [], []);

const dir = mkdtempSync(join(tmpdir(), "zam-englisch7-migration-"));
let db;
try {
	// A new learner gets fresh cards only.
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, cell);
	assert.equal((await db.prepare("SELECT id FROM cards").all()).length, 0);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, "fresh-learner");
		assert.equal(card.reps, 0);
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	}
	await db.close();

	// A learner with histories on all 16 legacy cards.
	db = await zam.openDatabase({
		dbPath: join(dir, "history.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	for (const tile of oldTiles) await zam.installKvtTile(db, tile);
	const userId = cell.atoms[0].id;
	for (const item of oldItems) {
		const card = await zam.ensureCard(db, item.id, userId);
		for (const day of [0, 1])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: item.id,
				userId,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 10, 19 + day)),
			});
	}
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 16);
	assert.equal(before.reviews.length, 32);
	const rebind = (rows) =>
		rows.map((row) => ({
			...row,
			token_id: approved.get(row.token_id) ?? row.token_id,
		}));
	await zam.installKvtTile(db, cell);
	const after = await snapshot();
	assert.deepEqual(after.cards, rebind(before.cards));
	assert.deepEqual(after.reviews, rebind(before.reviews));
	for (const { id } of oldItems)
		assert.equal(
			Boolean((await zam.getTokenById(db, id)).deprecated_at),
			approved.has(id),
		);
	await zam.installKvtTile(db, cell);
	assert.deepEqual(await snapshot(), after);

	// A learner who took a copy of the cell without replaces and then holds
	// cards on both an old id and its successor.
	const earlier = {
		...cell,
		version: "2026.11.1",
		atoms: cell.atoms.map((atom) => ({
			...atom,
			practice_items: atom.practice_items.map(({ replaces, ...item }) => item),
		})),
	};
	const conflictDb = await zam.openDatabase({
		dbPath: join(dir, "collision.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		for (const tile of oldTiles) await zam.installKvtTile(conflictDb, tile);
		await zam.installKvtTile(conflictDb, earlier);
		const [[old, next]] = approved;
		await zam.ensureCard(conflictDb, old, userId);
		await zam.ensureCard(conflictDb, next, userId);
		await assert.rejects(
			() => zam.installKvtTile(conflictDb, cell),
			/card|collision|merge/i,
		);
	} finally {
		await conflictDb.close();
	}
	console.log(
		`ok: ${approved.size} approved histories move unchanged (${after.reviews.filter((row) => [...approved.values()].includes(row.token_id)).length} reviews), ${oldItems.length - approved.size} legacy cards stay active, reinstallation changes nothing and a collision is rejected.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
