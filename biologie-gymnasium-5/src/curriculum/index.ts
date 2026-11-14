import type { Lesson, Source, Stage } from "../model/types";
import s1 from "./lessons-s1.json";
import s2 from "./lessons-s2.json";
import s3 from "./lessons-s3.json";
import s4 from "./lessons-s4.json";
import s5 from "./lessons-s5.json";
import s6 from "./lessons-s6.json";
import s7 from "./lessons-s7.json";
import s8 from "./lessons-s8.json";
import outline from "./outline.json";

/** One file per station; the order of the files is the learning path. */
export const LESSONS: Lesson[] = [
  ...s1,
  ...s2,
  ...s3,
  ...s4,
  ...s5,
  ...s6,
  ...s7,
  ...s8,
] as Lesson[];
/** Every lesson belongs to the core path; the package has no optional extensions. */
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
