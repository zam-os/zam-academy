import { fmt, linear, paren, point, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  angleMark,
  arcPath,
  circle,
  clamp,
  clipped,
  handle,
  type LabView,
  line,
  open,
  Plot,
  polygon,
  type Pt,
  text,
} from "./svg";

// ─── Vectors as plain pairs ────────────────────────────────────────────────

export interface Vec {
  x: number;
  y: number;
}

export const vec = (x: number, y: number): Vec => ({ x, y });
export const add = (a: Vec, b: Vec): Vec => ({ x: a.x + b.x, y: a.y + b.y });
export const sub = (a: Vec, b: Vec): Vec => ({ x: a.x - b.x, y: a.y - b.y });
export const mul = (k: number, a: Vec): Vec => ({ x: k * a.x, y: k * a.y });
/** The scalar product a ⊙ b = a_x · b_x + a_y · b_y. */
export const dot = (a: Vec, b: Vec): number => a.x * b.x + a.y * b.y;
/** The two-row determinant det(a, b) = a_x · b_y − a_y · b_x. */
export const det = (a: Vec, b: Vec): number => a.x * b.y - a.y * b.x;
export const norm = (a: Vec): number => Math.hypot(a.x, a.y);
export const same = (a: Vec, b: Vec, eps = 1e-9): boolean => Math.abs(a.x - b.x) < eps && Math.abs(a.y - b.y) < eps;

/** cos of an angle in degrees, exact at the angles a learner meets (no 6·10⁻¹⁷ for cos 90°). */
export function cosDeg(deg: number): number {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0) return 1;
  if (r === 90 || r === 270) return 0;
  if (r === 180) return -1;
  if (r === 60 || r === 300) return 0.5;
  if (r === 120 || r === 240) return -0.5;
  return Math.cos((deg * Math.PI) / 180);
}

/** sin of an angle in degrees, exact at the angles a learner meets. */
export function sinDeg(deg: number): number {
  const r = ((deg % 360) + 360) % 360;
  if (r === 0 || r === 180) return 0;
  if (r === 90) return 1;
  if (r === 270) return -1;
  if (r === 30 || r === 150) return 0.5;
  if (r === 210 || r === 330) return -0.5;
  return Math.sin((deg * Math.PI) / 180);
}

/** P rotated about Z by phi degrees, counter-clockwise for phi > 0. */
export function rotateAbout(p: Vec, z: Vec, phi: number): Vec {
  const c = cosDeg(phi);
  const s = sinDeg(phi);
  const d = sub(p, z);
  return { x: z.x + c * d.x - s * d.y, y: z.y + s * d.x + c * d.y };
}

/** P mirrored at the line through O that makes the angle alpha (degrees) with the x-axis. */
export function reflectAt(p: Vec, alpha: number): Vec {
  const c = cosDeg(2 * alpha);
  const s = sinDeg(2 * alpha);
  return { x: c * p.x + s * p.y, y: s * p.x - c * p.y };
}

/** The angle between a and b in degrees (0° to 180°); null when one of them is the zero vector. */
export function angleBetween(a: Vec, b: Vec): number | null {
  const n = norm(a) * norm(b);
  if (n < 1e-12) return null;
  return (Math.acos(clamp(dot(a, b) / n, -1, 1)) * 180) / Math.PI;
}

/** "√34 ≈ 5,83" for a length given by its square, or "5" when the root is whole. */
export function rootText(square: number, digits = 2): string {
  const root = Math.sqrt(square);
  if (Math.abs(root - Math.round(root)) < 1e-9) return fmt(Math.round(root));
  return `√${fmt(square, digits)} ≈ ${fmt(root, digits)}`;
}

// ─── Vectors and matrices in HTML ──────────────────────────────────────────
// No CSS class of the app draws a column vector, so these carry inline
// styles (and a class name as a hook for a shared style later).

const BRACKETS = "border-left:1.5px solid currentColor;border-right:1.5px solid currentColor";
const COLUMN_STYLE = `display:inline-flex;flex-direction:column;align-items:center;vertical-align:middle;line-height:1.15;padding:0.05em 0.38em;margin:0 0.12em;${BRACKETS};border-radius:0.65em / 50%`;
const GRID_STYLE = `display:inline-grid;grid-template-columns:auto auto;column-gap:0.7em;justify-items:center;align-items:center;vertical-align:middle;line-height:1.15;padding:0.05em 0.38em;margin:0 0.12em;${BRACKETS}`;

const cell = (value: number | string): string => (typeof value === "number" ? fmt(value) : value);

/** A column vector (x over y) in round brackets. */
export function vecHtml(x: number | string, y: number | string): string {
  return `<span class="vec" style="${COLUMN_STYLE}"><span>${cell(x)}</span><span>${cell(y)}</span></span>`;
}

/** A column vector of a pair, its coordinates rounded to `digits`. */
export function colHtml(v: Vec, digits = 2): string {
  return vecHtml(fmt(v.x, digits), fmt(v.y, digits));
}

/** A 2×2 matrix in round brackets, given row by row. */
export function matHtml(a: number | string, b: number | string, c: number | string, d: number | string): string {
  return `<span class="mat" style="${GRID_STYLE};border-radius:0.65em / 50%"><span>${cell(a)}</span><span>${cell(b)}</span><span>${cell(c)}</span><span>${cell(d)}</span></span>`;
}

/** A two-row determinant between straight bars, given row by row. */
export function detHtml(a: number | string, b: number | string, c: number | string, d: number | string): string {
  return `<span class="det" style="${GRID_STYLE}"><span>${cell(a)}</span><span>${cell(b)}</span><span>${cell(c)}</span><span>${cell(d)}</span></span>`;
}

/** A vector name with the arrow above it: vn("AB") is AB→. */
export function vn(name: string): string {
  const visible = name.replace(/<[^>]+>/g, "");
  const arrow = visible.length > 1 ? "⟶" : "→";
  return `<span class="vname" style="display:inline-block;position:relative;line-height:1;padding-top:0.42em"><span aria-hidden="true" style="position:absolute;left:0;right:0;top:0;text-align:center;font-size:0.7em;line-height:0.8">${arrow}</span>${name}</span>`;
}

// ─── Vectors and matrices in SVG ───────────────────────────────────────────

/** Rough width of one character of a lab text class, as infoBox() estimates it. */
function charWidth(cls: string): number {
  return cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : cls.includes("muted") ? 6.7 : 7.3;
}

/** The stroke class in the colour of a text class, for the arrows over names. */
function strokeFor(cls: string): string {
  if (cls.includes("lab-text-a")) return "lab-side-a";
  if (cls.includes("lab-text-b")) return "lab-side-b";
  if (cls.includes("lab-text-c")) return "lab-side-c";
  if (cls.includes("lab-text-ok")) return "lab-side-ok";
  return "lab-ink";
}

const n1 = (value: number): string => value.toFixed(1);

/** A thin line of a class whose CSS stroke is too heavy for brackets and small arrows. */
function thin(x1: number, y1: number, x2: number, y2: number, cls: string, width = 1.2): string {
  return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${cls}" style="stroke-width:${width}" />`;
}

/** A vector name with a small arrow above it; returns the drawing and its width. */
function svgName(x: number, baseline: number, name: string, cls: string): { svg: string; w: number } {
  const letters = name.replace(/'/g, "").length;
  const w = letters * (cls.includes("small") ? 7 : 8.4) + (name.includes("'") ? 3 : 0);
  const y = baseline - (cls.includes("small") ? 11 : 13);
  const stroke = strokeFor(cls);
  const svg =
    text(x, baseline, name, cls) +
    thin(x + 0.5, y, x + w, y, stroke) +
    thin(x + w - 3.5, y - 2.5, x + w, y, stroke) +
    thin(x + w - 3.5, y + 2.5, x + w, y, stroke);
  return { svg, w: w + 2 };
}

/** Round brackets (or the straight bars of a determinant) around a block from y0 to y1. */
function brackets(x0: number, x1: number, y0: number, y1: number, straight = false): string {
  if (straight) return thin(x0 + 2, y0, x0 + 2, y1, "lab-ink") + thin(x1 - 2, y0, x1 - 2, y1, "lab-ink");
  const mid = (y0 + y1) / 2;
  const curve = (x: number, bulge: number) =>
    `<path d="M${n1(x + bulge)} ${n1(y0)} Q${n1(x - bulge)} ${n1(mid)} ${n1(x + bulge)} ${n1(y1)}" class="lab-ink" style="stroke-width:1.2;fill:none" />`;
  return curve(x0 + 2, 2.5) + curve(x1 - 2, -2.5);
}

/** One piece of an equation in the side panel. */
type Piece =
  | { t: string; cls?: string }
  | { n: string; cls?: string }
  | { v: [string, string]; cls?: string }
  | { m: [string, string, string, string]; cls?: string; bars?: boolean };

/**
 * An equation laid out from left to right around the middle line y: text,
 * vector names with arrows, column vectors and 2×2 matrices or determinants.
 */
function equation(x: number, y: number, pieces: Piece[], base = "lab-text"): string {
  let out = "";
  let cx = x;
  for (const piece of pieces) {
    const cls = piece.cls ?? base;
    const cw = charWidth(cls);
    if ("t" in piece) {
      out += text(cx, y + 4, piece.t, cls);
      cx += piece.t.length * cw;
    } else if ("n" in piece) {
      const name = svgName(cx, y + 4, piece.n, cls);
      out += name.svg;
      cx += name.w;
    } else if ("v" in piece) {
      const w = Math.max(piece.v[0].length, piece.v[1].length) * cw + 14;
      out += text(cx + w / 2, y - 2, piece.v[0], cls, "middle");
      out += text(cx + w / 2, y + 13, piece.v[1], cls, "middle");
      out += brackets(cx, cx + w, y - 14, y + 17);
      cx += w + 3;
    } else {
      const [a, b, c, d] = piece.m;
      const left = Math.max(a.length, c.length) * cw;
      const right = Math.max(b.length, d.length) * cw;
      const w = left + right + 24;
      out += text(cx + 7 + left / 2, y - 2, a, cls, "middle");
      out += text(cx + 7 + left / 2, y + 13, c, cls, "middle");
      out += text(cx + w - 7 - right / 2, y - 2, b, cls, "middle");
      out += text(cx + w - 7 - right / 2, y + 13, d, cls, "middle");
      out += brackets(cx, cx + w, y - 14, y + 17, piece.bars);
      cx += w + 3;
    }
  }
  return out;
}

const col = (v: Vec, digits = 2, cls?: string): Piece => ({ v: [fmt(v.x, digits), fmt(v.y, digits)], cls });

type Tone = "a" | "b" | "c" | "ok" | "ink" | "ghost";

const TONE_LINE: Record<Tone, string> = {
  a: "lab-curve",
  b: "lab-curve-2",
  c: "lab-side-c",
  ok: "lab-curve-ok",
  ink: "lab-ink",
  ghost: "lab-ghost",
};
const TONE_HEAD: Record<Tone, string> = {
  a: "lab-bar-a",
  b: "lab-bar-b",
  c: "lab-bar-c",
  ok: "lab-bar-ok",
  ink: "lab-dot-small",
  ghost: "lab-bar-ghost",
};

/** A vector arrow in SVG units with a filled head in the colour of its tone. */
function vArrow(from: Pt, to: Pt, tone: Tone, width = 2.6): string {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.hypot(dx, dy);
  if (len < 2) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(11, len * 0.45);
  const bx = to.x - ux * head;
  const by = to.y - uy * head;
  const px = -uy * head * 0.45;
  const py = ux * head * 0.45;
  return (
    `<line x1="${n1(from.x)}" y1="${n1(from.y)}" x2="${n1(bx)}" y2="${n1(by)}" class="${TONE_LINE[tone]}" style="stroke-width:${width}" />` +
    polygon(
      [
        { x: to.x, y: to.y },
        { x: bx + px, y: by + py },
        { x: bx - px, y: by - py },
      ],
      TONE_HEAD[tone],
    )
  );
}

/** A label inside the plot box, beside the point it names. */
function pointLabel(plot: Plot, at: Pt, content: string, cls = "lab-text-small", dx = 9, dy = -9): string {
  const width = content.length * charWidth(cls);
  let x = at.x + dx;
  if (x + width > plot.box.x + plot.box.w - 2) x = at.x - Math.abs(dx) - width;
  x = clamp(x, plot.box.x + 2, plot.box.x + plot.box.w - width - 2);
  const y = clamp(at.y + dy, plot.box.y + 12, plot.box.y + plot.box.h - 4);
  return text(x, y, content, cls);
}

/** A line through the plot, also a vertical one (x = c when b = 0): a·x + b·y = c. */
function drawLineThrough(plot: Plot, p: Vec, dir: Vec, cls: string): string {
  if (Math.abs(dir.x) < 1e-12) return line(plot.X(p.x), plot.Y(plot.ymin), plot.X(p.x), plot.Y(plot.ymax), cls);
  const m = dir.y / dir.x;
  return plot.lineThrough(m, p.y - m * p.x, cls);
}

/** The coordinate system of the vector labs: a square from −6 to 6 left of the side panel. */
const BOX = { x: 14, y: 14, w: 312, h: 312 };
const plane = () => new Plot(-6, 6, -6, 6, BOX);
/** Left edge of the side panel with the calculation. */
const PX = 342;

const at = (v: LabValues, kx: string, ky: string): Vec => ({ x: v[kx], y: v[ky] });

/** "4 − (−2)": a difference of two coordinates as it is written down. */
const diff = (b: number, a: number): string => `${fmt(b)} − ${paren(a)}`;

// ─── 3.1 Verbindungsvektor, Gegenvektor, Betrag ────────────────────────────

function vectorArrow(v: LabValues): string {
  const plot = plane();
  const a = at(v, "ax", "ay");
  const b = at(v, "bx", "by");
  const d = sub(b, a);
  const A = plot.P(a.x, a.y);
  const B = plot.P(b.x, b.y);
  let out = open("Der Verbindungsvektor von A nach B, sein Gegenvektor und seine Länge");
  out += plot.clip("clip-va") + plot.grid(1, 2);
  // the coordinates of AB as the legs of a right triangle
  const K = plot.P(b.x, a.y);
  if (d.x !== 0) {
    out += line(A.x, A.y, K.x, K.y, "lab-dashed");
    out += text((A.x + K.x) / 2, clamp(K.y + (d.y > 0 ? 16 : -8), 26, 322), fmt(d.x), "lab-text lab-text-a", "middle");
  }
  if (d.y !== 0) {
    out += line(K.x, K.y, B.x, B.y, "lab-dashed");
    out += text(clamp(K.x + (d.x >= 0 ? 7 : -7), 22, 320), (K.y + B.y) / 2 + 4, fmt(d.y), "lab-text lab-text-a", d.x >= 0 ? "start" : "end");
  }
  if (d.x !== 0 && d.y !== 0) out += angleMark(K, A, B, 11, "lab-angle", true);
  if (d.x !== 0 || d.y !== 0) {
    // AB and BA side by side, each shifted a little off the segment
    const len = Math.hypot(B.x - A.x, B.y - A.y);
    const s = { x: (-(B.y - A.y) / len) * 5, y: ((B.x - A.x) / len) * 5 };
    out += vArrow({ x: A.x + s.x, y: A.y + s.y }, { x: B.x + s.x, y: B.y + s.y }, "a");
    out += vArrow({ x: B.x - s.x, y: B.y - s.y }, { x: A.x - s.x, y: A.y - s.y }, "b");
  }
  out += circle(A.x, A.y, 5, "lab-point") + circle(B.x, B.y, 5, "lab-point");
  out += pointLabel(plot, A, `A${point(a.x, a.y)}`, "lab-text-small", 10, 17);
  out += pointLabel(plot, B, `B${point(b.x, b.y)}`, "lab-text-small", 10, -11);
  // the calculation
  out += text(PX, 30, "Spitze minus Schaft:", "lab-text-muted");
  out += equation(PX, 60, [{ n: "AB", cls: "lab-text lab-text-a" }, { t: " = " }, { v: [diff(b.x, a.x), diff(b.y, a.y)] }]);
  out += equation(PX + 26, 104, [{ t: "= " }, col(d, 0, "lab-text lab-text-a")]);
  out += text(PX, 148, "Gegenvektor:", "lab-text-muted");
  out += equation(PX, 176, [{ n: "BA", cls: "lab-text lab-text-b" }, { t: " = " }, col(mul(-1, d), 0, "lab-text lab-text-b")]);
  out += text(PX, 222, "Länge (Pythagoras):", "lab-text-muted");
  out += equation(PX, 246, [{ t: "|" }, { n: "AB" }, { t: `| = √(${paren(d.x)}² + ${paren(d.y)}²)` }], "lab-text-muted");
  out += text(PX + 26, 276, `= ${rootText(d.x * d.x + d.y * d.y)} LE`, "lab-text lab-text-big");
  out += text(PX, 306, "Der Gegenvektor ist", "lab-text-small");
  out += text(PX, 320, "genauso lang wie AB→.", "lab-text-small");
  out += handle("A", A.x, A.y, "Punkt A");
  out += handle("B", B.x, B.y, "Punkt B");
  out += `</svg>`;
  return out;
}

// ─── 3.2 Skalarprodukt ─────────────────────────────────────────────────────

/** Spitz, senkrecht or stumpf from the sign of a ⊙ b; null for a zero vector. */
export function angleKind(a: Vec, b: Vec): "spitz" | "senkrecht" | "stumpf" | null {
  if (norm(a) < 1e-12 || norm(b) < 1e-12) return null;
  const s = dot(a, b);
  if (Math.abs(s) < 1e-9) return "senkrecht";
  return s > 0 ? "spitz" : "stumpf";
}

function dotProduct(v: LabValues): string {
  const plot = plane();
  const a = at(v, "ax", "ay");
  const b = at(v, "bx", "by");
  const O = plot.P(0, 0);
  const Ta = plot.P(a.x, a.y);
  const Tb = plot.P(b.x, b.y);
  const kind = angleKind(a, b);
  const phi = angleBetween(a, b);
  let out = open("Zwei Vektoren, ihr Skalarprodukt und der Winkel zwischen ihnen");
  out += plot.clip("clip-dot") + plot.grid(1, 2);
  if (kind && phi !== null) {
    const a0 = (Math.atan2(a.y, a.x) * 180) / Math.PI;
    const b0 = (Math.atan2(b.y, b.x) * 180) / Math.PI;
    let sweep = b0 - a0;
    while (sweep > 180) sweep -= 360;
    while (sweep < -180) sweep += 360;
    if (kind === "senkrecht") out += angleMark(O, Ta, Tb, 22, "lab-angle-ok", true);
    else out += `<path d="${arcPath(O.x, O.y, 26, a0, a0 + sweep)}" class="lab-angle" />`;
    const mid = ((a0 + sweep / 2) * Math.PI) / 180;
    out += text(O.x + 42 * Math.cos(mid), O.y - 42 * Math.sin(mid) + 4, "φ", kind === "senkrecht" ? "lab-text lab-text-ok" : "lab-text", "middle");
  }
  out += vArrow(O, Ta, "a") + vArrow(O, Tb, "b");
  out += circle(O.x, O.y, 3, "lab-dot-small");
  out += pointLabel(plot, Ta, "a→", "lab-text lab-text-a", 10, -8);
  out += pointLabel(plot, Tb, "b→", "lab-text lab-text-b", 10, -8);
  // the calculation
  const s = dot(a, b);
  out += equation(PX, 34, [{ n: "a", cls: "lab-text lab-text-a" }, { t: " ⊙ " }, { n: "b", cls: "lab-text lab-text-b" }, { t: " = " }, col(a, 0, "lab-text lab-text-a"), { t: "⊙" }, col(b, 0, "lab-text lab-text-b")]);
  const sum = `= ${paren(a.x)} · ${paren(b.x)} + ${paren(a.y)} · ${paren(b.y)}`;
  out += text(PX, 82, sum, "lab-text-muted");
  out += text(PX, 104, `= ${fmt(s)}`, "lab-text lab-text-big");
  out += text(PX, 140, `|a→| = ${rootText(dot(a, a))}`, "lab-text-muted");
  out += text(PX, 160, `|b→| = ${rootText(dot(b, b))}`, "lab-text-muted");
  if (kind && phi !== null) {
    out += text(PX, 190, `cos φ = ${fmt(s)} : ${fmt(norm(a) * norm(b), 2)}`, "lab-text-muted");
    out += text(PX, 212, `φ ≈ ${fmt(phi, 2)}°`, "lab-text lab-text-big");
    const verdict: Record<string, [string, string]> = {
      senkrecht: ["a→ ⊙ b→ = 0: senkrecht", "lab-text lab-text-ok"],
      spitz: ["a→ ⊙ b→ > 0: spitzer Winkel", "lab-text lab-text-a"],
      stumpf: ["a→ ⊙ b→ < 0: stumpfer Winkel", "lab-text lab-text-b"],
    };
    out += text(PX, 248, verdict[kind][0], verdict[kind][1]);
  } else {
    out += text(PX, 200, "Ein Nullvektor hat keine", "lab-text-muted");
    out += text(PX, 218, "Richtung: kein Winkel.", "lab-text-muted");
  }
  out += text(PX, 290, "Ziehe die Pfeilspitzen", "lab-text-small");
  out += text(PX, 304, "von a→ und b→.", "lab-text-small");
  out += handle("a", Ta.x, Ta.y, "Spitze von Vektor a");
  out += handle("b", Tb.x, Tb.y, "Spitze von Vektor b");
  out += `</svg>`;
  return out;
}

// ─── 3.3 Lot und Abstand ───────────────────────────────────────────────────

export interface LabLine {
  m: number;
  t: number;
  /** A direction vector with whole coordinates. */
  u: Vec;
  label: string;
}

/** The lines of the distance lab: for every P with whole coordinates, the foot lies on the 0,1 grid. */
export const LINES: Record<number, LabLine> = {
  1: { m: 0.5, t: 1, u: { x: 2, y: 1 }, label: "g₁: y = 0,5x + 1" },
  2: { m: -1, t: 0, u: { x: 1, y: -1 }, label: "g₂: y = −x" },
  3: { m: -0.5, t: -2, u: { x: 2, y: -1 }, label: "g₃: y = −0,5x − 2" },
};

/** The foot of the perpendicular from P onto y = m · x + t. */
export function footOn(g: LabLine, p: Vec): Vec {
  const x = (p.x + g.m * (p.y - g.t)) / (1 + g.m * g.m);
  return { x, y: g.m * x + g.t };
}

export const lineOf = (v: LabValues): LabLine => LINES[v.g] ?? LINES[1];
export const footPoint = (v: LabValues): Vec => ({ x: v.fx, y: lineOf(v).m * v.fx + lineOf(v).t });

function pointLine(v: LabValues): string {
  const plot = plane();
  const g = lineOf(v);
  const p = at(v, "px", "py");
  const f = footPoint(v);
  const pf = sub(f, p);
  const P = plot.P(p.x, p.y);
  const F = plot.P(f.x, f.y);
  const s = dot(pf, g.u);
  const onLine = Math.abs(g.m * p.x + g.t - p.y) < 1e-9;
  const isFoot = Math.abs(s) < 1e-9;
  let out = open("Eine Gerade, ein Punkt P und ein Punkt F auf der Geraden: Lot und Abstand");
  out += plot.clip("clip-pl") + plot.grid(1, 2);
  const r = norm(pf) * plot.sx;
  out += clipped("clip-pl", plot.lineThrough(g.m, g.t, "lab-curve") + (r > 2 ? circle(P.x, P.y, r, "lab-ghost") : ""));
  // the direction vector u, drawn from the point of g at x = −4
  const base = plot.P(-4, g.m * -4 + g.t);
  out += vArrow(base, plot.P(-4 + g.u.x, g.m * -4 + g.t + g.u.y), "c", 2.4);
  out += text(base.x - 6, base.y + (g.m > 0 ? 16 : -8), "u→", "lab-text lab-text-c", "end");
  if (!onLine) {
    out += vArrow(P, F, isFoot ? "ok" : "b");
    if (isFoot && norm(pf) > 0.3) out += angleMark(F, P, plot.P(f.x + g.u.x, f.y + g.u.y), 12, "lab-angle-ok", true);
  }
  out += circle(P.x, P.y, 5, "lab-point");
  out += circle(F.x, F.y, 5, isFoot && !onLine ? "lab-point-ok" : "lab-point-b");
  out += pointLabel(plot, P, `P${point(p.x, p.y)}`, "lab-text-small", 10, -10);
  out += pointLabel(plot, F, `F${point(f.x, f.y)}`, "lab-text-small", 10, 18);
  // the calculation
  out += text(PX, 30, g.label, "lab-text lab-text-a");
  out += equation(PX, 62, [{ n: "u" }, { t: " = " }, col(g.u, 0)]);
  out += text(PX, 104, `F(x | ${linear(g.m, g.t)}), x = ${fmt(f.x, 1)}`, "lab-text-muted");
  out += equation(PX, 136, [{ n: "PF" }, { t: " = " }, col(pf, 2, isFoot && !onLine ? "lab-text lab-text-ok" : "lab-text lab-text-b")]);
  out += equation(PX, 180, [{ n: "PF" }, { t: " ⊙ " }, { n: "u" }, { t: ` = ${fmt(s, 2)}` }], isFoot ? "lab-text lab-text-ok" : "lab-text");
  out += text(PX, 212, `|PF→| = ${fmt(norm(pf), 2)} LE`, "lab-text");
  if (onLine) {
    out += text(PX, 246, "P liegt auf g:", "lab-text-muted");
    out += text(PX, 264, "Abstand 0 LE.", "lab-text-muted");
  } else if (isFoot) {
    out += text(PX, 246, "PF→ ⊥ g: F ist der", "lab-text lab-text-ok");
    out += text(PX, 264, "Lotfußpunkt.", "lab-text lab-text-ok");
    out += text(PX, 288, `d(P; g) = ${fmt(norm(pf), 2)} LE`, "lab-text lab-text-big");
  } else {
    out += text(PX, 246, "Noch nicht senkrecht:", "lab-text-muted");
    out += text(PX, 264, "Der Kreis um P schneidet g", "lab-text-small");
    out += text(PX, 278, "zweimal. Am Lotfußpunkt", "lab-text-small");
    out += text(PX, 292, "berührt er g nur.", "lab-text-small");
  }
  out += handle("P", P.x, P.y, "Punkt P");
  out += handle("F", F.x, F.y, "Punkt F auf der Geraden", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

// ─── 3.4 Parallelverschiebung und zentrische Streckung ─────────────────────

/** The triangle the translation and scaling lab maps. */
export const TRIANGLE: Vec[] = [
  { x: -3, y: -1 },
  { x: 0, y: -2 },
  { x: -1, y: 2 },
];

/** The image of P in the translation and scaling lab (mode 0: translation, 1: scaling). */
export function imagePoint(v: LabValues, p: Vec): Vec {
  if (v.mode === 0) return add(p, { x: v.vx, y: v.vy });
  const z = { x: v.zx, y: v.zy };
  return add(z, mul(v.k, sub(p, z)));
}

/** The area of a triangle with the determinant, always positive. */
export function triangleArea(p: Vec[]): number {
  return Math.abs(det(sub(p[1], p[0]), sub(p[2], p[0]))) / 2;
}

function translateScale(v: LabValues): string {
  const plot = plane();
  const names = ["A", "B", "C"];
  const images = TRIANGLE.map((p) => imagePoint(v, p));
  const S = TRIANGLE.map((p) => plot.P(p.x, p.y));
  const I = images.map((p) => plot.P(p.x, p.y));
  let out = open(v.mode === 0 ? "Parallelverschiebung eines Dreiecks mit einem Vektor" : "Zentrische Streckung eines Dreiecks am Zentrum Z");
  out += plot.clip("clip-ts") + plot.grid(1, 2);
  let drawing = polygon(S, "lab-fill-a");
  const z = { x: v.zx, y: v.zy };
  const Z = plot.P(z.x, z.y);
  if (v.mode === 1) {
    // the rays from Z through each point; for k < 0 the line goes on beyond Z to the image
    for (let i = 0; i < 3; i++) {
      if (same(TRIANGLE[i], z)) continue;
      const ray = sub(TRIANGLE[i], z);
      const from = v.k >= 0 ? z : add(z, mul(9, ray));
      const to = add(z, mul(v.k >= 0 ? 9 : -9, ray));
      drawing += line(plot.X(from.x), plot.Y(from.y), plot.X(to.x), plot.Y(to.y), "lab-dashed");
    }
  }
  if (v.mode === 0 || v.k !== 0) drawing += polygon(I, "lab-fill-b");
  out += clipped("clip-ts", drawing);
  if (v.mode === 0) {
    for (let i = 0; i < 3; i++) out += vArrow(S[i], I[i], "c", 2);
    out += text((S[2].x + I[2].x) / 2 - 6, (S[2].y + I[2].y) / 2 - 8, "v→", "lab-text lab-text-c", "end");
  }
  for (let i = 0; i < 3; i++) {
    out += circle(S[i].x, S[i].y, 4, "lab-point-a");
    out += pointLabel(plot, S[i], names[i], "lab-text lab-text-a", -14, 4);
    if (plot.contains(images[i].x, images[i].y) && (v.mode === 0 || v.k !== 0)) {
      out += circle(I[i].x, I[i].y, 4, "lab-point-b");
      out += pointLabel(plot, I[i], `${names[i]}'`, "lab-text lab-text-b", 8, -6);
    }
  }
  // the calculation
  const A = TRIANGLE[0];
  const Ai = images[0];
  const area = triangleArea(TRIANGLE);
  if (v.mode === 0) {
    const shift = { x: v.vx, y: v.vy };
    out += text(PX, 28, "Parallelverschiebung", "lab-text lab-text-big");
    out += equation(PX, 64, [{ v: ["x'", "y'"] }, { t: " = " }, { v: ["x", "y"] }, { t: " ⊕ " }, col(shift, 0, "lab-text lab-text-c")]);
    out += text(PX, 110, "A' = A ⊕ v→:", "lab-text-muted");
    out += equation(PX, 140, [col(A, 0, "lab-text lab-text-a"), { t: " ⊕ " }, col(shift, 0, "lab-text lab-text-c"), { t: " = " }, col(Ai, 0, "lab-text lab-text-b")]);
    out += text(PX, 186, `A'${point(Ai.x, Ai.y)}`, "lab-text lab-text-b");
    out += text(PX, 206, `B'${point(images[1].x, images[1].y)}, C'${point(images[2].x, images[2].y)}`, "lab-text-muted");
    out += text(PX, 240, `Flächeninhalt: ${fmt(area)} FE`, "lab-text-muted");
    out += text(PX, 258, "Er bleibt gleich.", "lab-text-muted");
    out += text(PX, 296, "Ziehe A' – das ganze Dreieck", "lab-text-small");
    out += text(PX, 310, "wird um denselben Pfeil verschoben.", "lab-text-small");
    out += handle("imgV", I[0].x, I[0].y, "Bildpunkt A'", "lab-handle lab-handle-b");
  } else {
    out += text(PX, 28, `Zentrische Streckung, k = ${fmt(v.k)}`, "lab-text lab-text-big");
    out += equation(PX, 62, [{ n: "ZA'" }, { t: " = k · " }, { n: "ZA" }]);
    if (v.k === 0) {
      out += text(PX, 104, "k = 0 ist nicht erlaubt:", "lab-text lab-text-bad");
      out += text(PX, 122, "Alle Punkte fielen auf Z.", "lab-text-muted");
    } else {
      out += equation(PX, 104, [{ t: `= ${fmt(v.k)} · ` }, col(sub(A, z), 2), { t: " = " }, col(sub(Ai, z), 2)]);
      out += text(PX, 150, `A'${point(Ai.x, Ai.y)}`, "lab-text lab-text-b");
      out += text(PX, 170, `B'${point(images[1].x, images[1].y)}, C'${point(images[2].x, images[2].y)}`, "lab-text-muted");
      out += text(PX, 204, `Fläche: k² · ${fmt(area)} FE`, "lab-text-muted");
      out += text(PX, 222, `= ${fmt(v.k * v.k * area)} FE`, "lab-text");
      out += text(PX, 252, v.k < 0 ? "k < 0: Das Bild liegt auf der" : "k > 0: Das Bild liegt auf derselben", "lab-text-small");
      out += text(PX, 266, v.k < 0 ? "anderen Seite von Z." : "Seite von Z wie das Urbild.", "lab-text-small");
    }
    out += text(PX, 300, "Ziehe Z oder A' (k).", "lab-text-small");
    out += circle(Z.x, Z.y, 5, "lab-point");
    out += pointLabel(plot, Z, "Z", "lab-text", 9, 16);
    out += handle("Z", Z.x, Z.y, "Streckungszentrum Z");
    if (v.k !== 0 && plot.contains(Ai.x, Ai.y)) out += handle("imgK", I[0].x, I[0].y, "Bildpunkt A' (Streckungsfaktor)", "lab-handle lab-handle-b");
  }
  out += `</svg>`;
  return out;
}

// ─── 3.5 Achsenspiegelung an einer Ursprungsgeraden ────────────────────────

/** The axis through O with angle alpha as an equation. */
export function axisText(alpha: number): string {
  if (alpha === 90) return "x = 0 (y-Achse)";
  if (alpha === 0) return "y = 0 (x-Achse)";
  const m = Math.tan((alpha * Math.PI) / 180);
  const name = alpha === 45 ? " (y = x)" : alpha === 135 ? " (y = −x)" : "";
  return `y = ${fmt(m, 2)}x${name}`;
}

function reflection(v: LabValues): string {
  const plot = plane();
  const p = at(v, "px", "py");
  const q = reflectAt(p, v.alpha);
  const O = plot.P(0, 0);
  const P = plot.P(p.x, p.y);
  const Q = plot.P(q.x, q.y);
  const dir = { x: cosDeg(v.alpha), y: sinDeg(v.alpha) };
  const fixed = same(p, q);
  let out = open("Spiegelung eines Punktes an einer Geraden durch den Ursprung");
  out += plot.clip("clip-rf") + plot.grid(1, 2);
  out += clipped("clip-rf", drawLineThrough(plot, { x: 0, y: 0 }, dir, "lab-curve-c"));
  // the angle alpha between the axis and the x-axis
  if (v.alpha > 0) {
    out += `<path d="${arcPath(O.x, O.y, 30, 0, v.alpha)}" class="lab-angle" />`;
    const mid = ((v.alpha / 2) * Math.PI) / 180;
    out += text(O.x + 44 * Math.cos(mid), O.y - 44 * Math.sin(mid) + 4, "α", "lab-text lab-text-c", "middle");
  }
  if (!fixed) {
    const m = mul(0.5, add(p, q));
    const M = plot.P(m.x, m.y);
    out += line(P.x, P.y, Q.x, Q.y, "lab-dashed");
    if (norm(sub(p, m)) > 0.4) out += angleMark(M, P, plot.P(m.x + dir.x, m.y + dir.y), 11, "lab-angle-ok", true);
    out += circle(M.x, M.y, 3.5, "lab-dot-small");
    out += pointLabel(plot, M, "M", "lab-text-small", 8, 14);
  }
  out += circle(P.x, P.y, 5, "lab-point-a");
  out += pointLabel(plot, P, `P${point(p.x, p.y)}`, "lab-text-small lab-text-a", 10, -10);
  if (plot.contains(q.x, q.y)) {
    out += circle(Q.x, Q.y, 5, fixed ? "lab-point-ok" : "lab-point-b");
    out += pointLabel(plot, Q, `P'${point(q.x, q.y)}`, "lab-text-small lab-text-b", 10, 18);
  }
  // the calculation
  const c = cosDeg(2 * v.alpha);
  const s = sinDeg(2 * v.alpha);
  out += text(PX, 26, `g: ${axisText(v.alpha)}`, "lab-text lab-text-c");
  out += text(PX, 46, `α = ${fmt(v.alpha)}°, also 2α = ${fmt(2 * v.alpha)}°`, "lab-text-muted");
  out += equation(PX, 82, [{ v: ["x'", "y'"] }, { t: "=" }, { m: [fmt(c, 2), fmt(s, 2), fmt(s, 2), fmt(-c, 2)] }, { t: "⊙" }, col(p, 1, "lab-text lab-text-a")]);
  out += text(PX, 126, `x' = ${paren(p.x, 1)} · ${paren(c, 2)} + ${paren(p.y, 1)} · ${paren(s, 2)}`, "lab-text-small");
  out += text(PX, 142, `y' = ${paren(p.x, 1)} · ${paren(s, 2)} − ${paren(p.y, 1)} · ${paren(c, 2)}`, "lab-text-small");
  out += text(PX, 170, `P'${point(q.x, q.y)}`, "lab-text lab-text-b lab-text-big");
  if (fixed) {
    out += text(PX, 204, "P liegt auf der Achse:", "lab-text lab-text-ok");
    out += text(PX, 222, "ein Fixpunkt.", "lab-text lab-text-ok");
  } else {
    const m = mul(0.5, add(p, q));
    out += text(PX, 204, `M${point(m.x, m.y)} liegt auf g,`, "lab-text-muted");
    out += text(PX, 222, "PP'→ steht senkrecht auf g.", "lab-text-muted");
  }
  out += text(PX, 286, "Ziehe P und den Punkt auf", "lab-text-small");
  out += text(PX, 300, "der Achse (Winkel α).", "lab-text-small");
  const H = plot.P(5 * dir.x, 5 * dir.y);
  out += handle("axis", H.x, H.y, "Spiegelachse (Winkel α)", "lab-handle lab-handle-b");
  out += handle("P", P.x, P.y, "Punkt P");
  out += `</svg>`;
  return out;
}

// ─── 3.6 Drehung ───────────────────────────────────────────────────────────

function rotation(v: LabValues): string {
  const plot = plane();
  const p = at(v, "px", "py");
  const z = at(v, "zx", "zy");
  const q = rotateAbout(p, z, v.phi);
  const P = plot.P(p.x, p.y);
  const Z = plot.P(z.x, z.y);
  const Q = plot.P(q.x, q.y);
  const zp = sub(p, z);
  const r = norm(zp);
  let out = open("Drehung eines Punktes um ein Drehzentrum mit der Drehmatrix");
  out += plot.clip("clip-rot") + plot.grid(1, 2);
  if (r > 1e-9) {
    const a0 = (Math.atan2(zp.y, zp.x) * 180) / Math.PI;
    if (v.phi !== 0) {
      out += clipped("clip-rot", `<path d="${arcPath(Z.x, Z.y, r * plot.sx, a0, a0 + v.phi)}" class="lab-ghost" />`);
      const small = Math.min(26, (r * plot.sx) / 2);
      out += `<path d="${arcPath(Z.x, Z.y, small, a0, a0 + v.phi)}" class="lab-angle" />`;
      const mid = ((a0 + v.phi / 2) * Math.PI) / 180;
      out += text(Z.x + (small + 12) * Math.cos(mid), Z.y - (small + 12) * Math.sin(mid) + 4, "φ", "lab-text", "middle");
    }
    out += clipped("clip-rot", vArrow(Z, P, "a") + vArrow(Z, Q, "b"));
  }
  out += circle(Z.x, Z.y, 5, "lab-point");
  out += pointLabel(plot, Z, `Z${point(z.x, z.y)}`, "lab-text-small", 9, 17);
  out += circle(P.x, P.y, 5, "lab-point-a");
  out += pointLabel(plot, P, "P", "lab-text lab-text-a", 9, -9);
  const visible = plot.contains(q.x, q.y);
  if (visible) {
    out += circle(Q.x, Q.y, 5, "lab-point-b");
    out += pointLabel(plot, Q, "P'", "lab-text lab-text-b", 9, -9);
  }
  // the calculation
  const c = cosDeg(v.phi);
  const s = sinDeg(v.phi);
  const zq = sub(q, z);
  out += text(PX, 26, `Drehwinkel φ = ${fmt(v.phi)}°`, "lab-text lab-text-big");
  out += equation(PX, 60, [{ n: "ZP", cls: "lab-text lab-text-a" }, { t: " = " }, { v: [diff(p.x, z.x), diff(p.y, z.y)] }, { t: " = " }, col(zp, 0, "lab-text lab-text-a")]);
  out += equation(PX, 112, [{ n: "ZP'", cls: "lab-text lab-text-b" }, { t: "=" }, { m: [fmt(c, 2), fmt(-s, 2), fmt(s, 2), fmt(c, 2)] }, { t: "⊙" }, { n: "ZP", cls: "lab-text lab-text-a" }]);
  out += equation(PX + 26, 158, [{ t: "= " }, col(zq, 2, "lab-text lab-text-b")]);
  out += text(PX, 202, "P' = Z ⊕ ZP'→:", "lab-text-muted");
  out += text(PX, 224, `P'${point(q.x, q.y)}`, "lab-text lab-text-b lab-text-big");
  out += text(PX, 252, `|ZP| = |ZP'| = ${fmt(r, 2)} LE`, "lab-text-muted");
  if (!visible) out += text(PX, 274, "P' liegt außerhalb des Bildes.", "lab-text-small");
  out += text(PX, 300, "Ziehe P, Z und P' (Winkel).", "lab-text-small");
  out += handle("Z", Z.x, Z.y, "Drehzentrum Z");
  out += handle("P", P.x, P.y, "Punkt P");
  if (visible && r > 0.4) out += handle("Q", Q.x, Q.y, "Bildpunkt P' (Drehwinkel)", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

/** The drag of P' around Z: the angle from ZP to the pointer, kept near the current φ. */
function rotationDrag(p: Pt, v: LabValues): Partial<LabValues> {
  const plot = plane();
  const zp = { x: v.px - v.zx, y: v.py - v.zy };
  const to = { x: plot.invX(p.x) - v.zx, y: plot.invY(p.y) - v.zy };
  if (norm(zp) < 1e-9 || norm(to) < 0.3) return {};
  const raw = ((Math.atan2(to.y, to.x) - Math.atan2(zp.y, zp.x)) * 180) / Math.PI;
  let best = raw;
  for (const k of [-2, -1, 0, 1, 2]) {
    const candidate = raw + 360 * k;
    if (Math.abs(candidate - v.phi) < Math.abs(best - v.phi)) best = candidate;
  }
  return { phi: clamp(best, -180, 180) };
}

// ─── 3.7 Flächeninhalte mit Determinanten ──────────────────────────────────

/** The mappings the determinant lab applies to the triangle, with how they change det. */
export const AREA_MAPS: Record<number, { label: string; map: (p: Vec) => Vec }> = {
  0: { label: "keine", map: (p) => p },
  1: { label: "Achsenspiegelung an der x-Achse", map: (p) => ({ x: p.x, y: -p.y }) },
  2: { label: "Drehung um O um 90°", map: (p) => ({ x: -p.y, y: p.x }) },
  3: { label: "Zentrische Streckung (Z = O, k = −0,5)", map: (p) => mul(-0.5, p) },
};

export const trianglePoints = (v: LabValues): Vec[] => [at(v, "ax", "ay"), at(v, "bx", "by"), at(v, "cx", "cy")];
export const triangleDet = (p: Vec[]): number => det(sub(p[1], p[0]), sub(p[2], p[0]));

/** A small circular arrow around the centre of a triangle that shows its Umlaufsinn. */
function turnArrow(c: Pt, r: number, ccw: boolean, cls: string): string {
  const a0 = ccw ? 200 : -20;
  const a1 = ccw ? 470 : -290;
  const end = { x: c.x + r * Math.cos((a1 * Math.PI) / 180), y: c.y - r * Math.sin((a1 * Math.PI) / 180) };
  // the head points along the circle at the end of the arc
  const t = ccw ? ((a1 + 90) * Math.PI) / 180 : ((a1 - 90) * Math.PI) / 180;
  const tip = { x: end.x + 6 * Math.cos(t), y: end.y - 6 * Math.sin(t) };
  const side = { x: -Math.sin(t) * 4, y: -Math.cos(t) * 4 };
  return (
    `<path d="${arcPath(c.x, c.y, r, a0, a1)}" class="${cls}" style="fill:none;stroke-width:1.6" />` +
    polygon([tip, { x: end.x + side.x, y: end.y + side.y }, { x: end.x - side.x, y: end.y - side.y }], cls.includes("lab-ok") ? "lab-bar-ok" : "lab-bar-bad")
  );
}

function determinantArea(v: LabValues): string {
  const plot = plane();
  const p = trianglePoints(v);
  const [a, b, c] = p;
  const u = sub(b, a);
  const w = sub(c, a);
  const D = det(u, w);
  const S = p.map((q) => plot.P(q.x, q.y));
  const d4 = add(b, w);
  let out = open("Dreieck und Parallelogramm aus zwei Vektoren, Flächeninhalt mit der Determinante");
  out += plot.clip("clip-det") + plot.grid(1, 2);
  const mapping = AREA_MAPS[v.map] ?? AREA_MAPS[0];
  const image = p.map(mapping.map);
  let drawing = polygon([S[0], S[1], plot.P(d4.x, d4.y), S[2]], "lab-ghost", 'style="fill:none"');
  drawing += polygon(S, D === 0 ? "lab-ghost" : "lab-fill-a");
  if (v.map !== 0) drawing += polygon(image.map((q) => plot.P(q.x, q.y)), "lab-fill-b");
  out += clipped("clip-det", drawing);
  out += vArrow(S[0], S[1], "a") + vArrow(S[0], S[2], "b");
  if (D !== 0) {
    const centre = { x: (S[0].x + S[1].x + S[2].x) / 3, y: (S[0].y + S[1].y + S[2].y) / 3 };
    out += turnArrow(centre, 9, D > 0, D > 0 ? "lab-ok-stroke" : "lab-bad-stroke");
  }
  ["A", "B", "C"].forEach((name, i) => {
    out += circle(S[i].x, S[i].y, 4.5, "lab-point");
    out += pointLabel(plot, S[i], name, "lab-text", -15, 5);
  });
  if (v.map !== 0) {
    ["A'", "B'", "C'"].forEach((name, i) => {
      if (plot.contains(image[i].x, image[i].y)) out += pointLabel(plot, plot.P(image[i].x, image[i].y), name, "lab-text-small lab-text-b", 6, -5);
    });
  }
  // the calculation
  out += equation(PX, 30, [{ n: "AB", cls: "lab-text lab-text-a" }, { t: " = " }, col(u, 0, "lab-text lab-text-a"), { t: "  " }, { n: "AC", cls: "lab-text lab-text-b" }, { t: " = " }, col(w, 0, "lab-text lab-text-b")]);
  out += equation(PX, 82, [{ t: "det = " }, { m: [fmt(u.x), fmt(w.x), fmt(u.y), fmt(w.y)], bars: true }]);
  out += text(PX, 126, `= ${paren(u.x)} · ${paren(w.y)} − ${paren(u.y)} · ${paren(w.x)} = ${fmt(D)}`, "lab-text-muted");
  out += text(PX, 152, `Dreieck: ½ · ${fmt(Math.abs(D))} = ${fmt(Math.abs(D) / 2)} FE`, "lab-text lab-text-big");
  out += text(PX, 172, `Parallelogramm: ${fmt(Math.abs(D))} FE`, "lab-text-muted");
  const sense = D > 0 ? ["det > 0: A, B, C gegen", "den Uhrzeigersinn"] : D < 0 ? ["det < 0: A, B, C im Uhr-", "zeigersinn (Betrag nehmen)"] : ["det = 0: A, B und C liegen", "auf einer Geraden."];
  out += text(PX, 200, sense[0], D > 0 ? "lab-text lab-text-ok" : D < 0 ? "lab-text lab-text-bad" : "lab-text-muted");
  out += text(PX, 218, sense[1], D > 0 ? "lab-text lab-text-ok" : D < 0 ? "lab-text lab-text-bad" : "lab-text-muted");
  if (v.map !== 0) {
    const Di = triangleDet(image);
    out += text(PX, 252, `Bild: ${mapping.label}`, "lab-text-small lab-text-b");
    out += text(PX, 268, `det' = ${fmt(Di, 2)}, A' = ${fmt(Math.abs(Di) / 2, 2)} FE`, "lab-text-small");
  }
  out += text(PX, 300, "Ziehe die Ecken A, B und C.", "lab-text-small");
  ["A", "B", "C"].forEach((name, i) => {
    out += handle(name, S[i].x, S[i].y, `Ecke ${name}`);
  });
  out += `</svg>`;
  return out;
}

// ─── 3.8 Trägergraphen ─────────────────────────────────────────────────────

/** An affine mapping: x' = a·x + b·y + e, y' = c·x + d·y + f. */
export interface Affine {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}

export const applyAffine = (m: Affine, p: Vec): Vec => ({ x: m.a * p.x + m.b * p.y + m.e, y: m.c * p.x + m.d * p.y + m.f });

export const LOCUS_MAPS: Record<number, { label: string; panel: string; m: Affine }> = {
  0: { label: "Drehung um O um 90°", panel: "Drehung um O, φ = 90°", m: { a: 0, b: -1, c: 1, d: 0, e: 0, f: 0 } },
  1: { label: "Spiegelung an der Geraden y = x", panel: "Spiegelung an y = x", m: { a: 0, b: 1, c: 1, d: 0, e: 0, f: 0 } },
  2: { label: "Verschiebung: 2 nach rechts, 2 nach unten", panel: "Verschiebung um (2 | −2)", m: { a: 1, b: 0, c: 0, d: 1, e: 2, f: -2 } },
  3: { label: "Zentrische Streckung mit Z = O, k = −0,5", panel: "Streckung Z = O, k = −0,5", m: { a: -0.5, b: 0, c: 0, d: -0.5, e: 0, f: 0 } },
  4: { label: "Spiegelung an der x-Achse, dann 2 nach rechts und 1 nach oben", panel: "x-Achse, dann um (2 | 1)", m: { a: 1, b: 0, c: 0, d: -1, e: 2, f: 1 } },
};

export interface LocusGraph {
  label: string;
  /** y = p·x² + q·x + r */
  p: number;
  q: number;
  r: number;
}

export const LOCUS_GRAPHS: Record<number, LocusGraph> = {
  0: { label: "Gerade g: y = 0,5x + 1", p: 0, q: 0.5, r: 1 },
  1: { label: "Parabel p: y = 0,25x² − 3", p: 0.25, q: 0, r: -3 },
};

export const graphOf = (v: LabValues): LocusGraph => LOCUS_GRAPHS[v.graph] ?? LOCUS_GRAPHS[0];
export const mapOf = (v: LabValues): Affine => (LOCUS_MAPS[v.map] ?? LOCUS_MAPS[0]).m;
export const graphY = (g: LocusGraph, x: number): number => g.p * x * x + g.q * x + g.r;

/** "x' = −0,5x − 1" and "y' = x": the coordinates of the image points in terms of x. */
export function imageTerms(g: LocusGraph, m: Affine): [string, string] {
  // x' = a·x + b·(p x² + q x + r) + e, the same for y' with c, d, f
  const term = (k1: number, k2: number, k0: number) => {
    const sq = k2 * g.p;
    const lin = k1 + k2 * g.q;
    const con = k2 * g.r + k0;
    let out = "";
    for (const [coefficient, variable] of [[sq, "x²"], [lin, "x"], [con, ""]] as const) {
      const rounded = Number(coefficient.toFixed(4));
      if (rounded === 0) continue;
      const abs = Math.abs(rounded);
      const number = variable && abs === 1 ? "" : fmt(abs, 4);
      out += out === "" ? `${rounded < 0 ? "−" : ""}${number}${variable}` : ` ${rounded < 0 ? "−" : "+"} ${number}${variable}`;
    }
    return out || "0";
  };
  return [`x' = ${term(m.a, m.b, m.e)}`, `y' = ${term(m.c, m.d, m.f)}`];
}

/** The equation of the Trägergraph of the image points. */
export function carrierText(g: LocusGraph, m: Affine): string {
  if (g.p === 0) {
    const kx = m.a + m.b * g.q;
    const ky = m.c + m.d * g.q;
    if (Math.abs(kx) < 1e-12) return `x = ${fmt(m.b * g.r + m.e)}`;
    const slope = ky / kx;
    const intercept = m.d * g.r + m.f - slope * (m.b * g.r + m.e);
    return `y = ${linear(slope, intercept)}`;
  }
  if (m.b === 0 && m.c === 0) {
    // x' = a x + e, y' = d (p x² + r) + f with q = 0
    return `y = ${vertexForm((m.d * g.p) / (m.a * m.a), m.e, m.d * g.r + m.f)}`;
  }
  // x' = b (p x² + r) + e, y' = c x + f: a parabola opened to the side
  return `x = ${vertexForm((m.b * g.p) / (m.c * m.c), m.f, m.b * g.r + m.e).replace(/x/g, "y")}`;
}

function locus(v: LabValues): string {
  const plot = plane();
  const g = graphOf(v);
  const m = mapOf(v);
  const pn = { x: v.x, y: graphY(g, v.x) };
  const qn = applyAffine(m, pn);
  const P = plot.P(pn.x, pn.y);
  const Q = plot.P(qn.x, qn.y);
  let out = open("Eine Punktschar, ihre Bildpunkte und ihr Trägergraph");
  out += plot.clip("clip-loc") + plot.grid(1, 2);
  let drawing = plot.graph((x) => graphY(g, x), "lab-curve");
  if (v.trace === 1) {
    const samples: Pt[] = [];
    for (let i = 0; i <= 160; i++) {
      const x = -6 + (12 * i) / 160;
      const q = applyAffine(m, { x, y: graphY(g, x) });
      samples.push(plot.P(q.x, q.y));
    }
    drawing += `<polyline points="${samples.map((s) => `${n1(s.x)},${n1(s.y)}`).join(" ")}" class="lab-curve-dashed" style="fill:none" />`;
  }
  // the image points of the whole numbers from −4 to 4
  for (let x = -4; x <= 4; x++) {
    const q = applyAffine(m, { x, y: graphY(g, x) });
    drawing += circle(plot.X(q.x), plot.Y(q.y), 3, "lab-point-b");
  }
  out += clipped("clip-loc", drawing);
  if (!same(pn, qn)) out += clipped("clip-loc", vArrow(P, Q, "ghost", 2));
  out += circle(P.x, P.y, 5, "lab-point-a");
  out += pointLabel(plot, P, "Pₙ", "lab-text lab-text-a", 9, -9);
  if (plot.contains(qn.x, qn.y)) {
    out += circle(Q.x, Q.y, 6, same(pn, qn) ? "lab-point-ok" : "lab-point-b");
    out += pointLabel(plot, Q, "Pₙ'", "lab-text lab-text-b", 9, 18);
  }
  // the calculation
  const [xt, yt] = imageTerms(g, m);
  out += text(PX, 26, g.label.replace(/^(Gerade|Parabel) /, "Pₙ auf "), "lab-text lab-text-a");
  out += text(PX, 46, (LOCUS_MAPS[v.map] ?? LOCUS_MAPS[0]).panel, "lab-text lab-text-b");
  out += text(PX, 78, xt, "lab-text");
  out += text(PX, 98, yt, "lab-text");
  out += text(PX, 130, `x = ${fmt(v.x, 1)}: Pₙ${point(pn.x, pn.y)}`, "lab-text-muted");
  out += text(PX, 150, `Pₙ'${point(qn.x, qn.y)}`, "lab-text lab-text-b");
  if (same(pn, qn)) out += text(PX, 172, "Fixpunkt: Pₙ' = Pₙ", "lab-text lab-text-ok");
  if (v.trace === 1) {
    out += text(PX, 204, "Trägergraph der Pₙ':", "lab-text-muted");
    out += text(PX, 226, carrierText(g, m), "lab-text lab-text-big");
    if (g.p !== 0 && m.b !== 0) out += text(PX, 246, "(nach der Seite geöffnet)", "lab-text-small");
  } else {
    out += text(PX, 204, "x' nach x auflösen und in", "lab-text-small");
    out += text(PX, 218, "y' einsetzen: das ist die", "lab-text-small");
    out += text(PX, 232, "Gleichung des Trägergraphen.", "lab-text-small");
  }
  out += text(PX, 300, "Ziehe Pₙ auf dem Graphen.", "lab-text-small");
  out += handle("P", P.x, P.y, "Punkt Pₙ auf dem Graphen");
  out += `</svg>`;
  return out;
}

// ─── The views of the stage ────────────────────────────────────────────────

const pointHandle = (kx: string, ky: string) => ({
  x: kx,
  y: ky,
  drag: (p: Pt) => {
    const plot = plane();
    return { [kx]: plot.invX(p.x), [ky]: plot.invY(p.y) };
  },
});

export const VEKTOREN_ABBILDUNGEN_VIEWS: Record<
  "vector-arrow" | "dot-product" | "point-line-distance" | "translate-scale" | "reflection" | "rotation" | "determinant-area" | "locus",
  LabView
> = {
  "vector-arrow": {
    render: vectorArrow,
    handles: { A: pointHandle("ax", "ay"), B: pointHandle("bx", "by") },
  },
  "dot-product": {
    render: dotProduct,
    handles: { a: pointHandle("ax", "ay"), b: pointHandle("bx", "by") },
  },
  "point-line-distance": {
    render: pointLine,
    handles: {
      P: pointHandle("px", "py"),
      F: {
        x: "fx",
        drag: (p, v) => {
          // the pointer projected onto the line
          const plot = plane();
          const g = lineOf(v);
          return { fx: footOn(g, { x: plot.invX(p.x), y: plot.invY(p.y) }).x };
        },
      },
    },
  },
  "translate-scale": {
    render: translateScale,
    handles: {
      imgV: {
        x: "vx",
        y: "vy",
        drag: (p) => {
          const plot = plane();
          return { vx: plot.invX(p.x) - TRIANGLE[0].x, vy: plot.invY(p.y) - TRIANGLE[0].y };
        },
      },
      Z: pointHandle("zx", "zy"),
      imgK: {
        x: "k",
        drag: (p, v) => {
          const plot = plane();
          const za = sub(TRIANGLE[0], { x: v.zx, y: v.zy });
          if (norm(za) < 1e-9) return {};
          const to = sub({ x: plot.invX(p.x), y: plot.invY(p.y) }, { x: v.zx, y: v.zy });
          return { k: dot(to, za) / dot(za, za) };
        },
      },
    },
  },
  reflection: {
    render: reflection,
    handles: {
      P: pointHandle("px", "py"),
      axis: {
        x: "alpha",
        drag: (p) => {
          const plot = plane();
          const angle = (Math.atan2(plot.invY(p.y), plot.invX(p.x)) * 180) / Math.PI;
          // an axis has two directions; 177,5° and more rounds to 180°, the x-axis again
          const folded = ((angle % 180) + 180) % 180;
          return { alpha: folded > 177.5 ? 0 : folded };
        },
      },
    },
  },
  rotation: {
    render: rotation,
    handles: { P: pointHandle("px", "py"), Z: pointHandle("zx", "zy"), Q: { x: "phi", drag: rotationDrag } },
  },
  "determinant-area": {
    render: determinantArea,
    handles: { A: pointHandle("ax", "ay"), B: pointHandle("bx", "by"), C: pointHandle("cx", "cy") },
  },
  locus: {
    render: locus,
    handles: {
      P: {
        x: "x",
        drag: (p) => ({ x: plane().invX(p.x) }),
      },
    },
  },
};
