# ZAM Academy — Grade 7 English, Bavarian Mittelschule

An offline learning app for the standard class (R7) and the Mittlere-Reife track (M7). The learning path includes **35 lessons, 105 workshop goals, 70 two-level tasks, and 105 ZAM review cards**.

| Area | Learner activities |
| --- | --- |
| Communication | Listen to forecasts and announcements, infer details in blogs, give directions, write project notes and messages, and mediate ticket information |
| Language | Form the present perfect simple, recognise going-to intentions, compare adjectives and quantities, choose pronouns, read large numbers, and practise word order, collocations and pronunciation |
| Intercultural learning | Explore Belfast and Dublin on a map, compare landscapes and visitor rules in the UK and US, and talk about festivals |
| Text and media | Read and create a film poster, adapt a classified ad, and sequence a photo story |
| Learning methods | Use dictionary examples and IPA, group vocabulary, and choose and check a learning strategy |

Four lessons extend the shared path for **M7** with German-to-English mediation, note-taking from a spoken message, interpreting miles and pounds, and vocabulary by prefixes and suffixes. Select the track and the practice level independently in the learning path.

The app saves drafts and progress in local storage. If learners share a device account and browser profile, the reset control clears both after practice. Six listening scripts use an installed English voice when available. Every script has a transcript for a partner read-aloud. Natural recordings and audiovisual material, classroom conversation, presentations with feedback, and the broader vocabulary target complement the package.

See the [curriculum and legacy inventory](../docs/englisch-mittelschule-7-coverage.md).

## Development

```bash
npm ci
npm run typecheck
npm test
npm run dev
npm run package:zip
```

The development server uses port 5292. The ZIP contains a self-contained `index.html`. Extract it and open it in a current browser.

The ZAM cell identifier is `zam-academy:englisch-mittelschule-7`. Install the cell from ZAM Academy once the package is published. Each card links to its lesson.
