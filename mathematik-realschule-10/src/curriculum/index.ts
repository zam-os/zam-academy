import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_EINHEITSKREIS } from "./stage-1-einheitskreis";
import { STAGE_DREIECKE } from "./stage-2-dreiecke";
import { STAGE_VEKTOREN_ABBILDUNGEN } from "./stage-3-vektoren-abbildungen";
import { STAGE_POTENZEN } from "./stage-4-potenzen";
import { STAGE_EXPONENTIAL_LOGARITHMUS } from "./stage-5-exponential-logarithmus";
import { STAGE_RAUMGEOMETRIE } from "./stage-6-raumgeometrie";
import { STAGE_QUADRATISCH } from "./stage-7-quadratisch";
import { STAGE_DATEN_ZUFALL } from "./stage-8-daten-zufall";
import { TEACHER_VIDEOS } from "./teacher-videos";

/**
 * The stages follow the Lernbereiche of LehrplanPLUS Mathematik 10
 * (Realschule): Zweig I LB 1 to LB 5 (stages 1 to 5 and 8), Zweig II/III
 * LB 1 to LB 5 (stages 1, 2 and 5 to 8). Lessons name their Zweige.
 */
export const STAGES: Stage[] = [
  STAGE_EINHEITSKREIS,
  STAGE_DREIECKE,
  STAGE_VEKTOREN_ABBILDUNGEN,
  STAGE_POTENZEN,
  STAGE_EXPONENTIAL_LOGARITHMUS,
  STAGE_RAUMGEOMETRIE,
  STAGE_QUADRATISCH,
  STAGE_DATEN_ZUFALL,
];

export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

// Teacher videos are kept apart from the lessons: each one was checked after
// the lesson was written, and lessons without a verified video have none.
for (const lesson of ALL_LESSONS) lesson.teacherVideo ??= TEACHER_VIDEOS[lesson.id];

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
