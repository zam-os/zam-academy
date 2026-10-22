import type { LabValues } from "../src/model/types";

/**
 * Stage 4: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_4: Record<string, Record<string, LabValues>> = {
  "tg-1-terme": {
    // x = 1: x² · x³ = x⁶ and 2x · 3x = 6x both give equal values.
    zwei: { x: 1, y: 2 },
    // x = y: 3x²y + 5xy² = 8x²y slips through, and only that one.
    eine: { x: 2, y: 2 },
    // no 0, no 1, x ≠ y, y ≠ 0
    alle: { x: 2, y: 1 },
  },
  "tg-2-ausmultiplizieren": {
    // (p + q) · x = 6 · 4 = 24
    fehler: { x: 4, p: 3, q: 3 },
    // (x + 3)(x − 3) = x² − 9
    "ohne-x": { x: 5, p: 3, q: -3 },
    // (2 + 2)(2 − 1) = 4 = 2²
    quadrat: { x: 2, p: 2, q: -1 },
  },
  "tg-3-binomische-formeln": {
    // 2 · 4,5 · 2 = 18
    fehler: { mode: 0, a: 4.5, b: 2 },
    // (a + b)² − 2(a² + b²) = −(a − b)², zero only for a = b
    doppelt: { mode: 0, a: 3, b: 3 },
    // (5 + 1)(5 − 1) = 24
    dritte: { mode: 2, a: 5, b: 1 },
  },
};
