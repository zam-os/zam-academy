import type { LabValues } from "../src/model/types";

/**
 * One slider setting per lab goal that reaches it: the proof that every
 * Laborauftrag is doable. Every value is a position the slider can take.
 */
export const GOAL_WITNESSES: Record<string, Record<string, LabValues>> = {
  // Etappe 1: Mechanik
  "kr-1-messen": {
    "zwei-cm": { L: 2, scale: 0.1 },
    millimeter: { L: 14.7, scale: 0.1 },
    "grob-genug": { L: 18, scale: 1 },
  },
  "kr-2-geschwindigkeit": {
    "hundert-meter": { v: 10, t: 10 },
    fuenfzig: { v: 14, t: 4 },
    "doppelte-zeit": { v: 6, t: 10 },
  },
  "kr-3-kraft": {
    "fuenf-cm": { F: 50, dir: 0, scale: 10 },
    "nach-links": { F: 40, dir: 180, scale: 10 },
    "vier-cm-schraeg": { F: 40, dir: 45, scale: 10 },
  },
  "kr-4-wechselwirkung": {
    "wand-achtzig": { case: 0, F: 80 },
    "buch-dreissig": { case: 1, F: 30 },
    "wand-maximal": { case: 0, F: 200 },
  },
  "kr-5-hooke": {
    "zehn-cm": { F: 4, D: 40 },
    plastisch: { F: 8, D: 20 },
    doppelt: { F: 4, D: 20 },
  },
  "kr-6-masse-gewicht": {
    mars: { m: 50, g: 3.71 },
    "gleich-wie-erde": { m: 60, g: 1.62 },
    jupiter: { m: 1, g: 24.79 },
  },
  "kr-7-teilchenmodell": {
    gas: { state: 2, temp: 30 },
    "fest-heiss": { state: 0, temp: 80 },
    "fluessig-kalt": { state: 1, temp: 20 },
  },
  "kr-8-dichte": {
    "kupfer-90": { rho: 8.96, V: 10 },
    "gold-kilo": { rho: 19.3, V: 100 },
    "alu-fuenfzig": { rho: 2.7, V: 50 },
  },
  "kr-9-reibung": {
    "holz-rutscht": { m: 40, surf: 0.4, mode: 0, F: 250 },
    "eis-leicht": { m: 40, surf: 0.05, mode: 0, F: 30 },
    "rollen-leicht": { m: 40, surf: 0.4, mode: 1, F: 20 },
  },
  // Etappe 2: Optik
  "op-1-lichtausbreitung": {
    "lampe-direkt": { lamp: 1, book: 0 },
    "buch-sichtbar": { lamp: 1, book: 1 },
    "buch-dunkel": { lamp: 0, book: 1 },
  },
  "op-2-schatten": {
    doppelt: { src: 0, a: 40, b: 40 },
    halbschatten: { src: 10, a: 40, b: 40 },
    "kein-kern": { src: 20, a: 30, b: 60 },
  },
  "op-3-finsternisse": {
    sonnenfinsternis: { day: 0, orbit: 0 },
    mondfinsternis: { day: 15, orbit: 0 },
    "ohne-finsternis": { day: 15, orbit: 1 },
  },
  "op-4-reflexion": {
    vierzig: { alpha: 40, delta: 0, surface: 0 },
    "zehn-grad": { alpha: 30, delta: 10, surface: 0 },
    diffus: { alpha: 30, delta: 0, surface: 1 },
  },
  "op-5-brechung": {
    "wasser-vierzig": { alpha: 40, n: 1.33 },
    "diamant-stark": { alpha: 60, n: 2.42 },
    senkrecht: { alpha: 0, n: 1.33 },
  },
  "op-6-totalreflexion": {
    "wasser-tr": { alpha: 50, n: 1.33 },
    "diamant-schnell": { alpha: 25, n: 2.42 },
    "glas-austritt": { alpha: 40, n: 1.5 },
  },
  "op-7-sammellinse": {
    "zwanzig-dpt": { type: 0, f: 5 },
    zerstreuung: { type: 1, f: 6 },
    stark: { type: 0, f: 3 },
  },
  "op-8-abbildung": {
    vergroessert: { f: 5, g: 7 },
    verkleinert: { f: 5, g: 15 },
    lupe: { f: 5, g: 3 },
  },
  "op-9-geraete": {
    "kurz-korrigiert": { eye: 1, D: -2.5 },
    "weit-korrigiert": { eye: 2, D: 2.5 },
    "normal-mit-brille": { eye: 0, D: 2 },
  },
  // Etappe 3: Mechanik und Energie
  "en-1-schiefe-ebene": {
    handkraft: { m: 100, h: 2, l: 8 },
    vierfach: { m: 100, h: 2, l: 8 },
    "arbeit-gleich": { m: 100, h: 2, l: 12 },
  },
  "en-2-hebel": {
    gleichgewicht: { F1: 50, a1: 40, F2: 100, a2: 20 },
    "zwanzig-newton": { F1: 20, a1: 50, F2: 100, a2: 10 },
    "links-sinkt": { F1: 100, a1: 60, F2: 100, a2: 10 },
  },
  "en-3-flaschenzug": {
    zweihundert: { m: 80, n: 4, h: 1 },
    seilweg: { m: 80, n: 3, h: 2 },
    arbeit: { m: 100, n: 5, h: 1 },
  },
  "en-4-arbeit": {
    "tausend-joule": { F: 200, s: 5, dir: 0 },
    "keine-arbeit": { F: 300, s: 5, dir: 1 },
    "vier-kj": { F: 500, s: 10, dir: 0 },
  },
  "en-5-leistung": {
    kilowatt: { m: 100, h: 10, t: 9 },
    gemuetlich: { m: 60, h: 2, t: 30 },
    "halbe-zeit": { m: 60, h: 4, t: 4 },
  },
  "en-6-energieformen": {
    "gleich-gross": { m: 10, h: 10, v: 14 },
    vierfach: { m: 10, h: 5, v: 20 },
    "ein-kj": { m: 20, h: 5, v: 5 },
  },
  "en-7-energieerhaltung": {
    "tiefster-punkt": { m: 50, h0: 5, x: 1, fric: 0 },
    gegenseite: { m: 50, h0: 5, x: 2, fric: 0 },
    "mit-reibung": { m: 50, h0: 5, x: 1, fric: 1 },
  },
  "en-8-wirkungsgrad": {
    achtzig: { device: 0.9, Ezu: 100 },
    waerme: { device: 0.05, Ezu: 50 },
    zwoelf: { device: 0.3, Ezu: 40 },
  },
  // Etappe 4: Wärmelehre
  "wl-1-innere-energie": {
    "nur-reibung": { W: 300, Q: 0 },
    "nur-waerme": { W: 0, Q: 200 },
    ausgleich: { W: 200, Q: -200 },
  },
  "wl-2-temperatur": {
    nullpunkt: { theta: -273 },
    siedepunkt: { theta: 100 },
    koerper: { theta: 37 },
  },
  "wl-3-aggregatzustaende": {
    schmelzen: { E: 6 },
    sieden: { E: 60 },
    dampf: { E: 100 },
  },
  "wl-4-ausdehnung": {
    "alu-zehn": { alpha: 23, L0: 10, dT: 50 },
    "stahl-sechs": { alpha: 12, L0: 10, dT: 50 },
    "kupfer-doppelt": { alpha: 17, L0: 10, dT: 100 },
  },
  "wl-5-wasseranomalie": {
    "vier-grad": { theta: 4, phase: 0 },
    eis: { theta: 0, phase: 1 },
    "null-grad": { theta: 0, phase: 0 },
  },
  "wl-6-waermeleitung": {
    kupfer: { lambda: 400, t: 10 },
    holz: { lambda: 0.15, t: 20 },
    eisen: { lambda: 80, t: 10 },
  },
  "wl-7-konvektion-strahlung": {
    alles: { vac: 1, mirror: 1, lid: 1 },
    "strahlung-bleibt": { vac: 1, mirror: 0, lid: 1 },
    "tee-warm": { vac: 1, mirror: 1, lid: 1 },
  },
  // Etappe 5: Magnetismus und Elektrizitätslehre
  "el-1-magnete": {
    influenz: { material: 0, phase: 1 },
    temporaer: { material: 0, phase: 2 },
    permanent: { material: 1, phase: 2 },
  },
  "el-2-magnetfeld": {
    "nord-sued-mitte": { kind: 3, cx: 0, cy: 0 },
    "gleichnamig-null": { kind: 2, cx: 0, cy: 0 },
    "erde-norden": { kind: 4, cx: 2, cy: 0 },
  },
  "el-3-ladung": {
    "glas-seide": { A: 1, B: 3, n: 5 },
    "pvc-fell": { A: 0, B: 5, n: 5 },
    "drei-nc": { A: 0, B: 2, n: 6 },
  },
  "el-4-elektrisches-feld": {
    "influenz-nah": { sign: 0, d: 4, split: 0 },
    "trennen-negativ": { sign: 0, d: 4, split: 1 },
    "trennen-positiv": { sign: 1, d: 4, split: 1 },
  },
  "el-5-elektrostatik-anwendung": {
    neunundneunzig: { U: 60, v: 1 },
    "schnell-schwach": { U: 10, v: 5 },
    langsamer: { U: 30, v: 1 },
  },
  "el-6-strom": {
    "zehn-coulomb": { I: 2, t: 5 },
    "ein-ampere": { I: 1, t: 5 },
    viele: { I: 4, t: 5 },
  },
  "el-7-stromkreis": {
    leuchtet: { switch: 1, part: 0 },
    isolator: { switch: 1, part: 5 },
    salzwasser: { switch: 1, part: 3 },
  },
  "el-8-stromstaerke-messen": {
    "gut-abgelesen": { conn: 0, range: 0.3, I: 0.25 },
    ueberlast: { conn: 0, range: 0.03, I: 0.3 },
    kurzschluss: { conn: 1, range: 3, I: 0.3 },
  },
  "el-9-stromfluss-fluessigkeit-gas": {
    ionen: { medium: 1, U: 50 },
    "gas-isoliert": { medium: 2, U: 40 },
    "gas-leuchtet": { medium: 2, U: 80 },
  },
  "el-10-gefahren-schutz": {
    "fi-rettet": { I: 100, t: 1, fi: 1 },
    "ohne-fi": { I: 100, t: 1, fi: 0 },
    harmlos: { I: 1, t: 1, fi: 0 },
  },
  // Etappe 6: Wahlbereich Akustik
  "ak-1-schall": {
    kammerton: { f: 440, A: 5 },
    ultraschall: { f: 25_000, A: 5 },
    laut: { f: 220, A: 9 },
  },
  "ak-2-ausbreitung": {
    gewitter: { v: 343, s: 1000 },
    "wasser-sekunde": { v: 1480, s: 1500 },
    "stahl-schnell": { v: 5100, s: 5000 },
  },
  // Etappe 7: Wahlbereich Astronomie
  "as-1-weltbilder": {
    rueckwaerts: { day: 0 },
    opposition: { day: 0 },
    "wieder-vorwaerts": { day: 100 },
  },
  "as-2-sonnensystem": {
    erde: { planet: 1, scale: 10 },
    neptun: { planet: 30.1, scale: 100 },
    jupiter: { planet: 5.2, scale: 10 },
  },
};
