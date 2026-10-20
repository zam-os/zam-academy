# Mathematik 9 Realschule · ZAM Academy

Mathematik für die 9. Klasse der bayerischen Realschule (LehrplanPLUS) als Lernpfad mit Laboren zum Anfassen. Live at https://academy.zam-os.org/mathematik-realschule-9/. German only, like the curriculum it follows.

## What it teaches

Five stages follow the Lernbereiche of LehrplanPLUS Mathematik 9. Each lesson says which Wahlpflichtfächergruppe needs it (Zweig I, Zweig II/III or both), and the learner can filter the path by their own Zweig.

1. **Rechtwinklige Dreiecke** (LB 3 in both Zweige): Satz des Pythagoras mit Puzzle-Beweis, Umkehrung (Knotenschnur), Höhensatz und Kathetensatz am Thaleskreis, Sinus und Kosinus (Leiter an der Wand), Tangens und Steigung in Prozent, trigonometrischer Pythagoras und besondere Winkel am Einheitsviertelkreis
2. **Kreis und Körper** (LB 4 Kreis in both Zweige; LB 5 Raumgeometrie in Zweig I): Kreiszahl π mit abrollendem Rad und archimedischen Vielecken, Kreisfläche (Pizza wird Rechteck), Bogen und Sektor; Zylinder mit Netz und sparsamster Dose, Kegel und Pyramide (dreimal umschütten), Kugel im Zylinder
3. **Systeme linearer Gleichungen** (LB 6 in both Zweige): Gerade als Lösungsmenge, Gleichsetzungs- und Einsetzungsverfahren, Additionsverfahren, die drei Lösungsfälle, Textaufgaben
4. **Quadratische Funktionen und Gleichungen** (LB 7, Zweig I): Scheitelform, Streckfaktor, quadratische Ergänzung mit Algebra-Kacheln, Lösungsformel und Diskriminante, Linearfaktoren, Parabel und Gerade, Extremwertaufgaben
5. **Daten und Zufall** (LB 8 in Zweig I, LB 7 in Zweig II/III): Baumdiagramm und Pfadregeln, Gegenereignis „mindestens einmal“, Vierfeldertafel und bedingte Wahrscheinlichkeit (ein Test mit 1000 Personen), Mittelwert, Median und Quartile, Boxplot

Every one of the 29 lessons has the same shape:

- a short explanation with the lesson's formulas (plain HTML, no LaTeX),
- a **Schnellcheck** (one quick multiple-choice question),
- a **Labor**: an SVG drawing with sliders, draggable points (pointer or arrow keys), readouts and, where chance is involved, seeded simulations, plus **Laboraufträge** that a deterministic check marks as reached,
- **Aufgaben**: randomised tasks with one or more fields, a tolerant checker (decimal comma, fractions, multiples of π, percentages; exact answers where the task wants them exact, both solutions in any order where it says so), hints that name the predicted slip, step tips and a worked solution. Level 1 shows formula and values, Level 2 is a transfer task in words.

A lesson is complete when the quick check is right, every lab goal is reached and three Level-1 tasks are solved. Three Level-2 tasks earn the 🦅 transfer badge. With a Zweig chosen, progress, badges and the stage celebration count only that Zweig's lessons; Zweig II/III has no quadratic functions and no Raumgeometrie in grade 9. Progress stays in `localStorage`.

## Keep it with ZAM

The ZAM cell `zam-academy:mathematik-realschule-9` ("Mathematik 9 Realschule (ZAM Academy)") is `cell.json` in this folder and holds the 97 review cards, one atom per lesson. Each card links to its lesson as `https://academy.zam-os.org/mathematik-realschule-9/#lesson=<lesson id>`, and this app opens that lesson. `tests/mathematik-realschule-9.test.ts` pins the lesson ids and checks that every card in `cell.json` cites an existing one, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer that ZAM grades against; the worked example sits in `sample_solution`, which zam-core keeps for authors and never installs. Formulas are math segments with spoken text, and every minus sign in the cards' own text is `−`. The two curated distractors of every card are checked in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`), so none is outside the length band, already in the question, or indistinguishable from the answer once punctuation is dropped; formula alternatives that differ only by a sign or an operator therefore live in the `fast_check`, whose options are shown as written.

The cell's atoms also carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, Zweig, Lernbereich), so ZAM can offer the cell to a learner at that curriculum position. The test pins the Lernbereich of every lesson family per Zweig.

This cell is meant to be the only home of Realschule 9 mathematics in ZAM. It replaces the five cells `de-by:realschule-9-mathematik-*` that zam-os/zam bundles, so nobody learns the same fact twice. `replaces-de-by.json` is the proposed mapping of their 49 items: 41 **A** (a card of the lesson asks the same fact and carries `replaces`), 4 **B** (a card added to carry the de-by fact) and 4 **C** (no successor: two worked systems with fixed numbers, a worked quadratic completion and a double card of both Kathetensätze, whose facts the lessons' tasks and single cards carry). The test checks that `cell.json` declares exactly those `replaces`, one de-by item per card, because a learner holding a card on both ids would be a merge that ZAM refuses (ADR 2026-08-14 Decision 9). The mapping waits for the project owner's approval (`approved` is `null` until then).

The de-by cells bound two atoms to the wrong Lernbereich: the quadratic functions to LB 5 in Zweig II/III (they are Zweig I only, LB 7), and Daten und Zufall to LB 6 in Zweig II/III (it is LB 7 there). This cell uses the Lernbereiche of the current LehrplanPLUS.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5183/mathematik-realschule-9/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```

Lesson content lives in `src/curriculum/stage-*.ts`; the lab engine and drawings in `src/lab/` (one `views-*.ts` per stage), the exercise checker and number formatting in `src/exercises/`. Adding a lesson means: a new entry in its stage file (id, explanation, quiz, lab, two exercise generators), its lab view, a goal witness in `tests/witnesses.ts`, and cards in `cell.json`.

## Sources

- [LehrplanPLUS Realschule, Mathematik 9, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/mathematik/wpfg1)
- [LehrplanPLUS Realschule, Mathematik 9, Wahlpflichtfächergruppen II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/mathematik/wpfg2-3)
