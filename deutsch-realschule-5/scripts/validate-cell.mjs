// Use disposable libraries to verify that the proposal changes no reviews.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.sources.length, 2);
assert.ok(!("retired_items" in tile));
const newItems = tile.atoms.flatMap((atom) => atom.practice_items);
assert.ok(newItems.every((item) => !("replaces" in item)));
const legacy = mapping.sources.map((source) => {
	const bytes = read(source.file);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	const cell = JSON.parse(bytes);
	assert.equal(source.tile_id, cell.tile_id);
	assert.equal(source.version, cell.version);
	const items = cell.atoms.flatMap((atom) => atom.practice_items);
	assert.deepEqual(
		mapping.rows.filter((row) => row.de_by_cell === cell.tile_id)
			.map((row) => row.de_by_id).sort(),
		items.map((item) => item.id).sort(),
	);
	return { cell, items };
});
const directory = mkdtempSync(join(tmpdir(), "zam-deutsch5-"));
const userId = tile.atoms[0].id;
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(directory, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	for (const { cell, items } of legacy) {
		await zam.installKvtTile(db, cell);
		for (const { id: tokenId } of items) {
			const card = await zam.ensureCard(db, tokenId, userId);
			for (const day of [1, 2]) {
				await zam.evaluateRating(db, {
					cardId: card.id,
					tokenId,
					userId,
					rating: 3,
					answerFormat: "recall",
					now: new Date(Date.UTC(2026, 10, day)),
				});
			}
		}
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, 16);
	assert.equal(before.reviews.length, 32);
	await zam.installKvtTile(db, tile);
	assert.deepEqual(await snapshot(db), before);
	const enroll = async () => {
		for (const item of newItems) await zam.ensureCard(db, item.id, userId);
	};
	await enroll();
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, 16 + newItems.length);
	assert.deepEqual(enrolled.reviews, before.reviews);
	for (const card of before.cards) {
		assert.deepEqual(enrolled.cards.find((current) => current.id === card.id), card);
	}
	for (const item of newItems) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	await zam.installKvtTile(db, tile);
	await enroll();
	assert.deepEqual(await snapshot(db), enrolled);
	console.log(`ok: ${newItems.length} new cards, 16 legacy cards and 32 reviews preserved, repeated installation and enrollment are idempotent.`);
} finally {
	if (db) await db.close();
	rmSync(directory, { recursive: true, force: true });
}
