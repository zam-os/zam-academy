import type { ModelKind } from "./model/types";

export interface ModelScenario {
  id: string;
  label: string;
}
export const MODEL_SCENARIOS: Record<ModelKind, ModelScenario[]> = {
  landscapes: [
    { id: "hamburg", label: "Hamburg · Tiefland" },
    { id: "erfurt", label: "Erfurt · Mittelgebirgsraum" },
    { id: "muenchen", label: "München · Alpenvorland" },
    { id: "oberstdorf", label: "Oberstdorf · Alpen" },
  ],
  climate: [
    { id: "maritime", label: "Maritimes Übungsprofil" },
    { id: "continental", label: "Kontinentales Übungsprofil" },
  ],
  runoff: [
    { id: "green", label: "20 % versiegelt · eher aufnahmefähiger Boden" },
    { id: "paved", label: "80 % versiegelt · eher aufnahmefähiger Boden" },
    { id: "wet", label: "20 % versiegelt · stark vorbefeuchteter Boden" },
  ],
  greenhouse: [
    { id: "none", label: "Keine Infrarotabsorption (0 %)" },
    { id: "medium", label: "Mittlere Modellabsorption (50 %)" },
    { id: "high", label: "Höhere Modellabsorption (78 %)" },
  ],
  population: [
    { id: "young", label: "Jüngeres Übungsprofil" },
    { id: "mixed", label: "Gemischtes Übungsprofil" },
    { id: "older", label: "Älteres Übungsprofil" },
  ],
  balance: [
    { id: "loss", label: "Geburtendefizit ohne Wanderungsgewinn" },
    { id: "offset", label: "Geburtendefizit mit Wanderungsgewinn" },
    { id: "outflow", label: "Mehr Fortzüge als Zuzüge" },
  ],
  city: [
    { id: "spread", label: "Plan A · locker bebaut" },
    { id: "compact", label: "Plan B · kompakt mit Grün" },
    { id: "dense", label: "Plan C · stark verdichtet" },
  ],
  europe: [
    { id: "DEU", label: "Deutschland · Mitglied" },
    { id: "HRV", label: "Kroatien · Mitglied seit 2013" },
    { id: "NOR", label: "Norwegen · außerhalb der EU" },
    { id: "GBR", label: "Vereinigtes Königreich · Austritt 2020" },
  ],
};
export function modelReady(kind: ModelKind, visited: string[]): boolean {
  return MODEL_SCENARIOS[kind].every((scenario) => visited.includes(scenario.id));
}
export function recordExploration(kind: ModelKind, visited: string[], id: string): string[] {
  if (!MODEL_SCENARIOS[kind].some((scenario) => scenario.id === id)) return [...visited];
  return [...new Set([...visited, id])];
}
const bounded = (value: number, min: number, max: number): number =>
  Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : min;

/** Toy coefficients, not calibrated hydrology. All volumes in m³ over 10 km². */
export function runoff(rainMm: number, pavedPercent: number, saturated: boolean) {
  const rain = bounded(rainMm, 0, 100),
    paved = bounded(pavedPercent, 0, 100) / 100;
  const coefficient = paved * 0.9 + (1 - paved) * (saturated ? 0.6 : 0.2);
  const total = rain * 10 * 1000;
  const fast = total * coefficient;
  return { rain, pavedPercent: paved * 100, coefficient, total, fast, remaining: total - fast };
}
/** Fixed S=1361 W/m², albedo .3; one grey layer, transparent to incoming sunlight. */
export function greenhouse(absorptionPercent: number) {
  const fraction = bounded(absorptionPercent, 0, 100) / 100;
  const absorbedSolar = (1361 * (1 - 0.3)) / 4;
  const effectiveKelvin = (absorbedSolar / 5.670374419e-8) ** 0.25;
  const surfaceKelvin = effectiveKelvin / (1 - fraction / 2) ** 0.25;
  return {
    fraction,
    absorbedSolar,
    effectiveCelsius: effectiveKelvin - 273.15,
    surfaceCelsius: surfaceKelvin - 273.15,
  };
}
export function populationBalance(
  births: number,
  deaths: number,
  arrivals: number,
  departures: number,
) {
  const clean = (v: number) => Math.round(bounded(v, 0, 200));
  const natural = clean(births) - clean(deaths),
    migration = clean(arrivals) - clean(departures);
  return {
    start: 1000,
    births: clean(births),
    deaths: clean(deaths),
    arrivals: clean(arrivals),
    departures: clean(departures),
    natural,
    migration,
    change: natural + migration,
    end: 1000 + natural + migration,
  };
}
export const AGE_PROFILES = {
  young: [450, 450, 100],
  mixed: [250, 550, 200],
  older: [150, 500, 350],
} satisfies Record<string, number[]>;
export const AGE_LABELS = ["Unter 20 Jahre", "20 bis 64 Jahre", "Ab 65 Jahre"];
export const CLIMATE_PROFILES = {
  maritime: {
    label: "Maritim geprägt · erfundene Übungsdaten",
    temperature: [5, 5, 7, 9, 13, 16, 18, 18, 15, 12, 8, 6],
    rain: [80, 60, 65, 55, 60, 65, 65, 70, 75, 90, 90, 85],
  },
  continental: {
    label: "Kontinental geprägt · erfundene Übungsdaten",
    temperature: [-5, -3, 2, 9, 15, 19, 21, 20, 14, 8, 2, -2],
    rain: [30, 25, 30, 40, 55, 70, 75, 60, 45, 35, 35, 30],
  },
};
export function climateStats(profile: { temperature: number[]; rain: number[] }) {
  return {
    mean: profile.temperature.reduce((sum, v) => sum + v, 0) / 12,
    amplitude: Math.max(...profile.temperature) - Math.min(...profile.temperature),
    rain: profile.rain.reduce((sum, v) => sum + v, 0),
  };
}
export const CITY_PLANS = {
  spread: { housing: 50, transport: 30, green: 20, dwellingsPerHousingHa: 20 },
  compact: { housing: 40, transport: 20, green: 40, dwellingsPerHousingHa: 70 },
  dense: { housing: 65, transport: 25, green: 10, dwellingsPerHousingHa: 100 },
};
export const LANDMARKS = {
  hamburg: {
    name: "Hamburg",
    lon: 9.99,
    lat: 53.55,
    region: "Norddeutsches Tiefland",
    detail: "Unterelbe, niedrige Lagen; weiter östlich auch eiszeitliches Hügelland.",
  },
  erfurt: {
    name: "Erfurt",
    lon: 11.03,
    lat: 50.98,
    region: "Mittelgebirgsraum",
    detail:
      "Am Thüringer Becken; ein Becken innerhalb des Mittelgebirgsraums ist nicht selbst ein hoher Gipfel.",
  },
  muenchen: {
    name: "München",
    lon: 11.58,
    lat: 48.14,
    region: "Alpenvorland",
    detail: "Münchner Schotterebene nördlich der Alpen; glaziale und fluviatile Überprägung.",
  },
  oberstdorf: {
    name: "Oberstdorf",
    lon: 10.28,
    lat: 47.41,
    region: "Alpen",
    detail: "Allgäuer Alpen; Täler und hohe Gebirgszüge gehören zum selben Großraum.",
  },
};
/** EU membership snapshot 2026-10-20. Coordinates are orientation points, not exact centroids. */
export const EU_COUNTRIES = [
  ["AUT", "Österreich", 14, 47.6],
  ["BEL", "Belgien", 4.7, 50.7],
  ["BGR", "Bulgarien", 25.4, 42.7],
  ["HRV", "Kroatien", 16.4, 45.3],
  ["CYP", "Zypern", 33.3, 35.1],
  ["CZE", "Tschechien", 15.4, 49.8],
  ["DNK", "Dänemark", 9.5, 56.2],
  ["EST", "Estland", 25.7, 58.7],
  ["FIN", "Finnland", 25.4, 64.5],
  ["FRA", "Frankreich", 2.2, 46.6],
  ["DEU", "Deutschland", 10.5, 51.2],
  ["GRC", "Griechenland", 23.3, 39.2],
  ["HUN", "Ungarn", 19.4, 47.1],
  ["IRL", "Irland", -8, 53.4],
  ["ITA", "Italien", 12.5, 42.8],
  ["LVA", "Lettland", 24.8, 57],
  ["LTU", "Litauen", 24, 55.2],
  ["LUX", "Luxemburg", 6.1, 49.8],
  ["MLT", "Malta", 14.4, 35.9],
  ["NLD", "Niederlande", 5.4, 52.2],
  ["POL", "Polen", 19.1, 52.1],
  ["PRT", "Portugal", -8, 39.5],
  ["ROU", "Rumänien", 24.9, 45.9],
  ["SVK", "Slowakei", 19.6, 48.7],
  ["SVN", "Slowenien", 14.9, 46.1],
  ["ESP", "Spanien", -3.7, 40.4],
  ["SWE", "Schweden", 15, 62],
] as const;
export const NON_EU_COUNTRIES = [
  ["NOR", "Norwegen", 9, 61],
  ["GBR", "Vereinigtes Königreich", -2.5, 54],
  ["CHE", "Schweiz", 8.2, 46.8],
  ["TUR", "Türkiye", 35, 39],
] as const;
export type MapBounds = { west: number; east: number; south: number; north: number };
export const GERMANY_BOUNDS: MapBounds = { west: 5.5, east: 15.5, south: 47, north: 55.5 };
export const EUROPE_BOUNDS: MapBounds = { west: -25, east: 45, south: 34, north: 72 };
export function mapPoint(lon: number, lat: number, bounds: MapBounds) {
  const correction = Math.cos((((bounds.north + bounds.south) / 2) * Math.PI) / 180);
  return { x: (lon - bounds.west) * correction * 14, y: (bounds.north - lat) * 14 };
}
export function mapSize(bounds: MapBounds) {
  return mapPoint(bounds.east, bounds.south, bounds);
}
