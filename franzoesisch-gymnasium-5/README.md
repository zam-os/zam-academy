# French 5 · Bavarian Gymnasium

A published ZAM Academy learning package for French as the **first foreign language** at [https://academy.zam-os.org/franzoesisch-gymnasium-5/](https://academy.zam-os.org/franzoesisch-gymnasium-5/), based on the [official LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/franzoesisch/1-fremdsprache), checked on 14 November 2026. Learner guidance is German; examples and practice materials are French.

The package has 40 lessons in eight stages, 120 visual construction goals, 80 constrained answers, 80 production tasks on two levels and 120 ZAM cards. The saved curriculum and `coverage.json` trace all 47 top-level expectations and topic blocks. Grammar sublists remain within their parent expectation. The official page gives no hours per learning area.

The path starts with greetings, pronunciation and numbers, then covers family, possessions, articles, present-tense verbs, questions, negation, direct and indirect noun objects, school, leisure, time and near-future plans. France, Paris and Brittany introduce geography and everyday culture. Reading, listening, mediation, correspondence, festivals, an original rhyme and learning techniques complete the path.

Visual sentence construction connects subject, verb, object and meaning. A number slider exposes the French 60/80-based number patterns. A clock connects moving hands and 24-hour labels. A labelled schematic mainland map allows cities, rivers and mountains to be highlighted. All 120 goals start open and have tested witnesses.

## Use

Open `dist/index.html` or extract `release/ZAM-Academy-Franzoesisch-Gymnasium-5-offline.zip` and open its HTML. The ZIP includes Windows, macOS and Linux launchers. Lessons need no server or internet. Source links open only on a click. There are no video embeds, remote fonts, remote speech voices or background third-party requests.

Progress and drafts use a package-specific `localStorage` key. A lesson counts after its three workshop goals, quick check, short answers and Level 1 self-assessment; listening lessons also require completed local speech or partner-read confirmation. Editing the draft invalidates its self-assessment. Level 2 is additional transfer practice. Completion records practice, not assessed language proficiency.

Only installed French speech voices are accepted. A partner can read every listening transcript if speech is unavailable. Natural listening and audiovisual material, spontaneous conversation, pronunciation feedback, actual drawing, current-event research and a sustained vocabulary programme remain additional work. The coverage matrix marks these expectations `supported` and names the limits. The package neither records nor sends learner speech.

Published regularly at [https://academy.zam-os.org/franzoesisch-gymnasium-5/](https://academy.zam-os.org/franzoesisch-gymnasium-5/) and listed in the public catalog, atlas and Pages build. Teacher review and teacher videos remain open. No cards are installed in a personal library simply by using this app in the browser.

## Develop and verify

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

`npm test` checks both source hashes and all 47 verbatim coverage rows before running Vitest. The cell script uses a disposable library: installation does not enrol, 120 cards start fresh, and repeated installation/enrolment preserves a submitted recall record. Use `zam-core` 0.54.0, the version pinned in repository CI.

`verify-browser.mjs` launches installed headless Chrome through its debugging pipe. Its default executable is the macOS Chrome path; set `CHROME_BIN` elsewhere. Screenshots and a JSON report go to `/private/tmp/zam-f5-browser` by default, configurable with `BROWSER_QA_DIR`. It checks every lesson on both levels in both themes, all workshop handlers, 390/720 px layouts, feedback, the rubric gate, reload persistence, draft invalidation, clock, number slider, map layers and partner-listening fallback. The real OS launchers and actual installed speech playback still require manual checks.

For a local server: `npm run dev` uses port 5245. If occupied, choose a free port with `--port`.

## Cell and curriculum boundaries

Cards live only in `cell.json`. The 160 atom/item ULIDs, lesson anchors and slugs are pinned in `tests/fixtures/public-contract.json`. Keep them stable and edit the cell directly. Soft prerequisite edges support remediation without locking access. The cell binds Gymnasium grade 5 without a Realschule track.

The checked grade 6 curriculum introduces object pronouns, adjective agreement/position and passé composé; these are not grade 5 teaching targets here. The local legacy inventory has no Gymnasium French grade 5 or 6 cell. The composite grade-7 card includes a quantity-rule facet, but also several later grammar targets; Thomas explicitly left it with grade 7. `replaces-de-by.json` records that decision and proposes no replacements or retirements. See [the curriculum and inventory record](../docs/franzoesisch-gymnasium-5-coverage.md).
