# Physik 7 Gymnasium · ZAM Academy

Physics for Grade 7 at the Bavarian Gymnasium, following LehrplanPLUS. In Grade 7 the Gymnasium has no separate subject Physik: physics is the **Schwerpunkt Physik of Natur und Technik 7** (Lernbereich 1 „Physik in Natur und Technik entdecken“, about 28 hours). The Schwerpunkt Informatik (Lernbereich 2) is not part of this package. Published after merge at https://academy.zam-os.org/physik-gymnasium-7/.

## Learning

Each section of the Fachlehrplan is a stage with its own accent colour:

1. **NT7 1.1 · Magnete und Dichte** (7 lessons): observing and interpreting a model experiment; permanent magnets; the model of Elementarmagnete; orientation with compass and the Earth's magnetic field; density; measuring density with a measuring cylinder; judging materials by their density.
2. **NT7 1.2 · Licht und Schatten** (8): light sources and seeing; colours by reflection and absorption; exploring coloured shadows; rectilinear propagation; core, half and transition shadow; phases of the Moon; solar and lunar eclipses; seeing and being seen.
3. **NT7 1.3 · Ladung und Strom** (6): charge and the nucleus–shell model; frictional electricity; current as moving charges; heating and lighting effect; magnetic effect of current; AND, OR and two-way switching.

Every lesson has an explanation with a worked example („Beispiel: …“) and a key rule, terms for the reference view, a quick check, a workshop (classify or order) and two writing tasks with a comparison answer and three self-assessment criteria (Level 1 with guiding questions, Level 2 as transfer). 20 lessons have a model lab with a drawing, controls and named comparisons; the lesson on heating and lighting has a fixed drawing instead, the lesson on the Earth's field has one in addition to its model. The three density lessons have calculation tasks on two levels; the checker accepts decimal comma and point and recognises typical slips (factor 1000, swapped division).

A lesson is complete after the quick check, the workshop and a self-assessed Level 1 answer, plus all model comparisons and, where present, three calculation tasks solved without the solution. Texts are **not graded automatically**.

## Drawings and colours

- One accent per section (`[data-lb]` in `src/styles.css`): berry for magnets and density, amber for light, blue for current.
- One colour per kind of quantity, the same in every drawing and named in its legend: north pole and positive charge red, south pole green, electrons and negative charge blue, length and volume petrol, force orange, light gold, angle violet, body and mass magenta. Coloured light and body colours appear in their real colour.
- Motion never starts on its own. In a closed circuit and a switched-on circuit, „Bewegung zeigen“ moves the electrons from the minus to the plus pole, only along closed branches.
- The continuous lamp in the shadow lab shades every point of the screen by the share of the lamp the object hides from it, so it never shows a lit gap between two shadows.

`tests/visual.test.ts` checks text alternatives, legends, finite coordinates, the electron paths, the coil's battery and a contrast of at least 4.5 : 1 for text colours in both themes.

## Real experiments

The Fachlehrplan names six Schülerexperimente (permanent magnet, density, colours of lit objects, shadow images, magnetic effect of current, everyday circuits). **Models do not replace them.** The local experiment notebook has a slot for each with question, setup, observations and result; „selbst durchgeführt“ is the learner's own statement. Photos, drawings on paper, internet research and building circuits with circuit software belong in class; [coverage.json](coverage.json) marks those competences `supported`.

No accounts, no telemetry, no external runtime requests. Progress, texts and notes stay in `localStorage` (`physik_gym7_academy_progress_v1`). Sources are plain links. Teacher videos follow as a separate step.

## ZAM and existing cards

`cell.json` is the only place of the **63 cards**: one atom per lesson with two fast cards and one synthesis card, bound to `nt_gym`, grade 7, `lb1.1` to `lb1.3`. Every card cites `#lesson=<id>`; the tests pin all 21 anchors.

`replaces-de-by.json` is a **proposal** (`proposal-only`, not approved) for the 8 cards of the two legacy cells `de-by:gymnasium-7-physik-…`: all C, keep active. The cell declares no `replaces` and no `retired_items`. Byte-exact snapshots are in `tests/fixtures/`.

Details: [docs/physik-gymnasium-7-coverage.md](../docs/physik-gymnasium-7-coverage.md).

## Develop and check

```bash
npm ci
npm run dev          # http://localhost:5266/physik-gymnasium-7/
npm test
npm run typecheck
npm run build
npm run package:zip  # single-file app and offline launchers in release/
```

No dependency beyond those of `physik-gymnasium-11`, whose shell this package takes over.
