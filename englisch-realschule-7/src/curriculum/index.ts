import type { Lesson, Source, Stage } from "../types";
import grammar1 from "./lessons-grammar1.json";
import grammar2 from "./lessons-grammar2.json";
import history from "./lessons-history.json";
import ireland from "./lessons-ireland.json";
import literature from "./lessons-literature.json";
import school from "./lessons-school.json";
import usa from "./lessons-usa.json";
import words from "./lessons-words.json";
import youth from "./lessons-youth.json";
import outline from "./outline.json";

const data = [
	...history,
	...ireland,
	...youth,
	...school,
	...usa,
	...literature,
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
