import type { ExerciseTask, Lesson, Level } from "../model/types";
import { type Progress, writingKey } from "../storage/progress";
import { checkAnswer } from "./checker";
import { makeExercise } from "./generators";
import { createRng, seedFrom } from "./rng";

export interface ExerciseAttempt {
  key: string;
  task: ExerciseTask;
  finished: boolean;
  assisted: boolean;
  solution: boolean;
  advanced: boolean;
  message: string;
}

export function createAttempt(
  progress: Progress,
  lesson: Lesson,
  level: Level,
): ExerciseAttempt {
  const key = writingKey(lesson.id, level);
  return {
    key,
    task: makeExercise(
      lesson.calculation!,
      createRng(seedFrom(`${key}:${progress.exerciseSerial[key] ?? 0}`)),
      level,
    ),
    finished: false,
    assisted: false,
    solution: false,
    advanced: false,
    message: "",
  };
}

function advance(progress: Progress, attempt: ExerciseAttempt): void {
  if (attempt.advanced) return;
  progress.exerciseSerial[attempt.key] =
    (progress.exerciseSerial[attempt.key] ?? 0) + 1;
  attempt.advanced = true;
}

export function submitAnswer(
  progress: Progress,
  attempt: ExerciseAttempt,
  answer: string,
) {
  if (attempt.finished) return null;
  const result = checkAnswer(attempt.task, answer);
  if (result.status === "correct") {
    attempt.finished = true;
    attempt.solution = true;
    progress.calculationDone[attempt.key] = Math.min(
      3,
      (progress.calculationDone[attempt.key] ?? 0) + 1,
    );
    advance(progress, attempt);
  }
  return result;
}

/** Persist the consumed serial before showing the answer, so reload cannot reuse it. */
export function revealSolution(
  progress: Progress,
  attempt: ExerciseAttempt,
): void {
  if (attempt.finished) return;
  attempt.assisted = true;
  attempt.finished = true;
  attempt.solution = true;
  advance(progress, attempt);
}

export function skipAttempt(
  progress: Progress,
  attempt: ExerciseAttempt,
): void {
  attempt.finished = true;
  advance(progress, attempt);
}
