import type { Lesson, Source, Stage, Track } from "../model/types";
import lessons from "./lessons.json";
import outline from "./outline.json";

/** GPG 7 Lernbereich 3 in three stages; the order of the file is the learning path. */
export const LESSONS: Lesson[] = lessons as Lesson[];
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URLS: Record<Track, string> = {
  R: SOURCES.find((source) => source.id === "lehrplan-r7")!.url,
  M: SOURCES.find((source) => source.id === "lehrplan-m7")!.url,
};
export const TRACK_LABELS: Record<Track, string> = {
  R: "Regelklasse (R7)",
  M: "M-Zug (M7)",
};
/** The lessons that count towards completion in a Zweig. */
export const lessonsForTrack = (track: Track): Lesson[] =>
  LESSONS.filter((lesson) => lesson.tracks.includes(track));
/** Every lesson of the Regelklasse also belongs to the M-Zug. */
export const CORE_LESSONS = lessonsForTrack("R");
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
