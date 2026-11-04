# Grade 4 PR #80: review follow-up

Reviews inspected on 2026-11-04:

- [Formal review and eleven inline threads](https://github.com/zam-os/zam-academy/pull/80#pullrequestreview-5764391409).
- [Independent package-standard review](https://github.com/zam-os/zam-academy/pull/80#issuecomment-6624653453).
- [Independent browser/contrast review](https://github.com/zam-os/zam-academy/pull/80#issuecomment-6624691002), which arrived during the initial pass.

The budget checks now include sufficient and insufficient budgets at both
levels. Transfer additionally asks for the largest affordable whole-item
quantity. Reference estimates combine two benches and a gap; cuboid transfer
repairs a missing opposite face; surface transfer removes tiles; volume
transfer plans an additional complete layer. Clock solutions explicitly
explain minutes remaining until the next full hour, including a full 60 min
when the displayed time is already on the hour.

Experiment reset is available only before drawing. A transactional guard
also rejects a stale reset button after the first draw, preserving the
original prediction, conditions and observed prefix. Option order is stable
per experiment/field, with semantic values independent of display position.
The initial shuffle still placed the correct uncertainty answer first in all
three authored labs; independent recheck found this, and the corrected mix
is pinned to three different correct-answer positions.

SVG text inherits the theme's readable ink. Draw-log numbers stay inside
their boxes. Geometry previews and editable grids have visible labels;
static ornament cells name their shape for assistive technology. Model
submissions say “Meine Darstellung prüfen”. The capacity explanation
introduces Hohlmaße; the nonexistent Level-1 bag change and grammatical
errors are corrected. New card prose and quantity displays use consistent
spacing, preserving all IDs and the original 18 atoms/62 cards.

The duplicate escapers now use one dependency-free helper. Superseded
signature fallbacks, unreachable lab entries and an inapplicable four-row
surface reservation are removed. Generated surface figures have five occupied
rows, so that four-row teaching arrangement cannot recur; actual lab-family
reservations remain. Dated 38-cell records are preserved as historical
evidence, with the integrated 39-cell count explicitly distinguished.

The 36-lesson/39-atom registry mismatch is documented as a publication gate,
including its inherited four-atom workshop cause. This PR keeps local-only
status and existing identities. It does not resolve that broader public
contract by silently changing IDs or lesson counts. Teacher/media, physical
and field acceptance gates remain pending. A one-time follow-up is scheduled
for the remaining expected reviews; this pass does not authorize merging.


## Verification

On 2026-11-04, `npm ci --offline`, `npm run typecheck`, `npm test` (148 tests
in 11 files), `npm run package:zip` and `npm run verify:release` passed in
`mathematik-grundschule-4`. Root catalog/registry tests passed 48 checks.
All 39 cells and the 146-card disposable install/enrol/recall/reinstall path
passed with the CI-pinned zam-core 0.54.0 scratch installation. External
Biome format/lint and `git diff --check` passed.

The isolated native `/tests/browser.html` harness passed 404 assertions,
including a captured stale reset after drawing, saved prefixes, semantic
option values and every added lesson journey. The production app's dark
chart/ruler/clock/mass/capacity labels use the same readable ink colour;
computed SVG fill was rgb(242, 234, 251). Phone views at 320 px stayed within
the document width. Trial reload retained four draws and its original guess,
without a reset action. Draw markers no longer overlap; keyboard Enter
completed a net square; static ornament cells named their selected shape.
The visible geometry preview and edit-grid labels were inspected. The user’s
localhost:5231 preview and progress were not touched.

Independent read-only recheck reported no remaining implementation findings:
85 targeted tests, typecheck, diff check and 4,000 arithmetic cases passed.
Parsed JSON preserves the original 18 atoms/62 items and all 185 current
atom/item IDs, without history mappings. This review is not teacher approval.
The strict complete-release gate remains intentionally blocked by the listed
manual/teacher/media acceptance work.


## Fourth review

The [additional clock comment](https://github.com/zam-os/zam-academy/pull/80#discussion_r4464590466)
repeats the already corrected next-full-hour solution. The
[overnight timetable finding](https://github.com/zam-os/zam-academy/pull/80#discussion_r4464590484)
is also addressed: every displayed event after midnight, including arrival
and departure at the intermediate stop, names the next day in its own cell.
The durations and semantic task identity are unchanged. A 200-seed regression
checks all four event cells against their absolute times and verifies the
unchanged pure-travel, waiting and total durations. The app now passes 149
unit tests; the earlier 148-test evidence above describes the first pass.

The final native rerun again passed 404 assertions. In the built app, a
23:30 departure, 00:00 intermediate arrival, 00:15 departure and 01:00
destination arrival displayed all three next-day labels. Entered answers
75 min travel, 15 min waiting and 90 min total passed. The independent
recheck passed all eight final-world tests and found no actionable issue.
