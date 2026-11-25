import data from "./lessons.json";
import type { Lesson, Track } from "../model/types";

export {
  CURRICULUM_URL,
  CURRICULUM_URL_IIIA,
  EDITORIAL_DATE,
  FORMULAS,
  SOURCES,
  STAGES,
  type StageSpec,
} from "./sources";

export const LESSONS = data as Lesson[];
export const CORE_LESSONS = LESSONS.filter((l) => !l.optional);
export const lessonsFor = (track: Track): Lesson[] =>
  CORE_LESSONS.filter((l) => l.tracks.includes(track));
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
