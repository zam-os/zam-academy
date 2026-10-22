import type { Lesson } from "../model/types";
import { LB1 } from "./lb1-beruf";
import { LB2 } from "./lb2-markt";
import { LB3 } from "./lb3-verbraucher";
import { LB4A } from "./lb4a-rechtsordnung";
import { LB4B } from "./lb4b-strafrecht";
import { LB5 } from "./lb5-english";

export { CURRICULUM_URL, EDITORIAL_DATE, SOURCES, STAGES } from "./sources";

/** The Fachlehrplan's own titles of its units (LB 3 has no sub-units). */
const UNIT_TITLES: Record<string, string> = {
  "1.1": "Arbeit und Arbeitsmarkt",
  "1.2": "Berufswahl und Ausbildung",
  "2.1": "Wirtschaftliches Handeln",
  "2.2": "Die Soziale Marktwirtschaft als Wirtschaftsordnung",
  "3": "Verbraucherschutz und verantwortungsbewusstes Verbraucherverhalten",
  "4.1": "Der Jugendliche in unserer Rechtsordnung",
  "4.2": "Privatrechtliche Regelungen aus dem Eigentums- und Vertragsrecht",
  "4.3": "Strafrecht",
};

/** One Fachlehrplan serves I and III, so every lesson names both groups and its place in the plan. */
function placed(lesson: Lesson): Lesson {
  const where =
    lesson.lb === 5
      ? `WR9 LB 5 (I/III): Bilingualer Sachfachunterricht, zu ${lesson.unit} ${UNIT_TITLES[lesson.unit]}`
      : `WR9 LB ${lesson.unit} (I/III): ${UNIT_TITLES[lesson.unit]}`;
  return { ...lesson, tracks: ["I", "III"], lehrplan: where };
}

export const LESSONS: Lesson[] = [...LB1, ...LB2, ...LB3, ...LB4A, ...LB4B, ...LB5].map(placed);
export const CORE_LESSONS = LESSONS.filter((l) => !l.optional);
export const findLesson = (id: string) => LESSONS.find((l) => l.id === id);
