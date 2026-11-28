import { bavaria } from "./bavaria";
import { empire } from "./empire";
import { industry } from "./industry";
import { restoration } from "./restoration";
import { revolution } from "./revolution";
import { war } from "./war";

export { CURRICULUM_URL, SOURCES, STAGES } from "./sources";
export const LESSONS = [...revolution, ...restoration, ...bavaria, ...industry, ...empire, ...war];
export const CORE_LESSONS = LESSONS;
export const findLesson = (id: string) => LESSONS.find((entry) => entry.id === id);
