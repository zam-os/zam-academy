# Mathematics 6 Mittelschule

Bavarian Grade 6 mathematics, following the common LehrplanPLUS Fachlehrplan.
The app provides 35 lessons and its ZAM cell contains 70 cards: one
lasting rule and one worked transfer question per lesson. Learner text is German.

| Learning area | Topic | Lessons |
| --- | --- | ---: |
| 1 | Bruchzahlen | 13 |
| 2 | Rationale Zahlen | 4 |
| 3 | Geometrische Figuren, Körper und Lagebeziehungen | 7 |
| 4 | Flächeninhalt – Oberflächeninhalt von Quadern | 2 |
| 5 | Rauminhalt – Quader | 5 |
| 6 | Daten | 3 |
| 7 | Gleichungen und Formeln | 1 |

Each lesson has a worked example, key rule, quick check, interactive SVG lab
with three goals, and generated tasks at two levels. Three correct tasks per
level are required in addition to the quick check and the three lab goals.
Level 1 includes a hint; Level 2 applies the method in a different context.

The [coverage matrix](coverage.json) maps 30 verbatim curriculum
clauses. Rows marked `supported` identify activities that still require
classroom work, including measuring, construction and presentation. The live
page is preserved byte-for-byte in `tests/fixtures/curriculum.html`; its SHA-256
and every clause are checked by `npm run check:curriculum`. The curriculum
supplies no hour allocations. See the [curriculum and legacy audit](../docs/mathematik-mittelschule-5-6-coverage.md).

The shell is adapted from Mathematics 5 Realschule, which follows the
Mathematics 9 HTML lesson shell. Fraction and volume models in Grade 6 derive
from Mathematics 6 Realschule. The curriculum selection and supplements are
specific to the Mittelschule. Teacher videos are left for the separate video
step required by the package standard.

## Run and verify

```sh
npm ci
npm run dev                 # http://localhost:5229/mathematik-mittelschule-6/
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip         # includes the production build
npm run verify:release
```

The single-file production build is `dist/index.html`. The offline archive is
`release/ZAM-Academy-Mathematik-6-Mittelschule-offline.zip`; extract it and open
the HTML file or a launcher. No server, account or network connection is needed
to learn. Progress and theme use independent browser keys for this grade.
External source links open only when selected; there are no media embeds or
background third-party requests.

Every card lives in [cell.json](cell.json), with its lesson URL as `source_link`.
The cell id is `zam-academy:mathematik-mittelschule-6`. Its lesson ids, random
ULIDs and item slugs are pinned in `tests/fixtures/public-contract.json`.
The [legacy inventory](replaces-de-by.json) has no history transfers or
retirements: no Grade 5–7 Mittelschule mathematics fixtures exist in the checked
ZAM source. Realschule and Gymnasium histories are not used as substitutes.

At the Academy root, validate all cells with the CI-pinned core:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
```

The packages are registered for the existing Pages pipeline. Building them
locally does not publish them; publishing follows the repository's normal merge
and release process.
