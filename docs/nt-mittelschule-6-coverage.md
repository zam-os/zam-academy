# Natur und Technik 6 Mittelschule: curriculum and evidence

## Scope decision

Thomas selected “Expand the package to cover all of Natur und Technik 6” in
the Codex chat on 2026-11-14 after the reviews of PR #140. The previously
local-only Chemistry draft is therefore renamed `nt-mittelschule-6` and
expanded to all learning areas. Its canonical subject is `nt`, matching the
Academy combined-subject model. The later instruction “Und das Paket soll veröffentlich werden - nicht
local-only.” in the Codex chat on 2026-11-15 authorizes publication. The
package therefore ships as a public preview with teacher review and videos
still open. Neither instruction approves review-history transfer.

The current [official NT6 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/6/nt)
was read in full, including its content lists. The saved full HTML was
downloaded with a browser User-Agent on 2026-11-14; the live page was also
read during expansion. Its real title and SHA-256 are checked, not inferred
from an HTTP success. NT6 uses a shared page; separate R/M tracks start in
Grade 7. No hours are stated in the saved sections, so none are invented.

| Section | Official expectations | Lessons | App boundary |
| --- | ---: | ---: | --- |
| LB 1 | 9 | 2 | Investigation planning, observation/inference, diagrams, safety, sources and model limits; practical execution/group work remain in class |
| 2.1 | 7 | 11 | Water properties, states, anomaly, molecule notation, electrolysis/gas identification and hydropower; actual investigations and gas tests remain supervised |
| 2.2 | 5 | 5 | Simplified identification, ecological indicators, cells/microscopy, fish, aquatic food webs and intervention assessment; real fieldwork and microscopy remain in class |
| 2.3 | 4 | 4 | Forest substance cycle, photosynthesis word equation, decomposition, soil functions and protection; actual organism identification remains in class |
| LB 3 | 4 | 5 | Puberty/hygiene, organs, fertilisation/implantation, prenatal development/birth and condom/pill comparison |
| 4.1 | 2 | 2 | Force effects, units and bounded spring model; actual force measurements remain in class |
| 4.2 | 4 | 4 | Work, one/two-sided levers, ramp/rollers, Goldene Regel and body-protecting tool decisions; real lever measurements and tool handling remain in class |
| 4.3 | 5 | 5 | Speed/path/time, units, graphs, approximate stopping distance, inertia and traffic judgment; the actual inertia experiment remains supervised |

`coverage.json` contains all 40 expectations verbatim, with 26 implemented
and 14 supported. Every lesson maps to a row; there are no excluded or
optional lessons. Official codes are `lb1`–`lb4` with their single official
titles. Academy stages distinguish 2.1/2.2/2.3 and 4.1/4.2/4.3. Visual stage
numbers are separate from official Lernbereich numbers.

## Neighbouring grades and correctness boundaries

Full NT5 and both NT7 R/M snapshots, titles and SHA-256 values are retained.
The Grade 7 track-less URL returned the home page and was discarded; the
recorded URLs use `regelklasse` and `mittlere-reife-klasse` explicitly.

The package builds on NT5 body/senses, organism comparisons, heat, mixtures,
states and separation. Original repetition labels remain visible. NT7 air
composition, extended atom models and other later-grade detail are not
imported into NT6. There are no electron shells, ionic bonding, molar
stoichiometry or balanced photosynthesis formula beyond the required word
equation. Mechanics follows the NT6 allowance for simple mathematical
relationships; speed/path/time and unit conversion are explicit curriculum
requirements.

Numerical models state their assumptions. The spring has its own fixed
scale; the lever ignores its own weight and friction and uses perpendicular
forces; the ramp comparison is ideal. Stopping-distance school formulas are
labelled approximate, never a real safety guarantee. Inertia models have no
injury or crash-force predictions. Labelled diagrams distinguish water
vapour from droplets, gas volume from mass, gill uptake from electrolysis,
food arrows from motion, and graph axes from road shape.

## Health content

The five health lessons use neutral anatomical and process schematics.
They distinguish gametes from organs, fertilisation from implantation,
prenatal supply from breathing after birth, and contraception from infection
protection. Development is individual; no lesson requests private body or
sexual-experience data. Every written prompt is general or fictional.

The condom/pill explanation states different mechanisms and protection
limits without a guarantee or personal dosing/treatment instruction. The
factual authoring check used the public BIÖG resources
[Loveline contraception](https://www.loveline.de/themen/verhuetung/),
[fertilisation](https://www.familienplanung.de/service/lexikon/befruchtung/)
and [early prenatal development](https://www.familienplanung.de/schwangerschaft/schwangerschaftswochen/1-bis-4-schwangerschaftswoche/).
These are authoring references; the learner UI's source link remains the
verified official curriculum. Teacher review remains open.

## Follow-up review corrections

The follow-up addresses the remaining model-task, distractor and anatomy
findings from [PR #140](https://github.com/zam-os/zam-academy/pull/140#issuecomment-6885399377).
All 37 model types now include a direct model task. Twenty-five formerly
choice-only types add label placement, food-arrow construction, stage/soil
ordering, prediction-before-observation comparisons, habitat editing, molecule
assembly and pointer/keyboard marker positioning. Empty or wrong
constructions fail; checking, clearing, correcting and changing a prediction
are covered by independent subject witnesses and browser interaction checks.
The remaining interpretation questions keep plausible alternative explanations.

Thirty-six fast-check alternatives and 24 lesson quick checks now target
subject misconceptions rather than unrelated words or impossible organs.
The habitat transfer card asks about renaturalising a straightened stream;
the hydropower card retains the distinct energy/intervention tradeoff. The
forest web has a soft prerequisite on the earlier aquatic web. The lever
lesson defines each arm from the pivot to the point of force application
under the stated perpendicular-force assumption.

The original male diagram is replaced by an original, labelled front-view
schematic. The scrotum contains two testes below the penis root; bladder,
prostate, ducts and urethra have separate labels and leaders. Position and
sizes are explicitly simplified. The authoring reference is
[BIÖG: Male reproductive organs](https://www.familienplanung.de/kinderwunsch/fruchtbarkeit-geschlechtsorgane/maennliche-geschlechtsorgane/).
The fish now includes paired fins and a gill cover, with its tail label
pointing to the fin. Stopping-distance labels follow the actual centres of
the reaction and braking bars.

## Identity and existing histories

The cell is now `zam-academy:nt-mittelschule-6`, its namespace
`zam-academy-nt-mittelschule-6`, its domains `nt/nt6/...`, and its app base
`/nt-mittelschule-6/`. All original 17 lesson ids, 17 atom ULIDs and 51 item
ULIDs/slugs remain unchanged. Twenty-one new lessons add 21 generated atom
ULIDs and 63 generated item ULIDs. `tests/fixtures/public-contract.json`
pins the resulting 38 atoms and 114 items; every source link cites the
corresponding renamed app lesson. Cards live only in `cell.json`.

New localStorage keys are `nt_ms6_academy_progress_v1` and `nt_ms6_theme`.
The old local Chemistry draft is copied if its key is accessible and the
new progress key is absent, using unchanged lesson ids and the existing validator. An
existing new key takes precedence; reset writes an empty new state and does
not revive the old one. The old value is retained. This concerns local app
drafts and confirmations, not FSRS review-history transfer.

At inspected ZAM commit `2057e1c35a5e768eb0c59cb74c3700c0101f67a2`,
`bundled-cells.ts` and the curriculum fixtures contained no `de-by`
Mittelschule cells. Related Realschule and Gymnasium cells stay active at
their own school types; no successor mapping is asserted. The empty
`replaces-de-by.json` remains proposal-only with `approved: null`, no
`replaces` and no `retired_items`.

NT5 is documented prior knowledge instead of an external prerequisite edge.
A disposable-library check with pinned `zam-core@0.54.0` confirmed that an
atom prerequisite outside the current tile is rejected, including a soft
edge to an already installed NT5 atom. Adding one would prevent installation.
Internal prerequisites name the knowledge actually used, with specific
rationales. Grade 6 bindings use `exam_relevant: false`.

## Verification

Commands run inside `nt-mittelschule-6/`, except those marked root:

| Check | Command and evidence |
| --- | --- |
| TypeScript including tests | `npm run typecheck` |
| Content, identity, independent model calculations, local-draft copying and cross-tab state | `npm test`: 266 tests in six files |
| All 40 verbatim rows, four official titles and snapshot hashes | `npm run check:curriculum`: zero missing rows |
| Self-contained HTML, identical ZIP bytes and three platform launchers | `npm run package:zip` |
| Views, model goals, contrast and layout | `npm run check:browser`: 152 lesson/level/theme states, 342 model views, 114 solved goals (41 direct model goals, including 25 new constructions), 465 contrast checks and 38 solved workshops; no runtime errors or external requests |
| Root catalog, registry and package selection | `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs scripts/changed-apps.test.mjs`: 57 passed |
| All cells with pinned published kernel (root) | `ZAM_CORE=<scratch zam-core@0.54.0 dist URL> node scripts/validate-cells.mjs`: 72 cells and distractor checks passed |
| Exact lesson links and idempotent reinstall | `ZAM_CORE=<same URL> node scripts/validate-cell.mjs`: 38 atoms and 114 cards |

The browser check opens the actual built HTML in native Chrome using a
disposable profile. The follow-up run sets
`BROWSER_QA_DIR=/private/tmp/zam-nt6-followup-browser` for its report and
screenshots (the script defaults to `/private/tmp/zam-nt6-browser`). It checks light, explicit dark and system dark
model controls, and mobile widths of 320, 390 and 720 pixels against the
requested width, alongside desktop rendering. Every new model view checks
diagram-label bounds. Deliberately reintroduced overflow and low contrast
must be rejected.

## Publication and review

`publication.json` is `preview`; `academy.json`, the catalog and the Pages
build register the package for public release. A visible preview notice and
the ZAM dialog name the pending teacher review and videos. Version
`2026.11.2` keeps every published identifier. CI checks its curriculum, ZIP
and cell. No new dependency, video, remote image, account or automatic
network request is introduced.
The source label, theme key, package metadata, ZIP names, documentation and
CI selector all use the new identity. Port 5250 follows the merged German
package on port 5249; the previously checked sibling ports are also avoided.

The initial reviews' UI, geometry, duplicate-card and metadata fixes remain.
The expansion resolves their package-scope objection according to Thomas's
decision. The expanded material needs review on its own merits; teacher
review and the separate verified-video step remain open. Thomas's explicit
publication instruction is recorded above. The separate review-history
mapping remains unapproved.
