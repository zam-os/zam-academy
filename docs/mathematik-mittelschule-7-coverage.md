# Mathematik 7 Mittelschule Bayern: Lehrplanabdeckung und Kartenbestand

Stand: 12. November 2026. Maßgeblich sind der [Fachlehrplan Mathematik 7 Regelklasse](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/mathematik/regelklasse) (Abruf-SHA-256: `31e53e4a6cef2e6ee30bae7cc57daa774e31713f205e88ef9ccc921da1781d08`) und der [Fachlehrplan Mathematik 7 Mittlere-Reife-Klasse](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/mathematik/mittlere-reife-klasse) (Abruf-SHA-256: `6b9c7398709bc1a05075cdd1a0661eaf975929e062b5ab0313a83d8d3531bae2c`). Die zwischengespeicherten Quellen und alle wörtlichen Kompetenzerwartungen liegen in `mathematik-mittelschule-7/src/curriculum/source.json`; die zeilenweise Zuordnung steht in `mathematik-mittelschule-7/coverage.json` (74 Zeilen: 36 Regelklasse `R`, 38 M-Zug `M`, 0 optionale Zusatzlektionen).

## Umfang nach Zweigen und Lernbereichen

Das Paket umfasst **32 Lektionen** in **8 Etappen** und **96 ZAM-Karten** (3 Karten pro Atom/Lektion). Im Zweigfilter stehen für die Regelklasse (`R`) **30 Lektionen** und für den M-Zug (`M`) alle **32 Lektionen** bereit.

| Etappe | Lernbereich (LehrplanPLUS M7 R & M) | KE (R / M) | Lektionen |
| --- | --- | --- | --- |
| 1 | M7 LB 1: Prozentrechnung | 7 / 7 | `pr-1-anteile-hundertstel`, `pr-2-anteile-vergleichen`, `pr-3-grundbegriffe-berechnen`, `pr-4-funktionale-zusammenhaenge`, `pr-5-mischungen-beruf`, `pr-6-prozentdiagramme` |
| 2 | M7 LB 2: Rationale Zahlen – Rechenregeln | 4 / 4 | `rz-1-zahlengerade-modelle`, `rz-2-addition-subtraktion`, `rz-3-multiplikation-division`, `rz-4-rechenregeln-vorteilhaft` |
| 3 | M7 LB 3: Geometrische Figuren, Körper und Lagebeziehungen | 7 / 7 | `ge-1-senkrechte-abstand`, `ge-2-winkelhalbierende` *(M)*, `ge-3-massstab-koordinaten`, `ge-4-dreiecke-einteilung`, `ge-5-dreieck-konstruktion`, `ge-6-innenwinkelsumme`, `ge-7-prismen-erkennen-netze` |
| 4 | M7 LB 4: Flächeninhalt – Parallelogramme und Dreiecke | 4 / 6 | `fl-1-parallelogramm`, `fl-2-dreieck`, `fl-3-zusammengesetzte-flaechen`, `fl-4-trapez-drache-raute` *(M)*, `fl-5-prismen-oberflaeche` |
| 5 | M7 LB 5: Rauminhalt – gerade Prismen | 2 / 2 | `vo-1-prismenvolumen-grundidee`, `vo-2-prismen-beruf-zusammengesetzt` |
| 6 | M7 LB 6: Diagramme und statistische Kennwerte | 3 / 3 | `st-1-darstellungen-manipulation`, `st-2-stichproben-skalierung`, `st-3-kennwerte` |
| 7 | M7 LB 7: Gleichungen | 5 / 5 | `gl-1-terme-vereinfachen`, `gl-2-waage-aequivalenz`, `gl-3-gleichungen-loesen` |
| 8 | M7 LB 8: Proportionalität | 4 / 4 | `pp-1-zuordnungen-linear`, `pp-2-dreisatz-sachaufgaben` |

Hinweis zu `ge-2-winkelhalbierende`: Die Konstruktion der Winkelhalbierenden ist in R7 (LB 3 KE 1: Mittelsenkrechte/Senkrechte) anders zugeschnitten als im M-Zug und daher ausdrücklich als `M`-Lektion geführt; `fl-4-trapez-drache-raute` deckt die zwei zusätzlichen M7-Kompetenzen in LB 4 ab. Alle in `R` sichtbaren Voraussetzungen in `cell.json` verweisen ausschließlich auf `R`-Atome.

## Bestandsabgleich & Lehrer-Videos

- **Altbestand**: Für die Mittelschule existieren keine früheren `de-by`-Zellen in ZAM (`replaces` und `retired_items` entfallen; `replaces-de-by.json` wird nicht angelegt).
- **Lehrer-Videos**: Gemäß `AGENTS.md` (Abschnitt 4) enthält die Erstveröffentlichung keine `teacherVideo`-Einträge; geprüfte Erklärvideos werden in einem getrennten Schritt ergänzt.

## Verifikation

- Paket-Suite (`mathematik-mittelschule-7`): `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip` (3 Testdateien / 23 Tests bestanden, Offline-ZIP gebaut).
- Zell- und Registry-Prüfung (Repo-Wurzel): `ZAM_CORE=... node scripts/validate-cells.mjs` (96 Items inkl. Distraktoren mit `zam-core@0.54.0` geprüft), `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` (51 Tests bestanden) und `node scripts/build-catalog.mjs`.
- Browser-Prüfung: Gebautes `dist/index.html` in headless Chrome für Lernpfad (R/M-Filter), repräsentative Lektionen über die Etappen, SVG-Labore, Level-1/Level-2-Aufgaben und Formelsammlung im hellen und dunklen Thema ohne Konsolen- oder Laufzeitfehler geprüft.
