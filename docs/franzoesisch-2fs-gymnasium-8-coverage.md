# Grade 8 Gymnasium French as the second foreign language

The package [`franzoesisch-2fs-gymnasium-8`](../franzoesisch-2fs-gymnasium-8/) fills the atlas slot `franzoesisch-2fs`, Grade 8. It continues [Grade 7](franzoesisch-2fs-gymnasium-7-coverage.md) and was built from that package's shell.

## Curriculum

The [Fachlehrplan Französisch 8 (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/franzoesisch/2fs) was fetched live on 27 November 2026 (SHA-256 `1641567df72d0da2f432b57331cb495eef2c347a04769c475233a50df241d1a9`). The page is byte-identical to the Grade 8 neighbour snapshot that the Grade 7 package stored on 23 November. It applies to all Ausbildungsrichtungen that teach French as the second foreign language and gives no hours per learning area.

The [coverage matrix](../franzoesisch-2fs-gymnasium-8/coverage.json) has 54 rows: every Kompetenzerwartung of learning areas 1 to 4 and every topic block of area 5. The rows were cut from the hashed snapshot by script, not typed. `scripts/check-curriculum.mjs` finds each of them verbatim in the normalised page text ("54 verbatim rows; 0 missing") and checks the hashes of the Grade 7 and Grade 9 neighbour snapshots. Nested grammar lists stay with their parent row. 18 rows are `supported`: natural listening, speaking and interpreting with real partners, role play, pronunciation, the portfolio, spell checkers in a word processor, current events and current music stay in class, and the evidence says what the app provides.

Neighbouring grades: the lessons build on Grade 7 (passé composé with avoir and être, imparfait, relative pronouns, indirect pronouns, comparison of adjectives, partitive en). The Grade 9 page lists y and en as adverbial pronouns, the futur simple, the conditionnel and si-clauses; the package leaves them out, and a content test fails if the French text uses them.

## Facts and sources

Each linked source was fetched and its real page title read ([source-checks.json](../franzoesisch-2fs-gymnasium-8/source-checks.json)):

- Brigitte-Sauzay-Programm (three months each way, grades 8 to 11) and Voltaire-Programm (six months each way, grades 8 to 10): DFJW programme pages.
- Partnership of Québec and Bavaria since 1989: page of Québec's representation in Munich, Gouvernement du Québec.
- Area of Québec (1.7 million km², hence "more than twenty times" Bavaria's roughly 70,500 km²): Géographie du territoire québécois, Gouvernement du Québec.

The responsibilities of French regions for lycées and TER trains could not be opened from this network (`prefectures-regions.gouv.fr` and `education.gouv.fr` answer 403), so they are not linked; the lesson states them without a link. All materials, dialogues and the comic are original practice texts. No lyrics are reproduced, and the package gives no current statistics.

## ZAM cell

`zam-academy:franzoesisch-2fs-gymnasium-8` has 43 atoms (one per lesson) and 129 cards: one tier-1 card with a binary fast check and two tier-2 cards per atom. All 172 ids are ULIDs drawn once and pinned in `tests/fixtures/public-contract.json`. Every card links to its lesson; every atom binds to its stage and to the Grade 8 learning areas of its lesson. `scripts/validate-cell.mjs` installs the cell with zam-core 0.54.0: no card on install, 129 cards enrol, repeated installs change nothing, and next to the legacy Grade 8 cell all 133 cards stay active in both install orders.

## Legacy cards: proposal only

zam-os/zam at commit [`c92f4e38`](https://github.com/zam-os/zam/commit/c92f4e383385ee487cd8b30f73b3bf3cb27b0860) holds one Grade 8 French cell, `de-by:gymnasium-8-franzoesisch-imparfait-passe-compose-objektpronomen`, with four items and no track. Its snapshot is stored byte-exact (SHA-256 `3869a6487c2714f7839d46536eea39115c58779ff8607e063fd4f5eb3972c84c`, identical to the copy in `franzoesisch-gymnasium-7`). [`replaces-de-by.json`](../franzoesisch-2fs-gymnasium-8/replaces-de-by.json) is `proposal-only` with `approved: null`:

| Old item | Category | Proposal | Reason |
| --- | --- | --- | --- |
| `…J01` imparfait formation | C | keep active | Already moved by the approved mapping of `franzoesisch-gymnasium-7` to `f7-1-imparfait-check`. |
| `…J02` imparfait vs passé composé, composite with translation | C | keep active | No Grade 8 card keeps the whole prompt; open question below. |
| `…J03` adverbial y | C | keep active | Grade 9 content for the second foreign language. |
| `…J04` object pronouns, y/en and futur simple | C | keep active | y/en and the futur simple are Grade 9 content for the second foreign language. |

Summary: A 0, B 0, C 4. The cell therefore declares no `replaces` and no `retired_items`.

Neighbouring cells checked and not taken in: `de-by:gymnasium-7-franzoesisch-passe-compose-relativsaetze-verneinung` (already mapped by the Grade 6 and Grade 7 first-language packages) and `de-by:gymnasium-9-franzoesisch-subjonctif-conditionnel-hypothesensaetze` (Grade 9 content; its si-clause type III uses the plus-que-parfait, but the card asks for the whole conditional system).

Questions for Thomas:

1. Should `…J02` get a dedicated B successor in this package (the whole composite prompt with its translation), or stay active until a first-language Grade 8 package exists?
2. The legacy Grade 8 cell names no language track. Should a future `franzoesisch-gymnasium-8` (first foreign language) own its remaining items instead of this package?

## Checks

Run in `franzoesisch-2fs-gymnasium-8`: `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`, then `node scripts/verify-browser.mjs` (every lesson and level in light and dark, all workshops through their change handlers, all explorer steps, 375 and 720 px without horizontal overflow, the hosted deep link, no network requests).
