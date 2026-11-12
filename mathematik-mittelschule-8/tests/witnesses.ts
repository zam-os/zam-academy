import type { LabValues } from "../src/model/types";

/**
 * Konkrete Schieberegler- und Auswahlwerte (Zeugen) für jeden der 90 Laboraufträge.
 */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "pr-1-rabatt-preisaenderung": {
    "plus20-minus20": { start: 100, p1: 20, p2: -20 },
    "double-10": { start: 200, p1: -10, p2: -10 },
    "reach-150": { start: 100, p1: 50, p2: 0 },
  },
  "pr-2-skonto-umsatzsteuer": {
    "plus20-minus10": { start: 200, p1: 20, p2: -10 },
    "rebate-20-skonto-5": { start: 300, p1: -20, p2: -5 },
    "exact-190": { start: 200, p1: 0, p2: -5 },
  },
  "pr-3-brutto-netto-tara": {
    "brutto-50": { mode: 0, netto: 45, tara: 10 },
    "tara-20pct": { mode: 0, netto: 80, tara: 20 },
    "price-mode": { mode: 1, netto: 80, tara: 16 },
  },
  "pr-4-wachstumsfaktor": {
    "back-to-100": { start: 100, p1: 25, p2: -20 },
    "factor-132": { start: 100, p1: 20, p2: 10 },
    "reverse-start-200": { start: 200, p1: -20, p2: -10 },
  },
  "pr-5-kalkulation-verkaufspreis": {
    "simple-ust": { ek: 100, hk: 0, gew: 0, ust: 19 },
    "full-calc-132": { ek: 100, hk: 20, gew: 10, ust: 19 },
    "food-7pct": { ek: 200, hk: 20, gew: 10, ust: 7 },
  },
  "pr-6-schaubilder-prozent": {
    "plus-minus-zero": { mode: 0, a: 15, b: -30, c: 15, posA: 40, posB: 35 },
    "half-90": { mode: 1, a: 15, b: -10, c: 20, posA: 50, posB: 35 },
    "half-36": { mode: 1, a: 15, b: -10, c: 20, posA: 20, posB: 35 },
  },
  "pr-7-promillerechnung": {
    "half-percent": { pm: 5, base: 2000 },
    "val-120": { pm: 24, base: 5000 },
    "three-pct": { pm: 30, base: 2000 },
  },
  "wz-1-quadrieren-radizieren": {
    "square-64": { area: 64 },
    "square-144": { area: 144 },
    "approx-50": { area: 50 },
  },
  "wz-2-quadratwurzeln-ueberschlag": {
    "between-7-8": { area: 60 },
    "between-10-11": { area: 115 },
    "between-4-5": { area: 20 },
  },
  "kz-1-kreis-zirkel-pi": {
    "full-roll-r4": { r: 4, roll: 100 },
    "diam-10": { r: 5, roll: 50 },
    "diam-3": { r: 1.5, roll: 50 },
  },
  "kz-2-kreisumfang-umkehrung": {
    "double-r": { r: 5, roll: 100 },
    "r-6": { r: 6, roll: 100 },
    "d-4": { r: 2, roll: 100 },
  },
  "kz-3-kreisbogen-sektor": {
    "half-circle": { r: 4, mu: 180 },
    "quarter-r6": { r: 6, mu: 90 },
    "mu-120": { r: 4, mu: 120 },
  },
  "kz-4-zusammengesetzte-umfaenge": {
    "stadium-l8-d4": { mode: 0, a: 8, b: 4 },
    "arch-l5-d4": { mode: 1, a: 5, b: 4 },
    "d6-circle": { mode: 0, a: 4, b: 6 },
  },
  "kz-5-zylinder-netze-schraegbild": {
    "unfold-net": { fold: 1, r: 3, hk: 5 },
    "match-width-25": { fold: 1, r: 4, hk: 4 },
    "tall-cyl": { fold: 0, r: 2, hk: 7 },
  },
  "kf-1-kreisflaeche-herleitung": {
    "fine-24": { r: 3, parts: 24 },
    "double-from-2-to-4": { r: 4, parts: 6 },
    "r5-area": { r: 5, parts: 6 },
  },
  "kf-2-kreisflaeche-umkehrung": {
    "find-78-5": { r: 5, parts: 12 },
    "find-28-3": { r: 3, parts: 12 },
    "sectors-16": { r: 4, parts: 16 },
  },
  "kf-3-kreisring-sektor": {
    "ring-5-3": { R: 5, r: 3, mu: 360 },
    "half-ring": { R: 4, r: 2, mu: 180 },
    "ring-R6-r4": { R: 6, r: 4, mu: 360 },
  },
  "kf-4-zusammengesetzte-kreisflaechen": {
    "add-semi-a8": { mode: 0, a: 8 },
    "cutout-a6": { mode: 1, a: 6 },
    "cutout-a4": { mode: 1, a: 4 },
  },
  "kf-5-zylinder-oberflaeche": {
    "can-4-5": { fold: 1, r: 4, hk: 5 },
    "double-h-check": { fold: 1, r: 2, hk: 6 },
    "3d-view": { fold: 0, r: 3, hk: 7 },
  },
  "zy-1-zylindervolumen-analogie": {
    "half-full-r2": { r: 2, hk: 6, fill: 50 },
    "full-r4-h5": { r: 4, hk: 5, fill: 100 },
    "max-G": { r: 5, hk: 5, fill: 100 },
  },
  "zy-2-zylinder-zusammengesetzt": {
    "half-cyl-50": { r: 4, hk: 5, fill: 50 },
    "barrel-200": { r: 3, hk: 8, fill: 100 },
    "small-part": { r: 2, hk: 5, fill: 20 },
  },
  "zy-3-kreisringzylinder": {
    "pipe-4-2-5": { R: 4, r: 2, hk: 5 },
    "thin-wall-6-3-4": { R: 6, r: 3, hk: 4 },
    "max-pipe": { R: 6, r: 1, hk: 8 },
  },
  "zf-1-zufall-laplace": {
    "fair-50": { win: 4, totalSeg: 8, trials: 0, hits: 0 },
    "spin-20": { win: 3, totalSeg: 8, trials: 20, hits: 8 },
    "laplace-quarter": { win: 1, totalSeg: 4, trials: 0, hits: 0 },
  },
  "zf-2-relative-haeufigkeit-gdz": {
    "reach-100": { win: 3, totalSeg: 8, trials: 100, hits: 38 },
    "reach-200": { win: 3, totalSeg: 8, trials: 200, hits: 75 },
    "set-3-of-6": { win: 3, totalSeg: 6, trials: 0, hits: 0 },
  },
  "zf-3-gewinnchancen-aenderungen": {
    "double-chance-drop-total": { win: 2, totalSeg: 4, trials: 0, hits: 0 },
    "chance-5-of-8": { win: 5, totalSeg: 8, trials: 0, hits: 0 },
    "chance-1-of-6": { win: 1, totalSeg: 6, trials: 0, hits: 0 },
  },
  "gl-1-terme-k-a-d-gesetz": {
    "reach-60": { a: 4, b: 2, c: 7, x: 4 },
    "set-5-3-1": { a: 5, b: 3, c: 1, x: 2 },
    "equal-parts": { a: 3, b: 2, c: 6, x: 3 },
  },
  "gl-2-gleichungen-klammern": {
    "balance-start": { a: 4, b: -4, c: 2, d: 2, guessX: 3 },
    "solve-half-step": { a: 5, b: -3, c: 3, d: 4, guessX: 3.5 },
    "solve-neg": { a: 3, b: 6, c: 1, d: -2, guessX: -4 },
  },
  "gl-3-sachaufgaben-mischungen": {
    "rope-22": { a: 2, b: 6, c: 0, d: 22, guessX: 8 },
    "tariff-meet": { a: 4, b: 0, c: 2, d: 12, guessX: 6 },
    "age-riddle": { a: 3, b: -4, c: 1, d: 8, guessX: 6 },
  },
  "fk-1-zuordnungen-massstab": {
    "linear-t3": { kind: 1, m: 2, t: 3, scaleZoom: 0 },
    "zoom-axis": { kind: 0, m: 2, t: 2, scaleZoom: 1 },
    "curve-show": { kind: 2, m: 2, t: 2, scaleZoom: 0 },
  },
  "fk-2-lineare-funktionen-mxt": {
    "reach-fall": { m: -1.5, t: 4 },
    "origin-prop": { m: 2, t: 0 },
    "flat-line": { m: 0, t: 3 },
  },
};
