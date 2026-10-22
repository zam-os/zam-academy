import type { LabValues } from "../src/model/types";

/**
 * Stage 8: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_8: Record<string, Record<string, LabValues>> = {
  "dz-1-mehrstufig": {
    // With replacement and as many red as blue balls every path is (1/2)³.
    achtel: { rot: 3, blau: 3, draws: 3, mode: 0, z1: 0, z2: 0, z3: 1 },
    // Only two red balls: the third red branch of rrr is 0/4.
    unmoeglich: { rot: 2, blau: 4, draws: 3, mode: 1, z1: 0, z2: 0, z3: 0 },
    // 500 draws of rrb (P = 1/5) with 100 hits: relative frequency 20 %.
    simulation: { rot: 4, blau: 2, draws: 3, mode: 1, z1: 0, z2: 0, z3: 1, n: 500, hits: 100 },
  },
  "dz-2-pfadregeln": {
    // 3 · (6 · 5 · 4)/(10 · 9 · 8) = 3 · 1/6 = 1/2
    fuenfzig: { rot: 6, blau: 4, mode: 1, event: 1, sicht: 0 },
    // 1 − (2/10)³ = 99,2 %
    gegen: { rot: 8, blau: 2, mode: 0, event: 4, sicht: 2 },
    // As many red as blue: "höchstens eine rote" and "mindestens zwei rote" are mirror images.
    verkuerzt: { rot: 3, blau: 3, mode: 1, event: 5, sicht: 1 },
  },
  "dz-3-anwendungen": {
    // 1 − 0,75¹⁰ ≈ 94,37 %, 1 − 0,75¹¹ ≈ 95,78 %
    mc: { p: 25, n: 11, ziel: 95 },
    // 1 − 0,98³⁴ ≈ 49,69 %, 1 − 0,98³⁵ ≈ 50,69 %
    qualitaet: { p: 2, n: 35, ziel: 50 },
    // 1 − 0,64⁵ ≈ 89,26 %, 1 − 0,63⁵ ≈ 90,08 %
    "p-finden": { p: 37, n: 5, ziel: 90 },
  },
};

/** Stage 8: the teacher videos are chosen centrally later, so none is pinned here yet. */
export const VIDEOS_STAGE_8: Record<string, { author: string; id: string }> = {};
