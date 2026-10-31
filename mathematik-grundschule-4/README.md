# ZAM Discovery Island: Grade 4 place-value starter

German learner and parent UI for the opening mathematics lesson in Bavaria.
Two resumable missions teach place values, zero placeholders and grouping
in both directions, with Milo as a welcoming companion.

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
installation creates no cards, explicit enrolment creates eight, retries
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
- `cell.json` is the sole recall-card source: four atoms, eight narrow German
  items with generated, fixed ULIDs. Edit cards only in this file; there is no
  second authored card list or card generator. Installation uses the approved
  core's card-text validation and write path. There is no official Grade
  4 curriculum binding until reviewed full-course coverage justifies it.
- `coverage.json` enumerates 54 official competence positions across 13
  subareas, with source anchors, checked date and explicit remaining work.
  Only partial place-value work is implemented. No teacher review or full
  coverage is claimed.
- Evidence records first responses separately from helped retries. The
  parent view reconstructs dated examples from the task version and seed.
  Local practice is never presented as ZAM review history or an FSRS score.
- A versioned IndexedDB document commits mission completion and unique
  reward keys together. Concurrent tabs serialize writes. Ordinary version
  changes do not mint rewards; absence never takes away decorations or
  care. Corrupt saves remain available for export before an explicit reset.
- Later checks use new variants at least 24 hours after completion. They
  record their actual time and assistance, with no scheduling or push alerts.
  Browser clocks are not trusted assessment instruments or proof of learning.
- There are no accounts, analytics, third-party requests, microphone use,
  paid actions, rankings or security-setting changes.

All illustrations are original SVG/CSS. Project prose is English; the entire
learner experience, accessible labels and teaching material are German.
