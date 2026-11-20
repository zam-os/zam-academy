# Grade 6 Gymnasium French curriculum and card inventory

The official Bavarian Grade 6 [first foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/1-fremdsprache) and [second foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache) subject curricula were read on 20 November 2026. Neither lists prescribed hours by learning area. The downloaded source files and their SHA-256 values are recorded in the package. `npm run check:curriculum` confirms all 50 first-language and 47 second-language entries in their own pages after whitespace and HTML entity normalization. Nested grammar lists remain with the corresponding parent expectation.

## Curriculum sequence

| Area | First foreign language | Second foreign language |
| --- | --- | --- |
| Communicative skills and language resources | Routines, preferences, travel, descriptions, listening, mediation and requests. Demonstratives, adjective agreement, extended negation, relatives, object and stressed pronouns, present forms and the passé composé with both auxiliaries. | Social exchanges, school, family, shopping, route prompts, notices and simple mediation. Present and futur proche, article forms, possession and demonstration, adjectives, negation, noun objects and direct object pronouns. |
| Intercultural skills | Paris, Lyon, Nantes and Brittany. Two fictional school timetables and named traditions support concrete comparisons. | A labelled map, Paris and Brittany, politeness, birthdays, Christmas and everyday life. The EU country profiles support comparisons with Germany. |
| Text and media skills | An event poster, an exchange form, a past-tense message and an original three-panel comic. | Short notices, messages, invitations, a simple comic and an original comptine. |
| Learning strategies | Repeated listening, cues in a notice, vocabulary retrieval and two-pass self-editing. | Repeated listening, classroom instructions, vocabulary cards, coursebook lookup and entering French diacritics. |
| Topics | Routines, school, clothes, weather, train travel, an exchange, restaurant and recipes, festivals and comics. | School, family, leisure, everyday products, travel, greetings, celebrations, cultural texts and French word order. |

The first-language path builds on [Grade 5](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/franzoesisch/1-fremdsprache) and concentrates practice on the new targets. It leaves the partitive, imparfait contrast and reflexive verb paradigms to [Grade 7 first foreign language](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/1-fremdsprache). The beginner path adapts material from the Grade 5 Academy package where the curricula align and adds lessons on adjective agreement, demonstratives, extended negation, direct object pronouns, directions and comics. Its [Grade 7 successor curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/2-fremdsprache) introduces relative clauses and the passé composé.

`coverage.json` maps each entry to its lessons and names the limits of support. The six audio scripts can be read by an installed French browser voice or a partner. Native-speaker listening and audiovisual material, spontaneous interaction, pronunciation feedback, drawing, presentation, personal vocabulary development and current-event research need additional in-class or independent practice. The practice app stays offline and does not send audio or drafts anywhere. The page titles and hashes for linked curriculum, EU and tourism sources are in `source-checks.json`.

## Legacy cards

ZAM's bundled-cell registry and curriculum fixtures at `1ff016cfd7a0765c5338eb4248d0c14f3b92261c` contain no legacy Gymnasium French Grade 6 cell. The neighbouring Grade 7 cell includes four items. The original bytes are pinned by SHA-256 in `replaces-de-by.json`.

- Two category A candidates retrieve the same knowledge as the first-language Grade 6 cards on the feminine plural of *arrivé* with *être* and the negation *ne … jamais*.
- Two category C items stay active. One covers a broader combination of past-tense rules, including reflexives. The other combines relative clauses, negation and partitive articles, and remains with Grade 7 under the earlier scope decision recorded for the [Grade 5 package](franzoesisch-gymnasium-5-coverage.md).
- Grade 5 Academy cards and Realschule cells cover different curriculum positions. The package declares no replacements for them.

The Grade 7 comparisons are proposal-only. The cell has no `replaces` or `retired_items` entries. Implementing a transfer would require an explicit scope and mapping decision from Thomas. The `ne … jamais` candidate has an equivalent card in the second-language path. A follow-up migration should account for learners who already hold both Grade 6 cards.

The app tracks first- and second-language lesson progress independently. ZAM receives one cell for Gymnasium Grade 6. Topic codes and language domains distinguish the paths, since they are foreign-language sequences rather than Gymnasium Ausbildungsrichtungen.
