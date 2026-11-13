# Grade 5 Realschule geography: curriculum and legacy inventory

The package is a local draft in `geographie-realschule-5/`. It has 31 lessons and 62 cards and is not registered for public publication. The shell derives from Geography 9; the lessons, maps/models, progress keys, identifiers, source inventory and curriculum bindings are specific to Grade 5.

## Official curriculum check

The live [ISB Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/geographie) was fetched on 2026-11-13 with a browser User-Agent. Its exact HTML is retained in `tests/fixtures/official-curriculum.html`; SHA-256 is `c8dc42fed435f2d7abd8c3eac44162cb941756e0bed4325d0652ce2924fe9e8c`. No archive snapshot was needed. Grade 5 has one shared Fachlehrplan and no Wahlpflichtfächergruppen distinction.

The seven areas have approximately 8, 8, 10, 10, 8, 8 and 4 hours. All 30 Kompetenz­erwartungen were extracted verbatim, copied into `coverage.json`, and checked against the downloaded page with whitespace normalisation. `node geographie-realschule-5/scripts/verify-content.mjs` reports **30 rows, 0 not found** and checks the source hashes. Per-row evidence distinguishes implemented teaching/practice from support for real-world performance.

The [Grade 6 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geographie) was also read. It proceeds to Europe, weather/climate, agriculture, transport/industry, energy and tourism. The Grade 5 package therefore gives initial land-use examples but does not reproduce the older Grade 5 cell's detailed agricultural structural-change bundle. It builds on primary-school local-environment knowledge, explicitly recalled in the first lesson. No earlier Realschule geography grade exists.

The current Geography 8 and 9 Academy packages were inspected as neighbours and references. Their published anchors and identifiers remain untouched. Shared introductory ideas can recur in Grade 5 without claiming equivalence to their older, deeper retrieval tasks.

## Teaching scope and limits

The area lesson counts are 4, 5, 6, 5, 5, 3 and 3. All lessons include worked examples, quick checks, classification feedback, two distinct writing levels and self-assessment criteria. All 31 reading panels now have a labelled explanatory graphic with selectable details; the [visual design report](geographie-5-visual-design.md) records its purpose and verification. Six model families are used in nine lessons: world coordinates, seasonal illumination, paper scale, contour/relief, Germany's capital points and two qualitative thematic maps.

Printed/digital atlas lookup, learner-drawn sketches, historical/current mission research, real local observation, an accompanied school-town excursion, a conservation action and actual presentations cannot be completed by an offline app. Their coverage rows are marked `supported`. Applying the fictional human-impact scenario to the learner’s own environment is also supported classroom work. In particular, the research worksheet validates required text, plausible dates and two different ordinary web addresses; it neither fetches those addresses nor verifies source independence, factual accuracy, the learner's judgment or a performed presentation.

The world map is equirectangular. The Germany map corrects longitude scale at its central latitude, clips land and sea to that geographic window, and shows neighbouring countries as muted land. North Sea and Baltic Sea labels are projected offshore coordinates. Internal state and district boundaries are deliberately omitted. Approximate coordinates support orientation, not navigation or distance measurement. The two thematic maps share an outline and mark selected city regions and agricultural examples; labels explicitly exclude current density statistics or complete coverage. A missing point never means an empty region. Natural Earth source version, hash and public-domain terms are recorded in `src/data/NOTICE.md`.

Every displayed source was fetched and its actual title read. The initial LfU page was only an HTML redirect, so the final geological overview is linked. Candidate government and Wadden Sea URLs that returned errors were omitted. Teacher videos are absent, following the separate-video-step convention.

## Legacy snapshots and proposal

Source repository: `zam-os/zam`, commit `e6a235f75fe87b9d57af38bd61011027b891492c`. Both LF snapshots are retained byte-exactly under the package's `tests/fixtures/`. Their SHA-256 values are recorded in the mapping and checked by `verify:content`.

| Source cell | Items | A | B | C |
| --- | ---: | ---: | ---: | ---: |
| `de-by:realschule-5-geographie-erde-gradnetz-orientierung` | 8 | 3 | 0 | 5 |
| `de-by:realschule-6-geographie-deutschland-bayern-raum` | 8 | 3 | 0 | 5 |
| Total | 16 | 6 | 0 | 10 |

The proposed A matches retrieve the equator, the 500 m scale conversion, approximate axial tilt, the North German Plain, seven Bavarian districts and work commuting. Each points to exactly one successor slug. The last three come from the neighbouring-grade cell because the current official Grade 5 curriculum teaches German/Bavarian structures and city–hinterland relationships.

The C rows keep mixed or broader retrievals separate. Two possible retirements are proposed: the compound Earth-movement answer with invariant calendar dates and the broad-landscape answer that conflates part of the step-land with the Alpine foreland. Eight other C items remain active, including detailed agriculture and coastal processes. No history is spread across multiple new cards.

**Decision still required before any history-changing version:** should the neighbouring Grade 6 cell be included in this Grade 5 package's mapping, and are the six individual transfers and two proposed retirements approved? This report records a proposal only; a request to build the package grants none of those history changes. `approved` remains `null`, and the cell has neither `replaces` nor `retired_items`. No migration script is needed for this non-migrating draft.

## Verification evidence

- `npm ci --offline --no-audit --no-fund`: installed the existing locked development tools without new dependencies.
- `npx tsc --noEmit` and `npm test`: 125 tests passed; compile and verify lesson metadata, explanatory graphics, workshops, arithmetic, map projection, persisted state, research form, anchors and mapping proposal. The research tests retain the reference shell's local-date boundary, malformed date, unsafe URL and draft limits checks.
- `npm run verify:content`: all 30 statements found in the fetched official page; official and both legacy SHA-256 checks pass.
- `npm run package:zip` and `npm run verify:release`: produce and verify a self-contained HTML/ZIP and exact starter bytes.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`: 51 tests passed, including exclusion of local-only packages.
- `ZAM_CORE=file:///private/tmp/zam-core-check54/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs`: all cells, including this 62-item cell, installed with CI's pinned `zam-core` 0.54.0; card-text and curated-choice checks passed.

`npm run verify:browser` uses installed Chrome (or `CHROME_BIN`) through the browser’s debugging pipe and writes captures plus a JSON report to a fresh temporary folder. It uses built `dist/index.html`, never only Vite source. The recorded browser matrix covers 31 lessons × two levels × light/dark themes, plus learning path, reference view, 64 narrow-screen views, 248 desktop figure-control interactions and existing control events. The visual pass also checks accessible descriptions, label bounds, keyboard activation, selected-detail panning and preservation of drafts, storage and page scroll. Browser captures and the compact result are temporary QA artifacts in the output directory printed by that command; they are not curriculum sources or committed card text.
