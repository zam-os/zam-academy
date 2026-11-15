// Uses disposable libraries only. Proposal-only mappings carry no replaces or
// retired_items yet, so the cell installs cleanly without touching existing cards.
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
assert.equal(mapping.sources.length, 1);
assert.equal(mapping.rows.length, 8);
assert.ok(!("retired_items" in tile));
assert.ok(
	tile.atoms.every((atom) =>
		atom.practice_items.every((item) => !("replaces" in item)),
	),
);

const dir = mkdtempSync(join(tmpdir(), "zam-inf-gym6-"));
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
	for (const id of ids) await zam.ensureCard(db, id, user);
	const cardsBefore = await db.prepare("SELECT * FROM cards ORDER BY id").all();
	assert.equal(cardsBefore.length, ids.length);
	await zam.installKvtTile(db, tile);
	const cardsAfter = await db.prepare("SELECT * FROM cards ORDER BY id").all();
	assert.deepEqual(cardsAfter, cardsBefore);
	for (const item of tile.atoms.flatMap((atom) => atom.practice_items)) {
		const token = await zam.getTokenById(db, item.id);
		assert.equal(token.source_link, item.source_link);
	}
	console.log(
		`ok: ${tile.atoms.length} atoms / ${ids.length} cards installed and verified idempotently.`,
	);
} finally {
	if (db) await db.close();
	rmSync(dir, { recursive: true, force: true });
}
