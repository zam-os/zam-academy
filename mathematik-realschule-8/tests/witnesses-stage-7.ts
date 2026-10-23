import type { LabValues } from "../src/model/types";

/**
 * Stage 7: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_7: Record<string, Record<string, LabValues>> = {
  "dz-1-ergebnis-ereignis": {
    // „Augenzahl höchstens 6“ = {1; …; 6}, confirmed by 10 throws
    sicher: { exp: 0, art: 2, k: 6, n0: 10 },
    // „ungerade Augenzahl“ = {1; 3; 5}: three results, without the 6
    drei: { exp: 0, art: 6, k: 5 },
    // „Augenzahl 6“ = {6}: with the start seed the sixth Sechs falls within 40 throws
    einzeln: { exp: 0, art: 3, k: 6, n0: 40 },
  },
  "dz-2-baumdiagramm": {
    // three throws, „mindestens einmal Kopf“: every path but ZZZ
    sieben: { exp: 0, stufen: 3, rot: 2, blau: 2, gruen: 0, ereignis: 1 },
    // three colours, two draws with replacement: 3 · 3 = 9
    neun: { exp: 1, stufen: 2, rot: 1, blau: 1, gruen: 1, ereignis: 0 },
    // two red, one blue, two draws without replacement: rr, rb, br (bb is missing)
    weniger: { exp: 2, stufen: 2, rot: 2, blau: 1, gruen: 0, ereignis: 0 },
  },
};
