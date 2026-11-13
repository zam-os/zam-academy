# Grade 6 Realschule Biology: curriculum and inventory

Checked on 13 November 2026 against the live [LehrplanPLUS Biology 6 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/biologie), titled “LehrplanPLUS - Realschule - 6 - Biologie - Fachlehrpläne”. This is one common curriculum, without separate Wahlpflichtfächergruppen. The new package is `biologie-realschule-6` and stays local under its `local-only` publication marker.

The fetched HTML has SHA-256 `18e3f425233be9e45765845e2b4c0aa4f44c4684909412efa6bdb2613a9930ab`. `node biologie-realschule-6/scripts/check-curriculum.mjs <saved-page>` checked all 46 competence rows: 0 not found after whitespace normalization, with the source hash matching. The matrix preserves their official German wording. Source excerpts are checked against the fetched page rather than reconstructed from memory.

| Official section | Expectations | Package treatment |
| --- | --- | --- |
| LB 1.1: scientific inquiry | 11 | Five methods lessons plus controlled germination, models and identification work |
| LB 1.2: communication | 7 | Sources, protocols, diagrams, terminology and a presentation plan |
| LB 1.3: evaluation | 3 | Facts versus values, decisive criteria, two actions and consequences |
| LB 2: reproduction and sexuality, about 18 hours | 13 | Ten lessons from genes and puberty to flowers, dispersal and germination |
| LB 3: vertebrate diversity, about 20 hours | 6 | Eight lessons comparing classes, development, temperature and behaviour |
| LB 4: a local ecosystem, about 18 hours | 6 | Seven lessons on habitat, seasons, niches, insects, food relations, cycles and protection |

The 30 lessons link to [coverage.json](../biologie-realschule-6/coverage.json). Each expectation names lessons and concrete exercise evidence. `supported` rows explicitly retain real observations, apparatus use, microscopy, experiments, original identification, model building, presentations or discussion in class. Digital written explanations and self-assessment are not certificates of practical competence.

## Neighbouring grades and existing Academy content

The live [Biology 5 page](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/biologie) covers scientific methods, biology as a science, the human body and animals/plants around people. The live [Biology 7 page](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/biologie) covers scientific methods, cells, plant metabolism and human organ systems. Both pages were fetched and their titles and Lernbereich headings read on the check date.

Grade 6 therefore introduces genes only as parts of hereditary material and avoids DNA coding, Mendelian crosses, detailed leaf anatomy and quantitative metabolism. Sexual development is taught through general, fictional examples; learners are never asked to disclose personal experiences. The course distinguishes pollination from fertilization and a pollen grain from a male gamete. Mammal live birth is qualified with exceptions, frog development is identified as a species example, and thermoregulation models make no precise species predictions.

Biology 8 and Biology 10 Academy packages retain their published identities and content. The Grade 6 lessons neither revise those packages nor move their histories. The Biology 10 shell was copied and adapted with its explanatory comments, quiz/workshop handlers, self-assessment, local persistence, source view and offline build. Its older-grade models and optional content were replaced by Grade 6 content and four qualitative models.

## Existing-card proposal

The byte-exact LF snapshots come from `zam-os/zam`; [replaces-de-by.json](../biologie-realschule-6/replaces-de-by.json) records the source commit and a SHA-256 for every file. Forty old items are inventoried once, including neighbouring-grade topics that now fall in Grade 6.

| Legacy cell | Items | Proposed handling |
| --- | --- | --- |
| Grade 5 human anatomy and reproduction | 8 | C, keep active: anatomy is outside the retrieval scope; combined reproduction prompts are not retained whole |
| Grade 5 flower structure and seeds | 8 | One A candidate: the pollination definition; seven C keep-active rows. The stempel history already belongs to the approved Grade 5 successor. |
| Grade 6 mammals, dogs and cats | 8 | C, keep active: specialized/composite retrievals are not retained as exact successors |
| Grade 6 birds, fish, amphibians and reptiles | 8 | C, keep active: detailed old retrievals differ from the new atomic questions |
| Grade 7 vertebrates and ecology | 8 | Two A candidates: the two endothermic classes and the ecosystem components; six C keep-active rows |

The previous stempel candidate (`01K4B5P0000000000000000J03`) is explicitly excluded from a Grade 6 transfer: the approved Grade 5 package already transfers it to `b5-bluete-vielfalt-check`.

Total: **3 A candidates, 0 B, 37 C**. This is a proposal (`approved: null`). The cell contains no `replaces` or `retired_items`. Membership of the neighbouring-grade inventory in a future migration remains for Thomas to decide, alongside the three candidate matches; no package may claim an already transferred history twice.

`ZAM_CORE=<published 0.54.0 file URL> node biologie-realschule-6/scripts/validate-cell.mjs` installs all five old cells into a disposable library, creates 40 cards and 80 recall reviews, and compares every stored card field and review before and after repeated new-cell installation. The result was unchanged. Explicit enrolment creates 60 fresh cards with zero repetitions and stability; repeated install/enrolment is idempotent. No personal library is opened.

## Source links

The following live pages were fetched and their actual HTML titles read. Links are plain references; the app fetches none in the background. No teacher videos were added, following the package standard's separate video-authoring step.

| Reference | Actual fetched title |
| --- | --- |
| [IQWiG: puberty](https://www.gesundheitsinformation.de/was-passiert-in-der-pubertaet.html) | Was passiert in der Pubertät? \| Gesundheitsinformation.de |
| [BIÖG: condom](https://www.familienplanung.de/verhuetung/verhuetungsmethoden/kondom/) | Das Kondom - familienplanung.de |
| [Federal environment ministry: insects](https://www.bundesumweltministerium.de/faqs/insektenschutz) | BMUKN: Insektenschutz \| Cluster |

## Verification evidence

- `npm ci --ignore-scripts --no-audit --no-fund`, `npm run typecheck`, `npm test`: 48 tests passed.
- `npm run package:zip` and `node scripts/verify-release.mjs`: self-contained HTML, exact ZIP bytes, all three launchers and shell syntax passed.
- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`: 51 tests passed; the draft stays excluded from publication.
- `ZAM_CORE=<published 0.54.0 file URL> node scripts/validate-cells.mjs`: every cell, including this draft, installed and passed the card-text/choice checks.
- Package history-preservation validation: 30 atoms, 60 fresh cards; 40 old cards and 80 reviews preserved.

`node biologie-realschule-6/scripts/browser-smoke.mjs /private/tmp/zam-bio6-browser` passed 120 desktop lesson/level/theme combinations and 64 phone-width views, including the path and reference views. Its actual-handler checks covered wrong/right quiz answers, timeline moves, classification, rubric gating, draft invalidation, reload persistence, all model goals, field notes and the ZAM draft notice. The report recorded 0 runtime errors and 0 external requests. Screenshots were captured for visual inspection; the Academy home link was moved below the content after inspection showed it covering text on phones. Teacher review and the separate video step remain open before publication.
