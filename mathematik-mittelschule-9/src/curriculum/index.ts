import type { Lesson, Stage, Track } from "../model/types";
import { STAGE as STAGE_1 } from "./stage-1";
import { STAGE as STAGE_2 } from "./stage-2";
import { STAGE as STAGE_3 } from "./stage-3";
import { STAGE as STAGE_4 } from "./stage-4";
import { STAGE as STAGE_5 } from "./stage-5";
import { STAGE as STAGE_6 } from "./stage-6";
import { STAGE as STAGE_7 } from "./stage-7";
import { STAGE as STAGE_8 } from "./stage-8";

/**
 * One stage per Lernbereich of LehrplanPLUS Mathematik 9 (Mittelschule).
 * Regelklasse (R9) and Mittlere-Reife-Klasse (M9) share the eight
 * Lernbereiche; each lesson names the Züge whose Fachlehrplan asks for it.
 */
export const STAGES: Stage[] = [
  STAGE_1,
  STAGE_2,
  STAGE_3,
  STAGE_4,
  STAGE_5,
  STAGE_6,
  STAGE_7,
  STAGE_8,
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

/** Lessons a learner of the given Zug needs; "alle" keeps every lesson. */
export function lessonsForTrack(track: Track | "alle"): Lesson[] {
  if (track === "alle") return ALL_LESSONS;
  return ALL_LESSONS.filter((lesson) => lesson.tracks.includes(track));
}

export function nextLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? ALL_LESSONS[index + 1] : undefined;
}

export function previousLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
