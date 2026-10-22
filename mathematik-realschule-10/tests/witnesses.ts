import type { LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1, VIDEOS_STAGE_1 } from "./witnesses-stage-1";
import { GOAL_WITNESSES_STAGE_2, VIDEOS_STAGE_2 } from "./witnesses-stage-2";
import { GOAL_WITNESSES_STAGE_3, VIDEOS_STAGE_3 } from "./witnesses-stage-3";
import { GOAL_WITNESSES_STAGE_4, VIDEOS_STAGE_4 } from "./witnesses-stage-4";
import { GOAL_WITNESSES_STAGE_5, VIDEOS_STAGE_5 } from "./witnesses-stage-5";
import { GOAL_WITNESSES_STAGE_6, VIDEOS_STAGE_6 } from "./witnesses-stage-6";
import { GOAL_WITNESSES_STAGE_7, VIDEOS_STAGE_7 } from "./witnesses-stage-7";
import { GOAL_WITNESSES_STAGE_8, VIDEOS_STAGE_8 } from "./witnesses-stage-8";

/**
 * ZAM cards (zam-academy:mathematik-realschule-10) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
export const LESSON_IDS = [
  "tr-1-einheitskreis",
  "tr-2-winkel-bis-360",
  "tr-3-steigungswinkel",
  "tr-4-sinusfunktion",
  "tr-5-kosinus-tangens",
  "tr-6-additionstheoreme",
  "dr-1-sinussatz",
  "dr-2-kosinussatz",
  "dr-3-flaecheninhalt",
  "dr-4-ebene-raum",
  "dr-5-gleichungen",
  "vk-1-vektoren",
  "vk-2-skalarprodukt",
  "vk-3-abstand",
  "ab-1-verschiebung-streckung",
  "ab-2-achsenspiegelung",
  "ab-3-drehung",
  "ab-4-determinante",
  "ab-5-traegergraph",
  "pt-1-potenzgesetze",
  "pt-2-wurzeln",
  "pt-3-potenzfunktionen",
  "pt-4-parameter",
  "pt-5-umkehrfunktion",
  "el-1-exponentialfunktion",
  "el-2-wachstum",
  "el-3-logarithmus",
  "el-4-logarithmensaetze",
  "el-5-exponentialfunktion-allgemein",
  "el-6-logarithmusfunktion",
  "ab-6-funktionsgraphen",
  "rg-1-axialschnitt",
  "rg-2-oberflaeche",
  "rg-3-volumen",
  "rg-4-zusammengesetzt",
  "rg-5-extremwerte",
  "qf-1-parabeln",
  "qf-2-scheitelpunkt",
  "qf-3-bestimmungsstuecke",
  "qf-4-extremwerte",
  "qf-5-loesungsformel",
  "qf-6-schnittpunkte",
  "dz-1-mehrstufig",
  "dz-2-pfadregeln",
  "dz-3-anwendungen",
];

/** Per lesson and lab goal, a setting that reaches the goal (see the stage files). */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  ...GOAL_WITNESSES_STAGE_1,
  ...GOAL_WITNESSES_STAGE_2,
  ...GOAL_WITNESSES_STAGE_3,
  ...GOAL_WITNESSES_STAGE_4,
  ...GOAL_WITNESSES_STAGE_5,
  ...GOAL_WITNESSES_STAGE_6,
  ...GOAL_WITNESSES_STAGE_7,
  ...GOAL_WITNESSES_STAGE_8,
};

/** Per lesson, the pinned teacher video: author and YouTube id. */
export const EXPECTED_VIDEOS: Record<string, { author: string; id: string }> = {
  ...VIDEOS_STAGE_1,
  ...VIDEOS_STAGE_2,
  ...VIDEOS_STAGE_3,
  ...VIDEOS_STAGE_4,
  ...VIDEOS_STAGE_5,
  ...VIDEOS_STAGE_6,
  ...VIDEOS_STAGE_7,
  ...VIDEOS_STAGE_8,
};
