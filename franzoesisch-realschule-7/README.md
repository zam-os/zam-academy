# Französisch 7 · Realschule Bayern (IIIa)

This ZAM Academy package follows the [LehrplanPLUS Französisch 7](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/franzoesisch) for the Bavarian Realschule. French is the second foreign language of Wahlpflichtfächergruppe IIIa from grade 7 to 10, so this is the learners' first year. Guidance is in German; examples, materials and practice are in French.

| Stage | Lessons | Main topics |
| --- | ---: | --- |
| Bonjour, la classe ! | 6 | Greetings, introductions, sounds and IPA, classroom phrases, instructions, numbers to 100 |
| Ma famille, mes amis | 6 | Articles, plurals, être and avoir, family and possessives, pets and il y a, subject pronouns |
| Les verbes en action | 7 | -er verbs, -cer/-ger, aller, faire, prendre, vouloir, pouvoir, ne … pas, word order with a direct object |
| On parle ensemble | 7 | Intonation and est-ce que questions, question words, preposition + qui/quoi, imperative, me/te/nous/vous, stressed pronouns |
| Ma journée, mon collège | 7 | Time, dates and ordinals, the collège, daily routine with connectors, likes, hobbies, futur composé |
| Chez moi, en ville | 6 | Prepositions of place, au/aux/du/des, transport, quantities with de, shopping, asking the way |
| Bienvenue en France | 5 | Map of France, Paris, Brittany, birthdays and invitations, Christmas, galette des rois and 14 juillet |
| Lire, écouter, écrire | 10 | Listening, a photo story, posters, translation traps, inferring words, postcards, forms, vocabulary methods, accents, a short sketch |

Every lesson has an explanation with an example and a key rule, a visual workshop with three goals, a quick check, two short answers and two writing or speaking tasks (Level 1 guided, Level 2 transfer). The visuals include colour-coded verb tables whose endings can be hidden, a room scene for prepositions, a clock with official and everyday time, a number slider, a map of France and step explorers with one colour code for masculine, feminine, plural and verb forms. Each stage has its own accent colour.

## Notes for parents and teachers

Progress and the learners' own texts stay in this browser on this device; nothing is sent anywhere. Pupils who share one device account should use “Lokalen Fortschritt zurücksetzen” at the end, which deletes progress and texts. Three listening lessons use an already installed French voice or a partner reading the transcript. The app records no speech and does not assess pronunciation or free texts. Natural recordings, spontaneous conversation, the full vocabulary programme of about 450 words from the coursebook and teacher feedback remain classroom work.

## ZAM cards

The cell `zam-academy:franzoesisch-realschule-7` holds 162 cards, three per lesson, each linked to its lesson. ZAM already has the older cell `de-by:realschule-7-franzoesisch-starter-grammatik-verben` with four cards. Thomas approved the mapping in `replaces-de-by.json` on 2026-11-22: two A rows move their review histories to `f7-etre-avoir-check` and `f7-negation-recall` via `replaces`, and the two C cards stay active (no `retired_items`). See [the curriculum and card record](../docs/franzoesisch-7-coverage.md).

## Verify locally

```sh
npm ci
npx tsc --noEmit
npm test                 # verbatim curriculum check + vitest
npm run build
npm run package:zip
node scripts/verify-browser.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-migration.mjs
```

Browser verification uses installed headless Chrome (`CHROME_BIN` if it is elsewhere, `BROWSER_QA_DIR` for the screenshots). Use zam-core 0.54.0 as pinned in CI. The dev server uses port 5274. Package version 0.0: teacher review is open.
