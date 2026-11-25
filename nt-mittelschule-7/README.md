# Grade 7 Natur und Technik · Bavarian Mittelschule

An offline German-language learning package for the complete Grade 7 subject. The Regelklasse path has 30 lessons. The Mittlere-Reife-Klasse path adds six lessons and includes a temperature comparison in the wire model. The 36 lessons contain explained examples, quick checks, diagrams with controls, and three guided and three transfer exercises per lesson. The ZAM cell contains 108 recall and transfer items.

Choose your class in **Lernpfad**. Open **Merksätze** for the references in the selected path. Each lesson supports a direct link, for example `#lesson=blutkreislauf&level=2`. Progress stays in the browser. In ZAM Studio, choose **Lern-Karten → Importieren → Aus der ZAM Academy** to find the matching cell.

For offline use, extract the ZIP and open its HTML file. The app uses no external assets. The [curriculum and verification notes](../docs/nt-mittelschule-7-coverage.md) describe the scope and classroom components.

```sh
npm ci
npm run dev          # http://localhost:5264/nt-mittelschule-7/
npm run typecheck
npm test
npm run build
npm run package:zip  # release/ZAM-Academy-Natur-und-Technik-7-Mittelschule-offline.zip
```

Version 0.0. Teacher review is open.
