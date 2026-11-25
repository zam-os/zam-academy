# Grade 7 Gymnasium French as the second foreign language

The package builds on the second-language path first published with [Grade 7 Gymnasium French](franzoesisch-gymnasium-7-coverage.md). Its atlas slot is `franzoesisch-2fs`, Grade 7. The first-language course keeps the existing app address and the second-language course has its own address.

## Curriculum

The [Bavarian LehrplanPLUS Fachlehrplan](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/7/franzoesisch/2-fremdsprache) was checked in the original package on 23 November 2026. It specifies a single curriculum across Gymnasium programmes and gives no hours per learning area. The [coverage matrix](../franzoesisch-2fs-gymnasium-7/coverage.json) retains 54 expectations and topic entries across its five learning areas. Nineteen are marked `supported` with the activity still required outside the app. The curriculum check compares the entries against the hashed HTML snapshot and verifies the neighbouring Grade 6 and 8 snapshot hashes.

The lessons build on direct object pronouns and future plans from [Grade 6](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/6/franzoesisch/2-fremdsprache). New material covers relatives, indirect and stressed pronouns, the partitive and its use with *en*, the *passé composé* with both auxiliaries and its contrast with the *imparfait*. Grade 8 inversion patterns and the *plus-que-parfait* belong to the [next grade](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/8/franzoesisch/2fs).

The 39 lesson IDs and lesson contents were taken from the original path. Workshop tasks use a timeline, map, recipe steps, travel information and short dialogues. The four listening activities provide an original script for an installed French voice or a partner. Coverage rows for natural listening and audiovisual understanding, spontaneous dialogue, pronunciation feedback and independent research describe the supporting practice and its limits. The [source checks](../franzoesisch-2fs-gymnasium-7/source-checks.json) retain the original verified page titles for the sources linked in the course.

## Progress and card continuity

The second-language cell uses the existing 39 atoms and 117 practice items from `zam-academy:franzoesisch-gymnasium-7` version `2026.11.2`. The pinned snapshot is in the new package's fixtures. The move changes the namespace, lesson links and curriculum bindings for those atoms. The titles, question and answer text, prerequisites, IDs and slugs stay as published. The curriculum subject is `franzoesisch-2fs`. Keeping the published topic codes lets zam-core update existing bindings in place when it installs the cell. The first-language cell keeps its 29 atoms and 87 cards, including the already approved successor for the legacy Grade 8 imparfait card.

The tests compare the second-language cell with its source snapshot and install the two resulting cells in both orders after recording a review against every moved item. The card IDs, FSRS state, review records and content revisions must match the pre-split state. This is a move of the same IDs between cells.

On the shared Academy origin, each app reads the former combined progress entry when it has no dedicated entry. It keeps only its own lessons. Reset removes the course's entries from the old entry as well. Old hosted lesson URLs for the second-language path forward to the same lesson and task level. The first-language offline build offers an explicit online link when opened with an old second-language lesson URL.
