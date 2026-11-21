# Natur und Technik 7 Gymnasium: curriculum and existing cards

The [Bavarian LehrplanPLUS Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym) applies to the whole grade and gives approximately 28 teaching hours to each focus. The curriculum snapshot was fetched directly on 20 November 2026. The existing Physics package holds the shared snapshot. Running `node nt-gymnasium-7/scripts/check-curriculum.mjs` checks its SHA-256 and verifies all 24 competency statements and 27 content statements for both focuses against the saved original.

| Section | Hours | Lessons | Main practice |
| --- | ---: | ---: | --- |
| NT7 1.1 | 10 | 7 | Observation and modelling, magnetism, compass, density |
| NT7 1.2 | 10 | 8 | Seeing, colours, shadows, Moon phases and eclipses |
| NT7 1.3 | 8 | 6 | Charge, current and effects, electrical circuits |
| NT7 2.1 | 8 | 4 | Directed wiki graph, visual editor, searching and evaluating sources, Internet |
| NT7 2.2 | 5 | 2 | Choosing a channel, communication risks, data and device protection |
| NT7 2.3 | 11 | 4 | Sequences, one- and two-sided conditions, fixed-count and conditional loops |
| NT7 2.4 | 4 | 2 | Planning and testing a shadow wiki, saving and comparing checkpoints |

See the [Physics matrix](../physik-gymnasium-7/coverage.json) and the [Informatics matrix](../nt-gymnasium-7/coverage.json) for evidence by competency. The offline exercises prepare learners for live source research and collaboration in a timed classroom project. Physics retains its lab notebook for the six real student experiments and records which other classroom activities it supports.

Grade 6 teaches object modelling and the hierarchical organisation of documents and files. Grade 7 applies that knowledge to linked documents and compares the directed web graph with a hierarchy. The [Grade 9 NTG curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/informatik) later adds implementation with classes and methods, database modelling and spreadsheets. The neighbouring ZAM cells on Grade 6 document objects, Grade 8 relational databases and Grade 9 object-oriented programming therefore stay with their respective collections. The Grade 6 class concept provides a bridge into the Grade 7 lesson; its existing card is already part of the Grade 6 mapping.

## Card history and discoverability

Physics keeps its existing app, cell and identifiers. The combined course compiles the Physics source for local and offline use and opens the canonical Physics app when served by the Academy. The existing Physics listing is already searchable in the Academy atlas via “Natur und Technik 7”. The combined overview remains local until publication is authorised. Wiki checkpoints are downloaded and reopened as files on the learner’s device.

The [Informatics mapping proposal](../nt-gymnasium-7/replaces-de-by.json) traces all four old Grade 7 Informatics cards to their source commit. It proposes one A match for the class concept and keeps three C cards active. The three combine several prompts or ask for DOM nesting inside a single document, whereas the current curriculum models links between documents. The proposal is unapproved; the new cell declares neither replacements nor retirements.
