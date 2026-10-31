import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { ulid } from "../src/id.ts";

const core = await import(
	process.env.ZAM_CORE ??
		new URL("../../../zam/dist/index.js", import.meta.url).href
);
const tile = JSON.parse(
	readFileSync(new URL("../cell.json", import.meta.url), "utf8"),
);
const dir = mkdtempSync(join(tmpdir(), "zam-grade4-validation-"));
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
	const user = ulid();
	const first = await core.materialiseKvtCards(
		db,
		user,
		tile.atoms.map((a) => a.id),
	);
	assert.equal(first.cardsCreated, 8);
	const again = await core.materialiseKvtCards(
		db,
		user,
		tile.atoms.map((a) => a.id),
	);
	assert.equal(again.cardsCreated, 0);
	const cards = await db
		.prepare("SELECT c.id, c.token_id FROM cards c ORDER BY c.id")
		.all();
	assert.equal(cards.length, 8);
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
	for (const atom of tile.atoms)
		assert.ok(atom.curricula.every((c) => c.provider === "zam-academy"));
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
		"Cell validated in a disposable library: 4 atoms, 8 cards, idempotent enrolment, recall rating, history preservation and no broad grade binding.",
	);
} finally {
	await db.close();
	rmSync(dir, { recursive: true, force: true });
}
