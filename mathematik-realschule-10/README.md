# Mathematik 10 Realschule · ZAM Academy

Mathematik für die 10. Klasse der bayerischen Realschule (LehrplanPLUS) als Lernpfad mit Laboren zum Anfassen, für Zweig I und Zweig II/III. Live at https://academy.zam-os.org/mathematik-realschule-10/. German only, like the curriculum it follows.

## What it teaches

Eight stages follow the Lernbereiche of LehrplanPLUS Mathematik 10. The two Zweige have different Fachlehrpläne: Zweig I has Abbildungen, Potenzfunktionen and Logarithmusfunktionen; Zweig II/III has Raumgeometrie and quadratische Funktionen, which Zweig I learnt in grade 9. Each lesson says which Zweig needs it, and the learner can filter the path by their own Zweig (Zweig I: 34 lessons, Zweig II/III: 25, all: 45).

1. **Trigonometrie am Einheitskreis** (LB 1, both Zweige; 1.5 and 1.6 Zweig I): Sinus, Kosinus und Tangens am Einheitskreis, Vorzeichen, Supplementwinkel und negative Winkel, Steigungs- und Schnittwinkel (m = tan α), Sinusfunktion und periodische Vorgänge, Kosinus- und Tangensfunktion mit Komplementbeziehungen, Additionstheoreme
2. **Trigonometrie in Dreieck und Raum** (LB 1, both Zweige; 2.5 Zweig I): Sinussatz mit dem SsW-Fall, Kosinussatz, Flächeninhalt mit dem Sinus, Berechnungen in Ebene und Raum mit funktionalen Abhängigkeiten, trigonometrische Gleichungen, Trägergraphen und Extremwerte bei variablem Winkel
3. **Vektoren und Abbildungen** (LB 1 Skalarprodukt and LB 2, Zweig I): Vektoren (Wiederholung aus M8/M9), Skalarprodukt, Lot und Abstand, Parallelverschiebung und zentrische Streckung, Achsenspiegelung an einer Ursprungsgeraden, Drehung mit der Drehmatrix, Flächeninhalte mit Determinanten (Wiederholung aus M8), Hintereinanderausführung und Trägergraphen
4. **Potenzen und Potenzfunktionen** (LB 3, Zweig I): rationale Exponenten, n-te Wurzeln, Potenzfunktionen, y = a(x + b)ᶜ + d mit Definitionsmenge, Wertemenge und Asymptoten, Umkehrfunktionen
5. **Exponential- und Logarithmusfunktionen** (LB 4 in Zweig I, LB 3 in Zweig II/III; 5.4 to 5.7 Zweig I): y = k · aˣ, Wachstum und Abklingen, der Logarithmus, Logarithmensätze und Exponentialgleichungen, y = k · aˣ⁻ᵇ + c, Logarithmusfunktionen, Funktionsgraphen abbilden (LB 2)
6. **Raumgeometrie** (LB 2, Zweig II/III): Rotationskörper und Axialschnitte, Netze und Oberflächen, das Prinzip von Cavalieri und Volumen, zusammengesetzte Körper, Extremwerte bei Körpern
7. **Quadratische Funktionen und Gleichungen** (LB 4, Zweig II/III): Parabeln und ihre Parameter, Scheitelpunktsform und allgemeine Form, Parabelgleichungen bestimmen, Extremwertprobleme, Lösungsformel und Diskriminante, Schnittpunkte
8. **Daten und Zufall** (LB 5, both Zweige): mehrstufige Zufallsexperimente mit und ohne Zurücklegen, Pfadregeln für Ereignisse, „Wie oft mindestens“ und Spiele

Every lesson has the shape of Mathematik 9: an explanation with worked example and Merke box, a **Schnellcheck**, a **Labor** (SVG drawing with sliders, draggable points and three Laboraufträge), and **Aufgaben** from at least two generators, Level 1 guided with a formula hint, Level 2 a transfer task in the style of the Abschlussprüfung. Notation follows the ISB Merkhilfe (⊙ for the scalar product, ⊕ for the translation) and writes the Definitions- and Wertemenge as 𝔻 and 𝕎 throughout, so D stays free for the discriminant. Every lesson links a teacher video whose title and channel were checked with YouTube oEmbed (`src/curriculum/teacher-videos.ts`). Progress stays in `localStorage`.

`coverage.json` maps all 46 Kompetenzerwartungen of both Zweige (verbatim) to lessons; the test checks the mapping both ways. `docs/mathematik-10-coverage.md` explains the choices.

## Keep it with ZAM

The ZAM cell `zam-academy:mathematik-realschule-10` is `cell.json` in this folder: 148 review cards, one atom per lesson, ids generated as ULIDs. Each card links to its lesson as `https://academy.zam-os.org/mathematik-realschule-10/#lesson=<lesson id>`. Formulas are math segments with spoken text, every minus sign in card text is `−`, and every card has two curated distractors with reasons that pass zam-core's `checkCandidate` and `checkShownSet`; sign or operator variants of a formula live in the `fast_check` only. The atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 10, Zweig, Lernbereich).

The cell is meant to replace the two cells `de-by:realschule-10-mathematik-ebene-vektorgeometrie` and `de-by:realschule-10-mathematik-exponential-logarithmus` that zam-os/zam bundles. `replaces-de-by.json` maps their 16 items: 7 **A** (same atomic retrieval) and 9 **B** (the whole old multi-part prompt, answer and sample solution kept on one dedicated card; two of them with documented corrections of inaccurate or off-level details), no C. Thomas approved the mapping on 2026-10-22 (the record is in `source`). `tests/fixtures/` holds byte-exact snapshots of both old cells, and `scripts/validate-migration.mjs` proves with the pinned zam-core that every history moves unchanged, the old ids leave active reviews, repeated installs change nothing and a learner holding cards on both ids refuses an automatic merge.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5194/mathematik-realschule-10/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip in release/ (needs the zip command)
```

Lesson content lives in `src/curriculum/stage-*.ts`, the lab drawings in `src/lab/views-*.ts` (one per stage), the goal witnesses in `tests/witnesses-stage-*.ts`, the stage-specific checks in `tests/stage-*.test.ts`. `tests/labs-tasks.test.ts` walks every lab grid and 80 generated tasks per level and lesson; `tests/mathematik-realschule-10.test.ts` checks the path, the Zweige, the coverage matrix, the videos, the cell and the mapping.

## Sources

- [LehrplanPLUS Realschule, Mathematik 10, Wahlpflichtfächergruppe I](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg1) ([snapshot 2024-12-02](https://web.archive.org/web/20241202133144/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg1))
- [LehrplanPLUS Realschule, Mathematik 10, Wahlpflichtfächergruppen II/III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg2-3) ([snapshot 2025-08-08](https://web.archive.org/web/20250808165154/https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/mathematik/wpfg2-3))
