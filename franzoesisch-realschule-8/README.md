# French 8 · Bavarian Realschule

An Academy learning package for grade 8, group IIIa, based on the [official French curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/franzoesisch), checked on 29 October 2026. Explanations and learning instructions are in German; the original practice texts are in French.

The package contains 40 core lessons, two optional relative-clause extensions, 84 tasks across two levels, and 84 linked ZAM cards. Each lesson combines an explanation, original material, a quick check, short answers and an own written or spoken response. Learners compare their response with a model and three criteria. This self-assessment records practice; it does not grade language proficiency or change FSRS state.

| Stage | Core lessons | Practice |
| --- | ---: | --- |
| On se retrouve | 5 | Arrangements, preferences, adjective agreement, demonstratives and quel |
| Au marché | 5 | Partitives, fixed en expressions, shopping, numbers and tout |
| Notre quotidien | 5 | Verb patterns, irregular verbs, negation, directions and a short talk |
| Raconter hier | 5 | Passé composé with avoir and être, participles, negation and a holiday email |
| Parler et répondre | 5 | Direct and indirect objects, pronouns and digital correspondence |
| Voyager et découvrir | 5 | Timetables, accommodation, places, meals and festivals |
| Écouter et comprendre | 5 | Two listening scripts, a notice, pronunciation and mediation |
| Apprendre à apprendre | 5 | Vocabulary, instructions, reference tools, current research and reflection |
| Pour aller plus loin | Optional: 2 | Qui, que and où; excluded from core progress and grade-8 curriculum bindings |

## Scope and further practice

[coverage.json](coverage.json) indexes all 56 top-level expectations and topic entries, with the thirteen nested grammar details attached to their four parent expectations. The local traceability ids follow the source order and are not official ISB identifiers. Treatment distinguishes guided exercises from preparation. Curriculum topic hours describe the school course, not time needed to complete this app.

Natural listening and viewing, spontaneous partner conversations, longer reading aloud, actual maps, current research, dictionary audio, a full personal vocabulary programme and individual teacher feedback remain additional work. The exercises select vocabulary; they do not supply the approximately 400 new words and expressions expected across the school year. A saved project model is only a structure; learners must perform the requested research themselves.

All dialogues, notices, prices, timetables and personal details are original exercises. Cultural background has explicit reference links. Geographic orientation needs an atlas; cultural comparison uses individual examples instead of national stereotypes. Relative clauses are optional extensions because they are absent from the grade's specified new grammar list.

## Local and offline use

```sh
npm ci
npm run dev           # http://localhost:5215/franzoesisch-realschule-8/
npm test
npm run typecheck
npm run build
npm run package:zip
```

Extract `release/ZAM-Academy-Franzoesisch-8-offline.zip` and open `ZAM-Academy-Franzoesisch-8.html`. The ZIP includes Windows, macOS and Linux launchers. The app is a self-contained HTML file; external references still need internet access.

Only already installed French speech voices are eligible, with fr-FR preferred. The first request waits briefly for the browser to populate its voice list. Playback uses short utterances; stop, navigation, errors and a stalled engine do not award listening progress. If none is available, a partner can read the transcript. Completed playback and the learner's partner-read confirmation are independent evidence. Removing the partner check keeps an already completed playback. Stopping or leaving the lesson invalidates pending playback callbacks. Computer speech does not replace natural listening and viewing.

Progress, theme and the two independent writing drafts stay in this browser. Editing a draft invalidates its previous self-assessment. Saves merge work from other open tabs without replacing a newer stored draft with an unchanged stale copy. Self-assessments stay attached to the exact draft text. A confirmed reset also clears progress held by older tabs; original single-mode listening saves remain readable. Short-answer field contents last for the current page session; their checked status persists. Browser storage can be restricted for local files; the app explains when saving fails and remains usable for the current visit. No accounts, tracking, remote voices, remote grading, external fonts, automatic reference requests or recordings are used.

This package reuses Academy's existing TypeScript, Vite, single-file plugin and Vitest toolchain and adds no dependency to that toolchain.

## Cell and existing evidence

`cell.json` is the sole recall-card list. Lesson quizzes are separate practice tasks. Every card cites its exact lesson at `https://academy.zam-os.org/franzoesisch-realschule-8/#lesson=<id>`. Pages publishes the app and cell together on merge to main. The app explains the Academy import path and lets learners continue locally if the package is not listed yet. The app provides no second card export.

The 126 atom/item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json`. Edit the cell directly and preserve these identifiers. Core atoms declare grade 8, IIIa and the relevant curriculum areas. Extensions carry only Academy bindings. Soft prerequisite links suggest useful foundations while keeping lessons independently accessible.

The four older grammar items remain independent, without replacement, retirement or mastery transfer. The [inventory](../docs/franzoesisch-8-bestandsabgleich.md) records the reasons. `replaces-de-by.json` records all four C rows with `approved: null`, an exact legacy snapshot hash and its source commit. Verify installation and history preservation in disposable libraries:

```sh
ZAM_CORE=file:///absolute/path/to/zam/dist/index.js node scripts/validate-cell.mjs
```

The PR prepares publication through Pages. Synchronization into ZAM release fixtures is a separate step after publication. No migration is activated.

## Verification

Run the package checks above, then the repository checks from the root:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///scratch/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs
ZAM_CORE=file:///scratch/node_modules/zam-core/dist/index.js node franzoesisch-realschule-8/scripts/validate-cell.mjs
```

Use the `zam-core` version pinned in CI. The isolated-library check preserves four old cards and eight review records, starts 84 new cards unlearned and checks idempotence. Browser verification uses the built app over local HTTP because browser policy permits only HTTP(S). Direct `file://` launch and all platform launchers remain untested; the ZIP's exact HTML, offline structure and Unix shell syntax are checked by `scripts/verify-release.mjs`. A missing French voice has an accessible partner-read fallback; computer speech does not certify pronunciation or natural listening skill.

On 30 October 2026, the PR checkout passed 171 package tests, TypeScript checking, a warning-free Biome source lint, production build and ZIP verification. The root command above passed 41 atlas/catalog tests; the pinned `zam-core@0.54.0` installed all 36 cells and the French-specific legacy check passed.

Browser QA of the production build (`npm run preview -- --host 127.0.0.1 --port 5215 --strictPort`) inspected every one of the 42 lesson views on both task levels in light and dark themes. Each rendered its explanation, key rule, three choices, at least two short-answer fields and a distinct task at each level. A completed quiz, short-answer exercise and self-assessment persisted after reload, including the writing draft. Reference navigation and Academy enrollment guidance were checked.

Review regressions are covered in `tests/feedback.test.ts`, `tests/progress.test.ts` and `tests/listening.test.ts`: wrong attempts withhold answer-bearing explanations; completed speech survives partner toggles; separate drafts and assessments merge across tabs; a reset prevents stale saves from restoring old work; delayed voices, cancellation, partial playback, failure and timeout are exercised with a simulated speech engine.

The rebuilt browser app was also checked with two actual tabs: an independently saved Level 2 draft survived navigation in the other tab, same-level draft changes reached the other view, and the prior self-assessment was invalidated. Wrong quiz and short-answer attempts showed hints; correct attempts showed the prepared explanations. A pending voice request was stopped, partner evidence survived reload, and the full festival date remained visible in the key rule.
