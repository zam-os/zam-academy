# English 7 Gymnasium, second foreign language

The [grade 7 second-language Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/englisch/2-fremdsprache) applies across the Bavarian Gymnasium pathways that teach English as the second foreign language. The ISB page specifies no hours per area. The [curriculum matrix](../englisch-2fs-gymnasium-7/coverage.json) records 40 top-level competency and topic rows. The app implements 21 rows and supports 19 through exercises that prepare for classroom activities.

| Area | Practice |
| --- | --- |
| E7 1.1 · Communication | Listening to travel announcements, directions, pharmacy and cinema conversations, a short talk, and mediation in both directions |
| E7 1.2 · Language resources | Resultative present perfect, past progressive, will and timetable future, modal substitutes, conditional I, comparison, pronouns, relative clauses and pronunciation |
| E7 2 · Intercultural learning | Cornwall and Florida, civic roles, holidays, and a school exchange |
| E7 3 · Text and media | An article, a story, a report, picture description, and an illustrated listening sequence |
| E7 4 · Learning methods | Word building, dictionary use and context, source checking, and error logs |
| E7 5 · Topics | Celtic-speaking communities, Roman Britain, the Norman Conquest and language contact, and a prompt for independent research on a current event |

Natural speech, film, live dialogue, and independent research belong in the wider course. The app supplies offline speech or partner scripts, a storyboard, role-play prompts, and criteria for checking a source.

The progression starts from the [grade 6 second-language curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/2-fremdsprache), including simple past, going to, everyday questions, and basic modals. The [grade 8 second-language curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/englisch/2-fremdsprache) adds structures such as past perfect, present perfect progressive, and conditionals II and III.

## Curriculum and map sources

On 25 November 2026, `node scripts/check-curriculum.mjs` found 40 of 40 rows after whitespace normalization and matched the original HTML bytes for all three grades.

| Snapshot | SHA-256 |
| --- | --- |
| Grade 6 second foreign language | `e89029c6804747de18c4198122bba40149902bfdd80346c253c189b4f5e56024` |
| Grade 7 second foreign language | `e66b2c2d4a923fd266a05e26aae2aad7932d65487ec1e8601b89682567592df7` |
| Grade 8 second foreign language | `8dd4dc1d9f0f67dc7b673fa4e000ffc620b25cec0889122e8baf4b7973666f06` |

The Great Britain maps use simplified coastline and present-day country boundaries from [Natural Earth Admin 0 Map Units](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-details/), public-domain files from release v5.1.2. The Cornwall marker is at Truro. Hadrian’s Wall is drawn approximately from the Solway coast to Wallsend. [English Heritage’s route and history](https://www.english-heritage.org.uk/visit/places/hadrians-wall/hadrians-wall-history-and-stories/history/). Learner-facing source titles are recorded in [source-checks.json](../englisch-2fs-gymnasium-7/source-checks.json).

## Existing ZAM cards

The [proposal](../englisch-2fs-gymnasium-7/replaces-de-by.json) uses the grade 7 legacy cell at zam-os/zam commit [67e190c2b7e5](https://github.com/zam-os/zam/commit/67e190c2b7e5282851dfdd60ce21b69ed373dfa9). The test checks the saved snapshot against SHA-256 `2859bd22297ca7c746bc65dcf6344cb3ba3022fd021f611124bf73f694f12bae` and accounts for all four old items.

| Legacy item | Treatment in this package |
| --- | --- |
| J01 | The [approved first-language mapping](../englisch-gymnasium-7/replaces-de-by.json) already allocates J01 to `e7-since-for-check`. |
| J02 | Keep active. The original combines several tense uses, duration, and two translations. |
| J03 | Approved on 26 November 2026 for transfer to `e7s-modals-check` (`01M8997DG01Y7Q9HETYYXD52DA`). Both cards recall `had to` for a past obligation. |
| J04 | Keep active. The original combines modal substitutes with conditionals I and II. Conditional II belongs to grade 8 on this track. |

Cell version `2026.11.2` declares the approved J03 transfer. The Grade 8 legacy fixture stays in the separate Grade 8 scope.
