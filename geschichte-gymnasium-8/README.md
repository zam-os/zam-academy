# History, Gymnasium Grade 8

This ZAM Academy package follows the common Bavarian LehrplanPLUS history
curriculum for Grade 8. The German learning path covers the long nineteenth
century in 25 lessons and includes 75 ZAM practice items.

| Area | Lessons | Examples of workshop material |
| --- | --- | --- |
| Enlightenment, French Revolution and Napoleon | 5 | Rights declaration, timeline, constitutional diagram, location sketch |
| Restoration and revolution | 4 | German Confederation map sketch, Heine and the Hessian Courier, Frankfurt timeline |
| Bavaria across periods | 3 | Four switchable geographical views, regional heraldry, monument research |
| Industrialisation and the social question | 4 | Factory transition diagram, employment statistics, comparison of reforms |
| The German Empire | 4 | Anton von Werner's 1885 painting, constitutional diagram, social policy |
| Imperialism and the First World War | 5 | Colonial and postwar map sketches, causes of war, evidence of casualties |

Each lesson has a quick check, an interactive workshop, and a guided writing
exercise with a separate transfer exercise. Learners compare their own drafts
with an example and assess them against three criteria. Drafts and progress
stay in the browser. Maps are labelled schematic views. Atlas work, local
research, discussion and presentations extend the individual exercises.

## For parents and teachers

Writing drafts and progress stay in the current browser profile. On a shared
user account, use **Lokalen Fortschritt zurücksetzen** at the end of the
session to delete both. The writing exercise uses learner self-assessment.

## Run locally

```sh
npm ci
npm run dev
```

Vite serves the app on port 5301. Run `npm run package:zip` for the offline
package. After extracting the ZIP, open the included HTML file. The painting
is embedded in that file. The ZIP also contains the ZAM cell. Reference
links need a connection only when opened.

## Contents and validation

- [Curriculum matrix](coverage.json) maps 36 expectations to lessons and
  distinguishes guided preparation from activities requiring an atlas or
  independent work.
- [ZAM cell](cell.json) contains all 75 items, with a lesson anchor for each.
- [Approved history mapping](replaces-de-by.json) moves two Grade 8 histories
  and keeps six legacy items active.
- [Publication marker](publication.json) records the package version. Teacher
  review is open.

The painting reproduction comes from [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:A_v_Werner_-_Kaiserproklamation_am_18_Januar_1871_(3._Fassung_1885).jpg)
and is marked public domain. The app credits Anton von Werner, the 1885
Friedrichsruh version and the source of the reproduction.

```sh
npm run typecheck
npm test
npm run build
npm run package:zip
```
