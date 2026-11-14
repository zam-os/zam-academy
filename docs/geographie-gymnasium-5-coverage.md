# Geographie 5 Gymnasium: curriculum check, sources and card mapping

Package: `geographie-gymnasium-5/` · 44 lessons · 13 labs · 88 cards · built on 14 November 2026.

## Official curriculum

The live [Fachlehrplan Geographie 5 (Gymnasium)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie) was fetched on 14 November 2026 with a browser User-Agent (HTTP 200, no archive snapshot needed). The page is stored byte-exactly in `geographie-gymnasium-5/tests/fixtures/curriculum.html`; SHA-256 `a04aaacf5e02d348e280d2127f04b3c21c5e4c4081154138fcfe6b2a610c2992` (also in `coverage.json`). The page allocates no hours to the Lernbereiche, and there is one Fachlehrplan for all Ausbildungsrichtungen, so no lesson carries a track.

| Lernbereich | Kompetenzerwartungen | Lessons |
| --- | ---: | ---: |
| 1 Geographische Arbeitstechniken | 10 | 5 (+ lessons of all other areas) |
| 2 Planet Erde | 4 | 11 |
| 3 Naturräume in Bayern und Deutschland | 5 | 13 |
| 4 Ländliche Räume in Bayern und Deutschland | 4 | 6 |
| 5 Städtische Räume in Bayern und Deutschland | 5 | 9 |

`node geographie-gymnasium-5/scripts/check-curriculum.mjs` searches every competence and every "Inhalt zu den Kompetenzen" of `coverage.json` in the stored page (tags and scripts stripped, entities decoded, whitespace normalised): **28 verbatim competence rows, 0 not found; 16 content items, 0 not found; curriculum SHA-256 matches.** The unit tests check that every lesson is cited by a row and every row of Lernbereich 2 to 5 cites a lesson of its own area. Lernbereich 1 is taught across the year on content the teacher chooses, so its rows cite lessons of all areas (for example soil tests in LB 4 and land-use mapping in LB 5).

Seven rows are `supported`, not `implemented`, because they need real activity: measurements (LB 1/6), experiments with rock and soil samples (LB 1/8), own map sketches and profiles (LB 1/9), the excursion (LB 1/10), measurements and experiments with diagrams (LB 4/2), mapping a real street (LB 5/4) and presenting own ideas (LB 5/5). The app explains, rehearses with labs and workshops and states in each row what stays in class.

### Neighbouring grades

- **Below:** HSU 3/4 (home region, maps with legends, sun, earth and moon). Three lessons mark repetition from HSU (`review`).
- **Gymnasium 6:** no Geographie (the LehrplanPLUS URL redirects to the start page).
- **Gymnasium 7** (fetched on the same day): Europe, with climate (Gulf Stream, Föhn), vegetation zones, volcanism and earthquakes in depth, European rural and urban areas, seas and coasts. This package therefore keeps endogenous processes at the basic level the Grade 5 plan asks for and leaves climate zones, seasons and illumination zones out.
- **Other packages:** `geographie-realschule-5` (local draft) and `gpg-mittelschule-5` cover overlapping topics for other school types; nothing was copied from their lessons. The GPG 5 shell, its Natural Earth map data (trimmed to world, Germany and Bavaria) and eight of its drawings were reused.

## Sources shown to learners

Every external link was fetched once on 14 November 2026 with `curl -sL -A "Mozilla/5.0 …"` and its `<title>` read. Pages that answered 404 were dropped even where the site returned a plausible title (Klexikon `Erdkern`, `Gradnetz`, `Höhenlinie`, `Boden`, `Mure`, `Diagramm`, `Ökologische_Landwirtschaft`, `Pendler`, `Stadtplan`, `Vorort`; LfU flood and nature-park pages; two state-government pages). Klexikon redirects were labelled with their real title (`Ozean` → „Meer“, `Breitengrad` → „Breitenkreis“, `Mittelgebirge` → „Gebirge“). The 78 sources are in `src/curriculum/outline.json`; examples with their real titles:

| Source id | URL | Real page title |
| --- | --- | --- |
| `lehrplan` | lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie | LehrplanPLUS - Gymnasium - 5 - Geographie - Fachlehrpläne |
| `bayernatlas` | atlas.bayern.de | BayernAtlas |
| `np-bayerwald` | nationalpark-bayerischer-wald.bayern.de | Homepage des Nationalparks Bayerischer Wald |
| `np-berchtesgaden` | nationalpark-berchtesgaden.bayern.de | Startseite Nationalpark Berchtesgaden |
| `wattenmeer` | waddensea-worldheritage.org/de | Willkommen im Weltnaturerbe Wattenmeer · Wadden Sea |
| `lawinenwarndienst` | lawinenwarndienst.bayern.de | Lawinenlage Bayern · Lawinenwarndienst Bayern |
| `hnd` | hnd.bayern.de | Hochwassernachrichtendienst Bayern |
| `lfu-geologie` | lfu.bayern.de/geologie/geologie_bayerns/ueberblick | Geologischer Überblick Bayern - LfU Bayern |
| `oekolandbau` | oekolandbau.de | Das Informationsportal rund um Öko-Landwirtschaft und Bio-Lebensmittel |
| `bmleh-oeko` | bmleh.de/…/oekologischer-landbau_node.html | BMLEH - Ökologischer Landbau |
| `dwd` | dwd.de/DE/Home/home_node.html | Wetter und Klima - Deutscher Wetterdienst - Startseite |

The lessons give no current statistics from memory (no population figures, shares of organic farming or commuter numbers). Fixed facts that tests pin include the Zugspitze (2962 m), Großer Arber (1456 m), the Earth's radius (rund 6371 km), the mantle–core boundary (etwa 2900 km), Munich's coordinates (48° 8′ N, 11° 35′ O), the tidal period (12 Stunden und 25 Minuten), Bavaria's 71 Landkreise and 25 kreisfreie Städte, Munich's founding bridge (1158), the Bavarian Forest National Park (1970) and the Wadden Sea World Heritage listing (2009). Calculations in examples and model answers are pinned too (6,4 cm · 50 000 = 3,2 km; (4 + 11 + 6) : 3 = 7 °C; 22 mm in a school week).

## Existing ZAM cards

Checked in zam-os/zam at commit `b7fdfcc4e30d21bbbd97fb2025952ff7f4e296ac` (`tests/fixtures/curriculum/`):

- `de-by:gymnasium-5-geographie-erde-gradnetz-orientierung` (8 items) is taken in. Its LF snapshot is stored as `geographie-gymnasium-5/tests/fixtures/de-by-gymnasium-5-geographie-erde-gradnetz-orientierung-kvt.json`, SHA-256 `d241915961802fc71623f6bbae2ec180a809715f616d2e4fc50f3c66a13ed134`; a unit test recomputes it.
- `de-by:gymnasium-6-geographie-europa-raeume-wirtschaft-eu` and `de-by:gymnasium-7-geographie-europa-naturraeume-klima-plattentektonik` are not taken in: their Europe topics belong to Grade 7 of the current LehrplanPLUS.
- The Realschule Grade 5 and 6 cells are proposed in `geographie-realschule-5` and are not mapped twice.

| Old item | Category | Proposed successor | Reason (short) |
| --- | --- | --- | --- |
| J01 Nullmeridian durch Greenwich | A | `geogym5-gradnetz-check` | same single retrieval, same binary choice against Paris |
| J02 Gradnetz-Synthese | C, keep active | – | multi-part; tropics, polar circles, date line not in the Grade 5 plan |
| J03 Dichte Höhenlinien | A | `geogym5-hoehen-check` | same retrieval, steep against flat |
| J04 Maßstab-Synthese mit 6,4 cm | C, keep active | – | three-part prompt; one history cannot be split |
| J05 21. Juni, Zenit am Wendekreis | C, keep active | – | seasons are not in the Grade 5 plan |
| J06 Jahreszeiten und Beleuchtungszonen | C, keep active | – | not in the Grade 5 plan |
| J07 Main → Nordsee, Donau → Schwarzes Meer | A | `geogym5-bayern-naturraum-check` | same retrieval and distractor |
| J08 Bayern-Synthese | C, keep active | – | three topics now in three lessons |

Summary: **3 A, 0 B, 5 C** (all C kept active, no retirement). **Thomas approved this mapping on 2026-11-14** in the Claude Code session that built the package: „Freigabe deines Vorschlages - bitte PR erstellen“. `replaces-de-by.json` therefore has `"status": "approved"` and `"approved": "2026-11-14"`, and the three successors (`geogym5-gradnetz-check`, `geogym5-hoehen-check`, `geogym5-bayern-naturraum-check`) carry `replaces` from the first publication (cell version 2026.11.1). The catalog gate (`scripts/mapping-approval.mjs`) accepts the cell.

`geographie-gymnasium-5/scripts/validate-migration.mjs` (with its CI step) installs the old cell, reviews every old card twice, installs this cell and checks: the three histories move with all FSRS fields and 16 reviews intact, the five C cards stay in active review, 85 new cards start unlearned, repeated install and enrolment change nothing, and for each approved row a learner holding cards on both the old id and its successor makes the install refuse and roll back.

## Verification (14 November 2026)

In `geographie-gymnasium-5/`:

- `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`: typecheck clean, 3 test files with 322 tests passed, single-file build, ZIP built and verified by `verify-release.mjs`.
- `node scripts/check-curriculum.mjs`: 28 rows, 0 not found; 16 content items, 0 not found.
- `ZAM_CORE=<zam-core 0.54.0> node scripts/validate-migration.mjs`: 3 histories moved with all FSRS fields and 16 reviews intact; 5 C cards active; 85 fresh unlearned cards; repeat install/enrolment idempotent; collision refused for each of the 3 approved rows.

At the repository root: `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` (51 passed) and `ZAM_CORE=<zam-core 0.54.0> node scripts/validate-cells.mjs` (exit 0; this cell: 88 items, curated-choice checks pass).

Browser: the built `dist/index.html` was opened in headless Chrome for all 44 lessons on both levels (`--dump-dom`, scripts and styles removed, `<main>` checked for title, level prompt, workshop, lab, figures and `NaN`/`undefined`): 88 pages, 0 problems. Screenshots of the learning path, labs and the reference view were checked in light and dark theme, and the lab interactions (dragging the graticule crosshair, buttons, sliders, painting facades) were tried in the dev server, including a 375 px phone viewport without horizontal scrolling.
