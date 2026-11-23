# French 7 · Bavarian Gymnasium

This ZAM Academy package offers both Grade 7 LehrplanPLUS paths. Select the path for the year in which you started French.

| Path | Lessons | Main topics |
| --- | ---: | --- |
| [First foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/1-fremdsprache) | 29 | Longer messages, reporting questions and statements, partitives, past narration, school exchanges, the collège and French regions |
| [Second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/2-fremdsprache) | 39 | Relative clauses, object pronouns, both passé composé auxiliaries, contrasts with the imparfait, travel, Brittany, recipes and festivals |

The 68 lessons use German guidance and French examples. Each lesson has a worked example, a three-goal workshop, a quick check, two short answers and a guided and a transfer task. Visuals include a selectable regions map, a timeline contrasting narrative tenses, a route sketch, sentence comparisons and comic panels.

## Train offline

Build and extract the offline ZIP, then open its HTML file or run one of the included launchers. The browser keeps drafts and progress locally. Each path shows its own progress. Seven listening activities support an installed French voice or a partner reading the transcript. Natural speech, regional accents, role-play and pronunciation feedback need additional practice.

For families and teachers, drafts stay in the browser profile on the device. Learners sharing a device account and browser profile can use **Lokalen Fortschritt zurücksetzen** at the end of a session to clear their drafts and progress.

The Academy cell includes 204 cards. Each card links to its lesson. ZAM imports the cell as a single package. The French-sequence codes distinguish its curricula. Package version 0.0 is awaiting teacher review.

The approved migration transfers the existing review history for one Grade 8 imparfait card to its Grade 7 successor.

## Verify locally

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
```

Use zam-core 0.54.0 as pinned in CI. Set `CHROME_BIN` if Chrome is outside its default macOS location and `BROWSER_QA_DIR` for the report and screenshots. The dev server uses port 5277.

See the [curriculum and legacy inventory](../docs/franzoesisch-gymnasium-7-coverage.md).
