# English 5 · Bavarian Gymnasium

A ZAM Academy learning package for English in Bavarian Gymnasium grade 5, based on the [official LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/englisch), checked on 14 November 2026. Learner guidance is German. Examples and practice materials are English.

The package has 40 lessons in eight stages, 120 visual construction goals, 80 constrained answers, 80 production tasks on two levels and 120 ZAM cards. The saved curriculum and `coverage.json` trace 38 top-level expectations and topic blocks. Grammar sublists remain inside their parent expectation. The official page gives no hours per learning area.

The path starts with greetings, classroom language, numbers and the clock, then covers family, home, pets, articles, pronouns and sentence building. Simple present, the present progressive, modals and the simple past come before school, food, clothes and festivals. Schematic maps introduce the United Kingdom, Great Britain, Ireland and North America. Listening, reading, mediation, writing, a small set of phonetic symbols and a public-domain rhyme complete the path.

There are no teacher videos. Natural listening, live conversation, pronunciation feedback, film clips and a sustained personal vocabulary list remain additional work. The coverage matrix marks those expectations `supported`.

## Use

Open `dist/index.html` or extract `release/ZAM-Academy-Englisch-Gymnasium-5-offline.zip` and open its HTML. Lessons need no server. Source links open only on a click. Progress uses the package key `englisch_gym5_academy_progress_v1`.

A lesson counts after its three workshop goals, quick check, short answers and Level 1 self-assessment. Listening lessons also require local speech or a partner reading the transcript. Level 2 is transfer practice. Completion records practice, not assessed proficiency.

## Develop and verify

```sh
npm ci
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

`npm test` checks the saved curriculum hashes and all 38 verbatim coverage rows before Vitest. Use `zam-core` 0.54.0, the version pinned in repository CI. `npm run dev` uses port 5247.

## Curriculum boundary and old cards

Grade 6 as the first foreign language introduces present perfect simple, past tense progressive, futures, question tags, adjective comparison, defining relative clauses and the modals could, may, might and should. Those targets are not taught here. The current Grundschule English page for the two-lesson track was checked on the same day. The expired Grundschule link on the grade 5 page redirected to the LehrplanPLUS homepage.

`replaces-de-by.json` is a proposal for `de-by:gymnasium-5-englisch-starter-grammar-tenses`: 4 rows A and 4 rows C, `approved` is null, and `cell.json` declares no `replaces` and no `retired_items`. The neighbouring grade 6 legacy cell still holds simple past and much/many together with later grammar. Whether that cell belongs in this mapping is a question for Thomas. See [the curriculum and inventory record](../docs/englisch-gymnasium-5-coverage.md).
