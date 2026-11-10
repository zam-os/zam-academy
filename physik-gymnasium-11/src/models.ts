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
}
interface Scenario {
  id: string;
  label: string;
  values: Record<string, number>;
}
/** Gravitationskonstante in m³/(kg·s²). */
export const G = 6.674e-11;
/** Fallbeschleunigung an der Erdoberfläche in m/s². */
export const G_EARTH = 9.81;
export const EARTH_MASS = 5.972e24;
export const EARTH_RADIUS = 6.371e6;
/** Lichtgeschwindigkeit in m/s. */
export const C = 2.998e8;
/** Mittlere Lebensdauer eines ruhenden Myons in s. */
export const MUON_TAU = 2.2e-6;
/** Fallbeschleunigungen für das Fadenpendel: Erde, Mond, Mars. */
export const PLACES = [
  { name: "Erde", g: 9.81 },
  { name: "Mond", g: 1.62 },
  { name: "Mars", g: 3.71 },
];
/** Frei gewählte Beispielbewertungen (1 schwach … 5 stark) für die Nutzwertanalyse. */
export const UTILITY_OPTIONS = [
  { name: "Windpark mit Speicher", scores: [3, 5, 3] },
  { name: "Gaskraftwerk", scores: [5, 2, 4] },
];
export const UTILITY_CRITERIA = [
  "Versorgungssicherheit",
  "Klima und Umwelt",
  "Kosten",
];
export const PARAMS: Record<ModelKind, Param[]> = {
  circular: [
    p("r", "Bahnradius", 0.5, 10, 0.5, "m"),
    p("T", "Umlaufdauer", 0.5, 10, 0.5, "s"),
  ],
  centripetal: [
    p("m", "Masse", 0.1, 2, 0.1, "kg"),
    p("v", "Bahngeschwindigkeit", 1, 10, 1, "m/s"),
    p("r", "Bahnradius", 0.5, 5, 0.5, "m"),
  ],
  centriexp: [
    p("vary", "Variierte Größe: 0 Masse · 1 Radius · 2 Winkelgeschw.", 0, 2, 1, ""),
    p("noise", "Messabweichung", 0, 5, 1, "%"),
  ],
  curve: [
    p("v", "Geschwindigkeit", 30, 130, 10, "km/h"),
    p("r", "Kurvenradius", 20, 200, 20, "m"),
    p("mu", "Haftreibungszahl", 0.1, 1, 0.1, ""),
    p("m", "Fahrzeugmasse", 800, 2000, 200, "kg"),
  ],
  gravity: [
    p("m", "Masse des Körpers", 1, 100, 1, "kg"),
    p("n", "Abstand vom Erdmittelpunkt in Erdradien", 1, 10, 1, ""),
  ],
  orbit: [p("h", "Bahnhöhe über der Erdoberfläche", 200, 36000, 200, "km")],
  oscillation: [
    p("A", "Amplitude", 1, 10, 1, "cm"),
    p("T", "Periodendauer", 0.5, 4, 0.5, "s"),
    p("t", "Zeitpunkt", 0, 8, 0.25, "s"),
  ],
  spring: [
    p("m", "Masse", 0.1, 1, 0.1, "kg"),
    p("D", "Federhärte", 5, 50, 5, "N/m"),
    p("A", "Amplitude", 2, 10, 2, "cm"),
  ],
  pendulum: [
    p("l", "Pendellänge", 0.1, 2, 0.1, "m"),
    p("m", "Masse des Pendelkörpers", 0.1, 1, 0.1, "kg"),
    p("ort", "Ort: 0 Erde · 1 Mond · 2 Mars", 0, 2, 1, ""),
  ],
  uncertainty: [
    p("n", "Anzahl der Messungen", 3, 10, 1, ""),
    p("periods", "Gestoppte Schwingungen je Messung", 1, 20, 1, ""),
    p("spread", "Streuung beim Stoppen", 0.05, 0.3, 0.05, "s"),
  ],
  wave: [
    p("lambda", "Wellenlänge", 0.5, 4, 0.5, "m"),
    p("f", "Frequenz", 0.5, 5, 0.5, "Hz"),
    p("A", "Amplitude", 1, 5, 1, "cm"),
  ],
  superposition: [
    p("a1", "Amplitude der Welle 1", 1, 5, 1, "cm"),
    p("a2", "Amplitude der Welle 2", 1, 5, 1, "cm"),
    p("shift", "Gangunterschied in Wellenlängen", 0, 1, 0.125, "λ"),
  ],
  interference: [
    p("s1", "Weg vom Zentrum 1", 1, 10, 0.25, "m"),
    p("s2", "Weg vom Zentrum 2", 1, 10, 0.25, "m"),
    p("lambda", "Wellenlänge", 0.5, 2, 0.5, "m"),
  ],
  standing: [
    p("L", "Länge des Wellenträgers", 0.5, 2, 0.25, "m"),
    p("n", "Anzahl der Schwingungsbäuche", 1, 5, 1, ""),
    p("c", "Ausbreitungsgeschwindigkeit", 100, 400, 50, "m/s"),
  ],
  doubleslit: [
    p("lambda", "Wellenlänge", 400, 700, 50, "nm"),
    p("b", "Abstand der Spalte", 0.1, 0.5, 0.1, "mm"),
    p("a", "Abstand zum Schirm", 1, 5, 1, "m"),
  ],
  kepler: [
    p("a", "Große Halbachse", 0.5, 30, 0.5, "AE"),
    p("e", "Numerische Exzentrizität", 0, 0.9, 0.1, ""),
  ],
  hubble: [
    p("d", "Entfernung der Galaxie", 10, 1000, 10, "Mpc"),
    p("h0", "Hubble-Konstante", 60, 80, 5, "km/(s·Mpc)"),
  ],
  frames: [
    p("beta", "Geschwindigkeit des Zuges in c", 0, 0.9, 0.1, "c"),
    p("obj", "Im Zug nach vorn gesendet: 0 Lichtblitz · 1 Körper mit 0,5 c", 0, 1, 1, ""),
  ],
  lorentz: [
    p("beta", "Geschwindigkeit in c", 0, 0.95, 0.05, "c"),
    p("t0", "Eigenzeit der bewegten Uhr", 1, 10, 1, "s"),
  ],
  muon: [
    p("beta", "Geschwindigkeit der Myonen in c", 0.9, 0.995, 0.005, "c"),
    p("h", "Entstehungshöhe", 5, 20, 5, "km"),
  ],
  chain: [
    p("e1", "Wirkungsgrad Kraftwerk", 10, 100, 5, "%"),
    p("e2", "Wirkungsgrad Übertragung", 10, 100, 5, "%"),
    p("e3", "Wirkungsgrad Gerät", 5, 100, 5, "%"),
  ],
  utility: [
    p("w1", "Gewicht Versorgungssicherheit", 0, 10, 1, ""),
    p("w2", "Gewicht Klima und Umwelt", 0, 10, 1, ""),
    p("w3", "Gewicht Kosten", 0, 10, 1, ""),
  ],
  saving: [
    p("pOld", "Leistung bisher", 10, 100, 10, "W"),
    p("pNew", "Leistung neu", 2, 20, 2, "W"),
    p("h", "Betriebsdauer pro Tag", 1, 24, 1, "h"),
    p("price", "Strompreis", 20, 50, 5, "ct/kWh"),
  ],
  euler: [
    p("dt", "Zeitschritt Δt", 0.1, 1, 0.1, "s"),
    p("k", "Luftwiderstandsbeiwert k", 0, 0.5, 0.05, "kg/m"),
  ],
  airfall: [
    p("m", "Masse", 10, 100, 10, "kg"),
    p("k", "Luftwiderstandsbeiwert k", 0, 0.5, 0.1, "kg/m"),
    p("dt", "Zeitschritt Δt", 0.1, 1, 0.1, "s"),
  ],
  eulerosc: [
    p("m", "Masse", 0.1, 1, 0.1, "kg"),
    p("D", "Federhärte", 5, 50, 5, "N/m"),
    p("dt", "Zeitschritt Δt", 0.01, 0.08, 0.01, "s"),
  ],
  solar: [
    p("irr", "Bestrahlungsstärke", 200, 1000, 200, "W/m²"),
    p("r", "Lastwiderstand", 0.2, 5, 0.2, "Ω"),
  ],
  pvplant: [
    p("kwp", "Installierte Leistung", 2, 15, 1, "kWp"),
    p("spec", "Spezifischer Jahresertrag", 800, 1100, 50, "kWh/kWp"),
    p("self", "Eigenverbrauchsanteil", 10, 80, 10, "%"),
    p("price", "Strompreis", 25, 45, 5, "ct/kWh"),
  ],
  ride: [
    p("r", "Bahnradius", 2, 20, 1, "m"),
    p("T", "Umlaufdauer", 2, 20, 1, "s"),
  ],
  chaos: [
    p("r", "Wachstumsparameter r", 2.5, 4, 0.1, ""),
    p("x0", "Startwert x₀", 0.1, 0.9, 0.1, ""),
    p("d", "Abweichung des zweiten Startwerts in Tausendsteln", 1, 10, 1, ""),
  ],
};
function p(
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  unit: string,
): Param {
  return { key, label, min, max, step, unit };
}
function s(
  id: string,
  label: string,
  values: Record<string, number>,
): Scenario {
  return { id, label, values };
}
export const MODEL_SCENARIOS: Record<ModelKind, Scenario[]> = {
  circular: [
    s("base", "Ausgangsbahn", { r: 2, T: 4 }),
    s("fast", "Halbe Umlaufdauer", { r: 2, T: 2 }),
    s("wide", "Doppelter Radius", { r: 4, T: 4 }),
  ],
  centripetal: [
    s("base", "Ausgangswerte", { m: 0.5, v: 4, r: 2 }),
    s("speed", "Doppelte Geschwindigkeit", { m: 0.5, v: 8, r: 2 }),
    s("radius", "Doppelter Radius", { m: 0.5, v: 4, r: 4 }),
    s("mass", "Doppelte Masse", { m: 1, v: 4, r: 2 }),
  ],
  centriexp: [
    s("mass", "Masse variieren", { vary: 0, noise: 2 }),
    s("radius", "Radius variieren", { vary: 1, noise: 2 }),
    s("omega", "Winkelgeschwindigkeit variieren", { vary: 2, noise: 2 }),
    s("ideal", "Ohne Messabweichung", { vary: 2, noise: 0 }),
  ],
  curve: [
    s("dry", "Trockene Fahrbahn", { v: 70, r: 80, mu: 0.8, m: 1200 }),
    s("wet", "Nasse Fahrbahn", { v: 70, r: 80, mu: 0.5, m: 1200 }),
    s("ice", "Glatteis", { v: 70, r: 80, mu: 0.1, m: 1200 }),
    s("tight", "Engere Kurve, trocken", { v: 70, r: 40, mu: 0.8, m: 1200 }),
  ],
  gravity: [
    s("surface", "An der Erdoberfläche", { m: 70, n: 1 }),
    s("double", "Doppelter Abstand", { m: 70, n: 2 }),
    s("triple", "Dreifacher Abstand", { m: 70, n: 3 }),
    s("far", "Zehnfacher Abstand", { m: 70, n: 10 }),
  ],
  orbit: [
    s("iss", "Raumstation · 400 km", { h: 400 }),
    s("nav", "Navigationssatellit · 20 200 km", { h: 20200 }),
    s("geo", "Geostationär · 35 800 km", { h: 35800 }),
  ],
  oscillation: [
    s("base", "Ausgangsschwingung", { A: 4, T: 2, t: 0.5 }),
    s("amplitude", "Doppelte Amplitude", { A: 8, T: 2, t: 0.5 }),
    s("period", "Doppelte Periodendauer", { A: 4, T: 4, t: 0.5 }),
  ],
  spring: [
    s("base", "Ausgangspendel", { m: 0.2, D: 20, A: 4 }),
    s("heavy", "Vierfache Masse", { m: 0.8, D: 20, A: 4 }),
    s("soft", "Viertel der Federhärte", { m: 0.2, D: 5, A: 4 }),
    s("wide", "Doppelte Amplitude", { m: 0.2, D: 20, A: 8 }),
  ],
  pendulum: [
    s("base", "Ausgangspendel", { l: 0.5, m: 0.2, ort: 0 }),
    s("long", "Vierfache Länge", { l: 2, m: 0.2, ort: 0 }),
    s("heavy", "Vierfache Masse", { l: 0.5, m: 0.8, ort: 0 }),
    s("moon", "Auf dem Mond", { l: 0.5, m: 0.2, ort: 1 }),
  ],
  uncertainty: [
    s("single", "Je eine Schwingung gestoppt", { n: 5, periods: 1, spread: 0.2 }),
    s("ten", "Je zehn Schwingungen gestoppt", { n: 5, periods: 10, spread: 0.2 }),
    s("many", "Zehn Messungen zu je zehn", { n: 10, periods: 10, spread: 0.2 }),
  ],
  wave: [
    s("base", "Ausgangswelle", { lambda: 2, f: 1, A: 2 }),
    s("frequency", "Gleicher Träger, doppelte Frequenz", { lambda: 1, f: 2, A: 2 }),
    s("medium", "Anderer Träger, gleiche Frequenz", { lambda: 4, f: 1, A: 2 }),
  ],
  superposition: [
    s("phase", "Gleichphasig", { a1: 3, a2: 3, shift: 0 }),
    s("anti", "Gegenphasig, gleiche Amplituden", { a1: 3, a2: 3, shift: 0.5 }),
    s("unequal", "Gegenphasig, ungleiche Amplituden", { a1: 3, a2: 1, shift: 0.5 }),
    s("quarter", "Viertel Wellenlänge versetzt", { a1: 3, a2: 3, shift: 0.25 }),
  ],
  interference: [
    s("zero", "Gleiche Wege", { s1: 4, s2: 4, lambda: 1 }),
    s("full", "Eine Wellenlänge Unterschied", { s1: 4, s2: 5, lambda: 1 }),
    s("half", "Halbe Wellenlänge Unterschied", { s1: 4, s2: 4.5, lambda: 1 }),
    s("threehalf", "Anderthalb Wellenlängen", { s1: 4, s2: 5.5, lambda: 1 }),
  ],
  standing: [
    s("first", "Grundschwingung", { L: 1, n: 1, c: 200 }),
    s("second", "Erste Oberschwingung", { L: 1, n: 2, c: 200 }),
    s("third", "Zweite Oberschwingung", { L: 1, n: 3, c: 200 }),
    s("short", "Halbe Länge", { L: 0.5, n: 1, c: 200 }),
  ],
  doubleslit: [
    s("red", "Rotes Licht", { lambda: 650, b: 0.2, a: 2 }),
    s("green", "Grünes Licht", { lambda: 550, b: 0.2, a: 2 }),
    s("blue", "Blaues Licht", { lambda: 450, b: 0.2, a: 2 }),
    s("narrow", "Rot, halber Spaltabstand", { lambda: 650, b: 0.1, a: 2 }),
  ],
  kepler: [
    s("earth", "Erde · Kreisbahn", { a: 1, e: 0 }),
    s("mars", "Mars (gerundet)", { a: 1.5, e: 0.1 }),
    s("jupiter", "Jupiter (gerundet)", { a: 5, e: 0 }),
    s("comet", "Komet mit gestreckter Ellipse", { a: 18, e: 0.9 }),
  ],
  hubble: [
    s("near", "100 Mpc entfernt", { d: 100, h0: 70 }),
    s("double", "200 Mpc entfernt", { d: 200, h0: 70 }),
    s("far", "1000 Mpc entfernt", { d: 1000, h0: 70 }),
  ],
  frames: [
    s("rest", "Zug steht · Lichtblitz", { beta: 0, obj: 0 }),
    s("light", "Zug mit 0,5 c · Lichtblitz", { beta: 0.5, obj: 0 }),
    s("lightfast", "Zug mit 0,9 c · Lichtblitz", { beta: 0.9, obj: 0 }),
    s("body", "Zug mit 0,5 c · Körper", { beta: 0.5, obj: 1 }),
  ],
  lorentz: [
    s("slow", "10 % der Lichtgeschwindigkeit", { beta: 0.1, t0: 1 }),
    s("sixty", "60 %", { beta: 0.6, t0: 1 }),
    s("eighty", "80 %", { beta: 0.8, t0: 1 }),
    s("fast", "95 %", { beta: 0.95, t0: 1 }),
  ],
  muon: [
    s("slow", "0,9 c", { beta: 0.9, h: 10 }),
    s("fast", "0,99 c", { beta: 0.99, h: 10 }),
    s("faster", "0,995 c", { beta: 0.995, h: 10 }),
    s("high", "0,995 c aus 15 km", { beta: 0.995, h: 15 }),
  ],
  chain: [
    s("bulb", "Wärmekraftwerk und Glühlampe", { e1: 40, e2: 95, e3: 5 }),
    s("led", "Wärmekraftwerk und LED", { e1: 40, e2: 95, e3: 40 }),
    s("ideal", "Gedankenexperiment ohne Entwertung", { e1: 100, e2: 100, e3: 100 }),
  ],
  utility: [
    s("equal", "Alle Kriterien gleich wichtig", { w1: 5, w2: 5, w3: 5 }),
    s("climate", "Klima besonders wichtig", { w1: 3, w2: 9, w3: 3 }),
    s("security", "Versorgungssicherheit besonders wichtig", { w1: 9, w2: 2, w3: 4 }),
  ],
  saving: [
    s("lamp", "Lampe · 3 h täglich", { pOld: 60, pNew: 8, h: 3, price: 35 }),
    s("long", "Lampe · 8 h täglich", { pOld: 60, pNew: 8, h: 8, price: 35 }),
    s("standby", "Bereitschaftsbetrieb · 24 h", { pOld: 10, pNew: 2, h: 24, price: 35 }),
  ],
  euler: [
    s("free", "Ohne Luftwiderstand", { dt: 0.5, k: 0 }),
    s("drag", "Mit Luftwiderstand", { dt: 0.5, k: 0.2 }),
    s("fine", "Mit Luftwiderstand, kleiner Schritt", { dt: 0.1, k: 0.2 }),
  ],
  airfall: [
    s("heavy", "80 kg", { m: 80, k: 0.3, dt: 0.1 }),
    s("light", "20 kg", { m: 20, k: 0.3, dt: 0.1 }),
    s("coarse", "80 kg, grober Zeitschritt", { m: 80, k: 0.3, dt: 1 }),
    s("free", "Ohne Luftwiderstand", { m: 80, k: 0, dt: 0.1 }),
  ],
  eulerosc: [
    s("base", "Ausgangssimulation", { m: 0.2, D: 20, dt: 0.01 }),
    s("heavy", "Vierfache Masse", { m: 0.8, D: 20, dt: 0.01 }),
    s("soft", "Viertel der Federhärte", { m: 0.2, D: 5, dt: 0.01 }),
    s("coarse", "Grober Zeitschritt", { m: 0.2, D: 20, dt: 0.08 }),
  ],
  solar: [
    s("short", "Kleiner Lastwiderstand", { irr: 1000, r: 0.2 }),
    s("match", "Nahe am MPP", { irr: 1000, r: 1 }),
    s("open", "Großer Lastwiderstand", { irr: 1000, r: 5 }),
    s("dim", "Schwächere Bestrahlung", { irr: 400, r: 1 }),
  ],
  pvplant: [
    s("base", "Dachanlage", { kwp: 8, spec: 1000, self: 30, price: 35 }),
    s("storage", "Mit Speicher: mehr Eigenverbrauch", { kwp: 8, spec: 1000, self: 60, price: 35 }),
    s("north", "Ungünstigere Ausrichtung", { kwp: 8, spec: 800, self: 30, price: 35 }),
  ],
  ride: [
    s("swing", "Kettenkarussell", { r: 8, T: 6 }),
    s("fast", "Schnellere Drehung", { r: 8, T: 4 }),
    s("wheel", "Riesenrad", { r: 20, T: 20 }),
  ],
  chaos: [
    s("stable", "Stabiler Endwert", { r: 2.8, x0: 0.2, d: 1 }),
    s("periodic", "Wechsel zwischen zwei Werten", { r: 3.2, x0: 0.2, d: 1 }),
    s("chaotic", "Chaotischer Bereich", { r: 3.9, x0: 0.2, d: 1 }),
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
        MODEL_SCENARIOS[kind].some((s) => s.id === x),
      ),
    ),
  ];
}
export const modelReady = (kind: ModelKind, seen: string[]): boolean =>
  MODEL_SCENARIOS[kind].every((s) => seen.includes(s.id));
export function setModelValue(
  kind: ModelKind,
  state: ModelState,
  key: string,
  value: number,
): ModelState {
  const param = PARAMS[kind].find((p) => p.key === key);
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

/** Deterministic noise in [−1; 1] for reproducible "measurements". */
export function pseudoNoise(index: number, seed = 7): number {
  let state = (Math.imul(index + 1, 2654435761) ^ Math.imul(seed, 40503)) >>> 0;
  state = (Math.imul(state ^ (state >>> 15), 2246822519) ^ (state >>> 13)) >>> 0;
  return (state / 4294967295) * 2 - 1;
}

export function circular(r: number, T: number) {
  return { f: 1 / T, omega: (2 * Math.PI) / T, v: (2 * Math.PI * r) / T };
}
export function centripetal(m: number, v: number, r: number) {
  if (m <= 0 || r <= 0 || ![m, v, r].every(Number.isFinite))
    throw new Error("Invalid circular motion");
  return { a: (v * v) / r, f: (m * v * v) / r, omega: v / r };
}
/**
 * A measurement series for F = m · ω² · r in which one quantity varies:
 * 0 mass, 1 radius, 2 angular velocity. `quotient` is F divided by the
 * varied quantity (squared for ω), constant up to the measurement noise.
 */
export function centriSeries(vary: number, noisePercent: number) {
  const base = { m: 0.2, r: 0.4, omega: 5 };
  const grid = [
    [0.1, 0.2, 0.3, 0.4, 0.5],
    [0.2, 0.3, 0.4, 0.5, 0.6],
    [2, 3, 4, 5, 6],
  ][vary];
  return grid.map((x, i) => {
    const m = vary === 0 ? x : base.m,
      r = vary === 1 ? x : base.r,
      omega = vary === 2 ? x : base.omega;
    const f = m * omega * omega * r * (1 + (noisePercent / 100) * pseudoNoise(i, vary + 3));
    return { x, f, quotient: f / (vary === 2 ? x * x : x) };
  });
}
export function curve(m: number, vKmh: number, r: number, mu: number) {
  const v = vKmh / 3.6,
    need = (m * v * v) / r,
    max = mu * m * G_EARTH;
  return { need, max, safe: need <= max, vMaxKmh: Math.sqrt(mu * G_EARTH * r) * 3.6 };
}
export function gravityForce(m1: number, m2: number, r: number): number {
  if (m1 <= 0 || m2 <= 0 || r <= 0) throw new Error("Invalid gravity");
  return (G * m1 * m2) / (r * r);
}
/** Circular orbit around a central mass at distance r from its centre. */
export function orbit(centralMass: number, r: number) {
  const v = Math.sqrt((G * centralMass) / r);
  return { v, T: (2 * Math.PI * r) / v };
}
export function harmonic(A: number, T: number, t: number): number {
  return A * Math.sin((2 * Math.PI * t) / T);
}
export function spring(m: number, D: number, amplitudeCm: number) {
  const A = amplitudeCm / 100,
    T = 2 * Math.PI * Math.sqrt(m / D);
  return { T, f: 1 / T, energy: 0.5 * D * A * A, vMax: A * Math.sqrt(D / m) };
}
export function pendulumPeriod(l: number, g: number): number {
  return 2 * Math.PI * Math.sqrt(l / g);
}
/**
 * Reproducible stopwatch readings for a pendulum with period `trueT`:
 * each timing of `periods` oscillations is off by up to ±spread, so the
 * period from one timing is off by spread / periods.
 */
export function timingSample(n: number, periods: number, spread: number, trueT = 1.42) {
  const values = Array.from(
    { length: n },
    (_, i) => (periods * trueT + spread * pseudoNoise(i, 11)) / periods,
  );
  const mean = values.reduce((a, b) => a + b, 0) / n,
    halfRange = (Math.max(...values) - Math.min(...values)) / 2,
    deviation = Math.sqrt(
      values.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1),
    );
  return { values, mean, halfRange, deviation };
}
export function wave(lambda: number, f: number) {
  return { c: lambda * f, T: 1 / f };
}
/** Amplitude of two superposed equal-frequency waves; shift in wavelengths. */
export function superpose(a1: number, a2: number, shift: number): number {
  const sq = a1 * a1 + a2 * a2 + 2 * a1 * a2 * Math.cos(2 * Math.PI * shift);
  return Math.sqrt(Math.max(0, sq));
}
export function interference(s1: number, s2: number, lambda: number) {
  const ds = Math.abs(s2 - s1),
    ratio = ds / lambda,
    rest = ratio - Math.floor(ratio + 1e-9);
  const kind: "konstruktiv" | "destruktiv" | "dazwischen" =
    Math.abs(rest) < 1e-6 ? "konstruktiv" : Math.abs(rest - 0.5) < 1e-6 ? "destruktiv" : "dazwischen";
  return { ds, ratio, kind };
}
/** Standing wave on a carrier with two fixed ends: n antinodes. */
export function standing(L: number, n: number, c: number) {
  return { lambda: (2 * L) / n, f: (n * c) / (2 * L), nodes: n + 1 };
}
/** Fringe spacing in mm for λ in nm, slit distance b in mm, screen distance a in m. */
export function fringeSpacing(lambdaNm: number, bMm: number, a: number): number {
  return (lambdaNm * 1e-9 * a) / (bMm * 1e-3) * 1e3;
}
export function colourName(lambdaNm: number): string {
  return lambdaNm < 450 ? "Violett" : lambdaNm < 495 ? "Blau" : lambdaNm < 570 ? "Grün" : lambdaNm < 590 ? "Gelb" : lambdaNm < 625 ? "Orange" : "Rot";
}
export function colourHex(lambdaNm: number): string {
  return lambdaNm < 450 ? "#7a3fd0" : lambdaNm < 495 ? "#2f6fe0" : lambdaNm < 570 ? "#2fa84f" : lambdaNm < 590 ? "#d8b400" : lambdaNm < 625 ? "#e07a1f" : "#d03a2f";
}
/** Kepler III around the Sun: a in AE gives T in years; e shapes the ellipse. */
export function kepler(a: number, e: number) {
  return {
    T: a ** 1.5,
    perihel: a * (1 - e),
    aphel: a * (1 + e),
    speedRatio: (1 + e) / (1 - e),
  };
}
export function hubble(d: number, h0: number) {
  const v = h0 * d;
  return { v, fraction: (v * 1000) / C, ageGyr: 977.8 / h0 };
}
/** Speed (in c) seen from the platform for something sent forward at w (in c) inside a train at beta. */
export function platformSpeed(beta: number, w: number) {
  return { classical: beta + w, measured: (beta + w) / (1 + beta * w) };
}
export function gamma(beta: number): number {
  if (!(beta >= 0 && beta < 1)) throw new Error("Invalid speed");
  return 1 / Math.sqrt(1 - beta * beta);
}
export function muon(beta: number, hKm: number) {
  const g = gamma(beta),
    h = hKm * 1000,
    classicalReach = beta * C * MUON_TAU,
    reach = classicalReach * g;
  return {
    gamma: g,
    labLifetime: g * MUON_TAU,
    classicalReach,
    reach,
    contractedHeight: h / g,
    classicalShare: Math.exp(-h / classicalReach),
    share: Math.exp(-h / reach),
  };
}
export function chain(input: number, percents: number[]) {
  const useful = percents.reduce((e, eta) => (e * eta) / 100, input);
  return { useful, devalued: input - useful, total: (100 * useful) / input };
}
export function utility(weights: number[], scores: number[]): number {
  const sum = weights.reduce((a, b) => a + b, 0);
  return sum === 0 ? 0 : weights.reduce((a, w, i) => a + w * scores[i], 0) / sum;
}
export function saving(pOld: number, pNew: number, hours: number, priceCt: number) {
  const oldKwh = (pOld * hours * 365) / 1000,
    newKwh = (pNew * hours * 365) / 1000;
  return { oldKwh, newKwh, savedKwh: oldKwh - newKwh, savedEuro: ((oldKwh - newKwh) * priceCt) / 100 };
}
/**
 * Methode der kleinen Schritte for a fall from rest with air resistance
 * F_L = k · v²: within each step the acceleration is taken as constant.
 */
export function eulerFall(m: number, k: number, dt: number, steps: number) {
  const rows = [];
  let t = 0,
    v = 0,
    x = 0;
  for (let i = 0; i <= steps; i++) {
    const a = G_EARTH - (k / m) * v * v;
    rows.push({ t, v, a, x });
    x += v * dt;
    v += a * dt;
    t += dt;
  }
  return rows;
}
export function terminalSpeed(m: number, k: number): number | null {
  return k > 0 ? Math.sqrt((m * G_EARTH) / k) : null;
}
/**
 * Methode der kleinen Schritte for a spring pendulum released at x₀:
 * a = −D/m · x, then v_new = v + a · Δt, then x_new = x + v_new · Δt.
 * Returns the samples and the period read from the zero crossings.
 */
export function eulerOscillation(m: number, D: number, dt: number, duration = 4, x0 = 0.05) {
  const points: [number, number][] = [];
  const crossings: number[] = [];
  let x = x0,
    v = 0;
  const steps = Math.round(duration / dt);
  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    points.push([t, x]);
    v += (-D / m) * x * dt;
    const next = x + v * dt;
    if (x > 0 && next <= 0) crossings.push(t + (dt * x) / (x - next));
    x = next;
  }
  const exact = 2 * Math.PI * Math.sqrt(m / D);
  const simulated =
    crossings.length >= 2
      ? (crossings[crossings.length - 1] - crossings[0]) / (crossings.length - 1)
      : null;
  return { points, exact, simulated };
}
const SOLAR_ISC = 0.5,
  SOLAR_UT = 0.05,
  SOLAR_UOC = 0.6,
  SOLAR_I0 = SOLAR_ISC / (Math.exp(SOLAR_UOC / SOLAR_UT) - 1);
/** Current of the model solar cell at voltage u and irradiance in W/m². */
export function solarCurrent(irr: number, u: number): number {
  return SOLAR_ISC * (irr / 1000) - SOLAR_I0 * (Math.exp(u / SOLAR_UT) - 1);
}
/** Working point with a load resistor: where the cell's curve meets I = U / R. */
export function solarPoint(irr: number, r: number) {
  let lo = 0,
    hi = 0.8;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (solarCurrent(irr, mid) - mid / r > 0) lo = mid;
    else hi = mid;
  }
  const u = (lo + hi) / 2,
    i = u / r;
  return { u, i, p: u * i };
}
export function solarMpp(irr: number) {
  let best = { u: 0, i: 0, p: 0 };
  for (let step = 0; step <= 800; step++) {
    const u = step / 1000,
      i = solarCurrent(irr, u);
    if (i > 0 && u * i > best.p) best = { u, i, p: u * i };
  }
  return { ...best, r: best.i > 0 ? best.u / best.i : 0 };
}
/** Feed-in payment per kWh in ct, an illustrative fixed value. */
export const FEED_IN_CT = 8;
export function pvPlant(kwp: number, spec: number, selfPercent: number, priceCt: number) {
  const energy = kwp * spec,
    own = (energy * selfPercent) / 100,
    fed = energy - own;
  return { energy, own, fed, euro: (own * priceCt + fed * FEED_IN_CT) / 100 };
}
export function ride(r: number, T: number) {
  const c = circular(r, T),
    a = (c.v * c.v) / r;
  return { v: c.v, a, gFactor: a / G_EARTH };
}
/** Iterates the simple growth rule x → r · x · (1 − x). */
export function logistic(r: number, x0: number, steps: number): number[] {
  const xs = [x0];
  for (let i = 0; i < steps; i++) xs.push(r * xs[i] * (1 - xs[i]));
  return xs;
}
