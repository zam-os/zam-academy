// Pass the saved live HTML from the official URL in coverage.json. No network is used here.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
const root = fileURLToPath(new URL("../", import.meta.url));
const coverage = JSON.parse(readFileSync(`${root}coverage.json`, "utf8"));
assert.ok(
	process.argv[2],
	"Usage: node scripts/check-curriculum.mjs <saved-official-page.html>",
);
const bytes = readFileSync(process.argv[2]);
const normalize = (text) => text.replace(/\s+/gu, " ").trim();
const text = normalize(
	bytes
		.toString()
		.replace(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/g, "")
		.replace(/<[^>]*>/g, "")
		.replace(/&nbsp;|&#160;/g, " ")
		.replace(/&shy;|&#173;/g, "\u00ad")
		.replace(/&amp;/g, "&")
		.replace(/&ndash;/g, "–"),
);
const missing = coverage.rows.filter(
	(row) => !text.includes(normalize(row.competence)),
);
assert.deepEqual(
	missing.map((row) => `${row.section}/${row.position}`),
	[],
	"Competence wording must occur verbatim in the live page",
);
assert.equal(
	createHash("sha256").update(bytes).digest("hex"),
	coverage.curriculum_sha256,
);
console.log(
	`ok: ${coverage.rows.length} verbatim rows, ${missing.length} not found; source SHA-256 matches.`,
);
