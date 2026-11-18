import { egypt } from "./egypt";
import { greece } from "./greece";
import { methods } from "./methods";
import { middleAges } from "./middleages";
import { people } from "./people";
import { prehistory } from "./prehistory";
import { rome } from "./rome";
import { technology } from "./technology";

export { CURRICULUM_URL, SOURCES, STAGES, TERMS } from "./sources";
export const LESSONS = [
  ...methods,
  ...prehistory,
  ...egypt,
  ...greece,
  ...rome,
  ...middleAges,
  ...technology,
  ...people,
];
/** Every lesson belongs to the core path; the plan has no optional Lernbereich. */
export const CORE_LESSONS = LESSONS;
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
