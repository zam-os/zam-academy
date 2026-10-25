// Published zam-core; only disposable databases, no personal library writes.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const previous = JSON.parse(
	readFileSync(join(root, "../geographie-realschule-9/cell.json"), "utf8"),
);
const ids = tile.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
const dir = mkdtempSync(join(tmpdir(), "zam-pug10-"));
const user = tile.atoms[0].id;
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, previous);
	const oldItems = previous.atoms.flatMap((a) => a.practice_items).slice(0, 2);
	for (const item of oldItems) {
		const card = await zam.ensureCard(db, item.id, user);
		for (const day of [0, 1])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: item.id,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 9, 24 + day)),
			});
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, 2);
	assert.equal(before.reviews.length, 4);
	for (let i = 0; i < 2; i++) {
		await zam.installKvtTile(db, tile);
		assert.deepEqual(
			await snapshot(db),
			before,
			"installation must not enroll cards or alter existing evidence",
		);
	}
	for (const id of ids) await zam.ensureCard(db, id, user);
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, 66);
	assert.deepEqual(enrolled.reviews, before.reviews);
	for (const card of before.cards)
		assert.deepEqual(
			enrolled.cards.find((c) => c.id === card.id),
			card,
		);
	for (const card of enrolled.cards.filter((c) => ids.includes(c.token_id))) {
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
	}
	await zam.installKvtTile(db, tile);
	for (const id of ids) await zam.ensureCard(db, id, user);
	assert.deepEqual(await snapshot(db), enrolled);
	for (const item of tile.atoms.flatMap((a) => a.practice_items)) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	assert.ok(!tile.retired_items);
	assert.ok(
		tile.atoms.every((a) => a.practice_items.every((i) => !i.replaces)),
	);
	console.log(
		"ok: 32 atoms / 64 fresh cards; two existing geography cards and four reviews unchanged; repeated install/enrol safe.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
