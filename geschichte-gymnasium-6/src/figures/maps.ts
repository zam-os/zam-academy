/**
 * Historical maps rendered from Natural Earth vector layers in src/data/maps.json.
 * Pure local SVG — no tile server, no external requests. Viewport cropping uses
 * transformed `<g>` layers with uniform crisp label sizing in viewBox pixels.
 */
import data from "../data/maps.json";
import { arrow, dot, f1, label, labels, northArrow, panel, pyramidShape, svg } from "./draw";

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

const paths = (shapes: Shape[] | undefined, cls: (s: Shape) => string) =>
  (shapes ?? [])
    .map((s) => `<path class="${cls(s)}" d="${s.d}"/>`)
    .join("");

export const GREECE_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 382,
  y0: 295,
  scale: 4.1,
  width: 620,
  height: 410,
};

export const MED_FULL_W = MAPS.rome.proj.width; // 760
export const MED_FULL_H = MAPS.rome.proj.height; // 596

export const ALEXANDER_FRAME: CropFrame = {
  map: MAPS.world,
  x0: 438,
  y0: 84,
  scale: 4.5,
  width: 640,
  height: 360,
};

export const JUDAEA_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 412,
  y0: 325,
  scale: 2.8,
  width: 620,
  height: 390,
};

export const FRANKS_FRAME: CropFrame = {
  map: MAPS.rome,
  x0: 46,
  y0: 72,
  scale: 1.78,
  width: 620,
  height: 430,
};

/* ---------- LB 2: Ägypten – Geschenk des Nils ---------- */

export function mapEgypt(): string {
  const m = MAPS.egypt;
  const w = 540;
  const h = 380;
  // Center the 380x380 Egypt map on the left and put a clear legend on the right.
  const nile = m.layers.rivers?.[0]?.d ?? "";
  const [ax, ay] = at(m, 29.9, 31.2);
  const [mx, my] = at(m, 31.2, 29.85);
  const [tx, ty] = at(m, 32.65, 25.68);
  const [sx, sy] = at(m, 32.9, 24.09);
  const [dx, dy] = at(m, 31.1, 30.85);

  const body = `<rect class="sea" width="380" height="${h}"/>
    <rect x="380" y="0" width="160" height="${h}" fill="var(--f-panel)"/>
    ${paths(m.layers.countries, (s) => (s.id === "EGY" ? "land desert" : "land neighbour"))}
    ${nile ? `<path class="fertile-strip" d="${nile}"/>` : ""}
    <polygon class="fertile" points="${f1(dx - 24)},${f1(dy - 14)} ${f1(dx + 22)},${f1(dy - 14)} ${f1(mx)},${f1(my - 4)}"/>
    ${nile ? `<path class="river nile" d="${nile}"/>` : ""}
    ${paths(m.layers.lakes, () => "lake")}
    ${dot(mx, my, "capital")}
    ${dot(tx, ty, "city")}
    ${dot(sx, sy, "city")}
    ${dot(ax, ay, "city")}
    ${label(165, 18, "Mittelmeer", "lbl small sea-label")}
    ${labels(342, 260, "Rotes\nMeer", "lbl tiny sea-label", "middle", 13)}
    ${label(dx, dy - 14, "Nildelta (Unterägypten)", "lbl tiny strong")}
    ${label(mx - 12, my + 2, "Memphis & Gizeh", "lbl tiny strong", "end")}
    ${label(tx - 10, ty + 4, "Theben", "lbl tiny strong", "end")}
    ${label(sx - 10, sy + 4, "1. Katarakt (Assuan)", "lbl tiny", "end")}
    ${labels(120, 206, "Wüste\n(„Rotes Land“)", "lbl small muted", "middle", 15)}
    ${labels(226, 158, "Fruchtland\n(„Schwarzes Land“)", "lbl tiny strong", "end", 13)}
    ${arrow(272, 200, 250, 118, "arrow thin")}
    ${arrow(290, 120, 304, 198, "arrow power")}
    ${label(242, 134, "Strömung", "lbl tiny", "end")}
    ${label(308, 172, "Nordwind", "lbl tiny", "start")}
    ${northArrow(352, 32)}
    ${panel(390, 14, 140, 352, "panel-bg")}
    ${label(402, 38, "Kartenlegende", "lbl small strong", "start")}
    <rect x="402" y="54" width="18" height="12" rx="2" class="fertile"/>
    ${label(426, 64, "Fruchtbares Niltal", "lbl tiny", "start")}
    <rect x="402" y="76" width="18" height="12" rx="2" fill="var(--f-sand)" stroke="var(--f-line)"/>
    ${label(426, 86, "Wüste (Sahara)", "lbl tiny", "start")}
    <line x1="402" y1="104" x2="420" y2="104" class="river nile"/>
    ${label(426, 108, "Nil (Süd → Nord)", "lbl tiny", "start")}
    ${dot(411, 126, "capital")}
    ${label(426, 130, "Pyramiden / Residenz", "lbl tiny", "start")}
    ${dot(411, 148, "city")}
    ${label(426, 152, "Wichtiger Ort", "lbl tiny", "start")}
    ${pyramidShape(460, 218, 70, 44, true)}
    ${labels(402, 240, "Warum floss der\nHandel hier so leicht?\n• Flussströmung:\n  nach Norden\n• Nordwind:\n  Segel nach Süden\n\nGrenzen heute:\nzur Orientierung", "lbl tiny", "start", 13.5)}`;

  return svg(
    w,
    h,
    "Geschichtskarte des Alten Ägypten mit Nildelta, fruchtbarem Niltal, Wüste, Gizeh, Theben und erstem Katarakt",
    body,
  );
}

/* ---------- LB 3: Landesnatur Griechenlands und Poleis ---------- */

export function mapGreeceLandesnatur(): string {
  const f = GREECE_FRAME;
  const [atx, aty] = atCrop(f, 23.72, 37.98);
  const [spx, spy] = atCrop(f, 22.43, 37.07);
  const [kox, koy] = atCrop(f, 22.93, 37.94);
  const [dex, dey] = atCrop(f, 22.5, 38.48);
  const [olx, oly] = atCrop(f, 21.63, 37.64);
  const [mix, miy] = atCrop(f, 27.28, 37.53);
  const [thx, thy] = atCrop(f, 22.54, 38.8);

  // Stylized mountain ridges in mainland Greece (Pindos & Peloponnes) to explain isolation
  const mountains = `
    <polygon points="102,90 118,52 134,90" fill="var(--f-stone)" opacity="0.65"/>
    <polygon points="118,125 135,84 152,125" fill="var(--f-stone)" opacity="0.65"/>
    <polygon points="122,226 138,192 154,226" fill="var(--f-stone)" opacity="0.65"/>
    <polygon points="162,135 178,100 194,135" fill="var(--f-stone)" opacity="0.65"/>
  `;

  const body = `${sea(f.width, f.height)}
    ${cropPaths(f, f.map.layers.countries, (s) => (s.id === "GRC" || s.id === "TUR" ? "land" : "land neighbour"))}
    ${mountains}
    ${dot(atx, aty, "capital")}
    ${dot(spx, spy, "capital")}
    ${dot(kox, koy, "city")}
    ${dot(dex, dey, "city")}
    ${dot(olx, oly, "city")}
    ${dot(mix, miy, "city")}
    ${dot(thx, thy, "city")}
    ${label(atx + 8, aty - 8, "Athen (Attika)", "lbl small strong", "start")}
    ${label(spx + 8, spy + 14, "Sparta", "lbl small strong", "start")}
    ${label(kox - 8, koy - 8, "Korinth", "lbl tiny strong", "end")}
    ${label(dex + 8, dey - 2, "Delphi", "lbl tiny strong", "start")}
    ${label(olx - 8, oly + 4, "Olympia", "lbl tiny strong", "end")}
    ${label(mix + 8, miy + 4, "Milet", "lbl tiny strong", "start")}
    ${label(thx - 8, thy - 8, "Thermopylen", "lbl tiny", "end")}
    ${labels(300, 186, "Ägäisches\nMeer", "lbl small sea-label", "middle", 15)}
    ${labels(78, 246, "Ionisches\nMeer", "lbl small sea-label", "middle", 15)}
    ${label(280, 355, "Kreta", "lbl small muted")}
    ${label(435, 165, "Kleinasien", "lbl small muted")}
    ${northArrow(f.width - 28, 30)}
    ${panel(12, 286, 224, 112, "panel-bg")}
    ${labels(24, 308, "Gebirge + Buchten + Inseln:\n• Landwege sind steil und eng\n• Täler trennen die Orte\n• Das Meer verbindet per Schiff\n→ viele unabhängige Stadtstaaten\n   (Poleis) statt eines Großreichs", "lbl tiny", "start", 15)}`;

  return svg(
    f.width,
    f.height,
    "Geschichtskarte der griechischen Landesnatur mit Gebirgen, Inseln und wichtigen Poleis wie Athen, Sparta, Korinth, Delphi, Olympia und Milet",
    body,
  );
}

/* ---------- LB 5: Judäa und jüdische Diaspora ---------- */

export function judaeaDiasporaKarte(): string {
  const f = JUDAEA_FRAME;
  const [jx, jy] = atCrop(f, 35.21, 31.77);
  const [alx, aly] = atCrop(f, 29.92, 31.2);
  const [anx, any_] = atCrop(f, 36.16, 36.2);
  const [atx, aty] = atCrop(f, 23.72, 37.98);
  const [epx, epy] = atCrop(f, 27.34, 37.94);

  const body = `${sea(f.width, f.height)}
    ${cropPaths(f, f.map.layers.countries, () => "land")}
    <path class="route-main" d="M${f1(jx)} ${f1(jy)} Q${f1((jx + alx) / 2)} ${f1(jy + 14)} ${f1(alx)} ${f1(aly)}"/>
    <path class="route-main" d="M${f1(jx)} ${f1(jy)} Q${f1(jx + 18)} ${f1((jy + any_) / 2)} ${f1(anx)} ${f1(any_)}"/>
    <path class="route-sea" d="M${f1(jx)} ${f1(jy)} Q${f1(340)} ${f1(240)} ${f1(epx)} ${f1(epy)}"/>
    <path class="route-sea" d="M${f1(epx)} ${f1(epy)} Q${f1((epx + atx) / 2)} ${f1(epy - 12)} ${f1(atx)} ${f1(aty)}"/>
    <path class="route-alt" d="M${f1(atx)} ${f1(aty)} Q${f1(90)} ${f1(120)} ${f1(22)} ${f1(96)}"/>
    ${dot(jx, jy, "capital")}
    ${dot(alx, aly, "city")}
    ${dot(anx, any_, "city")}
    ${dot(epx, epy, "city")}
    ${dot(atx, aty, "city")}
    ${label(jx - 8, jy - 8, "Jerusalem (Provinz Judäa)", "lbl small strong", "end")}
    ${label(alx + 8, aly + 14, "Alexandria", "lbl tiny strong", "start")}
    ${label(anx + 8, any_ + 4, "Antiochia", "lbl tiny strong", "start")}
    ${label(epx + 8, epy - 6, "Ephesos", "lbl tiny strong", "start")}
    ${label(atx - 8, aty - 8, "Athen", "lbl tiny strong", "end")}
    ${labels(36, 78, "→ nach Rom &\nin den Westen", "lbl tiny strong", "start", 13)}
    ${label(330, 224, "Mittelmeer", "lbl small sea-label")}
    ${northArrow(f.width - 28, 30)}
    ${panel(12, 146, 258, 102, "panel-bg")}
    ${labels(24, 168, "Jüdische Diaspora („Zerstreuung“):\n• 70 n. Chr.: Zerstörung des Tempels\n• 135 n. Chr.: zweiter Aufstand scheitert\n• Gemeinden entstehen rund um das\n  Mittelmeer – verbunden durch die Tora", "lbl tiny", "start", 15)}`;

  return svg(
    f.width,
    f.height,
    "Karte des östlichen Mittelmeerraums zur jüdischen Diaspora von Jerusalem über Alexandria, Antiochia, Ephesos und Athen bis nach Rom",
    body,
  );
}

/* ---------- LB 6: Frankenreich um 800 ---------- */

export const FRANKS_CITIES: Array<{
  name: string;
  lon: number;
  lat: number;
}> = [
  { name: "Aachen", lon: 6.08, lat: 50.77 },
  { name: "Paderborn", lon: 8.75, lat: 51.72 },
  { name: "Regensburg", lon: 12.1, lat: 49.02 },
  { name: "Augsburg", lon: 10.9, lat: 48.37 },
  { name: "Paris", lon: 2.35, lat: 48.86 },
  { name: "Barcelona", lon: 2.17, lat: 41.39 },
  { name: "Rom", lon: 12.5, lat: 41.9 },
];

export function mapFrankenreich800(): string {
  const f = FRANKS_FRAME;
  const [aax, aay] = atCrop(f, 6.08, 50.77);
  const [pax, pay] = atCrop(f, 8.75, 51.72);
  const [rex, rey] = atCrop(f, 12.1, 49.02);
  const [pax2, pay2] = atCrop(f, 2.35, 48.86);
  const [rox, roy] = atCrop(f, 12.5, 41.9);
  const [bax, bay] = atCrop(f, 2.17, 41.39);
  const [inx, iny] = atCrop(f, 10.9, 48.37);

  // Simplified Frankish Empire polygon (~800 AD): Atlantic/Pyrenees to Elbe/Bavaria & Northern/Central Italy
  const franksCoords: Array<[number, number]> = [
    [-4.5, 48.4],
    [1.8, 51.0],
    [5.0, 53.3],
    [9.8, 54.0],
    [11.2, 52.0],
    [13.8, 49.2],
    [15.8, 47.2],
    [14.5, 45.4],
    [14.2, 41.4],
    [11.5, 42.2],
    [9.0, 44.3],
    [4.0, 43.3],
    [2.5, 41.2],
    [-1.5, 42.6],
    [-1.6, 46.5],
  ];
  const franksPoly = franksCoords
    .map(([lon, lat]) => atCrop(f, lon, lat).map(f1).join(","))
    .join(" ");

  const body = `${sea(f.width, f.height)}
    ${cropPaths(f, f.map.layers.countries, () => "land")}
    <polygon class="zone-franks" points="${franksPoly}"/>
    <path class="route-main" d="M${f1(aax)} ${f1(aay)} Q${f1(aax + 24)} ${f1((aay + roy) / 2)} ${f1(rox)} ${f1(roy)}"/>
    ${dot(aax, aay, "capital")}
    ${dot(rox, roy, "capital")}
    ${dot(pax, pay, "city")}
    ${dot(rex, rey, "city")}
    ${dot(pax2, pay2, "city")}
    ${dot(inx, iny, "city")}
    ${dot(bax, bay, "city")}
    ${label(aax + 10, aay + 3, "Aachen (Pfalz)", "lbl small strong", "start")}
    ${label(pax + 8, pay - 6, "Paderborn", "lbl tiny", "start")}
    ${label(rex + 8, rey - 4, "Regensburg", "lbl tiny", "start")}
    ${label(inx - 8, iny + 12, "Augsburg", "lbl tiny", "end")}
    ${label(pax2 - 8, pay2 + 4, "Paris", "lbl tiny", "end")}
    ${label(bax - 8, bay + 4, "Spanische Mark", "lbl tiny", "end")}
    ${label(rox + 10, roy + 4, "Rom (800 Krönung)", "lbl small strong", "start")}
    ${label(315, 388, "Mittelmeer", "lbl small sea-label")}
    ${label(68, 210, "Atlantik", "lbl small sea-label")}
    ${northArrow(f.width - 28, 30)}
    ${panel(12, 12, 236, 122, "panel-bg")}
    <rect x="24" y="26" width="18" height="12" rx="2" class="zone-franks"/>
    ${label(48, 36, "Frankenreich um 800 (vereinfacht)", "lbl tiny strong", "start")}
    <line x1="24" y1="54" x2="42" y2="54" class="route-main"/>
    ${label(48, 58, "Reiseweg nach Rom (800)", "lbl tiny", "start")}
    ${labels(24, 78, "Verbindung dreier Traditionen:\n• Germanisch: Treue & Reisekönigtum\n• Römisch: Kaiseridee & Latein\n• Christlich: Schutz der Kirche", "lbl tiny", "start", 14.5)}`;

  return svg(
    f.width,
    f.height,
    "Geschichtskarte des Frankenreichs um 800 mit Aachen, Paderborn, Regensburg, Rom und der vereinfachten Ausdehnung unter Karl dem Großen",
    body,
  );
}
