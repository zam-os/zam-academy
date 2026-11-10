# Biologie 11 Gymnasium · Einführungsklasse

A German practice app for Bavarian G9 introductory classes that offer biology. It follows the [ISB implementation guidance](https://www.isb.bayern.de/fileadmin/user_upload/Gymnasium/Einfuehrungsklasse/biologie.pdf), which sets out five subject areas plus scientific inquiry, communication and evaluation across them.

The course has 28 lessons, each with a worked example, quick check, workshop and two written exercises: guided practice and transfer. Twelve interactive models let learners explore measurements, microscopy, cells, immune responses, enzymes, gas exchange, circulation, ATP, chromosomes, meiosis, synapses and animal behavior. A separate growth curve and data table show how bacterial population growth can level off. The reference view collects key terms. Completion records the guided practice; both levels save their drafts and self-assessments separately in the browser.

The models use labeled schematics or practice data. They prepare learners for lab work and discussion with a teacher. Learners assess their own written responses against a model answer and three criteria.

## Run locally or offline

```bash
npm ci
npm run dev        # http://localhost:5227/biologie-gymnasium-11/
npm run package:zip
```

Extract `release/ZAM-Academy-Biologie-11-Einfuehrungsklasse-offline.zip` and open the included HTML file in a browser. The app runs without a server. Source links open only on a click; progress and written answers stay in the browser.

## ZAM recall and release status

[`cell.json`](cell.json) has 28 lesson atoms and 84 recall cards with stable lesson links. All 56 fast-check cards have two curated choice distractors with explanations of the misconceptions they test. The app and cell are a local draft, so the public atlas, Pages build and catalog do not list them. Teacher review and video selection are separate steps.

The [curriculum coverage and legacy comparison](../docs/biologie-gymnasium-11-coverage.md) explains the school scope, the [36 competency mappings](coverage.json) and the [unapproved proposal](replaces-de-by.json) for one older card.
