import type { Lesson, Stage } from "../model/types";
import { STAGE_RATIONALE } from "./stage-1-rationale";
import { STAGE_FLAECHEN } from "./stage-2-flaechen";
import { STAGE_PROZENT } from "./stage-3-prozent";

/** One stage per Lernbereich. Gymnasium has no Zweige in grade 6. */
export const STAGES: Stage[] = [STAGE_RATIONALE, STAGE_FLAECHEN, STAGE_PROZENT];
export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(id: string): { stage: Stage; lesson: Lesson } | undefined {
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
