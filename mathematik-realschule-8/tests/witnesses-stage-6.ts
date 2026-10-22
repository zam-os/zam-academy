import type { LabValues } from "../src/model/types";

/**
 * Stage 6: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_6: Record<string, Record<string, LabValues>> = {
  "fu-1-funktionen": {
    // P₄ moved from (4 | 5) to (2 | 1): x = 2 now has y = 4 and y = 1, and the test line x = 2 meets both
    "zwei-werte": { sel: 4, x1: 0, y1: 1, x2: 1, y2: 3, x3: 2, y3: 4, x4: 2, y4: 1, x5: 5, y5: 2, s: 2 },
    // five different x, y = 3 three times: still a function
    "gleicher-wert": { sel: 3, x1: 0, y1: 1, x2: 1, y2: 3, x3: 2, y3: 3, x4: 4, y4: 3, x5: 5, y5: 2, s: 3 },
    // y = 2 at x = 0, 1, 2, 4, 5: W = {2}
    konstant: { sel: 1, x1: 0, y1: 2, x2: 1, y2: 2, x3: 2, y3: 2, x4: 4, y4: 2, x5: 5, y5: 2, s: 3 },
  },
  "fu-2-darstellungen": {
    // (−3)² − 2 = 7, and also 3² − 2 = 7
    "wert-sieben": { f: 1, x: -3 },
    // 12 : 8 = 1,5
    beschreibung: { f: 2, x: 8 },
    // 2,5 Brezen do not exist
    einzelpunkte: { f: 4, x: 2.5 },
  },
  "fu-3-werte-nullstellen": {
    // f₁(−4) = −3 and f₁(2) = 0
    "w-intervall": { f: 0, a: -4, b: 2 },
    // f₂ on [−3; 2]: W = [1; 6], all values positive
    positiv: { f: 1, a: -3, b: 2 },
    // f₃ on [−1; 4]: only the Nullstelle 2, W = [f(0); f(4)] = [−2; 6]
    "eine-nullstelle": { f: 2, a: -1, b: 4 },
  },
};
