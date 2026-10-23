import { acosD, asinD, atanD, cosD, sinD, tanD } from "../curriculum/helpers";
import { fmt, linear, paren } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  angleMark,
  arc,
  arcPath,
  arrow,
  circle,
  clamp,
  clipped,
  H,
  handle,
  infoBox,
  type LabView,
  line,
  open,
  path,
  Plot,
  polar,
  polygon,
  type Pt,
  rect,
  sectorPath,
  text,
} from "./svg";

const DEG = Math.PI / 180;

/** Below this a computed sine or cosine counts as zero (cos 90° is 6 · 10⁻¹⁷ in floating point). */
const TINY = 1e-9;

// ─── Shared trigonometry of the stage ─────────────────────────────────────

/** The same angle in [0°; 360°[. */
export function norm360(deg: number): number {
  const a = ((deg % 360) + 360) % 360;
  return Math.abs(a - 360) < 1e-9 ? 0 : a;
}

/** 0 = sin, 1 = cos, 2 = tan, as the choice params of the labs number them. */
export const FN_NAMES = ["sin", "cos", "tan"] as const;

export function trig(fn: number, deg: number): number {
  return fn === 0 ? sinD(deg) : fn === 1 ? cosD(deg) : tanD(deg);
}

export function tanDefined(deg: number): boolean {
  return Math.abs(cosD(deg)) > TINY;
}

/** Cleans floating-point noise, so 30,000000000000004° shows as 30°. */
function clean(value: number): number {
  return Math.round(value * 1e6) / 1e6;
}

/**
 * The angle the calculator gives back for the value at `deg`: sin⁻¹ in
 * [−90°; 90°], cos⁻¹ in [0°; 180°], tan⁻¹ in ]−90°; 90°[. Null where tan is
 * not defined.
 */
export function calculatorAngle(fn: number, deg: number): number | null {
  if (fn === 2 && !tanDefined(deg)) return null;
  const value = trig(fn, deg);
  const raw = fn === 0 ? asinD(clamp(value, -1, 1)) : fn === 1 ? acosD(clamp(value, -1, 1)) : atanD(value);
  return clean(raw);
}

/** Every angle in [0°; 360°[ with the same sine (cosine, tangent) as `deg`: one or two, sorted. */
export function sameValueAngles(fn: number, deg: number): number[] {
  const a = norm360(clean(deg));
  if (fn === 2 && !tanDefined(a)) return [];
  const partner = norm360(fn === 0 ? 180 - a : fn === 1 ? 360 - a : a + 180);
  return Math.abs(partner - a) < 1e-9 ? [a] : [a, partner].sort((x, y) => x - y);
}

/** Where the point of an angle lies: a quadrant or an axis. */
export function quadrantName(deg: number): string {
  const a = norm360(clean(deg));
  if (a === 0) return "auf der positiven x-Achse";
  if (a === 90) return "auf der positiven y-Achse";
  if (a === 180) return "auf der negativen x-Achse";
  if (a === 270) return "auf der negativen y-Achse";
  return a < 90 ? "I. Quadrant" : a < 180 ? "II. Quadrant" : a < 270 ? "III. Quadrant" : "IV. Quadrant";
}

/** "sin 40°" or, for a negative angle, "sin(−40°)". */
export function fnAt(name: string, deg: number): string {
  return deg < 0 ? `${name}(${fmt(deg)}°)` : `${name} ${fmt(deg)}°`;
}

/** Height of a gondola in the sine lab's Ferris wheel: axle 22 m high, radius 20 m. */
export const wheelHeight = (deg: number): number => 22 + 20 * sinD(deg);

// ─── Drawing helpers ─────────────────────────────────────────────────────

/** Axes through the centre and the circle of radius 1 (r pixels). */
function circleFrame(cx: number, cy: number, r: number, ext = 22, ticks = true): string {
  let out = arrow(cx - r - ext * 0.7, cy, cx + r + ext, cy, "lab-axis", 1.4) + arrow(cx, cy + r + ext * 0.7, cx, cy - r - ext, "lab-axis", 1.4);
  out += text(cx + r + ext - 2, cy - 7, "x", "lab-text-axis", "end") + text(cx + 7, cy - r - ext + 12, "y", "lab-text-axis");
  out += circle(cx, cy, r, "lab-ink");
  if (ticks) {
    out += text(cx + r + 3, cy + 13, "1", "lab-text-tick") + text(cx - r - 3, cy + 13, "−1", "lab-text-tick", "end");
    out += text(cx - 5, cy - r - 4, "1", "lab-text-tick", "end") + text(cx - 5, cy + r + 12, "−1", "lab-text-tick", "end");
  }
  return out;
}

/** The angle (degrees, counter-clockwise, in ]−180°; 180°]) from the centre to the pointer. */
function pointerAngle(p: Pt, cx: number, cy: number): number {
  return Math.atan2(cy - p.y, p.x - cx) / DEG;
}

/** Of all angles θ + k · 360° that mark the same point, the one in [min; max] nearest to `current`. */
function sameTurn(theta: number, current: number, min: number, max: number): number {
  let best = theta;
  let distance = Number.POSITIVE_INFINITY;
  for (let k = -3; k <= 3; k++) {
    const candidate = theta + 360 * k;
    if (candidate < min - 0.5 || candidate > max + 0.5) continue;
    if (Math.abs(candidate - current) < distance) {
      best = candidate;
      distance = Math.abs(candidate - current);
    }
  }
  return best;
}

/** A plot over angles in degrees: grid every 90°, the given y ticks, axes and labels. */
function angleAxes(plot: Plot, yTicks: Array<[number, string]>, yLabel: string, labelStep: number): string {
  const { box } = plot;
  let out = rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  for (let a = Math.ceil(plot.xmin / 90) * 90; a <= plot.xmax + 1e-9; a += 90) {
    out += line(plot.X(a), box.y, plot.X(a), box.y + box.h, "lab-grid");
  }
  for (const [y] of yTicks) out += line(box.x, plot.Y(y), box.x + box.w, plot.Y(y), "lab-grid");
  const y0 = plot.Y(0);
  const x0 = clamp(plot.X(0), box.x, box.x + box.w);
  out += arrow(box.x, y0, box.x + box.w + 6, y0, "lab-axis", 1.4);
  out += arrow(x0, box.y + box.h, x0, box.y - 6, "lab-axis", 1.4);
  out += text(box.x + box.w + 4, y0 - 6, "α", "lab-text-axis", "end");
  out += text(x0 + 6, box.y + 9, yLabel, "lab-text-axis");
  for (let a = Math.ceil(plot.xmin / labelStep) * labelStep; a <= plot.xmax + 1e-9; a += labelStep) {
    if (a === 0) continue;
    out += text(plot.X(a), y0 + 13, `${fmt(a)}°`, "lab-text-tick", "middle");
  }
  for (const [y, label] of yTicks) out += text(x0 - 4, plot.Y(y) + 3.5, label, "lab-text-tick", "end");
  return out;
}

// ─── 1.1 Einheitskreis: P(cos α | sin α) and tan α on the tangent x = 1 ────

const UC = { cx: 138, cy: 172, r: 108 };

function unitCircle(v: LabValues): string {
  const { cx, cy, r } = UC;
  const a = v.alpha;
  const c = cosD(a);
  const s = sinD(a);
  const O: Pt = { x: cx, y: cy };
  const P = polar(cx, cy, r, a);
  const F: Pt = { x: P.x, y: cy };
  const tx = cx + r;
  let out = open("Einheitskreis: Punkt P(cos α | sin α) und tan α an der Tangente x = 1");
  out += line(tx, 16, tx, H - 12, "lab-dashed");
  out += text(tx + 5, H - 16, "x = 1", "lab-text-small");
  out += circleFrame(cx, cy, r);
  const leaning = Math.abs(s) > TINY && Math.abs(c) > TINY;
  if (leaning) out += polygon([O, F, P], "lab-fill-c");
  if (Math.abs(c) > TINY) out += line(O.x, O.y, F.x, F.y, "lab-side-b");
  if (Math.abs(s) > TINY) out += line(F.x, F.y, P.x, P.y, "lab-side-a");
  out += line(O.x, O.y, P.x, P.y, "lab-side-c");
  if (leaning) out += angleMark(F, O, P, 9, "lab-angle", true);
  if (a > 0) {
    out += arc(cx, cy, 24, 0, a, "lab-angle");
    const L = polar(cx, cy, 36, a / 2);
    out += text(L.x, L.y + 4, "α", "lab-text", "middle");
  }
  if (Math.abs(c) > TINY) out += text((O.x + F.x) / 2, cy + (s >= 0 ? 15 : -7), "cos α", "lab-text-small lab-text-b", "middle");
  // Outside the triangle, unless the label would run into the tangent x = 1.
  const outside = c >= 0 ? F.x + 40 < tx : true;
  const toRight = (c >= 0) === outside;
  if (Math.abs(s) > TINY) out += text(F.x + (toRight ? 6 : -6), (F.y + P.y) / 2 + 4, "sin α", "lab-text-small lab-text-a", toRight ? "start" : "end");
  const PL = polar(cx, cy, r + 15, a);
  out += text(PL.x, PL.y + 4, "P", "lab-text", "middle");

  // The tangent: the line OP meets x = 1 at T(1 | tan α).
  let tanLine = "nicht definiert (cos α = 0)";
  if (Math.abs(c) > TINY) {
    const t = s / c;
    tanLine = `= ${fmt(t, 3)}`;
    const Ty = cy - r * t;
    const top = 18;
    const bottom = H - 30;
    if (Ty >= top && Ty <= bottom) {
      out += line(O.x, O.y, tx, Ty, "lab-ghost");
      out += line(tx, cy, tx, Ty, "lab-side-ok");
      out += circle(tx, Ty, 5, "lab-point-ok");
      out += text(tx + 9, Ty + 4, "T", "lab-text lab-text-ok");
      if (Math.abs(Ty - cy) > 24) out += text(tx + 9, (cy + Ty) / 2 + 4, "tan α", "lab-text-small lab-text-ok");
    } else {
      const edgeY = t > 0 ? top : bottom;
      out += line(O.x, O.y, cx + (cy - edgeY) / t, edgeY, "lab-ghost");
      out += text(tx + 9, t > 0 ? top + 10 : bottom, "T außerhalb", "lab-text-small");
    }
  } else {
    out += text(tx + 8, cy + 30, "OP ∥ Tangente:", "lab-text-small");
    out += text(tx + 8, cy + 44, "kein Punkt T", "lab-text-small");
  }
  const s2 = Number((s * s).toFixed(3));
  out += infoBox(336, 32, [
    [`α = ${fmt(a)}°`, "lab-text lab-text-big"],
    [`P(${fmt(c, 3)} | ${fmt(s, 3)})`, "lab-text"],
    ["sin²α + cos²α", "lab-text-muted"],
    [`= ${fmt(s2, 3)} + ${fmt(1 - s2, 3)} = 1`, "lab-text-muted"],
    ["tan α = sin α : cos α", "lab-text-muted"],
    [tanLine, "lab-text lab-text-ok"],
    [quadrantName(a), "lab-text-small"],
  ]);
  out += handle("P", P.x, P.y, "Punkt P auf dem Einheitskreis");
  out += `</svg>`;
  return out;
}

// ─── 1.2 Supplement: the second angle with the same value ─────────────────

const SUP = { cx: 138, cy: 172, r: 104 };

/** Signs of sin, cos, tan in the quadrants I to IV. */
const SIGNS = [
  [1, 1, 1],
  [1, -1, -1],
  [-1, -1, 1],
  [-1, 1, -1],
];

const RELATION = ["sin(180° − α) = sin α", "cos(−α) = cos α", "tan(α + 180°) = tan α"];

function supplement(v: LabValues): string {
  const { cx, cy, r } = SUP;
  const fn = v.fn;
  const a = v.alpha;
  const name = FN_NAMES[fn];
  const here = norm360(a);
  const angles = sameValueAngles(fn, a);
  const partner = angles.find((x) => Math.abs(x - here) > 1e-9);
  const calc = calculatorAngle(fn, a);
  const c = cosD(a);
  const s = sinD(a);
  const O: Pt = { x: cx, y: cy };
  const P = polar(cx, cy, r, a);
  let out = open("Einheitskreis: Zwei Winkel mit demselben Sinus-, Kosinus- oder Tangenswert");
  out += circleFrame(cx, cy, r);
  SIGNS.forEach((signs, q) => {
    const qx = q === 0 || q === 3 ? 1 : -1;
    const qy = q < 2 ? 1 : -1;
    const positive = signs[fn] > 0;
    out += text(cx + qx * 0.72 * r, cy - qy * 1.1 * r + (qy > 0 ? 0 : 8), `${name} ${positive ? ">" : "<"} 0`, `lab-text-small ${positive ? "lab-text-ok" : "lab-text-bad"}`, "middle");
  });

  const value = trig(fn, a);
  const defined = fn !== 2 || tanDefined(a);
  // The line of equal values: y = sin α, x = cos α, or the line through O.
  if (fn === 0) {
    const y = cy - r * s;
    out += line(cx - r - 12, y, cx + r + 12, y, "lab-dashed");
  } else if (fn === 1) {
    const x = cx + r * c;
    out += line(x, cy - r - 12, x, cy + r + 12, "lab-dashed");
  } else if (defined) {
    const tx = cx + r;
    out += line(tx, 16, tx, H - 12, "lab-thin");
    out += line(cx - 1.45 * r * c, cy + 1.45 * r * s, cx + 1.45 * r * c, cy - 1.45 * r * s, "lab-dashed");
    const Ty = cy - r * value;
    if (Ty >= 18 && Ty <= H - 16) {
      out += line(tx, cy, tx, Ty, "lab-side-ok") + circle(tx, Ty, 5, "lab-point-ok");
      out += text(tx + 8, Ty + 4, "T", "lab-text lab-text-ok");
    }
  }
  for (const angle of angles) {
    const Q = polar(cx, cy, r, angle);
    if (fn === 0) out += line(Q.x, cy, Q.x, Q.y, "lab-side-a");
    if (fn === 1) out += line(cx, cy, Q.x, cy, "lab-side-b");
    out += line(O.x, O.y, Q.x, Q.y, angle === here ? "lab-side-c" : "lab-thin");
  }
  if (partner !== undefined) {
    const Pp = polar(cx, cy, r, partner);
    const L = polar(cx, cy, r + 16, partner);
    out += circle(Pp.x, Pp.y, 6, "lab-point-b");
    out += text(L.x, L.y + 4, "P′", "lab-text lab-text-b", "middle");
  }
  if (calc !== null) {
    const T = polar(cx, cy, r, calc);
    const L = polar(cx, cy, r - 22, calc - 12);
    out += circle(T.x, T.y, 12, "lab-target");
    out += text(L.x, L.y + 4, "TR", "lab-text-small lab-text-ok", "middle");
  }
  if (a !== 0 && Math.abs(a) < 360) {
    out += arc(cx, cy, 22, 0, a, "lab-angle");
    const L = polar(cx, cy, 36, a / 2);
    out += text(L.x, L.y + 4, "α", "lab-text", "middle");
  }
  const PL = polar(cx, cy, r + 16, a);
  out += text(PL.x, PL.y + 4, "P", "lab-text", "middle");

  const valueText = defined ? fmt(value, 3) : "nicht definiert";
  out += infoBox(298, 32, [
    [RELATION[fn], "lab-text lab-text-big"],
    [`P: ${fnAt(name, a)} = ${valueText}`, "lab-text"],
    [partner !== undefined ? `P′: ${fnAt(name, partner)} = ${valueText}` : defined ? "P′ = P: nur ein Winkel" : "", "lab-text lab-text-b"],
    [calc !== null ? `TR: ${name}⁻¹(${fmt(value, 3)}) = ${fmt(calc, 1)}°` : "TR: Fehler, tan nicht definiert", "lab-text-muted"],
    ["Lösungen in [0°; 360°[:", "lab-text-muted"],
    [angles.length ? angles.map((x) => `${fmt(x, 1)}°`).join(" und ") : "keine", "lab-text lab-text-ok"],
    [a < 0 || a >= 360 ? `${fmt(a)}° gehört zu ${fmt(here)}°` : "", "lab-text-small"],
  ]);
  out += handle("P", P.x, P.y, "Punkt P auf dem Einheitskreis");
  out += `</svg>`;
  return out;
}

// ─── 1.3 Steigungswinkel: two lines through S, m = tan α ───────────────────

const slopePlot = () => new Plot(-7.5, 7.5, -5, 5, { x: 20, y: 10, w: 480, h: 320 });

/** The smaller angle between two lines with these inclination angles. */
export function intersectionAngle(a1: number, a2: number): number {
  const d = Math.abs(a2 - a1);
  return d <= 90 ? d : 180 - d;
}

function lineThrough(plot: Plot, sx: number, sy: number, a: number, cls: string): string {
  const dx = cosD(a);
  const dy = sinD(a);
  return line(plot.X(sx - 20 * dx), plot.Y(sy - 20 * dy), plot.X(sx + 20 * dx), plot.Y(sy + 20 * dy), cls);
}

/** The inclination angle drawn where the line crosses the x-axis. */
function inclination(plot: Plot, sx: number, sy: number, a: number, radius: number, label: string, cls: string): string {
  if (a === 0) return "";
  const x0 = sx - (sy * cosD(a)) / sinD(a);
  if (x0 < plot.xmin + 0.6 || x0 > plot.xmax - 0.6) return "";
  const Z = plot.P(x0, 0);
  const L = polar(Z.x, Z.y, radius + 12, a / 2);
  return path(arcPath(Z.x, Z.y, radius, 0, a), "lab-angle") + text(L.x, L.y + 4, label, cls, "middle");
}

/** A handle on the line, `dist` units from S, on the side that stays in the plot. */
function rotationPoint(plot: Plot, sx: number, sy: number, a: number, dist: number): Pt {
  const fwd = { x: sx + dist * cosD(a), y: sy + dist * sinD(a) };
  const back = { x: sx - dist * cosD(a), y: sy - dist * sinD(a) };
  const inside = (q: { x: number; y: number }) => q.x > plot.xmin + 0.3 && q.x < plot.xmax - 0.3 && q.y > plot.ymin + 0.3 && q.y < plot.ymax - 0.3;
  const underInfo = (q: { x: number; y: number }) => q.x < 3.2 && q.y > 2.2;
  const p = inside(fwd) && (!underInfo(fwd) || !inside(back)) ? fwd : back;
  return plot.P(p.x, p.y);
}

/** A line's inclination angle from a pointer position: the direction from S, taken mod 180°. */
function lineAngleTowards(p: Pt, v: LabValues): number | null {
  const plot = slopePlot();
  const dx = p.x - plot.X(v.sx);
  const dy = plot.Y(v.sy) - p.y;
  if (Math.hypot(dx, dy) < 8) return null;
  let a = (((Math.atan2(dy, dx) / DEG) % 180) + 180) % 180;
  if (a > 179.5) a -= 180;
  return a;
}

/** "y = 0,58x + 0,42", or "x = 1" for a vertical line. */
export function lineEquation(a: number, sx: number, sy: number): string {
  if (a === 90) return `x = ${fmt(sx)}`;
  const m = tanD(a);
  return `y = ${linear(m, sy - m * sx)}`;
}

function slopeAngle(v: LabValues): string {
  const plot = slopePlot();
  const { a1, a2, sx, sy } = v;
  const S = plot.P(sx, sy);
  const d = Math.abs(a2 - a1);
  let out = open("Zwei Geraden durch S mit ihren Steigungswinkeln und ihrem Schnittwinkel");
  out += plot.clip("clip-slope") + plot.grid(1, 2);
  out += clipped("clip-slope", lineThrough(plot, sx, sy, a2, "lab-curve-2") + lineThrough(plot, sx, sy, a1, "lab-curve"));
  out += inclination(plot, sx, sy, a1, 20, "α₁", "lab-text lab-text-a");
  out += inclination(plot, sx, sy, a2, 32, "α₂", "lab-text lab-text-b");
  if (d > 0) {
    const lo = Math.min(a1, a2);
    const hi = Math.max(a1, a2);
    if (d === 90) {
      out += angleMark(S, polar(S.x, S.y, 20, lo), polar(S.x, S.y, 20, hi), 16, "lab-angle-ok", true);
    } else {
      out += path(d < 90 ? sectorPath(S.x, S.y, 26, lo, hi) : sectorPath(S.x, S.y, 26, hi, lo + 180), "lab-fill-ok");
    }
    const mid = d <= 90 ? (lo + hi) / 2 : (hi + lo + 180) / 2;
    const L = polar(S.x, S.y, 44, mid);
    out += text(L.x, L.y + 4, `φ = ${fmt(intersectionAngle(a1, a2))}°`, "lab-text-small lab-text-ok", "middle");
  }
  const phiLine =
    d === 0
      ? "α₁ = α₂: g und h fallen zusammen"
      : d === 90
        ? "|α₂ − α₁| = 90°: g und h stehen senkrecht"
        : d < 90
          ? `φ = |α₂ − α₁| = ${fmt(d)}°`
          : `|α₂ − α₁| = ${fmt(d)}° > 90°, also φ = 180° − ${fmt(d)}° = ${fmt(180 - d)}°`;
  out += infoBox(32, 32, [
    [`g: ${lineEquation(a1, sx, sy)}`, "lab-text lab-text-a"],
    [`h: ${lineEquation(a2, sx, sy)}`, "lab-text lab-text-b"],
    [`α₁ = ${fmt(a1)}°, α₂ = ${fmt(a2)}°`, "lab-text-muted"],
    [phiLine, "lab-text lab-text-ok"],
  ]);
  const G = rotationPoint(plot, sx, sy, a1, 2.4);
  const Hh = rotationPoint(plot, sx, sy, a2, 3.6);
  out += text(S.x + 10, S.y + 18, "S", "lab-text");
  out += handle("S", S.x, S.y, "Schnittpunkt S verschieben");
  out += handle("g", G.x, G.y, "Gerade g drehen", "lab-handle lab-handle-a");
  out += handle("h", Hh.x, Hh.y, "Gerade h drehen", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

// ─── 1.4 Sinusfunktion: point on the circle, point on the graph ───────────

const SINE = { cx: 95, cy: 178, r: 68 };
const SINE_BOX = { x: 185, y: 93, w: 320, h: 170 };
/** Same pixel scale as the circle, so P and the graph point lie at the same height. */
const sinePlot = (ctx: number) => (ctx === 1 ? new Plot(0, 720, -3, 47, SINE_BOX) : new Plot(0, 720, -1.25, 1.25, SINE_BOX));

function sineGraph(v: LabValues): string {
  const { cx, cy, r } = SINE;
  const wheel = v.ctx === 1;
  const plot = sinePlot(v.ctx);
  const f = wheel ? wheelHeight : sinD;
  const a = v.alpha;
  const P = polar(cx, cy, r, a);
  const Q = plot.P(a, f(a));
  let out = open(wheel ? "Riesenrad und die Höhe der Gondel als Sinuskurve" : "Einheitskreis und Sinuskurve: derselbe Punkt, dieselbe Höhe");
  if (wheel) {
    const ground = plot.Y(0);
    out += line(12, ground, 178, ground, "lab-ink");
    out += line(cx, cy, cx - 36, ground, "lab-ink") + line(cx, cy, cx + 36, ground, "lab-ink");
    for (let k = 0; k < 8; k++) {
      const G = polar(cx, cy, r, k * 45);
      out += line(cx, cy, G.x, G.y, "lab-thin") + circle(G.x, G.y, 3, "lab-dot-small");
    }
    out += circle(cx, cy, r, "lab-ink") + circle(cx, cy, 4, "lab-dot-small");
    out += line(cx, cy, cx + r + 12, cy, "lab-dashed");
    out += line(P.x, ground, P.x, P.y, "lab-side-a");
  } else {
    out += circleFrame(cx, cy, r, 14, false);
    out += line(P.x, cy, P.x, P.y, "lab-side-a");
  }
  out += line(cx, cy, P.x, P.y, "lab-side-c");
  const turned = norm360(a);
  if (turned > 0) out += arc(cx, cy, 18, 0, turned, "lab-angle");

  const ticks: Array<[number, string]> = wheel
    ? [[10, "10"], [20, "20"], [30, "30"], [40, "40"]]
    : [[1, "1"], [0.5, "0,5"], [-0.5, "−0,5"], [-1, "−1"]];
  out += plot.clip("clip-sine") + angleAxes(plot, ticks, wheel ? "h in m" : "y", 90);
  out += clipped("clip-sine", plot.graph(f, "lab-curve", 360));
  for (const k of [-1, 1]) {
    const b = a + 360 * k;
    if (b >= 0 && b <= 720) out += circle(plot.X(b), plot.Y(f(b)), 7, "lab-target");
  }
  out += line(P.x, P.y, Q.x, Q.y, "lab-dashed");
  out += line(Q.x, plot.Y(0), Q.x, Q.y, "lab-side-a");
  out += infoBox(
    24,
    30,
    wheel
      ? [
          ["h = 22 m + 20 m · sin α", "lab-text lab-text-big"],
          [`α = ${fmt(a)}°: h = ${fmt(f(a), 2)} m`, "lab-text"],
          ["höchster Punkt 42 m, tiefster Punkt 2 m", "lab-text-small"],
        ]
      : [
          ["y = sin α", "lab-text lab-text-big"],
          [`sin ${fmt(a)}° = ${fmt(f(a), 3)}`, "lab-text"],
          ["Periode 360°: sin(α + 360°) = sin α", "lab-text-small"],
        ],
  );
  out += handle("P", P.x, P.y, wheel ? "Gondel auf dem Riesenrad" : "Punkt P auf dem Einheitskreis");
  out += handle("Q", Q.x, Q.y, "Punkt auf der Kurve", "lab-handle lab-handle-a");
  out += `</svg>`;
  return out;
}

// ─── 1.5 Kosinus, Tangens, Komplement ─────────────────────────────────────

const CT = { cx: 88, cy: 175 };
const ctRadius = (view: number) => (view === 1 ? 45 : 68);
/** Same pixel scale as the circle in every view, so T and the tangent graph lie at the same height. */
const ctPlot = (view: number) =>
  view === 1
    ? new Plot(-360, 360, -3.4, 3.4, { x: 180, y: 22, w: 330, h: 306 })
    : new Plot(-360, 360, -1.25, 1.25, { x: 180, y: 90, w: 330, h: 170 });

/** The handle on the graph: (α | cos α), or (α | tan α) while it is inside the plot. */
function ctGraphPoint(v: LabValues): Pt | null {
  const plot = ctPlot(v.view);
  if (v.view !== 1) return plot.P(v.alpha, cosD(v.alpha));
  if (!tanDefined(v.alpha) || Math.abs(tanD(v.alpha)) > 3.35) return null;
  return plot.P(v.alpha, tanD(v.alpha));
}

function cosTan(v: LabValues): string {
  const view = v.view;
  const r = ctRadius(view);
  const { cx, cy } = CT;
  const plot = ctPlot(view);
  const a = v.alpha;
  const c = cosD(a);
  const s = sinD(a);
  const O: Pt = { x: cx, y: cy };
  const P = polar(cx, cy, r, a);
  const title = ["Einheitskreis und Kosinuskurve", "Einheitskreis, Tangente und Tangenskurve mit Asymptoten", "Komplementwinkel: sin(90° − α) = cos α"][view];
  let out = open(title);
  out += circleFrame(cx, cy, r, 14, false);
  const ticks: Array<[number, string]> =
    view === 1
      ? [[3, "3"], [2, "2"], [1, "1"], [-1, "−1"], [-2, "−2"], [-3, "−3"]]
      : [[1, "1"], [0.5, "0,5"], [-0.5, "−0,5"], [-1, "−1"]];
  out += plot.clip("clip-ct") + angleAxes(plot, ticks, "y", 90);
  const Q = ctGraphPoint(v);
  let info: Array<[string, string]>;

  if (view === 0) {
    out += clipped("clip-ct", plot.graph(sinD, "lab-ghost", 360) + plot.graph(cosD, "lab-curve", 360));
    const yA = plot.Y(1.12);
    out += arrow(plot.X(90), yA, plot.X(0), yA, "lab-axis", 1.6);
    out += text(plot.X(0) - 6, yA + 4, "90° nach links", "lab-text-small", "end");
    out += line(cx, cy, P.x, cy, "lab-side-b") + line(P.x, cy, P.x, P.y, "lab-dashed");
    out += line(cx, cy, P.x, P.y, "lab-side-c");
    if (Q) {
      const b = a + 90;
      if (b <= 360) {
        out += line(plot.X(b), Q.y, Q.x, Q.y, "lab-dashed") + circle(plot.X(b), Q.y, 6, "lab-target");
      }
      out += line(Q.x, plot.Y(0), Q.x, Q.y, "lab-side-b");
    }
    info = [
      ["y = cos α", "lab-text lab-text-big"],
      ["cos α = sin(α + 90°)", "lab-text-muted"],
      [`${fnAt("cos", a)} = ${fmt(c, 3)}`, "lab-text"],
    ];
  } else if (view === 1) {
    const tx = cx + r;
    let asymptotes = "";
    for (const b of [-270, -90, 90, 270]) asymptotes += line(plot.X(b), plot.box.y, plot.X(b), plot.box.y + plot.box.h, "lab-dashed");
    out += clipped("clip-ct", asymptotes + plot.graph(tanD, "lab-curve", 480));
    out += line(tx, 22, tx, H - 12, "lab-thin");
    out += line(cx, cy, P.x, P.y, "lab-side-c");
    if (tanDefined(a)) {
      const t = s / c;
      const Ty = cy - r * t;
      if (Ty >= 24 && Ty <= H - 14) {
        out += line(O.x, O.y, tx, Ty, "lab-ghost") + line(tx, cy, tx, Ty, "lab-side-ok") + circle(tx, Ty, 5, "lab-point-ok");
        if (Q) out += line(tx, Ty, Q.x, Q.y, "lab-dashed");
      }
    }
    info = [
      ["y = tan α", "lab-text lab-text-big"],
      ["Periode 180°", "lab-text-muted"],
      ["Asymptoten: 90° + k · 180°", "lab-text-small"],
      [tanDefined(a) ? `${fnAt("tan", a)} = ${fmt(s / c, 3)}` : `${fnAt("tan", a)}: nicht definiert`, "lab-text"],
    ];
  } else {
    const b = 90 - a;
    const Pp = polar(cx, cy, r, b);
    const M1 = polar(cx, cy, 1.25 * r, 225);
    const M2 = polar(cx, cy, 1.25 * r, 45);
    out += line(M1.x, M1.y, M2.x, M2.y, "lab-dashed");
    out += line(cx, cy, P.x, cy, "lab-side-b") + line(P.x, cy, P.x, P.y, "lab-side-a") + line(cx, cy, P.x, P.y, "lab-side-c");
    out += line(cx, cy, Pp.x, cy, "lab-side-a") + line(Pp.x, cy, Pp.x, Pp.y, "lab-side-b") + line(cx, cy, Pp.x, Pp.y, "lab-thin");
    out += circle(Pp.x, Pp.y, 6, "lab-point-b");
    const L = polar(cx, cy, r + 14, b);
    out += text(L.x, L.y + 4, "P′", "lab-text lab-text-b", "middle");
    out += clipped("clip-ct", plot.graph(sinD, "lab-curve-2", 360) + plot.graph(cosD, "lab-curve", 360));
    if (Q) {
      const shown = b > 360 ? b - 360 : b;
      const Q2 = plot.P(shown, sinD(shown));
      out += line(Q2.x, Q2.y, Q.x, Q.y, "lab-dashed") + circle(Q2.x, Q2.y, 6, "lab-point-b");
    }
    info = [
      ["sin(90° − α) = cos α", "lab-text lab-text-big"],
      ["cos(90° − α) = sin α", "lab-text-muted"],
      [`α = ${fmt(a)}°, 90° − α = ${fmt(b)}°`, "lab-text-small"],
    ];
  }
  const PL = polar(cx, cy, r + 14, a);
  out += text(PL.x, PL.y + 4, "P", "lab-text", "middle");
  out += infoBox(24, view === 1 ? 252 : 30, info);
  out += handle("P", P.x, P.y, "Punkt P auf dem Einheitskreis");
  if (Q) out += handle("Q", Q.x, Q.y, "Punkt auf der Kurve", "lab-handle lab-handle-a");
  out += `</svg>`;
  return out;
}

// ─── 1.6 Additionstheoreme: the height of P as a sum of two pieces ─────────

const ADD = { cx: 125, cy: 215, r: 85 };
const BARS = { base: 240, scale: 65, x1: 322, x2: 424, w: 56 };

function addition(v: LabValues): string {
  const { cx, cy, r } = ADD;
  const a = v.alpha;
  const b = v.beta;
  const cosMode = v.fn === 1;
  const sa = sinD(a);
  const ca = cosD(a);
  const sb = sinD(b);
  const cb = cosD(b);
  const O: Pt = { x: cx, y: cy };
  const A = polar(cx, cy, r, a);
  const Q = polar(cx, cy, r * cb, a);
  const P = polar(cx, cy, r, a + b);
  let out = open(cosMode ? "Additionstheorem: cos(α + β) als Differenz zweier Strecken" : "Additionstheorem: sin(α + β) als Summe zweier Strecken");
  out += circleFrame(cx, cy, r, 18, false);
  out += line(O.x, O.y, A.x, A.y, "lab-dashed");
  if (Math.abs(sb) > 0.02) out += polygon([O, Q, P], "lab-fill-c");
  out += line(O.x, O.y, Q.x, Q.y, "lab-ink") + line(Q.x, Q.y, P.x, P.y, "lab-ink") + line(O.x, O.y, P.x, P.y, "lab-side-c");
  if (Math.abs(sb) > 0.12 && Math.abs(cb) > 0.12) out += angleMark(Q, O, P, 8, "lab-angle", true);
  if (cosMode) {
    out += line(Q.x, Q.y, Q.x, P.y, "lab-dashed");
    out += line(cx, P.y, Q.x, P.y, "lab-side-a") + line(Q.x, P.y, P.x, P.y, "lab-side-b");
  } else {
    out += line(Q.x, Q.y, P.x, Q.y, "lab-dashed");
    out += line(P.x, cy, P.x, Q.y, "lab-side-a") + line(P.x, Q.y, P.x, P.y, "lab-side-b");
  }
  if (a > 0) {
    out += arc(cx, cy, 22, 0, a, "lab-angle");
    const L = polar(cx, cy, 31, a / 2);
    out += text(L.x, L.y + 4, "α", "lab-text-small", "middle");
  }
  if (b !== 0) {
    out += arc(cx, cy, 40, a, a + b, "lab-angle");
    const L = polar(cx, cy, 50, a + b / 2);
    out += text(L.x, L.y + 4, "β", "lab-text-small", "middle");
  }
  if (Math.abs(cb) > 0.3 && Math.abs(b) >= 25) {
    const M = polar(cx, cy, (r * cb) / 2, a);
    const side = b >= 0 ? 1 : -1;
    out += text(M.x + side * 14 * sa, M.y + side * 14 * ca + 4, "cos β", "lab-text-small", "middle");
  }

  // The bars: blue + orange is the theorem, purple the tempting sum of single values.
  const Yb = (value: number) => BARS.base - value * BARS.scale;
  const { x1, x2, w } = BARS;
  const p1 = cosMode ? ca * cb : sa * cb;
  const p2 = cosMode ? -sa * sb : ca * sb;
  const total = p1 + p2;
  const w1 = cosMode ? ca : sa;
  const w2 = cosMode ? cb : sb;
  const wrong = w1 + w2;
  // The reference lines ±1 stop beside each bar, so the value labels there stay clear of them.
  for (const level of [1, -1]) out += line(x1 - 18, Yb(level), x1 + w + 5, Yb(level), "lab-dashed") + line(x2 - 2, Yb(level), x2 + w + 5, Yb(level), "lab-dashed");
  out += text(x1 - 22, Yb(1) + 4, "1", "lab-text-tick", "end") + text(x1 - 22, Yb(-1) + 4, "−1", "lab-text-tick", "end");
  out += rect(x1, Yb(0), w, Yb(p1) - Yb(0), "lab-fill-a") + rect(x1, Yb(p1), w, Yb(total) - Yb(p1), "lab-fill-b");
  out += rect(x2, Yb(0), w, Yb(w1) - Yb(0), "lab-fill-c") + rect(x2, Yb(w1), w, Yb(wrong) - Yb(w1), "lab-fill-c");
  out += line(x1 - 18, Yb(0), x2 + w + 12, Yb(0), "lab-axis");
  out += line(x1 - 5, Yb(total), x1 + w + 5, Yb(total), "lab-ink");
  out += line(x2 - 5, Yb(wrong), x2 + w + 5, Yb(wrong), "lab-ink lab-bad-stroke");
  out += text(x1 + w + 8, Yb(total) + 4, fmt(total, 3), "lab-text");
  out += text(x2 + w + 8, Yb(wrong) + 4, fmt(wrong, 3), "lab-text lab-text-bad");
  if (wrong > 1 + 1e-9) out += text(x2 + w / 2, Yb(wrong) - 22, "> 1: unmöglich!", "lab-text-small lab-text-bad", "middle");
  out += text(x1 + w / 2, 328, cosMode ? "cos(α + β)" : "sin(α + β)", "lab-text-small", "middle");
  out += text(x2 + w / 2, 328, cosMode ? "cos α + cos β" : "sin α + sin β", "lab-text-small lab-text-bad", "middle");

  const name = cosMode ? "cos" : "sin";
  const same = Math.abs(wrong - total) < 5e-4;
  out += infoBox(24, 30, [
    [cosMode ? "cos(α + β) = cos α · cos β − sin α · sin β" : "sin(α + β) = sin α · cos β + cos α · sin β", "lab-text"],
    [
      cosMode
        ? `${fnAt("cos", a + b)} = ${fmt(ca, 3)} · ${fmt(cb, 3)} − ${fmt(sa, 3)} · ${paren(sb, 3)} = ${fmt(total, 3)}`
        : `${fnAt("sin", a + b)} = ${fmt(sa, 3)} · ${fmt(cb, 3)} + ${fmt(ca, 3)} · ${paren(sb, 3)} = ${fmt(total, 3)}`,
      "lab-text-muted",
    ],
    [`${name} α + ${name} β = ${fmt(wrong, 3)} ${same ? "=" : "≠"} ${name}(α + β)`, same ? "lab-text-muted" : "lab-text lab-text-bad"],
  ]);
  out += handle("A", A.x, A.y, "Winkel α einstellen", "lab-handle lab-handle-a");
  out += handle("P", P.x, P.y, "Winkel β einstellen");
  out += `</svg>`;
  return out;
}

export const EINHEITSKREIS_VIEWS: Record<"unit-circle" | "supplement" | "slope-angle" | "sine-graph" | "cos-tan-graph" | "addition-theorem", LabView> = {
  "unit-circle": {
    render: unitCircle,
    handles: {
      P: { y: "alpha", drag: (p, v) => ({ alpha: sameTurn(pointerAngle(p, UC.cx, UC.cy), v.alpha, 0, 359) }) },
    },
  },
  supplement: {
    render: supplement,
    handles: {
      P: { y: "alpha", drag: (p, v) => ({ alpha: sameTurn(pointerAngle(p, SUP.cx, SUP.cy), v.alpha, -180, 360) }) },
    },
  },
  "slope-angle": {
    render: slopeAngle,
    handles: {
      S: {
        x: "sx",
        y: "sy",
        drag: (p) => {
          const plot = slopePlot();
          return { sx: plot.invX(p.x), sy: plot.invY(p.y) };
        },
      },
      g: {
        y: "a1",
        drag: (p, v) => {
          const a = lineAngleTowards(p, v);
          return a === null ? {} : { a1: a };
        },
      },
      h: {
        y: "a2",
        drag: (p, v) => {
          const a = lineAngleTowards(p, v);
          return a === null ? {} : { a2: a };
        },
      },
    },
  },
  "sine-graph": {
    render: sineGraph,
    handles: {
      P: { y: "alpha", drag: (p, v) => ({ alpha: sameTurn(pointerAngle(p, SINE.cx, SINE.cy), v.alpha, 0, 720) }) },
      Q: { x: "alpha", drag: (p, v) => ({ alpha: sinePlot(v.ctx).invX(p.x) }) },
    },
  },
  "cos-tan-graph": {
    render: cosTan,
    handles: {
      P: { y: "alpha", drag: (p, v) => ({ alpha: sameTurn(pointerAngle(p, CT.cx, CT.cy), v.alpha, -360, 360) }) },
      Q: { x: "alpha", drag: (p, v) => ({ alpha: ctPlot(v.view).invX(p.x) }) },
    },
  },
  "addition-theorem": {
    render: addition,
    handles: {
      A: { y: "alpha", drag: (p) => ({ alpha: pointerAngle(p, ADD.cx, ADD.cy) }) },
      P: {
        y: "beta",
        drag: (p, v) => {
          let b = pointerAngle(p, ADD.cx, ADD.cy) - v.alpha;
          while (b >= 180) b -= 360;
          while (b < -180) b += 360;
          return { beta: b };
        },
      },
    },
  },
};
