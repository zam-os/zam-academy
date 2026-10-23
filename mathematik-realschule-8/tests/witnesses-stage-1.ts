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
};
