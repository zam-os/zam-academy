import type { LabValues } from "../src/model/types";

// Concrete learner-reachable configurations, independent of goal predicates.
export const WITNESSES: Record<string, LabValues[]> = {
  "dv-1-dreiecksungleichung": [
    { a: 5, b: 6, c: 7 },
    { a: 3, b: 4, c: 7 },
  ],
  "dv-2-dreieckskonstruktion": [
    { a: 5, b: 6, c: 7, step: 4 },
    { a: 5, b: 5, c: 6, step: 4 },
  ],
  "dv-3-kongruenz": [{ case: 3 }, { case: 4 }],
  "dv-4-vierecke": [
    { shape: 3, diagonals: 1 },
    { shape: 4, diagonals: 1 },
  ],
  "dv-5-viereckskonstruktion": [
    { shape: 1, a: 8, c: 4, h: 3, shift: 3 },
    { shape: 2, a: 8, h: 6 },
  ],
  "dr-1-drehung": [
    { x: 3, y: 1, zx: 0, zy: 0, angle: 90 },
    { x: 3, y: 1, zx: 1, zy: 1, angle: 180 },
  ],
  "dr-2-drehsymmetrie": [
    { shape: 2, angle: 72 },
    { shape: 4, angle: 180 },
  ],
  "dr-3-vektoren": [
    { x: 4, y: -2, turn: 1 },
    { x: -3, y: 2, turn: 2 },
  ],
  "rg-1-koerpersymmetrie": [
    { solid: 1, plane: 1 },
    { solid: 4, plane: 1 },
  ],
  "rg-2-axialschnitte": [
    { solid: 1, radius: 3, height: 8 },
    { solid: 2, radius: 4 },
  ],
  "rg-3-raumkoordinaten": [
    { x: 3, y: 2, z: 4 },
    { x: 0, y: 3, z: 2 },
  ],
  "rg-4-schraegbilder": [
    { solid: 0, depth: 8, q: 0.5, angle: 45 },
    { solid: 1, depth: 6, q: 0.25, angle: 60 },
  ],
  "rg-5-wahre-groesse": [
    { width: 5, depth: 8, q: 0.25 },
    { width: 5, depth: 8, q: 1 },
  ],
  "tg-1-termoperationen": [
    { a: 2, b: -1, c: 3, p: 1 },
    { a: 3, b: 2, c: 2, p: 3 },
  ],
  "tg-2-binomische-formeln": [
    { formula: 1, a: 7, b: 3 },
    { formula: 2, a: 8, b: 2 },
  ],
  "tg-3-faktorisieren": [
    { mode: 1, a: 5, b: 3 },
    { mode: 2, b: 4 },
  ],
  "tg-4-extremwerte": [
    { factor: 4, h: 3, k: 5, x: 3 },
    { factor: 1, h: -2, k: 4, x: -2 },
  ],
  "tg-5-gleichungen": [
    { a: 2, b: 3, c: 2, d: 3 },
    { a: 2, b: 3, c: 2, d: 4 },
  ],
  "tg-6-sachaufgaben": [
    { base: 6, unit: 3, budget: 30, count: 8 },
    { base: 4, unit: 5, budget: 29, count: 5 },
  ],
  "tg-7-ungleichungen": [
    { factor: 0, b: 4, d: 7, x: -1 },
    { factor: 4, b: 1, d: 5, x: 2 },
  ],
  "br-1-definitionsmenge": [
    { p: 2, q: -1, x: 2, cancel: 1 },
    { p: 3, q: -2, x: 1, cancel: 0 },
  ],
  "br-2-verhaeltnisgleichungen": [
    { a: 6, b: 4, p: 2, q: -1 },
    { a: 2, b: 3, p: 1, q: 1 },
  ],
  "br-3-formeln": [
    { distance: 120, speed: 80 },
    { distance: 90, speed: 120 },
  ],
  "fu-1-zuordnungen": [{ mode: 1 }, { mode: 2 }],
  "fu-2-darstellungen": [
    { mode: 0, x: -2 },
    { mode: 2, x: 0 },
  ],
  "fu-3-ursprungsgeraden": [
    { run: 2, rise: 4 },
    { run: 4, rise: -2 },
  ],
  "fu-4-geradenlagen": [
    { first: 6, second: 3 },
    { first: 1, second: 4 },
  ],
  "fu-5-achsenabschnitt": [
    { mode: 0, m: 0, t: 2 },
    { mode: 1, t: 3 },
  ],
  "fu-6-geraden-bestimmen": [
    { x1: 0, y1: 1, x2: 2, y2: 5 },
    { x1: 2, y1: 1, x2: 2, y2: -3 },
  ],
  "fu-7-flaechenmodelle": [{ x: 4 }, { x: 6 }],
  "dz-1-ergebnis-ereignis": [
    { event: 0, result: 2 },
    { event: 1, result: 0 },
  ],
  "dz-2-baum-tafel": [
    { kk: 4, kz: 3, zk: 2, zz: 1 },
    { kk: 2, kz: 6, zk: 1, zz: 1 },
  ],
};
