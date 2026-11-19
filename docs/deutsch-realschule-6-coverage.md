# German 6 Realschule: curriculum and legacy inventory

The package follows the shared [Bavarian Grade 6 German Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/deutsch),
read live on 16 November 2026. German has one curriculum for this grade, without
separate Wahlpflichtfächergruppen. The page lists four Lernbereiche and fourteen
subsections; it specifies no hours for these areas. The package therefore records
`hours: null` rather than inventing allocations.

The [coverage matrix](../deutsch-realschule-6/coverage.json) contains all 61
expectations in source order, quoted verbatim after whitespace normalisation.
Each row identifies lessons, evidence and either `implemented` practice or
`supported` work that still needs an activity outside the app. Every lesson has
at least one expectation; no optional extensions are counted as curriculum.

The captured HTML is kept byte-exact, including its mixed line endings. Its
SHA-256 is `36499d79d3509ebd437df314bd8f1cdce66002c1c7928cea65575c9cfa859fe8`.
`npm run check:curriculum` verifies the hash, all 61 quotations, the neighbouring
curriculum snapshots, the legacy source snapshots and both audio/transcript
pairs. The live page titles and hashes of all five clickable sources are in
[source-checks.json](../deutsch-realschule-6/source-checks.json).

| Lernbereich | Lessons | Practice supplied |
| --- | ---: | --- |
| Speaking and listening | 8 | Route sketch, synthetic school-radio report, feedback, short-talk plan, reading delivery, conversation, interview and scenic interpretation |
| Reading and media | 13 | Reading strategies, main ideas, sagas, schwank, character evidence, perspective, poetry, reading records, non-fiction, chart/timetable, research and media judgement |
| Writing | 8 | Planning, purpose and paragraphs, narrative, object description, reasoned request, event report, process description and revision |
| Language and spelling | 21 | Foreign words, idioms, register, word classes, verb forms, six tenses, passive, prepositions, vocabulary, sentence structure, clauses and spelling strategies |

Every lesson includes a worked example, rule, visual exploration, three-option
quick check, two case decisions and distinct writing tasks on two levels. The
three exploration goals start unselected. Twenty-one language models change
actual forms or sentence parts. Completion uses a correct quick check, correct
case decisions and the learner's explicit comparison of their own draft against
three criteria. It records practice and self-assessment, not independently
assessed writing quality. The two levels retain separate drafts and completion;
editing invalidates an earlier comparison. Progress is local to this package.

## Grade boundaries

The live [Grade 5 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/deutsch)
and [Grade 7 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/deutsch)
were also read and captured. Grade 5 already introduces fables and fairy tales,
word classes, five tenses, sentence constituents, simple clause structures,
das/dass and spelling strategies. These are revisited as preparation where
Grade 6 explicitly requires them. Grade 6 adds or develops sagas and schwank,
Futur II, active/passive, all objects, modal and causal adverbials, relative
clauses, nominalisation and familiar Greek/Latin-root words. The matrix binds
these to the actual Grade 6 expectations, not to assumptions about novelty.

Grade 7 develops short stories, ballads, literary context, indirect speech with
indicative/subjunctive and more systematic adverbial/attributive clauses. This
package does not introduce a ballad-analysis course or an indirect-speech unit.
Its simple weil/obwohl examples serve Grade 6 clause relationships rather than
a six-type adverbial-clause taxonomy.

## Activities beyond the app

The synthetic listening passages are original practice models with optional
transcripts. They do not satisfy the authentic-media requirement by themselves.
A real short podcast, news or film contribution selected with a teacher remains
needed. The passages were rendered locally using the installed Anna computer
voice, and the build needs no speech service.

Real conversations, interviews, short talks, oral storytelling/reporting,
performances and feedback require other people. Independent library, dictionary
and source use requires actual materials. The reading record explicitly calls
for at least two complete children's/youth books by different authors. A plan,
a model text or an app checkmark does not certify that reading. Non-fiction,
magazines and real media reviews complement the fictional practice passages.

Teacher review and teacher videos remain open. In accordance with the package
standard, no teacher videos are added during package creation.

## Existing cards and review evidence

The [proposal](../deutsch-realschule-6/replaces-de-by.json) inventories every item
from these two Grade 6 cells in `zam-os/zam`:

- `de-by-realschule-6-deutsch-texte-bericht-vorgangsbeschreibung-kvt.json`: 4 items.
- `de-by-realschule-6-deutsch-wortarten-satzglieder-rechtschreibung-kvt.json`: 8 items.

Their exact LF-byte snapshots, source repository, commit and SHA-256 values are
pinned in the proposal. Four A candidates preserve the atomic retrieval for
present-tense process description, inflectable word classes, Plusquamperfekt and
the das/dass substitution test. Eight C rows retain the old items: their prompts
combine several retrievals or contain absolute rules that the new instruction
qualifies. No old history is divided across new cards.

Thomas approved 4 same-retrieval transfers on 2026-11-19. The published mapping uses `replaces` for those transfers. The 8 keep-active cards retain their review histories on their existing IDs. The attached migration check covers repeated installs and conflicting histories.

The neighbouring Grade 5 snapshots were checked against the already published
Grade 5 package and its mapping. The two active Grade 7 German cells were also
inspected: one combines content-summary/ballad prompts, the other combines
clause structures, adverbial-clause types and das/dass. They are not included in
this package's twelve-item proposal. Overlapping knowledge is not authority to
transfer their histories; any future cross-grade mapping needs a separate
explicit decision and must avoid duplicate ownership.

The cell validator uses a disposable library with CI's published `zam-core`
version. It checks installation without enrolment, 100 fresh cards, repeated
installation/enrolment and unchanged cards/reviews after installing the two
legacy cells. It never opens a configured learner library.

## Verification and publication

The package was first merged as `local-only`. On 2026-11-17 Thomas asked to
release it as `ready`: it is now in `academy.json`, Pages and the public
catalog at package version 0.0 (no teacher acceptance yet). Its cell still
declares neither `replaces` nor `retired_items`, so the catalog's mapping gate
needs no approval. CI discovers it by its own `package.json` and runs its
tests, offline/curriculum checks, browser check and disposable-library check.

Reproduce the package checks from `deutsch-realschule-6`:

```sh
npm ci
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run test:browser
```

The browser script opens `dist/index.html` as a local file and verifies every
lesson and task level in both themes, every visual control and case goal,
all selected language-model states in both themes, keyboard activation,
rubric and model rendering, progress/reload/edit behaviour, audio decoding
and responsive layouts. It writes screenshots and a JSON report.
The release checker compares the ZIP's embedded HTML byte-for-byte with the
build and checks all three starter scripts. The browser report pins the built
HTML hash. `npm test -- tests/visual-models.test.ts` checks the grammatical
meaning of the selected examples, clause punctuation and the route geometry,
including the turn behind the library and the destination label.

From the repository root, run the existing catalog and registry tests and the
cell checks with `ZAM_CORE` pointing to the version pinned in CI:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node deutsch-realschule-6/scripts/validate-cell.mjs
```

Publishing the app and later synchronising the ZAM bundle are separate steps.
No publication, mapping approval or legacy retirement is performed here.
