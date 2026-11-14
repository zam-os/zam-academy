# Natur und Technik 5 Mittelschule — Curriculum coverage and card mapping

- Package: `nt-mittelschule-5/` (`zam-academy:nt-mittelschule-5`)
- Curriculum: [LehrplanPLUS Bayern, Natur und Technik 5, Mittelschule](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/nt)
- Snapshot checked: 2026-11-14 (`nt-mittelschule-5/tests/fixtures/curriculum.html`, SHA-256 `456b05f9d83b5b7b79e6723ebe892bb63f65890bd807947bd29f52a0a213d9b0`)

## Curriculum check

Because Natur und Technik is taught as a combined subject at the Bavarian Mittelschule (grades 5–10, Stundentafel BayMSO Anlage 1), the single `nt-mittelschule-5` package covers all four Lernbereiche and is registered in `academy.json` via `fachverbunde` (`id: "nt"`, paths `biologie`, `chemie`, `physik`).

`nt-mittelschule-5/coverage.json` indexes all **41** Kompetenzerwartungen across Lernbereiche 1–4 verbatim (`node nt-mittelschule-5/scripts/check-curriculum.mjs`: `41 verbatim competence rows, 0 not found; curriculum SHA-256 matches.`) and maps them to **32** lessons and **64** cards:

| Lernbereich | Title | Rows | Lessons | Cards | `supported` rows (stay partly in class) |
| --- | --- | ---: | ---: | ---: | --- |
| LB 1 | Naturwissenschaftliches Arbeiten | 9 | 5 | 10 | (1,1), (1,2), (1,4) — hands-on glassware, measurements, live lab log |
| LB 2 | Lebensgrundlage Sonne | 17 | 13 | 26 | (2,5), (2,6), (2,7), (2,9), (2,12) — real thermometer/burner/light-box experiments and daily sun protection |
| LB 3 | Mensch und Gesundheit | 10 | 9 | 18 | (3,7), (3,9) — personal healthy habits, real physical exercise and lifting ergonomics |
| LB 4 | Materie, Stoffe und Technik | 5 | 5 | 10 | (4,3), (4,4) — physical substance tests and laboratory separation experiments |

Row `(1, 8)` ("beurteilen verschiedene Maßnahmen und Verhaltensweisen zur Erhaltung der eigenen Gesundheit") starts from LB 1 lab safety (`nt5-gefahrstoffe-und-sicherheit`) and also cites the LB 3 health lessons (`nt5-gesund-im-alltag`, `nt5-haltung-und-sport`).

## Sources and external links

All 51 source entries in `nt-mittelschule-5/src/curriculum/outline.json` (`lehrplan` plus 50 topic references from Klexikon, Wikipedia, BZgA/BZFE, BfS, BGRCI, DGUV, BAuA, UBA and DGE/AOK) were fetched with `curl -sL -A "Mozilla/5.0"` on 2026-11-14 with HTTP 200 and inspected titles before linking. Links open only on an explicit learner click.

## Card mapping (`replaces-de-by.json`)

- `replaces-de-by.json` has `"status": "proposal-only"`, `"approved": null`, `"rows": []`, and `nt-mittelschule-5/cell.json` declares neither `replaces` nor `retired_items`.
- Rationale: ZAM bundles no Mittelschule Natur und Technik cell (`de-by:nt-ms-5` does not exist). Existing Grade 5 Realschule/Gymnasium Biology cells follow different school-type curricula and keep their cards and learner histories untouched unless Thomas explicitly requests otherwise.
- Verification (`zam-core@0.54.0` via `scripts/validate-cell.mjs` and root `scripts/validate-cells.mjs`): 32 atoms and 64 cards (35 prerequisite edges, 96 freshly generated unique Crockford ULIDs) install and enrol idempotently without touching existing cards or review histories.
