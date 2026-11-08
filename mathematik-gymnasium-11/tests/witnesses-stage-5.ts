import type { LabValues } from "../src/model/types";

/** Stage 5: one setting per lab goal that reaches it. */
export const GOAL_WITNESSES_STAGE_5: Record<string, Record<string, LabValues>> = {
  "ku-1-monotonie": {
    // f(0) = 0 > f(0,5) = −1,375
    fallend: { fn: 0, x1: 0, x2: 0.5 },
    "ueber-null": { fn: 1, x1: -1, x2: 1 },
    intervall: { fn: 0, x1: -1, x2: 1 },
  },
  "ku-2-extremstellen": {
    hochpunkt: { fn: 0, x0: -1 },
    tiefpunkt: { fn: 1, x0: 2 },
    terrasse: { fn: 1, x0: 0 },
  },
  "ku-3-kruemmung": {
    wende: { x0: 1 },
    // f′(−0,5) = 3,75 > 0, f″(−0,5) = −9 < 0
    "steigend-rechts": { x0: -0.5 },
    // f′(1,5) = −2,25 < 0, f″(1,5) = 3 > 0
    "fallend-links": { x0: 1.5 },
  },
  "ku-4-bedingungen": {
    "kein-extremum": { a: 0, b: 1, c: 0 },
    "tief-trotz": { a: 1, b: 0, c: 0 },
    hochpunkt: { a: 0, b: 0, c: -1 },
  },
  "ku-5-untersuchung": {
    // 0,5(x + 2)x(x − 2) = 0,5x³ − 2x
    ursprung: { a: 0.5, r1: -2, r2: 0, r3: 2 },
    // (x + 2)(x − 1)² = x³ − 3x + 2: T(1 | 0)
    doppelt: { a: 1, r1: -2, r2: 1, r3: 1 },
    // −(x + 2)²(x − 1) = −x³ − 3x² + 4: H(0 | 4)
    "hochpunkt-y": { a: -1, r1: -2, r2: -2, r3: 1 },
  },
  "ku-6-newton": {
    // 2 → 1,6667 → 1,5486 → 1,5324 → 1,5321
    groesste: { x0: 2, n: 4 },
    abbruch: { x0: 1, n: 1 },
    // −2 → −1,8889 → −1,8795 → −1,8794
    kleinste: { x0: -2, n: 3 },
  },
};
