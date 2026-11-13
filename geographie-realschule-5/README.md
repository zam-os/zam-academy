# Grade 5 geography · Bavarian Realschule

An offline learning package for the shared Grade 5 LehrplanPLUS curriculum: 31 lessons in seven learning areas, 31 classification workshops, writing tasks at two levels, six map/model families and 62 linked ZAM practice items.

This is a **local draft** (`publication.json`: `local-only`). It is excluded from the public catalog, atlas registry and Pages. Its cell contains no history replacements or retirements. Teacher review and a separate video step remain open; no teacher videos are included.

## Run locally

```bash
npm ci
npm run dev
```

Open `http://localhost:5238/geographie-realschule-5/`. For an install-free build, run `npm run package:zip` and open the HTML inside `release/ZAM-Academy-Geographie-5-offline.zip`. The ZIP includes Windows, macOS and Linux launchers. No account, server or runtime third-party request is required. External source links open only on a click.

## Learning path

| Area | Lessons | Curriculum hours | Focus |
| --- | ---: | ---: | --- |
| 1 | 4 | 8 | Geography, media, map construction and atlas lookup |
| 2 | 5 | 8 | Solar system, Earth movements, life, satellites, Earth history and structure |
| 3 | 6 | 10 | Continents/oceans, projections, coordinates, scale, orientation, research journeys and contrasting environments |
| 4 | 5 | 10 | Plate motion, rock pathways, erosion, natural hazards and land-use decisions |
| 5 | 5 | 8 | Germany, Bavaria, broad landscapes, two thematic maps and protected areas |
| 6 | 3 | 8 | Local town structure, fieldwork preparation, map choice and quality of life |
| 7 | 3 | 4 | A real current event, sources, judgment and presentation planning |

Each lesson has an explanation and worked example, a takeaway, a three-option check, a classification workshop and distinct guided/transfer writing tasks. Learners compare their own response with a model answer and three criteria; the app does not grade prose. Core completion requires the check, workshop and guided self-assessment, plus opening the required model comparisons and formally completing the relevant research worksheet fields. Level 2 is additional transfer practice.

Real atlas lookup, sketches, local observations, an accompanied excursion, conservation action, research and presentations remain learner/classroom activities. The [coverage matrix](coverage.json) marks these expectations `supported` and explains the remaining work. A completed field or opened model is never presented as evidence of understanding or a completed presentation.

## Models and data

- The world map uses bundled Natural Earth geometry, an equator, a prime meridian and three approximate coordinate examples. The equirectangular projection distorts polar areas.
- The regional map uses a central-latitude longitude correction. It locates all 16 state capitals and the seven Bavarian government seats; Munich serves both roles. It does not draw state or district boundaries.
- The scale calculator checks all integer paper lengths from 1–8 cm at 1 : 25 000 and 1 : 50 000. Screen dimensions do not represent paper centimetres.
- Relief and illumination diagrams are explicitly schematic. They do not provide measured profiles, calibrated distances or an orbital simulation.
- The two thematic maps mark selected city and agricultural regions. They are qualitative teaching examples, not complete coverage, current statistics or measured density maps.

[Map provenance and limitations](src/data/NOTICE.md). Source page titles, check dates and SHA-256 values are recorded in [source-checks.json](tests/fixtures/source-checks.json).

Progress, drafts and the shared research worksheet remain in this browser's `localStorage` under the package-specific `geographie_rs5_academy_progress_v1` key. The theme has its own `geographie_rs5_theme` key. Blocked storage produces a visible message and the session continues in memory. Avoid personal data in the worksheet.

## Cell and older cards

Cards live only in [cell.json](cell.json). Every item links to a stable lesson fragment. Generated ULIDs, slugs and anchors are pinned in a contract fixture. Each atom binds its real Grade 5 learning area without a track restriction.

[replaces-de-by.json](replaces-de-by.json) proposes 6 A matches and 10 C classifications across exact snapshots of the old Grade 5 and Grade 6 geography cells. Approval is `null`. Neither transfer nor retirement is enabled. The [curriculum and inventory report](../docs/geographie-5-coverage.md) explains neighbouring-grade scope and remaining decisions.

## Verification

```bash
npx tsc --noEmit
npm test
npm run verify:content
npm run package:zip
npm run verify:release
npm run verify:browser # installed Chrome; optionally set CHROME_BIN
```

`verify:content` checks all 30 verbatim competence rows against the fetched official HTML and verifies official/legacy snapshot hashes. Unit tests cover content, workshops, model arithmetic, storage, research validation, deep links and cell/mapping contracts. `verify:release` checks exact ZIP HTML and launcher bytes, shell syntax and the absence of external runtime assets. CI also installs the cell with its pinned published ZAM kernel.
