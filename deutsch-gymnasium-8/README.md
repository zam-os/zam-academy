# Grade 8 German · Bavarian Gymnasium

The package has 42 lessons with 84 ZAM practice cards. The four common units cover listening and speaking, reading and media, writing, and language and spelling. Four lessons form the Musisches Gymnasium (MuG) profile. The starting package version is 0.0 and Grade 8 teacher review is pending.

Each lesson has a worked example, three selectable visual states, a quick check, two cases and two writing tasks with model answers and a three-point self-assessment. Learners compare a scaled chart, a stage plan, a storyboard and a timeline alongside the text and sentence models. Four offline audio examples support comprehension, structured note-taking and comparison of sound design. Two examples offer expandable transcripts and the sound comparison includes a description and the shared line. Text drafts and progress stay in the current browser profile under `deutsch_gym8_progress_v1`.

The [coverage matrix](coverage.json) maps all 48 LehrplanPLUS expectations. The [curriculum and history notes](../docs/deutsch-gymnasium-8-coverage.md) describe the Grade 7 and 9 boundaries, classroom practice and the approved 3B history transfer. The [media record](src/media/provenance.json) identifies the synthetic voice and sounds. The [source checks](source-checks.json) record the fetched titles and hashes. The learner texts are original except for a short quotation and a paraphrase of Johanna Spyri's 1880 opening chapter.

## Run and verify

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run test:browser
```

Vite uses port 5303. Open `dist/index.html` directly after the build, or extract `release/ZAM-Academy-Deutsch-Gymnasium-8-offline.zip` and open the included HTML file. The archive also has launchers for Windows, macOS and Linux.

The browser check opens the built single-file app with a temporary Chrome profile. `CHROME_BIN` selects the Chrome executable and `BROWSER_QA_DIR` the report and screenshot directory. It checks both levels, light and dark themes, the learning path, references, keyboard activation, chart selection, audio decoding and local progress.

Use the CI version of zam-core to verify enrolment and the approved history transfer in disposable libraries.

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
```
