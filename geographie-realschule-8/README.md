# Geographie 8 Realschule Bayern

34 Lektionen und 68 ZAM-Karten für alle Wahlpflichtfächergruppen, auf Grundlage des am 26. Oktober 2026 gelesenen [LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/geographie).

| Lernbereich | Lektionen | Schwerpunkt |
| --- | ---: | --- |
| 1 Doppelkontinent Amerika | 12 | Orientierung, Platten, Stürme und Verwundbarkeit, Besiedlung, Städte, Landwirtschaft und Rohstoffe, Wirtschaft, Lebensweisen, Grenzen |
| 2 China und Indien | 9 | Topografie, Monsun, Kennzahlen, Wirtschaftszentren, Lebensbedingungen, Kinderrechte und Präsentation |
| 3 Russland | 4 | Größe und Vielfalt, Naturraumnutzung, Aralsee im postsowjetischen Raum und zeitabhängige Handelsbeziehungen |
| 4 Globale Verflechtungen | 7 | Smartphone und Jeans, Wertschöpfung, HDI, Fußabdruck, Bildung und Verbraucherhandeln |
| 5 Aktuelle geographische Frage | 2 | Eigene reale Recherche, Quellenprüfung, Verortung, Urteil und tatsächliche Präsentation |

Die [Abdeckungsmatrix](coverage.json) ordnet alle 34 Pflicht-Kompetenzerwartungen den Lektionen zu. [curriculum.json](curriculum.json) hält die Originalerwartungen, die Stundenansätze und die drei optionalen bilingualen Erwartungen als unabhängige Prüfgrundlage fest. Lernbereich 6 wird als englischer Jahreskurs nicht angeboten. Vorwissen zu Gradnetz und Klima aus früheren Klassen wird angewendet; Geo9-Inhalte sind kein zusätzlicher Pflichtbereich dieser App.

Jede Lektion hat eine Erklärung, einen Merksatz, einen Schnellcheck, zwei begründete Fallentscheidungen und eigene Schreibaufgaben mit Hinweisen, Musterlösung und drei Kriterien auf zwei Stufen. Ein Abschluss verlangt den richtigen Schnellcheck, beide Fälle und einen selbst bestätigten Mustervergleich auf der gewählten Stufe. Geänderte Antworten heben ihre Bestätigung auf. Eigene Texte werden nicht automatisch fachlich bewertet.

Zusätzlich gibt es drei Offline-Karten mit echten vereinfachten Länderumrissen und fünf veränderbare Modelle: Regenverteilung im Monsunvergleich, Länderwerte pro Kopf, Wasserbilanz, Preisaufteilung und geometrisches Mittel normierter Entwicklungsindizes. Jedes Modell nennt seine erfundenen Zahlen, Einheiten und Grenzen. Erkundungsziele sind erreichbar, am Anfang offen und vom Aufgabenabschluss getrennt. Karten stammen aus Natural Earth 5.1.1 ([Herkunft und Grenzen](src/data/NOTICE.md)); die Projektion ist nicht flächentreu. Punkte sind keine Gebirgs- oder Flussverläufe.

Das gemeinsame Rechercheheft hält ein selbst gewähltes tatsächliches aktuelles Ereignis mit Ort, Datum, Frage, zwei datierten Quellen, Karte, Belegen, Urteil, Grenzen und Präsentationsplan fest. Die App prüft nur formale Vollständigkeit. Sie prüft weder Wahrheit noch Unabhängigkeit der Quellen und bestätigt keine gehaltene Präsentation. Echte Satellitenbilder, aktuelle Länderwerte, Atlasarbeit, Diskussionen und Vorträge ergänzen die digitalen Übungen. Keine Privatadressen nötig, keine Links werden automatisch abgerufen.

Die ZAM-Karten stehen ausschließlich in [cell.json](cell.json), mit generierten und festgeschriebenen ULIDs. Sie verweisen auf die jeweilige Lektion. Die App enthält keine Kartenliste oder Exportfunktion; ihr Fortschritt verändert keine FSRS-Daten. Die vier alten Geo8-Karten bleiben unverändert. [replaces-de-by.json](replaces-de-by.json) dokumentiert vier unsichere oder korrigierte Zuordnungen der Kategorie C, ohne `replaces`, `retired_items` oder genehmigte Übertragung.

```sh
npm ci
npm run dev        # Port 5210
npm test
npm run typecheck
npm run build
npm run package:zip
```

Im Repository-Hauptordner:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///pfad/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///pfad/zam-core/dist/index.js node geographie-realschule-8/scripts/validate-cell.mjs
```

Der Offline-ZIP enthält dieselbe eigenständige HTML-Datei und Starter für Windows, macOS und Linux. Die Druckansicht bietet Aufgaben und getrennte Musterlösungen. Fortschritt, eigene Texte und Rechercheheft bleiben lokal im Browser; bei gesperrtem Speicher bleibt die Sitzung nutzbar und zeigt einen Hinweis. Externe Quellen öffnen nur auf Klick. Keine Konten, Telemetrie, eingebetteten Videos oder neuen Bibliotheken. Pages veröffentlicht App, Zelle und Katalog nach dem Merge. Die Bündelung in ZAM erfolgt anschließend gesondert mit `npm run academy:sync`.
