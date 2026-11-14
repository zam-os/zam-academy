# Biologie 5 · Bavarian Gymnasium

A ZAM Academy package for Jahrgangsstufe 5 of the Bavarian Gymnasium. At the Gymnasium, Biology in Grade 5 is not a separate subject: it is **Lernbereich 2 "Schwerpunkt Biologie"** (ca. 42 hours) of the subject *Natur und Technik*. This package follows that part of the [official Fachlehrplan Natur und Technik 5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/nt_gym), fetched on 14 November 2026. Lernbereich 1 "Schwerpunkt Naturwissenschaftliches Arbeiten" (propaedeutic chemistry, physics and geography, ca. 42 hours) is out of scope. Grade 5 has one Fachlehrplan for all Ausbildungsrichtungen, so no lesson carries a track. Learner text is German and addresses the learner with "du".

| Station | Lehrplan | Lessons | Focus |
| --- | --- | ---: | --- |
| 1 · Forschen wie in der Biologie | NT5 2.1 | 10 | Erkenntnisweg and fair experiments, lab and field techniques, error sources, starch/fat/CO₂ tests, light microscope, wet mounts and biological drawings, models, protocols/tables/diagrams, sources and technical language, how knowledge changes (Redi, Harvey, Hooke) |
| 2 · Lebewesen & Zellen | NT5 2.2 | 3 | Characteristics of living things, animal and plant cells, tissues and levels of organisation |
| 3 · Sinne & Reaktion | NT5 2.3 | 4 | Sense organs, stimulus-response chain, reaction time and alcohol in traffic, protecting ears and eyes |
| 4 · Skelett & Bewegung | NT5 2.3 | 4 | Skeleton, joints, antagonistic muscles, keeping the locomotor system healthy |
| 5 · Ernährung, Atmung & Kreislauf | NT5 2.3 | 11 | Energy demand, cellular respiration, nutrients and energy content, balanced diet, digestion, surface enlargement, gas exchange, circulation, pulse and breathing, heart health, smoking |
| 6 · Pubertät & Fortpflanzung | NT5 2.3 | 4 | Reproductive organs, simplified cycle (no hormones) and fertilisation, puberty and hygiene, body autonomy and prevention of abuse |
| 7 · Blüten & Samenpflanzen | NT5 2.4 | 5 | Flower structure, flower diagrams, pollination and fertilisation, wind vs. animal pollination, plant families |
| 8 · Ökosystem Grünland | NT5 2.5 | 3 | Identification key, habitat and community with field measurements, intensive vs. extensive management |

Each station has its own accent colour. Every lesson has an explanation with a key rule, at least one drawn SVG figure (61 figures) or one of **14 interactive models** (fair experiment, detection tests, microscope, cell, ruler reaction test, arm model, food energy, clay cube surface, pulse and breathing, simplified cycle, flower dissection, flower diagram, dichotomous key, meadow management), a quick check with two plausible wrong answers, a workshop (ordering or classification) that is never solved at the start, and two writing tasks: Level 1 with guiding questions, Level 2 as transfer or judgement. Each model has three exploration goals, none reached at the start; once reached, a goal stays reached. A lesson is complete after the quick check, the workshop and the Level 1 self-assessment against a model answer. Writing is not graded automatically and app progress never changes FSRS mastery.

Physiological numbers in the models (pulse, breathing) and the meadow indices are labelled example or model values; physical formulas (ruler fall time t = √(2s/g), cube surface 96 · n cm², 17/37 kJ per gram) are exact and tested.

## Scope and evidence

[coverage.json](coverage.json) holds all 47 Kompetenzerwartungen of Lernbereich 2 verbatim with their lessons; `scripts/check-curriculum.mjs` finds each one in the stored page (`tests/fixtures/curriculum.html`, SHA-256 `c22960dc12b56f17929c58fdc7a1519583ae6869cb1d3ffe442067522bb58d58`). The official page prints an editing marker `[/decision]` inside one competence (simple slides); it is copied verbatim. 17 rows are `supported` rather than `implemented` because real microscoping, dissecting flowers, collecting and identifying plants outdoors, field measurements, hand-drawn sketches, building physical models, changing one's own habits, and prevention work led by trained staff cannot happen in an app; each such row says in `in_class` what stays in class.

Content that later grades teach is left out on purpose: hormonal regulation of the cycle, placenta and pregnancy (Biologie 8), seed structure, germination, organ functions of plants and photosynthesis (NT6). A test checks that these terms do not appear.

All drawings and models are inline SVG without external requests. Source links were opened once and their real page titles read (see [docs/biologie-gymnasium-5-coverage.md](../docs/biologie-gymnasium-5-coverage.md)); they open only on a user click.

Progress, theme and drafts stay in this browser under `biologie_gy5_academy_progress_v1` and `biologie_gy5_theme`. No accounts, cookies, analytics, external fonts, embeds or background requests. Teacher videos are not part of this initial version; a separate step adds and checks them.

## Develop and verify

```sh
npm ci
npm run dev           # http://localhost:5246/biologie-gymnasium-5/
npx tsc --noEmit
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
ZAM_CORE=file:///absolute/path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

`npm run package:zip` creates `release/ZAM-Academy-Biologie-5-Gymnasium-offline.zip` with the self-contained HTML and starters for Windows, macOS and Linux. `validate-cell.mjs` installs the cell twice in a disposable library, enrols every card and checks idempotence and source links; it never touches a personal library.

## Cell contract and publication

`cell.json` is the only card list: 44 atoms, one per lesson, with two cards each (a binary `tier1_fast` check taken from the lesson's quick check and a concise `tier2_synthesis` recall), 88 cards and 50 soft prerequisite edges. Every card cites `https://academy.zam-os.org/biologie-gymnasium-5/#lesson=<id>`. Atom and item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json` and become a contract on first publication.

`zam-os/zam` holds three unclaimed Gymnasium Grade 5 cells (`de-by:gymnasium-5-biologie-mensch-skelett-sexualbiologie`, `de-by:gymnasium-5-biologie-pflanzen-bluetenbau-samen`, `de-by:gymnasium-5-natur-technik-mikroskop-experiment-oop`, 24 items). [replaces-de-by.json](replaces-de-by.json) maps every item as an unapproved proposal (`status: "proposal-only"`, `approved: null`): 4 A, 0 B, 20 C (19 keep active, 1 proposed retirement). Byte-exact snapshots with SHA-256 are in `tests/fixtures/`. `cell.json` declares no `replaces` and no `retired_items` until Thomas approves the mapping; see [docs/biologie-gymnasium-5-coverage.md](../docs/biologie-gymnasium-5-coverage.md).
