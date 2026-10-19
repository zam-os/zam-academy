#!/usr/bin/env node
// Installs every `<app>/cell.json` into a throw-away ZAM library with the
// published zam-core, so a cell fails here before it reaches a learner.
//
//   ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cells.mjs
//
// CI installs zam-core at a pinned exact version (see .github/workflows/ci.yml).

import { mkdtempSync, readdirSync, readFileSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const zam = await import(process.env.ZAM_CORE ?? "zam-core");

const dir = mkdtempSync(join(tmpdir(), "zam-academy-cells-"));
let failures = 0;
try {
  for (const app of readdirSync(root).sort()) {
    const file = join(root, app, "cell.json");
    if (!existsSync(file)) continue;
    const tile = JSON.parse(readFileSync(file, "utf8"));
    const db = await zam.openDatabase({
      dbPath: join(dir, `${app}.db`),
      initialize: true,
      useConfiguredCloud: false,
    });
    try {
      await zam.installKvtTile(db, tile);
      const items = tile.atoms.reduce((n, atom) => n + atom.practice_items.length, 0);
      console.log(`ok   ${app}/cell.json  ${tile.tile_id} ${tile.version} (${items} items)`);
    } catch (error) {
      failures += 1;
      console.error(`FAIL ${app}/cell.json: ${error instanceof Error ? error.message : error}`);
    } finally {
      await db.close();
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
process.exit(failures === 0 ? 0 : 1);
