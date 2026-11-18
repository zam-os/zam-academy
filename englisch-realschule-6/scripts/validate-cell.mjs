// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (p) => JSON.parse(readFileSync(new URL(p, import.meta.url), "utf8"));
const tile = read("../cell.json");
const legacy6 = read("../tests/fixtures/de-by-realschule-6-englisch-grammatik-grundlagen-kvt.json");
const legacy7 = read("../tests/fixtures/de-by-realschule-7-englisch-grammatik-tenses-kvt.json");

const dir = mkdtempSync(join(tmpdir(), "zam-english6-rs-"));
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, legacy6);
	await zam.installKvtTile(db, legacy7);
	const user = tile.atoms[0].id;
	const legacyItems = [
		...legacy6.atoms.flatMap((a) => a.practice_items),
		...legacy7.atoms.flatMap((a) => a.practice_items),
	];
	for (const item of legacyItems) {
		await zam.ensureCard(db, item.id, user);
	}
	await zam.evaluateRating(db, {
		cardId: (await zam.ensureCard(db, legacyItems[0].id, user)).id,
		tokenId: legacyItems[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-17T12:00:00Z"),
	});
	const legacySnapshot = async () => ({
		cards: await db
			.prepare("SELECT * FROM cards WHERE token_id LIKE '01K4E%' ORDER BY id")
			.all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const legacyBefore = await legacySnapshot();

	await zam.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT id FROM cards").all()).length,
		legacyItems.length,
		"installation must not auto-enrol new academy cards",
	);

	const items = tile.atoms.flatMap((a) => a.practice_items);
	assert.equal(items.length, 126);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	}
	assert.deepEqual(await legacySnapshot(), legacyBefore);

	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 126 + legacyItems.length);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(), before);
	}
	console.log(
		`ok: 126 fresh cards enrol without side effects; all ${legacyItems.length} legacy cards and review logs stay intact across repeated installs.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
