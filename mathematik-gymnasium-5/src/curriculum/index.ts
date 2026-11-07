import type { Lesson, Stage } from "../model/types";
import { STAGE_ADDITION } from "./stage-1-addition-subtraktion";
import { STAGE_GEOMETRIE } from "./stage-2-geometrie";
import { STAGE_MULTIPLIKATION } from "./stage-3-multiplikation-division";
import { STAGE_GROESSEN } from "./stage-4-groessen";

/** One stage per Lernbereich; Gymnasium has no Zweige in grade 5. */
export const STAGES: Stage[] = [
  STAGE_ADDITION,
  STAGE_GEOMETRIE,
  STAGE_MULTIPLIKATION,
  STAGE_GROESSEN,
];
export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(
  id: string,
): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((entry) => entry.id === id);
    if (lesson) return { stage, lesson };
  }
  return undefined;
}
export function findStageById(id: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === id);
}
export function nextLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? ALL_LESSONS[index + 1] : undefined;
}
export function previousLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
