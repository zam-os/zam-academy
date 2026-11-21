import { absolutism } from "./absolutism";
import { architecture } from "./architecture";
import { english } from "./english";
import { methods } from "./methods";
import { middleAges } from "./middleages";
import { reformation } from "./reformation";
import { renaissance } from "./renaissance";
import { trade } from "./trade";

export { CURRICULUM_URL, SOURCES, STAGES, TERMS } from "./sources";
export const LESSONS = [
  ...methods,
  ...middleAges,
  ...renaissance,
  ...reformation,
  ...absolutism,
  ...architecture,
  ...trade,
  ...english,
];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
