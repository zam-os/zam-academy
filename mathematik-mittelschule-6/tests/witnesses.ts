import type { LabValues } from "../src/model/types";
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "ge-3-kreis": {
    durchmesser: { r: 4, p: 1 },
    viertel: { r: 5, p: 1 },
    "auf-linie": { r: 3, p: 3 },
  },
  "ge-5-vierecke": {
    quadrat: { w: 4, h: 4, s: 0, t: 0 },
    parallelogramm: { w: 6, h: 3, s: 2, t: 0 },
    raute: { w: 5, h: 4, s: 3, t: 0 },
  },
  "ge-6-koordinatensystem": {
    punkt: { ax: 2, ay: 3, bx: 3, by: 2 },
    achse: { ax: 1, ay: 1, bx: 0, by: -4 },
    quadrat: { ax: -1, ay: -1, bx: 3, by: 3 },
  },
  "ge-9-koerper": {
    prisma: { body: 2, show: 0 },
    pyramide: { body: 3, show: 1 },
    kegel: { body: 5, show: 1 },
  },
  "ge-10-netze": {
    wuerfel: { a: 3, b: 3, c: 3 },
    breit: { a: 5, b: 1, c: 2 },
    draht: { a: 5, b: 4, c: 3 },
  },
  "ge-11-schraegbild": {
    wuerfel: { a: 4, b: 4, c: 4 },
    quader: { a: 6, b: 3, c: 4 },
    halb: { a: 3, b: 2, c: 3 },
  },
  "ge-12-kopfgeometrie": {
    kreuz: { pattern: 0, face: 1 },
    "kein-netz": { pattern: 3, face: 3 },
    treppe: { pattern: 1, face: 2 },
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
  "rz-16-dezimal-multiplizieren": {
    klein: { a: 0.3, b: 0.4 },
    gemischt: { a: 1.5, b: 0.2 },
    quadrat: { a: 1.2, b: 1.2 },
  },
  "rz-19-sachaufgaben": {
    sechs: { p: 6, price: 1.2 },
    liter: { p: 8, price: 1.2 },
    kosten: { p: 12, price: 2 },
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

  "rz-15-dezimal-addieren": {
    summe: {
      a: 2.75,
      b: 1.5,
      op: 0,
    },
    differenz: {
      a: 5,
      b: 1.25,
      op: 1,
    },
    zehn: {
      a: 7.25,
      b: 2.75,
      op: 0,
    },
  },
  "br-durch-natuerliche-zahl": {
    viertel: {
      z: 3,
      d: 4,
      k: 3,
    },
    siebtel: {
      z: 6,
      d: 7,
      k: 3,
    },
    achtel: {
      z: 1,
      d: 2,
      k: 4,
    },
  },
  "br-rechenregeln-runden": {
    ohne: {
      a: 0.5,
      b: 3,
      c: 0.25,
      mode: 0,
    },
    mit: {
      a: 0.5,
      b: 3,
      c: 0.25,
      mode: 1,
    },
    halb: {
      a: 1,
      b: 2,
      c: 0.5,
      mode: 1,
    },
  },
  "rz-zustandsaenderungen": {
    plus: {
      a: -2.5,
      b: 4.2,
      op: 0,
    },
    minus: {
      a: 1.7,
      b: 3.4,
      op: 1,
    },
    probe: {
      a: -1.7,
      b: 3.4,
      op: 0,
    },
  },
  "rz-wiederholte-aenderung": {
    minusdrei: {
      a: -0.75,
      k: 4,
    },
    minusviereinhalb: {
      a: -1.5,
      k: 3,
    },
    plusdrei: {
      a: 0.5,
      k: 6,
    },
  },
  "of-zusammengesetzte-koerper": {
    drei: {
      a: 3,
    },
    vier: {
      a: 4,
    },
    eins: {
      a: 1,
    },
  },
  "rg-wuerfelbauten-ansichten": {
    sieben: {
      a: 1,
      b: 2,
      c: 3,
      d: 1,
    },
    verdeckt: {
      a: 3,
      b: 3,
      c: 1,
      d: 1,
    },
    quader: {
      a: 3,
      b: 3,
      c: 3,
      d: 3,
    },
  },
  "da-arithmetisches-mittel": {
    fuenf: {
      a: 2,
      b: 4,
      c: 6,
      d: 8,
    },
    ausreisser: {
      a: 2,
      b: 4,
      c: 6,
      d: 28,
    },
    gleich: {
      a: 5,
      b: 5,
      c: 5,
      d: 5,
    },
  },
  "gl-volumen-rueckwaerts": {
    sechzig: {
      a: 4,
      b: 3,
      h: 5,
    },
    achtundvierzig: {
      a: 4,
      b: 3,
      h: 4,
    },
    wuerfel: {
      a: 3,
      b: 3,
      h: 3,
    },
  },
};
