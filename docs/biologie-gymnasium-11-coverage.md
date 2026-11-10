# Biology for the Bavarian Grade 11 Einführungsklasse

The scope is the **Einführungsklasse** at the Bavarian nine-year Gymnasium when biology is offered. The [standard timetable](https://www.gesetze-bayern.de/Content/Document/BayGSO-ANL_1) has no regular Grade 11 biology course. The [introductory class timetable](https://www.km.bayern.de/lernen/schularten/gymnasium/eignung-und-uebertritt/einfuehrungsklassen) allows two periods of chemistry or biology. There are no parallel biology tracks in the [ISB guidance for this class](https://www.isb.bayern.de/schularten/gymnasium/oberstufe/einfuehrungsklasse/).

The [biology guidance](https://www.isb.bayern.de/fileadmin/user_upload/Gymnasium/Einfuehrungsklasse/biologie.pdf), valid from 2023/24 and checked on November 10, 2026, is the course source. The [coverage matrix](../biologie-gymnasium-11/coverage.json) maps each of its 36 competency bullets by area and position in the official list. Each row includes the original German wording, its PDF pages, an English paraphrase and the activity that addresses it. Line wrapping and split words are joined. The matrix attributes the official text to the ISB and records the source PDF's SHA-256. The guidance treats methods as cross-cutting, so the package gives them an entry point and returns to them in the subject lessons. The 54 hours below are ISB's classroom allocations.

| ISB area | Hours | Lessons | Evidence in the app |
| --- | ---: | ---: | --- |
| LB 1 · Scientific inquiry, evaluation and communication | Across the course | 3 | Plan controls, display measurement data, test alternative explanations and defend a decision. |
| LB 2 · Cell biology | 5 | 3 | Compare schematic tissue fields, identify cell structures and classify cells. |
| LB 3 · Humans as an ecosystem | 8 | 4 | Relate microbiome and infection to transmission, compare bacterial growth with virus reproduction and interpret immune response curves. |
| LB 4 · Matter and energy in humans | 20 | 10 | Follow nutrients and gases, vary enzyme and diffusion conditions, and compare ATP use, respiration and photosynthesis. |
| LB 5 · Genetics | 15 | 5 | Compare proteins, pair DNA, read a schematic karyogram and track copying and division. |
| LB 6 · Behavior | 6 | 3 | Trace a stimulus and response, control a dummy experiment and weigh evidence for inherited and learned components. |

The package reuses biomolecule, digestion and energy foundations from [Grade 10](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/biologie). The ISB guidance adds cell review and introductory genetics and behavior. The [Grade 12 basic](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/biologie/grundlegend) and [advanced](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/12/biologie/erhoeht) curricula then extend genetics and behavior. Detailed membrane potentials, saltatory conduction and reaction pathways are treated in [Grade 13 basic](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/13/biologie/grundlegend) and [advanced](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/13/biologie/erhoeht); the introductory class studies the stimulus–response path and overall metabolism balances.

The cell uses an explicit `isb-bayern-einfuehrungsklasse` binding. ZAM's ordinary curriculum matcher can match a track-specific binding when the request omits a track, so the cell does not use a general `lehrplanplus-bayern` Grade 11 biology binding. The Academy binding supports the explicit cell and its lesson-level sources.

Microscopy and physical investigations still require classroom equipment and supervision. The app provides schematic images, simulated data and prompts for preparation and analysis. The simulation values, written example answers and local completion are for practice. Teacher review and video selection are open.

## Legacy ZAM cards

The [approved mapping](../biologie-gymnasium-11/replaces-de-by.json) records both byte-identical Grade 11 biology fixtures from [ZAM release source](https://github.com/zam-os/zam/tree/ea825d1c1147fcc5f37de5817c2d6a7c05e2f7ed/tests/fixtures/curriculum), with SHA-256 hashes. It classifies all eight items: one A match, no B matches, and seven C items that stay active. The A match is the atomic retrieval of water as the source of the oxygen released by photosynthesis. The other prompts ask for detailed mechanisms or wider syntheses that the introductory course does not assess.

Thomas explicitly approved this mapping in the package's Codex chat on November 10, 2026; the mapping records his exact words and approval date. Cell version `2026.11.3` declares `replaces` only for `01K8GBH0000000000000000J01` on `bio11-photosynthese-vergleichen-sauerstoffquelle`. No cards are retired. The package remains a local draft.

The migration test installs the unchanged legacy cells and the approved cell in disposable libraries. It verifies that the one history moves with every FSRS and review field preserved, the seven C cards remain active, enrolment adds only fresh cards, and repeated installs and enrolment change nothing. A learner holding cards on both ids makes installation refuse an automatic merge and roll back.

## Verification

Run `npm ci && npm run typecheck && npm test && npm run package:zip` in the package. At the root, run the catalog and registry tests and install every cell using the `ZAM_CORE_VERSION` pinned in CI:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<file URL to zam-core dist/index.js> node scripts/validate-cells.mjs
ZAM_CORE=<file URL to zam-core dist/index.js> node biologie-gymnasium-11/scripts/validate-migration.mjs
```

Open the offline HTML from the ZIP to check the learning path, both exercise levels, the reference view and the models without a network connection.
