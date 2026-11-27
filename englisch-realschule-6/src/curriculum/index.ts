import type { Lesson, Source, Stage } from "../types";
import britain from "./lessons-britain.json";
import freetime from "./lessons-freetime.json";
import grammar1 from "./lessons-grammar1.json";
import grammar2 from "./lessons-grammar2.json";
import london from "./lessons-london.json";
import media from "./lessons-media.json";
import usa from "./lessons-usa.json";
import words from "./lessons-words.json";
import outline from "./outline.json";

const data = [
	...usa,
	...london,
	...britain,
	...freetime,
	...media,
	...grammar1,
	...grammar2,
	...words,
];

// JSON shape and all referenced identifiers are checked by the content suite.
export const LESSONS = data as unknown as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
