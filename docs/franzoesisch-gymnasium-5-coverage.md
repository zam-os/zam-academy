# French 5 Gymnasium: curriculum and local package record

Checked on 14 November 2026 against the live [LehrplanPLUS French 5, first foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/franzoesisch/1-fremdsprache). The same Fachlehrplan applies across Gymnasium educational directions; no Realschule track is attached. This package is a local draft, not a published preview.

## Curriculum evidence

`franzoesisch-gymnasium-5/tests/fixtures/lehrplanplus-f5.html` preserves the fetched page. The SHA-256 is recorded in `coverage.json`. The grade 6 page is preserved and hashed as a boundary check. `node scripts/check-curriculum.mjs` in the package checks both hashes and finds all 47 coverage rows verbatim after whitespace normalization: **47 rows, 0 not found**. The page does not specify hours per learning area.

The matrix includes the 40 top-level competence statements and seven topic blocks, in source order. Grammar sublists are retained within their parent row rather than counted as separate competences. Package row ids are local, not official ISB identifiers. Every lesson is linked to at least one row and every row to lessons.

| Stage | Lessons | Main contribution |
| --- | ---: | --- |
| Bonjour, les amis ! | 5 | Greetings, introductions, IPA, classroom instructions, numbers to 100 |
| Ma petite vie | 5 | Articles and plurals, possessives, family/pets, picture description, forms and dates |
| Les verbes en action | 5 | Être/avoir, regular -er/-re verbs, spelling changes, aller/faire |
| On parle ensemble | 5 | Intonation/est-ce que questions, quel/inversion with a nominal subject, negation, noun objects, vouloir/pouvoir |
| Une journée et demain | 5 | Lire/dire/écrire, prendre, school/leisure, clock, futur proche, invitations and reasons |
| En route en France | 5 | France, Paris, Brittany, travel situations, shopping and quantity + de |
| Je comprends ! | 5 | Global/detail listening, illustrated reading, mediation, correspondence |
| À toi de créer | 5 | Christmas/birthdays, original comptine, vocabulary techniques, accents, sentence order, current-event project |

The geography activity names the Seine, Loire, Rhône and Garonne, Paris, Marseille, Lyon, Toulouse and Bordeaux, the Atlantic, Mediterranean, Channel, Alps and Pyrenees. The map explicitly describes itself as a schematic of the European mainland, not a navigation map or a representation of all French territory. Population/area comparison is a guided research task using official EU profiles with years and geographic scope, rather than undated figures in recall cards.

All four displayed source links were opened and their actual titles read; `source-checks.json` records URLs, titles, dates and response hashes. Teacher videos are intentionally left to the separate video step required by the package standard.

## What remains outside the app

`status: supported` marks expectations whose full performance cannot be established by local exercises. Computer or partner speech prepares listening; it does not replace natural recordings, audiovisual clips or pronunciation feedback. Speaking tasks require actual speaking and human partners. Drawing and staging happen on paper or in class. Learners must use their own textbook and maintain personal vocabulary over time. Current-event and population research requires opening and checking the actual sources. Self-assessment confirms practice only.

The grade 6 curriculum introduces object pronouns, frequent adjective agreement/position and passé composé. The grade 5 package introduces direct and indirect **noun** objects, regular imperatives, the specified present-tense verbs and futur proche. It does not move those grade 6 grammar targets into grade 5.

## Existing-card inventory

The local `zam-os/zam` inventory was inspected at base commit `e6a235f75fe87b9d57af38bd61011027b891492c`, in `tests/fixtures/curriculum/` and `src/kernel/library/bundled-cells.ts`. There is no French Gymnasium grade 5 or grade 6 legacy cell. The nearest old fixture is `de-by-gymnasium-7-franzoesisch-passe-compose-relativsaetze-verneinung-kvt.json`. Its composite card `01K4F7Y0000000000000000J04` includes quantity + de, which overlaps `f5-achats-check`, but its complete retrieval also requires relative pronouns, extended negation and partitive articles. The whole prompt, concept and sample solution are not equivalent to the new quantity-rule card; transferring its history to that one facet would overstate mastery.

The explicit neighbouring-grade question was put to Thomas during the PR #134 follow-up: leave the composite card with grade 7, or also inventory it in grade 5 as category-C keep-active? On 14 November 2026 he answered **"Leave it with grade 7 (Recommended)"**. `replaces-de-by.json` records the source commit, both inspected locations, the exact old/new item ids, the question and that scope decision. The old card remains under grade-7 ownership; this is not approval for a mastery transfer.

No old item is selected for migration. `replaces-de-by.json` has empty sources and rows, `status: proposal-only` and `approved: null`; the new cell declares no `replaces` or `retired_items`. No mastery transfer is proposed or approved. The 160 generated atom/item ULIDs and lesson anchors are pinned in the identifier-only public contract fixture.

## Verification

From `franzoesisch-gymnasium-5`:

- `npm ci --offline --no-audit --no-fund`: installs the copied shell's existing dependency set; no dependencies added.
- `npm run typecheck` and `npm test`: TypeScript succeeds; 170 tests pass, including 120-goal reachability, number/clock models, map topology and label placement, first-person possessive wording, the recorded grade-7 decision, accent-sensitive answers, listening failure/cancellation and multi-tab progress.
- `npm run package:zip`: builds self-contained HTML; verifies identical ZIP bytes, Windows/macOS/Linux launchers, absence of remote assets and Unix launcher syntax.
- `ZAM_CORE=file:///tmp/zam-core-054/node_modules/zam-core/dist/index.js node scripts/validate-cell.mjs`: with pinned core 0.54.0, installation creates no cards, 120 new cards start fresh, and repeated installation/enrolment preserves all cards and one submitted recall record.
- `node scripts/verify-browser.mjs`: installed headless Chrome opens the built HTML directly through `file://`; 160 lesson/level/theme views and all 120 goals pass. Responsive checks cover 390 and 720 px in both themes; desktop is 1280 px. Checks include quiz feedback, short answers, rubric gate, reload persistence, draft invalidation, clock, number slider, map layers and partner-read fallback. Report: 0 runtime errors, 0 HTTP requests. A separate local-HTTP inspection confirmed the visible UI and map controls in the Codex in-app browser.

From the repository root:

- `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`: 52 tests pass after merging current `main`; the local draft remains excluded from public surfaces.
- `ZAM_CORE=file:///tmp/zam-core-054/node_modules/zam-core/dist/index.js node scripts/validate-cells.mjs`: every cell installs and passes card-text/distractor checks, including this package's 120 items.

Actual OS launcher execution, installed speech audio quality, teacher assessment of beginner vocabulary/progression, natural audiovisual input and external verification of these follow-up fixes remain open. The PR submits this local draft for external review; it does not authorize publication or transfer review histories.

## External-review follow-up

The [Grok review](https://github.com/zam-os/zam-academy/pull/134#pullrequestreview-5903380980) and [OpenCode review](https://github.com/zam-os/zam-academy/pull/134#issuecomment-6875273871) were checked against the code, official curriculum fixture and original legacy card. The substantive quiz, midnight and map findings are fixed: Lina now speaks in a first-person quote, the clock uses minuit/midi while retaining the plural in vingt et une heures, the Rhône reaches the coast west of Marseille, and city/river labels sit beside their features. The map data has geometric regression checks for the taught city–river relationships, coastal endpoints and label positions. The midnight/noon readouts and possessive quiz are also exercised through their real browser controls.

F5-22 is now `supported`: the app teaches imperative/question structures, while spontaneous reactions need partners. The mapping record has schema 1 and the inspected source commit, with Thomas's neighbouring-grade decision above. The merge retains the CI checks from both branches; French's dev port moves to 5245 because new `main` uses 5243 and 5244.

The German Baguette wording is standardized to the common neuter form. The review's claim that the feminine form is inherently wrong is too strong: [Duden accepts both genders](https://www.duden.de/rechtschreibung/Baguette), with the feminine marked rare. French une/la baguette remains unchanged. The clock correction agrees with the [Académie française guidance on zero-hour/minuit usage](https://www.academie-francaise.fr/m-r-france); the Rhône mouth is checked against the [Port-Saint-Louis tourism office's description](https://www.portsaintlouis-tourisme.fr/fr/se-ressourcer-port-saint-louis/le-fleuve).

The small editorial suggestions are incorporated: complete polite-order wording, a clearer tennis preference example, number-explorer help matching its additive blocks, a rationale on each prerequisite edge, and the original narrow spaces around the dash in F5-39. No learning-item identifiers, review histories or publication status change.
