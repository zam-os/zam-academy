# English 8 Gymnasium, second foreign language

The [grade 8 second-language Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/englisch/2-fremdsprache) applies across all Bavarian Gymnasium pathways where English is taught as the second foreign language. The ISB page specifies no hour allocations per Lernbereich.

The [curriculum matrix](../englisch-2fs-gymnasium-8/coverage.json) records `46` verbatim top-level competency expectations and curriculum blocks (`E8S-01`–`E8S-46`), mapped bidirectionally to `40` interactive core lessons (`e8s-*`) across seven stages and `120` linked ZAM cards (`3` per atom). Of the `46` rows, `23` are marked `implemented` (receptive/productive grammar, lexis, regional/historical workshops, mediation structure, and strategy checks directly practised in the app) and `23` are marked `supported` (classroom-dependent competences where the app provides preparation, transcripts, checklists, or criteria).

| Lernbereich | Coverage summary |
| --- | --- |
| E8 1.1 · Kommunikative Kompetenzen | Listening comprehension on longer passages (`en-CA`/`en-US` local playback & partner transcripts), gist & attitude reading, guided role play & two-minute talk prompts, travel blog / school-newspaper drafting, oral & written mediation (2-way) |
| E8 1.2 · Verfügung über sprachliche Mittel | Contextual & thematic lexis (Canada, North America, Wales, Tudor/US history, media), collocations/idioms/linking words, word webs, `I wish`/`if only`, UK/US/Canadian varieties & formal/informal register, adverb placement, perception verbs + adjective, gerund/infinitive patterns (`stop`/`remember` contrasts), two-object verbs & personal passive, passive across tenses, present perfect simple/progressive, past perfect, temporal clauses, conditionals II/III & mixed conditionals, connected speech & IPA |
| E8 2 · Interkulturelle Kompetenzen | Bilingual Canada, Inuit & First Peoples, North American customs & federal holidays, school & sports, Desert South-West, Wales (`Cymru`/`Senedd`) & UK vs. US political institutions, Tudor Britain & US founding milestones |
| E8 3 · Text- und Medienkompetenz | Adapted narrative/factual passages, skimming & scanning, fact vs. fiction, linking devices & argumentation, creative continuation & diary writing, audiovisual film analysis & critical online source verification |
| E8 4 · Methodische Kompetenzen | Word networks, inferencing, reading/listening techniques, source evaluation, independent vocabulary & error logging |
| E8 5 · Themengebiete & Sprachreflexion | Bilingualism/Canada, Indigenous perspectives, holidays & daily school/sport life, teen media habits, Desert South-West, Wales & UK/US politics, Henry VIII & Elizabeth I, Mayflower (1620), Boston Tea Party & Independence, westward expansion, German-English contrasts (reflexives such as `to change`/`to complain`/`to imagine`/`to meet`, first look at indirect statements, register & varieties), and research prompts on a current societal/political/digital event |

## Classroom scope (`supported` rows)

Natural native-speaker recordings, film clips with original soundtrack, spontaneous live role-play interaction, live audience presentations, extensive reading of complete youth novels, independent external dictionary/web research, and individual teacher feedback on free essays belong in classroom teaching and cannot be substituted by the offline app. For those `23` `supported` rows, the app delivers structured partner scripts, local `en-CA`/`en-US` browser playback, clickable film/media/talk explorers, rubrics (`Kriterienkataloge`), and self-checks as preparation for class.

## Curriculum & map snapshots

On 27 November 2026, `node englisch-2fs-gymnasium-8/scripts/check-curriculum.mjs` matched `46` of `46` verbatim curriculum strings (`0 not found`, whitespace normalized) against the fetched LehrplanPLUS Grade 8 HTML and verified all neighbouring-grade HTML byte hashes:

| Snapshot | URL | SHA-256 |
| --- | --- | --- |
| Grade 7 (2. Fremdsprache) | `.../gymnasium/7/englisch/2-fremdsprache` | `e66b2c2d4a923fd266a05e26aae2aad7932d65487ec1e8601b89682567592df7` |
| Grade 8 (2. Fremdsprache) | `.../gymnasium/8/englisch/2-fremdsprache` | `8dd4dc1d9f0f67dc7b673fa4e000ffc620b25cec0889122e8baf4b7973666f06` |
| Grade 9 (2. Fremdsprache) | `.../gymnasium/9/englisch/2-fremdsprache` | `6dccf8a5404e15f1fddba3d75916d2ed2f598d11f1818cf1f6023eddcd97fcf2` |

Great Britain coastlines and Wales/England/Scotland boundaries in the Wales workshop map use simplified public-domain geometry from [Natural Earth Admin 0 Map Units](https://www.naturalearthdata.com/downloads/10m-cultural-vectors/10m-admin-0-details/) (v5.1.2); schematic SVG learning sketches represent Canada, the Desert South-West, and US east-west expansion.

## Verified external sources

Every source link selectable in lessons was fetched once and verified against its real `<title>` (recorded in [`source-checks.json`](../englisch-2fs-gymnasium-8/source-checks.json), checked `2026-11-27`):

| ID | Fetched `<title>` | URL |
| --- | --- | --- |
| `lp` | `LehrplanPLUS - Gymnasium - 8 - Englisch - Fachlehrpläne` | <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/englisch/2-fremdsprache> |
| `canada` | `Canada - Wikipedia` | <https://en.wikipedia.org/wiki/Canada> |
| `indigenous-canada` | `Indigenous peoples and communities` | <https://www.rcaanc-cirnac.gc.ca/eng/1100100013785/1529102490303> |
| `visit-wales` | `History, Heritage & Traditions \| Travel Information \| Visit Wales` | <https://www.visitwales.com/info/history-heritage-and-traditions> |
| `grand-canyon` | `Grand Canyon National Park (U.S. National Park Service)` | <https://www.nps.gov/grca/index.htm> |
| `montezuma` | `Montezuma Castle National Monument (U.S. National Park Service)` | <https://www.nps.gov/moca/index.htm> |
| `pilgrims` | `Plimoth Patuxet Museums \| Who Were the Pilgrims?` | <https://plimoth.org/for-students/homework-help/who-were-the-pilgrims> |
| `tea-party` | `Boston Tea Party History \| Where the Tea Party Began` | <https://www.bostonteapartyship.com/boston-tea-party-history> |
| `declaration` | `The Declaration of Independence \| National Archives` | <https://www.archives.gov/founding-docs/declaration> |
| `oregon-trail` | `Oregon National Historic Trail (U.S. National Park Service)` | <https://www.nps.gov/oreg/index.htm> |
| `henry-viii` | `Henry VIII (r.1509-1547) \| The Royal Family` | <https://www.royal.uk/henry-viii> |
| `elizabeth-i` | `Elizabeth I (r.1558-1603) \| The Royal Family` | <https://www.royal.uk/elizabeth-i> |
| `uk-gov` | `How government works - GOV.UK` | <https://www.gov.uk/government/how-government-works> |
| `usa-gov` | `Branches of the U.S. government \| USAGov` | <https://www.usa.gov/branches-of-government> |
| `us-holidays` | `Federal Holidays` | <https://www.opm.gov/policy-data-oversight/pay-leave/federal-holidays/> |

## Legacy ZAM cards (`replaces-de-by.json`)

[`englisch-2fs-gymnasium-8/replaces-de-by.json`](../englisch-2fs-gymnasium-8/replaces-de-by.json) has `"status": "proposal-only"` and `"approved": null`. Therefore `englisch-2fs-gymnasium-8/cell.json` (`2026.11.1`) declares **neither `replaces` nor `retired_items`**.

The byte-exact snapshot `tests/fixtures/de-by-gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa-kvt.json` comes from `zam-os/zam` commit `c92f4e383385ee487cd8b30f73b3bf3cb27b0860` (`tile_id`: `de-by:gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa`, version `2026.08.1`, SHA-256 `40e20c194aaf41e16fe7bed8553388b9c046acd57f91884c9ea8fd6d48adb4`):

| Legacy item | Category | Proposed action | Reason |
| --- | :---: | --- | --- |
| `01K8G8J0000000000000000J01` | C | `keep-active` | Tests full indirect speech with backshift of tenses (`yesterday` -> `the day before`), which moves to Grade 9 in English as 2nd foreign language (`E9 LB 1.2`). |
| `01K8G8J0000000000000000J02` | C | `keep-active` | Composite prompt spanning Past Perfect, Passive Voice, and full Indirect Speech with backshift; no single card here preserves the whole composite. |
| `01K8G8J0000000000000000J03` | C | `keep-active` | Asks about Martin Luther King Jr.'s 1963 March on Washington, outside Grade 8 E2 history topics (which end after westward expansion). |
| `01K8G8J0000000000000000J04` | C | `keep-active` | Four-part US history composite combining Colonial/Independence topics with Civil War and 1960s Civil Rights outside Grade 8 E2 scope. |

**Open question for Thomas (neighbouring Grade 9 cell):** `de-by:gymnasium-9-englisch-participles-gerund-british-empire-commonwealth` (same commit) contains `01K8G9J0000000000000000J01` asking about `stop smoking` vs. `stop to smoke`. In the second-language curriculum, `stop`/`remember` with gerund vs. infinitive appears in Grade 8 (`LB 1.2`, covered in `e8s-gerund-inf-meaning`), whereas `J02`–`J04` (participle clauses, modal substitutes in past, British Empire/Commonwealth) belong to Grade 9. Please decide whether `J01` should remain assigned to the future Grade 9 cell (parallel to 1. FS) or be included in `englisch-2fs-gymnasium-8` once a mapping is approved.
