# French 7 · Bavarian Gymnasium · First foreign language

This package follows the [Grade 7 LehrplanPLUS for French as the first foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/1-fremdsprache). The [Grade 7 course for the second foreign language](../franzoesisch-2fs-gymnasium-7/) has its own atlas entry.

The 29 lessons use German guidance and French examples. Each lesson has a worked example, a three-goal workshop, a quick check, two short answers and a guided and a transfer task. Topics include longer messages, indirect speech, partitives, past narration, school exchanges, the collège and French regions. Visuals include a selectable regions map, a narrative timeline and sentence comparisons.

## Train offline

Build and extract the offline ZIP, then open its HTML file or run an included launcher. The browser keeps drafts and progress locally. On the Academy site, existing first-language progress and drafts from the former combined package carry over. Three listening activities support an installed French voice or a partner reading the transcript. Natural speech, regional accents, role-play and pronunciation feedback need additional practice.

Learners sharing a device account and browser profile can use **Lokalen Fortschritt zurücksetzen** at the end of a session to clear their drafts and progress for this course.

The Academy cell includes 87 cards. Each card links to its lesson. The approved migration transfers one legacy Grade 8 imparfait review history to its existing Grade 7 successor.

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

Use zam-core 0.54.0 as pinned in CI. Set `CHROME_BIN` for a different browser executable path or `BROWSER_QA_DIR` for the report and screenshots. The dev server uses port 5277.

See the [curriculum and legacy inventory](../docs/franzoesisch-gymnasium-7-coverage.md).
