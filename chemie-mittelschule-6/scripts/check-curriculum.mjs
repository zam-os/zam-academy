import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
const root = new URL("../", import.meta.url);
const read = (p) => readFileSync(new URL(p, root), "utf8");
const hash = (s) => createHash("sha256").update(s).digest("hex");
const coverage = JSON.parse(read("coverage.json"));
const source = read("tests/fixtures/lehrplanplus-nt6.html");
assert.equal(hash(source), coverage.curriculum_sha256);
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
	shy: "\u00ad",
};
const normalize = (s) => s.replace(/\s+/g, " ").trim();
const text = normalize(
	source
		.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
		.replace(/<[^>]*>/g, " ")
		.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
			String.fromCodePoint(
				n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n),
			),
		)
		.replace(/&([a-z]+);/gi, (m, n) => entities[n] ?? m),
);
const missing = coverage.rows.filter(
	(r) => !text.includes(normalize(r.competence)),
);
assert.deepEqual(
	missing.map((r) => r.id),
	[],
);
assert.equal(coverage.rows.length, 20);
for (const n of coverage.neighbours) assert.equal(hash(read(n.file)), n.sha256);
for (const check of JSON.parse(read("source-checks.json"))) {
	const html = read(check.file);
	assert.equal(hash(html), check.sha256);
	const title = normalize(
		html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "",
	);
	assert.equal(title, check.title);
	assert.match(title, /LehrplanPLUS.*Natur und Technik.*Fachlehrpläne/);
}
console.log(
	`ok: ${coverage.rows.length} verbatim curriculum rows, ${missing.length} not found; four official source titles and SHA-256 snapshots match.`,
);
