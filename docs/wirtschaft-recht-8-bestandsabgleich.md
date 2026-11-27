# Wirtschaft und Recht 8 Realschule curriculum and legacy cards

The [Grade 8 Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/wirtschaft-und-recht/wpfg2), checked on 2026-11-27, applies to Wahlpflichtfächergruppe II. The [coverage matrix](../wirtschaft-recht-realschule-8/coverage.json) records the five required areas (56 hours), the optional bilingual area and the source hash. It distinguishes app exercises from activities that depend on current research, a local adviser, an employer or a conversation partner. The practice section prepares an interview or a similar classroom activity and provides a local reflection note.

The [subject profile](https://www.lehrplanplus.bayern.de/fachprofil/realschule/wirtschaft-und-recht) places the Grade 8 material at the start of Wirtschaft und Recht for track II. Grade 7 BwR can supply prior knowledge of businesses. The [Grade 9 WR curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/wirtschaft-und-recht/wpfg1-3) serves tracks I and III and introduces some of the same concepts. Grade 8 uses overlapping practice where it matches the track II requirements. The Grade 9 package retains its separate cell and its existing card mapping.

## Proposed legacy mapping

The [proposal](../wirtschaft-recht-realschule-8/replaces-de-by.json) accounts for all eight items in the [byte-exact Grade 8 snapshot](../wirtschaft-recht-realschule-8/tests/fixtures/de-by-realschule-8-wirtschaft-recht-konsum-geld-jugend-kvt.json). No neighbouring cell is part of the proposal.

| Legacy card | Category | Proposal |
| --- | --- | --- |
| J01 | A | Link to `wr8-wh-prinzip-check`. It asks for the same fixed-goal, least-resource principle. |
| J02 | C | Propose retirement. Its separate retrievals belong to different concepts, and its answer confuses market demand with a completed purchase. |
| J03 | C | Keep active. Standalone review of the functions of money extends beyond the named Grade 8 requirements. |
| J04 | C | Keep active. Surveying bank money and common payment methods goes beyond the prescribed online payment cases. |
| J05 | A | Link to `wr8-re-lebensalter-check`. It asks for the same legal status at age 14. |
| J06 | C | Propose retirement. The card combines two capacities, three legal stages and a case. Its answer generalises the consent rule. |
| J07 | A | Link to `wr8-re-lebensalter-extra`. Both ask for full payment from funds supplied for the purpose or for free use under § 110 BGB. |
| J08 | C | Propose retirement. The learning goals have been split and the cash-only claim is incorrect. |

The first cell version carries no `replaces` or `retired_items`. A later migration requires Thomas's explicit approval. The tests check the snapshot hash, every legacy ID, the existence of each proposed successor and the absence of active migrations.
