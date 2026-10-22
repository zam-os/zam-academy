import type { LabValues } from "../src/model/types";

/**
 * Stage 8: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_8: Record<string, Record<string, LabValues>> = {};

/** Stage 8: the teacher video of each lesson, checked against YouTube when it was chosen. */
export const VIDEOS_STAGE_8: Record<string, { author: string; id: string }> = {};
