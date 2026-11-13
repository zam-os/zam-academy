# Mathematics 9 and 10 Mittelschule: curriculum and legacy audit

The two packages follow the Bavarian Mittelschule Fachlehrpläne, checked on
2026-11-12. Grade 9 has two Fachlehrpläne, one for the Regelklasse (R9) and one
for the Mittlere-Reife-Klasse (M9). Grade 10 has one Fachlehrplan for the M10
class (Mittlerer Schulabschluss). Learner content is German; this audit
documents the implementation in English.

| Package | Official clauses | Lessons | ZAM cards |
| --- | ---: | ---: | ---: |
| [Grade 9](../mathematik-mittelschule-9/) | 63 (R9 29, M9 34) | 40 (R9 27, M9 40) | 80 |
| [Grade 10](../mathematik-mittelschule-10/) | 32 | 35 | 70 |

The counts come from the package contract tests and the cell atom/item counts.
Each lesson has one atom, one rule card and one worked transfer card. All card
content is maintained in the package's `cell.json`; no card generator or second
card list is committed.

## Official sources and scope

The live pages were downloaded with a browser User-Agent:

- [R9 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/9/mathematik/regelklasse) ("Mathematik R9")
- [M9 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/9/mathematik/mittlere-reife-klasse) ("Mathematik M9")
- [M10 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/10/mathematik) ("Mathematik M10"; the `/mittlere-reife-klasse` address shows the same text)

Their page titles name the Mittelschule, the grade and Mathematics. Grade 9
keeps both pages byte-for-byte in `tests/fixtures/curriculum-r9.html` and
`tests/fixtures/curriculum-m9.html`, grade 10 in `tests/fixtures/curriculum.html`;
each `coverage.json` records the SHA-256 of its pages. The official pages
specify no hour allocations for these learning areas.

`node <app>/scripts/check-curriculum.mjs` checks the hashes and searches every
competence in the whitespace-normalized page text (soft hyphens removed). The
results are "63 verbatim competence rows, 0 not found; both curriculum SHA-256
match" for grade 9 and "32 verbatim competence rows, 0 not found; curriculum
SHA-256 matches" for grade 10. The contract tests check that every clause has a
lesson and every lesson a clause; in grade 9 each row carries its `track`, R9
rows cite only lessons of the Regelklasse, and every lesson of a Zug is cited by
a row of that Zug.

### Grade 9

R9 and M9 have the same eight Lernbereiche. M9 adds the interest factor and
rearranging the interest formula, the Thales circle, oblique pyramids and cones,
surfaces of pyramids and cones, two distinguishable dice, products of sums,
fractional equations, linear systems, pure quadratic equations, and linear and
inverse proportional functions with intersections. Every lesson names its Züge
in `tracks`; the app's "Meine Klasse" selector shows R9, M9 or all lessons and
counts progress for the chosen Zug only. The cell binds every atom to each Zug
it serves (ZAM tracks `regelklasse` and `mittlere-reife-klasse`).

The neighbouring R7, R8 and M8 pages were read to set the boundaries:
percentages, proportional assignments, linear equations and the prism come from
grades 7 and 8 and are repeated only where the grade-9 clauses build on them.
Trigonometry, similarity, the sphere and quadratic functions belong to M10.

### Grade 10

M10 continues M9 with powers and roots with arbitrary exponents and the
logarithm, exponential growth and decay, similar figures with central dilation,
the intercept theorems and the Kathetensatz and Höhensatz, right-angle
trigonometry with the unit circle and the sine function, the sphere and
composite bodies, multi-stage experiments with tree diagrams, path rules and
permutations, and linear and quadratic functions with binomial formulas,
quadratic and fractional equations. Lessons that repeat M9 content say so
("Wiederholung aus M9"). The cell binds no ZAM track, because M10 is a single
class.

Rows marked `supported` state what the app provides and what stays in class:
drawing with set square and compass, handling real models, sketching solids,
trees and graphs by hand, explaining the power and root laws in one's own words,
posing questions about real charts, and working in a real spreadsheet. The apps
do not claim to complete these activities themselves. Teacher videos are
reserved for the separate video step in the package standard.

## Existing histories

The checked ZAM source is `zam-os/zam` at
`ea825d1c1147fcc5f37de5817c2d6a7c05e2f7ed`, the head of `main` on 2026-11-13.
`src/kernel/library/bundled-cells.ts`, `src/kernel/library/math-inventory.json`
and the file names of the repository tree (including
`tests/fixtures/curriculum/`) contain no occurrence of "mittelschule". There
are therefore no Mittelschule mathematics legacy cells. Both
`replaces-de-by.json` files have empty source and mapping lists,
`status: proposal-only` and `approved: null`. Neither cell declares `replaces`
or `retired_items`. No migration needs approval.

The repository does hold Gymnasium and Realschule cells on the same topics, for
example `de-by-gymnasium-10-mathematik-exponential-logarithmus-wachstum` and
`de-by-gymnasium-10-mathematik-trigonometrie-sinus-kosinussatz-bogenmass`.
They follow other curricula and other school types, and their review histories
stay with their own cards. Whether any of them should be mapped to a
Mittelschule successor is Thomas's decision; this proposal maps none.
