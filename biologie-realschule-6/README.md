# Grade 6 Biology · Bavarian Realschule

A German-language learning package based on the common Grade 6 [LehrplanPLUS Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/6/biologie). It uses the Biology 10 JSON lesson shell with its workshop, two-level writing, explicit self-assessment, reference view and local progress model.

This is a **local draft** (`publication.json`: `local-only`). It is excluded from the public catalog, atlas registry and Pages build. Teacher review and teacher videos remain open. Publication is a separate decision.

| Area | Official hours | Lessons |
| --- | --- | --- |
| Scientific methods, communication and evaluation | Integrated | 5 |
| Reproduction and sexuality | About 18 | 10 |
| Diversity of vertebrates | About 20 | 8 |
| A local ecosystem | About 18 | 7 |

Each lesson contains an explanation, a worked comparison or example, a key rule, a three-option quick check, a sorting or sequencing workshop, and distinct guided and transfer writing tasks with comparison answers and three assessment criteria. The core progress counts the quick check, workshop and Level 1 self-assessment; selected lessons also require model goals or the field notebook. Level 2 provides additional transfer practice.

Four qualitative visual models let learners explore a flower, bean germination, temperature regulation and a food web. Their goals require changed settings and are not solved initially. Three ecosystem lessons share a cumulative field notebook. Real experiments, microscopy, identification of original specimens, presentations and classroom discussion remain practical activities outside the app. The app checks notebook completeness and dates, not the truth of observations or the quality of a presentation.

The companion [cell.json](cell.json) contains 30 atoms and 60 cards with generated ULIDs, soft prerequisites and lesson anchors. All official bindings are Grade 6, common to the tracks, and `exam_relevant: false`. Cards live only in that file. The [mapping proposal](replaces-de-by.json) inventories 40 existing items: 3 A candidates, 0 B and 37 C keep-active rows. No history transfer or retirement is applied; Thomas's explicit approval would be needed for a future transfer.

## Run and package

```bash
npm ci
npm run dev             # http://localhost:5239/biologie-realschule-6/
npm run typecheck
npm test
npm run package:zip
node scripts/verify-release.mjs
```

Open `dist/index.html` directly, or unzip `release/ZAM-Academy-Biologie-6-offline.zip` and open its HTML file. The ZIP includes Windows, macOS and Linux launchers. The app makes no third-party requests. External references open only on a click. Progress, drafts and the field notebook stay in this browser; blocked storage falls back to the current session with an in-app notice.

## Verification

```bash
# Download the official page separately; this check performs no network access.
node scripts/check-curriculum.mjs /path/to/saved-official-page.html

# Use the published zam-core version pinned by the root CI workflow.
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs

# Installed Chrome, no extra browser dependency; optional CHROME_BIN override.
node scripts/browser-smoke.mjs /tmp/zam-bio6-browser
```

[coverage.json](coverage.json) maps all 46 official expectations to lesson evidence and identifies practical limitations. The checked official extract and public identity contract are pinned in `tests/fixtures/`. The live-page check requires exact normalized wording and the recorded SHA-256. The browser check opens the built file, checks every lesson on both levels in light and dark themes, checks phone layouts, exercises real handlers and rejects external requests or runtime errors.

See [the curriculum and inventory report](../docs/biologie-6-coverage.md) for source titles, neighbouring grades, mapping scope and verification evidence.
