# Natur und Technik 7 Gymnasium · ZAM Academy

A single entry point for both focuses of Grade 7 Natur und Technik at a Bavarian Gymnasium. The [LehrplanPLUS curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/nt_gym) applies to all learners in the grade.

| Focus | Sections | Lessons |
| --- | --- | ---: |
| Physics | NT7 1.1–1.3: magnets and density, optics, electrical circuits | 21 existing |
| Informatics | NT7 2.1–2.4: hypertext and the Internet, digital communication, algorithms, team project | 12 new |

The Academy entry point opens the existing Physics package at its canonical URL. Local web builds and the offline ZIP compile that same source and provide a return link to the joint overview. All 63 Physics cards, their lesson anchors and the Physics progress key belong to the existing app. The new cell adds 36 Informatics cards only, each with a lesson link. Installing this cell has no effect on legacy cards.

Informatics includes a directed graph workshop, a visual wiki editor with named checkpoints, a model of a web request, and a step-through programming tool that runs configured commands. Each lesson has a worked example, reference terms, a quick check and three workshop goals. Each exercise generator offers at least three different scenarios per level. All eight lessons in NT7 2.1 and 2.3 include an exercise generator that asks for a typed answer. The project brief uses a wiki about shadows to connect both focuses. The [curriculum and card comparison](../docs/nt-gymnasium-7-coverage.md) records classroom activities that the app supports.

Find the course in the atlas as **Natur und Technik 7 Gymnasium** or open the [Academy course](https://academy.zam-os.org/nt-gymnasium-7/). Teacher review remains open.

## For parents and teachers

Informatics practice progress, wiki drafts and named checkpoints stay in the browser profile on the device. Device accounts, browsers, browser profiles and website origins have separate storage. If several learners share an account and browser profile, use **Fortschritt zurücksetzen** in the Informatics learning path at the end of each session. This clears the progress, draft and checkpoints from the browser. The optional file export saves a separate copy in the device’s file system.

## Run locally

From this directory, with the repository’s sibling `physik-gymnasium-7` package present:

```sh
npm ci
npm run dev           # http://localhost:5269/nt-gymnasium-7/
npm test
npm run typecheck
npm run build:pages  # Academy entry point with a link to the existing online Physics app
npm run package:zip   # release/ZAM-Academy-Natur-und-Technik-7-offline.zip
node scripts/check-curriculum.mjs
node scripts/verify-release.mjs
node scripts/verify-browser.mjs   # run after package:zip; set CHROME_BIN if needed
```

Extract the ZIP and open `index.html`. It includes both focuses and works offline. CI rebuilds and verifies the shared offline bundle when it checks the source Physics package.
