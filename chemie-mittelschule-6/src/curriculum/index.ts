import type { Lesson, Source, Stage } from "../model/types";
import methods from "./lessons-methods.json";
import water from "./lessons-water.json";
import soil from "./lessons-soil.json";
import outline from "./outline.json";

/** Methods first, then water, then the chemical and ecological substance cycle. */
export const LESSONS: Lesson[] = [
	...methods,
	...water,
	...soil,
] as unknown as Lesson[];
export const CORE_LESSONS = LESSONS;
export const STAGES: Stage[] = outline.stages;
export const SOURCES: Source[] = outline.sources;
export const CURRICULUM_URL = SOURCES[0].url;
export const findLesson = (id: string) =>
	LESSONS.find((lesson) => lesson.id === id);
