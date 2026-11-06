import type { Lesson, Stage } from "../model/types";
import { STAGE_NATUERLICH } from "./stage-1-natuerliche-zahlen";
import { STAGE_GANZ } from "./stage-2-ganze-zahlen";
import { STAGE_GEOMETRIE } from "./stage-3-geometrie";
import { STAGE_GROESSEN } from "./stage-4-groessen";
import { STAGE_FLAECHEN } from "./stage-5-umfang-flaeche";
import { STAGE_DATEN } from "./stage-6-daten";

/** One stage per Lernbereich; the Fachlehrplan M5 is the same for all Zweige. */
export const STAGES: Stage[] = [
  STAGE_NATUERLICH,
  STAGE_GANZ,
  STAGE_GEOMETRIE,
  STAGE_GROESSEN,
  STAGE_FLAECHEN,
  STAGE_DATEN,
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
