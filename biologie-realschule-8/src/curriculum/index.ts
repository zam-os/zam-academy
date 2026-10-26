import type { Lesson, Source, Stage } from "../types";
import lessons from "./lessons.json";
import outline from "./outline.json";
export const LESSONS = lessons as Lesson[];
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
