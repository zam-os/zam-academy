import type { LabValues } from "../src/model/types";

/**
 * Stage 5: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_5: Record<string, Record<string, LabValues>> = {};
