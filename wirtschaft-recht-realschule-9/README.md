# Wirtschaft und Recht 9 Realschule · ZAM Academy

Wirtschaft und Recht für die 9. Klasse der bayerischen Realschule (LehrplanPLUS, Wahlpflichtfächergruppen I und III) als Lernpfad mit Fällen, Modellen zum Ausprobieren und eigenen Begründungen. Live at https://academy.zam-os.org/wirtschaft-recht-realschule-9/. German, with four optional English lessons for the bilingual Lernbereich.

## What it teaches

Four Lernbereiche follow the Fachlehrplan WR 9 (I/III). Each has its own colour in the app, and every one of the 46 core lessons covers one or two of the Lehrplan's 37 competence expectations (the matrix is [`coverage.json`](coverage.json)).

1. **Berufliche Orientierung** (LB 1, 12 h): Arbeit und Arbeitsmarkt, Formen der Arbeitslosigkeit, Bundesagentur für Arbeit; Aus- und Weiterbildung, Berufswahl mit einer Nutzwertanalyse zum Ausprobieren, Bewerbung und Auswahlverfahren, Berufsausbildungsvertrag und Jugendarbeitsschutz
2. **Wirtschaften in der Sozialen Marktwirtschaft** (LB 2, 11 h): ökonomisches Prinzip, Angebot und Nachfrage mit einem Marktdiagramm zum Verschieben, einfacher Wirtschaftskreislauf, Freie und Soziale Marktwirtschaft, Sozialversicherung, Solidarprinzip und Generationenvertrag in Zahlen
3. **Verbraucherschutz** (LB 3, 12 h): Verbraucherinformationen, nachhaltiger Konsum, Verbraucherschutz und seine Einrichtungen, Geldanlage mit Zinseszins, Kredite mit Kostenrechner, Überschuldung, Zahlungsverkehr, E-Commerce, Social Media
4. **Grundzüge des Rechts** (LB 4, 21 h): Rechtsordnung, Geschäftsfähigkeit, Arbeit mit Gesetzestexten, Jugendschutz; Besitz und Eigentum, Kaufvertrag, Verzug und Sachmängel; Strafrecht von der Strafbarkeit über das Strafverfahren bis zum Jugendstrafrecht
5. **Business English** (optional): vier englische Lektionen zu Arbeit, Bewerbung, Angebot und Nachfrage und sozialen Sicherungssystemen. Sie zählen nicht zu den Kernlektionen.

Every lesson has the same shape:

- a short explanation in three or four paragraphs, with key terms and, where it fits, a note "Im Gesetz" that states the rule in its own words and links to the statute on gesetze-im-internet.de,
- a **Schnellcheck** (one multiple-choice question),
- a **Labor** in 15 lessons: an interactive model with sliders and choices (market curves, circular flow, generation contract, compound interest, credit costs, capacity to contract, purchase contract, the three steps of criminal liability, youth criminal law) and a few **Laboraufträge** that a deterministic check marks as reached,
- a **Sortierwerkstatt** (assign cases to categories, or put a process into order),
- a **Fall lösen**: a short story solved in three or four steps, each checked on its own, so that the learner practises applying a rule, not only knowing it,
- **Rechnen** in 7 lessons: randomised tasks with a tolerant checker (decimal comma, grouping, units) and a worked solution,
- a **written reasoning** on level 1 (with guiding questions) or level 2 (transfer to a new situation), compared with an example and rated by the learner against three criteria. The app never claims to grade it.

A lesson is complete when the quick check is right, every lab assignment is reached, the sorting and the case are solved, three level-1 calculations are solved on their own where the lesson has numbers, and the learner has rated their own reasoning. Progress stays in `localStorage`; the Lernlandkarte shows it per Lernbereich and the app congratulates on a finished lesson or Lernbereich.

## What it does not claim

The Lehrplan asks for a **praxisorientierte Maßnahme** (for example an expert interview or a court visit) in this grade. The app offers a note form for it and keeps its status separate from lesson progress. Laws are stated in the lessons' own words and in the examples' own cases: invented people, no real court decisions, no tariff or contribution figures that can change. The footer says it is a learning aid and not legal advice.

## Keep it with ZAM

The ZAM cell `zam-academy:wirtschaft-recht-realschule-9` ("Wirtschaft und Recht 9 Realschule (ZAM Academy)") is `cell.json` in this folder and holds 150 review cards, two or three per lesson. Each card links to its lesson as `https://academy.zam-os.org/wirtschaft-recht-realschule-9/#lesson=<lesson id>`, and this app opens that lesson. `tests/contract.test.ts` pins the lesson and card ids in `tests/fixtures/public-contract.json`, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer ZAM grades against; the worked example is `sample_solution`, which zam-core keeps for authors and never installs. The two curated distractors of every quick-check card are verified in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`). The cell's atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, track I and III, Lernbereich); the four optional English lessons carry none.

The first publication (2026.10.1) was a new cell that replaced and retired nothing. Version 2026.10.2 moves the review history of three of the old partial cell's eight cards (`de-by:realschule-9-wirtschaft-recht-markt-vertraege`) to their successors with `replaces` and retires the other five with `retired_items`; the mapping with a reason per card is in `replaces-de-by.json` and explained in [`docs/wirtschaft-recht-bestandsabgleich.md`](../docs/wirtschaft-recht-bestandsabgleich.md). Thomas approved the mapping on 22 October 2026 (`approved` is a date, `null` blocks the catalog). `scripts/validate-migration.mjs` proves with the pinned zam-core that histories move unchanged and that two existing histories refuse an automatic merge.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5192/wirtschaft-recht-realschule-9/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```

Lesson content lives in `src/curriculum/lb*.ts` (one file per Lernbereich, typed by `src/model/types.ts`). The models are in `src/labs/` (`engine.ts` is the shared frame; each model has a view, controls, assignments and a witness state that reaches each assignment, which the tests walk through). The numeric task families are in `src/exercises/generators.ts`. `tests/lessons.test.ts` checks every lesson's structure and text rules, `tests/ui.test.ts` plays every lesson through the page to its completion in jsdom, and `tests/engine.test.ts` sweeps the labs and the task generators.

Adding a lesson means: a new entry in its Lernbereich file (id, explanation, quick check, sorting, case, two written tasks, optional lab and practice), a row in `coverage.json`, and its cards in `cell.json`.

## Sources

- [LehrplanPLUS Realschule, Wirtschaft und Recht 9, Wahlpflichtfächergruppen I und III](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/wirtschaft-und-recht/wpfg1-3). The Lehrplan site was not reachable from the authoring environment (access denied); the competence expectations were read from the Internet Archive's copy of 9 June 2026. Reviewers should compare them with the live page.
- Statutes on [gesetze-im-internet.de](https://www.gesetze-im-internet.de/): GG, BGB, BBiG, JArbSchG, JuSchG, StGB, JGG, OWiG, StPO, SGB III, V, VI, VII, XI, PAngV. Each lesson lists the sources it uses.
