# Mathematics 5 and 6 Mittelschule: curriculum and legacy audit

The two packages follow the common Bavarian Mittelschule Fachlehrpläne, checked
on 2026-11-11. These grades have no separate M-class or Realschule tracks.
Learner content is German; this audit documents the implementation in English.

| Package | Official clauses | Lessons | ZAM cards |
| --- | ---: | ---: | ---: |
| [Grade 5](../mathematik-mittelschule-5/) | 35 | 32 | 64 |
| [Grade 6](../mathematik-mittelschule-6/) | 30 | 35 | 70 |

The counts come from the package contract tests and the cell atom/item counts.
Each lesson has one atom, one rule card and one worked transfer card. All card
content is maintained in the package's `cell.json`; no card generator or second
card list is committed.

## Official sources and scope

The live [M5 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/mathematik)
and [M6 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/mathematik)
were downloaded with a browser User-Agent. Their actual page titles name the
Mittelschule, grade and Mathematics. Each package preserves the original HTML
under `tests/fixtures/curriculum.html` and records its SHA-256 in `coverage.json`.
The official pages specify no hour allocations for these learning areas.

`node <app>/scripts/check-curriculum.mjs` checks the original HTML hash and
searches every competence in its whitespace-normalized text, retaining formula
image alternative text and omitting navigation dialogs. The result is 35 rows,
0 not found for M5, and 30 rows, 0 not found for M6. Package tests check that every
clause has a lesson and every lesson has a clause.

The neighbouring [Grundschule 3/4 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik)
and [M7 Regelklasse curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/mathematik/regelklasse)
were checked to establish the boundaries. The app shells and pure models derive
from the existing Mathematics 5 and 6 Realschule packages; the selection follows
the Mittelschule clauses rather than the reference packages' grade labels.

Grade 5 includes numbers beyond a billion, representations and sequences,
natural-number arithmetic, whole-number states and changes, geometry in the
first quadrant, angles through 180 degrees, perimeters, rectangle areas,
everyday quantities, absolute frequencies and inverse problems. Changes use a
whole-number start and a natural-number amount. General negative-number
multiplication, other number systems and prime factorization are not lessons in
this package. Everyday fractions are restricted to familiar halves and quarters;
decimal notation is taught for money and length.

Grade 6 includes fraction meanings and representations, decimal places through
thousandths, conversions to percentages, positive fraction and decimal
arithmetic, rational-number representations and changes, quadrilaterals and
solid models, surfaces and volumes of cuboids, data and the arithmetic mean,
and inverse volume problems. Fraction division is by a positive natural number.
Negative repeated changes use natural step counts. General sign rules for two
negative factors, percentage algorithms, areas of triangles and parallelograms,
and volumes of other prisms belong to later grades. Circle-sector calculations
were removed from the circle-geometry lesson `ge-3-kreis`. The representation
lesson `rz-9-darstellungen` still uses sector angles to visualize fractions and
percentages in pie charts. Filling tasks use familiar fractions rather than
percentage algorithms.

Rows marked `supported` state what the app provides and what stays in class:
physical measurement and construction, making and folding models, building with
real cubes, pouring to measure volume, joint surveys, learner-authored stories,
and presentations. The app does not claim to complete these activities itself.
Teacher videos are reserved for the separate video step in the package standard.

## Existing histories

The checked ZAM source is `zam-os/zam` at
`e6a235f75fe87b9d57af38bd61011027b891492c`. The command

```sh
rg -n 'mittelschule' src/kernel/library/bundled-cells.ts \
  src/kernel/library/math-inventory.json tests/fixtures/curriculum
```

finds no Mittelschule mathematics legacy cells. Both `replaces-de-by.json`
files therefore have empty source and mapping lists, `status: proposal-only`
and `approved: null`. Neither cell declares `replaces` or `retired_items`.
No Realschule, Gymnasium or neighbouring-grade history is moved on the basis of
similar content. There is no migration requiring approval.

## Verification and integration

Each package ports the mathematics reference's checks for finite SVG readouts
on sampled slider grids, concrete witnesses for all lab goals, no completed
goal at the start, handle geometry and 80 generated tasks per lesson and level.
Contract tests pin lesson ids and ULIDs, check both directions of curriculum
coverage, and validate cell links, school bindings and prerequisite acyclicity.
The cell validator additionally installs the cells using the CI-pinned
`zam-core@0.54.0` and applies its answer-choice rejection rules.

Run the package checks with:

```sh
npm ci
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run verify:release
```

At the Academy root:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
```

The registry and Pages loop include both packages. CI discovers them from their
package files and checks their curriculum snapshots and self-contained ZIPs.
The shared registry regression test's former zero-package assumption for the
Mittelschule was adjusted to assert an increase of exactly one when adding its
synthetic GPG package; this preserves the test when real packages are present.
ZAM bundle synchronization follows publication and is outside this Academy PR.

The completed local run passed 34 Vitest tests per package and all 51 shared
catalog/registry tests. Both production builds and ZIP-content checks passed.
The curriculum snapshot checks found all 65 verbatim clauses. The pinned-core
validator installed both cells and accepted their curated distractors.

Browser verification used the built single-file apps over a temporary localhost
server. Every Grade 5 lesson (32) and Grade 6 lesson (35) was selected through the
lesson picker and checked for its heading and valid SVG. The Grade 5 coordinate
lesson verified a quick check, a correct task, a reached lab goal and persistence
after reload. The Grade 6 cube lesson verified an incorrect attempt without
credit, a corrected attempt, the cube count and front/side readouts, a reached
goal and dark mode. Screenshots were saved outside the source tree.

Before opening the PR, both packages were checked again on the branch based on
current `main`. Chrome CUA checks selected every lesson at both levels in light
and dark themes: 128 Grade 5 and 140 Grade 6 lesson states. Each state showed the
lesson heading, a task for the selected level and its SVG, with no `NaN`,
`undefined` or `Infinity` in the rendered main content. Both themes also showed
seven learning-path stages and seven formula tables per package.

The new packages also correct a copied rounding issue: an unspecified one-percent
tolerance could accept the neighbouring cent. Default checking now respects the
requested decimal rounding, with regression cases for positive and negative
halfway values. The Grade 6 volume tasks use integral bottle counts and German
number formatting in their worked solutions.

The review follow-up aligns the multiplication and prism worked solutions with
their questions and keeps the fraction-addition answer in the requested improper
fraction form. Related fraction explanations, speech text and distractors were
also clarified. The Grade 6 reducing-fractions lesson now explains the greatest
common divisor without claiming it was taught in Grade 5; the oblique-drawing
comment likewise states only the construction rule. Public ids and slugs remain
unchanged, as checked by the package contract tests.

After these corrections, the package commands above passed again (34 tests per
package), as did all 51 shared tests and the pinned-core cell/distractor check.
The rebuilt Grade 6 reducing-fractions lesson was opened in Chrome via CUA: its
new explanation and fraction lab rendered in dark mode.
