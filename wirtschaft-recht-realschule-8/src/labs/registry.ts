import type { Lesson, LabKind } from "../model/types";
import { NUTZWERT } from "./beruf";
import type { Goal, LabDef } from "./engine";
import { ARBEITSMARKT, KREISLAUF, MARKT } from "./markt";
import { GESCHAEFTSFAEHIGKEIT, KAUFVERTRAG } from "./recht";

import { GRUNDPREIS } from "./verbrauch";

export const LABS: Record<LabKind, LabDef> = {
  nutzwert: NUTZWERT,
  arbeitsmarkt: ARBEITSMARKT,
  markt: MARKT,
  kreislauf: KREISLAUF,
  geschaeftsfaehigkeit: GESCHAEFTSFAEHIGKEIT,
  kaufvertrag: KAUFVERTRAG,
  grundpreis: GRUNDPREIS,
};

/** The assignments a lesson asks for: all of its lab's, or the ones it names. */
export function goalsOf(lesson: Pick<Lesson, "lab" | "labGoals">): Goal[] {
  if (!lesson.lab) return [];
  const goals = LABS[lesson.lab].goals;
  return lesson.labGoals ? goals.filter((g) => lesson.labGoals?.includes(g.id)) : goals;
}
