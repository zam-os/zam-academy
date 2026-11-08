import type { Lesson, Stage } from "../model/types";
import { STAGE_INTEGRAL } from "./stage-1-integral";
import { STAGE_NORMALVERTEILUNG } from "./stage-2-normalverteilung";
import { STAGE_RAUMGEOMETRIE } from "./stage-3-raumgeometrie";
import { STAGE_ANWENDUNGEN } from "./stage-4-anwendungen";

/** One stage per Lernbereich; the Fachlehrplan M13 has one Anforderungsniveau. */
export const STAGES: Stage[] = [
  STAGE_INTEGRAL,
  STAGE_NORMALVERTEILUNG,
  STAGE_RAUMGEOMETRIE,
  STAGE_ANWENDUNGEN,
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
