# French 8: existing content and Academy package

Checked on 29 October 2026 against the [official curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/franzoesisch). The Academy source is [franzoesisch-realschule-8](../franzoesisch-realschule-8/); its [coverage matrix](../franzoesisch-realschule-8/coverage.json) traces the curriculum and identifies additional practice.

## Existing material

ZAM bundles `de-by:realschule-8-franzoesisch-passe-compose-relativsaetze-adjektive`, version `2026.08.1`: two atoms and four items. A byte-for-byte fixture is preserved in the package's tests. It covers parts of grammar and does not supply a complete year of communicative learning.

| Existing item | Review finding | Treatment in this package |
| --- | --- | --- |
| `01K4F8P0000000000000000J01` | The movement-verb wording invites a false generalisation: marcher and courir use avoir. Some verbs change auxiliary with construction. | Fresh lessons teach bounded examples and counterexamples; no history transfer. |
| `01K4F8P0000000000000000J02` | A long multi-part prompt combines formation, auxiliary selection, agreement and translation. Its generic participle and reflexive-verb wording needs qualification. | Separate concise items for formation, irregular participles, être agreement and negation; no one-to-one equivalence. |
| `01K4F8P0000000000000000J03` | The subject role of qui is useful, but immediate adjacency to a finite verb is not a reliable rule: qui te parle is valid. Relative clauses are absent from this grade's specified new grammar list. | Optional extension teaches function explicitly, with new ids. |
| `01K4F8P0000000000000000J04` | Bundles relative functions, adjective position, a false absolute adjacency rule and translations into one card. | Core adjective practice and separate optional relative lessons; no mastery inference. |

## New package

Forty core lessons cover communicative tasks, vocabulary strategies, the specified grammar, pronunciation preparation, intercultural work, text work and methods. Two optional lessons address qui/que and où. Each has a short check and a distinct recall prompt, giving 84 practice items. Their 126 atom/item ids are new ULIDs and cannot collide with the four legacy items.

Only core atoms declare `lehrplanplus-bayern`, `realschule`, grade `8`, subject `franzoesisch`, track `IIIa`. Relative extensions are Academy-only. The package does not describe itself as evidence of complete curriculum mastery. Natural audiovisual material, spontaneous conversation, maps, current research, the annual vocabulary programme and teacher feedback remain additional tasks.

There are no `replaces` or `retired_items` declarations. `replaces-de-by.json` records four proposal-only C rows, all marked keep-active with `approved: null`, the exact fixture SHA-256 and the source commit; no automatic transfer is proposed. Existing cards remain active and unchanged. A future decision to retire inaccurate legacy wording or adopt an explicit mapping is separate work; this package does not make that decision implicitly.

## Verification

The package test suite checks lesson/card anchors, curriculum scope, French accents, draft invalidation, optional work, storage recovery, local-only French voice selection and pinned ids. `scripts/validate-cell.mjs` installs the old fixture in a temporary local library, gives its four cards eight reviews, installs the new tile twice, creates its 84 new cards, and repeats installation and enrollment. It compares all legacy card fields and review rows, verifies fresh unlearned state and lesson links, and confirms idempotence. It uses neither configured cloud storage nor a personal library.

The PR prepares app and cell publication through Pages. No legacy evidence is migrated and no ZAM release bundle is edited.

## Grade boundaries checked on 30 October 2026

The grade-7, grade-8 and grade-9 official French pages were compared. Familiar invitations, greetings, basic present forms and futur composé build on grade 7. Grade 8 adds the specified past narration, object-reference grammar and wider everyday tasks. The two relative-clause lessons are explicit optional preparation for later work; they have no grade-8 school binding. Imparfait, futur simple, conditional sentence systems and full relative-clause coverage remain outside the core package.

Sources: [French 7](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/franzoesisch), [French 8](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/franzoesisch), [French 9](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/franzoesisch). There is one shared French Fachlehrplan for group IIIa, not separate I and II/III courses.
