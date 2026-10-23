import type { LabValues } from "../src/model/types";

/**
 * Stage 3: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_3: Record<string, Record<string, LabValues>> = {
  "rg-1-koerpersymmetrie": {
    // the plane perpendicular to a space diagonal cuts the cube in a hexagon: its mirror image sticks out
    "wuerfel-keine-ebene": { body: 2, elem: 0, k: 10, alpha: 0, view: 30 },
    // the space diagonal through two corners: 360° : 3 = 120°
    "ecken-achse": { body: 2, elem: 1, k: 10, alpha: 120, view: 30 },
    // the height of the pyramid (candidate 3, the vertical axis): 90°, and no centre
    "achse-ohne-zentrum": { body: 3, elem: 1, k: 3, alpha: 90, view: 30 },
  },
  "rg-2-axialschnitte": {
    // a rectangle 1 cm away from the axis turns into a pipe
    rohr: { shape: 0, r: 2, h: 3, r2: 1, k: 2, d: 1, phi: 360 },
    // h = 2r: the Axialschnitt is 4 cm × 4 cm
    quadrat: { shape: 0, r: 2, h: 4, r2: 1, k: 2, d: 0, phi: 360 },
    // r = 2, h = 3,5: s ≈ 4,03 cm and 2r = 4 cm
    gleichseitig: { shape: 1, r: 2, h: 3.5, r2: 1, k: 2, d: 0, phi: 360 },
  },
  "rg-3-raumkoordinaten": {
    // P(0 | 3 | 2) lies in the yz-plane
    "yz-ebene": { x: 0, y: 3, z: 2, u: 4, v: 1, w: 3, qpath: 0 },
    // (0 | 2 | 2) and (3 | 3 | 3) are 0,09 cm apart in the picture
    "gleiches-bild": { x: 0, y: 2, z: 2, u: 3, v: 3, w: 3, qpath: 1 },
    // Q(2 | 3 | 0) lies below P(2 | 3 | 2)
    fusspunkt: { x: 2, y: 3, z: 2, u: 2, v: 3, w: 0, qpath: 0 },
  },
};
