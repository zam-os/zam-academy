# German 5 — Bavarian Mittelschule

51 lessons, 102 checked workshop decisions, 102 writing tasks on two levels and 102 ZAM cards. The common Fachlehrplan applies to Grade 5; there are no separate M-track bindings in this grade.

The app builds on the German Realschule Grade 5 shell, including its separate level drafts, explicit form submission, safe text rendering and cross-tab progress merging. Lesson explanations, cases and writing tasks follow the Mittelschule curriculum. Card text lives only in `cell.json`; the quick check reads its tier-1 item. Every lesson has one atom and two cards.

```sh
npm ci
npm run dev          # http://localhost:5230/deutsch-mittelschule-5/
npm run typecheck
npm test
node scripts/check-curriculum.mjs
npm run package:zip
```

`dist/index.html` is self-contained. `release/ZAM-Academy-Deutsch-Mittelschule-5-offline.zip` contains the same HTML and Windows, macOS and Linux starters. Progress and drafts remain in localStorage under an app-specific key. No accounts or third-party requests are required. The bundled listening material uses a local computer voice and includes transcripts. External links open only after a click.

## Curriculum evidence and limits

The [official Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/deutsch) was fetched live on 2026-11-12. `tests/fixtures/curriculum.html` preserves its bytes; `coverage.json` records the SHA-256 and all 71 competence expectations verbatim. `scripts/check-curriculum.mjs` checks the hash and matches every expectation against the normalized source. The source assigns no separate hours to its Lernbereiche. Every row names actual lessons, evidence and additional practice.

The app prepares listening, conversations, talks, drama, whole-book reading, handwriting, document layout and research. These need real practice, additional material and feedback. Handwriting needs paper; formatted electronic documents need a text editor. The app does not grade free writing, speech or physical performance. A completed lesson records correct checks and a learner-confirmed model comparison, separately for each level. Teacher videos are a later authoring step under the package standard; none are added here.

## Existing cards

No Mittelschule German legacy cells for Grades 5–7 were found in zam-os/zam at `e6a235f75fe87b9d57af38bd61011027b891492c`. `replaces-de-by.json` records an empty proposal. The new cell has no `replaces` or `retired_items`, and no cross-school or primary-school history mapping is proposed.

Registration and Pages configuration are prepared in this branch. Publication requires merging through the normal repository workflow.

## Browser verification

Start a dedicated Chrome profile with remote debugging on port 9441 and `--allow-file-access-from-files`. For example, on macOS:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --remote-debugging-port=9441 --user-data-dir=/tmp/zam-deutsch-browser --allow-file-access-from-files about:blank
```

In a second terminal, run `npm run test:browser` from this package. The script checks every lesson on both levels in light and dark themes, saves screenshots in a temporary folder, checks reference views and mobile layout, completes a lesson on both levels, reloads it and decodes the local listening audio. It resets only this app's progress in that dedicated profile; use a test profile, not a learner's browser. `CHROME_DEBUG_PORT` and `BROWSER_QA_DIR` optionally select the port and artifact folder.
