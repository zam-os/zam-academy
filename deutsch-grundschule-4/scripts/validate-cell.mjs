// Installs the cell into a disposable ZAM library with the published
// zam-core, enrols every card, rates one, reinstalls and checks that the
// review history is untouched. The cell transfers no existing history.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node deutsch-grundschule-4/scripts/validate-cell.mjs
import assert from "node:assert/strict";
import { randomBytes } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const core = await import(process.env.ZAM_CORE ?? "zam-core");
const tile = JSON.parse(readFileSync(new URL("../cell.json", import.meta.url), "utf8"));
const CARDS = 78;

function ulid() {
	const alphabet = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";
	let n = (BigInt(Date.now()) << 80n) | BigInt(`0x${randomBytes(10).toString("hex")}`);
	let out = "";
	for (let i = 0; i < 26; i++) {
		out = alphabet[Number(n & 31n)] + out;
		n >>= 5n;
	}
	return out;
}

assert.equal("retired_items" in tile, false);
for (const atom of tile.atoms)
	for (const item of atom.practice_items) assert.equal("replaces" in item, false, item.slug);

const dir = mkdtempSync(join(tmpdir(), "zam-deutsch-gs4-"));
const db = await core.openDatabase({ dbPath: join(dir, "test.db"), initialize: true, useConfiguredCloud: false });
try {
	await core.installKvtTile(db, tile);
	const user = ulid();
	const first = await core.materialiseKvtCards(db, user, tile.atoms.map((a) => a.id));
	assert.equal(first.cardsCreated, CARDS);
	const again = await core.materialiseKvtCards(db, user, tile.atoms.map((a) => a.id));
	assert.equal(again.cardsCreated, 0);
	const cards = await db.prepare("SELECT c.id, c.token_id FROM cards c ORDER BY c.id").all();
	assert.equal(cards.length, CARDS);
	const review = await core.evaluateRating(db, {
		cardId: cards[0].id,
		tokenId: cards[0].token_id,
		userId: user,
		rating: 3,
		answerFormat: "recall",
	});
	assert.ok(review.nextDueAt);
	const before = JSON.stringify(await db.prepare("SELECT * FROM review_logs ORDER BY id").all());
	await core.installKvtTile(db, tile);
	assert.equal(JSON.stringify(await db.prepare("SELECT * FROM review_logs ORDER BY id").all()), before);
	assert.equal(
		(await db.prepare("SELECT COUNT(*) AS n FROM atom_curriculum_bindings WHERE provider = ?").get("lehrplanplus-bayern")).n,
		0,
	);
	console.log(
		`Cell validated in a disposable library: ${tile.atoms.length} atoms, ${CARDS} cards, idempotent enrolment, recall rating, history kept on reinstall, no broad grade binding.`,
	);
} finally {
	await db.close();
	rmSync(dir, { recursive: true, force: true });
}
