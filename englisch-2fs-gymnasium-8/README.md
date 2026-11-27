# English 8 (Second Foreign Language) · Bavarian Gymnasium

This ZAM Academy package follows the [Bavarian LehrplanPLUS for English as a second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/englisch/2-fremdsprache) for grade 8, checked on 27 November 2026. It builds on the [grade 7 second-language package](../englisch-2fs-gymnasium-7/README.md). Directions are in German and practice materials are in English, with German source material or answers where mediation tasks call for them.

| Stage | Lessons | Material and practice |
| --- | ---: | --- |
| Kommunizieren & Mitteln | 6 | Canadian podcast, teen media vlog, keeping a conversation going / role play, structured two-minute talk, oral & written mediation |
| Zeiten & Hypothesen | 6 | Present perfect simple vs. progressive, past perfect simple, temporal clauses & tense sequence, conditionals II & III, mixed conditionals & wishes |
| Satzbau, Gerund & Passiv | 7 | Adverb position & nuance, adjectives after verbs of perception, gerund patterns, infinitive patterns, `stop`/`remember` meaning contrasts, two-object verbs & personal passive, passive across tenses |
| Kanada, USA & UK heute | 6 | Coast-to-coast Canada map, Inuit & First Peoples, North American holidays & food calendar, school life & sports, Desert South-West map, Wales (`Senedd`) & UK/US institutions |
| Wendepunkte der Geschichte | 5 | Henry VIII (1534) & Elizabeth I (1588 Armada) history frieze, Mayflower (1620) & New England colonies, Boston Tea Party & 1776 Declaration, westward expansion & Native Americans |
| Texte & Medienkompetenz | 5 | Skimming/scanning & longer narratives, fact vs. fiction, travel blogs & school newspaper articles, continuing stories & diaries, film sequences & critical media use |
| Sprachreflexion & Methoden | 5 | UK/US/Canadian varieties & register, German-English contrasts & reflexives, idioms & linking words, connected speech & IPA, word webs & error logs |

Each of the 40 lessons includes an interactive visual workshop with three goals (clickable SVG maps for Canada, Wales, Desert South-West, and USA expansion; timelines, calendars, condition scales, passive-flow diagrams, and three-part explorers), a quick check, two short-answer items, and open two-level practice with model solutions and self-assessment criteria. The grammar reference summarizes nine key topic blocks with examples and direct lesson links. Three lessons provide local listening/pronunciation playback (`en-CA` / `en-US`) alongside partner reading transcripts.

All 120 ZAM cards (`zam-academy:englisch-2fs-gymnasium-8`, cell version `2026.11.1`) cite their corresponding lesson. The [curriculum matrix](coverage.json) documents all 46 verbatim LehrplanPLUS expectations (`23` `implemented`, `23` `supported`). Natural audio/film recordings, spontaneous live conversation, extensive youth-novel reading, independent online research, and teacher feedback stay in classroom practice.

[`replaces-de-by.json`](replaces-de-by.json) records the `proposal-only` inventory (`approved: null`) of the legacy grade 8 cell `de-by:gymnasium-8-englisch-past-perfect-passive-indirect-speech-usa` (`0` Category A, `0` Category B, `4` Category C `keep-active`), so `cell.json` declares neither `replaces` nor `retired_items` until Thomas reviews the mapping.

## Use

Open `dist/index.html` after building or extract `release/ZAM-Academy-Englisch-2FS-Gymnasium-8-offline.zip` and launch the included self-contained HTML or starter script offline. External source links open only on user click. Progress, drafts, and self-checks stay only in the browser (`localStorage` key `englisch_2fs_gym8_progress_v1`) and can be cleared at any time with the reset button. Teacher review is open for package version `0.0`.

## Verify

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
BROWSER_QA_DIR=/tmp/zam-e8s-browser node scripts/verify-browser.mjs
```

Use the `zam-core` version pinned in repository CI (`0.54.0`). On Linux systems without Chrome at the default macOS path, set `CHROME_BIN=/usr/bin/google-chrome`. The headless browser verification opens `dist/index.html`, checks both task levels of every lesson at desktop (`1280px`), tablet (`720px`), and mobile (`375px`) widths in light and dark themes, completes all 40 workshops (including SVG hotspot clicks), tests grammar-reference navigation, completes a full lesson, and verifies cross-tab storage reset. The Vite development server uses port `5299`.
