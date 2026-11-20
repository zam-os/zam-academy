import type { Lesson, Stage } from "../model/types";
import { STAGE_INFORMATIONSAUSTAUSCH } from "./stage-1-informationsaustausch";
import { STAGE_PROGRAMMIERUNG } from "./stage-2-programmieren";

/** One stage per Lernbereich of Informatik 6 Mittelschule (Inf6 LB 1–2). */
export const STAGES: Stage[] = [
  STAGE_INFORMATIONSAUSTAUSCH,
  STAGE_PROGRAMMIERUNG,
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
