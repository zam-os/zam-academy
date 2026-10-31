# Grade 4 mathematics, Bavaria: Discovery Island implementation plan

**Date:** 2026-10-31
**Plan status:** Phase 1 in progress. The German starter is implemented and
technically verified locally; the teacher recording, content sign-off and
remaining manual acceptance checks are pending. No phase is marked complete.
**Chosen direction:** Discovery Island, selected by Thomas on 2026-10-31.
**Companion:** Milo, the working identity from the concept.
**References:** [Concept](../grade-4-mathematics-lighthouse-concept.md) ·
[First-lesson specification](../specs/2026-10-31-grade-4-place-value.md) ·
[Academy app/cell contract](../../README.md#how-an-app-and-its-zam-cell-fit-together).

## Status

- [ ] Phase 1 — complete place-value lesson with Milo and a real teacher video
- [ ] Phase 2 — family usability pilot and Academy starter release readiness
- [ ] Phase 3 — complete Number Forest
- [ ] Phase 4 — complete Measure Market
- [ ] Phase 5 — complete Shape Bay
- [ ] Phase 6 — complete Chance Garden and mixed island expeditions
- [ ] Phase 7 — full-course review, field pilot and curriculum release readiness

### Implementation record — 2026-10-31

Phase 1 now has a runnable `mathematik-grundschule-4/` app: two German
missions, original Milo SVG states, exact place-value operations, guided
and fresh tasks, assistance-aware evidence, real local parent examples,
transactional IndexedDB persistence, unique mission rewards, an offline
draft ZIP, four atoms/eight cards and a 54-row competence inventory.

Thomas confirmed that no teacher recording exists and requested the
recording brief. The native player/caption/transcript integration and
production handoff are prepared; no fake recording or teacher review is
claimed. The strict release check deliberately remains blocked. The app's
[`acceptance.json`](../../mathematik-grundschule-4/acceptance.json) records
actual verification and remaining work. `file://` navigation is blocked by
the browser tool's URL policy, so direct offline-file startup is not
reported as tested. Existing ZAM learner-UI recall still needs its manual
smoke test; the real kernel install/enrol/rate/reinstall checks pass in
disposable libraries, including the CI-pinned 0.54.0 core.

**Plan correction discovered during implementation:** Keeping the new app
out of the Pages build list alone does not prevent release: the catalog
builder discovers every `cell.json` automatically. Phase 1 therefore adds
an optional `publication.json` contract. This starter is `local-only` and
excluded from the public catalog, while cell CI validation still runs.
Invalid metadata fails closed; existing apps without a marker keep their
behaviour. Phase 2 coordinates `ready`, the Pages entry and explicit
publication authority. The catalog change has regression coverage and is
documented in the Academy README. No publishing, core fixture sync or
later-phase implementation has occurred.

**Integration with current main:** The newer package standard expects all
cells in the public atlas and uses secondary-school lesson conventions.
This Phase-1 primary-school prototype deliberately keeps its approved
mission structure, transactional IndexedDB store and planned first-party
video player. It adds no teacher media before recording approval. The atlas
registry check now shares the catalog's local-only exclusion; public
`academy.json`, Pages and landing-page integration remain in Phase 2.
Card text lives only in `cell.json`, with no duplicate generator. The dev
port is 5216 to avoid the current English Grade-10 package's port.

Implement exactly the next unchecked phase when implementation is requested.
Substeps below belong to their phase, not separate feature branches. One
feature branch and one PR per repository if both repositories need changes;
use one branch and commits per completed phase. Thomas subsequently requested
PR creation on 2026-10-31. The review branch is
`codex/grade-4-discovery-island-pr`, isolated from the older working branch
on current `main`; the request authorises its commit, push and draft PR,
not publication or completion of the phase. Do not alter
unrelated work already present in either checkout.

## Outcome and scope

Build `mathematik-grundschule-4/` in `zam-os/zam-academy`, with its one
`cell.json`, stable source links and a learner-first Discovery Island UI.
The first deliverable is one complete lesson, not an empty world map or
a card-only course. Then expand a reviewed course across the four worlds.

German is the language of the entire learner and parent experience:
navigation, buttons, onboarding, settings, feedback, errors, accessibility
labels, tasks, explanations, teacher speech, captions and transcripts.
Review all copy for children and parents alongside the teaching material.
English design names and prototype labels are internal references, not
shipped interface text. Conversation with Thomas may be in German;
repository documentation and GitHub communication, including reviews,
PR text and release text, remain English. This clarifies the language
preference recorded by Thomas after the plan was created on 2026-10-31.
No terminal, model endpoint, paid service, microphone or separate account is
needed for the normal lesson. Parent access is local on the same device in
this scope; cross-device family accounts are separate work.

Keep colourful art around a calm mathematical workspace. Show one primary
action at each step, untimed practice, large controls, keyboard equivalents,
optional sound and reduced motion. Let children pause and resume. Store
practice locally with honest storage-failure guidance; browser storage is
not a backup or evidence of synchronisation with ZAM.

## Curriculum basis and coverage contract

The official [Fachlehrplan Mathematik 3/4](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik)
combines Grades 3 and 4. It defines four learning areas and thirteen
subareas. The course's sequence is our proposal, not an official division
of those competences between the two grades. A qualified primary-school
teacher reviews the Grade 4 progression and the available foundation path.

The [end-of-Grade-4 profile](https://www.lehrplanplus.bayern.de/jahrgangsstufenprofil/grundschule/4)
sets the broader endpoint, including flexible arithmetic to one million,
practical measurement, spatial reasoning, data and chance. The
[subject profile](https://www.lehrplanplus.bayern.de/fachprofil/grundschule/mathematik)
requires mathematical processes alongside content; explanations, checking
strategies, representations and real problems belong throughout the course.

Create `coverage.json` in Phase 1. Each official competence gets a stable
local key, source URL, section and checked date; each mapping lists lesson
ids, the activity providing evidence, any paper/physical work, reviewer and
status: planned, implemented, reviewed or a documented gap. Enumerate every
competence under the thirteen subareas, not just one row per subarea. A
mapped lesson is not evidence of individual mastery. Never publish “full
curriculum covered” while gaps or unreviewed mappings remain.

Initial authored inventory: **31 core lessons**, plus three mixed
expeditions. Numbers and names may be refined before release; released
lesson ids stay stable. This inventory is a production proposal; the
competence-level matrix is the authority for coverage.

| World / proposed ids | Lesson sequence | Principal alignment |
| --- | --- | --- |
| Number Forest · N01–N03 | Place-value workshop; larger numbers to one million; number-line journeys and comparing | 1.1 |
| Number Forest · N04–N07 | Facts and flexible strategies; mental/recorded addition and subtraction; written addition; written subtraction | 1.2 |
| Number Forest · N08–N11 | Mental multiplication/division; written multiplication; written division; patterns and number relationships | 1.2 |
| Number Forest · N12–N13 | Multi-step story problems; systematic combinations | 1.3 |
| Measure Market · M01–M03 | Measuring lengths; mass/capacity; clocks and durations | 3.1, 3.2 |
| Measure Market · M04–M06 | Money; changing units; estimates and practical problems | 3.1–3.3 |
| Shape Bay · S01–S02 | Routes and plans; cube buildings and views | 2.1 |
| Shape Bay · S03–S04 | Drawing and shape properties; solids and nets | 2.2 |
| Shape Bay · S05–S06 | Reflections; enlarging and reducing | 2.3 |
| Shape Bay · S07–S09 | Tiles and ornaments; comparing surfaces; packing and comparing volumes | 2.2, 2.4, 2.5 |
| Chance Garden · D01–D03 | Collect and display data; investigate tables/charts; chance experiments and comparisons | 4.1, 4.2 |
| Island expeditions · X01–X03 | Equip a workshop; plan a journey; organise an island celebration | Cross-world application and reasoning |

The three data lessons and other long topics can contain several short
missions. Do not force a written procedure into one short session to meet
the inventory count. If review requires splitting a lesson, update the
count and the plan explicitly. Grade 3 support is embedded at need rather
than a separate compulsory catch-up course.

## Existing code and intended boundaries

Useful local references inspected for this plan:

- `mathematik-realschule-9/src/storage/progress.ts`: browser persistence,
  lesson completion and exercise counters. Adapt the ideas; the new lesson
  needs assisted/independent evidence rather than only correct counters.
- `mathematik-realschule-9/src/exercises/` and `src/lab/`: seeded tasks,
  checkers and inspectable interactive representations. Keep the new
  place-value model small; do not copy secondary-school track filters,
  formula panels or every lab kind into the primary-school app.
- `mathematik-realschule-9/src/model/types.ts` and `src/main.ts`:
  `TeacherVideo` currently provides a reference opened externally. The
  first-party player, captions, transcript and media package need new work.
- `scripts/build-catalog.mjs`, `scripts/validate-cells.mjs`, and
  `.github/workflows/{ci,pages}.yml`: catalog/validation and explicit app
  build lists. The Academy root has no npm package; run app commands in
  the app folder and repo scripts at the Academy root.
- In `zam`, `src/cli/curriculum/providers/lehrplanplus-bayern/manifest.ts`
  already contains Grundschule, Grade 4, mathematics and its four areas.
  Adding a new provider or school type is not required.

Use the existing TypeScript/Vite/Vitest/single-file toolchain, with approved
versions and a lockfile. A new app manifest is expected; adding a dependency
not already approved in the repositories requires Thomas's explicit approval.
No animation framework, video SDK, backend or LLM is required by this plan.
Use native HTML video, reviewed SVG/CSS art and browser audio after a gesture.

Suggested app layout:

```text
mathematik-grundschule-4/
  cell.json, coverage.json, media-register.json, README.md
  src/main.ts, styles.css
  src/curriculum/{index,number-forest,measure-market,shape-bay,chance-garden}.ts
  src/math/place-value.ts
  src/practice/{tasks,checker,evidence}.ts
  src/companion/{state,rewards,render}.ts
  src/storage/progress.ts
  src/media/player.ts
  src/ui/{island,lesson,parent-view,settings}.ts
  src/zam/zam-link.ts
  public/media/{place-value-teacher.mp4,place-value-de.vtt,poster.webp}
  tests/ and scripts/
```

These are proposed paths, not files that exist. Keep the cell the only
card source; practice generators are not a second card export. All durable
record ids use ULIDs, while public lesson keys use stable descriptive slugs.
Use the existing card-text import/write boundaries, math speech and image
alt text. No new kernel schema or API is expected for the Academy lesson;
any necessary later change follows the kernel contracts, migration rules
and public exports.

## Phase 1 — a complete place-value lesson

**Deliverable:** One locally runnable and packaged Discovery Island lesson
meeting the [first-lesson specification](../specs/2026-10-31-grade-4-place-value.md),
with original Milo art, actual teacher recording, practice, saved progress,
local parent evidence and its validated learning cell.

Implementation order within this phase:

1. **Content and production setup.** Enumerate the curriculum matrix;
   review the first lesson's goals, examples, task families and German video
   script with the teacher. Thomas/product secures the teacher, permission
   and recording slot. Record review changes and the video production owner.
2. **App and mathematical model.** Create the app using the existing stack.
   Implement an integer place-value model, both exchange directions,
   noncanonical intermediate representations, undo and exact answer checks.
   Build tasks with zeros and varied digit positions from the outset.
3. **Lesson journey.** Implement the two short resumable missions, entry
   support, model/video/written explanations, new exit tasks, hint progression
   and an easy pause. A wrong answer keeps the activity and Milo supportive.
4. **Milo and island.** Produce an original consistent silhouette and the
   six first-lesson states. Connect the workshop change to valid mathematical
   actions. Grant each mission reward exactly once, independently of whether
   a child needed help. Persist completion/reward together; replay earns no
   extra food. Ordinary care is always available. Absence means rest.
5. **Teacher media.** Record, edit and obtain teacher approval for the real
   clip. Add captions, transcript, poster, chapters, rights metadata and
   deliberate playback. Match every representation and term to the lab.
   Missing media is a named incomplete deliverable; a storyboard does not
   close the phase. Continue all independent work while production is pending.
6. **Evidence and recall.** Save first-response outcomes separately from
   helped retries. Parent copy reflects actual local records. Offer a fresh
   later-visit check without claiming a new FSRS scheduler or reading ZAM's
   database. Use the specified transactional browser store for progress and
   rewards. Validate/install/enrol the small cell with the approved core in
   a disposable library, then smoke-test those prepared cards in the existing
   review UI. Live Academy enrolment follows publication in Phase 2.
7. **Package and verify.** Build offline HTML plus local media assets in the
   ZIP, relative media paths and existing-style launchers. Add CI for the app
   and its media verification. Keep publishing-list and public index changes
   for Phase 2 so local completion does not publish accidentally.

**Acceptance — all must pass:**

- A child can start without installation/account setup and complete both
  missions with mouse, touch or keyboard; a drag-only interaction fails.
- All learner- and parent-facing text and accessible labels are German,
  including settings, error states and Milo's messages. English labels from
  the concept prototype do not carry over into the finished tool.
- The first lesson covers all four specified goals, including zero columns
  and exchanges in both directions; a fixed subtraction quiz fails.
- Guided work, new independent attempts and later checks remain distinct.
  Teacher speech is German, correct, captioned and aligned with the activity.
- The real recording plays in the built online preview and the extracted
  offline ZIP on tested devices. The entire lesson works via its illustrated
  text path when playback fails. Viewing duration creates no learning credit.
- Milo responds to a supported correction, offers care before rewards, rests
  during absence, retains decorations and has a visible non-audio equivalent.
- Reload/resume, interrupted save, corrupt/unavailable storage, repeat submit,
  two-tab reward attempts and clock changes do not fabricate learning or
  repeat a reward. Storage failure permits play and clearly reports that
  progress is not being saved. Child progress is not silently discarded.
- The parent view shows actual source/date/help evidence and no invented
  mastery, grade or school-placement prediction. No personal name is required.
- First-lesson cards install, enrol and review in a disposable library;
  every source-link hash opens the pinned lesson in the local build. Live
  public URLs are a post-publication check, not a requirement to weaken
  origin restrictions. No personal library or review history is changed.
- All automated and manual checks below pass. Record the teacher sign-off,
  actual media status, supported devices and remaining limitations.

## Phase 2 — first family pilot and starter release readiness

Try the complete lesson with approximately five families using several
device/input combinations. This is a usability exercise, not an efficacy
study. Check independent starts, comprehensible German, regrouping actions,
video playback, breaks and any distress about Milo. Record observations
with family agreement and without screen/audio capture by default.

Fix observed blockers, add a parent-initiated local backup/restore of the
versioned app state, and test malformed files, browser storage loss and
restoration without duplicate rewards. Show the backup's scope and device
limitations. Keep research sharing separate from backup; no automatic upload.

Prepare the Academy landing-page entry, README, Pages build-list entry,
catalog and accurate starter title/description. Verify all listed media
assets are copied by Pages and included in the offline bundle. Publication
requires a later explicit request. A private/local demo can be reviewed
before any publication; never disable trust/origin checks to serve it.

**Partial-course rule:** Initial atoms have only their Academy curriculum
binding. Record official alignment in `coverage.json` and the source list.
Do not yet add a `lehrplanplus-bayern` grade-specific binding: in current
`zam/src/kernel/library/bundled-cells.ts`, a matching explicit grade can
suppress generic import for the whole curriculum scope. Do not misrepresent
this as a grade-less official binding either. The starter remains available
through the existing Academy list while generic Grade 4 mathematics import
remains available. Add a regression check before any starter bundling.

After authorised publication, the ZAM release step uses
`npm run academy:sync -- --app mathematik-grundschule-4`. Verify fixture/lock
identity, Studio enrolment, click-to-open lesson links and no network fetch
from agent tools. Update covering OKFs through `zam_okf_upsert` and existing
knowledge-map statements only when the actual ZAM behaviour changes.

**Exit:** usability blockers resolved; truthful starter packaging and
publication diff ready; backup tested; catalog/local recall checks pass;
generic curriculum import preserved. Record live publication, public-link
verification and Studio Academy enrolment as separate pending/completed
release checks; implementation readiness does not imply they have happened.

## Phase 3 — Number Forest

Implement N02–N13 using the first lesson's components and the reviewed
prerequisite graph. Introduce the larger number range gradually. Provide
written procedures as stepwise practice, with paper tasks and teacher
demonstrations; do not replace them with multiple-choice facts. Review the
subtraction method and the multiplication/division operand limits against
the curriculum before producing tasks or recordings.

Each lesson gets a relevant reviewed teacher video, equivalent written
explanation, interactive investigation, varied checked tasks, fresh exit
items, local evidence and atomic recall items. A single generic video is
not coverage for unrelated lessons. Existing external videos are usable
only after exact-link/content/age review and recorded distribution choice;
original clips are required where the reviewed material has a gap.

**Exit:** thirteen Number Forest lessons reviewed end to end; Number Forest
competence rows have evidence or explicitly documented remaining gaps;
full-subject curriculum bindings still withheld. Expand Milo's environment
through mathematical achievements using the existing reward contract.

## Phase 4 — Measure Market

Implement M01–M06 with manipulable measuring/purchasing scenes and real-world
activities away from the screen. Task checkers distinguish quantity, unit
and valid conversion; time uses its actual unit relationships. Specify and
test local number formatting and acceptable equivalent answers. Add a
teacher demonstration for each new method, captions, transcript and cell
items using the same terms as the activities.

**Exit:** six reviewed lessons, physical-work instructions and checked
examples; the coverage matrix records practical and digital evidence;
parent observations do not mistake a tapped unit for independent measuring.

## Phase 5 — Shape Bay

Implement S01–S09 with views, building, drawing and transformation tasks.
Use direct manipulation plus keyboard/button alternatives. Combine screen
tasks with paper construction, mirror and physical cube activities. Separate
visual completion from a checked geometric property; inspectability matters
more than elaborate 3D rendering. Do not add a rendering dependency.

**Exit:** nine reviewed lessons; all five geometry subareas mapped to actual
activities; physical-work completion is labelled self-reported where the
app cannot verify it. Every lesson's teaching, video, practice and cards agree.

## Phase 6 — Chance Garden and mixed expeditions

Implement D01–D03 and X01–X03. Use reproducible simulations for tests and
clear distinctions between an observation and what is guaranteed. Give
chart/table tasks independent information checks and let the child create
representations. Expeditions combine concepts in short practical stories
and let the learner choose tools; they do not merely repeat a memorised
worked example or introduce compulsory speed contests.

**Exit:** all 31 core lessons and three expeditions are implemented;
curriculum/reasoning gaps are listed explicitly; every lesson has its
reviewed video route and accessible text equivalent. Simulated rewards
remain deterministic; chance experiments do not become random pet prizes.

## Phase 7 — full-course review, field pilot and curriculum release readiness

Have the primary-school teacher audit the competence-level matrix, video
register, prerequisite paths, written methods and released identities.
Resolve every gap in the agreed annual scope or narrow the advertised
scope explicitly. Check mixed tasks and explanations with fresh examples.

Conduct the proposed 6–8-week feasibility pilot with approximately 30–50
families when partners and capacity are secured. Assess learning with
separate equivalent tasks, an initial check and delayed checks, for example
after one and three weeks. Record the actual intervals, assistance,
dropouts and device barriers. Test willingness to return and the effect of
Milo on family routines. These planning numbers are not a powered efficacy
design, and before/after observations cannot isolate Milo's contribution.

Once full-scope coverage is reviewed, add Grade 4 official bindings using
the existing `lehrplanplus-bayern`, `grundschule`, `mathematik`, `grade: 4`
contract and accurate area codes. Keep existing item/lesson ids and increase
the cell version. Do not infer identity mappings or transfer mastery from
similar wording. Do not automatically enrol learners in every new item.
Verify existing held-cell update semantics and card scope before offering
the extension; surface any need for staged enrolment as an explicit plan
change rather than silently creating a whole-year due queue.

Verify that Academy cell precedence is now appropriate and that the new
bindings cannot suppress import for another subject or grade. Prepare
release diffs and a narrow ZAM sync after authorised Academy publication.
No direct fixture edits. Run cross-repository checks and update current
OKFs/knowledge-map citations where changed behaviour requires it.

Prepare the funding evidence package: a short working demonstration,
teacher credentials/sign-off, truthful coverage matrix, annotated pilot
findings, media-rights inventory and costed next production batch. Describe
observed results and limitations accurately; promises about school placement
and speculative impact percentages are outside the product evidence.

**Exit:** full-course implementation and evidence reviewed; release and
funding materials ready for Thomas's review; any publication, application
or external contact remains a separately authorised action.

## Ownership, dependencies and planning estimates

| Work | Accountable role | Dependency / estimate |
| --- | --- | --- |
| First lesson and engineering checks | Implementing engineer | Roughly 12–18 focused engineering days for Phase 1 |
| Teacher review and first recording | Primary-school teacher, arranged by Thomas/product | Roughly 2–4 production/review days, plus scheduling lead time |
| Milo art, state illustrations and sound | Design/content role; engineer can produce initial code-native art | Included in Phase 1 estimate for a modest original 2D treatment |
| First family usability cycle | Thomas/product and engineer | Roughly 3–5 engineering days plus a week to arrange/observe sessions |
| Remaining lesson production | Teacher/content role and engineer | Re-estimate after Phase 1 from actual per-lesson costs |
| Academy publication and ZAM release | Thomas/release owner | Requires ready artifacts and explicit publication request |

These are working effort ranges, not delivery dates or a hiring commitment.
Video scheduling is a separate critical path. Do not multiply the first
lesson's cost by 31: later lessons reuse infrastructure, while new written
methods and interaction families have their own production cost. After
Phase 2, estimate each remaining phase from the signed-off inventory and
measured throughput, with separate teaching/video/design/engineering costs.

## Verification and completion evidence

For each phase, run the relevant app's `npm run typecheck`, `npm test`,
`npm run build` and `npm run package:zip`. Use meaningful tests for weighted
value invariants, generated-task answers, first-response/help semantics,
content/lesson links, reward idempotency and persistence recovery. Do not
test only that a function returns the same expression it contains.

Add `scripts/verify-release.mjs` to the new app: verify ZIP entries and
exact HTML/media bytes, relative resource paths, caption/chapter targets,
manifest hashes and absence of accidental remote runtime dependencies.
Test extracted offline playback and the no-video fallback on actual pilot
browsers; a ZIP listing or successful build is not playback evidence.

At the Academy root run `node --test scripts/build-catalog.test.mjs`,
`node scripts/build-catalog.mjs <temporary-output>` and
`ZAM_CORE=<file URL of the already installed/built approved zam-core> node scripts/validate-cells.mjs`.
Match the CI-pinned core for release compatibility and document any need to
raise it; a newer local build alone does not prove published compatibility.
Run all app test/build jobs required by Academy CI before a phase commit.
Do not invent root npm scripts or install new test tooling without approval.

When a phase touches `zam`, before its commit run the required
`npm run format`, `npm run lint`, `npm run typecheck`, `npm run test` and
`npm run build`; add desktop/mobile checks for changed surfaces. Verify
`tests/kernel/academy-cells-lock.test.ts` after sync. If knowledge-map
statements change, preserve ids and run
`npm run dev -- knowledge-map validate --repo . --write`.

Manual acceptance covers 320 px through desktop layouts, keyboard/touch,
captions and text alternatives, reduced motion, muted sound, restart/resume,
blocked storage, offline assets, day changes and no surprise rewards.
Keep a dated checklist with actual browser/device versions and teacher
review/media status. Update this Status section only when the phase's
deliverables and acceptance criteria are met.
