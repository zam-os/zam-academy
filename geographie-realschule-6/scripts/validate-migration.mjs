#!/usr/bin/env node
// Exercise the published zam-core with disposable libraries and synthetic reviews.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { assertMappingApproved } from "../../scripts/mapping-approval.mjs";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const root = new URL("../", import.meta.url);
const read = (file) => JSON.parse(readFileSync(new URL(file, root), "utf8"));
const cell = read("cell.json");
const mapping = read("replaces-de-by.json");
assertMappingApproved(fileURLToPath(root), cell, "geographie-realschule-6");

const legacy = mapping.sources.map(({ file, sha256, tile_id }) => {
	const bytes = readFileSync(new URL(file, root));
	assert.equal(createHash("sha256").update(bytes).digest("hex"), sha256, file);
	const tile = JSON.parse(bytes);
	assert.equal(tile.tile_id, tile_id);
	return tile;
});
const items = cell.atoms.flatMap(({ practice_items }) => practice_items);
const transfers = mapping.rows.filter(({ category }) => category === "A");
const kept = mapping.rows.filter(({ action }) => action === "keep-active");
const successorIds = new Map(
	transfers.map(({ de_by_id, academy_slug }) => [
		de_by_id,
		items.find(({ slug }) => slug === academy_slug).id,
	]),
);
const legacyIds = mapping.rows.map(({ de_by_id }) => de_by_id);
assert.equal(transfers.length, 3);
assert.equal(kept.length, 5);
assert.equal(cell.retired_items, undefined);

const proposal = {
	...cell,
	version: "2026.11.1",
	atoms: cell.atoms.map(({ practice_items, ...atom }) => ({
		...atom,
		practice_items: practice_items.map(({ replaces, ...item }) => item),
	})),
};
const day = 86_400_000;
const userId = cell.atoms[0].id;
const dir = mkdtempSync(join(tmpdir(), "zam-geo6-migration-"));

async function recordTwoReviews(db, tokenId, index) {
	const card = await zam.ensureCard(db, tokenId, userId);
	const input = {
		cardId: card.id,
		tokenId,
		userId,
		answerFormat: "recall",
	};
	const first = new Date("2026-10-01T08:00:00Z");
	await zam.evaluateRating(db, {
		...input,
		rating: index % 2 ? 3 : 1,
		responseTimeMs: 1000 + 100 * index,
		now: first,
	});
	await zam.evaluateRating(db, {
		...input,
		rating: index % 2 ? 4 : 3,
		responseTimeMs: 1200 + 100 * index,
		now: new Date(first.getTime() + day * (index + 1)),
	});
}

async function snapshot(db) {
	return {
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	};
}

async function queuedTokens(db, tokenIds, cards) {
	const now = new Date(
		Math.max(...cards.map(({ due_at }) => Date.parse(due_at))) + day,
	);
	const queue = await zam.buildReviewQueue(db, {
		userId,
		tokenIds,
		now,
		buryNewSiblings: false,
		buryReviewSiblings: false,
	});
	return queue.items.map(({ tokenId }) => tokenId).sort();
}

async function withLegacyLibrary(name, run) {
	const db = await zam.openDatabase({
		dbPath: join(dir, `${name}.db`),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		for (const tile of legacy) await zam.installKvtTile(db, tile);
		for (const [index, oldId] of legacyIds.entries())
			await recordTwoReviews(db, oldId, index);
		await run(db);
	} finally {
		await db.close();
	}
}

try {
	for (const fromProposal of [false, true]) {
		await withLegacyLibrary(
			fromProposal ? "upgrade" : "first-install",
			async (db) => {
				if (fromProposal) await zam.installKvtTile(db, proposal);
				const before = await snapshot(db);
				assert.equal(before.cards.length, 8);
				assert.equal(before.reviews.length, 16);
				assert.deepEqual(
					await queuedTokens(db, legacyIds, before.cards),
					[...legacyIds].sort(),
				);

				await zam.installKvtTile(db, cell);
				const after = await snapshot(db);
				const moved = (row) => ({
					...row,
					token_id: successorIds.get(row.token_id) ?? row.token_id,
				});
				assert.deepEqual(
					after.cards,
					before.cards.map(moved),
					"Card IDs, FSRS state and schedules must survive",
				);
				assert.deepEqual(
					after.reviews,
					before.reviews.map(moved),
					"Review history must follow its successor",
				);
				assert.deepEqual(
					await queuedTokens(
						db,
						[...legacyIds, ...successorIds.values()],
						after.cards,
					),
					[
						...kept.map(({ de_by_id }) => de_by_id),
						...successorIds.values(),
					].sort(),
				);
				for (const [oldId] of successorIds) {
					assert.ok((await zam.getTokenById(db, oldId)).deprecated_at, oldId);
				}
				await zam.installKvtTile(db, cell);
				assert.deepEqual(
					await snapshot(db),
					after,
					"Repeated installation must keep state and review history",
				);
			},
		);
	}
	console.log(
		"ok   Geography 6: first install and proposal upgrade move three cards, preserve all 16 reviews and keep five legacy cards active. Reinstallation is idempotent.",
	);

	await withLegacyLibrary("collision", async (db) => {
		await zam.installKvtTile(db, proposal);
		const duplicate = successorIds.get("01K4G7E0000000000000000J03");
		await recordTwoReviews(db, duplicate, 8);
		const before = await snapshot(db);
		await assert.rejects(
			() => zam.installKvtTile(db, cell),
			/holds a card on both/,
		);
		assert.deepEqual(
			await snapshot(db),
			before,
			"Overlapping histories must leave all cards and reviews intact",
		);
		assert.deepEqual(
			await queuedTokens(db, [...legacyIds, duplicate], before.cards),
			[...legacyIds, duplicate].sort(),
		);
	});
	console.log(
		"ok   Geography 6: two existing histories on a matched pair refuse the upgrade and leave all histories and queue entries intact.",
	);
} finally {
	rmSync(dir, { recursive: true, force: true });
}
