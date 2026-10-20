import { agriculture } from "./agriculture";
import { borders } from "./borders";
import { cities } from "./cities";
import { climate } from "./climate";
import { english, foundations } from "./extensions";
import { landscapes } from "./landscapes";
import { local } from "./local";
import { population } from "./population";

export { CURRICULUM_URL, EDITORIAL_DATE, SOURCES, STAGES } from "./sources";
export const LESSONS = [
  ...landscapes,
  ...climate,
  ...agriculture,
  ...cities,
  ...population,
  ...borders,
  ...local,
  ...english,
  ...foundations,
];
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
