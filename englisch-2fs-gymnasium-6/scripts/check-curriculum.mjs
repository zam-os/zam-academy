import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const coverage = JSON.parse(read("coverage.json"));
const source = read("tests/fixtures/lehrplanplus-e6-2fs.html");
const hash = (s) => createHash("sha256").update(s).digest("hex");

assert.equal(hash(source), coverage.curriculum_sha256);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-gs34.html")),
	coverage.neighbours.primary.sha256,
);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-e6.html")),
	coverage.neighbours.grade6_first_language.sha256,
);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-e7-2fs.html")),
	coverage.neighbours.grade7_second_language.sha256,
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
assert.equal(coverage.rows.length, 39);

const lessons = JSON.parse(read("src/curriculum/lessons.json"));
const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
const unmapped = lessons.filter((lesson) => !mapped.has(lesson.id)).map((l) => l.id);
assert.deepEqual(unmapped, [], "Every lesson must map to a curriculum row.");

console.log(
	`ok: ${coverage.rows.length} curriculum rows, ${missing.length} not found; all four source SHA-256 values and all ${lessons.length} lessons match.`,
);
