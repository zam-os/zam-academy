import type { Lesson, Stage, TeacherVideo } from "../model/types";
import teacherVideoData from "./teacher-videos.json";
import { STAGE_RATIONALE_ZAHLEN } from "./stage-1-rationale-zahlen";
import { STAGE_ACHSENSPIEGELUNG } from "./stage-2-achsenspiegelung";
import { STAGE_FLAECHENINHALT } from "./stage-3-flaecheninhalt";
import { STAGE_RAUMGEOMETRIE } from "./stage-4-raumgeometrie";
import { STAGE_TERME_GLEICHUNGEN } from "./stage-5-terme-gleichungen";
import { STAGE_PROPORTIONALITAET } from "./stage-6-proportionalitaet";

const teacherVideos: Record<
  string,
  TeacherVideo & { additional?: TeacherVideo[] }
> = teacherVideoData;

/** One stage per Lernbereich; grade 6 has one Fachlehrplan for all Zweige. */
export const STAGES: Stage[] = [
  STAGE_RATIONALE_ZAHLEN,
  STAGE_ACHSENSPIEGELUNG,
  STAGE_FLAECHENINHALT,
  STAGE_RAUMGEOMETRIE,
  STAGE_TERME_GLEICHUNGEN,
  STAGE_PROPORTIONALITAET,
].map((stage) => ({
  ...stage,
  lessons: stage.lessons.map((lesson) => {
    const { additional = [], ...teacherVideo } = teacherVideos[lesson.id];
    return { ...lesson, teacherVideo, additionalTeacherVideos: additional };
  }),
}));
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
export function nextLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? ALL_LESSONS[index + 1] : undefined;
}
export function previousLesson(id: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === id);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
