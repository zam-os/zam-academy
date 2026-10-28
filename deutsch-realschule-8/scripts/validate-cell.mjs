// Uses disposable libraries only. Existing Academy cards and reviews must not
// change when this additional (not replacing) cell is installed or enrolled.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
	readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);
assert.equal(mapping.sources.length, 1);
const source = mapping.sources[0];
const legacyBytes = readFileSync(join(root, source.file));
const legacy = JSON.parse(legacyBytes.toString("utf8"));
assert.equal(
	createHash("sha256").update(legacyBytes).digest("hex"),
	source.sha256,
);
assert.equal(source.file, "tests/fixtures/de-by-deutsch-8.json");
assert.equal(source.tile_id, legacy.tile_id);
assert.equal(source.version, legacy.version);
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.ok(!("retired_items" in tile));
assert.ok(
	tile.atoms.every((atom) =>
		atom.practice_items.every((item) => !("replaces" in item)),
	),
);
const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);
const oldById = new Map(oldItems.map((item) => [item.id, item]));
assert.equal(mapping.rows.length, oldItems.length);
assert.deepEqual(
	new Set(mapping.rows.map((row) => row.de_by_id)),
	new Set(oldById.keys()),
);
for (const row of mapping.rows) {
	assert.equal(row.category, "C");
	assert.equal(row.academy_slug, null);
	assert.equal(row.action, "keep-active");
	assert.equal(row.de_by_cell, legacy.tile_id);
	assert.equal(
		row.de_by_question,
		zam.kvtItemPlainTexts(oldById.get(row.de_by_id)).question,
	);
}
const dir = mkdtempSync(join(tmpdir(), "zam-deutsch8-"));
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
	await zam.installKvtTile(db, legacy);
	for (const item of oldItems) {
		const tokenId = item.id;
		const card = await zam.ensureCard(db, tokenId, user);
		for (const day of [0, 1])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 9, 24 + day)),
			});
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, 4);
	assert.equal(before.reviews.length, 8);
	for (let attempt = 0; attempt < 2; attempt++) {
		await zam.installKvtTile(db, tile);
		assert.deepEqual(
			await snapshot(db),
			before,
			"installation must preserve existing cards and every review without enrolling new cards",
		);
	}
	const ids = tile.atoms.flatMap((atom) =>
		atom.practice_items.map((item) => item.id),
	);
	for (const id of ids) await zam.ensureCard(db, id, user);
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, 84);
	assert.equal(enrolled.reviews.length, 8);
	for (const old of before.cards)
		assert.deepEqual(
			enrolled.cards.find((card) => card.id === old.id),
			old,
			"existing FSRS state must stay identical",
		);
	for (const card of enrolled.cards.filter((card) =>
		ids.includes(card.token_id),
	)) {
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
	}
	await zam.installKvtTile(db, tile);
	for (const id of ids) await zam.ensureCard(db, id, user);
	assert.deepEqual(
		await snapshot(db),
		enrolled,
		"repeated installation and card creation must be idempotent",
	);
	for (const item of tile.atoms.flatMap((atom) => atom.practice_items)) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	console.log(
		"ok: 40 atoms / 80 new cards, four existing Deutsch-8 histories and eight reviews unchanged; installation and explicit card creation repeat safely.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
