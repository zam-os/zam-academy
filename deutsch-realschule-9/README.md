# Deutsch 9 Realschule · ZAM Academy

Deutsch für die 9. Klasse der bayerischen Realschule (LehrplanPLUS, ein gemeinsamer Fachlehrplan für alle Wahlpflichtfächergruppen) als Lernpfad mit Textwerkstätten, Übungsrunden und eigenen Schreibaufgaben. Live at https://academy.zam-os.org/deutsch-realschule-9/. German only.

## What it teaches

The four Lernbereiche of the Fachlehrplan Deutsch 9 each have their own colour in the app. The 53 lessons cover all 51 competence expectations (the matrix is [`coverage.json`](coverage.json), every row with the plan's own wording and the lessons that teach it).

1. **Sprechen und Zuhören** (LB 1, 11 lessons): aktiv zuhören und reagieren, Hör- und Filmtexte sichern, Vorträge beurteilen, Kommunikationsmodell und Konflikte, präsentieren, überzeugend sprechen, vortragen, berufliche Gespräche, Gesprächsverhalten, Debatte, szenisch gestalten
2. **Lesen und Medien** (LB 2, 16 lessons): Lesestrategien und Texterschließung; Novelle, Drama, Figuren, Zeit und Motive, produktives Lesen, Gesellschaftskritik des 19. und 20. Jahrhunderts, Fantasie und Sehnsucht, Buch und Inszenierung, Leseportfolio; Schaubilder und Karikaturen, Reportage und Kommentar, Information und Meinung, Chancen und Risiken der Mediennutzung, Filmsprache, eigene Medien planen
3. **Schreiben** (LB 3, 13 lessons): Bewerbung, Schaubild, Portfolio, Zitieren, Schreibformen; Stoffsammlung, Eindrücke schildern, kreatives Schreiben, Textwiedergabe, Kommentar; Fehler finden, Texte überarbeiten, Nachschlagen und Prüfprogramme
4. **Sprache untersuchen** (LB 4, 13 lessons): Fachbegriffe und Fremdwörter, diskriminierende Sprache, Sprachebenen, präzises Formulieren; Satzbau (Wiederholung aus Klasse 8), Sätze verknüpfen, Satzstrukturen und ihre Wirkung, Stilmittel, Nominal- und Verbalstil; Rechtschreibstrategien, Fremdwörter schreiben, Zeichensetzung, Gliederungen und Listen

Every lesson has the same shape:

- a short explanation in three or four paragraphs with key terms and, where it fits, a **Beispiel** with its analysis,
- a **Schnellcheck** (one multiple-choice question),
- a **Textwerkstatt**, in one of five forms: **Zuordnen** (24 lessons), **Ordnen** (7), **Im Text markieren** (19: click the passages that show a Stilmittel, a feature of a Textsorte, a sentence structure), **Kommas setzen** (1) and **Richtig wählen** (2). The check is exact, and after a wrong try the app says what is wrong but never where the solution is,
- a **Textfall**: a short own-written text or conversation worked through in three or four steps, each checked on its own,
- **Übungsrunden** in nine lessons (Zeichensetzung, Rechtschreibstrategien, Fremdwörter, Satzverknüpfung, Zitieren, Fehler finden, Nachschlagen, Satzbau, Gliederungen): rounds of three sentences drawn from pools of eight to twelve sentences per level; a round counts only when all three are right and the solution stayed shut,
- a **written task** on level 1 (with guiding questions) or level 2 (transfer to a new situation), compared with an example text and rated by the learner against three criteria. The app never claims to grade it.

A lesson is complete when the quick check is right, the workshop and the text case are solved, two level-1 practice rounds are solved where the lesson has them, and the learner has rated their own text. Progress stays in `localStorage`; the Lernlandkarte shows it per Lernbereich and the app congratulates on a finished lesson or Lernbereich.

## What it does not claim

The app does not check speaking, acting or recordings: the lessons on talks, debates, scenes and media projects prepare them and evaluate them in writing, and the learners carry them out with others ([`coverage.json`](coverage.json), `outside_app`). Own texts are compared with a model text and rated by the learner. Example texts are written for the lessons; quotations from works are public domain, checked against Wikisource or Project Gutenberg and marked with their source. Rules of spelling and punctuation follow the Amtliches Regelwerk in its version of 2024 (in force since 1 July 2024, with the changed rule that Infinitivgruppen are separated by a comma). Tasks are only used where the rule leaves exactly one solution.

## Keep it with ZAM

The ZAM cell `zam-academy:deutsch-realschule-9` ("Deutsch 9 Realschule (ZAM Academy)") is `cell.json` in this folder and holds 159 review cards, three per lesson (a quick-check card, a free-answer card and one more point). Each card links to its lesson as `https://academy.zam-os.org/deutsch-realschule-9/#lesson=<lesson id>`, and this app opens that lesson. `tests/contract.test.ts` pins the lesson and card ids in `tests/fixtures/public-contract.json`, because renaming a lesson breaks every card that cites it.

Each card asks one point, and sentences it talks about stand in the question itself. `concept` is the bare answer ZAM grades against; the worked example is `sample_solution`. The two curated distractors of every quick-check card are verified in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`). The atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, Deutsch, Lernbereich) without a Wahlpflichtfächergruppe, because the Fachlehrplan is the same for all.

This cell is **new**: it replaces and retires nothing, so no learner's history changes when it is published. The old partial cell `de-by:realschule-9-deutsch-argumentation-eroerterung` (4 atoms, 8 cards) stays active in ZAM. The comparison with its eight cards is in [`docs/deutsch-bestandsabgleich.md`](../docs/deutsch-bestandsabgleich.md) and in `replaces-de-by.json` with `approved: null`; none of them has a safely identical successor.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5193/deutsch-realschule-9/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```
