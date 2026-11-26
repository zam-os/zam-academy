# Geschichte 7 · Bavarian Gymnasium

A ZAM Academy learning package for **Jahrgangsstufe 7** of the Bavarian Gymnasium following the [official LehrplanPLUS Bayern Fachlehrplan Geschichte 7 Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geschichte) „Vom Mittelalter zum Absolutismus“ (fetched 26 November 2026, SHA-256 `ad0bdc483f101c3af3c4cafbfad3337625ef2f12ac60c3a494f4787ab1926800`). Grade 7 has one curriculum for all Ausbildungsrichtungen, so no lesson carries a track filter.

## Scope

| Lernbereich | Hours | Lessons | Interactive models |
| --- | --- | --- | --- |
| 1 · König und Reich: Herrschaft im Mittelalter | ca. 7 Std. | 5 | `ottonenReich` (map 843–962), `investiturstreit` (power balance), `lehnswesen` (feudal pyramid), `kurfuerstenwahl` (Golden Bull vote on a map) |
| 2 · Leben und Kultur im Mittelalter | ca. 10 Std. | 7 | `kathedrale` (Romanesque or Gothic), `altstadt` (old-town plan), `pestKarte` (Black Death 1346–1350) |
| 3 · Neue räumliche und geistige Horizonte | ca. 11 Std. | 8 | `kreuzzugKarte`, `perspektive` (central vs. hierarchical perspective), `entdeckerKarte` (voyages, Tordesillas) |
| 4 · Wirtschaft und Handel gestern und heute (Längsschnitt) | ca. 6 Std. | 5 | `hanseKarte` (Kontore and goods); Limes, China, Fugger and world trade with maps and diagrams |
| 5 · Das konfessionelle Zeitalter | ca. 8 Std. | 7 | `reformationVerlauf` (1517–1555), `flugblatt` (broadsheet analysis), `kriegsphasen` (Thirty Years' War) |
| 6 · Absolutismus und Barock | ca. 8 Std. | 5 | `versailles` (plan and axis), `balanceOfPower` (scale of powers) |
| 7 · Bauwerke als Ausdruck politischen Denkens (Längsschnitt) | ca. 6 Std. | 4 | `bauwerkeVergleich` (theatre, Aachen, Würzburg, Reichstag) |

All 41 verbatim Kompetenzerwartungen map to these 41 lessons in [coverage.json](coverage.json) (40 `implemented`, 1 `supported`: the media-supported talk about buildings happens in class). Ten lessons carry a *Kriterienkatalog* (written source, Schaubild, digital sources, church style, old-town plan, comparing sources, historical map, broadsheet, palace plan, building as source); the Nachschlagen view collects them with a timeline of all Grundlegende Daten.

Every lesson has an explanation, Grundwissen tags, at least one figure, a quick check with two plausible wrong answers, a workshop (classification or timeline) and two writing tasks: Level 1 with guiding questions, Level 2 as transfer or value judgement, each with a model answer and three criteria for self-assessment.

## Privacy & Architecture

- **Offline visuals:** 59 SVG figures and Natural-Earth maps (`src/data/maps.json`, see `src/data/NOTICE.md`), 17 interactive models with 51 exploration goals, a Lernpfad panorama and a timeline. No third-party embeds, analytics, external fonts or background requests.
- **Sources:** 203 links, each fetched once on 26 November 2026 and labelled with its real page title ([docs/geschichte-gymnasium-7-coverage.md](../docs/geschichte-gymnasium-7-coverage.md)); they open only when clicked. Source excerpts (Widukind, Ibn al-Athir, Jakob Fugger) are simplified renderings made for the app and say so.
- **Local persistence:** progress, theme and the learner's own answers stay in this browser under `geschichte_gy7_academy_progress_v1` and `geschichte_gy7_theme`; „Lokalen Fortschritt zurücksetzen“ also deletes the texts. The app never reads, rates or sends them.
- **Teacher videos:** not included in this initial `0.0` version (AGENTS.md §4).

## Development & Offline Bundle

```bash
npm ci
npm run dev           # http://localhost:5290/geschichte-gymnasium-7/
npx tsc --noEmit
npm test              # Vitest: lessons, conventions, coverage, cell, mapping, labs, feedback, progress
node scripts/check-curriculum.mjs   # verbatim competences, curriculum and legacy snapshot hashes
npm run package:zip   # dist/index.html and release/ZAM-Academy-Geschichte-7-Gymnasium-offline.zip
```

## ZAM Cell & Legacy Inventory

- [cell.json](cell.json) (`zam-academy:geschichte-gymnasium-7`) holds 41 atoms (one per lesson) and 82 cards: a binary `tier1_fast` check and a `tier2_synthesis` recall per lesson, 123 ULIDs pinned in [tests/fixtures/public-contract.json](tests/fixtures/public-contract.json). Every card links to `https://academy.zam-os.org/geschichte-gymnasium-7/#lesson=<id>`.
- [replaces-de-by.json](replaces-de-by.json) is a **proposal** (`"status": "proposal-only"`, `"approved": null`) for the four items of `de-by:gymnasium-7-geschichte-mittelalter-frankenreich-staedte-kreuzzuege-reformation`: 2 A (Kaiserkrönung 800, Gutenberg's printing press), 0 B, 2 C kept active. The cell declares no `replaces` or `retired_items` until Thomas approves the mapping. The byte-exact legacy snapshot lives in `tests/fixtures/`.
