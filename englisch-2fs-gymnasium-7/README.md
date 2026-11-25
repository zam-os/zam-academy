# English 7 (Second Foreign Language) · Bavarian Gymnasium

This ZAM Academy package follows the [Bavarian LehrplanPLUS for English as a second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/englisch/2-fremdsprache) for grade 7, checked on 25 November 2026. It builds on the [grade 6 second-language package](../englisch-2fs-gymnasium-6/README.md). Directions are in German and practice materials are in English, with German source material or responses where the mediation task calls for them.

| Stage | Lessons | Material and practice |
| --- | ---: | --- |
| Everyday communication | 8 | Station announcement, town map, airport dialogue, pharmacy role play, cinema programme, short talk and mediation in both directions |
| Language resources | 14 | Timelines for result, duration and future, familiar and new modals, conditional I, comparison, pronouns, clauses, lexis and IPA |
| Intercultural learning | 5 | Clickable Cornwall and US maps, civic roles, invitations and a multilingual school exchange |
| Text and media | 5 | Magazine article, adventure story, report, interactive scene and storyboard |
| Learning methods | 3 | Word formation, contextual dictionary use, source checking and error logs |
| Cultural and historical topics | 2 | Celtic-speaking communities, Roman Britain and Bath, Hastings in 1066, and loanwords |

Each of the 37 lessons has three workshop goals, a quick check, two short answers and open practice on two levels. Models and criteria support self-assessment. The 74 ZAM cards link back to their lessons. The [curriculum matrix](coverage.json) records 40 official expectations and topic entries. Natural listening, film, live interaction, source research and teacher feedback are supported by practice prompts and belong in the wider course.

## Use

Open `dist/index.html` after building or extract `release/ZAM-Academy-Englisch-2FS-Gymnasium-7-offline.zip` and use the included HTML or launcher. The archive runs offline. Sources open on click. Listening uses an installed English voice, with the transcript available for a partner to read aloud. Drafts and completion records stay in this browser. They can be cleared using the reset control. Teacher review is open for version 0.0.

## Verify

```sh
npm ci
npm run typecheck
npm test
npm run package:zip
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
node scripts/verify-browser.mjs
```

Use the zam-core version pinned in repository CI. On systems without Chrome at the default macOS path, set `CHROME_BIN`. The browser check opens the actual single-file build. It checks every lesson and level at desktop and mobile widths, opens the reference view, exercises the visuals and completes a full lesson. Screenshots go in `BROWSER_QA_DIR` or the system temporary directory.
