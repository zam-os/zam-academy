import type { LabValues } from "../src/model/types";

/**
 * Stage 1: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_1: Record<string, Record<string, LabValues>> = {
  "dv-1-dreiecksexistenz": {
    // 5 cm + 3 cm = 8 cm: the circles touch on [AB]
    grenzfall: { view: 0, a: 5, b: 3, c: 8, alpha: 70, beta: 60 },
    // a = b = 5 cm and 5 cm < c = 8 cm < 10 cm: γ is the largest angle
    gleichschenklig: { view: 0, a: 5, b: 5, c: 8, alpha: 70, beta: 60 },
    // 110° + 70° = 180°: the free legs are parallel
    parallel: { view: 1, a: 4, b: 3, c: 8, alpha: 110, beta: 70 },
  },
  "dv-2-dreieckskonstruktion": {
    // WSW with 40° + 50° = 90°, so γ = 90°
    "rechter-winkel": { fall: 2, c: 6, a: 5, b: 4, alpha: 40, beta: 50, step: 4 },
    // 3 cm + 4 cm < 8 cm: the circles miss each other
    "keine-loesung": { fall: 0, c: 8, a: 3, b: 4, alpha: 50, beta: 60, step: 4 },
    // c = 7 cm, a = 5 cm, α = 40°: the circle around B meets the free leg twice
    "zwei-loesungen": { fall: 3, c: 7, a: 5, b: 4, alpha: 40, beta: 60, step: 4 },
  },
  "dv-3-kongruenz": {
    // a = 5 cm is shorter than c = 7 cm and longer than the distance of B from the leg (about 4,5 cm)
    zwei: { art: 3, c: 7, a: 5, b: 4, alpha: 40, beta: 60 },
    // α = 120° needs a > c; a = 5,5 cm is the shortest on the slider for c = 5 cm
    stumpf: { art: 3, c: 5, a: 5.5, b: 4, alpha: 120, beta: 60 },
    // 60°, 60° and 60°: equilateral, of any size
    gleichseitig: { art: 4, c: 6, a: 5, b: 4, alpha: 60, beta: 60 },
  },
  "dv-4-vierecke": {
    // AB→ = (4 | 1), AD→ = (1 | 4): four sides √17, no right angle
    raute: { sel: 0, xA: 1, yA: 1, xB: 5, yB: 2, xC: 6, yC: 6, xD: 2, yD: 5 },
    // AC on y = 3, BD on x = 3: perpendicular, but neither halves the other
    senkrecht: { sel: 0, xA: 1, yA: 3, xB: 3, yB: 1, xC: 7, yC: 3, xD: 3, yD: 6 },
    // isosceles trapezoid: AC→ = (6 | 4), BD→ = (−6 | 4), both √52
    diagonalen: { sel: 0, xA: 1, yA: 1, xB: 9, yB: 1, xC: 7, yC: 5, xD: 3, yD: 5 },
  },
  "dv-5-viereckskonstruktion": {
    // B(6 | 1) under C(6 | 4): right angle at B, D = A ⊕ BC→ = (1 | 4)
    rechteck: { fig: 0, modus: 0, sel: 1, xA: 1, yA: 1, xB: 6, yB: 1, xC: 6, yC: 4, f: 3 },
    // freehand D stays at (3 | 4) while B moves to (5 | 1): AB ∥ CD, but BC and DA are not parallel
    augenmass: { fig: 0, modus: 1, sel: 1, xA: 1, yA: 1, xB: 5, yB: 1, xC: 8, yC: 4, f: 3 },
    // the Lot from B(4 | 1) meets AC in its midpoint (4 | 3): D = (4 | 5), four sides √13
    "drachen-raute": { fig: 2, modus: 0, sel: 1, xA: 1, yA: 3, xB: 4, yB: 1, xC: 7, yC: 3, f: 3 },
  },
  "dv-6-vierecke-anwenden": {
    // 2 · 2 + 4 = 8: the top side sits in the middle
    gleichschenklig: { fig: 0, hilfe: 0, a: 8, c: 4, h: 4, s: 2, e: 8, f: 5, p: 30, b: 4, alpha: 60 },
    // M in the middle of [AC]
    raute: { fig: 1, hilfe: 1, a: 8, c: 4, h: 4, s: 1, e: 8, f: 5, p: 50, b: 4, alpha: 60 },
    // α = 120°, β = 60°
    doppelt: { fig: 2, hilfe: 0, a: 8, c: 4, h: 4, s: 1, e: 8, f: 5, p: 30, b: 4, alpha: 120 },
  },
};
