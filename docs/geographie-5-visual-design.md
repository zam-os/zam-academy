# Grade 5 geography: visual learning design

This follow-up to PR #125 compares `geographie-realschule-5` with
`gpg-mittelschule-5` and adds explanatory graphics throughout Geography.
The comparison used `main` at `77d75ecd7f2456209377ba0c8317d45cd1319153`.

## Comparison and resulting changes

Both packages use the same broad lesson workflow: explanation, quick check,
workshop, and a learner-written answer with self-assessment. GPG places a
labelled illustration inside the explanation in all 34 lessons. Geography
previously had six interactive map/model families in nine of its 31 lessons,
after the quick check, and no illustrations in its reading panels. The other
22 lessons therefore depended on prose before the workshop.

The lesson JSON inventories were counted with Node (`figures.length` for GPG,
`model` for Geography), and built examples were inspected in local Chrome:
the solar system, map construction and landscape sequence, plus the Geography
learning path. GPG's use of subject colours and illustrations near the relevant
text is the useful reference here.

| Design aspect | GPG 5 reference | Geography before | Geography in this PR |
| --- | --- | --- | --- |
| Visuals inside the reading explanation | All 34 lessons | None | All 31 lessons |
| Interactive maps/models | Separate lesson-specific elements | Six families in nine lessons | Retained, with semantic colours |
| Visual guidance | Labels and captions | Model instructions | Observation question, selectable details and contextual notes |
| Learning path | Text and area accents | Text and area accents | Seven illustrated area cards and an expedition illustration |
| Narrow screens | Responsive figures | Responsive model views | Readable figure canvas, horizontal panning and automatic centring of selected details |

The additions are locally authored SVGs. Water stays blue and vegetation green
across learning areas; coral, gold and purple distinguish processes and selected
features. Each learning area retains its own accent. Light, explicit dark and
system dark themes use the same semantic palette with different contrast values.

## What the graphics explain

| Learning area | Graphics and relationships |
| --- | --- |
| 1 · Introduction | Nature/use/interactions; globe–view from above–map; selecting details and explaining symbols; register–page–search field |
| 2 · Planet Earth | Eight planets in order; rotation versus orbit and axial tilt; conditions for life; observation mission and debris prevention; Earth structure beside a long-time comparison |
| 3 · Orientation | Globe versus flat map; latitude and longitude; paper-map conversion; relative directions; comparing research journeys; contrasting environmental conditions without treating inhabitants as uniform groups |
| 4 · Surface processes | Three plate motions; a possible rock pathway including consolidation; weathering–transport–deposition; hazard/use/precaution; competing land uses |
| 5 · Germany and Bavaria | State–federal state–capital hierarchy; administration versus rivers; four broad landscapes; comparing two thematic maps; contrasting protected landscapes |
| 6 · Local area | Town–countryside flows; excursion planning and evidence; shade, seating and access from different perspectives |
| 7 · Current event | Place/time/change/people; checking sources; evidence–criteria–judgment |

Each figure appears after the first explanatory paragraph and before the worked
example. Its observation question directs attention to a relationship. Native
buttons select a part, reduce competing visual detail and show a short explanation;
“Alles ansehen” restores the overview. Focus selection is session-only, records no
mastery and does not rerender the draft, workshop or model. On narrow screens,
selection pans only the figure viewport to the relevant detail.

Every figure has a descriptive accessible name and an explicit caption. Captions
identify invented data, symbols, approximate coordinates and non-measurable
schematics where those limits affect reasoning. The landscape sequence is not a
measured transect; the hierarchy is not a boundary map; the drawn view from above
is not an actual aerial photograph. The Earth-age comparison gives each of 46
points 100 million years and explains that human history occupies only a tiny
fraction of the last point.

The Earth cross-section uses exactly three distinctly coloured, directly labelled
zones matching the lesson: a thin crust, mantle and core. It groups the core as one
zone at this level. The rotation drawing uses a curved equatorial arrow around an
axis marked N/S. Selected-note labels retain their bold emphasis after interaction;
the scale figure and model both use spaced notation such as `1 : 50 000`.

Practice items, curriculum bindings, identifiers, progress keys and the mapping
proposal are unchanged. The cell description identifies the published preview. Following Thomas’s publication instruction on 2026-11-14, the package
is a published preview; real excursions, current-event research, conservation
action and presentations retain their classroom role. Teacher review and videos
remain visibly marked as open.

## Verification

From `geographie-realschule-5/`:

- `npm ci --offline --no-audit --no-fund`: existing locked development tools only.
- `npx tsc --noEmit` and `npm test`: 127 tests pass, including one figure contract
  per lesson, complete figure coverage, valid selectable parts, accessible markup
  and reasoning-relevant schematic limits.
- `npm run verify:content`: 30 curriculum statements found; official and legacy
  snapshot hashes verified; mapping remains proposal-only.
- `npm run package:zip` and `npm run verify:release`: exact self-contained HTML,
  three platform starters and instructions verified; shell syntax passes.
- `npm run verify:browser`: 124 lesson/level/theme combinations, 248 desktop
  figure interactions, 64 mobile views at 390 px, plus path and reference views.
  Checks include label bounds, accessible descriptions, real keyboard activation,
  draft/storage/scroll preservation, mobile panning, selected-detail visibility,
  readable main labels, three distinct rendered Earth-layer colours, a curved rotation
  arrow, persistent note-label emphasis, consistent scale notation and the existing
  model/project/workshop controls. It
  reports zero runtime exceptions and zero external requests.

At repository root:

- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  51 tests pass.
- `ZAM_CORE=file:///private/tmp/zam-core-check54/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs`:
  all cells install and curated distractor checks pass using CI's pinned
  `zam-core` 0.54.0, including this package's 62 items.

Local browser captures were inspected for all 31 diagrams in light and dark,
with additional full-page and narrow-screen inspection. The browser command writes
its screenshots and JSON report to a fresh temporary folder, whose path it prints.
They are QA artifacts, not learning sources. The build and offline ZIP contain
the graphics without loading remote assets or adding dependencies.
