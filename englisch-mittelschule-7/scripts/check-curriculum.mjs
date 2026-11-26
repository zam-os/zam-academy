import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const read = (path) => readFileSync(new URL(path, import.meta.url), "utf8");
const coverage = JSON.parse(read("../coverage.json"));
const lessons = JSON.parse(read("../src/curriculum/lessons.json"));
const lessonsById = new Map(lessons.map((lesson) => [lesson.id, lesson]));
const normalise = (text) => text.replace(/\s+/g, " ").trim();
const entities = { amp: "&", auml: "ä", hellip: "…", nbsp: " ", ouml: "ö", uuml: "ü" };
const text = (markup) => normalise(markup
  .replace(/<br\s*\/?>/gi, " ")
  .replace(/<[^>]+>/g, "")
  .replace(/&nbsp;?/gi, " ")
  .replace(/&([a-z]+);/gi, (entity, name) => entities[name] ?? entity)
  .replace(/&#x([0-9a-f]+);/gi, (_, point) => String.fromCodePoint(parseInt(point, 16)))
  .replace(/&#(\d+);/g, (_, point) => String.fromCodePoint(Number(point))));

// Extract only official competence and topic lists. Dialogs contain cross-references
// and unrelated examples. Nested list items are vocabulary and grammar subskills.
function officialStatements(html) {
  const assigned = [];
  const markup = html.replace(/<dialog\b[^>]*>[\s\S]*?<\/dialog>/gi, "");
  for (const section of markup.matchAll(/<h([234])>\s*<strong>E7<\/strong>([\s\S]*?)<\/h\1>([\s\S]*?)(?=<h[234]>|$)/g)) {
    const heading = text(section[2]);
    for (const [, contents] of section[3].matchAll(/<div class="thema_absch [^"]*">([\s\S]*?)<\/div>/g)) {
      const label = contents.includes("Inhalte zu den Kompetenzen:") ? heading + " (Themen)" : heading;
      for (const item of contents.matchAll(/<li\b[^>]*>([\s\S]*?)(?=<\/?li\b)/g)) {
        assigned.push({ section: label, competence: text(item[1]) });
      }
    }
  }
  return assigned;
}

const covered = new Map(lessons.map((lesson) => [lesson.id, new Set()]));
for (const track of ["R", "M"]) {
  const variant = track.toLowerCase();
  const html = read(`../tests/fixtures/curriculum-${variant}.html`);
  assert.equal(createHash("sha256").update(html).digest("hex"), coverage[`curriculum_${variant}_sha256`]);
  const rows = coverage.rows.filter((row) => row.track === track);
  assert.equal(rows.length, 60, `${track} must include the ${track}7 competencies and topics`);
  const expected = officialStatements(html);
  assert.equal(rows.length, expected.length);
  for (const [index, row] of rows.entries()) {
    const { section, competence } = row;
    assert.deepEqual({ section, competence }, expected[index], `${track} row ${index + 1}`);
  }
  for (const { lb, lessons: ids, status, evidence } of rows) {
    assert.ok(["1.1", "1.2", "2", "3", "4", "5"].includes(lb));
    assert.ok(["implemented", "supported"].includes(status));
    assert.ok(evidence.length > 25 && ids.length > 0);
    for (const id of ids) {
      assert.ok(lessonsById.get(id)?.tracks.includes(track), `Unknown or wrong-track lesson ${id}`);
      covered.get(id).add(track);
    }
  }
}
for (const lesson of lessons) {
  assert.deepEqual([...covered.get(lesson.id)].sort(), [...lesson.tracks].sort(), lesson.id);
}
console.log(`check-curriculum: ${coverage.rows.length} rows, 0 not found (60 each for R7 and M7); all ${lessons.length} lessons mapped.`);
