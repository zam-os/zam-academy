# Mathematics 9 Mittelschule

Bavarian Grade 9 mathematics for both Züge of the Mittelschule: the
Regelklasse (Fachlehrplan "Mathematik R9") and the Mittlere-Reife-Klasse
("Mathematik M9"). The app provides 40 lessons; 27 belong to R9, all 40 to M9.
Its ZAM cell contains 80 cards: one lasting rule and one worked transfer
question per lesson. Learner text is German.

| Learning area | Topic | Lessons (R9 / M9) |
| --- | --- | ---: |
| 1 | Prozent- und Zinsrechnung | 5 / 7 |
| 2 | Potenzen | 3 / 3 |
| 3 | Geometrische Figuren, Körper und Lagebeziehungen | 6 / 8 |
| 4 | Flächeninhalt – Vielecke | 2 / 3 |
| 5 | Rauminhalt – Prismen, Pyramiden, Kegel | 3 / 3 |
| 6 | Wahrscheinlichkeiten | 3 / 4 |
| 7 | Gleichungen | 3 / 7 |
| 8 | Funktionale Zusammenhänge | 2 / 5 |

M9 adds the interest factor and rearranging the interest formula, the Thales
circle, oblique pyramids and cones, surfaces of pyramids and cones, two
distinguishable dice, products of sums, fractional equations, linear systems,
pure quadratic equations, and linear and inverse proportional functions with
intersections. The learning path has a "Meine Klasse" selector (R9, M9 or all
lessons); progress, badges and stage celebrations count only the chosen Zug,
and every lesson shows its Züge as chips.

Each lesson has a worked example, key rule, quick check, interactive SVG lab
with three goals, and generated tasks at two levels. Three correct tasks per
level are required in addition to the quick check and the three lab goals.
Level 1 shows the given values and a hint; Level 2 is a word problem in the
style of the final examinations and gets the hint only after a wrong answer.

The [coverage matrix](coverage.json) maps the 29 R9 and 34 M9 verbatim
curriculum clauses, each with its `track`. Rows marked `supported` identify
activities that still need class work: drawing with set square and compass,
handling real models, sketching by hand, posing own questions about real
charts and working in a real spreadsheet. Both live pages are kept
byte-for-byte in `tests/fixtures/curriculum-r9.html` and
`tests/fixtures/curriculum-m9.html`; their SHA-256 and every clause are checked
by `npm run check:curriculum`. The curriculum supplies no hour allocations.
See the [curriculum and legacy audit](../docs/mathematik-mittelschule-9-10-coverage.md).

The shell is adapted from Mathematics 6 Mittelschule (itself derived from the
Mathematics 9 Realschule HTML lesson shell); the Zug selector follows
Mathematics 10 Realschule. The Pythagoras squares and puzzle proof and the
knotted rope lab are ported from Mathematics 9 Realschule; all other labs are
new. Teacher videos are left for the separate video step required by the
package standard.

## Run and verify

```sh
npm ci
npm run dev                 # http://localhost:5236/mathematik-mittelschule-9/
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip         # includes the production build
npm run verify:release
```

The single-file production build is `dist/index.html`. The offline archive is
`release/ZAM-Academy-Mathematik-9-Mittelschule-offline.zip`; extract it and open
the HTML file or a launcher. No server, account or network connection is needed
to learn. Progress and theme use their own browser keys for this grade
(`mathe_ms9_*`). External source links open only when selected; there are no
media embeds or background third-party requests.

Every card lives in [cell.json](cell.json), with its lesson URL as `source_link`.
The cell id is `zam-academy:mathematik-mittelschule-9`. Each atom is bound to the
LehrplanPLUS position of every Zug it serves (ZAM tracks `regelklasse` and
`mittlere-reife-klasse`). Lesson ids, random ULIDs and item slugs are pinned in
`tests/fixtures/public-contract.json`. The [legacy inventory](replaces-de-by.json)
has no history transfers or retirements: the checked ZAM source has no
Mittelschule mathematics cells.

At the Academy root, validate all cells with the CI-pinned core:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
```
