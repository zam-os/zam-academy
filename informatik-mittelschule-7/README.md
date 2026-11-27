# Informatik 7 Mittelschule

This ZAM Academy package follows the Bavarian LehrplanPLUS for Grade 7
Regelklasse (R7) and Mittlere-Reife-Klasse (M7). The shared path has 12 German
lessons, 36 workshop goals, guided and transfer exercises, and 36 linked ZAM
review cards.

| Lernbereich | What learners do |
| --- | --- |
| 1 · Digitaler Informationsaustausch | Route a message to a chat, mailbox or shared document. Check suspicious messages against an independent source, decide how to share an image, and weigh the effects of platform features. |
| 2 · Datenverarbeitung | Zoom in on raster and vector graphics, choose a format, crop or retouch a local picture, remove a background colour, and edit and export geometric objects. |
| 3 · Programmieren | Build a rover sequence, test both branches, move a condition into a loop, track variables, and fix a boundary bug while following the structogram. |

Each lesson includes a worked example, key terms, a quick check and two practice
strands. The transfer level uses different scenarios or combines steps. A
[coverage matrix](coverage.json) identifies competencies that need classroom
practice alongside the app. See [curriculum coverage and legacy
inventory](../docs/informatik-mittelschule-7-coverage.md).

## Run and verify

```bash
npm ci
npm run dev
npm run typecheck
npm test
npm run package:zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
```

The development server uses port 5291. The ZIP provides a single offline HTML
file with launchers for Windows, macOS and Linux. The app stores study progress
in the current browser. Image data stays in memory until the learner exports a
new file. Curriculum and Academy links open on demand.

The [cell](cell.json) uses stable lesson and review item IDs. Each review card
links back to its workshop. To verify installation, card creation and
idempotent reinstallation in a disposable library, run:

```bash
ZAM_CORE=<file-URL-to-the-CI-pinned-zam-core-entry> node scripts/validate-cell.mjs
```

Package version 0.0 is awaiting teacher review.
