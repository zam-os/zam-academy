# PR 75 review follow-up — 2026-11-02

Processed the [written-addition review](https://github.com/zam-os/zam-academy/pull/75#pullrequestreview-5741916481),
[second review](https://github.com/zam-os/zam-academy/pull/75#pullrequestreview-5742098742)
and [metadata/feedback review](https://github.com/zam-os/zam-academy/pull/75#pullrequestreview-5742185360).

| Finding | Final behavior and evidence |
| --- | --- |
| Premature checks consume first attempts | Null/invalid input returns validation before recording. A correct result with wholly blank carries gets a completion notice. Unit and native tests confirm a later correct exit remains independent; real errors and hints still count. |
| Goal-3 exit reveals the diagnosis | The exit now requires an editable correction board with a guaranteed carry chain. Practice diagnosis varies the omitted carry and asks the child to calculate the difference. |
| Guided and transfer difficulty overlap | Level 1 has four/five digits and zero, one or two separated carries. Carry-free tasks include equal and unequal operand lengths. Every transfer task has six/five-digit operands, a zero position and at least two consecutive carries. Tests sample 5,000 seeds per variant. |
| Carry hints use the wrong direction/order | Feedback alternates result E, carry Z, result Z and so on. Excess carries ask for blank/0; missing carries explain bundling. Unit/native/browser checks verify the direction. |
| Blank-zero test used an invisible cell | A regression uses the visible H/ZT zero carries in 30 407 + 2 685, accepting blank and rejecting 1. The native exit test also leaves visible zero carries blank among actual carries. |
| Written subtraction assumed for checking | Worked explanations, recording script and the revised recall example use a newly calculated swapped-addend check. |
| Reused recall example | One unpublished written-addition card uses a fresh number pair. Its identifier remains stable; no history transfer is added. |
| Keyboard/accessibility details | Roving Tab/Shift+Tab follows the calculation order; focus/click selects the digit. Typing retains focus. The dash has real hidden text; static instructions and the initially empty live error region are separate. Native and real-keyboard browser checks passed; no screen-reader hardware claim is made. |
| Quiz keys depend on position | Each choice has an explicit correct marker. Pure grading validates exactly one marker; a reordered-choice regression keeps the correct answer attached to its label. |
| Misleading inverse-probe hint | The missing-addend probe uses its own hint instead of asking for a difference. |
| Stale metadata and wording | Cell description/source label and page metadata describe eight draft lessons. The basket lab asks for the basket-count action it grades. The expansion separator and responsive-layout comment are corrected. |

`npm ci --offline --no-audit --no-fund`, `npm run typecheck`, `npm test`,
`npm run package:zip` and `npm run verify:release` passed with Node 26.13.0
and `NODE_OPTIONS=--no-experimental-webstorage`: 77 Vitest tests. Existing
external Biome format/lint passed. Root catalog/registry tests passed 48
checks, and all 37 cells plus the disposable Grade 4 recall path passed
against CI-pinned zam-core 0.54.0. Cell 2026.11.4 keeps eleven atoms/thirty-four
items; JSON assertions preserve all identifiers and the earlier ten atoms.

The isolated native browser harness passed 27 assertions. Built desktop
light and 320 px dark journeys covered both levels and the revised exits,
validation, feedback, keyboard movement and parent snapshots. Temporary
viewport overrides were reset; user preview progress was not reset.

An independent read-only recheck found no actionable findings after sampling
boundary seeds, validation/evidence transitions, quiz markers and column order.
Teacher approval, real recordings/rights, final playback, direct extracted-file
startup, ZAM learner-UI recall and physical touch remain pending. The strict
complete-release gate still refuses completion. No publication or merge is
performed by this review follow-up.
