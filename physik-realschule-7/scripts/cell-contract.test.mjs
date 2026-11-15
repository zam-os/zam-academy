import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, readdirSync } from "node:fs";
import { test } from "node:test";
const root = new URL("../", import.meta.url);
const mapping = JSON.parse(readFileSync(new URL("replaces-de-by.json", root), "utf8"));
test("frozen legacy fixtures match the mapping hashes and every old item exactly once", () => {
  const oldIds = [];
  for (const source of mapping.sources) {
    const bytes = readFileSync(new URL(source.file, root));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), source.sha256);
    const tile = JSON.parse(bytes);
    assert.equal(tile.tile_id, source.tile_id);
    assert.equal(tile.version, source.version);
    oldIds.push(...tile.atoms.flatMap((a) => a.practice_items.map((i) => i.id)));
  }
  assert.equal(new Set(oldIds).size, 16);
  assert.deepEqual(mapping.rows.map((r) => r.de_by_id).sort(), oldIds.sort());
});
test("package identity, storage, offline launchers and source text do not retain the template", () => {
  const files = [];
  const walk = (dir) => { for (const entry of readdirSync(dir, { withFileTypes: true })) { if (["node_modules", "dist", "release", "fixtures"].includes(entry.name)) continue; const path = new URL(entry.name + (entry.isDirectory() ? "/" : ""), dir); if (entry.isDirectory()) walk(path); else files.push(path); } };
  walk(root);
  for (const file of files) {
    if (file.pathname.endsWith("cell-contract.test.mjs")) continue;
    assert.doesNotMatch(readFileSync(file, "utf8"), /physik-realschule-10|physik_rs10|Physik 10|PHYSIK 10|Physik-10|Effektivwert|Induktion|radioaktiv/, file.pathname);
  }
  const main = readFileSync(new URL("src/main.ts", root), "utf8"), index = readFileSync(new URL("index.html", root), "utf8");
  assert.ok(main.includes('"physik_rs7_theme"'));
  assert.ok(index.includes('"physik_rs7_theme"'));
  assert.ok(readFileSync(new URL("src/storage/progress.ts", root), "utf8").includes('"physik_rs7_academy_progress_v1"'));
});
