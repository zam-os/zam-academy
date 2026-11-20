import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const coverage = JSON.parse(
	readFileSync(new URL("../coverage.json", import.meta.url), "utf8"),
);
const paths = process.argv.slice(2);
assert.equal(
	paths.length,
	2,
	"Pass the R7 and M7 curriculum HTML snapshots, in that order.",
);
const normalize = (text) =>
	text
		.replace(/&#x([\da-f]+);/gi, (_, hex) =>
			String.fromCodePoint(parseInt(hex, 16)),
		)
		.replace(/&#(\d+);/g, (_, decimal) => String.fromCodePoint(Number(decimal)))
		.replace(
			/&(nbsp|amp|ndash|mdash|quot|rsquo);/g,
			(_, entity) =>
				({
					nbsp: " ",
					amp: "&",
					ndash: "–",
					mdash: "—",
					quot: '"',
					rsquo: "’",
				})[entity],
		)
		.replace(/\s+/g, " ")
		.trim();

for (const [i, track] of ["R", "M"].entries()) {
	const source = readFileSync(paths[i]);
	assert.equal(
		createHash("sha256").update(source).digest("hex"),
		coverage.curriculum_sha256[track],
	);
	const raw = source.toString("utf8");
	assert.match(
		raw.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] ?? "",
		/LehrplanPLUS.*Natur und Technik.*Fachlehrpläne/,
	);
	const html = raw.replace(
		/<(dialog|script|style)\b[^>]*>[\s\S]*?<\/\1>/gi,
		"",
	);
	const official = [
		...html.matchAll(
			/Kompetenzerwartungen<\/h[34]>\s*<p>[^<]*<\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
		),
	].flatMap(([, list]) =>
		[...list.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, item]) =>
			normalize(item.replace(/<[^>]*>/g, "")),
		),
	);
	const rows = coverage.rows.filter((row) => row.track === track);
	assert.deepEqual(
		rows.map((row) => row.competence),
		official,
	);
	console.log(
		track +
			"7: " +
			rows.length +
			" verbatim expectations; zero missing or changed.",
	);
}
