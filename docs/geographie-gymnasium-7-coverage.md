# Grade 7 Gymnasium geography curriculum and legacy review

The source is the [Bavarian Grade 7 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geographie),
which applies across Gymnasium tracks. The page was fetched on 2026-11-21.
It assigns no separate hour totals to these six learning areas and treats area 1
as work across the school year. The [coverage matrix](../geographie-gymnasium-7/coverage.json)
records the source byte hash, the digest of each of its 29 competence statements,
and English descriptions with lesson evidence. Run
`node scripts/check-curriculum.mjs <downloaded HTML>` from the package to
verify the mapping against the checked snapshot.

| Learning area | Lessons | Examples |
| --- | ---: | --- |
| 1. Geographic techniques | 4 | Map-layer comparison, Rotterdam radar view and schematic, diagram scaling and source checks |
| 2. Unity and diversity in Europe | 3 | Locating states, everyday Single Market examples, multilingualism and migration |
| 3. Physical geography | 5 | European relief, climate charts, mountain rainfall and vegetation, plate boundaries and hazard monitoring |
| 4. Rural areas | 4 | Irrigation in southeastern Spain, Irish pasture, food comparisons and accessibility |
| 5. Metropolitan areas | 3 | Paris and its hinterland, industry-specific location criteria, the Öresund link |
| 6. Seas and coasts | 4 | Coast formation, the port of Rotterdam, marine resource conflicts and Wadden Sea protection |

Learners draw sketches and independent diagrams outside the app and use the
prompts for research and classroom discussion. Analysing real press and travel
materials and presenting results with geographic media also takes additional
work. The matrix identifies the competences supported this way. Climate charts
and quantitative scenarios are labelled as models.

The package revisits the [Grade 5 map skills](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/geographie)
before applying them to Europe. The Grade 6 Bavarian Gymnasium timetable
has no geography lesson, as recorded in the Academy registry. The
[Grade 8 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/geographie)
moves to other regions. The Grade 8 legacy cell on tropics and deserts is
outside this package.

## Legacy cards

The [proposal](../geographie-gymnasium-7/replaces-de-by.json) inventories
four Grade 7 items on Europe and eight items from the legacy Grade 6 Europe
cell. The neighbouring Grade 6 cell overlaps the current Grade 7 curriculum.
Two A proposals cover the North Atlantic Current and the Ural Mountains.
Ten C rows retain the original cards, including broader synthesis prompts,
the earlier claim that the descending plate melts, and the question that
conflates Schengen and European Union membership. The initial cell contains no
history transfers or retirements. The proposed neighbouring-grade match is
open for Thomas's decision before any history transfer.

The figures use the [credited Natural Earth data and ESA satellite image](../geographie-gymnasium-7/src/data/NOTICE.md).
The offline bundle loads both from the built HTML.
