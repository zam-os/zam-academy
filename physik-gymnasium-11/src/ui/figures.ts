import { fmt } from "../exercises/format";
import type { ModelKind } from "../model/types";
import {
  centripetal,
  centriSeries,
  circular,
  colourHex,
  colourName,
  curve,
  EARTH_RADIUS,
  eulerFall,
  eulerOscillation,
  fringeSpacing,
  G_EARTH,
  gamma,
  harmonic,
  hubble,
  interference,
  kepler,
  logistic,
  muon,
  orbit,
  EARTH_MASS,
  pendulumPeriod,
  PLACES,
  platformSpeed,
  pseudoNoise,
  pvPlant,
  ride,
  saving,
  solarCurrent,
  solarMpp,
  solarPoint,
  spring,
  standing,
  superpose,
  terminalSpeed,
  timingSample,
  UTILITY_CRITERIA,
  UTILITY_OPTIONS,
  utility,
  wave,
} from "../models";
import { esc } from "../workshop";

/**
 * The colour code of the package. One colour per kind of physical quantity,
 * the same in every figure and named in the legend below it:
 * v Geschwindigkeit · f Kraft · a Beschleunigung · s Weg, Länge, Auslenkung ·
 * t Zeit, Winkel · e Energie, Leistung, Licht. The others mark a second
 * series (x, one), a verdict (ok, bad), a reference (mute), the accent of
 * the Lernbereich (acc) and the text colour (ink). styles.css holds the
 * values for the light and the dark theme as `--q-<tone>`.
 */
export type Tone =
  | "v"
  | "f"
  | "a"
  | "s"
  | "t"
  | "e"
  | "x"
  | "one"
  | "ok"
  | "bad"
  | "mute"
  | "acc"
  | "ink";

interface Figure {
  /** Text alternative: what the drawing shows with the current values. */
  label: string;
  height: number;
  body: string;
  /**
   * Every colour the scene can show. The frame lists only the entries whose
   * tone the current drawing uses, so the legend never names a line that a
   * setting leaves out, such as the terminal speed without air resistance.
   */
  legend: Array<[Tone, string]>;
  /** Scenes that can move say what the motion shows; the learner starts it. */
  motion?: string;
}
type Values = Record<string, number>;
type Point = [number, number];

/** Every figure shares one canvas width; the height follows the scene. */
const W = 480;
const TAU = 2 * Math.PI;
const clamp = (value: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, value));
/** One decimal keeps the markup short; -0 prints as 0. */
const n = (value: number): string => String(Math.round(value * 10) / 10);
const ratio = (value: number): string => String(Math.round(value * 1000) / 1000);
const seconds = (value: number): string => `${ratio(value)}s`;
const polar = (cx: number, cy: number, r: number, degrees: number): Point => [
  cx + r * Math.cos((degrees * Math.PI) / 180),
  cy - r * Math.sin((degrees * Math.PI) / 180),
];

const line = (
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tone: Tone,
  extra = "",
): string =>
  `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" class="ln q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const dot = (
  x: number,
  y: number,
  r: number,
  tone: Tone,
  extra = "",
): string =>
  `<circle cx="${n(x)}" cy="${n(y)}" r="${n(r)}" class="fl q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const rect = (
  x: number,
  y: number,
  width: number,
  height: number,
  tone: Tone,
  extra = "",
): string =>
  `<rect x="${n(x)}" y="${n(y)}" width="${n(Math.max(0, width))}" height="${n(Math.max(0, height))}" class="fl q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const text = (
  x: number,
  y: number,
  content: string,
  tone: Tone = "ink",
  anchor: "start" | "middle" | "end" = "middle",
  extra = "",
): string =>
  `<text x="${n(x)}" y="${n(y)}" text-anchor="${anchor}" class="q-${tone}${extra ? ` ${extra}` : ""}">${esc(content)}</text>`;
const pathData = (points: Point[]): string =>
  points.map(([x, y], i) => `${i ? "L" : "M"}${n(x)} ${n(y)}`).join("");
const stroke = (points: Point[], tone: Tone, extra = ""): string =>
  `<path d="${pathData(points)}" class="ln q-${tone}${extra ? ` ${extra}` : ""}"/>`;
const area = (points: Point[], tone: Tone, extra = "soft"): string =>
  `<path d="${pathData(points)}Z" class="fl q-${tone} ${extra}"/>`;

/**
 * An arrow with a head drawn as a polygon, so it takes the tone in every
 * browser. With "over" it lies on a filled body and gets a rim in the colour
 * of the figure below it: the tone alone may not stand out from the body.
 */
function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  tone: Tone,
  extra = "",
): string {
  const dx = x2 - x1,
    dy = y2 - y1,
    length = Math.hypot(dx, dy);
  if (!(length >= 1)) return "";
  const ux = dx / length,
    uy = dy / length,
    head = Math.min(12, length * 0.7),
    half = head * 0.45,
    bx = x2 - ux * head,
    by = y2 - uy * head;
  const shaft = `x1="${n(x1)}" y1="${n(y1)}" x2="${n(bx)}" y2="${n(by)}"`,
    tip = `points="${n(x2)},${n(y2)} ${n(bx - uy * half)},${n(by + ux * half)} ${n(bx + uy * half)},${n(by - ux * half)}"`,
    rim = extra.split(" ").includes("over")
      ? `<g class="rim"><line ${shaft}/><polygon ${tip}/></g>`
      : "";
  return `${rim}<g class="q-${tone}${extra ? ` ${extra}` : ""}"><line ${shaft} class="ln thick"/><polygon ${tip} class="fl"/></g>`;
}
/** A horizontal measure with end ticks, for lengths, periods and differences. */
const span = (x1: number, x2: number, y: number, tone: Tone): string =>
  `<path d="M${n(x1)} ${n(y - 5)}V${n(y + 5)}M${n(x1)} ${n(y)}H${n(x2)}M${n(x2)} ${n(y - 5)}V${n(y + 5)}" class="ln q-${tone}"/>`;

function ticks(lo: number, hi: number, target = 4): number[] {
  const width = hi - lo;
  if (!(width > 0)) return [lo];
  const raw = width / target,
    magnitude = 10 ** Math.floor(Math.log10(raw)),
    normal = raw / magnitude,
    step =
      (normal < 1.5 ? 1 : normal < 3.5 ? 2 : normal < 7.5 ? 5 : 10) * magnitude;
  const out: number[] = [];
  for (
    let i = Math.ceil(lo / step - 1e-9);
    i * step <= hi + step * 1e-9 && out.length < 12;
    i++
  )
    out.push(Number((i * step).toPrecision(12)));
  return out;
}

interface FrameSpec {
  left?: number;
  right?: number;
  top: number;
  bottom: number;
  x0?: number;
  x1: number;
  y0: number;
  y1: number;
  xLabel: string;
  yLabel: string;
  xTicks?: number[];
  yTicks?: number[];
  digits?: number;
}
interface Frame {
  x: (value: number) => number;
  y: (value: number) => number;
  /** Grid, axes and their labels. */
  axes: string;
  /** Wraps the data, which is clipped to the plot area. */
  plot: (data: string) => string;
}
/**
 * A coordinate system with a light grid and tick labels. Values far outside
 * the range are held at one range width beyond it and clipped, so a
 * simulation that runs away leaves the plot instead of breaking it.
 */
function frame(spec: FrameSpec): Frame {
  const left = spec.left ?? 50,
    right = spec.right ?? 456,
    { top, bottom } = spec,
    x0 = spec.x0 ?? 0,
    width = spec.x1 - x0 || 1,
    height = spec.y1 - spec.y0 || 1,
    digits = spec.digits ?? 2;
  const x = (value: number) =>
    left +
    ((clamp(value, x0 - width, spec.x1 + width) - x0) / width) * (right - left);
  const y = (value: number) =>
    bottom -
    ((clamp(value, spec.y0 - height, spec.y1 + height) - spec.y0) / height) *
      (bottom - top);
  const xs = spec.xTicks ?? ticks(x0, spec.x1),
    ys = spec.yTicks ?? ticks(spec.y0, spec.y1);
  const axes =
    ys
      .map(
        (t) =>
          `<line x1="${left}" y1="${n(y(t))}" x2="${right}" y2="${n(y(t))}" class="grid"/><text x="${left - 6}" y="${n(y(t) + 4)}" text-anchor="end" class="tick">${fmt(t, digits)}</text>`,
      )
      .join("") +
    xs
      .map(
        (t) =>
          `<line x1="${n(x(t))}" y1="${top}" x2="${n(x(t))}" y2="${bottom}" class="grid"/><text x="${n(x(t))}" y="${bottom + 15}" text-anchor="middle" class="tick">${fmt(t, digits)}</text>`,
      )
      .join("") +
    (spec.y0 < 0 && spec.y1 > 0
      ? `<line x1="${left}" y1="${n(y(0))}" x2="${right}" y2="${n(y(0))}" class="axis zero"/>`
      : "") +
    `<path d="M${left} ${top}V${bottom}H${right}" class="axis"/><text x="${left}" y="${top - 10}" class="axis-title">${esc(spec.yLabel)}</text><text x="${right}" y="${bottom + 32}" text-anchor="end" class="axis-title">${esc(spec.xLabel)}</text>`;
  const pad = 7,
    box = `${left - pad} ${top - pad} ${right - left + 2 * pad} ${bottom - top + 2 * pad}`;
  return {
    x,
    y,
    axes,
    plot: (data) =>
      `<svg x="${left - pad}" y="${top - pad}" width="${right - left + 2 * pad}" height="${bottom - top + 2 * pad}" viewBox="${box}">${data}</svg>`,
  };
}
const sample = (
  from: number,
  to: number,
  count: number,
  f: (value: number) => number,
): Point[] =>
  Array.from({ length: count + 1 }, (_, i) => {
    const value = from + ((to - from) * i) / count;
    return [value, f(value)];
  });
const onFrame = (fr: Frame, points: Point[]): Point[] =>
  points.map(([px, py]) => [fr.x(px), fr.y(py)]);

/** Eccentric anomaly for a mean anomaly, by bisection: safe up to e = 0,9. */
function eccentricAnomaly(mean: number, e: number): number {
  let lo = mean - 1,
    hi = mean + 1;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (mid - e * Math.sin(mid) < mean) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const FIGURES: Record<ModelKind, (v: Values) => Figure> = {
  circular: (v) => {
    const c = circular(v.r, v.T),
      R = 70 + 45 * Math.sqrt((v.r - 0.5) / 9.5),
      cx = 240,
      cy = 176,
      alpha = 50,
      rad = (alpha * Math.PI) / 180,
      [bx, by] = polar(cx, cy, R, alpha),
      sweep = (c.omega * 0.25 * 180) / Math.PI,
      [sx, sy] = polar(cx, cy, R, alpha - sweep),
      lv = Math.min(100, 22 + 11 * Math.sqrt(c.v)),
      tx = bx - Math.sin(rad) * lv,
      ty = by - Math.cos(rad) * lv,
      [lx, ly] = polar(cx, cy, R + 18, alpha - sweep / 2);
    return {
      label: `Kreisbahn von oben mit Radius ${fmt(v.r)} Meter und Umlaufdauer ${fmt(v.T)} Sekunden. Der Pfeil der Bahngeschwindigkeit von ${fmt(c.v)} Meter pro Sekunde liegt tangential an der Bahn. In 0,25 Sekunden überstreicht der Radius den markierten Drehwinkel.`,
      height: 314,
      body:
        `<circle cx="${cx}" cy="${cy}" r="${n(R)}" class="ln q-mute dash thin"/>` +
        `<g class="spin" style="--turn:${seconds(v.T)};transform-origin:${cx}px ${cy}px">` +
        `<path d="M${cx} ${cy}L${n(sx)} ${n(sy)}A${n(R)} ${n(R)} 0 ${sweep > 180 ? 1 : 0} 0 ${n(bx)} ${n(by)}Z" class="fl q-t soft"/>` +
        line(cx, cy, bx, by, "s") +
        arrow(bx, by, tx, ty, "v") +
        dot(bx, by, 10, "acc", "body") +
        text(
          (cx + bx) / 2 - Math.sin(rad) * 14,
          (cy + by) / 2 - Math.cos(rad) * 14 + 5,
          "r",
          "s",
          "middle",
          "still",
        ) +
        text(tx - Math.sin(rad) * 12, ty - Math.cos(rad) * 12 + 5, "v", "v", "middle", "still") +
        text(lx, ly + 5, "Δφ", "t", "middle", "still") +
        "</g>" +
        dot(cx, cy, 3.5, "ink") +
        text(cx - 10, cy + 18, "M", "ink"),
      legend: [
        ["s", "Bahnradius r"],
        ["v", "Bahngeschwindigkeit v, tangential zur Bahn"],
        ["t", "Drehwinkel Δφ in 0,25 s"],
      ],
      motion: "Ein Umlauf dauert so lange wie eingestellt.",
    };
  },
  centripetal: (v) => {
    const c = centripetal(v.m, v.v, v.r),
      R = 70 + 45 * Math.sqrt((v.r - 0.5) / 4.5),
      cx = 240,
      cy = 180,
      alpha = 40,
      rad = (alpha * Math.PI) / 180,
      [bx, by] = polar(cx, cy, R, alpha),
      lv = 16 + 8.5 * v.v,
      lf = Math.min(R - 10, 14 + 5 * c.f),
      tx = bx - Math.sin(rad) * lv,
      ty = by - Math.cos(rad) * lv,
      fx = bx - Math.cos(rad) * lf,
      fy = by + Math.sin(rad) * lf;
    return {
      label: `Kreisbahn von oben: Körper mit ${fmt(v.m)} Kilogramm auf einer Bahn mit Radius ${fmt(v.r)} Meter. Der Geschwindigkeitspfeil liegt tangential, der Pfeil der Zentripetalkraft von ${fmt(c.f)} Newton zeigt zum Mittelpunkt.`,
      height: 312,
      body:
        `<circle cx="${cx}" cy="${cy}" r="${n(R)}" class="ln q-mute dash thin"/>` +
        `<g class="spin" style="--turn:${seconds(clamp((TAU * v.r) / v.v, 1, 16))};transform-origin:${cx}px ${cy}px">` +
        line(cx, cy, bx, by, "mute", "thin") +
        arrow(bx, by, tx, ty, "v") +
        arrow(bx, by, fx, fy, "f") +
        dot(bx, by, 7 + 6 * v.m, "acc", "body") +
        text(tx - Math.sin(rad) * 12, ty - Math.cos(rad) * 12 + 5, "v", "v", "middle", "still") +
        text(
          (bx + fx) / 2 + Math.sin(rad) * 20,
          (by + fy) / 2 + Math.cos(rad) * 20 + 5,
          "F_Z",
          "f",
          "middle",
          "still",
        ) +
        "</g>" +
        dot(cx, cy, 3.5, "ink") +
        text(cx - 10, cy + 18, "M", "ink"),
      legend: [
        ["v", "Bahngeschwindigkeit v, tangential"],
        ["f", "Zentripetalkraft F_Z, zum Mittelpunkt"],
      ],
      motion:
        "Die Kraft zeigt in jedem Moment zur Mitte, die Geschwindigkeit bleibt tangential.",
    };
  },
  centriexp: (v) => {
    const rows = centriSeries(v.vary, v.noise),
      k = centriSeries(v.vary, 0)[0].quotient,
      power = v.vary === 2 ? 2 : 1,
      xMax = rows[rows.length - 1].x * 1.1,
      yMax = Math.max(...rows.map((row) => row.f), k * xMax ** power) * 1.08,
      names = ["Masse in kg", "Radius in m", "Winkelgeschwindigkeit in 1/s"],
      fr = frame({
        top: 34,
        bottom: 214,
        x1: xMax,
        y0: 0,
        y1: yMax,
        xLabel: names[v.vary],
        yLabel: "Kraft in N",
      });
    return {
      label: `Messdiagramm: Kraft in Newton über ${names[v.vary]}. Fünf nachgebildete Messpunkte liegen ${v.vary === 2 ? "an einer Parabel durch den Ursprung" : "an einer Ursprungsgeraden"}.`,
      height: 252,
      body:
        fr.axes +
        fr.plot(
          stroke(
            onFrame(
              fr,
              sample(0, xMax, 40, (x) => k * x ** power),
            ),
            "acc",
          ) +
            rows
              .map((row) => dot(fr.x(row.x), fr.y(row.f), 6, "x", "ring"))
              .join(""),
        ),
      legend: [
        ["x", "nachgebildete Messwerte"],
        [
          "acc",
          v.vary === 2
            ? "Modell: F ~ ω² (Parabel)"
            : `Modell: F ~ ${v.vary === 0 ? "m" : "r"} (Ursprungsgerade)`,
        ],
      ],
    };
  },
  curve: (v) => {
    const r = curve(v.m, v.v, v.r, v.mu),
      R = 110 + (90 * (v.r - 20)) / 180,
      cx = 150,
      cy = 300,
      alpha = 62,
      rad = (alpha * Math.PI) / 180,
      [x, y] = polar(cx, cy, R, alpha),
      [ax, ay] = polar(cx, cy, R, 18),
      [ex, ey] = polar(cx, cy, R, 118),
      grip = 44,
      lf = Math.min(96, (grip * r.need) / r.max),
      scale = (kmh: number) => 262 - 1.3 * clamp(kmh, 0, 160),
      limit = scale(r.vMaxKmh);
    return {
      label: `Kurve von oben mit Radius ${fmt(v.r)} Meter. Der Pfeil der nötigen Zentripetalkraft ${r.safe ? "bleibt innerhalb des Kreises der größtmöglichen Haftreibungskraft: Das Fahrzeug hält die Spur" : "ragt über den Kreis der größtmöglichen Haftreibungskraft hinaus: Das Fahrzeug rutscht"}. Die Skala zeigt ${fmt(v.v)} Kilometer pro Stunde bei einer Höchstgeschwindigkeit von ${fmt(r.vMaxKmh)} Kilometer pro Stunde.`,
      height: 300,
      body:
        `<path d="M${n(ax)} ${n(ay)}A${n(R)} ${n(R)} 0 0 0 ${n(ex)} ${n(ey)}" class="road"/>` +
        `<path d="M${n(ax)} ${n(ay)}A${n(R)} ${n(R)} 0 0 0 ${n(ex)} ${n(ey)}" class="road-mark"/>` +
        `<circle cx="${n(x)}" cy="${n(y)}" r="${grip}" class="fl q-ok soft"/><circle cx="${n(x)}" cy="${n(y)}" r="${grip}" class="ln q-ok thin"/>` +
        (r.safe
          ? ""
          : arrow(
              x,
              y,
              x - Math.sin(rad) * 78,
              y - Math.cos(rad) * 78,
              "bad",
              "dash",
            )) +
        `<rect x="-17" y="-9" width="34" height="18" rx="5" transform="translate(${n(x)} ${n(y)}) rotate(${90 - alpha})" class="fl q-${r.safe ? "acc" : "bad"} body"/>` +
        arrow(x, y, x - Math.cos(rad) * lf, y + Math.sin(rad) * lf, "f") +
        rect(410, limit, 20, 262 - limit, "ok", "soft-strong") +
        rect(410, 54, 20, limit - 54, "bad", "soft-strong") +
        `<rect x="410" y="54" width="20" height="208" rx="3" class="ln q-mute thin"/>` +
        line(402, scale(v.v), 438, scale(v.v), "ink", "thick") +
        text(398, scale(v.v) + 5, `${fmt(v.v)} km/h`, "ink", "end") +
        text(420, 44, "Tempo", "ink") +
        text(420, 282, "0", "ink", "middle", "tick") +
        text(444, clamp(limit, 62, 258) + 4, "max", r.safe ? "ok" : "bad", "start", "tick"),
      legend: [
        ["f", "nötige Zentripetalkraft"],
        ["ok", "Kreis und grüner Bereich: Haftreibung reicht"],
        ["bad", "roter Bereich: Fahrzeug rutscht tangential weiter"],
      ],
    };
  },
  gravity: (v) => {
    const x = (k: number) => 46 + 40 * k,
      share = 1 / (v.n * v.n),
      y = (value: number) => 276 - 110 * value,
      bx = x(v.n),
      radius = 5 + 0.8 * Math.sqrt(v.m),
      points = sample(1, 10, 54, (k) => 1 / (k * k)).map(
        ([k, value]): Point => [x(k), y(value)],
      );
    return {
      label: `Erde und ein Körper im Abstand von ${fmt(v.n)} Erdradien vom Erdmittelpunkt. Darunter die Kurve der Gravitationskraft: Sie fällt mit dem Quadrat des Abstands, hier auf ${fmt(100 * share)} Prozent des Werts an der Oberfläche.`,
      height: 304,
      body:
        `<circle cx="46" cy="76" r="40" class="earth"/><path d="M22 60q14 -12 26 0t22 4" class="earth-land"/>` +
        line(46, 132, bx, 132, "s") +
        `<path d="M46 126V138M${n(bx)} 126V138" class="ln q-s"/>` +
        text((46 + bx) / 2, 126, `r = ${fmt(v.n)} · R_E`, "s", v.n < 3 ? "start" : "middle") +
        line(bx, 76, bx, y(share), "mute", "dash thin") +
        arrow(bx, 76, bx - Math.max(5, 34 * share), 76, "f") +
        dot(bx, 76, radius, "acc", "body") +
        Array.from({ length: 10 }, (_, i) => i + 1)
          .map(
            (k) =>
              `<line x1="${x(k)}" y1="166" x2="${x(k)}" y2="276" class="grid"/><text x="${x(k)}" y="292" text-anchor="middle" class="tick">${k}</text>`,
          )
          .join("") +
        [1, 0.25]
          .map(
            (value) =>
              `<line x1="86" y1="${n(y(value))}" x2="446" y2="${n(y(value))}" class="grid"/><text x="80" y="${n(y(value) + 4)}" text-anchor="end" class="tick">${fmt(100 * value)} %</text>`,
          )
          .join("") +
        `<path d="M86 276H446" class="axis"/>` +
        area([...points, [446, 276], [86, 276]], "f") +
        stroke(points, "f") +
        dot(bx, y(share), 6, "f", "ring") +
        text(446, 160, "Abstand in Erdradien", "ink", "end", "axis-title"),
      legend: [
        ["f", "Gravitationskraft F ~ 1 / r²"],
        ["s", "Abstand r vom Erdmittelpunkt"],
      ],
    };
  },
  orbit: (v) => {
    const scale = 118 / 42371,
      earth = (EARTH_RADIUS / 1000) * scale,
      radius = EARTH_RADIUS + v.h * 1000,
      r = orbit(EARTH_MASS, radius),
      R = (radius / 1000) * scale,
      cx = 240,
      cy = 152,
      alpha = 35,
      rad = (alpha * Math.PI) / 180,
      [x, y] = polar(cx, cy, R, alpha),
      lv = (11 * r.v) / 1000,
      // Over the range of the slider the force falls to a fortieth. No arrow
      // to scale fits beside an orbit drawn to scale, so the arrow has one
      // length and shows the direction; the figure states the share in words.
      // It runs from the rim of the satellite and ends before the centre of
      // the Earth even on the lowest orbit.
      lf = 11,
      [fx, fy] = polar(cx, cy, R - 7, alpha),
      share = (EARTH_RADIUS / radius) ** 2,
      [mx, my] = polar(cx, cy, earth, alpha),
      ring = (h: number) => (EARTH_RADIUS / 1000 + h) * scale;
    return {
      label: `Erde mit maßstäblicher Kreisbahn in ${fmt(v.h)} Kilometer Höhe. Der Satellit hat ${fmt(r.v / 1000)} Kilometer pro Sekunde und braucht ${fmt(r.T / 3600)} Stunden für einen Umlauf. Die Gravitationskraft zeigt zur Erde und beträgt ${fmt(100 * share, 1)} Prozent der Gewichtskraft am Erdboden; ihr Pfeil zeigt nur die Richtung. Gestrichelt zum Vergleich drei Bahnen: Raumstation in 400 Kilometer Höhe, im Maßstab dicht über der Erdoberfläche, Navigationssatelliten in ${fmt(20200)} und geostationäre Satelliten in ${fmt(35800)} Kilometer Höhe.`,
      height: 304,
      body:
        [400, 20200, 35800]
          .map(
            (h) =>
              `<circle cx="${cx}" cy="${cy}" r="${n(ring(h))}" class="ln q-mute dash thin"/>`,
          )
          .join("") +
        text(cx - ring(35800) - 6, cy + 5, "geostationär", "mute", "end", "tick") +
        text(cx - ring(20200) * 0.72, cy + ring(20200) * 0.72 + 14, "Navigation", "mute", "end", "tick") +
        `<circle cx="${cx}" cy="${cy}" r="${n(R)}" class="ln q-acc"/>` +
        `<circle cx="${cx}" cy="${cy}" r="${n(earth)}" class="earth"/>` +
        `<g class="spin" style="--turn:23.93s;transform-origin:${cx}px ${cy}px">${dot(mx, my, 4, "x", "ring")}</g>` +
        `<g class="spin" style="--turn:${seconds(r.T / 3600)};transform-origin:${cx}px ${cy}px">` +
        arrow(x, y, x - Math.sin(rad) * lv, y - Math.cos(rad) * lv, "v") +
        dot(x, y, 6, "acc", "body") +
        // On a low orbit the arrow lies on the Earth's disc: "over" gives it
        // a rim in the colour of the figure.
        arrow(fx, fy, fx - Math.cos(rad) * lf, fy + Math.sin(rad) * lf, "f", "over") +
        "</g>" +
        // The 400 km orbit lies 1 px above the Earth's disc at this scale, so
        // a leader ties the name to its ring instead of leaving it in the gap.
        line(cx, cy + ring(400), cx, cy + earth + 22, "mute", "thin") +
        text(cx, cy + earth + 34, "Raumstation", "mute", "middle", "tick") +
        text(
          W - 12,
          296,
          `Gravitationskraft: ${fmt(100 * share, 1)} % der Gewichtskraft am Boden`,
          "f",
          "end",
          "tick",
        ),
      legend: [
        ["v", "Bahngeschwindigkeit v"],
        ["f", "Gravitationskraft als Zentripetalkraft (Pfeil zeigt nur die Richtung)"],
        ["x", "Ort am Äquator, dreht sich mit der Erde"],
      ],
      motion: "Zeitraffer: Eine Stunde läuft in einer Sekunde ab.",
    };
  },
  oscillation: (v) => {
    const fr = frame({
        left: 76,
        top: 38,
        bottom: 214,
        x1: 8,
        y0: -1.35 * v.A,
        y1: 1.35 * v.A,
        xLabel: "Zeit in s",
        yLabel: "Auslenkung in cm",
        xTicks: [0, 2, 4, 6, 8],
        yTicks: [-v.A, 0, v.A],
      }),
      now = harmonic(v.A, v.T, v.t),
      amp = fr.y(0) - fr.y(v.A),
      crest = fr.x(v.T / 4);
    return {
      label: `Zeit-Auslenkungs-Diagramm einer harmonischen Schwingung mit Amplitude ${fmt(v.A)} Zentimeter und Periodendauer ${fmt(v.T)} Sekunden. Markiert ist der Zeitpunkt ${fmt(v.t)} Sekunden mit der Auslenkung ${fmt(now)} Zentimeter. Links schwingt der Körper auf und ab.`,
      height: 252,
      body:
        fr.axes +
        line(30, fr.y(v.A), 30, fr.y(-v.A), "mute", "thin") +
        line(39, fr.y(now), fr.x(v.t), fr.y(now), "e", "dash thin still") +
        fr.plot(
          stroke(
            onFrame(
              fr,
              sample(0, 8, 160, (t) => harmonic(v.A, v.T, t)),
            ),
            "acc",
          ) +
            line(fr.x(v.t), fr.y(0), fr.x(v.t), fr.y(now), "e", "dash thin") +
            dot(fr.x(v.t), fr.y(now), 6, "e", "ring"),
        ) +
        arrow(crest, fr.y(0), crest, fr.y(v.A), "s") +
        text(crest + 9, fr.y(v.A / 2) + 5, "A", "s", "start") +
        span(crest, fr.x((5 * v.T) / 4), fr.y(v.A) - 11, "t") +
        text(fr.x((3 * v.T) / 4), fr.y(v.A) - 17, "T", "t") +
        `<circle cx="30" cy="${n(fr.y(0))}" r="9" class="fl q-acc body osc" style="--y0:${n(fr.y(now) - fr.y(0))}px;--amp:${n(amp)}px;--half:${seconds(v.T / 2)};--delay:${seconds(-v.T / 4)}"/>`,
      legend: [
        ["s", "Amplitude A"],
        ["t", "Periodendauer T"],
        ["e", "gewählter Zeitpunkt t"],
      ],
      motion: "Der Körper schwingt in Echtzeit mit der eingestellten Periodendauer.",
    };
  },
  spring: (v) => {
    const r = spring(v.m, v.D, v.A),
      amp = 6 * v.A,
      top = 32,
      rest = 150,
      cx = 86,
      width = 28 + 20 * v.m,
      length = rest - 14 - top,
      coil: Point[] = [
        [cx, top],
        ...Array.from({ length: 11 }, (_, i): Point => [
          cx + (i % 2 ? 13 : -13),
          top + 9 + (i * (length - 18)) / 10,
        ]),
        [cx, rest - 14],
      ],
      fr = frame({
        left: 222,
        top: 38,
        bottom: 214,
        x1: 4,
        y0: -1.35 * v.A,
        y1: 1.35 * v.A,
        xLabel: "Zeit in s",
        yLabel: "Auslenkung in cm",
        xTicks: [0, 1, 2, 3, 4],
        yTicks: [-v.A, 0, v.A],
      }),
      ghost = (dy: number) =>
        `<rect x="${n(cx - width / 2)}" y="${n(rest - 14 + dy)}" width="${n(width)}" height="28" rx="5" class="ln q-mute dash thin still"/>`;
    return {
      label: `Federpendel mit Masse ${fmt(v.m)} Kilogramm und Federhärte ${fmt(v.D)} Newton pro Meter. Der Körper schwingt um ${fmt(v.A)} Zentimeter um die Ruhelage. Das Diagramm zeigt die Auslenkung über der Zeit mit der Periodendauer ${fmt(r.T)} Sekunden.`,
      height: 252,
      body:
        `<rect x="40" y="22" width="92" height="10" rx="2" class="wall"/>` +
        line(28, rest, 146, rest, "mute", "dash thin") +
        text(150, rest + 4, "Ruhelage", "mute", "start", "tick") +
        ghost(-amp) +
        ghost(amp) +
        `<g class="coil" style="transform-origin:${cx}px ${top}px;--s1:${ratio((length + amp) / length)};--s2:${ratio((length - amp) / length)};--half:${seconds(r.T / 2)}"><path d="${pathData(coil)}" class="ln q-ink" style="stroke-width:${n(1.6 + v.D / 14)}"/></g>` +
        `<rect x="${n(cx - width / 2)}" y="${rest - 14}" width="${n(width)}" height="28" rx="5" class="fl q-acc body osc" style="--y0:0px;--amp:${n(amp)}px;--half:${seconds(r.T / 2)};--delay:0s"/>` +
        arrow(cx + width / 2 + 16, rest, cx + width / 2 + 16, rest + amp, "s", "still") +
        text(cx + width / 2 + 25, rest + amp / 2 + 5, "A", "s", "start", "still") +
        fr.axes +
        fr.plot(
          stroke(
            onFrame(
              fr,
              sample(0, 4, 160, (t) => v.A * Math.cos((TAU * t) / r.T)),
            ),
            "acc",
          ),
        ) +
        span(fr.x(0), fr.x(r.T), fr.y(v.A) - 11, "t") +
        text(fr.x(r.T / 2), fr.y(v.A) - 17, "T", "t"),
      legend: [
        ["s", "Amplitude A"],
        ["t", "Periodendauer T"],
      ],
      motion: "Der Körper schwingt in Echtzeit. Verändere Masse oder Federhärte und vergleiche.",
    };
  },
  pendulum: (v) => {
    const place = PLACES[v.ort],
      T = pendulumPeriod(v.l, place.g),
      px = 250,
      py = 26,
      L = 30 + 95 * v.l,
      angle = (14 * Math.PI) / 180,
      radius = 7 + 9 * v.m,
      bx = px + L * Math.sin(angle),
      by = py + L * Math.cos(angle),
      // The arrow shows g, the quantity the period depends on. A force arrow
      // would have to grow with the mass, which leaves the period unchanged.
      // It starts below the body, so the short arrow of the Moon stays visible.
      fall = 6.2 * place.g,
      from = by + radius + 3;
    return {
      label: `Fadenpendel mit Länge ${fmt(v.l)} Meter und Masse ${fmt(v.m)} Kilogramm, Ort: ${place.name}. Der Pfeil am Pendelkörper zeigt die Fallbeschleunigung des Ortes, ${fmt(place.g)} Meter pro Sekunde zum Quadrat; die Masse ändert nur die Größe des Pendelkörpers. Periodendauer ${fmt(T)} Sekunden.`,
      height: 332,
      body:
        `<rect x="${px - 46}" y="16" width="92" height="10" rx="2" class="wall"/>` +
        line(px, py, px, py + L + radius + 8, "mute", "dash thin") +
        `<path d="M${n(px - L * Math.sin(angle))} ${n(by)}A${n(L)} ${n(L)} 0 0 0 ${n(bx)} ${n(by)}" class="ln q-mute dash thin"/>` +
        `<circle cx="${n(px - L * Math.sin(angle))}" cy="${n(by)}" r="${n(radius)}" class="ln q-mute dash thin still"/>` +
        arrow(bx, from, bx, from + fall, "a", "still") +
        text(bx + 10, from + fall / 2 + 5, "g", "a", "start", "still") +
        `<g class="swing" style="transform-origin:${px}px ${py}px;--half:${seconds(T / 2)}">` +
        line(px, py, px, py + L, "s") +
        dot(px, py + L, radius, "acc", "body") +
        text(px + 12, py + L / 2 + 5, "l", "s", "start", "still") +
        "</g>" +
        dot(px, py, 3.5, "ink") +
        `<circle cx="62" cy="236" r="30" class="place place-${v.ort}"/>` +
        text(62, 288, place.name, "ink") +
        text(62, 306, `g = ${fmt(place.g)} m/s²`, "mute", "middle", "tick"),
      legend: [
        ["s", "Pendellänge l"],
        ["a", "Fallbeschleunigung g am Ort"],
      ],
      motion: "Das Pendel schwingt in Echtzeit mit der berechneten Periodendauer.",
    };
  },
  uncertainty: (v) => {
    const r = timingSample(v.n, v.periods, v.spread),
      x = (value: number) => 30 + ((clamp(value, 1.05, 1.8) - 1.05) / 0.75) * 420,
      half = Math.max(r.halfRange, 0.01),
      rows: number[][] = [],
      dots = [...r.values]
        .sort((a, b) => a - b)
        .map((value) => {
          const px = x(value);
          let row = rows.findIndex((taken) =>
            taken.every((other) => Math.abs(other - px) >= 14),
          );
          if (row < 0) row = rows.push([]) - 1;
          rows[row].push(px);
          return dot(px, 150 - row * 15, 6, "x", "ring");
        });
    return {
      label: `Zahlenstrahl mit ${fmt(v.n)} gemessenen Periodendauern. Der Mittelwert liegt bei ${fmt(r.mean, 3)} Sekunden, das Band zeigt die halbe Spannweite von ${fmt(half, 3)} Sekunden nach beiden Seiten.`,
      height: 224,
      body:
        rect(x(r.mean - half), 36, x(r.mean + half) - x(r.mean - half), 128, "e", "soft") +
        Array.from({ length: 8 }, (_, i) => 1.1 + i * 0.1)
          .map(
            (value) =>
              `<line x1="${n(x(value))}" y1="164" x2="${n(x(value))}" y2="172" class="axis"/><text x="${n(x(value))}" y="188" text-anchor="middle" class="tick">${fmt(value, 1)}</text>`,
          )
          .join("") +
        `<path d="M30 164H450" class="axis"/>` +
        dots.join("") +
        line(x(r.mean), 30, x(r.mean), 164, "acc") +
        text(x(r.mean), 22, "Mittelwert", "acc", x(r.mean) > 380 ? "end" : x(r.mean) < 100 ? "start" : "middle") +
        text(450, 212, "Periodendauer in s", "ink", "end", "axis-title"),
      legend: [
        ["x", "einzelne Messwerte"],
        ["acc", "Mittelwert"],
        ["e", "Mittelwert ± halbe Spannweite"],
      ],
    };
  },
  wave: (v) => {
    const r = wave(v.lambda, v.f),
      x = (metres: number) => 30 + 52.5 * metres,
      base = 112,
      amp = 12 * v.A,
      y = (metres: number) => base - amp * Math.sin((TAU * metres) / v.lambda),
      crest = x(v.lambda / 4),
      next = x((5 * v.lambda) / 4),
      lc = 30 + 12 * Math.sqrt(r.c),
      marked = 15;
    return {
      label: `Momentbild einer Welle mit Wellenlänge ${fmt(v.lambda)} Meter und Amplitude ${fmt(v.A)} Zentimeter auf 8 Meter Länge. Die Punkte sind die Oszillatoren des Trägers; jeder schwingt an seinem Ort auf und ab, während die Welle mit ${fmt(r.c)} Meter pro Sekunde nach rechts läuft.`,
      height: 238,
      body:
        line(30, base, 450, base, "mute", "dash thin") +
        line(x(marked * 0.2), base - amp, x(marked * 0.2), base + amp, "e", "thin") +
        stroke(
          sample(0, 8, 160, (metres) => metres).map(
            ([metres]): Point => [x(metres), y(metres)],
          ),
          "acc",
          "thin still",
        ) +
        `<g style="--amp:${n(amp)}px;--half:${seconds(r.T / 2)}">` +
        Array.from({ length: 41 }, (_, i) => {
          const metres = i * 0.2,
            phase = metres / v.lambda + 0.25,
            delay = r.T * (phase - Math.floor(phase) - 1);
          return `<circle cx="${n(x(metres))}" cy="${base}" r="${i === marked ? 6.5 : 4.5}" class="fl q-${i === marked ? "e" : "acc"} osc${i === marked ? " ring" : ""}" style="--y0:${n(y(metres) - base)}px;--delay:${seconds(delay)}"/>`;
        }).join("") +
        "</g>" +
        span(crest, next, base - amp - 16, "s") +
        text((crest + next) / 2, base - amp - 23, "λ", "s", "middle", "still") +
        arrow(40, base + amp + 30, 40 + lc, base + amp + 30, "v") +
        text(48 + lc, base + amp + 35, "c", "v", "start") +
        text(30, 228, "0 m", "ink", "start", "tick") +
        text(450, 228, "8 m", "ink", "end", "tick"),
      legend: [
        ["acc", "Oszillatoren des Trägers"],
        ["e", "ein Oszillator: bleibt an seinem Ort"],
        ["s", "Wellenlänge λ"],
        ["v", "Ausbreitung mit c = λ · f"],
      ],
      motion: "Die Welle läuft in Echtzeit nach rechts; jeder Oszillator schwingt nur auf und ab.",
    };
  },
  superposition: (v) => {
    const total = v.a1 + v.a2,
      fr = frame({
        top: 38,
        bottom: 214,
        x1: 2,
        y0: -1.2 * total,
        y1: 1.2 * total,
        xLabel: "Ort in Wellenlängen",
        yLabel: "Auslenkung in cm",
        xTicks: [0, 0.5, 1, 1.5, 2],
        yTicks: [-total, 0, total],
      }),
      one = (x: number) => v.a1 * Math.sin(TAU * x),
      two = (x: number) => v.a2 * Math.sin(TAU * (x - v.shift));
    return {
      label: `Zwei Wellen gleicher Wellenlänge mit den Amplituden ${fmt(v.a1)} und ${fmt(v.a2)} Zentimeter, um ${fmt(v.shift, 3)} Wellenlängen gegeneinander versetzt, und ihre Überlagerung mit der Amplitude ${fmt(superpose(v.a1, v.a2, v.shift))} Zentimeter.`,
      height: 252,
      body:
        fr.axes +
        fr.plot(
          stroke(onFrame(fr, sample(0, 2, 120, one)), "one", "thin") +
            stroke(onFrame(fr, sample(0, 2, 120, two)), "x", "thin") +
            stroke(
              onFrame(
                fr,
                sample(0, 2, 120, (x) => one(x) + two(x)),
              ),
              "ink",
              "thick",
            ),
        ) +
        (v.shift > 0
          ? span(fr.x(0.25), fr.x(0.25 + v.shift), fr.y(1.2 * total) + 9, "s") +
            text(fr.x(0.25 + v.shift) + 8, fr.y(1.2 * total) + 14, "Δs", "s", "start")
          : ""),
      legend: [
        ["one", "Welle 1"],
        ["x", "Welle 2"],
        ["ink", "Überlagerung: Summe der Auslenkungen"],
        ["s", "Gangunterschied Δs"],
      ],
    };
  },
  interference: (v) => {
    const r = interference(v.s1, v.s2, v.lambda),
      end = 440,
      // The longer path fills the width, so both wave trains stay readable.
      k = 400 / Math.max(v.s1, v.s2),
      train = (s: number, y: number, tone: Tone) => {
        const start = end - s * k;
        return (
          stroke(
            sample(start, end, Math.max(24, Math.round((s * k) / 3)), (x) => x).map(
              ([x]): Point => [x, y - 18 * Math.sin((TAU * (x - start)) / (v.lambda * k))],
            ),
            tone,
            "thin",
          ) + dot(start, y, 6, tone, "ring")
        );
      },
      common = end - Math.min(v.s1, v.s2) * k;
    return {
      label: `Zwei Wellenzüge laufen von den Zentren Z1 und Z2 zum Punkt P. Die Wege sind ${fmt(v.s1)} und ${fmt(v.s2)} Meter lang, der Gangunterschied beträgt ${fmt(r.ratio, 3)} Wellenlängen. Darunter die Überlagerung bei P: ${r.kind === "konstruktiv" ? "maximale Verstärkung" : r.kind === "destruktiv" ? "Auslöschung" : "teilweise Verstärkung"}.`,
      height: 306,
      body:
        line(end, 34, end, 282, "mute", "dash thin") +
        text(end + 8, 46, "P", "ink", "start") +
        train(v.s1, 70, "one") +
        train(v.s2, 146, "x") +
        text(end - v.s1 * k, 44, "Z₁", "one") +
        text(end - v.s2 * k, 120, "Z₂", "x") +
        (r.ds > 0
          ? span(end - v.s1 * k, end - v.s2 * k, 184, "s") +
            text(
              clamp(end - ((v.s1 + v.s2) * k) / 2, 60, 400),
              204,
              `Δs = ${fmt(r.ratio, 3)} λ`,
              "s",
            )
          : text(end - v.s1 * k, 204, "Δs = 0", "s", "start")) +
        stroke(
          sample(common, end, 120, (x) => x).map(
            ([x]): Point => [
              x,
              244 -
                18 *
                  (Math.sin((TAU * (x - end + v.s1 * k)) / (v.lambda * k)) +
                    Math.sin((TAU * (x - end + v.s2 * k)) / (v.lambda * k))),
            ],
          ),
          "ink",
          "thick",
        ) +
        text(end, 300, "Überlagerung bei P", "ink", "end", "tick"),
      legend: [
        ["one", "Wellenzug von Z₁"],
        ["x", "Wellenzug von Z₂"],
        ["s", "Gangunterschied Δs"],
        ["ink", "Überlagerung bei P"],
      ],
    };
  },
  standing: (v) => {
    const r = standing(v.L, v.n, v.c),
      length = 190 * v.L,
      x0 = 240 - length / 2,
      base = 112,
      amp = 46,
      shape = (sign: number) =>
        sample(0, length, 120, (x) => x).map(
          ([x]): Point => [
            x0 + x,
            base - sign * amp * Math.sin((v.n * Math.PI * x) / length),
          ],
        ),
      gap = length / v.n,
      labels = gap >= 30;
    return {
      label: `Stehende Welle auf einem ${fmt(v.L)} Meter langen Träger mit zwei festen Enden und ${fmt(v.n)} Schwingungsbäuchen. Knoten bleiben in Ruhe, dazwischen liegen die Bäuche. Wellenlänge ${fmt(r.lambda)} Meter, Frequenz ${fmt(r.f)} Hertz.`,
      height: 232,
      body:
        `<rect x="${n(x0 - 10)}" y="${base - 30}" width="10" height="60" rx="2" class="wall"/><rect x="${n(x0 + length)}" y="${base - 30}" width="10" height="60" rx="2" class="wall"/>` +
        area([...shape(1), ...shape(-1).reverse()], "acc") +
        stroke(shape(-1), "acc", "dash thin") +
        `<g class="flip" style="transform-origin:0px ${base}px">${stroke(shape(1), "acc", "thick")}</g>` +
        Array.from({ length: v.n }, (_, i) =>
          labels
            ? text(x0 + (i + 0.5) * gap, base - amp - 10, "B", "e")
            : "",
        ).join("") +
        Array.from(
          { length: v.n + 1 },
          (_, i) =>
            dot(x0 + i * gap, base, 5.5, "x", "ring") +
            (labels ? text(x0 + i * gap, base + 24, "K", "x") : ""),
        ).join("") +
        span(x0, x0 + (v.n >= 2 ? 2 : 1) * gap, base + amp + 26, "s") +
        text(
          x0 + ((v.n >= 2 ? 2 : 1) * gap) / 2,
          base + amp + 48,
          v.n >= 2 ? "λ" : "λ / 2",
          "s",
        ),
      legend: [
        ["x", "Knoten K: bleibt in Ruhe"],
        ["e", "Bauch B: größte Schwingungsweite"],
        ["s", v.n >= 2 ? "Wellenlänge λ" : "halbe Wellenlänge λ / 2"],
      ],
      motion: "Zeitlupe: Der Träger schwingt zwischen den beiden äußersten Lagen.",
    };
  },
  doubleslit: (v) => {
    const spacing = fringeSpacing(v.lambda, v.b, v.a),
      colour = colourHex(v.lambda),
      mark = 40 + ((v.lambda - 400) / 300) * 400,
      gap = 6 + 36 * v.b,
      screen = 190 + 50 * v.a,
      period = spacing * 7,
      fan = (y: number) =>
        `<path d="M150 ${n(y)}L${screen} 52L${screen} 148Z" fill="${colour}" opacity="0.2"/>`;
    return {
      label: `Doppelspalt: Licht der Wellenlänge ${fmt(v.lambda)} Nanometer (${colourName(v.lambda)}) fällt auf zwei Spalte im Abstand ${fmt(v.b)} Millimeter. Auf dem ${fmt(v.a)} Meter entfernten Schirm entstehen helle und dunkle Streifen im Abstand ${fmt(spacing)} Millimeter.`,
      height: 268,
      body:
        `<defs><linearGradient id="ph-spectrum"><stop offset="0" stop-color="#7a3fd0"/><stop offset="0.17" stop-color="#2f6fe0"/><stop offset="0.45" stop-color="#2fa84f"/><stop offset="0.62" stop-color="#d8b400"/><stop offset="0.72" stop-color="#e07a1f"/><stop offset="1" stop-color="#d03a2f"/></linearGradient>` +
        `<linearGradient id="ph-fringe-light"><stop offset="0" stop-color="${colour}" stop-opacity="0"/><stop offset="0.5" stop-color="${colour}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient>` +
        `<pattern id="ph-fringe" x="${n(240 - period / 2)}" y="0" width="${n(period)}" height="50" patternUnits="userSpaceOnUse"><rect width="${n(period)}" height="50" fill="url(#ph-fringe-light)"/></pattern></defs>` +
        `<rect x="40" y="14" width="400" height="12" rx="6" fill="url(#ph-spectrum)"/>` +
        `<path d="M${n(mark)} 30l-6 9h12z" class="fl q-ink"/>` +
        text(clamp(mark, 70, 410), 54, `${fmt(v.lambda)} nm`, "ink", "middle", "tick") +
        `<rect x="18" y="90" width="44" height="20" rx="4" class="fl q-ink"/>` +
        `<line x1="62" y1="100" x2="150" y2="100" stroke="${colour}" stroke-width="4"/>` +
        fan(100 - gap / 2) +
        fan(100 + gap / 2) +
        `<path d="M150 62V${n(100 - gap / 2 - 3)}M150 ${n(100 - gap / 2 + 3)}V${n(100 + gap / 2 - 3)}M150 ${n(100 + gap / 2 + 3)}V138" class="ln q-ink thick"/>` +
        line(screen, 48, screen, 152, "ink", "thick") +
        text(40, 80, "Laser", "ink", "middle", "tick") +
        text(150, 156, "Doppelspalt", "ink", "middle", "tick") +
        text(screen, 168, "Schirm", "ink", "middle", "tick") +
        `<rect x="30" y="182" width="420" height="50" rx="4" fill="#0b0d14"/><rect x="30" y="182" width="420" height="50" rx="4" fill="url(#ph-fringe)"/>` +
        (period <= 200
          ? span(240, 240 + period, 242, "s") +
            text(240 + period + 8, 247, "Streifenabstand", "s", "start", "tick")
          : "") +
        text(30, 262, "Schirmbild, 60 mm breit", "ink", "start", "tick"),
      legend: [
        ["ink", "Marke im Spektrum: gewählte Wellenlänge"],
        ["s", "Abstand benachbarter heller Streifen"],
      ],
    };
  },
  kepler: (v) => {
    const r = kepler(v.a, v.e),
      a = Math.min(190, 125 / Math.sqrt(1 - v.e * v.e)),
      b = a * Math.sqrt(1 - v.e * v.e),
      cx = 240,
      cy = 150,
      sun = cx - a * v.e,
      at = (E: number): Point => [cx - a * Math.cos(E), cy - b * Math.sin(E)],
      sector = (mean: number) =>
        area(
          [
            [sun, cy],
            ...sample(
              eccentricAnomaly(mean - 0.32, v.e),
              eccentricAnomaly(mean + 0.32, v.e),
              16,
              (E) => E,
            ).map(([E]) => at(E)),
          ],
          "x",
          "soft-strong",
        ),
      near = 40 + (70 * v.e) / 0.9,
      far = near / r.speedRatio,
      earth = a / v.a;
    return {
      label: `Bahn um die Sonne mit großer Halbachse ${fmt(v.a)} Astronomische Einheiten und Exzentrizität ${fmt(v.e)}. Die Sonne steht in einem Brennpunkt. Die beiden markierten Flächen werden in gleichen Zeiten überstrichen; im Perihel ist der Körper ${fmt(r.speedRatio)}-mal so schnell wie im Aphel.`,
      height: 300,
      body:
        (earth <= 200 && v.a > 1
          ? `<circle cx="${n(sun)}" cy="${cy}" r="${n(earth)}" class="ln q-one dash thin"/>` +
            (earth >= 20
              ? text(sun, cy - earth - 6, "Erdbahn", "one", "middle", "tick")
              : "")
          : "") +
        sector(0) +
        sector(Math.PI) +
        `<ellipse cx="${cx}" cy="${cy}" rx="${n(a)}" ry="${n(b)}" class="ln q-acc"/>` +
        line(cx - a, cy, cx + a, cy, "mute", "dash thin") +
        `<circle cx="${n(sun)}" cy="${cy}" r="11" class="sun"/>` +
        arrow(cx - a, cy, cx - a, cy + near, "v") +
        arrow(cx + a, cy, cx + a, cy - far, "v") +
        dot(cx - a, cy, 6, "acc", "body") +
        dot(cx + a, cy, 6, "acc", "body") +
        text(cx - a + 10, cy - 12, "Perihel", "ink", "start", "tick") +
        text(cx + a - 10, cy + 20, "Aphel", "ink", "end", "tick"),
      legend: [
        ["acc", "Bahn des Körpers, Sonne im Brennpunkt"],
        ["x", "gleiche Zeiten, gleiche Flächen"],
        ["v", "Bahngeschwindigkeit in Perihel und Aphel"],
        ...(v.a > 1 ? ([["one", "Erdbahn zum Vergleich (1 AE)"]] as Array<[Tone, string]>) : []),
      ],
    };
  },
  hubble: (v) => {
    const r = hubble(v.d, v.h0),
      gx = (d: number) => 40 + 0.36 * d,
      length = (speed: number) => (60 * speed) / 80000,
      fr = frame({
        left: 66,
        top: 118,
        bottom: 256,
        x1: 1000,
        y0: 0,
        y1: 80000,
        xLabel: "Entfernung in Mpc",
        yLabel: "Fluchtgeschwindigkeit in km/s",
        xTicks: [0, 250, 500, 750, 1000],
        yTicks: [0, 40000, 80000],
        digits: 0,
      }),
      galaxy = (d: number, tone: Tone, size: number) =>
        `<ellipse cx="${n(gx(d))}" cy="52" rx="${size}" ry="${n(size * 0.5)}" transform="rotate(-20 ${n(gx(d))} 52)" class="fl q-${tone}"/>`;
    return {
      label: `Oben eine Reihe von Galaxien: Je weiter eine Galaxie entfernt ist, desto länger ist ihr Geschwindigkeitspfeil. Unten das Hubble-Diagramm mit der Geraden v gleich H null mal d; die gewählte Galaxie in ${fmt(v.d)} Megaparsec entfernt sich mit ${fmt(r.v)} Kilometer pro Sekunde.`,
      height: 292,
      body:
        galaxy(0, "ink", 13) +
        text(40, 84, "wir", "ink", "middle", "tick") +
        [250, 500, 750, 1000]
          .map(
            (d) =>
              galaxy(d, "mute", 11) +
              arrow(gx(d) + 15, 52, gx(d) + 15 + length(v.h0 * d), 52, "mute"),
          )
          .join("") +
        galaxy(v.d, "acc", 13) +
        arrow(gx(v.d) + 16, 28, gx(v.d) + 16 + Math.max(3, length(r.v)), 28, "v") +
        fr.axes +
        fr.plot(
          area(
            onFrame(fr, [
              [0, 0],
              [1000, 74000],
              [1000, 67000],
            ]),
            "e",
            "soft-strong",
          ) +
            stroke(
              onFrame(fr, [
                [0, 0],
                [1000, v.h0 * 1000],
              ]),
              "acc",
            ) +
            line(fr.x(v.d), fr.y(0), fr.x(v.d), fr.y(r.v), "v", "dash thin") +
            dot(fr.x(v.d), fr.y(r.v), 6, "v", "ring"),
        ),
      legend: [
        ["v", "Fluchtgeschwindigkeit der gewählten Galaxie"],
        ["acc", "Hubble-Gerade v = H₀ · d"],
        ["e", "Bereich gemessener Werte von H₀ (67 bis 74)"],
      ],
    };
  },
  frames: (v) => {
    const w = v.obj === 0 ? 1 : 0.5,
      r = platformSpeed(v.beta, w),
      x = (speed: number) => 150 + 150 * speed,
      bar = (y: number, speed: number, tone: Tone, name: string) =>
        text(140, y + 14, name, "ink", "end", "tick") +
        rect(150, y, x(Math.min(speed, 1)) - 150, 18, tone) +
        (speed > 1 ? rect(x(1), y, x(speed) - x(1), 18, "bad", "hatch") : "") +
        text(x(speed) + 6, y + 14, `${fmt(speed, 3)} c`, "ink", "start", "tick");
    return {
      label: `Ein Zug fährt mit ${fmt(v.beta)} c am Bahnsteig vorbei und sendet ${v.obj === 0 ? "einen Lichtblitz" : "einen Körper mit 0,5 c"} nach vorn. Die Balken vergleichen die Geschwindigkeit im Zug, die klassische Erwartung ${fmt(r.classical, 3)} c und die Messung vom Bahnsteig ${fmt(r.measured, 3)} c mit der Grenze c.`,
      height: 278,
      body:
        `<path d="M20 124H460" class="axis"/>` +
        `<circle cx="52" cy="84" r="8" class="fl q-ink"/><path d="M52 92V112M40 100H64M52 112L44 124M52 112L60 124" class="ln q-ink"/>` +
        text(52, 144, "Bahnsteig", "ink", "middle", "tick") +
        `<rect x="130" y="64" width="190" height="46" rx="10" class="fl q-acc soft-strong"/><rect x="130" y="64" width="190" height="46" rx="10" class="ln q-acc"/><circle cx="170" cy="116" r="8" class="fl q-ink"/><circle cx="280" cy="116" r="8" class="fl q-ink"/>` +
        (v.beta > 0
          ? arrow(150, 46, 150 + 110 * v.beta, 46, "v") +
            text(158 + 110 * v.beta, 51, "Zug", "v", "start", "tick")
          : text(150, 51, "Zug steht", "v", "start", "tick")) +
        dot(240, 87, v.obj === 0 ? 7 : 8, v.obj === 0 ? "e" : "x", "ring") +
        arrow(250, 87, 250 + 56 * w, 87, v.obj === 0 ? "e" : "x") +
        bar(170, w, v.obj === 0 ? "e" : "x", "im Zug") +
        bar(200, r.classical, "mute", "klassisch") +
        bar(230, r.measured, "ok", "gemessen") +
        line(x(1), 160, x(1), 256, "bad", "dash") +
        text(x(1), 272, "c", "bad"),
      legend: [
        ["v", "Geschwindigkeit des Zuges"],
        [v.obj === 0 ? "e" : "x", v.obj === 0 ? "Lichtblitz im Zug" : "Körper im Zug"],
        ["ok", "Messung vom Bahnsteig"],
        ["bad", "Grenze: Lichtgeschwindigkeit c"],
      ],
    };
  },
  lorentz: (v) => {
    const g = gamma(v.beta),
      ship = 220 / g,
      bar = (y: number, share: number, tone: Tone, name: string, value: string) =>
        text(30, y - 6, name, "ink", "start", "tick") +
        rect(30, y, 300 * share, 16, tone) +
        text(38 + 300 * share, y + 13, value, tone, "start");
    return {
      label: `Ein Raumschiff, das in Ruhe 100 Meter lang ist, fliegt mit ${fmt(v.beta)} c vorbei. Für den Beobachter ist es auf ${fmt(100 / g)} Meter verkürzt. Die Balken vergleichen die Eigenzeit ${fmt(v.t0)} Sekunden mit der Zeit des Beobachters ${fmt(g * v.t0)} Sekunden.`,
      height: 226,
      body:
        `<rect x="130" y="34" width="220" height="36" rx="18" class="ln q-mute dash thin"/>` +
        `<rect x="130" y="34" width="${n(ship)}" height="36" rx="${n(Math.min(18, ship / 2))}" class="fl q-acc body"/>` +
        text(130, 26, "100 m in Ruhe", "mute", "start", "tick") +
        span(130, 130 + ship, 86, "s") +
        text(130 + ship + 8, 91, `${fmt(100 / g)} m`, "s", "start") +
        (v.beta > 0 ? arrow(370, 52, 370 + 90 * v.beta, 52, "v") : "") +
        bar(134, 1 / g, "t", "Eigenzeit der bewegten Uhr", `${fmt(v.t0)} s`) +
        bar(186, 1, "a", "Zeit für den ruhenden Beobachter", `${fmt(g * v.t0)} s`),
      legend: [
        ["v", "Geschwindigkeit des Raumschiffs"],
        ["s", "Länge für den Beobachter (Längenkontraktion)"],
        ["t", "Eigenzeit Δt₀"],
        ["a", "gedehnte Zeit Δt = γ · Δt₀"],
      ],
    };
  },
  muon: (v) => {
    const r = muon(v.beta, v.h),
      top = 46,
      ground = 250,
      depth = ground - top,
      beam = (cx: number, reach: number, tone: Tone) => {
        const edge = sample(0, 1, 28, (share) => 26 * Math.exp((-share * v.h * 1000) / reach));
        return area(
          [
            ...edge.map(([share, half]): Point => [cx - half, top + share * depth]),
            ...edge
              .reverse()
              .map(([share, half]): Point => [cx + half, top + share * depth]),
          ],
          tone,
          "beam",
        );
      },
      column = (cx: number, name: string, share: number, tone: Tone) =>
        `<rect x="${cx - 40}" y="${top}" width="80" height="${depth}" class="sky"/>` +
        text(cx, 30, name, "ink", "middle", "tick") +
        text(cx, 286, `${fmt(100 * share, 1)} % am Boden`, tone, "middle", "tick"),
      contracted = (depth * r.contractedHeight) / (v.h * 1000);
    return {
      label: `Myonen entstehen in ${fmt(v.h)} Kilometer Höhe. Links die klassische Erwartung: Der Strahl ist nach wenigen hundert Metern zerfallen. Rechts mit Zeitdilatation: ${fmt(100 * r.share, 1)} Prozent erreichen den Boden. Im System der Myonen ist die Atmosphäre nur ${fmt(r.contractedHeight / 1000)} Kilometer hoch.`,
      height: 298,
      body:
        column(120, "klassisch", r.classicalShare, "bad") +
        column(250, "mit Zeitdilatation", r.share, "ok") +
        beam(120, r.classicalReach, "bad") +
        beam(250, r.reach, "ok") +
        `<path d="M40 ${ground}H330" class="axis"/>` +
        text(72, top + 5, `${fmt(v.h)} km`, "ink", "end", "tick") +
        text(72, ground + 4, "0 km", "ink", "end", "tick") +
        line(400, top, 400, ground, "mute", "dash thin") +
        line(400, ground - contracted, 400, ground, "s", "thick") +
        `<path d="M392 ${n(ground - contracted)}H408M392 ${ground}H408" class="ln q-s"/>` +
        text(400, 30, "im Myonensystem", "ink", "middle", "tick") +
        text(400, 286, `${fmt(r.contractedHeight / 1000)} km`, "s", "middle", "tick"),
      legend: [
        ["bad", "Myonenstrahl ohne Zeitdilatation"],
        ["ok", "Myonenstrahl mit Zeitdilatation"],
        ["s", "verkürzte Atmosphäre im Myonensystem"],
      ],
    };
  },
  chain: (v) => {
    const etas = [v.e1, v.e2, v.e3],
      names = ["Kraftwerk", "Übertragung", "Gerät"],
      top = 44,
      scale = 1.4;
    let energy = 100,
      body = "";
    etas.forEach((eta, i) => {
      const x = 20 + 140 * i,
        right = x + 140,
        next = (energy * eta) / 100,
        full = energy * scale,
        keep = next * scale,
        loss = full - keep,
        left = right - loss,
        wing = Math.min(7, loss / 2),
        band = i % 2 ? "band alt" : "band";
      // The entwertete part turns down in a quarter circle; its width is the lost energy.
      body +=
        rect(x, top, 140 - loss, full, "e", band) +
        rect(left, top, loss, keep, "e", band) +
        (loss >= 1
          ? `<path d="M${n(left)} ${n(top + keep)}A${n(loss)} ${n(loss)} 0 0 1 ${n(right)} ${n(top + full)}V246H${n(right + wing)}L${n(right - loss / 2)} ${n(246 + Math.min(14, loss))}L${n(left - wing)} 246H${n(left)}Z" class="fl q-a loss"/>`
          : "") +
        text(x + 6, 20, names[i], "ink", "start", "tick") +
        text(clamp(right - loss / 2, x + 36, right - 4), 286, `−${fmt(energy - next, 1)} kWh`, "a", "middle", "tick");
      energy = next;
    });
    return {
      label: `Energieflussdiagramm: Von 100 Kilowattstunden bleiben nach Kraftwerk, Übertragung und Gerät ${fmt(energy)} Kilowattstunden nutzbar. An jeder Stufe zweigt die entwertete Energie nach unten ab.`,
      height: 298,
      body:
        body +
        `<path d="M440 ${top}H${n(456)}L472 ${n(top + (energy * scale) / 2)}L456 ${n(top + energy * scale)}H440Z" class="fl q-e"/>` +
        text(472, 38, `${fmt(energy, 1)} kWh genutzt`, "e", "end", "tick"),
      legend: [
        ["e", "nutzbare Energie, von links nach rechts"],
        ["a", "entwertete Energie: innere Energie der Umgebung"],
      ],
    };
  },
  utility: (v) => {
    const weights = [v.w1, v.w2, v.w3],
      sum = weights.reduce((a, b) => a + b, 0),
      tones: Tone[] = ["one", "ok", "e"],
      values = UTILITY_OPTIONS.map((option) => utility(weights, option.scores)),
      lead = Math.abs(values[0] - values[1]) < 1e-9 || sum === 0 ? -1 : values[0] > values[1] ? 0 : 1;
    return {
      label: `Zwei gestapelte Balken für ${UTILITY_OPTIONS[0].name} und ${UTILITY_OPTIONS[1].name}. Jeder Abschnitt ist der gewichtete Beitrag eines Kriteriums; die Gesamtlänge ist der Nutzwert von ${fmt(values[0])} und ${fmt(values[1])} Punkten.`,
      height: 196,
      body:
        UTILITY_OPTIONS.map((option, row) => {
          const y = 40 + 78 * row;
          let x = 30;
          return (
            text(30, y - 8, option.name, "ink", "start", lead === row ? "strong" : "") +
            `<rect x="30" y="${y}" width="400" height="26" rx="4" class="track"/>` +
            option.scores
              .map((score, i) => {
                const width = sum === 0 ? 0 : (80 * weights[i] * score) / sum,
                  part = rect(x, y, width, 26, tones[i]);
                x += width;
                return part;
              })
              .join("") +
            text(x + 8, y + 19, fmt(values[row]), "ink", "start")
          );
        }).join("") +
        [0, 1, 2, 3, 4, 5]
          .map(
            (points) =>
              `<text x="${30 + 80 * points}" y="186" text-anchor="middle" class="tick">${points}</text>`,
          )
          .join(""),
      legend: UTILITY_CRITERIA.map((criterion, i): [Tone, string] => [
        tones[i],
        `${criterion}: Gewicht ${fmt(weights[i])}`,
      ]),
    };
  },
  saving: (v) => {
    const r = saving(v.pOld, v.pNew, v.h, v.price),
      most = Math.max(r.oldKwh, r.newKwh),
      cx = 80,
      cy = 116,
      R = 50,
      [hx, hy] = polar(cx, cy, R, 90 - v.h * 15),
      bar = (y: number, energy: number, tone: Tone, name: string) =>
        text(190, y - 8, name, "ink", "start", "tick") +
        rect(190, y, (220 * energy) / most, 26, tone) +
        text(198 + (220 * energy) / most, y + 19, `${fmt(energy, 1)} kWh`, "ink", "start", "tick");
    return {
      label: `Links eine 24-Stunden-Uhr mit ${fmt(v.h)} Betriebsstunden pro Tag. Rechts zwei Balken: Jahresenergie bisher ${fmt(r.oldKwh, 1)} Kilowattstunden, neu ${fmt(r.newKwh, 1)} Kilowattstunden.`,
      height: 224,
      body:
        `<circle cx="${cx}" cy="${cy}" r="${R}" class="ln q-mute ring-track"/>` +
        (v.h >= 24
          ? `<circle cx="${cx}" cy="${cy}" r="${R}" class="ln q-t ring-value"/>`
          : `<path d="M${cx} ${cy - R}A${R} ${R} 0 ${v.h > 12 ? 1 : 0} 1 ${n(hx)} ${n(hy)}" class="ln q-t ring-value"/>`) +
        text(cx, cy + 2, `${fmt(v.h)} h`, "t", "middle", "strong") +
        text(cx, cy + 20, "pro Tag", "ink", "middle", "tick") +
        text(cx, 200, "Betriebsdauer", "ink", "middle", "tick") +
        bar(62, r.oldKwh, "a", `bisher: ${fmt(v.pOld)} W`) +
        bar(134, r.newKwh, "ok", `neu: ${fmt(v.pNew)} W`) +
        (r.savedKwh > 0
          ? span(190 + (220 * r.newKwh) / most, 190 + (220 * r.oldKwh) / most, 178, "e") +
            text(190 + (220 * r.oldKwh) / most, 200, `gespart: ${fmt(r.savedKwh, 1)} kWh im Jahr`, "e", "end", "tick")
          : ""),
      legend: [
        ["t", "Betriebsdauer pro Tag"],
        ["a", "Jahresenergie bisher"],
        ["ok", "Jahresenergie neu"],
        ["e", "eingesparte Energie"],
      ],
    };
  },
  euler: (v) => {
    const rows = eulerFall(1, v.k, v.dt, 6),
      end = 6 * v.dt,
      limit = terminalSpeed(1, v.k),
      exact = (t: number) =>
        limit === null ? G_EARTH * t : limit * Math.tanh((G_EARTH * t) / limit),
      high = Math.max(exact(end), Math.min(Math.max(...rows.map((row) => row.v)), 2.2 * exact(end))),
      low = Math.min(0, Math.max(Math.min(...rows.map((row) => row.v)), -0.5 * high)),
      fr = frame({
        top: 38,
        bottom: 214,
        x1: end,
        y0: low * 1.15,
        y1: high * 1.15,
        xLabel: "Zeit in s",
        yLabel: "Geschwindigkeit in m/s",
        xTicks: rows.filter((_, i) => i % 2 === 0).map((row) => Number(row.t.toFixed(6))),
      });
    return {
      label: `Geschwindigkeit eines fallenden Körpers, in sechs Schritten von je ${fmt(v.dt)} Sekunden berechnet, im Vergleich mit dem exakten Verlauf. Im ersten Schritt sind der Zeitabschnitt und der Zuwachs der Geschwindigkeit markiert.`,
      height: 252,
      body:
        fr.axes +
        fr.plot(
          stroke(onFrame(fr, sample(0, end, 60, exact)), "mute", "dash thin") +
            stroke(
              onFrame(
                fr,
                rows.map((row): Point => [row.t, row.v]),
              ),
              "acc",
            ) +
            rows.map((row) => dot(fr.x(row.t), fr.y(row.v), 5, "acc", "ring")).join("") +
            line(fr.x(0), fr.y(0), fr.x(v.dt), fr.y(0), "t", "thick") +
            line(fr.x(v.dt), fr.y(0), fr.x(v.dt), fr.y(rows[1].v), "a", "thick"),
        ) +
        text(fr.x(v.dt / 2), fr.y(0) - 8, "Δt", "t") +
        text(fr.x(v.dt) + 8, fr.y(rows[1].v / 2) + 5, "Δv = a · Δt", "a", "start"),
      legend: [
        ["acc", "Rechnung in kleinen Schritten"],
        ["mute", "exakter Verlauf zum Vergleich"],
        ["t", "Zeitschritt Δt"],
        ["a", "Zuwachs Δv = a · Δt"],
      ],
    };
  },
  airfall: (v) => {
    const steps = Math.round(20 / v.dt),
      rows = eulerFall(v.m, v.k, v.dt, steps),
      limit = terminalSpeed(v.m, v.k),
      at5 = rows[Math.round(5 / v.dt)],
      drag = (v.k * at5.v * at5.v) / (v.m * G_EARTH),
      high = Math.max(...rows.map((row) => row.v), limit ?? 0) * 1.12,
      fr = frame({
        left: 178,
        top: 38,
        bottom: 214,
        x1: 20,
        y0: 0,
        y1: high,
        xLabel: "Zeit in s",
        yLabel: "Geschwindigkeit in m/s",
        xTicks: [0, 5, 10, 15, 20],
      });
    return {
      label: `Links ein fallender Körper mit den Kräften nach 5 Sekunden: Gewichtskraft nach unten, Luftwiderstand nach oben, hier ${fmt(100 * drag)} Prozent der Gewichtskraft. Rechts die Geschwindigkeit über der Zeit${limit === null ? "; ohne Luftwiderstand wächst sie gleichmäßig" : ` mit der Endgeschwindigkeit ${fmt(limit)} Meter pro Sekunde`}.`,
      height: 252,
      body:
        text(66, 30, "Kräfte bei t = 5 s", "ink", "middle", "tick") +
        arrow(66, 128, 66, 128 + 66, "f") +
        arrow(66, 128, 66, 128 - 66 * clamp(drag, 0, 1.4), "x") +
        dot(66, 128, 13, "acc", "body") +
        text(84, 176, "F_G", "f", "start") +
        (drag > 0.02 ? text(84, 128 - 33 * clamp(drag, 0, 1.4) - 2, "F_L", "x", "start") : "") +
        fr.axes +
        fr.plot(
          (limit === null
            ? ""
            : line(fr.x(0), fr.y(limit), fr.x(20), fr.y(limit), "bad", "dash")) +
            stroke(
              onFrame(
                fr,
                rows.map((row): Point => [row.t, row.v]),
              ),
              "acc",
            ) +
            dot(fr.x(at5.t), fr.y(at5.v), 6, "e", "ring"),
        ),
      legend: [
        ["f", "Gewichtskraft F_G"],
        ["x", "Luftwiderstand F_L = k · v²"],
        ["acc", "simulierte Geschwindigkeit"],
        ["bad", "Endgeschwindigkeit: Kräftegleichgewicht"],
      ],
    };
  },
  eulerosc: (v) => {
    const r = eulerOscillation(v.m, v.D, v.dt),
      high = Math.max(5, ...r.points.map(([, x]) => Math.abs(x * 100))) * 1.2,
      fr = frame({
        top: 38,
        bottom: 214,
        x1: 4,
        y0: -high,
        y1: high,
        xLabel: "Zeit in s",
        yLabel: "Auslenkung in cm",
        xTicks: [0, 1, 2, 3, 4],
      });
    return {
      label: `Auslenkung eines simulierten Federpendels über 4 Sekunden, gerechnet mit dem Zeitschritt ${fmt(v.dt)} Sekunden, im Vergleich mit der exakten Schwingung der Periodendauer ${fmt(r.exact)} Sekunden.`,
      height: 252,
      body:
        fr.axes +
        fr.plot(
          stroke(
            onFrame(
              fr,
              sample(0, 4, 200, (t) => 5 * Math.cos((TAU * t) / r.exact)),
            ),
            "mute",
            "dash thin",
          ) +
            stroke(
              onFrame(
                fr,
                r.points.map(([t, x]): Point => [t, x * 100]),
              ),
              "acc",
            ) +
            (v.dt >= 0.04
              ? r.points
                  .map(([t, x]) => dot(fr.x(t), fr.y(x * 100), 3, "acc"))
                  .join("")
              : ""),
        ),
      legend: [
        ["acc", "Simulation in kleinen Schritten"],
        ["mute", "exakte Schwingung zum Vergleich"],
      ],
    };
  },
  solar: (v) => {
    const point = solarPoint(v.irr, v.r),
      mpp = solarMpp(v.irr),
      fr = frame({
        top: 38,
        bottom: 226,
        x1: 0.7,
        y0: 0,
        y1: 0.56,
        xLabel: "Spannung in V",
        yLabel: "Stromstärke in A",
        xTicks: [0, 0.2, 0.4, 0.6],
        yTicks: [0, 0.1, 0.2, 0.3, 0.4, 0.5],
      }),
      cell = (irr: number) =>
        onFrame(
          fr,
          sample(0, 0.7, 140, (u) => solarCurrent(irr, u)).filter(([, i]) => i >= -0.02),
        );
    return {
      label: `U-I-Kennlinie einer Solarzelle bei ${fmt(v.irr)} Watt pro Quadratmeter. Die Gerade des Lastwiderstands ${fmt(v.r)} Ohm schneidet sie im Arbeitspunkt. Das Rechteck unter dem Arbeitspunkt zeigt die Leistung ${fmt(point.p, 3)} Watt, der Maximum-Power-Point liegt bei ${fmt(mpp.p, 3)} Watt.`,
      height: 264,
      body:
        fr.axes +
        fr.plot(
          rect(fr.x(0), fr.y(point.i), fr.x(point.u) - fr.x(0), fr.y(0) - fr.y(point.i), "e", "soft-strong") +
            (v.irr < 1000 ? stroke(cell(1000), "mute", "dash thin") : "") +
            stroke(cell(v.irr), "acc", "thick") +
            line(fr.x(0), fr.y(0), fr.x(0.7), fr.y(0.7 / v.r), "one") +
            `<path d="M${n(fr.x(mpp.u))} ${n(fr.y(mpp.i) - 8)}l8 8l-8 8l-8 -8z" class="fl q-ok ring"/>` +
            dot(fr.x(point.u), fr.y(point.i), 6, "e", "ring"),
        ) +
        text(fr.x(mpp.u) + 12, fr.y(mpp.i) - 10, "MPP", "ok", "start"),
      legend: [
        ["acc", "Kennlinie der Solarzelle"],
        ["one", "Lastwiderstand: I = U / R"],
        ["e", "Arbeitspunkt, Fläche = Leistung P = U · I"],
        ["ok", "Maximum-Power-Point"],
        ...(v.irr < 1000 ? ([["mute", "Kennlinie bei 1000 W/m²"]] as Array<[Tone, string]>) : []),
      ],
    };
  },
  pvplant: (v) => {
    const r = pvPlant(v.kwp, v.spec, v.self, v.price),
      ownEuro = (r.own * v.price) / 100,
      sun = 14 + (10 * (v.spec - 800)) / 300,
      split = (y: number, share: number, name: string) =>
        text(262, y - 8, name, "ink", "start", "tick") +
        rect(262, y, 200 * share, 26, "ok") +
        rect(262 + 200 * share, y, 200 * (1 - share), 26, "one");
    return {
      label: `Haus mit ${fmt(v.kwp)} Kilowatt Peak auf dem Dach. Zwei geteilte Balken: Von ${fmt(r.energy)} Kilowattstunden Jahresertrag werden ${fmt(v.self)} Prozent selbst verbraucht; am Geldwert von ${fmt(r.euro)} Euro hat der Eigenverbrauch einen Anteil von ${fmt((100 * ownEuro) / r.euro)} Prozent.`,
      height: 268,
      body:
        `<circle cx="44" cy="44" r="${n(sun)}" class="sun"/>` +
        Array.from({ length: 8 }, (_, i) => {
          const [x1, y1] = polar(44, 44, sun + 5, i * 45),
            [x2, y2] = polar(44, 44, sun + 13, i * 45);
          return line(x1, y1, x2, y2, "e", "thin");
        }).join("") +
        `<path d="M60 250V156H200V250Z" class="house"/><path d="M40 156L72 76H188L220 156Z" class="roof"/><rect x="116" y="200" width="28" height="50" rx="2" class="fl q-mute"/>` +
        Array.from({ length: 15 }, (_, i) => {
          const column = i % 5,
            row = Math.floor(i / 5);
          return `<rect x="${78 + 21 * column - (2 - column) * (row * 3)}" y="${84 + 22 * row}" width="${17 + row * 1.5}" height="17" rx="2" class="${i < v.kwp ? "fl q-one" : "slot"}"/>`;
        }).join("") +
        `<path d="M20 250H240" class="axis"/>` +
        split(64, v.self / 100, `Energie: ${fmt(r.energy)} kWh im Jahr`) +
        split(150, ownEuro / r.euro, `Geldwert: ${fmt(r.euro)} € im Jahr`) +
        text(262, 208, "Jede Kachel steht für 1 kWp.", "mute", "start", "tick"),
      legend: [
        ["ok", "selbst verbraucht"],
        ["one", "ins Netz eingespeist"],
        ["e", "Sonne: größer bei höherem spezifischem Ertrag"],
      ],
    };
  },
  ride: (v) => {
    const r = ride(v.r, v.T),
      R = 60 + 55 * Math.sqrt((v.r - 2) / 18),
      cx = 170,
      cy = 162,
      alpha = 40,
      rad = (alpha * Math.PI) / 180,
      [x, y] = polar(cx, cy, R, alpha),
      la = Math.min(R - 12, 10 + 16 * r.gFactor),
      lv = Math.min(92, 14 + 4.2 * r.v),
      scale = (g: number) => 262 - 40 * clamp(g, 0, 5);
    return {
      label: `Karussell von oben mit Radius ${fmt(v.r)} Meter und Umlaufdauer ${fmt(v.T)} Sekunden. Die Zentripetalbeschleunigung von ${fmt(r.a)} Meter pro Sekunde zum Quadrat zeigt zur Mitte. Die Skala zeigt sie als ${fmt(r.gFactor)}-faches der Fallbeschleunigung.`,
      height: 296,
      body:
        `<circle cx="${cx}" cy="${cy}" r="${n(R)}" class="ln q-mute dash thin"/>` +
        `<g class="spin" style="--turn:${seconds(v.T)};transform-origin:${cx}px ${cy}px">` +
        Array.from({ length: 8 }, (_, i) => {
          const [gx, gy] = polar(cx, cy, R, alpha + 45 * i);
          return line(cx, cy, gx, gy, "mute", "thin") + dot(gx, gy, i ? 7 : 9, i ? "mute" : "acc", "body");
        }).join("") +
        arrow(x, y, x - Math.sin(rad) * lv, y - Math.cos(rad) * lv, "v") +
        arrow(x, y, x - Math.cos(rad) * la, y + Math.sin(rad) * la, "a") +
        "</g>" +
        dot(cx, cy, 5, "ink") +
        rect(400, scale(1.5), 22, 262 - scale(1.5), "ok", "soft-strong") +
        rect(400, scale(3), 22, scale(1.5) - scale(3), "e", "soft-strong") +
        rect(400, scale(5), 22, scale(3) - scale(5), "bad", "soft-strong") +
        `<rect x="400" y="${scale(5)}" width="22" height="200" rx="3" class="ln q-mute thin"/>` +
        [0, 1, 2, 3, 4, 5]
          .map(
            (g) =>
              `<text x="430" y="${scale(g) + 4}" class="tick">${g} g</text>`,
          )
          .join("") +
        line(390, scale(r.gFactor), 426, scale(r.gFactor), "a", "thick") +
        text(384, scale(r.gFactor) + 5, r.gFactor > 5 ? "über 5 g" : `${fmt(r.gFactor)} g`, "a", "end") +
        text(411, 44, "a_Z", "a"),
      legend: [
        ["v", "Bahngeschwindigkeit v"],
        ["a", "Zentripetalbeschleunigung a_Z, zur Mitte"],
        ["bad", "über 3 g: nur kurz auszuhalten"],
      ],
      motion: "Das Karussell dreht sich in Echtzeit mit der eingestellten Umlaufdauer.",
    };
  },
  chaos: (v) => {
    const first = logistic(v.r, v.x0, 30),
      second = logistic(v.r, v.x0 + v.d / 1000, 30),
      fr = frame({
        top: 38,
        bottom: 214,
        x1: 30,
        y0: 0,
        y1: 1,
        xLabel: "Schritt",
        yLabel: "Wert x",
        xTicks: [0, 10, 20, 30],
        yTicks: [0, 0.5, 1],
      }),
      // The first run is drawn wider, so it stays visible where both runs agree.
      run = (values: number[], tone: Tone, size: number) =>
        stroke(
          onFrame(
            fr,
            values.map((value, i): Point => [i, value]),
          ),
          tone,
          size > 3 ? "" : "thin",
        ) + values.map((value, i) => dot(fr.x(i), fr.y(value), size, tone)).join("");
    return {
      label: `Zwei Läufe derselben Rechenregel über 30 Schritte mit den Startwerten ${fmt(v.x0, 3)} und ${fmt(v.x0 + v.d / 1000, 3)}. Am Ende unterscheiden sie sich um ${fmt(Math.abs(first[30] - second[30]), 3)}.`,
      height: 252,
      body: fr.axes + fr.plot(run(first, "one", 4.5) + run(second, "x", 2.5)),
      legend: [
        ["one", `Lauf 1: Start ${fmt(v.x0, 3)}`],
        ["x", `Lauf 2: Start ${fmt(v.x0 + v.d / 1000, 3)}`],
      ],
    };
  },
};

/**
 * Fixed drawings for lessons without a model lab, keyed by the lesson id.
 * They show what the explanation of that lesson describes.
 */
const ILLUSTRATIONS: Record<string, () => Figure> = {
  "sw-lichtmodelle": () => {
    const colour = colourHex(550),
      period = 80,
      // Reproducible hits: more likely where the wave model predicts a bright stripe.
      hits: Point[] = [];
    for (let i = 0; hits.length < 420 && i < 4000; i++) {
      const x = ((pseudoNoise(i, 21) + 1) / 2) * 400,
        bright = Math.cos((Math.PI * (x - 200)) / period) ** 2;
      if ((pseudoNoise(i, 22) + 1) / 2 < bright)
        hits.push([40 + x, 4 + ((pseudoNoise(i, 23) + 1) / 2) * 36]);
    }
    const strip = (y: number, name: string, content: string) =>
      text(40, y - 8, name, "ink", "start", "tick") +
      `<rect x="40" y="${y}" width="400" height="44" rx="4" fill="#0b0d14"/>` +
      content;
    return {
      label:
        "Drei Schirmbilder hinter einem Doppelspalt. Oben wenige einzelne Treffer an zufälligen Orten, in der Mitte viele Treffer, die sich zu Streifen ordnen, unten das durchgehende Streifenmuster des Wellenmodells.",
      height: 232,
      body:
        `<defs><linearGradient id="ph-art-light"><stop offset="0" stop-color="${colour}" stop-opacity="0"/><stop offset="0.5" stop-color="${colour}"/><stop offset="1" stop-color="${colour}" stop-opacity="0"/></linearGradient><pattern id="ph-art-fringe" x="${200 + 40 - period / 2}" y="0" width="${period}" height="44" patternUnits="userSpaceOnUse"><rect width="${period}" height="44" fill="url(#ph-art-light)"/></pattern></defs>` +
        strip(
          26,
          "Photonenmodell: wenige Photonen, einzelne Treffer",
          hits
            .slice(0, 16)
            .map(([x, y]) => `<circle cx="${n(x)}" cy="${n(26 + y)}" r="2.6" fill="${colour}"/>`)
            .join(""),
        ) +
        strip(
          100,
          "sehr viele Photonen: Die Treffer ordnen sich zu Streifen",
          hits
            .map(([x, y]) => `<circle cx="${n(x)}" cy="${n(100 + y)}" r="1.8" fill="${colour}"/>`)
            .join(""),
        ) +
        strip(
          174,
          "Wellenmodell: Interferenzmuster",
          `<rect x="40" y="174" width="400" height="44" rx="4" fill="url(#ph-art-fringe)"/>`,
        ),
      legend: [
        ["ink", "Schirm hinter einem Doppelspalt, dreimal dasselbe Licht"],
      ],
    };
  },
  "ew-weltbilder": () => {
    const left = 122,
      right = 358,
      cy = 150,
      ring = (cx: number, r: number) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" class="ln q-mute dash thin"/>`,
      moon = polar(left, cy, 26, 140),
      sunGeo = polar(left, cy, 58, 35),
      epicycle = polar(left, cy, 92, 250),
      marsGeo = polar(epicycle[0], epicycle[1], 16, 20),
      earth = polar(right, cy, 52, 200),
      marsHelio = polar(right, cy, 92, 320);
    return {
      label:
        "Links das geozentrische Weltbild: Die Erde ruht im Mittelpunkt, Mond, Sonne und Mars umkreisen sie, Mars zusätzlich auf einem Hilfskreis (Epizykel). Rechts das heliozentrische Weltbild: Die Sonne steht im Mittelpunkt, Erde und Mars umkreisen sie, der Mond die Erde.",
      height: 288,
      body:
        text(left, 22, "geozentrisch · Ptolemäus", "ink") +
        text(right, 22, "heliozentrisch · Kopernikus", "ink") +
        line(240, 34, 240, 270, "mute", "thin") +
        ring(left, 26) +
        ring(left, 58) +
        ring(left, 92) +
        `<circle cx="${n(epicycle[0])}" cy="${n(epicycle[1])}" r="16" class="ln q-x thin"/>` +
        `<circle cx="${left}" cy="${cy}" r="11" class="earth"/>` +
        dot(moon[0], moon[1], 4.5, "mute", "body") +
        `<circle cx="${n(sunGeo[0])}" cy="${n(sunGeo[1])}" r="9" class="sun"/>` +
        dot(marsGeo[0], marsGeo[1], 6, "x", "body") +
        text(left, cy + 28, "Erde", "ink", "middle", "tick") +
        text(sunGeo[0] + 14, sunGeo[1] - 8, "Sonne", "e", "start", "tick") +
        text(epicycle[0] + 24, epicycle[1] + 12, "Mars auf Epizykel", "x", "start", "tick") +
        ring(right, 52) +
        ring(right, 92) +
        `<circle cx="${n(earth[0])}" cy="${n(earth[1])}" r="13" class="ln q-mute dash thin"/>` +
        `<circle cx="${right}" cy="${cy}" r="14" class="sun"/>` +
        `<circle cx="${n(earth[0])}" cy="${n(earth[1])}" r="7" class="earth"/>` +
        dot(earth[0] + 11, earth[1] - 7, 3, "mute", "body") +
        dot(marsHelio[0], marsHelio[1], 6, "x", "body") +
        text(right, cy - 22, "Sonne", "e", "middle", "tick") +
        text(earth[0] - 4, earth[1] + 28, "Erde mit Mond", "ink", "middle", "tick") +
        text(marsHelio[0] - 10, marsHelio[1] + 20, "Mars", "x", "end", "tick"),
      legend: [
        ["e", "Sonne"],
        ["x", "Mars"],
        ["mute", "Mond und Kreisbahnen"],
      ],
    };
  },
};

function frameFigure(figure: Figure, playing: boolean): string {
  const moving = playing && figure.motion !== undefined,
    legend = figure.legend.filter(([tone]) =>
      new RegExp(`q-${tone}(?![a-z])`).test(figure.body),
    );
  return `<figure class="model-figure${moving ? " playing" : ""}"><svg class="physics-figure" viewBox="0 0 ${W} ${figure.height}" role="img" aria-label="${esc(figure.label)}">${figure.body}</svg>${figure.motion ? `<div class="motion-bar"><button type="button" class="button secondary motion-toggle" data-motion aria-pressed="${moving}">${moving ? "■ Bewegung anhalten" : "▶ Bewegung zeigen"}</button><span class="small">${esc(figure.motion)}</span></div>` : ""}<ul class="figure-legend">${legend.map(([tone, label]) => `<li class="q-${tone}"><span class="swatch" aria-hidden="true"></span>${esc(label)}</li>`).join("")}</ul></figure>`;
}

/** Whether the scene of a model can be set in motion. */
export const hasMotion = (kind: ModelKind, v: Values): boolean =>
  FIGURES[kind](v).motion !== undefined;

/**
 * The drawing of a model for the current slider values, with its legend.
 * Motion never starts on its own: the learner starts and stops it.
 */
export function renderFigure(
  kind: ModelKind,
  v: Values,
  playing = false,
): string {
  return frameFigure(FIGURES[kind](v), playing);
}

/** The fixed drawing of a lesson without a model lab, or nothing. */
export function renderIllustration(lessonId: string): string {
  const illustration = ILLUSTRATIONS[lessonId];
  return illustration ? frameFigure(illustration(), false) : "";
}
export const ILLUSTRATED_LESSONS = Object.keys(ILLUSTRATIONS);

/** A plain line diagram in the colour code, for models that add a second view. */
export function renderGraph(
  points: Point[],
  xLabel: string,
  yLabel: string,
  marker?: Point,
): string {
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]),
    low = Math.min(0, ...ys),
    high = Math.max(0, ...ys),
    fr = frame({
      top: 38,
      bottom: 214,
      x1: Math.max(0, ...xs) || 1,
      y0: low,
      y1: high === low ? low + 1 : high * 1.08,
      xLabel,
      yLabel,
    });
  return `<figure class="model-figure"><svg class="physics-figure" viewBox="0 0 ${W} 252" role="img" aria-label="${esc(yLabel)} in Abhängigkeit von ${esc(xLabel)}${marker ? `; markiert ist der Punkt bei ${fmt(marker[0])} mit dem Wert ${fmt(marker[1])}` : ""}">${fr.axes}${fr.plot(stroke(onFrame(fr, points), "acc") + (marker ? line(fr.x(marker[0]), fr.y(low), fr.x(marker[0]), fr.y(marker[1]), "e", "dash thin") + dot(fr.x(marker[0]), fr.y(marker[1]), 6, "e", "ring") : ""))}</svg></figure>`;
}
