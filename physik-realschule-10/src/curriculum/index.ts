import type { Lesson, Track } from "../model/types";
import data from "./lessons.json";

export { CURRICULUM_URL, curriculumUrl, SOURCES, STAGES } from "./sources";
export const LESSONS = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
export const lessonsFor = (track: Track, extra = false) =>
  LESSONS.filter(
    (lesson) => lesson.tracks.includes(track) && (!lesson.optional || extra),
  );
