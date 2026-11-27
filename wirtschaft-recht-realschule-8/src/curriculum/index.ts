import type { Lesson } from "../model/types";
import { LB1 } from "./lb1-markt";
import { LB2 } from "./lb2-verbrauch";
import { LB3 } from "./lb3-recht";
import { LB4 } from "./lb4-privatrecht";
import { LB5 } from "./lb5-beruf";
import { LB6 } from "./lb6-english";
import { OPTIONAL_LB } from "./sources";

export { CURRICULUM_URL, EDITORIAL_DATE, OPTIONAL_LB, SOURCES, STAGES } from "./sources";

const UNIT_TITLES: Record<string, string> = {
  "1": "Grundzüge des Wirtschaftens auf dem Gütermarkt",
  "2": "Verbraucherschutz und verantwortungsbewusstes Verbraucherverhalten",
  "3": "Der Jugendliche in unserer Rechtsordnung",
  "4.1": "Eigentumsrecht (Sachenrecht)",
  "4.2": "Vertragsrecht (Schuldrecht)",
  "5": "Berufliche Orientierung",
  "6": "Bilingualer Sachfachunterricht",
};

export const LESSONS: Lesson[] = [...LB1, ...LB2, ...LB3, ...LB4, ...LB5, ...LB6].map((lesson) => ({
  ...lesson,
  optional: lesson.lb === OPTIONAL_LB,
  tracks: ["II"],
  lehrplan: `WR8 LB ${lesson.unit} (II): ${UNIT_TITLES[lesson.unit]}`,
}));
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
