# Natur und Technik 5 · Bavarian Mittelschule

A ZAM Academy package for Jahrgangsstufe 5 of the Bavarian Mittelschule, aligned with the [official Natur und Technik 5 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/nt), checked on 14 November 2026. At the Mittelschule, Biology, Chemistry and Physics perspectives are taught together in the combined subject Natur und Technik, so this one package covers all four Lernbereiche; the Academy registers it once as `fach: "nt"` and reaches it through the Biologie, Chemie and Physik paths. Learner text is German and addresses the learner with "du".

| Lernbereich | Lessons | Focus |
| --- | ---: | --- |
| 1 · Naturwissenschaftliches Arbeiten | 5 | Inquiry steps, simple lab equipment and experiment logs, hazard pictograms and lab safety, scientific models vs. reality, tables, diagrams, sources and specialist language |
| 2 · Lebensgrundlage Sonne | 13 | Day and night (Earth rotation), seasons (orbit and tilted axis), solar energy conversion, Celsius scale and thermometer comparison, thermal expansion, conductors and insulators, conduction/convection/radiation, skin structure and UV/skin-type protection, light and shadow, reflection and traffic safety (blind spot), spectral colours, eye imaging and lenses |
| 3 · Mensch und Gesundheit | 9 | Four cooperating organ systems, healthy everyday habits, digestive tract, nutrients and energy, evaluating eating habits, skeleton, S-curved spine, joints/muscles as antagonists, back-friendly posture and sport |
| 4 · Materie, Stoffe und Technik | 5 | Pure substances vs. mixtures in the particle model, states of matter, characteristic substance properties, laboratory separation methods, waste sorting and recycling |

Every lesson has an explanation with a key rule, at least one drawn SVG figure or interactive model (six interactive labs: seasons, thermometer/bimetallic strip, eye & corrective lenses, organ-system torso, arm lever/antagonists, and particle states/mixtures), a quick check with two plausible wrong answers, a workshop (timeline ordering or classification with coloured chips) that is never solved at the start, and two writing tasks: Level 1 with guiding hints, Level 2 as transfer or judgement. A lesson is complete after the quick check, the workshop and the Level 1 self-assessment against a model answer. Writing is not graded automatically and app progress never changes FSRS mastery.

## Scope and evidence

[coverage.json](coverage.json) holds all 41 Kompetenzerwartungen verbatim with their lessons; `scripts/check-curriculum.mjs` finds each one in the stored curriculum page (`tests/fixtures/curriculum.html`, SHA-256 `456b05f9d83b5b7b79e6723ebe892bb63f65890bd807947bd29f52a0a213d9b0`). Twelve rows are `supported` rather than `implemented` because physical school experiments, hands-on measurements with real thermometers/scales/glassware, partner work, or personal daily lifestyle routines cannot take place inside an app; the app prepares, models and reflects them (`coverage.json` documents what remains in class).

All drawings and models are inline SVG without external requests. Source links were opened once and their real page titles read (see [docs/nt-mittelschule-5-coverage.md](../docs/nt-mittelschule-5-coverage.md)); they open only on a user click.

Progress, theme and drafts stay in this browser under `nt_ms5_academy_progress_v1` and `nt_ms5_theme`. No accounts, cookies, analytics, external fonts, embeds or background requests. Teacher videos are not part of this initial version; a separate step adds and checks them.

## Develop and verify

```sh
npm ci
npm run dev           # http://localhost:5243/nt-mittelschule-5/
npx tsc --noEmit
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

`npm run package:zip` creates `release/ZAM-Academy-NT-5-offline.zip` with the self-contained HTML and starters for Windows, macOS and Linux. `validate-cell.mjs` installs the cell twice in a disposable library, enrols every card and checks idempotence and source links; it never touches a personal library.

## Cell contract and publication

`cell.json` is the only card list: 32 atoms, one per lesson, with two cards each (a binary `tier1_fast` check and a concise `tier2_synthesis` recall), 64 cards total and 35 soft prerequisite edges. Every card cites `https://academy.zam-os.org/nt-mittelschule-5/#lesson=<id>`. Atom and item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json` and become a contract on first publication.

`zam-os/zam` holds no Mittelschule (`de-by:mittelschule-*`) cells, so `replaces-de-by.json` is an empty, unapproved proposal (`status: "proposal-only"`, `approved: null`) and `cell.json` declares no `replaces` and no `retired_items`. Related Realschule Grade 5 cells (`de-by:realschule-5-natur-technik-mikroskop-experiment-dateien`, `de-by:realschule-5-biologie-mensch-skelett-bewegung-organe`) are already mapped cleanly in `biologie-realschule-5`; unclaimed Gymnasium Grade 5 cells (`de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop`, `de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie`) remain active at their school type unless Thomas decides otherwise (see [docs/nt-mittelschule-5-coverage.md](../docs/nt-mittelschule-5-coverage.md)).
