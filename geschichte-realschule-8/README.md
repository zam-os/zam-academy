# History 8 · Bavarian Realschule

A ZAM Academy package for all Realschule tracks, aligned with the [official History 8 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/8/geschichte), checked on 29 October 2026. Learner-facing teaching material is in German, with three optional English extensions.

The package contains 35 core lessons, three English lessons, 38 interactive workshops, 76 writing tasks across two levels, and 76 concise recall cards. The app teaches through reading, classification or chronology, and an independently written answer. A model answer becomes available after a draft; learners compare three criteria themselves. Writing is never automatically graded and app progress never changes FSRS mastery.

| Area | Lessons | Focus |
| --- | ---: | --- |
| 1 · Methods | 4 | Source and image criticism, diagrams and maps, monuments and media quality |
| 2 · Foundations of modernity | 7 | Enlightenment, constitutional concepts, American independence, French Revolution and unequal implementation of rights |
| 3 · Napoleon | 4 | Imperial power, secularisation, Bavaria in 1806, resistance and national ideas |
| 4 · Restoration and revolution | 4 | Vienna 1815, Hambach 1832, the Frankfurt parliament and 1848/49 |
| 5 · Industrialisation | 5 | Production, railways and Bavaria, the Social Question, cities and environment, social policy |
| 6 · German Empire | 5 | Unification, constitution, Bismarck's domestic and foreign policy, mass society |
| 7 · Protest across periods | 3 | Freedom, unequal rights, motives and forms of protest, a clearly fictional present-day exercise |
| 8 · War across periods | 3 | Causes and justification, civilian and environmental consequences, peaceful alternatives |
| 9 · Optional English | 3 | Independence, industrialisation, technology and war |

## Scope and evidence

[coverage.json](coverage.json) traces all 38 indexed curriculum expectations. Its treatment labels distinguish guided practice from preparation. This package is a learning resource, not certification that a learner has mastered the entire curriculum. Actual historical paintings, caricatures, photographs, maps and datasets, local monument research, current examples, oral discussion and feedback need additional material or work outside the app. The optional lessons do not replace a complete bilingual course. Curriculum hour allocations describe the official course, not the app's expected completion time.

The exercises are authored historical explanations and expressly fictional scenarios, not invented original testimony. Two short, attributed original excerpts supplement them: the US Declaration of Independence and the 1871 imperial constitution. Each has author, date, audience, provenance and interpretive limits. The app gives no unverified current-event facts. Present-day comparisons begin with a dated source investigation.

Progress, theme and drafts stay in this browser. Blocked storage produces an in-app explanation and leaves the current session usable. No accounts, analytics, external fonts, automatic source requests or remote grading are used. External references open only on a click. Saves merge explicit local actions with the latest stored progress, using a Web Lock when available; a stale tab cannot overwrite untouched drafts or restore progress after a reset.

## Develop and verify

The package uses the same TypeScript, Vite, single-file plugin and Vitest dependencies already present in Academy. No additional dependency is introduced.

```sh
npm ci
npm run dev           # http://localhost:5213/geschichte-realschule-8/
npm test
npm run typecheck
npm run build
npm run package:zip
```

Open `release/ZAM-Academy-Geschichte-8-offline.zip` after packaging. Extract it and open `ZAM-Academy-Geschichte-8.html`; Windows, macOS and Linux launchers are included. The HTML is self-contained and usable without a server. External source pages still require an internet connection.

Run the installation and history-preservation check with a compatible published `zam-core` or a local built module:

```sh
ZAM_CORE=file:///absolute/path/to/zam/dist/index.js node scripts/validate-cell.mjs
```

The check creates disposable libraries, installs twice, enrols twice, verifies new-card state and source links, and compares all eight legacy cards and their reviews. It never reads or changes a personal library.

## Cell contract and publication

`cell.json` is the only recall-card list. Each practice item cites `https://academy.zam-os.org/geschichte-realschule-8/#lesson=<id>`. Pages publishes the app and its cell at these URLs on merge to main. The app explains the catalog path and lets learners continue locally if the package is not listed yet.

The 114 atom/item ULIDs and lesson anchors are pinned in `tests/fixtures/public-contract.json`. Card text lives only in `cell.json`. Lessons are self-contained: chronology alone does not create a prerequisite. The existing eight History 8 items remain independent, with no `replaces`, retirements, inferred equivalence or mastery transfer. See the [inventory](../docs/geschichte-8-bestandsabgleich.md).

Pages publication and ZAM fixture synchronization are separate steps. Synchronization into the bundled ZAM library is not part of this PR. The legacy inventory in `replaces-de-by.json` is proposal-only and does not authorize a history transfer.
