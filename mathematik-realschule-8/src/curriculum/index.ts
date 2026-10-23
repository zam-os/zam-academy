import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_DREIECKE_VIERECKE } from "./stage-1-dreiecke-vierecke";
import { STAGE_DREHUNG } from "./stage-2-drehung";
import { STAGE_RAUMGEOMETRIE } from "./stage-3-raumgeometrie";
import { STAGE_TERME_GLEICHUNGEN } from "./stage-4-terme-gleichungen";
import { STAGE_BRUCHTERME } from "./stage-5-bruchterme";
import { STAGE_FUNKTIONEN } from "./stage-6-funktionen";
import { STAGE_DATEN_ZUFALL } from "./stage-7-daten-zufall";

/**
 * The stages follow the Lernbereiche of LehrplanPLUS Mathematik 8
 * (Realschule): Zweig I LB 1 to LB 7 (stages 1 to 7), Zweig II/III LB 1 to
 * LB 6 (stages 1 and 3 to 7). Lessons name their Zweige.
 */
export const STAGES: Stage[] = [
  STAGE_DREIECKE_VIERECKE,
  STAGE_DREHUNG,
  STAGE_RAUMGEOMETRIE,
  STAGE_TERME_GLEICHUNGEN,
  STAGE_BRUCHTERME,
  STAGE_FUNKTIONEN,
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
