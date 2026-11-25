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
const source = read(coverage.file);
assert.equal(hash(source), coverage.curriculum_sha256);
const text = pageText(source);
assert.equal(coverage.rows.length, 47);
const missing = coverage.rows.filter(
	(row) => !text.includes(row.competence.replace(/\s+/g, " ").trim()),
);
assert.deepEqual(missing.map((row) => row.id), [], "Every row must occur verbatim in the curriculum.");
for (const neighbour of coverage.neighbours) assert.equal(hash(read(neighbour.file)), neighbour.sha256);
const cellSnapshot = coverage.moved_from;
assert.equal(hash(read(cellSnapshot.file)), cellSnapshot.sha256);
console.log(
	`ok: ${coverage.rows.length} curriculum rows, ${missing.length} not found; curriculum, ${coverage.neighbours.length} neighbouring snapshots and the source cell snapshot match their SHA-256.`,
);
