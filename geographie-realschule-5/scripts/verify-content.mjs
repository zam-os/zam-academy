import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root));
const json = (p) => JSON.parse(read(p));
const hash = (b) => createHash("sha256").update(b).digest("hex");
const coverage = json("coverage.json");
const fixture = json("tests/fixtures/official-curriculum.json");
const raw = read("tests/fixtures/official-curriculum.html");
assert.equal(hash(raw), fixture.curriculum_sha256);
assert.equal(coverage.curriculum_sha256, fixture.curriculum_sha256);
// Decode the entities present in this fetched government page; preserve Unicode punctuation.
const entities = {
	nbsp: " ",
	amp: "&",
	quot: '"',
	apos: "'",
	lt: "<",
	gt: ">",
	ndash: "–",
	mdash: "—",
	shy: "",
	auml: "ä",
	ouml: "ö",
	uuml: "ü",
	Auml: "Ä",
	Ouml: "Ö",
	Uuml: "Ü",
	szlig: "ß",
};
const normal = (s) => s.replace(/\s+/gu, " ").trim();
const page = normal(
	raw
		.toString()
		.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
		.replace(/<[^>]+>/g, " ")
		.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (_, key) =>
			key.startsWith("#x")
				? String.fromCodePoint(parseInt(key.slice(2), 16))
				: key.startsWith("#")
					? String.fromCodePoint(Number(key.slice(1)))
					: (entities[key] ?? `&${key};`),
		),
);
let rows = 0;
for (const area of coverage.areas) {
	const official = fixture.areas.find((a) => a.lb === area.lb);
	assert.deepEqual(
		area.competencies.map((c) => c.competence),
		official.competences,
	);
	for (const c of area.competencies) {
		assert.ok(
			page.includes(normal(c.competence)),
			`Not verbatim: ${c.competence}`,
		);
		rows++;
	}
}
const mapping = json("replaces-de-by.json");
for (const source of mapping.sources)
	assert.equal(hash(read(source.file)), source.sha256, source.file);
const cell = json("cell.json");
assert.equal(mapping.approved, "2026-11-14");
assert.equal(mapping.status, "approved");
assert.ok(!("retired_items" in cell));
const items = cell.atoms.flatMap((a) => a.practice_items);
const approvedRows = mapping.rows.filter((r) => r.category === "A");
assert.equal(approvedRows.length, 6);
for (const row of approvedRows) {
	assert.equal(row.action, "replace", row.de_by_id);
	const item = items.find((i) => i.slug === row.academy_slug);
	assert.ok(item, `missing successor ${row.academy_slug}`);
	assert.deepEqual(item.replaces, [row.de_by_id], row.academy_slug);
}
for (const row of mapping.rows.filter((r) => r.category === "C")) {
	assert.equal(row.action, "keep-active", row.de_by_id);
}
assert.equal(
	items.filter((i) => "replaces" in i).length,
	approvedRows.length,
);
console.log(
	`${rows} competence rows; 0 not found in fetched curriculum; official and legacy SHA-256 checks pass.`,
);
