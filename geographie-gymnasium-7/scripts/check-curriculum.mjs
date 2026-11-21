// Pass the official HTML downloaded from the source recorded in coverage.json.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const source = process.argv[2];
assert.ok(source, "Usage: node scripts/check-curriculum.mjs <official curriculum HTML>");
const coverage = JSON.parse(readFileSync(new URL("../coverage.json", import.meta.url), "utf8"));
const html = readFileSync(source);
const sha256 = (text) => createHash("sha256").update(text).digest("hex");
assert.equal(sha256(html), coverage.curriculum_sha256, "Source snapshot changed. Recheck the curriculum mapping.");
const sections = [...html.toString().matchAll(
  /<h3 class="plain">Kompetenzerwartungen<\/h3>\s*<p>[^<]*<\/p>\s*<ul>([\s\S]*?)<\/ul>/g,
)];
assert.equal(sections.length, 6);
const rows = sections.flatMap(([, block], index) => [...block.matchAll(/<li>([\s\S]*?)(?=<dialog|<\/li>)/g)]
  .map(([, content], i) => ({
    id: `${index + 1}.${i + 1}`,
    source_digest: sha256(content.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim()),
  })));
assert.deepEqual(coverage.competencies.map(({ id, source_digest }) => ({ id, source_digest })), rows);
console.log(`Matched ${rows.length} official competence statements across ${sections.length} learning areas.`);
