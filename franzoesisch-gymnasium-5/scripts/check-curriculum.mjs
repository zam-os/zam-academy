import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const coverage = JSON.parse(read("coverage.json"));
const source = read("tests/fixtures/lehrplanplus-f5.html");
const hash = (s) => createHash("sha256").update(s).digest("hex");
assert.equal(hash(source), coverage.curriculum_sha256);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-f6.html")),
	coverage.neighbour.sha256,
);
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
const text = source
	.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
	.replace(/<\/?(?:li|ul|br|p|h[1-6])\b[^>]*>/gi, " ")
	.replace(/<[^>]+>/g, "")
	.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
		String.fromCodePoint(
			n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n),
		),
	)
	.replace(/&([a-z]+);/gi, (m, n) => entities[n] ?? m)
	.replace(/\s+/g, " ")
	.trim();
const missing = coverage.rows.filter(
	(row) => !text.includes(row.competence.replace(/\s+/g, " ").trim()),
);
assert.deepEqual(
	missing.map((row) => row.id),
	[],
	"Every expectation must occur verbatim after whitespace normalization.",
);
assert.equal(coverage.rows.length, 47);
console.log(
	`ok: ${coverage.rows.length} curriculum rows, ${missing.length} not found; both source SHA-256 values match.`,
);
