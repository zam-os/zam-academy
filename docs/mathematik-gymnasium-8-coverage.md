# Mathematik 8 Gymnasium — Lehrplanabgleich & Bestandsaufnahme

Stand: 2026-11-28 · Paket: [`mathematik-gymnasium-8`](../mathematik-gymnasium-8/) (`version: "0.0"`, `status: "ready"`)

## 1. Lehrplanquelle

- **URL:** <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/mathematik>
- **Abrufdatum:** 2026-11-28 (direkter Abruf des aktuellen G9-Fachlehrplans, keine Archivfassung)
- **HTML SHA-256:** `609b4a0efdd58aa72d818d2905ecc9dbeeebb070cc4654f774dc18731cd9e190`
- **Eingebettete ISB-Formel-SVGs (im Browser gerendert geprüft):**
  - `GYM_M_8-1.svg` (LB 3.1 und LB 3.2): `x ↦ a/(x + b) + c`
  - `GYM_M_8-2.svg` (LB 3.3): `y = a/x`
- **Zweigstruktur:** Am Gymnasium gibt es in Jahrgangsstufe 8 keine Ausbildungsrichtungen/Zweige; alle Lernbereiche gelten einheitlich, die Atome in [`cell.json`](../mathematik-gymnasium-8/cell.json) tragen kein Feld `track`.
- **Wortlautprüfung:** Alle **27 Kompetenzerwartungen** in [`coverage.json`](../mathematik-gymnasium-8/coverage.json) wurden automatisiert gegen den bereinigten Text des abgerufenen Fachlehrplans geprüft (`27 rows, 0 not found`).

## 2. Lernbereiche, Stunden und Abdeckung

| Lernbereich | Stunden | Kompetenzen | Status in `coverage.json` | Lektionen | ZAM-Karten |
| --- | --- | --- | --- | --- | --- |
| LB 1 Funktion und Term | 8 | 3 | 2 `supported`, 1 `implemented` | 5 | 15 |
| LB 2 Lineare Funktionen | 16 | 5 | 1 `supported`, 4 `implemented` | 8 | 24 |
| LB 3 Elementare gebrochen-rationale Funktionen | 13 | 3 | 2 `supported`, 1 `implemented` | 5 | 15 |
| LB 4 Bruchterme und Bruchgleichungen | 13 | 5 | 5 `implemented` | 7 | 21 |
| LB 5 Laplace-Experimente | 14 | 4 | 1 `supported`, 3 `implemented` | 6 | 18 |
| LB 6 Lineare Gleichungssysteme | 10 | 3 | 3 `implemented` | 5 | 15 |
| LB 7 Kreis und Zylinder | 10 | 4 | 3 `supported`, 1 `implemented` | 6 | 18 |
| **Gesamt** | **84** | **27** | **9 `supported`, 18 `implemented`** | **42** | **126** |

### Ausdrücklich nur unterstützt (`status: "supported"`)

Gemäß `AGENTS.md` § 1 sind Kompetenzerwartungen mit Werkzeug- oder Handlungsanteilen außerhalb einer Web-App nicht als vollständig ersetzt beansprucht:

- **LB 1.1 (`ft-1-zusammenhaenge`) & LB 5.2 (`la-2-haeufigkeit`, `la-3-tabelle-sim`):** Das Paket simuliert Wertetabellen, relative/absolute Zellbezüge (`=B2/$B$5`) und Serien nach dem Gesetz der großen Zahlen; das eigene Ausführen realer Zufallsversuche sowie die Arbeit in einer externen Tabellenkalkulation bleiben im Unterricht.
- **LB 1.2 (`ft-2-eindeutigkeit`, `ft-3-fachbegriffe`), LB 2.1 (`lf-1-parameter`, `lf-2-zeichnen-ablesen`), LB 3.1 (`gr-1-defmenge`–`gr-3-achsen`) & LB 3.2 (`gr-4-graph-parameter`):** Die interaktiven Graphenlabore zeigen Steigungsdreiecke, Polstellen und Verschiebungen direkt; die Nutzung externer Funktionenplotter bzw. dynamischer Mathematiksoftware sowie das händische Zeichnen von Graphen und Hyperbeln auf Papier erfolgen im Unterricht.
- **LB 7.1 (`kz-1-pi-umfang`–`kz-3-kreisteile`), LB 7.2 (`kz-4-schraegbild-netz`) & LB 7.4 (`kz-6-modellieren`):** Das Messen realer runder Gegenstände zur Bestimmung von π, das händische Skizzieren von Schrägbildern und Körpernetzen auf Papier sowie eigenständige Internetrecherchen, Dokumentationen und Präsentationen geschehen im Unterricht.

## 3. Abgrenzung zu Nachbarjahrgängen

- **Rückgriff auf M7:** Termstruktur, Distributivgesetz beim Ausklammern, binomische Formeln/Umformungsvorteile (soweit für Faktorisieren in LB 4 benötigt) und lineare Äquivalenzumformungen knüpfen direkt an Mathematik 7 Gymnasium an (`bt-1-erweitern-kuerzen`, `lg-1-aufstellen`).
- **Keine Vorgriffe auf M9+:** Quadratische Funktionen und Parabelgleichungen, Satz des Pythagoras, Strahlensätze, Trigonometrie (Sinus/Kosinus/Tangens), Pyramide/Kegel/Kugel, allgemeine Pfadmultiplikationsregel (`1./2. Pfadregel`), Ziehen ohne Zurücklegen und bedingte Wahrscheinlichkeit werden nicht vorweggenommen. In LB 5 werden zweistufige Laplace-Experimente über Zählprinzip und gleichwahrscheinliche Pfade behandelt.

## 4. Bestandsabgleich alter `de-by`-Zellen (`proposal-only`)

Die zwei vorhandenen Jahrgangsstufen-8-Zellen aus `zam-os/zam` (`main`, Commit `c92f4e383385ee487cd8b30f73b3bf3cb27b0860`) liegen bytegleich als LF-Schnappschüsse in `mathematik-gymnasium-8/tests/fixtures/`. Benachbarte `de-by`-Zellen aus M7 (bereits von `mathematik-gymnasium-7` abgedeckt) und M9 (`Quadratische Funktionen`, `Pythagoras`, `Trigonometrie`, `Pyramide/Kegel/Kugel`, `Bedingte Wahrscheinlichkeit`) bleiben unberührt.

Die Zuordnung in [`replaces-de-by.json`](../mathematik-gymnasium-8/replaces-de-by.json) ist ein reiner Vorschlag (`status: "proposal-only"`, `approved: null`): In [`cell.json`](../mathematik-gymnasium-8/cell.json) stehen **keine** `replaces` und **keine** `retired_items`, bis Thomas entscheidet.

| `de_by`-Zelle & Item-ID | Tier | Kategorie & Vorschlag | Vorgeschlagener Slug | Begründung |
| --- | --- | --- | --- | --- |
| `…lineare-funktionen-gleichungssysteme` · `…J01` | `tier1_fast` | **C** (`keep-active`) | `—` | Orthogonalität `g₂ ⊥ g₁` (`m₁·m₂ = −1`) kommt im LehrplanPLUS M8 Gymnasium nicht vor. |
| `…lineare-funktionen-gleichungssysteme` · `…J02` | `tier2_synthesis` | **C** (`keep-active`) | `—` | 4-teilige Synthesekarte (Parameter, Nullstelle, Orthogonalität, Zweipunktgleichung). |
| `…lineare-funktionen-gleichungssysteme` · `…J03` | `tier1_fast` | **A** (`propose-replace-after-approval`) | `lg-5-loesbarkeit-eindeutig` | Gleiche atomare Abfrage zur geometrischen Deutung einer eindeutigen 2×2-Lösung als einen Schnittpunkt. |
| `…lineare-funktionen-gleichungssysteme` · `…J04` | `tier2_synthesis` | **C** (`keep-active`) | `—` | 5-teilige Synthesekarte über alle drei LGS-Verfahren, Lösungsfälle und Rechenaufgabe. |
| `…wahrscheinlichkeit-kreisgeometrie-bruchterme` · `…J01` | `tier1_fast` | **C** (`keep-active`) | `—` | 1. Pfadregel (Pfadmultiplikation) gehört erst zu M9 LB 3; M8 zählt gleichwahrscheinliche Pfade über das Zählprinzip. |
| `…wahrscheinlichkeit-kreisgeometrie-bruchterme` · `…J02` | `tier2_synthesis` | **C** (`keep-active`) | `—` | Mehrteilige Synthesekarte inkl. 1./2. Pfadregel und Ziehen ohne Zurücklegen (M9). |
| `…wahrscheinlichkeit-kreisgeometrie-bruchterme` · `…J03` | `tier1_fast` | **A** (`propose-replace-after-approval`) | `kz-2-kreisflaeche-formel` | Gleiche atomare Wissensabfrage zur Kreisflächenformel `A = π · r²`. |
| `…wahrscheinlichkeit-kreisgeometrie-bruchterme` · `…J04` | `tier2_synthesis` | **C** (`keep-active`) | `—` | Sammelkarte über Kreis/Sektor (`LB 7`) und Bruchterme (`LB 4`) über zwei Lernbereiche hinweg. |

## 5. Offene Punkte vor Freigabe

- **Lehrkraftprüfung:** Paket startet bei Version `0.0` (`publication.json`).
- **Lehrervideos:** Noch nicht ergänzt; werden nach `AGENTS.md` § 4 in einem eigenen Schritt nachgetragen und per YouTube-oEmbed verifiziert.
- **Mapping-Freigabe:** `replaces-de-by.json` steht auf `approved: null`; der Katalogschritt bleibt solange auf Vorschlag ohne Verlaufübertrag.
