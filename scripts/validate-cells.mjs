#!/usr/bin/env node
// Installs every `<app>/cell.json` into a throw-away ZAM library with the
// published zam-core, so a cell fails here before it reaches a learner, and
// checks that every card's curated distractors survive zam-core's own
// choice-option checks (`checkCandidate`, `checkShownSet`): a distractor
// outside the length band, or one that normalises to the answer, is dropped
// at review time and the curation is wasted.
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

/**
 * Cells published before the distractor check existed. Their curated
 * distractors are reported but do not fail the run until a follow-up PR
 * rewrites them (ids stay, only wording changes, with `materiality`).
 */
const DISTRACTOR_CHECK_ADVISORY = new Set(["zam-academy:uml"]);

/** Every reason zam-core would refuse a card's curated distractors. */
function distractorProblems(tile) {
  const problems = [];
  for (const atom of tile.atoms) {
    for (const item of atom.practice_items) {
      const distractors = item.choice_distractors ?? [];
      if (distractors.length === 0) continue;
      const { question, concept } = zam.kvtItemPlainTexts(item);
      const accepted = [];
      for (const distractor of distractors) {
        const text = distractor.text ?? "";
        const rejection = zam.checkCandidate(concept, text, accepted, question);
        if (rejection) {
          problems.push(`${item.id} (${item.slug}): "${text}" → ${rejection} against "${concept}"`);
        } else {
          accepted.push(text);
        }
      }
      if (accepted.length === distractors.length) {
        const cue = zam.checkShownSet([concept, ...accepted], 0);
        if (cue) {
          problems.push(`${item.id} (${item.slug}): shown set gives the answer away → ${cue} ("${concept}" beside ${accepted.map((t) => `"${t}"`).join(", ")})`);
        }
      }
    }
  }
  return problems;
}

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

    const problems = distractorProblems(tile);
    if (problems.length > 0) {
      const advisory = DISTRACTOR_CHECK_ADVISORY.has(tile.tile_id);
      const label = advisory ? "note" : "FAIL";
      console[advisory ? "log" : "error"](
        `${label} ${app}/cell.json: ${problems.length} curated distractor(s) zam-core would drop${advisory ? " (advisory for this cell)" : ""}`,
      );
      for (const problem of problems) console[advisory ? "log" : "error"](`     ${problem}`);
      if (!advisory) failures += 1;
    } else {
      console.log(`ok   ${app}/cell.json  curated distractors pass zam-core's choice checks`);
    }
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}
process.exit(failures === 0 ? 0 : 1);
