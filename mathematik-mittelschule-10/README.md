# Mathematics 10 Mittelschule

Bavarian Grade 10 mathematics for the M10 class of the Mittelschule
(Fachlehrplan "Mathematik M10", the year that leads to the Mittlerer
Schulabschluss). The app provides 35 lessons in seven learning areas. Its ZAM
cell contains 70 cards: one lasting rule and one worked transfer question per
lesson. Learner text is German.

| Learning area | Topic | Lessons |
| --- | --- | ---: |
| 1 | Potenzen und Wurzeln | 6 |
| 2 | Exponentialfunktion | 3 |
| 3 | Ähnliche Figuren | 5 |
| 4 | Trigonometrie | 5 |
| 5 | Flächeninhalt und Rauminhalt – Kugeln | 2 |
| 6 | Beschreibende Statistik und Wahrscheinlichkeiten | 4 |
| 7 | Funktionale Zusammenhänge | 10 |

M10 has one Fachlehrplan, so the app has no Zug selector. Lessons build on M9
(powers of ten, interest, Pythagoras, linear functions, fractional and pure
quadratic equations) and say so where they repeat it.

Each lesson has a worked example, key rule, quick check, interactive SVG lab
with three goals, and generated tasks at two levels. Three correct tasks per
level are required in addition to the quick check and the three lab goals.
Level 1 shows the given values and a hint; Level 2 is a word problem in the
style of the final examinations and gets the hint only after a wrong answer.

The [coverage matrix](coverage.json) maps all 32 verbatim curriculum clauses.
Rows marked `supported` identify activities that still need class work:
explaining the power and root laws in one's own words, drawing sketches, trees
and graphs by hand, and working in a real spreadsheet. The live page is kept
byte-for-byte in `tests/fixtures/curriculum.html`; its SHA-256 and every clause
are checked by `npm run check:curriculum`. The curriculum supplies no hour
allocations. See the
[curriculum and legacy audit](../docs/mathematik-mittelschule-9-10-coverage.md).

The shell is adapted from Mathematics 6 Mittelschule (itself derived from the
Mathematics 9 Realschule HTML lesson shell). Ported labs: the Thales circle
with Höhensatz and Kathetensatz, the ladder, the gradient sign, the sphere in
the cylinder, the rapid-test table, the shifted parabola, the completing-square
tiles, the roots and the parabola–line labs from Mathematics 9 Realschule, and
the urn tree and path-rule labs from Mathematics 10 Realschule. All other labs
are new. Teacher videos are left for the separate video step required by the
package standard.

## Run and verify

```sh
npm ci
npm run dev                 # http://localhost:5235/mathematik-mittelschule-10/
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip         # includes the production build
npm run verify:release
```

The single-file production build is `dist/index.html`. The offline archive is
`release/ZAM-Academy-Mathematik-10-Mittelschule-offline.zip`; extract it and open
the HTML file or a launcher. No server, account or network connection is needed
to learn. Progress and theme use their own browser keys for this grade
(`mathe_ms10_*`). External source links open only when selected; there are no
media embeds or background third-party requests.

Every card lives in [cell.json](cell.json), with its lesson URL as `source_link`.
The cell id is `zam-academy:mathematik-mittelschule-10`. Each atom is bound to its
Lernbereich of the M10 Fachlehrplan (no ZAM track). Lesson ids, random ULIDs
and item slugs are pinned in `tests/fixtures/public-contract.json`. The
[legacy inventory](replaces-de-by.json) has no history transfers or
retirements: the checked ZAM source has no Mittelschule mathematics cells.

At the Academy root, validate all cells with the CI-pinned core:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
```
