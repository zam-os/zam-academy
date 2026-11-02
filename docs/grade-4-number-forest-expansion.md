# Grade 4: seven more Number Forest lessons

The unpublished Discovery Island app now has eight selectable German lessons:
the existing place-value workshop plus comparing/ordering, number lines/
equal jumps, decomposition/complements, addition/subtraction strategies
multiplication/inverse division, and written addition. This batch expands the draft;
it does not complete the annual course, its teacher review, recordings or
publication acceptance. Thomas requested further lessons while the original
recording remains pending, so the earlier phase-order restriction does not
block this independent lesson work.

## Curriculum check — 2026-11-02

Read the current official [Mathematik 3/4 Fachlehrplan, sections 1.1 and 1.2](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik),
including comparison/order, the number line, flexible counting and additive
number decomposition, scaled arithmetic facts, strategies, notes and inverse
checks. The existing verbatim 54-position inventory remains
in coverage.json. Only the touched 1.1/1.2 positions have a new check date;
other rows retain their earlier dates. There are no Zweige in this shared
Grades 3/4 plan and no prescribed hours per learning area on this page.

Checked the [Grades 1/2 foundations](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/2/mathematik)
and the neighbouring Grade 5 curricula for [Mittelschule](https://www.lehrplanplus.bayern.de/fachlehrplan/mittelschule/5/mathematik),
[Realschule](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/mathematik)
and [Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/mathematik).
This batch stays within whole numbers from 0 to one million. Negative
numbers, other number systems and larger number ranges are outside it.
The course sequence is our teaching proposal, not an official Grade 3/4
split or teacher approval.

| Lesson id | Activity and practice | Coverage positions |
| --- | --- | --- |
| `zahlen-vergleichen-ordnen` | Sign gate; first differing position; ascending triples; guided comparisons and transfer/reasoning | 1.1-01, comparison part of 1.1-04 |
| `zahlenstrahl-zahlenspruenge` | Native slider/keyboard leaf placement; varied scales/start offsets; read marks and jump both ways | 1.1-01 |
| `zahlen-zerlegen-ergaenzen` | Coupled part-whole bars; choose place-value parts; missing parts and constant-sum reasoning | 1.1-05 |
| `geschickt-addieren` | Movable addition/correction jumps; scaled sums, intermediate values, context and compensation | Parts of 1.2-02/03/04/05/07 |
| `geschickt-subtrahieren` | Movable subtraction/correction jumps; differences, inverse addition checks, context and compensation | Parts of 1.2-02/03/04/05/07 |
| `malnehmen-teilen` | Equal baskets; small and scaled facts, sharing/grouping, missing factors and inverse checks | Parts of 1.2-01/02/03 |
| `schriftlich-addieren` | Enter result digits/carries; different lengths, zero positions, carry chain to one million, context/correction/error reasoning | Parts of 1.2-03/05/06/07 |

All mapped rows remain partial and await primary-school teacher review.
Divisors/multiples, physical estimation and Fermi work are still gaps. No
rounding lesson, full written-arithmetic coverage, full multiplication-table automatisation
or full 1.1/1.2 coverage is claimed. Number words and further
representations also remain outside this batch.

## Lesson and persistence model

Each lesson has a full worked explanation, a key rule, a three-option
reasoning check, exactly three reachable lab goals, distinct generators at
two levels with three successful tasks per level, three fresh exit checks,
immediate optional practice and later checks after a real elapsed day.
Hints/retries and worked-solution continuation are labelled as assisted.
Milo awards each mission once, regardless of assistance; optional practice
cannot mint more food. No absence penalty, ranks or timed score is added.

The existing transactional document store now accepts a typed create/validate
contract. The original workshop keeps its unchanged document/namespace. Each
new lesson has its own namespace and evidence; navigation cannot transfer
rewards or claim another lesson's progress. There is no draft migration,
version compatibility or new dependency. The first publication starts all
learners at zero as previously requested. Current saves still resume and
corrupt saves still require explicit recovery.

Parent examples are captured at the time of the attempt. Independent
observations require a correct first response to an exit/later task without
help; repeated copies of a question do not become fresh evidence. This is
local practice evidence, not a school grade or a ZAM/FSRS review history.

## Cell and media

Twenty-two German cards are authored only in cell.json: one atom per added
lesson, three items in each earlier lesson and four for written addition,
with generated ULIDs and source links to their own lesson.
All four original atoms and twelve original items remain unchanged. The
cell now has eleven atoms/thirty-four items and version 2026.11.3. It declares
no replacements or retirements and transfers no existing learning history.
The narrow official binding remains deferred for the previously documented
kernel-scope reason. The initial workshop still has four atomic goals;
public registry integration must resolve that existing lesson/atom contract.

The separate [recording briefs](../mathematik-grundschule-4/docs/number-forest-recording-briefs.md)
contain German scripts, examples and handoff requirements. No recording,
rights, caption file, transcript or teacher approval is invented. Missing
media is visible in every lesson. The package remains local-only and stays
out of the public catalog and Pages list.

## Verification

Current commands and observed browser checks are recorded in the PR and the
app's acceptance.json. The added tests cover independent numeric oracles,
all lab witnesses, level differences, mandatory practice gates, assistance,
repeat-task detection, corrupted documents and lesson isolation. The native
browser harness tests the shared store with isolated generated test names.
Direct file startup, final media playback, physical touch hardware and the
ZAM learner UI remain pending as already documented for the starter.

The required second-agent review found two integration issues: shared Milo
pause state and startup route registration order. Both were corrected and
rechecked; the reviewer reported no remaining actionable findings. This code
review does not substitute for the pending primary-school teacher approval.


The arithmetic review also caught reworded calculations being treated as
fresh evidence, quizzes attached to the wrong goals, and an undefined colour
variable hiding jump arcs. Canonical fact-family identity now includes
workshop models, commuted and inverse operations. Quiz goals are explicit,
and the arcs use the existing theme-aware purple. Seeded regressions (88 and 290)
cover the repeated-fact cases. A sampled-model test also prevented a negative
value at an unused extreme of the first subtraction slider. The second agent
rechecked the fixes and reported no remaining actionable findings; teacher
review remains pending.


## Written addition — 2026-11-02

Re-read the current official section 1.2 written-procedure expectation and
its strategy/notation/checking context, plus the Grades 1/2 foundations and
Grade 5 curricula linked above. This lesson covers two summands only, with
sums at most one million. Further addition fluency/more summands and written
subtraction, multiplication and division remain open; no automation or full
1.2 coverage is claimed.

The board validates result digits and every incoming carry independently.
Blank carry cells mean zero. Work is saved in a thirteen-cell field only in
the new lesson's document; older lesson documents require no changes or
migration. Successful digit saves preserve the input node and focus. Wide
boards scroll inside a constrained card, starting at the ones side; scroll
position is retained while editing. Correction tasks remain editable, while
error-reasoning displays are read-only. Browser testing caught and corrected
focus replacement, the correction-board mode and small-screen overflow.

The new lesson is pushed for the review round requested after implementation.
The earlier second-agent review applies to the previous six-lesson expansion;
written-addition code/content review and primary-school teacher approval are
still pending. Recording scripts are prepared, with no invented media.
