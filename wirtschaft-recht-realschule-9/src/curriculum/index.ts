import type { Lesson } from "../model/types";
import { LB1 } from "./lb1-beruf";
import { LB2 } from "./lb2-markt";
import { LB3 } from "./lb3-verbraucher";
import { LB4A } from "./lb4a-rechtsordnung";
import { LB4B } from "./lb4b-strafrecht";
import { LB5 } from "./lb5-english";

export { CURRICULUM_URL, EDITORIAL_DATE, SOURCES, STAGES } from "./sources";

export const LESSONS: Lesson[] = [...LB1, ...LB2, ...LB3, ...LB4A, ...LB4B, ...LB5];
export const CORE_LESSONS = LESSONS.filter((l) => !l.optional);
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
