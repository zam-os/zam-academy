# Grade 5 German for Bavarian Realschule

The package follows the shared Grade 5 LehrplanPLUS curriculum. The 37 lessons
cover speaking and listening, reading and media, writing, and language and
spelling. Each lesson has a worked example, a quick check, two workshop
decisions and a guided and transfer task. Learners compare their drafts with a
model and use a three-point checklist. The app saves progress in the browser.

Open `dist/index.html` after building, or extract the offline ZIP and open
`ZAM-Academy-Deutsch-5.html`. The audio and illustrations are part of the
HTML. The original listening passage was rendered with the German eSpeak NG voice
via [Spellophone 0.2.1](https://spellophone.spellingcreator.org/guide/node). The
app ships the audio and transcript. Its build needs no speech engine.

```sh
npm ci
npm run dev          # port 5222
npm run typecheck
npm test
npm run package:zip   # release/ZAM-Academy-Deutsch-5-offline.zip
```

The [coverage matrix](coverage.json) maps all 55 curriculum expectations to
practice or preparation. The [curriculum and card inventory](../docs/deutsch-5-coverage.md)
explains the role of classroom practice and how the 16 legacy cards were
compared. The 77 ZAM cards live in [the cell](cell.json).

This package is ready for local evaluation. The publication marker keeps it
out of the public catalog until release is authorised.
