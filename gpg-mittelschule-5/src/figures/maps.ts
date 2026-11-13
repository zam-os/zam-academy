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
  "world" | "germany" | "bavaria" | "egypt" | "rome" | "limes",
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

/** Land coloured by simplified zones between the lines of latitude. */
export function climateZones(): string {
  const m = MAPS.world;
  const w = m.proj.width;
  const y = (lat: number) => at(m, 0, lat)[1];
  const bands: Array<[string, number, number]> = [
    ["zone-polar", 90, 66.5],
    ["zone-temperate", 66.5, 40],
    ["zone-subtropic", 40, 23.5],
    ["zone-tropic", 23.5, -23.5],
    ["zone-subtropic", -23.5, -40],
    ["zone-temperate", -40, -66.5],
    ["zone-polar", -66.5, -90],
  ];
  const land = paths(m.layers.continents, () => "");
  const clip = bands
    .map(
      ([, top, bottom], i) =>
        `<clipPath id="band-${i}"><rect x="0" y="${f1(Math.max(0, y(top)))}" width="${w}" height="${f1(Math.min(m.proj.height, y(bottom)) - Math.max(0, y(top)))}"/></clipPath>`,
    )
    .join("");
  const zones = bands
    .map(
      ([cls], i) =>
        `<g class="${cls}" clip-path="url(#band-${i})">${land}</g>`,
    )
    .join("");
  const lines: Array<[number, string]> = [
    [66.5, "Nördlicher Polarkreis"],
    [23.5, "Nördlicher Wendekreis"],
    [0, "Äquator"],
    [-23.5, "Südlicher Wendekreis"],
    [-66.5, "Südlicher Polarkreis"],
  ];
  const [gx, gy] = at(m, 10.4, 51.2);
  // Legend in the open South Pacific; the subtropics end at about 40°.
  const entries: Array<[string, string]> = [
    ["zone-tropic", "Tropen"],
    ["zone-subtropic", "Subtropen (bis etwa 40°)"],
    ["zone-temperate", "gemäßigte Zone"],
    ["zone-polar", "polare Zone"],
  ];
  const legend = `<rect class="legend-panel" x="10" y="240" width="190" height="88" rx="8"/>${entries
    .map(
      ([cls, name], i) =>
        `<rect class="swatch ${cls}" x="20" y="${250 + i * 19}" width="16" height="12" rx="2"/>${label(42, 260 + i * 19, name, "lbl tiny", "start")}`,
    )
    .join("")}`;
  const body = `<defs>${clip}</defs>${sea(m)}${zones}${lines
    .map(
      ([lat, name]) =>
        `<line class="${lat === 0 ? "equator" : "latitude"}" x1="0" x2="${w}" y1="${f1(y(lat))}" y2="${f1(y(lat))}"/>${label(w - 6, y(lat) - 4, name, "lbl small", "end")}`,
    )
    .join("")}<path class="star" d="M${f1(gx)} ${f1(gy - 8)}l2.4 5.2 5.6.6-4.2 3.8 1.2 5.5-5-2.9-5 2.9 1.2-5.5-4.2-3.8 5.6-.6z"/>${label(gx + 10, gy - 8, "Deutschland", "lbl small", "start")}${legend}`;
  return svg(
    w,
    m.proj.height,
    "Weltkarte mit vereinfachten Klimazonen: Tropen am Äquator, dann Subtropen, gemäßigte Zone und polare Zone; Deutschland liegt in der gemäßigten Zone",
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

/** Six numbered cities; the workshop asks which city each number is. */
export const BAVARIA_CITIES: Array<[number, number, number]> = [
  [9.93, 49.79, 1],
  [12.1, 49.02, 2],
  [11.58, 48.14, 3],
  [11.08, 49.45, 4],
  [13.46, 48.57, 5],
  [10.9, 48.37, 6],
];

export function bavaria(): string {
  const m = MAPS.bavaria;
  const states = paths(m.layers.states, (s) =>
    s.id === "Bayern" ? "state state-home" : "state",
  );
  const [zx, zy] = at(m, 10.99, 47.42);
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${states}${lakes(m)}${rivers(m)}
  ${place(m, [
    [9.25, 48.75, "Baden-\nWürttemberg", "lbl small muted"],
    [9.3, 50.45, "Hessen", "lbl small muted"],
    [10.9, 50.55, "Thüringen", "lbl small muted"],
    [12.7, 50.5, "Sachsen", "lbl small muted"],
    [13.55, 49.65, "Tschechien", "lbl small muted"],
    [13.2, 47.45, "Österreich", "lbl small muted"],
    [10.55, 50.12, "Main", "lbl river-label"],
    [12.75, 48.68, "Donau", "lbl river-label"],
    [12.25, 48.32, "Isar", "lbl river-label"],
    [12.6, 48.02, "Inn", "lbl river-label"],
    [10.72, 48.2, "Lech", "lbl river-label"],
    [11.12, 49.72, "Regnitz", "lbl river-label"],
  ])}
  <path class="peak" d="M${f1(zx - 8)} ${f1(zy + 6)}L${f1(zx)} ${f1(zy - 8)}L${f1(zx + 8)} ${f1(zy + 6)}Z"/>${label(zx + 11, zy + 4, "Zugspitze", "lbl small", "start")}
  ${BAVARIA_CITIES.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return `${dot(x, y)}${marker(x + 14, y - 14, n)}`;
  }).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Bayern mit den Flüssen Main, Donau, Isar und Inn, der Zugspitze und sechs nummerierten Städten",
    body,
  );
}

export function egypt(): string {
  const m = MAPS.egypt;
  const delta = [
    [31.25, 30.05],
    [30.35, 30.75],
    [29.95, 31.25],
    [30.6, 31.5],
    [31.25, 31.6],
    [31.85, 31.5],
    [32.3, 31.28],
    [31.9, 30.85],
  ]
    .map(([lon, lat], i) => {
      const [x, y] = at(m, lon, lat);
      return `${i ? "L" : "M"}${f1(x)} ${f1(y)}`;
    })
    .join("");
  const nile = (m.layers.rivers ?? []).map((r) => r.d).join("");
  const cities: Array<[number, number, string, "start" | "end"]> = [
    [31.24, 30.04, "Kairo", "start"],
    [31.13, 29.98, "Gizeh (Pyramiden)", "end"],
    [32.64, 25.7, "Theben (Luxor)", "start"],
    [32.9, 24.09, "Assuan", "start"],
  ];
  const [ax, ay] = at(m, 33.6, 27.5);
  const [ax2, ay2] = at(m, 33.6, 29.3);
  const body = `${sea(m)}${paths(m.layers.countries, () => "land desert")}
  <path class="fertile" d="${delta}Z"/><path class="fertile-strip" d="${nile}"/>${lakes(m)}<path class="river nile" d="${nile}"/>
  ${place(m, [
    [27.6, 31.85, "Mittelmeer", "lbl sea-label"],
    [35.4, 27.0, "Rotes\nMeer", "lbl sea-label"],
    [27.2, 26.5, "Wüste", "lbl desert-label"],
    [34.0, 23.3, "Wüste", "lbl desert-label"],
    [31.0, 31.75, "Nildelta", "lbl small"],
    [32.4, 22.3, "Nasser-\nStausee", "lbl small"],
  ])}
  ${cities
    .map(([lon, lat, name, anchor]) => {
      const [x, y] = at(m, lon, lat);
      return `${dot(x, y)}${label(x + (anchor === "start" ? 8 : -8), y + 4, name, "lbl small", anchor)}`;
    })
    .join("")}
  <g class="flow">${`<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(ax2)}" y2="${f1(ay2)}"/><path d="M${f1(ax2)} ${f1(ay2 - 4)}l-6 12h12z"/>`}</g>${labels(ax + 10, ay - 30, "Fließ-\nrichtung:\nNorden", "lbl small", "start")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Ägypten: Der Nil fließt durch die Wüste nach Norden ins Mittelmeer. Nur ein schmaler grüner Streifen am Fluss und das Nildelta sind fruchtbar.",
    body,
  );
}

/** Eight numbered regions; the workshop asks which belonged to the empire. */
export const ROME_MARKERS: Array<[number, number, number]> = [
  [-4, 40, 1],
  [30.5, 26.5, 2],
  [9.6, 56.1, 3],
  [-1.5, 52.4, 4],
  [10, 36, 5],
  [13.4, 52.5, 6],
  [22.2, 39.3, 7],
  [-8, 53.2, 8],
];

export function romanEmpire(): string {
  const m = MAPS.rome;
  const empire = m.layers.empire[0].d;
  const land = paths(m.layers.countries, () => "");
  const [rx, ry] = at(m, 12.5, 41.9);
  const body = `<defs><clipPath id="empire-clip"><path d="${empire}"/></clipPath></defs>${sea(m)}<g class="land outside">${land}</g><g class="empire" clip-path="url(#empire-clip)">${land}</g>
  ${place(m, [
    [17.5, 34.6, "Mittelmeer\n(„mare nostrum“)", "lbl sea-label"],
    [-17, 45, "Atlantik", "lbl sea-label"],
    [35.5, 43.4, "Schwarzes Meer", "lbl sea-label"],
  ])}
  ${dot(rx, ry, "capital")}${label(rx + 8, ry - 6, "Rom", "lbl", "start")}
  ${ROME_MARKERS.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return marker(x, y, n);
  }).join("")}
  <g class="legend"><rect class="legend-box empire-swatch" x="14" y="${m.proj.height - 34}" width="18" height="14"/>${label(38, m.proj.height - 22, "Römisches Reich um 117 n. Chr. (vereinfachte Skizze)", "lbl small", "start")}</g>`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Vereinfachte Karte des Römischen Reiches um 117 nach Christus rund um das Mittelmeer mit Rom und acht nummerierten Gebieten",
    body,
  );
}

export function limes(): string {
  const m = MAPS.limes;
  const states = paths(m.layers.states, (s) =>
    s.id === "Bayern" ? "state state-home" : "state",
  );
  const towns: Array<[number, number, string, "start" | "end"]> = [
    [10.9, 48.37, "Augsburg", "end"],
    [12.1, 49.02, "Regensburg", "start"],
    [10.32, 47.73, "Kempten", "start"],
    [13.46, 48.57, "Passau", "end"],
    [10.97, 49.03, "Weißenburg", "end"],
    [11.78, 48.85, "Eining", "start"],
  ];
  const body = `${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${states}${lakes(m)}${rivers(m)}
  <path class="limes-line" d="${m.layers.limes[0].d}"/><path class="limes-towers" d="${m.layers.limes[0].d}"/>
  ${place(m, [
    [7.0, 49.3, "Rhein", "lbl river-label"],
    [12.55, 48.7, "Donau", "lbl river-label"],
    [10.1, 50.25, "Main", "lbl river-label"],
    [8.2, 48.45, "Römisches Reich\n(Provinzen Obergermanien\nund Raetien)", "lbl rome-label"],
    [11.6, 50.45, "Gebiet freier Germanen", "lbl germanic-label"],
    [9.15, 49.95, "Limes", "lbl limes-label"],
  ])}
  ${towns
    .map(([lon, lat, name, anchor]) => {
      const [x, y] = at(m, lon, lat);
      return `${dot(x, y)}${label(x + (anchor === "start" ? 8 : -8), y + 4, name, "lbl small", anchor)}`;
    })
    .join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Süddeutschland mit dem Limes zwischen Rhein und Donau, Bayern hervorgehoben, und römischen Orten wie Augsburg, Regensburg, Kempten, Passau, Weißenburg und Eining",
    body,
  );
}
