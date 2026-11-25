// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const root = new URL("../", import.meta.url);
const readJson = (path) => JSON.parse(readFileSync(new URL(path, root), "utf8"));

const tile = readJson("cell.json");
const legacy7 = readJson(
	"tests/fixtures/de-by-gymnasium-7-latein-aci-partizipialkonstruktionen-deklinationen-kvt.json",
);
const legacy8 = readJson(
	"tests/fixtures/de-by-gymnasium-8-latein-ablativus-absolutus-konjunktive-consecutio-kvt.json",
);

const dir = mkdtempSync(join(tmpdir(), "zam-latein7-l1-"));
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	// Pre-install legacy cells and enrol their items to confirm this proposal-only
	// cell leaves existing cards and review histories untouched.
	await zam.installKvtTile(db, legacy7);
	await zam.installKvtTile(db, legacy8);
	const user = tile.atoms[0].id;
	const legacyItems = [
		...legacy7.atoms.flatMap((a) => a.practice_items),
		...legacy8.atoms.flatMap((a) => a.practice_items),
	];
	for (const item of legacyItems) {
		await zam.ensureCard(db, item.id, user);
	}
	const legacyBefore = await db
		.prepare("SELECT * FROM cards ORDER BY id")
		.all();
	assert.equal(legacyBefore.length, 8);

	await zam.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT id FROM cards").all()).length,
		8,
		"installation must not enrol new cards or alter legacy cards",
	);

	const items = tile.atoms.flatMap((a) => a.practice_items);
	assert.equal(items.length, 108);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	}
	const first = await zam.ensureCard(db, items[0].id, user);
	await zam.evaluateRating(db, {
		cardId: first.id,
		tokenId: items[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-25T12:00:00Z"),
	});
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 116);
	assert.equal(before.reviews.length, 1);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(), before);
	}
	console.log(
		"ok: install preserves all 8 legacy cards; 108 fresh cards enrol; repeat install/enrol preserves all 116 cards and the recall record.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
