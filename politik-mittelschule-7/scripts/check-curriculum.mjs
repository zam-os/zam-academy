import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const fixtures = { R: "curriculum-r7.html", M: "curriculum-m7.html" };
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
const missing = [];
for (const [track, file] of Object.entries(fixtures)) {
	const raw = read(`tests/fixtures/${file}`);
	assert.equal(
		createHash("sha256").update(raw).digest("hex"),
		coverage.curriculum_sha256[track],
		`SHA-256 of ${file}`,
	);
	const text = normalize(
		decode(
			raw
				.toString("utf8")
				.replace(/<(script|style|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
				.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "$1")
				.replace(/<[^>]*>/g, ""),
		),
	);
	for (const row of coverage.rows.filter((r) => r.track === track))
		if (!text.includes(normalize(row.competence)))
			missing.push(`${track}: ${row.competence}`);
}
assert.deepEqual(missing, []);
console.log(
	`${coverage.rows.length} verbatim competence rows (R7 and M7), ${missing.length} not found; both curriculum SHA-256 match.`,
);
