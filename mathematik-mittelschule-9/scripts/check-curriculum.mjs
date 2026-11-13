import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

// Grade 9 has two Fachlehrpläne: Regelklasse (R9) and Mittlere-Reife-Klasse
// (M9). Each snapshot is checked against its SHA-256, and every coverage row
// is searched verbatim in the text of the snapshot of its own Zug.
const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const entities = {
  nbsp: " ",
  shy: "",
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
const textOf = (raw) =>
  normalize(
    decode(
      raw
        .toString("utf8")
        .replace(/<(script|style|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "$1")
        .replace(/<[^>]*>/g, ""),
    ),
  );

let total = 0;
let notFound = 0;
for (const track of Object.keys(coverage.curriculum)) {
  const raw = read(coverage.fixtures[track]);
  assert.equal(
    createHash("sha256").update(raw).digest("hex"),
    coverage.curriculum_sha256[track],
    `SHA-256 of the ${track} snapshot`,
  );
  const text = textOf(raw);
  assert.ok(
    text.includes(coverage.curriculum_titles[track]),
    `${track}: page title`,
  );
  const rows = coverage.rows.filter((r) => r.track === track);
  const missing = rows.filter((r) => !text.includes(normalize(r.competence)));
  assert.deepEqual(
    missing.map((r) => r.competence),
    [],
    `${track}: rows not found verbatim`,
  );
  total += rows.length;
  notFound += missing.length;
  console.log(`${track}: ${rows.length} rows, ${missing.length} not found.`);
}
assert.equal(total, coverage.rows.length, "every row names a known Zug");
console.log(
  `${total} verbatim competence rows, ${notFound} not found; both curriculum SHA-256 match.`,
);
