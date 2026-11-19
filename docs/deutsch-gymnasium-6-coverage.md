# German 6 Gymnasium curriculum and legacy review

The package covers the shared Bavarian Grade 6 Gymnasium syllabus in four learning areas. The Fachlehrplan has no area-specific hours or programme-specific sections. The first-party source and its SHA-256 are recorded in the [coverage matrix](../deutsch-gymnasium-6/coverage.json). [LehrplanPLUS German 6](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/deutsch)

| Area | Expectations | Lessons | Examples |
| --- | ---: | ---: | --- |
| Speaking and listening | 9 | 8 | School radio, audience-aware outlines, justified appeals, staging |
| Reading and media | 13 | 12 | A retelling of Ariadne and Theseus, viewpoint, reading diary, source checks, charts, camera framing |
| Writing | 9 | 8 | Narrative, informational and argumentative purposes, writing plans, event reports and revision |
| Language and spelling | 11 | 21 | Predicatives, four kinds of adverbial clause, subject and object clauses, relative clauses, spelling and punctuation |

The matrix marks live communication, performing, reading a complete book with peers, independent research, real film analysis, using an external word processor and peer editing as supported activities. The workshops supply practice, models or prompts for carrying these out. Draft comparison uses a learner checklist.

Grade 5 teaches word classes, cases, common adverbials, basic clauses and spelling. The Grade 6 models deepen those foundations with clause functions, the use of the passive, and spelling strategies in context. The Grade 7 curriculum adds the subjunctive in reported speech and additional clause relations. Those are outside this package’s learning goals. [LehrplanPLUS German 5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/deutsch), [LehrplanPLUS German 7](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/deutsch)

## Legacy inventory

The ZAM fixture inventory at commit `1c91042159e2488449bd5afc66891842e871ba0f` contains no Grade 6 Gymnasium German tile. The Grade 5 German tiles are already inventoried by the Grade 5 Academy package. The other Grade 7 tile covers formal summaries and ballads.

The Grade 7 syntax tile overlaps with the Grade 6 introduction to active and passive voice. The [proposal](../deutsch-gymnasium-6/replaces-de-by.json) records all four existing items as category C, keep active. The standalone Zustandspassiv item asks for a different retrieval from the new Vorgangspassiv item. The longer old prompt also tests infinitive punctuation and multiple passive forms in one retrieval. Its two Konjunktiv items remain Grade 7 work. The new cell ships with its own atom and item IDs. It declares no history transfers or retirements.

`npm run check:curriculum` checks that the ordered matrix exactly equals all 42 expectations extracted from the saved Grade 6 source after whitespace normalisation. It also checks the legacy fixture and both recordings against their SHA-256 values. The disposable-library check in `scripts/validate-cell.mjs` installs the new cell with the version of zam-core pinned in CI, enrols its items and verifies that reinstalling preserves practice evidence, including that of the four legacy cards.
