# Biologie 6 · Bavarian Gymnasium

A ZAM Academy package for Jahrgangsstufe 6 of the Bavarian Gymnasium. At the Gymnasium, Biology in Grade 6 is taught inside *Natur und Technik*: it is **Lernbereich 1 "Schwerpunkt Biologie"** (ca. 56 hours). This package follows that part of the [official Fachlehrplan Natur und Technik 6](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/nt_gym), fetched on 16 November 2026. Lernbereich 2 "Schwerpunkt Informatik" (ca. 28 hours) is covered by [`informatik-gymnasium-6`](../informatik-gymnasium-6/). Grade 6 has one Fachlehrplan for all Ausbildungsrichtungen, so no lesson carries a track. Learner text is German and addresses the learner with "du".

| Station | Lehrplan | Lessons | Focus |
| --- | --- | ---: | --- |
| 1 · Forschen wie in der Biologie | NT6 1.1 | 9 | Planning the Erkenntnisweg, variable, constants and control, error sources, observing and protocols, microscope and binocular, cutting and staining slides, models, bar and line charts with je-desto sentences, sources and descriptive vs. evaluative statements |
| 2 · Samen, Früchte & Keimung | NT6 1.2 | 5 | Seed and fruit, dispersal strategies, bionics with plants, runners and asexual reproduction, germination experiments |
| 3 · Photosynthese & Pflanzenbewegung | NT6 1.2 | 6 | Root, shoot and leaf, photosynthesis in a simplified particle model, photosynthesis and cellular respiration, importance of photosynthesis, plant reactions, phototropism compared with a human stimulus-response chain |
| 4 · Schwimmen, Fliegen, Laufen | NT6 1.3 | 4 | Fish, birds, foot postures and habitats, bionics with vertebrates |
| 5 · Nahrung, Wärme & Atmung | NT6 1.3 | 5 | Dentitions, beaks, cold- and warm-blooded animals, overwintering, breathing organs |
| 6 · Fortpflanzung & Entwicklung | NT6 1.3 | 5 | Reproduction in water and on land, frog metamorphosis, bird egg and altricial/precocial young, parental investment, signals between conspecifics |
| 7 · Sinne der Wirbeltiere | NT6 1.3 | 2 | Echolocation, lateral line, pit organ; senses matched to habitat and way of life |
| 8 · Verwandtschaft & Evolution | NT6 1.4 | 4 | Five vertebrate classes and a dichotomous key, simplified evolution model, breeding vs. evolution, keeping pets and farm animals |
| 9 · Ökosystem Gewässer | NT6 1.5 | 4 | Measuring abiotic factors, pond zones and identification, food web and ecosystem, threats and protection |

Each station has its own accent colour. Every lesson has an explanation with a key rule, at least one drawn SVG figure (59 figures) or one of **12 interactive models** (fair experiment, light microscope, seed dispersal, germination, waterweed bubbles, phototropism, body shape and water resistance, lizard and mouse temperature, frog metamorphosis, echolocation, vertebrate key, pond food web), a quick check with two plausible wrong answers, a workshop (ordering or classification) that is never solved at the start, and two writing tasks: Level 1 with guiding questions, Level 2 as transfer or judgement. Each model has three exploration goals, none reached at the start; once reached, a goal stays reached. A lesson is complete after the quick check, the workshop and the Level 1 self-assessment against a model answer. Writing is not graded automatically and app progress never changes FSRS mastery.

Model numbers (bubbles per minute, water resistance, food demand) are labelled as model values. Echo times use 340 m/s and are tested; egg numbers (cod, common frog, blackbird) and the marmot's hibernation temperature come from the cited Wikipedia pages. The particle model of photosynthesis balances 6 C, 12 H and 18 O on both sides, which a test checks.

## Scope and evidence

[coverage.json](coverage.json) holds all 45 Kompetenzerwartungen of Lernbereich 1 verbatim with their lessons; `scripts/check-curriculum.mjs` finds each one in the stored page (`tests/fixtures/curriculum.html`, SHA-256 `90af78646f82002c9adadeaff133b45196de5e279a79ee06c168b2b70aeccea4`, the same bytes `informatik-gymnasium-6` stores). The official page prints the editing marker `[/decision]` twice inside the competence on Stoff- und Energiemanagement; it is copied verbatim. 8 rows are `supported` rather than `implemented` because real investigations, observations outdoors, microscoping, cutting slides, hand-written protocols, germination experiments over several days, and measuring and identifying at a pond cannot happen in an app; each such row says in `in_class` what stays in class.

Content of later grades is left out on purpose (ATP, mitochondria, xylem and phloem names, placenta, Archaeopteryx, countercurrent exchange); a test checks that these terms do not appear and that learner text uses the LehrplanPLUS spelling "Photosynthese".

All drawings and models are inline SVG without external requests. Every source link was fetched on 16 November 2026 and its real page title read (see [docs/biologie-gymnasium-6-coverage.md](../docs/biologie-gymnasium-6-coverage.md)); they open only on a user click.

Progress, theme and drafts stay in this browser under `biologie_gy6_academy_progress_v1` and `biologie_gy6_theme`. No accounts, cookies, analytics, external fonts, embeds or background requests. Teacher videos are not part of this initial version; a separate step adds and checks them.

## Develop and verify

```sh
npm ci
npm run dev           # http://localhost:5253/biologie-gymnasium-6/
npx tsc --noEmit
npm test
npm run build
npm run package:zip
node scripts/check-curriculum.mjs
```

`npm run package:zip` creates `release/ZAM-Academy-Biologie-6-Gymnasium-offline.zip` with the self-contained HTML and starters for Windows, macOS and Linux.

## Cell contract and publication

`cell.json` is the only card list: 44 atoms, one per lesson, with two cards each (a binary `tier1_fast` check taken from the lesson's quick check and a concise `tier2_synthesis` recall), 88 cards and 36 soft prerequisite edges. Every card cites `https://academy.zam-os.org/biologie-gymnasium-6/#lesson=<id>`. Atom and item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json` and become a contract on first publication.

The [approved mapping](replaces-de-by.json) transfers 3 matching review histories. The 13 keep-active cards retain their histories on their existing IDs. The byte-exact source fixtures are in `tests/fixtures/`.
