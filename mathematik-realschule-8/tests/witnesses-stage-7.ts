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
  "dz-3-vierfeldertafel": {
    // 36 + 24 − 46 = 14 girls with glasses, so 22 without and 10 boys with glasses
    oder: { a: 14, b: 22, c: 10, d: 20, ereignis: 1, baum: 0 },
    // 6 of 24 girls and 8 of 32 boys: a quarter each
    gleich: { a: 6, b: 18, c: 8, d: 24, ereignis: 0, baum: 0 },
    // 10 boys but only a third, 8 girls and half of them
    mehr: { a: 8, b: 8, c: 10, d: 20, ereignis: 0, baum: 1 },
  },
  "dz-4-haeufigkeiten": {
    // with the start seed: 44 sixes in 300 throws, h(6) ≈ 0,147
    sechs: { spiel: 0, tipp: 0, n0: 300 },
    // h(6) ≈ 0,147 against ≈ 0,247 after 300 throws each
    fundbuero: { spiel: 1, tipp: 0, n0: 300, n1: 300 },
    // after 200 spins: A ≈ 0,225, B ≈ 0,365
    raeder: { spiel: 3, tipp: 2, n3: 200 },
  },
};
