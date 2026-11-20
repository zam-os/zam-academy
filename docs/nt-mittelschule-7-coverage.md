# Grade 7 Natur und Technik curriculum and legacy comparison

The package uses the Academy offer for the combined subject `nt`. The atlas routes to it from biology, chemistry and physics. The former local chemistry package has been extended to all learning areas for Regelklasse and Mittlere-Reife-Klasse. The initial package version is 0.0. Teacher review is open.

## Curriculum

The official [Natur und Technik R7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/nt/regelklasse) and [Natur und Technik M7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/nt/mittlere-reife-klasse) curricula were checked on 2026-11-20. The source pages specify no time allocation for these sections. The package's `coverage.json` records the complete expectations, source fingerprints, track-specific lesson mappings and supporting activities.

| Official section | Shared R7 and M7 | M7 additions |
| --- | --- | --- |
| LB 1 · Naturwissenschaftliches Arbeiten | Questions, fair tests, sources, models, protocols and safety | |
| 2.1 · Zusammensetzung und Bedeutung der Luft | Air composition and pressure, formula notation, fire and its prevention, oxidation and rust, wind power | Balanced formula equations and wind site trade-offs |
| 2.2 · Atommodelle und Aufbau der Materie | Historical models, nucleus and electron-cloud scale, subatomic particles, isotopes and the periodic table | Energy levels, outer electrons and the octet rule |
| 2.3 · Tiere an Land und in der Luft | Five vertebrate classes and adaptations for locomotion | |
| 3.1 · Atmung des Menschen | Airways, rib and diaphragm movement, exchange at alveoli | Cellular respiration |
| 3.2 · Herz-Kreislauf-System | Blood components, circulation, heart muscle and valves, health | Breathing and pulse during activity |
| 4.1 · Elektrische Spannung und Stromstärke | Energy conversion, circuits, circuit symbols and measurement positions | Branches, junction current and loop voltage rules |
| 4.2 · Elektrischer Widerstand | Voltage-to-current ratio, wire length, cross-section, material and electrical safety | Effect of temperature on metal conductors |

All 36 R7 and 41 M7 expectations map to lessons. Of these, 28 R7 and 33 M7 expectations are implemented, and eight in each track are supported. The app uses the locomotion alternative in 2.3. In 4.1 it teaches circuit diagrams and meter placement through a virtual setup. Physical experiments, instrument operation, independent paper circuit diagrams and broader source research remain classroom activities. Their expectations are marked `supported`.

The Grade 6 [water and soil curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/nt) establishes particle models, water electrolysis and guided investigation. The Grade 7 lessons revisit these ideas through atmosphere, oxidation and electrical effects. Both [R8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/nt/regelklasse) and [M8](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/8/nt/mittlere-reife-klasse) develop electromagnetism, energy systems, reaction energetics, acids and bases. Those units belong to Grade 8. The Grade 7 models use rounded dry-air volume shares, illustrative wind sites, ideal low-voltage circuits and invented pulse and breathing values. Visual anatomy is schematic.

## Existing ZAM cells

The present and legacy curriculum tile fixtures in `zam-os/zam` were checked at `1ff016cfd7a0765c5338eb4248d0c14f3b92261c` for Grade 6–8 Mittelschule bindings in Natur und Technik or chemistry. The Grade 6 water and methods cards belong to their existing cell. The search found no relevant Grade 7 or Grade 8 predecessor. The former local draft's atom, practice and lesson IDs remain in the first release under the combined subject. The new cell has no review-history transfer.

## Reproducing the source check

Download both official Grade 7 pages with a browser User-Agent and pass their HTML snapshots in Regelklasse then Mittlere-Reife-Klasse order to `node scripts/check-curriculum.mjs` from the package directory. This checks source SHA-256 fingerprints and exact wording. The app-level tests verify all links from competencies to lessons, each model goal, both difficulty levels and the cell contract.


## Verification

- `npm ci`, `npm run typecheck`, `npm test` and `npm run package:zip` completed. The 116 tests include numeric answers, lesson and track bindings, and reachable goals for all 36 models. The ZIP check compares the archived HTML with the standalone build and verifies all launch scripts.
- `node scripts/check-curriculum.mjs <R7.html> <M7.html>` matched 36 R7 and 41 M7 expectations exactly, with zero missing or changed rows.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/package-version.test.mjs` passed 69 tests. `node scripts/validate-cells.mjs` installed the 108 items with the CI-pinned zam-core 0.54.0.
- Chromium DevTools checked the extracted ZIP app at both exercise levels and in both color themes for all 36 lessons. The browser checks also exercised track selection, notes, quiz feedback, atom balance, two parallel branches, gas-exchange direction, mobile layout, storage after reload, and the ZAM dialog. The offline document initiated zero HTTP(S) requests.
- Background checks used the federal health portal's [blood pressure overview](https://gesund.bund.de/bluthochdruck) and the DGUV's [electrical accident prevention guidance](https://aug.dguv.de/arbeitssicherheit/stromunfaelle-vermeiden/). The app's examples remain illustrative.
