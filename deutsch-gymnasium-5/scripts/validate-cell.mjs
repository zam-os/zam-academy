// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(
	readFileSync(new URL("../cell.json", import.meta.url), "utf8"),
);
const dir = mkdtempSync(join(tmpdir(), "zam-german-gym5-"));
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT id FROM cards").all()).length,
		0,
		"installation must not enrol",
	);
	const user = tile.atoms[0].id,
		items = tile.atoms.flatMap((a) => a.practice_items);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	}
	assert.equal(items.length, 92);
	const first = await zam.ensureCard(db, items[0].id, user);
	await zam.evaluateRating(db, {
		cardId: first.id,
		tokenId: items[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-14T12:00:00Z"),
	});
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 92);
	assert.equal(before.reviews.length, 1);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(), before);
	}
	// Installation must leave every existing legacy retrieval and its evidence
	// alone. The proposal file grants neither replacement nor retirement.
	const mapping = JSON.parse(
		readFileSync(new URL("../replaces-de-by.json", import.meta.url), "utf8"),
	);
	const oldItems = [];
	for (const source of mapping.sources) {
		const old = JSON.parse(
			readFileSync(new URL(`../${source.file}`, import.meta.url), "utf8"),
		);
		await zam.installKvtTile(db, old);
		for (const atom of old.atoms)
			for (const item of atom.practice_items) {
				await zam.ensureCard(db, item.id, user);
				oldItems.push(item);
			}
	}
	assert.equal(oldItems.length, 16);
	const oldCard = await zam.ensureCard(db, oldItems[0].id, user);
	await zam.evaluateRating(db, {
		cardId: oldCard.id,
		tokenId: oldItems[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-14T12:00:00Z"),
	});
	const mixed = await snapshot();
	assert.equal(mixed.cards.length, 108);
	assert.equal(mixed.reviews.length, 2);
	await zam.installKvtTile(db, tile);
	for (const item of items) await zam.ensureCard(db, item.id, user);
	assert.deepEqual(await snapshot(), mixed);
	console.log(
		"ok: install creates no cards; 92 fresh cards enrol; repeated install/enrol preserves recall; all 16 legacy cards and their review evidence stay unchanged.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
