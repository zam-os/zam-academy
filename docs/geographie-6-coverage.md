# Geography 6 Realschule curriculum and legacy cell review

The [Grade 6 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/geographie) from Bavaria's Staatsinstitut für Schulqualität und Bildungsforschung (ISB) applies to all tracks. The [coverage matrix](../geographie-realschule-6/coverage.json) maps 35 original competence statements to 25 lessons. Its SHA-256 records the official HTML retrieved on 18 November 2026. The [pinned excerpt](../geographie-realschule-6/tests/fixtures/official-curriculum.json) contains the official statements, titles and hours. The [ISB usage terms](https://www.lehrplanplus.bayern.de/seite/nutzungsbedingungen) distinguish the curriculum text from other site material.

| Learning area | Approx. periods | Competencies | Lessons |
| --- | ---: | ---: | ---: |
| Europe | 8 | 5 | 4 |
| Weather and climate | 10 | 7 | 5 |
| Agriculture and food | 9 | 5 | 4 |
| Transport and industry | 9 | 8 | 4 |
| Energy | 8 | 4 | 3 |
| Tourism | 8 | 4 | 3 |
| Current geographical question | 4 | 2 | 2 |

Rows marked `supported` identify activities that require learners to collect evidence, conduct experiments, research a local case, plan a real trip or give a presentation. The app provides worked cases, checklists and spaces for notes. The current-case example is the October 2026 flooding on Crete. When the example is no longer recent, learners still select a current event for their own investigation. [Copernicus report](https://mapping.emergency.copernicus.eu/news/flood-in-crete-greece-emsr933/), [Euronews reporting](https://www.euronews.com/2026/10/01/crete-at-the-mercy-of-severe-weather-floods-landslides-power-cuts-and-closed-schools)

Grade 5 supplies map literacy and the physical and political geography of Germany and Bavaria. Grade 7 moves to planetary climate foundations and other continents. Grade 6 applies map skills to Europe and compares European climates without teaching the Grade 7 global climate framework. [Grade 5 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/geographie), [Grade 7 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geographie)

## Legacy items

- The eight cards from `de-by:realschule-6-geographie-deutschland-bayern-raum` are covered by the existing [Grade 5 mapping](../geographie-realschule-5/replaces-de-by.json). Its three approved matches and five keep-active decisions belong to that package.
- The old Grade 5 agriculture cards include a regional superlative and a multipart structural-change prompt. Grade 6 does not teach either as the same retrieval. The Grade 5 mapping keeps those cards active.
- The former Grade 7 Europe cell, `de-by:realschule-7-geographie-europa-raum-wirtschaft`, is the candidate source for this package because the official curriculum teaches its European themes in Grade 6. The [proposal](../geographie-realschule-6/replaces-de-by.json) enumerates all eight original items. Three have an A match (the Ural, the North Atlantic Current and the Schengen Agreement). Five are C items to keep active. Thomas needs to approve the scope and the three transfers before a later cell can declare them.
- Overlapping Gymnasium cards serve a different school type and stay with their original cell.

Version 0.0 has no history transfers or retirements. It awaits teacher acceptance. The learner app has been prepared for Academy registration, and ZAM can bundle a published release in a separate integration round.
