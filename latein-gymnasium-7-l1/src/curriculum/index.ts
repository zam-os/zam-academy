import outline from "./outline.json";
import stage1 from "./stage-1.json";
import stage2 from "./stage-2.json";
import stage3 from "./stage-3.json";
import stage4 from "./stage-4.json";
import stage5 from "./stage-5.json";
import stage6 from "./stage-6.json";
import stage7 from "./stage-7.json";
import stage8 from "./stage-8.json";
import type { Lesson, Source, Stage } from "../types";

export const STAGES = outline.stages as Stage[];
export const SOURCES = outline.sources as Source[];
export const LESSONS = [
	...stage1,
	...stage2,
	...stage3,
	...stage4,
	...stage5,
	...stage6,
	...stage7,
	...stage8,
] as Lesson[];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);

export function findLesson(id: string | undefined): Lesson | undefined {
	return id ? LESSONS.find((lesson) => lesson.id === id) : undefined;
}
