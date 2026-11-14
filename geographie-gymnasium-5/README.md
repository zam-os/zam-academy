# Geographie 5 · Bavarian Gymnasium

A ZAM Academy package for Jahrgangsstufe 5 of the Bavarian Gymnasium, aligned with the [official Geographie 5 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie), checked on 14 November 2026. The Gymnasium has one Fachlehrplan for all Ausbildungsrichtungen in Grade 5, so lessons carry no track. Learner text is German and addresses the learner with "du".

| Lernbereich | Lessons | Labs | Focus |
| --- | ---: | ---: | --- |
| 1 · Geographische Arbeitstechniken | 5 | 1 | Map types, atlas work, reading texts, pictures, tables and diagrams, drawing column and bar charts, preparing an excursion |
| 2 · Planet Erde | 11 | 6 | Solar system, Earth's layers, continents and oceans, the Earth's uniqueness and its protection, globe and map, compass directions, graticule, height representation, scale, digital geomedia |
| 3 · Naturräume in Bayern und Deutschland | 13 | 1 | Germany's and Bavaria's natural regions, sketches and profiles, endogenous and exogenous forces, rocks, the Alps and the glacial series, tourism, natural hazards, uplands, the Bavarian Forest National Park, coasts and the Wadden Sea |
| 4 · Ländliche Räume in Bayern und Deutschland | 6 | 2 | Rural change, weather measurement, soils, natural factors of farming, agricultural regions, conventional and organic farming |
| 5 · Städtische Räume in Bayern und Deutschland | 9 | 3 | Administrative structure, conurbations, urban growth and functional zones, suburbanisation, city–hinterland relations, city maps, land-use mapping, sustainable redesign |

Every lesson has an explanation with a key rule, a drawing, map or lab, a quick check with two plausible wrong answers, a workshop (ordering or classification) that is never solved at the start, and two writing tasks: Level 1 with guiding questions, Level 2 as transfer or judgement. A lesson is complete after the quick check, the workshop and the Level 1 self-assessment against a model answer. Writing is not graded automatically.

Thirteen lessons have a lab with exactly three goals, none reached at the start: a compass map, a draggable crosshair on a world graticule, a scale calculator, contour lines with a live profile, a journey to the Earth's centre, distance and atmosphere for liquid water, a column/bar chart builder, a weather week with a daily mean, a land-use model (temperature, precipitation, soil), tides with storm surge and dike height, commuters over a day, grid squares on a city map and a land-use mapping of a main street. Reached goals are kept in the browser; they do not count towards lesson completion. Each stage has its own accent colour (teal, blue, amber, green, violet) in both themes.

## Scope and evidence

[coverage.json](coverage.json) holds all 28 Kompetenzerwartungen and the 16 "Inhalte zu den Kompetenzen" verbatim with their lessons; `node scripts/check-curriculum.mjs` finds each one in the stored page (`tests/fixtures/curriculum.html`, SHA-256 in `coverage.json`). Seven rows are `supported` rather than `implemented`: real measurements, experiments with rock and soil samples, drawing own sketches, the excursion, mapping a real street and presenting own ideas. The app prepares and rehearses them; they happen in class.

Maps are drawn locally from public-domain Natural Earth data ([src/data/NOTICE.md](src/data/NOTICE.md)); natural regions, agricultural regions and conurbations are labelled simplifications. Drawings and lab models say what they simplify. Source links were opened once and their real page titles read (see the [documentation](../docs/geographie-gymnasium-5-coverage.md)); they open only on a click.

Progress, lab goals, theme and drafts stay in this browser under `geo_gym5_academy_progress_v1` and `geo_gym5_theme`. No accounts, analytics, external fonts, embeds or background requests. Teacher videos are not part of this version; a separate step adds and checks them.

## Develop and verify

```sh
npm ci
npm run dev           # http://localhost:5243/geographie-gymnasium-5/
npm test
npm run typecheck
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
```

`npm run package:zip` creates `release/ZAM-Academy-Geographie-Gymnasium-5-offline.zip` with the self-contained HTML and starters for Windows, macOS and Linux, and verifies it. `validate-migration.mjs` uses disposable libraries only.

`scripts/build-map-data.mjs` is a one-off preparation step for `src/data/maps.json` and needs the Natural Earth files listed in the NOTICE; CI does not run it.

## Cell contract and mapping

`cell.json` is the only card list: 44 atoms, one per lesson, with two cards each (a binary fast check and a short recall), 88 cards, and 30 soft prerequisites. Every card cites `https://academy.zam-os.org/geographie-gymnasium-5/#lesson=<id>`. Lesson ids use the prefix `geogym5-`, distinct from the Realschule package's `geo5-`. Atom and item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json` and become a contract on first publication.

[replaces-de-by.json](replaces-de-by.json) maps the eight items of `de-by:gymnasium-5-geographie-erde-gradnetz-orientierung`: 3 A (prime meridian, contour spacing, Main and Danube drainage) and 5 C kept active. Thomas approved this mapping on 2026-11-14; the three successor fast checks carry `replaces` from the first publication, and no card is retired. `node scripts/validate-migration.mjs` (with `ZAM_CORE`) moves reviewed histories unchanged in a disposable library, keeps the C cards in review, checks that repeated installs change nothing and that a learner holding both an old card and its successor makes the install refuse.
