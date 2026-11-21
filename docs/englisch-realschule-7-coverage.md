# Englisch 7 Realschule (Bayern): Lehrplan, Umfang und Kartenbestand

Stand: 21. November 2026. Das Paket (Paketversion `0.0` laut [`englisch-realschule-7/publication.json`](../englisch-realschule-7/publication.json), ohne Lehrkraftprüfung) umfasst 45 Lektionen in 9 Etappen mit 45 Atomen und 135 ZAM-Wiederholungskarten (`zam-academy:englisch-realschule-7`).

## Offizielle Grundlage und Nachbarjahrgänge

- **Jahrgangsstufe 7:** [LehrplanPLUS Realschule Englisch 7](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/englisch), live abgerufen am 21.11.2026 (`curl` mit Browser-User-Agent), gesichert in [`englisch-realschule-7/tests/fixtures/lehrplanplus-e7.html`](../englisch-realschule-7/tests/fixtures/lehrplanplus-e7.html) (`SHA-256: 7540b982b36116b2bcb0f3284a12b6e8cb4903ebafb47b008d32fa85f2b0dbcc`, identisch mit dem Abruf von Englisch 6 am 17.11.2026). Es gibt einen gemeinsamen Fachlehrplan für alle Wahlpflichtfächergruppen.
- **Vorjahr Jahrgangsstufe 6:** `lehrplanplus-e6.html` (`SHA-256: 2c303039abfabcfd1203cf32b1d06bb46c5fed805ec7d3bca4bed392d2c019c1`). Klasse 7 baut auf dem Present Perfect Simple der Klasse 6 auf (jetzt Kontrast zum Simple Past, since/for) und auf den Wegbeschreibungen (jetzt detailliert, in der Touristeninformation).
- **Folgejahr Jahrgangsstufe 8:** `lehrplanplus-e8.html` (`SHA-256: 72038cddc11960aba09b08d961ed641dc68a1f2a2e6d72e401945e687f80d342`). **Bewusst ausgeschlossen** bleiben Passiv und personal passive, if-clauses Typ 3, reflexive und emphatische Pronomen, each other, subject/object und negative questions, Partizipialkonstruktionen sowie Nordamerika als Länderschwerpunkt. Verben mit zwei Objekten übt das Paket so, wie die Wortschatzliste der Klasse 7 sie nennt („chunks: common verbs with two objects, e. g. to give“): beide Wortstellungen (give sb sth / give sth to sb, buy/make sth for sb) als feste Muster; als Grammatikthema folgen sie in Klasse 8. Kein Aufgabentext, keine Kurzaufgabe, keine Quizoption, kein Werkstattziel und keine Karte verlangt ein Passiv; Lesetexte dürfen es rezeptiv enthalten (z. B. „was crowned“). Der Test `keeps the Grade 7 grammar boundary clear of Grade 8 topics` sucht dafür sowohl die Begriffe als auch die Konstruktion be + Partizip in allen produktiven Teilen und Karten.

Die 63 Zeilen in [`englisch-realschule-7/coverage.json`](../englisch-realschule-7/coverage.json) enthalten alle Kompetenzerwartungen, jede aufgeführte Wortschatz- und Grammatikstruktur als eigene Zeile und die sieben Themengebiete mit Stundenangabe. `node scripts/check-curriculum.mjs` prüft alle drei HTML-Hashes und sucht jede Zeile wörtlich im bereinigten Seitentext: `ok: 63 curriculum rows, 0 not found`. Die Seite enthält an zwei Stellen das Artefakt `[/lang]`; die Zeilen übernehmen es wörtlich.

## Abdeckung nach Etappen

| Etappe | Lektionen | Inhalt |
| --- | ---: | --- |
| Highlights of British & Irish history (`ca. 25 Std.`) | 5 | Kelten, Römer (AD 43, Hadrianswall AD 122), Angelsachsen und Wikinger (Old English), Normannen 1066 (Domesday Book, pig/pork), Große Hungersnot 1845 bis etwa 1852 und Auswanderung nach Quebec, Boston und New York |
| Ireland: Part of Europe (`ca. 25 Std.`) | 6 | Republik und Nordirland, Irish, Gaelic games, Musik, St Patrick's Day, Wirtschaft (EU seit 1973, Euro), Politik (President, Taoiseach, Good Friday Agreement 1998), Touristeninformation Dublin, Broschüre Cliffs of Moher mitteln |
| Youth culture (`ca. 20 Std.`) | 4 | Musik, Film, Theater (Hip-Hop, Punk), Sport und Mode (Skateboarding, second-hand), Interview, short talk |
| School life (`ca. 10 Std.`) | 2 | state/private/„public“/boarding schools, Vielfalt |
| Life in the USA (`ca. 17 Std.`) | 4 | Familie und Zuhause, Feste und Essen, Einkaufen mit sales tax, Unterhaltungsindustrie und Sport |
| Teen literature (`ca. 10 Std.`) | 3 | Stevenson, Conan Doyle, Dahl, Rowling; Hörbuch, Graphic Novel, Verfilmung, Tagebucheintrag |
| Grammar I | 5 | who/which/that, whose/where, contact clauses, adverbs of manner, question tags |
| Grammar II | 7 | Simple Past vs. Present Perfect, Present Perfect Progressive (since/for), Past Perfect, must/have to, mustn't/needn't, ought to/might, if-clauses Typ 0/1 und Typ 2 |
| Words, sounds & strategies | 9 | Umschreiben und propword one, zwei Objekte, Kollokationen und Wendungen, phrasal verbs, to-infinitive/-ing, Wortbildung mit Konversion, Wörterbuch und Fachbegriffe, Aussprache, Briefe/E-Mails/Formulare, Fehlerprotokoll, mündliche Sprachmittlung |

### Was in der App stattfindet und was im Unterricht bleibt

- `implemented` (44 Zeilen): Lese- und Gebrauchstexte, Lesetechniken, Schreiben persönlicher Briefe, E-Mails, Geschichten und Formulare mit Mustervergleich, schriftliche Sprachmittlung, der gesamte Wortschatz- und Grammatikkanon der Klasse 7 und das landeskundliche Wissen zu Großbritannien, Irland und den USA.
- `supported` (19 Zeilen): Natürliches Hören und Hörsehen, freies Sprechen und Präsentieren vor Publikum, Aussprache, spontanes mündliches Mitteln, eine ganze Klassenlektüre, eigene Recherche sowie Szenen und Standbilder bleiben im Unterricht. Die App liefert Skripte (lokale Computerstimme oder Partner), Redemittel, Stichwortkarten, Strategien und geprüfte Links.

### Zahlen, Beispiele und Quellen

- Personen, Schulen, Briefe, Umfragen und Grafiken (Klasse 7c, Berufe der Eltern in Cork) sind eigene Übungsbeispiele und als erfundene Werte gekennzeichnet; aktuelle Wirtschaftszahlen werden nicht behauptet, die Aufgabe verweist auf die EU-Länderseite und gov.ie. Der sales-tax-Regler nennt nur Beispielsätze.
- Historische und landeskundliche Fakten (z. B. Hungersnot 1845 bis 1852 mit rund einer Million Toten und über einer Million Auswanderern, EG-Beitritt 1973, Good Friday Agreement 10. April 1998, Irish als erste Amtssprache, Shannon als längster Fluss, Höhe der Cliffs of Moher 214 m, fünf US-Staaten ohne statewide sales tax, Treasure Island 1883, Holmes zuerst 1887, Harry Potter 1997, Roald Dahl 1916 in Llandaff) wurden am 21.11.2026 im Wikipedia-Quelltext der verlinkten Artikel nachgelesen.
- Alle 46 Quellenlinks in [`outline.json`](../englisch-realschule-7/src/curriculum/outline.json) wurden am 21.11.2026 per `curl -sL -A "Mozilla/5.0"` geöffnet und mit ihrem echten `<title>` gespeichert. Project Gutenberg antwortete mit `503 Temporarily Down for Maintenance` und wird deshalb nicht verlinkt; die Literaturlektionen verweisen auf die Wikipedia-Artikel.
- Die Lernskizzen (Römisches Britannien, Irland, Dublin, Nordatlantik) sind nicht maßstäblich; ein Test prüft, dass jeder Ortspunkt im richtigen Gebiet liegt, Belfast nördlich von Dublin und Cork, die Spire nördlich der Liffey und Trinity College auf dem Weg nach Süden links der Route.
- Lehrervideos enthält das Paket nicht (Entscheidung vom 22.10.2026); sie folgen in einem eigenen Schritt.

## Bestandsabgleich alter `de-by`-Karten (`replaces-de-by.json`)

Geprüft wurden die englischen Realschulzellen der Jahrgangsstufen 6 bis 8 in `zam-os/zam` (Commit `7897672c2caa8435c89bf39eac41e1efc75521c2`). Zwei Zellen enthalten Klasse-7-Stoff und liegen bytegleich unter `englisch-realschule-7/tests/fixtures/`:

1. `de-by:realschule-7-englisch-grammatik-tenses` (`tests/fixtures/curriculum/`, noch gebündelt; 8 Karten, `SHA-256: c1378fe282934048ac31a9eacafe318cc338aa9acfb428a7aa6f2c7a190deefd`)
2. `de-by:realschule-6-englisch-grammatik-grundlagen` (inzwischen unter `tests/fixtures/legacy/`, nicht mehr gebündelt; 8 Karten, `SHA-256: 071ddb8c8873995521289549608d07ed6cea671c87c7757ce2358db7b7fc94fa`)

Die Klasse-8-Zelle (`conditional-reported-speech`) behandelt if-clauses Typ 3 und indirekte Rede; beides ist kein Klasse-7-Stoff, sie bleibt bei Englisch 8.

| Altzelle | A (Vorschlag) | B | C keep-active | davon durch Englisch 6 bereits ersetzt |
| --- | ---: | ---: | ---: | ---: |
| `realschule-7-englisch-grammatik-tenses` | 1 | 0 | 7 | davon 3 |
| `realschule-6-englisch-grammatik-grundlagen` | 1 | 0 | 7 | davon 2 |

- **A, `propose-replace-after-approval`:** `J01` der Klasse-7-Zelle (Signalwort für abgeschlossenen Zeitpunkt → Simple Past) → `e7-past-vs-perfect-check`; `J05` der Klasse-6-Zelle (`mustn't` im Gegensatz zu `needn't` → Verbot) → `e7-must-have-to-check`. Beide Nachfolger stellen wörtlich dieselbe Frage; Antwort und binäre Auswahl sind inhaltsgleich, nicht wortgleich (z. B. alt „Das Past Simple (einfache Vergangenheit …)“, neu „das Simple Past (Past Simple)“). Ein Test und `validate-cell.mjs` prüfen die wörtlich gleiche Frage. Beide Karten führt auch das freigegebene Mapping von Englisch 6, dort als `keep-active`; jede A-Zeile trägt deshalb eine `open_question`.
- **C, `keep-active`:** die mehrteiligen Sammelabrufe (`J02`, `J04`, `J06`, `J08` der Klasse-7-Zelle; `J06` der Klasse-6-Zelle) und Klasse-5/6-Stoff der Klasse-6-Zelle (`J01`, `J02`, `J04`, `J08`). Kein Nachfolger enthält den ganzen Abruf, eine Lernhistorie wird nicht auf mehrere Karten verteilt.
- **C, `keep-active` mit `neighbour_successor`:** fünf Karten, die der freigegebene Abgleich von Englisch 6 (19.11.2026) bereits ersetzt; dieses Paket übernimmt und deklariert nichts. Es verwendet nur die Aktionen aus AGENTS.md §6. Ein Test liest die Mapping-Datei von Englisch 6 und prüft, dass `neighbour_successor` genau dort steht, wo Englisch 6 ersetzt.

Nach der Standardregel (Entscheidung vom 22.10.2026) erscheint die Zelle zuerst ohne `replaces` und `retired_items`. `scripts/validate-cell.mjs` installiert beide Altzellen mit 16 Karten und 32 Bewertungen, dann die neue Zelle zweimal und alle 135 Karten: Kein alter Karteneintrag und keine Bewertung ändert sich, und eine Wiederholung ist idempotent.

**Offene Fragen an Thomas:** (1) Freigabe der zwei A-Übertragungen. (2) Beide A-Karten stehen auch im freigegebenen Mapping von Englisch 6 (`keep-active`): `…E7T…J01` aus der Klasse-7-Zelle und `…E6G…J05` aus der Klasse-6-Zelle, die zam-os/zam nicht mehr bündelt. Nach AGENTS.md §6 übernimmt nur ein Paket eine Karte; welches Paket die Historie bekommt, entscheidet Thomas.

Die 180 Ids der Zelle (45 Atome, 135 Karten) hat ein ULID-Generator in einem einmaligen Skript außerhalb des Repos gezogen: Zeitstempel in Millisekunden plus 80 Zufallsbits aus `os.urandom`. Innerhalb derselben Millisekunde zählt er den Zufallsteil monoton um 1 hoch (monotone ULID-Fabrik). Deshalb laufen die Ids fortlaufend und teilen ein Präfix.

## Nachweise

- Paket: `npx tsc --noEmit`, `npm test` (`63 curriculum rows, 0 not found` und Vitest `171 passed`, nach dem Review erneut), `npm run build`, `npm run package:zip` (`verify-release`: ZIP mit identischem HTML und drei Startern).
- Zelle mit `zam-core@0.54.0`: `node scripts/validate-cell.mjs` und am Stamm `node scripts/validate-cells.mjs` (`135 items`, ok).
- Browser: `node scripts/verify-browser.mjs` mit Headless Chrome über alle 45 Lektionen, beide Stufen, helles und dunkles Thema (180 Ansichten), alle 135 Ziele, Explorer, Kartenebenen, Quiz, Kurzaufgaben, Mustervergleich, Reload-Persistenz, Hinweis „Wo bleibt mein Text?“, Breiten 390 und 720 px, keine Laufzeitfehler, keine Netzwerkanfragen.

## Offen

- Fachliche Durchsicht durch eine Realschullehrkraft der Jahrgangsstufe 7 und geprüfte Lehrervideos (eigener Schritt).
- Freigabe oder Ablehnung des Kartenvorschlags durch Thomas.
