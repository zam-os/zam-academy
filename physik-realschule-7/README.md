# Physics 7 Realschule · Group I

A German-language learning package for Bavarian Realschule Grade 7, Wahlpflichtfächergruppe I. The live LehrplanPLUS check of 15 November 2026 covers mechanics (26 curriculum hours), optics (18), and magnetism/electric circuits (12). Physics starts in Grade 8 for the other groups; this package does not claim their Grade 7 scope.

The 24 lessons combine labelled diagrams, worked examples, quick checks, classification or sequence workshops, and written tasks on two levels. Fourteen adjustable models make comparisons visible: measurement, uniform motion, forces, springs, particles, friction, density, light paths/shadows, reflection, refraction, dispersion, lenses, magnetic fields, and circuit logic. Their assumptions and limits are displayed. The lens model handles a subject in the focal plane without inventing an infinite numerical result; the spring model refuses to extrapolate beyond its characterised range. Refraction and friction remain qualitative at this grade.

Six numeric exercise families cover units/length, speed, springs, weight, volume, and density. Level 1 offers guidance; Level 2 changes the question and context. Each numeric lesson requires three independently solved tasks at each level. Revealing an answer consumes that attempt without credit, including across reloads. Written work is explicitly self-assessed, with three criteria and a comparison answer; it is never automatically graded. Opening model comparisons is recorded separately from knowledge checks.

The curriculum requires at least five real pupil experiments, including at least one in each area. A five-slot local notebook supports planning and recording. Filled fields and a learner's own performed flag do not verify performance or scientific quality. Actual experiments, calibration, sketches, independent research and presentations remain classroom work where the coverage matrix says `supported`.

Progress, texts and notes stay in this browser's `localStorage`. When storage is unavailable the app works in memory and explains the limitation. There are no accounts, telemetry, remote fonts, embeds or background requests. Source links open only on a click. Teacher videos remain a separate follow-up under the Academy package standard.

`cell.json` is the sole card list: 24 atoms and 73 practice items, each citing its stable lesson anchor. New atom and item identifiers were generated once with `ulid()`. Three formula answers use structured math segments and German speech. Every official curriculum binding names Grade 7 and track I.

The [approved mapping](replaces-de-by.json) transfers 2 matching mechanics histories. The other 14 cards remain active for existing learners, including the thermal-physics cards. The separate Grade 8 optics cells remain outside this package. See the [coverage and legacy analysis](../docs/physik-realschule-7-coverage.md).

```bash
npm ci
npm run dev          # http://localhost:5252/physik-realschule-7/
npm run typecheck
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs /path/to/frozen-curriculum.html
```

From the repository root, run the catalog/registry tests and `scripts/validate-cells.mjs` with the zam-core version pinned in CI. The package uses the existing physics app dependencies without adding any library. The offline ZIP includes one self-contained HTML app and launchers. The registry and Pages entries prepare publication on a later authorised merge; creating these files publishes nothing.
