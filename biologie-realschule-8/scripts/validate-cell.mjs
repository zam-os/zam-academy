// Disposable libraries only. No configured cloud and no personal library access.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const dir = mkdtempSync(join(tmpdir(), "zam-biologie8-"));
const mapping = JSON.parse(
	readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);
assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.approved, null);
assert.equal(mapping.rows.length, 16);
assert.ok(
	mapping.rows.every(
		(row) => row.category === "C" && row.academy_slug === null,
	),
);
assert.equal(new Set(mapping.rows.map((row) => row.de_by_id)).size, 16);
for (const source of mapping.sources) {
	const bytes = readFileSync(join(root, source.file));
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
}
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
	const oldIds = new Set();
	for (const name of [
		"de-by-realschule-8-biologie-atmung-blutkreislauf-kvt.json",
		"de-by-realschule-8-biologie-ernaehrung-verdauung-kvt.json",
	]) {
		const old = JSON.parse(
			readFileSync(join(root, "tests/fixtures", name), "utf8"),
		);
		await zam.installKvtTile(db, old);
		for (const atom of old.atoms)
			for (const item of atom.practice_items) oldIds.add(item.id);
	}
	for (const id of oldIds) {
		const card = await zam.ensureCard(db, id, user);
		for (const day of [24, 25])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: id,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 9, day)),
			});
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, oldIds.size);
	assert.equal(before.reviews.length, oldIds.size * 2);
	for (let i = 0; i < 2; i++) {
		await zam.installKvtTile(db, tile);
		assert.deepEqual(
			await snapshot(db),
			before,
			"installing the course must not enroll or alter personal cards",
		);
	}
	const newIds = tile.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
	assert.equal(newIds.length, 60);
	assert.ok(newIds.every((id) => !oldIds.has(id)));
	for (const id of newIds) await zam.ensureCard(db, id, user);
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, oldIds.size + 60);
	assert.deepEqual(enrolled.reviews, before.reviews);
	for (const card of before.cards)
		assert.deepEqual(
			enrolled.cards.find((c) => c.id === card.id),
			card,
		);
	for (const card of enrolled.cards.filter((c) =>
		newIds.includes(c.token_id),
	)) {
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
	}
	await zam.installKvtTile(db, tile);
	for (const id of newIds) await zam.ensureCard(db, id, user);
	assert.deepEqual(
		await snapshot(db),
		enrolled,
		"repeated installation and enrollment must be idempotent",
	);
	for (const item of tile.atoms.flatMap((a) => a.practice_items)) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	console.log(
		`ok: 30 atoms / 60 fresh cards; ${oldIds.size} legacy cards and ${before.reviews.length} reviews unchanged; installation and enrollment repeat safely.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
