import type { Lesson, Stage } from "../model/types";
import { STAGE_FUNKTIONEN } from "./stage-1-funktionen";
import { STAGE_GEBROCHEN_RATIONAL } from "./stage-2-gebrochen-rational";
import { STAGE_BEDINGTE_WAHRSCHEINLICHKEIT } from "./stage-3-bedingte-wahrscheinlichkeit";
import { STAGE_DIFFERENZIEREN } from "./stage-4-differenzieren";
import { STAGE_KURVENUNTERSUCHUNG } from "./stage-5-kurvenuntersuchung";

/**
 * The stages follow the Lernbereiche of LehrplanPLUS Mathematik 11
 * (Gymnasium): LB 1 to LB 3 one stage each, LB 4 in its two parts 4.1 and
 * 4.2. The Gymnasium has no Zweige in Mathematik, so every lesson is for
 * every learner.
 */
export const STAGES: Stage[] = [
  STAGE_FUNKTIONEN,
  STAGE_GEBROCHEN_RATIONAL,
  STAGE_BEDINGTE_WAHRSCHEINLICHKEIT,
  STAGE_DIFFERENZIEREN,
  STAGE_KURVENUNTERSUCHUNG,
];

export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(
  id: string,
): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((l) => l.id === id);
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
