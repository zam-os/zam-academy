# French 7 · Bavarian Gymnasium · Second foreign language

This ZAM Academy package follows the [Grade 7 LehrplanPLUS for French as the second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/2-fremdsprache). It continues [French 6 as the second foreign language](../franzoesisch-2fs-gymnasium-6/) and fills the Grade 7 atlas slot `franzoesisch-2fs`.

| Stage | Focus |
| --- | --- |
| Parler et comprendre | Listening for key details, arranging visits, travel, directions and mediation |
| Décrire et comparer | Relative clauses, indirect and stressed pronouns, comparisons, numbers and quantities |
| Raconter et se souvenir | Reflexive and irregular verbs, the passé composé with avoir and être, and the contrast with the imparfait |
| Explorer et rencontrer | Paris, Lyon, Nantes and Brittany, recipes, festivals and Roman Gaul |
| Lire, écrire et réviser | Reading pictures and comics, retelling, pronunciation, accents and vocabulary practice |

The 39 lessons use German guidance and French examples. Each provides a worked example, a three-goal workshop, a quick check, two short answers, a guided task and a transfer task. Visual exercises include a selectable France map, a timeline, a route sketch, a timetable and comic panels.

## Use

Extract the [offline bundle](release/ZAM-Academy-Franzoesisch-2FS-Gymnasium-7-offline.zip) after building it, or open `dist/index.html`. Four listening lessons can use an installed French voice or a partner reading the transcript. Natural speech, spontaneous conversations and feedback on pronunciation require practice with other people and recordings.

Progress and drafts stay in the browser. On the Academy site, the app reads any saved second-language work from the former combined package on the first visit to this course. The reset button also clears this course's entries from that older store. When opening a local HTML file, browser storage depends on the file location.

The cell `zam-academy:franzoesisch-2fs-gymnasium-7` includes 117 cards linked to their lessons. The split preserves existing card identifiers and review histories. Package version 0.0 is awaiting teacher review.

## Verify

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
npm --prefix ../franzoesisch-gymnasium-7 ci
npm --prefix ../franzoesisch-gymnasium-7 run build
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

The dev server uses port 5288. Browser verification uses installed headless Chrome and serves both builds on an intercepted local test of the Academy origin. Set `CHROME_BIN` for a different browser executable path or `BROWSER_QA_DIR` for the report and screenshots. Cell checks use zam-core 0.54.0 as pinned in CI.

See the [curriculum and card continuity record](../docs/franzoesisch-2fs-gymnasium-7-coverage.md).
