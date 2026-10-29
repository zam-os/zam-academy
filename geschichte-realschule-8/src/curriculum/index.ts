import type { Lesson, Source, Stage } from "../model/types";
import data from "./lessons.json";
import outline from "./outline.json";

export const LESSONS: Lesson[] = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) =>
  LESSONS.find((lesson) => lesson.id === id);
