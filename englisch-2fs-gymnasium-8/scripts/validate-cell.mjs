// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (rel) => JSON.parse(readFileSync(new URL(`../${rel}`, import.meta.url), "utf8"));
const tile = read("cell.json");
const legacy = read(
	"tests/fixtures/de-by-gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa-kvt.json",
);

const dir = mkdtempSync(join(tmpdir(), "zam-english8-2fs-"));
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});

	// 1. Install legacy Grade 8 cell and record a learner review on one of its items
	await zam.installKvtTile(db, legacy);
	const user = tile.atoms[0].id;
	const legacyItems = legacy.atoms.flatMap((a) => a.practice_items);
	for (const item of legacyItems) await zam.ensureCard(db, item.id, user);
	const legacyFirst = await zam.ensureCard(db, legacyItems[0].id, user);
	await zam.evaluateRating(db, {
		cardId: legacyFirst.id,
		tokenId: legacyItems[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-26T10:00:00Z"),
	});
	const legacySnapshot = await db
		.prepare("SELECT * FROM cards WHERE token_id LIKE '01K8G8J%' ORDER BY id")
		.all();

	// 2. Install new Grade 8 E2 cell; verify no auto-enrol and legacy cards untouched
	await zam.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT id FROM cards WHERE token_id NOT LIKE '01K8G8J%'").all()).length,
		0,
		"installation must not enrol new cards",
	);
	assert.deepEqual(
		await db.prepare("SELECT * FROM cards WHERE token_id LIKE '01K8G8J%' ORDER BY id").all(),
		legacySnapshot,
		"installing E2-8 must preserve all legacy Grade 8 cards untouched",
	);

	// 3. Enrol all 120 cards, evaluate recall, verify idempotent re-installs
	const items = tile.atoms.flatMap((a) => a.practice_items);
	assert.equal(items.length, 120);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
		assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
	}
	const first = await zam.ensureCard(db, items[0].id, user);
	await zam.evaluateRating(db, {
		cardId: first.id,
		tokenId: items[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-27T12:00:00Z"),
	});
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 124);
	assert.equal(before.reviews.length, 2);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(), before);
	}
	console.log(
		"ok: install creates no cards; 120 fresh cards enrol; all 4 legacy Grade 8 cards stay intact; repeat install/enrol preserves all cards and recall records.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
