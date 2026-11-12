import type { LabValues } from "../src/model/types";

/** Konkrete gültige Laboreinstellungen für jedes der 96 Laborziele in MS7. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "pr-1-anteile-hundertstel": {
    quarter: { zaehler: 5, nennerIdx: 1 },
    "half-25": { zaehler: 9, nennerIdx: 2 },
    "low-50": { zaehler: 7, nennerIdx: 3 },
  },
  "pr-2-anteile-vergleichen": {
    "a-wins-60": { aHit: 15, aTotal: 25, bHit: 10, bTotal: 25 },
    "equal-diff-totals": { aHit: 10, aTotal: 20, bHit: 15, bTotal: 30 },
    "b-over-70": { aHit: 10, aTotal: 25, bHit: 30, bTotal: 40 },
  },
  "pr-3-grundbegriffe-berechnen": {
    "p60-g240": { g: 240, p: 35 },
    "find-100": { g: 300, p: 30 },
    "factor-085": { g: 300, p: 85 },
  },
  "pr-4-funktionale-zusammenhaenge": {
    "double-G": { g: 200, p: 30 },
    "same-P-half-p": { g: 300, p: 10 },
    "same-P-double-p": { g: 120, p: 50 },
  },
  "pr-5-mischungen-beruf": {
    "mix-25": { partA: 50, partB: 150 },
    "mix-300": { partA: 120, partB: 180 },
    "mix-50": { partA: 80, partB: 80 },
  },
  "pr-6-prozentdiagramme": {
    "circle-90": { a: 25, b: 45, c: 30, mode: 0 },
    "strip-50": { a: 50, b: 25, c: 25, mode: 1 },
    "bar-equal": { a: 30, b: 30, c: 30, mode: 2 },
  },

  "rz-1-zahlengerade-modelle": {
    "reach-pos-from-neg": { a: -5, b: 8, op: 0 },
    "reach-zero-sub": { a: -4, b: -4, op: 1 },
    "minus-minus": { a: -2, b: -6, op: 1 },
  },
  "rz-2-addition-subtraktion": {
    "sub-debt": { a: -6, b: -6, op: 1 },
    "add-debt": { a: 3, b: -7, op: 0 },
    "deep-minus": { a: -7, b: 4, op: 1 },
  },
  "rz-3-multiplikation-division": {
    "neg-times-neg": { a: -5, bMag: 3, bSign: 1, op: 0 },
    "div-neg": { a: -6, bMag: 2, bSign: 0, op: 1 },
    "zero-prod": { a: 0, bMag: 3, bSign: 1, op: 1 },
  },
  "rz-4-rechenregeln-vorteilhaft": {
    "half-neg": { a: -6, bMag: 4, bSign: 1, op: 1 },
    "prod-24": { a: -6, bMag: 4, bSign: 1, op: 0 },
    "div-neg-1": { a: -4, bMag: 4, bSign: 0, op: 1 },
  },

  "ge-1-senkrechte-abstand": {
    "on-bisector": { px: 0, py: 5 },
    "dist-2": { px: -3, py: 2 },
    "symmetric-p": { px: 4, py: 3.5 },
  },
  "ge-2-winkelhalbierende": {
    "right-bisect": { alpha: 90, r: 4 },
    "half-30": { alpha: 60, r: 5 },
    "obtuse-120": { alpha: 120, r: 4 },
  },
  "ge-3-massstab-koordinaten": {
    "double-fig": { k: 2, w: 3, h: 2 },
    "shrink-half": { k: 0.5, w: 4, h: 2 },
    "triple-12": { k: 3, w: 4, h: 2 },
  },
  "ge-4-dreiecke-einteilung": {
    "isosceles-cx0": { cx: 0, cy: 4 },
    "thales-right": { cx: 0, cy: 3 },
    equilateral: { cx: 0, cy: 5 },
  },
  "ge-5-dreieck-konstruktion": {
    "sss-fail": { mode: 0, a: 2, b: 3, c: 9, alpha: 60, beta: 50 },
    "sws-set": { mode: 1, a: 5, b: 5, c: 7, alpha: 70, beta: 50 },
    "wsw-fail": { mode: 2, a: 5, b: 4, c: 6, alpha: 100, beta: 90 },
  },
  "ge-6-innenwinkelsumme": {
    "alpha-60": { cx: 0, cy: 5 },
    "flat-triangle": { cx: -1, cy: 1 },
    "right-x": { cx: 4, cy: 3 },
  },
  "ge-7-prismen-erkennen-netze": {
    "unfold-tri": { shape: 2, g: 5, h: 3, hk: 4, fold: 1 },
    "para-prism": { shape: 1, g: 5, h: 3, hk: 6, fold: 0 },
    "rect-net": { shape: 0, g: 5, h: 3, hk: 4, fold: 1 },
  },

  "fl-1-parallelogramm": {
    "slide-100": { g: 6, h: 4, shift: 2, cut: 100 },
    "area-30": { g: 7.5, h: 4, shift: 2, cut: 0 },
    "shear-same": { g: 6, h: 4, shift: 4, cut: 0 },
  },
  "fl-2-dreieck": {
    "dbl-para": { g: 6, h: 4, cx: 2, double: 100 },
    "tri-18": { g: 8, h: 4.5, cx: 2, double: 0 },
    "shear-same-tri": { g: 6, h: 4, cx: -2, double: 0 },
  },
  "fl-3-zusammengesetzte-flaechen": {
    "house-36": { w: 8, h1: 3, h2: 3 },
    "house-equal": { w: 6, h1: 3, h2: 3 },
    "house-45": { w: 9, h1: 3, h2: 4 },
  },
  "fl-4-trapez-drache-raute": {
    "trap-30": { kind: 0, a: 9, c: 6, h: 4 },
    "kite-24": { kind: 1, a: 8, c: 4, h: 6 },
    "rhombus-16": { kind: 2, a: 8, c: 4, h: 4 },
  },
  "fl-5-prismen-oberflaeche": {
    "net-tri-345": { shape: 0, g: 6, h: 4, hk: 5, fold: 1 },
    "quad-O": { shape: 1, g: 4, h: 3, hk: 6, fold: 0 },
    "double-hk": { shape: 0, g: 6, h: 4, hk: 8, fold: 1 },
  },

  "vo-1-prismenvolumen-grundidee": {
    "half-fill-tri": { shape: 1, g: 6, h: 4, hk: 5, fill: 50 },
    "para-vol": { shape: 2, g: 6, h: 4, hk: 5, fill: 100 },
    "trap-vol": { shape: 3, g: 6, h: 4, hk: 6, fill: 100 },
  },
  "vo-2-prismen-beruf-zusammengesetzt": {
    "full-rect-96": { shape: 0, g: 6, h: 4, hk: 4, fill: 100 },
    "trap-gutter": { shape: 2, g: 6, h: 4, hk: 5, fill: 100 },
    "tri-half": { shape: 1, g: 6, h: 4, hk: 8, fill: 40 },
  },

  "st-1-darstellungen-manipulation": {
    "honest-axis": { v1: 60, v2: 75, y0: 0, wide: 1 },
    "exaggerate-3x": { v1: 60, v2: 80, y0: 50, wide: 1 },
    "wide-trick": { v1: 60, v2: 75, y0: 20, wide: 2 },
  },
  "st-2-stichproben-skalierung": {
    "fair-scale": { v1: 55, v2: 65, y0: 0, wide: 1 },
    "skew-50": { v1: 55, v2: 70, y0: 50, wide: 1 },
    "same-values": { v1: 60, v2: 60, y0: 40, wide: 1 },
  },
  "st-3-kennwerte": {
    "outlier-jump": { a: 2, b: 3, c: 3, d: 4, e: 15 },
    "zero-span": { a: 4, b: 4, c: 4, d: 4, e: 4 },
    "median-4": { a: 1, b: 3, c: 4, d: 6, e: 11 },
  },

  "gl-1-terme-vereinfachen": {
    "neg-input": { a: 3, b: -2, x: -4 },
    "zero-out": { a: 2, b: -6, x: 3 },
    "neg-coeff": { a: -2, b: 1, x: -3 },
  },
  "gl-2-waage-aequivalenz": {
    "balance-init": { a: 2, b: 3, xTrue: 4, guessX: 4 },
    "balance-neg-x": { a: 2, b: 3, xTrue: -2, guessX: -2 },
    "balance-coeff3": { a: 3, b: 4, xTrue: 5, guessX: 5 },
  },
  "gl-3-gleichungen-loesen": {
    "solve-neg-a": { a: -2, b: 5, xTrue: -3, guessX: -3 },
    "solve-4x-zero": { a: 4, b: -4, xTrue: 1, guessX: 1 },
    "solve-pos": { a: 2, b: 3, xTrue: -4, guessX: -4 },
  },

  "pp-1-zuordnungen-linear": {
    "linear-with-t": { kind: 1, m: 2, t: 4 },
    "nonlinear-curve": { kind: 2, m: 2, t: 2 },
    "prop-m25": { kind: 0, m: 2.5, t: 0 },
  },
  "pp-2-dreisatz-sachaufgaben": {
    "reach-qty-6": { unitPrice: 2.5, qty: 6 },
    "reach-cost-28": { unitPrice: 3.5, qty: 8 },
    "unit-check": { unitPrice: 2.5, qty: 1 },
  },
};
