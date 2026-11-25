import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { renderQuizFeedback, renderWorkshopFeedback } from "../src/feedback";
import { esc } from "../src/workshop";

describe("Feedback without answer leakage", () => {
  it.each(LESSONS)(
    "withholds the quick-check explanation after either wrong option: $id",
    (lesson) => {
      expect(renderQuizFeedback(lesson.quiz)).toBe("");
      for (const wrong of [1, 2]) {
        const feedback = renderQuizFeedback(lesson.quiz, wrong);
        expect(feedback).toContain("stimmt noch nicht");
        expect(feedback).not.toContain(esc(lesson.quiz.explanation));
        expect(feedback).not.toContain(esc(lesson.quiz.answer));
      }
      expect(renderQuizFeedback(lesson.quiz, 0)).toContain(
        esc(lesson.quiz.explanation),
      );
    },
  );
  it.each(LESSONS)(
    "reveals workshop explanations only for solved entries: $id",
    (lesson) => {
      const work = lesson.workshop;
      const right =
        work.kind === "timeline"
          ? work.entries.map((_, i) => i)
          : work.entries.map((e) => e.target);
      const missing = renderWorkshopFeedback(work, []);
      const wrong = renderWorkshopFeedback(
        work,
        right.map(() => -1),
      );
      for (const text of [missing, wrong]) {
        expect(text).not.toContain(esc(work.conclusion));
        for (const entry of work.entries)
          expect(text).not.toContain(esc(entry.feedback));
      }
      if (work.kind === "classify") {
        const partial = renderWorkshopFeedback(
          work,
          right.map((n, i) => (i === 0 ? n : -1)),
        );
        expect(partial).toContain(esc(work.entries[0].feedback));
        for (const entry of work.entries.slice(1))
          expect(partial).not.toContain(esc(entry.feedback));
        expect(partial).not.toContain(esc(work.conclusion));
      }
      const solved = renderWorkshopFeedback(work, right);
      for (const entry of work.entries)
        expect(solved).toContain(esc(entry.feedback));
      expect(solved).toContain(esc(work.conclusion));
    },
  );
});
