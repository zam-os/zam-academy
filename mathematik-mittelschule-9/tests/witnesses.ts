import type { LabValues } from "../src/model/types";

/** For every lab goal one setting that reaches it; the tests check each. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  // Etappe 1: Prozent- und Zinsrechnung
  "zi-1-jahreszinsen": {
    fuenfzig: { K: 2500, p: 2 },
    satz: { K: 3000, p: 2.5 },
    "unter-drei": { K: 4800, p: 2.5 },
  },
  "zi-2-monats-tageszinsen": {
    viertel: { K: 2400, p: 1.5, t: 90 },
    dreissig: { K: 3600, p: 2, t: 150 },
    zehn: { K: 3000, p: 2, t: 60 },
  },
  "zi-3-zinsformel-umstellen": {
    zeit: { K: 4000, p: 3, t: 150 },
    satz: { K: 2000, p: 2, t: 270 },
    kapital: { K: 3000, p: 2.5, t: 120 },
  },
  "zi-4-effektiver-jahreszins": {
    zwoelf: { K: 600, costA: 12, monthsA: 2, costB: 4, monthsB: 1 },
    "teurer-guenstiger": { K: 600, costA: 9, monthsA: 3, costB: 10, monthsB: 6 },
    gleich: { K: 600, costA: 9, monthsA: 3, costB: 6, monthsB: 2 },
  },
  "zi-5-zinseszins": {
    sechstausend: { K0: 5000, p: 4, n: 5 },
    hundert: { K0: 10000, p: 4, n: 5 },
    verdoppeln: { K0: 2000, p: 7.5, n: 10 },
  },
  "zi-6-zinsfaktor": {
    fuenftausend: { K0: 4000, p: 4, n: 6 },
    verdoppeln: { K0: 1000, p: 5, n: 15 },
    rueckwaerts: { K0: 5000, p: 3, n: 10 },
  },
  "zi-7-zusammenhaenge-schaubilder": {
    umgekehrt: { rel: 2, k: 3 },
    "nicht-proportional": { rel: 3, k: 2 },
    zweieinhalb: { rel: 0, k: 2.5 },
  },
  // Etappe 2: Potenzen
  "po-1-zehnerpotenzen": {
    licht: { m: 3, e: 8 },
    haar: { m: 7, e: -5 },
    groesser: { m: 3.9, e: -2 },
  },
  "po-2-rechnen-zehnerpotenzen": {
    eins: { a: 2, m: 3, b: 5, n: -4 },
    licht: { a: 3, m: 8, b: 5, n: 2 },
    umrechnen: { a: 4, m: 3, b: 3, n: 2 },
  },
  "po-3-vorsilben": {
    speicher: { v: 2.5, from: 9, to: 8, unit: 1 },
    nano: { v: 1, from: 2, to: 0, unit: 0 },
    tera: { v: 4, from: 10, to: 5, unit: 1 },
  },
  // Etappe 3: Geometrische Figuren, Körper und Lagebeziehungen
  "ge-1-rechtwinklige-dreiecke": {
    rechteck: { fig: 1, cut: 0 },
    drachen: { fig: 2, cut: 2 },
    parallelogramm: { fig: 3, cut: 1 },
  },
  "ge-2-thaleskreis": {
    gleichschenklig: { c: 6, phi: 90, rf: 1 },
    dreissig: { c: 8, phi: 60, rf: 1 },
    stumpf: { c: 6, phi: 120, rf: 0.7 },
  },
  "ge-3-pythagoras": {
    zehn: { a: 6, b: 8, view: 0, puzzle: 0 },
    fuenfzig: { a: 5, b: 5, view: 0, puzzle: 0 },
    puzzle: { a: 3, b: 2, view: 1, puzzle: 100 },
  },
  "ge-4-pythagoras-anwenden": {
    dreizehn: { a: 3, b: 4, c: 12 },
    stab: { a: 6, b: 8, c: 2 },
    wuerfel: { a: 9, b: 9, c: 9 },
  },
  "ge-5-umkehrung": {
    zwoelf: { N: 12, p: 3, q: 4 },
    dreissig: { N: 30, p: 5, q: 12 },
    stumpf: { N: 24, p: 5, q: 8 },
  },
  "ge-6-regelmaessige-vielecke": {
    vierzig: { n: 9, s: 3 },
    gleichseitig: { n: 6, s: 3 },
    achteck: { n: 8, s: 4.5 },
  },
  "ge-7-pyramide-kegel": {
    sechseck: { body: 3, a: 4, h: 5 },
    seitenhoehe: { body: 0, a: 6, h: 4 },
    kegel: { body: 4, a: 6, h: 4 },
  },
  "ge-8-schiefe-koerper": {
    gerade: { body: 0, a: 4, h: 5, dx: 0, dy: 0 },
    ecke: { body: 0, a: 4, h: 5, dx: 2, dy: 2 },
    aussen: { body: 1, a: 4, h: 5, dx: 3, dy: 0 },
  },
  // Etappe 4: Flächeninhalt – Vielecke
  "fl-1-vielecke-flaeche": {
    wabe: { n: 6, s: 4 },
    hundert: { n: 12, s: 3 },
    quadrat: { n: 4, s: 3 },
  },
  "fl-2-zusammengesetzte-figuren": {
    gleich: { shape: 0, method: 1, w: 8, h: 6, x: 3, y: 2 },
    dreissig: { shape: 0, method: 0, w: 6, h: 6, x: 2, y: 3 },
    giebel: { shape: 1, method: 0, w: 8, h: 4, x: 2, y: 4 },
  },
  "fl-3-oberflaeche-pyramide-kegel": {
    sechsundneunzig: { body: 0, a: 6, h: 4 },
    kegel: { body: 1, a: 6, h: 4 },
    mantel: { body: 0, a: 2, h: 4 },
  },
  // Etappe 5: Rauminhalt – Prismen, Pyramiden, Kegel
  "ri-1-prisma": {
    liter: { n: 6, s: 6, hk: 11 },
    verdoppeln: { n: 5, s: 3, hk: 8 },
    wuerfel: { n: 4, s: 4, hk: 4 },
  },
  "ri-2-pyramide-kegel-volumen": {
    drei: { body: 0, a: 4, h: 6, pours: 3 },
    kegel: { body: 1, a: 10, h: 12, pours: 0 },
    pyramide: { body: 0, a: 6, h: 4, pours: 0 },
  },
  "ri-3-zusammengesetzte-koerper": {
    "dach-viertel": { shape: 0, a: 6, b: 8, h1: 6, h2: 4 },
    "turm-hundert": { shape: 1, a: 5, b: 8, h1: 3, h2: 3 },
    "silo-kegel": { shape: 2, a: 6, b: 8, h1: 4, h2: 3 },
  },
  // Etappe 6: Wahrscheinlichkeiten
  "wk-1-ergebnisse-ereignisse": {
    drei: { exp: 0, event: 0 },
    vier: { exp: 1, event: 2 },
    zwei: { exp: 2, event: 5 },
  },
  "wk-2-laplace": {
    viertel: { red: 2, blue: 3, green: 3, target: 0 },
    gleich: { red: 2, blue: 2, green: 2, target: 0 },
    sechzig: { red: 3, blue: 1, green: 1, target: 0 },
  },
  "wk-3-gegenereignis": {
    fair: { n: 10, k: 5 },
    dreiviertel: { n: 8, k: 2 },
    besser: { n: 10, k: 6 },
  },
  "wk-4-zwei-wuerfel": {
    sieben: { type: 0, s: 7 },
    pasch: { type: 2, s: 4 },
    gegen: { type: 3, s: 4 },
  },
  // Etappe 7: Gleichungen
  "gl-1-klammern": {
    start: { p: 3, q: 2, m: 1, n: 14, x: 4 },
    negativ: { p: 2, q: 1, m: 1, n: 0, x: -2 },
    keine: { p: 2, q: 1, m: 2, n: 0, x: 0 },
  },
  "gl-2-brueche-mischung": {
    zwanzig: { a1: 5, c1: 30, a2: 5, c2: 10 },
    verduennen: { a1: 2, c1: 30, a2: 4, c2: 0 },
    fuenfundzwanzig: { a1: 3, c1: 40, a2: 3, c2: 10 },
  },
  "gl-3-formeln": {
    trapez: { f: 0, a: 5, c: 3, h: 6, v: 50, t: 2, r: 2 },
    strecke: { f: 1, a: 4, c: 2, h: 3, v: 60, t: 2.5, r: 2 },
    zylinder: { f: 2, a: 4, c: 2, h: 4, v: 50, t: 2, r: 5 },
  },
  "gl-4-produkte-summen": {
    sechsundfuenfzig: { a: 2, b: 3, x: 5 },
    quadrat: { a: 3, b: 3, x: 2 },
    terme: { a: 3, b: 4, x: 2 },
  },
  "gl-5-bruchgleichungen": {
    start: { a: 6, b: 1, c: 2, x: 4 },
    drei: { a: 6, b: 3, c: 2, x: 0 },
    negativ: { a: 2, b: -4, c: 1, x: -2 },
  },
  "gl-6-gleichungssysteme": {
    parallel: { m1: 1, t1: 1, m2: 1, t2: 5 },
    gleich: { m1: 1, t1: 1, m2: 1, t2: 1 },
    ursprung: { m1: 1, t1: 0, m2: -1, t2: 0 },
  },
  "gl-7-reinquadratisch": {
    drei: { a: 1, c: 9 },
    eine: { a: 1, c: 0 },
    keine: { a: 1, c: -4 },
  },
  // Etappe 8: Funktionale Zusammenhänge
  "fu-1-zuordnungen": {
    "taxi-proportional": { sit: 0, m: 1.5, t: 0 },
    produkt: { sit: 1, m: 1.5, t: 3 },
    zunahme: { sit: 2, m: 1.5, t: 3 },
  },
  "fu-2-fehlende-werte": {
    aepfel: { kind: 0, x1: 4, y1: 6, x2: 7 },
    bagger: { kind: 1, x1: 3, y1: 12, x2: 4 },
    doppelt: { kind: 1, x1: 4, y1: 6, x2: 8 },
  },
  "fu-3-lineare-funktion": {
    punkte: { m: 2, t: 1 },
    nullstelle: { m: -2, t: 4 },
    waagrecht: { m: 0, t: -3 },
  },
  "fu-4-umgekehrt-proportional": {
    quadrat: { k: 36, x: 6 },
    punkt: { k: 24, x: 3 },
    halb: { k: 12, x: 4 },
  },
  "fu-5-schnittpunkt": {
    acht: { ta: 10, ma: 2, tb: 18, mb: 1 },
    parallel: { ta: 10, ma: 2, tb: 20, mb: 2 },
    "immer-a": { ta: 5, ma: 1, tb: 20, mb: 1 },
  },
};
