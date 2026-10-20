import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_DREIECKE } from "./stage-1-dreiecke";
import { STAGE_KREIS_RAUM } from "./stage-2-kreis-raum";
import { STAGE_GLEICHUNGSSYSTEME } from "./stage-3-gleichungssysteme";
import { STAGE_QUADRATISCH } from "./stage-4-quadratisch";
import { STAGE_DATEN_ZUFALL } from "./stage-5-daten-zufall";

/**
 * The five stages follow the Lernbereiche of LehrplanPLUS Mathematik 9
 * (Realschule) in their order: LB 3 to LB 8 for Zweig I, LB 3, 4, 6 and 7
 * for Zweig II/III.
 */
export const STAGES: Stage[] = [
  STAGE_DREIECKE,
  STAGE_KREIS_RAUM,
  STAGE_GLEICHUNGSSYSTEME,
  STAGE_QUADRATISCH,
  STAGE_DATEN_ZUFALL,
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
