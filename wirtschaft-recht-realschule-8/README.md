# Wirtschaft und Recht 8 Realschule

An offline-first ZAM Academy course for Bavaria's Realschule, Wahlpflichtfächergruppe II. The package contains 39 core lessons, five optional bilingual lessons and 117 ZAM practice cards. Version 0.0 is awaiting teacher review.

| Area | Core lessons | Example |
| --- | ---: | --- |
| Goods markets | 8 | Move supply and demand curves and read their intersection. |
| Consumer choices | 7 | Compare unit prices, assess marketing and choose how to pay online. |
| Young people and the law | 6 | Use age and other facts to apply the relevant rule. |
| Private law | 11 | Follow a purchase from agreement to transfer of ownership, then resolve disputes. |
| Career orientation | 7 | Explore career choices, compare training routes and prepare an internship enquiry. |

Each lesson includes a worked example, a quick check, an interactive classification or sequencing workshop, a case and two levels of written practice. Seven interactive models include a two-sector circular flow, a unit-price comparison, legal decision flows and a career decision matrix. Learners compare their written responses with examples and criteria. Progress, written answers and practice notes stay in the browser profile on the device. Learners using a shared account can choose “Fortschritt zurücksetzen” under “Quellen & Praxis” to delete the package’s progress and texts. Source links open on request.

See [curriculum coverage](coverage.json) for the 33 required and two optional competency expectations, and the [legacy card review](../docs/wirtschaft-recht-8-bestandsabgleich.md) for the approved legacy card mapping. The practical activity takes place outside the app.

## Build and test

```sh
npm ci
npm run typecheck
npm test
npm run build
npm run package:zip
```

The development server uses port 5294. Open `dist/index.html` directly to use the offline build, or extract `release/ZAM-Academy-WR-8-offline.zip` and open the bundled HTML. The ZAM cell is `zam-academy:wirtschaft-recht-realschule-8`. Every card links to its lesson through `#lesson=<id>`.
