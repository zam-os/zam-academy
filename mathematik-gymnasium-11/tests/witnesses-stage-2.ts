import type { LabValues } from "../src/model/types";

/** Stage 2: one setting per lab goal that reaches it. */
export const GOAL_WITNESSES_STAGE_2: Record<string, Record<string, LabValues>> = {
  "gr-1-definitionsmenge": {
    // (x − 1) / ((x + 1)(x − 2))
    "zwei-luecken": { nz: 1, z1: 1, z2: 0, nd: 2, p1: -1, p2: 2 },
    // (x + 3)(x − 3) / x
    "zwei-nullstellen": { nz: 2, z1: -3, z2: 3, nd: 1, p1: 0, p2: 0 },
    // 1 / (x − 1)²
    doppelt: { nz: 0, z1: 2, z2: 0, nd: 2, p1: 1, p2: 1 },
  },
  "gr-2-asymptoten": {
    "gleicher-grad": { fn: 0, m: 0, t: 2 },
    quotient: { fn: 2, m: 0, t: -1.5 },
    schraeg: { fn: 3, m: 0.5, t: -1 },
  },
  "gr-3-polstellen": {
    // −1/(x − 1)²
    "ohne-vzw-unten": { a: -1, p: 1, n: 2, side: 1, dist: 1 },
    // 1/(x + 1)
    "links-minus": { a: 1, p: -1, n: 1, side: 1, dist: 1 },
    // 1/(x − 1)² bei x = 0,95: 1/0,0025 = 400
    gross: { a: 1, p: 1, n: 2, side: 0, dist: 0.05 },
  },
  "gr-4-graph-term": {
    // 2(x − 2)/(x + 1)
    vzw: { a: 2, z: 2, p: -1, n: 1 },
    // 2x/(x − 3)²: f(1) = 2/4
    "ohne-vzw": { a: 2, z: 0, p: 3, n: 2 },
    // −(x + 2)/(x − 1)
    negativ: { a: -1, z: -2, p: 1, n: 1 },
  },
  "gr-5-schnittpunkte": {
    // 1/x = −x + 2 ⇔ (x − 1)² = 0
    beruehren: { fn: 0, m: -1, t: 2 },
    // y = 1 ist die Asymptote
    asymptote: { fn: 1, m: 0, t: 1 },
    ursprung: { fn: 0, m: 1, t: 0 },
  },
};
