# Chemistry 6 Mittelschule

A local offline learning package for the chemical perspective of Bavarian
**Natur und Technik 6**. The learner interface is German. This is a Chemistry
package within the integrated subject, not a complete NT6 year course.

| Official section | Lessons | Content |
| --- | ---: | --- |
| NT6 LB 1 | 2 | Fair comparisons, observation and inference, protocols, source selection guidance, safety, model limits |
| NT6 2.1 | 11 | Water uses and properties, solubility and conductivity, surface tension, states and changes, water anomaly, molecules, electrolysis, gas identification, hydropower context |
| NT6 2.3 | 4 | Forest food web and substance cycle, simplified photosynthesis word equation, decomposition and soil organisms, soil functions and protection |

There are 17 lesson atoms and 51 German recall items in `cell.json` (two
binary checks and one synthesis item per lesson). Real ULIDs were generated
once; `tests/fixtures/public-contract.json` pins their identities and lesson
links. Cards are authored only in the cell. Molecular formula card text uses
math segments with German speech.

Every lesson has three explanation paragraphs, a worked example, a key rule,
a three-option quick check, a four-case classification workshop and two
distinct written tasks with hints, model answers and three criteria. The
16 subject-specific models provide three selectable comparisons each; the
particle model also has a temperature slider. Labels, prose explanations,
model limits, keyboard controls and horizontal scrolling on narrow screens
keep the diagrams accessible. Stages use teal, blue and green accents in both
themes.

## Learning progress

A lesson is complete after a correct quick check, a solved workshop and a
separate self-assessment of the learner's own draft on **both** task levels.
Drafts are not automatically graded. A changed draft invalidates that level's
confirmation. Progress and drafts use the package-specific localStorage key
`chemie_ms6_academy_progress_v1`; the theme uses `chemie_ms6_theme`.
Cross-tab saves preserve independent work. If storage is unavailable, the
interface explains the session-only fallback. Model exploration marks last
for the current session; they are not retained as mastery evidence.

No account, network requests, tracking, external font, embedded video or
remote image is required. The official curriculum link and Academy home link
open only when selected.

## Curriculum and publication

`coverage.json` maps 20 verbatim expectations: 12 implemented and 8 supported
by app preparation and interpretation. The supported rows explicitly leave
actual investigations, equipment handling, group protocols, source research,
gas experiments and field identification in class. The official NT5 and both
NT7 tracks were checked to establish the boundary. Full source snapshots,
SHA-256 values and real page titles are included.

The package omits NT6 2.2 aquatic biology, LB 3 puberty/development and LB 4
mechanics. Hydropower is included because it is an explicit expectation of
NT6 2.1; photosynthesis stays a simplified word equation. See
[the scope and evidence](../docs/chemie-mittelschule-6-coverage.md).

`publication.json` is `local-only`: no public catalog, atlas or Pages entry.
The app displays this status and explains in its ZAM dialog that the prepared
cell is not yet available through the public catalog. Teacher review and
teacher videos remain open. Videos are intentionally left to the separate
reviewed video step required by the package standard.

`replaces-de-by.json` is an empty, unapproved proposal. No old item is replaced
or retired. Related packages of other school types and NT5 keep their own
cards and review histories. There is no requested history-transfer decision.

## Develop and verify

```sh
npm ci
npm run typecheck
npm test
npm run check:curriculum
npm run build
npm run check:browser
npm run package:zip
npm run dev -- --host 127.0.0.1
```

The dev port is 5247. The build is a single offline `dist/index.html`.
The ZIP is `release/ZAM-Academy-Chemie-6-Mittelschule-offline.zip` and contains
the same HTML plus Windows, macOS and Linux launchers and starter instructions.
`verify-release.mjs` compares the archived bytes and checks launcher syntax.

`check:browser` uses installed Chrome (override `CHROME_BIN` on other hosts),
a disposable profile and the built HTML. It checks each lesson at both levels
and in both themes, all model controls, all workshops, phase boundaries,
both-level completion, reload persistence, draft invalidation, reset, the ZAM
draft dialog and layouts at 320, 390, 720 and 1280 pixels. Screenshots and a
JSON report go to `/private/tmp/zam-chemie6-browser` by default (override
`BROWSER_QA_DIR`). No browser or test dependency is added.

From the repository root, use the CI-pinned `zam-core@0.54.0` in a scratch
installation:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///absolute/scratch/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absolute/scratch/node_modules/zam-core/dist/index.js node chemie-mittelschule-6/scripts/validate-cell.mjs
```
