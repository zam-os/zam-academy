# German packages for Bavarian Mittelschule Grades 5 and 6

Checked against the live LehrplanPLUS on 2026-11-12. These are two independent learning packages with separate browser keys and cells. The app teaches through explanations, original short texts, two checked case decisions per lesson and writing tasks on two levels. ZAM supplies spaced repetition through the cell; it does not import the app's self-assessment as mastery.

| Package | Lessons | Cards | Official expectations | In-app method implemented | Supported with additional practice |
| --- | ---: | ---: | ---: | ---: | ---: |
| `deutsch-mittelschule-5` | 51 | 102 | 71 | 20 | 51 |
| `deutsch-mittelschule-6` | 52 | 104 | 76 | 24 | 52 |

Every expectation has a row in its package's `coverage.json`, and every lesson occurs in the matrix. `implemented` describes the narrowly cited language or spelling method, not mastery of the entire subject. Physical performance, conversations, extended reading, research and free writing are `supported`. Each row records the additional work. The four Lernbereiche contain 8/13/11/19 lessons in Grade 5 and 6/12/13/21 in Grade 6. The fetched Fachlehrpläne allocate no hours to individual Lernbereiche.

## Official sources and progression

- [Mittelschule German 5](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/deutsch), page title “LehrplanPLUS - Mittelschule - 5 - Deutsch - Fachlehrpläne”. Saved HTML SHA-256: `b4db576ce976c092022e7e599f32fa333a28b929c60e7323225e15b7b6ddcbf1`.
- [Mittelschule German 6](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/deutsch), page title “LehrplanPLUS - Mittelschule - 6 - Deutsch - Fachlehrpläne”. Saved HTML SHA-256: `3d8575dcc957d8b5aed4aa953c788192841e301b00acdefeecfd6ab4f18fe088`.
- [Primary-school German 3/4](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/deutsch) was checked for the preceding spelling, word-building, inflection, sentence and direct-speech foundations. Fetched HTML SHA-256: `6c834e0822ed376e897eb58f9098e2379bbf671fe7929737738082bc9f067ffc`.
- [Mittelschule German 7, Regelklasse](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/deutsch/regelklasse) was checked to distinguish subsequent work, including explicitly named relative/demonstrative pronouns, Konjunktiv I and Futur II. Fetched HTML SHA-256: `ca4bd05e334a7f02cb5058ed271097d9e7c2231e685b98874c0de05491709224`.

Grades 5 and 6 use a common curriculum, with no separate M-track binding. The matrices preserve every expectation's section, position and verbatim wording, including the source's non-breaking hyphens. Each app stores its complete fetched page in `tests/fixtures/curriculum.html`; `scripts/check-curriculum.mjs` verifies the bytes and finds every row in the normalized source. The independent expectation fixture and lesson bindings are also checked by the package tests.

Grade 5 includes a short original fable with local audio, guided talks and drama, fairy-tale/fable/poetry distinctions, book-selection and reading-journal preparation, factual texts and tables, print advertising, audio production, media reflection, personal messages, handwriting and document/form practice, narration, reports and procedure descriptions. Its grammar covers the six required word classes, inflection, Präsens/Präteritum/Perfekt, sentence probes (including the uncommon genitive object), main/subordinate clauses and spelling strategies.

Grade 6 adds an original detective listening story, evidence-based figure/space interpretation, the distinction between saga and everyday narrative, narrative perspective, argumentation, appeals, comparison of media language, foreign-language greetings, prepositions and case, Plusquamperfekt/Futur I and tense sequence, active/passive, clause functions, nominalisation, polite address, `das/dass`, basic separate/compound spelling and difficult line-break cases. Previously taught spelling and dictionary techniques are explicitly marked as review. The shared routines and examples build on the checked German Realschule Grade 5 shell; no Realschule curriculum binding or old card identifier is reused.

## Learning and assessment limits

Correct quick checks and two correct submitted decisions are required. The two writing levels keep separate drafts and confirmations. Editing a draft invalidates only its own confirmation. A model comparison opens after a minimum amount of text, and the learner checks three criteria before confirming. This measures completed practice and self-assessment, not the quality of a free response. Cross-tab merging preserves unrelated work, explicit wrong resubmissions and the relationship between a comparison and its exact draft.

Local recordings use the installed German computer voice Anna for the original fable (about 20 seconds) and detective story (about 24 seconds); both have transcripts. Grade 5 also retains the reference shell's local library announcement. The offline builds embed these assets as data URLs. They contain no teacher videos or third-party embeds. Adding teacher videos is a later step under the package standard.

Actual conversations, presentations, drama, further unfamiliar audio, fluent reading, a whole children's book, research and feedback remain necessary. Handwriting requires paper, document formatting requires a text editor, and real applications/forms need the responsible adult. Film scripts and still frames prepare analysis; they do not replace watching and discussing a film sequence. The app states these limits in its practice and reference views and in the coverage rows.

## Existing-card inventory

The source inventory was checked in zam-os/zam at `e6a235f75fe87b9d57af38bd61011027b891492c`: no Mittelschule German cells for Grades 5–7 occur in `src/kernel/library/bundled-cells.ts` or `tests/fixtures/curriculum/`. Existing primary-school, Realschule and Gymnasium cells are a different curriculum scope. Both `replaces-de-by.json` files therefore have empty `sources` and `rows`, `status: proposal-only` and `approved: null`. Neither new cell declares `replaces` or `retired_items`. No review-history transfer needs approval in this version.

The Academy registry, README and Pages list are prepared together with the packages. CI discovers them by their `package.json`; its explicit offline and verbatim-coverage steps include both. Publishing is a separate normal merge/deploy action. Synchronizing the bundled ZAM library is a later step after Academy publication, not part of this change.

## Verification

In each package:

```sh
npm ci
npm run typecheck
npm test
node scripts/check-curriculum.mjs
npm run package:zip
```

The Grade 5 suite passes 96 tests; Grade 6 passes 97. Curriculum verification reports 71 and 76 rows respectively, with no missing text and matching source hashes. `package:zip` builds the self-contained HTML, creates Windows/macOS/Linux starters and compares the ZIP's exact HTML bytes. Its buffer is sized from the actual HTML so bundled audio above Node's default output-buffer size does not break verification.

At the repository root:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///tmp/zam-ms-german-core/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
node scripts/build-catalog.mjs /tmp/zam-ms-german-catalog.json
```

The registry/catalog tests pass 51 tests. `zam-core@0.54.0`, the version pinned in CI, installs all cells, including the 102- and 104-item additions. The catalog builder accepts both additions without a mapping approval and produces 53 published cell entries.

Each package also provides `npm run test:browser`. With a dedicated Chrome profile and remote debugging on port 9441, it opens the built file directly, checks all lesson titles, interactive cases and level-specific prompts, captures each lesson on both levels in light and dark themes, and checks path/reference views. It tests real completion on both levels, persistence after reload, local audio decoding, mobile layout and the ZAM dialog. It fails on app exceptions or external network requests. Grade 5 checks 204 lesson states and Grade 6 checks 208. Screenshots and a JSON report go to a temporary folder. The package README documents setup and the optional artifact directory. These automated and visual checks are not a substitute for classroom evaluation or an independent pre-merge review.
