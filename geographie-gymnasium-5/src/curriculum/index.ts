import type { Lesson, Source, Stage } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import outline from "./outline.json";

/** One file per Lernbereich; the order of the files is the learning path. */
export const LESSONS: Lesson[] = [
  ...lb1,
  ...lb2,
  ...lb3,
  ...lb4,
  ...lb5,
] as Lesson[];
/** Every lesson belongs to the core path; the package has no optional extensions. */
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
