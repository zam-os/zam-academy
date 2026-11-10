import type { Lesson } from "../model/types";
import stage1 from "./stage-1.json";
import stage2 from "./stage-2.json";
import stage3 from "./stage-3.json";
import stage4 from "./stage-4.json";
import stage5 from "./stage-5.json";
import stage6 from "./stage-6.json";

export { CHECKED, CURRICULUM_URL, SOURCES, STAGES } from "./sources";

// The content contract for the JSON shell is validated for every lesson.
export const LESSONS = [
  ...stage1,
  ...stage2,
  ...stage3,
  ...stage4,
  ...stage5,
  ...stage6,
] as Lesson[];
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
