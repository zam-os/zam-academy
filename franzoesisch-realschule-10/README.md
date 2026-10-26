# Französisch 10 Realschule · ZAM Academy

Französisch für die 10. Klasse der bayerischen Realschule (LehrplanPLUS, **Wahlpflichtfächergruppe IIIa**, in der Französisch zweite Fremdsprache ist und Klasse 10 das vierte Lernjahr und das Jahr der Abschlussprüfung) als Lernpfad mit Werkstätten, Übungsrunden und eigenen Schreibaufgaben. Live at https://academy.zam-os.org/franzoesisch-realschule-10/. German interface, French content.

## What it teaches

Der Fachlehrplan hat fünf Lernbereiche mit 49 Kompetenzerwartungen. Die 57 Lektionen in sieben Stufen decken alle ab (die Matrix ist [`coverage.json`](coverage.json), jede Zeile mit dem Wortlaut des Plans und den Lektionen dazu). Der Lernpfad ordnet Lernbereich 1.2 (sprachliche Mittel) als Grammatik, dann Wortschatz und Aussprache. Er baut auf [Französisch 9](../franzoesisch-realschule-9/) auf: imparfait, futur simple, die Bedingung Typ I und die Relativpronomen qui, que, où setzt er voraus.

1. **Verstehen und sich mitteilen** (13 Lektionen): Längere Hörtexte global und im Detail verstehen; Texte lesen: Textsorte und Aussageabsicht erkennen; Konflikt- und Dienstleistungsgespräche führen; Eine Kurzpräsentation vorbereiten und halten; Erfahrungen, Träume, Hoffnungen und Pläne beschreiben; Meinungen und Gefühle differenziert ausdrücken; Rechtschreibung: Akzente, Angleichung und gleich klingende Wörter; Strukturwörter und komplexe Sätze; Längere Texte für Forum, Schülerzeitung und Reisebericht; Stellung nehmen: Gründe, Vor- und Nachteile; Französische Texte auf Deutsch sinngemäß wiedergeben; Übersetzen: Wortgleichungen und ihre Grenzen; Als Sprachmittler in Problemsituationen
2. **Grammatik** (12 Lektionen): ne … pas non plus und ne … que; Die Relativpronomen ce qui und ce que; Adverbien auf -ment und unregelmäßige Adverbien; Der conditionnel présent: Formen; Der conditionnel: Wünsche, Bitten und Ratschläge; Nicht erfüllbare Bedingungen: si + imparfait, conditionnel; Die unregelmäßigen Verben courir und recevoir; Die unregelmäßigen Verben suivre und vivre; Wiederholung: Zeiten und Modi, Adjektiv, Objektpronomen, Verneinungen (vier Lektionen zum Überarbeiten eigener Texte)
3. **Wortschatz und Aussprache** (10 Lektionen): Bewerbung und Vorstellungsgespräch; Umweltschutz und soziales Engagement; Berufswünsche und Interessen; Wendungen mit Subjonctif (il faut que tu fasses, je veux que tu viennes, il est important que tu sois); Sois calme! N’aie pas peur!; Das deutsche Passiv französisch wiedergeben; même si, pendant que, alors que; Umschreiben; Präfixe, Suffixe und Wortfamilien; Aussprache mit digitalen Hilfen
4. **Frankreich und Europa** (4 Lektionen): Zeitgeschehen in französischsprachigen Ländern einordnen; Die deutsch-französische Freundschaft und Europa; Herausragende französische Persönlichkeiten; Andere Meinungen respektieren und die eigene prüfen
5. **Texte und Medien** (6 Lektionen): Längere Texte erschließen und Fragen beantworten; Textpassagen zusammenfassen; Rollenspiel; Kreativ schreiben: Chatbeiträge mit Bildern; Formelle Schreiben: Beschwerde, Anfrage, Leserbrief; Argumentieren: Pro und Contra abwägen
6. **Lernen lernen** (6 Lektionen): Vokabelnetze; Sprachvergleich Adjektiv und Adverb; Strategien für Verstehen, Sprechen und Schreiben; Hilfsmittel und Prüfungsvorbereitung; Quellen; Fehlerprotokoll und fiches d’écriture
7. **Themengebiete** (6 Lektionen): Soziales Engagement in Frankreich; Französischsprachige Stars aus Kultur, Sport und Medien; Französische Errungenschaften in Kunst und Wissenschaft; Berufs- und Arbeitswelt in Frankreich; Die Frankophonie; Aktuelle Themen. Das Themengebiet „Deutsch-Französische Freundschaft“ deckt die Lektion dazu in Stufe 4 mit ab.

Every lesson has the same shape as in Französisch 9:

- a short explanation in three or four paragraphs with key terms and, where it fits, a **Beispiel**,
- a **Schnellcheck** (one multiple-choice question),
- a **Werkstatt** in one of four forms: **Zuordnen**, **Ordnen**, **Im Text markieren** and **Richtig wählen**. The check is exact, and after a wrong try the app says what is wrong but never where the solution is,
- a **Textfall**: a short own-written text or conversation worked through in three steps, each checked on its own,
- **Übungsrunden** in the grammar lessons and some others (16 lessons): rounds of three sentences drawn from pools of eight sentences per level; a round counts only when all three are right and the solution stayed shut,
- a **written task** on level 1 (with guiding questions) or level 2 (transfer to a new situation, with hints), compared with an example text and rated by the learner against three criteria. The app never claims to grade it.

A lesson is complete when the quick check is right, the workshop and the text case are solved, two level-1 practice rounds are solved where the lesson has them, and the learner has rated their own text. Progress stays in `localStorage` under its own key. French passages in « guillemets » carry `lang="fr"`.

## What it does not claim

The app plays no sound and records no speech. Listening is practised with transcripts, speaking with dialogue templates, role cards and written plans that the learners then carry out with others; pronunciation is explained and points to the listening samples of online dictionaries. Current topics (Lehrplan Themengebiet „aktuelle Themen“) stay a research and classroom task: the lessons train the method on invented examples. Own texts are compared with a model text and rated by the learner. Statements about people, the Franco-German treaties, the Francophonie and French institutions rest on long-established facts (dates, founders, offices) and name their sources in the lesson; a teacher of French should read them before publication. See [`coverage.json`](coverage.json) (`outside_app`) and [`docs/franzoesisch-10-bestandsabgleich.md`](../docs/franzoesisch-10-bestandsabgleich.md).

## Keep it with ZAM

The ZAM cell `zam-academy:franzoesisch-realschule-10` („Französisch 10 Realschule (ZAM Academy)“) is `cell.json` in this folder and holds 171 review cards, three per lesson (a quick-check card, a free-answer card and one more point). Each card links to its lesson as `https://academy.zam-os.org/franzoesisch-realschule-10/#lesson=<lesson id>`, and this app opens that lesson. `tests/contract.test.ts` pins the lesson and card ids in `tests/fixtures/public-contract.json`, because renaming a lesson breaks every card that cites it.

Each card asks one point. `concept` is the bare answer ZAM grades against; the worked example is `sample_solution`. The two curated distractors of every quick-check card are verified in CI with zam-core’s own `checkCandidate` and `checkShownSet` (`scripts/validate-cells.mjs`). The atoms carry the LehrplanPLUS binding (Realschule, Jahrgangsstufe 10, Französisch, Gruppe IIIa, Lernbereich) and the stage of the learning path, and 30 prerequisite links between lessons.

The first publication (2026.10.1) is a new cell that replaces and retires nothing: ZAM holds no older Französisch 10 cell for the Realschule (only Gymnasium cells), so there is no mapping to approve.

## Develop

```bash
npm ci
npm run dev          # http://localhost:5207/franzoesisch-realschule-10/
npm test
npm run build        # single-file build in dist/index.html
npm run package:zip  # offline zip (Windows/macOS/Linux launchers) in release/
```
