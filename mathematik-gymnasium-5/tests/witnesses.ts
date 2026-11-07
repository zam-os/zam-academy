import type { LabValues } from "../src/model/types";

/** Concrete legal settings; the suite proves each goal reachable and none free at the start. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "nz-1-unendlich": {
    million: { digit: 1, exp: 6 },
    milliarden: { digit: 5, exp: 9 },
    billion: { digit: 9, exp: 12 },
  },
  "nz-2-grosse-zahlen": {
    bayern: { mrd: 0, mio: 13, tsd: 400 },
    erde: { mrd: 8, mio: 0, tsd: 0 },
    nullen: { mrd: 2, mio: 30, tsd: 0 },
  },
  "nz-3-stellenwert": {
    million: { zm: 0, m: 1, ht: 0, zt: 0, t: 0, h: 0, z: 0, e: 0 },
    sieben: { zm: 0, m: 0, ht: 0, zt: 0, t: 7, h: 0, z: 7, e: 0 },
    groesste: { zm: 9, m: 9, ht: 9, zt: 9, t: 9, h: 9, z: 9, e: 9 },
  },
  "nz-4-roemisch": {
    vierzehn: { n: 14 },
    lang: { n: 88 },
    jedes: { n: 1666 },
  },
  "nz-5-zahlenstrahl": {
    siebzig: { scale: 1, k: 7 },
    tausend: { scale: 2, k: 13 },
    gross: { scale: 3, k: 20 },
  },
  "nz-6-runden": {
    mitte: { place: 1, n: 2650 },
    knapp: { place: 2, n: 3499 },
    kette: { place: 0, n: 4995 },
  },
  "nz-7-negative-zahlen": {
    frost: { ctx: 0, t: -12 },
    schulden: { ctx: 1, t: -20 },
    keller: { ctx: 2, t: -3 },
  },
  "nz-8-zahlengerade": {
    "minus-sieben": { z: -7 },
    null: { z: 0 },
    zwoelf: { z: -12 },
  },
  "nz-9-aussagen": {
    gegenbeispiel: { a: -9, b: 4 },
    "beide-negativ": { a: -9, b: -4 },
    "gleicher-betrag": { a: 6, b: -6 },
  },
  "nz-10-schriftlich": {
    "zehn-millionen": { op: 0, am: 7, at: 300, bm: 5, bt: 200 },
    "uebertrag-tausend": { op: 1, am: 6, at: 100, bm: 2, bt: 800 },
    "fast-gleich": { op: 1, am: 3, at: 500, bm: 3, bt: 100 },
  },
  "nz-11-summen": {
    "ins-minus": { s: 20, op: 0, c: -30 },
    tiefer: { s: -15, op: 0, c: -15 },
    null: { s: -40, op: 0, c: 40 },
  },
  "nz-12-differenzen": {
    "minus-minus": { a: 5, op: 1, b: -3 },
    "unter-null": { a: 3, op: 1, b: 10 },
    gleich: { a: -4, op: 1, b: -4 },
  },
  "nz-13-gleichungen": {
    plus: { form: 0, a: -3, b: 5, x: 8 },
    minus: { form: 1, a: 7, b: -2, x: 5 },
    subtrahend: { form: 2, a: 4, b: 9, x: -5 },
  },
  "nz-14-rechenvorteile": {
    erste: { term: 0, order: 1 },
    zweite: { term: 1, order: 1 },
    dritte: { term: 2, order: 1 },
  },
  "nz-15-terme": {
    erster: { term: 0, step: 2 },
    zweiter: { term: 1, step: 2 },
    dritter: { term: 2, step: 3 },
  },
  "ge-1-koordinaten": {
    "links-unten": { ax: -4, ay: -2, bx: 3, by: 2 },
    ursprung: { ax: 1, ay: 1, bx: 0, by: 0 },
    quadrat: { ax: 1, ay: 1, bx: 5, by: 5 },
  },
  "ge-2-schreibweisen": {
    strecke: { kind: 0, ax: 1, ay: 1, bx: 6, by: 1 },
    halbgerade: { kind: 1, ax: 2, ay: 1, bx: 2, by: 3 },
    gerade: { kind: 2, ax: 0, ay: 0, bx: 4, by: 4 },
  },
  "ge-3-lot-abstand": {
    senkrecht: { angle: 90, d: 2, p: 2 },
    parallel: { angle: 0, d: 4, p: 2 },
    "auf-g": { angle: 30, d: 2, p: 0 },
  },
  "ge-4-kreis-gerade": {
    tangente: { r: 2, d: 2 },
    sekante: { r: 2, d: 0 },
    passante: { r: 1, d: 3 },
  },
  "ge-5-zwei-kreise": {
    aussen: { r: 3, s: 2, d: 5 },
    schneiden: { r: 3, s: 2, d: 3 },
    innen: { r: 3, s: 2, d: 1 },
  },
  "ge-6-punkte-bedingungen": {
    kreis: { r: 5, d: 1, px: 3, py: 4 },
    parallele: { r: 3, d: 2, px: 1, py: -2 },
    beide: { r: 5, d: 4, px: -3, py: 4 },
  },
  "ge-7-winkel": {
    recht: { a: 90 },
    gestreckt: { a: 180 },
    ueberstumpf: { a: 230 },
  },
  "ge-8-vierecke": {
    rechteck: { bx: 7, cx: 7, cy: 4, dx: 1, dy: 4 },
    trapez: { bx: 7, cx: 5, cy: 4, dx: 2, dy: 4 },
    drachen: { bx: 5, cx: 4, cy: 4, dx: 1, dy: 5 },
  },
  "ge-9-viereck-eigenschaften": {
    parallelogramm: { bx: 7, cx: 9, cy: 4, dx: 3, dy: 4 },
    raute: { bx: 6, cx: 9, cy: 5, dx: 4, dy: 5 },
    quadrat: { bx: 5, cx: 5, cy: 5, dx: 1, dy: 5 },
  },
  "mu-1-multiplizieren": {
    tausend: { op: 0, a: 125, b: 8 },
    zwanzig: { op: 0, a: 500, b: 20 },
    gross: { op: 0, a: 999, b: 25 },
  },
  "mu-2-dividieren": {
    "ohne-rest": { op: 1, a: 936, b: 12 },
    "rest-sieben": { op: 1, a: 139, b: 12 },
    "groesster-rest": { op: 1, a: 999, b: 25 },
  },
  "mu-3-teilbarkeit": {
    alle: { n: 30 },
    "nur-drei": { n: 111 },
    keine: { n: 203 },
  },
  "mu-4-primfaktoren": {
    prim: { n: 97 },
    potenz: { n: 128 },
    "drei-verschiedene": { n: 30 },
  },
  "mu-5-zaehlprinzip": {
    zwoelf: { t: 3, h: 2, s: 2 },
    groesste: { t: 4, h: 4, s: 3 },
    sechs: { t: 2, h: 1, s: 3 },
  },
  "mu-6-vorzeichen": {
    "minus-minus": { op: 0, a: -4, b: -5 },
    "plus-minus": { op: 0, a: 6, b: -7 },
    geteilt: { op: 1, a: -4, b: -3 },
  },
  "mu-7-rechenvorteile": {
    tauschen: { law: 0, a: 25, b: 4, c: 3 },
    hundert: { law: 1, a: 25, b: 4, c: 37 },
    tausend: { law: 1, a: 25, b: 4, c: 10 },
  },
  "mu-8-potenzen": {
    "minus-acht": { base: -2, exp: 3 },
    "plus-sechzehn": { base: -2, exp: 4 },
    million: { base: 10, exp: 6 },
  },
  "mu-9-quadratzahlen": {
    dreizehn: { base: 13, exp: 2 },
    vierhundert: { base: 20, exp: 2 },
    negativ: { base: -7, exp: 2 },
  },
  "mu-10-zehnerpotenzen": {
    bayern: { a: 13, n: 6 },
    erde: { a: 8, n: 9 },
    sonne: { a: 15, n: 7 },
  },
  "mu-11-gleichungen": {
    mal: { form: 0, a: -6, b: 42, x: -7 },
    geteilt: { form: 1, a: 4, b: -5, x: -20 },
    divisor: { form: 2, a: 12, b: -3, x: -4 },
  },
  "te-1-gliedern": {
    produkt: { term: 1, step: 0 },
    differenz: { term: 2, step: 3 },
    quotient: { term: 3, step: 3 },
  },
  "te-2-punkt-vor-strich": {
    beispiel: { term: 1, a: 6, b: 3, d: -4 },
    gleich: { term: 0, a: 5, b: 3, d: 1 },
    null: { term: 2, a: 12, b: 3, d: 4 },
  },
  "te-3-distributivgesetz": {
    plus: { op: 0, a: 6, b: 10, c: 4 },
    minus: { op: 1, a: 7, b: 100, c: 2 },
    gross: { op: 1, a: 12, b: 100, c: 1 },
  },
  "te-4-vorwaerts-rueckwaerts": {
    beispiel: { dir: 1, x: 4, a: -3, b: 5 },
    "ziel-null": { dir: 0, x: -4, a: 3, b: 12 },
    "ziel-gross": { dir: 0, x: -5, a: -5, b: 20 },
  },
  "te-5-sachaufgaben": {
    "kein-rest": { k: 28, s: 3, pack: 0 },
    "wenig-rest": { k: 25, s: 2, pack: 1 },
    viele: { k: 30, s: 4, pack: 2 },
  },
  "gr-1-laenge-masse": {
    kilometer: { kind: 0, amount: 3, from: 4, to: 3 },
    tonne: { kind: 1, amount: 2, from: 3, to: 2 },
    gross: { kind: 1, amount: 5000, from: 0, to: 1 },
  },
  "gr-2-geld-zeit": {
    stunde: { kind: 1, amount: 3, from: 2, to: 1 },
    euro: { kind: 0, amount: 500, from: 0, to: 1 },
    sekunden: { kind: 1, amount: 90, from: 1, to: 2 },
  },
  "gr-3-kommaschreibweise": {
    euro: { kind: 0, whole: 3, pct: 75 },
    kilo: { kind: 2, whole: 2, pct: 50 },
    kilometer: { kind: 3, whole: 4, pct: 25 },
  },
  "gr-4-rechnen": {
    beispiel: { kind: 0, whole: 3, part: 20, k: 4 },
    kilo: { kind: 1, whole: 2, part: 50, k: 3 },
    geld: { kind: 2, whole: 1, part: 25, k: 8 },
  },
  "gr-5-schaetzen": {
    bleistift: { object: 0, value: 18, unit: 1 },
    tuer: { object: 1, value: 2, unit: 2 },
    weg: { object: 2, value: 170, unit: 3 },
  },
  "gr-6-dreisatz": {
    beispiel: { n: 6, p: 3, t: 8 },
    gleich: { n: 12, p: 2, t: 12 },
    hundert: { n: 2, p: 5, t: 20 },
  },
  "gr-7-massstab": {
    zimmer: { scale: 1, b: 5 },
    karte: { scale: 2, b: 4 },
    modell: { scale: 3, b: 10 },
  },
  "fl-1-rechteck": {
    achtundvierzig: { a: 6, b: 8 },
    quadrat: { a: 7, b: 7 },
    schmal: { a: 12, b: 1 },
  },
  "fl-2-einheiten": {
    ar: { amount: 3, from: 4, to: 3 },
    hektar: { amount: 200, from: 4, to: 5 },
    quadratkilometer: { amount: 5, from: 6, to: 5 },
  },
  "fl-3-umfang-flaeche": {
    "gleich-u": { a: 6, b: 6 },
    "gleich-a": { a: 12, b: 2 },
    kleinste: { a: 12, b: 1 },
  },
  "fl-4-naeherung": {
    passt: { w: 6, h: 4 },
    "zu-gross": { w: 8, h: 4 },
    "zu-klein": { w: 4, h: 2 },
  },
  "fl-5-zerlegen": {
    beispiel: { method: 0, w: 10, h: 8, cw: 4, ch: 3 },
    achtundvierzig: { method: 1, w: 7, h: 7, cw: 1, ch: 1 },
    zerlegt: { method: 0, w: 12, h: 9, cw: 4, ch: 2 },
  },
  "fl-6-oberflaeche": {
    wuerfel: { a: 4, b: 4, c: 4 },
    zweiundsechzig: { a: 5, b: 3, c: 2 },
    groesste: { a: 5, b: 5, c: 5 },
  },
  "fl-7-zusammengesetzt": {
    beispiel: { a: 6, b: 3, c: 4, k: 2 },
    kleiner: { a: 5, b: 4, c: 3, k: 1 },
    breit: { a: 8, b: 3, c: 6, k: 4 },
  },
  "fl-8-kopfgeometrie": {
    kreuz: { pattern: 0, face: 1 },
    treppe: { pattern: 1, face: 2 },
    "kein-wuerfel": { pattern: 4, face: 3 },
  },
};
