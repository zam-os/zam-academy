import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ALL_LESSONS, STAGES } from "../src/curriculum/index";
import { checkTask, normalizeText, parseNumber, wrongAnswerHint } from "../src/exercises/checker";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  DEFAULT_LESSON_ID,
  isLessonComplete,
  isStageComplete,
  isTransferDone,
  loadLearnerProgress,
  mergeLearnerProgress,
  overallStats,
  resetLearnerProgress,
  saveLearnerProgress,
} from "../src/storage/progress";
import type { ExerciseTask } from "../src/model/types";

const SEEDS = 40;

describe("All exercise generators across varied seeds and both levels", () => {
  for (const lesson of ALL_LESSONS) {
    it(lesson.id, () => {
      for (const generator of lesson.exercises) {
        const prompts = { 1: new Set<string>(), 2: new Set<string>() };
        for (const level of [1, 2] as const) {
          for (let seed = 0; seed < SEEDS; seed++) {
            const label = `${lesson.id} ${generator.id} seed=${seed} level=${level}`;
            const task = generator.make(createRng(seedFrom(`${seed}:${level}:${lesson.id}`)), level);
            prompts[level].add(task.prompt);
            for (const text of [task.prompt, ...task.given, ...task.steps, task.formulaHint ?? ""]) {
              expect(text, `${label}: real minus sign`).not.toMatch(/(^|[\s(:=>])-\d/);
              expect(text, label).not.toMatch(/\bNaN\b|undefined|Infinity|\[object/);
            }
            expect(task.fields.length).toBeGreaterThan(0);
            expect(task.steps.length).toBeGreaterThanOrEqual(3);
            if (level === 1) expect(task.formulaHint, `${label}: Level 1 is guided`).toBeTruthy();
            const answers = task.fields.map((field) =>
              field.kind === "choice"
                ? String(field.correctIndex)
                : field.kind === "text"
                  ? field.answers[0]
                  : field.answer.toFixed(field.digits).replace(".", ","),
            );
            expect(checkTask(task, answers).status, label).toBe("correct");
            const pointed = task.fields.map((field, index) =>
              field.kind === "number" ? field.answer.toFixed(field.digits) : answers[index],
            );
            expect(checkTask(task, pointed).status, `${label}: decimal point`).toBe("correct");
            const withUnits = task.fields.map((field, index) =>
              field.kind === "number" && field.unit ? `${answers[index]} ${field.unit}` : answers[index],
            );
            expect(checkTask(task, withUnits).status, `${label}: with unit`).toBe("correct");
            expect(checkTask(task, answers.map(() => "")).status).toBe("invalid");
            for (const [index, field] of task.fields.entries()) {
              if (field.kind === "choice") {
                expect(field.options.length, label).toBeGreaterThanOrEqual(3);
                expect(new Set(field.options).size, label).toBe(field.options.length);
                expect(field.correctIndex).toBeGreaterThanOrEqual(0);
              } else if (field.kind === "text") {
                expect(field.answers.length).toBeGreaterThan(0);
                for (const accepted of field.answers) {
                  const typed = [...answers];
                  typed[index] = accepted.toLowerCase();
                  if (!field.caseSensitive) expect(checkTask(task, typed).status, `${label}: ${accepted}`).toBe("correct");
                }
              } else {
                expect(Number.isFinite(field.answer)).toBe(true);
              }
              const wrong = [...answers];
              wrong[index] =
                field.kind === "choice"
                  ? String((field.correctIndex + 1) % field.options.length)
                  : field.kind === "text"
                    ? `${field.answers[0]}9Q`
                    : String(field.answer + Math.max(10, Math.abs(field.answer) * 2));
              expect(checkTask(task, wrong).status, label).toBe("wrong");
              expect(wrongAnswerHint(task, checkTask(task, wrong))).toBeTruthy();
              for (const slip of field.kind === "number" ? (field.slips ?? []) : []) {
                const typed = [...answers];
                typed[index] = String(slip.value).replace(".", ",");
                const result = checkTask(task, typed);
                expect(result.status, `${label}: slip ${slip.value}`).toBe("wrong");
                expect(wrongAnswerHint(task, result)).toBe(slip.hint);
              }
              for (const slip of field.kind === "text" ? (field.slips ?? []) : []) {
                const typed = [...answers];
                typed[index] = slip.value;
                const result = checkTask(task, typed);
                expect(result.status, `${label}: slip ${slip.value}`).toBe("wrong");
                expect(wrongAnswerHint(task, result)).toBe(slip.hint);
              }
            }
          }
        }
        const overlap = [...prompts[2]].filter((p) => prompts[1].has(p));
        expect(overlap, `${lesson.id} ${generator.id}: Level 1 and Level 2 differ`).toHaveLength(0);
      }
    });
  }

  it("reads German numbers and normalises typed codes", () => {
    expect(parseNumber("2,5")).toBe(2.5);
    expect(parseNumber("1.234,5")).toBe(1234.5);
    expect(parseNumber("−3")).toBe(-3);
    expect(parseNumber("12 %", "%")).toBe(12);
    expect(normalizeText(" =summe( b2 : b5 ) ")).toBe("=SUMME(B2:B5)");
    expect(normalizeText("0110 1001")).toBe("01101001");
    expect(normalizeText("=B2·C2")).toBe("=B2*C2");
    expect(normalizeText("a", true)).toBe("a");
  });
});

describe("Learner progress persistence", () => {
  const memory = new Map<string, string>();
  beforeEach(() => {
    memory.clear();
    vi.stubGlobal("localStorage", {
      getItem: (key: string) => memory.get(key) ?? null,
      setItem: (key: string, value: string) => memory.set(key, value),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it("needs quick check, every workshop goal and three Level-1 tasks; Level 2 adds the transfer badge", () => {
    const progress = loadLearnerProgress();
    expect(progress.difficultyLevel).toBe(1);
    expect(progress.activeLessonId).toBe(DEFAULT_LESSON_ID);
    const first = ALL_LESSONS[0];
    progress.quizDone.push(first.id);
    progress.labGoals[first.id] = first.lab.goals.slice(0, 2).map((g) => g.id);
    progress.solved[first.id] = { 1: 3, 2: 0 };
    expect(isLessonComplete(progress, first)).toBe(false);
    progress.labGoals[first.id] = first.lab.goals.map((g) => g.id);
    expect(isLessonComplete(progress, first)).toBe(true);
    expect(isTransferDone(progress, first)).toBe(false);
    progress.solved[first.id] = { 1: 3, 2: 3 };
    expect(isTransferDone(progress, first)).toBe(true);
    for (const lesson of ALL_LESSONS) {
      progress.quizDone.push(lesson.id);
      progress.labGoals[lesson.id] = lesson.lab.goals.map((g) => g.id);
      progress.solved[lesson.id] = { 1: 3, 2: 0 };
    }
    saveLearnerProgress(progress);
    expect(loadLearnerProgress()).toEqual(progress);
    expect(overallStats(progress, STAGES)).toMatchObject({
      total: ALL_LESSONS.length,
      completed: ALL_LESSONS.length,
      percent: 100,
      completedStages: STAGES.length,
    });
    expect(isStageComplete(progress, STAGES[0])).toBe(true);

    memory.set("informatik_rs8_academy_progress_v1", "{corrupt");
    expect(loadLearnerProgress().activeLessonId).toBe(DEFAULT_LESSON_ID);
  });

  it("merges concurrent progress across open browser tabs without losing completions", () => {
    const tabA = loadLearnerProgress();
    const tabB = loadLearnerProgress();
    const [a, b] = ALL_LESSONS;
    tabA.quizDone.push(a.id);
    tabA.labGoals[a.id] = [a.lab.goals[0].id];
    tabA.solved[a.id] = { 1: 3, 2: 0 };
    tabA.attempts[a.id] = 4;
    saveLearnerProgress(tabA);

    tabB.activeLessonId = b.id;
    tabB.difficultyLevel = 2;
    tabB.quizDone.push(b.id);
    tabB.labGoals[a.id] = [a.lab.goals[1].id];
    tabB.solved[a.id] = { 1: 1, 2: 2 };
    tabB.attempts[a.id] = 2;
    saveLearnerProgress(tabB);

    const reload = loadLearnerProgress();
    expect(reload.activeLessonId).toBe(b.id);
    expect(reload.difficultyLevel).toBe(2);
    expect(reload.quizDone).toEqual([a.id, b.id]);
    expect(reload.labGoals[a.id]).toEqual([a.lab.goals[0].id, a.lab.goals[1].id]);
    expect(reload.solved[a.id]).toEqual({ 1: 3, 2: 2 });
    expect(reload.attempts[a.id]).toBe(4);
    expect(mergeLearnerProgress(tabA, tabB).solved[a.id]).toEqual({ 1: 3, 2: 2 });

    const cleared = resetLearnerProgress();
    expect(cleared.quizDone).toEqual([]);
    expect(loadLearnerProgress().solved).toEqual({});
  });
});

describe("Exact answers of any size", () => {
  const numberTask = (
    answer: number,
    digits: number,
    tolerances: { tolerance?: number; absTolerance?: number } = {},
  ): ExerciseTask => ({
    prompt: "",
    given: [],
    steps: [],
    fields: [{ kind: "number", label: "x =", answer, unit: "", digits, ...tolerances }],
  });
  const statusOf = (task: ExerciseTask, typed: string) => checkTask(task, [typed]).status;

  it("rejects a neighbouring whole number at any size", () => {
    for (const answer of [999999999, 2999999999, 4000000001, 990000000000]) {
      const task = numberTask(answer, 0);
      expect(statusOf(task, String(answer))).toBe("correct");
      for (const off of [answer - 1, answer + 1, answer - 2, answer + 3])
        expect(statusOf(task, String(off)), String(off)).toBe("wrong");
    }
  });

  it("rejects a neighbouring last digit but accepts floating-point noise", () => {
    expect(statusOf(numberTask(9000000, 6), "9000000,000001")).toBe("wrong");
    expect(statusOf(numberTask(16, 8), "16,00000001")).toBe("wrong");
    const noisy = (0.1 + 0.2) * 1e7;
    expect(noisy).not.toBe(3000000);
    expect(statusOf(numberTask(noisy, 0), "3000000")).toBe("correct");
    expect(statusOf(numberTask(noisy, 0), "3000001")).toBe("wrong");
  });

  it("leaves deliberately tolerant and rounded answers as they are", () => {
    const relative = numberTask(2000000000, 0, { tolerance: 0.01 });
    expect(statusOf(relative, "2020000000")).toBe("correct");
    expect(statusOf(relative, "2030000000")).toBe("wrong");
    const absolute = numberTask(2000000000, 0, { absTolerance: 5 });
    expect(statusOf(absolute, "2000000005")).toBe("correct");
    expect(statusOf(absolute, "2000000006")).toBe("wrong");
    const rounded = numberTask(Math.sqrt(52), 1);
    expect(statusOf(rounded, "7,2")).toBe("correct");
    expect(statusOf(rounded, "7,3")).toBe("wrong");
    const largeRounded = numberTask(1234567.5678, 2);
    expect(statusOf(largeRounded, "1234567,57")).toBe("correct");
    expect(statusOf(largeRounded, "1240000")).toBe("correct");
    expect(statusOf(largeRounded, "1300000")).toBe("wrong");
  });
});
