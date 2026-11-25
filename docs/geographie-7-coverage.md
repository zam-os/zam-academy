# Geographie 7 Realschule: curriculum check and legacy cards

The [Grade 7 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geographie)
of the ISB applies to all Wahlpflichtfächergruppen. The live page was fetched
on 25 November 2026 with a browser User-Agent; its SHA-256 is recorded in the
[coverage matrix](../geographie-realschule-7/coverage.json). The matrix lists
the 28 compulsory competence statements verbatim with lessons, status and
evidence. `node scripts/check-curriculum.mjs <downloaded HTML>` extracts the
statements from the HTML and compares them with the
[pinned fixture](../geographie-realschule-7/tests/fixtures/curriculum-expectations.json)
and the matrix: 28 rows, 0 not found.

| Learning area | Approx. periods | Competences | Lessons | Labs |
| --- | ---: | ---: | ---: | ---: |
| 1 Planetarische Grundlagen im Zusammenhang mit Klima und Vegetation | 10 | 4 | 5 | 4 |
| 2 Afrika südlich der Sahara | 11 | 6 | 8 | 4 |
| 3 Nordafrika und westliches Asien | 11 | 6 | 6 | 4 |
| 4 Asiatisch-pazifische Inselwelt (ohne Japan) | 10 | 5 | 6 | 3 |
| 5 Japan und Australien im Vergleich | 10 | 5 | 5 | 2 |
| 6 Aktuelle geographische Fragestellung | 4 | 2 | 2 | 0 |

The optional learning area 7 (Bilingualer Sachfachunterricht) is listed
verbatim under `optional_curriculum` and not offered, as in Geographie 8.

Rows marked `supported` need work outside the app: drawing a Grundriss from an
aerial photo (3.2), researching current indicators of two real states (2.5),
engaging in a development project (2.6) and giving a presentation (6.1). The app
provides the method, a worked model and prompts. Model numbers (climate
stations, Föhn values, oasis balance, oil budget, island heights, density
model) are invented teaching values and labelled as such; no current statistics
are stated from memory. Learners research them with the linked official
sources.

The current event is the earthquake in the Banda Sea on 21 November 2026
([GFZ GEOFON](https://geofon.gfz.de/eqinfo/event.php?id=gfz2026wusf): Mw 6.8,
7.62° S, 127.39° E, depth 116 km). A
[news report](https://erdbebennews.de/2026/11/schweres-erdbeben-m6-8-erschuettert-osttimor-und-indonesien/)
gives about 143 km from another service; the media lesson uses exactly this
difference. When the event is no longer current, the lessons ask learners to
choose a new one with the same four steps.

## Neighbouring grades

Grade 6 taught Europe, weather elements and European climate charts; Grade 7
builds on them (Wiederholung aus Geo6: Wetterelemente, Klimadiagramme) and on
the Grade 5 Gradnetz. Grade 8 covers America, China and India, Russia and
global connections; Grade 9 covers Germany and global challenges. The
Geographie 7 Gymnasium package teaches Europe and is a different school type.

## Legacy cards

All source cells were read at zam-os/zam commit `4aeaa8e3455937f8a53cd57e686ff98d602a0561`.

- `de-by:realschule-7-geographie-europa-raum-wirtschaft` is named after Grade 7
  but teaches Europe, which the current curriculum places in Grade 6. Its eight
  items belong to the approved [Geographie 6 mapping](../geographie-realschule-6/replaces-de-by.json)
  and are not mapped again here.
- `de-by:realschule-8-geographie-tropen-regenwald-passat-wuesten` (legacy, four
  items on rainforest nutrients, Passatkreislauf and Wendekreiswüsten) and
  `de-by:realschule-9-geographie-klima-ressourcen` (ITC, rainforest,
  desertification) cover topics that the current LehrplanPLUS teaches in
  Grade 7. Their items already have rows in the
  [Geographie 8](../geographie-realschule-8/replaces-de-by.json) (all C,
  proposal-only) and [Geographie 9](../geographie-realschule-9/replaces-de-by.json)
  mappings. So that no card is mapped by two packages, this package maps none of
  them.
- `de-by:realschule-5-geographie-erde-gradnetz-orientierung` holds the axial
  tilt card; it belongs to the approved Geographie 5 mapping.

The [mapping](../geographie-realschule-7/replaces-de-by.json) is therefore
`proposal-only` with `approved: null` and no rows, and the cell declares neither
`replaces` nor `retired_items`. Open question for Thomas: should the Grade 8
legacy items on the Wendekreiswüsten (`01K4G8T0000000000000000J03`) and on
rainforest nutrients (`01K4G8T0000000000000000J01`) move from the Geographie 8
mapping to this package? Their nearest successors here are
`geo7rs-wuesten-erklaeren` and `geo7rs-regenwald-mischwald-check`; both would
still be C under the current rules (the old prompts state fixed percentages or
latitudes the new cards do not ask).
