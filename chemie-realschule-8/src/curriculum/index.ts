import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_ARBEITEN } from "./stage-1-arbeiten";
import { STAGE_STOFFE } from "./stage-2-stoffe";
import { STAGE_MATERIE } from "./stage-3-materie";
import { STAGE_REAKTION } from "./stage-4-reaktion";
import { STAGE_ATOMBAU } from "./stage-5-atombau";

export const STAGES: Stage[] = [
  STAGE_ARBEITEN,
  STAGE_STOFFE,
  STAGE_MATERIE,
  STAGE_REAKTION,
  STAGE_ATOMBAU,
];
export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(id: string): { stage: Stage; lesson: Lesson } | undefined {
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

export function nextLesson(id: string, track: Track | "alle" = "I"): Lesson | undefined {
  const position = ALL_LESSONS.findIndex((entry) => entry.id === id);
  return position < 0
    ? undefined
    : ALL_LESSONS.slice(position + 1).find(
        (entry) => track === "alle" || entry.tracks.includes(track),
      );
}

export function previousLesson(id: string, track: Track | "alle" = "I"): Lesson | undefined {
  const position = ALL_LESSONS.findIndex((entry) => entry.id === id);
  return position < 0
    ? undefined
    : ALL_LESSONS.slice(0, position)
        .reverse()
        .find((entry) => track === "alle" || entry.tracks.includes(track));
}

/** A saved/deep-linked lesson outside the selected path must not hijack Continue. */
export function continuationLesson(id: string, track: Track | "alle"): Lesson {
  const current = findLessonById(id)?.lesson;
  return current && (track === "alle" || current.tracks.includes(track))
    ? current
    : lessonsForTrack(track)[0];
}

/** Consecutive stage number for the selected track. */
export function stageNumberForTrack(id: string, track: Track | "alle"): number | undefined {
  const visible = STAGES.filter(
    (stage) => track === "alle" || stage.lessons.some((lesson) => lesson.tracks.includes(track)),
  );
  const index = visible.findIndex((stage) => stage.id === id);
  return index < 0 ? undefined : index + 1;
}
