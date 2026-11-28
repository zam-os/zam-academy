import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root));
const json = (path) => JSON.parse(read(path).toString("utf8"));
const hash = (value) => createHash("sha256").update(value).digest("hex");

const coverage = json("coverage.json");
const shownDate = new Intl.DateTimeFormat("de-DE", {
	dateStyle: "long",
	timeZone: "UTC",
}).format(new Date(coverage.checked));
assert.ok(
	read("index.html")
		.toString("utf8")
		.includes(`<time datetime="${coverage.checked}">${shownDate}</time>`),
	"The displayed curriculum date must match coverage.json.",
);
const html = gunzipSync(read("tests/fixtures/zam-deutsch8-lehrplan.html.gz"));
assert.equal(hash(html), coverage.curriculum_sha256);
for (const neighbour of coverage.neighbours)
	assert.equal(hash(gunzipSync(read(neighbour.file))), neighbour.sha256);

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
function clean(html) {
	return html
		.replace(/<[^>]+>/g, "")
		.replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
			String.fromCodePoint(
				n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n),
			),
		)
		.replace(/&([a-z]+);/gi, (entity, name) => entities[name] ?? entity)
		.replace(/\s+/g, " ")
		.trim();
}

// The curriculum markup wraps some phrases in <mark> and interleaves
// advisory dialogs. Strip the latter before extracting the actual LB lists.
const source = html
	.toString("utf8")
	.replace(/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, "");
const blocks =
	/<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>|<div class="thema_absch[^"]*"\s*>([\s\S]*?)<\/div>/g;
let lb;
let section;
const areas = [];
const expectations = [];
for (const [, heading, list] of source.matchAll(blocks)) {
	if (heading) {
		const title = clean(heading);
		const stage = /^D8 Lernbereich (\d): (.+)$/.exec(title);
		if (stage) {
			lb = Number(stage[1]);
			section = stage[1];
			areas.push({
				lb,
				title: stage[2],
				hours: null,
				...(lb === 5 ? { track: "MuG" } : {}),
			});
		} else {
			section = /^D8 (\d\.\d) /.exec(title)?.[1] ?? section;
		}
	} else if (list.includes("Die Schülerinnen und Schüler")) {
		const entries = [...list.matchAll(/<li\b[^>]*>([\s\S]*?)<\/li>/g)];
		for (const [index, [, item]] of entries.entries()) {
			const position = index + 1;
			expectations.push({
				id: `${section}.${position}`,
				lb,
				section,
				position,
				competence: clean(item),
			});
		}
	}
}
assert.equal(expectations.length, 48);
assert.deepEqual(coverage.areas, areas);
assert.deepEqual(
	coverage.rows.map(({ id, lb, section, position, competence }) => ({
		id,
		lb,
		section,
		position,
		competence,
	})),
	expectations,
	"Each official expectation must appear once, in order, with verbatim wording after whitespace normalization.",
);
for (const source of json("replaces-de-by.json").sources)
	assert.equal(hash(read(source.file)), source.sha256);
const lessons = json("src/curriculum/lessons.json");
for (const medium of json("src/media/provenance.json")) {
	assert.equal(hash(read(medium.file)), medium.sha256);
	const lesson = lessons.find((l) => l.id === medium.lesson);
	assert.ok(lesson);
	if (medium.spoken_line)
		assert.ok(lesson.material.includes(medium.spoken_line));
	assert.equal(
		hash(medium.spoken_line ?? lesson.material),
		medium.transcript_sha256,
	);
}
console.log(
	`ok: ${expectations.length} verbatim curriculum rows, 0 missing; source, history and audio hashes match.`,
);
