// Disposable libraries only. Never open a configured or personal library.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cell.mjs
//
// 1. A fresh install creates no cards, all cards enrol, and repeating install
//    and enrolment changes nothing.
// 2. The atoms and cards of this cell were the second-language path of
//    zam-academy:franzoesisch-gymnasium-6 (snapshot 2026.11.2 in
//    tests/fixtures). A learner who studied them there keeps every card and
//    review when this cell arrives: same ids, no new revision, nothing
//    deprecated, and only the lesson link changes. That stays true when the
//    old cell's next version, without these atoms, arrives before or after.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const tile = JSON.parse(read("cell.json"));
const coverage = JSON.parse(read("coverage.json"));
const sourceBytes = read(coverage.moved_from.file);
assert.equal(createHash("sha256").update(sourceBytes).digest("hex"), coverage.moved_from.sha256);
const source = JSON.parse(sourceBytes);
assert.equal(source.tile_id, coverage.moved_from.cell);
const items = tile.atoms.flatMap((a) => a.practice_items);
const movedIds = new Set(tile.atoms.map((atom) => atom.id));
// Stand-in for the old cell after the split: the same release without the moved atoms.
const remaining = {
	...source,
	version: "2026.11.3",
	atoms: source.atoms.filter((atom) => !movedIds.has(atom.id)),
};
assert.equal(remaining.atoms.length, source.atoms.length - tile.atoms.length);
const dir = mkdtempSync(join(tmpdir(), "zam-french6-2fs-"));
const open = (name) =>
	zam.openDatabase({ dbPath: join(dir, name), initialize: true, useConfiguredCloud: false });
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const tokenState = async (db) =>
	Promise.all(
		items.map(async (item) => {
			const token = await zam.getTokenById(db, item.id);
			return {
				id: token.id,
				slug: token.slug,
				content_version: token.content_version,
				deprecated_at: token.deprecated_at,
				question: token.question,
				concept: token.concept,
			};
		}),
	);
let db;
try {
	db = await open("library.db");
	await zam.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT id FROM cards").all()).length,
		0,
		"installation must not enrol",
	);
	const user = tile.atoms[0].id;
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
		assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
	}
	assert.equal(items.length, 138);
	const first = await zam.ensureCard(db, items[0].id, user);
	await zam.evaluateRating(db, {
		cardId: first.id,
		tokenId: items[0].id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
		now: new Date("2026-11-24T12:00:00Z"),
	});
	const before = await snapshot(db);
	assert.equal(before.cards.length, 138);
	assert.equal(before.reviews.length, 1);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(db), before);
	}
	await db.close();
	db = undefined;
	console.log(
		"ok: install creates no cards; 138 fresh cards enrol. Repeat install and enrolment preserve the review record.",
	);

	for (const order of [["new", "remaining"], ["remaining", "new"]]) {
		db = await open(`moved-${order.join("-")}.db`);
		await zam.installKvtTile(db, source);
		const learner = "learner-from-french-6";
		for (const item of items) {
			const card = await zam.ensureCard(db, item.id, learner);
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: item.id,
				userId: learner,
				rating: 3,
				answerFormat: "recall",
				now: new Date("2026-11-21T12:00:00Z"),
			});
		}
		const studied = await snapshot(db);
		const tokensBefore = await tokenState(db);
		assert.equal(studied.cards.length, 138);
		assert.equal(studied.reviews.length, 138);
		for (const step of order) await zam.installKvtTile(db, step === "new" ? tile : remaining);
		assert.deepEqual(await snapshot(db), studied, "cards and reviews stay untouched");
		assert.deepEqual(await tokenState(db), tokensBefore, "no revision, no deprecation, same slugs");
		for (const item of items) {
			assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
			await zam.ensureCard(db, item.id, learner);
		}
		assert.deepEqual(await snapshot(db), studied, "enrolling again adds nothing");
		const bound = await db
			.prepare(
				"SELECT COUNT(DISTINCT atom_id) AS n FROM atom_curriculum_bindings WHERE subject = 'franzoesisch-2fs'",
			)
			.get();
		assert.equal(bound.n, tile.atoms.length);
		await db.close();
		db = undefined;
	}
	console.log(
		"ok: 138 studied cards and their 138 reviews keep ids, content versions and state when the cell moves, in both install orders; only the lesson link changes.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
