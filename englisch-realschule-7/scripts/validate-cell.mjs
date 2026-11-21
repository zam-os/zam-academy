// Uses disposable libraries only. The mapping is a proposal (approved: null),
// so the cell declares no `replaces` and no `retired_items`: installing it must
// leave every legacy Grade 6/7 card and review exactly as it was.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cell.mjs
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
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.equal(tile.retired_items, undefined);
const newItems = tile.atoms.flatMap((atom) => atom.practice_items);
assert.ok(newItems.every((item) => item.replaces === undefined));

const legacyTiles = mapping.sources.map((source) => {
	const bytes = readFileSync(join(root, source.file));
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	const legacy = JSON.parse(bytes.toString("utf8"));
	assert.equal(source.tile_id, legacy.tile_id);
	assert.equal(source.version, legacy.version);
	return legacy;
});
const oldItems = legacyTiles.flatMap((legacy) =>
	legacy.atoms.flatMap((atom) => atom.practice_items),
);
const oldById = new Map(oldItems.map((item) => [item.id, item]));
assert.equal(mapping.rows.length, oldItems.length);
assert.deepEqual(
	new Set(mapping.rows.map((row) => row.de_by_id)),
	new Set(oldById.keys()),
);
for (const row of mapping.rows) {
	assert.equal(
		row.de_by_question,
		zam.kvtItemPlainTexts(oldById.get(row.de_by_id)).question,
	);
	if (row.action === "propose-replace-after-approval") {
		const successor = newItems.filter((item) => item.slug === row.academy_slug);
		assert.equal(successor.length, 1, row.academy_slug);
		assert.equal(
			zam.kvtItemPlainTexts(successor[0]).question,
			row.de_by_question,
			"a proposed A successor asks the same retrieval",
		);
	}
}

const dir = mkdtempSync(join(tmpdir(), "zam-englisch7-"));
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
	for (const legacy of legacyTiles) await zam.installKvtTile(db, legacy);
	for (const item of oldItems) {
		const card = await zam.ensureCard(db, item.id, user);
		for (const day of [0, 1])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: item.id,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 10, 19 + day)),
			});
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, 16);
	assert.equal(before.reviews.length, 32);
	for (let attempt = 0; attempt < 2; attempt++) {
		await zam.installKvtTile(db, tile);
		assert.deepEqual(
			await snapshot(db),
			before,
			"installation must preserve legacy cards and reviews without enrolling new cards",
		);
	}
	const ids = newItems.map((item) => item.id);
	for (const id of ids) await zam.ensureCard(db, id, user);
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, 16 + ids.length);
	assert.equal(enrolled.reviews.length, 32);
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
	for (const item of newItems) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	console.log(
		`ok: ${tile.atoms.length} atoms / ${ids.length} new cards; 16 legacy Grade 6/7 histories and 32 reviews unchanged; proposal-only mapping (${mapping.rows.length} rows) checked; installation and card creation repeat safely.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
