# History 8 inventory and learning-history boundary

Checked on 29 October 2026 against the local ZAM curriculum fixture `de-by:realschule-8-geschichte-aufklaerung-revolution-kaiserreich`, version `2026.08.1`. The exact source snapshot is retained in `geschichte-realschule-8/tests/fixtures/de-by-geschichte-8.json` (SHA-256 `01a0969831efc2be464491023478aa2244b381d39400d02b28564ede9fa06672`).

The existing cell has four atoms and eight practice items. It touches Enlightenment, the French Revolution, industrialisation and the German Empire. It does not supply a complete Grade 8 learning path. Several synthesis prompts require multiple independent facts, while the new cell separates short recall targets from extended written reasoning.

| Existing items | Assessment for this package |
| --- | --- |
| J01–J02 · Enlightenment | Related content, different retrieval targets and scope; no equivalence asserted. |
| J03–J04 · French Revolution | New items distinguish causes, chronology and rights. Broad legacy responses are not matched to a new short response. |
| J05–J06 · Industrialisation | The app teaches a multi-factor explanation and separate social-policy judgements. It introduces no inferred mastery transfer from invention trivia or the broad synthesis. |
| J07–J08 · German Empire | New material distinguishes unification, real Reichstag powers and government accountability. The legacy wording describing parliamentary power as absent is not carried into the new explanation. |

Every old item remains independent. The new `zam-academy:geschichte-realschule-8` cell contains 38 fresh atoms and 76 fresh items, with no `replaces` or `retired_items`. It neither deletes old content nor enrolls a learner automatically. Similar topics, wording or embeddings are not proof of an equivalent recall criterion.

The disposable-library validator creates two actual reviews for each of the eight legacy cards, installs the new cell twice, then enrolls its 76 cards. It compares old card state and all 16 review rows, checks fresh state on new cards, verifies source links, and repeats installation/enrollment. No personal library is used.

[coverage.json](../geschichte-realschule-8/coverage.json) records all 38 indexed curriculum expectations and marks practical limits. The package prepares original-image and map analysis, local monument research, contemporary examples and discussion; those tasks need additional material. No full-year mastery claim is made.

Pages publishes this package and its catalog entry at https://academy.zam-os.org/geschichte-realschule-8/ on merge to main. Synchronizing the bundled ZAM fixtures is a separate, subsequent step. This PR performs no learning-history migration.

The machine-readable inventory is [replaces-de-by.json](../geschichte-realschule-8/replaces-de-by.json): eight C rows with per-item reasons, `status: proposal-only`, `approved: null`, and `action: keep-active`. No mapping approval is required for this version because it makes no replacements or retirements.
