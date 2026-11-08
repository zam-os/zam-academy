import type { LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1 } from "./witnesses-stage-1";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";

/**
 * ZAM cards (zam-academy:mathematik-gymnasium-13) cite these lesson ids.
 * Renaming a lesson breaks every card that cites it: change the cell in the
 * same step.
 */
export const LESSON_IDS = [
  "int-1-flaechenbilanz",
  "int-2-integralfunktion",
  "int-3-hauptsatz",
  "int-4-graphen",
  "int-5-stammfunktionen",
  "int-6-flaechen",
  "int-7-uneigentlich",
  "int-8-gesamtaenderung",
  "int-9-rotationskoerper",
  "nv-1-zufallsgroessen",
  "nv-2-glockenkurve",
  "nv-3-dichte-verteilung",
  "nv-4-sigma-regeln",
  "rg-1-geraden",
  "rg-2-linearkombination",
  "rg-3-ebene-parameterform",
  "rg-4-ebene-koordinatenform",
  "rg-5-lage-geraden",
  "rg-6-gerade-ebene",
  "rg-7-lage-ebenen",
  "rg-8-abstaende",
  "rg-9-kugeln",
  "aw-1-verknuepfte-funktionen",
  "aw-2-parameter",
  "aw-3-extremwerte",
  "aw-4-sachzusammenhaenge",
  "aw-5-anwendungen",
];

/** Per lesson and lab goal, a setting that reaches the goal (see the stage files). */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  ...GOAL_WITNESSES_STAGE_1,
  ...GOAL_WITNESSES_STAGE_2,
  ...GOAL_WITNESSES_STAGE_3,
  ...GOAL_WITNESSES_STAGE_4,
};
