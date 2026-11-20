# Physik 7 Gymnasium: curriculum, scope and evidence

As of 20 November 2026. The package [`physik-gymnasium-7/`](../physik-gymnasium-7/) has 21 lessons in 3 stages, with 21 atoms and 63 cards in the cell `zam-academy:physik-gymnasium-7` (version `2026.11.1`).

## Official basis

The Bavarian Gymnasium has no separate subject Physik in Grade 7. Physics is taught as the **Schwerpunkt Physik of Natur und Technik**: Lernbereich 1 „Physik in Natur und Technik entdecken“, about 28 hours. Lernbereich 2 is the Schwerpunkt Informatik and is not part of this package. The Ausbildungsrichtungen start in Grade 8; there is one Fachlehrplan for everyone.

- **Source:** <https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym> (page title „LehrplanPLUS - Gymnasium - 7 - Natur und Technik (Gym) - Fachlehrpläne“). The address `…/gymnasium/7/physik` redirects to the start page.
- **Fetched:** 20 November 2026, directly (no archive), with a browser user agent.
- **SHA-256:** `cea4bb14c000123381f6343db4856e30e82f16a7a84b887a70dd8b04b189361e`, recorded as `curriculum_sha256` in [coverage.json](../physik-gymnasium-7/coverage.json); the page is stored byte for byte in `physik-gymnasium-7/tests/fixtures/curriculum.html`.

| Section | Hours | Competences | Contents | Lessons | Status |
| --- | ---: | ---: | ---: | ---: | --- |
| NT7 1.1 Ein erster Blick auf die physikalischen Spielregeln der Natur | 10 | 5 | 4 | 7 | 3 `implemented`, 2 `supported` |
| NT7 1.2 Optische Phänomene | 10 | 4 | 5 | 8 | 1 `implemented`, 3 `supported` |
| NT7 1.3 Elektrische Stromkreise | 8 | 5 | 6 | 6 | 3 `implemented`, 2 `supported` |

All 14 Kompetenzerwartungen and 15 contents are quoted verbatim in `coverage.json`. A script searched every row in the text of the fetched page (whitespace normalised): **14 rows, 0 not found; 15 contents, 0 not found.** The same check runs in `tests/curriculum.test.ts` against the stored snapshot, together with the SHA-256, the count per section and the mapping of every lesson.

## What the package provides and what stays in class

`supported` (7 rows) means: the package provides the subject knowledge, a model and practice in planning, evaluating and documenting; the activity itself happens in class.

- **1.1 Recording a model experiment:** the app practises separating observation, interpretation and hypothesis; the experiment and the drawing on paper are made in class.
- **1.1 Planning and carrying out a density measurement, tables on the internet:** displacement method, reading accuracy and density range in the model; measuring and research in class.
- **1.2 Exploring colours and shadows experimentally, own photos:** models and documentation hints; experiment and photos in class.
- **1.2 Explaining seeing and shadows with self-made sketches:** explanations, models and tasks in the app; the sketches are drawn on paper in class (review of #169).
- **1.2 Summaries of factual texts with careful drawings:** text work and written summaries in the app; the drawings are made on paper in class (review of #169).
- **1.3 Experiments on the magnetic effect, structured report:** model and report structure; experiment in class.
- **1.3 Developing a circuit with software and building it:** AND, OR and two-way circuit in the model with a switch table; circuit software and building in class.

The experiment notebook has one slot for each of the six Schülerexperimente named in the plan.

## Subject decisions

**Neighbouring grades.** Checked: NT5 Gymnasium (Schwerpunkt Naturwissenschaftliches Arbeiten) and Ph8 Gymnasium, both fetched on 20 November 2026. Named as revision: splitting of light and density as a property of substances from NT5, conductors and insulators from primary school (the plan cross-references HSU 3/4). Left out because they belong to Ph8: current, voltage, resistance, technical current direction, short circuit, law of reflection, refraction, lenses, forces and weight.

**Calculations only for density.** The plan asks for calculations of density and mass only. The shadow model shows sizes as values, without calculation tasks and without the intercept theorem (Mathematik 9).

**Reading accuracy.** The lesson and the model assume that the water stands exactly on a mark before the body goes in, so only the second reading is uncertain (±½ division). The lesson says so and adds that two free readings add their uncertainties (review of #169).

**Continuous lamp.** Two small lamps can leave a lit gap between two half shadows. A continuous lamp cannot: the object always hides its middle part from the centre of the screen. The model shades every point of the screen by the hidden share of the lamp (16 cm lamp, object 50 cm away: centre 75 % shaded) (review of #169).

**Electron direction.** In every circuit drawing the electrons leave the minus pole and reach the plus pole; in the OR circuit only closed branches carry them. The lesson on current no longer says the electrons return „through the battery“; how charge moves inside the battery is left for later grades (review of #169).

**Numbers.** Densities after the table in OpenStax College Physics 2e, section 11.2 (rounded: aluminium and granite 2.7, iron 7.8, brass 8.4, copper 8.8, silver 10.5, lead 11.3, gold 19.3 g/cm³); titanium 4.5 and CFK 1.5 g/cm³ after the Wikipedia articles. Recognition distances in the dark after ADAC (dark clothing about 25 m, reflectors up to 140 m, stopping distance from 50 km/h about 28 m) and the City of Zurich (light clothing about 40 m). Laser advice after the Bundesamt für Strahlenschutz. Sun elevation at noon in Munich: 90° − 48.1° ± 23.4°, i.e. about 65° and 18°. Model values (strength of magnets, paper clips and nails held, electrons transferred) are marked as such in the app; the eclipse thresholds are schematic.

**Magnetising.** The lesson states that the end where each stroke finishes becomes the pole unlike the stroking pole; the drawing shows a stroking south pole and the north pole forming on the right.

**Binding in ZAM.** Like `biologie-gymnasium-6` and `informatik-gymnasium-6`, the atoms bind to `subject: "nt_gym"`, `grade: 7`, `topic_code` `lb1.1`, `lb1.2`, `lb1.3`, without a track. `exam_relevant` is `false`, because Grade 7 is not covered by a final examination.

## Sources

Every link in `src/curriculum/sources.ts` was opened with `curl` on 20 November 2026 and its page title read (Wikipedia, Klexikon, OpenStax, ADAC, City of Zurich, Bundesamt für Strahlenschutz). Pages that returned 404 (Klexikon „Schatten“, „Dichte“, „Finsternis“, an older ADAC address) are not linked. LEIFIphysik is not linked.

## Legacy cards

Compared: the two `de-by` cells „Physik 7 Gymnasium“ in zam-os/zam (commit `bae34e7dfe7d01838e448a65f15871c3549ae3fc`) with 8 cards, stored byte for byte in `physik-gymnasium-7/tests/fixtures/` with their SHA-256 in [replaces-de-by.json](../physik-gymnasium-7/replaces-de-by.json):

- `de-by:gymnasium-7-physik-mechanik-kraefte-masse-dichte-druck` (`01K4P7M0000000000000000J01` to `J04`): force and newton, Hooke's law, mass and weight, density and pressure.
- `de-by:gymnasium-7-physik-optik-lichtbrechung-totalreflexion-linsen` (`01K4P7X0000000000000000J01` to `J04`): refraction, total internal reflection, converging lenses.

Both follow the curriculum of the eight-year Gymnasium. In LehrplanPLUS, forces and optics with refraction belong to Ph8. Only density is in NT7, and in the old card `J04` it is one part of a multi-part synthesis with weight and pressure; taking over a part would spread one learning history over several cards.

| Category | Count | Proposal |
| --- | ---: | --- |
| A | 0 | – |
| B | 0 | – |
| C | 8 | keep-active: the cards stay in reviews |

The file has `"status": "proposal-only"` and `"approved": null`; the cell declares neither `replaces` nor `retired_items`, so publication needs no approval.

**Neighbouring cells.** Also checked: `de-by:gymnasium-8-physik-mechanik-energie-arbeit-leistung-maschinen` and `de-by:gymnasium-9-physik-elektrizitaetslehre-schaltungen-energie-leistung`. None of their cards asks NT7 knowledge (Ohm's law, Kirchhoff, energy, levers); they are not part of this mapping. Open question for Thomas: should the Ph8 topics of the old Grade 7 cells (forces, refraction) later be mapped by a Physik 8 Gymnasium package instead of staying active here?
