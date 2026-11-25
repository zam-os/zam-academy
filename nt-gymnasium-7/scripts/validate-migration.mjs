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
	const bytes = read(source.file ?? source.fixture);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	return JSON.parse(bytes);
});
const oldItems = oldTiles.flatMap((tile) => tile.atoms.flatMap((atom) => atom.practice_items));
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const oldId = (row) => row.old_id ?? row.de_by_id;
const approved = new Map(
	mapping.rows
		.filter((row) => row.action === "replace")
		.map((row) => [oldId(row), items.find((item) => item.slug === row.academy_slug).id]),
);
assert.deepEqual(mapping.rows.map(oldId).sort(), oldItems.map((item) => item.id).sort());
assert.deepEqual(
	items.flatMap((item) => (item.replaces ?? []).map((old) => [old, item.id])).sort(),
	[...approved].sort(),
);
assert.deepEqual(cell.retired_items ?? [], []);

const dir = mkdtempSync(join(tmpdir(), "zam-approved-migration-"));
let db;
try {
	db = await zam.openDatabase({ dbPath: join(dir, "library.db"), initialize: true, useConfiguredCloud: false });
	await zam.installKvtTile(db, cell);
	assert.equal((await db.prepare("SELECT id FROM cards").all()).length, 0);
	const freshUser = "fresh-learner";
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, freshUser);
		assert.equal(card.reps, 0);
		assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
	}
	await db.close();
	db = await zam.openDatabase({ dbPath: join(dir, "history.db"), initialize: true, useConfiguredCloud: false });
	for (const tile of oldTiles) await zam.installKvtTile(db, tile);
	const userId = cell.atoms[0].id;
	for (const item of oldItems) {
		const card = await zam.ensureCard(db, item.id, userId);
		await zam.evaluateRating(db, {
			cardId: card.id,
			tokenId: item.id,
			userId,
			rating: 3,
			answerFormat: "recall",
			now: new Date("2026-11-21T12:00:00Z"),
		});
	}
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, oldItems.length);
	assert.equal(before.reviews.length, oldItems.length);
	const rebind = (rows) => rows.map((row) => ({
		...row,
		token_id: approved.get(row.token_id) ?? row.token_id,
	}));
	await zam.installKvtTile(db, cell);
	const after = await snapshot();
	assert.deepEqual(after.cards, rebind(before.cards));
	assert.deepEqual(after.reviews, rebind(before.reviews));
	for (const { id } of oldItems)
		assert.equal(Boolean((await zam.getTokenById(db, id)).deprecated_at), approved.has(id));
	await zam.installKvtTile(db, cell);
	assert.deepEqual(await snapshot(), after);

	// Simulate a learner who took the earlier Academy edition before approval.
	const earlier = { ...cell, version: "2026.11.1", atoms: cell.atoms.map((atom) => ({
		...atom,
		practice_items: atom.practice_items.map(({ replaces, ...item }) => item),
	})) };
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
		await assert.rejects(() => zam.installKvtTile(conflictDb, cell), /card|collision|merge/i);
	} finally {
		await conflictDb.close();
	}
	console.log(`ok: ${approved.size} histories move and ${oldItems.length - approved.size} remain active. Reinstallation preserves the database and a collision is rejected.`);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
