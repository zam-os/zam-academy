# Wirtschaft und Recht 8 Gymnasium

An offline-first ZAM Academy course for Bavaria's Gymnasium, Grade 8, Wirtschaftswissenschaftliches Gymnasium (WWG): the only Ausbildungsrichtung with Wirtschaft und Recht in Grade 8. The package contains 35 core lessons for the three mandatory Lernbereiche, 10 lessons for the selectable Profilbereich and 109 ZAM practice cards. Version 0.0 is awaiting teacher review.

| Area | Lessons | Example |
| --- | ---: | --- |
| 1.1 Consumer decisions | 7 | Weight criteria in a decision matrix and see a different winner. |
| 1.2 Money | 6 | Plan a monthly budget in a modelled spreadsheet and reach a savings goal. |
| 2.1 Business processes and division of labour | 6 | Organise a waffle stand and match production types to production methods. |
| 2.2 Marketing | 9 | Move a product through its life cycle and build a consistent marketing concept. |
| 3 Legal responsibility | 7 | Check damages and criminal responsibility by age, and act safely online. |
| 4 Profilbereich am WWG (optional) | 10 | Time management, charts, credit, youth protection, court procedure, project. |

Each lesson has an explanation with key terms and a takeaway, a quick check, a sorting or ordering workshop, a case solved in steps and a written task on two levels that learners compare with an example and three criteria. Seventeen lessons add one of 13 labs drawn as SVG; seven lessons add generated calculation tasks on two levels (three self-solved level 1 tasks complete the lesson). The Profilbereich is shown by default, does not count towards the core progress, and can be hidden.

Progress, written answers and the practice note stay in the browser profile on the device (`wr_gy8_academy_progress_v1`). Learners on a shared account can choose “Fortschritt zurücksetzen” under “Quellen & Praxis” to delete progress and texts. Source links open on request; the app makes no third-party requests.

See the [curriculum coverage](coverage.json) for the 23 competence expectations and 49 contents of the Fachlehrplan and the [coverage and legacy card notes](../docs/wirtschaft-recht-gymnasium-8-coverage.md). The company visit (LB 2.1) and the project (LB 4.4) take place outside the app.

## Build and test

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run package:zip
```

The development server uses port 5300. Open `dist/index.html` directly to use the offline build, or extract `release/ZAM-Academy-WR-8-Gymnasium-offline.zip` and open the bundled HTML. The ZAM cell is `zam-academy:wirtschaft-recht-gymnasium-8`. Every card links to its lesson through `#lesson=<id>`.
