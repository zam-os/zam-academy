import { afterEach, describe, expect, it, vi } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import { checkTask, parseNumberCandidates } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { createRng, seedFrom } from "../src/exercises/rng";
import type { ExerciseTask } from "../src/model/types";
import {
  isLessonComplete,
  loadLearnerProgress,
  saveLearnerProgress,
} from "../src/storage/progress";

afterEach(() => vi.unstubAllGlobals());

describe("Learner answers and progress", () => {
  it("accepts comma, point, fractions and real minus while rejecting malformed numbers", () => {
    expect(parseNumberCandidates("−15/2")).toEqual([-7.5]);
    expect(parseNumberCandidates("−7,5")).toEqual([-7.5]);
    expect(parseNumberCandidates("−7.5")).toEqual([-7.5]);
    for (const bad of ["", "-", "1/0", "1/2/3", "Wort"])
      expect(parseNumberCandidates(bad)).toEqual([]);
    const task = (answer: number, digits: number): ExerciseTask => ({
      prompt: "",
      given: [],
      steps: [],
      fields: [{ kind: "number", label: "Wert", answer, digits, unit: "" }],
    });
    expect(checkTask(task(1000000001, 0), ["1.000.000.001"]).status).toBe(
      "correct",
    );
    expect(checkTask(task(1000000001, 0), ["1.000.000.000"]).status).toBe(
      "wrong",
    );
    expect(checkTask(task(1.236, 2), ["1,24"]).status).toBe("correct");
    expect(checkTask(task(1.236, 2), ["1,23"]).status).toBe("wrong");
    expect(fmt(1.005, 2)).toBe("1,01");
    expect(fmt(-1.005, 2)).toBe("−1,01");
    expect(checkTask(task(4.175, 2), ["4,18"]).status).toBe("correct");
    expect(checkTask(task(4.175, 2), ["4,17"]).status).toBe("wrong");
  });

  it("keeps quiz, lab and both practice levels as separate completion requirements", () => {
    const data = new Map<string, string>();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => data.get(key) ?? null,
      setItem: (key: string, value: string) => data.set(key, value),
    });
    const lesson = ALL_LESSONS[0],
      progress = loadLearnerProgress();
    progress.activeLessonId = lesson.id;
    progress.quizDone = [lesson.id];
    progress.labGoals[lesson.id] = lesson.lab.goals.map((g) => g.id);
    progress.solved[lesson.id] = { 1: 3, 2: 2 };
    expect(isLessonComplete(progress, lesson)).toBe(false);
    progress.solved[lesson.id][2] = 3;
    expect(isLessonComplete(progress, lesson)).toBe(true);
    saveLearnerProgress(progress);
    expect(loadLearnerProgress()).toEqual(progress);
    progress.labGoals[lesson.id].pop();
    expect(isLessonComplete(progress, lesson)).toBe(false);
  });

  it("formats generated German numbers consistently on both levels", () => {
    expect(fmt(-1.5)).toBe("−1,5");
    const plain = (s: string) => s.replace(/<[^>]*>/g, " ");
    for (const lesson of ALL_LESSONS)
      for (const level of [1, 2] as const)
        for (let counter = 1; counter <= 80; counter++) {
          const task = lesson.exercises[
            (counter - 1) % lesson.exercises.length
          ].make(
            createRng(seedFrom(`${lesson.id}:${level}:${counter}`)),
            level,
          );
          const prose = plain(
            [
              task.prompt,
              ...task.given,
              ...task.steps,
              task.feedbackHint ?? "",
            ].join(" "),
          );
          expect(prose, lesson.id).not.toMatch(/(^|[\s(=:])-\d/);
          for (const match of prose.matchAll(/\d+(?:\.\d+)+/g)) {
            const groups = match[0].split(".");
            expect(
              groups[0].length <= 3 &&
                groups.slice(1).every((g) => g.length === 3),
              `${lesson.id}: decimal point in ${match[0]}`,
            ).toBe(true);
          }
        }
  });
});
