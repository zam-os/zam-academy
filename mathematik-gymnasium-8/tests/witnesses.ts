import type { LabValues } from "../src/model/types";

export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "ft-1-zusammenhaenge": {
    zwanzig: { base: 10, rate: 0.5, x: 20 },
    konstant: { base: 16, rate: 0, x: 10 },
    hoch: { base: 10, rate: 1, x: 40 },
  },
  "ft-2-eindeutigkeit": {
    funktion: { mode: 0, x: 2 },
    kreisleer: { mode: 2, x: 4 },
    scheitel: { mode: 3, x: -1 },
  },
  "ft-3-fachbegriffe": {
    positiv: { a: 1, minX: 1, maxX: 3 },
    sechzehn: { a: 1, minX: 0, maxX: 4 },
    halb: { a: 0.5, minX: -4, maxX: 4 },
  },
  "ft-4-achsen-punkte": {
    auf: { m: 2, t: -2, px: 2, py: 2 },
    ursprung: { m: 2, t: 0, px: 2, py: 4 },
    nullstelle: { m: 1, t: -3, px: 3, py: 0 },
  },
  "ft-5-aenderung": {
    abnahme: { mode: 1, x1: 0, dx: 4 },
    parabel: { mode: 2, x1: 1, dx: 2 },
    gleich: { mode: 2, x1: -1, dx: 2 },
  },
  "lf-1-parameter": {
    steil: { m: 2, t: -2 },
    waagrecht: { m: 0, t: 3 },
    fallend: { m: -1.5, t: 2 },
  },
  "lf-2-zeichnen-ablesen": {
    flach: { m: -0.5, t: 3, dx: 2 },
    grosses: { m: 1.5, t: 1, dx: 4 },
    tief: { m: 2, t: -2, dx: 3 },
  },
  "lf-3-aufstellen": {
    ursprung2: { px: 0, py: 0, qx: 2, qy: 4 },
    fallend2: { px: 0, py: 2, qx: 2, qy: 0 },
    senkrecht: { px: 1, py: 1, qx: 1, qy: 3 },
  },
  "lf-4-nullstellen": {
    drei: { m: 1, t: -3 },
    negativ: { m: -1, t: -2 },
    keine: { m: 0, t: 2 },
  },
  "lf-5-schnittpunkt": {
    s23: { m1: 1, t1: 1, m2: -0.5, t2: 4 },
    xachse: { m1: 1, t1: -2, m2: -1, t2: 2 },
    ident: { m1: 1, t1: 2, m2: 1, t2: 2 },
  },
  "lf-6-sachkontext": {
    gleich40: { baseA: 20, rateA: 0.25, baseB: 10, rateB: 0.5 },
    immerA: { baseA: 5, rateA: 0.5, baseB: 15, rateB: 0.5 },
    x20y25: { baseA: 15, rateA: 0.5, baseB: 5, rateB: 1 },
  },
  "lf-7-ungleichungen": {
    invers: { a: -2, b: 0, op: 0, c: 6 },
    geschlossen: { a: 1, b: 0, op: 3, c: 2 },
    leer: { a: 0, b: 4, op: 0, c: 2 },
  },
  "lf-8-proportional": {
    prop25: { a: 2.5, t: 0, x: 4 },
    prop15: { a: 1.5, t: 0, x: 6 },
    prop3: { a: 3, t: 0, x: 2 },
  },
  "gr-1-defmenge": {
    luecke2: { a: 4, b: -2, x: 4 },
    treffer: { a: 4, b: 1, x: -1 },
    drei: { a: 6, b: -3, x: 5 },
  },
  "gr-2-verschieben": {
    rechtsHoch: { a: 2, b: -2, c: 1 },
    linksTief: { a: 2, b: 3, c: -2 },
    gespiegelt: { a: -2, b: -1, c: 2 },
  },
  "gr-3-achsen": {
    beide: { a: 6, b: 2, c: -1 },
    ursprung3: { a: 4, b: 2, c: -2 },
    ohneN: { a: 6, b: 2, c: 0 },
  },
  "gr-4-graph-parameter": {
    asympt: { a: 2, b: -2, c: 1 },
    deckung: { a: 4, b: -2, c: 1 },
    gegen: { a: -4, b: -2, c: 1 },
  },
  "gr-5-indirekt": {
    halb12: { k: 12, x: 4 },
    a24: { k: 24, x: 6 },
    quad: { k: 16, x: 4 },
  },
  "bt-1-erweitern-kuerzen": {
    luecke: { k: 2, a: 3, x: 3 },
    vierdrei: { k: 4, a: 3, x: 5 },
    wert25: { k: 5, a: 1, x: 3 },
  },
  "bt-2-add-sub": {
    wegX: { c1: 2, op: 1, c2: 2, a: 1, x: 4 },
    fuenfx: { c1: 3, op: 0, c2: 2, a: 2, x: 4 },
    sub31: { c1: 3, op: 1, c2: 1, a: 2, x: 4 },
  },
  "bt-3-mul-div": {
    div24: { mode: 1, p: 4, q: 2, x: 1 },
    mul3x: { mode: 0, p: 6, q: 2, x: 2 },
    divGleich: { mode: 1, p: 3, q: 3, x: 2 },
  },
  "bt-4-potenzen-z": {
    neg4: { base: 2, m: -1, n: -3 },
    hochNull: { base: 2, m: 2, n: -2 },
    neuntel: { base: 3, m: 1, n: 3 },
  },
  "bt-5-bruchgleichungen": {
    schein: { a: 2, b: 1, c: 4, d: 1 },
    x5: { a: 4, b: 1, c: 2, d: -2 },
    ident: { a: 3, b: 1, c: 3, d: 1 },
  },
  "bt-6-schnittproblem": {
    einsdrei: { a: 4, b: -1, m: 1, t: -1 },
    zweieins: { a: 2, b: 0, m: 0.5, t: 0 },
    keinschnitt: { a: 2, b: 0, m: -1, t: 0 },
  },
  "bt-7-formeln": {
    strom: { target: 1, R: 6, I: 3 },
    spannung: { target: 2, R: 10, I: 4 },
    widerstand: { target: 0, R: 12, I: 2 },
  },
  "la-1-zufall": {
    gt4w6: { die: 0, rule: 1 },
    div3w8: { die: 1, rule: 2 },
    gt4w8: { die: 1, rule: 1 },
  },
  "la-2-haeufigkeit": {
    n200: { n: 200, p: 0.5 },
    n500: { n: 500, p: 0.2 },
    nah07: { n: 300, p: 0.7 },
  },
  "la-3-tabelle-sim": {
    fix45: { mode: 0, hits: 45, total: 100 },
    fix150: { mode: 0, hits: 60, total: 150 },
    fix200: { mode: 0, hits: 50, total: 200 },
  },
  "la-4-laplace-abgrenzen": {
    gleich: { s1: 120, s2: 120 },
    halb: { s1: 180, s2: 90 },
    asym: { s1: 60, s2: 120 },
  },
  "la-5-laplace-rechnen": {
    vierzig: { red: 4, blue: 3, green: 3 },
    gleichFarben: { red: 3, blue: 3, green: 3 },
    gegen75: { red: 3, blue: 5, green: 4 },
  },
  "la-6-zaehlprinzip-baum": {
    sechs: { n1: 2, n2: 3, fav: 2 },
    zwoelf: { n1: 3, n2: 4, fav: 3 },
    sechzehn: { n1: 4, n2: 4, fav: 4 },
  },
  "lg-1-aufstellen": {
    beide: { x: 7, y: 5 },
    nurI: { x: 4, y: 5 },
    gleich22: { x: 6, y: 4 },
  },
  "lg-2-graphisch": {
    s23: { m1: 1, t1: 1, m2: 0, t2: 3 },
    sm11: { m1: 1, t1: 2, m2: -1, t2: 0 },
    yAchse: { m1: 1, t1: 2, m2: -1, t2: 2 },
  },
  "lg-3-einsetzung": {
    l34: { c1: 7, a2: 1, c2: -1 },
    l51: { c1: 6, a2: 1, c2: 4 },
    gleich: { c1: 4, a2: 1, c2: 0 },
  },
  "lg-4-addition-vergleich": {
    g41: { m: 2, c1: 10, c2: 3 },
    g32: { m: 3, c1: 12, c2: 1 },
    g20: { m: 1, c1: 4, c2: 2 },
  },
  "lg-5-loesbarkeit": {
    s20: { a2: 1, b2: 1, c2: 2 },
    leer: { a2: 2, b2: -1, c2: 5 },
    unendlich: { a2: 4, b2: -2, c2: 8 },
  },
  "kz-1-pi-umfang": {
    d2: { d: 2, roll: 100 },
    d6: { d: 6, roll: 100 },
    halb: { d: 4, roll: 50 },
  },
  "kz-2-kreisflaeche": {
    doppelR: { r: 4, slices: 8 },
    fein: { r: 3, slices: 32 },
    r5: { r: 5, slices: 12 },
  },
  "kz-3-kreisteile": {
    viertel: { mode: 0, r: 6, alpha: 90, ri: 2 },
    halbk: { mode: 0, r: 4, alpha: 180, ri: 2 },
    ring: { mode: 1, r: 5, alpha: 60, ri: 3 },
  },
  "kz-4-schraegbild-netz": {
    zyl35: { body: 0, r: 3, h: 5 },
    prisma: { body: 1, r: 3, h: 4 },
    gleichMG: { body: 0, r: 3, h: 3 },
  },
  "kz-5-volumen": {
    grenz32: { n: 32, r: 3, h: 4 },
    v80pi: { n: 16, r: 4, h: 5 },
    acht: { n: 8, r: 2, h: 6 },
  },
  "kz-6-modellieren": {
    sockel4: { hBox: 4, rTop: 2, hTop: 3 },
    grossTop: { hBox: 2, rTop: 3, hTop: 4 },
    turm: { hBox: 5, rTop: 1, hTop: 5 },
  },
};
