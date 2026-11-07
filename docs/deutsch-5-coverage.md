# Grade 5 German curriculum and card inventory

The [Grade 5 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/deutsch)
was checked on 7 November 2026. It defines one curriculum for Bavarian
Realschule at this grade and gives no hour allocations on the subject page.
The [coverage matrix](../deutsch-realschule-5/coverage.json) follows the order
of all 55 expectations. Each row gives its section and position, a paraphrase,
the lesson IDs and evidence from the exercise. The [official curriculum snapshot](../deutsch-realschule-5/tests/fixtures/official-curriculum.json)
pins the original wording and section anchors. The ISB identifies the curriculum
text as free of copyright protection. [LehrplanPLUS terms of use](https://www.lehrplanplus.bayern.de/seite/nutzungsbedingungen)

Where learners need further practice with people or real sources, the row
names the activity.

| Area | Expectations | Lessons in the path | Examples |
| --- | ---: | ---: | --- |
| Speaking and listening | 13 | 6 | Hear a school announcement, plan a short talk, mediate a disagreement, interview someone and rehearse a scene |
| Reading and media | 19 | 9 | Interpret a schedule, compare literary genres, explain a character's choice, keep a reading journal, compare media and verify a source |
| Writing | 9 | 6 | Plan a text, tell and continue a story, describe an animal, write to a friend and use feedback |
| Language and spelling | 14 | 16 | Word classes and cases, five tenses, word formation, sentence parts, spelling strategies, punctuation and dictionary use |

Grade 5 revisits sentence, word and spelling work from the [Grade 3–4 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/deutsch).
It develops this work through clause order, the five named tenses and more
deliberate choices of register and text form. Grade 6 develops additional text
forms such as precise reports of processes and events. The writing lessons here
stay with the Grade 5 tasks. [Grade 6 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/deutsch)

A full children's or young adult book, real conversations and feedback,
library or dictionary research, handwriting and a real film scene are part
of the accompanying practice. The app uses original examples and gives
instructions for doing this work. The offline school announcement allows
individual listening practice. The comparison of a long shot and an extreme
close-up uses original drawings of the same scene. Spelling lessons use the
2024 rules. [Official spelling rules](https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/)

## Existing ZAM cards

The two bundled legacy Grade 5 German cells contain 16 practice items. The
[proposal](../deutsch-realschule-5/replaces-de-by.json) pins both source
snapshots and the ZAM commit and explains each proposed decision.

- A · 8 single retrievals have a proposed one-to-one successor.
- B · 0 older multi-part prompts are carried forward in full.
- C · 5 incorrect multi-part prompts are proposed for retirement after approval. The other 3 stay active.

The proposal has no approval date. The new cell can be installed alongside
both legacy cells. Its validation script checks the pinned snapshots, installs
the legacy cells in a disposable library, adds 32 review records, and verifies
that installing and enrolling the new cell preserves every existing card
and review. Repeating installation and enrollment yields the same state.

The local evaluation build includes exercises, the offline ZIP and the
validated cell. Teacher review and videos remain open.
