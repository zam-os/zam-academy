# Bestandsabgleich Biologie 5 Realschule

Stand: `2026-11-13`

## 1. Lehrplan-Abgleich (LehrplanPLUS Realschule Biologie 5)

- Quelle: `https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/biologie`
- SHA-256 der abgerufenen Seite: `bf0200c662214e1732ff4abc9225e2d6d345fe3bc13e1e58a2cfc24ae27424c6`
- Alle 40 Kompetenzerwartungen der Lernbereiche `1.1` (11 Zeilen), `1.2` (7 Zeilen), `1.3` (3 Zeilen), `2` (5 Zeilen), `3` (5 Zeilen) und `4` (9 Zeilen) sind wörtlich in `biologie-realschule-5/coverage.json` hinterlegt und gegen den bereinigten Lehrplantext geprüft (`40 rows, 0 not found`).
- Alle 25 Lektionen des Kurses treten in `coverage.json` auf (`optional_lessons: []`).

## 2. Abgleich vorhandener ZAM-Altkarten (`replaces-de-by.json`)

- Quell-Repository: `zam-os/zam`, Commit `b7fdfcc4e30d21bbbd97fb2025952ff7f4e296ac`
- Einbezogene Bündel (LF-Snapshots in `biologie-realschule-5/tests/fixtures/`):
  1. `de-by:realschule-5-biologie-mensch-skelett-bewegung-organe` (8 Karten, `01K4B5M0000000000000000J01`..`J08`)
  2. `de-by:realschule-5-biologie-pflanzen-bluetenbau-samen` (8 Karten, `01K4B5P0000000000000000J01`..`J08`)
  3. `de-by:realschule-5-natur-technik-mikroskop-experiment-dateien` (8 Karten, `01K4T5N0000000000000000J01`..`J08`)
- Status in `replaces-de-by.json`: `proposal-only`, `"approved": null`. Bis zur ausdrücklichen Freigabe durch Thomas deklariert `biologie-realschule-5/cell.json` keine `replaces` und keine `retired_items`.

| Kategorie | Anzahl | Bedeutung im Vorschlag |
| --- | --- | --- |
| **A** (`propose-replace-after-approval`) | `5` | `Mensch J01 -> b5-skelett-wirbelsaeule-check` (Doppel-S-Form Wirbelsäule), `Mensch J03 -> b5-muskeln-gelenke-check` (Trizeps als Gegenspieler zum Bizeps), `Pflanzen J03 -> b5-bluete-vielfalt-check` (3 Teile des Stempels), `NuT J01 -> b5-erkenntnisweg-check` (Hypothese), `NuT J03 -> b5-mikroskop-check` (Gesamtvergrößerung). |
| **B** | `0` | Keine Sammel-Übertragung. |
| **C** (`keep-active`) | `19` | Mehrteilige Sammel- und Feinbaufragen (`Mensch J02, J04`, `Pflanzen J01, J02, J04–J08`, `NuT J02, J04`), Themen aus Biologie 6 LB 2 (`Mensch J05–J08` zur Sexualbiologie) sowie Informatik-Inhalte aus NuT 5 (`NuT J05–J08` zu Objektorientierung und Dateisystem). Keine Karte wird stillgelegt. |

### Offene Frage für die Review durch Thomas

1. Soll die vorgeschlagene **5-A / 19-C-Zuordnung** freigegeben werden (oder erst nach der Erstveröffentlichung)?
2. Bestätigt die Einbindung der **NuT-5-Zelle** (`J01`, `J03` als Biologie-Anteil, `J05–J08` als Informatik `keep-active`), dass die beiden Mikroskop-/Erkenntnisweg-Karten künftig zu `biologie-realschule-5` gehören?
