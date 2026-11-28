import type { Lesson, Track } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";

export {
  CURRICULUM_URL,
  curriculumUrl,
  SOURCES,
  STAGES,
  trackLabel,
} from "./sources";
/** One file per Lernbereich, in the order of the learning path. */
export const LESSONS = [...lb1, ...lb2, ...lb3, ...lb4] as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
export const lessonsFor = (track: Track, extra = false) =>
  LESSONS.filter(
    (lesson) => lesson.tracks.includes(track) && (!lesson.optional || extra),
  );
