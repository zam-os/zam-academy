# Geographie 7 Realschule

A German-language course for Bavarian Realschule Grade 7, one learning path for
all Wahlpflichtfächergruppen. The 32 lessons follow the six compulsory learning
areas of the [official LehrplanPLUS](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/geographie):
planetary foundations of climate and vegetation, sub-Saharan Africa, North
Africa and Western Asia, the Asian-Pacific islands, Japan and Australia, and a
current geographical event. The optional bilingual learning area 7 is
documented in the [coverage matrix](coverage.json) but not offered.

Learners read offline maps, climate charts after Walter and Lieth and drawn
models, and work in 17 labs: the lit Earth through the year, time zones, a
Föhn calculator, three climate stations to place, map layers of Africa, the
moving ITC, humid months and vegetation zones, shifting cultivation, map layers
of North Africa and Western Asia, a Medina plan, an oasis water balance, an
oil-state budget, map layers of the Asian islands, a tsunami warning time, a
flat island and rising sea level, maps of Japan and Australia, and population
density in a model country. Each lesson has a quick check on two levels, a
workshop, and a guided and a transfer writing task with a model answer for
self-assessment. All model numbers are invented teaching values and labelled as
such.

Run `npm ci` and `npm run dev` for a local server on port 5287.
`npm test` runs the course, lab, number and cell tests; `node scripts/check-curriculum.mjs`
checks the verbatim competences (pass the downloaded Fachlehrplan HTML to check
its hash and extraction too). Use `npm run package:zip` to build a standalone
archive with Windows, macOS and Linux launchers; it opens without a network
connection.

The [ZAM cell](cell.json) has 64 cards, two per lesson, each linking to its
lesson. The [legacy review](../docs/geographie-7-coverage.md) explains why the
[card mapping](replaces-de-by.json) proposes no history transfer. Map credits
are in [NOTICE.md](src/data/NOTICE.md). The package is version 0.0 and awaits
teacher review.

## For parents and teachers

The app keeps practice progress and free writing in the current browser
profile. It never sends, reads or rates the texts. Learners compare their own
work with examples. When a device account is shared, use “Lokalen Fortschritt
zurücksetzen” on the learning path at the end of the session to clear the
package's progress and writing.
