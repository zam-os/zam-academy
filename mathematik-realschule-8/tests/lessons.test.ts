import { describe, expect, it } from "vitest";
import { STAGES } from "../src/curriculum";
import { createRng, seedFrom } from "../src/exercises/rng";
import type { Lesson, Track } from "../src/model/types";
import { LERNBEREICH } from "./curriculum-map";

const TRACK_TEXT: Record<Track, string> = { I: "(I)", II_III: "(II/III)" };

/** Every text of a lesson a learner reads, without tags. */
function plainText(lesson: Lesson): string {
  return [
    lesson.title,
    lesson.subtitle,
    lesson.whyItMatters,
    lesson.explanationHtml,
    lesson.quiz.question,
    ...lesson.quiz.options,
    lesson.quiz.explanation,
    lesson.lab.title,
    lesson.lab.intro,
    ...lesson.lab.goals.map((goal) => goal.text),
    ...lesson.formulas.map((formula) => `${formula.name} ${formula.html} ${formula.quantities}`),
  ]
    .join(" \n ")
    .replace(/<[^>]+>/g, " ");
}

describe("Every lesson has the shape of the package standard (AGENTS.md, section 3)", () => {
  for (const stage of STAGES) {
    for (const [index, lesson] of stage.lessons.entries()) {
      it(`${lesson.id}`, () => {
        expect(lesson.stageId).toBe(stage.id);
        expect(lesson.stepNumber).toBe(index + 1);
        expect(lesson.title.startsWith(`${stage.stageNumber}.${index + 1} `), lesson.title).toBe(true);
        expect(lesson.tracks.length).toBeGreaterThan(0);
        const family = LERNBEREICH[lesson.id.slice(0, 2)];
        expect(family, `${lesson.id} has a known prefix`).toBeDefined();
        for (const track of lesson.tracks) {
          expect(family[track], `${lesson.id} in Zweig ${track}`).toBeDefined();
          expect(lesson.lehrplan, `${lesson.id} names its Lernbereich`).toContain(`M8 LB ${family[track]} ${TRACK_TEXT[track]}`);
        }
        // Explanation with worked example and key rule; formulas or key terms.
        expect(lesson.explanationHtml).toContain('<div class="example">');
        expect(lesson.explanationHtml).toContain('<div class="merke">');
        expect(lesson.explanationHtml.replace(/<[^>]+>/g, " ").length, `${lesson.id}: explanation is a real text`).toBeGreaterThan(900);
        expect(lesson.formulas.length).toBeGreaterThan(0);
        // Quick check with plausible wrong answers and an explanation.
        expect(lesson.quiz.options.length).toBeGreaterThanOrEqual(3);
        expect(new Set(lesson.quiz.options).size).toBe(lesson.quiz.options.length);
        expect(lesson.quiz.correctIndex).toBeLessThan(lesson.quiz.options.length);
        expect(lesson.quiz.explanation.length).toBeGreaterThan(40);
        // Lab with exactly three goals, two task generators, three right tasks per level.
        expect(lesson.lab.goals).toHaveLength(3);
        expect(lesson.lab.readouts.length).toBeGreaterThan(0);
        expect(lesson.exercises.length).toBeGreaterThanOrEqual(2);
        expect(new Set(lesson.exercises.map((e) => e.id)).size).toBe(lesson.exercises.length);
        expect(lesson.requiredCorrect).toBe(3);
        expect(lesson.celebrationMessage.length).toBeGreaterThan(10);
      });
    }
  }
});

describe("Every lesson writes in the conventions of Mathematik 8", () => {
  for (const stage of STAGES) {
    for (const lesson of stage.lessons) {
      it(`${lesson.id}`, () => {
        const text = plainText(lesson);
        // The real minus sign, never a hyphen before a number.
        expect(text, `${lesson.id}: hyphen as minus`).not.toMatch(/(^|[\s(=:|,{±;[\]])-\d/);
        // Grade 8 works over ℚ; the real numbers come in grade 9 (M9 LB 1).
        expect(text, `${lesson.id}: ℝ belongs to grade 9`).not.toMatch(/ℝ|\\mathbb/);
        // No LaTeX or Markdown in HTML text.
        expect(text, `${lesson.id}: no LaTeX`).not.toMatch(/\\[a-z]+|\$\$|\*\*/);
        // Decimal comma: "2.5" is an English number. Lesson numbers ("Lektion 4.3")
        // and thousands separators ("1.000") are German.
        const numbersOnly = text.replace(lesson.title, " ").replace(/Lektion(en)? \d+\.\d+/g, " ");
        expect(numbersOnly, `${lesson.id}: decimal point`).not.toMatch(/\d\.(\d{1,2}|\d{4,})(?!\d)/);
      });
    }
  }
});

describe("Level 2 is another task than Level 1 (AGENTS.md, section 3)", () => {
  for (const stage of STAGES) {
    for (const lesson of stage.lessons) {
      it(`${lesson.id}`, () => {
        for (const generator of lesson.exercises) {
          let differs = 0;
          for (let i = 0; i < 20; i++) {
            const seed = seedFrom(`${lesson.id}:levels:${i}`);
            const one = generator.make(createRng(seed), 1);
            const two = generator.make(createRng(seed), 2);
            if (one.prompt !== two.prompt) differs++;
          }
          expect(differs, `${lesson.id}/${generator.id}: Level 2 changes the task`).toBeGreaterThanOrEqual(18);
        }
      });
    }
  }
});
