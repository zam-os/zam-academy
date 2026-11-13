import type { LabValues } from "../src/model/types";

/** For every lab goal one setting that reaches it; the tests check each. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  // Etappe 1: Potenzen und Wurzeln
  "pw-1-potenzen": {
    "minus-acht": { b: -2, n: 3 },
    positiv: { b: -2, n: 4 },
    kleiner: { b: 0.5, n: 3 },
  },
  "pw-2-potenzgesetze": {
    zehn: { rule: 0, m: 4, n: 6 },
    eins: { rule: 1, m: 3, n: 3 },
    zwoelf: { rule: 2, m: 3, n: 4 },
  },
  "pw-3-negative-exponenten": {
    eins: { base: 2, e: 0 },
    achtel: { base: 2, e: -3 },
    tausendstel: { base: 10, e: -3 },
  },
  "pw-4-wurzeln": {
    kubik: { n: 3, b: 4 },
    fuenfte: { n: 5, b: 2 },
    einundachtzig: { n: 4, b: 3 },
  },
  "pw-5-wurzelgesetze": {
    vier: { a: 8, m: 2, n: 3 },
    acht: { a: 16, m: 3, n: 4 },
    fuenfte: { a: 32, m: 2, n: 5 },
  },
  "pw-6-logarithmus": {
    vierundsechzig: { base: 2, x: 6 },
    hundertstel: { base: 10, x: -2 },
    einundachtzig: { base: 3, x: 4 },
  },
  // Etappe 2: Exponentialfunktion
  "ex-1-linear-exponentiell": {
    "erstes-jahr": { a: 100, d: 10, p: 10, x: 0 },
    ueberholen: { a: 100, d: 10, p: 20, x: 1 },
    verdoppeln: { a: 100, d: 20, p: 15, x: 5 },
  },
  "ex-2-wachstumsmodelle": {
    "unter-haelfte": { a: 100, p: -20, x: 4 },
    stadt: { a: 50000, p: 5, x: 4 },
    "zehn-jahre": { a: 100, p: 10, x: 10 },
  },
  "ex-3-wachstum-berechnen": {
    "zehn-prozent": { a: 100, y: 110, n: 1 },
    halbiert: { a: 400, y: 200, n: 5 },
    verdreifacht: { a: 400, y: 1200, n: 10 },
  },
  // Etappe 3: Ähnliche Figuren
  "ae-1-aehnliche-figuren": {
    vergroessert: { alpha2: 40, beta2: 60, c2: 7.5 },
    verkleinert: { alpha2: 40, beta2: 60, c2: 2.5 },
    gedreht: { alpha2: 60, beta2: 40, c2: 5 },
  },
  "ae-2-zentrische-streckung": {
    doppelt: { k: 2, zx: 2, zy: 1 },
    halb: { k: 0.5, zx: 2, zy: 1 },
    fixpunkt: { k: 1.5, zx: 4, zy: 2 },
  },
  "ae-3-flaechen-volumen": {
    achtfach: { k: 2 },
    neunfach: { k: 3 },
    achtel: { k: 0.5 },
  },
  "ae-4-strahlensaetze": {
    parallel: { a: 4, a2: 8, b: 3, b2: 6 },
    dreifach: { a: 4, a2: 12, b: 3, b2: 9 },
    halb: { a: 4, a2: 2, b: 3, b2: 1.5 },
  },
  "ae-5-kathetensatz-hoehensatz": {
    gleich: { c: 8, s: 50, show: 0 },
    "hoehe-vier": { c: 10, s: 20, show: 0 },
    dreimal: { c: 8, s: 25, show: 1 },
  },
  // Etappe 4: Trigonometrie
  "tr-1-sin-cos-tan": {
    "sin-halb": { alpha: 30, c: 5 },
    "tan-eins": { alpha: 45, c: 5 },
    "ankathete-vier": { alpha: 60, c: 8 },
  },
  "tr-2-berechnen": {
    halb: { alpha: 30, L: 5 },
    sicher: { alpha: 70, L: 6 },
    gleich: { alpha: 45, L: 5 },
  },
  "tr-3-sachaufgaben": {
    hundert: { run: 100, h: 100 },
    zwoelf: { run: 400, h: 48 },
    "zehn-grad": { run: 1000, h: 176 },
  },
  "tr-4-einheitskreis": {
    unten: { alpha: 270 },
    zweiter: { alpha: 150 },
    "cos-minus-halb": { alpha: 120 },
  },
  "tr-5-sinusfunktion": {
    "hoch-zwei": { alpha: 450 },
    nullstelle: { alpha: 180 },
    periode: { alpha: 390 },
  },
  // Etappe 5: Kugeln
  "ku-1-kugel": {
    "zwei-drittel": { r: 3, sink: 100, view: 0 },
    achtfach: { r: 4, sink: 0, view: 0 },
    liter: { r: 6.2, sink: 0, view: 0 },
  },
  "ku-2-zusammengesetzt": {
    viertel: { kind: 0, r: 3, h: 6 },
    doppelt: { kind: 1, r: 2, h: 8 },
    "liter-wuerfel": { kind: 2, r: 5, h: 8 },
  },
  // Etappe 6: Statistik und Wahrscheinlichkeiten
  "st-1-baumdiagramm": {
    achtel: { rot: 2, blau: 2, draws: 3, mode: 0, z1: 0, z2: 0, z3: 1 },
    unmoeglich: { rot: 2, blau: 2, draws: 3, mode: 1, z1: 0, z2: 0, z3: 0 },
    simulation: { rot: 4, blau: 2, draws: 3, mode: 1, z1: 0, z2: 0, z3: 1, n: 500, hits: 100 },
  },
  "st-2-pfadregeln": {
    fuenfzig: { rot: 6, blau: 4, mode: 1, event: 1, sicht: 0 },
    gegen: { rot: 8, blau: 2, mode: 0, event: 4, sicht: 2 },
    verkuerzt: { rot: 4, blau: 4, mode: 0, event: 5, sicht: 1 },
  },
  "st-3-permutationen": {
    vier: { n: 4, fixed: 0 },
    fest: { n: 5, fixed: 1 },
    hundert: { n: 5, fixed: 0 },
  },
  "st-4-fehldeutungen": {
    ueberraschung: { prev: 1, sens: 90, spec: 90 },
    fuenfzig: { prev: 1, sens: 90, spec: 99.1 },
    nutzlos: { prev: 10, sens: 50, spec: 50 },
  },
  // Etappe 7: Funktionale Zusammenhänge
  "fz-1-geradengleichung": {
    "gerade-a": { x1: 0, y1: -1, x2: 2, y2: 3 },
    waagrecht: { x1: -2, y1: 3, x2: 2, y2: 3 },
    fallend: { x1: -2, y1: 1, x2: 2, y2: -1 },
  },
  "fz-2-parallel-senkrecht": {
    "parallel-ursprung": { m: 0.5, t: 1, px: 2, py: 1 },
    "senkrecht-ursprung": { m: 0.5, t: 1, px: 2, py: -4 },
    "t-vier": { m: 0.5, t: 1, px: 1, py: 2 },
  },
  "fz-3-binomische-formeln": {
    gleich: { formula: 0, a: 3, b: 3 },
    minus: { formula: 1, a: 5, b: 3 },
    dritte: { formula: 2, a: 5, b: 2 },
  },
  "fz-4-quadratische-gleichungen": {
    "zwei-fuenf": { x1: 2, x2: -5, a: 1 },
    doppelt: { x1: 3, x2: 3, a: -1 },
    allgemein: { x1: -1, x2: 3, a: 1 },
  },
  "fz-5-bruchgleichungen": {
    keine: { a: 6, b: 2, c: 0 },
    "loesung-vier": { a: 6, b: 1, c: 2 },
    luecke: { a: 4, b: -2, c: 2 },
  },
  "fz-6-abhaengigkeiten": {
    aepfel: { data: 0, type: 0, k: 3 },
    pizza: { data: 1, type: 1, k: 24 },
    fall: { data: 2, type: 2, k: 5 },
  },
  "fz-7-scheitelpunktform": {
    "zwei-punkte": { d: 3, e: -2, s: 1 },
    beruehren: { d: -2, e: 0, s: -1 },
    "y-fuenf": { d: 2, e: 1, s: 1 },
  },
  "fz-8-normalform": {
    sechs: { b: 6, q: 9, c: 0 },
    zehn: { b: 10, q: 25, c: 0 },
    scheitel: { b: 8, q: 16, c: 10 },
  },
  "fz-9-zwei-punkte": {
    normal: { x1: 1, y1: 1, x2: 2, y2: 4, s: 1 },
    scheitel: { x1: 1, y1: 0, x2: 3, y2: 0, s: 1 },
    unten: { x1: 0, y1: 3, x2: 1, y2: 4, s: -1 },
  },
  "fz-10-schnittpunkte": {
    tangente: { m: 0, t: -4 },
    "passante-steigend": { m: 1, t: -5 },
    "sekante-punkte": { m: 2, t: -1 },
  },
};
