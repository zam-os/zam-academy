import type { Lesson, Source, Stage } from "../types";
import { LESSONS_IMPERIUM } from "./lessons-imperium";
import { LESSONS_KONJUNKTIV } from "./lessons-konjunktiv";
import { LESSONS_MYTHOS } from "./lessons-mythos";
import { LESSONS_NOMINA } from "./lessons-nomina";
import { LESSONS_PARTIZIP } from "./lessons-partizip";
import { LESSONS_PASSIV } from "./lessons-passiv";
import { LESSONS_RESPUBLICA } from "./lessons-respublica";
import { LESSONS_WORTSCHATZ } from "./lessons-wortschatz";
import outline from "./outline.json";

export const LESSONS: Lesson[] = [
	...LESSONS_NOMINA,
	...LESSONS_PASSIV,
	...LESSONS_PARTIZIP,
	...LESSONS_KONJUNKTIV,
	...LESSONS_WORTSCHATZ,
	...LESSONS_IMPERIUM,
	...LESSONS_RESPUBLICA,
	...LESSONS_MYTHOS,
];

export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const findLesson = (id: string): Lesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);
