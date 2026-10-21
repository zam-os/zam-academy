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
export const PARAMS: Record<ModelKind, Param[]> = {
  motion: [
    p("v0", "Anfangsgeschwindigkeit", 0, 10, 1, "m/s"),
    p("a", "Beschleunigung", 0, 4, 0.5, "m/s²"),
    p("t", "Zeit", 0, 10, 1, "s"),
  ],
  collision: [
    p("m1", "Masse 1", 1, 5, 1, "kg"),
    p("m2", "Masse 2", 1, 5, 1, "kg"),
    p("v1", "Geschwindigkeit 1", 1, 5, 1, "m/s"),
    p("v2", "Geschwindigkeit 2", -3, 0, 1, "m/s"),
    p("e", "Rückprallparameter", 0, 1, 0.25, ""),
  ],
  circuit: [
    p("parallel", "Schaltung: 0 Reihe · 1 parallel", 0, 1, 1, ""),
    p("u", "Quellenspannung", 2, 12, 1, "V"),
    p("r1", "Widerstand 1", 100, 500, 100, "Ω"),
    p("r2", "Widerstand 2", 100, 500, 100, "Ω"),
  ],
  induction: [
    p("n", "Windungen", 100, 500, 100, ""),
    p("area", "Senkrechte Fläche", 0.01, 0.05, 0.01, "m²"),
    p("db", "Feldänderung", -0.5, 0.5, 0.1, "T"),
    p("dt", "Dauer der Feldänderung", 0.1, 1, 0.1, "s"),
    p("closed", "Kreis: 0 offen · 1 geschlossen", 0, 1, 1, ""),
  ],
  generator: [
    p("peak", "Scheitelspannung", 2, 10, 1, "V"),
    p("f", "Frequenz", 1, 5, 1, "Hz"),
    p("t", "Zeit", 0, 1, 0.05, "s"),
    p("loaded", "Last: 0 offen · 1 Widerstand 10 Ω", 0, 1, 1, ""),
  ],
  transformer: [
    p("n1", "Primärwindungen", 100, 500, 100, ""),
    p("n2", "Sekundärwindungen", 100, 500, 100, ""),
    p("u1", "Primärspannung", 2, 20, 2, "V"),
    p("r", "Lastwiderstand", 10, 100, 10, "Ω"),
    p("eta", "Wirkungsgrad", 80, 100, 5, "%"),
  ],
  decay: [
    p("n0", "Anfangsanzahl", 100, 10000, 100, "Kerne"),
    p("half", "Halbwertszeit", 2, 20, 2, "h"),
    p("t", "Vergangene Zeit", 0, 40, 1, "h"),
  ],
  nucleus: [],
  plant: [
    p("input", "Zugeführte Energie", 100, 200, 20, "kWh"),
    p("electric", "Elektrischer Anteil", 20, 60, 5, "%"),
    p("recovery", "Genutzter Anteil der restlichen Wärme", 0, 100, 10, "%"),
  ],
  storage: [
    p("input", "Energie beim Laden", 10, 50, 5, "kWh"),
    p("eta", "Gesamteffizienz", 40, 100, 10, "%"),
    p("power", "Gewünschte konstante Abgabe", 1, 10, 1, "kW"),
    p("maxPower", "Maximale Abgabeleistung", 1, 10, 1, "kW"),
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
  motion: [
    s("uniform", "Gleichförmig", { v0: 4, a: 0, t: 5 }),
    s("accelerated", "Aus Ruhe beschleunigen", { v0: 0, a: 2, t: 5 }),
  ],
  collision: [
    s("elastic", "Elastisch", { m1: 2, m2: 1, v1: 3, v2: 0, e: 1 }),
    s("partial", "Teilelastisch", { m1: 2, m2: 1, v1: 3, v2: 0, e: 0.5 }),
    s("sticky", "Zusammenhaften", { m1: 2, m2: 1, v1: 3, v2: 0, e: 0 }),
  ],
  circuit: [
    s("series", "In Reihe", { parallel: 0, u: 6, r1: 100, r2: 200 }),
    s("parallel", "Parallel", { parallel: 1, u: 6, r1: 100, r2: 200 }),
  ],
  induction: [
    s("still", "Feld unverändert", {
      n: 200,
      area: 0.02,
      db: 0,
      dt: 0.5,
      closed: 1,
    }),
    s("change", "Feld nimmt zu", {
      n: 200,
      area: 0.02,
      db: 0.4,
      dt: 0.5,
      closed: 1,
    }),
    s("open", "Gleiche Änderung · Kreis offen", {
      n: 200,
      area: 0.02,
      db: 0.4,
      dt: 0.5,
      closed: 0,
    }),
    s("reverse", "Feld nimmt ab", {
      n: 200,
      area: 0.02,
      db: -0.4,
      dt: 0.5,
      closed: 1,
    }),
  ],
  generator: [
    s("open", "Unbelastet", { peak: 6, f: 2, t: 0.1, loaded: 0 }),
    s("load", "Mit ohmscher Last", { peak: 6, f: 2, t: 0.1, loaded: 1 }),
  ],
  transformer: [
    s("down", "Heruntertransformieren", {
      n1: 500,
      n2: 100,
      u1: 10,
      r: 20,
      eta: 100,
    }),
    s("up", "Hochtransformieren", {
      n1: 100,
      n2: 500,
      u1: 10,
      r: 20,
      eta: 100,
    }),
    s("loss", "Mit Verlustanteil", {
      n1: 100,
      n2: 500,
      u1: 10,
      r: 20,
      eta: 90,
    }),
  ],
  decay: [
    s("half", "Eine Halbwertszeit", { n0: 1000, half: 4, t: 4 }),
    s("quarter", "Zwei Halbwertszeiten", { n0: 1000, half: 4, t: 8 }),
    s("small", "Kleine Anfangsgruppe", { n0: 100, half: 4, t: 8 }),
  ],
  nucleus: [
    s("alpha", "Uran-238 · Alpha", { a: 238, z: 92, mode: 0 }),
    s("beta", "Kohlenstoff-14 · Beta-Minus", { a: 14, z: 6, mode: 1 }),
    s("gamma", "Technetium-99m · Gamma", { a: 99, z: 43, mode: 2 }),
  ],
  plant: [
    s("electric", "Nur Strom genutzt", {
      input: 100,
      electric: 35,
      recovery: 0,
    }),
    s("kwk", "Wärme teilweise genutzt", {
      input: 100,
      electric: 35,
      recovery: 70,
    }),
  ],
  storage: [
    s("efficient", "80 % Gesamteffizienz", {
      input: 20,
      eta: 80,
      power: 2,
      maxPower: 4,
    }),
    s("lossy", "50 % Gesamteffizienz", {
      input: 20,
      eta: 50,
      power: 2,
      maxPower: 4,
    }),
    s("limited", "Leistungsgrenze überschritten", {
      input: 20,
      eta: 80,
      power: 6,
      maxPower: 4,
    }),
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
    value < param.min ||
    value > param.max
  )
    return state;
  const steps = Math.round((value - param.min) / param.step);
  if (Math.abs(param.min + steps * param.step - value) > 1e-7) return state;
  return {
    selected: "",
    values: { ...modelValues(kind, state), [key]: value },
  };
}
export function motion(v0: number, a: number, t: number) {
  return { x: v0 * t + 0.5 * a * t * t, v: v0 + a * t };
}
export function collision(
  m1: number,
  m2: number,
  v1: number,
  v2: number,
  e: number,
) {
  if (
    m1 <= 0 ||
    m2 <= 0 ||
    e < 0 ||
    e > 1 ||
    ![m1, m2, v1, v2, e].every(Number.isFinite)
  )
    throw new Error("Invalid collision");
  const total = m1 + m2,
    p = m1 * v1 + m2 * v2;
  const after1 = (p - m2 * e * (v1 - v2)) / total,
    after2 = (p + m1 * e * (v1 - v2)) / total;
  return {
    v1: after1,
    v2: after2,
    pBefore: p,
    pAfter: m1 * after1 + m2 * after2,
    eBefore: 0.5 * m1 * v1 * v1 + 0.5 * m2 * v2 * v2,
    eAfter: 0.5 * m1 * after1 * after1 + 0.5 * m2 * after2 * after2,
  };
}
export function circuit(u: number, r1: number, r2: number, parallel: boolean) {
  if (u < 0 || r1 <= 0 || r2 <= 0 || ![u, r1, r2].every(Number.isFinite))
    throw new Error("Invalid circuit");
  const r = parallel ? (r1 * r2) / (r1 + r2) : r1 + r2,
    i = u / r;
  const u1 = parallel ? u : i * r1,
    u2 = parallel ? u : i * r2;
  return { r, i, u1, u2, i1: u1 / r1, i2: u2 / r2 };
}
export function induction(
  n: number,
  area: number,
  db: number,
  dt: number,
  closed: boolean,
) {
  const u = db === 0 ? 0 : (-n * area * db) / dt;
  return { u, i: closed ? u / 100 : 0 };
}
export function transformer(
  n1: number,
  n2: number,
  u1: number,
  r: number,
  eta: number,
) {
  const u2 = (u1 * n2) / n1,
    i2 = u2 / r,
    p2 = u2 * i2,
    p1 = p2 / (eta / 100);
  return { u2, i2, p2, p1, i1: p1 / u1, loss: p1 - p2 };
}
export function remaining(n0: number, t: number, half: number): number {
  return n0 * 2 ** (-t / half);
}
/** Seeded discrete half-life analogy, distinct from the continuous expected curve. */
export function decaySample(n0: number, rounds: number, seed = 42): number[] {
  let state = seed >>> 0,
    n = n0;
  const rows = [n];
  for (let round = 0; round < rounds; round++) {
    let survivors = 0;
    for (let j = 0; j < n; j++) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      if (state / 4294967296 < 0.5) survivors++;
    }
    n = survivors;
    rows.push(n);
  }
  return rows;
}
export function daughter(a: number, z: number, mode: number) {
  return mode === 0
    ? { a: a - 4, z: z - 2 }
    : mode === 1
      ? { a, z: z + 1 }
      : { a, z };
}
export function plant(input: number, electric: number, recovery: number) {
  const el = (input * electric) / 100,
    heat = ((input - el) * recovery) / 100;
  return { el, heat, loss: input - el - heat, useful: el + heat };
}
export function storage(
  input: number,
  eta: number,
  power: number,
  maxPower: number,
) {
  const energy = (input * eta) / 100;
  return {
    energy,
    loss: input - energy,
    hours: power <= maxPower ? energy / power : null,
  };
}
