# Mathematik 8 Realschule · ZAM Academy

Mathematik für die 8. Klasse der bayerischen Realschule (LehrplanPLUS) als Lernpfad mit Laboren zum Anfassen, für Zweig I und Zweig II/III. Live at https://academy.zam-os.org/mathematik-realschule-8/. German only, like the curriculum it follows.

## What it teaches

Seven stages follow the Lernbereiche of LehrplanPLUS Mathematik 8. The two Zweige have different Fachlehrpläne: Zweig I has the Drehung, symmetric bodies, Axialschnitte, the three-dimensional coordinate system, Ungleichungen and the full chapter on straight lines y = mx + t; Zweig II/III has triangles (existence, constructions, congruence) and Schrägbilder, which Zweig I learnt in grade 7, and meets y = mx + t only in grade 9. Each lesson says which Zweig needs it, and the learner can filter the path by their own Zweig (Zweig I: 36 lessons, Zweig II/III: 28, all: 41).

1. **Dreiecke und Vierecke** (LB 1 in both Zweige; 1.1 to 1.3 Zweig II/III): wann es ein Dreieck gibt, Dreieckskonstruktionen, Kongruenzsätze, das Haus der Vierecke, Vierecke konstruieren, mit Viereckseigenschaften rechnen (Flächen as Wiederholung aus M6)
2. **Drehung** (LB 2, Zweig I): die Drehung als Kongruenzabbildung, Punktspiegelung und Drehsymmetrie, Vektoren um ±90° und 180° drehen
3. **Raumgeometrie** (LB 3 in Zweig I, LB 2 in Zweig II/III): symmetrische Körper, Rotationskörper und Axialschnitte, Punkte und Körper im dreidimensionalen Koordinatensystem (Zweig I); Schrägbilder von Prismen und Pyramiden, Strecken und Winkel in wahrer Größe (Zweig II/III)
4. **Terme und Gleichungen** (LB 4 in Zweig I, LB 3 in Zweig II/III; 4.9 Zweig I): Terme mit mehreren Variablen, Summenterme multiplizieren, binomische Formeln, Faktorisieren, Extremwerte quadratischer Terme mit der quadratischen Ergänzung, Extremwertprobleme, Gleichungen mit Klammern und binomischen Formeln, Text- und Sachaufgaben, Ungleichungen
5. **Bruchterme und Bruchgleichungen** (LB 5 in Zweig I, LB 4 in Zweig II/III): Bruchterme, die Definitionsmenge, Verhältnisgleichungen a/b = c/d
6. **Funktionen** (LB 6 in Zweig I, LB 5 in Zweig II/III; 6.6 to 6.10 Zweig I): Funktion oder nicht, Darstellungsformen, Funktionswerte, Nullstellen, Definitions- und Wertemenge, Ursprungsgeraden y = mx, senkrechte Geraden (m₁ · m₂ = −1), Geraden y = mx + t, Geradengleichungen aus zwei Bestimmungsstücken, Parallelenscharen, lineare Funktionen im Alltag, Flächen mit Determinanten (Wiederholung aus M7)
7. **Daten und Zufall** (LB 7 in Zweig I, LB 6 in Zweig II/III): Ergebnis und Ereignis, Baumdiagramme, Vierfeldertafeln, absolute und relative Häufigkeiten

Every lesson has the shape of Mathematik 9 and 10: an explanation with worked example and Merke box, a **Schnellcheck**, a **Labor** (SVG drawing with sliders, draggable points or simulations and three Laboraufträge) and **Aufgaben** from at least two generators, Level 1 guided with a formula hint, Level 2 a transfer task in the style of the Abschlussprüfung. Grade 8 works over ℚ (the real numbers come in grade 9), without Pythagoras and trigonometry. Teacher videos are added in a separate, checked step (AGENTS.md, section 4); no lesson links one yet. Progress stays in `localStorage`.

`coverage.json` maps all 42 Kompetenzerwartungen of both Zweige (23 in Zweig I, 19 in Zweig II/III, verbatim) to lessons; the test checks the mapping both ways. `docs/mathematik-8-coverage.md` explains the choices.

## Keep it with ZAM

The ZAM cell `zam-academy:mathematik-realschule-8` is `cell.json` in this folder: 141 review cards, one atom per lesson, ids generated as ULIDs. Each card links to its lesson as `https://academy.zam-os.org/mathematik-realschule-8/#lesson=<lesson id>`. Formulas are math segments with spoken text, every minus sign in card text is `−`, and every card has two curated distractors with reasons that pass zam-core's `checkCandidate` and `checkShownSet`. The atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 8, Zweig, Lernbereich) and their prerequisites.

zam-os/zam bundles three older cells for grade 8 (`de-by:realschule-8-mathematik-ebene-geometrie-vierecke`, `…-lineare-funktionen`, `…-terme-gleichungen`, 24 cards). `replaces-de-by.json` maps all 24: 9 **A** (same atomic retrieval), 8 **B** (the whole old multi-part prompt with its answer on one dedicated card) and 7 **C** (no successor here: content of grades 6, 7 and 9, or an incomplete old answer; these cards stay active). Thomas approved the mapping on 2026-10-23 (the record is in `source`), so the 17 A and B successors declare `replaces` from the first publication on; nothing is retired. `tests/fixtures/` holds byte-exact snapshots of the three old cells, and `scripts/validate-migration.mjs` proves with the pinned zam-core that every history moves unchanged, the old ids leave active reviews, the C cards stay untouched, repeated installs change nothing and a learner holding cards on both ids refuses an automatic merge.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5196/mathematik-realschule-8/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip in release/ (needs the zip command)
```

Lesson content lives in `src/curriculum/stage-*.ts`, the lab drawings in `src/lab/views-*.ts` (one per stage), the goal witnesses in `tests/witnesses-stage-*.ts`, the stage-specific checks in `tests/stage-*.test.ts`. `tests/labs-tasks.test.ts` walks every lab grid and 80 generated tasks per level and lesson; `tests/lessons.test.ts` checks the shape and the conventions of every lesson; `tests/mathematik-realschule-8.test.ts` checks the path, the Zweige, the coverage matrix, the cell and the mapping.

## Sources

- [LehrplanPLUS Realschule, Mathematik 8, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg1) ([snapshot 2024-04-13](https://web.archive.org/web/20240413214556/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg1))
- [LehrplanPLUS Realschule, Mathematik 8, Wahlpflichtfächergruppen II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg2-3) ([snapshot 2026-04-18](https://web.archive.org/web/20260418170947/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/mathematik/wpfg2-3))
- Neighbouring grades for the boundaries: Mathematik 5, 6, 7 and 9 of the Realschule (Wayback snapshots from 2025-04-05 to 2026-07-11).
