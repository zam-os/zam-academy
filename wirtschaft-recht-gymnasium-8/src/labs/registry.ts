import type { Lesson, LabKind } from "../model/types";
import type { Goal, LabDef } from "./engine";
import { BUDGET, DIAGRAMM, KAUFKRAFT, KREDIT, NUTZWERT, PREISSCHILD } from "./haushalt";
import { JUGENDSCHUTZ, VERANTWORTUNG } from "./recht";
import { ARBEITSTEILUNG, FERTIGUNG, KALKULATION, LEBENSZYKLUS, PORTFOLIO } from "./unternehmen";

export const LABS: Record<LabKind, LabDef> = {
  nutzwert: NUTZWERT,
  preisschild: PREISSCHILD,
  kaufkraft: KAUFKRAFT,
  budget: BUDGET,
  kredit: KREDIT,
  arbeitsteilung: ARBEITSTEILUNG,
  fertigung: FERTIGUNG,
  lebenszyklus: LEBENSZYKLUS,
  portfolio: PORTFOLIO,
  kalkulation: KALKULATION,
  verantwortung: VERANTWORTUNG,
  jugendschutz: JUGENDSCHUTZ,
  diagramm: DIAGRAMM,
};

/** The assignments a lesson asks for: all of its lab's, or the ones it names. */
export function goalsOf(lesson: Pick<Lesson, "lab" | "labGoals">): Goal[] {
  if (!lesson.lab) return [];
  const goals = LABS[lesson.lab].goals;
  return lesson.labGoals ? goals.filter((g) => lesson.labGoals?.includes(g.id)) : goals;
}
