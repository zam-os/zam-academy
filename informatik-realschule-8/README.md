# Informatics 6–8 · Bavarian Realschule

**One shared course for Grades 6, 7 and 8: 40 lessons, nine stages and 87 ZAM cards.** The atlas, list and coverage matrix link all three grades to the same app. The app URL, lesson and card identifiers, ZAM cell and browser storage remain the same, so learners continue with their existing progress.

- App: https://academy.zam-os.org/informatik-realschule-8/
- Cell: `zam-academy:informatik-realschule-8` (the existing ZAM title is still “Informatik 8 Realschule (ZAM Academy)”)
- Offline build: `release/ZAM-Academy-Informatik-8-offline.zip`

The course follows [LehrplanPLUS Information Technology](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/it), introductory modules 1.1–1.9, for all Wahlpflichtfächergruppen. The [subject profile](https://www.lehrplanplus.bayern.de/fachprofil/realschule/it) lets schools start in Grade 5, 6 or 7 and choose the distribution of modules. The introductory course ends by the end of Grade 8; the three atlas entries do not prescribe a separate syllabus for each grade. The shared scope was checked against the current official pages on 2026-11-17. The existing [coverage matrix](coverage.json) maps all 35 Kompetenzerwartungen.

| Stage | Module | Lessons | Workshops |
| --- | --- | ---: | --- |
| Touch typing | IT 1.1 | 4 | Finger paths, error analysis, heading formatting, workstation setup |
| First programs | IT 1.2 | 5 | Garden robot, events, checkout program, fan controller, loops |
| Word processing | IT 1.3 | 4 | Typing speed, DIN 5008, text objects, layout |
| Exchanging information | IT 1.4 | 6 | Communication model, bits, ASCII/Morse, digitisation, risks, privacy |
| Image editing | IT 1.5 | 4 | Pixel/vector zoom, image dimensions, vector house, misleading graphics |
| Spreadsheets | IT 1.6 | 5 | Data types, formula copying, functions, VAT model, chart selection |
| Research and presentation | IT 1.7 | 4 | Search queries, Creative Commons, slide design, presenting |
| Computer systems | IT 1.8 | 4 | Input/processing/output, folder tree, software licences, passwords |
| Digital media | IT 1.9 | 4 | Tool selection, netiquette, device protection, data traces |

Each lesson has an explanation, worked example, key rule, quick check, a workshop with three goals and exercises at two levels. Completion requires the quick check, all workshop goals and three Level 1 tasks; three Level 2 tasks earn the transfer badge. Progress and theme settings stay in `localStorage`. Opening the course from another grade does not create another copy of that progress.

## Practice beyond the app

The workshops prepare work at a real device. Touch typing and measured transcription, creating actual programs, documents, images, spreadsheets and presentations, independent research and speaking to a group still need practice outside the app. Legal examples are simplified school models. The password workshop assumes 10¹⁰ guesses per second.

Advanced IT modules remain in their existing packages: [Algorithms](../algorithmen/) (2.6.1), [Networks](../datennetze/) (2.5.1), [SQL](../sql/) (2.3) and [Informatics 10](../informatik-realschule-10/).

## Existing ZAM cards

The cell stays at version `2026.10.3`. Each atom already binds its module to Grades 6, 7 and 8. This atlas change creates no new cell or history transfer.

The existing [mapping](replaces-de-by.json), approved by Thomas on 2026-10-27, covers all 24 legacy Informatics 6–8 cards: ten A rows and one B row transfer histories through `replaces`; thirteen C rows are retired while their histories remain. See the [migration inventory](../docs/informatik-8-bestandsabgleich.md).

## Development and verification

```bash
npm ci
npm run dev        # http://localhost:5211/informatik-realschule-8/
npm run typecheck
npm test
npm run build
npm run package:zip
node scripts/verify-release.mjs
```

At the repository root:

```bash
node --test scripts/academy-registry.test.mjs scripts/build-catalog.test.mjs
```

The registry checks the three grade routes, shared identity, unique package counts, coverage links and grade-specific search queries. The public catalog continues to contain one copy of the existing cell.
