# Grade 8 Latin as a second foreign language

This ZAM Academy package follows the Bavarian Gymnasium curriculum for
[Latein 8 (2. Fremdsprache)](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/latein/2-fremdsprache).
It contains 49 German-language lessons in eight stages. Each lesson has a
Latin or cultural reading, an interactive diagram, three workshop goals, a
quick check, short exercises and two levels of written work with sample answers.
The [ZAM cell](cell.json) contains 147 linked review cards.

Learners can open the offline HTML in a browser. The app stores progress and
drafts on that device. Use the matching launcher or open the HTML after
extracting the ZIP. The ZAM cell accompanies the source package.

## Develop and verify

```sh
npm ci
npm run dev
npm run typecheck
npm test
npm run package:zip
node scripts/verify-browser.mjs
```

Vite serves the app on port 5296. The build writes a self-contained
`dist/index.html`. The ZIP goes to `release/`.

The [curriculum and legacy review](../docs/latein-gymnasium-8-l2-coverage.md)
records which expectations the app covers and which need additional practice
or classroom work. Version 0.0 is published by Academy Pages on merge. Teacher review is open.
