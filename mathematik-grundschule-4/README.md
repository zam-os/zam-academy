# ZAM Discovery Island: Grade 4 mathematics

German learner and parent UI for Bavarian Grade 4. Thirty-six selectable lessons
in the Number Forest, Measure Market, Shape Bay, Chance Garden and mixed expeditions cover place values/bundling, comparing/ordering,
number lines/equal jumps, decomposition/complements, addition/subtraction
strategies, multiplication/inverse division, the four written procedures, arithmetic patterns, multi-step story problems, systematic combinations, divisors/multiples, measurement, concrete geometry, data/chance and mixed practical planning.
Each has two resumable missions, three successful tasks per practice level,
fresh exit checks, optional practice and a welcoming Milo. A lesson is a
draft activity, not a completed annual course or proof of mastery.

The thirty-five lessons added after the original workshop have three interactive
goals each. Their models include a number gate, a keyboard-friendly
number-line marker, coupled treasure bars, calculation jumps, equal baskets,
result/carry boards, a value-preserving regrouping board, partial-product
boards, a step-by-step division workshop and tables with editable reasoning and intermediate results, a child-built combination list, divisor selection, quantity models, editable geometry,
labelled column charts and saved replacement experiments. Numbers and results stay
between zero and one million. Written multiplication uses one/two-digit
factors; written division uses divisors through 10, including remainders.

## Status

Local Phase-1 implementation, **not a completed or published course**.
Thomas confirmed that no recording is available. The real teacher video,
primary-school teacher content review and final video playback acceptance
remain pending. The app truthfully shows this and supplies the illustrated
explanation. No synthetic teacher, fabricated approval or substitute video
is included. See [the recording brief](docs/teacher-recording-brief.md),
[acceptance record](acceptance.json), and
[implementation plan](../docs/plans/2026-10-31-grade-4-discovery-island.md).

`publication.json` keeps this cell out of the public catalog. Phase 2 must
coordinate explicit publication approval, the Pages app entry and this
marker. Existing public apps retain their publication behaviour. No ZAM
bundled fixture or personal learning library was edited.

## Run and verify

```sh
npm ci
npm run dev          # http://127.0.0.1:5216/
npm run typecheck
npm test
npm run package:zip
npm run verify:release
npm run validate:cell
```

The app reuses the approved Academy TypeScript/Vite/Vitest/single-file
toolchain; it adds no runtime dependencies. `validate:cell` defaults to
the adjacent `zam/dist/index.js`; set `ZAM_CORE` to a file URL of another
approved build to check compatibility. It uses only a disposable database:
installation creates no cards, explicit enrolment creates 146, retries
create none, and reinstall preserves a real recall-rating log.

At the Academy root, run
`node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs` and
`ZAM_CORE=<approved core file URL> node scripts/validate-cells.mjs`.

The ZIP is `release/ZAM-Entdeckerinsel-Mathematik-4-offline.zip`. Extract it
and open `index.html`; all current illustrations, explanations, tasks and
Milo are offline. Persistent browser storage may be unavailable for local
files; the app reports that and keeps the open session usable. Future
approved MP4 assets stay separate from the self-contained HTML and travel
inside the ZIP. No video bytes load before an explicit action.

`node scripts/verify-release.mjs --complete` is the strict phase gate. It
currently fails deliberately on the missing recording; a technical draft
package must not be reported as completed Phase 1.

## Browser integration checks

Open `/tests/browser.html` on the dev server and select the test button.
The harness uses uniquely named native IndexedDB test stores, never the
learner store, and deletes them after testing. It checks concurrent grants,
idempotency, workspace/rest resumption, corrupt-state recovery and blocked
storage fallback without an added fake-database dependency.

Manual journey checks: entry check or skip; build 306 and 2 047 using the
buttons/keyboard; identify a digit value; pause/reload; bundle ten ones;
exchange a hundred; undo; explain a reason; solve fresh exit tasks, including
an intentional wrong answer, hint and worked-solution path; share the one
snack; inspect the parent evidence; finish and return. Check 320 px and
desktop layouts, muted/default sound and reduced motion. Device/browser
coverage and missing video checks are recorded in `acceptance.json`.

The available browser tool permits HTTP(S) navigation only and refused the
direct `file://` URL of the extracted ZIP. Its package bytes and paths were
verified, but double-click startup and actual offline video playback are
not claimed as observed. Those checks require a normal local browser and
the final approved recording respectively; no browser-policy bypass was used.

## Content and persistence

Whole-number answers accept plain (`1000`), space-grouped (`1 000`) and
German dot-grouped (`1.000`) input, through one million. Decimal commas,
exponents and malformed or mixed dot/space groups remain invalid.


- Lesson id: `stellenwerte-buendeln`; cell:
  `zam-academy:mathematik-grundschule-4`. Public links are future source
  addresses and do not indicate that this draft is already hosted.
- `cell.json` is the sole recall-card source: thirty-nine atoms, one hundred forty-six German
  items (seventy-eight binary fast checks and sixty-eight synthesis tasks) with fixed ULIDs.
  Edit cards only in this file; there is no
  second authored card list or card generator. Installation uses the approved
  core's card-text validation and write path. Prerequisites form an acyclic
  support graph. Official Grade 4 binding is deferred: the current core treats
  a grade-specific binding as full scope coverage regardless of topic_code,
  which would hide the generic importer for this partial starter.
- `coverage.json` enumerates 54 official competence positions across 13
  subareas, with source anchors, checked date and explicit remaining work.
  Parts of sections 1.1–1.3, 2.1–2.5, 3.1–3.3 and 4.1–4.2 are implemented. No teacher
  review or full coverage is claimed.
- Evidence records first responses separately from helped retries. The
  parent view uses stable task snapshots for dated examples, with canonical
  targets for build tasks; digit examples use grouped numerals.
  The unpublished draft has no progress migration or compatibility layer.
  The first release uses a fresh storage namespace and starts every learner
  at zero; draft preview saves are not imported.
  Local practice is never presented as ZAM review history or an FSRS score.
- A versioned IndexedDB document commits mission completion and unique
  reward keys together. Concurrent tabs serialize writes. Reopening or
  resubmitting a mission does not mint rewards; absence never takes away
  decorations or care. Corrupt saves remain available for export before an explicit reset.
- Later checks use new variants at least 24 hours after completion. They
  record their actual time and assistance, with no scheduling or push alerts.
  Browser clocks are not trusted assessment instruments or proof of learning.
- There are no accounts, analytics, third-party requests, microphone use,
  paid actions, rankings or security-setting changes.

All illustrations are original SVG/CSS. Project prose is English; the entire
learner experience, accessible labels and teaching material are German.

## Review follow-up

See [the Number Forest expansion](../docs/grade-4-number-forest-expansion.md) and [the resolution record](../docs/grade-4-review-follow-up.md) for feedback,
regression checks and remaining Phase-2 decisions. The
[PR 76 follow-up](../docs/grade-4-pr76-review-follow-up.md) records the written-arithmetic review fixes. Shared publication tooling
is isolated in PR #73; that safeguard and the CI runtime fix are now on main.

Biome is an optional external development check, not an installed package
dependency or CI requirement. The local checks use the existing ZAM workspace
binary: `node /Users/thomas/src/zam/node_modules/@biomejs/biome/bin/biome format --write src tests scripts cell.json coverage.json`
and the same binary with `lint src tests scripts vite.config.ts`. No npm
package or script is implied by this optional check.

The Measure Market adds length measurement, mass/capacity, clocks/durations,
money, unit changes and estimates/planning. Three model goals, three guided
and three transfer tasks, and three fresh exit tasks retain the same local
evidence and reward rules. Physical tasks are instructions, not observations.
Quantity fields accept decimal comma/point only where labelled; whole-number
parsing is unchanged. Time fields use HH:MM, durations use actual 60/24 relationships.
See [recording briefs](docs/measure-market-recording-briefs.md).

Shape Bay adds nine geometry lessons with editable plans, isometric cube
buildings, rectangle/net construction, mirror/scaling grids, repeating
patterns, unit surfaces and unit cubes. Free constructions use geometric
properties, including alternate valid nets and ornaments. Exit observations
use labels for the task actually checked; physical construction is pending.

The final six lessons add model data collection, vertical column charts
(Säulendiagramme), tables/timetables, chance experiments with replacement, and
three mixed planning expeditions. Initial predictions stay recorded even
when assisted analysis follows; frequencies and chance are distinct.
Authentic outside collections and learner-generated questions remain
practical activities without automated observation or teacher sign-off.
