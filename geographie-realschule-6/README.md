# Geography 6 · Bavarian Realschule

One German-language learning path for all tracks. The 25 lessons cover Europe, weather and climate, agriculture and food, transport and industry, energy, tourism, and current geographical questions. The [coverage matrix](coverage.json) records how the package addresses each of the 35 official competencies. [LehrplanPLUS Bayern](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geographie)

## Study and practise

- Compare European map layers, choose countries and capitals, and follow the Rhine, the Brenner transport corridor and NordLink.
- Read comparative climate diagrams, switch between land surfaces in the runoff model, compare a traffic count, or change a lamp's running time.
- Complete a quick check and a workshop with feedback. In Level 1, use guided prompts and assess your answer against a model response. In Level 2, apply the same idea to a new case.
- Keep a country dossier over the school year. A separate worksheet supports comparing two sources and preparing a short presentation about a current event.

The training app and its exercises run offline. Progress, drafts and research notes stay in the browser. External references open on request. Learners gather real observations and sources, conduct the physical experiments and present their findings separately.

## Run and build

```sh
npm ci
npm run dev          # http://localhost:5257/geographie-realschule-6/
npm run verify:content
npm test
npm run package:zip
npm run verify:browser
```

The ZIP in `release/` contains a standalone HTML file and launchers. Unzip and open the HTML file to start. The browser check opens the built file directly and uses `CHROME_BIN` if Chrome is installed outside the default macOS path.

The [ZAM cell](cell.json) has 50 review cards, each linked to its lesson. The [curriculum and legacy review](../docs/geographie-6-coverage.md) explains the three approved review-history transfers from the former Grade 7 Europe cell. Package version 0.0 is awaiting teacher review.
