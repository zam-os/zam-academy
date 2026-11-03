import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const core = await import(
	process.env.ZAM_CORE ??
		new URL("../../../zam/dist/index.js", import.meta.url).href
);
const tile = JSON.parse(
	readFileSync(new URL("../cell.json", import.meta.url), "utf8"),
);
const dir = mkdtempSync(join(tmpdir(), "zam-hsu4-validation-"));
const db = await core.openDatabase({
	dbPath: join(dir, "test.db"),
	initialize: true,
	useConfiguredCloud: false,
});

try {
	await core.installKvtTile(db, tile);
	assert.equal(
		(await db.prepare("SELECT COUNT(*) AS n FROM cards").get()).n,
		0,
	);
	const user = "01M6FXBPZTEDBDS6Z3HHBD09Y0";
	const first = await core.materialiseKvtCards(
		db,
		user,
		tile.atoms.map((a) => a.id),
	);
	assert.equal(first.cardsCreated, 60);

	const again = await core.materialiseKvtCards(
		db,
		user,
		tile.atoms.map((a) => a.id),
	);
	assert.equal(again.cardsCreated, 0);

	const cards = await db
		.prepare("SELECT c.id, c.token_id FROM cards c ORDER BY c.id")
		.all();
	assert.equal(cards.length, 60);

	const review = await core.evaluateRating(db, {
		cardId: cards[0].id,
		tokenId: cards[0].token_id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
	});
	assert.ok(review.nextDueAt);

	const before = JSON.stringify(
		await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
	);
	await core.installKvtTile(db, tile);
	assert.equal(
		JSON.stringify(
			await db.prepare("SELECT * FROM review_logs ORDER BY id").all(),
		),
		before,
	);

	for (const atom of tile.atoms) {
		assert.ok(atom.curricula.every((c) => c.provider === "zam-academy"));
	}
	assert.equal(
		(
			await db
				.prepare(
					"SELECT COUNT(*) AS n FROM atom_curriculum_bindings WHERE provider = ?",
				)
				.get("lehrplanplus-bayern")
		).n,
		0,
	);
	console.log(
		"HSU 4 cell validated in disposable library: 20 atoms, 60 cards, idempotent enrolment, recall rating, review-log preservation, and deferred official grade binding.",
	);
} finally {
	await db.close();
	rmSync(dir, { recursive: true, force: true });
}
