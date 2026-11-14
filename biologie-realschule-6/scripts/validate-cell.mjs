// Disposable libraries only; never connect to the learner's configured library or cloud.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(join(root, "cell.json"), "utf8"));
const mapping = JSON.parse(
	readFileSync(join(root, "replaces-de-by.json"), "utf8"),
);

assert.equal(mapping.status, "approved");
assert.equal(mapping.approved, "2026-11-14");
assert.equal(mapping.rows.length, 40);
assert.equal(mapping.rows.filter((r) => r.category === "A").length, 3);
assert.ok(!tile.retired_items?.length);

const items = tile.atoms.flatMap((a) => a.practice_items);
const bySlug = new Map(items.map((i) => [i.slug, i]));
const expectedTransfers = new Map();
for (const row of mapping.rows) {
	if (row.category === "A") {
		assert.equal(row.action, "replace");
		const successor = bySlug.get(row.academy_slug);
		assert.ok(successor, `missing successor ${row.academy_slug}`);
		assert.deepEqual(successor.replaces, [row.de_by_id], row.academy_slug);
		expectedTransfers.set(row.de_by_id, successor.id);
	} else {
		assert.equal(row.category, "C");
		assert.equal(row.action, "keep-active");
		assert.equal(row.academy_slug, null);
	}
}
assert.deepEqual(
	items
		.filter((i) => i.replaces?.length)
		.map((i) => i.id)
		.sort(),
	[...expectedTransfers.values()].sort(),
);

const dir = mkdtempSync(join(tmpdir(), "zam-bio6-"));
const user = tile.atoms[0].id;
const open = (name) =>
	zam.openDatabase({
		dbPath: join(dir, name),
		initialize: true,
		useConfiguredCloud: false,
	});
const snapshot = async (database) => ({
	tokens: await database.prepare("SELECT * FROM tokens ORDER BY id").all(),
	replacements: await database
		.prepare(
			"SELECT * FROM practice_item_replacements ORDER BY old_item_id, new_item_id",
		)
		.all(),
	cards: await database.prepare("SELECT * FROM cards ORDER BY id").all(),
	reviews: await database
		.prepare("SELECT * FROM review_logs ORDER BY id")
		.all(),
});
const withoutToken = ({ token_id, ...fields }) => fields;
const reviewed = async (database, tokenId, rating, day) => {
	const card = await zam.ensureCard(database, tokenId, user);
	await zam.evaluateRating(database, {
		cardId: card.id,
		tokenId,
		userId: user,
		rating,
		answerFormat: "recall",
		responseTimeMs: 2400,
		now: new Date(Date.UTC(2026, 10, day)),
	});
};

const legacyTiles = [];
const oldIds = [];
for (const source of mapping.sources) {
	const bytes = readFileSync(join(root, source.file));
	assert.equal(
		createHash("sha256").update(bytes).digest("hex"),
		source.sha256,
	);
	const old = JSON.parse(bytes.toString("utf8"));
	legacyTiles.push(old);
	for (const atom of old.atoms)
		for (const item of atom.practice_items) oldIds.push(item.id);
}

try {
	const db = await open("library.db");
	try {
		for (const old of legacyTiles) await zam.installKvtTile(db, old);
		for (const [index, id] of oldIds.entries()) {
			await reviewed(db, id, index % 3 === 0 ? 1 : 3, 10);
			await reviewed(db, id, index % 2 === 0 ? 3 : 4, 11);
		}
		const before = await snapshot(db);
		assert.equal(before.cards.length, 40);
		assert.equal(before.reviews.length, 80);

		await zam.installKvtTile(db, tile);
		const after = await snapshot(db);
		assert.equal(after.cards.length, 40);
		assert.equal(after.reviews.length, 80);
		for (const table of ["cards", "reviews"]) {
			for (const old of before[table]) {
				const fresh = after[table].find((row) => row.id === old.id);
				assert.ok(fresh);
				assert.deepEqual(withoutToken(fresh), withoutToken(old));
				assert.equal(
					fresh.token_id,
					expectedTransfers.get(old.token_id) ?? old.token_id,
				);
			}
		}
		assert.deepEqual(
			after.replacements.map(({ old_item_id, new_item_id }) => [
				old_item_id,
				new_item_id,
			]),
			[...expectedTransfers.entries()].sort(([a], [b]) => a.localeCompare(b)),
		);

		await zam.installKvtTile(db, tile);
		assert.deepEqual(await snapshot(db), after, "repeat install idempotent");

		const ids = items.map((i) => i.id);
		assert.equal(ids.length, 60);
		assert.ok(ids.every((id) => !oldIds.includes(id)));
		for (const id of ids) await zam.ensureCard(db, id, user);
		const enrolled = await snapshot(db);
		assert.equal(enrolled.cards.length, 97);
		assert.deepEqual(enrolled.reviews, after.reviews);
		for (const card of after.cards)
			assert.deepEqual(
				enrolled.cards.find((c) => c.id === card.id),
				card,
			);
		for (const card of enrolled.cards.filter(
			(c) => ids.includes(c.token_id) && !after.cards.some((a) => a.id === c.id),
		)) {
			assert.equal(card.reps, 0);
			assert.equal(card.stability, 0);
		}
		await zam.installKvtTile(db, tile);
		for (const id of ids) await zam.ensureCard(db, id, user);
		assert.deepEqual(await snapshot(db), enrolled);
		for (const item of items)
			assert.equal(
				(await zam.getTokenById(db, item.id)).source_link,
				item.source_link,
			);
	} finally {
		await db.close();
	}

	const withoutReplaces = structuredClone(tile);
	for (const item of withoutReplaces.atoms.flatMap((a) => a.practice_items))
		delete item.replaces;
	for (const [oldId, newId] of expectedTransfers.entries()) {
		const cdb = await open(`collision-${oldId}.db`);
		try {
			for (const old of legacyTiles) await zam.installKvtTile(cdb, old);
			await zam.installKvtTile(cdb, withoutReplaces);
			await reviewed(cdb, oldId, 1, 10);
			await reviewed(cdb, newId, 3, 11);
			const before = await snapshot(cdb);
			await assert.rejects(
				() => zam.installKvtTile(cdb, tile),
				(err) =>
					err.message.includes(oldId) &&
					err.message.includes(newId) &&
					err.message.includes(user),
			);
			assert.deepEqual(await snapshot(cdb), before);
		} finally {
			await cdb.close();
		}
	}
	console.log(
		`ok: 30 atoms / 60 cards (${tile.version}); 3 A histories transferred (6 reviews), 37 C cards kept active, 57 fresh cards enrolled, collision refused.`,
	);
} finally {
	rmSync(dir, { recursive: true, force: true });
}
