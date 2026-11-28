# Grade 8 Gymnasium German curriculum and history

The package follows the [Bavarian LehrplanPLUS Fachlehrplan for Grade 8](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/deutsch), fetched on 2026-11-28. The file [coverage.json](../deutsch-gymnasium-8/coverage.json) records all 48 expectations and their lesson references. The online curriculum gives no hours for these units. The package keeps the downloaded curriculum snapshots and their SHA-256 values for the curriculum check.

| Lernbereich | Scope | Expectations | Lessons |
| --- | --- | ---: | ---: |
| D8 LB 1 · Sprechen und Zuhören | All Ausbildungsrichtungen | 9 | 6 |
| D8 LB 2 · Lesen – mit Texten und weiteren Medien umgehen | All Ausbildungsrichtungen | 13 | 11 |
| D8 LB 3 · Schreiben | All Ausbildungsrichtungen | 13 | 10 |
| D8 LB 4 · Sprachgebrauch und Sprache untersuchen und reflektieren | All Ausbildungsrichtungen | 9 | 11 |
| D8 LB 5 · Profilbereich am MuG | Musisches Gymnasium | 4 | 4 |

The common path develops the linear letter and the language work from Grade 7 into source-based reasoning, journalistic comparisons, close reading across genres, reported speech and deliberate sentence design. The Grade 9 curriculum adds antithetical and topic-based argument structures and extends analysis of narrative voice and represented thought. The Grade 8 package therefore uses a linear reader letter and focuses narrative work on causality, narrator report and character speech. The historic and contemporary model excerpts compare social expectations, mobility and point of view. [Grade 7 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/deutsch), [Grade 9 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/9/deutsch).

Eighteen expectations are marked `supported`. Their lessons include rehearsal or worked models and explicitly assign the external practice, including live discussion, performance, research, whole-work study, and using a word processor and reviewing with a partner. The two shared whole-work readings can include a film analysis in place of one complete book. The MuG profile includes a further complete book or film and group production work for the school community.

## Legacy review history

The [proposal](../deutsch-gymnasium-8/replaces-de-by.json) inventories all four Grade 8 Gymnasium items against a byte-exact snapshot in [the test fixtures](../deutsch-gymnasium-8/tests/fixtures/de-by-gymnasium-8-deutsch-eroerterung-drama-novelle-textanalyse-kvt.json).

- **A · 1 proposed transfer.** The 3B item and `d8-argument-material-check` retrieve the same structure: Behauptung, Begründung, Beispiel or Beleg.
- **C · 3 keep active.** The bundled argumentation prompt combines several structures. The Goethe definition of the novella is a different retrieval target. The multi-part drama and prose prompt combines several topics that the new route teaches separately.
- **Adjacent grades.** Grade 7's syntax/indirect speech and ballad/summary tiles have a separate Grade 7 inventory. Grade 9's dialectical writing and Weimar Classicism tile covers other targets. This proposal concerns the Grade 8 tile only.

The package cell has no history transfers or retirements. The category A proposal requires Thomas's explicit approval before it can be activated.
