// Disposable libraries only. Never open a configured or personal library.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cell.mjs
//
// 1. A fresh install creates no cards, all cards enrol, and repeating install
//    and enrolment changes nothing.
// 2. The atoms and cards of this cell were the second-language path of
//    zam-academy:franzoesisch-gymnasium-7 (snapshot 2026.11.2 in
//    tests/fixtures). A learner who studied them there keeps every card and
//    review when this cell arrives: same ids, no new revision, nothing
//    deprecated, with updated lesson links and curriculum bindings. That stays true when the
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
// Exercise the actual companion release in both orders.
const remaining = JSON.parse(
	readFileSync(new URL("../../franzoesisch-gymnasium-7/cell.json", import.meta.url)),
);
assert.equal(remaining.tile_id, source.tile_id);
assert.equal(source.version, coverage.moved_from.version);
assert.equal(remaining.atoms.length + tile.atoms.length, source.atoms.length);
assert.ok(remaining.atoms.every((atom) => !movedIds.has(atom.id)));
assert.deepEqual(
	remaining.atoms,
	source.atoms.filter((atom) => !movedIds.has(atom.id)),
);
const dir = mkdtempSync(join(tmpdir(), "zam-french7-2fs-"));
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
	assert.equal(items.length, 117);
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
	assert.equal(before.cards.length, 117);
	assert.equal(before.reviews.length, 1);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		for (const item of items) await zam.ensureCard(db, item.id, user);
		assert.deepEqual(await snapshot(db), before);
	}
	await db.close();
	db = undefined;
	console.log(
		"ok: install creates no cards; 117 fresh cards enrol. Repeat install and enrolment preserve the review record.",
	);

	for (const order of [["new", "remaining"], ["remaining", "new"]]) {
		db = await open(`moved-${order.join("-")}.db`);
		// The original cell already replaced one legacy card. Install its
		// approved source before installing the combined release.
		const mapping = JSON.parse(
			readFileSync(new URL("../../franzoesisch-gymnasium-7/replaces-de-by.json", import.meta.url)),
		);
		for (const { file } of mapping.sources) {
			const legacy = JSON.parse(
				readFileSync(new URL(`../../franzoesisch-gymnasium-7/${file}`, import.meta.url)),
			);
			await zam.installKvtTile(db, legacy);
		}
		await zam.installKvtTile(db, source);
		const learner = "learner-from-french-7";
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
		assert.equal(studied.cards.length, 117);
		assert.equal(studied.reviews.length, 117);
		for (const step of order) {
			await zam.installKvtTile(db, step === "new" ? tile : remaining);
			assert.deepEqual(await snapshot(db), studied, `cards and reviews after installing ${step}`);
			assert.deepEqual(await tokenState(db), tokensBefore, `content and active tokens after installing ${step}`);
		}
		for (const item of items) {
			assert.equal((await zam.getTokenById(db, item.id)).source_link, item.source_link);
			await zam.ensureCard(db, item.id, learner);
		}
		assert.deepEqual(await snapshot(db), studied, "enrolling again adds nothing");
		const bindings = await db.prepare(
			"SELECT atom_id, subject, topic_code FROM atom_curriculum_bindings ORDER BY atom_id, topic_code",
		).all();
		const movedBindings = bindings.filter(({ atom_id }) => movedIds.has(atom_id));
		assert.deepEqual(
			movedBindings,
			tile.atoms.flatMap((atom) => atom.curricula.map((binding) => ({
				atom_id: atom.id,
				subject: binding.subject,
				topic_code: binding.topic_code,
			}))).sort((a, b) =>
				a.atom_id.localeCompare(b.atom_id) || a.topic_code.localeCompare(b.topic_code),
			),
			"moved atoms have only their second-language bindings",
		);
		await db.close();
		db = undefined;
	}
	console.log(
		"ok: 117 studied cards and their 117 reviews keep ids, content versions and state when the cell moves, in both install orders; lesson links and curriculum bindings are updated.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
