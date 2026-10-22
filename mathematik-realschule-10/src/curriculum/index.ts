import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_TRIGONOMETRIE } from "./stage-1-trigonometrie";
import { STAGE_VEKTORGEOMETRIE } from "./stage-2-vektorgeometrie";
import { STAGE_POTENZEN } from "./stage-3-potenzen";
import { STAGE_EXPONENTIAL } from "./stage-4-exponential";
import { STAGE_ABSCHLUSSPRUEFUNG } from "./stage-5-abschlusspruefung";
import { STAGE_STOCHASTIK } from "./stage-6-stochastik";

export const STAGES: Stage[] = [
  STAGE_TRIGONOMETRIE,
  STAGE_VEKTORGEOMETRIE,
  STAGE_POTENZEN,
  STAGE_EXPONENTIAL,
  STAGE_ABSCHLUSSPRUEFUNG,
  STAGE_STOCHASTIK,
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
