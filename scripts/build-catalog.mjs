#!/usr/bin/env node
// Writes the academy catalog: one entry per `<app>/cell.json`, with the hash
// of the exact bytes Pages publishes. ZAM reads it only on a learner's action
// (ADR 2026-10-19, zam-os/zam).
//
//   node scripts/build-catalog.mjs [outFile]   (default: site/catalog.json)

import { createHash } from "node:crypto";
import {
  existsSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { assertMappingApproved } from "./mapping-approval.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outFile = resolve(root, process.argv[2] ?? "site/catalog.json");

const APP = /^[a-z0-9][a-z0-9-]{0,31}$/;
const VERSION = /^\d+(\.\d+)*$/;

export function buildCatalog(dir = root) {
  const cells = [];
  for (const app of readdirSync(dir).sort()) {
    const file = join(dir, app, "cell.json");
    if (!APP.test(app) || !existsSync(file)) continue;
    const bytes = readFileSync(file);
    const tile = JSON.parse(bytes.toString("utf8"));
    if (typeof tile.tile_id !== "string" || !tile.tile_id) {
      throw new Error(`${app}/cell.json has no tile_id`);
    }
    if (!VERSION.test(String(tile.version))) {
      throw new Error(`${app}/cell.json: version must be a dotted number`);
    }
    assertMappingApproved(join(dir, app), tile, app);
    const items = tile.atoms.flatMap((atom) => atom.practice_items ?? []);
    cells.push({
      id: tile.tile_id,
      title: tile.title ?? tile.tile_id,
      description: tile.description ?? "",
      language: items[0]?.language ?? null,
      version: String(tile.version),
      items: items.length,
      app: `/${app}/`,
      cell: `/${app}/cell.json`,
      sha256: createHash("sha256").update(bytes).digest("hex"),
    });
  }
  const ids = new Set(cells.map((cell) => cell.id));
  if (ids.size !== cells.length) throw new Error("Two cells share an id");
  return { schema: 1, cells: cells.sort((a, b) => a.id.localeCompare(b.id)) };
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  const catalog = buildCatalog();
  mkdirSync(dirname(outFile), { recursive: true });
  writeFileSync(outFile, `${JSON.stringify(catalog, null, 2)}\n`);
  console.log(`Wrote ${outFile}: ${catalog.cells.length} cell(s)`);
}
