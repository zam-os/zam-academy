# Grade 4: seven more Number Forest lessons

The unpublished Discovery Island app now has eight selectable German lessons:
the existing place-value workshop plus comparing/ordering, number lines/
equal jumps, decomposition/complements, addition/subtraction strategies,
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
cell now has eleven atoms/thirty-four items and version 2026.11.4. It declares
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

The written-addition code/content reviews have been processed and independently
rechecked. Primary-school teacher approval and recordings remain pending.
The [review follow-up](grade-4-pr75-review-follow-up.md) records the changes
and validation; this does not complete publication acceptance.


## Written subtraction — 2026-11-02

The continuation adds the ninth draft lesson, `schriftlich-subtrahieren`
(Milos Bündeltausch). The official shared Grades 3/4 section 1.2 was read
again on 2026-11-02, together with Grades 1/2 and both Grade-5 follow-ups
linked in the plan. The lesson uses the Abziehverfahren with Entbündeln.
Operands and nonnegative differences stay at most one million; written
multiplication and division, fluency and teacher sign-off remain open.

The child explicitly trades one upper bundle for ten of the adjacent
smaller place, with both the original and current representation visible.
Zero columns require several trades. The board checks the representation
and every result digit, supports keyboard entry, and offers an exchange
reset that retains the typed result. Each lesson owns a separate IndexedDB
document; no old document or storage migration changes. Validation notices
consume no attempt; retries and hints remain assisted evidence.

Guided tasks have four/five places and zero, one or two separate exchanges.
Transfer tasks have six/five-place operands and a guaranteed exchange
through a zero tens column. Context, an addition-probe prompt and correcting
Milo's erroneous result differ from guided work. The final goal-three task
requires a corrected board rather than revealing a diagnosis. The lab also
shows 10 000 minus one; model checks include one million minus one and equal
operands. Three successes per level and three fresh exits remain mandatory.

The cell adds one atom and four items with generated ULIDs (two binary
checks and two synthesis tasks), version 2026.11.5, twelve atoms/thirty-eight
items overall. All earlier eleven atoms/thirty-four items remain unchanged
as parsed JSON. No replacement, retirement or public registration is
added. The coverage rows stay partial and unreviewed; the recording brief
is a production proposal. Current verification is recorded in acceptance.json.


## Written multiplication and division — 2026-11-02

The two requested lessons bring the local draft to eleven lessons. Section
1.2 of the current official Grades 3/4 curriculum and the Grades 1/2 and
Grade-5 follow-ups were re-read. Both lessons stay within whole numbers up
to one million. Coverage remains partial and unreviewed; practicing these
procedures is not evidence that a learner uses them automatically.

`schriftlich-multiplizieren` uses one-digit factors in guided work and
two-digit factors in transfer. The child enters each partial product digit,
each nonzero carry, and the final sum with its carries. The tens row has a
fixed ones-place zero. The addition board previews the child's own partial
entries rather than the correct model. Transfer includes full tens, context
and correcting a product calculated without shifting the tens row.

`schriftlich-dividieren` uses divisors through 10. Each dividend digit has
one visible step for the partial dividend, quotient digit, amount subtracted
and remainder. A leading quotient zero is retained in this teaching board
and omitted only when reading the whole answer; internal zeros remain.
Transfer guarantees an internal zero and includes nonzero final remainders,
division by 10 and correction. The worked check is quotient times divisor
plus remainder equals dividend, with remainder smaller than divisor.

Both lessons retain three lab goals, three successes per practice level,
three fresh exit tasks, optional practice, assistance-aware evidence and
unique rewards. Their new per-lesson documents store only the current array
of entered fields; no earlier document or migration changes. Incomplete
input and wholly omitted multiplication carries receive validation notices;
mathematical errors and hints remain assisted retries. The existing
subtraction addition-probe graphic now shows the actual missing-addend form.

The cell version is 2026.11.6 with fourteen atoms/forty-six items. Each new
lesson adds one atom and four recall items, all generated ULIDs. Earlier
content and identifiers remain unchanged; no replacement or retirement is
introduced. Publication remains local-only. Teacher review, real recordings,
rights/captions/transcripts and final manual acceptance are pending. See
acceptance.json for actual command and browser evidence, and the recording
briefs for proposed German teacher scripts.


Independent review rechecked the arithmetic, lesson gates, cards and saved
work against the package standard. Findings corrected before the PR:
keyed transient input drafts preserve edits through unrelated renders;
subtraction over-exchanges explicitly direct an exchange reset; the division
quiz increments the whole quotient; zero multiplication never proposes
division by zero; single-factor boards omit tens-row instructions; and
two-digit multiplication checks use a different additive decomposition
instead of out-of-scope two-digit division. The reviewer reported no
remaining actionable findings after targeted tests (29 across three files,
then nine for the final multiplication explanation recheck). This does not
substitute for primary-school teacher approval.


The [PR 76 review follow-up](grade-4-pr76-review-follow-up.md) records the
2026-11-03 corrections to carry feedback, separate teaching examples and
card/board copy. The current cell is 2026.11.7; all identifiers remain stable.

## Patterns and multi-step stories — 2026-11-03

Thomas requested merging PR #76 and continuing with the next two lessons.
PR #76 merged at `3577a07`; this increment starts from that main commit on
`codex/grade4-patterns-story-problems`.

| Lesson | Three workshop goals | Transfer change |
| --- | --- | --- |
| `muster-zahlbeziehungen` · Milos Musterpfad | State/extend a constant-step sequence; explain structured addition packets; build and vary ANNA numbers | Interior gaps and decreasing sequences; opposing summand changes; vary only A instead of both digits |
| `sachaufgaben-mehrschrittig` · Milos Inselplan | Choose relevant information and a plan; use intermediate results and interpret remainders; work backwards and check forwards | Less round quantities; an additional boat for a nonzero remainder; diagnose and correct a backward plan |

Each uses three workshop goals, a three-option quick check, three successful
worksheets per level, three fresh exits and optional practice. A worksheet
requires entered intermediate quantities and a justification. Initially empty
fields and wrapped radio labels keep the task usable with a keyboard or a
narrow screen. Invalid/incomplete fields do not spend an attempt. Wrong
complete work receives a hint for the first incorrect field; correction and
worked continuation stay assisted. Keyed drafts preserve rapid edits and
focus during asynchronous saving; current work resumes in its own lesson
document. Finishing or stopping an optional round clears that work and never
adds another mission reward.

Mathematical identities ignore prose and option order. The order of the two
anonymous camps is normalized. Different ANNA change rules remain distinct
investigations because their preceding rows and required reasoning differ.
The worked ANNA examples use inner digits 6/7, outside every generated row
(inner digits at most 5). The boat example uses fourteen full boats and the
quiz fifteen, outside generated counts 4–12. This prevents their answers
from being reused as purported fresh evidence. An initial review found both
a lab overlap and a generated overlap; seeds 30/25926 and sampled-domain
regressions cover the fixes. Radio values also carry the existing app focus
restorer's option identifier.

Cell `2026.11.8` has sixteen atoms/fifty-four items: thirty-two binary fast
checks and twenty-two synthesis items. Parsed-JSON comparison with the merged
main commit preserves all original fourteen atoms/forty-six items, including
ids and content. New cards live only in `cell.json`; there are no history
transfers or broad official-grade bindings. The original multi-atom workshop
still needs registry reconciliation before publication.

The official [Grades 3/4 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik)
was re-read on 2026-11-03, alongside [Grades 1/2](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/2/mathematik)
and Grade 5 [Realschule](https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/5/mathematik)
and [Gymnasium](https://www.lehrplanplus.bayern.de/fachlehrplan/gymnasium/5/mathematik).
Section 1.2 rows 08/09 and section 1.3 rows 01/02/03/05/06 are partial and
unreviewed. Numbers remain nonnegative and no larger than one million;
divisors stay at most 10. Open problem posing, independently choosing/creating
representations, collecting missing information, discussion, broader
patterns/contexts, estimation choices and systematic combinations remain
open. The supplied tables do not establish those broader competencies.
N13 (systematic combinations) remains the next inventory topic; the app's
actual lesson count is thirteen because earlier inventory positions were
split. No phase checkbox is closed.

Validation of this increment:

- App: `npm ci --offline --no-audit --no-fund`, `npm run typecheck`,
  `npm test` (107 tests), `npm run package:zip`, `npm run verify:release`;
  existing external Biome format/lint and `git diff --check`.
- Native isolated browser harness: 88 assertions, including both complete
  public-session journeys, invalid input, assisted correction, reload,
  rapid saves, focus, optional practice and unchanged reward counts.
- Built app on isolated localhost:5228: both lessons through all labs,
  quizzes, guided/transfer work and exits; an incorrect boat count and its
  correction; dated parent evidence; pending teacher panels; desktop light
  and 320px dark layouts, including an internally scrolling ANNA table.
- Root `node --test scripts/build-catalog.test.mjs scripts/academy-registry.test.mjs`:
  48 checks passed. All 37 cells and the Grade 4 disposable
  install/enrol/recall/reinstall path passed against CI-pinned zam-core 0.54.0.
- Independent agent review: 62 targeted tests across three files and diff
  check passed; no remaining actionable findings after the corrections.
  This is code/content review, not primary-school teacher approval.

The updated recording briefs are production scripts, not recorded media.
Teacher sign-off, real recordings/rights/captions/transcripts, final playback,
direct extracted-file startup, ZAM learner-UI recall and physical touch
acceptance remain pending. `publication.json` stays local-only.

## Combinations and divisors/multiples — 2026-11-03

Thomas asked to continue immediately with further lessons. This increment
reuses `codex/grade4-patterns-story-problems`, building on local commit
`3ae1644`, with two additional Number Forest lessons:

| Lesson | Workshop and practice | Transfer |
| --- | --- | --- |
| `systematisch-kombinieren` · Milos Möglichkeitenbaum | Construct a list from two/three choice rows, suppress duplicate entries, remove rows and respect a restriction | More first choices, a restriction across three rows and separate fresh exit contexts |
| `teiler-vielfache` · Milos Bündelwege | Compute quotient/remainder, complete multiples tables and find all offered divisors from 1–10 | Larger quantities, interior table gaps and contextual group-size selection |

The combination list starts empty; expected tuples are not supplied as
answer buttons. Children select one option per row and enter a tuple.
Duplicates are rejected without a failed attempt. Invalid or incomplete
builders and empty submissions are validation notices. Incomplete nonempty
lists and forbidden rows are mathematical attempts; later correction stays
assisted. A worked continuation fills a solved list explicitly as helped.
Actual choices and restrictions are retained in dated parent snapshots.

Both new lessons use a keyed action queue so rapid choices, additions and
number toggles commit in order. Two queued Next taps cannot skip a task.
List, builder choices, worksheet input and selection resume in separate new
lesson documents. Finishing/stopping a round clears current work, while
mission rewards remain unique. No previous lesson document or migration is
changed. Selecting a divisor is evidence of checking offered numbers, not
proof of practical grouping or complete number fluency.

Combination identity is based on allowed labelled assignments, independent
of displayed axis/option order. Changing a restriction changes the actual
problem. Exit contexts differ from the teaching examples, labs and practice
contexts. Divisor-selection identity is based on the quantity, independent
of its story. Transfer divisor searches use quantities above 100; lab and
guided searches stay at most 100. Division uses positive divisors 2–10.
Prime factors, formal divisibility tests, gcd/lcm, negatives, factorials and
probability rules are outside this increment.

The current official Grades 3/4 section 1.1 and 1.3 curriculum and the
Grades 1/2 and Grade 5 Realschule/Gymnasium boundaries were re-read on
2026-11-03 using the source links above. N13's simple combination scope is
represented. The initial inventory missed an explicit divisor/multiple
lesson even though coverage row 1.1-01 still named that gap; the plan now
records its refinement as N14. The actual app reaches fifteen lessons due
to earlier inventory splits. Both competency mappings remain partial and
unreviewed by a teacher. Number words, quantity estimation, open explanations,
physical work and broader representation choice remain pending; this does
not complete Number Forest or begin Measure Market.

Cell `2026.11.9` has eighteen atoms/sixty-two items: thirty-six binary fast
checks and twenty-six synthesis items. Comparison against `3ae1644` preserves
all sixteen existing atoms/fifty-four items exactly as parsed JSON. The
eighty atom/item identifiers are unique. New cards live only in `cell.json`;
there are no replacements, retirements or broad official-grade bindings.
The draft stays local-only. Teacher scripts are briefs, not approved media.

Validation:

- `npm ci --offline --no-audit --no-fund`, `npm run typecheck`, `npm test`
  (116 tests), `npm run package:zip` and `npm run verify:release` passed.
  Existing external Biome format/lint and `git diff --check` passed.
- Isolated native browser harness: 114 assertions passed, including both
  full new journeys, rapid taps/toggles, duplicate Next taps, duplicate and
  forbidden tuples, reload/resumption, help, optional practice and rewards.
- Built app on isolated localhost:5231: both complete lesson journeys,
  actual list construction/removal/duplicate checks, reload, all parent goals,
  teacher-pending panels, desktop light and 320px dark/phone controls.
  Selected combination buttons use the established action color, retaining
  white-text contrast in dark mode. No document overflow in inspected phone
  states; temporary viewport overrides were reset.
- Root catalog/registry: 48 tests passed. All 37 cells and the disposable
  Grade 4 install/enrol/recall/reinstall path passed against the CI-pinned
  zam-core 0.54.0.
- Independent review: 70 targeted tests across four suites, then nine for
  the final parent-evidence snapshot change, plus a clean diff check. The
  rapid divisor-selection issue was fixed and covered natively. No remaining
  actionable code/content findings; this is not teacher sign-off.

The strict completion gate still refuses release pending teacher approval,
real recording/rights/captions/transcript, final playback, direct-file startup,
ZAM learner-UI recall and physical touch acceptance. No phase checkbox,
publication marker or public registration changes.
