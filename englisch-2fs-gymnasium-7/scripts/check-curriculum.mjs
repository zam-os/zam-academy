import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const source = read("tests/fixtures/e7.html");
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
assert.equal(hash(source), coverage.curriculum_sha256);
assert.equal(hash(read("tests/fixtures/e6.html")), coverage.neighbours.grade6.sha256);
assert.equal(hash(read("tests/fixtures/e8.html")), coverage.neighbours.grade8.sha256);
const entities = { nbsp: " ", ndash: "–", amp: "&", quot: '"', apos: "'", shy: "\u00ad" };
const collapse = (text) => text.replace(/\s+/g, " ").trim();
const text = collapse(
	source
		.toString()
		.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
		.replace(/<\/?(?:li|ul|br|p|h[1-6])\b[^>]*>/gi, " ")
		.replace(/<[^>]+>/g, "")
		.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
			String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n)),
		)
		.replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match),
);
const missing = coverage.rows.filter(({ competence }) => !text.includes(collapse(competence)));
assert.equal(coverage.rows.length, 40);
assert.deepEqual(
	missing.map(({ id }) => id),
	[],
);
console.log("ok: 40 verbatim curriculum rows found; all three source hashes match.");

const proposal = JSON.parse(read("replaces-de-by.json"));
for (const { file, sha256 } of proposal.sources) assert.equal(hash(read(file)), sha256, file);
console.log("ok: the legacy card snapshot matches the recorded SHA-256.");
