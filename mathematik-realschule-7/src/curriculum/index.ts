import type { Lesson, Stage, TeacherVideo, Track } from "../model/types";
import teacherVideoData from "./teacher-videos.json";
import { STAGE_POTENZEN } from "./stage-1-potenzen";
import { STAGE_VERSCHIEBUNG } from "./stage-2-verschiebung";
import { STAGE_DREIECKE } from "./stage-3-dreiecke";
import { STAGE_RAUM } from "./stage-4-raum";
import { STAGE_ORTSLINIEN } from "./stage-5-ortslinien";
import { STAGE_ALGEBRA } from "./stage-6-algebra";
import { STAGE_PROPORTIONEN } from "./stage-7-proportionen";
import { STAGE_DATEN } from "./stage-8-daten";

const teacherVideos: Record<
  string,
  TeacherVideo & { additional?: TeacherVideo[] }
> = teacherVideoData;

/** One stage per Lernbereich in Zweig I; track labels preserve the II/III numbering. */
export const STAGES: Stage[] = [
  STAGE_POTENZEN,
  STAGE_VERSCHIEBUNG,
  STAGE_DREIECKE,
  STAGE_RAUM,
  STAGE_ORTSLINIEN,
  STAGE_ALGEBRA,
  STAGE_PROPORTIONEN,
  STAGE_DATEN,
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
export function lessonsForTrack(track: Track | "alle"): Lesson[] {
  return track === "alle"
    ? ALL_LESSONS
    : ALL_LESSONS.filter((lesson) => lesson.tracks.includes(track));
}
export function nextLesson(
  id: string,
  track: Track | "alle" = "alle",
): Lesson | undefined {
  const lessons = lessonsForTrack(track);
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return index >= 0 ? lessons[index + 1] : undefined;
}
export function previousLesson(
  id: string,
  track: Track | "alle" = "alle",
): Lesson | undefined {
  const lessons = lessonsForTrack(track);
  const index = lessons.findIndex((lesson) => lesson.id === id);
  return index > 0 ? lessons[index - 1] : undefined;
}

/** Stable ids, but consecutive visible numbering in the learner's own track. */
export function stageNumberForTrack(
  stage: Stage,
  track: Track | "alle",
): number {
  const visible = STAGES.filter((entry) =>
    entry.lessons.some(
      (lesson) => track === "alle" || lesson.tracks.includes(track),
    ),
  );
  const index = visible.findIndex((entry) => entry.id === stage.id);
  return index < 0 ? stage.stageNumber : index + 1;
}
export function lessonTitleForTrack(
  lesson: Lesson,
  track: Track | "alle",
): string {
  const stage = findStageById(lesson.stageId)!;
  if (track !== "alle" && !lesson.tracks.includes(track)) return lesson.title;
  const visible = stage.lessons.filter(
    (entry) => track === "alle" || entry.tracks.includes(track),
  );
  return `${stageNumberForTrack(stage, track)}.${visible.findIndex((entry) => entry.id === lesson.id) + 1} ${lesson.title.replace(/^\d+\.\d+\s+/, "")}`;
}
