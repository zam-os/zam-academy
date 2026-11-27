# English 6 (2nd Foreign Language) · Bavarian Gymnasium

A ZAM Academy learning package for English as **second foreign language** in Bavarian Gymnasium grade 6 (`Englisch 6 (2. Fremdsprache)`), the first year of English at the Gymnasium after Grundschule English. It follows the [official LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/2-fremdsprache), checked on 24 November 2026. Learner guidance is German; examples and practice materials are English.

The package has 43 lessons in eight stages, 129 workshop goals, 86 checked short answers, 86 production tasks on two levels and 129 ZAM cards. The saved curriculum and `coverage.json` trace all 30 top-level expectations of learning areas 1–5 and the seven topic blocks of learning area 5 (`E6F-01`–`E6F-39`). Grammar sublists remain inside their parent expectation. The official page gives no hours per learning area.

| Stage | Lessons |
| --- | --- |
| Hello, English! | greetings and polite answers (chat), classroom English and imperatives (chat), numbers and dates (date card), the time (clock with a.m./p.m.), English around the world (country–nationality table) |
| Family, friends and home | relatives and possessive determiners (family tree), `to be`, `have got` with pets and plurals (word machine), rooms, `there is/are` and prepositions (room picture), describing friends with `I like doing`, `me too`, `not … either` |
| Small words | `a`/`an`/`the`, subject and object pronouns, `'s` and `of` genitive with `whose`, `this`/`that`/`these`/`those` (near and far), `some`/`any`, `much`/`many`/`a lot of` (countable and uncountable) |
| Every day, now, yesterday, soon | simple present (frequency week), present progressive and aspect, simple past, `going to` (timelines), `can`, `must`, `needn't`, `mustn't` (signs) |
| Sentences and questions | S-V-O and place before time, questions with `do`/`does`, subject and object questions, `whose` and prepositions at the end, question tags, `because`/`when`/`that` clauses (coloured sentence blocks) |
| Everyday life in the UK | a school day in Leeds (timetable), table talk, shopping with pounds and pence (shop calculator), clothes and phrasal verbs (outfit), festivals (calendar with weekdays) |
| Places: Britain and North America | UK, Great Britain and Ireland (map), London sights (map), the USA with the Lower 48, Alaska, Hawaii and Canada (map), Washington, D.C. and New York (two maps), city and country (scene) |
| Tools for learning | a voice message (listening, moods), a postcard and an animal story (layout), an email and a picture description (layout), mediation of a leisure-centre page (layout), IPA, minimal pairs and question intonation (listening), word building with `un-`, `re-`, `-er`, false friends and word-for-word errors, a public-domain rhyme and a role play |

There are no teacher videos. Natural listening, live conversation, reading aloud, film clips, scenes and current events remain additional work; the coverage matrix marks those expectations `supported`. Source links were fetched on 24 November 2026 and their real page titles are recorded in `source-checks.json`. Prices in the lessons belong to invented practice shops; the app names no current statistics.

## Use

Open `dist/index.html` or extract `release/ZAM-Academy-Englisch-2FS-Gymnasium-6-offline.zip` and open its HTML. Lessons need no server. Source links open only on a click. Progress uses the package key `englisch_2fs_gym6_academy_progress_v1`.

A lesson counts after its three workshop goals, quick check, short answers and Level 1 self-assessment. Listening lessons also require local speech or a partner reading the transcript. Level 2 is transfer practice. Completion records practice, not assessed proficiency.

**For parents and teachers:** answers, free texts and ticks stay only in this browser on this device (`localStorage`). They are not sent, rated or synchronised. If several pupils share one device account, use “Lokalen Fortschritt zurücksetzen” at the end; it deletes the texts too. A small “Wo bleibt mein Text?” note next to every writing field says the same.

## Develop and verify

```sh
npm ci
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

`npm test` checks the saved curriculum hashes and all 39 verbatim coverage rows before Vitest. Use `zam-core` 0.54.0, the version pinned in repository CI. `npm run dev` uses port 5281.

## Curriculum boundary and old cards

The package builds on Grundschule English 3/4 and on what pupils know from their first foreign language. Grade 7 as second foreign language introduces the present perfect, past progressive, will and timetable future, comparison, adverbs, relative clauses, possessive pronouns, `could`/`may`/`might`/`should` and conditional I, plus Cornwall or the Lake District, Florida or the Rockies, Celts, Romans and 1066; a test keeps those targets out. Grade 6 as *first* foreign language is a separate package (`englisch-gymnasium-6`).

ZAM holds no `de-by` cell for English as second foreign language, so this cell declares no `replaces` and no `retired_items`. The cards bind to the curriculum subject `englisch-2fs`, matching the atlas cell, so that they do not mix with Grade 6 English as first foreign language. See [the curriculum record](../docs/englisch-2fs-gymnasium-6-coverage.md).
