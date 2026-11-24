import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const coverage = JSON.parse(read("coverage.json"));
const hash = (text) => createHash("sha256").update(text).digest("hex");
const entities = {
	nbsp: " ",
	amp: "&",
	quot: '"',
	apos: "'",
	lt: "<",
	gt: ">",
	ndash: "–",
	mdash: "—",
	hellip: "…",
	laquo: "«",
	raquo: "»",
	shy: "\u00ad",
};
const pageText = (source) => source
	.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
	.replace(/<\/?(?:li|ul|br|p|h[1-6])\b[^>]*>/gi, " ")
	.replace(/<[^>]+>/g, "")
	.replace(/&#(x[\da-f]+|\d+);?/gi, (_, n) =>
		String.fromCodePoint(
			n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n),
		),
	)
	.replace(/&([a-z]+);/gi, (m, n) => entities[n] ?? m)
	.replace(/\s+/g, " ")
	.trim();
const expectedCounts = { F1: 50 };
assert.deepEqual(coverage.curricula.map((entry) => entry.track), ["F1"]);
assert.equal(coverage.rows.length, 50);
for (const curriculum of coverage.curricula) {
	const source = read(curriculum.file);
	assert.equal(hash(source), curriculum.curriculum_sha256);
	const text = pageText(source);
	const rows = coverage.rows.filter((entry) => entry.track === curriculum.track);
	assert.equal(rows.length, expectedCounts[curriculum.track]);
	const missing = rows.filter(
		(row) => !text.includes(row.competence.replace(/\s+/g, " ").trim()),
	);
	assert.deepEqual(missing.map((row) => row.id), [], "Every row must occur verbatim in its own curriculum.");
	console.log(`ok: ${curriculum.track}: ${rows.length} verbatim rows; ${missing.length} missing.`);
}
for (const neighbour of coverage.neighbours) assert.equal(hash(read(neighbour.file)), neighbour.sha256);
const mapping = JSON.parse(read("replaces-de-by.json"));
for (const snapshot of mapping.sources) assert.equal(hash(read(snapshot.file)), snapshot.sha256);
console.log(`The curriculum hash, ${coverage.neighbours.length} neighbouring snapshots and the legacy cell hash match.`);
