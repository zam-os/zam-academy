import type { LabValues } from "../src/model/types";
import { GOAL_WITNESSES_STAGE_1 } from "./witnesses-stage-1";
import { GOAL_WITNESSES_STAGE_2 } from "./witnesses-stage-2";
import { GOAL_WITNESSES_STAGE_3 } from "./witnesses-stage-3";
import { GOAL_WITNESSES_STAGE_4 } from "./witnesses-stage-4";
import { GOAL_WITNESSES_STAGE_5 } from "./witnesses-stage-5";
import { GOAL_WITNESSES_STAGE_6 } from "./witnesses-stage-6";
import { GOAL_WITNESSES_STAGE_7 } from "./witnesses-stage-7";

/** Per lesson and lab goal, a setting that reaches the goal (see the stage files). */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  ...GOAL_WITNESSES_STAGE_1,
  ...GOAL_WITNESSES_STAGE_2,
  ...GOAL_WITNESSES_STAGE_3,
  ...GOAL_WITNESSES_STAGE_4,
  ...GOAL_WITNESSES_STAGE_5,
  ...GOAL_WITNESSES_STAGE_6,
  ...GOAL_WITNESSES_STAGE_7,
};
