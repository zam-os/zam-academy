import type { LabValues } from "../src/model/types";

/**
 * Stage 6: one setting of the sliders and choices per lab goal that reaches
 * it, the proof that every Laborauftrag is doable. State (simulation
 * counters) may be left out; it then keeps its start value.
 */
export const GOAL_WITNESSES_STAGE_6: Record<string, Record<string, LabValues>> = {
  "rg-1-axialschnitt": {
    // h = 2r: the Axialschnitt 2r × h is a square.
    quadrat: { shape: 0, r: 2, h: 4, r2: 1, k: 2, phi: 360 },
    // s = √(3² + 5,2²) ≈ 6,003 ≈ 2r.
    gleichseitig: { shape: 1, r: 3, h: 5.2, r2: 1, k: 2, phi: 0 },
    // 5 cm and 8 cm wide: radii 2,5 cm and 4 cm.
    becher: { shape: 3, r: 2.5, h: 6, r2: 4, k: 2, phi: 0 },
  },
  "rg-2-oberflaeche": {
    // s = √(3² + 5,2²) ≈ 6,003, α = 360° · 3 : 6,003 ≈ 179,9°.
    halbkreis: { solid: 3, a: 3, r: 3, h: 5.2, t: 100 },
    // h_s = √(5,2² + 3²) ≈ 6,003 ≈ a, so M = 2a · h_s ≈ 2a².
    pyramide: { solid: 1, a: 6, r: 2, h: 5.2, t: 0 },
    // u = 3a = 6 = h.
    prisma: { solid: 0, a: 2, r: 2, h: 6, t: 100 },
  },
  "rg-3-volumen": {
    schief: { mode: 0, a: 3, h: 5, r: 4, shift: 3, n: 8, z: 40 },
    // 32 slices: (33 · 65) : (2 · 32²) ≈ 1,047, 4,7 % above ⅓ · G · h.
    drittel: { mode: 1, a: 3, h: 5, r: 4, shift: 0, n: 32, z: 40 },
    // 4/3 · π · r³ = 4 · π · r² for r = 3.
    kugel: { mode: 2, a: 3, h: 5, r: 3, shift: 0, n: 8, z: 40 },
  },
  "rg-4-zusammengesetzt": {
    // π · 25 · 12 + ⅓ · π · 25 · 2,2 ≈ 1000,07 cm³.
    liter: { model: 0, r: 5, h: 12, k: 2.2, t: 50 },
    // ⅓ · π r² · k = ⅔ · π r³ for k = 2r.
    eistuete: { model: 2, r: 3, h: 6, k: 6, t: 50 },
    // 4π · 2² + 2π · 2 · 4 = 32π ≈ 100,53 cm².
    kapsel: { model: 3, r: 2, h: 4, k: 3, t: 50 },
  },
  "rg-5-extremwerte": {
    // Largest Mantel at x = r : 2.
    mantel: { task: 0, qty: 0, R: 6, hk: 9, x: 3, L: 20, c: 1 },
    // Largest volume at x = 2r : 3.
    volumen: { task: 0, qty: 1, R: 6, hk: 9, x: 4, L: 20, c: 1 },
    // Largest box at x = a : 6.
    schachtel: { task: 1, qty: 0, R: 6, hk: 9, x: 1, L: 24, c: 4 },
  },
};
