import type { LabValues } from "../src/model/types";

/** Concrete legal settings; the suite proves each goal reachable and none free at the start. */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  "nz-1-zahlenmenge": {
    million: { digit: 1, exp: 6 },
    milliarden: { digit: 5, exp: 9 },
    groesste: { digit: 9, exp: 12 },
  },
  "nz-2-stufenzahlen": {
    nullen: { ht: 4, zt: 0, t: 7, h: 0, z: 5, e: 0 },
    stufenzahl: { ht: 1, zt: 0, t: 0, h: 0, z: 0, e: 0 },
    dreitausend: { ht: 0, zt: 0, t: 3, h: 0, z: 0, e: 0 },
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
  "nz-5-dualsystem": {
    dreizehn: { b5: 0, b4: 0, b3: 1, b2: 1, b1: 0, b0: 1 },
    zweiunddreissig: { b5: 1, b4: 0, b3: 0, b2: 0, b1: 0, b0: 0 },
    alle: { b5: 1, b4: 1, b3: 1, b2: 1, b1: 1, b0: 1 },
  },
  "nz-6-roemisch": {
    vierzehn: { n: 14 },
    lang: { n: 49 },
    jedes: { n: 1666 },
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
  "nz-10-rechenregeln": {
    punkt: { term: 0, a: 2, b: 3, c: 4 },
    klammer: { term: 1, a: 1, b: 4, c: 4 },
    potenz: { term: 2, a: 3, b: 2, c: 5 },
  },
  "nz-11-rechengesetze": {
    vertauschen: { law: 0, a: 17, b: 23, c: 1 },
    verbinden: { law: 1, a: 25, b: 4, c: 37 },
    verteilen: { law: 2, a: 7, b: 10, c: 2 },
  },
  "nz-12-potenzen": {
    quadrat: { base: 15, exp: 2 },
    zweierpotenz: { base: 2, exp: 5 },
    vierhundert: { base: 20, exp: 2 },
  },
  "nz-13-zehnerpotenzen": {
    million: { a: 1, n: 6 },
    beispiel: { a: 35, n: 4 },
    sonne: { a: 15, n: 7 },
  },
  "nz-14-wachstum": {
    zellen: { f: 0, n: 10 },
    mail: { f: 1, n: 5 },
    million: { f: 2, n: 6 },
  },
  "nz-15-teilbarkeit": {
    "drei-teiler": { n: 120 },
    neun: { n: 117 },
    viele: { n: 60 },
  },
  "nz-16-primfaktoren": {
    beispiel: { n: 60 },
    prim: { n: 101 },
    sieben: { n: 128 },
  },
  "nz-17-ggt-kgv": {
    beispiel: { a: 12, b: 18 },
    fremd: { a: 8, b: 15 },
    vielfaches: { a: 6, b: 18 },
  },
  "nz-18-kombinatorik": {
    sechs: { t: 3, h: 2, s: 1 },
    achtzehn: { t: 3, h: 3, s: 2 },
    maximum: { t: 4, h: 4, s: 3 },
  },
  "gz-1-negative-zahlen": {
    frost: { ctx: 0, t: -12 },
    schulden: { ctx: 1, t: -20 },
    keller: { ctx: 2, t: -3 },
  },
  "gz-2-begriffe": {
    "minus-sieben": { z: -7 },
    null: { z: 0 },
    zwoelf: { z: 12 },
  },
  "gz-3-zahlengerade": {
    "beide-negativ": { scale: 2, a: -4, b: -1 },
    hundert: { scale: 3, a: -3, b: 2 },
    gleich: { scale: 1, a: -5, b: -5 },
  },
  "gz-4-addieren-subtrahieren": {
    "ueber-null": { a: -5, op: 0, b: 8 },
    "unter-null": { a: 3, op: 1, b: 7 },
    "minus-minus": { a: -4, op: 1, b: -6 },
  },
  "gz-5-multiplizieren-dividieren": {
    "minus-mal-minus": { op: 0, a: -3, b: -4 },
    geteilt: { op: 1, a: -4, b: 6 },
    verschieden: { op: 0, a: -6, b: 7 },
  },
  "gz-6-verbindungen": {
    erste: { term: 0, a: -5, b: 3, d: -2 },
    klammer: { term: 1, a: -4, b: 1, d: -3 },
    minus: { term: 2, a: -2, b: -3, d: -4 },
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
  "ge-3-kreis": {
    durchmesser: { r: 4, sector: 60, p: 1 },
    viertel: { r: 2, sector: 90, p: 1 },
    "auf-linie": { r: 3, sector: 60, p: 3 },
  },
  "ge-4-dreiecke": {
    gleichseitig: { a: 5, b: 5, c: 5 },
    rechtwinklig: { a: 3, b: 4, c: 5 },
    stumpf: { a: 3, b: 3, c: 5 },
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
  "ge-7-winkel": {
    stumpf: { a: 135 },
    gestreckt: { a: 180 },
    ueberstumpf: { a: 270 },
  },
  "ge-8-winkelpaare": {
    senkrecht: { a: 90 },
    sechzig: { a: 120 },
    fuenfunddreissig: { a: 35 },
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
  "gr-4-schreibweisen": {
    euro: { kind: 0, whole: 2, pct: 50 },
    kilo: { kind: 2, whole: 1, pct: 25 },
    meter: { kind: 1, whole: 3, pct: 75 },
  },
  "gr-5-massstab": {
    plan: { scale: 1, b: 5 },
    karte: { scale: 2, b: 4 },
    lupe: { scale: 3, b: 10 },
  },
  "gr-6-dreisatz": {
    beispiel: { n: 4, p: 3, t: 7 },
    einheit: { n: 5, p: 8, t: 1 },
    gross: { n: 3, p: 15, t: 12 },
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
  "uf-4-flaecheneinheiten": {
    meter: { amount: 3, from: 3, to: 2 },
    hektar: { amount: 5, from: 5, to: 4 },
    kilometer: { amount: 2, from: 6, to: 5 },
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
  "da-2-vierfeldertafel": {
    beispiel: { a: 6, b: 8, c: 9, d: 7 },
    bus: { a: 10, b: 5, c: 10, d: 5 },
    "gleich-viele": { a: 6, b: 8, c: 9, d: 5 },
  },
  "da-3-verzerrungen": {
    taeuschen: { a: 100, b: 70, start: 45 },
    ehrlich: { a: 100, b: 50, start: 0 },
    gleich: { a: 80, b: 80, start: 0 },
  },
};
