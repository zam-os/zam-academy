# HSU 4 Grundschule Bayern — Curriculum Check, Concept & ZAM Cell Inventory

## 1. Official Curriculum Source

- **Curriculum**: *LehrplanPLUS Bayern — Fachlehrplan Heimat- und Sachunterricht 3/4 (Grundschule, Jahrgangsstufe 4)*
- **Source URLs checked on `2026-11-03`** (direct `curl -sL`, HTTP 200):
  - Grade 4 HSU (*HSU 3/4*): `https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/hsu`
    - Raw HTML SHA-256: `5be84bd91c285ac3a79e4a5b8153f810105a5ebfaafb4d9b0fc049cde497f6`
  - Grade 2 HSU (*HSU 1/2*, prior-knowledge boundary): `https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/2/hsu`
    - Raw HTML SHA-256: `2d810cb1b7085f99375830a0b4a9a959d783009a09f6d2f834f674abfb91da32`
  - HSU *Fachprofil* (Grundschule): `https://www.lehrplanplus.bayern.de/fachprofil/grundschule/hsu`
  - Grade 5 Gymnasium follow-up boundaries:
    - *Natur und Technik 5*: `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/natur-und-technik`
    - *Geographie 5*: `https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie`
- **Track structure**: Bavarian Grundschule has one shared curriculum path (no *Wahlpflichtfächergruppen* / *Zweige*). *HSU* is one of the three core *Übertrittsfächer* alongside *Deutsch* and *Mathematik*.

## 2. Neighbouring-Grade Boundaries

- **Built upon from HSU 1/2** (referenced explicitly where revisited):
  - Basic pedestrian rules and school route (*Schulweg*), calendar/seasons/months, teeth & handwashing basics, naming common meadow/hedge plants, simple sorting of everyday waste, and basic thermometer reading.
- **Kept out because it belongs to Gymnasium / Realschule Grade 5+**:
  - Formal cell microscopy, organ systems at cellular/biochemical level, formal Mendelian genetics, and chemical reaction equations (*Natur und Technik 5+*).
  - Global climate zones, plate tectonics, latitude/longitude coordinate calculations, and planetary orbital mechanics (*Geographie 5+*).
  - Quantitative Ohm's law ($U = R \cdot I$), formal Newton force equations ($F = m \cdot a$), and torque formulas ($M = F \cdot r$) — Grade 4 investigates conductors/insulators, qualitative lever balance, stability, and bridge shapes through observation and hands-on experimentation.

## 3. Structure of `HSU 3/4` and Station Mapping

The official `HSU 3/4` curriculum contains **6 Lernbereiche**, **15 numbered Teilbereiche** (anchors `#26125`–`#26130`), and **75 verbatim Kompetenzerwartungen**. All 75 expectations are recorded verbatim in [`hsu-grundschule-4/coverage.json`](../hsu-grundschule-4/coverage.json) and mapped across **20 Forscher-Stationen**:

| Stage | Official Lernbereich & Teilbereiche | Stations (`lesson.id`) | Atoms / Cards |
| --- | --- | --- | --- |
| `lb1` | **LB 1: Demokratie und Gesellschaft** (1.1 Zusammenleben, 1.2 Gemeinde, 1.3 Arbeit, 1.4 Medien, 1.5 Konsum) | 1. `gemeinschaft-kinderrechte`<br>2. `unsere-gemeinde`<br>3. `medien-und-konsum` | 3 atoms / 9 cards |
| `lb2` | **LB 2: Körper und Gesundheit** (2.1 Sinne & Erste Hilfe, 2.2 Körper/Entwicklung/Gefühle) | 4. `wunderwerk-auge`<br>5. `wachsen-und-neues-leben`<br>6. `erste-hilfe-und-notruf`<br>7. `gefuehle-grenzen-wohlbefinden` | 4 atoms / 12 cards |
| `lb3` | **LB 3: Natur und Umwelt** (3.1 Lebensräume/Wald, 3.2 Pflanzen & Tiere, 3.3 Energie/Strom/Feuer, 3.4 Wasser, 3.5 Luft/Wetter, 3.6 Ressourcen/Abfall) | 8. `lebensraeume-wald-gewaesser`<br>9. `tierentwicklung-wolf-hund`<br>10. `bauernhof-und-lebensmittel`<br>11. `strom-und-energie`<br>12. `feuer-und-brandschutz`<br>13. `wasser-und-wasserkreislauf` | 6 atoms / 18 cards |
| `lb4` | **LB 4: Zeit und Wandel** (4.1 Zeiteinteilung/Quellen/Wandel) | 14. `zeitreise-und-quellen`<br>15. `wandel-fakten-fiktion` | 2 atoms / 6 cards |
| `lb5` | **LB 5: Raum und Mobilität** (5.1 Karten/Maßstab/Bayern/Europa, 5.2 Mobilität/Radfahren) | 16. `orientierung-und-kartenlesen`<br>17. `bayern-deutschland-welt`<br>18. `fahrrad-und-mobilitaet` | 3 atoms / 9 cards |
| `lb6` | **LB 6: Technik und Kultur** (6.1 Bauwerke/Hebel, 6.2 Werkzeuge/Erfindungen, 6.3 Arbeitsweisen) | 19. `werkzeuge-maschinen-produktion`<br>20. `bruecken-und-balance` | 2 atoms / 6 cards |

### Honest Pedagogical Boundaries

Screen-based activities prepare conceptual understanding, terminology, diagram reading, and transfer reasoning, while real-world HSU competences remain hands-on. Each row in `coverage.json` states clearly what the app trains directly and where real-world practice complements it (e.g., real *Jugendverkehrsschule* cycling exam in 5.2, real forest/meadow observation in 3.1, real first-aid practice in 2.1, real archive/museum sources in 4.1, and hands-on building with tools in 6.1/6.2).

## 4. Pedagogical Design: Single-Pass Station → ZAM Continuation

Unlike secondary-school drill apps, `hsu-grundschule-4` follows a **single-pass discovery model**:

- Learners complete each station once in *Lottas Bayern-Forscherbuch*:
  1. Illustrated story & rule (*Lottas Merksatz* + *Proben-Wissen*),
  2. 1 comprehension check (*Schlaufuchs-Check*),
  3. 3 interactive goals in the SVG *Mitmach-Labor* (0 goals pre-satisfied at start, every goal proven reachable by `tests/labs.test.ts`),
  4. 1 guided task (*Stufe 1 – Spürnase*) + 1 transfer/reasoning task (*Stufe 2 – Proben-Profi*, `REQUIRED_CORRECT_PER_LEVEL = 1`).
- Completing those four steps awards the station's collectible stamp and displays the **ZAM continuation box**, handing long-term retention and AI-assisted question variation over to `zam-academy:hsu-grundschule-4` (`cell.json`).

## 5. Legacy ZAM Card Inventory & `curricula` Binding

- **Legacy `de-by` check**: Checked all existing `replaces-de-by.json` files, bundled fixtures, and `zam-core@0.54.0` validation rules. ZAM currently holds **zero** legacy `de-by` cells for Grundschule *Heimat- und Sachunterricht* (`HSU`). Consequently, `cell.json` introduces 20 fresh atoms and 60 fresh ULID items with no `replaces` or `retired_items`, and no history-transfer migration is required.
- **Draft `publication.json` & `curricula` binding**:
  - `hsu-grundschule-4/publication.json` sets `"status": "local-only"`, keeping the draft out of the public `catalog.json`, `academy.json`, and GitHub Pages deployment until reviewed and approved for publication.
  - Matching `mathematik-grundschule-4`, atoms in `cell.json` bind `zam-academy-stage` (`lb1`–`lb6`) and defer official `lehrplanplus-bayern` grade bindings until public release coordination (`scripts/validate-cell.mjs` enforces this invariant).
