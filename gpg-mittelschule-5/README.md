# Geschichte/Politik/Geographie 5 · Bavarian Mittelschule

A ZAM Academy package for Jahrgangsstufe 5 of the Bavarian Mittelschule, aligned with the [official GPG 5 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/gpg), checked on 13 November 2026. At the Mittelschule, history is taught inside the combined subject Geschichte/Politik/Geographie, so this one package covers all four Lernbereiche; the Academy registers it once as `fach: "gpg"` and reaches it through the Geschichte, Politik und Gesellschaft and Geographie paths. Learner text is German and addresses the learner with "du".

| Lernbereich | Lessons | Focus |
| --- | ---: | --- |
| 1 · Lebensraum Erde | 11 | Planets, origin of the Earth, continents and oceans, globe and map, climate zones, map reading, Germany, Bavaria, Bavaria compared with the North Sea coast, energy saving, regional purchasing and waste |
| 2 · Zeit und Wandel | 10 | Timeline (v. Chr./n. Chr.), Old and New Stone Age, the change to farming, the Nile then and now, the Roman Empire, the Limes and Roman remains in Bavaria |
| 3 · Politik und Gesellschaft | 5 | Everyday life in Egypt, the society pyramid, the Athenian assembly, Athens as a first approach to democracy, the Greek legacy |
| 4 · Lebenswelt | 8 | Conflicts, I-messages and mediation, rules, class representative election, class council, family forms and family change, inclusion |

Every lesson has an explanation with a key rule, at least one drawing or map, a quick check with two plausible wrong answers, a workshop (timeline ordering or classification with coloured chips) that is never solved at the start, and two writing tasks: Level 1 with guiding questions, Level 2 as transfer or judgement. A lesson is complete after the quick check, the workshop and the Level 1 self-assessment against a model answer. Writing is not graded automatically and app progress never changes FSRS mastery.

## Scope and evidence

[coverage.json](coverage.json) holds all 15 Kompetenzerwartungen verbatim with their lessons; `scripts/check-curriculum.mjs` finds each one in the stored page (`tests/fixtures/curriculum.html`, SHA-256 in `coverage.json`). Three rows are `supported` rather than `implemented`: checking one's own environmental behaviour (LB 1), applying democratic behaviour in a real election and class council (LB 4) and cooperating respectfully with people with disabilities (LB 4). The app prepares and reflects these; they happen in class and everyday life.

Maps are drawn locally from public-domain Natural Earth data ([src/data/NOTICE.md](src/data/NOTICE.md)); the Roman Empire around 117 AD and the Limes line are simplified sketches and say so. Scenes are drawn in SVG and labelled as simplified. Figures in the text that change over time (family statistics) are not stated: the Level 2 task asks for a dated figure from the Federal Statistical Office. Source links were opened once and their real page titles read (see the [documentation](../docs/gpg-mittelschule-5-coverage.md)); they open only on a click.

Progress, theme and drafts stay in this browser under `gpg_ms5_academy_progress_v1` and `gpg_ms5_theme`. No accounts, analytics, external fonts, embeds or background requests. Teacher videos are not part of this version; a separate step adds and checks them.

## Develop and verify

```sh
npm ci
npm run dev           # http://localhost:5239/gpg-mittelschule-5/
npm test
npm run typecheck
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

`npm run package:zip` creates `release/ZAM-Academy-GPG-5-offline.zip` with the self-contained HTML and starters for Windows, macOS and Linux. `validate-cell.mjs` installs the cell twice in a disposable library, enrols every card and checks idempotence and source links; it never touches a personal library.

`scripts/build-map-data.mjs` is a one-off preparation step for `src/data/maps.json` and needs the Natural Earth files listed in the NOTICE; CI does not run it.

## Cell contract and publication

`cell.json` is the only card list: 34 atoms, one per lesson, with two cards each (a binary fast check and a short recall), 68 cards. Every card cites `https://academy.zam-os.org/gpg-mittelschule-5/#lesson=<id>`. Atom and item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json` and become a contract on first publication.

zam-os/zam holds no Mittelschule GPG cells, so `replaces-de-by.json` is an empty, unapproved proposal and the cell declares no `replaces` and no `retired_items`. Overlapping Realschule and Gymnasium cells stay active; whether any of them belongs to this mapping is a question for Thomas.
