# Grade 7 Biology · Bavarian Realschule

Version 0.x is published at https://academy.zam-os.org/biologie-realschule-7/. Teacher review is open.

The shared path for groups I, II, IIIa and IIIb follows [Bavaria's LehrplanPLUS for Grade 7 Biology](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/7/biologie). Its 27 lessons cover investigation and communication, cells and unicellular organisms, plant metabolism, and human organ systems. Every lesson has a diagram, a quick check, a workshop, and written practice at two levels. Six interactive models cover cells, plant transport, photosynthesis and respiration, circulation, the ear, and blood glucose regulation.

## Learn offline

Unzip `ZAM-Academy-Biologie-7-offline.zip` and open `ZAM-Academy-Biologie-7.html` in a browser. The app stores progress and drafts locally. Learners compare their written answers with model answers and criteria. Real experiments, microscopy and oral presentation take place in class.

The companion [ZAM cell](cell.json) holds 54 spaced-repetition cards. It is listed in the Academy catalog, so ZAM can import it. The [curriculum and legacy-card audit](../docs/biologie-realschule-7-coverage.md) documents the scope.

## Develop and verify

```sh
npm ci
npm run dev                        # http://localhost:5267/biologie-realschule-7/
npm run typecheck
npm test
npm run package:zip
node scripts/verify-release.mjs
node scripts/check-curriculum.mjs /path/to/saved-official-page.html
```
