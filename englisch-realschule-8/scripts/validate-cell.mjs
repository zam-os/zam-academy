// Uses disposable libraries only; no learner library is opened. Cell 2026.10.2
// carries the approved mapping: the one A row moves its history unchanged to its
// successor, the three C cards stay active. The earlier 2026.10.1 (the same cell
// without replaces) is simulated to check that it moved nothing and that the
// upgrade from it works.
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
const source = mapping.sources[0];
const snapshotBytes = readFileSync(join(root, source.file));
const legacy = JSON.parse(snapshotBytes.toString("utf8"));
assert.equal(
	createHash("sha256").update(snapshotBytes).digest("hex"),
	source.sha256,
);
assert.equal(source.tile_id, legacy.tile_id);
assert.equal(source.version, legacy.version);
assert.equal(mapping.approved, "2026-10-29");
assert.equal(mapping.status, "approved");
assert.ok(mapping.source.includes("„Approve mapping“"));
assert.equal(tile.version, "2026.10.2");
assert.equal(tile.retired_items, undefined);
const items = tile.atoms.flatMap((atom) => atom.practice_items);
const oldItems = legacy.atoms.flatMap((atom) => atom.practice_items);
const oldById = new Map(oldItems.map((item) => [item.id, item]));
assert.equal(mapping.rows.length, oldItems.length);
assert.deepEqual(
	new Set(mapping.rows.map((row) => row.de_by_id)),
	new Set(oldById.keys()),
);
const bySlug = new Map(items.map((item) => [item.slug, item]));
const transfers = new Map();
for (const row of mapping.rows) {
	assert.equal(row.de_by_cell, legacy.tile_id);
	assert.equal(
		row.de_by_question,
		zam.kvtItemPlainTexts(oldById.get(row.de_by_id)).question,
	);
	if (row.category === "C") {
		assert.equal(row.academy_slug, null);
		assert.equal(row.action, "keep-active");
		continue;
	}
	assert.equal(row.category, "A");
	assert.equal(row.action, "replace");
	const successor = bySlug.get(row.academy_slug);
	assert.deepEqual(successor.replaces, [row.de_by_id]);
	transfers.set(row.de_by_id, successor.id);
}
assert.equal(transfers.size, 1);
assert.deepEqual(
	items.flatMap((item) => item.replaces ?? []),
	[...transfers.keys()],
	"only the approved A row is replaced",
);

// The earlier, unapproved 2026.10.1: the same cell without replaces.
const previousCell = structuredClone(tile);
previousCell.version = "2026.10.1";
for (const atom of previousCell.atoms)
	for (const item of atom.practice_items) delete item.replaces;

const dir = mkdtempSync(join(tmpdir(), "zam-englisch8-"));
const user = tile.atoms[0].id;
const snapshot = async (db) => ({
	cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
});
const withoutToken = ({ token_id, ...rest }) => rest;
async function open(name) {
	const db = await zam.openDatabase({
		dbPath: join(dir, `${name}.db`),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, legacy);
	return db;
}
async function seed(db, ids) {
	for (const tokenId of ids) {
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
}
const ids = items.map((item) => item.id);
try {
	for (const [name, cell, moves] of [
		["previous-version-without-mapping", previousCell, new Map()],
		["approved-first-install", tile, transfers],
		["approved-upgrade", tile, transfers],
	]) {
		const db = await open(name);
		try {
			if (name === "approved-upgrade")
				await zam.installKvtTile(db, previousCell);
			await seed(db, [...oldById.keys()]);
			const before = await snapshot(db);
			assert.equal(before.cards.length, 4);
			assert.equal(before.reviews.length, 8);
			await zam.installKvtTile(db, cell);
			const after = await snapshot(db);
			assert.equal(after.cards.length, 4);
			assert.equal(after.reviews.length, 8);
			for (const [key, records] of Object.entries(before))
				for (const original of records) {
					const current = after[key].find(
						(record) => record.id === original.id,
					);
					assert.ok(current);
					assert.deepEqual(withoutToken(current), withoutToken(original));
					assert.equal(
						current.token_id,
						moves.get(original.token_id) ?? original.token_id,
						"only the A row moves its history, unchanged, to its one successor",
					);
				}
			for (const row of mapping.rows.filter((entry) => entry.category === "C")) {
				const token = await zam.getTokenById(db, row.de_by_id);
				assert.ok(token);
				assert.ok(!token.deprecated_at, "C cards stay active");
			}
			await zam.installKvtTile(db, cell);
			assert.deepEqual(await snapshot(db), after, "installation is repeatable");

			for (const id of ids) await zam.ensureCard(db, id, user);
			const enrolled = await snapshot(db);
			for (const old of after.cards)
				assert.deepEqual(
					enrolled.cards.find((card) => card.id === old.id),
					old,
					"existing FSRS state must stay identical",
				);
			const moved = new Set(moves.values());
			const fresh = enrolled.cards.filter(
				(card) => ids.includes(card.token_id) && !moved.has(card.token_id),
			);
			assert.equal(fresh.length, items.length - moved.size);
			for (const card of fresh) {
				assert.equal(card.reps, 0);
				assert.equal(card.stability, 0);
			}
			assert.equal(enrolled.reviews.length, 8);
			await zam.installKvtTile(db, cell);
			for (const id of ids) await zam.ensureCard(db, id, user);
			assert.deepEqual(
				await snapshot(db),
				enrolled,
				"repeated installation and card creation must be idempotent",
			);
			for (const item of items) {
				const token = await zam.getTokenById(db, item.id);
				assert.equal(token.source_link, item.source_link);
			}
			console.log(
				`ok   ${name}: 4 card states / 8 reviews intact; ${moves.size} history moved to e8-if-type3-check; three C cards active; ${fresh.length} fresh cards without mastery; repeat install changes nothing.`,
			);
		} finally {
			await db.close();
		}
	}

	// A learner who already reviews both ids must not be merged automatically.
	const db = await open("collision");
	try {
		await zam.installKvtTile(db, previousCell);
		const [oldId, newId] = [...transfers.entries()][0];
		await seed(db, [oldId, newId]);
		const before = await snapshot(db);
		await assert.rejects(
			() => zam.installKvtTile(db, tile),
			/holds a card on both|merge/i,
		);
		assert.deepEqual(
			await snapshot(db),
			before,
			"a collision preserves both complete histories",
		);
		console.log(
			"ok   collision: a learner holding cards on the old id and its successor makes 2026.10.2 refuse; both histories stay intact.",
		);
	} finally {
		await db.close();
	}
} finally {
	rmSync(dir, { recursive: true, force: true });
}
