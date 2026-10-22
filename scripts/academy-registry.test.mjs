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

test("lesson and card counts match the cell", () => {
  for (const p of pakete) {
    const tile = JSON.parse(
      readFileSync(join(root, p.app, "cell.json"), "utf8"),
    );
    const cards = tile.atoms.flatMap((a) => a.practice_items ?? []).length;
    assert.equal(p.lessons, tile.atoms.length, `${p.id}: lessons`);
    assert.equal(p.cards, cards, `${p.id}: cards`);
  }
});
