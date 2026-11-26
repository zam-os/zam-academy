/**
 * Historical maps rendered from Natural Earth vector layers in src/data/maps.json.
 * Pure local SVG — no tile server, no external requests. Viewport cropping uses
 * transformed `<g>` layers with uniform crisp label sizing in viewBox pixels.
 */
import data from "../data/maps.json";
import { arrow, dot, f1, label, labels, northArrow, panel, svg } from "./draw";
import { C } from "./scenes-lb1-2";

export interface Projection {
  lonMin: number;
  latMax: number;
  k: number;
  c: number;
  width: number;
  height: number;
}
export interface Shape {
  id: string;
  d: string;
}
export interface MapData {
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

export interface CropFrame {
  map: MapData;
  x0: number;
  y0: number;
  scale: number;
  width: number;
  height: number;
}

/** Projects (lon, lat) into the cropped viewport pixel space. */
export function atCrop(
  frame: CropFrame,
  lon: number,
  lat: number,
): [number, number] {
  const [mx, my] = at(frame.map, lon, lat);
  return [(mx - frame.x0) * frame.scale, (my - frame.y0) * frame.scale];
}

export function cropPaths(
  frame: CropFrame,
  shapes: Shape[] | undefined,
  cls: (s: Shape) => string,
): string {
  const sw = (0.65 / frame.scale).toFixed(2);
  const paths = (shapes ?? [])
    .map((s) => `<path class="${cls(s)}" d="${s.d}"/>`)
    .join("");
  return `<g transform="scale(${f1(frame.scale)}) translate(${f1(-frame.x0)},${f1(-frame.y0)})" style="stroke-width:${sw}">${paths}</g>`;
}

const sea = (w: number, h: number) =>
  `<rect class="sea" width="${w}" height="${h}"/>`;

/** A named place with geographic coordinates. */
export interface Place {
  name: string;
  lon: number;
  lat: number;
}

/** Sea, land and (optionally) German states drawn into a crop frame. */
export function frameBase(frame: CropFrame, withStates = false): string {
  return `${sea(frame.width, frame.height)}${cropPaths(frame, frame.map.layers.countries, () => "land")}${withStates ? cropPaths(frame, frame.map.layers.states, () => "state") : ""}${cropPaths(frame, frame.map.layers.rivers, () => "river")}${cropPaths(frame, frame.map.layers.lakes, () => "lake")}`;
}

/** Germany with its present-day states as orientation (420 × 527 → scaled). */
export const GERMANY_FRAME: CropFrame = {
  map: MAPS.germany,
  x0: 0,
  y0: 0,
  scale: 1,
  width: 420,
  height: 527,
};

/** Europe and the Mediterranean (whole "rome" section, scaled down). */
export const EUROPE_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 0,
  y0: 0,
  scale: 0.86,
  width: 654,
  height: 512,
};

/** Central Europe and Italy (Ottonen, Fugger, Karl V.). */
export const CENTRAL_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 0,
  y0: 60,
  scale: 1.5,
  width: 630,
  height: 435,
};

/** Route of the crusades from Western Europe to the Levant. */
export const CRUSADE_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 100,
  y0: 100,
  scale: 1.2,
  width: 640,
  height: 460,
};

/** North and Baltic Sea for the Hanse. */
export const HANSE_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 40,
  y0: 0,
  scale: 1.3,
  width: 650,
  height: 270,
};

/** The world (equirectangular), scaled down. */
export const WORLD_FRAME: CropFrame = {
  map: MAPS.world,
  x0: 0,
  y0: 0,
  scale: 0.82,
  width: 656,
  height: 310,
};

export function worldBase(frame: CropFrame = WORLD_FRAME): string {
  return `${sea(frame.width, frame.height)}${cropPaths(frame, frame.map.layers.continents, () => "land")}`;
}

/** Marker dot plus label; `side` places the label right or left of the dot. */
export function place(
  frame: CropFrame,
  p: Place,
  cls = "city",
  side: "start" | "end" = "start",
  labelCls = "lbl tiny strong",
): string {
  const [x, y] = atCrop(frame, p.lon, p.lat);
  const dx = side === "start" ? 8 : -8;
  return `${dot(x, y, cls)}${label(x + dx, y + 4, p.name, labelCls, side)}`;
}

/* ---------- LB 1: Pfalzen und Reisekönigtum ---------- */

export const PFALZEN: Place[] = [
  { name: "Aachen", lon: 6.08, lat: 50.77 },
  { name: "Ingelheim", lon: 8.06, lat: 49.97 },
  { name: "Frankfurt", lon: 8.68, lat: 50.11 },
  { name: "Goslar", lon: 10.43, lat: 51.9 },
  { name: "Quedlinburg", lon: 11.15, lat: 51.79 },
  { name: "Magdeburg", lon: 11.63, lat: 52.13 },
  { name: "Merseburg", lon: 11.99, lat: 51.36 },
  { name: "Bamberg", lon: 10.89, lat: 49.89 },
  { name: "Regensburg", lon: 12.1, lat: 49.02 },
];

export function pfalzenKarte(): string {
  const f = GERMANY_FRAME;
  const route = PFALZEN.map((p) => atCrop(f, p.lon, p.lat));
  const order = [0, 1, 2, 7, 8, 6, 5, 4, 3, 0];
  const d = order.map((i, k) => `${k === 0 ? "M" : "L"}${f1(route[i][0])} ${f1(route[i][1])}`).join("");
  return svg(
    f.width,
    f.height,
    "Karte wichtiger Königspfalzen im Reich der Ottonen und Salier mit einem beispielhaften Reiseweg des Hofes",
    `${frameBase(f, true)}
     <path d="${d}" fill="none" stroke="var(--f-red)" stroke-width="2.4" stroke-dasharray="6 4"/>
     ${PFALZEN.map((p, i) => place(f, p, i === 0 || i === 3 ? "capital" : "city", ["Ingelheim", "Goslar"].includes(p.name) ? "end" : "start")).join("")}
     ${panel(10, 420, 250, 96, "panel-bg")}
     <line x1="22" y1="440" x2="44" y2="440" stroke="var(--f-red)" stroke-width="2.4" stroke-dasharray="6 4"/>
     ${label(50, 444, "Beispiel für einen Reiseweg", "lbl tiny", "start")}
     ${dot(33, 462, "capital")}${label(50, 466, "häufig besuchte Pfalz", "lbl tiny", "start")}
     ${labels(22, 486, "Heutige Ländergrenzen nur zur Orientierung;\ndie Route ist ein vereinfachtes Beispiel.", "lbl tiny muted", "start", 13)}
     ${northArrow(f.width - 26, 28)}`,
  );
}

/* ---------- LB 3: Konstantinopel 1453 (Schema) ---------- */

export function konstantinopelKarte(): string {
  return svg(
    620,
    360,
    "Schematische Karte der Belagerung Konstantinopels 1453 mit Landmauern, Goldenem Horn, Bosporus, Marmarameer und dem Landweg der osmanischen Schiffe",
    `<rect width="620" height="360" class="sea"/>
     <path d="M0 0H250L300 120L250 150L160 200L0 260Z" class="land"/>
     <path d="M340 0H620V360H420L380 250L360 140Z" class="land"/>
     <path d="M110 150L250 95L300 120L250 150L160 200Z" fill="${C.purple}" opacity="0.55" stroke="var(--f-ink)"/>
     <path d="M110 150L160 200" stroke="var(--f-ink)" stroke-width="6"/>
     ${labels(186, 150, "Konstantinopel", "lbl small strong", "middle", 14)}
     <path d="M250 95Q200 60 150 70" fill="none" stroke="var(--f-sea)" stroke-width="14"/>
     ${label(150, 54, "Goldenes Horn", "lbl tiny strong")}
     <path d="M330 40Q350 120 330 200" fill="none" stroke="none"/>
     ${labels(338, 70, "Bos-\nporus", "lbl tiny sea-label", "middle", 13)}
     ${label(220, 300, "Marmarameer", "lbl small sea-label")}
     <path d="M300 30Q260 40 240 60" fill="none" stroke="${C.red}" stroke-width="3" stroke-dasharray="6 4"/>
     ${labels(300, 22, "Schiffe über Land", "lbl tiny strong", "start", 13)}
     ${arrow(40, 170, 102, 160, "arrow power")}
     ${arrow(60, 230, 120, 190, "arrow power")}
     ${labels(14, 120, "Osmanisches Heer\nmit Kanonen", "lbl tiny strong", "start", 13)}
     ${labels(100, 230, "Landmauern", "lbl tiny strong", "start", 13)}
     ${labels(440, 300, "Kleinasien", "lbl small muted", "middle", 14)}
     ${label(470, 344, "Schema, nicht maßstabsgetreu", "lbl tiny muted")}`,
  );
}

/* ---------- LB 3: Europäisierung der Welt um 1650 ---------- */

export const COLONIES: Array<Place & { power: "es" | "pt" | "nl" | "en" | "fr"; side: "start" | "end"; dy: number }> = [
  { name: "Mexiko", lon: -99.13, lat: 19.43, power: "es", side: "end", dy: 4 },
  { name: "Lima", lon: -77.04, lat: -12.05, power: "es", side: "end", dy: 4 },
  { name: "Potosí", lon: -65.75, lat: -19.58, power: "es", side: "start", dy: 8 },
  { name: "Manila", lon: 120.98, lat: 14.6, power: "es", side: "start", dy: 8 },
  { name: "Salvador", lon: -38.5, lat: -12.97, power: "pt", side: "end", dy: 4 },
  { name: "Luanda", lon: 13.23, lat: -8.84, power: "pt", side: "end", dy: 4 },
  { name: "Goa", lon: 73.83, lat: 15.5, power: "pt", side: "start", dy: 4 },
  { name: "Macau", lon: 113.54, lat: 22.2, power: "pt", side: "end", dy: -4 },
  { name: "Batavia", lon: 106.85, lat: -6.2, power: "nl", side: "start", dy: 8 },
  { name: "Neu-Amsterdam", lon: -74.0, lat: 40.7, power: "nl", side: "start", dy: 4 },
  { name: "Jamestown", lon: -76.78, lat: 37.21, power: "en", side: "end", dy: 10 },
  { name: "Québec", lon: -71.2, lat: 46.8, power: "fr", side: "start", dy: -2 },
];

export const POWER_COLOURS: Record<string, { c: string; n: string }> = {
  es: { c: "#d4483b", n: "Spanien" },
  pt: { c: "#2e8b57", n: "Portugal" },
  nl: { c: "#f09a2e", n: "Niederlande" },
  en: { c: "#2f7fd0", n: "England" },
  fr: { c: "#8c62d0", n: "Frankreich" },
};

export function europaeisierungKarte(): string {
  const f = WORLD_FRAME;
  return svg(
    f.width,
    f.height + 60,
    "Weltkarte um 1650 mit wichtigen Kolonien und Stützpunkten Spaniens, Portugals, der Niederlande, Englands und Frankreichs",
    `${worldBase(f)}
     ${COLONIES.map((p) => {
       const [x, y] = atCrop(f, p.lon, p.lat);
       return `<circle cx="${f1(x)}" cy="${f1(y)}" r="5.5" fill="${POWER_COLOURS[p.power].c}" stroke="var(--f-halo)" stroke-width="1.5"/>${label(x + (p.side === "start" ? 8 : -8), y + p.dy, p.name, "lbl tiny strong", p.side)}`;
     }).join("")}
     <rect x="0" y="${f.height}" width="${f.width}" height="60" fill="var(--f-panel)"/>
     ${Object.values(POWER_COLOURS)
       .map((p, i) => `<circle cx="${24 + i * 126}" cy="${f.height + 20}" r="6" fill="${p.c}"/>${label(36 + i * 126, f.height + 24, p.n, "lbl tiny strong", "start")}`)
       .join("")}
     ${label(f.width / 2, f.height + 48, "Stand um 1650 · Punkte zeigen Hauptorte und Stützpunkte, keine genauen Grenzen", "lbl tiny muted")}`,
  );
}

/* ---------- LB 4: Limes ---------- */

export const LIMES_FRAME: CropFrame = {
  map: MAPS.limes,
  x0: 0,
  y0: 0,
  scale: 1.2,
  width: 624,
  height: 431,
};

export function limesHandelKarte(): string {
  const f = LIMES_FRAME;
  const places: Array<Place & { side: "start" | "end"; cls: string }> = [
    { name: "Limestor Dalkingen", lon: 10.19, lat: 48.93, side: "end", cls: "capital" },
    { name: "Saalburg", lon: 8.57, lat: 50.27, side: "start", cls: "city" },
    { name: "Weißenburg", lon: 10.97, lat: 49.03, side: "start", cls: "city" },
    { name: "Eining (Donau)", lon: 11.78, lat: 48.85, side: "start", cls: "city" },
    { name: "Augsburg", lon: 10.9, lat: 48.37, side: "start", cls: "city" },
    { name: "Mainz", lon: 8.27, lat: 50.0, side: "end", cls: "city" },
  ];
  return svg(
    f.width,
    f.height,
    "Karte des Obergermanisch-Raetischen Limes mit kontrollierten Durchgängen wie dem Limestor Dalkingen und Handelsrichtungen zwischen Römern und Germanen",
    `${frameBase(f, true)}
     ${cropPaths(f, f.map.layers.limes, () => "limes-line")}
     ${cropPaths(f, f.map.layers.limes, () => "limes-towers")}
     ${places.map((p) => place(f, p, p.cls, p.side)).join("")}
     ${label(360, 110, "freies Germanien", "lbl small strong")}
     ${label(300, 380, "Provinz Raetien", "lbl small strong")}
     ${label(90, 300, "Provinz Obergermanien", "lbl small strong")}
     ${(() => {
       const [x, y] = atCrop(f, 10.19, 48.93);
       return `${arrow(x - 4, y - 46, x - 2, y - 10, "arrow power")}${arrow(x + 12, y + 44, x + 10, y + 10, "arrow power")}${labels(x - 10, y - 40, "Vieh, Leder,\nBernstein ↓", "lbl tiny strong", "end", 13)}${labels(x - 6, y + 40, "↑ Wein, Geschirr,\nGlas, Münzen", "lbl tiny strong", "end", 13)}`;
     })()}
     ${panel(400, 14, 210, 76, "panel-bg")}
     <line x1="412" y1="34" x2="436" y2="34" class="limes-line"/>
     ${label(442, 38, "Limes (vereinfacht)", "lbl tiny", "start")}
     ${dot(424, 56, "capital")}${label(442, 60, "kontrollierter Durchgang", "lbl tiny", "start")}
     ${label(412, 80, "Heutige Grenzen zur Orientierung", "lbl tiny muted", "start")}`,
  );
}

/* ---------- LB 4: Fugger ---------- */

export const FUGGER_PLACES: Place[] = [
  { name: "Augsburg", lon: 10.9, lat: 48.37 },
  { name: "Schwaz (Silber)", lon: 11.71, lat: 47.35 },
  { name: "Neusohl (Kupfer)", lon: 19.15, lat: 48.74 },
  { name: "Antwerpen", lon: 4.4, lat: 51.22 },
  { name: "Venedig", lon: 12.33, lat: 45.44 },
  { name: "Rom", lon: 12.5, lat: 41.9 },
  { name: "Lissabon", lon: -9.14, lat: 38.72 },
];

export function fuggerKarte(): string {
  const f = CENTRAL_FRAME;
  const [ax, ay] = atCrop(f, 10.9, 48.37);
  return svg(
    f.width,
    f.height,
    "Karte des Handelsnetzes der Fugger mit Augsburg, Bergwerken in Schwaz und Neusohl sowie Niederlassungen in Antwerpen, Venedig, Rom und Lissabon",
    `${frameBase(f)}
     ${FUGGER_PLACES.slice(1)
       .map((p) => {
         const [x, y] = atCrop(f, p.lon, p.lat);
         return `<line x1="${f1(ax)}" y1="${f1(ay)}" x2="${f1(x)}" y2="${f1(y)}" stroke="${C.ochre}" stroke-width="2.4" stroke-dasharray="5 3"/>`;
       })
       .join("")}
     ${FUGGER_PLACES.map((p, i) => place(f, p, i === 0 ? "capital" : "city", p.lon > 15 ? "end" : "start", i === 0 ? "lbl small strong" : "lbl tiny strong")).join("")}
     ${panel(12, 12, 240, 92, "panel-bg")}
     ${dot(26, 32, "capital")}${label(40, 36, "Firmensitz Augsburg", "lbl tiny", "start")}
     <line x1="18" y1="54" x2="38" y2="54" stroke="${C.ochre}" stroke-width="2.4" stroke-dasharray="5 3"/>
     ${label(44, 58, "Handel, Bergbau, Geldgeschäfte", "lbl tiny", "start")}
     ${label(24, 86, "Heutige Grenzen zur Orientierung", "lbl tiny muted", "start")}
     ${northArrow(f.width - 26, 28)}`,
  );
}

/* ---------- LB 5: Karl V. und Bauernkrieg ---------- */

export function karlVReich(): string {
  const f = EUROPE_FRAME;
  const lands: Array<Place & { side: "start" | "end" }> = [
    { name: "Spanien", lon: -3.7, lat: 40.4, side: "start" },
    { name: "Niederlande", lon: 4.35, lat: 50.85, side: "end" },
    { name: "Österreichische Länder", lon: 16.37, lat: 48.21, side: "start" },
    { name: "Neapel", lon: 14.25, lat: 40.85, side: "start" },
    { name: "Sizilien", lon: 13.36, lat: 38.12, side: "end" },
    { name: "Mailand", lon: 9.19, lat: 45.46, side: "end" },
  ];
  const [rx, ry] = atCrop(f, 9.5, 50.5);
  return svg(
    f.width,
    f.height,
    "Karte der Länder Karls V.: Spanien, Niederlande, österreichische Länder, Neapel, Sizilien und Mailand sowie die Besitzungen in Amerika; dazu das Reich, in dem er Kaiser war",
    `${frameBase(f)}
     <ellipse cx="${f1(rx)}" cy="${f1(ry)}" rx="70" ry="48" fill="${C.red}" opacity="0.18" stroke="${C.red}" stroke-dasharray="5 3"/>
     ${label(rx, ry - 52, "Heiliges Römisches Reich (Kaiser)", "lbl tiny strong")}
     ${lands
       .map((p) => {
         const [x, y] = atCrop(f, p.lon, p.lat);
         return `<circle cx="${f1(x)}" cy="${f1(y)}" r="9" fill="${C.ochre}" stroke="var(--f-halo)" stroke-width="2"/>${label(x + (p.side === "start" ? 12 : -12), y + 4, p.name, "lbl tiny strong", p.side)}`;
       })
       .join("")}
     ${arrow(60, 330, 10, 330, "arrow power")}
     ${labels(16, 310, "Amerika", "lbl tiny strong", "start", 13)}
     ${panel(380, 400, 262, 100, "panel-bg")}
     <circle cx="396" cy="420" r="8" fill="${C.ochre}"/>${label(410, 424, "Erblande und Königreiche Karls", "lbl tiny", "start")}
     <rect x="388" y="436" width="16" height="12" fill="${C.red}" opacity="0.3"/>${label(410, 446, "Reich, dessen Kaiser er war", "lbl tiny", "start")}
     ${labels(390, 468, "Kriege gegen Frankreich und die\nOsmanen banden seine Kräfte.", "lbl tiny muted", "start", 13)}`,
  );
}

export function bauernkriegKarte(): string {
  const f = GERMANY_FRAME;
  const sites: Array<Place & { side: "start" | "end"; cls: string }> = [
    { name: "Memmingen (Zwölf Artikel)", lon: 10.18, lat: 47.99, side: "start", cls: "capital" },
    { name: "Weinsberg", lon: 9.29, lat: 49.15, side: "end", cls: "city" },
    { name: "Würzburg (Marienberg)", lon: 9.93, lat: 49.79, side: "start", cls: "city" },
    { name: "Frankenhausen", lon: 11.1, lat: 51.36, side: "start", cls: "city" },
    { name: "Mühlhausen", lon: 10.45, lat: 51.21, side: "end", cls: "city" },
  ];
  const zone = (lon: number, lat: number, rx: number, ry: number, name: string) => {
    const [x, y] = atCrop(f, lon, lat);
    return `<ellipse cx="${f1(x)}" cy="${f1(y)}" rx="${rx}" ry="${ry}" fill="${C.red}" opacity="0.2"/>${label(x + rx - 6, y + ry - 6, name, "lbl tiny strong", "end")}`;
  };
  return svg(
    f.width,
    f.height,
    "Karte des Bauernkriegs 1524/25 mit den Aufstandsgebieten Schwaben, Franken und Thüringen sowie Memmingen, Weinsberg, Würzburg, Mühlhausen und Frankenhausen",
    `${frameBase(f, true)}
     ${zone(9.9, 48.1, 70, 40, "Schwaben")}
     ${zone(9.9, 49.6, 60, 36, "Franken")}
     ${zone(10.9, 51.1, 50, 30, "Thüringen")}
     ${sites.map((p) => place(f, p, p.cls, p.side)).join("")}
     ${panel(10, 10, 260, 96, "panel-bg")}
     <ellipse cx="30" cy="32" rx="14" ry="9" fill="${C.red}" opacity="0.3"/>${label(50, 36, "Aufstandsgebiet (vereinfacht)", "lbl tiny", "start")}
     ${dot(30, 56, "capital")}${label(50, 60, "Zwölf Artikel, März 1525", "lbl tiny", "start")}
     ${labels(22, 80, "Auch im Elsass, in Tirol und im Salzburger\nLand erhoben sich Bauern.", "lbl tiny muted", "start", 13)}
     ${northArrow(f.width - 26, 28)}`,
  );
}

/* ---------- LB 6: Residenzen in Bayern ---------- */

export const BAVARIA_FRAME: CropFrame = {
  map: MAPS.bavaria,
  x0: 0,
  y0: 0,
  scale: 1.3,
  width: 598,
  height: 590,
};

export function residenzKarte(): string {
  const f = BAVARIA_FRAME;
  const res: Array<Place & { side: "start" | "end" }> = [
    { name: "Würzburg: Residenz", lon: 9.93, lat: 49.79, side: "end" },
    { name: "Bamberg: Neue Residenz", lon: 10.89, lat: 49.89, side: "start" },
    { name: "Bayreuth: Opernhaus", lon: 11.58, lat: 49.94, side: "start" },
    { name: "Ansbach: Residenz", lon: 10.57, lat: 49.3, side: "start" },
    { name: "Schleißheim", lon: 11.56, lat: 48.25, side: "start" },
    { name: "München: Nymphenburg", lon: 11.5, lat: 48.16, side: "end" },
    { name: "Kempten: Residenz", lon: 10.32, lat: 47.73, side: "start" },
  ];
  return svg(
    f.width,
    f.height,
    "Karte barocker Residenzen in Altbayern, Franken und Schwaben: Würzburg, Bamberg, Bayreuth, Ansbach, Schleißheim, Nymphenburg und Kempten",
    `${frameBase(f, true)}
     ${res.map((p, i) => {
       const [x, y] = atCrop(f, p.lon, p.lat);
       const dy = p.name.startsWith("Bayreuth") ? -10 : p.name.startsWith("Bamberg") ? 16 : 4;
       return `${dot(x, y, i === 4 || i === 6 ? "capital" : "city")}${label(x + (p.side === "start" ? 8 : -8), y + dy, p.name, "lbl tiny strong", p.side)}`;
     }).join("")}
     ${label(170, 120, "Franken", "lbl small muted")}
     ${label(420, 360, "Altbayern", "lbl small muted")}
     ${label(150, 470, "Schwaben", "lbl small muted")}
     ${panel(372, 470, 216, 108, "panel-bg")}
     ${dot(386, 490, "capital")}${label(400, 494, "Beispiele dieser Lektion", "lbl tiny", "start")}
     ${dot(386, 512, "city")}${label(400, 516, "weitere Residenzen", "lbl tiny", "start")}
     ${labels(384, 538, "Heutige Grenzen Bayerns nur\nzur Orientierung", "lbl tiny muted", "start", 13)}
     ${northArrow(f.width - 26, 28)}`,
  );
}
