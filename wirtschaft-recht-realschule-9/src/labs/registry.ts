import type { Lesson, LabKind } from "../model/types";
import { NUTZWERT } from "./beruf";
import type { Goal, LabDef } from "./engine";
import { GELDANLAGE, GENERATIONEN, KREDIT } from "./geld";
import { ARBEITSMARKT, KREISLAUF, MARKT } from "./markt";
import { GESCHAEFTSFAEHIGKEIT, JUGENDSTRAFRECHT, KAUFVERTRAG, STRAFBARKEIT } from "./recht";

export const LABS: Record<LabKind, LabDef> = {
  nutzwert: NUTZWERT,
  arbeitsmarkt: ARBEITSMARKT,
  markt: MARKT,
  kreislauf: KREISLAUF,
  generationen: GENERATIONEN,
  geldanlage: GELDANLAGE,
  kredit: KREDIT,
  geschaeftsfaehigkeit: GESCHAEFTSFAEHIGKEIT,
  kaufvertrag: KAUFVERTRAG,
  strafbarkeit: STRAFBARKEIT,
  jugendstrafrecht: JUGENDSTRAFRECHT,
};

/** The assignments a lesson asks for: all of its lab's, or the ones it names. */
export function goalsOf(lesson: Pick<Lesson, "lab" | "labGoals">): Goal[] {
  if (!lesson.lab) return [];
  const goals = LABS[lesson.lab].goals;
  return lesson.labGoals ? goals.filter((g) => lesson.labGoals?.includes(g.id)) : goals;
}

