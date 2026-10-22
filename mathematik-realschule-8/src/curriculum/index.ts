import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_FIGUREN } from "./stage-1-figuren";
import { STAGE_DREHUNG } from "./stage-2-drehung";
import { STAGE_RAUM } from "./stage-3-raum";
import { STAGE_TERME } from "./stage-4-terme";
import { STAGE_BRUECHE } from "./stage-5-brueche";
import { STAGE_FUNKTIONEN } from "./stage-6-funktionen";
import { STAGE_ZUFALL } from "./stage-7-zufall";

export const STAGES: Stage[] = [
  STAGE_FIGUREN,
  STAGE_DREHUNG,
  STAGE_RAUM,
  STAGE_TERME,
  STAGE_BRUECHE,
  STAGE_FUNKTIONEN,
  STAGE_ZUFALL,
];
export const ALL_LESSONS: Lesson[] = STAGES.flatMap((s) => s.lessons);
export function findLessonById(id: string): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((l) => l.id === id);
    if (lesson) return { stage, lesson };
  }
  return undefined;
}
export const findStageById = (id: string): Stage | undefined => STAGES.find((s) => s.id === id);
export const lessonsForTrack = (track: Track | "alle"): Lesson[] =>
  ALL_LESSONS.filter((l) => track === "alle" || l.tracks.includes(track));
export function nextLesson(id: string, track: Track | "alle" = "alle"): Lesson | undefined {
  const at = ALL_LESSONS.findIndex((l) => l.id === id);
  return at < 0
    ? undefined
    : ALL_LESSONS.slice(at + 1).find((l) => track === "alle" || l.tracks.includes(track));
}
export function previousLesson(id: string, track: Track | "alle" = "alle"): Lesson | undefined {
  const at = ALL_LESSONS.findIndex((l) => l.id === id);
  return at < 0
    ? undefined
    : ALL_LESSONS.slice(0, at)
        .reverse()
        .find((l) => track === "alle" || l.tracks.includes(track));
}
