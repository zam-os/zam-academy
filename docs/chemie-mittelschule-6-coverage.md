# Chemistry 6 Mittelschule: scope, curriculum and evidence

## Scope and curriculum decision

The requested Chemistry package follows the chemical perspective of Bavarian
Natur und Technik 6. The live official Fachlehrplan was downloaded on
2026-11-14 using `curl -fLsS --compressed -A 'Mozilla/5.0'`. Its actual page
title was read; HTTP success alone was not treated as evidence. The source is
[the official NT6 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/nt).

The 17 lessons map to all 20 expectations in the selected sections: the nine
cross-cutting expectations in LB 1, seven in 2.1 and four in 2.3. Of those,
12 are implemented as model interpretation, explanation and reasoned tasks;
eight are supported, with actual investigations, equipment use, group work,
source selection practice and field identification explicitly left in class.
This does not claim completion of those practical expectations.

| Section | Lessons | Coverage boundary |
| --- | ---: | --- |
| NT6 LB 1 | 2 | Fair comparisons, observations/inferences, protocols, source guidance, hazard labels, model limits; physical execution remains in class |
| NT6 2.1 | 11 | All seven expectations, including hydropower as the required cross-disciplinary context; actual water measurements, electrolysis and gas tests remain supervised classroom work |
| NT6 2.3 | 4 | Forest network and substance cycle, simplified photosynthesis word equation, decomposition, soil functions/protection; real organism collection and identification remain in class |

The scope is visible in the app and `coverage.json`. NT6 2.2 aquatic biology,
LB 3 puberty/development and LB 4 mechanics are outside this Chemistry
package. The package is neither a complete NT6 course nor a complete LB 2
biology offer. For future ZAM integration, the available official provider
binding is the parent `lb2`; its `topic_title` preserves 2.1 or 2.3. Curators
must retain this partial-scope distinction rather than infer full LB 2
coverage from a binding.

The official page does not state hours for the selected sections; no hour
allocation was invented. NT6 has one shared subject page. Both Grade 7 tracks
were fetched using their explicit `regelklasse` and
`mittlere-reife-klasse` paths; the track-less Grade 7 path returned the home
page and was discarded rather than used as curriculum evidence.

## Neighbouring grades and existing packages

The saved NT5 page identifies prior states, pure substances, mixtures and
separation in 4.1/4.2. The lessons explicitly mark that repetition and then
build water-specific explanations, molecules and reactions on it. Existing
`nt-mittelschule-5` remains a separate package with separate storage and cards.
The saved NT7 R and M pages place air composition and extended atom models in
2.1/2.2. This package does not introduce electron shells, ionic bonding,
stoichiometric molar calculations or an advanced balanced photosynthesis
reaction.

## Content and interaction

Every lesson includes three explanation paragraphs, an explicit worked
example, a key rule, a three-option quick check, four classification cases,
and two different written tasks with two hints and three criteria each.
There are 16 interactive model types used across the 17 lessons, with three
comparison choices per lesson and an additional temperature slider for the
two particle lessons. All exploration goals start unselected and can be
reached. They last for the session and are not retained as mastery evidence.

Scientific distinctions checked in content and models include:

- A physical phase change preserves water molecules; electrolysis produces
  hydrogen and oxygen with electrical energy input.
- The particle pictures preserve two H atoms per O atom; the reaction model
  preserves four H and two O atoms on each side. The 2 : 1 result describes
  gas volume under equal conditions, not mass.
- Water has its density maximum near 4 °C; the equal-mass volume drawing is
  intentionally exaggerated, and a deep-lake example does not imply safe ice.
- Very pure water and pure sugar solution conduct poorly compared with
  salt solution; clarity, solubility and conductivity are separate properties.
- Gas-phase water is invisible; the visible white cloud consists of liquid
  droplets. Evaporation does not require boiling.
- Hydrogen is combustible; oxygen supports combustion and is not itself
  combustible. The package interprets test observations without providing a
  home experiment recipe.
- Food arrows point from food to consumer. Matter cycles through decomposers;
  light supplies energy and heat leaves the system.
- Photosynthesis uses the simplified word equation with light as energy input.
  Soil filtering is limited and never certifies drinking water.

Teal, blue and green station accents work in light, explicit dark and system
dark themes. Diagrams use labels in addition to colour, adjacent explanatory
text and explicit model limits. On narrow screens they scroll within a
keyboard-focusable region to keep labels readable. Local storage keys are
unique, both writing levels count separately, and edited drafts invalidate
only their own confirmation. No automatic grading or FSRS rating occurs.

## Existing-card decision

`replaces-de-by.json` records the inspected `zam-os/zam` commit
`2057e1c35a5e768eb0c59cb74c3700c0101f67a2`. Its `bundled-cells.ts` and
curriculum fixtures contain no `de-by` Mittelschule cell. Related chemistry
and biology cells at other school types remain with their existing packages;
this package claims no history. The mapping is empty and proposal-only,
`approved` is null, and the cell has neither `replaces` nor `retired_items`.
The cell's 17 atoms and 51 items use real generated ULIDs pinned in the
contract fixture. Cards cite the corresponding lesson anchors. Card text
lives only in `cell.json`.

## Reproducible verification

Run from `chemie-mittelschule-6/` unless noted:

| Check | Command | Evidence |
| --- | --- | --- |
| Type checking | `npm run typecheck` | Source and tests pass TypeScript |
| Package suite | `npm test` | Content/identity checks, model actions and conservation, feedback, independent levels and cross-tab storage |
| Verbatim expectations and source integrity | `npm run check:curriculum` | 20 rows, zero missing after whitespace normalization; all four page titles and source SHA-256 values match |
| Single-file build | `npm run build` | Self-contained `dist/index.html` |
| Browser | `npm run check:browser` | 68 lesson/level/theme views, 51 model actions, 17 solved workshops; 320/390/720/1280 layouts, both levels, reload, draft invalidation, ZAM draft dialog and reset; no runtime errors or external requests |
| Offline ZIP | `npm run package:zip` | Archived HTML matches the build byte for byte; Windows/macOS/Linux launchers and instructions exist; shell syntax passes |
| Catalog and registry (repo root) | `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` | Local drafts remain outside publication; public registry remains consistent |
| Published kernel (repo root) | `ZAM_CORE=<scratch zam-core@0.54.0 dist URL> node scripts/validate-cells.mjs` | All cells, including the local draft, are installed in temporary databases; text/distractor validation runs |
| Local cell | `ZAM_CORE=<same URL> node scripts/validate-cell.mjs` | 17 atoms/51 cards, exact source links and unchanged card states after repeat installation |

The browser script saves a JSON report and screenshots in
`/private/tmp/zam-chemie6-browser` (configurable via `BROWSER_QA_DIR`). Visual
inspection accompanies the DOM assertions; tests alone are not a render check.
CI runs the package tests/build, source integrity check, offline check and
cell installation. No dependencies were added to the reference package's
approved dependency set.

## Publication status and remaining human work

The marker is `local-only`. The package is excluded from `academy.json`, the
public atlas, catalog and Pages list, and no ZAM fixture is hand-edited.
Teacher review and the separate reviewed video step remain open. Public
release and any later history transfer require their normal explicit
instructions; this local build does not assume either.
