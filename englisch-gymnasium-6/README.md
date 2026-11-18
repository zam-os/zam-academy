# English 6 (1st Foreign Language) · Bavarian Gymnasium

A ZAM Academy learning package for English in Bavarian Gymnasium grade 6 (`1. Fremdsprache`), based on the [official LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/englisch/1-fremdsprache), checked on 18 November 2026. Learner guidance is German. Examples and practice materials are English.

The package has 40 lessons in eight stages, 120 visual construction goals, 80 constrained answers, 80 production tasks on two levels and 120 ZAM cards. The saved curriculum and `coverage.json` trace 40 top-level expectations and topic blocks. Grammar sublists remain inside their parent expectation. The official page gives no hours per learning area.

The path starts with travel, ticket desks, future forms (`going-to-future`, `will-future`, `timetable-future`), directions on a schematic town map, pharmacy/doctor conversations and a voice message, then moves through `past tense progressive`, resultative `present perfect simple`, contrast with `simple past`, structured excursion writing and hobby collocations/false friends. Further stages cover adjective comparison, defining and contact relative clauses, indefinites (`every`, `both`, `neither`), `although` / `so that` / `while`, `could` / `may` / `might` / `should` and modal substitutes (`be able to`, `have to`, `be allowed to`), conditional type I, question tags and questions with prepositions. Regional and historical lessons explore Cornwall, the Lake District, Hadrian's Wall, Bath, Roman place names (`-chester/-caster`, `strata`), city/country life, Florida, the Rocky Mountains, New England, the Midwest, a current-event checklist, flyers/menus/recipes, picture description, two-minute talks, William Wordsworth's *I Wandered Lonely as a Cloud*, oral/written mediation, question intonation/`-ed` pronunciation, word building (`un-`, `re-`, `-er`) and language reflection.

There are no teacher videos. Natural listening, live conversation, pronunciation feedback, film clips, extended readers and a personal vocabulary notebook remain additional work. The coverage matrix marks those expectations `supported`.

## Use

Open `dist/index.html` or extract `release/ZAM-Academy-Englisch-Gymnasium-6-offline.zip` and open its HTML. Lessons need no server. Source links open only on a click. Progress uses the package key `englisch_gym6_academy_progress_v1`.

A lesson counts after its three workshop goals, quick check, short answers and Level 1 self-assessment. Listening lessons also require local speech or a partner reading the transcript. Level 2 is transfer practice. Completion records practice, not assessed proficiency.

## Develop and verify

```sh
npm ci
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
node scripts/verify-browser.mjs
```

`npm test` checks the saved curriculum hashes and all 40 verbatim coverage rows before Vitest. Use `zam-core` 0.54.0, the version pinned in repository CI. `npm run dev` uses port 5255.

## Curriculum boundary and old cards

Grade 5 covers `to be`, `have got`, `simple present`, `present progressive`, `simple past`, `can`/`must`/`needn't`/`mustn't`, `some`/`any`, `much`/`many` and UK/North America foundations. Grade 6 (`2. Fremdsprache`) starts English from Grade 5 foundations and is outside this first-foreign-language package. Grade 7 introduces adverbs (`-ly` formation, comparison, position), reflexive/possessive pronouns, `one(s)`, `present perfect progressive`, `past perfect simple`, conditional II/III, `1066`, Henry VIII, Elizabeth I, the Mayflower, Wales and the Desert South-West, which are excluded here.

`replaces-de-by.json` maps `de-by:gymnasium-6-englisch-past-tenses-present-perfect-adjectives` (`status: "approved"`, `approved: "2026-11-18"`): 3 rows A (`J03`, `J05`, `J07` replaced by `e6-past-progressive-check`, `e6-present-perfect-check`, `e6-adjectives-check`) and 5 rows C (`keep-active`: `J01`, `J02`, `J04`, `J06`, `J08`), with no `retired_items`. The neighbouring Grade 7 cell `de-by:gymnasium-7-englisch-grammar-present-perfect-modals-conditionals` contains `had to` (`J03`) and modal substitutes + conditional I (`J04`) mixed with Grade 7 targets (`since/for`, type II) and stays with Grade 7 pending Thomas's scope decision. See [the curriculum and inventory record](../docs/englisch-gymnasium-6-coverage.md).
