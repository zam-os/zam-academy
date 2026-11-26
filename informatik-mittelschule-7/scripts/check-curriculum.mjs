import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readdirSync, readFileSync } from "node:fs";
import { gunzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const coverage = JSON.parse(readFileSync(new URL("coverage.json", root), "utf8"));
const curriculumDir = new URL("src/curriculum/", root);
const ids = new Set(
  readdirSync(curriculumDir).filter((file) => file.startsWith("stage-")).flatMap((file) => {
    const source = readFileSync(new URL(file, curriculumDir), "utf8");
    return [...source.matchAll(/lesson\([^)]*,\s*\{\s*id:\s*"([a-z0-9-]+)"/g)].map((match) => match[1]);
  }),
);
assert.ok(ids.size > 0);

function decode(text) {
  const named = { nbsp: " ", amp: "&", lt: "<", gt: ">", quot: '"', ndash: "–", mdash: "—" };
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&(\w+);/g, (entity, name) => named[name] ?? entity);
}

for (const track of ["R", "M"]) {
  const page = gunzipSync(readFileSync(new URL(`tests/fixtures/curriculum-${track.toLowerCase()}.html.gz`, root)));
  assert.equal(createHash("sha256").update(page).digest("hex"), coverage.curriculum_sha256[track]);
  const html = page.toString("utf8").replace(/<dialog\b[\s\S]*?<\/dialog>/gi, "");
  const groups = [...html.matchAll(/<h3 class="plain">(Kompetenzerwartungen|Inhalte zu den Kompetenzen:)<\/h3>[\s\S]*?<ul>([\s\S]*?)<\/ul>/g)];
  assert.equal(groups.length, 6, `${track}7: three Lernbereiche with expectations and content`);
  groups.forEach(([, heading, list], index) => {
    const label = heading === "Kompetenzerwartungen" ? "competence" : "content";
    const lb = String(Math.floor(index / 2) + 1);
    const matrix = label === "competence" ? coverage.rows : coverage.contents;
    const rows = matrix.filter((row) => row.track === track && row.lb === lb);
    const actual = [...list.matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, item]) =>
      decode(item.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim());
    assert.deepEqual(rows.map((row) => row[label]), actual, `${track}7 LB ${lb}: ${label}`);
    assert.deepEqual(rows.map((row) => row.position), actual.map((_, i) => i + 1));
  });
  const rows = coverage.rows.filter((row) => row.track === track);
  const contents = coverage.contents.filter((row) => row.track === track);
  const covered = new Set([...rows.flatMap((row) => row.lessons), ...coverage.optional_lessons]);
  assert.deepEqual(covered, ids, `${track}7 coverage links all lessons exactly by id`);
  for (const row of [...rows, ...contents]) {
    assert.ok(row.lessons.length > 0, `${track}7 LB ${row.lb}: empty lesson mapping`);
    for (const id of row.lessons) assert.ok(ids.has(id), `${track}7 LB ${row.lb}: unknown lesson ${id}`);
  }
  console.log(`${track}7: ${rows.length} competencies and ${contents.length} content bullets match the official snapshot verbatim (0 missing).`);
}
