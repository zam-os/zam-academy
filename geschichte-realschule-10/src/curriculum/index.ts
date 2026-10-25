import { coldwar } from "./coldwar";
import { division } from "./division";
import { english } from "./english";
import { historyCulture, migration } from "./longitudinal";
import { methods } from "./methods";
import { postwar } from "./postwar";
import { present } from "./present";

export { CURRICULUM_URL, SOURCES, STAGES, TERMS } from "./sources";
export const LESSONS = [
  ...methods,
  ...postwar,
  ...division,
  ...coldwar,
  ...present,
  ...migration,
  ...historyCulture,
  ...english,
];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
