import type { Lesson, Stage } from "../model/types";
import { STAGE_TEXTERFASSUNG } from "./stage-1-texterfassung";
import { STAGE_PROGRAMMIERUNG } from "./stage-2-programmierung";
import { STAGE_TEXTVERARBEITUNG } from "./stage-3-textverarbeitung";
import { STAGE_INFORMATIONSAUSTAUSCH } from "./stage-4-informationsaustausch";
import { STAGE_BILDBEARBEITUNG } from "./stage-5-bildbearbeitung";
import { STAGE_TABELLENKALKULATION } from "./stage-6-tabellenkalkulation";
import { STAGE_PRAESENTATION } from "./stage-7-praesentation";
import { STAGE_EDV } from "./stage-8-edv";
import { STAGE_DIGITALE_MEDIEN } from "./stage-9-digitale-medien";

/** One stage per module of the IT Anfangsunterricht (1.1–1.9), in curriculum order. */
export const STAGES: Stage[] = [
  STAGE_TEXTERFASSUNG,
  STAGE_PROGRAMMIERUNG,
  STAGE_TEXTVERARBEITUNG,
  STAGE_INFORMATIONSAUSTAUSCH,
  STAGE_BILDBEARBEITUNG,
  STAGE_TABELLENKALKULATION,
  STAGE_PRAESENTATION,
  STAGE_EDV,
  STAGE_DIGITALE_MEDIEN,
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
