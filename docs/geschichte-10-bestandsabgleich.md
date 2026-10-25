# Geschichte 10 · Lehrplanabgleich und Zuordnung der Alt-Zelle

Stand: 25. Oktober 2026. **Thomas hat die Zuordnung der vier alten Karten am 25. Oktober 2026 in zam-os/zam-academy#45 freigegeben** („Ich gebe die Zuordnung 2 A / 0 B / 2 C mit Stilllegung der beiden C-Karten frei.“). Das [Academy-Paket](../geschichte-realschule-10/) erscheint deshalb als Zelle `2026.10.2` mit zwei `replaces` und zwei `retired_items`; `approved` trägt das Datum, `source` den Wortlaut.

## Lehrplan

Geschichte 10 hat in der Realschule **einen gemeinsamen Fachlehrplan** für alle Wahlpflichtfächergruppen ([LehrplanPLUS Realschule Geschichte 10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/geschichte)). Der Text wurde am 25. Oktober 2026 direkt von der Originalseite gelesen. Er hat acht Lernbereiche: 1 Methoden und Arbeitstechniken (ohne Stundenansatz, in allen Bereichen anzuwenden), 2 Nachkriegszeit (ca. 7 Std.), 3 Teilung (ca. 9 Std.), 4 Kalter Krieg, Entspannung und Neuorientierung (ca. 11 Std.), 5 Globale Entwicklungen der Gegenwart (ca. 11 Std.), 6 Migration (Längsschnitt, ca. 5 Std.), 7 Geschichtskultur (Längsschnitt, ca. 5 Std.) und 8 Bilingualer Sachfachunterricht (optional).

Die 41 Kompetenzerwartungen stehen wörtlich in [`coverage.json`](../geschichte-realschule-10/coverage.json), jede mit ihren Lektionen. Die Grundlegenden Daten und Begriffe der Lernbereiche 2 bis 7 (41 Einträge) zeigt die App unter „Nachschlagen“ mit Erklärung und Lektion; ein Test gleicht sie mit dem Lehrplantext ab.

**Nachbarjahrgänge:** Geschichte 9 endet mit Nationalsozialismus, Krieg und Holocaust; Geschichte 10 knüpft daran an (Potsdam, Entnazifizierung, Umgang mit der NS-Vergangenheit, Novemberpogrome als Gedenktag) und wiederholt diese Inhalte nicht. Die Längsschnitte greifen Begriffe früherer Jahre auf und kennzeichnen sie: Judentum (Klasse 6 und 7), Stadtrecht und Absolutismus (Klasse 7), Soziale Frage (Klasse 8); das wurde an den Fachlehrplänen 6, 7 und 8 geprüft.

## Fachliche Entscheidungen und Prüfpunkte

- **Entkolonialisierung:** Der Plan verlangt „ein Beispiel“. Der Kernpfad nutzt Algerien (französische Perspektive, Folgen in Algerien und Frankreich), die englische Vertiefung Indien, wie im Lehrplan für LB 8 vorgeschlagen. So doppeln sich die Beispiele nicht.
- **Kuba-Krise 1961/62:** Der Plan datiert die Krise auf 1961/62; die Lektion erklärt das mit der Schweinebucht 1961 und der Raketenkrise 1962.
- **Nahostkonflikt:** zwei Lektionen (Wurzeln bis 1949; seit 1967). Sie nennen beide Erinnerungen an 1948 (Unabhängigkeit und Nakba), die Flucht von Juden aus arabischen Ländern, Terror und Besatzung, den 7. Oktober 2023 und den Gaza-Krieg sowie Deutschlands besondere Verantwortung. Fachprüfer sollten Ausgewogenheit und Wortwahl gegenlesen.
- **Gegenwart:** Lektionen zu Ukraine und Nahost tragen den Stand Oktober 2026 und fordern auf, aktuelle Nachrichten zu prüfen. Opferzahlen laufender Kriege werden nur als Größenordnung genannt.
- **Zahlen in Werkstätten** stammen aus LeMO (Stiftung Haus der Geschichte): Flüchtlinge 1946/1950, Flucht aus der DDR bis 1961, ausländische Arbeitnehmer 1960–1973, Leipziger Montagsdemonstrationen, Treuhand-Bilanz. Vertriebene in Bayern 1949 (rund 1,9 Millionen, etwa 21 Prozent) nach German History in Documents and Images.
- **Originaltext:** Die Präambel der Bayerischen Verfassung wurde gegen gesetze-bayern.de geprüft; Art. 2, 70, 74 und 100 ebenso.
- **Quellen:** 108 Quellen in `src/curriculum/sources.ts`; am 25.10.2026 antworteten 107 mit HTTP 200. UNHCR lehnt Skriptabrufe ab (403); die verlinkte Seite „Global Trends 2024“ existiert.

## Die vier alten Karten

Die Teilzelle `de-by:realschule-10-geschichte-kalter-krieg-teilung-wiedervereinigung` (Version `2026.08.1`, zwei Atome, vier Karten) ist in ZAM gebündelt. Ihr bytegleicher [Snapshot](../geschichte-realschule-10/tests/fixtures/de-by-realschule-10-geschichte-kalter-krieg-teilung-wiedervereinigung-kvt.json) stammt aus `zam-os/zam` Commit `b2bd246ec9ebb2cfde01e93d0c0dcf9d33024ba9` (SHA-256 `ecba7fe3…35e8ff`). Die Alt-Zelle nennt Geschichte 10 ein Fach der Abschlussprüfung und bindet ihre Atome an „lb1 Blockkonfrontation“ und „lb2 Deutschland nach 1945 und Wiedervereinigung“; im Plan ist LB 1 Methoden und die Einheit Teil von LB 4.

| Alte Karte | Bisheriger Abruf | Zuordnung | Nachfolger | Begründung |
| --- | --- | --- | --- | --- |
| `…J01` | Krise 1962 am Rand des Atomkriegs | **A** | `g10-kuba-krise-merken` | Gleicher Einzelabruf; Antwort „Kuba-Krise“, alter Ablenker Suezkrise bleibt |
| `…J02` | Kalter Krieg in vier Teilen (Ideologie, Truman/Marshall, Blöcke, Abschreckung) | **C**, stillgelegt | – | Mehrteilig über mehrere neue Atome; zugespitzte Musterlösung; falsche LB-Bindung |
| `…J03` | Datum des Mauerfalls | **A** | `g10-friedliche-revolution-merken` | Gleicher Einzelabruf; Antwort 9. November 1989, alter Ablenker 3. Oktober 1990 bleibt |
| `…J04` | Teilung bis Einheit in vier Phasen | **C**, stillgelegt | – | Mehrteilig über vier neue Atome; wertende Begriffe („Vasallenstaat“), ungenaue Mauerangabe, falsche LB-Bindung |

Keine **B**-Zeile: Keine alte Gesamtfrage wird mit ganzer Antwort übernommen, weil beide Musterlösungen korrigiert werden müssten. Bei **C** bleiben Karte und Reviews am alten Token.

Bei **A** zieht die vollständige Karte samt Reviews auf genau einen Nachfolger. Die beiden C-Karten stehen in `retired_items` und kommen nicht mehr in die aktive Wiederholung.

## Was geprüft ist

1. `npm test` im Paket: 137 Tests (Lektions-IDs, Inhalte, Werkstätten inklusive „kein Ziel zu Beginn erreicht“, Daten, Fortschritt, Abdeckungsmatrix, Grundbegriffe, Zelle, Vertrag, freigegebenes Mapping).
2. `ZAM_CORE=… node scripts/validate-cells.mjs` mit zam-core 0.54.0: Installation und Auswahlprüfungen aller 159 Karten bestehen.
3. `ZAM_CORE=… node geschichte-realschule-10/scripts/validate-migration.mjs`: zwei Historien ziehen mit allen FSRS-Feldern und acht Reviews unverändert um, zwei alte Karten sind stillgelegt und kommen nicht zurück, wiederholte Installation und Einschreibung sind idempotent, ein Upgrade von `2026.10.1` ohne alte Zelle ändert keine Karte, und Karten auf alter und neuer ID verweigern die automatische Zusammenführung.
4. `node scripts/build-catalog.mjs`: Der Katalogschritt akzeptiert die Zelle, weil `approved` ein Datum trägt und die Zelle genau die dokumentierten Zeilen deklariert.
5. Die gebaute `dist/index.html` wurde in Headless Chrome geöffnet: Lernpfad, Lektionen mit Quelle und Datentabelle, Level 2, Nachschlagen, englische Vertiefungen, helles und dunkles Farbschema; Schnellcheck, Zeitleiste, Zuordnung und Selbsteinschätzung wurden per DevTools-Protokoll bedient, ohne Seitenfehler.
