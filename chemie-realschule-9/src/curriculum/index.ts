import type { Lesson, Stage, Track } from "../model/types";
import { STAGE_STOFFE } from "./stage-1-stoffe";
import { STAGE_REAKTIONEN } from "./stage-2-reaktionen";
import { STAGE_ATOMBAU } from "./stage-3-atombau";
import { STAGE_BINDUNGEN } from "./stage-4-bindungen";
import { STAGE_REDOX } from "./stage-5-redox";
import { STAGE_ELEKTROCHEMIE } from "./stage-6-elektrochemie";
import { STAGE_PROTONEN } from "./stage-7-protonen";

export const STAGES: Stage[] = [
  STAGE_STOFFE,
  STAGE_REAKTIONEN,
  STAGE_ATOMBAU,
  STAGE_BINDUNGEN,
  STAGE_REDOX,
  STAGE_ELEKTROCHEMIE,
  STAGE_PROTONEN,
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

export function nextLesson(id: string, track: Track | "alle" = "alle"): Lesson | undefined {
  const position = ALL_LESSONS.findIndex((entry) => entry.id === id);
  return position < 0
    ? undefined
    : ALL_LESSONS.slice(position + 1).find(
        (entry) => track === "alle" || entry.tracks.includes(track),
      );
}

export function previousLesson(id: string, track: Track | "alle" = "alle"): Lesson | undefined {
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

/** Keep stage numbers consecutive when the other track's stages are absent. */
export function stageNumberForTrack(id: string, track: Track | "alle"): number | undefined {
  const visible = STAGES.filter(
    (stage) => track === "alle" || stage.lessons.some((lesson) => lesson.tracks.includes(track)),
  );
  const index = visible.findIndex((stage) => stage.id === id);
  return index < 0 ? undefined : index + 1;
}
