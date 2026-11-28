import { expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  createAttempt,
  revealSolution,
  skipAttempt,
  submitAnswer,
} from "../src/exercises/attempt";
import {
  checkAnswer,
  parseNumberCandidates,
  wrongAnswerHint,
} from "../src/exercises/checker";
import { makeExercise } from "../src/exercises/generators";
import type { CalculationKind } from "../src/model/types";
import {
  freshProgress,
  isComplete,
  parseProgress,
  PRACTICE_LEVELS,
  REQUIRED_CORRECT,
  writingKey,
} from "../src/storage/progress";

const samples = {
  stromkreis: [
    [0.08, "A"],
    [16, "Ω"],
  ], // 4 V across 50 Ω, then 4 V at 250 mA.
  kennlinie: [
    [32, "Ω"],
    [200, "mA"],
  ], // 4 V at 125 mA, then twice 100 mA.
  reihenschaltung: [
    [9, "V"],
    [0.12, "A"],
  ], // Sum 4 V and 5 V, then 3 V across 25 Ω.
  "parallel-haushalt": [
    [90, "mA"],
    [300, "mA"],
  ], // Sum 40 and 50, then subtract 400 and 500 from 1200.
  spiegel: [
    [20, "cm"],
    [70, "°"],
  ], // Symmetry at 20 cm, then complement of 20°.
  tempo: [
    [4, "m/s"],
    [14.4, "km/h"],
  ], // 60 m in 15 s, then 1.2 km in 5 min.
  vektoren: [
    [20, "m/s"],
    [1.6, "cm"],
  ], // 4 cm at 5 m/s per cm, then 4 m/s at 2 cm per 5 m/s.
  kraftstoss: [
    [1.6666666667, "m/s"],
    [2.4, "N"],
  ], // 0.5 N·s for 300 g, then 400 g times 6 m/s².
  beschleunigung: [
    [0.6, "m/s²"],
    [240, "N"],
  ], // Gain 3 m/s in 5 s, then 400 kg braking at 0.6 m/s².
  gewichtskraft: [
    [39.24, "N"],
    [4, "kg"],
  ], // 4 kg on Earth, then 6.48 N on the Moon.
  gleichgewicht: [
    [5, "N"],
    [9, "N"],
  ], // Difference of 9 N and 4 N, then sum of 4 N and 5 N.
  feder: [
    [0.2, "N/cm"],
    [20, "cm"],
  ], // 4 N over 20 cm, then a 6 cm extension from 14 cm.
} as const satisfies Record<
  CalculationKind,
  readonly [readonly [number, string], readonly [number, string]]
>;

it.each(Object.entries(samples))(
  "matches the independently calculated examples at both levels for %s",
  (id, expected) => {
    for (const [index, level] of PRACTICE_LEVELS.entries()) {
      const draws = [4, 5, 3];
      const task = makeExercise(
        id as CalculationKind,
        { int: () => draws.shift()! },
        level,
      );
      expect(task.unit).toBe(expected[index][1]);
      expect(task.answer).toBeCloseTo(expected[index][0], 8);
    }
  },
);

it.each([
  ["1.234,5 V", [1234.5]],
  ["−3", [-3]],
  ["1.500", [1.5, 1500]],
  ["1 200,75", [1200.75]],
  ["0,6 m/s²", [0.6]],
  ["2,,5", []],
  ["keine Zahl", []],
])("parses %s with German units and separators", (text, expected) => {
  expect(parseNumberCandidates(text)).toEqual(expected);
});

it.each([
  ["0,004", "Milliampere"],
  ["400", "100 cm"],
  ["14,4", "Tempoeinheit"],
  ["240", "Minuten"],
  ["−4", "Vorzeichen"],
  ["0,25", "geteilt"],
])("gives a targeted hint for %s when the answer is 4", (entered, hint) => {
  const task = {
    prompt: "",
    answer: 4,
    unit: "m/s",
    digits: 3,
    solutionHtml: "",
  };
  expect(wrongAnswerHint(checkAnswer(task, entered), task)).toContain(hint);
});

it("preserves serials, assisted answers and independent credit across reloads and levels", () => {
  const lesson = LESSONS[0];
  const progress = freshProgress();
  const first = writingKey(lesson.id, 1);
  const second = writingKey(lesson.id, 2);
  const skipped = createAttempt(progress, lesson, 1);
  skipAttempt(progress, skipped);
  skipAttempt(progress, skipped);
  expect(progress.exerciseSerial[first]).toBe(1);
  expect(progress.calculationDone[first]).toBeUndefined();

  const revealed = createAttempt(progress, lesson, 1);
  revealSolution(progress, revealed);
  expect(
    submitAnswer(progress, revealed, String(revealed.task.answer)),
  ).toBeNull();
  expect(progress.exerciseSerial[first]).toBe(2);
  expect(progress.calculationDone[second]).toBeUndefined();
  const nextBeforeReload = createAttempt(progress, lesson, 1);
  const restored = parseProgress(JSON.stringify(progress));
  expect(createAttempt(restored, lesson, 1).task).toEqual(
    nextBeforeReload.task,
  );

  for (const level of PRACTICE_LEVELS) {
    for (let i = 0; i <= REQUIRED_CORRECT; i++) {
      const attempt = createAttempt(restored, lesson, level);
      expect(
        submitAnswer(restored, attempt, String(attempt.task.answer))?.status,
      ).toBe("correct");
      expect(
        submitAnswer(restored, attempt, String(attempt.task.answer)),
      ).toBeNull();
      skipAttempt(restored, attempt);
    }
    expect(restored.calculationDone[writingKey(lesson.id, level)]).toBe(
      REQUIRED_CORRECT,
    );
  }
  expect(restored.exerciseSerial[first]).toBe(2 + REQUIRED_CORRECT + 1);
  expect(restored.exerciseSerial[second]).toBe(REQUIRED_CORRECT + 1);
});

it("requires both levels for completion while preserving existing Level 1 credit", () => {
  const lesson = LESSONS[0];
  const progress = freshProgress();
  progress.quizDone.push(lesson.id);
  progress.workshopDone.push(lesson.id);
  progress.explored[lesson.id] = ["1", "2"];
  const first = writingKey(lesson.id, 1);
  const second = writingKey(lesson.id, 2);
  progress.writingDone.push(first);
  progress.drafts[first] = "Der Stromkreis ist geschlossen.";
  progress.calculationDone[first] = REQUIRED_CORRECT;
  const restored = parseProgress(JSON.stringify(progress));
  expect(restored.calculationDone[first]).toBe(REQUIRED_CORRECT);
  expect(isComplete(restored, lesson.id)).toBe(false);
  restored.calculationDone[second] = REQUIRED_CORRECT;
  expect(isComplete(restored, lesson.id)).toBe(false);
  restored.writingDone.push(second);
  expect(isComplete(restored, lesson.id)).toBe(true);
});
