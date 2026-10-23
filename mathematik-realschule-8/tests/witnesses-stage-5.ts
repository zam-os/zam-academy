import type { LabValues } from "../src/model/types";

/**
 * Stage 5: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_5: Record<string, Record<string, LabValues>> = {
  "br-1-bruchterme": {
    // 2 · 1,5 − 3 = 0: T₂ has no value at x = 1,5
    "kein-wert": { b: 2, typ: 0, a: 2, c: -3, x: 1.5 },
    // T₁ = 6 : (x − 1,5) and T₂ = (x + 1) : (2x − 3) both have no value at 1,5
    "gleiche-luecke": { b: 1.5, typ: 0, a: 2, c: -3, x: 3 },
    // x² + 1 is never 0
    ueberall: { b: 2, typ: 1, a: 2, c: -3, x: 3 },
  },
  "br-2-definitionsmenge": {
    // (x + 1)(x − 3)
    zwei: { k: 1, f1: 1, a1: -1, f2: 1, a2: 3 },
    // x² + 1
    keine: { k: 1, f1: 3, a1: 2, f2: 0, a2: -1 },
    // 2x² − 8x = 2 · x(x − 4)
    faktor: { k: 2, f1: 1, a1: 0, f2: 1, a2: 4 },
  },
  "br-3-verhaeltnisgleichungen": {
    // 6 : (x − 2) = 4 : (x + 1) has the solution −7: both sides −2/3
    gleich: { a: 6, b: -2, c: 4, d: 1, x: -7, rechnung: 0 },
    // same Nenner x − 2: 6(x − 2) = 4(x − 2) gives x = 2, which is not in D
    leer: { a: 6, b: -2, c: 4, d: -2, x: 3, rechnung: 1 },
    // 2 : (x + 1) = 4 : (x + 2): 2 · 2 = 4 · 1, so x = 0
    null: { a: 2, b: 1, c: 4, d: 2, x: 3, rechnung: 0 },
  },
};
