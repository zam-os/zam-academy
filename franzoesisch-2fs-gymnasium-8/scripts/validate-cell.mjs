// Disposable libraries only. Never open a configured or personal library.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cell.mjs
//
// 1. A fresh install creates no cards, every card enrols, and repeating install
//    and enrolment changes neither cards nor the review record.
// 2. The first publication declares no `replaces` and no `retired_items`
//    (replaces-de-by.json is proposal-only): installed next to the legacy
//    Grade 8 de-by cell, both cells keep all their cards active and a learner's
//    legacy review stays untouched.
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (file) => JSON.parse(readFileSync(new URL(`../${file}`, import.meta.url)));
const tile = read("cell.json");
const mapping = read("replaces-de-by.json");
const legacy = read(mapping.sources[0].file);
const items = tile.atoms.flatMap((atom) => atom.practice_items);
const legacyItems = legacy.atoms.flatMap((atom) => atom.practice_items);
assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.approved, null);
assert.ok(!("retired_items" in tile));
assert.ok(items.every((item) => !("replaces" in item)));

const dir = mkdtempSync(join(tmpdir(), "zam-french8-2fs-"));
const open = (name) =>
	zam.openDatabase({ dbPath: join(dir, name), initialize: true, useConfiguredCloud: false });
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const review = (db, card, tokenId, userId) =>
	zam.evaluateRating(db, {
		cardId: card.id,
		tokenId,
		userId,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-27T12:00:00Z"),
	});
let db;
try {
	db = await open("library.db");
	await zam.installKvtTile(db, tile);
	assert.equal((await db.prepare("SELECT id FROM cards").all()).length, 0, "installation must not enrol");
	const user = "learner-french-8";
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
		assert.equal(token.slug, item.slug);
		assert.equal(token.deprecated_at ?? null, null);
	}
	await review(db, await zam.ensureCard(db, items[0].id, user), items[0].id, user);
	const before = await snapshot(db);
	assert.equal(before.cards.length, 129);
	assert.equal(before.reviews.length, 1);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(db), before);
	}
	await db.close();
	db = undefined;

	for (const order of [["legacy", "new"], ["new", "legacy"]]) {
		db = await open(`beside-${order.join("-")}.db`);
		const learner = "learner-with-legacy-history";
		for (const which of order) {
			await zam.installKvtTile(db, which === "legacy" ? legacy : tile);
			if (which === "legacy")
				for (const item of legacyItems)
					await review(db, await zam.ensureCard(db, item.id, learner), item.id, learner);
		}
		const legacyBefore = await snapshot(db);
		await zam.installKvtTile(db, tile);
		await zam.installKvtTile(db, legacy);
		assert.deepEqual(await snapshot(db), legacyBefore, "reinstalling either cell changes nothing");
		for (const item of [...legacyItems, ...items])
			assert.equal((await zam.getTokenById(db, item.id)).deprecated_at ?? null, null, item.id);
		assert.equal(legacyBefore.reviews.length, legacyItems.length);
		await db.close();
		db = undefined;
	}
	console.log(
		"ok: install creates no cards; 129 cards enrol; repeat install and enrolment keep the review record; beside the legacy Grade 8 cell, in both orders, all 133 cards stay active and the 4 legacy reviews stay unchanged.",
	);
} finally {
	await db?.close();
	rmSync(dir, { recursive: true, force: true });
}
