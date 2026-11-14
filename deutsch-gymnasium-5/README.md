# German 5 Gymnasium, Bavaria

46 lessons follow the shared Bavarian LehrplanPLUS Grade 5 German curriculum:
7 on speaking and listening, 12 on reading and media, 8 on writing and 19 on
language and spelling. Every lesson has a worked example, a key rule, an
explorable labelled diagram, a quick check, two case decisions and distinct
guided and transfer writing tasks. Learners compare drafts with a model and
use a three-point rubric. The app does not automatically grade free writing.

The package is a local draft (`publication.json`: `local-only`). Teacher review
and teacher videos remain open. It is excluded from Pages, the public catalog
and the Academy atlas until publication is explicitly authorised.

Build and open `dist/index.html` directly, or extract
`release/ZAM-Academy-Deutsch-Gymnasium-5-offline.zip` and open
`ZAM-Academy-Deutsch-Gymnasium-5.html`. The ZIP includes Windows, macOS and Linux
starters. Audio, diagrams and styles are embedded in the HTML; no server or
account is needed. Progress and drafts use this app's own localStorage key.
Sources open only on a click.

```sh
npm ci
npm run dev                 # port 5246
npm run typecheck
npm test
node scripts/check-curriculum.mjs
npm run package:zip
node scripts/verify-browser.mjs
```

The browser check starts a fresh, temporary headless Chrome profile and opens
the built file. Set `CHROME_BIN` if Chrome is installed elsewhere, or
`BROWSER_QA_DIR` to change the screenshot/report directory (default:
`/private/tmp/zam-deutsch-gym5-browser`). It checks every lesson, model and
rubric on both levels in light and dark themes, all exploration controls and
case goals, completion on both levels, reload persistence, edit invalidation,
audio decoding and layouts at 320, 390, 720 and 1280 pixels. It rejects runtime
exceptions and external HTTP requests.

The [coverage matrix](coverage.json) maps all 42 official expectations. Its
`supported` rows identify work that still requires other people, a whole
children's or youth book, authentic sources or a library. A model comparison
and self-assessment record practice, not demonstrated mastery. See the
[curriculum and legacy inventory](../docs/deutsch-gymnasium-5-coverage.md) for
the neighbouring-grade check and publication limits.

92 ZAM practice items live only in [cell.json](cell.json), two per lesson.
Their source links use the eventual published lesson anchors. No item declares
`replaces`, and no old item is retired. The [legacy proposal](replaces-de-by.json)
inventories all sixteen old items: one possible A mapping awaits Thomas's
explicit approval; fifteen C items remain active. Even approving publication
does not approve a review-history transfer.

Validate installation and enrolment using the published zam-core version
pinned in the repository CI:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

This uses disposable libraries, tests 92 fresh cards and repeated installation,
and verifies that all sixteen legacy cards and their review evidence remain
unchanged. It never opens a configured learner library.

The app shell and announcement derive from `deutsch-realschule-5`; the original
computer-voiced story *Die Maus und das Blatt* derives from
`deutsch-mittelschule-5`. Both listening passages have matching transcripts;
[media provenance](src/media/provenance.json) pins their bytes and transcript
hashes. The build needs no speech engine. All new diagrams are local SVG/HTML.
