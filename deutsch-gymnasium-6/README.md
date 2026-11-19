# German 6 Gymnasium

An offline ZAM Academy course for Grade 6 at Bavarian Gymnasium. The 49 lessons follow the shared LehrplanPLUS curriculum across all four learning areas.

| Learning area | Lessons | Activities |
| --- | ---: | --- |
| Speaking and listening | 8 | School radio, reading aloud, speaking from notes, class discussion and role-play |
| Reading and media | 12 | Ariadne’s maze, literary forms, a reading diary, charts, source evaluation and a camera workshop |
| Writing | 8 | Writing plans, narrative, event reports, procedures, reasoned requests and editing |
| Language and spelling | 21 | Sentence blocks for active and passive voice, complements and clauses, plus spelling and punctuation |

Each lesson has a worked example, an interactive model with three targets, a quick check, two case decisions and a guided and transfer task. Learners use a sample answer and a checklist to assess their drafts. A complete book, live talks and discussions, a library visit, external media and word processing are practice outside the app. The app stores progress and drafts in the current browser.

```sh
npm ci
npm run dev         # http://localhost:5258/
npm test
npm run check:curriculum
npm run package:zip # release/ZAM-Academy-Deutsch-Gymnasium-6-offline.zip
npm run test:browser
```

Run `npm run test:browser` after building the app. Set `CHROME_BIN` to the local Chrome executable when the default macOS path does not apply. The ZIP contains a single HTML file and starters for Windows, macOS and Linux. The two speech recordings are embedded, with transcripts. Source pages open on request.

Version 0.0 is a local edition with teacher review pending. [cell.json](cell.json) holds 98 ZAM review items with stable lesson links. The [curriculum and legacy review](../docs/deutsch-gymnasium-6-coverage.md) documents the evidence and the scope of the card proposal.
