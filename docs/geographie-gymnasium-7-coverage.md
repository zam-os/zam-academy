# Grade 7 Gymnasium geography curriculum and legacy review

The source is the [Bavarian Grade 7 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geographie),
which applies across Gymnasium tracks. The page was fetched on 2026-11-21.
It assigns no separate hour totals to these six learning areas and treats area 1
as work across the school year. The [coverage matrix](../geographie-gymnasium-7/coverage.json)
lists the 29 official competence statements verbatim with the relevant
lessons and evidence. Its source byte hash identifies the checked HTML.
`node scripts/check-curriculum.mjs` checks each statement against the
[extracted curriculum fixture](../geographie-gymnasium-7/tests/fixtures/curriculum-expectations.json)
in CI. Pass the downloaded official HTML as an argument to verify the
extraction and hash. The [ISB terms](https://www.lehrplanplus.bayern.de/seite/nutzungsbedingungen)
identify the official curriculum text as outside copyright protection.

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
[subject profile](https://www.lehrplanplus.bayern.de/fachprofil/gymnasium/geographie)
places the next geography course after Grade 7 in Grade 10. The
[Grade 10 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/10/geographie)
includes the tropics and arid subtropics. The corresponding old Grade 8
cell is outside this package.

## Legacy cards

The [approved mapping](../geographie-gymnasium-7/replaces-de-by.json)
inventories four Grade 7 items on Europe and eight items from the legacy
Grade 6 Europe cell. The latter overlaps the current Grade 7 curriculum.
Thomas approved both A transfers on 2026-11-22 in the Codex chat for
Academy PR #183: “Freigabe für Kartenübernahmen erteilt”. The source Grade 7
North Atlantic Current card and the source Grade 6 Ural Mountains card have
one successor each in cell version 2026.11.2. Ten C cards stay active.
No retirements are part of the approval.

`scripts/validate-migration.mjs` exercises both transfers against the published
zam-core version pinned in CI. It compares entire card and review rows before
and after the migration, checks the ten active legacy cards in the review queue,
and checks that repeated installs and rejected collisions leave the library
consistent.

## Sources shown to learners

- [LehrplanPLUS – Gymnasium – 7 – Geographie – Fachlehrpläne](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/geographie)
- [Binnenmarkt und Kapitalmarktunion | Europäische Union](https://european-union.europa.eu/priorities-and-actions/actions-topic/single-market_de)
- [Natural Earth – Terms of Use](https://www.naturalearthdata.com/about/terms-of-use/)
- [Oceanic processes – Met Office](https://weather.metoffice.gov.uk/learn-about/weather/oceans)
- [Earth from Space: Southwest Netherlands – ESA](https://www.esa.int/media/earth-from-space-southwest-netherlands-en-377990)
- [Welcome to the Wadden Sea World Heritage | Wadden Sea](https://www.waddensea-worldheritage.org/)

The [map and image credits](../geographie-gymnasium-7/src/data/NOTICE.md)
record the Natural Earth data and ESA satellite image. The built HTML
contains both for offline use.
