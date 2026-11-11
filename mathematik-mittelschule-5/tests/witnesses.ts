import type { LabValues } from "../src/model/types";
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "nz-1-zahlenmenge": {
    million: { digit: 1, exp: 6 },
    milliarden: { digit: 5, exp: 9 },
    groesste: { digit: 9, exp: 12 },
  },
  "nz-2-stufenzahlen": {
    nullen: {
      billions: 4,
      millions: 0,
      thousands: 7,
      ones: 50,
    },
    stufenzahl: {
      billions: 1,
      millions: 0,
      thousands: 0,
      ones: 0,
    },
    dreitausend: {
      billions: 2,
      millions: 3,
      thousands: 4,
      ones: 5,
    },
  },
  "nz-3-zahlenstrahl": {
    siebzig: { scale: 1, k: 7 },
    tausend: { scale: 2, k: 13 },
    gross: { scale: 3, k: 16 },
  },
  "nz-4-runden": {
    mitte: { place: 1, n: 2650 },
    knapp: { place: 2, n: 3499 },
    kette: { place: 0, n: 4995 },
  },
  "nz-7-addieren-subtrahieren": {
    drei: { op: 0, a: 456, b: 789 },
    zwei: { op: 1, a: 503, b: 178 },
    tausend: { op: 0, a: 625, b: 375 },
  },
  "nz-8-multiplizieren-dividieren": {
    tausend: { op: 0, a: 125, b: 8 },
    "ohne-rest": { op: 1, a: 936, b: 12 },
    "rest-sieben": { op: 1, a: 999, b: 8 },
  },
  "nz-9-sachaufgaben": {
    beispiel: { n: 28, p: 32 },
    gleich: { n: 40, p: 30 },
    weit: { n: 44, p: 44 },
  },
  "gz-1-negative-zahlen": {
    frost: { ctx: 0, t: -12 },
    schulden: { ctx: 1, t: -20 },
    keller: { ctx: 2, t: -3 },
  },
  "gz-3-zahlengerade": {
    "beide-negativ": { scale: 2, a: -4, b: -1 },
    hundert: { scale: 3, a: -3, b: 2 },
    gleich: { scale: 1, a: -5, b: -5 },
  },
  "ge-1-grundbegriffe": {
    fuenf: { kind: 0, ax: 1, ay: 1, bx: 6, by: 1 },
    strahl: { kind: 1, ax: 1, ay: 2, bx: 5, by: 2 },
    senkrecht: { kind: 2, ax: 3, ay: 1, bx: 3, by: 5 },
  },
  "ge-2-lagebeziehungen": {
    parallel: { angle: 0, d: 3, p: 2 },
    senkrecht: { angle: 90, d: 2, p: 2 },
    auf: { angle: 30, d: 2, p: 0 },
  },
  "gr-1-masszahl-schaetzen": {
    stift: { object: 0, value: 15, unit: 1 },
    tuer: { object: 1, value: 2, unit: 2 },
    weg: { object: 2, value: 170, unit: 3 },
  },
  "gr-2-laenge-masse": {
    kilometer: { kind: 0, amount: 3, from: 4, to: 3 },
    gramm: { kind: 1, amount: 2500, from: 1, to: 2 },
    tonne: { kind: 1, amount: 4, from: 3, to: 2 },
  },
  "gr-3-geld-zeit-hohlmass": {
    stunden: { kind: 1, amount: 2, from: 2, to: 1 },
    euro: { kind: 0, amount: 5, from: 1, to: 0 },
    liter: { kind: 2, amount: 2, from: 1, to: 0 },
  },
  "gr-7-sachaufgaben": {
    aufgehen: { k: 12, s: 2, pack: 1 },
    fuenf: { k: 25, s: 2, pack: 2 },
    rest: { k: 3, s: 1, pack: 2 },
  },
  "uf-1-umfang": {
    quadrat: { a: 5, b: 5 },
    rueckwaerts: { a: 8, b: 4 },
    dreissig: { a: 10, b: 5 },
  },
  "uf-2-umfang-vielecke": {
    dreissig: { w: 10, h: 6, cw: 2, ch: 2, t: 2 },
    "l-form": { w: 8, h: 6, cw: 3, ch: 2, t: 1 },
    tor: { w: 7, h: 5, cw: 1, ch: 1, t: 4 },
  },
  "uf-3-flaechen-vergleichen": {
    gleich: { unit: 0, a: 3, b: 5, d: 4, e: 4, k: 1 },
    zweier: { unit: 1, a: 6, b: 4, d: 4, e: 4, k: 1 },
    vierer: { unit: 2, a: 3, b: 4, d: 4, e: 6, k: 2 },
  },
  "uf-5-flaeche-rechteck": {
    quadrat: { a: 6, b: 6 },
    rueckwaerts: { a: 8, b: 3 },
    "gleicher-umfang": { a: 8, b: 2 },
  },
  "uf-6-zusammengesetzt": {
    beispiel: { method: 0, w: 10, h: 8, cw: 4, ch: 3 },
    achtundvierzig: { method: 1, w: 10, h: 5, cw: 2, ch: 1 },
    zerlegt: { method: 0, w: 12, h: 9, cw: 4, ch: 2 },
  },
  "da-1-diagramme": {
    tabelle: { type: 1, a: 5, b: 3, c: 8, d: 2, e: 4 },
    gleich: { type: 0, a: 6, b: 6, c: 6, d: 6, e: 6 },
    balken: { type: 2, a: 10, b: 3, c: 8, d: 2, e: 4 },
  },
  "da-3-verzerrungen": {
    taeuschen: { a: 100, b: 70, start: 45 },
    ehrlich: { a: 100, b: 50, start: 0 },
    gleich: { a: 80, b: 80, start: 0 },
  },

  "nz-folgen": {
    fuenfzehn: {
      start: 980,
      step: 15,
      mode: 0,
    },
    verdoppeln: {
      start: 3,
      step: 2,
      mode: 1,
    },
    hunderter: {
      start: 500,
      step: 100,
      mode: 0,
    },
  },
  "nz-rechenregeln": {
    punkt: {
      a: 2,
      b: 3,
      c: 4,
      mode: 0,
    },
    klammer: {
      a: 2,
      b: 3,
      c: 4,
      mode: 1,
    },
    dreissig: {
      a: 10,
      b: 5,
      c: 4,
      mode: 0,
    },
  },
  "gz-zustandsaenderungen": {
    uebernull: {
      a: -3,
      b: 5,
      op: 0,
    },
    unternull: {
      a: 2,
      b: 7,
      op: 1,
    },
    probe: {
      a: -5,
      b: 7,
      op: 0,
    },
  },
  "ge-koordinaten-erster-quadrant": {
    p: {
      x: 3,
      y: 5,
    },
    achse: {
      x: 0,
      y: 4,
    },
    ursprung: {
      x: 0,
      y: 0,
    },
  },
  "ge-winkel-bis-180": {
    "halb-recht": {
      a: 45,
    },
    recht: {
      a: 90,
    },
    stumpf: {
      a: 135,
    },
  },
  "ge-umfang-dreieck": {
    vierzehn: {
      base: 2,
      side: 6,
    },
    zwanzig: {
      base: 6,
      side: 7,
    },
    gleichseitig: {
      base: 8,
      side: 8,
    },
  },
  "fl-flaecheneinheiten": {
    cm: {
      amount: 3,
      unit: 0,
    },
    dm: {
      amount: 5,
      unit: 1,
    },
    m: {
      amount: 2,
      unit: 2,
    },
  },
  "gr-alltagsbrueche": {
    "halb-liter": {
      part: 1,
      kind: 0,
      whole: 0,
    },
    dreiviertel: {
      part: 2,
      kind: 2,
      whole: 0,
    },
    eineinhalb: {
      part: 1,
      kind: 1,
      whole: 1,
    },
  },
  "gl-zahlenraetsel": {
    plus: {
      x: 17,
      a: 7,
      mode: 0,
    },
    mal: {
      x: 8,
      a: 3,
      mode: 1,
    },
    andere: {
      x: 4,
      a: 6,
      mode: 1,
    },
  },
  "gl-rechteck-rueckwaerts": {
    flaeche: {
      a: 6,
      b: 4,
    },
    umfang: {
      a: 8,
      b: 3,
    },
    quadrat: {
      a: 5,
      b: 5,
    },
  },
};
