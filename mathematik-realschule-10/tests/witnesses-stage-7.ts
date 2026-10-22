import type { LabValues } from "../src/model/types";

/**
 * Stage 7: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_7: Record<string, Record<string, LabValues>> = {
  "qf-1-parabeln": {
    // −(x − 2)² + 3
    spiegeln: { a: -1, xs: 2, ys: 3 },
    // 0,5(x + 3)² − 2
    gestaucht: { a: 0.5, xs: -3, ys: -2 },
    // 2(x − 2)² − 3 = 2x² − 8x + 5
    "y-achse": { a: 2, xs: 2, ys: -3 },
  },
  "qf-2-scheitelpunkt": {
    // x² − 6x + 9 − 9 + 5 = (x − 3)² − 4
    normalform: { a: 1, p: -6, c: 5, s: 3 },
    // 2[x² + 4x + 4 − 4] + 3 = 2(x + 2)² − 5
    ausklammern: { a: 2, p: 4, c: 3, s: 2 },
    // −[x² − 5x + 6,25 − 6,25] − 4 = −(x − 2,5)² + 2,25
    wertemenge: { a: -1, p: -5, c: -4, s: 2.5 },
  },
  "qf-3-bestimmungsstuecke": {
    // S(0 | 4), P(4 | 0): a = −0,25
    bogen: { mode: 0, a: 1, xs: 0, ys: 4, xp: 4, yp: 0, xq: -2, yq: 1 },
    // −0,5x² + x + 4 through its roots (−2 | 0) and (4 | 0)
    nullstellen: { mode: 1, a: -0.5, xs: 0, ys: 0, xp: -2, yp: 0, xq: 4, yq: 0 },
    // 2x² − 4x + 1 through (1 | −1) and (0 | 1)
    "y-achse": { mode: 1, a: 2, xs: 0, ys: 0, xp: 1, yp: -1, xq: 0, yq: 1 },
  },
  "qf-4-extremwerte": {
    // A(x) = x(30 − 2x), largest at x = 7,5
    mauer: { mode: 0, L: 30, x: 7.5 },
    // A(x) = x(36 − 3x), largest at x = 6
    trennzaun: { mode: 1, L: 36, x: 6 },
    // A(x) = x(12 − x) = 32 at x = 4
    flaeche: { mode: 2, L: 24, x: 4 },
  },
  "qf-5-loesungsformel": {
    // x² + 4x + 4: D = 0
    beruehren: { a: 1, b: 4, c: 4 },
    // −x² − 2: D = −8
    "keine-unten": { a: -1, b: 0, c: -2 },
    // −x² + 2x + 3 = −(x + 1)(x − 3)
    loesungsmenge: { a: -1, b: 2, c: 3 },
  },
  "qf-6-schnittpunkte": {
    // 0,5x² − 2 = 2x − 4 ⇔ 0,5(x − 2)² = 0
    tangente: { mode: 0, m: 2, t: -4, a2: -1, d: 0, e: 3 },
    // 0,5x² − 2 = −0,5(x − 2)² − 1 ⇔ (x − 1)² = 0
    beruehren: { mode: 1, m: 1, t: 1, a2: -0.5, d: 2, e: -1 },
    // 0,5x² − 2 = 0,5(x − 2)² ⇔ 2x − 4 = 0
    "gleiches-a": { mode: 1, m: 1, t: 1, a2: 0.5, d: 2, e: 0 },
  },
};

/** Stage 7: the teacher videos are added centrally later. */
export const VIDEOS_STAGE_7: Record<string, { author: string; id: string }> = {};
