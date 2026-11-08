# Mathematik 11 Gymnasium · ZAM Academy

Mathematik für die 11. Klasse des bayerischen Gymnasiums (LehrplanPLUS) als Lernpfad mit Laboren zum Anfassen. Live at https://academy.zam-os.org/mathematik-gymnasium-11/. German only, like the curriculum it follows. The Gymnasium has no Zweige in Mathematik, so every lesson is for every learner.

## What it teaches

Five stages follow the four Lernbereiche of LehrplanPLUS Mathematik 11; LB 4 has two parts and gets one stage each (28 lessons):

1. **Spezielle Eigenschaften von Funktionen** (LB 1): Funktionstypen im Überblick, Grenzverhalten für x → ±∞ mit dem Streifen um den Grenzwert, Symmetrie rechnerisch prüfen, Verschieben, Strecken und Spiegeln, Reihenfolge von Transformationen, Stetigkeit abschnittsweise definierter Funktionen
2. **Gebrochen-rationale Funktionen** (LB 2): Definitionsmenge, Nullstellen und Linearfaktoren, waagrechte und schräge Asymptoten, Polstellen mit einseitigen Grenzwerten, Graph skizzieren und Term finden, Schnittpunkte über Bruchgleichungen
3. **Bedingte Wahrscheinlichkeit und Unabhängigkeit** (LB 3): P_B(A) in Baumdiagramm, Vierfeldertafel und Einheitsquadrat, Diagnostik mit natürlichen Häufigkeiten, stochastische Unabhängigkeit, Daten kritisch hinterfragen (Stichprobe, Simpson-Paradoxon, Korrelation und Kausalität)
4. **Lokales und globales Differenzieren** (LB 4.1): mittlere Änderungsrate, Differentialquotient mit der h-Methode, Differenzierbarkeit (Betragsfunktion), Graph der Ableitungsfunktion, Potenz-, Faktor- und Summenregel, lokale Änderungsrate im Sachkontext, Tangente und Steigungswinkel
5. **Ganzrationale Funktionen untersuchen** (LB 4.2): strenge Monotonie, Extremstellen mit dem Vorzeichenwechsel von f′, Krümmung und Wendestellen, notwendige und hinreichende Bedingungen, vollständige Untersuchung, Newton-Verfahren

Every lesson has the shape of Mathematik 9 and 10: an explanation with worked example and Merke box, a **Schnellcheck**, a **Labor** (SVG drawing with sliders, draggable points and three Laboraufträge), and **Aufgaben** from two generators, Level 1 guided with a formula hint, Level 2 a transfer task. Notation follows the Gymnasium: D_f and W_f, P_B(A) for conditional probabilities, f′ and f″ for derivatives, lim for limits, the decimal comma and the minus sign −. Progress stays in `localStorage`. Teacher videos are added in a separate, checked step.

`coverage.json` maps all 26 Kompetenzerwartungen (verbatim from `src/curriculum/source.json`) to lessons; the test checks the mapping both ways. `docs/mathematik-gymnasium-11-coverage.md` explains the choices.

## Keep it with ZAM

The ZAM cell `zam-academy:mathematik-gymnasium-11` is `cell.json` in this folder: 84 review cards, one atom per lesson, ids generated as ULIDs. Each card links to its lesson as `https://academy.zam-os.org/mathematik-gymnasium-11/#lesson=<lesson id>`. Formulas are math segments with spoken text, and every card has two curated distractors with reasons that pass zam-core's `checkCandidate` and `checkShownSet`.

zam-os/zam bundles four older cells `de-by:gymnasium-11-mathematik-*` (16 items). `replaces-de-by.json` maps them as a proposal only (`"status": "proposal-only"`, `"approved": null`): 1 A (the sufficient condition f″(x₀) < 0 for a Hochpunkt), 0 B and 15 C that stay active, because Integralrechnung, Ebenen und Abstände and the Binomialverteilung are not part of M11. The cell declares no `replaces` and no `retired_items`. `tests/fixtures/` holds byte-exact snapshots of the four cells, and `scripts/validate-migration.mjs` shows with the pinned zam-core that installing the cell leaves every old history unchanged, rehearses the proposed transfer in a throw-away database and checks that a learner holding cards on both ids makes the install refuse an automatic merge.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5224/mathematik-gymnasium-11/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip in release/ (needs the zip command)
```

Lesson content lives in `src/curriculum/stage-*.ts`, the lab drawings in `src/lab/views-*.ts` (one per stage), the goal witnesses in `tests/witnesses-stage-*.ts`. `tests/labs-tasks.test.ts` walks every lab grid and 80 generated tasks per level and lesson; `tests/contract.test.ts` checks the path, the curriculum mapping, the cell and the mapping proposal.

## Sources

- [LehrplanPLUS Gymnasium, Mathematik 11](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/mathematik), fetched directly on 2026-11-08 (SHA-256 of the page in `src/curriculum/source.json`)
- [LehrplanPLUS Gymnasium, Mathematik 10](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/mathematik) for what learners bring along
