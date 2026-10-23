import type { Exercise, Lesson, Level } from "../model/types";
import { keyOf, type Progress } from "../storage/progress";
import { checkExercise } from "./checker";
import { makeExercise } from "./generators";
import { createRng, seedFrom } from "./rng";

export interface Attempt {
  key: string;
  task: Exercise;
  finished: boolean;
  revealed: boolean;
  advanced: boolean;
  credited: boolean;
  values: string[];
}

export function createAttempt(p: Progress, lesson: Lesson, level: Level): Attempt {
  if (!lesson.practice) throw new Error("Diese Lektion besitzt keine Rechenaufgabe.");
  const key = keyOf(lesson.id, level);
  return {
    key,
    task: makeExercise(lesson.practice, createRng(seedFrom(`${key}:${p.serial[key] ?? 0}`)), level),
    finished: false,
    revealed: false,
    advanced: false,
    credited: false,
    values: [],
  };
}

function advance(p: Progress, a: Attempt) {
  if (a.advanced) return;
  p.serial[a.key] = (p.serial[a.key] ?? 0) + 1;
  a.advanced = true;
}

export function submitAttempt(p: Progress, a: Attempt, values: string[]) {
  if (a.finished) return false;
  a.values = [...values];
  if (!checkExercise(a.task, values)) return false;
  a.finished = true;
  a.credited = true;
  p.solved[a.key] = Math.min(3, (p.solved[a.key] ?? 0) + 1);
  advance(p, a);
  return true;
}

/** Caller persists the consumed serial before rendering a solution. */
export function revealAttempt(p: Progress, a: Attempt) {
  if (a.finished) return;
  a.finished = true;
  a.revealed = true;
  advance(p, a);
}

export function skipAttempt(p: Progress, a: Attempt) {
  a.finished = true;
  advance(p, a);
}
