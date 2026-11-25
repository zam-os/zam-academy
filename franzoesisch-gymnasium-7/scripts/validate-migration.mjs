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
const legacyTiles = mapping.sources.map(({ file, sha256, tile_id }) => {
	const bytes = read(file);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), sha256);
	const tile = JSON.parse(bytes);
	assert.equal(tile.tile_id, tile_id);
	return tile;
});
const legacyItems = legacyTiles.flatMap((tile) =>
	tile.atoms.flatMap((atom) => atom.practice_items),
);
assert.deepEqual(
	mapping.rows.map((row) => row.de_by_id).sort(),
	legacyItems.map((item) => item.id).sort(),
);
const transferRows = mapping.rows.filter((row) => row.action === "replace");
assert.equal(transferRows.length, 1);
const [transfer] = transferRows;
assert.equal(transfer.category, "A");
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const successor = items.find((item) => item.slug === transfer.academy_slug);
assert.ok(successor);
assert.deepEqual(
	items.flatMap((item) => (item.replaces ?? []).map((old) => [old, item.id])),
	[[transfer.de_by_id, successor.id]],
);
assert.deepEqual(cell.retired_items ?? [], []);

const dir = mkdtempSync(join(tmpdir(), "zam-french7-migration-"));
const userId = cell.atoms[0].id;
async function withLibrary(file, run) {
	const db = await zam.openDatabase({
		dbPath: join(dir, file),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		for (const tile of legacyTiles) await zam.installKvtTile(db, tile);
		await run(db);
	} finally {
		await db.close();
	}
}
async function review(db, itemId) {
	const card = await zam.ensureCard(db, itemId, userId);
	await zam.evaluateRating(db, {
		cardId: card.id,
		tokenId: itemId,
		userId,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-23T12:00:00Z"),
	});
}
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});

try {
	await withLibrary("history.db", async (db) => {
		for (const item of legacyItems) await review(db, item.id);
		const before = await snapshot(db);
		assert.equal(before.cards.length, legacyItems.length);
		assert.equal(before.reviews.length, legacyItems.length);

		await zam.installKvtTile(db, cell);
		const after = await snapshot(db);
		const rebind = (rows) => rows.map((row) =>
			row.token_id === transfer.de_by_id ? { ...row, token_id: successor.id } : row,
		);
		assert.deepEqual(after.cards, rebind(before.cards));
		assert.deepEqual(after.reviews, rebind(before.reviews));
		for (const { id } of legacyItems) {
			const token = await zam.getTokenById(db, id);
			assert.equal(Boolean(token.deprecated_at), id === transfer.de_by_id);
		}
		await zam.installKvtTile(db, cell);
		assert.deepEqual(await snapshot(db), after);
	});

	// Rehearse a conflict with a learner who already has both card IDs.
	const earlier = {
		...cell,
		version: "2026.11.1",
		atoms: cell.atoms.map((atom) => ({
			...atom,
			practice_items: atom.practice_items.map(({ replaces, ...item }) => item),
		})),
	};
	await withLibrary("collision.db", async (db) => {
		await zam.installKvtTile(db, earlier);
		await review(db, transfer.de_by_id);
		await review(db, successor.id);
		const before = await snapshot(db);
		await assert.rejects(() => zam.installKvtTile(db, cell), /card|collision|merge/i);
		assert.deepEqual(await snapshot(db), before);
		assert.ok(!(await zam.getTokenById(db, transfer.de_by_id)).deprecated_at);
	});

	console.log(`ok: one reviewed history moves and ${legacyItems.length - 1} remain active. Reinstallation is idempotent and a collision preserves both histories.`);
} finally {
	rmSync(dir, { recursive: true, force: true });
}
