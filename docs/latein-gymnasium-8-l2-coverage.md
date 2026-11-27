# Grade 8 Latin as a second foreign language

Checked on 27 November 2026 against the official Bavarian Gymnasium curriculum
for [Latein 8 (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/2-fremdsprache).
The subject curriculum applies across Gymnasium profiles and gives no hours
by learning area.

## Curriculum and learning sequence

The [coverage matrix](../latein-gymnasium-8-l2/coverage.json) records all
52 expectations in order, their related lessons, and the supporting evidence.
`node latein-gymnasium-8-l2/scripts/check-curriculum.mjs` verifies all 52 rows
against the source text and checks the SHA-256 of the three archived curriculum
pages. [Source checks](../latein-gymnasium-8-l2/source-checks.json) record the
titles and hashes of all eight linked pages.

| Stage | Lessons | Topics |
| --- | ---: | --- |
| Vocabulary, word formation and inscriptions | 5 | Word meanings in context, word families, Latin accents and inscriptions |
| Comparison, pronouns and special verbs | 7 | Comparative and superlative forms, indefinite pronouns, deponents, semi-deponents, perfect forms with present meaning and *fieri* |
| Gerund, gerundive and case functions | 6 | The verbal noun and adjective, dative of agent, partitive genitive, genitive and ablative of description |
| AcI, NcI, subjunctive and clauses | 9 | Future active participle and infinitive, AcI and NcI, six independent subjunctive uses, adversative and relative clauses |
| Empire, frontier, Christianity and Europe | 5 | Imperial chronology, trade across the Limes, Christianity, Roman worship and the later use of Latin |
| Roman law and values | 5 | Roman legal institutions, legal maxims, case comparison and *iustitia* |
| Delphi, Olympia, philosophy and Phaedrus | 7 | Apollo's oracle, Zeus' festival, Greek schools of thought and adapted fables |
| Methods and creative work | 5 | Sentence analysis, translation review, source research, creative interpretation and study planning |

The teaching and practice shell comes from Grade 8 Latin as a first foreign
language. The second-language package introduces the comparison of adjectives
and adverbs, the future active participle and infinitive, and the independent
subjunctives for requests and wishes. It also gives dedicated lessons to
adversative clauses, description by case, Delphi and Olympia. The Grade 7
second-language curriculum already introduces the passive, PPA, PPP, the
ablative absolute, the irrealis and sequence of tenses. The Grade 9 curriculum
begins transitional and original reading. Grade 8 uses teaching texts,
including adapted Phaedrus material.

The matrix marks oral reading, pronunciation and the cumulative vocabulary
target of about 1,300 words as supported. Selected vocabulary and emphasis
patterns are practised in context. Sustained vocabulary practice and spoken
feedback require the learner's regular materials and class. The methods
lessons provide drafts, sample solutions and prompts for research and creative
work. Cooperative translation review, real presentations and projects,
classroom learning arrangements and self-organisation over time require
classroom or independent work.

## Legacy review history

The old cell named for Grade 8 was inventoried by
[Grade 7 Latin L1](../latein-gymnasium-7-l1/replaces-de-by.json).
PR #206 applied the approved transfers for the ablative absolute and hortative
cards. The Grade 8 Latin L2 curriculum also teaches the hortative, so this
package provides an independent L2 card.

The old Grade 9 gerundive and Caesar cell was inventoried by
[Grade 8 Latin L1](../latein-gymnasium-8-l1/replaces-de-by.json). Its single
proposed transfer is already recorded there. Caesar's original texts belong
to Grade 9. The [L2 inventory](../latein-gymnasium-8-l2/replaces-de-by.json)
references both reviews. The L2 cell uses 49 new atom IDs and 147 new item IDs.

## Verification

The package checks cover content, workshop goals, lesson routes, progress
storage, the curriculum and stable card IDs. The browser verifier exercises
both levels and themes for each lesson, the diagram controls, all workshop
goals, modals, persistence, and layout at 390, 720 and 1280 pixels.
The cell verifier uses the Academy CI version of `zam-core` in a temporary
database. The ZIP verifier compares the packaged HTML with the built HTML
and checks the launchers.
