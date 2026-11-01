# Grade 4 review follow-up

**Updated:** 2026-11-01. Applies to the unpublished Phase-1 draft in PR #72.
The shared publication safeguard is extracted to PR #73; #72 is stacked on
that branch and must follow it. No publication, merge or history-transfer
approval is implied.

## Teaching and evidence fixes

- Read and build activities withhold digit rows and computed totals before
  an answer. Read tasks use the block representation; zero tasks no longer
  repeat all counts in the prompt. Accessible block counts describe the same
  representation available visually.
- Generators vary zero positions, digit positions, sizes and exchange units.
  Entry support uses small numbers; later tasks reach 999 999. T/H exchange,
  1 T = 10 H = 100 Z and the worked million boundary now occur in the lesson.
- Guided representation and transfer are different practice generators, with
  three successful tasks required on each level. Optional fresh rounds are
  available immediately after finishing and grant no additional mission food.
- Positive feedback explains the answer before a separate Continue action.
  Wrong zero placement, digit-versus-value confusion, shifted builds,
  concatenated bundle counts and wrong exchange choices receive specific
  feedback. The reasoning quick check has three plausible options.
- Worked explanations and the decimal-system rule occur in the journey;
  the optional explanation panel remains available for revisiting them.
- Parent examples store a stable task snapshot. Build examples use canonical
  target digits, including repair of earlier version-2 empty-start snapshots.
  A digit example identifies its numeral and highlighted digit. The snapshot
  is an example of the task, not a claim to store the child's submitted answer.
- Earlier answer-revealing version-1 practice remains in the log and retains
  earned decorations, but is not promoted to independent version-2 evidence.
- Explicit reset clears the saved document and all four transient Milo mood
  flags. It returns to the curious welcome state, with no flower or snack.

## Package and review details

- Eight tier-1 items now have binary fast checks; four new synthesis items
  have worked solutions. Original atom/item ids remain unchanged. Number
  answers use digits where the app does. Card text remains only in cell.json.
- Prerequisites form an acyclic support graph: digit value supports the
  table; the table supports zero placeholders; digit value and table support
  exchange. This graph is a teaching proposal awaiting the teacher review.
- coverage.json now uses rows with lb, competence, lessons and evidence.
  It records the 54 official competence texts with normalized whitespace,
  the shared Grades 3/4 source, section anchors, checked date, four learning
  areas and explicitly unspecified hours. The two taught 1.1 rows remain
  partial, with teacher review and further representations still missing.
- The requested narrow official binding is deliberately deferred. In the
  current ZAM core, bindingMatchesScope does not inspect topic_code, and
  matchScope treats a matching grade-specific binding as coversFully.
  needsGenericCurriculumImport then hides the generic importer. The pinned
  0.54.0 core is broader still: any fitting bundled cell hides that importer
  and topic_code is not checked there either. A 1.1 label
  would therefore incorrectly suppress import for this partial starter.
  Alignment is recorded in coverage.json and cell sources instead; the
  disposable cell check asserts that there are no official-grade bindings.
- Dark mode follows the system and has an explicit setting. Text, action
  buttons and panels have theme-aware colours. Milo becomes a compact strip
  on phones; six-column controls retain 44 px widths at 320 px.
- The IndexedDB browser harness uses the exported storage version rather
  than a separate hardcoded version.
- The strict completion gate reports missing deliverables as one clean error
  and nonzero exit, without a stack trace. Windows skips POSIX shell syntax
  checking; Linux CI performs it. Packaging still requires zip/unzip as in
  the existing Academy toolchain; native Windows packaging is not claimed.
- Biome is an optional existing external tool, not a new package dependency.
  The app README gives the exact local command used; CI relies on the locked
  app toolchain, TypeScript, Vitest and package verification.

## Decisions and remaining differences

Thomas's existing approval of 2026-10-31 is cited in the
[public approval record](https://github.com/zam-os/zam-academy/pull/72#issuecomment-6564246975), which quotes the decision already published in commit 9482d89.
AGENTS.md and the README record that scoped exception. The reference is an
agent-recorded pointer to the existing decision, not a fresh human approval;
the underlying conversation remains private. It permits neither third-party
embeds nor invented teacher approval.

The chosen primary-school mission UI remains a custom adaptation, rather
than the secondary-school HTML/JSON shell or slider labs. Integer input is
intentional for this lesson. There are four atomic recall goals within one
workshop, rather than one atom per publicly registered lesson. These
remaining structural differences are listed in the PR for explicit review;
no blanket waiver of the package standard is claimed.

Before Phase-2 registration, the public atlas needs Grade 4 support (its
current registry test starts at Grade 5), and the lesson-count/atom-count
contract must accommodate or restructure the four-goal workshop. Those
shared changes are outside this draft. The teacher should also confirm the
space-based thousands grouping against the intended textbook convention.

Phase 1 remains incomplete until teacher content approval, the real
recording with rights/captions/transcript, actual online/offline playback,
direct extracted-file startup, the learner-UI recall smoke test and physical
touch-device acceptance are recorded. No later course world is implemented.

## Verification

Commands and current results are recorded in the PR body and
mathematik-grundschule-4/acceptance.json. The lesson suite includes sampled
arithmetic/exchange oracles, generator diversity and solvability, assistance
and migration checks, hidden-readout checks and the parent-example regression.
Browser checks cover the journey, both practice levels, feedback, optional
practice, parent evidence, reset, themes, responsive bounds and native
IndexedDB transactions in isolated test stores. Direct file startup and
recorded-video playback remain explicitly unverified.

## Follow-up re-review — 2026-11-01

- Bundling now varies from E through ZT; unbundling varies from Z through HT.
  Every generated exchange offers two eligible columns. Reasoning checks
  vary the adjacent units too, including a plausible factor-100 distractor.
- Concatenation feedback appears only for an actually concatenated value.
  Its regrouping example uses the task's own count and units; other wrong
  exchange answers receive a unit-value hint instead.
- Numerals keep thousands grouping while highlighting the correct decimal
  position. Board legends list exactly the displayed columns.
- V1 attempts retain their recorded facts and receive a historical-preview
  label, without asserting help or independent success under newer criteria.
  Valid version-2 independent evidence remains valid.
- Content version 3 refreshes an in-flight workspace when its generator
  changes and uses versioned attempt keys. It preserves logs, rewards and
  completed practice counts. Previously attempted or helped work remains
  marked as assisted on resumption; an upgrade cannot create independent
  evidence or mint food by replaying the same task.
- The teacher brief explicitly asks whether the prerequisite direction
  should be reversed so grouping precedes formal place value.
- The shared Pages loop in #73 now refuses drafts or invalid publication
  metadata before building/copying an app. Its regression test executes
  that exact workflow command, with ready, absent, local-only and invalid
  markers. Registry errors name a misregistered draft directly.
