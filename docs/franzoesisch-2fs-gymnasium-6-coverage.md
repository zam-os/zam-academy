# Französisch 6 Gymnasium (2. Fremdsprache): Lehrplan und Kartenumzug

Geprüft am 24. November 2026.

## Entscheidung

Thomas am 2026-11-24 in der Claude-Code-Sitzung zu diesem Paket, auf die Frage,
wie das Paket zum vorhandenen 2.-FS-Lernpfad in `franzoesisch-gymnasium-6`
stehen soll: „Pfad herauslösen“. Das Paket ist deshalb kein Neubau, sondern der
bisherige Lernpfad `f6-2-*` aus [`franzoesisch-gymnasium-6`](../franzoesisch-gymnasium-6/),
der in die eigene Atlas-Zelle `franzoesisch-2fs`, Klasse 6, umzieht
([docs/zweite-fremdsprache-atlas.md](zweite-fremdsprache-atlas.md)). Dass ein
neues Paket auf Französisch 5 aufbauen könnte, hat dieselbe Ursache: Die beiden
Lehrpläne sind fast gleich (siehe unten); der vorhandene Pfad wurde schon aus
`franzoesisch-gymnasium-5` übernommen und um den Stoff ergänzt, den nur die
2. Fremdsprache in Klasse 6 verlangt.

`franzoesisch-gymnasium-6` wird in einem eigenen PR zur reinen 1. Fremdsprache
(AGENTS.md, Regel 8). Beide PRs gehören zusammen gemergt: Solange beide Zellen
die 46 Atome enthalten, zeigt der Atlas die Lektionen zweimal, und in ZAM gilt
für Namensraum und Lektionslink der zuletzt installierte Stand.

## Lehrplan und Abgrenzung

- **Ziel-Lehrplan:** [LehrplanPLUS Bayern – Gymnasium – 6 – Französisch (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache), am 24. November 2026 live abgerufen mit `curl -sL --compressed -A "Mozilla/5.0"` (HTTP 200, Titel „LehrplanPLUS - Gymnasium - 6 - Französisch - Fachlehrpläne“).
- **Gespeicherte Seite:** [`franzoesisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-f6-2.html`](../franzoesisch-2fs-gymnasium-6/tests/fixtures/lehrplanplus-f6-2.html), SHA-256 `afd251b30a20cae611ba72d97eb9e2886817038d47358f6bb32063c369e8aefd`. Das ist byte-gleich mit dem Schnappschuss, den `franzoesisch-gymnasium-6` am 20. November 2026 gespeichert hat.
- **Struktur:** ein Fachlehrplan für alle Ausbildungsrichtungen, keine Stunden pro Lernbereich.
- **Matrix:** [`franzoesisch-2fs-gymnasium-6/coverage.json`](../franzoesisch-2fs-gymnasium-6/coverage.json) übernimmt die 47 Zeilen `F2-01`–`F2-47` der bisherigen Matrix unverändert (LB 1: 25, LB 2: 3, LB 3: 5, LB 4: 5, LB 5: 9). Davon sind 19 `implemented` und 28 `supported`. `node scripts/check-curriculum.mjs` meldet `ok: 47 curriculum rows, 0 not found; curriculum, 3 neighbouring snapshots and the source cell snapshot match their SHA-256.` Jede Lektion hat mindestens eine Zeile; es gibt keine `optional_lessons`.

### Stunden und Nachbarlehrpläne

[GSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayGSO-ANL_1) (Titel „GSO: Anlage 1 Stundentafeln für die Jahrgangsstufen 5 bis 11“, am 24. November 2026 abgerufen): Die erste Fremdsprache hat in Jahrgangsstufe 5 fünf Wochenstunden, die zweite Fremdsprache in Jahrgangsstufe 6 vier Wochenstunden.

| Nachbar | Datei | SHA-256 | Verhältnis |
| --- | --- | --- | --- |
| Französisch 5 (1. Fremdsprache) | `lehrplanplus-f5-1.html` | `0f77d44c…78e0d0` | Fast derselbe Stoff, ein Jahr früher und mit fünf statt vier Wochenstunden. Ein zeilenweiser Vergleich der Lehrplantexte findet in der Grammatik vier Zusätze der 2. Fremdsprache: Demonstrativbegleiter, häufige Adjektive mit Stellung, die Verneinung mit *ne … plus / jamais / rien* und direkte Objektpronomen, auch vor dem Infinitiv. Im Wortschatz kommen *j’aimerais, on pourrait* und *pour* + Infinitiv dazu, in den Themen die Wegbeschreibung, bei den Methoden ausdrücklich das Englische (*S‑V‑O, there is/are – il y a*). Die Mengenangabe mit *de* steht in Klasse 5 in der Grammatik, hier im Wortschatz. |
| Französisch 6 (1. Fremdsprache) | `lehrplanplus-f6-1.html` | `98e04b1c…634bf9` | Paralleles zweites Lernjahr. passé composé, Relativsätze, indirekte und betonte Pronomen bleiben dort; ein Test hält sie aus diesem Paket heraus. |
| Französisch 7 (2. Fremdsprache) | `lehrplanplus-f7-2.html` | `e3d18600…2dd4` | Nachfolger, unter anderem mit passé composé und Relativsätzen. |

Alle drei Schnappschüsse sind byte-gleich mit den Seiten, die am 24. November 2026 live abgerufen wurden.

## Was die App umsetzt und was außerhalb bleibt

Jede der 46 Lektionen hat eine Erklärung mit Merke-Kasten, eine Werkstatt mit drei Zielen (keines zu Beginn erreicht, jedes per Test und im Browser erreichbar), einen Schnellcheck mit zwei plausiblen Fehlantworten, zwei Kurzaufgaben und zwei Schreibaufgaben (Level 1 angeleitet, Level 2 Transfer) mit Mustervergleich und Selbsteinschätzung. `supported` sind Hören mit echten Aufnahmen, Sprechen und spontanes Mitteln, Aussprache und Lautschrift, persönlicher Wortschatz, Begegnungen, szenisches Gestalten, Zeichnen, Lehrwerknutzung, Tastatur am eigenen Gerät und aktuelle Anlässe. Die App bereitet diese Bereiche vor, mit lokaler Computerstimme oder Partner, Redemitteln und Musterlösungen. Sie bewertet aber kein Sprechen und nimmt nichts auf.

Gegenüber dem bisherigen Pfad neu:

- eigene Startseite ohne Pfadwahl;
- der Hinweis „Wo bleibt mein Text?“ an jedem Schreibfeld und ein Abschnitt für Eltern und Lehrkräfte unter „Nachschlagen“ (AGENTS.md, Regel 7);
- „Lokalen Fortschritt zurücksetzen“ löscht ausdrücklich auch die Texte.

Inhalt, Werkstätten und Aufgaben sind unverändert.

**Lernstand im Browser:** Das Paket speichert unter `franzoesisch_2fs_gym6_academy_progress_v1`. Solange dort nichts liegt, liest es einmal den Stand von `franzoesisch-gymnasium-6` (`franzoesisch_gym6_academy_progress_v1`, gleicher Ursprung `academy.zam-os.org`) und übernimmt daraus nur die Einträge der eigenen 46 Lektionen. Ein Zurücksetzen entfernt diese Lektionen auch aus dem alten Eintrag; Einträge der 1. Fremdsprache bleiben dort. Beides prüfen `tests/progress.test.ts` und `scripts/verify-browser.mjs`.

## Geprüfte Quellen

[`source-checks.json`](../franzoesisch-2fs-gymnasium-6/source-checks.json) nennt die vier Seiten, die die Lektionen verlinken. Alle antworteten am 24. November 2026 mit HTTP 200 und dem eingetragenen `<title>`: der Lehrplan, die EU-Länderprofile Frankreich und Deutschland (Lektion `f6-2-france`) und Atout France · Bretagne (`f6-2-bretagne`). Die Lektionen nennen keine Fläche oder Einwohnerzahl, sondern lassen sie mit Bezugsjahr in den EU-Profilen nachschlagen. Die Links auf Nantes- und Lyon-Tourismus gehörten zur 1. Fremdsprache und sind hier entfallen. Keine Lehrervideos (AGENTS.md, Abschnitt 4).

## ZAM-Zelle: Umzug ohne Verlaufsübertrag

- **Zelle:** [`franzoesisch-2fs-gymnasium-6/cell.json`](../franzoesisch-2fs-gymnasium-6/cell.json), `zam-academy:franzoesisch-2fs-gymnasium-6`, Version `2026.11.1`: 46 Atome, 138 Karten (46 Tier 1 mit binärem `fast_check`, 92 Tier 2 mit `sample_solution`).
- **Unveränderte Kennungen:** Atom- und Karten-IDs, Slugs, Titel, `domain` und alle Kartentexte sind die aus `zam-academy:franzoesisch-gymnasium-6` Version `2026.11.2`. Davon liegt ein byte-genauer Schnappschuss in [`tests/fixtures/franzoesisch-gymnasium-6-cell-2026.11.2.json`](../franzoesisch-2fs-gymnasium-6/tests/fixtures/franzoesisch-gymnasium-6-cell-2026.11.2.json) (SHA-256 `13b66008…b3f0de`, Commit `b0584783`). Neu sind nur drei Dinge:
  - `namespace` heißt jetzt `zam-academy-franzoesisch-2fs-gymnasium-6`;
  - `source_link` zeigt auf die neue App;
  - die Lehrplanbindung lautet `subject: franzoesisch-2fs` mit `topic_code` `lb1.1-…` bis `lb5`. Bisher war es `subject: franzoesisch` mit dem Präfix `f2-`; die neue Form folgt Thomas' Entscheidung für `englisch-2fs`.

  `tests/content.test.ts` vergleicht jedes Atom und jede Karte mit dem Schnappschuss. `tests/fixtures/public-contract.json` hält die Kennungen fest.
- **Warum kein `replaces`:** zam-core (0.54.0) ordnet Atome keiner Zelle als Besitz zu. Eine Zelle, die vorhandene Atome und Karten mit denselben IDs liefert, aktualisiert sie. Karten und Wiederholungen hängen an der Karten-ID und bleiben deshalb unberührt. Eine neue Revision entsteht nur, wenn sich Titel, Text, `domain`, Bloom-Stufe, Sprache, Tier oder `fast_check` ändern, und all das bleibt gleich. Es gibt daher keinen Verlaufsübertrag, kein `replaces`, keine `retired_items` und kein `replaces-de-by.json`. Die Kollision, an der ein `replaces` scheitern kann (ein Lernender hat Karten auf alter und neuer ID), kann nicht auftreten.
- **Probe:** `ZAM_CORE=… node franzoesisch-2fs-gymnasium-6/scripts/validate-cell.mjs` installiert zuerst den Schnappschuss, lernt alle 138 Karten mit je einer Bewertung und installiert dann diese Zelle und eine Fassung der alten Zelle ohne die 46 Atome, in beiden Reihenfolgen. Karten, Wiederholungen, Inhaltsversionen, Slugs und `deprecated_at` bleiben gleich, `source_link` zeigt auf die neue App, und alle 46 Atome tragen die Bindung `franzoesisch-2fs`. Ausgabe: `ok: 138 studied cards and their 138 reviews keep ids, content versions and state when the cell moves, in both install orders; only the lesson link changes.` Gegenprobe: Mit einer geänderten `domain` an einem Atom schlägt das Skript fehl (`cards and reviews stay untouched`).
- **Grenze:** zam-core ergänzt Lehrplanbindungen nur und löscht keine. Wer die alte Zelle schon installiert hat, behält an diesen Atomen zusätzlich die alte Bindung `franzoesisch`, Klasse 6, `f2-…`. Für neu Lernende gibt es sie nicht. Ob ZAM die alten Bindungen entfernen soll, ist eine Frage an ZAM, nicht an dieses Paket.
- **Alt-Karten (`de-by`):** `franzoesisch-gymnasium-6` hat dafür keine `de-by`-Zelle gefunden. Die zwei genehmigten Übernahmen aus Klasse 7 betreffen nur den Pfad der 1. Fremdsprache und bleiben dort. Dieses Paket übernimmt keine `de-by`-Karte.

## Offene Fragen an Thomas

1. **Fachname `franzoesisch-2fs`** in der Lehrplanbindung, wie bei `englisch-2fs`. ZAM kennt den Namen in seinen Lernpositionen noch nicht.
2. **Gemeinsamer Merge** mit dem PR, der `franzoesisch-gymnasium-6` auf die 1. Fremdsprache reduziert.
