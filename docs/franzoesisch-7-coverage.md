# French 7 Realschule: curriculum and card record

Checked on 21 November 2026 against the [official curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/franzoesisch). The live page answered with status 200; the fetched bytes are stored as `franzoesisch-realschule-7/tests/fixtures/lehrplanplus-f7.html` (SHA-256 `8d03ab14…f962`, recorded in `coverage.json`). French has one Fachlehrplan for group IIIa, where it is the second foreign language from grade 7 to grade 10. Grade 7 is the first year.

## Curriculum

`coverage.json` lists 70 rows: every Kompetenzerwartung of Lernbereiche 1 to 5, each grammar item of the four nested grammar lists as its own row, and every Themengebiet entry. `npm test` first runs `scripts/check-curriculum.mjs`, which searches each row in the text of the stored page after whitespace normalisation: 70 rows, 0 not found. Every row names lessons, and every one of the 54 lessons appears in at least one row. Nothing is optional.

The Themengebiete give hours: 20 hours each for family situations, life and living, school life, free time and for geography with Paris and a region, and 12 hours for festivals and traditions. The lessons follow these weights: family 6, living and town 6, school and day 7, France 5.

Fourteen rows are marked `supported` instead of `implemented`. These are listening to natural recordings, spontaneous speaking, live mediation, intonation and reading aloud, performing mini-dialogues, the personal vocabulary programme, coursebook use, sources, the portfolio and current topics. The package prepares them with models and tasks, and the actual practice happens in class.

## Neighbouring grades and scope

There is no Realschule French before grade 7. Grade 8 (`lehrplanplus-f8.html`, stored as a hash-checked neighbour snapshot) adds the passé composé, object pronouns le, la, les, lui, leur and more complex texts. The grade 7 list of object pronouns is only me, te, nous, vous. A test therefore rejects passé composé, imparfait, relative clauses, reflexive routines and le/la/les/lui/leur before a verb in the lesson texts, models and materials. The French 8 package already builds on this grade ([French 8 record](franzoesisch-8-bestandsabgleich.md)). The grade 6 Gymnasium second-language path covers a similar first year. This package reuses its shell, map and listening code and writes its own lessons for the Realschule list.

## Sources

Every linked page was fetched and its title read on 21 November 2026 (`source-checks.json`): the LehrplanPLUS page, the EU country profile of France, the France.fr pages “Visiter Paris” and “Visiter la Bretagne” and the French–German dict.cc dictionary. Two other candidates are not linked because they answered 403 to scripts: parisjetaime.com and dict.leo.org. The app gives no current figures.

## Legacy ZAM card mapping (approved 2026-11-22)

ZAM bundles `de-by:realschule-7-franzoesisch-starter-grammatik-verben`, version `2026.08.1`, with two atoms and four items. It comes from zam-os/zam at commit `d83ea3b2f93609b7ed25432c1cb37774dc59c537`, file `tests/fixtures/curriculum/de-by-realschule-7-franzoesisch-starter-grammatik-verben-kvt.json`. A byte-exact copy is in the package tests (SHA-256 `dd7550c2…bdf`). No other `de-by` cell names this grade and subject, and no neighbouring cell teaches a grade 7 topic here.

| Old item | Category | Action | Reason |
| --- | --- | --- | --- |
| `…J01` ils / elles ont vs. sont | A | `f7-etre-avoir-check` replaces it | Same binary retrieval |
| `…J02` être and avoir, liaison, three translations | C | keep-active | Multi-part prompt; the package splits it over separate cards, and no successor keeps the whole prompt |
| `…J03` position of ne … pas | A | `f7-negation-recall` replaces it | Same retrieval |
| `…J04` -er endings, ne … pas, three question types, habiter | C | keep-active | Multi-part prompt; it also teaches inversion, which this curriculum does not list |

Thomas approved both A rows on 2026-11-22 in the Claude Code Desktop chat of this package (PR zam-os/zam-academy#184): „Beide A freigeben“. `replaces-de-by.json` therefore has `"status": "approved"`, `"approved": "2026-11-22"` and his words in `source`. The two successors declare `replaces`, so the approved `replaces` ship with the first publication of the cell. The two C cards stay active, and the cell declares no `retired_items`.

`scripts/validate-migration.mjs` (CI step „Verify approved franzoesisch-realschule-7 history migration“) installs the legacy cell in a temporary library and gives all four cards a review. It then installs the new cell twice and checks:
- the two histories move unchanged to their successors;
- only the two old ids leave active reviews;
- a repeated install changes nothing;
- a learner who holds both an old card and its successor from an edition without `replaces` makes the install refuse an automatic merge.

## Verification

- `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip` in the package
- `node scripts/verify-browser.mjs` (headless Chrome: 54 lessons × 2 levels × 2 themes, all 162 workshop goals through their handlers, explorers, the verb-ending toggle, the preposition scene, clock, number slider, map layers, the storage info marker, persistence, 390 and 720 px widths, no runtime errors, no network requests)
- `node scripts/validate-cell.mjs`, `node scripts/validate-migration.mjs` and the repository's `scripts/validate-cells.mjs` with zam-core 0.54.0
