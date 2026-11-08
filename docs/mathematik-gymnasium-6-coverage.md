# Mathematik 6 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 8. November 2026. Das Paket umfasst 47 Lektionen in 3 Etappen mit 47 Atomen und 141 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M6](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/mathematik) wurde am 08.11.2026 direkt abgerufen, keine Archivfassung. Am Gymnasium gibt es in Jahrgangsstufe 6 keine Zweige. Stunden und Erwartungen stehen wortgleich in [source.json](../mathematik-gymnasium-6/src/curriculum/source.json), die Zuordnung in [coverage.json](../mathematik-gymnasium-6/coverage.json).

| Inhalt | LB | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| 1.1 Bruchteile und Bruchzahlen | 1 | 13 | 4 | 6 |
| 1.2 Dezimalbrüche | 1 | 11 | 3 | 5 |
| 1.3 Addition und Subtraktion rationaler Zahlen | 1 | 15 | 5 | 6 |
| 1.4 Multiplikation und Division rationaler Zahlen | 1 | 14 | 3 | 5 |
| 1.5 Verbindung der Grundrechenarten bei rationalen Zahlen | 1 | 15 | 4 | 5 |
| 2.1 Flächeninhalt | 2 | 12 | 4 | 6 |
| 2.2 Volumen | 2 | 12 | 5 | 6 |
| Prozentrechnung, Daten und Diagramme | 3 | 20 | 5 | 8 |

Die Vertragstests prüfen die wortgleichen 33 Erwartungen, mindestens eine Lektion je Zeile, dass jede Lektion in mindestens einer Zeile vorkommt und dass sie zum Lernbereich der Zeile gehört.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Die Querverweise des Fachlehrplans bauen auf der Grundschule und auf Mathematik 5 auf: Rechteckfläche, Primfaktorzerlegung, ganze Zahlen. Dieses Paket zieht Mathematik 7 nicht vor. Nicht enthalten sind Variablen und Termalgebra, binomische Formeln, Achsenspiegelung, Winkelpaare, lineare Gleichungen, Zinseszins, Median, Quartile, Boxplots, Kongruenz, Thales und die allgemeine Prismenformel. Zinsen gibt es für einen Zeitraum. Eine reine Periode der Länge eins wird in einen Bruch zurückverwandelt; gemischt periodische Dezimalbrüche nicht. Ein Tabellenkalkulationsprogramm wird erklärt, aber nicht ausgeführt.

**Was auf Papier bleibt.** Zeichnen und Messen, Skizzen, Recherche und das Präsentieren von Lösungswegen stehen im Plan und werden erklärt, geschehen aber außerhalb der App. Die App überprüft die zugehörigen Begriffe und Rechnungen.

## Bestandsabgleich der alten Karten

Zwei `de-by`-Zellen in zam-os/zam (Commit `0dd65c8f58b7ece3edcf6aff1d5eced099b74e6c`) enthalten 16 Karten, bytegleich unter `mathematik-gymnasium-6/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../mathematik-gymnasium-6/replaces-de-by.json).

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 7 | Gleicher Einzelabruf, ein vorgeschlagener Nachfolger: `m6-erweitern-wert`, `m6-bruch-division`, `m6-endlich-nenner`, `m6-prozentwert`, `m6-parallelogramm`, `m6-trapez`, `m6-kreisdiagramm-25` |
| B | 0 | Keine mehrteilige Karte wird ganz übernommen |
| C | 9 | Mehrteilig oder außerhalb von M6, darunter die allgemeine Prismenformel; bleiben aktiv und bekommen keinen Nachfolger |

Thomas hat die Zuordnung am 8. November 2026 freigegeben. Ab `2026.11.2` trägt jeder der sieben A-Nachfolger ein `replaces` auf seine alte Karte; `retired_items` gibt es nicht. `mathematik-gymnasium-6/scripts/validate-migration.mjs` prüft in Wegwerf-Datenbanken, dass die sieben Historien unverändert übergehen, die neun C-Karten aktiv bleiben und eine Doppelbelegung abgelehnt wird.

## Lehrervideos

Noch keine. Sie werden in einem späteren Schritt ergänzt und gegen den echten Titel geprüft.

## Registrierung

`academy.json`, die CI-Matrix, die Pages-Liste und die README-Zeile nennen das Paket. ZAM bindet die Zelle erst nach ihrer Veröffentlichung mit `npm run academy:sync` ein.
