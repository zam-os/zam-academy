import type { ModelKind } from "./model/types";
export interface ModelState {
  selected: string;
  values: Record<string, number>;
}
export interface Param {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Names of the settings when the values stand for a choice instead of a number. */
  options?: string[];
}
interface Scenario {
  id: string;
  label: string;
  values: Record<string, number>;
}

/**
 * Densities in g/cm³ after the table of OpenStax College Physics 2e,
 * section 11.2 (rounded); titanium and carbon-fibre plastic after the
 * German Wikipedia articles. Wood and granite vary from piece to piece.
 */
export interface Material {
  name: string;
  rho: number;
  /** Lowest and highest value where a material has no single density. */
  range?: [number, number];
}
export const MATERIALS: Material[] = [
  { name: "Holz (Fichte, Beispiel)", rho: 0.5, range: [0.3, 0.9] },
  { name: "Eis", rho: 0.92 },
  { name: "Aluminium", rho: 2.7 },
  { name: "Eisen", rho: 7.8 },
  { name: "Kupfer", rho: 8.8 },
  { name: "Blei", rho: 11.3 },
  { name: "Gold", rho: 19.3 },
];
/** The table learners compare a measured density with. */
export const TABLE: Material[] = [
  { name: "Aluminium", rho: 2.7 },
  { name: "Granit", rho: 2.7, range: [2.6, 2.8] },
  { name: "Eisen", rho: 7.8 },
  { name: "Messing", rho: 8.4 },
  { name: "Kupfer", rho: 8.8 },
  { name: "Silber", rho: 10.5 },
  { name: "Blei", rho: 11.3 },
  { name: "Gold", rho: 19.3 },
];
/** Samples for the measuring cylinder: true volume in cm³ and density. */
export const SAMPLES = [
  { name: "Schraube", material: "Eisen", volume: 8, rho: 7.8 },
  { name: "Anhänger", material: "Kupfer", volume: 6, rho: 8.8 },
  { name: "Bauteil", material: "Aluminium", volume: 15, rho: 2.7 },
];
export const SCALES = [1, 5];
/** Werkstoffe for a bike part; CFK is carbon-fibre reinforced plastic. */
export const BUILD_MATERIALS: Material[] = [
  { name: "Stahl", rho: 7.8 },
  { name: "Aluminium", rho: 2.7 },
  { name: "Titan", rho: 4.5 },
  { name: "CFK", rho: 1.5 },
];
/** Erkennungsweiten in m bei Dunkelheit nach ADAC und Stadt Zürich. */
export const CLOTHING = [
  { name: "dunkle Kleidung", range: 25 },
  { name: "helle Kleidung", range: 40 },
  { name: "Kleidung mit Reflektoren", range: 140 },
];
/** Anhalteweg bei einer Notbremsung aus 50 km/h nach ADAC, in m. */
export const STOPPING_50 = 28;
export const ELEMENTS = [
  { name: "Wasserstoff", protons: 1 },
  { name: "Helium", protons: 2 },
  { name: "Lithium", protons: 3 },
  { name: "Kohlenstoff", protons: 6 },
  { name: "Sauerstoff", protons: 8 },
];
/** The body that gains electrons is named first in "negative". */
export const RUB_PAIRS = [
  { body: "Luftballon", cloth: "Haare", bodyGains: true },
  { body: "Kunststoffstab", cloth: "Wolltuch", bodyGains: true },
  { body: "Glasstab", cloth: "Seidentuch", bodyGains: false },
];
export const GAP_MATERIALS = [
  { name: "Kupferdraht", conducts: true },
  { name: "Eisennagel", conducts: true },
  { name: "Bleistiftmine (Graphit)", conducts: true },
  { name: "Holzstäbchen", conducts: false },
  { name: "Kunststofflineal", conducts: false },
  { name: "Glasstab", conducts: false },
];
/** Bearings on the map in degrees from north. */
export const TARGETS = [
  { name: "Hütte", bearing: 45 },
  { name: "See", bearing: 180 },
  { name: "Gipfel", bearing: 315 },
];
const DIRECTIONS = [
  "Norden",
  "Nordosten",
  "Osten",
  "Südosten",
  "Süden",
  "Südwesten",
  "Westen",
  "Nordwesten",
];
export const directionName = (bearing: number): string =>
  DIRECTIONS[Math.round((((bearing % 360) + 360) % 360) / 45) % 8];

const yesNo = ["nein", "ja"];
export const PARAMS: Record<ModelKind, Param[]> = {
  einstrahlung: [p("h", "Winkel zwischen Lichtbündel und Fläche", 10, 90, 1, "°")],
  pole: [
    p("like", "Rechter Magnet zeigt nach links mit", 0, 1, 1, "", ["Südpol", "Nordpol"]),
    p("d", "Abstand der Pole", 1, 10, 1, "cm"),
    p("between", "Zwischen den Magneten", 0, 3, 1, "", ["Luft", "Papier", "Holzbrett", "Eisenblech"]),
  ],
  elementar: [
    p("material", "Stoff", 0, 1, 1, "", ["Stahlnadel", "Kupferdraht"]),
    p("strokes", "Striche mit dem Magneten", 0, 10, 1, ""),
    p("treat", "Danach", 0, 2, 1, "", ["nichts", "kräftig schlagen", "stark erhitzen"]),
    p("split", "Nadel", 0, 1, 1, "", ["ganz", "in der Mitte geteilt"]),
  ],
  kompass: [
    p("rot", "Drehung der Karte gegen Norden", 0, 345, 15, "°"),
    p("target", "Ziel", 0, 2, 1, "", TARGETS.map((t) => t.name)),
  ],
  dichte: [
    p("material", "Stoff", 0, MATERIALS.length - 1, 1, "", MATERIALS.map((m) => m.name)),
    p("V", "Volumen", 1, 60, 1, "cm³"),
  ],
  messzylinder: [
    p("sample", "Körper", 0, SAMPLES.length - 1, 1, "", SAMPLES.map((s) => s.name)),
    p("scale", "Skala des Messzylinders", 0, 1, 1, "", SCALES.map((s) => `${s}-ml-Teilung`)),
  ],
  werkstoff: [
    p("a", "Werkstoff A", 0, 3, 1, "", BUILD_MATERIALS.map((m) => m.name)),
    p("b", "Werkstoff B", 0, 3, 1, "", BUILD_MATERIALS.map((m) => m.name)),
    p("V", "Materialvolumen des Bauteils", 100, 1000, 50, "cm³"),
  ],
  sehen: [
    p("lamp", "Lampe", 0, 1, 1, "", ["aus", "an"]),
    p("wall1", "Schirm zwischen Lampe und Buch", 0, 1, 1, "", yesNo),
    p("wall2", "Schirm zwischen Buch und Auge", 0, 1, 1, "", yesNo),
  ],
  farbe: [
    p("light", "Licht", 0, 3, 1, "", ["weiß", "rot", "grün", "blau"]),
    p("object", "Gegenstand im weißen Licht", 0, 5, 1, "", ["weiß", "rot", "grün", "blau", "gelb", "schwarz"]),
  ],
  farbschatten: [
    p("r", "Rote Lampe", 0, 1, 1, "", ["aus", "an"]),
    p("g", "Grüne Lampe", 0, 1, 1, "", ["aus", "an"]),
    p("b", "Blaue Lampe", 0, 1, 1, "", ["aus", "an"]),
  ],
  schatten: [
    p("a", "Abstand Lampe – Gegenstand", 10, 90, 10, "cm"),
    p("g", "Größe des Gegenstands", 2, 10, 1, "cm"),
  ],
  halbschatten: [
    p("source", "Lichtquelle", 0, 1, 1, "", ["zwei kleine Lampen", "ausgedehnte Leuchte"]),
    p("d", "Abstand der Lampen", 2, 20, 2, "cm"),
    p("a", "Abstand Lampen – Gegenstand", 20, 80, 10, "cm"),
  ],
  mondphasen: [p("theta", "Stellung des Mondes auf seiner Bahn", 0, 315, 45, "°")],
  finsternis: [
    p("full", "Stellung", 0, 1, 1, "", ["Neumond", "Vollmond"]),
    p("offset", "Abstand des Mondes von der Erdbahnebene", -3, 3, 0.5, "Monddurchmesser"),
  ],
  sichtbarkeit: [
    p("cloth", "Kleidung", 0, 2, 1, "", CLOTHING.map((c) => c.name)),
    p("dist", "Abstand zum Auto", 10, 150, 5, "m"),
  ],
  atom: [
    p("element", "Atomart", 0, ELEMENTS.length - 1, 1, "", ELEMENTS.map((e) => e.name)),
    p("e", "Elektronen in der Hülle", 0, 10, 1, ""),
  ],
  reiben: [
    p("pair", "Reibpaar", 0, 2, 1, "", RUB_PAIRS.map((r) => `${r.body} und ${r.cloth}`)),
    p("rubs", "Reibbewegungen", 0, 10, 1, ""),
    p("test", "Angenähert wird", 0, 1, 1, "", ["Papierschnipsel", "ein zweiter, ebenso geriebener Körper"]),
  ],
  stromkreis: [
    p("switch", "Schalter", 0, 1, 1, "", ["offen", "geschlossen"]),
    p("gap", "In der Prüfstrecke", 0, GAP_MATERIALS.length - 1, 1, "", GAP_MATERIALS.map((g) => g.name)),
  ],
  spule: [
    p("on", "Strom", 0, 1, 1, "", ["aus", "an"]),
    p("dir", "Anschluss der Batterie", 0, 1, 1, "", ["wie gezeichnet", "umgepolt"]),
    p("n", "Windungen der Spule", 50, 400, 50, ""),
    p("core", "Eisenkern", 0, 1, 1, "", ["ohne", "mit"]),
  ],
  schaltung: [
    p("type", "Schaltung", 0, 2, 1, "", ["UND-Schaltung", "ODER-Schaltung", "Wechselschaltung"]),
    p("a", "Schalter A", 0, 1, 1, "", ["0", "1"]),
    p("b", "Schalter B", 0, 1, 1, "", ["0", "1"]),
  ],
};
function p(
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  unit: string,
  options?: string[],
): Param {
  return { key, label, min, max, step, unit, ...(options ? { options } : {}) };
}
function s(id: string, label: string, values: Record<string, number>): Scenario {
  return { id, label, values };
}
export const MODEL_SCENARIOS: Record<ModelKind, Scenario[]> = {
  einstrahlung: [
    s("steil", "Senkrecht von oben · 90°", { h: 90 }),
    s("sommer", "Sommermittag in München · 65°", { h: 65 }),
    s("winter", "Wintermittag in München · 18°", { h: 18 }),
  ],
  pole: [
    s("ungleich", "Ungleichnamige Pole · 2 cm", { like: 0, d: 2, between: 0 }),
    s("gleich", "Gleichnamige Pole · 2 cm", { like: 1, d: 2, between: 0 }),
    s("weit", "Ungleichnamige Pole · 8 cm", { like: 0, d: 8, between: 0 }),
    s("holz", "Holzbrett dazwischen", { like: 0, d: 2, between: 2 }),
    s("eisen", "Eisenblech dazwischen", { like: 0, d: 2, between: 3 }),
  ],
  elementar: [
    s("roh", "Unbehandelte Stahlnadel", { material: 0, strokes: 0, treat: 0, split: 0 }),
    s("magnetisiert", "Zehnmal bestrichen", { material: 0, strokes: 10, treat: 0, split: 0 }),
    s("geteilt", "Bestrichen und geteilt", { material: 0, strokes: 10, treat: 0, split: 1 }),
    s("erhitzt", "Bestrichen und stark erhitzt", { material: 0, strokes: 10, treat: 2, split: 0 }),
    s("kupfer", "Kupferdraht bestrichen", { material: 1, strokes: 10, treat: 0, split: 0 }),
  ],
  kompass: [
    s("verdreht", "Karte verdreht · Ziel Hütte", { rot: 90, target: 0 }),
    s("huette", "Karte eingenordet · Ziel Hütte", { rot: 0, target: 0 }),
    s("see", "Karte eingenordet · Ziel See", { rot: 0, target: 1 }),
  ],
  dichte: [
    s("alu1", "1 cm³ Aluminium", { material: 2, V: 1 }),
    s("alu10", "10 cm³ Aluminium", { material: 2, V: 10 }),
    s("gold10", "10 cm³ Gold", { material: 6, V: 10 }),
    s("eis10", "10 cm³ Eis", { material: 1, V: 10 }),
  ],
  messzylinder: [
    s("schraube1", "Schraube · 1-ml-Teilung", { sample: 0, scale: 0 }),
    s("anhaenger5", "Anhänger · 5-ml-Teilung", { sample: 1, scale: 1 }),
    s("anhaenger1", "Anhänger · 1-ml-Teilung", { sample: 1, scale: 0 }),
    s("bauteil1", "Bauteil · 1-ml-Teilung", { sample: 2, scale: 0 }),
  ],
  werkstoff: [
    s("stahl-alu", "Stahl gegen Aluminium", { a: 0, b: 1, V: 400 }),
    s("stahl-titan", "Stahl gegen Titan", { a: 0, b: 2, V: 400 }),
    s("alu-cfk", "Aluminium gegen CFK", { a: 1, b: 3, V: 400 }),
  ],
  sehen: [
    s("aus", "Lampe aus", { lamp: 0, wall1: 0, wall2: 0 }),
    s("an", "Lampe an", { lamp: 1, wall1: 0, wall2: 0 }),
    s("schirm1", "Schirm vor dem Buch", { lamp: 1, wall1: 1, wall2: 0 }),
    s("schirm2", "Schirm vor dem Auge", { lamp: 1, wall1: 0, wall2: 1 }),
  ],
  farbe: [
    s("paprika-weiss", "Rote Paprika im weißen Licht", { light: 0, object: 1 }),
    s("paprika-gruen", "Rote Paprika im grünen Licht", { light: 2, object: 1 }),
    s("shirt-rot", "Gelbes Shirt im roten Licht", { light: 1, object: 4 }),
    s("blatt-blau", "Weißes Blatt im blauen Licht", { light: 3, object: 0 }),
  ],
  farbschatten: [
    s("rot", "Nur die rote Lampe", { r: 1, g: 0, b: 0 }),
    s("rotgruen", "Rot und Grün", { r: 1, g: 1, b: 0 }),
    s("alle", "Rot, Grün und Blau", { r: 1, g: 1, b: 1 }),
  ],
  schatten: [
    s("nah", "Gegenstand nahe an der Lampe", { a: 20, g: 4 }),
    s("mitte", "Gegenstand in der Mitte", { a: 50, g: 4 }),
    s("fern", "Gegenstand nahe am Schirm", { a: 80, g: 4 }),
  ],
  halbschatten: [
    s("eng", "Zwei Lampen dicht beieinander", { source: 0, d: 4, a: 50 }),
    s("weit", "Zwei Lampen weit auseinander", { source: 0, d: 16, a: 50 }),
    s("schirm", "Gegenstand nahe am Schirm", { source: 0, d: 8, a: 80 }),
    s("leuchte", "Ausgedehnte Leuchte", { source: 1, d: 8, a: 50 }),
  ],
  mondphasen: [
    s("neu", "Neumond", { theta: 0 }),
    s("zunehmend", "Zunehmender Halbmond", { theta: 90 }),
    s("voll", "Vollmond", { theta: 180 }),
    s("abnehmend", "Abnehmender Halbmond", { theta: 270 }),
  ],
  finsternis: [
    s("sofi", "Neumond in der Erdbahnebene", { full: 0, offset: 0 }),
    s("keine", "Neumond oberhalb der Ebene", { full: 0, offset: 3 }),
    s("mofi", "Vollmond in der Erdbahnebene", { full: 1, offset: 0 }),
    s("partiell", "Vollmond knapp unterhalb", { full: 1, offset: -1.5 }),
  ],
  sichtbarkeit: [
    s("dunkel-60", "Dunkle Kleidung · 60 m", { cloth: 0, dist: 60 }),
    s("dunkel-25", "Dunkle Kleidung · 25 m", { cloth: 0, dist: 25 }),
    s("hell-40", "Helle Kleidung · 40 m", { cloth: 1, dist: 40 }),
    s("reflektor-120", "Reflektoren · 120 m", { cloth: 2, dist: 120 }),
  ],
  atom: [
    s("neutral", "Neutrales Lithiumatom", { element: 2, e: 3 }),
    s("abgegeben", "Lithium gibt ein Elektron ab", { element: 2, e: 2 }),
    s("aufgenommen", "Sauerstoff nimmt zwei Elektronen auf", { element: 4, e: 10 }),
  ],
  reiben: [
    s("ungerieben", "Ungeriebener Luftballon", { pair: 0, rubs: 0, test: 0 }),
    s("ballon", "Ballon an den Haaren gerieben", { pair: 0, rubs: 6, test: 0 }),
    s("zwei", "Zwei geriebene Ballons", { pair: 0, rubs: 6, test: 1 }),
    s("glas", "Glasstab mit Seide gerieben", { pair: 2, rubs: 6, test: 0 }),
  ],
  stromkreis: [
    s("offen", "Schalter offen", { switch: 0, gap: 0 }),
    s("kupfer", "Geschlossen · Kupferdraht", { switch: 1, gap: 0 }),
    s("kunststoff", "Geschlossen · Kunststofflineal", { switch: 1, gap: 4 }),
    s("graphit", "Geschlossen · Bleistiftmine", { switch: 1, gap: 2 }),
  ],
  spule: [
    s("aus", "Strom aus", { on: 0, dir: 0, n: 200, core: 0 }),
    s("an", "Strom an, ohne Eisenkern", { on: 1, dir: 0, n: 200, core: 0 }),
    s("kern", "Strom an, mit Eisenkern", { on: 1, dir: 0, n: 200, core: 1 }),
    s("umgepolt", "Umgepolt, mit Eisenkern", { on: 1, dir: 1, n: 200, core: 1 }),
  ],
  schaltung: [
    s("und", "UND · nur A geschlossen", { type: 0, a: 1, b: 0 }),
    s("oder", "ODER · nur A geschlossen", { type: 1, a: 1, b: 0 }),
    s("treppe-an", "Wechsel · unten eingeschaltet", { type: 2, a: 1, b: 1 }),
    s("treppe-aus", "Wechsel · oben ausgeschaltet", { type: 2, a: 1, b: 0 }),
  ],
};
export function initialModelState(): ModelState {
  return { selected: "", values: {} };
}
export function modelValues(
  kind: ModelKind,
  state: ModelState,
): Record<string, number> {
  return { ...MODEL_SCENARIOS[kind][0].values, ...state.values };
}
export function applyScenario(
  kind: ModelKind,
  state: ModelState,
  id: string,
): ModelState {
  const scenario = MODEL_SCENARIOS[kind].find((x) => x.id === id);
  return scenario
    ? { selected: id, values: { ...scenario.values } }
    : { ...state, values: { ...state.values } };
}
export function recordExploration(
  kind: ModelKind,
  seen: string[],
  id: string,
): string[] {
  return [
    ...new Set(
      [...seen, id].filter((x) =>
        MODEL_SCENARIOS[kind].some((sc) => sc.id === x),
      ),
    ),
  ];
}
export const modelReady = (kind: ModelKind, seen: string[]): boolean =>
  MODEL_SCENARIOS[kind].every((sc) => seen.includes(sc.id));
export function setModelValue(
  kind: ModelKind,
  state: ModelState,
  key: string,
  value: number,
): ModelState {
  const param = PARAMS[kind].find((x) => x.key === key);
  if (
    !param ||
    !Number.isFinite(value) ||
    value < param.min - 1e-9 ||
    value > param.max + 1e-9
  )
    return state;
  const steps = Math.round((value - param.min) / param.step);
  if (Math.abs(param.min + steps * param.step - value) > 1e-7) return state;
  return {
    selected: "",
    values: { ...modelValues(kind, state), [key]: value },
  };
}

/** Deterministic noise in [−1; 1] for reproducible drawings. */
export function pseudoNoise(index: number, seed = 7): number {
  let state = (Math.imul(index + 1, 2654435761) ^ Math.imul(seed, 40503)) >>> 0;
  state = (Math.imul(state ^ (state >>> 15), 2246822519) ^ (state >>> 13)) >>> 0;
  return (state / 4294967295) * 2 - 1;
}

const RAD = Math.PI / 180;

/** The same light bundle on a tilted surface: share per area and size of the spot. */
export function irradiation(degrees: number) {
  const share = Math.sin(degrees * RAD);
  return { share, area: 1 / share };
}

/** Two bar magnets: unlike poles attract, like poles repel; iron in between screens. */
export function poles(like: number, d: number, between: number) {
  const screened = between === 3,
    strength = (100 / (d * d)) * (screened ? 0.05 : 1),
    kind =
      strength < 2
        ? "kaum spürbar"
        : like === 1
          ? "Abstoßung"
          : "Anziehung";
  return { strength, kind, screened };
}

/**
 * The share of ordered Elementarmagnete. Each stroke orders a part of the
 * rest; a hard blow shakes most of them back, strong heating all of them.
 * Copper has no Elementarmagnete in this model.
 */
export function ordering(material: number, strokes: number, treat: number) {
  if (material === 1) return 0;
  const ordered = 1 - 0.8 ** strokes;
  return treat === 2 ? 0 : treat === 1 ? ordered * 0.3 : ordered;
}
/** How many paper clips the needle holds in the model. */
export const clipsHeld = (order: number, split: number): number =>
  Math.floor(order * (split ? 4 : 6) + 1e-9);

/** Map and compass: the map is oriented when its north matches the needle. */
export function compass(rot: number, target: number) {
  const offset = Math.min(rot % 360, 360 - (rot % 360)) % 360,
    goal = TARGETS[target];
  return {
    oriented: offset === 0,
    offset,
    bearing: goal.bearing,
    direction: directionName(goal.bearing),
    name: goal.name,
  };
}

export function density(material: number, V: number) {
  const m = MATERIALS[material];
  return { mass: m.rho * V, rho: m.rho, name: m.name };
}

/**
 * Differenzmethode with water up to the 50-ml mark. The second level is
 * read to the nearest mark, so the volume is uncertain by half a division.
 */
export function measurement(sample: number, scale: number) {
  const body = SAMPLES[sample],
    step = SCALES[scale],
    mass = Math.round(body.rho * body.volume * 10) / 10,
    v1 = 50,
    v2 = Math.round((v1 + body.volume) / step) * step,
    volume = v2 - v1,
    vMin = Math.max(volume - step / 2, 0.1),
    vMax = volume + step / 2,
    rhoMin = mass / vMax,
    rhoMax = mass / vMin,
    matches = TABLE.filter((t) => {
      const [lo, hi] = t.range ?? [t.rho, t.rho];
      return hi >= rhoMin && lo <= rhoMax;
    }).map((t) => t.name);
  return {
    name: body.name,
    mass,
    v1,
    v2,
    volume,
    step,
    rho: volume > 0 ? mass / volume : Number.POSITIVE_INFINITY,
    rhoMin,
    rhoMax,
    matches,
  };
}

/** Masses of the same part in two Werkstoffe, in kg. */
export function compareMaterials(a: number, b: number, V: number) {
  const ma = (BUILD_MATERIALS[a].rho * V) / 1000,
    mb = (BUILD_MATERIALS[b].rho * V) / 1000;
  return { ma, mb, difference: ma - mb, ratio: ma / mb };
}

/** We see the book only when light from it reaches the eye. */
export function seeing(lamp: number, wall1: number, wall2: number) {
  const lit = lamp === 1 && wall1 === 0;
  return { lit, seesBook: lit && wall2 === 0, seesLamp: lamp === 1 };
}

/** Red, green and blue parts of light as bits: 1, 2, 4. */
const LIGHTS = [7, 1, 2, 4];
const OBJECTS = [7, 1, 2, 4, 3, 0];
export const COLOUR_NAMES: Record<number, string> = {
  0: "schwarz",
  1: "rot",
  2: "grün",
  3: "gelb",
  4: "blau",
  5: "purpur",
  6: "türkis",
  7: "weiß",
};
export const COLOUR_HEX: Record<number, string> = {
  0: "#111111",
  1: "#e0312b",
  2: "#22a447",
  3: "#f2c418",
  4: "#2c5fe0",
  5: "#c33bd0",
  6: "#22b8c9",
  7: "#ffffff",
};
export function bodyColour(light: number, object: number) {
  const incoming = LIGHTS[light],
    reflects = OBJECTS[object],
    seen = incoming & reflects,
    absorbed = incoming & ~reflects & 7;
  return { incoming, reflects, seen, absorbed, name: COLOUR_NAMES[seen] };
}

/** Coloured shadows: the wall gets every lamp, each shadow all lamps but one. */
export function colouredShadows(r: number, g: number, b: number) {
  const lamps = [r ? 1 : 0, g ? 2 : 0, b ? 4 : 0],
    wall = lamps[0] | lamps[1] | lamps[2];
  return {
    wall,
    shadows: lamps
      .filter((bit) => bit !== 0)
      .map((bit) => ({ lamp: bit, colour: wall & ~bit })),
  };
}

/** A point lamp, the object a cm away, the screen 100 cm away. */
export const SCREEN = 100;
export function shadowSize(a: number, g: number) {
  return { size: (g * SCREEN) / a, factor: SCREEN / a };
}

/** Two lamps (or the ends of a lamp) d cm apart; an object of 6 cm width a cm away. */
export const OBJECT_WIDTH = 6;
export function penumbra(d: number, a: number) {
  const k = SCREEN / a,
    each = OBJECT_WIDTH * k,
    centre = (d / 2) * (k - 1),
    core = Math.max(0, each - 2 * centre),
    total = each + 2 * centre,
    gap = Math.max(0, 2 * centre - each);
  return { core, total, half: (total - core - gap) / 2, gap, each };
}

/** Moon at angle theta from the direction of the sun (0 = new moon). */
export const SYNODIC_DAYS = 29.5;
export function moonPhase(theta: number) {
  const t = ((theta % 360) + 360) % 360,
    lit = (1 - Math.cos(t * RAD)) / 2,
    names: Record<number, string> = {
      0: "Neumond",
      45: "zunehmende Sichel",
      90: "zunehmender Halbmond",
      135: "zunehmender Mond",
      180: "Vollmond",
      225: "abnehmender Mond",
      270: "abnehmender Halbmond",
      315: "abnehmende Sichel",
    };
  return {
    lit,
    name: names[t] ?? "",
    days: (t / 360) * SYNODIC_DAYS,
    waxing: t > 0 && t < 180,
  };
}

/**
 * Eclipses near a node of the lunar orbit, in Monddurchmessern. Earth's
 * radius is about 1,8 of them; Earth's core shadow at the Moon about 2,6
 * across, its half shadow about 4,6. Schematic thresholds, see the lesson.
 */
export function eclipse(full: number, offset: number) {
  const o = Math.abs(offset);
  if (full === 0)
    return o <= 1.5
      ? { kind: "totale Sonnenfinsternis", where: "nur in einem schmalen Streifen auf der Tagseite der Erde" }
      : o <= 2.5
        ? { kind: "partielle Sonnenfinsternis", where: "nur in einem Teil der Tagseite der Erde" }
        : { kind: "keine Finsternis", where: "Der Mondschatten verfehlt die Erde." };
  return o <= 0.5
    ? { kind: "totale Mondfinsternis", where: "auf der ganzen Nachtseite der Erde" }
    : o <= 1.5
      ? { kind: "partielle Mondfinsternis", where: "auf der ganzen Nachtseite der Erde" }
      : o <= 2.5
        ? { kind: "Halbschattenfinsternis", where: "Der Mond wird nur schwach dunkler." }
        : { kind: "keine Finsternis", where: "Der Mond zieht am Erdschatten vorbei." };
}

/** Does the driver recognise the person, and early enough to stop from 50 km/h? */
export function visibility(cloth: number, dist: number) {
  const range = CLOTHING[cloth].range;
  return { range, seen: dist <= range, inTime: range > STOPPING_50 };
}

export function atomCharge(element: number, electrons: number) {
  const protons = ELEMENTS[element].protons,
    charge = protons - electrons;
  return {
    protons,
    charge,
    state:
      charge === 0 ? "elektrisch neutral" : charge > 0 ? "positiv geladen" : "negativ geladen",
  };
}

/** Rubbing moves electrons from one body to the other; 3 per stroke in the model. */
export function rubbing(pair: number, rubs: number, test: number) {
  const moved = 3 * rubs,
    rule = RUB_PAIRS[pair],
    body = rule.bodyGains ? -moved : moved;
  return {
    moved,
    body,
    cloth: -body,
    effect:
      moved === 0
        ? "keine Wirkung"
        : test === 0
          ? "Anziehung"
          : "Abstoßung",
  };
}

export function circuit(closed: number, gap: number) {
  const conducts = GAP_MATERIALS[gap].conducts;
  return { conducts, flowing: closed === 1 && conducts };
}

/** Coil: the end on the right becomes a north pole when connected as drawn. */
export function coil(on: number, dir: number, n: number, core: number) {
  const nails = on ? Math.floor((n / 50) * (core ? 1.5 : 0.25) + 1e-9) : 0;
  return {
    magnetic: on === 1,
    rightPole: on ? (dir === 0 ? "Nordpol" : "Südpol") : "kein Pol",
    nails,
  };
}

/** Lamp of a UND (series), ODER (parallel) or Wechselschaltung (staircase). */
export function switching(type: number, a: number, b: number): boolean {
  return type === 0 ? a === 1 && b === 1 : type === 1 ? a === 1 || b === 1 : a === b;
}
