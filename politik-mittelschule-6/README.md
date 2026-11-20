# Politics and Society 6 · Bavarian Mittelschule

Seven German-language lessons for Grade 6, learning area 3 of Geschichte/Politik/Geographie (GPG). The path moves from life in castles and monasteries through medieval education, judicial powers and the three-estate model to work in town and countryside and freedoms under today's Basic Law.

Every lesson has a labelled diagram, a three-option quick check, a classification workshop with feedback on individual choices, and writing tasks with model answers and criteria on two levels. The first writing level offers guiding questions. The second asks learners to apply what they know to a new case. The quick check, workshop and first writing self-assessment count towards local completion. A glossary keeps the core terms available for reference. The home illustration is an imagined scene generated with the built-in ImageGen tool. Its prompt is recorded in the [coverage notes](../docs/politik-mittelschule-6-coverage.md).

The app keeps progress and writing in the browser. The offline ZIP contains a single HTML app and launchers for Windows, macOS and Linux. Links to sources and the Academy open on a click.

## Develop and verify

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

Vite serves the package at `http://localhost:5261/politik-mittelschule-6/`. The ZIP is `release/ZAM-Academy-Politik-6-offline.zip`.

The cell has seven atoms and 14 practice cards. Each card points to its lesson. The package starts at version 0.0 pending teacher review. See [coverage.json](coverage.json) for the official expectations and [the coverage notes](../docs/politik-mittelschule-6-coverage.md) for sources and the legacy inventory.
