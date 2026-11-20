# Informatik 6 Mittelschule · Lehrplanabgleich und Bestandsabgleich

Stand: 20. November 2026. Paket: [`informatik-mittelschule-6/`](../informatik-mittelschule-6/), 12 Lektionen in 2 Etappen, 36 Abrufkarten in der Zelle `zam-academy:informatik-mittelschule-6` (Version `2026.11.1`).

## Lehrplanbasis (LehrplanPLUS Bayern)

Für Informatik in Jahrgangsstufe 6 weist LehrplanPLUS Bayern einen gemeinsamen Fachlehrplan für alle 6. Klassen der Mittelschule aus (ohne eigene Stundenzahlen auf der Lehrplanseite; eigene Fachlehrpläne für Regelklasse und Mittlere-Reife-Klasse erscheinen erst ab Jahrgangsstufe 7). Laut Abschnitt 3.1 des Fachprofils Informatik umfasst der Lehrplan in den Jahrgangsstufen 5 und 6 nur zwei Lernbereiche, damit Raum für den Lehrgang Tastschreiben bleibt:

- **Fachlehrplan Inf6:** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/informatik>
- **Fachprofil Informatik Mittelschule (3.1 Aufbau):** <https://www.lehrplanplus.bayern.de/fachprofil/mittelschule/informatik>
- **Geprüft am:** 20. November 2026 (live abgerufen)
- **Archivierter HTML-Snapshot:** [`informatik-mittelschule-6/tests/fixtures/curriculum.html`](../informatik-mittelschule-6/tests/fixtures/curriculum.html)
- **SHA-256:** `42d74b9865187ac281d1875d10b18abd7e10f4f74985895374fa3b887220b7f8`

Alle 6 Kompetenzerwartungen und 7 Inhaltsspiegelstriche aus `Inf6 Lernbereich 1` und `Inf6 Lernbereich 2` sind wortgetreu in [`informatik-mittelschule-6/coverage.json`](../informatik-mittelschule-6/coverage.json) erfasst. Die Prüfung mit `node informatik-mittelschule-6/scripts/check-curriculum.mjs` bestätigt **13 Zeilen, 0 fehlend** (`checked 6 competences + 7 content bullets = 13 rows across 12 lessons, 0 missing`).

| Lernbereich | Kompetenzen | Inhalte | Lektionen | Status in der App |
| --- | ---: | ---: | ---: | --- |
| `Inf6 LB 1` Digitaler Informationsaustausch | 3 | 5 | 6 | 2 `implemented`, 1 `supported` (`LB 1 #1`) |
| `Inf6 LB 2` Programmieren | 3 | 2 | 6 | 1 `implemented`, 2 `supported` (`LB 2 #2`, `LB 2 #3`) |

### Was im Präsenzunterricht bleibt (`status: "supported"`)

- **`Inf6 LB 1 #1`:** Die App trainiert verfeinerte Suchstrategien, Qualitätskriterien (Informationsgehalt, Vertrauenswürdigkeit/Impressum, Aktualität, Zweitquelle) und Medienwirkung an lokalen Suchtreffern und Quellenbeispielen; das selbständige Sammeln und Bewerten echter Online-Quellen zu eigenen Themen bleibt im Unterricht.
- **`Inf6 LB 2 #2`:** In den Werkstätten werden Anweisungen, Sequenzen, Alternativen, bedingte Wiederholungen und Schachtelungen auf Spielfeldern mit Nassi-Shneiderman-Struktogrammen modelliert und direkt ausgeführt; das eigenständige Implementieren in der jeweiligen schulischen Entwicklungsumgebung bleibt Teil des Unterrichts.
- **`Inf6 LB 2 #3`:** Die Test- und Optimierungswerkstatt prüft Normal- und Randfälle (z. B. Ganglänge 0 und 5), Logikfehler und Optimierungsschritte lokal; das Testen und Verbessern eigener Schulprogramme erfolgt in der Lernumgebung der Klasse.

### Abgrenzung zu Nachbarjahrgängen

- **Aufbauend auf Informatik 5 (`Inf5`):** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/informatik> — Verfeinerte Suchstrategien schließen an einfache Internetdienste/Textsuche aus Klasse 5 an, Urheberrecht und Lizenzen bauen auf erste Quellenangaben auf, und bedingte Wiederholungen/Alternativen/Schachtelungen knüpfen an den Algorithmus-Begriff, Sequenzen, feste Wiederholungen (`wiederhole n-mal`) und Struktogramme aus Klasse 5 an.
- **Abgrenzung zu Informatik 7 (`Inf7`):** Ab Jahrgangsstufe 7 liegen getrennte Fachlehrpläne für die Regelklasse (<https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/regelklasse>) und die Mittlere-Reife-Klasse (<https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/mittlere-reife-klasse>) vor. Dort folgen Kommunikationsplattformen/-dienste (inkl. Spam und Phishing), Raster- und Vektorgrafiken mit objektorientierter Sichtweise (Objekte, Attribute, Attributwerte) sowie Methoden und — in der Mittlere-Reife-Klasse — Variablenkonzepte (`Bezeichner`, `Datentypen`); diese Inhalte werden in Klasse 6 bewusst ausgespart.

## Bestehende ZAM-Karten (`replaces-de-by.json`)

In `zam-os/zam` (Stand `source_commit`: `1ff016cfd7a0765c5338eb4248d0c14f3b92261c`) existieren in `bundled-cells.ts` und `tests/fixtures/curriculum/` keine `de-by`-Zellen zur Mittelschule Informatik. Die vorhandenen Informatik-Zellen gehören zum Gymnasium bzw. den Realschul-Paketen (`informatik-realschule-8`, `informatik-realschule-10`, `informatik-gymnasium-6`) und bleiben unberührt.

[`informatik-mittelschule-6/replaces-de-by.json`](../informatik-mittelschule-6/replaces-de-by.json) ist als `proposal-only` (`approved: null`, leere `sources` und `rows`) hinterlegt; [`informatik-mittelschule-6/cell.json`](../informatik-mittelschule-6/cell.json) deklariert weder `replaces` noch `retired_items`.
