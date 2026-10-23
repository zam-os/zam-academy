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
  "tg-4-faktorisieren": {
    // x² + 10x + 25 = (x + 5)²
    ergaenzen: { A: 1, B: 10, C: 25 },
    // 2x² + 12x + 18 = 2(x + 3)²
    zwei: { A: 2, B: 12, C: 18 },
    // 4x² + 8x + 4 = (2x + 2)² = 4(x + 1)²
    doppelt: { A: 4, B: 8, C: 4 },
  },
  "tg-5-extremwerte": {
    // x² + 4x + 5 = (x + 2)² + 1
    kleinster: { a: 1, b: 4, c: 5, x: 0 },
    // −x² + 2x + 3 = −(x − 1)² + 4
    max4: { a: -1, b: 2, c: 3, x: 0 },
    // T(6) = 36 − 36 + 14 = T(0): mirror image of 0 at d = 3
    spiegel: { a: 1, b: -6, c: 14, x: 6 },
  },
  "tg-6-extremwertprobleme": {
    // A(x) = −2(x − 2,75)² + 55,125
    maximum: { mode: 0, x: 2.75, show: 0 },
    // A(4,5) = 3,5 · 14 = 49 = A(1); 4,5 and 1 lie symmetric to 2,75
    gleich: { mode: 0, x: 4.5, show: 0 },
    // A(x) = 2(x − 4)² + 32
    minimum: { mode: 2, x: 4, show: 1 },
  },
  "tg-7-gleichungen": {
    // (x + 3)² − (x + 1)(x + 5) = 0 ⇔ 0 · x = −4
    keine: { p: 3, q: 1, r: 5, k: 0, G: 0 },
    // (x + 3)² − (x + 1)(x + 5) = 4 ⇔ 0 · x = 0
    alle: { p: 3, q: 1, r: 5, k: 4, G: 0 },
    // (x + 3)² − (x + 1)(x + 2) = 0 ⇔ 3x = −7: x = −7/3 is no natural number
    grundmenge: { p: 3, q: 1, r: 2, k: 0, G: 2 },
  },
  "tg-8-sachaufgaben": {
    // x(x + 8) = (x + 2)(x + 5) ⇔ x = 10
    gleich: { d: 8, m: 2, n: 3, x: 10 },
    // 4 × 9 becomes 6 × 6
    quadrat: { d: 5, m: 2, n: 3, x: 4 },
    // x × (x + 3) becomes (x + 3) × x: the same rectangle, turned
    jedes: { d: 3, m: 3, n: 3, x: 4 },
  },
  "tg-9-ungleichungen": {
    // −3x + 5 ≥ 17 ⇔ x ≤ −4; −6 solves it, but −6 ≥ −4 is false
    umkehr: { a: -3, b: 5, rel: 3, c: 17, t: -6 },
    // x < 2
    offen: { a: 1, b: 0, rel: 0, c: 2, t: 0 },
    // −2x < 7 ⇔ x > −3,5: the smallest whole solution is −3
    ganzzahl: { a: -2, b: 0, rel: 0, c: 7, t: -3 },
  },
};
