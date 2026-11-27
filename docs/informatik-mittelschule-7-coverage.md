# Grade 7 Mittelschule Informatics coverage and legacy inventory

Both Fachlehrpläne were fetched live from LehrplanPLUS Bayern on 2026-11-26.
Neither page specifies hours for the three Lernbereiche. The fixtures in
`informatik-mittelschule-7/tests/fixtures/` compress the downloaded HTML.
The SHA-256 digests are for the decompressed bytes.

| Track | Snapshot | SHA-256 |
| --- | --- | --- |
| [Informatik R7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/regelklasse) | `curriculum-r.html.gz` | `f6e3c7d0eced2e55b13bb76bac5a111f2409e024387b34dbc23f409b8b24c5c1` |
| [Informatik M7](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/7/informatik/mittlere-reife-klasse) | `curriculum-m.html.gz` | `dde4e6a32aba504e4a778551fd31a98bae5bfafcfd6388d8df2fa9967086e775` |

The [coverage matrix](../informatik-mittelschule-7/coverage.json) records the
source wording and evidence for each lesson. Run
`node informatik-mittelschule-7/scripts/check-curriculum.mjs` from the repository
root to check all 22 expectations and 28 content bullets in order. The
package's `npm test` also runs this check.

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

Seven competence expectations differ between the tracks.

- In LB 1, R7 describes how platforms work, assesses personal consequences
  and evaluates ethical questions with guidance. M7 explains the technical
  basis, considers consequences more broadly and evaluates ethical questions
  with greater independence.
- In LB 2, M7 works largely independently when editing raster images and
  changing vector objects. R7 gets guidance in both activities.
- In LB 3, M7 creates objects largely independently and implements algorithmic
  structures and variables independently. R7 creates objects with guidance
  and implements with greater support. Both tracks test programs largely
  independently.

The expected independent object creation in M7 LB 3.1 is marked as
`supported`. Students can run and inspect object creation in the prepared
rover workshop. They practise creating objects in a project they set up
themselves in class. The matrix also marks real image capture, live
platform collaboration, and programming from a blank project as classroom
extensions. The image-rights lesson serves both LB 1 and LB 2.

## Existing ZAM histories

The ZAM inventory at
[`6ecf3bcae70f46914bacabad25e5cff992a106bb`](https://github.com/zam-os/zam/tree/6ecf3bcae70f46914bacabad25e5cff992a106bb)
contains no `de-by` Mittelschule Informatik cell for grades 6, 7 or 8. The
[migration inventory](../informatik-mittelschule-7/replaces-de-by.json) has
zero sources and zero history transfers. On 2026-11-26, Thomas confirmed
that the following three cells stay with their respective school types.

| Legacy cell | Overlap in this package |
| --- | --- |
| `de-by:realschule-8-informatik-objektorientierung-vektorgrafik` | Raster and vector graphics, vector objects |
| `de-by:gymnasium-6-natur-technik-informatik-vektorgrafik-texte` | Raster and vector graphics, vector objects |
| `de-by:gymnasium-7-informatik-objektorientierung-hypertext-datenstrukturen` | Objects and methods |
