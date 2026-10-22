import type { LabValues } from "../src/model/types";

/**
 * Stage 3: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_3: Record<string, Record<string, LabValues>> = {
  "vk-1-vektoren": {
    "betrag-fuenf": { ax: -4, ay: -2, bx: -1, by: 2 },
    gegenvektor: { ax: 2, ay: -1, bx: -1, by: 1 },
    schaft: { ax: -2, ay: -1, bx: 1, by: 4 },
  },
  "vk-2-skalarprodukt": {
    senkrecht: { ax: 4, ay: 1, bx: -1, by: 4 },
    stumpf: { ax: 4, ay: 1, bx: -3, by: 2 },
    fuenfundvierzig: { ax: 4, ay: 1, bx: 3, by: 5 },
  },
  "vk-3-abstand": {
    lot: { g: 1, px: -3, py: 4, fx: -1.2 },
    abstand: { g: 2, px: 3, py: 1, fx: 1 },
    fusspunkt: { g: 1, px: 3, py: 0, fx: 2 },
  },
  "ab-1-verschiebung-streckung": {
    verschiebung: { mode: 0, vx: 2, vy: 3, zx: 0, zy: 0, k: 1.5 },
    fixpunkt: { mode: 1, vx: 3, vy: 1, zx: 0, zy: -2, k: 2 },
    vierfach: { mode: 1, vx: 3, vy: 1, zx: 0, zy: 0, k: -2 },
  },
  "ab-2-achsenspiegelung": {
    "y-achse": { alpha: 90, px: 3, py: 2 },
    fixpunkt: { alpha: 45, px: 2, py: 2 },
    winkelhalbierende: { alpha: 135, px: 4, py: 0 },
  },
  "ab-3-drehung": {
    neunzig: { phi: 90, px: 4, py: 1, zx: 0, zy: 0 },
    punktspiegelung: { phi: 180, px: 4, py: 1, zx: 1, zy: 1 },
    zentrum: { phi: -90, px: 5, py: 1, zx: 2, zy: 1 },
  },
  "ab-4-determinante": {
    zehn: { ax: 0, ay: -3, bx: 4, by: -2, cx: -4, cy: 1, map: 0 },
    uhrzeigersinn: { ax: -4, ay: -3, bx: 2, by: -2, cx: 3, cy: -5, map: 0 },
    kollinear: { ax: -4, ay: -3, bx: 2, by: 0, cx: -2, cy: -2, map: 0 },
  },
  "ab-5-traegergraph": {
    "y-achse": { graph: 0, map: 0, x: -2, trace: 0 },
    fixpunkt: { graph: 0, map: 1, x: 2, trace: 0 },
    parallel: { graph: 0, map: 2, x: 2, trace: 1 },
  },
};
