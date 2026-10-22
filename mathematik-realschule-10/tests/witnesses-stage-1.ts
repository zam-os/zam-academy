import type { LabValues } from "../src/model/types";

/**
 * Stage 1: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_1: Record<string, Record<string, LabValues>> = {
  "tr-1-einheitskreis": {
    "cos-minus-halb": { alpha: 120 },
    "tan-eins": { alpha: 225 },
    "nicht-definiert": { alpha: 270 },
  },
  "tr-2-winkel-bis-360": {
    "kosinus-negativ": { fn: 1, alpha: -60 },
    "sinus-zweite": { fn: 0, alpha: 210 },
    "tangens-partner": { fn: 2, alpha: 220 },
  },
  "tr-3-steigungswinkel": {
    gerade: { a1: 135, a2: 105, sx: 1, sy: 2 },
    senkrecht: { a1: 30, a2: 120, sx: 1, sy: 1 },
    stumpf: { a1: 20, a2: 150, sx: -1, sy: 0.5 },
  },
  "tr-4-sinusfunktion": {
    periode: { alpha: 410, ctx: 0 },
    "nullstelle-fallend": { alpha: 540, ctx: 0 },
    riesenrad: { alpha: 210, ctx: 1 },
  },
  "tr-5-kosinus-tangens": {
    asymptote: { view: 1, alpha: -90 },
    "kosinus-steigt": { view: 0, alpha: 270 },
    komplement: { view: 2, alpha: 60 },
  },
  "tr-6-additionstheoreme": {
    fuenfundsiebzig: { fn: 0, alpha: 45, beta: 30 },
    fehler: { fn: 0, alpha: 80, beta: 80 },
    differenz: { fn: 1, alpha: 45, beta: -30 },
  },
};

/** Stage 1: the teacher video of each lesson. Videos are chosen and verified centrally later. */
export const VIDEOS_STAGE_1: Record<string, { author: string; id: string }> = {};
