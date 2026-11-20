import type { Lesson } from "../model/types";
import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
export { CURRICULUM_URL, SOURCES, STAGES } from "./sources";
// Every lesson is validated against the package content contract in the tests.
export const LESSONS = [...lb1, ...lb2, ...lb3, ...lb4] as Lesson[];
export const CORE_LESSONS = LESSONS;
export const findLesson = (id: string) =>
	LESSONS.find((lesson) => lesson.id === id);
