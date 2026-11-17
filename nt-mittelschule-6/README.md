# Natur und Technik 6 Mittelschule

A German offline learning package for all learning areas of Bavarian
**Natur und Technik 6**. It contains 38 lessons, 37 model types and 114 recall
items in `cell.json`. The subject is the canonical combined subject `nt`.

| Official section | Lessons | Focus |
| --- | ---: | --- |
| LB 1 | 2 | Investigation, diagrams, source selection, safety and model limits |
| 2.1 | 11 | Water, particles, molecules, electrolysis, gas identification and hydropower |
| 2.2 | 5 | Aquatic organisms, microscopy/cells, fish, food webs and habitat protection |
| 2.3 | 4 | Forest substance cycles, photosynthesis, soil organisms and soil protection |
| LB 3 | 5 | Puberty/hygiene, reproductive organs, fertilisation, pregnancy/birth and contraception |
| 4.1 | 2 | Force effects, newtons and spring-force measurements |
| 4.2 | 4 | Work, levers, force converters and body-protecting tool choice |
| 4.3 | 5 | Uniform motion, distance/time graphs, stopping distance, inertia and traffic judgment |

`coverage.json` maps all 40 verbatim expectations: 26 implemented and 14
supported. Supported rows prepare and interpret practical work; actual
field identification, microscopy, experiments, measurements, group work and
tool handling remain in supervised class. This package does not replace them.

Each lesson has a worked example, a key rule, a three-option quick check,
a four-case classification workshop and separate guided/transfer writing
tasks with hints, model answers and criteria. Three substantive model goals
include at least one direct model action in every model type. Learners place
labels, draw food arrows, order stages, build a molecule, test predictions,
change habitats or move a force/visibility marker; numerical proposals cover
the remaining types. Constructed models require an explicit check. Opening
comparison views alone does not solve goals. Numerical controls include atom conservation,
gas volumes, density, temperature, microscope focus, spring force, work,
lever arms, ramps, speed, graphs and approximate stopping distance. Models
use labelled diagrams, adjacent explanations and explicit limits.

Health lessons use neutral schematics and fictional/general examples.
Learners are never asked to record their body development or sexual
experiences. The contraception comparison explains condom and pill
mechanisms and protection limits; it provides no personal treatment or
dosing instructions. Written answers are local drafts, not medical advice.

## Progress and identity

A lesson is complete after a correct quick check, a solved workshop and an
explicit self-assessment of the learner's own draft on **both** levels.
Written drafts are not automatically graded; editing invalidates the affected
confirmation. Model goals last for the session and are not mastery evidence.

Progress uses `nt_ms6_academy_progress_v1`, theme `nt_ms6_theme`. Cross-tab
saves preserve independent work. When the new key is absent and the earlier key is accessible, the app copies
the local Chemistry draft by its unchanged lesson ids. Existing NT6
progress wins, and a reset does not revive the old draft. The theme also
falls back to the old draft's setting. Storage restrictions produce a
session-only fallback.

The package was renamed and expanded at Thomas's request before publication.
All original 17 lesson ids, 17 atom ULIDs and 51 item ULIDs/slugs are retained;
new atoms and items use generated ULIDs. The contract fixture pins all 38
atoms and 114 items. Cards are authored only in `cell.json` and link to their
lesson under `/nt-mittelschule-6/`.

`replaces-de-by.json` remains an empty proposal with `approved: null`, no
`replaces` and no retirements. Related Realschule/Gymnasium cells remain
active at their own school types. NT5 is documented prior knowledge; the
current cell format rejects cross-tile prerequisite edges.

## Publication and verification

Published following Thomas's instruction in the Codex chat on 2026-11-15, at
version 0.0 (`publication.json`). The package is registered in the
public catalog, atlas and Pages build; deployment follows the PR merge. The
version next to the Academy link and the ZAM dialog state that teacher review and the
separate reviewed-video step remain open. Cell version `2026.11.2` preserves
all lesson ids, atom ids, item ids and slugs. No videos, external
fonts, remote images, accounts or background requests are added.

```sh
npm ci
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run check:browser
npm run dev -- --host 127.0.0.1
```

The development port is 5250. The build is one self-contained
`dist/index.html`. The ZIP is
`release/ZAM-Academy-Natur-und-Technik-6-Mittelschule-offline.zip`; it includes
the identical HTML, Windows/macOS/Linux launchers and starter instructions.

The browser verifier uses native headless Chrome and a disposable profile.
It checks every lesson at both levels and in light/dark themes, every model
view, all model goals, selected-chip contrast in explicit/system themes,
requested mobile widths, heading and diagram-label bounds, negative controls,
workshops, persistence, draft invalidation, reset and the published
ZAM dialog. Native pointer and keyboard events verify that marker dragging survives redraws and retains focus.
Screenshots and its report are written to `/private/tmp/zam-nt6-browser`
(override `BROWSER_QA_DIR`). No test dependency is added.

At the repository root, using the CI-pinned `zam-core@0.54.0` installed in a
scratch directory:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/changed-apps.test.mjs
ZAM_CORE=file:///absolute/scratch/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absolute/scratch/node_modules/zam-core/dist/index.js node nt-mittelschule-6/scripts/validate-cell.mjs
```

See [curriculum, identity and validation evidence](../docs/nt-mittelschule-6-coverage.md).
