# Englisch 6 Realschule (Bayern): Lehrplan, Umfang und Kartenbestand

Stand: 17. November 2026. Das Paket umfasst 42 Lektionen in 8 Etappen mit 42 Atomen und 126 ZAM-Wiederholungskarten (`zam-academy:englisch-realschule-6`).

## Offizielle Grundlage und Nachbarjahrgänge

- **Jahrgangsstufe 6:** [LehrplanPLUS Realschule Englisch 6](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/englisch), live abgerufen am 17.11.2026, gesichert in [`englisch-realschule-6/tests/fixtures/lehrplanplus-e6.html`](../englisch-realschule-6/tests/fixtures/lehrplanplus-e6.html) (`SHA-256: 2c303039abfabcfd1203cf32b1d06bb46c5fed805ec7d3bca4bed392d2c019c1`). Es gibt einen gemeinsamen Fachlehrplan für alle Wahlpflichtfächergruppen.
- **Vorjahr Jahrgangsstufe 5:** [LehrplanPLUS Realschule Englisch 5](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/englisch), gesichert in `lehrplanplus-e5.html` (`SHA-256: 005af62abb3ffb95da65c171f42a1235ab024745e74f5b9b3b6e128b47830fb3`). Aufbauend auf Klasse 5 (Britische Inseln, Simple Present, Present Progressive, Simple Past, Pronomen) wiederholt Klasse 6 explizit das Simple Past und vertieft Simple vs. Progressive (Gegenwart und Vergangenheit).
- **Folgejahr Jahrgangsstufe 7:** [LehrplanPLUS Realschule Englisch 7](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/englisch), gesichert in `lehrplanplus-e7.html` (`SHA-256: 7540b982b36116b2bcb0f3284a12b6e8cb4903ebafb47b008d32fa85f2b0dbcc`). **Bewusst ausgeschlossen** aus Klasse 6 bleiben die Ziele der 7. Klasse: `defining relative clauses`, `contact clauses`, `adverbs of manner`, `question tags`, `contrast: simple past and present perfect`, `present perfect progressive (with since/for)`, `past perfect simple`, `mustn't / needn't / ought to / might / have to`, `if-clauses` (Typ 0/1/2) sowie der Länderschwerpunkt Irland.

Die 42 Zeilen in [`englisch-realschule-6/coverage.json`](../englisch-realschule-6/coverage.json) dokumentieren alle Kompetenzerwartungen und Themengebiete wortgleich nach Tag-Entfernung und Leerraum-Normalisierung. `node scripts/check-curriculum.mjs` prüft alle drei HTML-Hashes und sucht alle 42 Zeilen im bereinigten Text (`42 curriculum rows, 0 not found`).

## Abdeckung nach Themengebieten (LB 5) und Fertigkeiten

| Bereich | Lektionen | Umfang & Schwerpunkt |
| --- | ---: | --- |
| Erste Einblicke in die USA (`ca. 25 Std.`) | 5 | Bundesstaaten & Metropolen, Wetter/Klima (°F/°C-Umrechner), Stadt vs. Land, Umweltbewusstsein, US-/UK-Bräuche |
| London (`ca. 15 Std.`) | 3 | Kulturelle/ethnische Vielfalt, soziale/wirtschaftliche Lebensbedingungen, Wegbeschreibungen (`along/across/through/by/above`), Fahrkartenkauf |
| Regionen Großbritanniens (`ca. 20 Std.`) | 3 | Schottland (Highlands/Lowlands), Wales/Nordengland/Cornwall, Reise-Webseite sinngemäß auf Deutsch mitteln |
| Alltags- und Freizeitaktivitäten (`ca. 25 Std.`) | 4 | Meinungen (`I think …`), US-Sportarten (`soccer` vs. `football`), Charity & Verabredungen, Alltagssprachmittlung |
| Medien (`ca. 15 Std.`) | 3 | Nutzung/Nutzen/Risiken mit fiktiver Beispielumfrage, Chat vs. höfliche E-Mail (`linking words`), gelenkte Web-Recherche |
| Grammatik I (`LB 1.2`) | 4 | `some`/`any`/`something`/`anybody`, `mine`/`yours`/`hers`, Steigerung (`-er/-est`, `more/most`, `as … as`), `much`/`many`/`a lot of`/`lots of` |
| Grammatik II (`LB 1.2`) | 7 | Simple Past (Wiederholung), Past Progressive mit Zeitstrahl, Simple vs. Progressive (Gegenwart & Vergangenheit), Present Perfect Simple (Form & Gegenwartsbezug), `will`-Future & `going-to`-Future (ohne Kontrast laut Lehrplan) |
| Wortschatz, Aussprache, Text-/Methodenkompetenz & Ganzschrift (`ca. 12 Std.`) | 13 | Wortbildung (`un-`, `-ful`, `-less`, `-y`, `-ing`), Kollokationen/Phrasal Verbs, `to-infinitive`/`-ing`, Classroom Phrases & Fachbegriffe, Lautung & weak/strong stress, Hörtexte, Lesetechniken, Textsorten, Ganzschrift-Auszug, Bildergeschichten, `short talk`, Wortfelder/-familien, eigene Interessen |

### Was in der App stattfindet und was im Unterricht bleibt (`supported` vs. `implemented`)

- `implemented` (19 Zeilen): Leseverstehen von Sachtexten und Gebrauchstexten, Lesetechniken (`skimming`, `scanning`, `gist`, `detail`), Verfassen strukturierter E-Mails, Erlebnisberichte und Bildergeschichten mit Mustervergleich, schriftliche Sprachmittlung, der komplette Wortschatz- und Grammatikkanon Klasse 6 sowie landeskundliches Orientierungswissen zu USA, London und Großbritannien.
- `supported` (23 Zeilen): Natürliche Hör- und Hörsehtexte (z. B. echte Videoclips/Varietäten), freies mündliches Sprechen und Aussprachefeedback, lebendige Dialoge mit Partnern, spontanes mündliches Dolmetschen, das vollständige Lesen einer ganzen Klassenlektüre (Ganzschrift), eigene Live-Webrecherche sowie ein realer Schülervortrag vor der Klasse bleiben Aktivitäten außerhalb der Offline-App; die App liefert hierfür Skripte (mit lokaler Computerstimme oder Partner-Option), Notizkarten-Strukturen, Strategien und geprüfte Quellenlinks.

### Zahlen und Beispiele

- Alle Personen-, Schul- und Umfragebeispiele (`Class 6b Media Guide`) sind eigens verfasste Übungsbeispiele und als solche gekennzeichnet; reale Statistiken werden nicht aus dem Gedächtnis behauptet.
- Die schematischen Lernskizzen (USA, London, Großbritannien, Straßenskizze) sind nicht maßstäblich; alle Ortsmarker liegen mathematisch geprüft innerhalb ihrer Regionenpolygone.
- Alle 21 verlinkten Quellen in [`englisch-realschule-6/source-checks.json`](../englisch-realschule-6/source-checks.json) wurden am 17.11.2026 per `curl` abgerufen (HTTP 200) und mit ihrem echten `<title>` festgehalten.

## Bestandsabgleich alter `de-by`-Karten (`replaces-de-by.json`)

Geprüft wurden beide einschlägigen Bestandszellen in `zam-os/zam` (Commit `e517a1ef709e0e6ee5f968c342affeb5b14cef35`), beide bytegleich unter `englisch-realschule-6/tests/fixtures/` abgelegt:

1. `de-by:realschule-6-englisch-grammatik-grundlagen` (`8` Karten, `SHA-256: 071ddb8c8873995521289549608d07ed6cea671c87c7757ce2358db7b7fc94fa`)
2. `de-by:realschule-7-englisch-grammatik-tenses` (`8` Karten, `SHA-256: c1378fe282934048ac31a9eacafe318cc338aa9acfb428a7aa6f2c7a190deefd`)

| Altzelle | A (Vorschlag) | B | C (`keep-active`) | Begründung |
| --- | ---: | ---: | ---: | --- |
| `de-by:realschule-6-englisch-grammatik-grundlagen` | 3 | 0 | 5 | A: `J01` (3. Person `-s` → `e6-simple-vs-prog-check`), `J03` (`did` + Grundform → `e6-simple-past-rev-check`), `J07` (`mine` → `e6-possessives-check`). C: 3 mehrteilige Synthesen (`J02`, `J04`, `J08`) sowie `J05`/`J06` (`mustn't` / `needn't`, die im LehrplanPLUS erst in Klasse 7 stehen). |
| `de-by:realschule-7-englisch-grammatik-tenses` | 2 | 0 | 6 | 3 von 4 Atomen der alten Klasse-7-Zelle liegen im LehrplanPLUS in **Klasse 6** (Past Progressive, Zukunftsformen, Adjektivsteigerung). A: `J03` (`was/were + -ing` → `e6-past-progressive-check`), `J07` (`good – better – best` → `e6-comparatives-check`). C: `J01`/`J02` (Present Perfect vs. Simple Past gehört zu Klasse 7), `J04`/`J06`/`J08` (mehrteilige Synthesen) sowie `J05` (kontrastiert `going-to` binär gegen `will`, während LehrplanPLUS E6 ausdrücklich „no contrast“ vorschreibt). |

**Status:** [`englisch-realschule-6/replaces-de-by.json`](../englisch-realschule-6/replaces-de-by.json) steht auf `"status": "proposal-only"` und `"approved": null`. Die Zelle `cell.json` deklariert in der Erstveröffentlichung weder `replaces` noch `retired_items`. **Offene Frage an Thomas im PR:** Soll die Nachbarzelle `de-by:realschule-7-englisch-grammatik-tenses` wie in `Physik 11 Gymnasium` in diesem Klasse-6-Abgleich bleiben (da 3 der 4 Themen im LehrplanPLUS in Klasse 6 stehen) oder für das spätere Paket `englisch-realschule-7` zurückgehalten werden?

## Nachweise

- Paketprüfungen in `englisch-realschule-6`: `npx tsc --noEmit`, `npm test` (`check-curriculum.mjs`: 42 rows, 0 not found + Vitest: 163 tests passed), `npm run build`, `npm run package:zip`.
- Zellenprüfung mit `zam-core@0.54.0`: `node scripts/validate-cell.mjs` und am Stamm `node scripts/validate-cells.mjs` sowie `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`.
- Browserprüfung der gebauten `dist/index.html` in Headless Chrome (`node scripts/verify-browser.mjs`) über alle 42 Lektionen auf beiden Stufen im hellen und dunklen Thema, alle 126 Entdeckerziele, Explorer, Kartenebenen, Quiz/Kurzaufgaben/Mustervergleich, Reload-Persistenz und schmale Layouts (390 px, 720 px).

## Offen

- Fachliche Durchsicht durch eine Realschullehrkraft und Ergänzung geprüfter Lehrervideos (eigener Schritt).
- Entscheidung von Thomas über die Freigabe von `replaces-de-by.json` (und Aufnahme von `de-by:realschule-7-englisch-grammatik-tenses`).
