import type { LabValues } from "../src/model/types";

/**
 * Stage 2: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_2: Record<string, Record<string, LabValues>> = {
  "dr-1-sinussatz": {
    // α = 60°, b = 4 cm, c = 8 cm is the 30-60-90 triangle: β = 30°, but a : b = √3, not 2.
    doppelt: { view: 0, alpha: 60, b: 4, c: 8, a: 5.5 },
    zwei: { view: 1, alpha: 35, b: 7, c: 7, a: 5 },
    // b · sin 30° = 4 = a: the circle touches the ray, one right triangle.
    beruehrt: { view: 1, alpha: 30, b: 8, c: 7, a: 4 },
  },
  "dr-2-kosinussatz": {
    pythagoras: { mode: 0, a: 5, b: 4, gamma: 90, c: 6 },
    // c² = 61 − 60 · cos 130° ≈ 99,57, c ≈ 9,98 cm.
    zehn: { mode: 0, a: 6, b: 5, gamma: 130, c: 6 },
    sss: { mode: 1, a: 3, b: 5, gamma: 70, c: 7 },
  },
  "dr-3-flaecheninhalt": {
    max: { a: 6, b: 5, gamma: 90 },
    gleich: { a: 6, b: 5, gamma: 140 },
    // ½ · 8 · 6 · sin 124° ≈ 19,90 cm².
    zwanzig: { a: 8, b: 6, gamma: 124 },
  },
  "dr-4-ebene-raum": {
    max: { x: 3.75, graph: 0 },
    kurz: { x: 1.5, graph: 1 },
    gleich: { x: 7.5, graph: 0 },
  },
  "dr-5-gleichungen": {
    eine: { view: 0, eq: 0, interval: 0, k: 1, phi: 30 },
    doppelt: { view: 0, eq: 3, interval: 1, k: 0.5, phi: 30 },
    traeger: { view: 1, eq: 0, interval: 0, k: 0.6, phi: 60 },
  },
};

/** Stage 2: the teacher video of each lesson; verified videos are added centrally later. */
export const VIDEOS_STAGE_2: Record<string, { author: string; id: string }> = {};
