import lb1 from "./lessons-lb1.json";
import lb2 from "./lessons-lb2.json";
import lb3 from "./lessons-lb3.json";
import lb4 from "./lessons-lb4.json";
import lb5 from "./lessons-lb5.json";
import type { Lesson, Track } from "../model/types";

export {
  CURRICULUM_URL_M,
  CURRICULUM_URL_R,
  EDITORIAL_DATE,
  FORMULAS,
  SOURCES,
  STAGES,
  type StageSpec,
} from "./sources";

/** One JSON file per Lernbereich; the order of the files is the order of the learning path. */
export const LESSONS = [...lb1, ...lb2, ...lb3, ...lb4, ...lb5] as Lesson[];
export const CORE_LESSONS = LESSONS.filter((l) => !l.optional);
export const lessonsFor = (track: Track): Lesson[] =>
  CORE_LESSONS.filter((l) => l.tracks.includes(track));
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
