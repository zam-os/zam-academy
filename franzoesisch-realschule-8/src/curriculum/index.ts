import type { Lesson, Source, Stage } from "../types";
import data from "./lessons.json";
import outline from "./outline.json";

export const LESSONS = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
