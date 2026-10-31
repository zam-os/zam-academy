# Discovery Island: first place-value lesson

**Status:** The local German lesson is implemented. Content and teacher
script still await primary-school teacher review, and no teacher recording
has been supplied. See the app's acceptance record for remaining checks.
**Date:** 2026-10-31
**Plan:** [Grade 4 mathematics implementation plan](../plans/2026-10-31-grade-4-discovery-island.md).

## Lesson contract

| Field | Initial value |
| --- | --- |
| App folder | `mathematik-grundschule-4/` |
| Cell | `zam-academy:mathematik-grundschule-4` |
| World | Number Forest |
| Lesson id | `stellenwerte-buendeln` |
| German lesson title | „Milos Stellenwert-Werkstatt“ |
| First-lesson number range | Whole numbers from 0 to 9,999 |
| Starting representations | Ones, tens, hundreds, thousands; E, Z, H, T |
| Main journey | Two resumable missions of approximately 6–8 minutes each |
| Teacher video | One original, reviewed German clip, approximately 2–3 minutes, with chapters |
| Lesson source link | `https://academy.zam-os.org/mathematik-grundschule-4/#lesson=stellenwerte-buendeln` |

The complete learner and parent interface is German, including navigation,
buttons, Milo's messages, help, feedback, settings, errors and accessibility
labels. English names and examples in this engineering document describe
the implementation; they are not interface copy. Teacher speech, captions,
transcripts, explanations and exercises are German as well. Conversation
with Thomas may be German; repository/GitHub prose, reviews, PR text and
release text remain English.

This is a complete foundational lesson inside a Grade 4 course. It does not
claim to finish the whole place-value curriculum. Larger numbers and the
number line follow in separate lessons. Subtraction is not an entry
requirement or the exit test of this lesson. The earlier concept's
`132 − 48` task is not its learning contract.

The [official shared Grades 3/4 curriculum](https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/mathematik)
provides the alignment, particularly M3/4 1.1. This lesson is the opening
part of that alignment; teacher sign-off determines the final progression.

## Observable goals

Use these locally authored goals to design and check the lesson:

| Key | Child can show | Initial task and a distinct later task |
| --- | --- | --- |
| G1 | Read a digit's value from its column | The 4 in 3,402 represents 400; later use the 2 in 5,206 |
| G2 | Translate a number into a table and back | Build 2,047; later read 3 T, 0 H, 4 Z, 2 E |
| G3 | Explain why an empty column must be preserved | Distinguish 306, 36 and 360; later distinguish 4,060 and 460 |
| G4 | Exchange groups in both directions without changing the number | Bundle 10 E into 1 Z; exchange 1 H in 142 for 10 Z |

The English number punctuation above is for this engineering document.
German exercises use grouping spaces or the reviewed German convention;
never use a decimal comma to group thousands. The learner sees complete
German prompts, with a short vocabulary legend for the abbreviations.

## Mission A: build the workshop

1. Milo welcomes the child. Show one Start action and a short German goal:
   „Wir bauen Zahlen und entdecken, was jede Stelle bedeutet.“
2. Offer two untimed entry tasks: read a three-digit representation and
   bundle ten ones. Offer a short worked foundation step when needed;
   allow skipping the check. Do not label the child by ability or grade.
3. Offer teacher-video chapters A and B, alongside the same illustrated
   explanation. Video watching is optional and earns no completion credit.
4. Build `306` and `2 047` by moving or selecting blocks into E/Z/H/T
   columns. Empty columns remain visibly present. A button/keyboard route
   provides every action available by dragging.
5. Ask for the value of a highlighted digit in a fresh number. Distinguish
   the digit itself from the amount it represents.
6. Plant a small workshop flower after the guided activity has been worked
   through, including a supported correction. Save and offer a clear break.

## Mission B: exchange without losing anything

1. Resume without a new onboarding sequence. Offer chapters C and D of the
   same video, or the written steps.
2. Bundle ten ones into one ten; then exchange a hundred for ten tens.
   Display the number before and after. The invariant is the total value,
   not the number of visible pieces.
3. In the workshop story, organise the same building supplies in different
   bundles. The completed exchange changes a visible part of the workshop;
   its quantities agree with the mathematical model.
4. Ask the child to identify a valid representation and choose a reason,
   then explain it aloud to Milo or on paper. A self-reported explanation
   is recorded as such; it is not automatically marked correct.
5. Offer three fresh, untimed exit tasks covering G1/G2, G3 and G4. The
   first attempt of each is recorded separately from helped retries.
6. Show a concrete learning summary, one snack for Milo, and Finish. The
   child can stop earlier and resume later without losing a reward.

## Task and feedback contract

Use seeded task families with independently checked mathematical oracles;
do not hard-code the demonstration values as the whole exercise bank.

| Family | Input | Checker | Targeted help |
| --- | --- | --- | --- |
| Read/build | Table or labelled blocks, then integer/table input | Weighted sum and exact required columns | Keep the empty place visible |
| Digit value | Number plus highlighted column | Digit multiplied by column weight | Name the place before its amount |
| Zero | Two plausible arrangements | Exact table interpretation | Compare the hundreds or tens column |
| Bundle | Ten units selected in one column | Count and weighted-sum invariants | Select ten of the same unit |
| Exchange | One unit in a non-ones column | Remove one; add ten in the next lower column | Show equal value before and after |
| Reason | A representation and two reviewed explanations | Authored correct reason, not text similarity | Show the concrete exchange again |

Accept harmless whitespace and the agreed grouping separator in integer
answers. Reject decimals, exponents and trailing text clearly. Never use
`parseInt` prefix acceptance or floating-point tolerances for these tasks.
Model intermediate columns above nine during exchanges; canonical display
and valid intermediate representations are different states.

Check boundaries including `0`, `10`, `100`, `1 000`, `9 999`, multiple
zero columns, unavailable exchanges and the upper bound. Undo preserves
the mathematical value. Reset changes only the current task. Hints and
worked solutions mark that task attempt as helped; replaying the solution
cannot create an independent success.

After several unsuccessful attempts, offer a worked example, an easier
variant or a break. Every activity stays escapable. “Practised” means the
guided journey was worked through; “solved independently” requires a
correct first response on a fresh task without assistance. A completed
lesson is not a claim that every goal was mastered.

## Teacher recording: executable production brief

Thomas/product arranges a qualified primary-school teacher and the filming
slot. Engineering can complete the rest of Phase 1 while this is pending.
An agent must not claim to have recruited, commissioned or obtained consent
from a teacher, nor substitute an invented teacher or synthetic identity.

| Approximate segment | Picture and action | German spoken draft |
| --- | --- | --- |
| 0:00–0:15 · welcome | Real teacher on screen, Milo beside the workbench | „Heute helfen wir Milo, seine Werkstatt zu ordnen. Dabei entdecken wir: Der Platz einer Ziffer verrät uns ihren Wert.“ |
| 0:15–0:45 · chapter A | Hands place 3 H, 0 Z, 6 E in a labelled table | „Hier liegen drei Hunderter und sechs Einer. Bei den Zehnern liegt nichts. Die Zahl heißt dreihundertsechs. Die Null hält den Platz für die Zehner frei.“ |
| 0:45–1:05 · chapter B | Compare 306 and 360, then a thousands example | „Wenn die Sechs zu den Zehnern wandert, ist sie sechzig wert. Dann entsteht eine andere Zahl. Jede Spalte hat ihren eigenen Wert.“ |
| 1:05–1:35 · chapter C | Count ten ones, exchange for one ten, then reverse | „Zehn Einer sind genauso viel wie ein Zehner. Wir dürfen sie bündeln und auch wieder entbündeln. Die Menge bleibt gleich.“ |
| 1:35–2:05 · chapter D | Exchange one hundred in 142 for ten tens; retain four tens and two ones | „Ein Hunderter sind zehn Zehner. Zusammen mit den vier Zehnern haben wir jetzt vierzehn Zehner und zwei Einer. Es bleibt hundertzweiundvierzig.“ |
| 2:05–2:30 · invitation | Teacher returns; new empty table, without revealing a task answer | „Jetzt bist du dran. Baue eine Zahl für Milo und probiere einen Tausch aus. Prüfe: Ist die Zahl noch genauso viel wert?“ |

The teacher reviews and corrects this draft before recording. Segment
lengths are targets; allow quiet pauses for the manipulations rather than
speeding up speech. The final transcript must match what was actually
recorded.

Delivery: final MP4 playable in the tested browsers; German WebVTT captions;
chapter timecodes; poster; accessible illustrated transcript; and a media
register entry with teacher/creator attribution, review date, asset hash,
permission reference and scope of online/offline distribution. Keep signed
personal paperwork outside the public repository; publish only the rights
metadata and approved attribution. Target a compact 720p clip, initially
under 15 MiB, then verify visual legibility and playback on pilot devices.

Use native controls, deliberate playback, captions and chapter navigation.
Load video bytes only when requested. First-party distribution is the
default. No YouTube iframe, autoplay, account requirement or unreviewed
external link replaces the first milestone's recording. The text/activity
path remains fully usable if video cannot play; report playback failure
and provide a retry. A storyboard is a work product, not completion of the
teacher-video deliverable.

## Milo, evidence and recall

Milo has curious, welcoming, encouraging, celebrating, resting and enjoying
a snack states. Still frames carry the same meaning with reduced motion.
Care remains available before any reward. Wrong answers never remove food,
affection or decorations. Time away produces a welcome, not a health loss.

Mission rewards are deterministic and granted once per lesson/mission
content contract, including supported completion. Save the completion and
its earned reward in one state update; reopening, resubmitting or a second
browser tab cannot earn it twice. Use a stable lesson/mission reward key;
a normal code or content-version update does not grant the reward again.
Derive available rewards from the unique grant set rather than incrementing
a balance on every completion event. Decorative changes have an explicit
reduced-motion equivalent. Sound starts off and never carries information
by itself.

Store only local progress needed to resume and show evidence: lesson and
task versions, task family/seed, timestamp, first response outcome, help
used and completion/reward markers. Use ULIDs where persistent records
need ids. No microphone recording, free-text transcripts or child name is
required. An on-device “For parents” view is a presentation switch, not an
authentication boundary or a remote parent account.

The parent view uses actual records and identifies their source:
“practised”, “with help”, “solved independently”, or “checked on a later
day”. Show the date and the relevant example. A later-visit check uses new
variants and records its actual interval; repeated same-session success
does not become delayed-recall evidence. This is an optional check, not an
alternative FSRS scheduler. ZAM review history stays in ZAM and is not read
or fabricated by the static app.

Use a versioned IndexedDB state document behind one small asynchronous
app-storage module. Commit a completed mission and its reward markers in
one read/write transaction, including concurrent-tab handling. Preferences
such as sound can use local storage separately. If persistent storage is
unavailable, keep the current run in memory and show that it cannot be
resumed after closing. Do not silently overwrite an unreadable saved state;
offer a recovery/export path and an explicit fresh start. This browser
store is separate from ZAM's kernel `Database` and review history.

Create four narrow knowledge atoms for G1–G4 in the cell, with approximately
one or two reviewed practice items per atom. Exact counts follow the
review; every item asks one point. The cell is the sole card source.
Generated workshop exercises are practice, not a second exported card set.
Card text follows the segment/write contracts; formula segments carry
speech and images carry alt text. Pin lesson links and genuine ULIDs before
the first release. Validate installation and enrolment with the approved
core in a disposable ZAM library, then review the prepared cards in the
existing UI. Test lesson hashes against the local app build. Live Academy
listing/enrolment and public HTTP links are checked after authorised
publication in Phase 2; the local origin never replaces Academy's pinned
origin in ZAM.

## First-lesson acceptance

Phase 1 is complete only when the primary plan's first-milestone checklist
passes with this lesson, the real recording and a signed-off content review.
The review records any change in scope or examples before implementation
silently follows a different brief. User-facing course copy identifies this
release as a place-value starter until the rest of the course is ready.
