# German 5 Gymnasium: curriculum and legacy inventory

This package implements the shared Bavarian Gymnasium Grade 5 German subject
curriculum. The live official pages for Grade 5, primary Grade 3/4 and Gymnasium
Grade 6 were fetched on 2026-11-14 with a browser User-Agent. Their actual page
titles and SHA-256 values are recorded in
[`source-checks.json`](../deutsch-gymnasium-5/source-checks.json); the complete
HTML snapshots and independently indexed expectations are in the package's
`tests/fixtures/` folder.

The Grade 5 source has 42 expectations in fourteen sections and four learning
areas. It gives neither lesson-hour allocations nor separate
Ausbildungsrichtung variants. [`coverage.json`](../deutsch-gymnasium-5/coverage.json)
copies every expectation and links it to lessons, status and concrete evidence.
`node scripts/check-curriculum.mjs` from the package checks every row against
the snapshot after whitespace normalisation and checks all three source hashes
and both legacy snapshot hashes. The result is 42 rows, zero missing passages.

| Learning area | Lessons | What learners practise |
| --- | ---: | --- |
| Speaking and listening | 7 | Two local listening passages, main information, speech planning, meaningful pauses, fair conversations, reasons and scenic interpretation |
| Reading and media | 13 | Reading traces, literary and factual purposes, fairy tales, fables, figures, poetry, dramatic scenes (*Spielszenen*), reading diaries, tables, bar charts, research, media use and film effects |
| Writing | 8 | Planning, narrative situation–event–outcome, continuation, procedures, factual events, personal requests, revision and text processing |
| Language and spelling | 22 | Word classes and inflection, cases, pronouns, comparison, six tenses, word formation and meanings, sentence functions, predicate brackets (*Satzklammer*), all four named adverbial types, clause structure, homophones (*gleich und ähnlich klingende Wörter*), nominalisations and spelling strategies |

The closest shell is `deutsch-realschule-5`, including its reviewed progress
merge logic and writing self-assessment. Shared foundations are retained, but
the Gymnasium coverage is independently authored. Dedicated lessons add a
heard literary passage, fairy-tale and fable interpretation, a bar chart,
factual event writing, text processing, modal and causal adverbials, word
meanings and line-end word division. Every lesson has an explorable labelled
visual. The bar chart changes its emphasis between reading, comparison and
scope; narrative arcs, timelines, word blocks and scene illustrations connect
the text to a visible relationship.

## Neighbouring grades and limits

The primary Grade 3/4 snapshot establishes prior listening, basic text forms,
reading strategies and spelling probes. Grade 5 revisits those foundations
with Latin grammatical terminology, structured textual evidence and more
independent writing. The Grade 6 comparison keeps active/passive analysis,
extended subordinate-clause classification, attribute and relative-clause
analysis, and the larger range of authentic media practice out of the Grade 5
core. Simple main/weil-clause contrasts remain in scope. All six tenses are
introduced because the Grade 5 curriculum calls for distinguishing the tenses
and representing temporal relationships.

Speaking, listening to real partners, fluent reading, memorised poem delivery,
drama, classroom book discussions, library research and writing conferences
need people and settings beyond the app. The app provides preparation and
explicit practice prompts; their coverage rows say `supported`. Short original
passages do not fulfil the required Ganzschrift. Film storyboard contrasts
support the optional film/sound expectation; they do not constitute watching
and discussing an authentic film. Further magazine and lexicon texts supplement
the original factual material.

Free writing is practised through a model and three criteria. Twenty characters
only unlock comparison; length is not a quality score. A completion mark
requires a correct quick check, both case decisions and a confirmation tied
to the compared draft. The two writing levels keep separate drafts and
completion. Editing removes the old confirmation. localStorage failures leave
practice usable and display an explicit save warning.

## Legacy evidence and proposed history decisions

Both legacy Gymnasium Grade 5 German cells are captured byte-for-byte from
`zam-os/zam`; their exact source commit, paths and LF-byte SHA-256 values are
in [`replaces-de-by.json`](../deutsch-gymnasium-5/replaces-de-by.json).

| Legacy cell | Items | Proposal |
| --- | ---: | --- |
| `de-by:gymnasium-5-deutsch-erzaehlen-maerchen-fabeln` | 8 | One A proposal for traditional fairy-tale numbers; seven C keep-active rows |
| `de-by:gymnasium-5-deutsch-grammatik-faelle-rechtschreibung` | 8 | Eight C keep-active rows |

Every row has its own reason. Several old synthesis prompts bundle much more
than a new short retrieval, so a shared topic cannot move their mastery. The
old narrative perspective generalisation, inserted-speech punctuation schema
and absolute spelling rules need particular care; the new lessons do not copy
those claims. The one A proposal preserves the same atomic numbers question.
Thomas has not approved that transfer: `approved` is null, no practice item
declares `replaces`, and there is no `retired_items` list. All old review
evidence remains active and unchanged. No B mapping is proposed.

The neighbouring-grade legacy inventory contains no Gymnasium Grade 4 or Grade
6 German cell. Realschule and Mittelschule histories belong to their respective
packages and are not claimed here. A later approved mapping must be resolved
before bundling into ZAM; enrolling both old and successor cards first can
make an eventual automatic merge impossible.

## Publication and validation

This package is published to Pages, the public catalog and the Academy atlas
with its **50 lessons** and **100 cards** (`publication.json` removed; registered in `academy.json` and `.github/workflows/pages.yml`).
Its existing 46 lesson anchors and 138 atom/item identifiers from PR #137 are
unchanged; four additional lessons (`d5-spielszene`, `d5-satzklammer`,
`d5-aehnliche-woerter`, `d5-nominalisierung`, 12 new ULIDs, total 150 identifiers)
close the remaining Grade 5 gaps on dramatic scripts/stage directions,
multi-part predicates/*Satzklammer*, homophones (`seit/seid`, `viel/fiel`,
`wieder/wider`, `Saite/Seite`), and nominalisation signals (`beim/zum`, `etwas/nichts + Adjektiv`)
without introducing Grade 6 topics (`das/dass`, passive, relative clauses).
Teacher review, teacher videos and explicit approval of `replaces-de-by.json`
remain separate decisions. The package introduces no npm dependency and uses no
embeds, trackers or background HTTP requests.

The package commands are documented in its
[README](../deutsch-gymnasium-5/README.md). `npm run typecheck`, `npm test`,
`npm run package:zip`, the verbatim curriculum checker and the real-browser
verification cover content contracts, cases, progress, all lesson/level/theme
views, local audio and the offline ZIP. Repository registry/catalog tests and
`scripts/validate-cells.mjs` use the published zam-core 0.54.0 pinned by CI.
`scripts/validate-cell.mjs` additionally installs and enrols in a disposable
library, records a review, repeats installation and preserves all sixteen
legacy cards and their review evidence. These checks do not substitute for
teacher evaluation or the independent review required before merging.

## Review follow-up

The two independent reviews on PR #137 identified learner-visible text errors
and improvements to curriculum boundaries, reusable recall and the visuals.
The follow-up retains all 46 lesson anchors and 138 atom/item identifiers.

- The offline startup guide names Gymnasium, and the release verifier reads the
  guide from the actual ZIP and rejects the old school label. Hearing-source
  copy now refers to both recordings.
- Word-formation grammar, option-order-dependent feedback, pronoun terminology
  and the exact closure during the large school break are corrected.
  Procedure practice replaces the copied animal-description extension.
- Clause-series punctuation and relative-clause recall are removed from the
  Grade 5 lessons and cards. Main/Weil-clause transformations remain, matching
  the Grade 5 expectation.
- The listening and factual-writing checks ask reusable knowledge without an
  absent original passage. Recall samples are actual model answers. More
  plausible wrong options represent mistakes in selecting relevant information,
  explaining reasons and applying spelling patterns.
- The fairy-tale example names the thirteen wise women in Grimm's *Dornröschen*,
  checked against the [1857 primary text](https://de.wikisource.org/wiki/Dornr%C3%B6schen_(1857)).
- All 19 language/spelling lessons now transform visible words and structures:
  sentence-part order, verb brackets, case forms, pronoun reference, word
  classes, adjective comparison, word parts, meaning relations, vowel length,
  extension probes, capitals, direct speech, commas, syllable division and
  dictionary entry navigation. Three exploration goals start unachieved; the
  browser check exercises every transformation. They are not a mastery grade.
  Other diagrams now show their content within the figure, and the fable has
  a recognisable leafy tree, crow and fox.
- Related C-row practice uses `related_slug`, reserving `academy_slug` for the
  one A proposal. Approval remains null; future activation must add a migration
  conflict check for existing old and new cards.
- Development uses strict port 5249 after checking the other open package PRs
  (#138: 5247, #139: 5248, #140: 5247). The next merge must still refresh main.

The explicitly labelled draft README row follows the repository's existing
local-draft convention. Publication, teacher review, videos and any history
transfer remain separate from these review corrections.
