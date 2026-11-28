import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertMappingApproved } from "../../scripts/mapping-approval.mjs";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root));
const cell = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
assertMappingApproved(fileURLToPath(root), cell, "deutsch-gymnasium-8");
assert.equal(mapping.status, "approved");
assert.deepEqual(cell.retired_items ?? [], []);

const oldTiles = mapping.sources.map((source) => {
	const bytes = read(source.file);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	return JSON.parse(bytes);
});
const oldItems = oldTiles.flatMap((tile) =>
	tile.atoms.flatMap((atom) => atom.practice_items),
);
assert.deepEqual(
	mapping.rows.map((row) => row.de_by_id).sort(),
	oldItems.map((item) => item.id).sort(),
);
const items = cell.atoms.flatMap((atom) => atom.practice_items);
const replacements = new Map(
	items.flatMap((item) => (item.replaces ?? []).map((id) => [id, item.id])),
);
assert.equal(replacements.size, 1);
const [[oldId, successorId]] = replacements;

const dir = mkdtempSync(join(tmpdir(), "zam-deutsch-gym8-migration-"));
const userId = cell.atoms[0].id;
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});

async function withLegacyLibrary(name, check) {
	const db = await zam.openDatabase({
		dbPath: join(dir, name),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		for (const tile of oldTiles) await zam.installKvtTile(db, tile);
		for (const item of oldItems) {
			const card = await zam.ensureCard(db, item.id, userId);
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: item.id,
				userId,
				rating: 3,
				answerFormat: "recall",
				now: new Date("2026-11-21T12:00:00Z"),
			});
		}
		await check(db);
	} finally {
		await db.close();
	}
}

try {
	await withLegacyLibrary("history.db", async (db) => {
		const before = await snapshot(db);
		assert.equal(before.cards.length, oldItems.length);
		assert.equal(before.reviews.length, oldItems.length);
		const rebind = (rows) =>
			rows.map((row) => ({
				...row,
				token_id: replacements.get(row.token_id) ?? row.token_id,
			}));
		await zam.installKvtTile(db, cell);
		const after = await snapshot(db);
		assert.deepEqual(after.cards, rebind(before.cards));
		assert.deepEqual(after.reviews, rebind(before.reviews));
		for (const item of oldItems) {
			const token = await zam.getTokenById(db, item.id);
			assert.ok(token);
			assert.equal(Boolean(token.deprecated_at), replacements.has(item.id));
		}
		await zam.installKvtTile(db, cell);
		assert.deepEqual(await snapshot(db), after);
	});

	await withLegacyLibrary("collision.db", async (db) => {
		const earlier = {
			...cell,
			version: "2026.11.2",
			atoms: cell.atoms.map((atom) => ({
				...atom,
				practice_items: atom.practice_items.map(
					({ replaces, ...item }) => item,
				),
			})),
		};
		await zam.installKvtTile(db, earlier);
		await zam.ensureCard(db, successorId, userId);
		const before = await snapshot(db);
		assert.ok(before.cards.some((card) => card.token_id === oldId));
		assert.ok(before.cards.some((card) => card.token_id === successorId));
		await assert.rejects(
			() => zam.installKvtTile(db, cell),
			/card|collision|merge/i,
		);
		assert.deepEqual(await snapshot(db), before);
		assert.equal(
			Boolean((await zam.getTokenById(db, oldId)).deprecated_at),
			false,
		);
	});
	console.log(
		"ok: 1 card and its review history transfer, 3 legacy cards stay active, reinstall is idempotent, and a collision preserves both cards.",
	);
} finally {
	rmSync(dir, { recursive: true, force: true });
}
