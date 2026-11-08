import type { LabValues } from "../src/model/types";

/**
 * Stage 2: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_2: Record<string, Record<string, LabValues>> =
  {
    "nv-1-zufallsgroessen": {
      "summe-eins-halbe": {
        art: 0,
        h1: 0.15,
        h2: 0.35,
        h3: 0.25,
        h4: 0.25,
        a0: 0,
        b0: 4,
        hh: 0.25,
        xstelle: 2,
        lo: 0,
        hi: 2,
      },
      "flaeche-eins-viertel": {
        art: 1,
        h1: 0.4,
        h2: 0.3,
        h3: 0.2,
        h4: 0.2,
        a0: 0,
        b0: 4,
        hh: 0.25,
        xstelle: 2,
        lo: 1,
        hi: 2,
      },
      "punkt-ohne-breite": {
        art: 1,
        h1: 0.4,
        h2: 0.3,
        h3: 0.2,
        h4: 0.2,
        a0: 0,
        b0: 4,
        hh: 0.25,
        xstelle: 2,
        lo: 3,
        hi: 4,
      },
    },
    "nv-2-glockenkurve": {
      glockenform: { n: 30, mu: 100, sigma: 2 },
      "mittelwert-nah": { n: 40, mu: 100, sigma: 1 },
      "streuung-verdoppelt": { n: 20, mu: 100, sigma: 4 },
    },
    "nv-3-dichte-verteilung": {
      "mu-sigma-einstellen": { mu: 2, sigma: 1, x: 2 },
      "stelle-f-95": { mu: 2, sigma: 1, x: 3.65 },
      "sigma-doppelt": { mu: 2, sigma: 2, x: 2 },
    },
    "nv-4-sigma-regeln": {
      "intervall-68": { a: 90, b: 110, mu: 100, sigma: 10 },
      "intervall-95": { a: 80, b: 120, mu: 100, sigma: 10 },
      "asymmetrisch-40-50": { a: 95, b: 108, mu: 100, sigma: 10 },
    },
  };
