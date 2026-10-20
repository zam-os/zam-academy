# Geschichte 9 · Realschule Bayern

Ein gemeinsamer Lernpfad für alle Wahlpflichtfächergruppen nach [LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/geschichte), abgeglichen am 20. Oktober 2026. 35 Kernlektionen und vier optionale englische Vertiefungen verbinden Erklärungen, Schnellchecks, Zeitleisten beziehungsweise Zuordnungen und eigene Kurzurteile.

## Lernen und Fortschritt

Jede Lektion hat eine Werkstatt mit prüfbaren Zuordnungen und zwei unterschiedliche Schreibaufgaben. Level 1 bietet Leitfragen. Level 2 verlangt einen Transfer auf eine neue Fragestellung. Eigene Antworten werden **nicht automatisch bewertet**: Erst nach einem eigenen Text öffnet sich eine mögliche Antwort mit drei Vergleichskriterien. Die Lernenden bestätigen ihre Selbsteinschätzung selbst.

Ein Kernabschluss verlangt einen richtigen Schnellcheck, eine gelöste Werkstatt und die Selbsteinschätzung zu Level 1. Level 2 und die englischen Lektionen sind zusätzliche Vertiefungen. Eigene Texte und Fortschritt bleiben ausschließlich in diesem Browser (`geschichte_rs9_academy_progress_v1`). Gesperrter Speicher führt zu einem sichtbaren Hinweis; die Sitzung funktioniert weiter. Es gibt keine Konten, Tracker, externen Schriften oder automatischen Netzabrufe.

Die Übungen verwenden eigens verfasste Darstellungstexte, keine erfundenen Originalquellen. Drei kurze, genau zugeordnete Originalauszüge (Weimarer Verfassung, Otto Wels und Grundgesetz) sowie reale Wahlergebnisse ergänzen die Werkstätten. Perspektiven und Grenzen von Belegen gehören zur Auswertung. Die lokale Recherche und der im Lehrplan vorgesehene begleitete Gedenkstättenbesuch werden vorbereitet und ausgewertet, **müssen aber außerhalb der App durchgeführt werden**. Das Paket ist kein Nachweis einer absolvierten Exkursion. Die englischen Vertiefungen ergänzen den deutschen Kernpfad; sie ersetzen keinen vollständig bilingual erteilten Jahresunterricht.

## Lehrplanabgleich

| Lernbereich | Lektionen | Behandlung |
| --- | ---: | --- |
| 1 · Methoden | 4 | Quellenkritik, Propaganda, Chronologie/Diagramme, lokale Recherche und digitale Medien; Anwendung auch in den folgenden Bereichen |
| 2 · Imperialismus und Erster Weltkrieg | 8 | Motive, kolonialisierte Perspektiven, Herero und Nama, Julikrise, industrielle Kriegführung, Propaganda, 1917, Versailles, Revolution und Bayern |
| 3 · Weimar | 5 | Demokratie und Verfassung, Belastungen, 1923, relative Stabilisierung, Stadt/Land und Frauenwahlrecht, Weltwirtschaftskrise, Entscheidungen beim Scheitern |
| 4 · NS bis 1939 | 6 | Ernennung, Grundrechte und Gesetzgebung, Ideologie und Ausgrenzung, Nürnberger Gesetze/Novemberpogrome, Alltag und Bayern, Außenpolitik |
| 5 · Krieg, Verbrechen und Verantwortung | 6 | Kriegsbeginn, Vernichtungskrieg, Holocaust und weitere Opfergruppen, Lagerfunktionen/Wannsee, Widerstand, Kriegsende Europa/Asien, Gedenken |
| 6 · Jugend im Längsschnitt | 3 | Bildung von Antike bis Kaiserreich, NS-Erziehung und unterschiedliche Erfahrungen, Jugendkulturen und Gegenkultur |
| 7 · Menschenrechte im Längsschnitt | 3 | Ungleichheit, 1776/1789 und Ausschlüsse, 1948, Grundgesetz und EMRK, begründetes Urteil an einem erfundenen Gegenwartsfall |
| 8 · Bilingual, optional | 4 | British Empire, Britain in 1914, Britain/USA in World War II, Civil Rights in the USA; englische Aufgaben und deutsch-englisches Fachvokabular |

Die Stundenansätze sind Orientierungswerte des Lehrplans, keine behauptete Bearbeitungsdauer der App. Die Quellenbasis in `src/curriculum/sources.ts` umfasst ISB, DHM, Gedenkstätten, USHMM, UN, Europarat/EGMR, amtliches Grundgesetz, IWM und National Park Service. Ein fachliches Review der neuen Inhalte und die Mapping-Freigabe stehen vor Veröffentlichung an.

## Zelle und bestehende Lernstände

Die einzige Kartenquelle ist [`cell.json`](cell.json): 39 Atome, 78 Karten (39 kurze Abrufe und 39 eigenständige Begründungsaufgaben). Die englischen Karten tragen `language: en`. Die Aufnahme der ganzen Zelle umfasst auch diese acht Karten; der optionale Schalter der App filtert nur den App-Lernpfad. Jede Karte und jedes Atom verlinkt eine stabile Lektion unter `https://academy.zam-os.org/geschichte-realschule-9/#lesson=…`. IDs, Slugs und Anker bleiben ab Veröffentlichung stabil; `tests/fixtures/public-contract.json` pinnt den Vertrag.

Das explizite [Mapping](replaces-de-by.json) erfasst alle acht Items aus `de-by:realschule-9-geschichte-weimar-ns` in ZAM 0.56.0. Der bytegleiche Quellstand ist als Testfixture mit Commit und SHA-256 dokumentiert.

- **4 A:** Gleicher einzelner Abruf: Weltwirtschaftskrise ab 1929, Ernennung am 30. Januar 1933, Nürnberger Gesetze und Kriegsbeginn in Europa. Die Krisenkarte behält die bisherige Antwort unverändert bei; die missverständliche Bezeichnung Schwarzer Freitag wird nur aus dem Fragetext entfernt. Je ein `replaces` verschiebt die vollständige Karte mit ihren Reviews; keine Verteilung auf mehrere Nachfolger.
- **0 B:** Keine unverändert übernommene mehrteilige Gesamtfrage.
- **4 C:** Fachlich korrigierte oder unsichere Fragen erhalten keinen Lernstandsübertrag. Die historischen Karten und Reviewereignisse bleiben erhalten. `retired_items` nimmt die alten Texte aus aktiven Wiederholungen; die korrigierten neuen Fragen beginnen ohne übernommene Beherrschung.

Die Einzelgründe stehen im Mapping. **Die Freigabe für dieses Mapping steht aus.** Die frühere Freigabe für Chemie wird nicht wiederverwendet. Academy wird zuerst geprüft und veröffentlicht; ZAM-Synchronisierung und Ablösung der alten Zelle folgen danach in einem eigenen ZAM-PR.

## Entwickeln und prüfen

```sh
npm ci
npm run dev            # http://localhost:5185/geschichte-realschule-9/
npm run typecheck
npm test
npm run build          # dist/index.html: eine offlinefähige Datei
npm run package:zip    # release/ZAM-Academy-Geschichte-9-offline.zip
```

Im Repo-Wurzelverzeichnis, mit demselben veröffentlichten `zam-core@0.54.0` wie in CI:

```sh
ZAM_CORE=file:///pfad/zu/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///pfad/zu/node_modules/zam-core/dist/index.js node geschichte-realschule-9/scripts/validate-migration.mjs
node scripts/build-catalog.mjs /tmp/academy-catalog.json
```

Der Migrationstest erzeugt ausschließlich Wegwerf-Bibliotheken: acht alte Karten, je zwei Bewertungen, vollständiger Vergleich aller Karten- und Reviewfelder, aktive Altfragen vor/nach der Migration, wiederholte Installation und eine Kollision zweier bereits bewerteter Historien. Persönliche Bibliotheken werden nicht geöffnet.
