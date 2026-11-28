import type { Lesson } from "../model/types";
import { LB1_1 } from "./lb1-1-konsum";
import { LB1_2 } from "./lb1-2-geld";
import { LB2_1 } from "./lb2-1-unternehmen";
import { LB2_2 } from "./lb2-2-marketing";
import { LB3 } from "./lb3-recht";
import { LB4 } from "./lb4-profil";
import { OPTIONAL_LB } from "./sources";

export { CURRICULUM_URL, EDITORIAL_DATE, OPTIONAL_LB, SOURCES, STAGES } from "./sources";

/** The headings of the Fachlehrplan, per unit. */
export const UNIT_TITLES: Record<string, string> = {
  "1.1": "Entscheidungen beim Konsum",
  "1.2": "Entscheidungen beim Umgang mit Geld",
  "2.1": "Betriebliche Abläufe und Arbeitsteilung",
  "2.2": "Marketingentscheidungen",
  "3": "Rechtlich verantwortliches Handeln",
  "4.1": "Ökonomisches Handeln im privaten Haushalt (Vertiefung)",
  "4.2": "Ökonomisches Handeln im Unternehmen (Vertiefung)",
  "4.3": "Rechtlich verantwortliches Handeln (Vertiefung)",
  "4.4": "Projekt",
};

export const LESSONS: Lesson[] = [...LB1_1, ...LB1_2, ...LB2_1, ...LB2_2, ...LB3, ...LB4].map((lesson) => ({
  ...lesson,
  optional: lesson.lb === OPTIONAL_LB,
  tracks: ["WWG"],
  lehrplan: `WR8 LB ${lesson.unit} (WWG): ${UNIT_TITLES[lesson.unit]}`,
}));
export const CORE_LESSONS = LESSONS.filter((lesson) => !lesson.optional);
export const findLesson = (id: string) => LESSONS.find((lesson) => lesson.id === id);
