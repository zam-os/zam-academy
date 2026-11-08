import type { Lesson, Stage } from "../model/types";
import { makeStage } from "./builders";
import { STAGE_1_LESSONS } from "./stage-1-analysis-produkt-kette";
import { STAGE_2_LESSONS } from "./stage-2-stochastik-binomial";
import { STAGE_3_LESSONS } from "./stage-3-signifikanztest";
import { STAGE_4_LESSONS } from "./stage-4-analysis-quotient-umkehr";
import { STAGE_5_LESSONS } from "./stage-5-geometrie-raum";

export const STAGES: Stage[] = [
  makeStage(
    1,
    "Ganzrationale Scharen, Stammfunktionen, e-Funktion und Trigonometrie",
    "#2563eb",
    "📈",
    STAGE_1_LESSONS,
  ),
  makeStage(
    2,
    "Axiome, Zufallsgrößen, Urnenmodelle und Bernoulli-Ketten",
    "#059669",
    "🎲",
    STAGE_2_LESSONS,
  ),
  makeStage(
    3,
    "Einseitige Hypothesentests, Fehler 1. & 2. Art und Signifikanz",
    "#d97706",
    "⚖️",
    STAGE_3_LESSONS,
  ),
  makeStage(
    4,
    "Gebrochen-rationale Kurven, Wurzelfunktion und natürlicher Logarithmus",
    "#7c3aed",
    "🔍",
    STAGE_4_LESSONS,
  ),
  makeStage(
    5,
    "3D-Koordinaten, Vektoralgebra, Skalar- und Vektorprodukt an Raumkörpern",
    "#e11d48",
    "📐",
    STAGE_5_LESSONS,
  ),
];

export const ALL_LESSONS: Lesson[] = STAGES.flatMap((stage) => stage.lessons);

export function findLessonById(
  id: string,
): { stage: Stage; lesson: Lesson } | undefined {
  for (const stage of STAGES) {
    const lesson = stage.lessons.find((entry) => entry.id === id);
    if (lesson) return { stage, lesson };
  }
  return undefined;
}

export function findStageById(id: string): Stage | undefined {
  return STAGES.find((stage) => stage.id === id);
}

export function nextLesson(currentId: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === currentId);
  return index >= 0 && index < ALL_LESSONS.length - 1
    ? ALL_LESSONS[index + 1]
    : undefined;
}

export function previousLesson(currentId: string): Lesson | undefined {
  const index = ALL_LESSONS.findIndex((lesson) => lesson.id === currentId);
  return index > 0 ? ALL_LESSONS[index - 1] : undefined;
}
