# Mathematik 11 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 8. November 2026. Das Paket umfasst 28 Lektionen in 5 Etappen mit 28 Atomen und 84 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M11](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/11/mathematik) wurde am 08.11.2026 direkt abgerufen, keine Archivfassung (SHA-256 der Seite in [source.json](../mathematik-gymnasium-11/src/curriculum/source.json)). Am Gymnasium gibt es in Mathematik keine Zweige. Die 26 Kompetenzerwartungen stehen wortgleich in `source.json` (Hoch- und Tiefstellungen als Unicode), die Zuordnung in [coverage.json](../mathematik-gymnasium-11/coverage.json).

| Lernbereich | Stunden | Erwartungen | Etappe | Lektionen |
| --- | --- | --- | --- | --- |
| 1 Spezielle Eigenschaften von Funktionen | 14 | 5 | 1 | 6 |
| 2 Gebrochen-rationale Funktionen – Grenzwerte und Asymptoten | 15 | 5 | 2 | 5 |
| 3 Bedingte Wahrscheinlichkeit und stochastische Unabhängigkeit | 15 | 4 | 3 | 4 |
| 4.1 Lokales und globales Differenzieren | 19 | 7 | 4 | 7 |
| 4.2 Anwendung der Differentialrechnung bei der Untersuchung ganzrationaler Funktionen | 18 | 5 | 5 | 6 |

Die Vertragstests prüfen die wortgleichen 26 Erwartungen, mindestens eine Lektion je Zeile, dass jede Lektion in mindestens einer Zeile vorkommt und dass sie zum Lernbereich (bei LB 4 zum Teil 4.1 oder 4.2) der Zeile gehört. Zwei Erwartungen sind auf zwei Lektionen verteilt: Transformationen (1.4 und 1.5, die Reihenfolge der Schritte bekommt eine eigene Lektion) und Monotonie mit Extremstellen (5.1 und 5.2).

## Fachliche Entscheidungen

**Nachbarjahrgänge.** Das Paket baut auf M10 Gymnasium auf (Exponentialfunktionen, Sinusfunktion in der Form a · sin(b · (x + c)) + d, ganzrationale Funktionen mit Symmetrie, Nullstellen und Substitution, Pfadregeln) und sagt das an den Stellen, wo es wiederholt. Der Fachlehrplan M12 ist unter der LehrplanPLUS-Adresse am 08.11.2026 noch nicht veröffentlicht; Integralrechnung, Produkt- und Kettenregel, Extremwertprobleme mit Nebenbedingung und die Binomialverteilung nennt M11 nicht, deshalb kommen sie hier nicht vor. Polynomdivision und das f‴-Kriterium nennt M11 ebenfalls nicht; Wendestellen werden über den Vorzeichenwechsel von f″ begründet.

**Software.** Der Plan verlangt mehrfach Mathematiksoftware, Funktionenplotter und Tabellenkalkulation. Die Labore übernehmen die Rolle der dynamischen Software (Schieberegler, ziehbare Punkte, Grenzprozess h → 0, Newton-Tangenten); die Aufgaben zum Newton-Verfahren rechnen in der Form einer Tabellenkalkulation. Eigene Arbeit mit einem Plotter, Skizzen auf Papier und das Präsentieren geschehen außerhalb der App; `coverage.json` nennt das in der jeweiligen Zeile.

**Schreibweise.** D_f und W_f für Definitions- und Wertemenge, P_B(A) für bedingte Wahrscheinlichkeiten, f′ und f″, lim<sub>x→x₀⁻</sub> für einseitige Grenzwerte, Intervalle wie ]−∞; −1]. In Readouts und Schnellchecks werden P_B(A) und D_f als Tiefstellung dargestellt.

## Bestandsabgleich der alten Karten

Vier `de-by`-Zellen in zam-os/zam (Commit `f57e6740854a2f91f985b59b9e101b388186d3bc`) enthalten 16 Karten zu „Mathematik 11 Gymnasium“, bytegleich unter `mathematik-gymnasium-11/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../mathematik-gymnasium-11/replaces-de-by.json). Sie folgen inhaltlich einem älteren Plan: Nur die Kurvendiskussion gehört zu M11.

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A | 1 | Gleicher Einzelabruf, ein Nachfolger: `01K8GB00000000000000000J01` (f″(x₀) < 0 hinreichend für einen Hochpunkt) → `m11-hochpunkt-f2` |
| B | 0 | Keine mehrteilige Karte wird ganz übernommen |
| C | 15 | Mehrteilig oder außerhalb des Plans M11 (Extremwertprobleme, Integralrechnung, Ebenen und Abstände, Binomialverteilung); bleiben aktiv und bekommen keinen Nachfolger |

Die Zuordnung ist ein Vorschlag (`"status": "proposal-only"`, `"approved": null`). Die Zelle erscheint deshalb ohne `replaces` und ohne `retired_items`; `scripts/validate-migration.mjs` probt die vorgeschlagene Übertragung nur in Wegwerf-Datenbanken. Nach Thomas' Freigabe folgt eine Version mit `replaces` am Nachfolger.

Nicht abgebildet ist die Zelle `de-by:gymnasium-10-mathematik-ganzrationale-funktionen-ableitung-differentialrechnung`. Ihr zweites Atom (Differenzenquotient, Ableitungsregeln) behandelt Stoff, der im neunjährigen Gymnasium in M11 liegt; die Zelle gehört aber zu Jahrgangsstufe 10 und wird mit dem Paket Mathematik 10 Gymnasium abgeglichen, damit keine Karte zweimal zugeordnet wird.

## Registrierung

`academy.json` kennt die Schulart `gymnasium` bereits; das Paket steht neben Mathematik 5 Gymnasium. Es ist in der CI-Matrix (mit Migrationsschritt), in der Pages-Liste und in der README eingetragen; Dev-Port 5224. ZAM bindet die Zelle erst nach ihrer Veröffentlichung mit `npm run academy:sync` ein.
