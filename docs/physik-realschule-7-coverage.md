# Grade 7 Realschule physics and the Academy overview

The package follows the current [LehrplanPLUS Physics 7 (I)](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/physik/wpfg1), downloaded directly on 15 November 2026. Its SHA-256 is `ac60fdc294c9eac5b1936a11bf528e291abd5ab27c3f45ea97afd25c6274bc41`. The page title was “LehrplanPLUS - Realschule - 7 - Physik - Fachlehrpläne”. The machine-readable [coverage matrix](../physik-realschule-7/coverage.json) holds every competence, its lesson mapping, and explicit evidence and limitations. `node physik-realschule-7/scripts/check-curriculum.mjs /tmp/zam-physik7-curriculum.html` checks the original bytes and whitespace-normalised quotations.

| Area | Curriculum hours | Lessons | Scope |
| --- | ---: | ---: | --- |
| Mechanics | 26 | 10 | Measurement, uniform motion, forces and interactions, Hooke range, mass/weight/calibration, particle states, qualitative friction, volume and density |
| Optics | 18 | 9 | Seeing, shadows/eclipses, reflection and mirror images, refraction/apparent depth, total reflection, dispersion, lens construction and optical devices |
| Magnetism/electricity | 12 | 5 | Pole interactions and influence, element-magnet model, fields and Earth/compass, circuit symbols and technical requirements, conductors/effects/protection |

The direct [Grade 8 Group I curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/physik/wpfg1) and [Mathematics 6 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/mathematik) were checked alongside this page. Direct proportionality is prior knowledge; thermal expansion, temperature scales, electric current calculations and later mechanics are not imported into Grade 7. The mathematical lens and refraction functions support the geometry internally; learners construct and compare rays without being taught later calculation laws.

The package supports the requirement of five real experiments, at least one per area, with five editable notebook slots and several possible questions. It does not certify that an experiment occurred. Coverage rows involving real measurements, calibration, independent sketches, construction, research or presentation state what stays in class. No teacher videos are added in this authoring step.

All three in-app source URLs were downloaded and their real page titles read. Besides the curriculum, these were the ISB pages “Physik an der Realschule” and “Grundlagen der Physik für Realschulen in Bayern”. They are ordinary external links; the app never fetches them in the background.

## Overview correction

The overview previously inferred a future Realschule Grade 6 physics package from the subject's generic starting grade. The [ISB timetable information](https://www.isb.bayern.de/schularten/realschule/faecher/physik/) confirms physics begins in Grade 7 for Group I and Grade 8 for II/III. `academy.json` now records the Grade 6 Realschule exception in `kein_unterricht`, with the ISB source and a learner-facing explanation. Existing shared logic applies it to the school map, world map, coverage matrix, search and offer counts. The new Grade 7 package is explicitly labelled Group I. A registry regression test checks both map lenses and the source-linked “no subject” matrix cell; the Mittelschule Natur und Technik offer remains accessible through its physics path.

The same generic assumption also offered Grade 6 physics at Gymnasium. The [official Natur und Technik profile](https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/nt_gym), checked on the same date, places biology and computing in Grade 6 and physics in Grade 7. A second source-linked exception removes that promise too. The Grade 6 physics path now leads only to Mittelschule's combined Natur und Technik course; its shared offer is preserved and counted once.

Package details also no longer render a literal `null` when there is no preview notice. Native `Element.append` stringifies null; the existing test helper had hidden that difference. The details test now rejects null or undefined arguments before they reach the simulated native append operation.

## Legacy-card proposal

The source is `zam-os/zam` at commit `2057e1c35a5e768eb0c59cb74c3700c0101f67a2`. Both Grade 7 physics fixtures are frozen byte-for-byte under the package's `tests/fixtures/`; their SHA-256 values are recorded in `replaces-de-by.json`.

Two of the eight mechanics items have same-retrieval candidates: converting m/s to km/h (J03) and interpreting the time-distance slope (J05). They are A proposals only. The other six mechanics prompts combine several questions or include material without an exact successor, such as rotating/rolling reference frames and velocity-time area calculations. They remain C keep-active.

All eight thermal-physics items remain C keep-active. Their old Grade 7 label does not establish current Grade 7 curriculum coverage. Particle-model overlap is not an identity mapping. The historical absolute-zero statement and the exact water-density wording also need an independent content correction; this package neither adopts those claims nor silently rewrites existing evidence.

The neighbouring `de-by:realschule-optik` and `de-by:realschule-optik-erweiterung` cells contain relevant optics retrievals, but are bound to Grade 8 and reuse some item identifiers across cells. This package does not claim their mapping or retire them. Their possible relationship to both physics packages needs Thomas's separate decision before any transfer proposal is expanded.

The result is **2 A, 0 B, 14 C keep-active**, with `approved: null`, `status: proposal-only`, no `replaces` and no `retired_items`. No personal library is opened or changed.

## Verification on 15 November 2026

| Check | Command or method | Result |
| --- | --- | --- |
| Clean dependency installation | `npm ci --offline --cache /tmp/zam-academy-npm-cache` in the package | Passed; dependency declarations match the physics reference package |
| Types | `npm run typecheck` | Passed |
| Package tests | `npm test` | 54 Vitest tests and 2 Node contract tests passed |
| Offline release | `npm run package:zip` | Typecheck, single-file build and ZIP creation passed; archived HTML compared byte-for-byte with `dist/index.html` |
| Curriculum quotations | `node scripts/check-curriculum.mjs /tmp/zam-physik7-curriculum.html` in the package | 17 rows, 0 not found; frozen-page SHA-256 verified |
| Registry and catalog | `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` at the repository root | 53 tests passed, including both map lenses and the timetable matrix |
| Cell installation | `ZAM_CORE=file:///tmp/zam-core-0.54.0/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs` | All 74 cells installed; card text and curated-distractor checks passed |
| Browser | Isolated headless Chrome, CDP evaluation of rendered `main` and screenshots | 24 lessons × 2 levels × 2 themes = 96 desktop states; 48 phone-width lesson states; path, reference and notebook views; no script exceptions or external app requests |

Browser interaction checks completed a lesson through the quiz, workshop, model comparisons, self-assessment and three independent calculations on each level, then reloaded it. Storage-blocked loading remained usable with its visible notice. Additional checks exercised independently switched lamps, total reflection, and real, focal-plane and virtual lens cases. Screenshot sheets were inspected across every lesson; the final visual pass also checked the revised volume, weight and shadow illustrations. The overview was served with the real registry, and its Grade 7 package link opened the built app.

This records local implementation and verification. PR publication and deployment are separate actions; neither mapping approval nor teacher review is claimed.
