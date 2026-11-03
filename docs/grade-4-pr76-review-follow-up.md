# PR 76 review follow-up — 2026-11-03

Processed the [arithmetic feedback review](https://github.com/zam-os/zam-academy/pull/76#pullrequestreview-5743660613)
and [package-standard review](https://github.com/zam-os/zam-academy/pull/76#issuecomment-6588921223).

| Finding | Final behavior and evidence |
| --- | --- |
| Incoming carry looked like an outgoing carry | Every multiplication column now shows the digit calculation, explicitly names an incoming carry when present, and says which result digit to write and which carry goes to the next column. For 347 · 6, the Z column adds incoming 4 but sends 2 to H; the last T column sends nothing further. Unit and native checks cover success and worked-solution feedback. |
| Excessive carries received missing-carry guidance | Unnecessary carries explicitly say that no full ten was formed and the small field may be blank or 0. A positive carry that is too large asks for a smaller count; a carry that is too small gets separate guidance. This applies to partial products and their final sum. Native checks reject a false carry, accept its blank correction and retain assisted evidence. |
| Teaching examples repeated lab calculations | The single-factor teaching example is 286 · 7; the solved multiplication board and quiz use 305 · 24 and its tens row. Division explains an internal zero with 2 036 : 4 and shows 2 138 : 7 as its solved board. All three lab tasks in each lesson keep their own numbers. The recording briefs match. A regression checks the complete teacher panel, including collapsed content. |
| ASCII minus in a new recall item | The subtraction card uses U+2212 in both its question and math segment. Explicit TeX spacing keeps the stored question equal to the core's derived plain projection. CI-pinned zam-core 0.54.0 accepts it. The item's id is unchanged. |
| Unlabelled all-zero partial row | Full-tens multiplication explicitly labels the ones row as a Nullreihe and explains its zero contribution. The existing fields and practice requirements stay in place. |
| Division mentioned nonexistent carry fields | Both the division board's static note and its incomplete-input validation omit carry instructions. |
| Stale enrolment count | The package README now says forty-six cards, matching the disposable cell check. |

The cell version is 2026.11.7: fourteen atoms and forty-six items, with all
sixty atom/item identities preserved. Only the intended new subtraction
item's typography changes; the original eleven atoms/thirty-four items
remain unchanged as parsed JSON. There are no replacements or retirements.
The draft remains local-only and no phase acceptance is marked complete.

Verification is recorded in the package's `acceptance.json`: 98 Vitest tests,
66 native browser assertions, 48 catalog/registry checks, all 37 cell
validations against CI-pinned zam-core 0.54.0, and the disposable Grade 4
install/enrol/recall/reinstall path passed. Typecheck, the existing external
Biome checks, production build and draft ZIP verification passed. The strict
complete-release gate continues to refuse missing acceptance deliverables.

The built app was inspected on a separate test origin, in desktop light and
320 px dark layouts. Checks covered a false product carry and its blank
correction, explicit outgoing-carry feedback, the worked-solution path,
distinct teaching examples, the full-tens zero row and division validation.
The original learner preview was not reset. A read-only independent recheck
passed 73 tests across four relevant files and found no remaining actionable
findings. Primary-school teacher approval, real media, final playback,
direct extracted-file startup, ZAM learner-UI recall and physical touch
acceptance remain pending.
