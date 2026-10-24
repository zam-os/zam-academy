# Französisch 9 Realschule · ZAM Academy

Französisch für die 9. Klasse der bayerischen Realschule (LehrplanPLUS, **Wahlpflichtfächergruppe IIIa**, in der Französisch zweite Fremdsprache ist und Klasse 9 das dritte Lernjahr) als Lernpfad mit Werkstätten, Übungsrunden und eigenen Schreibaufgaben. Live at https://academy.zam-os.org/franzoesisch-realschule-9/. German interface, French content.

## What it teaches

Der Fachlehrplan hat fünf Lernbereiche mit 51 Kompetenzerwartungen. Die 56 Lektionen in sieben Stufen decken alle ab (die Matrix ist [`coverage.json`](coverage.json), jede Zeile mit dem Wortlaut des Plans und den Lektionen dazu). Der Lernpfad ordnet Lernbereich 1.2 (sprachliche Mittel) als Grammatik, dann Wortschatz und Aussprache.

1. **Verstehen und sich mitteilen** (10 Lektionen): Hörtexte erfassen: Strategien und Transkripte; Texte lesen und erschließen; Alltagsgespräche: sich einigen, Vorlieben nennen, begründen; Kurze Vorträge, Beschreibungen und Berichte; Sprachlich richtig schreiben; E-Mails und Briefe: persönlich und formell; Geschichten erzählen: Vergangenheit, Gegenwart, Zukunft; Texte auf Deutsch sinngemäß wiedergeben; Übersetzen: Fallen bei Wort-für-Wort-Gleichungen; Als Sprachmittler im Alltag und auf Reisen
2. **Grammatik** (21 Lektionen): Relativsätze mit qui und que; Relativsätze mit où und Präposition + qui; Den Komparativ des Adjektivs bilden; Den Superlativ des Adjektivs bilden; personne ne und rien ne: Verneinung des Subjekts; Der Artikel bei Ländernamen; Das Pronomen y; Das Pronomen en; Die Frage mit Inversion verstehen; Indirekte Rede und indirekte Fragen; Der Imperativ mit Pronomen; Reflexive Verben im Präsens; Reflexive Verben im passé composé; Unregelmäßige Verben: savoir, boire, croire, dire; devenir, connaître und die Verben auf -ir; Der imparfait: Formen; Der imparfait: Gebrauch; Imparfait oder passé composé?; Der futur simple: Formen; Der futur simple: Gebrauch; Erfüllbare Bedingungen mit si
3. **Wortschatz und Aussprache** (10 Lektionen): Wortschatz: Reisen, Praktikum und Bewerbung; Wortschatz: Musik, Medien und eigene Interessen; Unpersönliche Ausdrücke; Meinungen und Gefühle ausdrücken; venir de und être en train de; Konnektoren: donc, c’est pourquoi, comme, pour und mehr; chaque, chacun, quelques, plusieurs, certains; Umschreiben, Synonyme und Antonyme; Wörter erschließen: Wortfamilie, Präfix und Suffix; Aussprache und Intonation: Liaison, stumme Buchstaben und Hilfsmittel
4. **Frankreich erleben** (4 Lektionen): Reisen innerhalb Frankreichs planen; Paris aus Sicht von Touristen und Einheimischen; Schule und Ausbildung in Frankreich und Bayern; Gespräche über Praktikum, Ferienjob und Gastaufenthalt
5. **Texte und Medien** (3 Lektionen): Bilder, Fotos und Bandes dessinées beschreiben; Rollenspiele für Alltagssituationen vorbereiten; Kreativ schreiben: Geschichten fortführen und gestalten
6. **Lernen lernen** (4 Lektionen): Wortschatz dauerhaft lernen und Strategien nutzen; Sprachen vergleichen: Deutsch, Englisch, Französisch; Hilfsmittel, Quellen und digitale Prüfung nutzen; Fehler erkennen, ordnen und gezielt üben
7. **Themengebiete** (4 Lektionen): Freundschaft; Medien: Vorteile, Nachteile und Regeln; Nachbarländer Frankreichs: Belgien und mehr; Aktuelle Themen: Nachrichten verstehen und einordnen

Every lesson has the same shape:

- a short explanation in four paragraphs with key terms and, where it fits, a **Beispiel**,
- a **Schnellcheck** (one multiple-choice question),
- a **Werkstatt** in one of four forms: **Zuordnen**, **Ordnen**, **Im Text markieren** and **Richtig wählen** (the shell of Deutsch 9 also knows **Kommas setzen**, which no French lesson uses). The check is exact, and after a wrong try the app says what is wrong but never where the solution is,
- a **Textfall**: a short own-written text or conversation worked through in three steps, each checked on its own,
- **Übungsrunden** in the grammar lessons and some others: rounds of three sentences drawn from pools of eight sentences per level; a round counts only when all three are right and the solution stayed shut,
- a **written task** on level 1 (with guiding questions) or level 2 (transfer to a new situation, with hints), compared with an example text and rated by the learner against three criteria. The app never claims to grade it.

A lesson is complete when the quick check is right, the workshop and the text case are solved, two level-1 practice rounds are solved where the lesson has them, and the learner has rated their own text. Progress stays in `localStorage`. French passages in « guillemets » carry `lang="fr"`.

## What it does not claim

The app plays no sound and records no speech. Listening is practised with transcripts, speaking with dialogue templates, role cards and written plans that the learners then carry out with others; pronunciation is explained and points to the listening samples of online dictionaries. Current topics (Lehrplan Themengebiet "aktuelle Themen") and exchange or internship contacts stay a research and classroom task: the lesson trains the method on an invented example. Own texts are compared with a model text and rated by the learner. Statements about France, Paris, the school systems and Belgium are phrased as "typical" and rest on the Stundentafeln, the Lehrplan and general knowledge; a teacher of French should read them before publication. See [`coverage.json`](coverage.json) (`outside_app`) and [`docs/franzoesisch-bestandsabgleich.md`](../docs/franzoesisch-bestandsabgleich.md).

## Keep it with ZAM

The ZAM cell `zam-academy:franzoesisch-realschule-9` ("Französisch 9 Realschule (ZAM Academy)") is `cell.json` in this folder and holds 168 review cards, three per lesson (a quick-check card, a free-answer card and one more point). Each card links to its lesson as `https://academy.zam-os.org/franzoesisch-realschule-9/#lesson=<lesson id>`, and this app opens that lesson. `tests/contract.test.ts` pins the lesson and card ids in `tests/fixtures/public-contract.json`, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer ZAM grades against; the worked example is `sample_solution`. The two curated distractors of every quick-check card are verified in CI with zam-core's own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`): they may not contain the answer, differ from it only by an accent, or give it away by length. The atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 9, Französisch, Gruppe IIIa, Lernbereich) and the stage of the learning path.

The first publication (2026.10.1) is a new cell that replaces and retires nothing. The old partial cell `de-by:realschule-9-franzoesisch-imparfait-futur-objektpronomen` (4 cards) stays active. The mapping with a reason per card is a **proposal** in `replaces-de-by.json` (`"status": "proposal-only"`, `approved: null`, four category C rows, all `keep-active`) and explained in [`docs/franzoesisch-bestandsabgleich.md`](../docs/franzoesisch-bestandsabgleich.md). It becomes a retirement only after Thomas approves it explicitly. A migration check (`scripts/validate-migration.mjs`) follows with that approval.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5198/franzoesisch-realschule-9/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```
