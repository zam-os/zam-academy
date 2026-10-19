# Physik 9 Realschule · ZAM Academy

Physik für die 9. Klasse der bayerischen Realschule (LehrplanPLUS) als interaktives Labor mit Lernpfad. Live at https://academy.zam-os.org/physik-realschule-9/. German only, like the curriculum it follows.

## What it teaches

Four stages follow the Lernbereiche of LehrplanPLUS Physik 9. Each lesson says which Wahlpflichtfächergruppe needs it (Zweig I, Zweig II/III or both), and the learner can filter the path by their own Zweig.

1. **Druck in Flüssigkeiten und Gasen** (LB 1 I, parts of LB 1 II/III): Druck = Kraft / Fläche, hydraulischer Kraftwandler, Schweredruck und Luftdruck, Auftrieb und Archimedes, Boyle-Mariotte
2. **Mechanik und Energie** (LB 1 II/III): Kraftwandler (schiefe Ebene, Hebel, Flaschenzug), Arbeit und Leistung, Energieformen und Energieerhaltung, Wirkungsgrad
3. **Wärmelehre** (LB 2): innere Energie und Kelvin, spezifische Wärmekapazität und Erwärmungsgesetz, Mischungsgesetz, Aggregatzustände, Wärmetransport und Anomalie des Wassers, allgemeine Gasgleichung
4. **Elektrizitätslehre** (LB 3): Elektromagnetismus, Lorentzkraft und Elektromotor, Spannung, Energie und Leistung, Kennlinien und Gesetz von Ohm, Widerstandsgesetz, Halbleiter

Every one of the 21 lessons has the same shape:

- a short explanation with the lesson's formulas (plain HTML, no LaTeX),
- a **Schnellcheck** (one quick multiple-choice question),
- a **Labor**: an SVG simulation with sliders and readouts, plus three **Laboraufträge** that a deterministic check marks as reached,
- **Aufgaben**: randomised numeric tasks with a tolerant checker (German decimal comma, unit shown next to the field) and a worked solution. Level 1 shows formula and values, Level 2 is a transfer task in words.

A lesson is complete when the quick check is right, every lab goal is reached and three Level-1 tasks are solved. Three Level-2 tasks earn the 🦅 transfer badge. With a Zweig chosen, progress, badges and the stage celebration count only that Zweig's lessons. Progress stays in `localStorage`.

## Keep it with ZAM

The ZAM cell `zam-academy:physik-realschule-9` ("Physik 9 Realschule (ZAM Academy)") is `cell.json` in this folder and holds the review cards. Each card links to its lesson as `https://academy.zam-os.org/physik-realschule-9/#lesson=<lesson id>`, and this app opens that lesson. `tests/physik-realschule-9.test.ts` pins the lesson ids and checks that every card in `cell.json` cites an existing one, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer that ZAM grades against; the worked derivation sits in `sample_solution`, which zam-core keeps for authors and never installs. Formulas are math segments with spoken text. The two curated distractors of every card are checked in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`), so none is outside the length band or indistinguishable from the answer once punctuation is dropped; formula alternatives that differ only by an operator therefore live in the `fast_check`, whose options are shown as written.

The cell's atoms also carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, Zweig, Lernbereich), so ZAM can offer the cell to a learner at that curriculum position.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5181/physik-realschule-9/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```

Lesson content lives in `src/curriculum/stage-*.ts`; the lab engine in `src/lab/`, the exercise checker in `src/exercises/`. Adding a lesson means: a new entry in its stage file (id, explanation, quiz, lab, two exercise generators), its lab drawing in `src/lab/visuals.ts`, a goal witness in the test, and cards in `cell.json`.

## Sources

- [LehrplanPLUS Realschule, Physik 9, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/physik/wpfg1)
- [LehrplanPLUS Realschule, Physik 9, Wahlpflichtfächergruppen II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/physik/wpfg2-3)
