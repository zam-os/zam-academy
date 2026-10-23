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
  "fu-4-ursprungsgeraden": {
    // m = 3 : (−4) = −3/4, and −3/4 · (−4) = 3
    "durch-q": { px: -4, py: 3, a: 0, d: 1 },
    // m = 2/3, triangle from O: 3 to the right, 2 up
    "dreieck-ganz": { px: 3, py: 2, a: 0, d: 3 },
    // m = −1/2, Δx = 4 gives Δy = −2
    fallend: { px: 2, py: -1, a: -2, d: 4 },
  },
  "fu-5-senkrecht": {
    // m₁ = 2, m₂ = −1/2
    "m-zwei": { x1: 1, y1: 2, x2: 2, y2: -1 },
    // m₁ = 2/3, m₂ = −3/2
    bruch: { x1: 3, y1: 2, x2: -2, y2: 3 },
    // the x-axis and the y-axis
    achse: { x1: 4, y1: 0, x2: 0, y2: 3 },
  },
  "fu-6-geraden": {
    // y = 0,5x + 2 through (−2 | 1) and (2 | 3)
    "zwei-punkte": { m: 0.5, t: 2 },
    // y = −2
    "parallele-x": { m: 0, t: -2 },
    // y = −0,5x + 2 has the Nullstelle 4
    "nullstelle-vier": { m: -0.5, t: 2 },
  },
  "fu-7-geraden-bestimmen": {
    // P(0 | 3), Q(4 | 1): m = −2 : 4 = −1/2, t = 3, and −0,5 · (−2) + 3 = 4
    "steigung-r": { px: 0, py: 3, qx: 4, qy: 1 },
    // P(−2 | −1), Q(4 | 2): m = 1/2, t = −1 − 0,5 · (−2) = 0
    ursprung: { px: -2, py: -1, qx: 4, qy: 2 },
    // x = 2
    "senkrecht-x": { px: 2, py: -3, qx: 2, qy: 4 },
  },
  "fu-8-parallelenscharen": {
    // 2 · (−2) + 5 = 1
    "durch-r": { m: 2, t: 5, px: 2, py: 3 },
    // y = 2x − 6 has the Nullstelle 3
    "nullstelle-drei": { m: 2, t: -6, px: 2, py: 3 },
    // h through P(2 | −1) with slope −1/2 meets y = 2x on the y-axis: −1 + 2 : 2 = 0
    "schnitt-y": { m: 2, t: 0, px: 2, py: -1 },
  },
  "fu-9-anwendungen": {
    // 30 € + 20 ct · 150 = 60 € = 15 € + 30 ct · 150
    "break-150": { t1: 30, m1: 20, t2: 15, m2: 30, x: 100 },
    // B: 10 € and 15 ct per km, both below A
    "immer-b": { t1: 30, m1: 20, t2: 10, m2: 15, x: 100 },
    // 30 € + 20 ct · 100 = 50 € = 20 € + 30 ct · 100
    "beide-50": { t1: 30, m1: 20, t2: 20, m2: 30, x: 100 },
  },
  "fu-10-flaechen": {
    // A(x) = 3 · 0 + 6 = 6
    sechs: { fig: 0, x: 0 },
    // C(−2 | 1) on AB: det = 6 · (−2) + 12 = 0
    "auf-ab": { fig: 0, x: -2 },
    // A(x) = −0,25(x − 3)² + 6,25
    maximum: { fig: 1, x: 3 },
  },
};
