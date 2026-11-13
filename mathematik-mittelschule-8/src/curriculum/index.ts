import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_PROZENT } from "./stage-1-prozent";
import { STAGE_WURZELN } from "./stage-2-wurzeln";
import { STAGE_KREIS } from "./stage-3-kreis";
import { STAGE_KREISFLAECHE } from "./stage-4-kreisflaeche";
import { STAGE_ZYLINDER } from "./stage-5-zylinder";
import { STAGE_ZUFALL } from "./stage-6-zufall";
import { STAGE_GLEICHUNGEN } from "./stage-7-gleichungen";
import { STAGE_FUNKTIONEN } from "./stage-8-funktionen";

/** One stage per Lernbereich in Mittelschule 8 (Regelklasse R8 & M-Zug M8). */
export const STAGES: Stage[] = [
  STAGE_PROZENT,
  STAGE_WURZELN,
  STAGE_KREIS,
  STAGE_KREISFLAECHE,
  STAGE_ZYLINDER,
  STAGE_ZUFALL,
  STAGE_GLEICHUNGEN,
  STAGE_FUNKTIONEN,
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

export function lessonsForTrack(track: Track | "alle"): Lesson[] {
  if (track === "alle") return ALL_LESSONS;
  return ALL_LESSONS.filter((lesson) => lesson.tracks.includes(track));
}

export function nextLesson(
  id: string,
  track: Track | "alle" = "alle",
): Lesson | undefined {
  const pool = lessonsForTrack(track);
  const index = pool.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? pool[index + 1] : undefined;
}

export function previousLesson(
  id: string,
  track: Track | "alle" = "alle",
): Lesson | undefined {
  const pool = lessonsForTrack(track);
  const index = pool.findIndex((lesson) => lesson.id === id);
  return index > 0 ? pool[index - 1] : undefined;
}

export function stageNumberForTrack(
  stage: Stage,
  _track: Track | "alle",
): number {
  return stage.stageNumber;
}

export function lessonTitleForTrack(
  lesson: Lesson,
  _track: Track | "alle",
): string {
  return lesson.title;
}
