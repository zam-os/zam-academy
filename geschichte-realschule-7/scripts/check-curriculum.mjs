// Checks that every Kompetenzerwartung in coverage.json occurs verbatim in the
// stored LehrplanPLUS page (whitespace normalised) and that the page is the
// one whose SHA-256 coverage.json records.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const root = new URL("../", import.meta.url);
const read = (path) => readFileSync(new URL(path, root), "utf8");
const coverage = JSON.parse(read("coverage.json"));
const page = read("tests/fixtures/lehrplanplus-g7.html");
assert.equal(createHash("sha256").update(page).digest("hex"), coverage.curriculum_sha256);

const entities = { nbsp: " ", amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", ndash: "–", shy: "­" };
const text = page
  .replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, " ")
  // Inline tags such as links around terms sit inside sentences; block tags separate text.
  .replace(/<\/?(?:a|span|strong|em|b|i|abbr)\b[^>]*>/gi, "")
  .replace(/<[^>]+>/g, " ")
  .replace(/&#(x[\da-f]+|\d+);/gi, (_, n) =>
    String.fromCodePoint(n[0].toLowerCase() === "x" ? parseInt(n.slice(1), 16) : Number(n)),
  )
  .replace(/&([a-z]+);/gi, (match, name) => entities[name] ?? match)
  .replace(/\s+/g, " ");
const missing = coverage.rows.filter(
  (row) => !text.includes(row.competence.replace(/\s+/g, " ").trim()),
);
assert.deepEqual(missing.map((row) => row.competence.slice(0, 60)), []);
assert.equal(coverage.rows.length, 42);
console.log(`ok: ${coverage.rows.length} competences, ${missing.length} not found; page SHA-256 matches.`);
