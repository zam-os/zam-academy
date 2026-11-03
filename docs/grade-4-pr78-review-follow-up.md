# Grade 4 PR 78 review follow-up

The [inline review](https://github.com/zam-os/zam-academy/pull/78#discussion_r4458899943)
and [independent package review](https://github.com/zam-os/zam-academy/pull/78#issuecomment-6612565572)
were processed on 2026-11-03. This is code/content review; primary-school
teacher approval remains pending.

| Finding | Resolution |
| --- | --- |
| Restricted two-row tasks refer to a nonexistent third row | The counting explanation mentions the third row only for a three-row model, and explains that every third-row option is available for each allowed pair. |
| Positive divisor feedback omits the article | Positive success now says “ist ein Teiler”; the negative branch remains “ist kein Teiler”. |
| German thousands dots are rejected without clear entry guidance | Whole-number input now accepts strict groups such as `1.000`, `2.047` and `1.000.000`, alongside plain and space-grouped input. Malformed/mixed grouping, decimals, exponent notation and out-of-range values remain invalid. Worksheet notes and validation notices show accepted examples. |
| Zero-first multiples wording may confuse primary pupils | Teaching and recording copy start with positive multiples. Zero is explained separately through zero packets; the task tables still use at least one packet. The positive/zero convention is explicitly retained for teacher review. |

The unrelated German Grade 4 package landed on main during review. The
branch merges that main commit (`87ed17e`); the README retains both its new
German draft row and the fifteen-lesson mathematics row. No German package
content was edited as part of these fixes.

The cell stays at `2026.11.9`: no card, atom or identifier changes. The
intermediate `.8` was an unpublished local implementation version, so the
version observation needs no compatibility or history-transfer action.
Publication remains local-only and no phase checkbox closes.

Verification:

- App: `npm ci --offline --no-audit --no-fund`, `npm run typecheck`,
  `npm test` (123 tests), `npm run package:zip`, `npm run verify:release`;
  external Biome format/lint and `git diff --check` passed.
- Root catalog/registry: 48 tests passed. All 38 cells, including the new
  main-branch German draft, validated against CI-pinned zam-core 0.54.0.
  The mathematics disposable install/enrol/recall/reinstall check passed.
- The isolated native browser harness passed 116 assertions, adding actual
  dot-grouped numeric grading and worksheet save/resumption to the existing
  persistence, assistance, queue and reward cases.
- In the built app on isolated port 5233, `2.000`/`2.250` survived reload and
  solved the pattern worksheet. The divisor success displayed the corrected
  article; the positive/zero teaching distinction and entry guidance rendered.
  The user's existing lesson on port 5231 was not operated or reset.
- Independent read-only recheck: 78 tests across four targeted suites and
  `npx tsc --noEmit` passed; no remaining actionable findings.

Teacher approval, approved recordings and their rights/captions/transcripts,
final playback, direct extracted-file startup, learner-UI recall and physical
touch acceptance remain pending. The strict completion gate stays nonzero.
