import { describe, expect, it } from "vitest";
import { curriculumUrl, findLesson } from "../src/curriculum";
import {
  createAttempt,
  revealSolution,
  skipAttempt,
  submitAnswer,
} from "../src/exercises/attempt";
import { makeExercise } from "../src/exercises/generators";
import type { Rng } from "../src/exercises/rng";
import { createRng } from "../src/exercises/rng";
import type { CalculationKind } from "../src/model/types";
import { MODEL_SCENARIOS } from "../src/models";
import { pathLesson, visitLesson } from "../src/navigation";
import {
  freshProgress,
  parseProgress,
  writingKey,
} from "../src/storage/progress";

describe("exercise attempts across reloads", () => {
  const lesson = findLesson("me-bewegung")!;
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
});

describe("curriculum preference and recovery", () => {
  it("opens another track's card without changing the selected path or curriculum URL", () => {
    const progress = freshProgress();
    expect(visitLesson(progress, "me-stoesse")?.id).toBe("me-stoesse");
    expect(progress.activeLessonId).toBe("me-stoesse");
    expect(progress.track).toBe("II_III");
    expect(curriculumUrl(progress.track)).toMatch(/wpfg2-3$/);
    expect(pathLesson(progress).tracks).toContain("II_III");
    expect(pathLesson(progress).id).not.toBe("me-stoesse");
    const restored = parseProgress(JSON.stringify(progress));
    expect(restored.track).toBe("II_III");
    visitLesson(restored, "me-stoesse");
    expect(curriculumUrl(restored.track)).toMatch(/wpfg2-3$/);
    restored.track = "I";
    expect(curriculumUrl(restored.track)).toMatch(/wpfg1$/);
    expect(pathLesson(restored).id).toBe("me-stoesse");
  });
  it("opens an optional card without switching on extra lessons", () => {
    const progress = freshProgress();
    visitLesson(progress, "ex-effektivwert");
    expect(progress.includeExtra).toBe(false);
    expect(pathLesson(progress).optional).not.toBe(true);
    expect(visitLesson(progress, "unknown")).toBeUndefined();
    expect(progress.activeLessonId).toBe("ex-effektivwert");
  });
  it("recovers missing and malformed experiment areas from each slot's own defaults", () => {
    const defaults = freshProgress().experiments;
    expect(parseProgress("{}").experiments).toEqual(defaults);
    expect(parseProgress('{"experiments":[{}]}').experiments).toEqual(defaults);
    const restored = parseProgress(
      JSON.stringify({ experiments: [{ lb: 2 }, { lb: "bad" }, { lb: 1 }] }),
    );
    expect(restored.experiments.map((e) => e.lb)).toEqual([2, 2, 1]);
  });
});

describe("German numbers and useful model comparisons", () => {
  function values(...ints: number[]): Rng {
    return { int: () => ints.shift()! };
  }
  it("formats the reviewed non-integer givens with decimal commas", () => {
    expect(makeExercise("speed", values(4, 3, 2), 2).prompt).toContain(
      "14,4 km/h",
    );
    expect(makeExercise("fall", values(4, 3, 2), 1).prompt).toContain("0,3 s");
    expect(makeExercise("energy", values(3, 3, 2), 2).prompt).toContain(
      "13,5 J",
    );
  });
  it("does not emit decimal points in any generated learner-facing numbers", () => {
    const kinds: CalculationKind[] = [
      "speed",
      "acceleration",
      "fall",
      "force",
      "energy",
      "stopping",
      "momentum",
      "collision",
      "series",
      "parallel",
      "meter",
      "range",
      "frequency",
      "transformer",
      "line",
      "halfLife",
      "decay",
      "binding",
      "dose",
      "efficiency",
      "kwk",
      "storage",
      "effective",
    ];
    for (const kind of kinds)
      for (const level of [1, 2] as const)
        for (let seed = 1; seed <= 50; seed++) {
          const task = makeExercise(kind, createRng(seed), level);
          for (const match of `${task.prompt} ${task.solutionHtml}`.matchAll(
            /\d[\d.,]*/g,
          )) {
            const number = match[0].replace(/[.,]$/, "");
            if (number.includes("."))
              expect(number).toMatch(/^\d{1,3}(?:\.\d{3})+(?:,\d+)?$/);
          }
        }
  });
  it("requires distinct model states rather than opening the same scenario twice", () => {
    for (const scenarios of Object.values(MODEL_SCENARIOS)) {
      const states = scenarios.map((s) =>
        JSON.stringify(
          Object.entries(s.values).sort(([a], [b]) => a.localeCompare(b)),
        ),
      );
      expect(new Set(states).size).toBe(scenarios.length);
    }
  });
});
