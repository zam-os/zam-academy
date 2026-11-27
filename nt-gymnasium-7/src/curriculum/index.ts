import type { Lesson, Stage } from "../model/types";
import { STAGE_HYPERTEXT } from "./stage-1-hypertext";
import { STAGE_KOMMUNIKATION } from "./stage-2-kommunikation";
import { STAGE_ALGORITHMEN } from "./stage-3-algorithmen";
import { STAGE_PROJEKT } from "./stage-4-projekt";

/** One stage per module of Natur und Technik 7, Schwerpunkt Informatik. */
export const STAGES: Stage[] = [
  STAGE_HYPERTEXT,
  STAGE_KOMMUNIKATION,
  STAGE_ALGORITHMEN,
  STAGE_PROJEKT,
];

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
  const position = ALL_LESSONS.findIndex((entry) => entry.id === id);
  return position < 0 ? undefined : ALL_LESSONS[position + 1];
}

export function previousLesson(id: string): Lesson | undefined {
  const position = ALL_LESSONS.findIndex((entry) => entry.id === id);
  return position <= 0 ? undefined : ALL_LESSONS[position - 1];
}

/** A saved or deep-linked lesson that no longer exists must not hijack Continue. */
export function continuationLesson(id: string): Lesson {
  return findLessonById(id)?.lesson ?? ALL_LESSONS[0];
}
