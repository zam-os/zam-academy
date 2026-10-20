# Geographie 9 Realschule · ZAM Academy

Ein gemeinsamer Lernpfad für alle Wahlpflichtfächergruppen der Realschule Bayern. Grundlage ist der [LehrplanPLUS Geographie 9](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/geographie), abgeglichen am 20. Oktober 2026. Die [Abdeckungsmatrix](coverage.json) ordnet die einzelnen Kompetenzen den Lektionen zu.

## Inhalt

35 Kernlektionen decken die sieben Pflicht-Lernbereiche ab:

| Lernbereich | Lektionen | Schwerpunkte |
| --- | ---: | --- |
| 1 Landschaft und Naturrisiken | 5 | Großlandschaften, Plattentektonik, Erdgeschichte, Abtragung, Eingriffe |
| 2 Klima und Klimawandel | 7 | Daten und Klimafaktoren, Großwetterlagen, Treibhauseffekt, Folgen, Extreme, Schutz und Anpassung, Ozon |
| 3 Landwirtschaft, Ernährung und Boden | 6 | Standortfaktoren, konventionell/ökologisch, Boden und Tierhaltung, Agrarhandel, Hunger, Hydroponik |
| 4 Städtische Siedlungs- und Lebensräume | 4 | Kartenmaßstäbe, München/Paris/Mumbai, Stadtwandel, nachhaltige Stadt |
| 5 Bevölkerung und Bevölkerungspolitik | 5 | Altersaufbau, Bilanz, Szenarien Bayern/Deutschland/Welt, Migration, Deutschland/Japan |
| 6 Grenzen im Wandel | 5 | EU-Karte, Erweiterung, Airbus Donauwörth, Fußabdruck, Einheit/Schengen/Teilung Britisch-Indiens |
| 7 Aktuelle geographische Fragestellung im Nahraum | 3 | Eigene Frage und Verortung, datierte Quellen, begründetes Urteil und Präsentation |

Dazu kommen sieben optionale englische Vertiefungen zu den Bereichen 1–7 (bilingualer Lernbereich 8). Sie bilden keinen vollständigen bilingualen Jahreskurs. Drei zusätzliche Grundlagenlektionen zu ITC, Regenwald und Desertifikation bewahren die sinnvollen Lernangebote aus dem Altbestand. Sie stehen in einer getrennten, standardmäßig ausgeblendeten Etappe und haben **keine offizielle Geo9-Lehrplanbindung**. Die interne Nummer dieser Etappe ist kein neunter Lehrplan-Lernbereich.

Jede Lektion enthält Lesetext, Schnellcheck, eine Zuordnungs- oder Ablaufwerkstatt und zwei selbst verfasste Schreibaufgaben mit Leitfragen, Vergleichsantwort und Kriterien. Level 1 zählt zum Abschluss; Level 2 vertieft den Transfer. Eigene Antworten werden nicht automatisch fachlich benotet. Ein Abschluss erfordert Schnellcheck, gelöste Werkstatt und bestätigte eigene Level-1-Antwort. In den betreffenden Lektionen kommen Modellvergleiche beziehungsweise der eigene Recherchebogen hinzu.

## Karten, Modelle und Nahraumprojekt

Acht Lektionen bieten eine zusätzliche interaktive Erkundung:

- Deutschlandumriss mit vier Orientierungspunkten; keine erfundenen waagerechten Landschaftsgrenzen.
- Zwei erfundene Klimaprofile mit separaten Temperatur- und Niederschlagsskalen, Datentabelle und berechneten Kennwerten.
- Wasserbilanz für 10 km² mit ausdrücklich fiktiven Abflussbeiwerten; keine Hochwasserprognose.
- Ein-Schicht-Strahlungsmodell mit dokumentierter Energiebilanz; Absorptionsanteil ist keine CO₂-Konzentration und kein Klimaszenario.
- Drei ausdrücklich erfundene Altersprofile in breiten Altersgruppen; sie ersetzen keine echte Bevölkerungspyramide eines Landes.
- Bevölkerungsbilanz mit vier veränderbaren jährlichen Bewegungsgrößen und exaktem Massenerhalt.
- Drei fiktive Quartierspläne mit gleicher Gesamtfläche; keine automatische Gesamtnote für Nachhaltigkeit.
- Europakarte und vollständige Liste der 27 EU-Mitglieder, zusätzlich Nichtmitglieder zum Vergleich. Politischer Stand: 20. Oktober 2026; Datums- und Projektionsgrenzen stehen an der Karte.

Die vereinfachten Länderumrisse stammen von [Natural Earth 5.1.1](src/data/NOTICE.md), Public Domain. Quellenangabe, ursprünglicher SHA-256 und Transformation sind dokumentiert. Es gibt keinen Kartendienst und keine Hintergrundabfragen. Reale Reliefkarten, genaue Entfernungen, differenzierte Altersdiagramme und reale Länderwerte werden mit Atlas und verlinkten Fachquellen ergänzend untersucht.

Für Lernbereich 7 muss die lernende Person ein **reales aktuelles Ereignis im eigenen Nahraum** auswählen. Ein gemeinsamer lokaler Bogen erfasst Ort, Anlass, Datum, Frage, zwei unterschiedliche datierte Quellen (fachlich/amtlich und massenmedial), Kartenbezug, Belege, Urteil, Grenzen und Präsentationsplan. Der Bogen prüft ausgefüllte Felder, plausible Datumsformate und unterschiedliche http(s)-Adressen. Er überprüft weder Tatsachen noch Unabhängigkeit der Quellen oder eine tatsächlich gehaltene Präsentation. Eine fiktive Musterantwort ersetzt das reale Projekt nicht; Quellen und Ergebnis sollen im Unterricht besprochen werden. Es werden keine Privatadressen, persönlichen Angaben oder Uploads benötigt, und eingegebene Links werden nicht abgerufen.

## Lernstände übernehmen

Die Zelle [cell.json](cell.json) enthält 45 Wissensatome und **91 Karten**: 70 Kernkarten, 14 englische Karten, sechs Grundlagenkarten und eine eigene unveränderte mehrteilige Synthesekarte. Die Schalter in der App filtern ausschließlich den Lernpfad. Bei Aufnahme der ganzen ZAM-Zelle sind die Zusatzkarten enthalten; `exam_relevant: false` ist kein Filter für die Aufnahme. App-Abschlüsse und Texte verändern keine persönlichen FSRS-Karten.

[replaces-de-by.json](replaces-de-by.json) dokumentiert die alte Zelle `de-by:realschule-9-geographie-klima-ressourcen`, Version `2026.08.1`, aus ZAM 0.56.0, Commit `5a334c0c9050cf3590a036e7b451481462966d0e`. Die Originaldatei liegt bytegleich mit SHA-256 als Testfixture vor.

| Kategorie | Altfragen | Behandlung |
| --- | --- | --- |
| A | J01 ITC, J05 Desertifikation, J07 Fußabdruck | Je ein sicher gleicher Begriffsabruf mit explizitem `replaces`; neue Zusammenhänge bleiben frische Karten. |
| B | J08 Treibhauseffekt und Drei-Säulen-Modell | Vollständige alte Frage, Kurzantwort und Musterlösung wortgleich auf genau einer eigenen Synthesekarte; keine Verteilung auf neue Teilfragen. |
| C | J02 Hadley, J03 Nährstoffspeicher, J04 Regenwaldgesamtfrage, J06 Sahel/Versalzung | Korrigierte oder unsichere Inhalte erhalten kein `replaces`. Alte Karten und Reviews bleiben erhalten; `retired_items` entfernt die Alttexte aus aktiven Wiederholungen. |

Die Zuordnung ist ein **neuer Geographie-Vorschlag, dessen Freigabe noch aussteht**. Frühere Chemie- oder Geschichte-Freigaben werden nicht übernommen. Vor einem Merge sind der Inhalt und die acht Einzelzuordnungen prüfbar. ZAM-Synchronisation, Ablösung der Altzelle und Ergänzung des Lehrplanangebots folgen in einem eigenen PR nach dem Academy-Merge.

Der Integrationstest verwendet den veröffentlichten `zam-core@0.54.0` und ausschließlich temporäre Bibliotheken. Er prüft alle acht Karten mit 16 echten Bewertungsvorgängen, sämtliche FSRS-Felder und Review-Spalten (außer der beabsichtigten Token-Zuordnung), vier gezielte Umzüge, vier stillgelegte Altkarten, Wiederholbarkeit sowie Kollisionen auf A- und B-Nachfolgern. Bei zwei bereits vorhandenen Historien wird ein automatisches Zusammenführen abgelehnt.

## Entwicklung und Veröffentlichung

```bash
npm ci
npm run dev        # Port 5186
npm test
npm run typecheck
npm run build
npm run package:zip
```

Aus dem Repo-Hauptverzeichnis mit einem installierten veröffentlichten Kern:

```bash
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///absoluter/pfad/zam-core/dist/index.js node geographie-realschule-9/scripts/validate-migration.mjs
node scripts/build-catalog.mjs /tmp/catalog.json
```

Die bestehende CI prüft App, Offline-ZIP, Zelle, Antwortalternativen und Migration. Pages veröffentlicht nach dem Merge die App unter `https://academy.zam-os.org/geographie-realschule-9/`, ihre `cell.json` und den aktualisierten Katalog. Veröffentlichung und Bündelung stabilisieren IDs, Slugs und Lektionenanker; die unabhängige Fixture `public-contract.json` schützt diesen Vertrag.

Die App verwendet dieselben Entwicklungswerkzeuge wie die bestehenden Academy-Pakete und keine neuen Bibliotheken. Keine Konten, Telemetrie, externen Schriftarten oder automatischen Datenabrufe. Eigene Texte, Erkundungsstand und Recherchebogen werden getrennt von anderen Apps lokal gespeichert; bei gesperrtem Speicher bleibt die Sitzung nutzbar und zeigt einen Hinweis. Die ausgelieferte HTML-Datei ist eigenständig; für eine reale Quellenrecherche sind passende Materialien beziehungsweise Internet nötig. Externe Quellen öffnen ausschließlich auf Klick.
