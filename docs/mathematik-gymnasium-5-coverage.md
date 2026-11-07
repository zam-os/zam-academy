# Mathematik 5 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 7. November 2026. Das Paket umfasst 55 Lektionen in 4 Etappen mit 55 Atomen und 165 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/mathematik) wurde am 07.11.2026 direkt abgerufen, keine Archivfassung. Am Gymnasium gibt es in Jahrgangsstufe 5 keine Zweige. Stunden und Erwartungen stehen wortgleich in [source.json](../mathematik-gymnasium-5/src/curriculum/source.json), die Zuordnung in [coverage.json](../mathematik-gymnasium-5/coverage.json).

| Inhalt | LB | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| 1.1 Natürliche Zahlen und ihre Erweiterung zu den ganzen Zahlen | 1 | 12 | 7 | 9 |
| 1.2 Addition und Subtraktion ganzer Zahlen | 1 | 18 | 5 | 6 |
| Geometrische Figuren und Lagebeziehungen | 2 | 14 | 5 | 9 |
| 3.1 Multiplikation und Division ganzer Zahlen | 3 | 20 | 7 | 11 |
| 3.2 Verbindung der Grundrechenarten bei ganzen Zahlen | 3 | 14 | 5 | 5 |
| 4.1 Geld, Länge, Masse und Zeit | 4 | 18 | 5 | 7 |
| 4.2 Flächeninhalt | 4 | 16 | 5 | 8 |

Die Vertragstests prüfen die wortgleichen 39 Erwartungen, mindestens eine Lektion je Zeile, dass jede Lektion in mindestens einer Zeile vorkommt und dass sie zum Lernbereich der Zeile gehört.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Die Querverweise des Fachlehrplans nennen die Grundschule 1/2 und 3/4 (schriftliche Verfahren, Größen, Sachsituationen). Mathematik 6 am Gymnasium führt Bruchzahlen, Dezimalbrüche, Prozent, die Flächeninhalte von Parallelogramm, Dreieck und Trapez und das Volumen ein. Das zieht dieses Paket nicht vor. Ein Komma steht nur dort, wo der Plan es für M5 nennt: bei Geld, Länge und Masse und beim Umrechnen von Flächen. Bei der Zeit bleibt es weg; die Labore schreiben 90 min als 1 h 30 min.

**Abweichung von der Realschule.** Es wurde die App-Hülle von `mathematik-realschule-5` übernommen, nicht ihr Stoff. Nicht im Gymnasialplan M5 und darum hier nicht enthalten sind Dualsystem, ggT und kgV, Dreiecke, Winkelpaare, Körperformen außer dem Quader, Hohlmaße und die Auswertung von Daten. Neu sind Lagebeziehungen von Kreis und Gerade und von zwei Kreisen, Punkte mit Abstandsbedingungen, das Drachenviereck, Gleichungen in sechs Formen und Oberflächen zusammengesetzter Körper.

**Was auf Papier bleibt.** Zeichnen und Messen mit dem Geodreieck, Skizzen, Recherche und das Präsentieren von Lösungswegen stehen im Plan und werden erklärt, geschehen aber außerhalb der App. Die App überprüft die zugehörigen Begriffe und Rechnungen. `coverage.json` nennt das in der jeweiligen Zeile.

## Bestandsabgleich der alten Karten

Zwei `de-by`-Zellen in zam-os/zam (Commit `f57e6740854a2f91f985b59b9e101b388186d3bc`) enthalten 16 Karten, bytegleich unter `mathematik-gymnasium-5/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../mathematik-gymnasium-5/replaces-de-by.json).

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 5 | Gleicher Einzelabruf, ein Nachfolger: `g5-senkrecht-zeichen`, `g5-betrag`, `g5-plus-mal-minus`, `g5-klammer-basis`, `g5-outfits` |
| B | 0 | Keine mehrteilige Karte wird ganz übernommen |
| C | 11 | Mehrteilig, außerhalb des Plans M5 oder unsicher; bleiben aktiv und bekommen keinen Nachfolger |

Die alten Zellen enthalten auch Inhalte, die der aktuelle Fachlehrplan M5 nicht nennt, zum Beispiel Achsenspiegelung, Mittelsenkrechte, die Dreiecksfläche, das Volumen und die Fakultät. Die Zuordnung ist ein Vorschlag: `approved` ist `null`, die Zelle erscheint ohne `replaces` und `retired_items`, und `mathematik-gymnasium-5/scripts/validate-migration.mjs` prüft das in einer Wegwerf-Datenbank.

## Registrierung

`academy.json` kennt die Schulart `gymnasium` bereits. Das Paket ist der erste Eintrag dieser Schulart. Gemeinsame Werkzeuge mussten dafür nicht geändert werden: `scripts/academy-registry.test.mjs`, `scripts/build-catalog.mjs` und der Atlas in `index.html` lesen die Schularten aus der Registrierung. ZAM bindet die Zelle erst nach ihrer Veröffentlichung mit `npm run academy:sync` ein.
