import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const coverage = JSON.parse(readFileSync(join(root, "coverage.json"), "utf8"));
const physicsRoot = resolve(root, "../physik-gymnasium-7");
const physics = JSON.parse(readFileSync(resolve(root, coverage.physics_coverage), "utf8"));
const htmlPath = join(physicsRoot, "tests", "fixtures", "curriculum.html");

if (!existsSync(htmlPath)) {
  console.error("Missing shared Physics curriculum snapshot.");
  process.exit(1);
}

const rawHtml = readFileSync(htmlPath);
const sha256 = createHash("sha256").update(rawHtml).digest("hex");
if (sha256 !== coverage.curriculum_sha256) {
  console.error(`SHA-256 mismatch: expected ${coverage.curriculum_sha256}, got ${sha256}`);
  process.exit(1);
}

function decodeEntities(text) {
  return text
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ndash;/g, "–")
    .replace(/&mdash;/g, "—");
}

const text = decodeEntities(
  rawHtml
    .toString("utf8")
    .replace(/<script\b[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " "),
).replace(/\s+/g, " ");

let missing = 0;
for (const row of [...physics.rows, ...coverage.rows]) {
  const needle = row.competence.replace(/\s+/g, " ").trim();
  if (!text.includes(needle)) {
    console.error(`MISSING competence [lb ${row.lb} #${row.position}]: ${needle}`);
    missing++;
  }
}

for (const item of [...physics.contents, ...coverage.contents]) {
  const needle = item.content.replace(/\s+/g, " ").trim();
  if (!text.includes(needle)) {
    console.error(`MISSING content [lb ${item.lb}]: ${needle}`);
    missing++;
  }
}

const lessonIds = new Set();
const curriculumDir = join(root, "src", "curriculum");
for (const file of readdirSync(curriculumDir)) {
  if (!file.startsWith("stage-") || !file.endsWith(".ts")) continue;
  const source = readFileSync(join(curriculumDir, file), "utf8");
  for (const match of source.matchAll(/lesson\([^)]*,\s*\{\s*id:\s*"([a-z0-9-]+)"/g)) {
    lessonIds.add(match[1]);
  }
}

const mapped = new Set([
  ...coverage.rows.flatMap((row) => row.lessons),
  ...(coverage.contents ?? []).flatMap((item) => item.lessons),
  ...(coverage.optional_lessons ?? []),
]);

for (const id of lessonIds) {
  if (!mapped.has(id)) {
    console.error(`UNMAPPED lesson in coverage.json: ${id}`);
    missing++;
  }
}

for (const id of mapped) {
  if (!lessonIds.has(id)) {
    console.error(`UNKNOWN lesson in coverage.json: ${id}`);
    missing++;
  }
}

const mapping = JSON.parse(readFileSync(join(root, "replaces-de-by.json"), "utf8"));
for (const source of mapping.sources) {
  const bytes = readFileSync(resolve(root, source.file));
  if (createHash("sha256").update(bytes).digest("hex") !== source.sha256) {
    console.error(`SHA-256 mismatch for legacy snapshot: ${source.file}`);
    missing++;
  }
}
const competenceCount = physics.rows.length + coverage.rows.length;
const contentCount = physics.contents.length + coverage.contents.length;
console.log(`Checked ${competenceCount} competences and ${contentCount} content bullets across both focuses, ${missing} missing.`);
process.exit(missing === 0 ? 0 : 1);
