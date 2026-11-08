import type { LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1 } from "./witnesses-stage-1";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";
import { GOAL_WITNESSES_STAGE_5 } from "./witnesses-stage-5";

/**
 * ZAM cards (zam-academy:mathematik-gymnasium-11) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
export const LESSON_IDS = [
  "fk-1-funktionstypen",
  "fk-2-grenzverhalten",
  "fk-3-symmetrie",
  "fk-4-transformationen",
  "fk-5-reihenfolge",
  "fk-6-stetigkeit",
  "gr-1-definitionsmenge",
  "gr-2-asymptoten",
  "gr-3-polstellen",
  "gr-4-graph-term",
  "gr-5-schnittpunkte",
  "bw-1-bedingte-wahrscheinlichkeit",
  "bw-2-diagnostik",
  "bw-3-unabhaengigkeit",
  "bw-4-daten-hinterfragen",
  "df-1-differenzenquotient",
  "df-2-differentialquotient",
  "df-3-differenzierbarkeit",
  "df-4-ableitungsfunktion",
  "df-5-ableitungsregeln",
  "df-6-aenderungsrate",
  "df-7-tangente",
  "ku-1-monotonie",
  "ku-2-extremstellen",
  "ku-3-kruemmung",
  "ku-4-bedingungen",
  "ku-5-untersuchung",
  "ku-6-newton",
];

/** Per lesson and lab goal, a setting that reaches the goal (see the stage files). */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  ...GOAL_WITNESSES_STAGE_1,
  ...GOAL_WITNESSES_STAGE_2,
  ...GOAL_WITNESSES_STAGE_3,
  ...GOAL_WITNESSES_STAGE_4,
  ...GOAL_WITNESSES_STAGE_5,
};
