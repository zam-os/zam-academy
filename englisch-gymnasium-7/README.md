# English 7 (1st Foreign Language) · Bavarian Gymnasium

A ZAM Academy learning package for English in Bavarian Gymnasium grade 7 (`1. Fremdsprache`), based on the [official LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/englisch/1-fremdsprache), checked on 23 November 2026. Learner guidance is German. Examples and practice materials are English.

The package has 44 lessons in eight stages, 132 workshop goals, 88 constrained answers, 88 production tasks on two levels and 132 ZAM cards. The saved curriculum and `coverage.json` trace all 43 top-level expectations and topic blocks (`E7-01`–`E7-43`). Grammar sublists remain inside their parent expectation. The official page gives no hours per learning area.

| Stage | Lessons |
| --- | --- |
| Saying it precisely | adverbs of manner (word machine), comparison and position (race explorer), adjective or adverb after verbs of perception, reflexive pronouns and `each other` (mirror scene), `one(s)` and possessive pronouns |
| Linking times | present perfect with `since`/`for` vs. `ago`, present perfect progressive, simple vs. progressive, past perfect, tense sequence in time clauses (interactive timelines) |
| What if …? | conditional II, advice (`If I were you`), conditional III, mixed forms, `I wish` / `If only` (condition scale) |
| Growing up in North America | Thanksgiving, Independence Day and Columbus Day (holiday calendar), high school (day schedule), sports and interviews, food and free time |
| Media: chances and risks | media use article, online safety, checking websites (layout explorer), a vlog (listening), a film still, perspective writing, current events |
| Wales and the Desert South-West | Wales (map), mediation of a Conwy Castle board, a hotel complaint, the Desert South-West (map), a Grand Canyon visitor page |
| From 1066 to the Mayflower | 1066, Norman French loanwords, Henry VIII, Elizabeth I, the Mayflower (history frieze, maps) |
| Tools for learning | conversation strategies, short talk, `however`/`therefore` and paraphrase, `-able`/`-ity` and the dictionary, word and sentence stress (listening), skimming/scanning, German–English contrasts |

There are no teacher videos. Natural listening, live conversation, presenting, spontaneous interpreting, real film clips, whole readers and current research remain additional work; the coverage matrix marks those expectations `supported`. Source links were fetched on 23 November 2026 and their real page titles are recorded in `source-checks.json`. The app names no current prices, results or statistics.

## Use

Open `dist/index.html` or extract `release/ZAM-Academy-Englisch-Gymnasium-7-offline.zip` and open its HTML. Lessons need no server. Source links open only on a click. Progress uses the package key `englisch_gym7_academy_progress_v1`.

A lesson counts after its three workshop goals, quick check, short answers and Level 1 self-assessment. Listening lessons also require local speech or a partner reading the transcript. Level 2 is transfer practice. Completion records practice, not assessed proficiency.

**For parents and teachers:** answers, free texts and ticks stay only in this browser on this device (`localStorage`). They are not sent, rated or synchronised. If several pupils share one device account, use “Lokalen Fortschritt zurücksetzen” at the end; it deletes the texts too. A small “Wo bleibt mein Text?” note next to every writing field says the same.

## Develop and verify

```sh
npm ci
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
node scripts/verify-browser.mjs
```

`npm test` checks the saved curriculum hashes and all 43 verbatim coverage rows before Vitest. Use `zam-core` 0.54.0, the version pinned in repository CI. `npm run dev` uses port 5279.

## Curriculum boundary and old cards

Grade 6 (`englisch-gymnasium-6`) covers the future forms, past progressive, resultative present perfect, adjective comparison, relative clauses, modal substitutes and conditional I; Grade 7 builds on them and repeats them only in contrast. Grade 7 as second foreign language has its own Fachlehrplan and is outside this package. Grade 8 introduces the passive, verbs with two objects, gerund and infinitive, London, the political systems, Canada and the founding of the USA; a test keeps those targets out (Independence Day names the Declaration only as the reason for the holiday).

`replaces-de-by.json` maps `de-by:gymnasium-7-englisch-grammar-present-perfect-modals-conditionals` (`status: "approved"`, `approved: "2026-11-23"`, Thomas: „Freigabe erteilt“): 1 row A (`J01` replaced by `e7-since-for-check`), 0 B and 3 rows C `keep-active` (`J02`, `J03`, `J04`), with no `retired_items`. `scripts/validate-migration.mjs` checks the transfer in CI. See [the curriculum and inventory record](../docs/englisch-gymnasium-7-coverage.md).
