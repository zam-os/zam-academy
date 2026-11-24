import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const coverage = JSON.parse(read("coverage.json"));
const source = read("tests/fixtures/lehrplanplus-l5.html");
const hash = (s) => createHash("sha256").update(s).digest("hex");

assert.equal(hash(source), coverage.curriculum_sha256);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-l6.html")),
	coverage.neighbours.grade6.sha256,
);
assert.equal(
	hash(read("tests/fixtures/lehrplanplus-fachprofil.html")),
	coverage.neighbours.fachprofil.sha256,
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
assert.equal(coverage.rows.length, 53);

const lessons = JSON.parse(read("src/curriculum/lessons.json"));
const mapped = new Set(coverage.rows.flatMap((row) => row.lessons));
const unmapped = lessons
	.filter((lesson) => !mapped.has(lesson.id))
	.map((l) => l.id);
assert.deepEqual(unmapped, [], "Every lesson must map to a curriculum row.");

const docUrl = new URL("../docs/latein-gymnasium-5-coverage.md", root);
if (existsSync(docUrl)) {
	const doc = readFileSync(docUrl, "utf8");
	const expectedSupported = coverage.rows
		.filter((row) => row.status === "supported")
		.map((row) => row.id)
		.sort();
	const expectedImplementedCount = coverage.rows.filter(
		(row) => row.status === "implemented",
	).length;
	const implMatch = doc.match(/- \*\*`implemented` \((\d+) Zeilen\):\*\*/);
	const suppMatch = doc.match(/- \*\*`supported` \((\d+) Zeilen\):\*\* (.+)/);
	assert.ok(implMatch, "docs/latein-gymnasium-5-coverage.md must list implemented count");
	assert.ok(suppMatch, "docs/latein-gymnasium-5-coverage.md must list supported row IDs");
	assert.equal(Number(implMatch[1]), expectedImplementedCount);
	assert.equal(Number(suppMatch[1]), expectedSupported.length);
	const docIds = [...new Set(suppMatch[2].match(/L5-\d{2}/g) ?? [])].sort();
	assert.deepEqual(
		docIds,
		expectedSupported,
		"docs/latein-gymnasium-5-coverage.md supported IDs must match coverage.json",
	);
}

console.log(
	`ok: ${coverage.rows.length} curriculum rows, ${missing.length} not found; all three source SHA-256 values and all ${lessons.length} lessons match.`,
);
