import type { Lesson } from "../model/types";
import { LB1 } from "./lb1-sprechen";
import { LB2A } from "./lb2a-literatur";
import { LB2B } from "./lb2b-sachtexte-medien";
import { LB3A } from "./lb3a-formen";
import { LB3B } from "./lb3b-schreiben";
import { LB4A } from "./lb4a-sprachgebrauch";
import { LB4B } from "./lb4b-sprachbau";
import { UNITS } from "./lehrplan";

export { ALL_EXPECTATIONS, UNITS } from "./lehrplan";
export { EDITORIAL_DATE, SOURCES, STAGES } from "./sources";

/** The place of a lesson in the Fachlehrplan, for example "D9 LB 4.2: Sprachliche Strukturen untersuchen und reflektieren". */
function placed(lesson: Lesson): Lesson {
  return { ...lesson, lehrplan: `D9 LB ${lesson.unit}: ${UNITS[lesson.unit]?.title ?? lesson.unit}` };
}

export const LESSONS: Lesson[] = [...LB1, ...LB2A, ...LB2B, ...LB3A, ...LB3B, ...LB4A, ...LB4B].map(placed);

/** Every lesson belongs to the Fachlehrplan; there are no optional ones. */
export const CORE_LESSONS: Lesson[] = LESSONS;

export function findLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}
