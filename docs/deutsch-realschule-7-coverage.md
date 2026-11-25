# German 7 Realschule: curriculum and legacy inventory

The package follows the shared [Bavarian Grade 7 German Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/deutsch),
checked live on 20 November 2026. German has one curriculum for this grade,
without separate Wahlpflichtfächergruppen. The page lists four Lernbereiche and
fourteen subsections; it specifies no hours for these areas. The package
therefore records `hours: null` rather than inventing allocations.

The [coverage matrix](../deutsch-realschule-7/coverage.json) contains all 57
expectations in source order, quoted verbatim after whitespace normalisation.
Each row identifies lessons, evidence and either `implemented` practice or
`supported` work that still needs an activity outside the app. Every lesson has
at least one expectation; no optional extensions are counted as curriculum.

The captured HTML is kept byte-exact. Its SHA-256 is
`af33d0cdfe8d161a236072fce94ea3f2e7cd0c3115132602081ba25267415e6f`.
`npm run check:curriculum` verifies the hash, all 57 quotations, the
neighbouring curriculum snapshots (grades 6 and 8), the legacy source snapshots
and both audio/transcript pairs. The live page titles and hashes of all six
clickable sources are recorded in
[source-checks.json](../deutsch-realschule-7/source-checks.json).

| Lernbereich | Lessons | Practice supplied |
| --- | ---: | --- |
| Speaking and listening | 10 | Synthetic debate & school-radio audio, speech intent, short-talk cue cards, vivid oral description, causal reporting, delivery marks, apologies/requests, discussion roles/survey data and scenic dialogue/freeze-frames |
| Reading and media | 14 | Skimming/scanning & layout cues, constellation sketch, ballad triad (`Erlkönig`), short stories with immediate opening & open ending, historical context, poetic devices (symbol, ellipse), Medieval/Baroque (`Es ist alles eitel`) vs. contemporary comparison, book reviews & portfolio, survey table/chart, text functions, news/reportage/feature, print vs. online ads, search & visual framing, youth media/netiquette/privacy |
| Writing | 10 | Form/layout discipline & registration form, quoting/paraphrasing/indirect speech, mindmaps & outlines, sensory vivid writing, genre conversion, concise summary (`Inhaltsangabe` in Präsens), text-based position papers, chronological process instructions, reasoned letters to SMV/school leadership and writing conferences |
| Language and spelling | 16 | Interactive language models: loanword structure, historicisms & semantic shift, youth/ad trends & genitive decline, Grade 6 hypernyms/voice/tense review, indicative vs. Konjunktiv I/II, pre-/post-nominal attributes, adverbials, causal/temporal clauses, modal/local/attributive clauses, coordinate vs. subordinate clauses & reductions, `das`/`dass`, clause commas, quotes & apostrophes, capitalisation, compound separation and error tables with dictionary lookup |

Every lesson includes a worked example, rule, visual exploration or dynamic
language model, three-option quick check, two case decisions and distinct
writing tasks on two levels. The three exploration goals start unselected.
Completion uses a correct quick check, correct case decisions and the
learner's explicit comparison of their own draft against three criteria. It
records practice and self-assessment, not independently assessed writing
quality. Progress is stored locally under `deutsch_rs7_progress_v1`.

## Grade boundaries

The live [Grade 6 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/deutsch)
(`36499d79d3509ebd437df314bd8f1cdce66002c1c7928cea65575c9cfa859fe8`) and
[Grade 8 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/deutsch)
(`565d9a23fc70b0e5d94a632251034f8d67e414c496dcc2548eb7a402fa4b3948`) were read
and captured. Grade 6 introduces sagas, schwank, six tenses, active/passive,
objects, adverbials and simple relative/causal clauses; lesson
`d7-ober-unterbegriffe-d6` explicitly revisits these Grade 6 structures as
required by 4.2.1.

Grade 7 introduces short stories, ballads, literary-epoch comparison
(Medieval/Baroque/contemporary), indirect speech distinguishing indicative and
Konjunktiv I/II, pre- and post-nominal attributes and adverbial/attributive
clauses (Kausal-, Temporal-, Modal-, Lokal- and Attributsatz). Grade 8 topics
(Enlightenment/Sturm und Drang/Classicism epoch study, formal minutes/Protokoll
as an assessed text form, and participle-clause constructions) are left to Grade
8.

## Activities beyond the app

The synthetic listening passages (`debatte.wav` and `rundfunk.wav`) are original
practice models with optional transcripts, rendered locally using the installed
Anna computer voice. They do not satisfy authentic radio/audiobook listening by
themselves. Live discussions, short talks, scenic performances, real
word-processor formatting, dictionary lookup, independent library/web research
and peer writing conferences remain required outside the app. Reading records
explicitly require documenting reading experiences including at least one
complete children's or youth book (*mindestens ein Kinder- bzw. Jugendbuch*).

Teacher review and teacher videos remain open (`version: "0.1"`). No teacher
videos are added during package creation.

## Existing cards and review evidence

The [approved mapping](../deutsch-realschule-7/replaces-de-by.json) inventories all ten
items from the two active Grade 7 cells in `zam-os/zam` (commit
`bae34e7dfe7d01838e448a65f15871c3549ae3fc`):

- `de-by:realschule-7-deutsch-inhaltsangabe-sachtexte-literatur`: 4 items (`01K4D7N0000000000000000J01`–`J04`).
- `de-by:realschule-7-deutsch-satzstrukturen-adverbialsaetze-kommasetzung`: 6 items (`01K4D7S0000000000000000J01`–`J06`).

Four Category A items carry their review histories to equivalent Academy items:
- `01K4D7N0000000000000000J01` → `d7-inhaltsangabe-check` (Präsens as the basic tense of an Inhaltsangabe, Perfekt for anteriority).
- `01K4D7N0000000000000000J03` → `d7-gattungen-ballade-check` (why a ballad unites Epik, Lyrik and Dramatik).
- `01K4D7S0000000000000000J01` → `d7-satzreihe-satzgefuege-check` (verb-final position in introduced subordinate clauses).
- `01K4D7S0000000000000000J05` → `d7-das-oder-dass-check` (`dieses`, `jenes` oder `welches` replacement test for `das`).

Six Category C items stay active (`keep-active`) because they bundle multiple
rules/examples into a single prompt (`J02`, `J04`, `S02`, `S04`, `S06`) or test a
Konzessivsatz taxonomy (`S03`) not listed in Grade 7 LehrplanPLUS 4.2.4. Thomas
approved the four transfers on 2026-11-21. The cell declares no retirements.

## Verification

From `deutsch-realschule-7`:

```sh
npm ci && npx tsc --noEmit && npm test && npm run check:curriculum && npm run package:zip && npm run test:browser
```

From the repository root (with `ZAM_CORE` pointing to `zam-core@0.54.0`):

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/package-version.test.mjs scripts/changed-apps.test.mjs
node scripts/package-version.mjs check origin/main
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node deutsch-realschule-7/scripts/validate-cell.mjs
```
