# Politik und Gesellschaft 10 · Bestandsabgleich

Stand: 25. Oktober 2026. Geprüft wurden die Academy-Pakete im Arbeitsbaum und
die Zellen/Fixtures sowie Lehrplanbindungen im benachbarten ZAM-Repository.
Der PR basiert auf Academy-Hauptstand `ce30ec6`. Andere Pakete bleiben unverändert.

Der offizielle [Fachlehrplan PuG10](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/10/pug)
gilt für die Realschule unabhängig von der Wahlpflichtfächergruppe. Er enthält
vier Lernbereiche und 27 Kompetenzerwartungen. Eine Fachlehrplanbindung im
Importer allein ist noch kein vorhandenes Lernpaket.

## Ergebnis

Kein vorhandenes eigenes PuG-10-Paket im geprüften Bestand. Die neue App
`politik-realschule-10` ergänzt 32 Lektionen, 32 Atome und 64 frische Karten.
Sie ersetzt und beendet keine vorhandenen Karten oder Zellen.

| Vorhandenes Fach | Thematische Nähe | Umgang |
| --- | --- | --- |
| Geographie 9 | Bevölkerung, EU, globale Verflechtungen | Bestehende Karten und Reviews bleiben unverändert. |
| Geschichte 9 und Geschichte 10 | Demokratiegeschichte, internationale Entwicklung | Kein automatischer Lernstandsübertrag in aktuelle politische Analyse. |
| Wirtschaft und Recht 9 / BwR | Wirtschaftsmodelle und staatliche Regeln | Neue PuG-Fragen bleiben eigenständige Abrufe. |
| Deutsch 10 | Quellen, Argumentation und Stellungnahme | Fachmethoden werden im politischen Zusammenhang neu angewandt. |

Ähnlichkeit von Thema, Frage oder Titel entscheidet keine Beherrschung.
Es gibt **kein `replaces` und kein `retired_items`**, keine vorgeschlagene
Migration und damit keine ausstehende Mappingfreigabe. Persönliche Daten
werden nur für einen Integrationstest in einer neu angelegten temporären
Bibliothek erzeugt, nicht aus einer echten Bibliothek gelesen.

Der Test mit `zam-core@0.54.0` installiert zuerst die vorhandene Geo9-Zelle,
bewertet zwei ihrer Karten je zweimal, speichert sämtliche Karten- und
Review-Spalten und prüft ihre Unverändertheit nach Installation und Aufnahme
der 64 neuen Karten. Neue Karten beginnen ohne Reviews, Wiederholung und
Stabilität. Erneute Installation und Aufnahme verändern diesen Stand nicht.

Die [Abdeckungsmatrix](../politik-realschule-10/coverage.json) unterscheidet
begrenzte Übung von Vorbereitung zusätzlicher Praxis. Aktuelle Recherche,
reale Debatten, Rollen- und Planspiele, Erkundung und Präsentation werden nicht
als durch die App vollständig nachgewiesen ausgegeben.

## PR-Prüfung am 25. Oktober 2026

Die Integration wurde auf dem aktuellen Academy-Hauptstand vorbereitet:
Eintrag in `academy.json` mit eigenem Fach `pug`, CI-Matrix, Pages-Liste,
README und Rücklink zur Academy. Der Dev-Port ist 5206 (bei belegtem Port
verwendet die Vorschau einen freien Folgeport).

Kartenwortlaut steht nur in `cell.json`; die App liest daraus ihre Checks und
Merksätze. Die zusätzliche dritte Antwort im Lerncheck ist nur eine
Unterrichtsoption. Tier-1-Karten haben Antwortindex 0; Tier 2 hat eine
`sample_solution`. Die IDs des lokalen Entwurfs bleiben erhalten.

Prüfungen im separaten PR-Arbeitsstand:

- `npm ci --offline --no-audit --no-fund`, `npm run typecheck`, `npm test`:
  Installation und Typprüfung erfolgreich, 63 Tests bestanden.
- Biome `check src scripts tests`: keine Befunde.
- `npm run package:zip`: Build, selbständiges HTML, ZIP-Inhalt und
  Starter-Shellsyntax erfolgreich geprüft.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  30 Tests bestanden.
- `scripts/validate-cells.mjs` mit dem veröffentlichten `zam-core@0.54.0`:
  alle 27 Zellen im PR-Arbeitsstand erfolgreich installiert; Antwortalternativen
  bestanden die vorhandenen Kernprüfungen.
- `politik-realschule-10/scripts/validate-cell.mjs` mit demselben Kern:
  64 neue Karten, vorhandene Karten und Reviews unverändert, Wiederholung sicher.
- Browserprüfung des gebauten HTML über Vites auf den Build-Ordner beschränkte
  lokale Vorschau: alle 32 Lektionen auf beiden Stufen in heller und dunkler
  Darstellung geladen und auf Merksatz, Fallwerkstatt und eigene Aufgabe
  geprüft (128 Ansichten). Lernpfad und Quellen-/Praxisansicht sichtbar geprüft.
  Die direkte `file:`-Navigation ist im Browserwerkzeug gesperrt; die
  Bytegleichheit des HTML im Offline-ZIP wird separat im Pakettest geprüft.

Die Übungs- und Modellgrenzen aus README und Abdeckungsmatrix gelten weiter.
Keine Videos hinzugefügt. Die späteren Reviewbefunde und ihre Bearbeitung sind nachfolgend dokumentiert.


## Reviewkorrekturen zu PR #52

Der [Inline-Befund](https://github.com/zam-os/zam-academy/pull/52#discussion_r4372040358)
und der [ergänzende Review](https://github.com/zam-os/zam-academy/pull/52#issuecomment-6402359049)
wurden am 25. Oktober 2026 geprüft.

- `from: 8` bleibt für das schulartübergreifende Fach erhalten. Fünf
  `kein_unterricht`-Einträge nehmen Realschule 8/9 und Mittelschule 8/9/10 aus
  den fehlenden Paketen und der Abdeckungssumme heraus. Grundlage sind
  [RSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayRSO-ANL_1)
  und [MSO Anlage 1](https://www.gesetze-bayern.de/Content/Document/BayMSO-ANL_1).
  Der Gymnasium-Pfad ab Klasse 8 und das Realschule-10-Paket bleiben vorhanden.
- README nennt alle drei erreichbaren Zweier-Kompromisse. Der Arbeitsauftrag,
  zwei verschiedene Mehrheiten zu finden, bleibt eine Auswahlaufgabe.
- Die UI und README benennen die Fälle als Aussagenprüfungen (Richtig/Falsch).
  Die eigene politische Abwägung bleibt in den offenen Schreibaufgaben.
- LB1/5 benennt jetzt auch Konflikt als Merkmal der Demokratie, LB2/1 die
  Bedeutung aktiver Teilnahme. Beide Inhalte waren bereits in den Lektionen
  enthalten. Der Originallehrplan wurde direkt per HTTPS geladen und der
  normalisierte Text mit einem HTML-Parser geprüft.
- Zahlen im Modell verwenden U+2212 für negative Werte. Die Level-Bezeichnung
  ist in Auswahlfeld, Fortschritt und Anleitung vereinheitlicht. Die
  Academy-Tabelle trägt die kanonische URL.
- Die BIP-Frage nennt ihre Ausgangslage selbst; die Antwort lautet knapp
  „Sie bleibt unverändert.“. Der Konjunkturabsatz erläutert den Verlauf,
  während die geordnete Begriffsliste nur aus der Zelle als Merksatz kommt.
- Der neue Korrekturcommit hat einen deutschen Betreff. Der bereits geprüfte
  erste Commit wird nicht nachträglich umgeschrieben.

`npm test` besteht nach der Korrektur mit 65 Tests, einschließlich
Regressionsprüfungen für die fünf Fächer-Ausnahmen und das Zahlenformat.
`npm run typecheck`, Biome-Check und `npm run package:zip` sind erfolgreich.
Die 30 Katalog-/Registry-Tests, alle 27 Zellinstallationen mit
`zam-core@0.54.0` sowie der Bestandsschutztest sind ebenfalls erfolgreich.

Browserkontrolle nach den Reviewkorrekturen: Die Realschulmatrix zeigt
PuG 8/9 als „kein Fach“ und PuG 10 als verfügbar (23 von 56 Feldern insgesamt).
Die Mittelschule zeigt PuG 8/9/10 als „kein Fach“ (0 von 51 Feldern insgesamt).
Gymnasium 8/9 bleiben als noch fehlende Pakete sichtbar (0 von 97 Feldern
insgesamt). Der korrigierte Paket-Build wurde erneut in allen 128 Kombinationen
von 32 Lektionen, zwei Leveln und heller/dunkler Darstellung auf Lektionsinhalt
und Aussagenprüfung kontrolliert. Bei Menge 60 und Preis 10 zeigt das BIP-Modell
für nominalen und realen Wert jeweils „600 Euro (−40 %)“.
