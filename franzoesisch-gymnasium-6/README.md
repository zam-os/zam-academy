# French 6 · Bavarian Gymnasium (first foreign language)

This ZAM Academy package follows the LehrplanPLUS [Fachlehrplan Französisch 6 (1. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/1-fremdsprache): the second year of French for learners who began in Grade 5. Its 28 lessons cover daily routines, large and ordinal numbers, adjective position and agreement, relative clauses, object and stressed pronouns, the passé composé, Brittany, travel and comics.

Until November 2026 the package also held the second-language path (46 lessons `f6-2-…`). That path now has its own package, [`franzoesisch-2fs-gymnasium-6`](../franzoesisch-2fs-gymnasium-6/), in the atlas cell `franzoesisch-2fs`. Old lesson links `#lesson=f6-2-…` forward there online and show a link offline. Before this package first saves, it hands a learner's second-language entries to the new package once.

Each lesson includes a worked example, a visual workshop, a quick check, two short answers and two production tasks. The interactive figures include a time line, sentence comparisons, a clock, street directions, a labelled map and a comic storyboard. Guidance is in German, with French examples and practice.

## Use

Extract the [offline bundle](release/ZAM-Academy-Franzoesisch-Gymnasium-6-offline.zip) after building it, or open `dist/index.html`. Progress and your own texts stay in this browser on this device. They are not sent anywhere and not synchronised. If several children share one device account, choose „Lokalen Fortschritt zurücksetzen“ at the end; that deletes the texts too.

For the progress bar, complete the workshop, the quick check, the short answers and the Level 1 model comparison. Level 2 provides additional transfer practice. Three listening lessons use an installed French voice or a partner reading the provided transcript. The package does not record speech. Source links open on demand. Natural listening and audiovisual material, spontaneous conversation, pronunciation feedback and current-event research still need practice outside the app.

The ZAM cell contains 28 atoms and 84 cards with permanent lesson links. Two matching Grade 7 cards transfer their histories to Grade 6 successors under the approved mapping. The 46 second-language atoms left this cell in version 2026.11.3 and live on unchanged, with the same ids, in `zam-academy:franzoesisch-2fs-gymnasium-6`.

## Verify locally

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Browser verification uses installed headless Chrome. Set `CHROME_BIN` if Chrome is outside the default macOS location and `BROWSER_QA_DIR` to choose a report directory. The browser checks both task levels in both themes for every lesson, tests all workshop targets, and checks language input, moved lesson links, progress persistence and responsive widths. Use zam-core 0.54.0 as pinned in CI. The dev server uses port 5263.

See the [curriculum and legacy inventory record](../docs/franzoesisch-gymnasium-6-coverage.md). Package version 0.2 is awaiting teacher review.
