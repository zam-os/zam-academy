import type { LabValues } from "../src/model/types";

/**
 * Stage 1: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable.
 */
export const GOAL_WITNESSES_STAGE_1: Record<string, Record<string, LabValues>> = {
  "fk-1-funktionstypen": {
    // −x³: punktsymmetrisch und streng monoton fallend
    "punkt-fallend": { type: 2, a: -1, x0: 1 },
    // 2ˣ liegt oberhalb der x-Achse
    asymptote: { type: 4, a: 1, x0: 1 },
    // 2 sin x bei x = 1,5: 2 sin 1,5 ≈ 1,995
    periodisch: { type: 5, a: 2, x0: 1.5 },
  },
  "fk-2-grenzverhalten": {
    // 3/x ≤ 0,5 ⇔ x ≥ 6
    "streifen-05": { fn: 0, c: 2, eps: 0.5, x0: 6 },
    // 3/x ≤ 0,25 ⇔ x ≥ 12
    "streifen-025": { fn: 0, c: 2, eps: 0.25, x0: 12 },
    // 2 · 0,5ˣ ≤ 0,25 ⇔ x ≥ 3
    "von-unten": { fn: 1, c: 1, eps: 0.25, x0: 3 },
  },
  "fk-3-symmetrie": {
    // x² + 1
    achse: { a: 0, b: 1, c: 0, d: 1, p: 2 },
    // x³ − x
    punkt: { a: 1, b: 0, c: -1, d: 0, p: 2 },
    // 0,5x³ − 2x: f(2) = f(−2) = 0, aber punkt- statt achsensymmetrisch
    zufall: { a: 0.5, b: 0, c: -2, d: 0, p: 2 },
  },
  "fk-4-transformationen": {
    // (x − 2)² − 1
    verschieben: { base: 0, a: 1, b: 1, c: -2, d: -1 },
    // 2⁻ˣ
    spiegeln: { base: 1, a: 1, b: -1, c: 0, d: 0 },
    // 2 sin(0,5x)
    sinus: { base: 2, a: 2, b: 0.5, c: 0, d: 0 },
  },
  "fk-5-reihenfolge": {
    // x² + 2, dann · 2
    "erst-verschieben": { base: 0, t1: 1, t2: 2, p: 1 },
    // 2x², dann + 2
    "erst-strecken": { base: 0, t1: 2, t2: 1, p: 1 },
    // (x − 1)², dann gespiegelt
    vertauschbar: { base: 0, t1: 4, t2: 3, p: 1 },
  },
  "fk-6-stetigkeit": {
    // x − 1 trifft bei x = 2 den Wert 1
    stetig: { m: 1, t: -1 },
    // 2x − 3: Wert 1 und Steigung 2 wie die Parabel
    glatt: { m: 2, t: -3 },
    // y = −1: Sprung von −1 auf 1
    sprung: { m: 0, t: -1 },
  },
};
