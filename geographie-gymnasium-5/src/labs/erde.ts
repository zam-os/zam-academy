/** Labs of Lernbereich 1 and 2: orientation, maps, diagrams and the Earth. */
import { MAPS } from "../figures/maps";
import {
  choice,
  clamp,
  f1,
  fmt,
  handle,
  labSvg,
  type LabDef,
  type LabState,
  num,
  range,
  readout,
  snap,
  str,
  text,
} from "./core";

/* ---------- Himmelsrichtungen ---------- */

const SCHOOL: [number, number] = [320, 200];
const DIRECTIONS = [
  ["N", "nördlich"],
  ["NO", "nordöstlich"],
  ["O", "östlich"],
  ["SO", "südöstlich"],
  ["S", "südlich"],
  ["SW", "südwestlich"],
  ["W", "westlich"],
  ["NW", "nordwestlich"],
] as const;
/** One drawing unit is 2 m in the fictional neighbourhood. */
export const KOMPASS_METRES_PER_UNIT = 2;

export function direction(x: number, y: number): { code: string; word: string; metres: number } {
  const dx = x - SCHOOL[0],
    dy = y - SCHOOL[1];
  const metres = Math.round((Math.hypot(dx, dy) * KOMPASS_METRES_PER_UNIT) / 10) * 10;
  if (Math.hypot(dx, dy) < 40) return { code: "", word: "", metres };
  const angle = ((Math.atan2(dx, -dy) * 180) / Math.PI + 360) % 360;
  const [code, word] = DIRECTIONS[Math.round(angle / 45) % 8];
  return { code, word, metres };
}

const kompassGoal = (code: string) => (s: LabState) =>
  direction(num(s, "x"), num(s, "y")).code === code;

export const kompass: LabDef = {
  id: "kompass",
  title: "Himmelsrichtungen rund um die Schule",
  intro:
    "Ziehe den roten Punkt über die Karte. Oben ist Norden. Die Anzeige sagt dir, in welcher Richtung der Punkt von der Schule aus liegt.",
  initial: () => ({ x: 320, y: 70 }),
  goals: [
    { text: "Setze den Punkt nordöstlich (NO) der Schule, zur Kirche.", reached: kompassGoal("NO") },
    { text: "Setze den Punkt südwestlich (SW) der Schule, zum Sportplatz.", reached: kompassGoal("SW") },
    { text: "Setze den Punkt genau westlich (W) der Schule, zum Bahnhof.", reached: kompassGoal("W") },
  ],
  handles: {
    p: {
      pos: (s) => [num(s, "x"), num(s, "y")],
      move: (s, x, y) => ({ ...s, x: Math.round(clamp(x, 20, 620)), y: Math.round(clamp(y, 20, 380)) }),
      step: 10,
    },
  },
  witnesses: [
    { x: 440, y: 85 },
    { x: 200, y: 320 },
    { x: 140, y: 205 },
  ],
  note: "Erfundenes Viertel. Die Richtungen sind in Achtelkreise eingeteilt; in der Wirklichkeit hilft dir ein Kompass oder der Sonnenstand.",
  render(s) {
    const x = num(s, "x"),
      y = num(s, "y");
    const d = direction(x, y);
    const rays = DIRECTIONS.map(([code], i) => {
      const a = (i * 45 * Math.PI) / 180;
      const ex = SCHOOL[0] + Math.sin(a) * 300,
        ey = SCHOOL[1] - Math.cos(a) * 300;
      const lx = SCHOOL[0] + Math.sin(a) * 58,
        ly = SCHOOL[1] - Math.cos(a) * 58 + 4;
      return `<line class="ray ${d.code === code ? "ray-on" : ""}" x1="${SCHOOL[0]}" y1="${SCHOOL[1]}" x2="${f1(ex)}" y2="${f1(ey)}"/>${text(lx, ly, code, "lbl tiny strong")}`;
    }).join("");
    const body = `<rect class="paper" x="0" y="0" width="640" height="400" rx="12"/>
      <path class="park" d="M250 20h140v70h-140z"/>${text(320, 45, "Stadtwald", "lbl tiny")}
      <path class="river-line" d="M0 120C120 140 180 90 300 110S520 150 640 120"/>
      <path class="road-line" d="M0 205H640M320 0V400"/>
      <path class="rail-line" d="M60 0V400"/>
      ${rays}
      <g class="building"><rect x="420" y="55" width="44" height="40" rx="3"/><path d="M420 55l22-22 22 22z"/></g>${text(442, 112, "Kirche", "lbl tiny")}
      <g class="field"><rect x="150" y="285" width="100" height="62" rx="8"/></g>${text(200, 365, "Sportplatz", "lbl tiny")}
      <g class="station-box"><rect x="96" y="186" width="70" height="36" rx="4"/></g>${text(131, 240, "Bahnhof", "lbl tiny")}
      <g class="pool"><rect x="420" y="290" width="90" height="50" rx="10"/></g>${text(465, 360, "Freibad", "lbl tiny")}
      <g class="school"><rect x="298" y="180" width="44" height="40" rx="4"/></g>${text(320, 236, "Schule", "lbl small strong")}
      <g class="rose" transform="translate(580 60)"><circle r="34" class="compass"/><path class="needle-n" d="M0-30L7 0H-7Z"/><path class="needle-s" d="M0 30L7 0H-7Z"/>${text(0, -38, "N", "lbl small strong")}</g>
      <path class="scale-bar" d="M30 375h50"/>${text(55, 368, "100 m", "lbl tiny")}
      ${handle("p", x, y, "Roter Punkt", "handle-red")}`;
    return `${labSvg(640, 400, "Karte eines erfundenen Viertels mit Schule in der Mitte, Kirche, Sportplatz, Bahnhof, Freibad, Fluss und einem verschiebbaren roten Punkt", body)}${readout(
      d.code
        ? `Der Punkt liegt <strong>${d.word}</strong> (${d.code}) der Schule, etwa ${fmt(d.metres, 0)} m entfernt.`
        : "Der Punkt ist direkt bei der Schule. Ziehe ihn weiter weg.",
      d.code ? "good" : "",
    )}`;
  },
};

/* ---------- Gradnetz ---------- */

const W = MAPS.world;
export const worldAt = (lon: number, lat: number): [number, number] => [
  (lon - W.proj.lonMin) * W.proj.k * W.proj.c,
  (W.proj.latMax - lat) * W.proj.k,
];
export function latText(lat: number): string {
  return lat === 0 ? "0° (Äquator)" : `${fmt(Math.abs(lat), 0)}° ${lat > 0 ? "N" : "S"}`;
}
export function lonText(lon: number): string {
  return lon === 0 ? "0° (Nullmeridian)" : Math.abs(lon) === 180 ? "180°" : `${fmt(Math.abs(lon), 0)}° ${lon > 0 ? "O" : "W"}`;
}
const near = (s: LabState, lat: number, lon: number, dLat: number, dLon: number) =>
  Math.abs(num(s, "lat") - lat) <= dLat && Math.abs(num(s, "lon") - lon) <= dLon;

export const gradnetz: LabDef = {
  id: "gradnetz",
  title: "Orte im Gradnetz finden",
  intro:
    "Ziehe das Fadenkreuz über die Weltkarte. Die Anzeige nennt zuerst die Breite (Nord oder Süd), dann die Länge (Ost oder West).",
  initial: () => ({ lat: 40, lon: -100 }),
  goals: [
    { text: "Finde den Schnittpunkt von Äquator und Nullmeridian (0° | 0°).", reached: (s) => near(s, 0, 0, 2, 2) },
    { text: "Finde München: etwa 48° N und 12° O.", reached: (s) => near(s, 48, 11.6, 2, 3) },
    { text: "Finde Sydney in Australien: etwa 34° S und 151° O.", reached: (s) => near(s, -33.9, 151.2, 3, 3) },
  ],
  handles: {
    cross: {
      pos: (s) => worldAt(num(s, "lon"), num(s, "lat")),
      move: (s, x, y) => ({
        ...s,
        lon: clamp(Math.round(x / (W.proj.k * W.proj.c) + W.proj.lonMin), -180, 180),
        lat: clamp(Math.round(W.proj.latMax - y / W.proj.k), -80, 80),
      }),
      step: W.proj.k,
    },
  },
  witnesses: [
    { lat: 0, lon: 0 },
    { lat: 48, lon: 12 },
    { lat: -34, lon: 151 },
  ],
  note: "Die Weltkarte ist flach und verzerrt die Gebiete nahe den Polen. Auf dem Globus treffen sich alle Meridiane an den Polen.",
  render(s) {
    const lat = num(s, "lat"),
      lon = num(s, "lon");
    const [cx, cy] = worldAt(lon, lat);
    const lats = [-60, -30, 0, 30, 60]
      .map((b) => {
        const [, yy] = worldAt(0, b);
        return `<line class="${b === 0 ? "equator" : "grid"}" x1="0" x2="${W.proj.width}" y1="${f1(yy)}" y2="${f1(yy)}"/>${text(4, yy - 4, b === 0 ? "0° Äquator" : `${Math.abs(b)}° ${b > 0 ? "N" : "S"}`, "lbl tiny", "start")}`;
      })
      .join("");
    const lons = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150]
      .map((l) => {
        const [xx] = worldAt(l, 0);
        return `<line class="${l === 0 ? "meridian0" : "grid"}" x1="${f1(xx)}" x2="${f1(xx)}" y1="0" y2="${W.proj.height}"/>${l % 60 === 0 ? text(xx + 3, W.proj.height - 6, l === 0 ? "0°" : `${Math.abs(l)}° ${l > 0 ? "O" : "W"}`, "lbl tiny", "start") : ""}`;
      })
      .join("");
    const body = `<rect class="sea" width="${W.proj.width}" height="${W.proj.height}"/>${W.layers.continents.map((c) => `<path class="land" d="${c.d}"/>`).join("")}${lats}${lons}
      <line class="crosshair" x1="${f1(cx)}" x2="${f1(cx)}" y1="0" y2="${W.proj.height}"/><line class="crosshair" x1="0" x2="${W.proj.width}" y1="${f1(cy)}" y2="${f1(cy)}"/>
      ${handle("cross", cx, cy, "Fadenkreuz", "handle-red", 9)}`;
    return `${labSvg(W.proj.width, W.proj.height, "Weltkarte mit Breitenkreisen alle 30 Grad, Äquator, Nullmeridian und einem verschiebbaren Fadenkreuz", body)}${readout(
      `Breite: <strong>${latText(lat)}</strong> · Länge: <strong>${lonText(lon)}</strong> · Du liegst auf der ${lat > 0 ? "Nordhalbkugel" : lat < 0 ? "Südhalbkugel" : "Grenze der beiden Halbkugeln"}.`,
    )}`;
  },
};

/* ---------- Maßstab ---------- */

export const SCALES = [25000, 50000, 100000, 1000000];
/** Real distance in metres for a map distance in centimetres. */
export const realMetres = (cm: number, denominator: number): number =>
  (cm * denominator) / 100;
export function distanceText(metres: number): string {
  return metres < 1000 ? `${fmt(metres, 0)} m` : `${fmt(metres / 1000, 2)} km`;
}
const scaleIs = (s: LabState, d: number, cm: number) =>
  num(s, "scale") === d && num(s, "cm") === cm;

export const massstab: LabDef = {
  id: "massstab",
  title: "Kartenstrecke und Wirklichkeit",
  intro:
    "Wähle einen Maßstab und stelle die gemessene Kartenstrecke ein. Die Anzeige rechnet in die wirkliche Entfernung um.",
  initial: () => ({ cm: 2, scale: 50000 }),
  goals: [
    { text: "Bei 1 : 25 000: Welche Kartenstrecke entspricht 1 km in der Wirklichkeit?", reached: (s) => scaleIs(s, 25000, 4) },
    { text: "Bei 1 : 100 000: Stelle eine Strecke von 3,5 km in der Wirklichkeit ein.", reached: (s) => scaleIs(s, 100000, 3.5) },
    { text: "Bei 1 : 1 000 000: Stelle 75 km Luftlinie ein, etwa von München nach Ingolstadt.", reached: (s) => scaleIs(s, 1000000, 7.5) },
  ],
  witnesses: [
    { cm: 4, scale: 25000 },
    { cm: 3.5, scale: 100000 },
    { cm: 7.5, scale: 1000000 },
  ],
  note: "Die Zentimeter auf dem Bildschirm sind keine echten Zentimeter. Miss auf einer Papierkarte mit dem Lineal.",
  render(s) {
    const cm = num(s, "cm"),
      d = num(s, "scale");
    const metres = realMetres(cm, d);
    const unit = 55;
    const ax = 40,
      bx = ax + cm * unit;
    const ticks = Array.from({ length: 11 }, (_, i) => `<line class="tick" x1="${ax + i * unit}" x2="${ax + i * unit}" y1="104" y2="124"/>${text(ax + i * unit, 148, `${i}`, "lbl tiny")}`).join("");
    const seg = realMetres(1, d);
    const bar = `<rect class="scale-a" x="${ax}" y="186" width="${unit}" height="10"/><rect class="scale-b" x="${ax + unit}" y="186" width="${unit}" height="10"/>${text(ax, 214, "0", "lbl tiny")}${text(ax + unit, 214, distanceText(seg), "lbl tiny")}${text(ax + 2 * unit, 214, distanceText(2 * seg), "lbl tiny")}${text(ax + 2 * unit + 12, 196, "Maßstabsleiste", "lbl tiny", "start")}`;
    const body = `<rect class="paper" x="0" y="0" width="640" height="230" rx="12"/>
      <path class="road-line thin" d="M${ax} 70C${ax + 120} 40 ${bx - 120} 100 ${f1(bx)} 70"/>
      <line class="measure" x1="${ax}" x2="${f1(bx)}" y1="70" y2="70"/>
      <circle class="city" cx="${ax}" cy="70" r="7"/>${text(ax, 52, "A", "lbl small strong")}
      <circle class="city" cx="${f1(bx)}" cy="70" r="7"/>${text(bx, 52, "B", "lbl small strong")}
      <rect class="ruler" x="${ax - 10}" y="104" width="${10 * unit + 20}" height="50" rx="4"/>${ticks}${text(ax + 10 * unit + 14, 148, "cm", "lbl tiny", "start")}
      <rect class="ruler-mark" x="${ax}" y="104" width="${f1(cm * unit)}" height="8"/>
      ${bar}`;
    return `${choice("scale", "Maßstab", d, SCALES.map((v) => [String(v), `1 : ${fmt(v, 0)}`]))}${range("cm", "Gemessene Kartenstrecke", cm, 0.5, 10, 0.5, `${fmt(cm)} cm`)}${labSvg(640, 230, "Papierkarte mit den Punkten A und B, einem Lineal in Zentimetern und einer Maßstabsleiste", body)}${readout(
      `${fmt(cm)} cm · ${fmt(d, 0)} = ${fmt(cm * d, 0)} cm = <strong>${distanceText(metres)}</strong> in der Wirklichkeit (Luftlinie).`,
    )}`;
  },
};

/* ---------- Höhenlinien und Profil ---------- */

interface Hill {
  cx: number;
  cy: number;
  rise: number;
  sx: number;
  sy: number;
}
/** Steep western mountain and gentle south-eastern hill above a 100 m plain. */
export const HILLS: [Hill, Hill] = [
  { cx: 200, cy: 130, rise: 440, sx: 60, sy: 55 },
  { cx: 470, cy: 230, rise: 310, sx: 110, sy: 80 },
];
const hillHeight = (h: Hill, x: number, y: number) =>
  h.rise * Math.exp(-(((x - h.cx) / h.sx) ** 2 + ((y - h.cy) / h.sy) ** 2));
export const heightAt = (x: number, y: number): number =>
  100 + Math.max(hillHeight(HILLS[0], x, y), hillHeight(HILLS[1], x, y));
/** Highest point of each hill on the west–east line at y, rounded to 10 m. */
export function profileMax(y: number): { all: number; west: number; east: number } {
  const round = (v: number) => Math.round(v / 10) * 10;
  const west = round(100 + HILLS[0].rise * Math.exp(-(((y - HILLS[0].cy) / HILLS[0].sy) ** 2)));
  const east = round(100 + HILLS[1].rise * Math.exp(-(((y - HILLS[1].cy) / HILLS[1].sy) ** 2)));
  return { all: Math.max(west, east), west, east };
}
const LEVELS = [200, 300, 400, 500];

export const hoehen: LabDef = {
  id: "hoehen",
  title: "Vom Höhenlinienbild zum Profil",
  intro:
    "Ziehe die Profillinie A–B nach oben oder unten. Darunter entsteht das Höhenprofil entlang der Linie. Schalte die Höhenschichten ein, um die Höhen farbig zu sehen.",
  initial: () => ({ y: 26, farben: "aus" }),
  goals: [
    { text: "Lege die Linie über den Gipfel des steilen Bergs im Westen (über 500 m).", reached: (s) => profileMax(num(s, "y")).west >= 500 },
    { text: "Finde eine Linie, deren höchster Punkt zwischen 200 und 300 m liegt.", reached: (s) => { const m = profileMax(num(s, "y")).all; return m >= 200 && m <= 300; } },
    { text: "Lege die Linie über den Gipfel des flachen Hügels im Südosten (410 m), ohne den Berg im Westen über 300 m zu schneiden.", reached: (s) => { const m = profileMax(num(s, "y")); return m.east >= 400 && m.west <= 300; } },
  ],
  handles: {
    line: {
      pos: (s) => [610, num(s, "y")],
      move: (s, _x, y) => ({ ...s, y: clamp(snap(y, 2), 14, 316) }),
      step: 4,
    },
  },
  witnesses: [
    { y: 130, farben: "aus" },
    { y: 70, farben: "aus" },
    { y: 230, farben: "an" },
  ],
  note: "Erfundenes Gelände, Höhen im Profil stark überhöht. Höhenlinien verbinden Punkte gleicher Höhe; hier liegen sie 100 m auseinander.",
  render(s) {
    const y = num(s, "y");
    const colors = str(s, "farben") === "an";
    const contours = HILLS.flatMap((h, i) =>
      LEVELS.filter((L) => L < 100 + h.rise).map((L) => {
        const r = Math.sqrt(Math.log(h.rise / (L - 100)));
        // Labels sit on the lower right of each ring, so they never overlap.
        const lx = h.cx + h.sx * r * 0.71,
          ly = h.cy + h.sy * r * 0.71 + 4;
        return `<ellipse class="contour ${colors ? `layer-${L}` : ""}" cx="${h.cx}" cy="${h.cy}" rx="${f1(h.sx * r)}" ry="${f1(h.sy * r)}"/>${i === 0 && L === 500 ? "" : text(lx, ly, `${L}`, "lbl tiny contour-label")}`;
      }),
    ).join("");
    const pts: string[] = [];
    for (let x = 0; x <= 640; x += 4) {
      const h = heightAt(x, y);
      pts.push(`${x},${f1(510 - ((h - 100) / 460) * 140)}`);
    }
    const m = profileMax(y);
    const axis = [100, 200, 300, 400, 500]
      .map((h) => {
        const yy = 510 - ((h - 100) / 460) * 140;
        return `<line class="grid" x1="40" x2="640" y1="${f1(yy)}" y2="${f1(yy)}"/>${text(36, yy + 4, `${h} m`, "lbl tiny", "end")}`;
      })
      .join("");
    const body = `<rect class="${colors ? "layer-100" : "paper"}" x="0" y="0" width="640" height="330" rx="10"/>${contours}
      <path class="peak" d="M194 136l6-12 6 12z"/>${text(200, 118, "540 m", "lbl tiny strong")}
      <path class="peak" d="M464 236l6-12 6 12z"/>${text(470, 220, "410 m", "lbl tiny strong")}
      <line class="profile-line" x1="20" x2="620" y1="${f1(y)}" y2="${f1(y)}"/>${text(14, y + 4, "A", "lbl small strong", "end")}${text(626, y - 8, "B", "lbl small strong", "start")}
      ${handle("line", 610, y, "Profillinie A–B", "handle-red", 10)}
      <rect class="panel-bg" x="0" y="350" width="640" height="170" rx="10"/>${axis}
      <path class="profile" d="M40 510L${pts.filter((p) => Number(p.split(",")[0]) >= 40).join("L")}L640 510Z"/>
      ${text(48, 368, "Höhenprofil A–B (überhöht)", "lbl tiny strong", "start")}`;
    return `${choice("farben", "Höhenschichten", str(s, "farben"), [["aus", "aus"], ["an", "einfärben"]])}${labSvg(640, 520, "Karte mit Höhenlinien zweier Berge, eine verschiebbare Profillinie A–B und das daraus gezeichnete Höhenprofil", body)}${readout(
      `Höchster Punkt auf der Linie: <strong>${fmt(m.all, 0)} m</strong>. Wo die Höhenlinien dicht liegen, ist der Hang steil – im Profil steigt die Linie dort schnell an.`,
    )}`;
  },
};

/* ---------- Schalenbau ---------- */

export const SHELLS = [
  { until: 35, name: "Erdkruste", state: "fest, dünne Gesteinshülle" },
  { until: 2900, name: "Erdmantel", state: "festes Gestein, das sich über sehr lange Zeit langsam bewegt" },
  { until: 5100, name: "äußerer Erdkern", state: "flüssiges Metall, vor allem Eisen und Nickel" },
  { until: 6371, name: "innerer Erdkern", state: "festes Metall, trotz mehrerer Tausend Grad Celsius" },
];
export const shellAt = (depth: number) =>
  SHELLS.find((sh) => depth <= sh.until) ?? SHELLS[SHELLS.length - 1];

export const schalen: LabDef = {
  id: "schalen",
  title: "Eine Gedankenreise zum Erdmittelpunkt",
  intro:
    "Niemand kann so tief bohren. Mit dem Regler reist du in Gedanken durch die Schalen der Erde bis zum Mittelpunkt in 6371 km Tiefe.",
  initial: () => ({ depth: 0 }),
  goals: [
    { text: "Reise in den Erdmantel.", reached: (s) => shellAt(num(s, "depth")).name === "Erdmantel" },
    { text: "Erreiche den flüssigen äußeren Erdkern.", reached: (s) => shellAt(num(s, "depth")).name === "äußerer Erdkern" },
    { text: "Erreiche den Erdmittelpunkt.", reached: (s) => num(s, "depth") >= 6360 },
  ],
  witnesses: [{ depth: 1000 }, { depth: 4000 }, { depth: 6371 }],
  note: "Die Kruste ist viel dicker gezeichnet, als sie ist: Unter den Kontinenten ist sie etwa 30 bis 70 km dick, unter den Ozeanen nur etwa 5 bis 10 km. Das Modell rechnet mit 35 km.",
  render(s) {
    const depth = num(s, "depth");
    const R = 300,
      cx = 320,
      cy = 330;
    // The crust is drawn 10 units thick; below it the depth is to scale.
    const px = (km: number) => (km <= 35 ? (km / 35) * 10 : 10 + ((km - 35) / 6336) * (R - 10));
    const ring = (outer: number, cls: string) =>
      `<path class="${cls}" d="M${f1(cx - outer)} ${cy}A${f1(outer)} ${f1(outer)} 0 0 1 ${f1(cx + outer)} ${cy}Z"/>`;
    const sh = shellAt(depth);
    const dy = cy - R + px(depth);
    const body = `${ring(R, "crust")}${ring(R - px(35), "mantle")}${ring(R - px(2900), "outer-core")}${ring(R - px(5100), "inner-core")}
      <line class="drill" x1="${cx}" y1="${cy - R - 20}" x2="${cx}" y2="${f1(dy)}"/><circle class="drill-head" cx="${cx}" cy="${f1(dy)}" r="6"/>
      ${text(cx - R + 14, cy - 4, "Kruste", "lbl tiny", "start")}${text(cx - 205, cy - 120, "Mantel", "lbl small strong")}${text(cx - 110, cy - 50, "äußerer Kern", "lbl small strong")}${text(cx - 30, cy - 14, "innerer Kern", "lbl tiny strong")}
      ${[0, 2900, 5100, 6371].map((km) => text(cx + 12, cy - R + px(km) + (km === 6371 ? -4 : 12), `${fmt(km, 0)} km`, "lbl tiny", "start")).join("")}`;
    return `${range("depth", "Tiefe", depth, 0, 6371, 1, `${fmt(depth, 0)} km`)}${labSvg(640, 350, "Halber Schnitt durch die Erde mit Kruste, Mantel, äußerem und innerem Kern und einer Bohrlinie, die der Tiefe folgt", body)}${readout(
      `In ${fmt(depth, 0)} km Tiefe: <strong>${sh.name}</strong> – ${sh.state}. Zum Vergleich: Das tiefste Bohrloch der Welt reicht nur etwa 12 km tief.`,
    )}`;
  },
};

/* ---------- Lebenszone ---------- */

export const ZONE: [number, number] = [0.95, 1.4];
const inZone = (d: number) => d >= ZONE[0] && d <= ZONE[1];
const zx = (d: number) => 70 + ((d - 0.3) / 1.7) * 540;

export const lebenszone: LabDef = {
  id: "lebenszone",
  title: "Wo kann Wasser flüssig sein?",
  intro:
    "Ziehe den Planeten näher an die Sonne oder weiter weg und schalte seine Lufthülle ein oder aus. AE ist der mittlere Abstand der Erde von der Sonne: rund 150 Millionen km.",
  initial: () => ({ d: 0.5, luft: "an" }),
  goals: [
    { text: "Bringe den Planeten in die Zone, in der Wasser flüssig sein kann.", reached: (s) => inZone(num(s, "d")) && str(s, "luft") === "an" },
    { text: "Zeige, was im gleichen Abstand ohne Lufthülle geschieht.", reached: (s) => inZone(num(s, "d")) && str(s, "luft") === "aus" },
    { text: "Schiebe den Planeten so weit hinaus, dass Wasser gefriert.", reached: (s) => num(s, "d") > ZONE[1] },
  ],
  handles: {
    planet: {
      pos: (s) => [zx(num(s, "d")), 120],
      move: (s, x) => ({ ...s, d: Math.round(clamp(snap(0.3 + ((x - 70) / 540) * 1.7, 0.05), 0.3, 2) * 100) / 100 }),
      step: 540 / 34,
    },
  },
  witnesses: [
    { d: 1, luft: "an" },
    { d: 1, luft: "aus" },
    { d: 1.6, luft: "an" },
  ],
  note: "Stark vereinfachtes Modell. Wie weit diese Zone genau reicht, ist in der Forschung umstritten; sie hängt auch von der Lufthülle eines Planeten ab.",
  render(s) {
    const d = num(s, "d");
    const air = str(s, "luft") === "an";
    const status =
      d < ZONE[0]
        ? ["Zu heiß: Das Wasser verdampft.", "warn"]
        : d > ZONE[1]
          ? ["Zu kalt: Das Wasser gefriert zu Eis.", "warn"]
          : air
            ? ["Wasser kann flüssig bleiben. Die Lufthülle hält Wärme und schützt vor Strahlung.", "good"]
            : ["Ohne Lufthülle hält sich kein flüssiges Wasser: Es entweicht ins All, und zwischen Tag und Nacht schwankt die Temperatur extrem.", "warn"];
    const refs: Array<[string, number]> = [["Venus", 0.72], ["Erde", 1], ["Mars", 1.52]];
    const body = `<rect class="space" width="640" height="210" rx="12"/>
      <circle class="sun" cx="0" cy="120" r="60"/>${text(30, 200, "Sonne", "lbl tiny on-dark")}
      <rect class="zone-hot" x="70" y="40" width="${f1(zx(ZONE[0]) - 70)}" height="12"/><rect class="zone-life" x="${f1(zx(ZONE[0]))}" y="40" width="${f1(zx(ZONE[1]) - zx(ZONE[0]))}" height="12"/><rect class="zone-cold" x="${f1(zx(ZONE[1]))}" y="40" width="${f1(610 - zx(ZONE[1]))}" height="12"/>
      ${text((70 + zx(ZONE[0])) / 2, 32, "zu heiß", "lbl tiny on-dark")}${text((zx(ZONE[0]) + zx(ZONE[1])) / 2, 32, "Wasser flüssig", "lbl tiny on-dark")}${text((zx(ZONE[1]) + 610) / 2, 32, "zu kalt", "lbl tiny on-dark")}
      <line class="orbit-axis" x1="70" x2="610" y1="120" y2="120"/>
      ${refs.map(([n, v]) => `<line class="ref-tick" x1="${f1(zx(v))}" x2="${f1(zx(v))}" y1="150" y2="160"/>${text(zx(v), 176, `${n} ${fmt(v, 2)} AE`, "lbl tiny on-dark")}`).join("")}
      ${air ? `<circle class="air" cx="${f1(zx(d))}" cy="120" r="24"/>` : ""}<circle class="pl-earth" cx="${f1(zx(d))}" cy="120" r="15"/>
      ${handle("planet", zx(d), 120, "Planet", "handle-ghost", 16)}`;
    return `${choice("luft", "Lufthülle", str(s, "luft"), [["an", "an"], ["aus", "aus"]])}${labSvg(640, 210, "Abstand eines Planeten von der Sonne mit einer heißen, einer gemäßigten und einer kalten Zone und den Vergleichswerten von Venus, Erde und Mars", body)}${readout(
      `Abstand: <strong>${fmt(d, 2)} AE</strong>. ${status[0]}`,
      status[1] as "good" | "warn",
    )}`;
  },
};

/* ---------- Säulen- und Balkendiagramm ---------- */

export const RAIN_DAYS = ["Mo", "Di", "Mi", "Do", "Fr"];
export const RAIN_VALUES = [3, 0, 11, 6, 2];
const allRight = (s: LabState) => RAIN_VALUES.every((v, i) => num(s, `v${i}`) === v);

export const saeulen: LabDef = {
  id: "saeulen",
  title: "Messwerte in ein Diagramm übertragen",
  intro:
    "Die Schulwetterstation hat eine Woche lang den Niederschlag gemessen. Ziehe die Säulen auf die Werte der Tabelle. Danach kannst du dieselben Werte als Balkendiagramm zeigen.",
  initial: () => ({ v0: 5, v1: 5, v2: 5, v3: 5, v4: 5, form: "saeule" }),
  goals: [
    { text: "Zeichne die Säule für Mittwoch richtig.", reached: (s) => num(s, "v2") === RAIN_VALUES[2] },
    { text: "Zeichne alle fünf Werte richtig.", reached: allRight },
    { text: "Zeige dieselben Werte richtig als Balkendiagramm.", reached: (s) => allRight(s) && str(s, "form") === "balken" },
  ],
  handles: Object.fromEntries(
    RAIN_DAYS.map((_, i) => [
      `v${i}`,
      {
        pos: (s: LabState): [number, number] =>
          str(s, "form") === "balken" ? [130 + num(s, `v${i}`) * 32, 70 + i * 52] : [150 + i * 95, 300 - num(s, `v${i}`) * 18],
        move: (s: LabState, x: number, y: number): LabState => ({
          ...s,
          [`v${i}`]: clamp(Math.round(str(s, "form") === "balken" ? (x - 130) / 32 : (300 - y) / 18), 0, 14),
        }),
        step: 18,
      },
    ]),
  ),
  witnesses: [
    { v0: 5, v1: 5, v2: 11, v3: 5, v4: 5, form: "saeule" },
    { v0: 3, v1: 0, v2: 11, v3: 6, v4: 2, form: "saeule" },
    { v0: 3, v1: 0, v2: 11, v3: 6, v4: 2, form: "balken" },
  ],
  note: "Erfundene Messwerte einer Schulwetterstation. Ein Säulendiagramm hat senkrechte Säulen, ein Balkendiagramm waagrechte Balken.",
  render(s) {
    const bars = str(s, "form") === "balken";
    const table = `<table class="lab-table"><caption>Niederschlag in mm</caption><tr>${RAIN_DAYS.map((d) => `<th>${d}</th>`).join("")}</tr><tr>${RAIN_VALUES.map((v) => `<td>${v}</td>`).join("")}</tr></table>`;
    let body = "";
    if (!bars) {
      body += [0, 2, 4, 6, 8, 10, 12, 14].map((v) => `<line class="grid" x1="90" x2="600" y1="${300 - v * 18}" y2="${300 - v * 18}"/>${text(84, 304 - v * 18, `${v}`, "lbl tiny", "end")}`).join("");
      body += RAIN_DAYS.map((d, i) => {
        const v = num(s, `v${i}`),
          x = 150 + i * 95;
        return `<rect class="bar ${v === RAIN_VALUES[i] ? "bar-ok" : ""}" x="${x - 25}" y="${300 - v * 18}" width="50" height="${v * 18}"/>${text(x, 322, d, "lbl small")}${handle(`v${i}`, x, 300 - v * 18, `Säule ${d}`, "handle-bar", 9)}`;
      }).join("");
      body += `<line class="axis" x1="90" x2="600" y1="300" y2="300"/><line class="axis" x1="90" x2="90" y1="40" y2="300"/>${text(90, 28, "mm", "lbl tiny strong")}`;
    } else {
      body += [0, 2, 4, 6, 8, 10, 12, 14].map((v) => `<line class="grid" x1="${130 + v * 32}" x2="${130 + v * 32}" y1="40" y2="320"/>${text(130 + v * 32, 336, `${v}`, "lbl tiny")}`).join("");
      body += RAIN_DAYS.map((d, i) => {
        const v = num(s, `v${i}`),
          y = 70 + i * 52;
        return `<rect class="bar ${v === RAIN_VALUES[i] ? "bar-ok" : ""}" x="130" y="${y - 17}" width="${v * 32}" height="34"/>${text(118, y + 5, d, "lbl small", "end")}${handle(`v${i}`, 130 + v * 32, y, `Balken ${d}`, "handle-bar", 9)}`;
      }).join("");
      body += `<line class="axis" x1="130" x2="130" y1="40" y2="320"/>${text(600, 336, "mm", "lbl tiny strong")}`;
    }
    const right = RAIN_VALUES.filter((v, i) => num(s, `v${i}`) === v).length;
    return `${table}${choice("form", "Darstellung", str(s, "form"), [["saeule", "Säulendiagramm"], ["balken", "Balkendiagramm"]])}${labSvg(640, 350, bars ? "Balkendiagramm mit fünf waagrechten, verschiebbaren Balken für Montag bis Freitag" : "Säulendiagramm mit fünf senkrechten, verschiebbaren Säulen für Montag bis Freitag", body)}${readout(
      `${right} von 5 Werten stimmen mit der Tabelle überein.`,
      right === 5 ? "good" : "",
    )}`;
  },
};
