import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import lb6 from "./lessons-lb6.json";
import lb7 from "./lessons-lb7.json";
import type { Lesson } from "../model/types";
export { CURRICULUM_URL, EDITORIAL_DATE, SOURCES, STAGES } from "./sources";
export const LESSONS = [
	...lb1,
	...lb2,
	...lb3,
	...lb4,
	...lb5,
	...lb6,
	...lb7,
] as Lesson[];
export const CORE_LESSONS = LESSONS;
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
