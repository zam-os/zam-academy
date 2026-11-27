# French 8 · Bavarian Gymnasium · Second foreign language

This ZAM Academy package follows the [Grade 8 LehrplanPLUS for French as the second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/franzoesisch/2fs). It continues [French 7 as the second foreign language](../franzoesisch-2fs-gymnasium-7/) and fills the Grade 8 atlas slot `franzoesisch-2fs`.

| Stage | Focus |
| --- | --- |
| Échanger et s’entendre | Announcements and a podcast, the Sauzay and Voltaire exchanges, invitations, inversion questions, lequel, qui/que questions, the doctor's visit |
| Décrire et nuancer | Country prepositions, adverbs in -ment, -emment, -amment and -ément with comparison, personne ne / rien ne, mise en relief, opinions, fractions and charts |
| Raconter dans le temps | venir de and être en train de, the plus-que-parfait and anteriority, reflexive verbs in the past, receptive agreement after avoir, courir, rire, croire and mourir, a fait divers and a story |
| La France et le Québec | Regions compared with the Länder, a German programme mediated into French, Marseille and Lille, Québec, Québec and southern French, the medieval castle, festivals, the French school system |
| Jeunes, médias et langue | Media and role models, a BD page and character traits, registers and slang, posts and e-mails with netiquette, a mini-talk, word formation, paraphrase, the dictionary and IPA, pronunciation, verb valency |

The 43 lessons use German guidance and French examples. Each has a worked example, a key rule, a visual explorer with a three-goal workshop, a quick check, two short answers, a guided task and a transfer task. The explorers include timelines, a castle sketch, a pie chart, a school ladder, sketch maps of France and Québec, a comic page, word tiles and a departure board. Grade 9 grammar (y and en as adverbial pronouns, futur simple, conditionnel, si-clauses) is left out; the tests check this.

## Use

Extract the [offline bundle](release/ZAM-Academy-Franzoesisch-2FS-Gymnasium-8-offline.zip) after building it, or open `dist/index.html`. Three listening lessons can use an installed French voice or a partner reading the transcript. Natural recordings, spontaneous conversation and pronunciation feedback need other people and real audio.

Progress and drafts stay in this browser under the key `franzoesisch_2fs_gym8_academy_progress_v1`. The reset button deletes progress and texts.

The cell `zam-academy:franzoesisch-2fs-gymnasium-8` holds 129 cards linked to their lessons. It ships without `replaces` and `retired_items`; the mapping of the legacy Grade 8 cell in [`replaces-de-by.json`](replaces-de-by.json) is a proposal awaiting Thomas's decision. Package version 0.0 is awaiting teacher review.

## Verify

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

The dev server uses port 5296. Browser verification uses an installed headless Chrome; set `CHROME_BIN` for another executable or `BROWSER_QA_DIR` for the report and screenshots. Cell checks use zam-core 0.54.0 as pinned in CI.

See the [curriculum and card record](../docs/franzoesisch-2fs-gymnasium-8-coverage.md).
