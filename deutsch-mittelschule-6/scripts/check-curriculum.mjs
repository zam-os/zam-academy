import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const raw = read("tests/fixtures/curriculum.html");
assert.equal(
	createHash("sha256").update(raw).digest("hex"),
	coverage.curriculum_sha256,
);
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
const text = normalize(
	decode(
		raw
			.toString("utf8")
			.replace(/<(script|style|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
			.replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "$1")
			.replace(/<[^>]*>/g, ""),
	),
);
const missing = coverage.rows.filter(
	(r) => !text.includes(normalize(r.competence)),
);
assert.deepEqual(
	missing.map((r) => r.competence),
	[],
);
console.log(
	`${coverage.rows.length} verbatim competence rows, ${missing.length} not found; curriculum SHA-256 matches.`,
);
