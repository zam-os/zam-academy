import type { LabValues } from "../src/model/types";

/**
 * Stage 4: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_4: Record<string, Record<string, LabValues>> =
  {
    "aw-1-verknuepfte-funktionen": {
      // g(2) = 2² + 0 · 2 − 4 = 0 ⇒ h(2) = 0; Ableitung 0, innere Ableitung 4.
      nullstelle: { a: 0, b: -4, x: 2 },
      // g(1) = 1, g′(1) = 2 ⇒ h′(1) = 2 · 1 · 2 = 4; h(1) = 1 ≠ 0.
      "ableitung-vier": { a: 0, b: 0, x: 1 },
      // g′(−1) = 2 · (−1) + 2 = 0: Minimum der inneren Parabel an der Stelle.
      "minimum-inneres": { a: 2, b: 0, x: -1 },
    },
    "aw-2-parameter": {
      // f(1) = 1 + 1 = 2; f′(1) = 3 + 1 = 4 ≠ 0.
      punktbedingung: { a: 1, b: 1, bedingung: 0 },
      // f′(1) = 3 − 3 = 0; f(1) = 1 − 3 = −2 ≠ 0.
      "steigung-null": { a: 1, b: -3, bedingung: 1 },
      // f(1) = −1 + 3 = 2 und f′(1) = −3 + 3 = 0.
      beide: { a: -1, b: 3, bedingung: 2 },
    },
    "aw-3-extremwerte": {
      // f(x) = x auf [−1; 2]: Maximum 2 am rechten Rand, kein f′-Nullpunkt.
      "maximum-am-rand": { a: 0, b: 0, c: 1, l: -1, r: 2 },
      // f(x) = x³ − 3x auf [−2; 2]: f′ = 0 bei ±1, beide im Inneren.
      "zwei-extremstellen": { a: 1, b: 0, c: -3, l: -2, r: 2 },
      // f(x) = x² − 2x auf [0; 2]: Minimum −1 bei x = 1 im Inneren.
      "minimum-im-inneren": { a: 0, b: 1, c: -2, l: 0, r: 2 },
    },
    "aw-4-sachzusammenhaenge": {
      // Zaun P = 24: x* = 6 m, A = 72 m², Nebenbedingung y = 12 ≥ 6 erfüllt.
      optimum: { kontext: 0, x: 6, P: 24, V: 1000, A: 8 },
      // Kanister V = 1000: O(8) = 628 cm², 69 % besser als O(2) = 2008 cm²,
      // Bauhöhe 15,625 cm ≤ 50 cm erfüllt; |8 − 10| = 2 ist kein Optimum.
      besser: { kontext: 1, x: 8, P: 24, V: 1000, A: 8 },
      // Zaun P = 24 bei x = 11: y = 2 m ist kleiner als 6 m – verletzt.
      "nb-verletzt": { kontext: 0, x: 11, P: 24, V: 1000, A: 8 },
    },
    "aw-5-anwendungen": {
      // r(t) = t + 3 auf [0; 4]: G = (3 + 7) : 2 · 4 = 20.
      "gesamtmenge-20": { kontext: 0, a: 1, b: 3, T: 4 },
      // r(t) = −t + 6 auf [0; 4]: Endrate 2 < 6, G = 16 > 5.
      "rate-faellt": { kontext: 0, a: -1, b: 6, T: 4 },
      // r(t) = 2t − 4 auf [0; 4]: G = (−4 + 4) : 2 · 4 = 0, Vorzeichenwechsel.
      "gesamtmenge-null": { kontext: 0, a: 2, b: -4, T: 4 },
    },
  };
