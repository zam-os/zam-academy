import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_DRUCK } from "./stage-1-druck";
import { STAGE_MECHANIK } from "./stage-2-mechanik";
import { STAGE_WAERME } from "./stage-3-waerme";
import { STAGE_ELEKTRIK } from "./stage-4-elektrik";

/** The four stages follow the Lernbereiche of LehrplanPLUS Physik 9 (Realschule). */
export const STAGES: Stage[] = [STAGE_DRUCK, STAGE_MECHANIK, STAGE_WAERME, STAGE_ELEKTRIK];

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

/** Lessons a learner of the given track needs; "alle" keeps every lesson. */
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
