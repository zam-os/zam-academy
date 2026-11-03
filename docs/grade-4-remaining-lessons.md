# Grade 4 remaining digital lessons

Thomas requested PR #78's merge and the remaining lesson sequence on
2026-11-03. PR #78 merged at 312201f. Work continues on one branch, with a
commit after each world. This implements the digital parts of the explicit
plan amendment; teacher/media/physical acceptance gates remain unchecked.
The package remains local-only, with no Academy registration or official
whole-grade binding.

## Measure Market

Six lessons add length measurement, mass/capacity, clocks/durations,
play-money shopping, unit conversions, and estimates/practical planning.
Each uses three relevant guided goals, a quick check, three successful tasks
per level, new exit tasks and the existing local assistance/reward rules.
Equivalent coin arrangements and decimal comma/point quantity answers are
accepted in their labelled fields. Time uses 60 minutes/hour,60 seconds/minute
and 24 hours/day. The old whole-number parser and existing lesson stores are
unchanged.

Screen models are explicitly distinct from physical measurements. Actual
measuring, free estimates, discussion, quantity ordering across all domains
and teacher production remain named gaps in coverage.json. The arithmetic
calculation from approximate givens asks for the unrounded calculation value;
it does not grade another reasonable free estimate as a wrong observation.

Teaching/quiz/lab families are reserved from exit generation, and evidence
canonicalises model/worksheet forms of clocks and quantity facts. Independent
review found and verified corrections to decimal guidance, estimation goals,
capacity scale rendering and demonstrated facts recurring as fresh evidence.
The reviewer sampled 18,000 exits without a reserved-family overlap and
confirmed the previous 18 atoms/62 items unchanged. The cell now has 24 atoms
and 86 items, version 2026.11.10; cards remain only in cell.json.

Verification on 2026-11-03:

- App: npm ci --offline, npm run typecheck, npm test (130 tests),
  npm run package:zip and npm run verify:release passed. External Biome
  format/lint and git diff --check passed.
- Root: node --test scripts/build-catalog.test.mjs
  scripts/academy-registry.test.mjs passed 48 tests.
- All 38 cells plus the Grade 4 disposable install/enrol/recall/reinstall path
  passed using CI-pinned zam-core 0.54.0.
- The isolated native IndexedDB harness passed 189 assertions, including all
  six journeys. Production ruler controls, six workshop starts, phone
  layout at 320 px and desktop at 1280 px, light/dark settings were inspected.
  The existing learner preview/progress atlocalhost:5231 was not touched.
- Independent second-agent recheck:76 targeted tests, typecheck and diff
  whitespace check passed, with no remaining actionable findings.

Teacher recordings, teacher sign-off, direct-file startup, actual playback,
ZAM learner-UI recall and physical touch-device acceptance remain pending.
No new dependency, publication, learner history migration or broad curriculum
claim is part of this implementation.
