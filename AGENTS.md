# Agent instructions for ZAM Academy

Rules for **all** coding agents working in this repo (Codex,
Antigravity/Gemini, Claude Code, Copilot, …). They are the **package
standard**: what a learning package must be before its pull request is
opened, and what a reviewer checks it against. [README.md](README.md) explains
how an app and its ZAM cell fit together
([ADR 2026-10-19](https://github.com/zam-os/zam/blob/main/docs/adr/2026-10-19-zam-academy-cells.md)
in zam-os/zam); if this file and the README disagree, the README wins and this
file gets fixed.

Every package has real learners, for example pupils preparing for the
Abschlussprüfung. Wrong, off-curriculum or broken content costs them. "It
builds and the tests pass" is not the bar.

## Hard rules

1. **Never approve a mapping yourself.** Only Thomas approves the card
   mapping in `replaces-de-by.json`, explicitly. The catalog gate
   (`scripts/mapping-approval.mjs`) reads only `approved`: an ISO date
   `YYYY-MM-DD` publishes, `null` blocks. After his approval set `approved`
   to its date and put his words and where he gave them into `source` (the
   gate does not read `source`; it is the record for people). Until then
   `"approved": null`, and while the cell declares `replaces` or
   `retired_items` the catalog step of CI stays red on purpose. A request such
   as "build the package" or "publish it" is no approval of a history
   transfer.
2. **Claim only what you checked, and show how.** Every claim in a PR
   description (test counts, "videos verified", "covers LB 1–5") names the
   command or check behind it. Never write "100 %".
3. **Open the built app in a browser before you say it works.** Unit tests do
   not render the app; a PR once shipped a blank page with 13 green tests.
4. **Follow the official curriculum, not memory.** Read the current
   LehrplanPLUS Fachlehrplan of the grade for every Zweig (section 1) and
   build the lessons from its Kompetenzerwartungen.
5. **Cards live only in `<app>/cell.json`.** No card lists, exports or
   generator scripts that hold card text anywhere else.
6. **Published identifiers are contracts.** After a cell's first publication
   its lesson ids, item ids and slugs never change; changes use `replaces`
   and raise the version.
7. **No third-party requests, no new dependencies.** Progress stays in
   `localStorage`; teacher videos are plain links, never embeds. New npm
   dependencies need Thomas's approval.
8. **Stay in your package.** Besides the package folder, a new package may
   touch `academy.json`, `.github/workflows/ci.yml`,
   `.github/workflows/pages.yml`, `README.md` and `docs/`. Changes to other
   packages go into their own PR.

## 1. Start from the curriculum

- Source: `https://www.lehrplanplus.bayern.de/fachlehrplan/<schulart>/<jgs>/<fach>[/<wpfg>]`,
  for the Realschule usually `wpfg1` (Zweig I) and `wpfg2-3` (Zweig II/III);
  some subjects have one Fachlehrplan for all Zweige. The site answers 403 to
  some networks and fetch tools; then use the Wayback Machine:
  `https://archive.org/wayback/available?url=lehrplanplus.bayern.de/fachlehrplan/…`
  names a snapshot, `curl -sL --compressed "https://web.archive.org/web/<timestamp>id_/<url>"`
  fetches it. Note the snapshot date.
- Write down every Lernbereich with its hours and every Kompetenzerwartung
  verbatim, per Zweig. Zweige can differ in content, not only in depth: in
  Mathematik 10, Zweig I has Abbildungen and Logarithmusfunktionen, Zweig
  II/III has Raumgeometrie and quadratische Funktionen.
- Check the neighbouring grades: build on what was taught before (and say so,
  e.g. "Wiederholung aus M8"), leave out what comes later or belongs to other
  school types, and look at what existing packages already teach.
- Map the competences to lessons in `<app>/coverage.json` and test the
  mapping: every competence has a lesson, every lesson a competence or an
  entry in `optional_lessons`. A new file uses the form of
  `bwr-realschule-9/coverage.json` (`curriculum`, `checked`, and per row `lb`,
  `competence`, `lessons`, `evidence`); a package with several Zweige adds
  `track` to every row, because LB numbers differ between the Zweige. Existing
  matrices keep their own schema and tests (Geographie `areas`, Biologie,
  Algorithmen and Datennetze `competencies`). Content beyond the curriculum
  is marked as such and stays small.
- Where a package has Zweige, every lesson names its `tracks` and a
  `lehrplan` label such as `M10 LB 1 (I) · M10 LB 1 (II/III): Trigonometrie`.

## 2. Build on the strongest existing package

Take the app shell (index.html, main.ts, styles, storage, checker, engine)
from the closest existing package and keep its documented model: don't strip
comments, don't rename DOM ids the code looks up, replace every text that
names the old grade or subject. Match the reference's depth, not only its
file list; a lesson with one exercise and one trivial goal is a scaffold, not
a lesson.

| Subject | Reference | Take from it |
| --- | --- | --- |
| Mathematik | `mathematik-realschule-9` | HTML lesson shell, labs with draggable handles, exercise generators on two levels, the full test suite |
| Physik, Chemie | `physik-realschule-10`, `chemie-realschule-9` | models, lessons per Zweig, migration validation |
| Biologie | `biologie-realschule-10` | one shared learning path (no Zweige), migration validation |
| Geschichte | `geschichte-realschule-9` | source workshop, migration validation |
| Geographie | `geographie-realschule-9` | map workshop, coverage matrix (own schema) |
| Wirtschaft | `bwr-realschule-9` | coverage.json, case workshops, migration validation |
| Informatik | `sql`, `algorithmen`, `datennetze` | bilingual apps (DE/EN), local workshops |

There are two lesson shells. The **HTML shell** (`mathematik-realschule-9`,
`physik-realschule-9`) renders `explanationHtml`, a quiz with `options` and
labs. The **JSON shell** (`physik-realschule-10`, `bwr-realschule-9`,
`biologie-realschule-10`) escapes its `paragraphs`, so they hold plain text,
never HTML, and shows the key rule as `takeaway`; its quiz is an `answer`
with exactly two `wrong` answers. `chemie-realschule-9` keeps the rule in
`rule` and asks its quick check with two options. Write lessons in the form of
the shell you copied.

Port the reference's test suite with the package: lesson metadata and pinned
ids, the tests of the interactive parts and the exercise generators, the cell
tests and the mapping tests. For Mathematik that is the suite of
`mathematik-realschule-9`: finite readouts on a sampled slider grid (9, 6, 4
or 3 points per slider, 400 seeded settings from seven sliders on), a witness
per lab goal, no goal reached at the start, handles that follow the pointer,
and 80 generated tasks per level and lesson that accept the rounded answer
typed with decimal comma or point.

## 3. Lesson standard

Every lesson has

- an explanation that is correct and complete for its competence, in school
  language, with a worked example and the key rule (HTML shell:
  `<div class="example">` and `<div class="merke">`; JSON shell: plain
  `paragraphs` and the `takeaway`);
- the formulas or key terms for the Formelsammlung, where the subject has
  them;
- a quick check with plausible wrong answers and an explanation of the right
  one, in the form of the shell (Mathematik: at least three `options`);
- an interactive part (lab, model, workshop) that shows what the lesson is
  about and gives learners goals they can reach, none reached at the start,
  each proven reachable by a test (Mathematik: exactly three goals per lab);
- tasks that make learners use the knowledge. Where tasks are generated, a
  lesson has at least two generators: **Level 1** is guided (values and a
  hint), **Level 2** is a transfer task in the style of the Abschlussprüfung,
  and the level must change the task. A lesson is complete after
  `requiredCorrect` right tasks per level (Mathematik: 3), separately from its
  lab goals. Values are plausible (triangles exist, probabilities lie in
  [0; 1]), rounding never flips a yes/no answer, and typical mistakes get a
  targeted hint.

Each stage (one per Lernbereich) gets its own accent colour instead of one
palette for the whole package.

German learner text uses "du", the terms of the LehrplanPLUS, the decimal
comma (`fmt()`), the real minus sign "−" (U+2212), "·" for multiplication and
a space before units. Bilingual apps keep their other language versions; each
follows the conventions of its language, and their tests
(`algorithmen/tests/i18n.test.ts`, `datennetze/tests/i18n.test.ts`) stay
green. No hype, no filler.

## 4. Teacher videos

Videos are plain links to German explainers (`teacherVideo` in
`mathematik-realschule-9`). Authors of a new package add none: a separate
step adds and checks them afterwards (Thomas's decision of 2026-10-22).
Whoever adds a video makes sure it really teaches the lesson's topic at the
learners' level (Mathe by Daniel Jung, Lehrerschmidt, MathemaTrick,
simpleclub, …) and checks each candidate:

```bash
curl -s "https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=<id>&format=json"
```

It returns the real title and channel. Use only videos whose real title
matches the lesson, store `{ url, title, author }` with that title, pin the
ids in the tests, and list lesson → id → real title in the PR. A pinned id is
worth something only after this check. To find candidates:
`curl -s -A "Mozilla/5.0" "https://www.youtube.com/results?search_query=<query>" | grep -o '"videoId":"[^"]*"' | sort -u`.

## 5. The ZAM cell

- One atom per lesson (the registry test compares `lessons` in
  `academy.json` with the atoms, UML excepted), usually two to four cards per
  atom; more where the lesson's competences or a B row need them
  (`mathematik-realschule-9` has atoms with up to seven).
- Atom and item ids of a new cell are real ULIDs, generated once and then
  kept; no hand-made patterns, no renumbering (zam-core: the id "is the one
  string that must not be improvised"). Published cells such as
  `mathematik-realschule-9` keep the ids they were published with.
- Cards ask lasting knowledge: a short question and a short, exact answer.
  Tier 1 has a binary `fast_check` (`options` of length 2, `correct_index: 0`),
  tier 2 a `sample_solution`. Curated `choice_distractors` are optional; if a
  card has them, it has exactly two, each with a `reason` that names the
  misconception, and neither may differ from the answer only by a sign or an
  operator: zam-core's `checkCandidate` drops those as `equals_answer`, so
  such variants belong in `fast_check` only. The Mathematik 9 suite expects
  distractors on every card, tier 2 included. Formulas as
  `question_segments` / `concept_segments` with TeX and German `speech`.
- `prerequisites` link the atoms a card builds on; `curricula` bind each atom
  to its stage and to the Lernbereich of every Zweig it serves.
- Every card cites its lesson: `https://academy.zam-os.org/<app>/#lesson=<id>`.
- Validate with the published zam-core pinned in CI (it installs the cell and
  runs zam-core's distractor checks):
  `ZAM_CORE=<file URL of zam-core's dist/index.js> node scripts/validate-cells.mjs`.

## 6. Existing ZAM cards: `replaces-de-by.json`

ZAM may already hold cards on the topic: `de-by:…` cells in zam-os/zam
(`tests/fixtures/curriculum/`, `src/kernel/library/bundled-cells.ts`).
Learners have review histories on them.

- Map **every** old item, with a reason per row:
  **A** same atomic retrieval: one successor declares `replaces`.
  **B** the whole old multi-part prompt, with its whole answer and sample
  solution, kept on one dedicated successor.
  **C** split, corrected or uncertain: no `replaces`; retire it with
  `retired_items` if it should leave active reviews.
  Never spread one history over several cards.
- Keep byte-exact snapshots of the old cells in `<app>/tests/fixtures/` (the
  repo stores LF; hash the LF bytes), list them with their SHA-256 in
  `sources` together with `source_repository` and `source_commit`, and add
  `<app>/scripts/validate-migration.mjs` with its CI step (as in
  `bwr-realschule-9`): histories move unchanged, old ids leave active
  reviews, repeated installs change nothing, and a learner holding cards on
  both ids makes the install refuse an automatic merge.
- By default (Thomas's decision of 2026-10-22) a new cell ships first
  without `replaces` and `retired_items`; it then needs no approval, and the
  mapping stays a proposal (`"status": "proposal-only"`) until the approved
  version follows. Keep that gap short and close it before ZAM bundles the
  cell: a learner who meanwhile holds cards on both an old id and its
  successor makes zam-core refuse the whole install of the later version.
  For a package where Thomas approves the mapping before the merge (as for
  Mathematik 10), the `replaces` ship with the first publication.
- ZAM bundles a cell with `npm run academy:sync` in zam-os/zam, which reads
  the published `https://academy.zam-os.org/catalog.json`; the ZAM pull
  request therefore follows the published Academy cell. ZAM's Realschule
  groups are I, II, IIIa and IIIb; a cell track `II_III` reaches II, IIIa and
  IIIb.

## 7. Integration

- Branch from the current `main`, and merge `main` again before opening or
  updating the PR; a PR with conflicts gets no CI at all.
- Register a published package in `academy.json` (`pakete`: app, Fach, grade, school,
  Zweige, lesson and card counts), add it to the CI matrix and the Pages
  list, add the README row and a dev port, keep the `zam-home-link` back to
  `https://academy.zam-os.org/`, and make `npm run package:zip` work.
- A local draft with `publication.json` status `local-only` stays out of the
  public catalog, atlas registry and Pages list. CI still validates its cell.
  Changing the marker to `ready` does not replace release authority or the
  normal registration checks. Shared publication tooling belongs in its own
  PR rather than a new-package PR.
- Document the curriculum check and the card mapping in `docs/` (see
  `docs/bwr-bestandsabgleich.md`, `docs/physik-10-coverage.md`).

## 8. Definition of done

In the package:

```bash
npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip
```

`npm run build` runs `tsc` over the tests too, so tests must not import
`node:*` modules unless the package has `@types/node`.

At the repo root, with zam-core installed at the version CI pins
(`ZAM_CORE_VERSION` in `.github/workflows/ci.yml`) into a scratch folder
outside the repo (`npm init -y && npm i zam-core@<version>`), and
`<file URL>` = `file:///<scratch folder>/node_modules/zam-core/dist/index.js`:

```bash
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=<file URL> node scripts/validate-cells.mjs
ZAM_CORE=<file URL> node <app>/scripts/validate-migration.mjs   # when cards are replaced
```

Then open the built `dist/index.html` in a browser; headless Chrome is
enough:

```bash
chrome --headless=new --window-size=1280,2600 --screenshot=<png> "file:///<path>/dist/index.html#lesson=<id>"
```

Look at every lesson and every view: the learning path, each lesson with its
interactive part at the start, an exercise on both levels, reference views
such as the Formelsammlung, in light and dark theme.

The PR description states what the package covers per Zweig, the evidence
above (commands with their results; for added videos the table lesson → id →
real title), open gaps, and, when cards are replaced, the A/B/C summary
Thomas is asked to approve. Before the merge, a second agent reviews the PR
against this file.
