# ZAM Academy: Heimat- und Sachunterricht 4 (Lottas Bayern-Forscherbuch)

German learner and parent UI for Bavarian Grade 4 *Heimat- und Sachunterricht*
(HSU 3/4, LehrplanPLUS Bayern). Twenty selectable *Forscher-Stationen* across
all six *Lernbereiche* accompany learners and parents preparing for Grade 4
*Proben* and the Bavarian transition year (*Übertrittsjahr*), guided by the
Eurasian lynx **Lotta**.

## Single-pass station flow → ZAM continuation

Each station is designed to be experienced **once** in Academy to build vivid
conceptual understanding, and then handed off to **ZAM** for long-term spaced
repetition and AI-varied recall practice:

1. **Entdecken mit Lotta**: child-friendly explanation in *"du"* address with a
   concrete everyday or Bavarian case, *Lottas Merksatz*, and three to four
   *Proben-Wissen* study terms.
2. **Schlaufuchs-Check**: three-option comprehension check with immediate
   feedback.
3. **Mitmach-Labor**: bespoke interactive SVG experiment or exploration model
   per station (communal budget & election booth, supermarket shelf zones, eye
   pupil & retina projection, bicycle check & dead-angle mirror, circuit &
   conductor tester, fire triangle, water cycle, topographic contour & scale
   workshop, Bavarian Regierungsbezirke compass, lever & arch bridge lab, etc.)
   with three reachable discovery goals (none pre-satisfied at initial slider
   settings).
4. **Proben-Training (1× Stufe 1 + 1× Stufe 2)**:
   - *Stufe 1 – Spürnase*: guided recall/application task with targeted mistake
     hints.
   - *Stufe 2 – Proben-Profi*: transfer and reasoning task (*begründen*,
     *vergleichen*, *bewerten*) in the style of Bavarian Grade 4 *HSU-Proben*.
5. **Forscher-Stempel & ZAM handoff**: unlocking the station's stamp surfaces
   the handoff callout pointing learners to continue spaced-repetition review
   in ZAM (`zam-academy:hsu-grundschule-4`), where each card links back to
   `https://academy.zam-os.org/hsu-grundschule-4/#lesson=<id>`.

Supporting views:

- **Mein Forscherbuch (`#view=stempel`)**: collectible grid of all twenty
  station stamps.
- **Forscher-Lexikon (`#view=lexikon`)**: searchable glossary of all station
  terms plus six compact reference tables (*Notruf 112 – Die 5 W-Fragen*,
  *Der Eierstempel-Code*, *Verbrennungsdreieck & Löschregeln*,
  *Bayerns 7 Regierungsbezirke & Sitze*, *Die 8 Punkte beim Linksabbiegen*,
  *Maßstab schnell umrechnen*).
- **Eltern-Kompass (`#view=eltern`)**: transparent overview for parents on how
  Grade 4 *HSU-Proben* combine factual knowledge with transfer tasks, how
  Academy and ZAM fit together, calm-mode (*Ruhe-Modus*) and 3-state appearance
  controls (`System-Einstellung` / `Hell` / `Dunkel`), dated local attempt log, and a
  confirmed local reset (`<dialog closedby="any">`).

## Status

Public preview (`publication.json` status `"preview"`, Thomas's decision of
2026-11-04): on GitHub Pages, in the atlas and in the catalog, with a visible
notice while content review is open. Its ids are a contract from now on. No teacher videos are included (`AGENTS.md` Section 4:
new packages ship without external video links). Progress uses browser
`localStorage` (`zam-hsu-gs4-v1`) only, with zero network requests and zero
extra runtime dependencies.

See [curriculum check and concept](../docs/hsu-4-curriculum-and-concept.md) and
[`coverage.json`](coverage.json).

## Run and verify

```sh
npm ci
npm run dev          # http://127.0.0.1:5218/
npm run typecheck
npm test
npm run build
npm run package:zip
npm run verify:release
```

With `zam-core` (pinned version in `.github/workflows/ci.yml`):

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js npm run validate:cell
```

At the repository root:

```sh
node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cells.mjs
```

## ZAM cell and curriculum coverage

- Cell id: `zam-academy:hsu-grundschule-4` (`cell.json` is the sole source of
  card text: 20 atoms, 61 German cards — 41 Tier-1 binary fast-check cards and
  20 Tier-2 open synthesis cards with sample solutions and two curated choice
  distractors per card).
- Official `lehrplanplus-bayern` grade curriculum bindings are intentionally
  deferred on the draft cell (`curricula` binds only `zam-academy-stage` `lb1`
  through `lb6`), matching `mathematik-grundschule-4` so Grade 4 scope handling
  in ZAM is coordinated deliberately at publication time.
- No legacy `de-by` HSU Grade 4 cells exist in ZAM, so `replaces` and
  `retired_items` are not needed.
- `coverage.json` maps all 75 verbatim *Kompetenzerwartungen* across the 15
  *Teilbereiche* of `HSU 3/4` to the 20 stations, explicitly noting classroom,
  hands-on, and excursion dimensions that complement screen-based preparation.
