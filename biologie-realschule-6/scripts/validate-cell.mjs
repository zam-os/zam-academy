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
assert.equal(mapping.status, "proposal-only");
assert.equal(mapping.approved, null);
assert.equal(mapping.rows.length, 40);
assert.equal(mapping.rows.filter((r) => r.category === "A").length, 3);
assert.ok(!tile.retired_items?.length);
assert.ok(
	tile.atoms.every((a) => a.practice_items.every((i) => !i.replaces?.length)),
);
const dir = mkdtempSync(join(tmpdir(), "zam-bio6-"));
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
	for (const source of mapping.sources) {
		const bytes = readFileSync(join(root, source.file));
		assert.equal(
			createHash("sha256").update(bytes).digest("hex"),
			source.sha256,
		);
		const old = JSON.parse(bytes);
		await zam.installKvtTile(db, old);
		for (const atom of old.atoms)
			for (const item of atom.practice_items) oldIds.add(item.id);
	}
	for (const id of oldIds) {
		const card = await zam.ensureCard(db, id, user);
		for (const day of [10, 11])
			await zam.evaluateRating(db, {
				cardId: card.id,
				tokenId: id,
				userId: user,
				rating: 3,
				answerFormat: "recall",
				now: new Date(Date.UTC(2026, 10, day)),
			});
	}
	const before = await snapshot(db);
	assert.equal(before.cards.length, 40);
	assert.equal(before.reviews.length, 80);
	for (let repeat = 0; repeat < 2; repeat++) {
		await zam.installKvtTile(db, tile);
		assert.deepEqual(
			await snapshot(db),
			before,
			"installation must not enroll or change existing cards and reviews",
		);
	}
	const ids = tile.atoms.flatMap((a) => a.practice_items.map((i) => i.id));
	assert.equal(ids.length, 60);
	assert.ok(ids.every((id) => !oldIds.has(id)));
	for (const id of ids) await zam.ensureCard(db, id, user);
	const enrolled = await snapshot(db);
	assert.equal(enrolled.cards.length, 100);
	assert.deepEqual(enrolled.reviews, before.reviews);
	for (const card of before.cards)
		assert.deepEqual(
			enrolled.cards.find((c) => c.id === card.id),
			card,
		);
	for (const card of enrolled.cards.filter((c) => ids.includes(c.token_id))) {
		assert.equal(card.reps, 0);
		assert.equal(card.stability, 0);
	}
	await zam.installKvtTile(db, tile);
	for (const id of ids) await zam.ensureCard(db, id, user);
	assert.deepEqual(await snapshot(db), enrolled);
	for (const item of tile.atoms.flatMap((a) => a.practice_items))
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	console.log(
		"ok: 30 atoms / 60 fresh cards; 40 legacy cards and 80 reviews unchanged; repeated installation and enrollment are idempotent.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
