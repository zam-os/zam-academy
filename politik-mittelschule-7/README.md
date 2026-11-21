# Politics and Society 7 · Bavarian Mittelschule

German-language lessons for Grade 7, learning area 3 of Geschichte/Politik/Geographie (GPG), for the Regelklasse (R7) and the Mittlere-Reife-Klasse (M7). The path has three stages, each with its own accent colour:

1. **Arbeit und Soziale Frage**: a working day in the factory, living in a tenement, the labour movement, help from churches and employers, Bismarck's social insurance laws, and (M7) a comparison with today's five-branch social insurance.
2. **Stadt im Wandel**: from an agrarian to an industrial society, a model town with a time slider from 1850 to 1910, rich and poor districts, and (M7) new occupations.
3. **Krieg und Frieden 1914–1919**: causes of the First World War, the July Crisis, the war-guilt debate from Article 231 to Fischer and Clark, the Treaty of Versailles and the discontent it caused.

The Regelklasse path has 13 lessons and the M-Zug path 15. Learners choose their track on the learning path; the two M7 lessons stay open to everyone as optional extensions. Every lesson has a drawn diagram, a three-option quick check, a classification or ordering workshop with feedback per entry, and writing tasks with model answers and criteria on two levels. The quick check, workshop and Level 1 self-assessment count towards completion.

Progress and writing stay in the browser (`politik_ms7_academy_progress_v1`). The offline ZIP contains a single HTML app and launchers for Windows, macOS and Linux. Source links open only on a click.

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

Vite serves the package at `http://localhost:5269/politik-mittelschule-7/`. The ZIP is `release/ZAM-Academy-Politik-7-offline.zip`.

The cell has 15 atoms and 45 practice cards, three per lesson, bound to GPG 7 learning area 3 for the tracks each lesson serves. The package starts at version 0.0 pending teacher review. See [coverage.json](coverage.json) for the official expectations and [the coverage notes](../docs/politik-mittelschule-7-coverage.md) for sources and the legacy inventory.
