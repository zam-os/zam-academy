# Französisch 6 (2. Fremdsprache) · Gymnasium Bayern

This ZAM Academy package follows the LehrplanPLUS [Fachlehrplan Französisch 6 (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache): the first year of French for learners who already take English. It fills the atlas cell `franzoesisch-2fs`, grade 6.

| Stage | Lessons | Main topics |
| --- | ---: | --- |
| Bonjour, les amis ! | 5 | Greetings, introducing yourself, sounds and IPA, classroom phrases, numbers to 100 |
| Ma petite vie | 7 | Articles and plurals, family and possessives, animals, adjective agreement and position, demonstratives, home and prepositions, a profile form |
| Les verbes en action | 5 | être and avoir, -er verbs and their spelling, -re verbs, aller and faire |
| On parle ensemble | 7 | Questions, quel, negation with ne … pas / plus / jamais / rien, noun objects, direct object pronouns, vouloir and pouvoir |
| Une journée et demain | 5 | School verbs, leisure, the time, futur proche, an invitation |
| En route en France | 6 | A labelled map of France, Paris, Brittany, station and hotel, asking the way, shopping and quantities with de |
| Je comprends ! | 5 | Two listening scripts, a poster, mediation, a short message |
| À toi de créer | 6 | Birthdays and Christmas, an original comptine, vocabulary cards, accents on a keyboard, a small project, a comic dialogue |

Each lesson has a worked example with a key rule, a visual workshop with three goals, a quick check, two short answers and two writing tasks (Level 1 guided, Level 2 transfer). Guidance is in German, with French examples and practice.

## History

Until November 2026 these 46 lessons were the second-language path of [`franzoesisch-gymnasium-6`](../franzoesisch-gymnasium-6/), which then also held the first-language path. They moved here unchanged so that each LehrplanPLUS path has its own atlas cell. Lesson ids (`f6-2-…`) stay the same. The app reads a learner's saved state from the former package once, keeping only these lessons. The ZAM atoms and cards keep their ids, slugs and texts, so review histories stay with them (see [the coverage record](../docs/franzoesisch-2fs-gymnasium-6-coverage.md)).

## Use

Extract the [offline bundle](release/ZAM-Academy-Franzoesisch-2FS-Gymnasium-6-offline.zip) after building it, or open `dist/index.html`. Progress and your own texts stay in this browser on this device. They are not sent anywhere and not synchronised. If several children share one device account, choose „Lokalen Fortschritt zurücksetzen“ at the end; that deletes the texts too.

For the progress bar, complete the workshop, the quick check, the short answers and the Level 1 model comparison. Level 2 provides additional transfer practice. Three listening lessons use an installed French voice or a partner reading the provided transcript. The package does not record speech. Source links open on demand. Natural listening and audiovisual material, spontaneous conversation, pronunciation feedback and current-event research still need practice outside the app.

The ZAM cell `zam-academy:franzoesisch-2fs-gymnasium-6` contains 46 atoms and 138 cards with permanent lesson links. Its curriculum bindings use the subject `franzoesisch-2fs`.

## Verify locally

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Browser verification uses installed headless Chrome. Set `CHROME_BIN` if Chrome is outside the default macOS location and `BROWSER_QA_DIR` to choose a report directory. Use zam-core 0.54.0 as pinned in CI. The dev server uses port 5282.

Package version 0.0 is awaiting teacher review.
