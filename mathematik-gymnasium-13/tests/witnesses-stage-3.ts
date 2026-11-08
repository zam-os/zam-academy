import type { LabValues } from "../src/model/types";

/**
 * Stage 3 (Geraden und Ebenen im Raum): one setting of the sliders and
 * choices per lab goal that reaches it, the proof that every Laborauftrag
 * is doable. State (simulation counters) may be left out; it then keeps its
 * start value. Every value lies on its slider grid.
 */
export const GOAL_WITNESSES_STAGE_3: Record<string, Record<string, LabValues>> = {
  "rg-1-geraden": {
    "ursprung-richtung": { ax: 0, ay: 0, az: 0, ux: 1, uy: 0, uz: 0, t: 0 },
    "punkt-t-zwei": { ax: 0, ay: 0, az: 0, ux: 1, uy: 2, uz: 3, t: 2 },
    "z-achse": { ax: 0, ay: 0, az: 2, ux: 1, uy: 0, uz: 0, t: 0 },
  },
  "rg-2-linearkombination": {
    "r-zwei-s-minus-eins": { ux: 1, uy: 0, vx: 0, vy: 1, wx: 2, wy: -1, wz: 0 },
    kollinear: { ux: 1, uy: 0, vx: 2, vy: 0, wx: 1, wy: 1, wz: 0 },
    "ausserhalb-der-ebene": { ux: 1, uy: 0, vx: 0, vy: 1, wx: 0, wy: 0, wz: 1 },
  },
  "rg-3-ebene-parameterform": {
    "ebene-durch-ursprung": {
      px: 0, py: 0, pz: 0,
      ux: 1, uy: 0, uz: 0,
      vx: 0, vy: 0, vz: 1,
      r: 1, s: 1,
    },
    "x-drei-vier-null": {
      px: 1, py: 1, pz: 0,
      ux: 1, uy: 2, uz: 1,
      vx: 1, vy: 1, vz: -1,
      r: 1, s: 1,
    },
    "senkrecht-z-achse": {
      px: 0, py: 0, pz: 1,
      ux: 1, uy: 0, uz: 0,
      vx: 0, vy: 1, vz: 0,
      r: 0, s: 0,
    },
  },
  "rg-4-ebene-koordinatenform": {
    "ursprung-n-zwei": { nx: 0, ny: 0, nz: 2, d: 0 },
    "x-abschnitt-drei": { nx: 1, ny: 0, nz: 1, d: 3 },
    "parallel-z-achse": { nx: 0, ny: 1, nz: 0, d: 2 },
  },
  "rg-5-lage-geraden": {
    "schnittpunkt-ursprung": {
      ax: 1, ay: 2, az: 3,
      ux: -1, uy: -2, uz: -3,
      bx: 0, by: 1, bz: 0,
      vx: 0, vy: -1, vz: 0,
    },
    "parallele-geraden": {
      ax: 0, ay: 0, az: 0,
      ux: 1, uy: 0, uz: 0,
      bx: 0, by: 1, bz: 0,
      vx: 2, vy: 0, vz: 0,
    },
    windschief: {
      ax: 0, ay: 0, az: 0,
      ux: 1, uy: 0, uz: 0,
      bx: 0, by: 1, bz: 1,
      vx: 0, vy: 1, vz: 0,
    },
  },
  "rg-6-gerade-ebene": {
    "schnitt-t-eins": { nx: 1, ny: 0, nz: 0, d: 2, ax: 1, ay: 0, az: 0, ux: 1, uy: 0, uz: 0 },
    "gerade-in-ebene": { nx: 0, ny: 0, nz: 1, d: 1, ax: 2, ay: 2, az: 1, ux: 1, uy: 0, uz: 0 },
    "parallel-zur-ebene": { nx: 0, ny: 0, nz: 1, d: 1, ax: 0, ay: 0, az: 2, ux: 1, uy: 1, uz: 0 },
  },
  "rg-7-lage-ebenen": {
    "schnitt-x-achse": {
      n1x: 0, n1y: 1, n1z: 1, d1: 0,
      n2x: 0, n2y: 1, n2z: 0, d2: 0,
    },
    "parallele-ebenen": {
      n1x: 0, n1y: 0, n1z: 1, d1: 1,
      n2x: 0, n2y: 0, n2z: 2, d2: 3,
    },
    "senkrechte-ebenen": {
      n1x: 1, n1y: 0, n1z: 0, d1: 0,
      n2x: 0, n2y: 1, n2z: 0, d2: 0,
    },
  },
  "rg-8-abstaende": {
    "abstand-zwei": { mode: 1, px: 0, py: 0, pz: 0, ay: 0, az: 0, nx: 1, d: 6, b: 0 },
    "punkt-auf-gerade": { mode: 0, px: 3, py: 1, pz: -1, ay: 1, az: -1, nx: 0, d: 0, b: 0 },
    "windschief-eins": { mode: 2, px: 0, py: 0, pz: 0, ay: 0, az: 0, nx: 0, d: 0, b: 1 },
  },
  "rg-9-kugeln": {
    "kugel-ursprung": { mode: 0, mx: 0, my: 0, mz: 0, r: 3, nx: 0, ny: 0, nz: 1, d: 5, ay: 0, az: 0 },
    tangent: { mode: 0, mx: 1, my: 0, mz: 0, r: 3, nx: 0, ny: 0, nz: 1, d: 3, ay: 0, az: 0 },
    schneidend: { mode: 0, mx: 0, my: 0, mz: 0, r: 4, nx: 0, ny: 0, nz: 1, d: 1, ay: 0, az: 0 },
  },
};
