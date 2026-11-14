import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const EXPECTED_E5_SHA256 =
  "41e6691545b91a1e4bd9b3216b2089cd1b3024f1ebeb6ece054f445fc81c7c18";
const EXPECTED_E6_SHA256 =
  "7035724bed5101631795092ec348a197e8b95d2c6565a8fd378934444985c09a";

function sha256File(path) {
  const bytes = readFileSync(path);
  return createHash("sha256").update(bytes).digest("hex");
}

function decodeEntities(text) {
  return text
    .replace(/&nbsp;?/gi, " ")
    .replace(/&auml;/g, "ä")
    .replace(/&ouml;/g, "ö")
    .replace(/&uuml;/g, "ü")
    .replace(/&Auml;/g, "Ä")
    .replace(/&Ouml;/g, "Ö")
    .replace(/&Uuml;/g, "Ü")
    .replace(/&szlig;/g, "ß")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—")
    .replace(/&hellip;/g, "…")
    .replace(/&bdquo;/g, "„")
    .replace(/&ldquo;/g, "“")
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) =>
      String.fromCodePoint(parseInt(hex, 16)),
    );
}

function htmlToNormalizedText(html) {
  const stripped = html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ");
  return decodeEntities(stripped).replace(/\s+/g, " ").trim();
}

const e5Path = resolve(root, "tests/fixtures/curriculum.html");
const e6Path = resolve(root, "tests/fixtures/curriculum-e6.html");
const e5Sha = sha256File(e5Path);
const e6Sha = sha256File(e6Path);

if (e5Sha !== EXPECTED_E5_SHA256) {
  throw new Error(
    `curriculum.html SHA-256 mismatch: expected ${EXPECTED_E5_SHA256}, got ${e5Sha}`,
  );
}
if (e6Sha !== EXPECTED_E6_SHA256) {
  throw new Error(
    `curriculum-e6.html SHA-256 mismatch: expected ${EXPECTED_E6_SHA256}, got ${e6Sha}`,
  );
}

const curriculumText = htmlToNormalizedText(readFileSync(e5Path, "utf8"));
const coverage = JSON.parse(
  readFileSync(resolve(root, "coverage.json"), "utf8"),
);
const lessons = JSON.parse(
  readFileSync(resolve(root, "src/curriculum/lessons.json"), "utf8"),
);

if (coverage.curriculum_sha256 !== e5Sha) {
  throw new Error(
    `coverage.json curriculum_sha256 (${coverage.curriculum_sha256}) != ${e5Sha}`,
  );
}

const lessonIds = new Set(lessons.map((l) => l.id));
const coveredLessons = new Set();
let notFound = 0;

for (const row of coverage.rows) {
  const needle = row.competence.replace(/\s+/g, " ").trim();
  if (!curriculumText.includes(needle)) {
    console.error(`NOT FOUND [${row.lb}]: ${needle}`);
    notFound += 1;
  }
  if (row.status !== "implemented" && row.status !== "supported") {
    throw new Error(`Invalid status on row ${row.lb}: ${row.status}`);
  }
  if (!row.evidence || typeof row.evidence !== "string") {
    throw new Error(`Missing evidence on row ${row.lb}`);
  }
  if (!Array.isArray(row.lessons) || row.lessons.length === 0) {
    throw new Error(`Row ${row.lb} has no lessons mapped`);
  }
  for (const id of row.lessons) {
    if (!lessonIds.has(id)) {
      throw new Error(`Row ${row.lb} references unknown lesson id ${id}`);
    }
    coveredLessons.add(id);
  }
}

for (const opt of coverage.optional_lessons ?? []) {
  if (!lessonIds.has(opt.id)) {
    throw new Error(`optional_lessons references unknown lesson id ${opt.id}`);
  }
  coveredLessons.add(opt.id);
}

for (const lesson of lessons) {
  if (!coveredLessons.has(lesson.id)) {
    throw new Error(`Lesson ${lesson.id} is not covered in coverage.json`);
  }
}

if (notFound > 0) {
  throw new Error(`${notFound} curriculum expectations were not found verbatim`);
}

console.log(
  `check-curriculum: ${coverage.rows.length} rows, 0 not found; ${coveredLessons.size}/${lessons.length} lessons covered (SHA-256 ${e5Sha.slice(0, 12)}…)`,
);
