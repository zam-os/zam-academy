import { fmt, fracText, gcd, linear } from "../exercises/format";
import type { LabValues } from "../model/types";
import { angleMark, arrow, circle, clamp, clipped, handle, type LabView, line, open, path, Plot, polygon, type Pt, r1, rect, text } from "./svg";

// ─── Shared helpers of this stage ──────────────────────────────────────────

/** Rough width of one character of a lab text class, as infoBox() estimates it. */
function charWidth(cls: string): number {
  return cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : cls.includes("muted") ? 6.7 : 7.3;
}

/** The plot left of the side panel, and the panel itself. */
const GRAPH_BOX = { x: 20, y: 14, w: 300, h: 312 };
const PANEL = { x: 328, y: 14, w: 184, h: 312 };

/** A panel line: text and its class; an empty text leaves a small gap. */
type PanelLine = [string, string];

function sidePanel(lines: PanelLine[], panel = PANEL): string {
  let out = rect(panel.x, panel.y, panel.w, panel.h, "lab-panel", 'rx="10"');
  let y = panel.y + 24;
  for (const [content, cls] of lines) {
    if (content === "") {
      y += 9;
      continue;
    }
    out += text(panel.x + 10, y, content, cls);
    y += cls.includes("big") ? 25 : 20;
  }
  return out;
}

/** A label beside a point, flipped to the other side at the right edge and kept inside the plot box. */
function pointLabel(plot: Plot, at: Pt, content: string, cls = "lab-text-small", dx = 9, dy = -9): string {
  const width = content.length * charWidth(cls);
  let x = at.x + dx;
  if (x + width > plot.box.x + plot.box.w - 2) x = at.x - Math.abs(dx) - width;
  x = clamp(x, plot.box.x + 2, plot.box.x + plot.box.w - width - 2);
  const y = clamp(at.y + dy, plot.box.y + 12, plot.box.y + plot.box.h - 4);
  return text(x, y, content, cls);
}

function tick(value: number): string {
  return fmt(Math.round(value * 100) / 100, 2);
}

/** Background, grid and axes of a plot whose x and y steps differ. */
function axesXY(plot: Plot, xStep: number, yStep: number, xLabelEvery: number, yLabelEvery: number, xName = "x", yName = "y"): string {
  const { box } = plot;
  let out = rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  for (let x = Math.ceil(plot.xmin / xStep) * xStep; x <= plot.xmax + 1e-9; x += xStep) {
    out += line(plot.X(x), box.y, plot.X(x), box.y + box.h, "lab-grid");
  }
  for (let y = Math.ceil(plot.ymin / yStep) * yStep; y <= plot.ymax + 1e-9; y += yStep) {
    out += line(box.x, plot.Y(y), box.x + box.w, plot.Y(y), "lab-grid");
  }
  const x0 = clamp(plot.X(0), box.x, box.x + box.w);
  const y0 = clamp(plot.Y(0), box.y, box.y + box.h);
  out += arrow(box.x, y0, box.x + box.w + 4, y0, "lab-axis", 1.4);
  out += arrow(x0, box.y + box.h, x0, box.y - 4, "lab-axis", 1.4);
  out += text(box.x + box.w - 4, y0 - 6, xName, "lab-text-axis", "end");
  out += text(x0 + 6, box.y + 10, yName, "lab-text-axis");
  for (let x = Math.ceil(plot.xmin / xLabelEvery) * xLabelEvery; x <= plot.xmax - 0.5 * xLabelEvery + 1e-9; x += xLabelEvery) {
    if (Math.abs(x) > 1e-9) out += text(plot.X(x), y0 + 13, tick(x), "lab-text-tick", "middle");
  }
  for (let y = Math.ceil(plot.ymin / yLabelEvery) * yLabelEvery; y <= plot.ymax - 0.5 * yLabelEvery + 1e-9; y += yLabelEvery) {
    if (Math.abs(y) > 1e-9) out += text(x0 - 5, plot.Y(y) + 4, tick(y), "lab-text-tick", "end");
  }
  return out;
}

/** The graph of f between x0 and x1 as one path, sampled finely; wrap it in clipped(). */
function branch(plot: Plot, f: (x: number) => number, x0: number, x1: number, cls: string, samples = 200): string {
  if (!(x1 > x0)) return "";
  const spanY = plot.ymax - plot.ymin;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = x0 + ((x1 - x0) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    d += `${d ? "L" : "M"}${r1(plot.X(x))} ${r1(plot.Y(clamp(y, plot.ymin - spanY, plot.ymax + spanY)))} `;
  }
  return d ? path(d.trim(), cls) : "";
}

type Tone = "a" | "b" | "c" | "ok";

/** A thin arrow in the colour of a tone, with a filled head. */
function toneArrow(x1: number, y1: number, x2: number, y2: number, tone: Tone, width = 1.8): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 2) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(9, len * 0.45);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy * head * 0.45;
  const py = ux * head * 0.45;
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" class="lab-side-${tone}" style="stroke-width:${width}" />` +
    polygon(
      [
        { x: x2, y: y2 },
        { x: bx + px, y: by + py },
        { x: bx - px, y: by - py },
      ],
      `lab-bar-${tone}`,
    )
  );
}

/** A set of numbers as Bavaria writes it: {0; 1; 2}, the empty set { }. */
export function setText(values: number[]): string {
  return values.length === 0 ? "{ }" : `{${values.map((v) => fmt(v)).join("; ")}}`;
}

/** An interval [a; b], or the single point {a}. */
export function intervalText(lo: number, hi: number): string {
  return Math.abs(hi - lo) < 1e-12 ? `{${fmt(lo)}}` : `[${fmt(lo)}; ${fmt(hi)}]`;
}

const SUB = ["₀", "₁", "₂", "₃", "₄", "₅", "₆", "₇", "₈", "₉"];

// ─── 6.1 Funktion oder nicht? ──────────────────────────────────────────────

export interface RelationPoint {
  x: number;
  y: number;
}

/** The five points P₁ … P₅ of the relation lab. */
export function relationPoints(v: LabValues): RelationPoint[] {
  return [1, 2, 3, 4, 5].map((i) => ({ x: v[`x${i}`], y: v[`y${i}`] }));
}

export interface RelationInfo {
  /** Definitionsmenge: every x that occurs, sorted. */
  D: number[];
  /** Wertemenge: every y that occurs, sorted. */
  W: number[];
  /** The y-values of each x, sorted and without repeats. */
  ys: Map<number, number[]>;
  isFunction: boolean;
  /** The x that have more than one y. */
  broken: number[];
}

/** Which x has which y-values; points on the same spot count once. */
export function analyseRelation(points: RelationPoint[]): RelationInfo {
  const ys = new Map<number, number[]>();
  for (const p of points) {
    const list = ys.get(p.x) ?? [];
    if (!list.includes(p.y)) list.push(p.y);
    ys.set(p.x, list.sort((a, b) => a - b));
  }
  const D = [...ys.keys()].sort((a, b) => a - b);
  const W = [...new Set(points.map((p) => p.y))].sort((a, b) => a - b);
  const broken = D.filter((x) => (ys.get(x) ?? []).length > 1);
  return { D, W, ys, isFunction: broken.length === 0, broken };
}

/** How many different points lie on the vertical test line x = s. */
export function testLineHits(points: RelationPoint[], s: number): number {
  return analyseRelation(points).ys.get(s)?.length ?? 0;
}

/** The largest number of the points that share one y-value. */
export function sharedValueCount(points: RelationPoint[]): number {
  const counts = new Map<number, number>();
  for (const p of points) counts.set(p.y, (counts.get(p.y) ?? 0) + 1);
  return Math.max(...counts.values());
}

export const allDifferentX = (points: RelationPoint[]): boolean => new Set(points.map((p) => p.x)).size === points.length;

const RELATION_BOX = { x: 14, y: 14, w: 280, h: 312 };
const RELATION_PANEL = { x: 302, y: 14, w: 210, h: 312 };
const relationPlot = () => new Plot(-0.5, 6.5, -1.3, 6.5, RELATION_BOX);
/** Where the handle of the test line sits: in the strip below the x-axis. */
const TEST_HANDLE_Y = -0.9;

function relationCheck(v: LabValues): string {
  const plot = relationPlot();
  const points = relationPoints(v);
  const info = analyseRelation(points);
  let out = open("Fünf Punkte im Koordinatensystem, ihr Pfeildiagramm und eine senkrechte Prüfgerade");
  // the lattice 0 … 6 with its axes
  out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
  for (let k = 0; k <= 6; k++) {
    out += line(plot.X(k), plot.Y(-0.5), plot.X(k), plot.Y(6.5), "lab-grid");
    out += line(plot.X(-0.5), plot.Y(k), plot.X(6.5), plot.Y(k), "lab-grid");
  }
  out += arrow(plot.X(-0.5), plot.Y(0), plot.X(6.5) + 4, plot.Y(0), "lab-axis", 1.4);
  out += arrow(plot.X(0), plot.Y(-0.5), plot.X(0), plot.Y(6.5) - 4, "lab-axis", 1.4);
  out += text(plot.X(6.5) - 4, plot.Y(0) - 6, "x", "lab-text-axis", "end");
  out += text(plot.X(0) + 6, plot.Y(6.5) + 10, "y", "lab-text-axis");
  for (let k = 1; k <= 6; k++) {
    out += text(plot.X(k), plot.Y(0) + 14, String(k), "lab-text-tick", "middle");
    out += text(plot.X(0) - 6, plot.Y(k) + 4, String(k), "lab-text-tick", "end");
  }
  out += text(plot.X(0) - 6, plot.Y(0) + 14, "0", "lab-text-tick", "end");
  // the test line x = s, its handle below the x-axis
  const hits = info.ys.get(v.s) ?? [];
  out += line(plot.X(v.s), plot.Y(-0.55), plot.X(v.s), plot.Y(6.5), "lab-curve-c");
  const right = v.s < 5;
  out += text(plot.X(v.s) + (right ? 14 : -14), plot.Y(TEST_HANDLE_Y) + 4, `Prüfgerade x = ${fmt(v.s)}`, "lab-text-small lab-text-c", right ? "start" : "end");
  for (const y of hits) out += circle(plot.X(v.s), plot.Y(y), 13, hits.length > 1 ? "lab-target lab-bad-stroke" : "lab-target");
  out += handle("s", plot.X(v.s), plot.Y(TEST_HANDLE_Y), "Prüfgerade x = s");
  // the points, grouped by spot so that coinciding points share one label
  const spots = new Map<string, number[]>();
  points.forEach((p, i) => {
    const key = `${p.x}|${p.y}`;
    spots.set(key, [...(spots.get(key) ?? []), i + 1]);
  });
  for (const [key, ids] of spots) {
    const [x, y] = key.split("|").map(Number);
    const bad = info.broken.includes(x);
    out += pointLabel(plot, plot.P(x, y), ids.map((i) => `P${SUB[i]}`).join(" = "), bad ? "lab-text-small lab-text-b" : "lab-text-small", 11, -10);
  }
  points.forEach((p, i) => {
    const bad = info.broken.includes(p.x);
    out += handle(`P${i + 1}`, plot.X(p.x), plot.Y(p.y), `Punkt P${i + 1}`, bad ? "lab-handle lab-handle-b" : "lab-handle lab-handle-a");
  });
  // the arrow diagram
  const P = RELATION_PANEL;
  out += rect(P.x, P.y, P.w, P.h, "lab-panel", 'rx="10"');
  out += text(P.x + 10, P.y + 22, "Pfeildiagramm", "lab-text-muted");
  const left = { x: P.x + 22, w: 56 };
  const rightCol = { x: P.x + P.w - 78, w: 56 };
  const top = P.y + 50;
  const height = 196;
  out += text(left.x + left.w / 2, top - 8, "x", "lab-text-axis", "middle");
  out += text(rightCol.x + rightCol.w / 2, top - 8, "y", "lab-text-axis", "middle");
  out += rect(left.x, top, left.w, height, "lab-cell", 'rx="26"');
  out += rect(rightCol.x, top, rightCol.w, height, "lab-cell", 'rx="26"');
  const rowY = (k: number, n: number) => top + (height * (k + 0.5)) / n;
  info.D.forEach((x, k) => {
    out += text(left.x + left.w / 2, rowY(k, info.D.length) + 4, fmt(x), info.broken.includes(x) ? "lab-text lab-text-b" : "lab-text", "middle");
  });
  info.W.forEach((y, k) => {
    out += text(rightCol.x + rightCol.w / 2, rowY(k, info.W.length) + 4, fmt(y), "lab-text", "middle");
  });
  info.D.forEach((x, k) => {
    for (const y of info.ys.get(x) ?? []) {
      const j = info.W.indexOf(y);
      out += toneArrow(left.x + left.w - 12, rowY(k, info.D.length), rightCol.x + 12, rowY(j, info.W.length), info.broken.includes(x) ? "b" : "a");
    }
  });
  out += text(P.x + 10, P.y + 270, info.isFunction ? "Funktion" : "keine Funktion", info.isFunction ? "lab-text lab-text-ok" : "lab-text lab-text-bad");
  out += text(
    P.x + 10,
    P.y + 288,
    info.isFunction ? "Von jedem x genau ein Pfeil" : `Von x = ${fmt(info.broken[0])} gehen ${(info.ys.get(info.broken[0]) ?? []).length} Pfeile aus`,
    "lab-text-small",
  );
  out += text(P.x + 10, P.y + 304, `Prüfgerade trifft ${hits.length === 0 ? "keinen Punkt" : hits.length === 1 ? "1 Punkt" : `${hits.length} Punkte`}`, "lab-text-small");
  out += `</svg>`;
  return out;
}

const pointDrag = (i: number) => ({
  x: `x${i}`,
  y: `y${i}`,
  drag: (p: Pt) => {
    const plot = relationPlot();
    return { [`x${i}`]: plot.invX(p.x), [`y${i}`]: plot.invY(p.y), sel: i };
  },
});

// ─── 6.2 Darstellungsformen ────────────────────────────────────────────────

export interface RepresentationFunction {
  /** The equation as plain text. */
  equation: string;
  f: (x: number) => number;
  inD: (x: number) => boolean;
  D: string;
  /** The verbal description, split into panel lines. */
  description: string[];
  /** The x-values of the Wertetabelle. */
  rows: number[];
  ymin: number;
  ymax: number;
  yStep: number;
  yLabel: number;
  /** Where the drawn graph starts; a filled dot marks a start that belongs to D. */
  from?: number;
  startDot?: boolean;
  /** Isolated points (Stückzahlen) instead of a line. */
  discrete?: boolean;
}

export const REPRESENTATIONS: RepresentationFunction[] = [
  {
    equation: "y = 0,5x + 1",
    f: (x) => 0.5 * x + 1,
    inD: () => true,
    D: "D = ℚ",
    description: ["Zu jeder Zahl x gehört die", "Hälfte von x, vermehrt", "um 1."],
    rows: [-4, -2, 0, 2, 4, 6],
    ymin: -3,
    ymax: 7,
    yStep: 1,
    yLabel: 2,
  },
  {
    equation: "y = x² − 2",
    f: (x) => x * x - 2,
    inD: () => true,
    D: "D = ℚ",
    description: ["Zu jeder Zahl x gehört", "ihr Quadrat, vermindert", "um 2."],
    rows: [-3, -2, -1, 0, 1, 2, 3],
    ymin: -4,
    ymax: 16,
    yStep: 2,
    yLabel: 4,
  },
  {
    equation: "y = 12 : x",
    f: (x) => (x > 0 ? 12 / x : Number.NaN),
    inD: (x) => x > 0,
    D: "D = ℚ⁺",
    description: ["Rechteck mit 12 cm²: Zur", "Länge x (in cm) gehört", "die Breite y (in cm)."],
    rows: [1, 2, 3, 4, 6, 8],
    ymin: -2,
    ymax: 14,
    yStep: 2,
    yLabel: 2,
    from: 0.45,
  },
  {
    equation: "y = 2x + 3,5",
    f: (x) => (x >= 0 ? 2 * x + 3.5 : Number.NaN),
    inD: (x) => x >= 0,
    D: "D = ℚ₀⁺",
    description: ["Taxi: 3,50 € Grundgebühr", "und 2 € je Kilometer", "(x in km, y in €)."],
    rows: [0, 1, 2, 4, 6, 8],
    ymin: -2,
    ymax: 22,
    yStep: 2,
    yLabel: 4,
    from: 0,
    startDot: true,
  },
  {
    equation: "y = 1,5x",
    f: (x) => (Number.isInteger(x) && x >= 0 && x <= 8 ? 1.5 * x : Number.NaN),
    inD: (x) => Number.isInteger(x) && x >= 0 && x <= 8,
    D: "D = {0; 1; 2; …; 8}",
    description: ["Eine Breze kostet 1,50 €:", "x Brezen kosten y €", "(höchstens 8 Stück)."],
    rows: [0, 1, 2, 3, 4, 5],
    ymin: -2,
    ymax: 14,
    yStep: 2,
    yLabel: 2,
    discrete: true,
  },
];

export const representationOf = (v: LabValues): RepresentationFunction => REPRESENTATIONS[v.f] ?? REPRESENTATIONS[0];
const representationPlot = (v: LabValues) => {
  const r = representationOf(v);
  return new Plot(-4.5, 8.5, r.ymin, r.ymax, GRAPH_BOX);
};

function representations(v: LabValues): string {
  const r = representationOf(v);
  const plot = representationPlot(v);
  let out = open("Eine Funktion als Gleichung, Beschreibung, Wertetabelle und Graph mit einer ziehbaren Stelle x");
  out += plot.clip("clip-rep") + axesXY(plot, 1, r.yStep, 2, r.yLabel);
  let curve = "";
  if (r.discrete) {
    for (let x = 0; x <= 8; x++) curve += circle(plot.X(x), plot.Y(r.f(x)), 4.5, "lab-point-a");
  } else {
    curve += branch(plot, r.f, r.from ?? plot.xmin, plot.xmax, "lab-curve");
    if (r.startDot && r.from !== undefined) curve += circle(plot.X(r.from), plot.Y(r.f(r.from)), 4.5, "lab-point-a");
    // the table points on the graph
    for (const x of r.rows) {
      const y = r.f(x);
      if (Number.isFinite(y) && plot.contains(x, y)) curve += circle(plot.X(x), plot.Y(y), 3, "lab-dot-small");
    }
  }
  out += clipped("clip-rep", curve);
  const y = r.f(v.x);
  const inside = r.inD(v.x) && Number.isFinite(y);
  if (inside && plot.contains(v.x, y)) {
    const P = plot.P(v.x, y);
    out += line(P.x, plot.Y(0), P.x, P.y, "lab-dashed");
    out += line(plot.X(0), P.y, P.x, P.y, "lab-dashed");
    out += circle(P.x, P.y, 6, "lab-point-ok");
    out += pointLabel(plot, P, `(${fmt(v.x)} | ${fmt(y)})`, "lab-text lab-text-ok", 10, -10);
  } else if (!inside) {
    out += text(plot.X(v.x), plot.Y(0) - 14, "nicht in D", "lab-text-small lab-text-bad", "middle");
  }
  // the panel: equation, description, table
  const P = PANEL;
  out += rect(P.x, P.y, P.w, P.h, "lab-panel", 'rx="10"');
  out += text(P.x + 10, P.y + 24, r.equation, "lab-text lab-text-big lab-text-a");
  out += text(P.x + 10, P.y + 44, r.D, "lab-text-small");
  r.description.forEach((row, k) => {
    out += text(P.x + 10, P.y + 64 + k * 15, row, "lab-text-small");
  });
  const tableTop = P.y + 124;
  const colX = P.x + 52;
  const colY = P.x + 128;
  out += text(colX, tableTop, "x", "lab-text-axis", "middle");
  out += text(colY, tableTop, "y", "lab-text-axis", "middle");
  out += line(P.x + 14, tableTop + 6, P.x + P.w - 14, tableTop + 6, "lab-thin");
  out += line(P.x + 90, tableTop - 12, P.x + 90, tableTop + 8 + r.rows.length * 20, "lab-thin");
  r.rows.forEach((x, k) => {
    const rowY = tableTop + 23 + k * 20;
    const current = Math.abs(x - v.x) < 1e-9;
    if (current) out += rect(P.x + 14, rowY - 14, P.w - 28, 19, "lab-fill-ok", 'rx="4"');
    out += text(colX, rowY, fmt(x), current ? "lab-text lab-text-ok" : "lab-text", "middle");
    out += text(colY, rowY, fmt(r.f(x)), current ? "lab-text lab-text-ok" : "lab-text", "middle");
  });
  out += text(P.x + 10, P.y + P.h - 12, inside ? `f(${fmt(v.x)}) = ${fmt(y)}` : `x = ${fmt(v.x)} liegt nicht in D`, inside ? "lab-text lab-text-ok" : "lab-text lab-text-bad");
  out += handle("x", plot.X(v.x), plot.Y(0), "Stelle x");
  out += `</svg>`;
  return out;
}

// ─── 6.3 Nullstellen, Definitions- und Wertemenge ──────────────────────────

export interface DomainFunction {
  equation: string;
  f: (x: number) => number;
  /** The Nullstellen of f. */
  zeros: number[];
  /** x of the lowest point, for the function that has one. */
  turn?: number;
  /** The y-window of the drawing; the lines get the same unit on both axes. */
  ymin: number;
  ymax: number;
}

export const DOMAIN_FUNCTIONS: DomainFunction[] = [
  { equation: "f₁: y = 0,5x − 1", f: (x) => 0.5 * x - 1, zeros: [2], ymin: -5.5, ymax: -5.5 + 11 * (312 / 300) },
  { equation: "f₂: y = −x + 3", f: (x) => -x + 3, zeros: [3], ymin: -3, ymax: -3 + 11 * (312 / 300) },
  { equation: "f₃: y = 0,5x² − 2", f: (x) => 0.5 * x * x - 2, zeros: [-2, 2], turn: 0, ymin: -3, ymax: 11 },
];

export const domainFunctionOf = (v: LabValues): DomainFunction => DOMAIN_FUNCTIONS[v.f] ?? DOMAIN_FUNCTIONS[0];

/** D = [lo; hi] from the two sliders, in either order. */
export function domainOf(v: LabValues): { lo: number; hi: number } {
  return { lo: Math.min(v.a, v.b), hi: Math.max(v.a, v.b) };
}

/** W = [min; max] of f over D: the ends, and the lowest point when it lies in D. */
export function valueSet(v: LabValues): { lo: number; hi: number } {
  const fn = domainFunctionOf(v);
  const { lo, hi } = domainOf(v);
  const candidates = [fn.f(lo), fn.f(hi)];
  if (fn.turn !== undefined && fn.turn >= lo && fn.turn <= hi) candidates.push(fn.f(fn.turn));
  return { lo: Math.min(...candidates), hi: Math.max(...candidates) };
}

/** The Nullstellen of f that lie in D. */
export function zerosInDomain(v: LabValues): number[] {
  const { lo, hi } = domainOf(v);
  return domainFunctionOf(v).zeros.filter((x) => x >= lo && x <= hi);
}

export function zerosText(zeros: number[]): string {
  if (zeros.length === 0) return "keine in D";
  if (zeros.length === 1) return `x₀ = ${fmt(zeros[0])}`;
  return zeros.map((x, i) => `x${SUB[i + 1]} = ${fmt(x)}`).join(" und ");
}

const domainPlot = (v: LabValues) => new Plot(-5.5, 5.5, domainFunctionOf(v).ymin, domainFunctionOf(v).ymax, GRAPH_BOX);

function zerosDomain(v: LabValues): string {
  const plot = domainPlot(v);
  const fn = domainFunctionOf(v);
  const { lo, hi } = domainOf(v);
  const W = valueSet(v);
  const zeros = zerosInDomain(v);
  let out = open("Der Graph einer Funktion über einer einstellbaren Definitionsmenge mit Wertemenge und Nullstellen");
  out += plot.clip("clip-dom") + axesXY(plot, 1, 1, 1, 2);
  let curves = branch(plot, fn.f, plot.xmin, plot.xmax, "lab-ghost");
  curves += branch(plot, fn.f, lo, hi, "lab-curve");
  out += clipped("clip-dom", curves);
  // D on the x-axis, W on the y-axis
  const x0 = plot.X(0);
  const y0 = plot.Y(0);
  const Wlo = plot.Y(W.lo);
  const Whi = plot.Y(W.hi);
  out += line(plot.X(lo), y0, plot.X(hi), y0, "lab-side-a");
  out += line(plot.X(lo), y0 - 6, plot.X(lo), y0 + 6, "lab-side-a") + line(plot.X(hi), y0 - 6, plot.X(hi), y0 + 6, "lab-side-a");
  out += line(x0, Wlo, x0, Whi, "lab-side-b");
  out += line(x0 - 6, Wlo, x0 + 6, Wlo, "lab-side-b") + line(x0 - 6, Whi, x0 + 6, Whi, "lab-side-b");
  // dashed lines from the points that give the ends of W to the y-axis
  const extremes = [lo, hi];
  if (fn.turn !== undefined && fn.turn > lo && fn.turn < hi) extremes.push(fn.turn);
  for (const x of extremes) {
    const Q = plot.P(x, fn.f(x));
    if (Math.abs(Q.x - x0) > 1) out += line(Q.x, Q.y, x0, Q.y, "lab-dashed");
    out += circle(Q.x, Q.y, x === lo || x === hi ? 5 : 4, x === lo || x === hi ? "lab-point-a" : "lab-point-b");
  }
  for (const z of zeros) {
    const N = plot.P(z, 0);
    out += circle(N.x, N.y, 6, "lab-point-ok");
    out += text(N.x, N.y + 28, `N(${fmt(z)} | 0)`, "lab-text-small lab-text-ok", "middle");
  }
  const lines: PanelLine[] = [
    [fn.equation, "lab-text lab-text-a"],
    ["", ""],
    [`D = ${intervalText(lo, hi)}`, "lab-text lab-text-a"],
    [`W = ${intervalText(W.lo, W.hi)}`, "lab-text lab-text-b"],
    ["", ""],
    ["Nullstellen in D:", "lab-text-muted"],
    [zerosText(zeros), zeros.length ? "lab-text lab-text-ok" : "lab-text"],
    ["", ""],
    [`f(${fmt(lo)}) = ${fmt(fn.f(lo))}`, "lab-text-small"],
    [`f(${fmt(hi)}) = ${fmt(fn.f(hi))}`, "lab-text-small"],
  ];
  if (fn.turn !== undefined && fn.turn > lo && fn.turn < hi) lines.push([`f(${fmt(fn.turn)}) = ${fmt(fn.f(fn.turn))}: kleinster Wert`, "lab-text-small"]);
  lines.push(["", ""], ["Ziehe die Enden a und b", "lab-text-small"], ["von D auf der x-Achse.", "lab-text-small"]);
  out += sidePanel(lines);
  out += handle("a", plot.X(v.a), y0, "Ende a der Definitionsmenge", "lab-handle lab-handle-a");
  out += handle("b", plot.X(v.b), y0, "Ende b der Definitionsmenge", "lab-handle lab-handle-a");
  out += `</svg>`;
  return out;
}

// ─── Rational slopes ───────────────────────────────────────────────────────

/** A fraction p/q in lowest terms with q > 0. */
export type Ratio = [number, number];

export function ratio(p: number, q: number): Ratio {
  const g = gcd(p, q);
  const sign = q < 0 ? -1 : 1;
  return [(sign * p) / g + 0, (sign * q) / g];
}

/** Whether p/q has a finite decimal: q has no prime factors but 2 and 5. */
export function terminating(q: number): boolean {
  let n = Math.abs(q);
  while (n % 2 === 0) n /= 2;
  while (n % 5 === 0) n /= 5;
  return n === 1;
}

/** "1,5", "−3", "2/3": a decimal where it ends, a fraction otherwise. */
export function ratioText(r: Ratio): string {
  if (r[1] === 1) return fmt(r[0]);
  return terminating(r[1]) ? fmt(r[0] / r[1], 4) : fracText(r[0], r[1]);
}

/** A fraction with its rounded decimal: "2/3 ≈ 0,67"; "1,5" when it ends. */
export function ratioApprox(r: Ratio): string {
  const shown = ratioText(r);
  return shown.includes("/") ? `${shown} ≈ ${fmt(r[0] / r[1], 2)}` : shown;
}

/** The equation y = m x (+ t) with m as a ratio: "y = 2/3 x + 1", "y = −x", "y = 3". */
export function lineText(r: Ratio, t = 0): string {
  if (r[0] === 0) return `y = ${fmt(t)}`;
  const shown = ratioText(r);
  const coef = shown === "1" ? "" : shown === "−1" ? "−" : shown.includes("/") ? `${shown} ` : shown;
  return `y = ${coef}x${t === 0 ? "" : t > 0 ? ` + ${fmt(t)}` : ` − ${fmt(-t)}`}`;
}

/** The slope of the line through O and (x | y); null for the y-axis (x = 0). */
export function originSlope(x: number, y: number): Ratio | null {
  return x === 0 ? null : ratio(y, x);
}

/** The square coordinate system of the line labs, left of the side panel. */
const SQUARE_BOX = { x: 14, y: 14, w: 312, h: 312 };
const SQUARE_PANEL = { x: 334, y: 14, w: 178, h: 312 };
const squarePlot = () => new Plot(-6, 6, -6, 6, SQUARE_BOX);

/** A target point: a dashed ring, green and filled once the line passes through it. */
function targetPoint(plot: Plot, x: number, y: number, name: string, hit: boolean): string {
  const P = plot.P(x, y);
  return circle(P.x, P.y, hit ? 6 : 8, hit ? "lab-point-ok" : "lab-target") + pointLabel(plot, P, `${name}(${fmt(x)} | ${fmt(y)})`, hit ? "lab-text-small lab-text-ok" : "lab-text-small", 10, 16);
}

/** A label kept inside a plot box, centred or anchored at one side. */
function boxedText(plot: Plot, x: number, y: number, content: string, cls: string, anchor: "start" | "middle" | "end" = "middle"): string {
  const width = content.length * charWidth(cls);
  const left = anchor === "start" ? x : anchor === "end" ? x - width : x - width / 2;
  const shift = clamp(left, plot.box.x + 3, plot.box.x + plot.box.w - width - 3) - left;
  return text(x + shift, clamp(y, plot.box.y + 12, plot.box.y + plot.box.h - 4), content, cls, anchor);
}

// ─── 6.4 Ursprungsgeraden ──────────────────────────────────────────────────

export const ORIGIN_TARGET = { x: -4, y: 3 };

function originLine(v: LabValues): string {
  const plot = squarePlot();
  const r = originSlope(v.px, v.py);
  let out = open("Eine Ursprungsgerade durch einen ziehbaren Punkt P mit einem Steigungsdreieck");
  out += plot.clip("clip-ol") + plot.grid(1, 2);
  let drawing = "";
  let handles = "";
  const lines: PanelLine[] = [];
  if (r === null) {
    if (v.py !== 0) drawing += line(plot.X(0), plot.Y(-6), plot.X(0), plot.Y(6), "lab-curve-c");
    lines.push([v.py === 0 ? "P liegt auf O:" : "x = 0: die y-Achse,", "lab-text lab-text-bad"], [v.py === 0 ? "keine Gerade festgelegt" : "keine Funktion y = mx", "lab-text-small"]);
  } else {
    const m = r[0] / r[1];
    drawing += plot.lineThrough(m, 0, "lab-curve");
    const A = plot.P(v.a, m * v.a);
    const C = plot.P(v.a + v.d, m * v.a);
    const B = plot.P(v.a + v.d, m * (v.a + v.d));
    drawing += polygon([A, C, B], "lab-fill-only");
    drawing += line(A.x, A.y, C.x, C.y, "lab-side-a") + line(C.x, C.y, B.x, B.y, "lab-side-b");
    const dy = ratio(r[0] * v.d, r[1]);
    // labels: Δx on the side of the leg away from the triangle, Δy beside the vertical leg
    drawing += boxedText(plot, (A.x + C.x) / 2, m >= 0 ? A.y + 16 : A.y - 7, `Δx = ${v.d}`, "lab-text-small lab-text-a");
    if (m !== 0) drawing += boxedText(plot, C.x + 6, (C.y + B.y) / 2 + 4, `Δy = ${ratioText(dy)}`, "lab-text-small lab-text-b", "start");
    if (plot.contains(v.a, m * v.a)) handles += handle("A", A.x, A.y, "Anfang des Steigungsdreiecks", "lab-handle");
    if (plot.contains(v.a + v.d, m * (v.a + v.d))) handles += handle("B", B.x, B.y, "Breite des Steigungsdreiecks", "lab-handle lab-handle-b");
    lines.push(
      [`g: ${lineText(r)}`, "lab-text lab-text-big lab-text-a"],
      [`P(${fmt(v.px)} | ${fmt(v.py)})`, "lab-text"],
      [`m = y : x = ${fmt(v.py)} : ${fmt(v.px).startsWith("−") ? `(${fmt(v.px)})` : fmt(v.px)}`, "lab-text-small"],
      [`m = ${ratioApprox(r)}`, "lab-text lab-text-ok"],
      ["", ""],
      ["Steigungsdreieck:", "lab-text-muted"],
      [`Δx = ${v.d} nach rechts`, "lab-text lab-text-a"],
      [m === 0 ? "Δy = 0" : `Δy = ${ratioText(dy).replace("−", "")} nach ${m > 0 ? "oben" : "unten"}`, "lab-text lab-text-b"],
      [`Δy : Δx = ${ratioText(dy)} : ${v.d} = ${ratioText(r)}`, "lab-text-small"],
      ["", ""],
      [m > 0 ? "m > 0: g steigt." : m < 0 ? "m < 0: g fällt." : "m = 0: g ist die x-Achse.", "lab-text-small"],
    );
  }
  out += clipped("clip-ol", drawing);
  const hit = v.px !== 0 && ORIGIN_TARGET.y * v.px === ORIGIN_TARGET.x * v.py;
  out += targetPoint(plot, ORIGIN_TARGET.x, ORIGIN_TARGET.y, "Q", hit);
  out += circle(plot.X(0), plot.Y(0), 3.5, "lab-point");
  out += sidePanel(lines, SQUARE_PANEL);
  out += handles;
  out += handle("P", plot.X(v.px), plot.Y(v.py), "Punkt P der Geraden", "lab-handle lab-handle-a");
  out += text(plot.X(v.px) + (v.px > 4 ? -12 : 12), plot.Y(v.py) + (v.py > 4 ? 18 : -10), "P", "lab-text lab-text-a", v.px > 4 ? "end" : "start");
  out += `</svg>`;
  return out;
}

// ─── 6.5 Senkrechte Geraden ────────────────────────────────────────────────

/** The two lines of the lab are perpendicular and both have a slope (no axis). */
export function perpendicularPair(v: LabValues): boolean {
  return v.x1 !== 0 && v.y1 !== 0 && v.x2 !== 0 && v.y2 !== 0 && v.x1 * v.x2 + v.y1 * v.y2 === 0;
}

/** The acute angle between the lines through O and the two points, in degrees; null when a point is O. */
export function angleBetweenLines(x1: number, y1: number, x2: number, y2: number): number | null {
  const n = Math.hypot(x1, y1) * Math.hypot(x2, y2);
  if (n === 0) return null;
  const dot = x1 * x2 + y1 * y2;
  if (dot === 0) return 90;
  return (Math.acos(clamp(Math.abs(dot) / n, -1, 1)) * 180) / Math.PI;
}

function perpendicular(v: LabValues): string {
  const plot = squarePlot();
  const r1s = originSlope(v.x1, v.y1);
  const r2s = originSlope(v.x2, v.y2);
  const O = plot.P(0, 0);
  const P1 = plot.P(v.x1, v.y1);
  const P2 = plot.P(v.x2, v.y2);
  let out = open("Zwei Ursprungsgeraden mit ziehbaren Punkten, ihren Steigungen und dem Winkel zwischen ihnen");
  out += plot.clip("clip-pp") + plot.grid(1, 2);
  const drawLine = (x: number, y: number, cls: string) => {
    if (x === 0 && y === 0) return "";
    if (x === 0) return line(plot.X(0), plot.Y(-6), plot.X(0), plot.Y(6), cls);
    return plot.lineThrough(y / x, 0, cls);
  };
  let drawing = "";
  // the slope triangle of g₁ and the same triangle turned by 90° about O
  const turned = { x: -v.y1, y: v.x1 };
  if (v.x1 !== 0 && v.y1 !== 0) {
    drawing += polygon([O, plot.P(v.x1, 0), P1], "lab-fill-a");
    drawing += polygon([O, plot.P(0, v.x1), plot.P(turned.x, turned.y)], "lab-ghost", 'style="fill:none"');
  }
  drawing += drawLine(v.x1, v.y1, "lab-curve") + drawLine(v.x2, v.y2, "lab-curve-2");
  out += clipped("clip-pp", drawing);
  const ortho = perpendicularPair(v);
  if (v.x1 !== 0 && v.y1 !== 0) {
    const T = plot.P(turned.x, turned.y);
    out += circle(T.x, T.y, ortho ? 6 : 4, ortho ? "lab-point-ok" : "lab-dot-small");
    out += pointLabel(plot, T, "P₁′", ortho ? "lab-text-small lab-text-ok" : "lab-text-small", 9, -9);
  }
  const angle = angleBetweenLines(v.x1, v.y1, v.x2, v.y2);
  if (angle !== null) {
    const dot = v.x1 * v.x2 + v.y1 * v.y2;
    const Q = dot >= 0 ? P2 : plot.P(-v.x2, -v.y2);
    out += angleMark(O, P1, Q, 22, angle === 90 ? "lab-angle-ok" : "lab-angle", angle === 90);
  }
  out += circle(O.x, O.y, 3.5, "lab-point");
  const slopeLine = (r: Ratio | null, x: number, y: number, k: string) =>
    x === 0 && y === 0 ? `P${k} = O: keine Gerade` : r === null ? `m${k}: keine (y-Achse)` : `m${k} = ${ratioText(r)}`;
  const lines: PanelLine[] = [
    [`g₁: ${r1s ? lineText(r1s) : v.y1 === 0 ? "–" : "x = 0"}`, "lab-text lab-text-a"],
    [slopeLine(r1s, v.x1, v.y1, "₁"), "lab-text-small"],
    [`g₂: ${r2s ? lineText(r2s) : v.y2 === 0 ? "–" : "x = 0"}`, "lab-text lab-text-b"],
    [slopeLine(r2s, v.x2, v.y2, "₂"), "lab-text-small"],
    ["", ""],
  ];
  if (r1s && r2s) {
    const product = ratio(r1s[0] * r2s[0], r1s[1] * r2s[1]);
    lines.push(["m₁ · m₂ =", "lab-text-muted"], [ratioApprox(product), product[0] === -product[1] ? "lab-text lab-text-big lab-text-ok" : "lab-text lab-text-big"]);
  } else lines.push(["m₁ · m₂ nicht", "lab-text-muted"], ["berechenbar", "lab-text-muted"]);
  lines.push(["", ""], [angle === null ? "kein Winkel" : `Winkel: ${fmt(angle, 1)}°`, angle === 90 ? "lab-text lab-text-ok" : "lab-text"]);
  lines.push(["", ""], ["Blau: Steigungsdreieck von g₁", "lab-text-small"], ["gestrichelt: um 90° gedreht", "lab-text-small"]);
  out += sidePanel(lines, SQUARE_PANEL);
  out += handle("P1", P1.x, P1.y, "Punkt P₁ der Geraden g₁", "lab-handle lab-handle-a");
  out += handle("P2", P2.x, P2.y, "Punkt P₂ der Geraden g₂", "lab-handle lab-handle-b");
  out += pointLabel(plot, P1, "P₁", "lab-text lab-text-a", 11, -11);
  out += pointLabel(plot, P2, "P₂", "lab-text lab-text-b", 11, -11);
  out += `</svg>`;
  return out;
}

// ─── 6.6 Geraden y = mx + t ────────────────────────────────────────────────

export const LINE_TARGETS = [
  { name: "A", x: -2, y: 1 },
  { name: "B", x: 2, y: 3 },
  { name: "C", x: 3, y: -2 },
];

/** "x₀ = 1,5", "≈ 1,33" when rounded, or the special cases of m = 0. */
export function zeroOfLine(m: number, t: number): string {
  if (m === 0) return t === 0 ? "jede Stelle (die x-Achse)" : "keine (parallel zur x-Achse)";
  const x0 = -t / m;
  return `x₀ ${Math.abs(x0 - Number(x0.toFixed(2))) < 1e-9 ? "=" : "≈"} ${fmt(x0, 2)}`;
}

function lineMxT(v: LabValues): string {
  const plot = squarePlot();
  const { m, t } = v;
  let out = open("Die Gerade y = mx + t, die um t verschobene Ursprungsgerade y = mx und das Steigungsdreieck");
  out += plot.clip("clip-mt") + plot.grid(1, 2);
  let drawing = plot.lineThrough(m, 0, "lab-ghost");
  // the shift by t: arrows from y = mx to y = mx + t
  for (const x of [-4, 4]) {
    if (t !== 0 && plot.contains(x, m * x) && plot.contains(x, m * x + t)) drawing += toneArrow(plot.X(x), plot.Y(m * x), plot.X(x), plot.Y(m * x + t), "c", 2);
  }
  drawing += plot.lineThrough(m, t, "lab-curve");
  // the slope triangle from (0 | t): 1 to the right, m up
  const T = plot.P(0, t);
  const R = plot.P(1, t);
  const S = plot.P(1, t + m);
  drawing += polygon([T, R, S], "lab-fill-only");
  drawing += line(T.x, T.y, R.x, R.y, "lab-side-a") + line(R.x, R.y, S.x, S.y, "lab-side-b");
  out += clipped("clip-mt", drawing);
  out += boxedText(plot, (T.x + R.x) / 2, m >= 0 ? T.y + 15 : T.y - 6, "1", "lab-text-small lab-text-a");
  if (m !== 0) out += boxedText(plot, R.x + 6, (R.y + S.y) / 2 + 4, `m = ${fmt(m)}`, "lab-text-small lab-text-b", "start");
  if (m !== 0) {
    const x0 = -t / m;
    if (plot.contains(x0, 0)) {
      const N = plot.P(x0, 0);
      out += circle(N.x, N.y, 5, "lab-point-ok");
      // in the quadrant beside N that the line leaves free: lower right when it rises, lower left when it falls
      out += boxedText(plot, N.x + (m > 0 ? 8 : -8), N.y + 17, `N(${fmt(x0, 2)} | 0)`, "lab-text-small lab-text-ok", m > 0 ? "start" : "end");
    }
  }
  for (const target of LINE_TARGETS) out += targetPoint(plot, target.x, target.y, target.name, Math.abs(m * target.x + t - target.y) < 1e-9);
  const lines: PanelLine[] = [
    [`g: y = ${linear(m, t)}`, "lab-text lab-text-big lab-text-a"],
    ["", ""],
    [`m = ${fmt(m)} (Steigung)`, "lab-text lab-text-b"],
    [`t = ${fmt(t)}`, "lab-text"],
    ["Schnitt mit der y-Achse:", "lab-text-small"],
    [`(0 | ${fmt(t)})`, "lab-text"],
    ["", ""],
    ["Nullstelle:", "lab-text-muted"],
    [zeroOfLine(m, t), m === 0 ? "lab-text-small" : "lab-text lab-text-ok"],
    ["", ""],
  ];
  if (m === 0) lines.push(["m = 0: Parallele zur", "lab-text-small"], ["x-Achse, konstante Funktion", "lab-text-small"]);
  else lines.push(["grau: y = mx, um t", "lab-text-small"], [t >= 0 ? "nach oben verschoben" : "nach unten verschoben", "lab-text-small"]);
  out += sidePanel(lines, SQUARE_PANEL);
  if (plot.contains(1, t + m)) out += handle("S", S.x, S.y, "Spitze des Steigungsdreiecks: Steigung m", "lab-handle lab-handle-b");
  out += handle("T", T.x, T.y, "Schnittpunkt mit der y-Achse: t", "lab-handle lab-handle-a");
  out += `</svg>`;
  return out;
}

// ─── Placeholders until the remaining labs are written ─────────────────────

const placeholder: LabView = { render: () => '<svg viewBox="0 0 520 340" xmlns="http://www.w3.org/2000/svg"></svg>' };

export const FUNKTIONEN_VIEWS: Record<"relation-check" | "representations" | "zeros-domain" | "origin-line" | "perpendicular" | "line-mx-t" | "line-from-points" | "parallel-family" | "linear-model" | "determinant-area", LabView> = {
  "relation-check": {
    render: relationCheck,
    handles: {
      P1: pointDrag(1),
      P2: pointDrag(2),
      P3: pointDrag(3),
      P4: pointDrag(4),
      P5: pointDrag(5),
      s: { x: "s", drag: (p) => ({ s: relationPlot().invX(p.x) }) },
    },
  },
  representations: {
    render: representations,
    handles: {
      x: { x: "x", drag: (p, v) => ({ x: representationPlot(v).invX(p.x) }) },
    },
  },
  "zeros-domain": {
    render: zerosDomain,
    handles: {
      a: { x: "a", drag: (p, v) => ({ a: domainPlot(v).invX(p.x) }) },
      b: { x: "b", drag: (p, v) => ({ b: domainPlot(v).invX(p.x) }) },
    },
  },
  "origin-line": {
    render: originLine,
    handles: {
      P: { x: "px", y: "py", drag: (p) => ({ px: squarePlot().invX(p.x), py: squarePlot().invY(p.y) }) },
      A: { x: "a", drag: (p) => ({ a: squarePlot().invX(p.x) }) },
      B: { x: "d", drag: (p, v) => ({ d: squarePlot().invX(p.x) - v.a }) },
    },
  },
  perpendicular: {
    render: perpendicular,
    handles: {
      P1: { x: "x1", y: "y1", drag: (p) => ({ x1: squarePlot().invX(p.x), y1: squarePlot().invY(p.y) }) },
      P2: { x: "x2", y: "y2", drag: (p) => ({ x2: squarePlot().invX(p.x), y2: squarePlot().invY(p.y) }) },
    },
  },
  "line-mx-t": {
    render: lineMxT,
    handles: {
      T: { y: "t", drag: (p) => ({ t: squarePlot().invY(p.y) }) },
      S: { y: "m", drag: (p, v) => ({ m: squarePlot().invY(p.y) - v.t }) },
    },
  },
  "line-from-points": placeholder,
  "parallel-family": placeholder,
  "linear-model": placeholder,
  "determinant-area": placeholder,
};
