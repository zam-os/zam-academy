import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_PROZENT } from "./stage-1-prozent";
import { STAGE_RATIONALE } from "./stage-2-rationale";
import { STAGE_GEOMETRIE } from "./stage-3-geometrie";
import { STAGE_FLAECHEN } from "./stage-4-flaechen";
import { STAGE_VOLUMEN } from "./stage-5-volumen";
import { STAGE_STATISTIK } from "./stage-6-statistik";
import { STAGE_GLEICHUNGEN } from "./stage-7-gleichungen";
import { STAGE_PROPORTIONAL } from "./stage-8-proportional";

/** One stage per Lernbereich in Mittelschule 7 (Regelklasse R7 & M-Zug M7). */
export const STAGES: Stage[] = [
  STAGE_PROZENT,
  STAGE_RATIONALE,
  STAGE_GEOMETRIE,
  STAGE_FLAECHEN,
  STAGE_VOLUMEN,
  STAGE_STATISTIK,
  STAGE_GLEICHUNGEN,
  STAGE_PROPORTIONAL,
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
