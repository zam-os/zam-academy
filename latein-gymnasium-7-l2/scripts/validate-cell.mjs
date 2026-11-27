// Disposable library only. Never open a configured or personal library.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const zam = await import(process.env.ZAM_CORE ?? "zam-core");
const root = new URL("../", import.meta.url);
const tile = JSON.parse(readFileSync(new URL("cell.json", root), "utf8"));
const mapping = JSON.parse(
	readFileSync(new URL("replaces-de-by.json", root), "utf8"),
);
const legacyPath = new URL(mapping.sources[0].path, root);
const legacyRaw = readFileSync(legacyPath, "utf8");
assert.equal(
	createHash("sha256").update(legacyRaw).digest("hex"),
	mapping.sources[0].sha256,
);
const legacyTile = JSON.parse(legacyRaw);

const dir = mkdtempSync(join(tmpdir(), "zam-latein7-"));
let db;
try {
	db = await zam.openDatabase({
		dbPath: join(dir, "library.db"),
		initialize: true,
		useConfiguredCloud: false,
	});
	// Install legacy grade-7 cell first to prove our proposal-only cell preserves all existing histories untouched.
	await zam.installKvtTile(db, legacyTile);
	const user = tile.atoms[0].id;
	const legacyItems = legacyTile.atoms.flatMap((a) => a.practice_items);
	for (const item of legacyItems) {
		const card = await zam.ensureCard(db, item.id, user);
		await zam.evaluateRating(db, {
			cardId: card.id,
			tokenId: item.id,
			userId: user,
			rating: 3,
			answerFormat: "recall",
			now: new Date("2026-11-20T12:00:00Z"),
		});
	}
	const legacyBefore = await db
		.prepare("SELECT * FROM review_logs ORDER BY id")
		.all();
	assert.equal(legacyBefore.length, 4);

	await zam.installKvtTile(db, tile);
	const items = tile.atoms.flatMap((a) => a.practice_items);
	assert.equal(items.length, 120);
	for (const item of items) {
		const card = await zam.ensureCard(db, item.id, user);
		assert.equal(card.reps, 0);
		assert.equal(
			(await zam.getTokenById(db, item.id)).source_link,
			item.source_link,
		);
	}

	// Repeat install is idempotent and leaves all legacy histories untouched.
	const snapshot = async () => ({
		cards: await db.prepare("SELECT * FROM cards ORDER BY id").all(),
		reviews: await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	});
	const before = await snapshot();
	assert.equal(before.cards.length, 124);
	assert.deepEqual(before.reviews, legacyBefore);
	await zam.installKvtTile(db, tile);
	assert.deepEqual(await snapshot(), before);

	console.log(
		"ok: 120 Latein-7 cards install and enrol cleanly; all 4 legacy de-by review histories remain untouched; repeat install is idempotent.",
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
