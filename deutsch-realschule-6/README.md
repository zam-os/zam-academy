# German 6 Realschule, Bavaria

50 lessons follow the shared Bavarian LehrplanPLUS Grade 6 German curriculum:
8 on speaking and listening, 13 on reading and media, 8 on writing and 21 on
language and spelling. Each lesson has explanations, a worked example, a key
rule, an explorable diagram, a quick check, two case decisions and distinct
guided and transfer writing tasks. Draft comparison uses three concrete
self-assessment criteria. The app does not automatically grade free writing.

The language models change real words, forms and sentence structures: verb
stems, six tenses, active/passive focus, cases, objects, adverbials, relative
clauses, clause combinations, nominalisation and punctuation. All 50 visuals
have three exploration goals that start unchecked. These goals record what
was explored, not mastery. The controls are native keyboard-accessible buttons.
Regression checks tie the controls to their intended grammatical examples and
check the listening route against the described directions and destination.

The package is a local draft (`publication.json`: `local-only`). Teacher review
and teacher videos remain open. It stays outside Pages, the public catalog and
the Academy atlas. Its review-history mapping is a proposal, not an approval.

Open [dist/index.html](dist/index.html) after building, or extract
[release/ZAM-Academy-Deutsch-Realschule-6-offline.zip](release/ZAM-Academy-Deutsch-Realschule-6-offline.zip)
and open `ZAM-Academy-Deutsch-Realschule-6.html`. The ZIP includes Windows,
macOS and Linux starters. Audio, diagrams and styles are embedded; no account
or server is needed. Drafts and progress use this package's own localStorage
key. Sources open only on a click.

```sh
npm ci
npm run dev                 # port 5254
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run test:browser
```

The browser check opens the built file in a temporary headless Chrome profile.
Set `CHROME_BIN` if Chrome is installed outside the default macOS path; CI uses
`/usr/bin/google-chrome`. `BROWSER_QA_DIR` overrides the report and screenshot
folder (default: `zam-deutsch-rs6-browser` under the operating system's temporary
folder). It checks every lesson and both task levels in light and dark themes,
every exploration control and case goal, all selected language-model examples
in both themes, keyboard activation, model answers, rubrics, completion on both
levels, reload persistence, edit invalidation, audio decoding and layouts at
320, 390, 720 and 1280 pixels. Runtime exceptions and external HTTP requests
fail the check.

The [coverage matrix](coverage.json) contains all 61 official expectations. The
curriculum checker verifies each quotation against the captured live page and
checks source, legacy and audio hashes. `supported` rows distinguish practice
supplied here from authentic listening, real conversations, performances,
independent research and reading that still happen outside the app. Grade 6
requires at least two complete children's/youth books by different authors.
A plan or an app checkmark does not certify that reading. See the
[curriculum and legacy inventory](../docs/deutsch-realschule-6-coverage.md).

100 ZAM practice items live only in [cell.json](cell.json), two per lesson.
Their source links use the eventual public lesson anchors. The
[legacy proposal](replaces-de-by.json) inventories twelve old items: four A
candidates need Thomas's explicit approval; eight C items remain active. The
cell declares neither `replaces` nor `retired_items`.

Validate installation, enrolment and preservation of old evidence with the
published zam-core version pinned in repository CI:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

This uses disposable libraries and never opens a configured learner library.
It checks 100 new cards, repeated installation and enrolment, and preservation
of all twelve legacy cards and their review evidence.

The shell derives from `deutsch-gymnasium-5`, which in turn builds on
`deutsch-realschule-5`. All Grade 6 passages and model examples are newly
written. Two original passages were rendered locally using the installed
computer voice Anna; [media provenance](src/media/provenance.json) pins audio
and transcript hashes. They are practice models, not authentic radio or news.
[Source checks](source-checks.json) record the real titles of all five linked
curriculum, museum, university and public-education pages. No videos are added.
