import type { Lesson } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";

export { CURRICULUM_URL, SOURCES, SOURCES_CHECKED, STAGES } from "./sources";
/** One file per section of the Fachlehrplan, in the order of the learning path. */
export const LESSONS = [...lb1, ...lb2, ...lb3] as Lesson[];
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
