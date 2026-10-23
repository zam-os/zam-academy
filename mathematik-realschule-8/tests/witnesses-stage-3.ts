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
    "yz-ebene": { x: 0, y: 3, z: 2, u: 1, v: 5, w: 3, qpath: 0 },
    // (0 | 2 | 2) and (3 | 3 | 3) are 0,09 cm apart in the picture
    "gleiches-bild": { x: 0, y: 2, z: 2, u: 3, v: 3, w: 3, qpath: 1 },
    // Q(2 | 3 | 0) lies below P(2 | 3 | 2)
    fusspunkt: { x: 2, y: 3, z: 2, u: 2, v: 3, w: 0, qpath: 0 },
  },
  "rg-4-koerper-koordinaten": {
    // a cube with edge 3 standing on A(0 | 0 | 1): its top face lies at z = 4
    wuerfel: { body: 0, a: 3, b: 3, c: 3, ax: 0, ay: 0, az: 1 },
    // base 4 × 4 from A(0 | 1 | 0), height 5: S(0 + 2 | 1 + 2 | 5)
    spitze: { body: 1, a: 4, b: 4, c: 5, ax: 0, ay: 1, az: 0 },
    // tent from x = 1 to 5, ridge over y = 0 + 4 : 2 = 2 at height 3
    first: { body: 2, a: 4, b: 4, c: 3, ax: 1, ay: 0, az: 0 },
  },
  "rg-5-schraegbilder": {
    // base 3 cm × 6 cm, q = ½: the 6 cm depth edge is drawn 3 cm long, as long as the edge on s; at ω = 45° a rhombus
    "raute-bild": { body: 2, pos: 0, a: 3, b: 6, h: 4, omega: 45, q: 0.5 },
    // legs 3 cm (on s) and 4 cm (into the depth): ½ · 4 cm = 2 cm
    "tiefe-zwei": { body: 1, pos: 0, a: 3, b: 4, h: 4, omega: 45, q: 0.5 },
    // the 4 cm edge on s, the 6 cm edge into the depth
    "wahre-flaeche": { body: 0, pos: 1, a: 6, b: 4, h: 3, omega: 45, q: 0.5 },
  },
  "rg-6-wahre-groesse": {
    // the triangle AMS holds the height [MS] and the lateral edge [AS]
    "hoehe-kante": { body: 1, figQ: 1, figP: 1, a: 6, b: 4, h: 3, omega: 45 },
    // a square base: the diagonal makes 45° with [AB]
    "diagonale-45": { body: 0, figQ: 0, figP: 0, a: 5, b: 5, h: 3, omega: 45 },
    // a = b = 5, h = 3,5: [AS] ≈ 4,97 cm ≈ [AB]
    gleichseitig: { body: 1, figQ: 1, figP: 0, a: 5, b: 5, h: 3.5, omega: 45 },
  },
};
