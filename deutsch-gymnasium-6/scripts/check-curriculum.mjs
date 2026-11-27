import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const json = (path) => JSON.parse(read(path));
const hash = (bytes) => createHash("sha256").update(bytes).digest("hex");
const coverage = json("coverage.json");
const raw = gunzipSync(read("tests/fixtures/lehrplanplus-d6.html.gz"));
assert.equal(hash(raw), coverage.curriculum_sha256);

const entities = {
	nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">",
	ndash: "–", mdash: "—", hellip: "…", laquo: "«", raquo: "»", shy: "\u00ad",
};
const normalize = (fragment) =>
	fragment
		.replace(/<[^>]+>/g, "")
		.replace(/&#(x[\da-f]+|\d+);/gi, (_, value) =>
			String.fromCodePoint(value[0].toLowerCase() === "x" ? parseInt(value.slice(1), 16) : Number(value)),
		)
		.replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match)
		.replace(/\s+/g, " ")
		.trim();

const page = raw.toString("utf8").replace(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/gi, "");
const areas = page.matchAll(
	/<strong>D6<\/strong>\s*<span>(\d\.\d)<\/span>\s*<span>[^<]+<\/span>[\s\S]*?<h4 class="plain">Kompetenzerwartungen und Inhalte<\/h4>\s*<p>[^<]+<\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
);
const official = Array.from(areas).flatMap(([, section, lists]) =>
	Array.from(lists.matchAll(/<li>([\s\S]*?)<\/li>/g), ([, fragment], index) => ({
		id: `${section}.${index + 1}`,
		competence: normalize(fragment),
	})),
);
assert.equal(official.length, 42);
assert.deepEqual(coverage.rows.map(({ id, competence }) => ({ id, competence })), official);

for (const source of json("replaces-de-by.json").sources)
	assert.equal(hash(read(source.file)), source.sha256);

const lessons = json("src/curriculum/outline.json").stages.flatMap(({ id }) =>
	json(`src/curriculum/lessons-${id}.json`),
);
for (const medium of json("src/media/provenance.json")) {
	assert.equal(hash(read(medium.file)), medium.sha256);
	assert.equal(hash(lessons.find((lesson) => lesson.id === medium.lesson).material), medium.transcript_sha256);
}
console.log(`ok: ${official.length} expectations in order, 0 missing; curriculum, legacy and audio SHA-256 values match.`);
