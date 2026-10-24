import assert from "node:assert/strict";
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const registry = JSON.parse(readFileSync(join(root, "academy.json"), "utf8"));
const pakete = registry.pakete;

test("every app with a cell is registered in academy.json, and vice versa", () => {
  const apps = readdirSync(root).filter((d) =>
    existsSync(join(root, d, "cell.json")),
  );
  assert.deepEqual(pakete.map((p) => p.app).sort(), apps.sort());
});

test("registry references known subjects and schools and unique ids", () => {
  const faecher = new Set(registry.faecher.map((f) => f.id));
  const schulen = new Set(registry.schulen.map((s) => s.id));
  const bereiche = new Set(registry.bereiche.map((b) => b.id));
  assert.equal(new Set(pakete.map((p) => p.id)).size, pakete.length);
  for (const f of registry.faecher) assert.ok(bereiche.has(f.bereich), f.id);
  for (const p of pakete) {
    assert.ok(faecher.has(p.fach), `${p.id}: unknown Fach`);
    assert.ok(p.school === null || schulen.has(p.school), `${p.id}: school`);
    assert.ok(
      p.grade === null || (p.grade >= 5 && p.grade <= 13),
      `${p.id}: grade`,
    );
  }
});

test("card counts match the cell", () => {
  for (const p of pakete) {
    const tile = JSON.parse(
      readFileSync(join(root, p.app, "cell.json"), "utf8"),
    );
    const cards = tile.atoms.flatMap((a) => a.practice_items ?? []).length;
    assert.equal(p.cards, cards, `${p.id}: cards`);
  }
});

test("lesson counts match lesson-level atoms", () => {
  // UML groups several lessons per atom; its curriculum test checks this count.
  for (const p of pakete.filter((p) => p.app !== "uml")) {
    const tile = JSON.parse(
      readFileSync(join(root, p.app, "cell.json"), "utf8"),
    );
    assert.equal(p.lessons, tile.atoms.length, `${p.id}: lessons`);
  }
});

test("every app links back to the academy online and in an offline file", () => {
  for (const p of pakete) {
    const html = readFileSync(join(root, p.app, "index.html"), "utf8");
    const link = html.match(/<a\b[^>]*\bclass="zam-home-link"[^>]*>/)?.[0];
    const href = link?.match(/\bhref="([^"]+)"/)?.[1];
    assert.ok(href, `${p.app}: missing academy link`);
    for (const base of [
      `https://academy.zam-os.org/${p.app}/`,
      `file:///offline/${p.app}.html`,
    ]) {
      assert.equal(new URL(href, base).href, "https://academy.zam-os.org/", p.app);
    }
  }
});

test("kein_unterricht names known subjects and schools, explains itself and never contradicts a package", () => {
  const faecher = new Map(registry.faecher.map((f) => [f.id, f]));
  const schulen = new Map(registry.schulen.map((s) => [s.id, s]));
  const seen = new Set();
  for (const e of registry.kein_unterricht ?? []) {
    const where = `${e.fach} ${e.grade} ${e.school}`;
    assert.ok(faecher.has(e.fach), `${where}: unknown Fach`);
    const school = schulen.get(e.school);
    assert.ok(school, `${where}: unknown school`);
    assert.ok(
      e.grade >= school.from && e.grade <= school.to,
      `${where}: grade outside the school`,
    );
    assert.ok(e.grade >= faecher.get(e.fach).from, `${where}: before the Fach starts`);
    assert.ok(e.note?.length > 20, `${where}: note`);
    assert.match(e.source ?? "", /^https:\/\//, `${where}: source`);
    assert.ok(!seen.has(where), `${where}: duplicate`);
    seen.add(where);
    assert.ok(
      !pakete.some(
        (p) => p.fach === e.fach && p.grade === e.grade && p.school === e.school,
      ),
      `${where}: a package exists for a cell declared as no-lesson`,
    );
  }
});

test("every school names where it is taught, for sentences like 'am Gymnasium'", () => {
  for (const s of registry.schulen) assert.match(s.wo, /^(an|am) /, s.id);
});
