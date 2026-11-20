# Informatik 6 Mittelschule · Lehrplanabgleich und Bestandsabgleich

Stand: 20. November 2026. Paket: [`informatik-mittelschule-6/`](../informatik-mittelschule-6/), 12 Lektionen in 2 Etappen, 36 Abrufkarten in der Zelle `zam-academy:informatik-mittelschule-6` (Version `2026.11.1`).

## Lehrplanbasis (LehrplanPLUS Bayern)

An der bayerischen Mittelschule wird Informatik in Jahrgangsstufe 6 als 1-stündiges Pflichtfach laut BayMSO Anlage 1 gemeinsam für alle 6. Klassen (noch ohne Differenzierung in Regelklasse und M-Zug, die erst ab Jahrgangsstufe 7 beginnt) unterrichtet:

- **Quelle:** <https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/informatik>
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

- **Aufbauend auf Informatik 5 (`Inf5`):** Verfeinerte Suchstrategien schließen an einfache Internetdienste/Textsuche aus Klasse 5 an, Urheberrecht und Lizenzen bauen auf erste Quellenangaben auf, und bedingte Wiederholungen/Alternativen/Schachtelungen knüpfen an den Algorithmus-Begriff, Sequenzen, feste Wiederholungen (`wiederhole n-mal`) und Struktogramme aus Klasse 5 an.
- **Abgrenzung zu Informatik 7 (`Inf7`):** Variablen/Datentypen (`Bezeichner`, `Datentypen`), Objektorientierung (Objekte, Attribute, Methoden), Raster-/Vektorgrafik-Bildbearbeitung sowie Kommunikationsplattformen/Phishing/Spam folgen erst ab Jahrgangsstufe 7 und werden bewusst ausgespart.

## Bestehende ZAM-Karten (`replaces-de-by.json`)

In `zam-os/zam` (Stand `source_commit`: `1ff016cfd7a0765c5338eb4248d0c14f3b92261c`) existieren in `bundled-cells.ts` und `tests/fixtures/curriculum/` keine `de-by`-Zellen zur Mittelschule Informatik. Die vorhandenen Informatik-Zellen gehören zum Gymnasium bzw. den Realschul-Paketen (`informatik-realschule-8`, `informatik-realschule-10`, `informatik-gymnasium-6`) und bleiben unberührt.

[`informatik-mittelschule-6/replaces-de-by.json`](../informatik-mittelschule-6/replaces-de-by.json) ist als `proposal-only` (`approved: null`, leere `sources` und `rows`) hinterlegt; [`informatik-mittelschule-6/cell.json`](../informatik-mittelschule-6/cell.json) deklariert weder `replaces` noch `retired_items`.
