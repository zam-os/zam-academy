import type { LabValues } from "../src/model/types";

/**
 * Stage 4: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_4: Record<string, Record<string, LabValues>> = {
  "pt-1-potenzgesetze": {
    // 2³ · 2⁻³ = 2⁰ = 1
    eins: { a: 2, q: 1, m: 3, n: -3 },
    // 9^(1/2) · 9^(1/2) = 9, so 9^(1/2) = 3
    wurzel: { a: 9, q: 2, m: 1, n: 1 },
    // 8¹ · 8^(−1/3) = 8 · 1/2 = 4 = 8^(2/3)
    acht: { a: 8, q: 3, m: 3, n: -1 },
  },
  "pt-2-wurzeln": {
    "zwei-loesungen": { n: 2, a: 9 },
    negativ: { n: 3, a: -8 },
    fuenfte: { n: 5, a: 32 },
  },
  "pt-3-potenzfunktionen": {
    hyperbel: { c: -2, x: 1 },
    // (−2)⁻³ = −1/8
    punkt: { c: -3, x: -2 },
    // √2,25 = 1,5
    wurzel: { c: 0.5, x: 2.25 },
  },
  "pt-4-parameter": {
    asymptoten: { c: -1, a: 1, b: -2, d: -1 },
    wertemenge: { c: -2, a: -1, b: 3, d: 2 },
    // y = 2√(x + 2) + 1 starts at (−2 | 1), and 2 · √4 + 1 = 5
    wurzel: { c: 0.5, a: 2, b: 2, d: 1 },
  },
  "pt-5-umkehrfunktion": {
    einschraenken: { c: 2, b: 0, d: 0, r: 1, x: 1.5 },
    // y = (x + 1)⁻¹ − 1 is its own inverse
    selbst: { c: -1, b: 1, d: -1, r: 0, x: 1 },
    // f: y = (x − 2)² + 1 on x ≥ 2 has f⁻¹: y = √(x − 1) + 2
    gleichung: { c: 2, b: -2, d: 1, r: 1, x: 3 },
  },
};
