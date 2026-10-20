import type { LabValues } from "../src/model/types";

/**
 * ZAM cards (zam-academy:mathematik-realschule-9) cite these ids. Renaming a
 * lesson breaks every card that cites it: change the cell in the same step.
 */
export const LESSON_IDS = [
  "rd-1-pythagoras",
  "rd-2-umkehrung",
  "rd-3-hoehe-kathetensatz",
  "rd-4-sinus-kosinus",
  "rd-5-tangens",
  "rd-6-besondere-winkel",
  "kr-1-kreiszahl",
  "kr-2-kreisflaeche",
  "kr-3-sektor",
  "rg-1-zylinder",
  "rg-2-kegel-pyramide",
  "rg-3-kugel",
  "lg-1-lineare-gleichung",
  "lg-2-gleichsetzen",
  "lg-3-additionsverfahren",
  "lg-4-loesungsfaelle",
  "lg-5-textaufgaben",
  "qf-1-scheitelform",
  "qf-2-streckfaktor",
  "qf-3-quadratische-ergaenzung",
  "qf-4-loesungsformel",
  "qf-5-linearfaktoren",
  "qf-6-parabel-gerade",
  "qf-7-extremwerte",
  "dz-1-baumdiagramm",
  "dz-2-gegenereignis",
  "dz-3-vierfeldertafel",
  "dz-4-kenngroessen",
  "dz-5-boxplot",
];

/**
 * One setting of the sliders and choices per lab goal that reaches it: the
 * proof that every Laborauftrag is doable. State (simulation counters) may be
 * left out; it then keeps its start value.
 */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "rd-1-pythagoras": {
    zehn: { a: 6, b: 8, view: 0, puzzle: 0 },
    tripel: { a: 2.5, b: 6, view: 0, puzzle: 0 },
    puzzle: { a: 3, b: 2, view: 1, puzzle: 100 },
  },
  "rd-2-umkehrung": {
    zwoelf: { N: 12, p: 3, q: 4 },
    dreissig: { N: 30, p: 5, q: 12 },
    stumpf: { N: 24, p: 5, q: 8 },
  },
  "rd-3-hoehe-kathetensatz": {
    gleich: { c: 8, s: 50, show: 0 },
    "hoehe-vier": { c: 10, s: 20, show: 0 },
    dreimal: { c: 8, s: 25, show: 1 },
  },
  "rd-4-sinus-kosinus": {
    halb: { alpha: 30, L: 4 },
    sicher: { alpha: 70, L: 6 },
    gleich: { alpha: 45, L: 4 },
  },
  "rd-5-tangens": {
    hundert: { run: 100, h: 100 },
    zwoelf: { run: 400, h: 48 },
    "zehn-grad": { run: 1000, h: 176 },
  },
  "rd-6-besondere-winkel": {
    dreissig: { alpha: 30, helper: 0 },
    gleich: { alpha: 45, helper: 0 },
    "drei-vier-fuenf": { alpha: 53, helper: 0 },
  },
  "kr-1-kreiszahl": {
    "ein-meter": { exp: 0, d: 31.8, t: 0, n: 6 },
    abgerollt: { exp: 0, d: 10, t: 100, n: 6 },
    archimedes: { exp: 1, d: 12, t: 0, n: 48 },
  },
  "kr-2-kreisflaeche": {
    "fast-rechteck": { r: 2.5, n: 32, t: 100 },
    vierfach: { r: 4, n: 8, t: 0 },
    achtundzwanzig: { r: 3, n: 8, t: 0 },
  },
  "kr-3-sektor": {
    viertel: { r: 3, alpha: 90 },
    radiant: { r: 3, alpha: 57 },
    zehn: { r: 4, alpha: 72 },
  },
  "rg-1-zylinder": {
    liter: { r: 5, h: 12.7, t: 0 },
    sparsam: { r: 5.4, h: 10.9, t: 0 },
    quadratisch: { r: 2, h: 12.6, t: 100 },
  },
  "rg-2-kegel-pyramide": {
    voll: { body: 0, r: 3, a: 4, h: 6, pours: 3, view: 0 },
    halbkreis: { body: 0, r: 3, a: 4, h: 5.2, pours: 1, view: 1 },
    eiswaffel: { body: 0, r: 5, a: 4, h: 12, pours: 1, view: 0 },
  },
  "rg-3-kugel": {
    "zwei-drittel": { r: 3, sink: 100, view: 0 },
    achtfach: { r: 4, sink: 0, view: 0 },
    liter: { r: 6.2, sink: 0, view: 0 },
  },
  "lg-1-lineare-gleichung": {
    punkt: { a: 1, b: 2, c: 4, px: 2, py: 1 },
    "zwei-punkte": { a: 1, b: -2, c: 4, px: 3, py: -2 },
    senkrecht: { a: 2, b: 0, c: 4, px: 3, py: -2 },
  },
  "lg-2-gleichsetzen": {
    "drei-vier": { m1: 1, t1: 1, m2: 0, t2: 4 },
    negativ: { m1: 1, t1: -1, m2: -1, t2: -3 },
    "y-achse": { m1: 1, t1: 2, m2: -1, t2: 2 },
  },
  "lg-3-additionsverfahren": {
    "s1-y": { sys: 1, k1: 1, k2: 3 },
    "s2-x": { sys: 2, k1: 5, k2: -3 },
    "s3-gross": { sys: 3, k1: 3, k2: 2 },
  },
  "lg-4-loesungsfaelle": {
    keine: { a1: 1, b1: 1, c1: 4, a2: 2, b2: 2, c2: 3 },
    unendlich: { a1: 1, b1: 2, c1: 3, a2: 2, b2: 4, c2: 6 },
    eine: { a1: 1, b1: 1, c1: -1, a2: 1, b2: -1, c2: -3 },
  },
  "lg-5-textaufgaben": {
    fasane: { puzzle: 0, x: 23, y: 12 },
    kino: { puzzle: 1, x: 80, y: 40 },
    spardose: { puzzle: 2, x: 12, y: 13 },
  },
  "qf-1-scheitelform": {
    "zwei-punkte": { d: 3, e: -2 },
    beruehren: { d: -2, e: 0 },
    "y-fuenf": { d: 2, e: 1 },
  },
  "qf-2-streckfaktor": {
    korb: { d: 2.5, e: 4 },
    flach: { d: 2.7, e: 3.5 },
    steil: { d: 2.4, e: 4.5 },
  },
  "qf-3-quadratische-ergaenzung": {
    sechs: { b: 6, q: 9, c: 0 },
    zehn: { b: 10, q: 25, c: 0 },
    scheitel: { b: 8, q: 16, c: 10 },
  },
  "qf-4-loesungsformel": {
    beruehren: { a: 1, b: 4, c: 4 },
    "keine-unten": { a: -1, b: 0, c: -2 },
    "zwei-minus-drei": { a: 1, b: 1, c: -6 },
  },
  "qf-5-linearfaktoren": {
    "zwei-fuenf": { x1: 2, x2: -5, a: 1 },
    doppelt: { x1: 3, x2: 3, a: -1 },
    allgemein: { x1: 3, x2: -1, a: 2 },
  },
  "qf-6-parabel-gerade": {
    tangente: { m: 2, t: -5 },
    "passante-steigend": { m: 1, t: -6 },
    "sekante-punkte": { m: 2, t: -1 },
  },
  "qf-7-extremwerte": {
    quadrat: { mode: 0, L: 20, x: 5 },
    mauer: { mode: 1, L: 24, x: 6 },
    sechsundneunzig: { mode: 0, L: 40, x: 8 },
  },
  "dz-1-baumdiagramm": {
    sechzig: { rot: 3, blau: 2, mode: 1, event: 1 },
    unterschied: { rot: 1, blau: 1, mode: 0, event: 0 },
    simulation: { rot: 3, blau: 2, mode: 0, event: 0, n: 500, hits: 180 },
  },
  "dz-2-gegenereignis": {
    halb: { den: 6, n: 4 },
    neunzig: { den: 6, n: 13 },
    muenze: { den: 2, n: 7 },
  },
  "dz-3-vierfeldertafel": {
    ueberraschung: { prev: 1, sens: 90, spec: 90 },
    fuenfzig: { prev: 1, sens: 90, spec: 99.1 },
    unabhaengig: { prev: 10, sens: 50, spec: 50 },
  },
  "dz-4-kenngroessen": {
    ausreisser: { v1: 3, v2: 5, v3: 7, v4: 8, v5: 10, v6: 12, v7: 13, v8: 15, v9: 30, v10: 30, v11: 30 },
    gleich: { v1: 10, v2: 11, v3: 12, v4: 13, v5: 14, v6: 15, v7: 16, v8: 17, v9: 18, v10: 19, v11: 20 },
    quartile: { v1: 5, v2: 8, v3: 10, v4: 12, v5: 14, v6: 15, v7: 16, v8: 18, v9: 20, v10: 22, v11: 25 },
  },
  "dz-5-boxplot": {
    schmal: { w1: 0, w2: 10, w3: 10, w4: 10, w5: 10, w6: 10, w7: 10, w8: 11, w9: 12, w10: 13, w11: 14, w12: 40 },
    vergleich: { w1: 10, w2: 15, w3: 18, w4: 21, w5: 22, w6: 23, w7: 24, w8: 25, w9: 26, w10: 27, w11: 30, w12: 35 },
    schief: { w1: 5, w2: 8, w3: 10, w4: 11, w5: 11, w6: 12, w7: 13, w8: 15, w9: 20, w10: 25, w11: 32, w12: 40 },
  },
};
