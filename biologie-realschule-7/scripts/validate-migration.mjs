import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertMappingApproved } from "../../scripts/mapping-approval.mjs";

const root = fileURLToPath(new URL("../", import.meta.url));
const readJson = (name) => JSON.parse(readFileSync(join(root, name), "utf8"));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = readJson("cell.json");
const mapping = readJson("replaces-de-by.json");
assertMappingApproved(root, tile, "biologie-realschule-7");

assert.equal(mapping.sources.length, 1);
const [source] = mapping.sources;
const bytes = readFileSync(join(root, source.file));
assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
const legacy = JSON.parse(bytes.toString("utf8"));
assert.equal(legacy.tile_id, source.tile_id);
assert.equal(legacy.version, source.version);

const items = tile.atoms.flatMap(({ practice_items }) => practice_items);
const legacyIds = legacy.atoms.flatMap(({ practice_items }) => practice_items.map(({ id }) => id));
assert.deepEqual(mapping.rows.map(({ de_by_id }) => de_by_id), legacyIds);
const successorByOldId = new Map(
	items.flatMap((item) => (item.replaces ?? []).map((oldId) => [oldId, item.id])),
);
assert.equal(successorByOldId.size, 4);
assert.ok(!tile.retired_items?.length);

const dir = mkdtempSync(join(tmpdir(), "zam-bio7-migration-"));
const userId = tile.atoms[0].id;
const open = (name) => zam.openDatabase({
	dbPath: join(dir, name),
	initialize: true,
	useConfiguredCloud: false,
});
const snapshot = async (db) => ({
	tokens: await db.prepare("SELECT * FROM tokens ORDER BY id").all(),
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	replacements: await db.prepare(
		"SELECT old_item_id, new_item_id FROM practice_item_replacements ORDER BY old_item_id",
	).all(),
});

async function review(db, tokenId, rating, day) {
	const card = await zam.ensureCard(db, tokenId, userId);
	await zam.evaluateRating(db, {
		cardId: card.id,
		tokenId,
		userId,
		rating,
		answerFormat: "recall",
		responseTimeMs: 2400,
		now: new Date(Date.UTC(2026, 10, day)),
	});
}

try {
	const db = await open("library.db");
	try {
		await zam.installKvtTile(db, legacy);
		for (const [index, id] of legacyIds.entries()) {
			await review(db, id, index % 2 === 0 ? 3 : 1, 18);
			await review(db, id, index % 3 === 0 ? 4 : 3, 19);
		}
		const before = await snapshot(db);
		assert.equal(before.cards.length, 8);
		assert.equal(before.reviews.length, 16);

		await zam.installKvtTile(db, tile);
		const after = await snapshot(db);
		for (const table of ["cards", "reviews"]) {
			assert.deepEqual(after[table], before[table].map((row) => ({
				...row,
				token_id: successorByOldId.get(row.token_id) ?? row.token_id,
			})), `Only the approved token references may change in ${table}`);
		}
		assert.deepEqual(
			after.replacements.map(({ old_item_id, new_item_id }) => [old_item_id, new_item_id]),
			[...successorByOldId].sort(([left], [right]) => left.localeCompare(right)),
		);
		for (const id of legacyIds) {
			const token = await zam.getTokenById(db, id);
			assert.ok(token, `Keep the old token ${id}`);
			assert.equal(Boolean(token.deprecated_at), successorByOldId.has(id), id);
		}
		const queue = await zam.buildReviewQueue(db, {
			userId,
			tokenIds: legacyIds,
			now: new Date(Math.max(...after.cards.map((card) => Date.parse(card.due_at))) + 86_400_000),
			buryNewSiblings: false,
			buryReviewSiblings: false,
		});
		assert.equal(queue.items.length, 4, "Only the four category C cards remain active on their old IDs");

		await zam.installKvtTile(db, tile);
		assert.deepEqual(await snapshot(db), after, "Repeated installation must be idempotent");
		assert.deepEqual(
			await zam.materialiseKvtCards(db, userId, tile.atoms.map(({ id }) => id)),
			{ cardsCreated: 50, cardsReused: 4 },
		);
		assert.deepEqual((await snapshot(db)).reviews, after.reviews);
	} finally {
		await db.close();
	}

	// Recreate an installation of the earlier local cell before replacements were approved.
	const earlier = structuredClone(tile);
	earlier.version = "2026.11.1";
	for (const atom of earlier.atoms) {
		for (const item of atom.practice_items) delete item.replaces;
	}
	for (const [oldId, newId] of successorByOldId) {
		const collision = await open(`collision-${oldId}.db`);
		try {
			await zam.installKvtTile(collision, legacy);
			await zam.installKvtTile(collision, earlier);
			await review(collision, oldId, 1, 18);
			await review(collision, newId, 3, 19);
			const before = await snapshot(collision);
			await assert.rejects(
				() => zam.installKvtTile(collision, tile),
				(error) => error.message.includes(oldId) &&
					error.message.includes(newId) && error.message.includes(userId),
			);
			assert.deepEqual(await snapshot(collision), before, "A collision must preserve both histories");
		} finally {
			await collision.close();
		}
	}
	console.log("ok: four approved histories transferred, four legacy cards kept active, 16 reviews preserved, repeat install unchanged, and all four dual-history collisions refused.");
} finally {
	rmSync(dir, { recursive: true, force: true });
}
