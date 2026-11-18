# Geschichte 6 · Bavarian Gymnasium

A ZAM Academy learning package for **Jahrgangsstufe 6** of the Bavarian Gymnasium following the [official LehrplanPLUS Bayern Fachlehrplan Geschichte 6 Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/geschichte) (fetched 18 November 2026, SHA-256 `8783baf2fb7616069c7ded0533c1f0badc05fe05f700d4dd0a01d9ae59c1cef1`). Grade 6 has one shared curriculum across all Ausbildungsrichtungen, so no lesson carries a track filter.

*(Note: At the Bavarian G9 Gymnasium, **Geographie** is taught in grades 5, 7, 10 and 11 per BayGSO Anlage 1 — not in grade 6. Accordingly `academy.json` records `geographie` grade 6 `gymnasium` under `kein_unterricht` while Geschichte begins in grade 6.)*

## Scope

| Lernbereich | Hours | Lessons | Topics, Visualizations & Labs |
| --- | --- | --- | --- |
| 1 · Der Mensch und seine Geschichte | ca. 6 Std. | 5 | Time dimensions & BC/AD calculation without year 0 (`timelineExplorer`), sources vs. accounts, archaeological excavation (`excavationStratigraphy`), Paleolithic survival techniques, Neolithic Revolution |
| 2 · Ägypten – eine frühe Hochkultur | ca. 6 Std. | 5 | Natural-Earth Egypt/Nile map & map-reading criteria, Nile flood & three seasons (`nileCycle`), high-culture markers & writing, belief in the afterlife & pyramids (`pyramidCutaway`), society pyramid & evaluation of divine kingship |
| 3 · Die griechische Antike | ca. 10 Std. | 6 | Natural-Earth Greece map & Polis, colonization & modern migration comparison (`colonizationMap`), pan-Hellenic culture & architectural criteria, Solon–Kleisthenes reforms & ostracism, Persian Wars (`persianWars`), Attic democracy (`athensDemocracy`) & comparison today |
| 4 · Menschen machen Geschichte (Längsschnitt) | ca. 6 Std. | 4 | Rulers' portrait criteria, Hatshepsut's agency & limits, Themistocles & civic politics, Alexander's campaign (`alexanderCampaign`), cross-epoch power comparison (`powerComparison`) |
| 5 · Das Imperium Romanum | ca. 12 Std. | 7 | Founding myth vs. archaeology, Roman Republic & Ständekämpfe (`romanRepublic`), Mediterranean expansion (`romanExpansionMap`), Caesar & Augustus Principate, Bavaria/Raetia & Limes (`romanBavariaLimes`), Natural-Earth Judea & Diaspora map, Early Christianity |
| 6 · Von der Antike zum Mittelalter | ca. 8 Std. | 5 | "Völkerwanderung" critique & Mediterranean tripartition (`mediterraneanTransformation`), Islam & Byzantium, Frankish roots & Natural-Earth AD 800 map, Charlemagne's kingship & travel rule (`imperialContinuity`), epoch boundary debate |
| 7 · Leben in der Familie (Längsschnitt) | ca. 6 Std. | 4 | Athenian *oikos*, Roman *familia*, modern equality & diverse family forms, cross-epoch synthesis (`familyLongitudinal`) |

All 40 verbatim Kompetenzerwartungen from the official Fachlehrplan map to these 36 lessons in [coverage.json](coverage.json) (`37 implemented`, `3 supported` for textbook comparison in class, excursion/film work in Roman Bavaria, and optional family research). Four lessons embed explicit structured **Kriterienkataloge** (historical map reading, archaeological objects/architecture, historical diagrams, and rulers' portraits).

## Privacy & Architecture

- **All visualizations offline**: 47 lesson SVG scenes and Natural-Earth historical maps, 15 interactive historical models/map explorers (with 45 provenance-tested exploration goals), a Lernpfad hero panorama, and a scrollable cross-epoch timeline — zero third-party embeds, analytics, external fonts, or background network requests.
- **Verified source links**: All 102 external educational/reference URLs were checked against HTTP 200 and recorded with their HTML page titles on 18 November 2026 ([docs/geschichte-gymnasium-6-coverage.md](../docs/geschichte-gymnasium-6-coverage.md)); they open only when clicked by the learner.
- **Local persistence**: Progress and theme are stored locally under `geschichte_gy6_academy_progress_v1` and `geschichte_gy6_theme`.
- **Teacher videos**: Not included in this initial `0.0` version (`AGENTS.md` §4 separates initial authoring from video curation).

## Development & Offline Bundle

```bash
npm ci
npm run dev           # http://localhost:5259/geschichte-gymnasium-6/
npx tsc --noEmit
npm test              # 175 Vitest tests across 4 files
node scripts/check-curriculum.mjs
node scripts/validate-migration.mjs   # requires ZAM_CORE pointing to zam-core
npm run package:zip   # builds dist/index.html & release/ZAM-Academy-Geschichte-6-Gymnasium-offline.zip
```

## ZAM Cell & Legacy Inventory

- [cell.json](cell.json) (`zam-academy:geschichte-gymnasium-6`) contains 36 atoms (1 per lesson) and 72 recall items (each lesson has a binary `tier1_fast` check and a concise `tier2_synthesis` prompt) using 108 unique generated ULIDs pinned in [tests/fixtures/public-contract.json](tests/fixtures/public-contract.json). Every item cites `https://academy.zam-os.org/geschichte-gymnasium-6/#lesson=<id>`, and the 8 Category A successors carry `replaces` per the approved mapping.
- [replaces-de-by.json](replaces-de-by.json) records Thomas's approved mapping (`"status": "approved"`, `"approved": "2026-11-18"`) for all 16 legacy items across the two Grade 6 history cells in `zam-os/zam`: 8 Category A single tier-1 replacements (`gg6-*-check`), 0 B, 8 C kept active. Byte-exact LF snapshots and SHA-256 checksums live in `tests/fixtures/`, and [scripts/validate-migration.mjs](scripts/validate-migration.mjs) checks history migration and collision refusal against `zam-core`.
