// Validate the shipped cell and rehearse the unapproved proposal in disposable libraries.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(read("cell.json"));
const mapping = JSON.parse(read("replaces-de-by.json"));
assert.equal(mapping.approved, null);
assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.sources.length, 2);
assert.ok(!("retired_items" in tile));
const newItems = tile.atoms.flatMap((atom) => atom.practice_items);
assert.ok(newItems.every((item) => !("replaces" in item)));
const legacy = mapping.sources.map((source) => {
	const bytes = read(source.file);
	assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
	const cell = JSON.parse(bytes);
	assert.equal(source.tile_id, cell.tile_id);
	assert.equal(source.version, cell.version);
	const items = cell.atoms.flatMap((atom) => atom.practice_items);
	assert.deepEqual(
		mapping.rows
			.filter((row) => row.de_by_cell === cell.tile_id)
			.map((row) => row.de_by_id)
			.sort(),
		items.map((item) => item.id).sort(),
	);
	return { cell, items };
});
const oldIds = legacy.flatMap(({ items }) => items.map(({ id }) => id));
const userId = tile.atoms[0].id;
const sorted = (ids) => [...ids].sort();
const snapshot = async (db) => ({
	tokens: await db.prepare("SELECT * FROM tokens ORDER BY id").all(),
	replacements: await db
		.prepare("SELECT * FROM practice_item_replacements ORDER BY old_item_id")
		.all(),
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const activeQueue = async (db, tokenIds) => {
	const queue = await zam.buildReviewQueue(db, {
		userId,
		tokenIds,
		now: new Date("2030-01-01T00:00:00Z"),
		buryNewSiblings: false,
		buryReviewSiblings: false,
	});
	return sorted(queue.items.map((item) => item.tokenId));
};
async function reviewed(db, tokenId, rating = 3) {
	const card = await zam.ensureCard(db, tokenId, userId);
	for (const day of [1, 2]) {
		await zam.evaluateRating(db, {
			cardId: card.id,
			tokenId,
			userId,
			rating,
			answerFormat: "recall",
			responseTimeMs: 2100 + day * 100,
			now: new Date(Date.UTC(2026, 10, day)),
		});
	}
}
async function installLegacy(db) {
	for (const { cell } of legacy) await zam.installKvtTile(db, cell);
}
async function seedLegacy(db) {
	await installLegacy(db);
	for (const [index, id] of oldIds.entries())
		await reviewed(db, id, index % 2 ? 3 : 1);
	const before = await snapshot(db);
	assert.equal(before.cards.length, 16);
	assert.equal(before.reviews.length, 32);
	return before;
}
const directory = mkdtempSync(join(tmpdir(), "zam-deutsch5-"));
async function withLibrary(name, run) {
	const db = await zam.openDatabase({
		dbPath: join(directory, name + ".db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	try {
		await run(db);
	} finally {
		await db.close();
	}
}

try {
	await withLibrary("current", async (db) => {
		const before = await seedLegacy(db);
		await zam.installKvtTile(db, tile);
		const installed = await snapshot(db);
		assert.deepEqual(installed.cards, before.cards);
		assert.deepEqual(installed.reviews, before.reviews);
		assert.deepEqual(installed.replacements, before.replacements);
		assert.deepEqual(await activeQueue(db, oldIds), sorted(oldIds));
		const enroll = async () => {
			for (const item of newItems) await zam.ensureCard(db, item.id, userId);
		};
		await enroll();
		const enrolled = await snapshot(db);
		assert.equal(enrolled.cards.length, 16 + newItems.length);
		assert.deepEqual(enrolled.reviews, before.reviews);
		for (const card of before.cards)
			assert.deepEqual(
				enrolled.cards.find((current) => current.id === card.id),
				card,
			);
		for (const item of newItems) {
			const token = await zam.getTokenById(db, item.id);
			assert.equal(token.source_link, item.source_link);
		}
		await zam.installKvtTile(db, tile);
		await enroll();
		assert.deepEqual(await snapshot(db), enrolled);
		console.log(
			`ok: ${newItems.length} new cards, 16 legacy cards and 32 reviews preserved; repeated installation and enrollment are idempotent.`,
		);
	});

	// The cloned tile is passed directly to the kernel in tests. It is never
	// written to the package or sent to the catalog.
	const proposal = structuredClone(tile);
	proposal.version = "2026.11.2";
	const successors = new Map(
		proposal.atoms.flatMap((atom) =>
			atom.practice_items.map((item) => [item.slug, item]),
		),
	);
	const transfers = new Map();
	const retirements = new Map();
	for (const row of mapping.rows) {
		if (row.category === "A" || row.category === "B") {
			const successor = successors.get(row.academy_slug);
			assert.ok(successor, `Missing successor for ${row.de_by_id}`);
			assert.equal(successor.replaces, undefined, "one history per successor");
			successor.replaces = [row.de_by_id];
			transfers.set(row.de_by_id, successor.id);
		} else if (row.action === "propose-retire-after-approval") {
			assert.equal(row.category, "C");
			retirements.set(row.de_by_id, row.reason);
		} else {
			assert.equal(row.category, "C");
			assert.equal(row.action, "keep-active");
		}
	}
	assert.equal(transfers.size, 8);
	assert.equal(retirements.size, 5);
	proposal.retired_items = Array.from(retirements, ([id, reason]) => ({
		id,
		reason,
	}));

	await withLibrary("proposal", async (db) => {
		const before = await seedLegacy(db);
		await zam.installKvtTile(db, proposal);
		const after = await snapshot(db);
		const movedRows = (rows) =>
			rows.map((row) => ({
				...row,
				token_id: transfers.get(row.token_id) ?? row.token_id,
			}));
		assert.deepEqual(after.cards, movedRows(before.cards));
		assert.deepEqual(after.reviews, movedRows(before.reviews));
		assert.deepEqual(
			after.replacements.map(({ old_item_id, new_item_id }) => [
				old_item_id,
				new_item_id,
			]),
			Array.from(transfers).sort(([a], [b]) => a.localeCompare(b)),
		);
		const kept = oldIds.filter(
			(id) => !transfers.has(id) && !retirements.has(id),
		);
		assert.equal(kept.length, 3);
		for (const id of oldIds) {
			const token = await zam.getTokenById(db, id);
			assert.equal(
				Boolean(token.deprecated_at),
				transfers.has(id) || retirements.has(id),
			);
		}
		assert.deepEqual(
			await activeQueue(db, [...oldIds, ...transfers.values()]),
			sorted([...kept, ...transfers.values()]),
		);
		await zam.installKvtTile(db, proposal);
		const repeated = await snapshot(db);
		// zam-core 0.54.0 refreshes only the updated_at stamp on explicitly
		// retired tokens when it applies the same retirement again.
		const stable = (state) => ({
			...state,
			tokens: state.tokens.map((token) =>
				retirements.has(token.id) ? { ...token, updated_at: null } : token,
			),
		});
		assert.deepEqual(stable(repeated), stable(after));
		console.log(
			"ok: proposal rehearsal moved 8 histories and retired 5 cards with evidence intact; 3 old cards stay active.",
		);
	});

	await withLibrary("collision", async (db) => {
		await installLegacy(db);
		await zam.installKvtTile(db, tile);
		const [oldId, successorId] = transfers.entries().next().value;
		await reviewed(db, oldId, 1);
		await reviewed(db, successorId, 3);
		const before = await snapshot(db);
		await assert.rejects(() => zam.installKvtTile(db, proposal), {
			message: `Cannot move ${oldId} to ${successorId}: ${userId} holds a card on both. That is a merge, and mastery is never merged automatically — resolve it explicitly and re-test.`,
		});
		assert.deepEqual(await snapshot(db), before);
		console.log(
			"ok: proposal refuses a learner holding both cards and rolls back all changes.",
		);
	});
} finally {
	rmSync(directory, { recursive: true, force: true });
}
