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

1. **Never set `approved` in `replaces-de-by.json` yourself.** Only Thomas
   approves a mapping, explicitly. Record his words, the date and where he
   gave the approval in `source`, as the existing packages do. Until then
   `"approved": null` and `"source": null`; while the cell declares
   `replaces` or `retired_items`, the catalog step of CI stays red on
   purpose. A request such as "build the package" or "publish it" is no
   approval of a history transfer.
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
  for the Realschule usually `wpfg1` (Zweig I) and `wpfg2-3` (Zweig II/III).
  The site answers 403 to some networks and fetch tools; then use the Wayback
  Machine: `https://archive.org/wayback/available?url=lehrplanplus.bayern.de/fachlehrplan/…`
  names a snapshot, `curl -sL --compressed "https://web.archive.org/web/<timestamp>id_/<url>"`
  fetches it. Note the snapshot date.
- Write down every Lernbereich with its hours and every Kompetenzerwartung
  verbatim, per Zweig. Zweige differ in content, not only in depth: in
  Mathematik 10, Zweig I has Abbildungen and Logarithmusfunktionen, Zweig
  II/III has Raumgeometrie and quadratische Funktionen.
- Check the neighbouring grades: build on what was taught before (and say so,
  e.g. "Wiederholung aus M8"), leave out what comes later or belongs to other
  school types, and look at what existing packages already teach.
- Map the competences to lessons in `<app>/coverage.json` (format of
  `bwr-realschule-9/coverage.json`: `curriculum`, `checked`, and per row `lb`,
  `competence`, `lessons`, `evidence`) and test that every competence has a
  lesson and every lesson a competence or an entry in `optional_lessons`.
  Content beyond the curriculum is marked as such and stays small.
- Every lesson names its `tracks` and a `lehrplan` label such as
  `M10 LB 1 (I) · M10 LB 1 (II/III): Trigonometrie`.

## 2. Build on the strongest existing package

Take the app shell (index.html, main.ts, styles, storage, checker, lab
engine) from the closest existing package and keep its documented model:
don't strip comments, don't rename DOM ids the code looks up, replace every
text that names the old grade or subject. Match the reference's depth, not
only its file list; a lesson with one exercise and one trivial goal is a
scaffold, not a lesson.

| Subject | Reference | Take from it |
| --- | --- | --- |
| Mathematik | `mathematik-realschule-9` | labs with draggable handles, exercise generators on two levels, the full test suite |
| Physik, Chemie, Biologie | `physik-realschule-10`, `chemie-realschule-9`, `biologie-realschule-10` | models, both Zweige, migration validation |
| Geschichte, Geographie | `geschichte-realschule-9`, `geographie-realschule-9` | source and map workshops, coverage matrix |
| Wirtschaft | `bwr-realschule-9` | coverage.json, case workshops, migration validation |
| Informatik | `sql`, `algorithmen`, `datennetze` | bilingual apps, local workshops |

Port the reference's test suite with the package: lesson metadata and pinned
ids, the tests of the interactive parts and the exercise generators, the cell
tests and the mapping tests. For Mathematik that means the suite of
`mathematik-realschule-9`: finite readouts on the whole slider grid, a
witness per lab goal, no goal reached at the start, handles that follow the
pointer, and 80 generated tasks per level and lesson that accept the rounded
answer typed with decimal comma or point.

## 3. Lesson standard

Every lesson has

- an explanation that is correct and complete for its competence, in school
  language, with a worked example (`<div class="example">`) and the key rule
  (`<div class="merke">`);
- the formulas or key terms for the Formelsammlung, where the subject has
  them;
- a quick check with three or four plausible options and an explanation of
  the right one;
- an interactive part (lab, model, workshop) that shows what the lesson is
  about and gives learners goals they can reach, none of them reached at the
  start, each proven reachable by a test (Mathematik: **exactly three goals**
  per lab, `requiredCorrect: 3`);
- tasks that make learners use the knowledge. Where tasks are generated, a
  lesson has at least two generators: **Level 1** is guided (values and a
  hint), **Level 2** is a transfer task in the style of the Abschlussprüfung,
  and the level must change the task. Values are plausible (triangles exist,
  probabilities lie in [0; 1]), rounding never flips a yes/no answer, and
  typical mistakes get a targeted hint;
- where the subject uses them, a verified teacher video (section 4).

Learner text is German: "du", the terms of the LehrplanPLUS, the decimal
comma (`fmt()`), the real minus sign "−" (U+2212), "·" for multiplication,
a space before units. No hype, no filler.

## 4. Teacher videos

Mathematik links one German explainer video per lesson; other subjects may
link videos where they help. Each video must really teach the lesson's topic
at the learners' level (Mathe by Daniel Jung, Lehrerschmidt, MathemaTrick,
simpleclub, …). Check each candidate:

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
  `academy.json` with the atoms), two to four cards per atom.
- Atom and item ids are real ULIDs, generated once and then kept; never
  hand-made patterns or renumbering (zam-core: the id "is the one string
  that must not be improvised"). Older cells such as
  `mathematik-realschule-9` keep the ids they were published with.
- Cards ask lasting knowledge: a short question and a short, exact answer.
  Tier 1 has a binary `fast_check` with `correct_index: 0` and exactly two
  curated `choice_distractors`, each with a `reason` that names the
  misconception. Tier 2 has a `sample_solution`. Formulas as
  `question_segments` / `concept_segments` with TeX and German `speech`. "−"
  in every text.
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
- Keep byte-exact snapshots of the old cells in `<app>/tests/fixtures/`, list
  them with their SHA-256 in `sources` together with `source_repository` and
  `source_commit`, and add `<app>/scripts/validate-migration.mjs` with its CI
  step (as in `bwr-realschule-9`): histories move unchanged, old ids leave
  active reviews, repeated installs change nothing, and a learner holding
  cards on both ids makes the install refuse an automatic merge.
- Ship the approved `replaces` with the cell's first publication. Adding them
  in a later version is risky: by then learners may hold cards on both ids,
  and zam-core refuses the whole install.
- Until Thomas approves, `approved` stays `null` (hard rule 1).

## 7. Integration

- Branch from the current `main`, and merge `main` again before opening or
  updating the PR; a PR with conflicts gets no CI at all.
- Register the package in `academy.json` (`pakete`: app, Fach, grade, school,
  Zweige, lesson and card counts), add it to the CI matrix and the Pages
  list, add the README row and a dev port, keep the `zam-home-link` back to
  `https://academy.zam-os.org/`, and make `npm run package:zip` work.
- Document the curriculum check and the card mapping in `docs/` (see
  `docs/bwr-bestandsabgleich.md`, `docs/physik-10-coverage.md`).

## 8. Definition of done

In the package:

```bash
npm ci && npx tsc --noEmit && npm test && npm run build && npm run package:zip
```

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
above (commands with their results, the video table), open gaps, and, when
cards are replaced, the A/B/C summary Thomas is asked to approve. Before the
merge, a second agent reviews the PR against this file.
