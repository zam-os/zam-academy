import type { LabValues } from "../src/model/types";

/**
 * Stage 5: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_5: Record<string, Record<string, LabValues>> = {
  "el-1-exponentialfunktion": {
    "zwei-punkte": { k: 2, a: 2, cmp: 0 },
    spiegelbild: { k: 1, a: 0.5, cmp: 0 },
    parabel: { k: 1, a: 3, cmp: 2 },
  },
  "el-2-wachstum": {
    zinseszins: { N0: 1000, p: 3, t: 24 },
    abbau: { N0: 500, p: -25, t: 3 },
    messwerte: { N0: 300, p: 20, t: 2 },
  },
  "el-3-logarithmus": {
    acht: { a: 2, b: 8 },
    keine: { a: 2, b: -1 },
    "minus-eins": { a: 2, b: 0.5 },
  },
  "el-4-logarithmensaetze": {
    hundert: { rule: 0, u: 4, v: 25, r: 2 },
    zufall: { rule: 0, u: 2, v: 2, r: 2 },
    acht: { rule: 2, u: 2, v: 3, r: 3 },
  },
  "el-5-exponentialfunktion-allgemein": {
    verschieben: { a: 3, k: 1, b: -1, c: -2, inv: 0 },
    wertemenge: { a: 0.5, k: -1, b: 0, c: 2, inv: 0 },
    "y-achse": { a: 2, k: 0.5, b: -2, c: -1, inv: 1 },
  },
  "el-6-logarithmusfunktion": {
    "asymptote-punkt": { a: 2, k: 1, b: -2, c: 1, mirror: 0 },
    umkehrung: { a: 2, k: 1, b: 3, c: 1, mirror: 1 },
    fallend: { a: 0.5, k: 1, b: 3, c: 0, mirror: 0 },
  },
  "ab-6-funktionsgraphen": {
    verschiebung: { f: 0, map: 0, vx: -1, vy: -3, k: 2 },
    "log-basis": { f: 1, map: 1, vx: 2, vy: 1, k: 2 },
    streckung: { f: 2, map: 4, vx: 2, vy: 1, k: 4 },
  },
};
