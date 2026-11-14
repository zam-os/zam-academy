/**
 * Map figures drawn from src/data/maps.json (Natural Earth, public domain,
 * prepared once by scripts/build-map-data.mjs). Everything is local: no tile
 * server, no request. Positions of markers and labels are longitude and
 * latitude and use the same projection as the stored paths.
 */
import data from "../data/maps.json";
import { dot, f1, label, labels, marker, svg } from "./draw";

interface Projection {
  lonMin: number;
  latMax: number;
  k: number;
  c: number;
  width: number;
  height: number;
}
interface Shape {
  id: string;
  d: string;
}
interface MapData {
  proj: Projection;
  layers: Record<string, Shape[]>;
}
export const MAPS = data as unknown as Record<
  "world" | "germany" | "bavaria",
  MapData
>;

export function at(map: MapData, lon: number, lat: number): [number, number] {
  const p = map.proj;
  return [(lon - p.lonMin) * p.k * p.c, (p.latMax - lat) * p.k];
}

const paths = (shapes: Shape[] | undefined, cls: (s: Shape) => string) =>
  (shapes ?? [])
    .map((s) => `<path class="${cls(s)}" d="${s.d}"/>`)
    .join("");

const sea = (m: MapData) =>
  `<rect class="sea" width="${m.proj.width}" height="${m.proj.height}"/>`;

const RIVER_IDS = new Set([
  "Rhein",
  "Rhine",
  "Elbe",
  "Donau",
  "Danube",
  "Main",
  "Weser",
  "Oder",
  "Mosel",
  "Inn",
  "Isar",
  "Regnitz",
  "Salzach",
  "Lech",
  "Nile",
]);
const rivers = (m: MapData) =>
  paths(
    (m.layers.rivers ?? []).filter((r) => RIVER_IDS.has(r.id)),
    () => "river",
  );
const lakes = (m: MapData) => paths(m.layers.lakes, () => "lake");

/** Place a list of [lon, lat, text] labels. */
const place = (
  m: MapData,
  items: Array<[number, number, string, string?]>,
): string =>
  items
    .map(([lon, lat, text, cls]) => {
      const [x, y] = at(m, lon, lat);
      return text.includes("\n")
        ? labels(x, y, text, cls ?? "lbl")
        : label(x, y, text, cls ?? "lbl");
    })
    .join("");

const CONTINENT_CLASS: Record<string, string> = {
  Africa: "ct-africa",
  Asia: "ct-asia",
  Europe: "ct-europe",
  "North America": "ct-namerica",
  "South America": "ct-samerica",
  Oceania: "ct-oceania",
  Antarctica: "ct-antarctica",
};

/** Seven numbered continents; the workshop asks for their names. */
export const CONTINENT_MARKERS: Array<[number, number, number]> = [
  [-60, -12, 1],
  [20, 6, 2],
  [92, 50, 3],
  [22, 51, 4],
  [134, -25, 5],
  [-102, 47, 6],
  [40, -79, 7],
];

export function worldContinents(): string {
  const m = MAPS.world;
  const [, eq] = at(m, 0, 0);
  const body = `${sea(m)}${paths(m.layers.continents, (s) => `land ${CONTINENT_CLASS[s.id] ?? ""}`)}
  <line class="equator" x1="0" x2="${m.proj.width}" y1="${f1(eq)}" y2="${f1(eq)}"/>${label(8, eq - 5, "Äquator", "lbl small", "start")}
  ${place(m, [
    [-140, 8, "Pazifischer\nOzean", "lbl sea-label"],
    [-35, 12, "Atlantischer\nOzean", "lbl sea-label"],
    [78, -22, "Indischer\nOzean", "lbl sea-label"],
    [20, 80, "Nordpolarmeer", "lbl sea-label"],
    [-120, -63, "Südlicher Ozean", "lbl sea-label"],
  ])}
  ${CONTINENT_MARKERS.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return marker(x, y, n);
  }).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Weltkarte mit sieben nummerierten Kontinenten, den Ozeanen und dem Äquator",
    body,
  );
}

export function germany(): string {
  const m = MAPS.germany;
  const states = paths(m.layers.states, (s) =>
    s.id === "Bayern" ? "state state-home" : "state",
  );
  const [bx, by] = at(m, 13.4, 52.52);
  const [mx, my] = at(m, 11.58, 48.14);
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${states}${lakes(m)}${rivers(m)}
  ${place(m, [
    [6.9, 54.55, "Nordsee", "lbl sea-label"],
    [12.9, 54.75, "Ostsee", "lbl sea-label"],
    [9.7, 54.92, "Dänemark", "lbl small muted"],
    [15.0, 53.4, "Polen", "lbl small muted"],
    [14.2, 49.75, "Tschechien", "lbl small muted"],
    [13.6, 47.5, "Österreich", "lbl small muted"],
    [8.1, 47.35, "Schweiz", "lbl small muted"],
    [6.2, 48.75, "Frankreich", "lbl small muted"],
    [5.85, 50.3, "Bel-\ngien", "lbl small muted"],
    [6.1, 49.72, "Lux.", "lbl tiny muted"],
    [6.0, 52.45, "Nieder-\nlande", "lbl small muted"],
    [6.35, 50.95, "Rhein", "lbl river-label"],
    [11.05, 53.15, "Elbe", "lbl river-label"],
    [10.9, 48.55, "Donau", "lbl river-label"],
    [10.25, 50.3, "Main", "lbl river-label"],
    [9.45, 52.6, "Weser", "lbl river-label"],
    [14.25, 52.3, "Oder", "lbl river-label"],
    [11.6, 49.15, "BAYERN", "lbl home-label"],
  ])}
  <path class="star" d="M${f1(bx)} ${f1(by - 8)}l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5-5-2.9-5 2.9 1.2-5.5-4.2-3.8 5.6-.6z"/>${label(bx, by + 18, "Berlin", "lbl small")}
  ${dot(mx, my)}${label(mx + 8, my + 4, "München", "lbl small", "start")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Deutschland mit den 16 Bundesländern, Bayern hervorgehoben, großen Flüssen, Nordsee, Ostsee und Nachbarländern",
    body,
  );
}

const bavariaBase = (m: MapData) =>
  `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${paths(m.layers.states, (s) => (s.id === "Bayern" ? "state state-home" : "state"))}${lakes(m)}${rivers(m)}`;

const line = (m: MapData, pts: Array<[number, number]>) =>
  pts
    .map(([lon, lat], i) => {
      const [x, y] = at(m, lon, lat);
      return `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
    })
    .join("");

/** Simplified course of the Rhine–Danube watershed through Bavaria. */
export const WATERSHED: Array<[number, number]> = [
  [9.6, 48.75], [10.1, 48.95], [10.35, 49.2], [10.7, 49.25], [11.2, 49.2],
  [11.55, 49.4], [11.75, 49.75], [11.9, 50.05],
];

/** Rough outlines of the four natural regions, clipped to Bavaria. */
export const NATURAL_REGIONS: Array<[string, Array<[number, number]>]> = [
  ["nr-alpen", [[9.8, 47.2], [13.2, 47.2], [13.2, 47.78], [12.6, 47.72], [12.0, 47.68], [11.0, 47.62], [10.0, 47.62], [9.8, 47.6]]],
  ["nr-vorland", [[9.8, 47.6], [10.0, 47.62], [11.0, 47.62], [12.0, 47.68], [12.6, 47.72], [13.2, 47.78], [13.1, 48.2], [13.5, 48.55], [12.9, 48.75], [12.1, 48.95], [11.4, 48.75], [10.9, 48.7], [10.2, 48.5], [9.8, 48.4]]],
  ["nr-ostbayern", [[12.1, 48.95], [12.9, 48.75], [13.5, 48.55], [14.0, 48.8], [14.0, 50.0], [12.4, 50.5], [11.9, 50.4], [11.8, 49.95], [12.2, 49.7], [12.0, 49.3]]],
  ["nr-stufen", [[8.8, 48.4], [9.8, 48.4], [10.2, 48.5], [10.9, 48.7], [11.4, 48.75], [12.1, 48.95], [12.0, 49.3], [12.2, 49.7], [11.8, 49.95], [11.9, 50.4], [11.0, 50.7], [8.8, 50.7]]],
];

export function bavariaNatural(): string {
  const m = MAPS.bavaria;
  const bayern = m.layers.states.find((s) => s.id === "Bayern")!;
  const peak = (lon: number, lat: number, name: string, anchor: "start" | "end" = "start") => {
    const [x, y] = at(m, lon, lat);
    return `<path class="peak" d="M${f1(x - 7)} ${f1(y + 5)}L${f1(x)} ${f1(y - 7)}L${f1(x + 7)} ${f1(y + 5)}Z"/>${label(x + (anchor === "start" ? 10 : -10), y + 4, name, "lbl tiny", anchor)}`;
  };
  const lake = (lon: number, lat: number, rx: number, ry: number) => {
    const [x, y] = at(m, lon, lat);
    return `<ellipse class="lake" cx="${f1(x)}" cy="${f1(y)}" rx="${rx}" ry="${ry}"/>`;
  };
  const regions = NATURAL_REGIONS.map(([cls, pts]) => `<path class="region ${cls}" d="${line(m, pts)}Z"/>`).join("");
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${paths(m.layers.states, () => "state")}
  <clipPath id="clip-bayern"><path d="${bayern.d}"/></clipPath><g clip-path="url(#clip-bayern)">${regions}</g><path class="state-outline" d="${bayern.d}"/>${lakes(m)}${rivers(m)}
  <path class="watershed" d="${line(m, WATERSHED)}"/>
  ${lake(12.45, 47.87, 9, 6)}${lake(11.13, 48.0, 4, 8)}${lake(11.31, 47.9, 4, 9)}
  ${place(m, [
    [11.3, 47.52, "ALPEN", "lbl region-label"],
    [11.2, 48.2, "ALPENVORLAND", "lbl region-label"],
    [13.1, 49.45, "OSTBAYERISCHES\nMITTELGEBIRGE", "lbl region-label"],
    [10.3, 49.55, "SCHICHTSTUFEN-\nLAND", "lbl region-label"],
    [11.45, 49.15, "Fränkische Alb", "lbl tiny strong"],
    [13.3, 48.86, "Bayerischer Wald", "lbl tiny"],
    [12.25, 47.8, "Chiemsee", "lbl tiny"],
    [11.55, 48.36, "Münchner\nSchotterebene", "lbl tiny"],
    [9.95, 50.42, "Rhön", "lbl tiny"],
    [9.3, 49.95, "Spessart", "lbl tiny"],
    [12.75, 48.68, "Donau", "lbl river-label"],
    [10.55, 50.12, "Main", "lbl river-label"],
    [12.25, 48.32, "Isar", "lbl river-label"],
    [12.6, 48.02, "Inn", "lbl river-label"],
    [10.25, 49.02, "Hauptwasserscheide", "lbl tiny watershed-label"],
  ])}
  ${peak(10.99, 47.42, "Zugspitze 2962 m")}${peak(12.92, 47.55, "Watzmann", "end")}${peak(13.1, 49.11, "Großer Arber 1456 m", "end")}${peak(11.85, 50.03, "Fichtelgebirge")}
  ${NATURAL_REGIONS.map(([cls], i) => `<rect class="region ${cls} legend-swatch" x="268" y="${8 + i * 18}" width="14" height="12" rx="3"/>${label(288, 18 + i * 18, ["Alpen", "Alpenvorland", "Ostbayerisches Mittelgebirge", "Schichtstufenland"][i], "lbl tiny", "start")}`).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Bayern mit den farbig gegliederten Naturräumen Alpen, Alpenvorland, Ostbayerisches Mittelgebirge und Schichtstufenland, den Flüssen Main, Donau, Isar und Inn, Seen, Gipfeln und dem vereinfachten Verlauf der Europäischen Hauptwasserscheide",
    body,
  );
}

/** The seven Bavarian government seats, numbered in the workshop's order. */
export const DISTRICT_SEATS: Array<[number, number, string, string]> = [
  [11.58, 48.14, "München", "Oberbayern"],
  [12.15, 48.54, "Landshut", "Niederbayern"],
  [12.1, 49.02, "Regensburg", "Oberpfalz"],
  [11.58, 49.94, "Bayreuth", "Oberfranken"],
  [10.57, 49.3, "Ansbach", "Mittelfranken"],
  [9.93, 49.79, "Würzburg", "Unterfranken"],
  [10.9, 48.37, "Augsburg", "Schwaben"],
];

export function bavariaDistricts(): string {
  const m = MAPS.bavaria;
  const seats = DISTRICT_SEATS.map(([lon, lat, city]) => {
    const [x, y] = at(m, lon, lat);
    return `<path class="star" d="M${f1(x)} ${f1(y - 8)}l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5-5-2.9-5 2.9 1.2-5.5-4.2-3.8 5.6-.6z"/>${label(x + 10, y + 4, city, "lbl small strong", "start")}`;
  }).join("");
  const body = `${bavariaBase(m)}
  ${place(m, [
    [11.85, 47.82, "Oberbayern", "lbl district-label"],
    [13.05, 48.75, "Niederbayern", "lbl district-label"],
    [12.35, 49.55, "Oberpfalz", "lbl district-label"],
    [11.2, 50.25, "Oberfranken", "lbl district-label"],
    [10.75, 49.0, "Mittelfranken", "lbl district-label"],
    [9.75, 50.2, "Unterfranken", "lbl district-label"],
    [10.25, 47.95, "Schwaben", "lbl district-label"],
  ])}${seats}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Bayern mit den Namen der sieben Regierungsbezirke und ihren Regierungssitzen München, Landshut, Regensburg, Bayreuth, Ansbach, Würzburg und Augsburg",
    body,
  );
}

/** Numbered agricultural regions; the workshop asks for their main use. */
export const FARM_REGIONS: Array<[number, number, number]> = [
  [12.6, 48.85, 1],
  [10.3, 47.7, 2],
  [11.75, 48.6, 3],
  [9.95, 49.85, 4],
  [11.03, 49.52, 5],
  [11.3, 52.1, 6],
];

export function farmRegions(): string {
  const m = MAPS.germany;
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${paths(m.layers.states, (s) => (s.id === "Bayern" ? "state state-home" : "state"))}${lakes(m)}${rivers(m)}
  ${place(m, [
    [6.9, 54.55, "Nordsee", "lbl sea-label"],
    [12.9, 54.75, "Ostsee", "lbl sea-label"],
    [10.9, 48.55, "Donau", "lbl river-label"],
    [9.6, 50.15, "Main", "lbl river-label"],
  ])}
  ${FARM_REGIONS.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return `<circle class="farm-dot" cx="${f1(x)}" cy="${f1(y)}" r="9"/>${marker(x + 13, y - 13, n)}`;
  }).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Deutschlandkarte mit sechs nummerierten Agrarräumen, fünf davon in Bayern und einer in Sachsen-Anhalt",
    body,
  );
}

/** Numbered conurbations with a rough size circle; not a density map. */
export const CONURBATIONS: Array<[number, number, number, number]> = [
  [7.05, 51.4, 30, 1],
  [13.4, 52.5, 22, 2],
  [10.0, 53.55, 17, 3],
  [8.7, 50.1, 18, 4],
  [11.6, 48.15, 17, 5],
  [11.0, 49.5, 13, 6],
];

export function conurbations(): string {
  const m = MAPS.germany;
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${paths(m.layers.states, (s) => (s.id === "Bayern" ? "state state-home" : "state"))}${lakes(m)}${rivers(m)}
  ${place(m, [
    [6.9, 54.55, "Nordsee", "lbl sea-label"],
    [12.9, 54.75, "Ostsee", "lbl sea-label"],
    [6.35, 50.95, "Rhein", "lbl river-label"],
    [11.05, 53.15, "Elbe", "lbl river-label"],
  ])}
  ${CONURBATIONS.map(([lon, lat, r, n]) => {
    const [x, y] = at(m, lon, lat);
    return `<circle class="conurbation" cx="${f1(x)}" cy="${f1(y)}" r="${r}"/>${marker(x + r * 0.7 + 6, y - r * 0.7 - 6, n)}`;
  }).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Deutschlandkarte mit sechs nummerierten Verdichtungsräumen als Kreise unterschiedlicher Größe",
    body,
  );
}
