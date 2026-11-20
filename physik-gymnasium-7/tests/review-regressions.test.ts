import { describe, expect, it } from "vitest";
import { findLesson, LESSONS } from "../src/curriculum";
import {
  createAttempt,
  revealSolution,
  skipAttempt,
  submitAnswer,
} from "../src/exercises/attempt";
import { checkAnswer, wrongAnswerHint } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { makeExercise } from "../src/exercises/generators";
import type { Rng } from "../src/exercises/rng";
import { createRng } from "../src/exercises/rng";
import type { CalculationKind } from "../src/model/types";
import { pathLesson, visitLesson } from "../src/navigation";
import {
  freshProgress,
  parseProgress,
  writingKey,
} from "../src/storage/progress";

describe("exercise attempts across reloads", () => {
  const lesson = findLesson("dichte")!;
  it("consumes a revealed task before serialization and restores a new attempt without credit", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 1);
    revealSolution(progress, attempt);
    expect(progress.exerciseSerial[attempt.key]).toBe(1);
    expect(progress.calculationDone[attempt.key] ?? 0).toBe(0);
    expect(
      submitAnswer(progress, attempt, String(attempt.task.answer)),
    ).toBeNull();
    const restored = parseProgress(JSON.stringify(progress));
    const next = createAttempt(restored, lesson, 1);
    expect(next.task.prompt).not.toBe(attempt.task.prompt);
    expect(next.solution).toBe(false);
    expect(restored.calculationDone[attempt.key] ?? 0).toBe(0);
  });
  it("does not advance twice when moving on from a revealed or correctly solved task", () => {
    const progress = freshProgress(),
      assisted = createAttempt(progress, lesson, 1);
    revealSolution(progress, assisted);
    revealSolution(progress, assisted);
    skipAttempt(progress, assisted);
    expect(progress.exerciseSerial[assisted.key]).toBe(1);
    const independent = createAttempt(progress, lesson, 1);
    expect(
      submitAnswer(progress, independent, String(independent.task.answer))
        ?.status,
    ).toBe("correct");
    expect(
      submitAnswer(progress, independent, String(independent.task.answer)),
    ).toBeNull();
    skipAttempt(progress, independent);
    expect(progress.exerciseSerial[independent.key]).toBe(2);
    expect(progress.calculationDone[independent.key]).toBe(1);
  });
  it("keeps incorrect and empty submissions retryable and skipped attempts uncredited", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 1);
    expect(submitAnswer(progress, attempt, "")?.status).toBe("invalid");
    expect(submitAnswer(progress, attempt, "9999")?.status).toBe("wrong");
    expect(progress.exerciseSerial[attempt.key]).toBeUndefined();
    skipAttempt(progress, attempt);
    expect(
      submitAnswer(progress, attempt, String(attempt.task.answer)),
    ).toBeNull();
    expect(progress.calculationDone[attempt.key]).toBeUndefined();
  });
  it("does not credit a reveal in level 2 to level 1", () => {
    const progress = freshProgress(),
      attempt = createAttempt(progress, lesson, 2);
    revealSolution(progress, attempt);
    expect(progress.exerciseSerial[writingKey(lesson.id, 1)]).toBeUndefined();
    expect(progress.calculationDone[writingKey(lesson.id, 1)]).toBeUndefined();
  });
  it("stops counting at the three tasks a lesson requires", () => {
    const progress = freshProgress();
    for (let i = 0; i < 5; i++) {
      const attempt = createAttempt(progress, lesson, 1);
      submitAnswer(progress, attempt, String(attempt.task.answer));
    }
    expect(progress.calculationDone[writingKey(lesson.id, 1)]).toBe(3);
  });
});

describe("navigation and recovery", () => {
  it("opens a card's lesson and resumes the path there", () => {
    const progress = freshProgress();
    expect(pathLesson(progress).id).toBe("beobachten");
    expect(visitLesson(progress, "finsternisse")?.id).toBe("finsternisse");
    expect(pathLesson(progress).id).toBe("finsternisse");
    expect(visitLesson(progress, "unknown")).toBeUndefined();
    expect(progress.activeLessonId).toBe("finsternisse");
    expect(parseProgress(JSON.stringify(progress)).activeLessonId).toBe("finsternisse");
    expect(LESSONS).toHaveLength(21);
  });
});

describe("German numbers and targeted hints", () => {
  function values(...ints: number[]): Rng {
    return { int: () => ints.shift()! };
  }
  const kinds: CalculationKind[] = ["dichte", "differenz", "bauteil"];
  it("formats non-integer givens with decimal commas", () => {
    expect(makeExercise("dichte", values(4, 3, 0), 1).prompt).toContain("54 g");
    expect(makeExercise("dichte", values(4, 3, 1), 2).prompt).toContain("ρ = 7,8 g/cm³");
    expect(makeExercise("differenz", values(4, 3, 3), 1).prompt).toContain("79,1 g");
    expect(makeExercise("bauteil", values(4, 3, 0), 2).prompt).toContain("1.170 g");
    expect(fmt(-0.0001)).toBe("0");
    expect(fmt(-2.5)).toBe("−2,5");
    expect(fmt(1234.5)).toBe("1.234,5");
  });
  it("does not emit decimal points in any generated learner-facing numbers", () => {
    for (const kind of kinds)
      for (const level of [1, 2] as const)
        for (let seed = 1; seed <= 80; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          const text = `${task.prompt} ${task.solutionHtml} ${task.formulaHint}`;
          for (const match of text.matchAll(/\d[\d.,]*/g)) {
            const number = match[0].replace(/[.,]$/, "");
            if (number.includes("."))
              expect(number, text).toMatch(/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/);
          }
          // Real minus sign and "·" in learner text.
          expect(text).not.toMatch(/\d\s*\*\s*\d/);
          expect(text).not.toMatch(/[= (]-\d/);
          expect(text).not.toMatch(/NaN|undefined|Infinity/);
        }
  });
  it("names the typical slips: unit factor and swapped division", () => {
    // Plate of 4 dm³ copper: 35,2 kg; in grams 35 200.
    const plate = makeExercise("dichte", values(4, 3, 2), 2);
    expect(plate.answer).toBeCloseTo(35.2);
    expect(wrongAnswerHint(checkAnswer(plate, "35200"), plate)).toContain("Faktor 1000");
    // Stone of 2,7 g/cm³ asked in kg/m³.
    const stone = makeExercise("differenz", values(4, 3, 2), 2);
    expect(wrongAnswerHint(checkAnswer(stone, "2,7"), stone)).toContain("Faktor 1000");
    // V / m instead of m / V.
    const cube = makeExercise("dichte", values(4, 3, 0), 1);
    expect(cube.answer).toBeCloseTo(2.7);
    expect(wrongAnswerHint(checkAnswer(cube, String(1 / 2.7)), cube)).toContain("falschen Wert geteilt");
  });
});
