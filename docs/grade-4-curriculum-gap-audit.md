# Grade 4 mathematics: curriculum gap audit

Checked on 2026-11-04 against the [current official shared Grades 3/4 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik). The 54 existing competence positions and their text remain in `coverage.json`. No fixed hours are specified. This is a public preview; primary-school teacher review remains pending.

## Digital decisions

Four new lessons isolate distinct learning goals: estimating quantities/Fermi reasoning, choosing a calculation method, varying a story and obtaining information, and ordering quantities in four domains. Adding these to comparison-only or conversion-only lessons would obscure their separate goals. Each has a worked example, key rule, three-choice check, three tested lab witnesses and two practice levels with three required successes each.

Extensions reuse the existing activity where the operation stays the same: the addition board accepts three/four summands and carries up to 3; decomposition links number words, stage notation and digits; data collection gains a five-category table/chart. Existing lesson/item ids and slugs remain unchanged. Four new atoms and thirteen new lasting-knowledge items use once-generated cryptographic ULIDs. Cell version: `2026.11.14`; inventory: 40 lessons, 43 atoms, 159 items.

The earlier generic geometry remainder conflated optional breadth and physical practice with missing implementation. The existing square-tiling, repeating/self-created-unit, mirror, cube-view and net models already provide digital preparation. Real alternative tiles, symmetric ornament design, physical tipping and tool construction remain explicit outside activities; no digital model is claimed to assess them. Likewise open invention, original questions and a calculation conference require human review, not a preset-answer substitute.

## Every coverage row

`A` means a digital addition in this change; `Existing` means the mapped digital activity already exists. B remains outside the app. C is pending primary-school teacher review for every row; the reviewer stays null.

| Row | Digital decision / evidence | B: remaining outside practice | C |
| --- | --- | --- | --- |
| m34-1.1-01 | Existing: zahlen-vergleichen-ordnen, zahlenstrahl-zahlenspruenge, teiler-vielfache | Explain flexible forward/backward counting and divisor relationships aloud using your own examples. | Pending |
| m34-1.1-02 | A: Number-word/stage/digit transfer now complements the existing exchange board; representations.ts, coverage-gaps.test.ts. | Explain a value-preserving exchange with real objects or a drawing. | Pending |
| m34-1.1-03 | A: Number-word/stage/digit transfer with zero positions in both levels; representations.ts, coverage-gaps.test.ts. | Relate number words, stage notation and digits to real cubes, rods and plates; explain your own representation. | Pending |
| m34-1.1-04 | A: New estimation lesson: typical samples, evaluation of strategies and two explicit Fermi assumptions; reasoning.ts, coverage-gaps.test.ts. | Select and count real representative samples, compare your own Fermi assumptions and check the estimate by counting. | Pending |
| m34-1.1-05 | Existing: zahlen-zerlegen-ergaenzen | Build and explain alternative decompositions with objects or drawings. | Pending |
| m34-1.2-01 | Existing: malnehmen-teilen | Practise varied multiplication facts and inverses over time; a short app session does not establish automatic retrieval. | Pending |
| m34-1.2-02 | Existing: geschickt-addieren, geschickt-subtrahieren, malnehmen-teilen | Explain further fact families and transfer them to your own examples with a partner. | Pending |
| m34-1.2-03 | Existing: geschickt-addieren, geschickt-subtrahieren, malnehmen-teilen, schriftlich-addieren, schriftlich-subtrahieren, schriftlich-multiplizieren, schriftlich-dividieren; stale algorithms/remainder gap removed after code/test inspection | Solve and explain your own mixed arithmetic examples on paper. | Pending |
| m34-1.2-04 | A: New method lesson compares efficiency for explicit numerical structures and objectives; reasoning.ts, coverage-gaps.test.ts. | Invent, compare and discuss your own strategies and their efficiency in a calculation conference. | Pending |
| m34-1.2-05 | A: Explicit mental/half-written/written selection, reason and intermediate-result notes on both levels; reasoning.ts, coverage-gaps.test.ts. | Choose and explain your own method without a prescribed objective; make your own number-line or intermediate-result notes on paper. | Pending |
| m34-1.2-06 | A: Existing addition lesson now has a three-summand lab and three/four-summand practice and exit, with carries 2/3; written-addition.ts, written-addition.test.ts, coverage-gaps.test.ts. | Practise the written procedures on paper over time; fluency is assessed by a teacher, not inferred from mission completion. | Pending |
| m34-1.2-07 | A: Purpose-based exact/estimate decisions added; existing correction boards, arithmetic and measurement tasks already check errors and plausibility. | Explain and correct a partner's original error and discuss the plausibility of the contextual result. | Pending |
| m34-1.2-08 | Existing: muster-zahlbeziehungen | Explain your own arithmetic patterns to others, beyond the model justifications. | Pending |
| m34-1.2-09 | Existing: muster-zahlbeziehungen | Invent original arithmetic rules and compare continuations on paper with others. | Pending |
| m34-1.3-01 | Existing: sachaufgaben-mehrschrittig, expedition-werkstatt, expedition-reise, expedition-inselfest | Collect authentic local sources and formulate your own mathematical questions for discussion. | Pending |
| m34-1.3-02 | Existing: sachaufgaben-mehrschrittig, expedition-werkstatt, expedition-reise, expedition-inselfest | Explain the connections between your own solution steps and the situation to a partner. | Pending |
| m34-1.3-03 | Existing: sachaufgaben-mehrschrittig, expedition-werkstatt, expedition-reise, expedition-inselfest | Construct and evaluate your own sketch, table or other representation on paper. | Pending |
| m34-1.3-04 | A: New variation lesson: shorten without losing needed facts, extend with delivery/consumption and retrieve the missing count from a labelled local source; explicit Fermi assumptions in the estimation lesson. | Invent and discuss your own expanded/shortened situation; obtain authentic missing information by measurement or asking someone. | Pending |
| m34-1.3-05 | Existing: sachaufgaben-mehrschrittig, expedition-werkstatt, expedition-reise, expedition-inselfest | Choose and explain original forward/backward strategies in discussion. | Pending |
| m34-1.3-06 | A: Explicit choice of exact versus approximate calculation for a stated purpose, supplementing existing budgets and estimates. | Compare and value classmates' own solutions and justify the required precision in a calculation conference. | Pending |
| m34-1.3-07 | Existing: systematisch-kombinieren | Draw and compare your own tree, table or sketches with classmates. | Pending |
| m34-2.1-01 | Existing: wege-lageplaene | Draw your own paper plan and physically follow it in a real room. | Pending |
| m34-2.1-02 | Existing: wege-lageplaene | Measure real distances, draw a paper plan and describe how the plan relates to the room. | Pending |
| m34-2.1-03 | Existing: wuerfelgebaeude-ansichten | Build physical cube structures from plans and draw plans from real structures, including other viewing positions. | Pending |
| m34-2.1-04 | Existing: koerper-netze | Tip real bodies, follow edges on a physical model and fold nets; explain the movements. Digital view/rotation/net tasks already provide mental-operation practice. | Pending |
| m34-2.2-01 | Existing: figuren-zeichnen, koerper-netze | Identify and check right angles on real surfaces and bodies with a set square. | Pending |
| m34-2.2-02 | Existing: koerper-netze | Build and compare real edge and surface models of cubes and other cuboids. | Pending |
| m34-2.2-03 | Existing: koerper-netze | Cut out, fold and classify paper cube/cuboid nets and compare congruent nets. | Pending |
| m34-2.2-04 | Existing: koerper-netze | Fold physical nets and explain why they close or overlap. | Pending |
| m34-2.2-05 | Existing: figuren-zeichnen | Draw freely and construct on paper with ruler, set square and compass; a screen cannot assess tool handling. | Pending |
| m34-2.3-01 | Existing: vergroessern-verkleinern | Construct enlarged/reduced figures on paper or a physical geoboard and check the lengths. | Pending |
| m34-2.3-02 | Existing: spiegeln-symmetrie | Draw and check symmetry axes on paper and with a real mirror; explain congruence. | Pending |
| m34-2.3-03 | Existing: spiegeln-symmetrie | Create your own reflected figures on paper or with a real mirror and describe the procedure. | Pending |
| m34-2.4-01 | Existing: parkette-ornamente | Lay and explain physical tilings, including other tile shapes. Digital square tiling already practices gap-free repetition; the curriculum does not mandate every tile shape. | Pending |
| m34-2.4-02 | Existing: parkette-ornamente | Design your own paper ornaments, including symmetric elements, and explain their rule. Digital repeating and self-created units and the mirror workshop provide preparation. | Pending |
| m34-2.5-01 | Existing: flaechen-vergleichen, rauminhalte-wuerfel | Build and compare real unit-cube bodies, relating the layers to unit surfaces. | Pending |
| m34-3.1-01 | Existing: laengen-messen, masse-fassungsvermoegen, uhrzeit-zeitspannen | Measure with real ruler/meter counter, balance, jug and stopwatch, including self-chosen reference units. | Pending |
| m34-3.1-02 | Existing: laengen-messen, masse-fassungsvermoegen, uhrzeit-zeitspannen, geld-einkaufen | Write and explain actual measurement results with units, including everyday m/cm and euro/cent notation. | Pending |
| m34-3.1-03 | Existing: masse-fassungsvermoegen, geld-einkaufen, einheiten-wechseln | Physically pour equal portions, exchange money and explain why the quantity is unchanged. | Pending |
| m34-3.1-04 | Existing: uhrzeit-zeitspannen | Time a real activity and compare measured durations with calculated start/end times. | Pending |
| m34-3.2-01 | Existing: schaetzen-sachprobleme | Choose real reference objects for 500 ml, 1 l, 1 kg and 1 km and justify your own estimates. | Pending |
| m34-3.2-02 | A: Dedicated ordering lesson covers length, duration, mass and capacity in common/mixed units, including the 60-minute step; reasoning.ts, coverage-gaps.test.ts. | Order real objects/durations, verify by measurement where appropriate and discuss plausibility. | Pending |
| m34-3.2-03 | Existing: masse-fassungsvermoegen, uhrzeit-zeitspannen | Divide real quantities into halves/quarters/three quarters and explain the equivalent notation. | Pending |
| m34-3.3-01 | Existing: geld-einkaufen, uhrzeit-zeitspannen, schaetzen-sachprobleme, expedition-werkstatt, expedition-reise, expedition-inselfest | Read and discuss authentic local quantity sources, rather than only model sources. | Pending |
| m34-3.3-02 | A: Fermi assumptions and source selection added; existing quantity-reference estimates remain in schaetzen-sachprobleme. | Choose your own real reference quantities and Fermi assumptions, measure where appropriate and explain your representation. | Pending |
| m34-3.3-03 | A: Purpose-based exact/approximate choice added, complementing reference estimates and exact budget checks. | Justify the precision needed for your own practical situation and discuss the estimate with others. | Pending |
| m34-3.3-04 | Existing: geld-einkaufen, laengen-messen, masse-fassungsvermoegen, expedition-werkstatt, expedition-reise, expedition-inselfest | Describe and test more/less relationships in your own shopping or measurement situation. | Pending |
| m34-4.1-01 | A: Five-category table, missing-frequency inference and scaled labelled chart added at Level 2; data-and-expeditions.ts, data-model.ts, coverage-gaps.test.ts. | Plan and carry out a real collection using local or newspaper sources; choose and draw your own larger table/diagram. | Pending |
| m34-4.1-02 | Existing: tabellen-diagramme-auswerten, expedition-werkstatt, expedition-reise | Describe relationships in authentic timetables and price lists in your own words. | Pending |
| m34-4.1-03 | Existing: tabellen-diagramme-auswerten, expedition-inselfest | Formulate original mathematical questions about a table/chart and justify the answers with classmates. | Pending |
| m34-4.1-04 | Existing: tabellen-diagramme-auswerten, expedition-reise, expedition-inselfest | Use further authentic charts/timetables and explain how you inferred non-visible data. | Pending |
| m34-4.1-05 | A: Five-category table/chart practice extends the existing observation-list/table-to-editable-chart models. | Choose and draw your own suitable representations from authentic data and discuss the transfer. | Pending |
| m34-4.2-01 | Existing: zufallsexperimente | Predict, perform and compare physical bag/dice/wheel experiments with others; discuss chance versus observed frequency. | Pending |
| m34-4.2-02 | Existing: zufallsexperimente | Design systematic changes to a physical experiment, perform trials and discuss their results. | Pending |

## Boundaries and release gates

No probability fractions, percentages, formal Dreisatz, secondary algebra or angle degrees are added. Simple fractions remain everyday quantity notation. Real collection, measuring, construction, open questions and peer explanations remain B work. All content, suitability and fluency decisions remain C work. Recordings and media acceptance remain pending. `publication.json`, `acceptance.json`, `full_coverage: false`, `review_status: awaiting-primary-teacher` and every reviewer field remain unchanged.

The ZAM bundled-cell update is a separate follow-up after publication: `npm run academy:sync -- --app mathematik-grundschule-4` in zam-os/zam. It is outside this PR.

## Verification

Results and browser checks are recorded in the PR description. The new regression suite is `tests/coverage-gaps.test.ts`; existing tests continue to check independent lab witnesses, fresh exits, two levels, resumption and assisted evidence.

Final local checks on 2026-11-04:

- In the package, `npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip`: passed; 157 tests in 12 files. The ZIP contains the built HTML and launchers.
- `npm run verify:release`: passed the offline-byte/path/status checks. Teacher recording and approval remain pending.
- Optional existing-workspace Biome `format --write src tests scripts cell.json coverage.json` and `lint src tests scripts vite.config.ts`: clean.
- At the root, `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`: 51 passed.
- In a scratch directory outside the repo, `npm init -y && npm i --no-audit --no-fund zam-core@0.54.0`: installed the version pinned by CI.
- `ZAM_CORE=file:///private/tmp/zam-grade4-gap-core.mOAZzv/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs`: all 39 cells passed, including curated distractor checks.
- With the same `ZAM_CORE`, `node mathematik-grundschule-4/scripts/validate-cell.mjs`: passed installation, 159-card enrolment, idempotency, recall rating and history preservation in a disposable library.
- `npm run dev -- --port 5317`, then open `/tests/browser.html` and activate **Speicherprüfungen starten**: 452 native IndexedDB/DOM assertions passed. These include every new lesson's two levels and exits and actual input of multi-summand carries.
- `npm run preview -- --host 127.0.0.1 --port 5316 --strictPort`: opened the built app in Chrome and inspected all four new lessons plus changed addition, decomposition and data lessons in light/dark on desktop and at a confirmed 320 CSS-pixel viewport. Inspected initial interactive fields, worked explanations, both practice levels and the new multi-summand/number-word/five-category views. Wide tables/charts scroll within labelled regions. Fixed and rechecked the wide-screen dark background and a positioned hidden label that had caused narrow-page overflow. No console errors observed.
- Compared the cell against `git show 7309c3e:mathematik-grundschule-4/cell.json`: all prior 39 atom metadata records and all 146 items are structurally identical, including their ids, slugs and card texts; all 54 competence ids/texts are preserved. Acceptance/publication file bytes are unchanged.
- Independent agent review against `AGENTS.md`: the exit-repeat finding was corrected and rechecked. `npm test -- tests/coverage-gaps.test.ts tests/written-addition.test.ts tests/forest.test.ts && npx tsc --noEmit`: 34 targeted tests and typecheck passed; no remaining actionable findings. The committed regression checks repeated/pinned exits after labs and both levels across 240 seeds per new lesson.
