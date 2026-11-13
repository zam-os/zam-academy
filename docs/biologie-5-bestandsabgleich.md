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
- Status in `replaces-de-by.json`: `approved`, `"approved": "2026-11-13"` (Freigabe durch Thomas am `2026-11-13`: *„Freigabe erteilt - Du darfst als admin mergen“*). Die 5 Kategorie-A-Nachfolger in `biologie-realschule-5/cell.json` tragen jeweils `replaces`; alle 19 Kategorie-C-Karten bleiben ohne `retired_items` aktiv.

| Kategorie | Anzahl | Bedeutung im Mapping |
| --- | --- | --- |
| **A** (`replace`) | `5` | `Mensch J01 -> b5-skelett-wirbelsaeule-check` (Doppel-S-Form Wirbelsäule), `Mensch J03 -> b5-muskeln-gelenke-check` (Trizeps als Gegenspieler), `Pflanzen J03 -> b5-bluete-vielfalt-check` (3 Teile des Stempels), `NuT J01 -> b5-erkenntnisweg-check` (Hypothese), `NuT J03 -> b5-mikroskop-check` (Gesamtvergrößerung). |
| **B** | `0` | Keine Sammel-Übertragung. |
| **C** (`keep-active`) | `19` | Mehrteilige Sammel- und Feinbaufragen (`Mensch J02, J04`, `Pflanzen J01, J02, J04–J08`, `NuT J02, J04`), Themen aus Biologie 6 LB 2 (`Mensch J05–J08` zur Sexualbiologie) sowie Informatik-Inhalte aus NuT 5 (`NuT J05–J08` zu Objektorientierung und Dateisystem). Keine Karte wird stillgelegt. |

### Freigabe durch Thomas

- Am `2026-11-13` erteilte Thomas die Freigabe für das **5-A / 19-C-Mapping** (einschließlich der Übernahme von `NuT 5 J01` und `J03` als Biologie-Anteil sowie des Ausschlusses der unten genannten Nachbar- und Gymnasium-5-Zellen).
- `biologie-realschule-5/scripts/validate-migration.mjs` prüft die vollständige Historienübernahme, das Aktivbleiben aller 19 Kategorie-C-Karten, die Idempotenz wiederholter Installationen und den Kollisionsabbruch bei doppelt vorhandenen Karten.

## 3. Abgrenzung zu Nachbarjahrgängen und Gymnasium (`AGENTS.md` § 6)

Folgende benachbarte Bündel im Quell-Repository `zam-os/zam` liegen außerhalb von Realschule Biologie 5 und wurden **bewusst nicht** in `replaces-de-by.json` aufgenommen (`nicht Teil dieses Mappings`):

- `de-by:realschule-6-biologie-saeugetiere-wirbeltiere-hunde-katzen` (Realschule Jahrgangsstufe 6, eigene Wirbeltier-Inhalte)
- `de-by:realschule-6-biologie-voegel-fische-amphibien-reptilien` (Realschule Jahrgangsstufe 6, Wirbeltierklassen)
- `de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie` (Gymnasium Natur und Technik 5, enthält zudem Sexualbiologie, die an der Realschule in Klasse 6 liegt)
- `de-by:gymnasium-5-biologie-pflanzen-bluetenbau-samen` (Gymnasium Natur und Technik 5, andere Schulart)
- `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop` (Gymnasium Natur und Technik 5, andere Schulart)
