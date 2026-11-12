import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const lessons = JSON.parse(read("src/curriculum/lessons.json"));

const entities = {
	nbsp: " ",
	hellip: "…",
	amp: "&",
	quot: '"',
	apos: "'",
	lt: "<",
	gt: ">",
	ndash: "–",
	mdash: "—",
	bull: "•",
	minus: "−",
	shy: "\u00ad",
};
const decode = (s) =>
	s.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (original, e) =>
		e[0] === "#"
			? String.fromCodePoint(
					e[1].toLowerCase() === "x"
						? parseInt(e.slice(2), 16)
						: Number(e.slice(1)),
				)
			: (entities[e] ?? original),
	);
const normalize = (s) => s.replace(/\s+/g, " ").trim();
const extractText = (raw) =>
	normalize(
		decode(
			raw
				.toString("utf8")
				.replace(/<(script|style|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
				.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "$1")
				.replace(/<[^>]*>/g, ""),
		),
	);

const tracks = [
	{ track: "R", file: "tests/fixtures/curriculum-r.html", shaKey: "curriculum_r_sha256" },
	{ track: "M", file: "tests/fixtures/curriculum-m.html", shaKey: "curriculum_m_sha256" },
];

const texts = new Map();
for (const { track, file, shaKey } of tracks) {
	const raw = read(file);
	assert.equal(createHash("sha256").update(raw).digest("hex"), coverage[shaKey]);
	texts.set(track, extractText(raw));
}

const byId = new Map(lessons.map((l) => [l.id, l]));
const coveredLessons = new Set();
const missing = [];

for (const row of coverage.rows) {
	assert.ok(row.track === "R" || row.track === "M", `invalid track: ${row.track}`);
	assert.ok(["implemented", "supported"].includes(row.status), `invalid status: ${row.status}`);
	assert.ok(row.lessons.length > 0, `row has no lessons: ${row.competence}`);
	if (!texts.get(row.track).includes(normalize(row.competence))) {
		missing.push(`${row.track} ${row.lb}: ${row.competence}`);
	}
	for (const id of row.lessons) {
		const lesson = byId.get(id);
		assert.ok(lesson, `unknown lesson ${id}`);
		assert.ok(
			lesson.tracks.includes(row.track),
			`lesson ${id} missing track ${row.track}`,
		);
		assert.ok(
			lesson.bindings.includes(row.lb),
			`lesson ${id} missing binding ${row.lb}`,
		);
		coveredLessons.add(id);
	}
}

assert.deepEqual(missing, []);
assert.deepEqual([...coveredLessons].sort(), [...byId.keys()].sort());
console.log(
	`${coverage.rows.length} verbatim R/M competence rows, 0 not found; both curriculum SHA-256 hashes match.`,
);
