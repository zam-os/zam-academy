import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_MECHANIK } from "./stage-1-mechanik";
import { STAGE_OPTIK } from "./stage-2-optik";
import { STAGE_ENERGIE } from "./stage-3-energie";
import { STAGE_WAERME } from "./stage-4-waerme";
import { STAGE_ELEKTRIZITAET } from "./stage-5-elektrizitaet";
import { STAGE_AKUSTIK } from "./stage-6-akustik";
import { STAGE_ASTRONOMIE } from "./stage-7-astronomie";

/**
 * The stages follow the Lernbereiche of LehrplanPLUS Physik 8 (Realschule):
 * Zweig II/III learns Mechanik, Optik and Magnetismus und Elektrizitätslehre,
 * Zweig I learns Mechanik und Energie, Wärmelehre, Elektrizitätslehre and a
 * Wahlbereich (Akustik or Astronomie).
 */
export const STAGES: Stage[] = [
  STAGE_MECHANIK,
  STAGE_OPTIK,
  STAGE_ENERGIE,
  STAGE_WAERME,
  STAGE_ELEKTRIZITAET,
  STAGE_AKUSTIK,
  STAGE_ASTRONOMIE,
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
