import type { Lesson } from "../model/types";
import { createRng, seedFrom } from "./rng";

/**
 * The order a lesson's quick-check options are shown in: a fixed shuffle
 * per lesson, so the right answer is not always the first one written.
 */
export function quizOrder(lesson: Lesson): number[] {
  const count = lesson.quiz.options.length;
  return createRng(seedFrom(`${lesson.id}:quiz`)).shuffle(
    Array.from({ length: count }, (_, i) => i),
  );
}
