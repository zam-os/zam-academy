# Mathematik 8 Mittelschule Bayern: Lehrplanabdeckung und Kartenbestand

Stand: 12. November 2026. Maßgeblich sind der [Fachlehrplan Mathematik 8 Regelklasse](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/mathematik/regelklasse) (Abruf-SHA-256: `972d5ac5d578d2ccb1483c8abc2dcb97e4656c2014d703b40ca457c936838a99`) und der [Fachlehrplan Mathematik 8 Mittlere-Reife-Klasse](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/mathematik/mittlere-reife-klasse) (Abruf-SHA-256: `cb306bf3fa0d40fafe5af4639d8b8f0cb857e7179575b250301221c852ea8620`). Die zwischengespeicherten Quellen und alle wörtlichen Kompetenzerwartungen liegen in `mathematik-mittelschule-8/src/curriculum/source.json`; die zeilenweise Zuordnung steht in `mathematik-mittelschule-8/coverage.json` (68 Zeilen: 31 Regelklasse `R`, 37 M-Zug `M`, 0 optionale Zusatzlektionen).

## Umfang nach Zweigen und Lernbereichen

Das Paket umfasst **31 Lektionen** in **8 Etappen** und **93 ZAM-Karten** (3 Karten pro Atom/Lektion). Im Zweigfilter stehen für die Regelklasse (`R`) **24 Lektionen** und für den M-Zug (`M`) alle **31 Lektionen** bereit. Sieben Themen vertieft der M-Zug exklusiv (`pr-4-wachstumsfaktor`, `pr-6m-halbkreis-plus-minus`, `wz-2-quadratwurzeln-ueberschlag`, `kz-3-kreisbogen-sektor`, `kf-3-kreisring-sektor`, `zy-3-kreisringzylinder`, `fk-2-lineare-funktionen-mxt`).

| Etappe | Lernbereich (LehrplanPLUS M8 R & M) | KE (R / M) | Lektionen |
| --- | --- | --- | --- |
| 1 | M8 LB 1: Prozentrechnung | 4 / 4 | `pr-1-rabatt-preisaenderung`, `pr-2-skonto-umsatzsteuer`, `pr-3-brutto-netto-tara`, `pr-4-wachstumsfaktor` *(M)*, `pr-5-kalkulation-verkaufspreis`, `pr-6-schaubilder-prozent`, `pr-6m-halbkreis-plus-minus` *(M)*, `pr-7-promillerechnung` |
| 2 | M8 LB 2: Quadratzahlen und Quadratwurzeln | 2 / 3 | `wz-1-quadrieren-radizieren`, `wz-2-quadratwurzeln-ueberschlag` *(M)* |
| 3 | M8 LB 3: Geometrische Figuren, Körper und Lagebeziehungen | 5 / 6 | `kz-1-kreis-zirkel-pi`, `kz-2-kreisumfang-umkehrung`, `kz-3-kreisbogen-sektor` *(M)*, `kz-4-zusammengesetzte-umfaenge`, `kz-5-zylinder-netze-schraegbild` |
| 4 | M8 LB 4: Flächeninhalt – Kreise | 4 / 5 | `kf-1-kreisflaeche-herleitung`, `kf-2-kreisflaeche-umkehrung`, `kf-3-kreisring-sektor` *(M)*, `kf-4-zusammengesetzte-kreisflaechen`, `kf-5-zylinder-oberflaeche` |
| 5 | M8 LB 5: Rauminhalt – Zylinder | 2 / 3 | `zy-1-zylindervolumen-analogie`, `zy-2-zylinder-zusammengesetzt`, `zy-3-kreisringzylinder` *(M)* |
| 6 | M8 LB 6: Zufallsexperimente | 6 / 6 | `zf-1-zufall-laplace`, `zf-2-relative-haeufigkeit-gdz`, `zf-3-gewinnchancen-aenderungen` |
| 7 | M8 LB 7: Gleichungen | 5 / 5 | `gl-1-terme-k-a-d-gesetz`, `gl-2-gleichungen-klammern`, `gl-3-sachaufgaben-mischungen` |
| 8 | M8 LB 8: Funktionale Zusammenhänge | 3 / 5 | `fk-1-zuordnungen-massstab`, `fk-2-lineare-funktionen-mxt` *(M)* |

Alle in `R` sichtbaren Voraussetzungen in `cell.json` verweisen ausschließlich auf `R`-Atome.

## Bestandsabgleich & Lehrer-Videos

- **Altbestand**: Für die Mittelschule existieren keine früheren `de-by`-Zellen in ZAM (`replaces` und `retired_items` entfallen; `replaces-de-by.json` wird nicht angelegt).
- **Lehrer-Videos**: Gemäß `AGENTS.md` (Abschnitt 4) enthält die Erstveröffentlichung keine `teacherVideo`-Einträge; geprüfte Erklärvideos werden in einem getrennten Schritt ergänzt.

## Verifikation

- Paket-Suite (`mathematik-mittelschule-8`): `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip` (3 Testdateien / 25 Tests bestanden, Offline-ZIP gebaut).
- Zell- und Registry-Prüfung (Repo-Wurzel): `ZAM_CORE=... node scripts/validate-cells.mjs` (93 Items inkl. Distraktoren mit `zam-core@0.54.0` geprüft), `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` (51 Tests bestanden) und `node scripts/build-catalog.mjs`.
- Browser-Prüfung: Gebautes `dist/index.html` in headless Chrome für Lernpfad (R/M-Filter), eine Lektion pro Etappe, SVG-Labore, Level-1/Level-2-Aufgaben und Formelsammlung im hellen und dunklen Thema ohne Konsolen- oder Laufzeitfehler geprüft.
