import type { LabValues } from "../src/model/types";

/** Stage 4: one setting per lab goal that reaches it. */
export const GOAL_WITNESSES_STAGE_4: Record<string, Record<string, LabValues>> = {
  "df-1-differenzenquotient": {
    // 0,5 · (1 + 3) = 2
    "steigung-2": { fn: 0, x0: 1, x1: 3 },
    waagrecht: { fn: 0, x0: -2, x1: 2 },
    // (49 − 25) : 2 = 12
    geschwindigkeit: { fn: 1, x0: 5, x1: 7 },
  },
  "df-2-differentialquotient": {
    klein: { fn: 0, x0: 1, h: 0.05, side: 1 },
    // 4 − 0,05 = 3,95
    links: { fn: 0, x0: 2, h: 0.05, side: 0 },
    "steigung-3": { fn: 1, x0: 1, h: 0.05, side: 1 },
  },
  "df-3-differenzierbarkeit": {
    betrag: { m1: -1, m2: 1, zoom: 1 },
    glatt: { m1: 1, m2: 1, zoom: 1 },
    lupe: { m1: -1, m2: 1, zoom: 64 },
  },
  "df-4-ableitungsfunktion": {
    // 3(x + 1)(x − 1)
    kubisch: { fn: 0, u: -1, v: 1, a: 3 },
    // −x(x − 2)
    "nach-unten": { fn: 1, u: 0, v: 2, a: -1 },
    // (x − 1)(x − 3)
    verschoben: { fn: 2, u: 1, v: 3, a: 1 },
  },
  "df-5-ableitungsregeln": {
    konstant: { a: 0, b: 0, c: 2, d: 0, x0: 1 },
    parabel: { a: 1, b: 0, c: -3, d: 0, x0: 1 },
    verschoben: { a: 0, b: 3, c: 0, d: 2, x0: 1 },
  },
  "df-6-aenderungsrate": {
    // s′(2) = 20
    zwanzig: { fn: 0, x0: 2 },
    // (240 − 96) / 10 = 14,4 %
    steil: { fn: 1, x0: 2 },
    steilste: { fn: 1, x0: 2.5 },
  },
  "df-7-tangente": {
    "45-grad": { x0: 1 },
    // y = 2x
    ursprung: { x0: 2 },
    waagrecht: { x0: 0 },
  },
};
