import type { LabValues } from "../src/model/types";

/**
 * Stage 2: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_2: Record<string, Record<string, LabValues>> = {
  "dr-1-drehung": {
    // ABC turned by 90° about Z(0 | −1) is Dreieck 2; the Mittelsenkrechten of Dreieck 2 meet there
    ziel: { phi: 90, zx: 0, zy: -1, hilfe: 2 },
    // −270° = 90° − 360°: the same rotation
    negativ: { phi: -270, zx: 0, zy: -1, hilfe: 0 },
    // Z on the corner A(2 | 1): A is the Fixpunkt
    fixpunkt: { phi: 45, zx: 2, zy: 1, hilfe: 0 },
  },
  "dr-2-punktspiegelung": {
    // 360° : 5 = 72°
    fuenf: { n: 5, muster: 0, phi: 72 },
    // three arms: 120°, 180° is no multiple of 120°
    "nur-dreh": { n: 3, muster: 1, phi: 120 },
    // 60°, 120°, …, 300°: five angles, 300° the largest
    groesster: { n: 6, muster: 0, phi: 300 },
  },
  "dr-3-vektoren": {
    // (5; 2) turned by +90° is (−2; 5) = w
    umkehren: { mode: 0, phi: 90, vx: 5, vy: 2, zx: -2, zy: -1, bx: -1, by: -4 },
    // ZP→ = (3; 2) turned by +90° is (−2; 3); Z(1 | −1) ⊕ (−2; 3) = T(−1 | 2)
    zentrum: { mode: 1, phi: 90, vx: 3, vy: 1, zx: 1, zy: -1, bx: -1, by: -4 },
    // AB→ = (5; −1), AD→ = (1; 5), C = B ⊕ AD→ = (2 | 2)
    quadrat: { mode: 2, phi: 90, vx: 3, vy: 1, zx: -2, zy: -1, bx: 1, by: -3 },
  },
};
