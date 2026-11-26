# Grade 7 Mittelschule Informatics coverage and legacy inventory

The sources are the Bavarian LehrplanPLUS Fachlehrpläne for [Informatik R7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/regelklasse)
and [Informatik M7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/mittlere-reife-klasse),
checked on 2026-11-26. Neither page specifies hours for the three Lernbereiche.
The [coverage matrix](../informatik-mittelschule-7/coverage.json) preserves the
source wording for both tracks, the SHA-256 of each HTML snapshot, and the
evidence for each lesson mapping. Run `node
informatik-mittelschule-7/scripts/check-curriculum.mjs` from the repository
root to check all 22 expectations and 28 content bullets in order.

## Shared path and progression

- **LB 1** revisits the Grade 6 source and licensing checks in the context of
  communication platforms. Learners model delivery, consider permission and
  audience, and weigh participation, data collection and media effects. M7
  explicitly includes manipulation, so transfer cases compare a clipped
  screenshot with the original and a repurposed photo with its source.
- **LB 2** uses a pixel mosaic and a live comparison to show what each
  representation stores. Learners can edit an offline sample, open a photo or
  scan from disk, or export their own vector drawing. The studio offers
  controls, while transfer tasks ask learners to choose the representation,
  edits and export themselves.
- **LB 3** builds on Grade 6 sequences and branching with the state and methods
  of an object, nested blocks, and named variables. Both levels use the same
  stepwise rover model. Transfer tasks call for independent test selection
  and changes to block placement or the condition. The Grade 8 curricula
  introduce separate topics such as digital information systems and are
  outside the package's grade scope.

The app supports real class work with example services and local files.
Taking the original photo or scan needs a capture device. Actual online
collaboration and a fully independent program from an empty project remain
classroom extensions. The matrix marks those competencies as `supported`.

## Existing ZAM histories

The ZAM inventory at
[`6ecf3bcae70f46914bacabad25e5cff992a106bb`](https://github.com/zam-os/zam/tree/6ecf3bcae70f46914bacabad25e5cff992a106bb)
contains no `de-by` Mittelschule Informatik cell for grades 6, 7 or 8. The Grade
6 Academy cell remains its own grade-specific package. Realschule and
Gymnasium cards retain their own school scopes. Accordingly, the
[migration inventory](../informatik-mittelschule-7/replaces-de-by.json) has
zero sources and zero history transfers.
