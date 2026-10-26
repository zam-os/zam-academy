import type { Lesson } from "../model/types";
import { S1A } from "./s1a-verstehen-sprechen";
import { S1B } from "./s1b-schreiben-mitteln";
import { S2A } from "./s2a-beschreiben";
import { S2B } from "./s2b-conditionnel-verben";
import { S2C } from "./s2c-wiederholung";
import { S3A } from "./s3a-wortschatz";
import { S3B } from "./s3b-wendungen";
import { S4 } from "./s4-frankreich-europa";
import { S5 } from "./s5-texte-medien";
import { S6 } from "./s6-lernen";
import { S7 } from "./s7-themen";
import { UNITS } from "./lehrplan";

export { ALL_EXPECTATIONS, UNITS, UNIT_ORDER } from "./lehrplan";
export { EDITORIAL_DATE, SOURCES, STAGES } from "./sources";

/** The place of a lesson in the Fachlehrplan, for example "F10 LB 1.2: Grammatik". */
function placed(lesson: Lesson): Lesson {
  const unit = UNITS[lesson.unit];
  return { ...lesson, lehrplan: `F10 LB ${unit?.plan ?? lesson.unit}: ${unit?.title ?? lesson.unit}` };
}

export const LESSONS: Lesson[] = [...S1A, ...S1B, ...S2A, ...S2B, ...S2C, ...S3A, ...S3B, ...S4, ...S5, ...S6, ...S7].map(placed);

/** Every lesson belongs to the Fachlehrplan; there are no optional ones. */
export const CORE_LESSONS: Lesson[] = LESSONS;

export function findLesson(id: string): Lesson | undefined {
  return LESSONS.find((lesson) => lesson.id === id);
}
