# French 6 · Bavarian Gymnasium

This ZAM Academy package follows both Grade 6 LehrplanPLUS curricula. The home screen offers two paths with separate progress totals.

| Path | Lessons | Main topics |
| --- | ---: | --- |
| [First foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/1-fremdsprache) | 28 | Daily routines, large and ordinal numbers, adjective position and agreement, relative clauses, object and stressed pronouns, passé composé, Brittany, travel and comics |
| [Second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache) | 46 | Greetings, school and family, pronunciation, numbers and time, present and near future, questions, negation, direct object pronouns, shopping, Paris and Brittany |

Each lesson includes a worked example, a visual workshop, a quick check, two short answers and two production tasks. The interactive figures include a time line, sentence comparisons, a clock, street directions, a labelled map and a comic storyboard. Guidance is in German, with French examples and practice.

## Use

Extract the [offline bundle](release/ZAM-Academy-Franzoesisch-Gymnasium-6-offline.zip) after building it, or open `dist/index.html`. Choose your curriculum path on the home screen. The same browser keeps local progress and drafts for both paths.

For the progress bar, complete the workshop, the quick check, the short answers and the Level 1 model comparison. Level 2 provides additional transfer practice. Six listening lessons use an installed French voice or a partner reading the provided transcript. The package does not record speech. Source links open on demand. Natural listening and audiovisual material, spontaneous conversation, pronunciation feedback and current-event research still need practice outside the app.

The ZAM cell contains 222 cards with permanent lesson links. Its two curricula are identifiable by topic codes and learning domains. Selecting a path in the app filters its lessons and progress. ZAM imports the cell as a package. The cell declares no history transfers or retirements.

## Verify locally

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Browser verification uses installed headless Chrome. Set `CHROME_BIN` if Chrome is outside the default macOS location and `BROWSER_QA_DIR` to choose a report directory. The browser checks both task levels in both themes for every lesson, tests all workshop targets, and checks language input, path switching, progress persistence and responsive widths. Use zam-core 0.54.0 as pinned in CI. The dev server uses port 5263.

See the [curriculum and legacy inventory record](../docs/franzoesisch-gymnasium-6-coverage.md). Package version 0.0 is awaiting teacher review.
