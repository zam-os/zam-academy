import type { LabValues } from "../src/model/types";

/** Concrete legal settings; the suite proves each goal reachable and none free at the start. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  // Stage 1
  "g12-schar-ganzrational": {
    monoton: { a: 0 },
    "nullstelle-zwei": { a: 4 },
    abstand: { a: 8 },
  },
  "g12-stammfunktion-ganzrational": {
    "konstante-positiv": { C: 2 },
    negativ: { C: -3 },
    ursprung: { C: 0 },
  },
  "g12-exp-ableitung-regeln": {
    "tiefpunkt-ursprung": { a: -1, k: -1 },
    "waagrecht-zwei": { a: 1, k: -1 },
    "extrem-drei": { a: 2, k: -1 },
  },
  "g12-exp-grenzwerte": {
    linear: { n: 1 },
    kubisch: { n: 3 },
    vier: { n: 4 },
  },
  "g12-exp-kurvendiskussion": {
    "null-eins": { a: 1 },
    "null-drei": { a: 9 },
    standard: { a: 4 },
  },
  "g12-exp-wachstum-modelle": {
    "zerfall-stark": { N0: 80, k: -5 },
    "wachstum-moderat": { N0: 80, k: 2 },
    basis: { N0: 100, k: -3 },
  },
  "g12-trig-ableitung-graph": {
    "ursprung-steigung": { x0: 0 },
    hochpunkt: { x0: 2 },
    abfall: { x0: 4 },
  },
  "g12-trig-kurvendiskussion": {
    schnell: { a: 1, omega: 3 },
    "amplitude-drei": { a: 3, omega: 2 },
    "standard-schwingung": { a: 2, omega: 1 },
  },

  // Stage 2
  "g12-stoch-axiomatik": {
    disjunkt: { pA: 50, pB: 40, pSchnitt: 0 },
    vollstaendig: { pA: 60, pB: 50, pSchnitt: 10 },
    symmetrisch: { pA: 50, pB: 50, pSchnitt: 20 },
  },
  "g12-stoch-zufallsgroesse-parameter": {
    gleichverteilt: { p1: 35, p2: 35 },
    "mittelwert-zwei": { p1: 30, p2: 40 },
    "hoher-erwartungswert": { p1: 10, p2: 20 },
  },
  "g12-stoch-urnenmodelle": {
    "ohne-fuenf-zwei": { n: 5, k: 2, withRep: 0 },
    "mit-zuruecklegen": { n: 10, k: 2, withRep: 1 },
    "lotto-auswahl": { n: 10, k: 3, withRep: 0 },
  },
  "g12-stoch-bernoulli-binomial": {
    "halbe-treffer": { n: 10, p: 50, kMax: 5 },
    "hohe-trefferquote": { n: 10, p: 80, kMax: 8 },
    "standard-kette": { n: 10, p: 40, kMax: 4 },
  },
  "g12-stoch-binomial-parameter": {
    "mu-zehn": { n: 20, p: 50 },
    "grosse-kette": { n: 40, p: 50 },
    asymmetrisch: { n: 30, p: 20 },
  },

  // Stage 3
  "g12-hypo-grundprinzip": {
    rechtsseitig: { p0: 50, isRight: 1 },
    linksseitig: { p0: 80, isRight: 0 },
    qualitaetskontrolle: { p0: 90, isRight: 0 },
  },
  "g12-hypo-fehlerarten": {
    "alpha-streng": { c: 15 },
    "alpha-fuenf": { c: 14 },
    "beta-klein": { c: 12 },
  },
  "g12-hypo-ablehnungsbereich": {
    "standard-fuenf": { alpha: 5 },
    "streng-ein-prozent": { alpha: 1 },
    "zehn-prozent": { alpha: 10 },
  },
  "g12-hypo-interpretation": {
    "nicht-signifikant": { k: 12 },
    "grenzwertig-signifikant": { k: 14 },
    hochsignifikant: { k: 17 },
  },

  // Stage 4
  "g12-quotientenregel-basis": {
    "pol-drei": { a: 2, b: 1, pole: 3 },
    "waagrecht-eins": { a: 1, b: 1, pole: 2 },
    "zaehler-null": { a: 1, b: -2, pole: 2 },
  },
  "g12-gebrochen-rational-diskussion": {
    "null-ursprung": { a: 0 },
    "null-drei": { a: 9 },
    "standard-vier": { a: 4 },
  },
  "g12-quotientenregel-verknuepfung": {
    "extrem-ursprung": { a: 2 },
    "extrem-eins": { a: 1 },
    "extrem-zwei": { a: 0 },
  },
  "g12-umkehrfunktion-wurzel": {
    normal: { a: 1 },
    zwei: { a: 2 },
    vier: { a: 4 },
  },
  "g12-potenz-rationale-exponenten": {
    quadratwurzel: { p: 1, q: 2 },
    kubikwurzel: { p: 1, q: 3 },
    "drei-viertel": { p: 3, q: 4 },
  },
  "g12-wurzel-kurvendiskussion": {
    "ursprung-start": { c: 0 },
    "start-minus-vier": { c: 4 },
    "start-minus-zwei": { c: 2 },
  },
  "g12-ln-ableitung": {
    "steigung-eins": { x0: 1 },
    "steigung-halb": { x0: 2 },
    "steigung-viertel": { x0: 4 },
  },
  "g12-ln-kurvendiskussion-grenzwerte": {
    detail: { zoom: 2 },
    nah: { zoom: 3 },
    maximal: { zoom: 4 },
  },

  // Stage 5
  "g12-raum-koordinatensystem": {
    grundebene: { x1: 3, x2: 4, x3: 0 },
    achse: { x1: 0, x2: 4, x3: 0 },
    symmetrisch: { x1: 4, x2: 4, x3: 2 },
  },
  "g12-vektoralgebra-raum": {
    kollinear: { a1: 2, a2: 2, b1: 2, b2: 2 },
    "null-b": { a1: 2, a2: 3, b1: 0, b2: 0 },
    groesser: { a1: 3, a2: 4, b1: 1, b2: 2 },
  },
  "g12-skalarprodukt-winkel": {
    orthogonal: { a1: 2, b2: 0 },
    "laenge-vier": { a1: 4, b2: 3 },
    "winkel-vierzig": { a1: 3, b2: 2 },
  },
  "g12-vektorprodukt-spatprodukt": {
    quadrat: { a1: 4, b2: 4 },
    "dreieck-sechs": { a1: 3, b2: 4 },
    "standard-drei": { a1: 3, b2: 3 },
  },
  "g12-koerper-sachkontexte": {
    "groesse-vier-sechs": { a: 4, h: 6 },
    hoch: { a: 3, h: 9 },
    "standard-pyramide": { a: 4, h: 5 },
  },
};
