# ZAM Discovery Island: Grade 4 Number Forest

German learner and parent UI for Bavarian Grade 4. Four selectable lessons
in the Number Forest now cover place values/bundling, comparing/ordering,
number lines/equal jumps, and decomposition/complements. Each has two
resumable missions, three successful tasks per practice level, fresh exit
checks, optional practice and a welcoming Milo. A lesson is a draft activity,
not a completed annual course or proof of mastery.

The three new lessons have exactly three interactive goals each, using a
number gate, a keyboard-friendly number-line marker and coupled treasure
bars. All whole-number activities stay between 0 and one million.

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
installation creates no cards, explicit enrolment creates twenty-one, retries
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

- Lesson id: `stellenwerte-buendeln`; cell:
  `zam-academy:mathematik-grundschule-4`. Public links are future source
  addresses and do not indicate that this draft is already hosted.
- `cell.json` is the sole recall-card source: seven atoms, twenty-one German
  items (fourteen binary fast checks and seven synthesis tasks) with fixed ULIDs.
  Edit cards only in this file; there is no
  second authored card list or card generator. Installation uses the approved
  core's card-text validation and write path. Prerequisites form an acyclic
  support graph. Official Grade 4 binding is deferred: the current core treats
  a grade-specific binding as full scope coverage regardless of topic_code,
  which would hide the generic importer for this partial starter.
- `coverage.json` enumerates 54 official competence positions across 13
  subareas, with source anchors, checked date and explicit remaining work.
  Only partial place-value work is implemented. No teacher review or full
  coverage is claimed.
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

See [the three-lesson expansion](../docs/grade-4-number-forest-expansion.md) and [the resolution record](../docs/grade-4-review-follow-up.md) for feedback,
regression checks and remaining Phase-2 decisions. Shared publication tooling
is isolated in PR #73; that safeguard and the CI runtime fix are now on main.

Biome is an optional external development check, not an installed package
dependency or CI requirement. The local checks use the existing ZAM workspace
binary: `node /Users/thomas/src/zam/node_modules/@biomejs/biome/bin/biome format --write src tests scripts cell.json coverage.json`
and the same binary with `lint src tests scripts vite.config.ts`. No npm
package or script is implied by this optional check.
