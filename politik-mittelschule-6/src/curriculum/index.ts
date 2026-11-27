import type { Lesson, Source, Stage } from "../model/types";
import lb3 from "./lessons-lb3.json";
import outline from "./outline.json";

/** The learning path covers GPG 6 Lernbereich 3. */
export const LESSONS: Lesson[] = lb3 as Lesson[];
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const TERMS = outline.terms;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
