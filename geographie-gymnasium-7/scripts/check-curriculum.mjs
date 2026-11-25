// The tracked fixture contains the official curriculum text and identifies the
// source page by SHA-256. Pass its downloaded HTML to verify the extraction.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const coverage = read("../coverage.json");
const fixture = read("../tests/fixtures/curriculum-expectations.json");
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
assert.equal(coverage.curriculum, fixture.curriculum);
assert.equal(coverage.curriculum_sha256, fixture.curriculum_sha256);
assert.equal(fixture.rows.length, 29);
for (const row of fixture.rows) assert.equal(sha256(row.competence), row.source_digest);

const source = process.argv[2];
if (source) {
  const html = readFileSync(source);
  assert.equal(sha256(html), fixture.curriculum_sha256, "Curriculum source snapshot changed");
  const sections = [...html.toString().matchAll(
    /<h3 class="plain">Kompetenzerwartungen<\/h3>\s*<p>[^<]*<\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
  )];
  assert.equal(sections.length, 6);
  const entities = { nbsp: " ", amp: "&", ndash: "–", shy: "\u00ad", quot: '"', apos: "'" };
  const normalize = (text) => text.replace(/<[^>]*>/g, "")
    .replace(/&(#x[0-9a-f]+|#\d+|\w+);/gi, (original, entity) => {
      if (entity.startsWith("#x")) return String.fromCodePoint(parseInt(entity.slice(2), 16));
      if (entity.startsWith("#")) return String.fromCodePoint(Number(entity.slice(1)));
      return entities[entity] ?? original;
    }).replace(/\s+/g, " ").trim();
  const extracted = sections.flatMap(([, block], lb) =>
    [...block.matchAll(/<li>([\s\S]*?)(?=<dialog|<\/li>)/g)].map(([, text], index) => ({
      id: `${lb + 1}.${index + 1}`,
      competence: normalize(text),
    })),
  );
  assert.deepEqual(extracted, fixture.rows.map(({ id, competence }) => ({ id, competence })));
}

const expected = new Map(fixture.rows.map((row) => [row.id, row]));
assert.equal(coverage.rows.length, expected.size);
const seen = new Set();
const missing = coverage.rows.filter(({ id, lb, competence, source_digest }) => {
  const original = expected.get(id);
  const duplicate = seen.has(id);
  seen.add(id);
  return duplicate || original?.lb !== lb || original.competence !== competence
    || original.source_digest !== source_digest;
});
assert.deepEqual(missing.map((row) => row.id), []);
console.log(`${coverage.rows.length} verbatim competence rows, ${missing.length} not found across six learning areas.`);
