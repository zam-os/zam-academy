# Mathematik 12 Gymnasium: Lehrplan, Umfang und Nachweise

Stand: 8. November 2026. Das Paket umfasst 30 Lektionen in 5 Etappen mit 30 Atomen und 90 Karten.

## Offizielle Grundlage

Der aktuelle [Fachlehrplan M12 (regulär)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/mathematik/regulaer) wurde am 08.11.2026 direkt abgerufen (keine Archivfassung). Am Gymnasium gibt es in der Oberstufe keine Zweige. Stunden und Erwartungen stehen wortgleich in [source.json](../mathematik-gymnasium-12/src/curriculum/source.json), die Zuordnung in [coverage.json](../mathematik-gymnasium-12/coverage.json).

| Inhalt | LB | Stunden | Erwartungen | Lektionen |
| --- | --- | --- | --- | --- |
| 1.1 Ganzrationale Funktionen (mit Parametern) | 1 | 8 | 2 | 2 |
| 1.2 Natürliche Exponentialfunktion | 1 | 20 | 4 | 4 |
| 1.3 Sinus- und Kosinusfunktion | 1 | 5 | 2 | 2 |
| Zufallsgrößen und Binomialverteilung | 2 | 22 | 5 | 5 |
| Einseitiger Signifikanztest (bei als binomialverteilt angenommenen Merkmalen) | 3 | 8 | 4 | 4 |
| 4.1 Gebrochen-rationale Funktionen | 4 | 12 | 3 | 3 |
| 4.2 Wurzelfunktion | 4 | 9 | 3 | 3 |
| 4.3 Natürliche Logarithmusfunktion | 4 | 8 | 2 | 2 |
| Grundlagen der Koordinatengeometrie im Raum | 5 | 20 | 5 | 5 |
| **Gesamt** | **1–5** | **112** | **30** | **30** |

Die Vertragstests prüfen alle 30 Erwartungen wortgleich, mindestens eine Lektion je Zeile, dass jede Lektion in mindestens einer Zeile vorkommt und dass sie zum Lernbereich der Zeile gehört.

## Fachliche Entscheidungen

**Umfang und Jahrgangsstufe.** Die Querverweise des Fachlehrplans knüpfen an die Jahrgangsstufe 11 an (Ganzrationale Funktionen, Ableitungsbegriff, Integral als Flächeninhalt, Baumdiagramme und Pfadregeln). In der 12. Klasse werden Kurvenscharen mit Parametern, Kettenregel, Produktregel, Stammfunktionen, Exponential- und trigonometrische Funktionen sowie Verknüpfungen vertieft. Gebrochen-rationale Funktionen werden nicht nur hinsichtlich Definitionslücken, Polstellen und Asymptoten untersucht, sondern gemäß Lehrplan auch gezielt mit den Methoden der Differentialrechnung (Quotientenregel, Extrema, Monotonie). Die Stochastik umfasst Kolmogorow-Axiomatik, Erwartungswert und Varianz diskreter Zufallsgrößen, Urnenmodelle mit und ohne Zurücklegen, Bernoulli-Ketten, Parameter der Binomialverteilung sowie einseitige Hypothesentests mit Fehlern 1. und 2. Art. Die Raumgeometrie führt das 3D-Koordinatensystem, Vektoralgebra, Skalarprodukt, Vektorprodukt und Spatprodukt an Raumkörpern ein.

**Was auf Papier oder Rechner bleibt.** Das Zeichnen mit dynamischer Geometriesoftware (DGS), 3D-Visualisierern oder CAS-Einsatz steht im Plan und wird in den Lektionen methodisch erklärt; die App visualisiert die dynamischen Zusammenhänge in interaktiven SVG-Laboren und überprüft das Begriffs- und Rechenverständnis im Schnellcheck sowie in zweistufigen Generatoren.

**Lehrervideos.** Gemäß Vorgabe (Thomas' Entscheidung vom 22.10.2026) enthält ein neues Paket zunächst keine Lehrervideos (`teacherVideo: undefined`); diese werden in einem separaten Schritt ergänzt und über die oEmbed-API verifiziert.

## Bestandsabgleich der alten Karten

Drei alte `de-by`-Zellen in `zam-os/zam` (Commit `e6a235f75fe87b9d57af38bd61011027b891492c`) enthalten 12 Karten:
1. `de-by:gymnasium-12-mathematik-e-funktion-kettenregel-produktregel` (4 Karten)
2. `de-by:gymnasium-12-mathematik-hypothesentests-signifikanzniveau-fehler-1-und-2-art` (4 Karten)
3. `de-by:gymnasium-12-mathematik-lineare-gleichungssysteme-gauss-matrizen` (4 Karten)

Bytegleiche LF-Schnappschüsse liegen unter `mathematik-gymnasium-12/tests/fixtures/` mit SHA-256 in [replaces-de-by.json](../mathematik-gymnasium-12/replaces-de-by.json).

| Kategorie | Anzahl | Bedeutung |
| --- | --- | --- |
| A (vorgeschlagen) | 2 | Gleicher Einzelabruf: `g12-exp-ableitung-regeln-check`, `g12-hypo-fehlerarten-check` |
| B | 0 | Keine mehrteilige Karte wird unverändert übernommen |
| C (bleiben aktiv) | 10 | Verbleibende Einzelkarten oder mehrteilige Prompts (inkl. `01K8GC20000000000000000J01`); bleiben ohne Nachfolger aktiv |

Gemäß Hard Rule 1 und Hard Rule 6 gilt:
- In `replaces-de-by.json`: `"approved": null`, `"status": "proposal-only"`.
- In `cell.json`: Veröffentlichung zunächst **ohne** `replaces` und **ohne** `retired_items`.
- Die Übernahme der zwei A-Historien ist vorbereitet und in `scripts/validate-migration.mjs` gegen temporäre SQLite-Datenbanken nachgewiesen. Erst nach Thomas' ausdrücklicher Freigabe wird `approved` datiert und `replaces` in die Zelle eingetragen.
