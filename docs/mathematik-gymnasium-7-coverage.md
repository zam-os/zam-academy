# Mathematik 7 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 13. November 2026. Das Paket umfasst 44 Lektionen in 5 Etappen mit 44 Atomen und 132 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M7](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/mathematik) wurde am 13.11.2026 direkt abgerufen, keine Archivfassung (HTML-SHA-256 `0d3b0fe5c8823049f0f118a19fbf7aab66f64ee34781e743aef7f3a6c4785676`). Am Gymnasium gibt es in Jahrgangsstufe 7 keine Zweige. Stunden und Erwartungen stehen wortgleich in [source.json](../mathematik-gymnasium-7/src/curriculum/source.json), die Zuordnung in [coverage.json](../mathematik-gymnasium-7/coverage.json).

| Inhalt | LB | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| 1.1 Aufstellen und Interpretieren von Termen | 1 | 13 | 4 | 5 |
| 1.2 Umformen von Termen | 1 | 24 | 5 | 7 |
| 2.1 Achsen- und punktsymmetrische Figuren | 2 | 12 | 3 | 5 |
| 2.2 Winkelbetrachtungen an Figuren | 2 | 9 | 4 | 5 |
| Lineare Gleichungen und Vertiefung der Prozentrechnung | 3 | 17 | 4 | 7 |
| Kenngrößen von Daten | 4 | 8 | 3 | 5 |
| Kongruenz, besondere Dreiecke und Dreieckskonstruktionen | 5 | 29 | 9 | 10 |

Die Vertragstests prüfen die wortgleichen 32 Erwartungen gegen `coverage.json`, dass jede Zeile mindestens eine gültige Lektion des passenden Lernbereichs nennt, jede Lektion mindestens einer Zeile zugeordnet ist und keine ungültigen Kennungen in `evidence` stehen.

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Querverweise bauen auf Mathematik 6 (Gymnasium) auf: Rechenregeln für rationale Zahlen, Vorzeichenregeln sowie einfache ganzzahlige Potenzen als Wiederholung bei Termwerten (`tv-3-termwerte`). Die Potenzgesetze (`tu-1-potenzgesetze`) bleiben gemäß LehrplanPLUS M7 1.2 bei natürlichen Exponenten. Inhalte höherer Jahrgangsstufen (lineare Funktionen, Gleichungssysteme, Strahlensätze, Bruchterme, Wahrscheinlichkeit) bleiben außen vor.

**Quartile und Boxplots (LB 4).** Für die Bestimmung von unterem Quartil $q_1$ und oberem Quartil $q_3$ trennt der Median bei ungerader Datenanzahl $n$ die untere und obere Hälfte unter Ausschluss des Zentralwerts (`math.ts`). Dies wird in den Lektionen und Laboren von LB 4 konsistent erklärt und angewendet.

**Was im Unterricht bzw. auf Papier bleibt (`status: "supported"`).** 9 der 32 Zeilen in `coverage.json` tragen `"status": "supported"`, 23 Zeilen `"status": "implemented"`:

- `tv-4-tabelle` (LB 1.1): simuliert Zellbezüge und wägt Werkzeugeinsatz ab; eigene Arbeit in externer Tabellenkalkulationssoftware erfolgt im Unterricht.
- `tu-2-zusammenfassen`, `tu-3-ausmultiplizieren`, `tu-5-summen-mal` (LB 1.2): prüfen Umformungsschritte und Äquivalenz; freie Schülervorträge bleiben im Unterricht.
- `sy-1-achse`, `sy-2-punkt`, `sy-3-abstand`, `sy-4-lot-winkel` (LB 2.1): üben Begriffe, Eigenschaften und Konstruktionsideen digital; händische Konstruktionen mit Zirkel und Lineal erfolgen auf Papier.
- `da-3-quartile`, `da-4-boxplot` (LB 4): berechnen und vergleichen Kennwerte/Boxplots interaktiv; Nutzung externer Datensoftware im Unterricht.
- `ko-2-sss-sws`, `ko-3-wsw-ssw`, `ko-4-gleichschenklig`, `ko-6-umkreis-inkreis`, `ko-7-thales`, `ko-9-hoehen` (LB 5): führen Kongruenzbegriffe, Planfiguren, Beweisideen und Ortslinien interaktiv vor; Papierkonstruktionen, Präsentationen und eigenständige dynamische Geometriesoftware verbleiben im Unterricht.

## Bestandsabgleich der alten Karten (`proposal-only`)

In `zam-os/zam` (Commit `0dd65c8f58b7ece3edcf6aff1d5eced099b74e6c`, geprüft auch gegen alle benachbarten `de-by:gymnasium-*` Mathezellen) existieren für Jahrgangsstufe 7 genau zwei Alt-Zellen mit zusammen 12 Karten:

- `de-by:gymnasium-7-mathematik-rationale-zahlen-gleichungen-prozent` (4 Karten, SHA-256 `12c21b73301aca0872977cef74ec288c491cf7ad0be1d7280d41e2de4117bdf3`)
- `de-by:gymnasium-7-mathematik-symmetrie-winkel-dreiecke-kongruenz` (8 Karten, SHA-256 `d6212c5c0f2efd81ad098eb07dd0b70816f000f64aa80d963d2723f487bde83f`)

Nachbarjahrgänge: Grade 5 und Grade 6 sind bereits durch `mathematik-gymnasium-5` bzw. `mathematik-gymnasium-6` abgedeckt (`zam-academy-*`-Karten in `zam-os/zam`); die `de-by:gymnasium-8-*`-Zellen enthalten lineare Funktionen, Gleichungssysteme, Bruchterme, Kreisgeometrie und Wahrscheinlichkeit und gehören zu M8. Keine Nachbarzelle wird in M7 gemappt.

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 4 | Gleicher atomarer Einzelabruf, vorgeschlagener Nachfolger (`propose-replace-after-approval`): `gl-2-aequivalenz-lineare-gleichung` (`01K4M7Z0000000000000000J03`), `sy-3-abstand-mittelsenkrechte` (`01K4M7W0000000000000000J01`), `wi-3-dreiecksumme-winkelsumme` (`01K4M7W0000000000000000J03`), `ko-3-wsw-ssw-ssw-bedingung` (`01K4M7W0000000000000000J05`) |
| B | 0 | Keine mehrteilige Alt-Karte wird als Ganzes auf ein einzelnes Atom übernommen |
| C | 8 | Mehrteilige Synthesekarten (`J02`, `J04`, `W02`, `W04`, `W06`), Jgst.-6-Stoff (`J01`: reine rationale Multiplikation) oder Inhalte außerhalb des LehrplanPLUS M7 (`W07` Schwerpunkt 2:1, `W08` Eulersche Gerade & Schwerpunkt) bleiben aktiv (`keep-active`) |

In [replaces-de-by.json](../mathematik-gymnasium-7/replaces-de-by.json) steht `"status": "proposal-only"` und `"approved": null`. Bis zur ausdrücklichen Freigabe durch Thomas enthält [cell.json](../mathematik-gymnasium-7/cell.json) weder `replaces` noch `retired_items`. `mathematik-gymnasium-7/scripts/validate-cell.mjs` prüft die Konsistenz des Vorschlags sowie eine störungsfreie Installation der 44 Atome / 132 Karten neben den 12 unberührten Bestandskarten.

## Lehrervideos

Noch keine (`AGENTS.md` §4). Sie werden in einem späteren Schritt ergänzt und gegen den echten Titel geprüft.

## Registrierung

`academy.json`, `.github/workflows/ci.yml`, `.github/workflows/pages.yml` und `README.md` (inklusive Port `:5239`) führen `mathematik-gymnasium-7`.
