import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url));
const coverage = JSON.parse(read("coverage.json"));
const htmlII = read("tests/fixtures/bwr7-wpfg2.html");
const htmlIIIa = read("tests/fixtures/bwr7-wpfg3a.html");

assert.equal(
  createHash("sha256").update(htmlII).digest("hex"),
  coverage.curriculum_sha256,
);
assert.equal(
  createHash("sha256").update(htmlIIIa).digest("hex"),
  coverage.curriculum_iiia_sha256,
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
const plainText = (buf) =>
  normalize(
    decode(
      buf
        .toString("utf8")
        .replace(/<(script|style|dialog)\b[^>]*>[\s\S]*?<\/\1>/gi, "")
        .replace(/<img\b[^>]*\balt="([^"]*)"[^>]*>/gi, "$1")
        .replace(/<[^>]*>/g, ""),
    ),
  );

const textByTrack = {
  II: plainText(htmlII),
  IIIa: plainText(htmlIIIa),
};

const missing = coverage.rows.filter(
  (r) => !textByTrack[r.track]?.includes(normalize(r.competence)),
);
assert.deepEqual(
  missing.map((r) => `${r.track}: ${r.competence}`),
  [],
);

const countII = coverage.rows.filter((r) => r.track === "II").length;
const countIIIa = coverage.rows.filter((r) => r.track === "IIIa").length;
console.log(
  `${coverage.rows.length} verbatim competence rows (${countII} II, ${countIIIa} IIIa), ${missing.length} not found; both curriculum SHA-256 hashes match.`,
);
