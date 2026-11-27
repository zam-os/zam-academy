/**
 * Map figures drawn from src/data/maps.json (Natural Earth, public domain,
 * prepared once by scripts/build-map-data.mjs). Everything is local: no tile
 * server, no external request.
 */
import data from "../data/maps.json";
import { dot, f1, label, labels, marker, part, svg } from "./draw";

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
  "world" | "northAmerica" | "northAmericaEurope" | "europe1942" | "germany1945",
  MapData
>;

export function at(map: MapData, lon: number, lat: number): [number, number] {
  const p = map.proj;
  return [(lon - p.lonMin) * p.k * p.c, (p.latMax - lat) * p.k];
}

const paths = (shapes: Shape[] | undefined, cls: (s: Shape) => string) =>
  (shapes ?? []).map((s) => `<path class="${cls(s)}" d="${s.d}"/>`).join("");

const sea = (m: MapData) =>
  `<rect class="sea" width="${m.proj.width}" height="${m.proj.height}"/>`;

const rivers = (m: MapData) => paths(m.layers.rivers, () => "river");
const lakes = (m: MapData) => paths(m.layers.lakes, () => "lake");

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

/** Seven numbered North American features; the workshop asks for their names. */
export const NORTH_AMERICA_MARKERS: Array<[number, number, number]> = [
  [-114, 48, 1],
  [-81, 36.5, 2],
  [-84.5, 46, 3],
  [-90.5, 34, 4],
  [-101, 41, 5],
  [-90, 25, 6],
  [-150, 64, 7],
];

const NA_CLASS: Record<string, string> = {
  USA: "na-usa",
  CAN: "na-can",
  MEX: "na-mex",
};

export function northAmericaMap(): string {
  const m = MAPS.northAmerica;
  const land = paths(m.layers.countries, (s) => `land ${NA_CLASS[s.id] ?? "neighbour"}`);
  const body = `${sea(m)}${land}${lakes(m)}${rivers(m)}
  ${place(m, [
    [-115, 58, "KANADA", "lbl strong small"],
    [-98, 38, "USA", "lbl strong"],
    [-103, 23, "MEXIKO", "lbl strong small"],
    [-45, 70, "Grönland", "lbl tiny muted"],
    [-142, 36, "Pazifischer\nOzean", "lbl sea-label"],
    [-66, 33, "Atlantischer\nOzean", "lbl sea-label"],
    [-82, 59, "Hudson\nBay", "lbl sea-label"],
  ])}
  ${NORTH_AMERICA_MARKERS.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return marker(x, y, n);
  }).join("")}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Karte von Nordamerika mit Kanada, den USA, Mexiko, den Großen Seen, Mississippi und sieben nummerierten Naturräumen und Gewässern",
    body,
  );
}

export function northAmericaEuropeMap(): string {
  const m = MAPS.northAmericaEurope;
  const isNa = (id: string) => ["USA", "CAN", "MEX", "GRL"].includes(id);
  const land = paths(m.layers.countries, (s) =>
    isNa(s.id) ? "land na-usa" : "land ct-europe",
  );
  const lat50 = at(m, 0, 50)[1];
  const lat35 = at(m, 0, 35)[1];
  const body = `${sea(m)}${land}
  <line class="latitude" x1="0" x2="${m.proj.width}" y1="${f1(lat50)}" y2="${f1(lat50)}"/>
  <line class="latitude" x1="0" x2="${m.proj.width}" y1="${f1(lat35)}" y2="${f1(lat35)}"/>
  ${label(518, lat50 - 5, "50° N (Südkanada ↔ Deutschland)", "lbl tiny", "end")}
  ${label(518, lat35 - 5, "35° N (Süd-USA ↔ Mittelmeer)", "lbl tiny", "end")}
  ${part(
    "na-side",
    "Nordamerika (West-Ost-Breite & Breitenlage)",
    "Die USA liegen größtenteils auf derselben geographischen Breite wie Südeuropa und Nordafrika (etwa 25°–49° N). Große Gebirge verlaufen von Nord nach Süd.",
    `<rect x="14" y="14" width="440" height="${m.proj.height - 28}" rx="10" fill="none" stroke="var(--accent)" stroke-width="2" stroke-dasharray="6 4"/>${label(32, 34, "Nordamerika", "lbl strong small", "start")}`,
  )}
  ${part(
    "eu-side",
    "Europa im Vergleich",
    "Deutschland liegt auf 47°–55° N – so weit nördlich wie das südliche Kanada! Die Alpen verlaufen von West nach Ost.",
    `<rect x="530" y="14" width="256" height="${m.proj.height - 28}" rx="10" fill="none" stroke="var(--gold)" stroke-width="2" stroke-dasharray="6 4"/>${label(772, 34, "Europa", "lbl strong small", "end")}`,
  )}`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Vergleichskarte Nordamerika und Europa im selben Maßstab mit dem 50. und 35. nördlichen Breitengrad",
    body,
  );
}

export function europe1942Map(): string {
  const m = MAPS.europe1942;
  const land = paths(m.layers.countries, () => "");
  const neutralCheSwe = paths(
    m.layers.countries.filter((s) => s.id === "CHE" || s.id === "SWE"),
    () => "",
  );
  const axis = m.layers.axis[0].d;
  const [bx, by] = at(m, 13.4, 52.5);
  const [wx, wy] = at(m, 21.0, 52.2);
  const [px, py] = at(m, 2.35, 48.85);
  const [sx, sy] = at(m, 44.5, 48.7);
  const body = `<defs><clipPath id="axis-clip"><path clip-rule="evenodd" d="${axis}"/></clipPath></defs>
  ${sea(m)}<g class="land outside">${land}</g><g class="empire" clip-path="url(#axis-clip)">${land}</g><g class="land outside">${neutralCheSwe}</g>
  ${place(m, [
    [-7, 47, "Atlantik", "lbl sea-label"],
    [22, 34.8, "Mittelmeer", "lbl sea-label"],
    [34, 43.2, "Schwarzes Meer", "lbl sea-label"],
  ])}
  ${dot(bx, by, "capital")}${label(bx, by - 9, "Berlin", "lbl tiny strong")}
  ${dot(wx, wy)}${label(wx + 8, wy - 5, "Warschau (1939)", "lbl tiny", "start")}
  ${dot(px, py)}${label(px - 8, py - 4, "Paris (1940)", "lbl tiny", "end")}
  ${dot(sx, sy)}${label(sx - 8, sy - 6, "Stalingrad (1942/43)", "lbl tiny", "end")}
  <g class="legend"><rect class="legend-panel" x="10" y="${m.proj.height - 40}" width="385" height="28" rx="6"/><rect class="legend-box empire-swatch" x="18" y="${m.proj.height - 33}" width="18" height="14"/>${label(42, m.proj.height - 21, "Machtbereich der Achsenmächte Ende 1942 (vereinfachte Skizze)", "lbl tiny", "start")}</g>`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Vereinfachte Karte Europas Ende 1942: Machtbereich des Deutschen Reiches und seiner Verbündeten mit Berlin, Warschau, Paris und Stalingrad",
    body,
  );
}

/** Four numbered zones on the 1945 map; the workshop asks for the powers. */
export const GERMANY_ZONE_MARKERS: Array<[number, number, number]> = [
  [8.4, 53.0, 1],
  [11.3, 49.0, 2],
  [7.3, 49.4, 3],
  [12.3, 52.0, 4],
];

export function germany1945Map(): string {
  const m = MAPS.germany1945;
  const states = paths(m.layers.states, () => "state");
  const zones = m.layers.zones ?? [];
  const zPath = (id: string) => zones.find((z) => z.id === id)?.d ?? "";
  const [bx, by] = at(m, 13.4, 52.52);
  const [brx, bry] = at(m, 8.8, 53.08);
  const body = `<defs><clipPath id="deu-clip">${states}</clipPath></defs>
  ${sea(m)}${paths(m.layers.countries, () => "land neighbour")}${states}
  <g clip-path="url(#deu-clip)">
    <rect width="${m.proj.width}" height="${m.proj.height}" fill="#e6c88a" opacity="0.55"/>
    <path d="${zPath("brit")}" fill-rule="evenodd" fill="#90bee8" opacity="0.72"/>
    <path d="${zPath("french")}" fill="#a4d6a4" opacity="0.72"/>
    <path d="${zPath("sbz")}" fill="#e2998d" opacity="0.72"/>
  </g>
  ${lakes(m)}${rivers(m)}
  ${place(m, [
    [6.6, 54.6, "Nordsee", "lbl sea-label"],
    [12.6, 54.75, "Ostsee", "lbl sea-label"],
    [14.9, 53.3, "Polen\n(ab 1945)", "lbl tiny muted"],
    [13.9, 49.9, "Tschechoslowakei", "lbl tiny muted"],
    [6.3, 48.7, "Frankreich", "lbl tiny muted"],
  ])}
  ${dot(bx, by, "capital")}${label(bx, by + 16, "Berlin (4 Sektoren)", "lbl tiny strong")}
  ${dot(brx, bry)}${label(brx + 7, bry + 4, "Bremen (US)", "lbl tiny", "start")}
  ${GERMANY_ZONE_MARKERS.map(([lon, lat, n]) => {
    const [x, y] = at(m, lon, lat);
    return marker(x, y, n);
  }).join("")}
  <g class="legend"><rect class="legend-panel" x="10" y="${m.proj.height - 42}" width="295" height="32" rx="6"/>${label(20, m.proj.height - 22, "Vereinfachte Skizze der 4 Besatzungszonen 1945–1949", "lbl tiny", "start")}</g>`;
  return svg(
    m.proj.width,
    m.proj.height,
    "Vereinfachte Karte der vier Besatzungszonen in Deutschland 1945 bis 1949 und der Viermächtestadt Berlin",
    body,
  );
}
