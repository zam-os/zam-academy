import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const read = (file) =>
	JSON.parse(readFileSync(new URL(file, import.meta.url), "utf8"));
const coverage = read("../coverage.json");
const official = read("../tests/fixtures/official-curriculum.json");
const mapping = read("../replaces-de-by.json");
const cell = read("../cell.json");
const byArea = (lb) =>
	coverage.rows.filter((row) => row.lb === lb).map((row) => row.competence);

for (const area of official)
	assert.deepEqual(byArea(area.lb), area.competencies);
for (const source of mapping.sources) {
	const bytes = readFileSync(new URL(`../${source.file}`, import.meta.url));
	assert.equal(
		createHash("sha256").update(bytes).digest("hex"),
		source.sha256,
		source.file,
	);
	assert.equal(JSON.parse(bytes).tile_id, source.tile_id);
}

const rawFile = process.argv[2];
if (rawFile) {
	const bytes = readFileSync(rawFile);
	assert.equal(
		createHash("sha256").update(bytes).digest("hex"),
		coverage.curriculum_sha256,
	);
	const normalized = (text) =>
		text
			.replace(/<[^>]+>/g, "")
			.replace(/&nbsp;/g, " ")
			.replace(/&amp;/g, "&")
			.replace(/\s+/g, " ")
			.trim();
	const sourceAreas = bytes
		.toString("utf8")
		.split('<h3 class="plain">Kompetenzerwartungen</h3>')
		.slice(1);
	assert.equal(sourceAreas.length, official.length);
	for (const [index, area] of sourceAreas.entries()) {
		const section = area
			.split("Inhalte zu den Kompetenzen")[0]
			.replace(/<dialog\b[\s\S]*?<\/dialog>/g, "");
		const competencies = [...section.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(
			([, text]) => normalized(text),
		);
		assert.deepEqual(byArea(index + 1), competencies);
	}
}

const sources = read("../tests/fixtures/source-checks.json");
assert.equal(new Set(sources.map((source) => source.url)).size, sources.length);
for (const source of sources) {
	assert.ok(source.title.length > 3);
	assert.equal(source.checked, coverage.checked);
	assert.ok(
		cell.sources.some(
			(item) => item.uri === source.url && item.label === source.title,
		),
	);
}

console.log(
	`${coverage.rows.length} competencies matched by area${rawFile ? ` against ${fileURLToPath(new URL(`file://${rawFile}`))}` : " against the pinned excerpt"}; ${mapping.rows.length} legacy rows and ${sources.length} checked references.`,
);
