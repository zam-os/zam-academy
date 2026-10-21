# Algorithmen und Programmieren · ZAM Academy

20 vollständig deutsch und englisch verfügbare Lektionen und eine lokale Code-Werkstatt zu **LehrplanPLUS Realschule Bayern, IT 2.6.1: Modellieren und Codieren von Algorithmen** (ca. 14 Unterrichtsstunden). Der Fachlehrplan ist modular und jahrgangsübergreifend; die Schule bestimmt, wann das Modul stattfindet. Die `/9/it`-Quelladresse weist das Paket nicht als festen Klasse-9-Jahreskurs aus.

Die Sprache lässt sich oben zwischen Deutsch und English wechseln. Ein direkter Link wie `#lesson=algo-while&lang=en` öffnet dieselbe stabile Lektion auf Englisch; die URL hat Vorrang vor der gespeicherten Sprachwahl. Ohne Auswahl startet die App auf Deutsch. Beide Sprachfassungen umfassen sämtliche Erklärungen, Ablaufmodelle, Aufgaben, Tipps, Kurzchecks, Lösungen, Testwerte, Bedienhinweise, Fehlerdiagnosen und Ablaufspuren. Die englische Fassung eignet sich auch als Auffrischung für Kolleginnen und Kollegen.

Codebeispiele nutzen passende deutsche beziehungsweise englische Namen und Ausgabetexte. Die vorhandenen deutschen Entwürfe bleiben unter `drafts`, englische Entwürfe liegen getrennt unter `draftsEn`. Beim Wechsel speichert die App den aktuellen Entwurf, lädt den gespeicherten Entwurf beziehungsweise die Vorlage der anderen Sprache und leert die dazu nicht mehr passende Ausgabe und Ablaufspur ausdrücklich. Übungserfolge bleiben für beide Sprachen gemeinsam erhalten.

Die ZAM-Karten selbst sind derzeit deutsch. Ihre IDs, Fragen und die vorbereitete Lernstandsübernahme bleiben durch die englische Oberfläche unverändert.

Der Lernpfad verbindet Ablaufmodelle mit veränderbarem Code, mehreren Testeingaben und einer nachvollziehbaren Ablaufspur. Die Werkstatt unterstützt einen ausdrücklich begrenzten JavaScript-Ausschnitt ohne `eval` oder `new Function`: Werte, Variablen, Entscheidungen, drei Schleifenformen, Felder, Funktionen, Parameter und Rückgaben. Ein eigener Lexer, Parser und Interpreter arbeitet ausschließlich mit begrenzten Datenstrukturen. Programme können weder Browser-/Datei-APIs noch das Netz erreichen. Schritt-, Rekursions-, Text-, Ausgaben- und Wertgraphgrenzen verweigern ausufernde Programme einschließlich zyklischer und exponentiell geteilter Felder.

Die Spur zeichnet höchstens 250 Zustände auf; Haltepunkte halten deren Wiedergabe an. Das ist kein Live-Debugger einer JavaScript-Engine. Unterschiede zu vollständigem JavaScript und alle Ressourcenlimits stehen in der Syntaxhilfe und in [coverage.json](coverage.json). Normgerechte Diagramme, eine vollständige Entwicklungsumgebung und eigenständige Programmierprojekte sind ergänzende Unterrichtsleistungen. Ein grüner Test belegt die getesteten Fälle.

## Entwicklung

```sh
npm ci
npm run dev        # http://localhost:5189/algorithmen/
npm test
npm run build
npm run package:zip
```

Es werden nur die bereits im Academy-Repository eingesetzten Entwicklungswerkzeuge verwendet. Die gebaute einzelne HTML-Datei läuft aus dem Offline-Zip ohne Server, externe Schriftarten, Konten oder Netzwerkzugriffe. Fortschritt und eigene Codeentwürfe bleiben in `localStorage`; bei gesperrtem Speicher ist Üben für die aktuelle Sitzung möglich.

## ZAM-Zelle

Die 40 Karten leben ausschließlich in [cell.json](cell.json), Zellen-ID `zam-academy:algorithmen`. App und Zelle werden gemeinsam gepflegt. Jede Karte zitiert einen stabilen Anker `https://academy.zam-os.org/algorithmen/#lesson=algo-…`. Die App exportiert keine zweite Kartenliste. Die über ZAM eingegebenen Bewertungen bestimmen den Wiederholungsplan; Übungen in dieser App schreiben keine ZAM-Bewertungen.

Der Vorschlag zur Ablösung von sechs Karten der alten IT-Zelle wird in `replaces-de-by.json` separat und mit ausdrücklicher Freigabe dokumentiert. Zwei Netzwerkkarten gehören zum Paket Datennetze. Unsichere oder korrigierte Wissensumfänge übernehmen keine Beherrschung.

## Quellen und Abdeckung

- [Offizieller Fachlehrplan Informationstechnologie, Modul 2.6.1](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it)
- [ECMA-262, primärer JavaScript-Sprachstandard](https://tc39.es/ecma262/)
- [Abdeckungsmatrix und Grenzen](coverage.json)

Redaktionsstand: 21. Oktober 2026. Erläuterungen, Aufgaben und Codebeispiele sind eigene Texte.
