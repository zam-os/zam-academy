import type { LabValues } from "../src/model/types";

/** Concrete legal settings; the suite proves each goal reachable and no free starts. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "rz-1-warum-brueche": {
    "drei-viertel": { n: 3, k: 4 },
    "ohne-rest": { n: 10, k: 5 },
    "mehr-als-eins": { n: 7, k: 3 },
  },
  "rz-2-grundvorstellungen": {
    dreiviertel: { z: 3, n: 4 },
    ganzes: { z: 6, n: 6 },
    "funf-achtel": { z: 5, n: 8 },
  },
  "rz-3-bruchformen": {
    echt: { z: 5, n: 6 },
    unecht: { z: 7, n: 4 },
    "drei-ganze": { z: 12, n: 4 },
  },
  "rz-4-bruchteile": {
    teil: { mode: 0, z: 3, n: 4, a: 60 },
    ganzes: { mode: 1, z: 2, n: 5, a: 18 },
    groesser: { mode: 0, z: 5, n: 4, a: 24 },
  },
  "rz-5-erweitern-kuerzen": {
    "neun-zwoelftel": { z: 3, n: 4, k: 3 },
    "acht-zwoelftel": { z: 2, n: 3, k: 4 },
    kuerzbar: { z: 4, n: 6, k: 1 },
  },
  "rz-6-stellenwerte": {
    "vier-25": { e: 4, a: 2, b: 5, c: 0 },
    "null-305": { e: 0, a: 3, b: 0, c: 5 },
    "drei-hundertstel": { e: 0, a: 0, b: 3, c: 0 },
  },
  "rz-7-bruch-dezimal": {
    endlich: { z: 3, n: 8 },
    rein: { z: 2, n: 3 },
    spaet: { z: 1, n: 6 },
  },
  "rz-8-runden": {
    hundertstel: { e: 3, a: 1, b: 4, c: 6, place: 2 },
    uebertrag: { e: 2, a: 9, b: 6, c: 0, place: 1 },
    mitte: { e: 4, a: 5, b: 0, c: 0, place: 0 },
  },
  "rz-9-darstellungen": {
    dreiviertel: { p: 75 },
    "zwei-fuenftel": { p: 40 },
    "fuenf-hundertstel": { p: 5 },
  },
  "rz-10-vergleichen": {
    positiv: { a: 3, b: 4, c: 2, d: 3 },
    negativ: { a: -1, b: 2, c: -1, d: 3 },
    gleich: { a: 2, b: 4, c: 3, d: 6 },
  },
  "rz-11-zahlengerade": {
    "minus-dreiviertel": { s: 1, t: -3 },
    "eins-zwei": { s: 2, t: 6 },
    "minus-drei-zehntel": { s: 3, t: -3 },
  },
  "rz-12-brueche-addieren": {
    summe: { a: 1, b: 2, c: 1, d: 3, op: 0 },
    differenz: { a: 3, b: 4, c: 1, d: 2, op: 1 },
    zwoelftel: { a: 1, b: 4, c: 1, d: 6, op: 0 },
  },
  "rz-13-brueche-multiplizieren": {
    halb: { a: 2, b: 3, c: 3, d: 4 },
    sechstel: { a: 1, b: 2, c: 1, d: 3 },
    unecht: { a: 5, b: 4, c: 2, d: 5 },
  },
  "rz-14-brueche-dividieren": {
    sechs: { a: 3, b: 4, c: 1, d: 8 },
    zwei: { a: 1, b: 2, c: 1, d: 4 },
    vier: { a: 2, b: 3, c: 1, d: 6 },
  },
  "rz-15-dezimal-addieren": {
    summe: { a: 2.75, b: 1.5, op: 0 },
    differenz: { a: 5, b: 1.25, op: 1 },
    zehn: { a: 7.25, b: 2.75, op: 0 },
  },
  "rz-16-dezimal-multiplizieren": {
    klein: { a: 0.3, b: 0.4 },
    gemischt: { a: 1.5, b: 0.2 },
    quadrat: { a: 1.2, b: 1.2 },
  },
  "rz-17-vorzeichen": {
    summe: { a: -2.5, b: 4, op: 0 },
    produkt: { a: -1.5, b: -2, op: 2 },
    quotient: { a: -3, b: 0.5, op: 3 },
  },
  "rz-18-rechengesetze": {
    zehn: { a: 2.5, b: 3, c: 7 },
    halb: { a: 0.5, b: 6, c: 2 },
    hundert: { a: 4, b: 4, c: 6 },
  },
  "rz-19-sachaufgaben": {
    sechs: { p: 6, price: 1.2 },
    liter: { p: 8, price: 1.2 },
    kosten: { p: 12, price: 2 },
  },
  "as-1-eigenschaften": {
    fixpunkt: { axis: 0, ax: 0, ay: 2 },
    fixgerade: { axis: 0, ax: -4, ay: -2 },
    parallel: { axis: 0, ax: -3, ay: 2 },
  },
  "as-2-abbilden": {
    "y-achse": { axis: 0, c: 1, x: 3, y: 2 },
    "x-achse": { axis: 1, c: 1, x: 1, y: 4 },
    fixpunkt: { axis: 2, c: 2, x: 2, y: 3 },
  },
  "as-3-senkrechte-lot": {
    mittelsenkrechte: { mode: 0, step: 3, r: 4 },
    lot: { mode: 1, step: 3, r: 5 },
    senkrechte: { mode: 2, step: 3, r: 2 },
  },
  "as-4-winkelhalbierende": {
    sechzig: { alpha: 60, step: 3 },
    rechter: { alpha: 90, step: 3 },
    stumpf: { alpha: 140, step: 3 },
  },
  "as-5-symmetrieachsen": {
    rechteck: { figure: 0, theta: 90 },
    "quadrat-diagonale": { figure: 1, theta: 45 },
    dreieck: { figure: 2, theta: 30 },
  },
  "as-6-besondere-figuren": {
    raute: { family: 0, a: 6, b: 4, s: 0 },
    trapez: { family: 1, a: 3, b: 6, s: 0 },
    parallelogramm: { family: 1, a: 4, b: 4, s: 1 },
  },
  "fl-1-parallelogramm": {
    vierundzwanzig: { g: 6, h: 4, s: 2, cut: 0 },
    zerlegt: { g: 5, h: 3, s: 3, cut: 1 },
    rechteck: { g: 4, h: 3, s: 0, cut: 0 },
  },
  "fl-2-dreieck": {
    zwoelf: { g: 6, h: 4, s: 2 },
    rechtwinklig: { g: 4, h: 3, s: 0 },
    aussen: { g: 4, h: 3, s: 6 },
  },
  "fl-3-trapez": {
    zwanzig: { a: 7, c: 3, h: 4, s: 1 },
    gleich: { a: 5, c: 5, h: 3, s: 1 },
    dreissig: { a: 8, c: 4, h: 5, s: 1 },
  },
  "fl-4-drachen-raute": {
    zwanzig: { e: 8, f: 5, s: 1 },
    raute: { e: 6, f: 8, s: 0 },
    quadrat: { e: 6, f: 6, s: 0 },
  },
  "fl-5-vielecke": {
    beispiel: { mode: 0, a: 8, b: 6, c: 4, d: 3 },
    abziehen: { mode: 1, a: 10, b: 5, c: 3, d: 2 },
    dreissig: { mode: 0, a: 6, b: 6, c: 4, d: 3 },
  },
  "fl-6-oberflaeche": {
    beispiel: { a: 5, b: 3, c: 2 },
    wuerfel: { a: 3, b: 3, c: 3 },
    hundert: { a: 7, b: 2, c: 4 },
  },
  "rg-1-rauminhalt": {
    sechzig: { a: 4, b: 3, c: 5, l: 5, unit: 1 },
    wuerfel: { a: 3, b: 3, c: 3, l: 3, unit: 1 },
    "andere-form": { a: 6, b: 1, c: 4, l: 4, unit: 0 },
  },
  "rg-2-raumeinheiten": {
    "dm-cm": { amount: 2, from: 1, to: 2 },
    "ml-l": { amount: 3.5, from: 1, to: 2 },
    "m3-l": { amount: 1, from: 0, to: 1 },
  },
  "rg-3-quader-volumen": {
    sechzig: { a: 5, b: 4, c: 3, w: 25 },
    kubikmeter: { a: 10, b: 10, c: 10, w: 100 },
    halb: { a: 4, b: 4, c: 5, w: 50 },
  },
  "rg-4-zusammengesetzte-koerper": {
    beispiel: { mode: 0, a: 6, b: 5, c: 2, d: 2, t: 3 },
    abziehen: { mode: 1, a: 8, b: 3, c: 1, d: 1, t: 4 },
    dreissig: { mode: 0, a: 6, b: 5, c: 1, d: 2, t: 2 },
  },
  "tg-1-terme-aufstellen": {
    dreizehn: { p: 0, n: 4 },
    einundzwanzig: { p: 1, n: 10 },
    kosten: { p: 2, n: 5 },
  },
  "tg-2-darstellungen": {
    doppelt: { a: 2, b: 3, x: 1 },
    halb: { a: 0.5, b: 4, x: 1 },
    zehn: { a: 2, b: 2, x: 4 },
  },
  "tg-3-termwerte": {
    natuerlich: { t: 0, g: 0, x: 3 },
    ganz: { t: 1, g: 1, x: -2 },
    rational: { t: 2, g: 2, x: 1.5 },
  },
  "tg-4-aequivalenz": {
    zufall: { pair: 2, x: 2 },
    gegenbeispiel: { pair: 3, x: -1 },
    null: { pair: 0, x: -3 },
  },
  "tg-5-gleichungen-strategien": {
    neunzehn: { a: 3, b: 4, c: 19, x: 5 },
    fuenfzehn: { a: 2, b: 7, c: 15, x: 4 },
    dreissig: { a: 4, b: 6, c: 30, x: 6 },
  },
  "tg-6-aequivalenzumformungen": {
    plus: { mode: 0, g: 0, k: 5, c: 12, d: 5 },
    mal: { mode: 1, g: 1, k: 3, c: -12, d: 3 },
    leer: { mode: 1, g: 1, k: 2, c: 5, d: 2 },
  },
  "tg-7-sachaufgaben": {
    acht: { T: 24, p: 3, f: 0 },
    unpassend: { T: 25, p: 3, f: 0 },
    beispiel: { T: 30, p: 4, f: 6 },
  },
  "dp-1-zuordnungen": {
    roehre: { vessel: 0, t: 10 },
    "knick-spaet": { vessel: 1, t: 7.5 },
    "knick-frueh": { vessel: 2, t: 2.5 },
  },
  "dp-2-erkennen": {
    faktor: { k: 1.5, b: 0, x: 1 },
    nicht: { k: 2, b: 2, x: 1 },
    wert: { k: 2.5, b: 0, x: 4 },
  },
  "dp-3-dreisatz": {
    beispiel: { a: 5, b: 12, x: 8 },
    einheit: { a: 4, b: 6, x: 1 },
    doppelt: { a: 3, b: 9, x: 6 },
  },
  "dp-4-prozent-begriffe": {
    dreissig: { G: 200, p: 15 },
    haelfte: { G: 60, p: 50 },
    alles: { G: 400, p: 100 },
  },
  "dp-5-prozent-rechnen": {
    wert: { mode: 0, a: 240, b: 25 },
    grundwert: { mode: 1, a: 60, b: 20 },
    satz: { mode: 2, a: 200, b: 50 },
  },
};
