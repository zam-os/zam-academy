# German 7 Realschule, Bavaria

50 lessons follow the shared Bavarian LehrplanPLUS Grade 7 German curriculum:
10 on speaking and listening, 14 on reading and media, 10 on writing and 16 on
language and spelling. Each lesson has explanations, a worked example, a key
rule, an explorable diagram or language model, a quick check, two case decisions
and distinct guided and transfer writing tasks. Draft comparison uses three
concrete self-assessment criteria. The app does not automatically grade free
writing.

The 16 language models change real words, forms and sentence structures:
loanword prefixes and suffixes, historicisms and semantic shift, youth and
advertising language trends, hypernyms, indicative vs. Konjunktiv I/II in
indirect speech, pre- and post-nominal attributes, adverbials, causal/temporal/
modal/local/attributive clauses, coordinate vs. subordinate clauses, `das`/`dass`,
clause punctuation, quotation marks and apostrophes, capitalisation, compound
separation and dictionary-backed error tables. All 50 visuals have three
exploration goals that start unchecked. These goals record what was explored,
not mastery.

The package is published at version 0.1 (`publication.json`; `0.n` means not
yet accepted by a teacher of the grade), so its lesson ids, item ids and slugs
are a contract. Teacher review and teacher videos remain open. Thomas approved the four history transfers on 2026-11-21.

Open [dist/index.html](dist/index.html) after building, or extract
[release/ZAM-Academy-Deutsch-Realschule-7-offline.zip](release/ZAM-Academy-Deutsch-Realschule-7-offline.zip)
and open `ZAM-Academy-Deutsch-Realschule-7.html`. The ZIP includes Windows,
macOS and Linux starters. Audio, diagrams and styles are embedded; no account
or server is needed. Drafts and progress use this package's own `localStorage`
key (`deutsch_rs7_progress_v1`). Sources open only on a click.

```sh
npm ci
npm run dev                 # port 5268
npm run typecheck
npm test
npm run check:curriculum
npm run package:zip
npm run test:browser
```

The browser check opens the built file in a temporary headless Chrome profile.
Set `CHROME_BIN` if Chrome is installed outside the default macOS path; CI uses
`/usr/bin/google-chrome`. `BROWSER_QA_DIR` overrides the report and screenshot
folder (default: `zam-deutsch-rs7-browser` under the operating system's temporary
folder). It checks every lesson and both task levels in light and dark themes,
every exploration control and case goal, all selected language-model examples
in both themes, keyboard activation, model answers, rubrics, completion on both
levels, reload persistence, edit invalidation, audio decoding and layouts at
320, 390, 720 and 1280 pixels. Runtime exceptions and external HTTP requests
fail the check.

The [coverage matrix](coverage.json) contains all 57 official expectations. The
curriculum checker verifies each quotation against the captured live page and
checks source, legacy and audio hashes. `supported` rows distinguish practice
supplied here from authentic listening, real discussions, talks, performances,
independent research, word-processing layout and full-book reading that happen
outside the app. Grade 7 requires documenting reading experiences including at
least one complete children's or youth book. See the
[curriculum and legacy inventory](../docs/deutsch-realschule-7-coverage.md).

100 ZAM practice items live only in [cell.json](cell.json), two per lesson, each
with two curated distractors checked against `zam-core`. Their source links use
the public lesson anchors. The [approved mapping](replaces-de-by.json) covers ten practice items from two Grade 7 school cells. Four equivalent items carry review history to their Academy successors. The other six stay active.

Validate installation, enrolment and preservation of old evidence with the
published `zam-core` version pinned in repository CI:

```sh
ZAM_CORE=file:///path/to/zam-core/dist/index.js node scripts/validate-cell.mjs
```

All Grade 7 passages and model examples are original except the public-domain
ballad and Baroque excerpts from Wikisource. Two original passages were rendered
locally using the installed computer voice Anna;
[media provenance](src/media/provenance.json) pins audio and transcript hashes.
They are practice models, not authentic radio or live classroom debates.
[Source checks](source-checks.json) record the real titles and SHA-256 hashes of
all six linked curriculum, Wikisource, spelling-council, grammar and
media-literacy pages. No teacher videos are added.
