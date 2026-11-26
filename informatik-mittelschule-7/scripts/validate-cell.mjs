// Uses a disposable library only. Verify new cards and exact lesson links,
// then check that reinstalling preserves tokens, card state and a review.
import assert from "node:assert/strict";
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
assert.deepEqual(mapping.sources, []);
assert.deepEqual(mapping.rows, []);
assert.ok(!("retired_items" in tile));
assert.ok(
	tile.atoms.every((atom) =>
		atom.practice_items.every((item) => !("replaces" in item)),
	),
);

const dir = mkdtempSync(join(tmpdir(), "zam-inf-ms7-"));
const user = tile.atoms[0].id;
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	await zam.installKvtTile(db, tile);
	const ids = tile.atoms.flatMap((atom) =>
		atom.practice_items.map((item) => item.id),
	);
	const cards = [];
	for (const id of ids) cards.push(await zam.ensureCard(db, id, user));
	await zam.evaluateRating(db, {
		cardId: cards[0].id,
		tokenId: ids[0],
		userId: user,
		rating: 3,
		answerFormat: "recall",
	});
	const snapshot = async () => ({
		tokens: await db.prepare("SELECT * FROM tokens ORDER BY id").all(),
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, ids.length);
	assert.equal(before.reviews.length, 1);
	await zam.installKvtTile(db, tile);
	assert.deepEqual(await snapshot(), before);
	for (const item of tile.atoms.flatMap((atom) => atom.practice_items)) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	console.log(
		`ok: ${tile.atoms.length} atoms / ${ids.length} cards installed; reinstall preserved tokens, scheduling and review history.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
