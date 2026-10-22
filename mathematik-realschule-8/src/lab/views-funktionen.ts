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

// ─── 6.7 Geradengleichungen aus zwei Punkten ───────────────────────────────

export type TwoPointLine = { kind: "none" } | { kind: "vertical"; c: number } | { kind: "line"; m: Ratio; t: Ratio };

/** The line through P and Q: none for P = Q, x = c for equal x, else m and t as fractions. */
export function lineThroughPoints(px: number, py: number, qx: number, qy: number): TwoPointLine {
  if (px === qx && py === qy) return { kind: "none" };
  if (px === qx) return { kind: "vertical", c: px };
  const dx = qx - px;
  return { kind: "line", m: ratio(qy - py, dx), t: ratio(py * dx - (qy - py) * px, dx) };
}

/** y = m x + t with both parameters as fractions: "y = 2/3 x + 1/3". */
export function lineTextR(m: Ratio, t: Ratio): string {
  const base = lineText(m);
  if (t[0] === 0) return base;
  const shown = ratioText([Math.abs(t[0]), t[1]]);
  if (m[0] === 0) return `y = ${ratioText(t)}`;
  return `${base} ${t[0] > 0 ? "+" : "−"} ${shown}`;
}

export const POINT_TARGET = { x: 2, y: 3 };

function lineFromPoints(v: LabValues): string {
  const plot = squarePlot();
  const L = lineThroughPoints(v.px, v.py, v.qx, v.qy);
  const P = plot.P(v.px, v.py);
  const Q = plot.P(v.qx, v.qy);
  let out = open("Die Gerade durch zwei ziehbare Punkte P und Q mit Steigungsdreieck und Gleichung");
  out += plot.clip("clip-lp") + plot.grid(1, 2);
  let drawing = "";
  if (L.kind === "vertical") drawing += line(plot.X(L.c), plot.Y(-6), plot.X(L.c), plot.Y(6), "lab-curve-c");
  if (L.kind === "line") {
    drawing += plot.lineThrough(L.m[0] / L.m[1], L.t[0] / L.t[1], "lab-curve");
    const C = plot.P(v.qx, v.py);
    drawing += polygon([P, C, Q], "lab-fill-only");
    drawing += line(P.x, P.y, C.x, C.y, "lab-side-a");
    if (v.qy !== v.py) drawing += line(C.x, C.y, Q.x, Q.y, "lab-side-b");
  }
  out += clipped("clip-lp", drawing);
  if (L.kind === "line") {
    const C = plot.P(v.qx, v.py);
    const below = v.qy >= v.py;
    out += boxedText(plot, (P.x + C.x) / 2, below ? C.y + 16 : C.y - 7, `Δx = ${fmt(v.qx - v.px)}`, "lab-text-small lab-text-a");
    if (v.qy !== v.py) out += boxedText(plot, C.x + (v.qx > v.px ? 6 : -6), (C.y + Q.y) / 2 + 4, `Δy = ${fmt(v.qy - v.py)}`, "lab-text-small lab-text-b", v.qx > v.px ? "start" : "end");
    const t = L.t[0] / L.t[1];
    if (plot.contains(0, t)) {
      const T = plot.P(0, t);
      out += circle(T.x, T.y, 5, "lab-point-ok");
    }
  }
  const hit = L.kind === "line" && Math.abs((L.m[0] / L.m[1]) * POINT_TARGET.x + L.t[0] / L.t[1] - POINT_TARGET.y) < 1e-9;
  out += targetPoint(plot, POINT_TARGET.x, POINT_TARGET.y, "R", hit);
  const dx = v.qx - v.px;
  const dy = v.qy - v.py;
  const lines: PanelLine[] = [];
  if (L.kind === "none") lines.push(["P = Q: Durch einen", "lab-text lab-text-bad"], ["Punkt gehen viele Geraden.", "lab-text-small"]);
  else if (L.kind === "vertical") {
    lines.push([`x = ${fmt(L.c)}`, "lab-text lab-text-big lab-text-c"], ["", ""], ["x₁ = x₂: Δx = 0, man", "lab-text-small"], ["kann nicht durch 0 teilen.", "lab-text-small"], ["Parallele zur y-Achse,", "lab-text-small"], ["keine Steigung, keine", "lab-text-small"], ["Funktion.", "lab-text-small"]);
  } else {
    lines.push(
      [lineTextR(L.m, L.t), "lab-text lab-text-big lab-text-a"],
      ["", ""],
      ["m = (y₂ − y₁) : (x₂ − x₁)", "lab-text-small"],
      [`= ${fmt(dy)} : ${dx < 0 ? `(${fmt(dx)})` : fmt(dx)}`, "lab-text-small"],
      [`m = ${ratioApprox(L.m)}`, "lab-text lab-text-b"],
      ["", ""],
      ["t = y₁ − m · x₁", "lab-text-small"],
      [`= ${fmt(v.py)} − ${L.m[0] < 0 ? `(${ratioText(L.m)})` : ratioText(L.m)} · ${v.px < 0 ? `(${fmt(v.px)})` : fmt(v.px)}`, "lab-text-small"],
      [`t = ${ratioApprox(L.t)}`, "lab-text lab-text-ok"],
    );
  }
  out += sidePanel(lines, SQUARE_PANEL);
  out += handle("P", P.x, P.y, "Punkt P", "lab-handle lab-handle-a");
  out += handle("Q", Q.x, Q.y, "Punkt Q", "lab-handle lab-handle-b");
  out += pointLabel(plot, P, "P", "lab-text lab-text-a", 11, -11);
  out += pointLabel(plot, Q, "Q", "lab-text lab-text-b", 11, -11);
  out += `</svg>`;
  return out;
}

// ─── 6.8 Parallelenscharen ─────────────────────────────────────────────────

export const FAMILY_TARGET = { x: -2, y: 1 };

/** The perpendicular h to g_t through P: slope −1 : m, and its y-intercept. */
export function familyNormal(v: LabValues): { m: number; t: number } {
  return { m: -1 / v.m, t: v.py + v.px / v.m };
}

/** The intersection S of g_t and the perpendicular h through P. */
export function familyIntersection(v: LabValues): { x: number; y: number } {
  const h = familyNormal(v);
  const x = (h.t - v.t) / (v.m - h.m);
  return { x, y: v.m * x + v.t };
}

function parallelFamily(v: LabValues): string {
  const plot = squarePlot();
  const h = familyNormal(v);
  const S = familyIntersection(v);
  let out = open("Eine Parallelenschar y = mx + t, ein gewähltes Element, ein Punkt P und die Senkrechte durch P");
  out += plot.clip("clip-pf") + plot.grid(1, 2);
  let drawing = "";
  for (let k = -12; k <= 12; k++) {
    if (k === v.t) continue;
    drawing += `<line x1="${r1(plot.X(-6))}" y1="${r1(plot.Y(v.m * -6 + k))}" x2="${r1(plot.X(6))}" y2="${r1(plot.Y(v.m * 6 + k))}" class="lab-ghost" style="stroke-width:1.1;opacity:0.55" />`;
  }
  drawing += plot.lineThrough(h.m, h.t, "lab-curve-2");
  drawing += plot.lineThrough(v.m, v.t, "lab-curve");
  out += clipped("clip-pf", drawing);
  const hitR = Math.abs(v.m * FAMILY_TARGET.x + v.t - FAMILY_TARGET.y) < 1e-9;
  out += targetPoint(plot, FAMILY_TARGET.x, FAMILY_TARGET.y, "R", hitR);
  const x0 = -v.t / v.m;
  if (plot.contains(x0, 0)) {
    const N = plot.P(x0, 0);
    out += circle(N.x, N.y, 5, "lab-point-ok");
    out += boxedText(plot, N.x + (v.m > 0 ? 8 : -8), N.y + 17, `N(${fmt(x0, 2)} | 0)`, "lab-text-small lab-text-ok", v.m > 0 ? "start" : "end");
  }
  if (plot.contains(S.x, S.y)) {
    const Sp = plot.P(S.x, S.y);
    const onAxis = Math.abs(S.x) < 1e-9;
    out += circle(Sp.x, Sp.y, onAxis ? 6 : 4.5, onAxis ? "lab-point-ok" : "lab-point");
    out += pointLabel(plot, Sp, "S", onAxis ? "lab-text lab-text-ok" : "lab-text", -16, -8);
  }
  const lines: PanelLine[] = [
    [`Schar: y = ${fmt(v.m)}x + t`, "lab-text-muted"],
    [`g: y = ${linear(v.m, v.t)}`, "lab-text lab-text-big lab-text-a"],
    [`t = ${fmt(v.t)}, N: x₀ = ${fmt(x0, 2)}`, "lab-text-small"],
    ["", ""],
    [`Element durch P: t = ${fmt(v.py - v.m * v.px, 2)}`, "lab-text-small"],
    ["", ""],
    ["h ⊥ g durch P:", "lab-text-muted"],
    [`h: y = ${linear(h.m, h.t)}`, "lab-text lab-text-b"],
    [`${fmt(v.m)} · (${fmt(h.m)}) = −1`, "lab-text-small"],
    ["", ""],
    ["Schnittpunkt von g und h:", "lab-text-muted"],
    [`S(${fmt(S.x, 2)} | ${fmt(S.y, 2)})`, Math.abs(S.x) < 1e-9 ? "lab-text lab-text-ok" : "lab-text"],
  ];
  out += sidePanel(lines, SQUARE_PANEL);
  if (plot.contains(0, v.t)) out += handle("T", plot.X(0), plot.Y(v.t), "Element der Schar wählen: t", "lab-handle lab-handle-a");
  const Pp = plot.P(v.px, v.py);
  out += handle("P", Pp.x, Pp.y, "Punkt P", "lab-handle lab-handle-b");
  out += pointLabel(plot, Pp, "P", "lab-text lab-text-b", 11, -11);
  out += `</svg>`;
  return out;
}

// ─── 6.9 Tarifvergleich ────────────────────────────────────────────────────

/** The longest distance of the tariff lab in km. */
export const TARIFF_MAX = 400;
const tariffPlot = () => new Plot(-24, 424, -16, 268, GRAPH_BOX);

/** An amount of money as on a bill: 52,50, or 52 when it is whole. */
export function euro(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return Number.isInteger(rounded) ? fmt(rounded) : fmt(rounded, 2).replace(/,(\d)$/, ",$10");
}

/** Where both tariffs cost the same: x and the cost, or why there is no such x. */
export function breakEven(v: LabValues): { x: number; cost: number } | "keiner" | "immer" {
  if (Math.abs(v.m1 - v.m2) < 1e-12) return Math.abs(v.t1 - v.t2) < 1e-12 ? "immer" : "keiner";
  const x = (v.t1 - v.t2) / (v.m2 - v.m1);
  return { x, cost: v.t1 + v.m1 * x };
}

function linearModel(v: LabValues): string {
  const plot = tariffPlot();
  const A = (x: number) => v.t1 + v.m1 * x;
  const B = (x: number) => v.t2 + v.m2 * x;
  let out = open("Zwei Tarife als Geraden: Kosten in Euro über der Strecke in Kilometern, mit Schnittpunkt");
  out += plot.clip("clip-lm") + axesXY(plot, 50, 25, 100, 50, "km", "€");
  let drawing = line(plot.X(0), plot.Y(A(0)), plot.X(TARIFF_MAX), plot.Y(A(TARIFF_MAX)), "lab-curve");
  drawing += line(plot.X(0), plot.Y(B(0)), plot.X(TARIFF_MAX), plot.Y(B(TARIFF_MAX)), "lab-curve-2");
  drawing += line(plot.X(v.x), plot.Y(0), plot.X(v.x), plot.Y(Math.max(A(v.x), B(v.x))), "lab-dashed");
  out += clipped("clip-lm", drawing);
  const be = breakEven(v);
  if (typeof be === "object" && be.x >= 0 && be.x <= TARIFF_MAX && plot.contains(be.x, be.cost)) {
    const S = plot.P(be.x, be.cost);
    out += line(S.x, S.y, S.x, plot.Y(0), "lab-dashed");
    out += circle(S.x, S.y, 6, "lab-point-ok");
    out += boxedText(plot, S.x, S.y - 12, `${fmt(be.x, 1)} km`, "lab-text-small lab-text-ok");
  }
  for (const [value, cls] of [
    [A(v.x), "lab-point-a"],
    [B(v.x), "lab-point-b"],
  ] as const) {
    if (plot.contains(v.x, value)) out += circle(plot.X(v.x), plot.Y(value), 5, cls);
  }
  const cheaper = Math.abs(A(v.x) - B(v.x)) < 1e-9 ? "beide gleich teuer" : A(v.x) < B(v.x) ? `A ist ${euro(B(v.x) - A(v.x))} € billiger` : `B ist ${euro(A(v.x) - B(v.x))} € billiger`;
  const lines: PanelLine[] = [
    ["Tarif A", "lab-text lab-text-a"],
    [`${euro(v.t1)} € + ${euro(v.m1)} € je km`, "lab-text-small"],
    ["Tarif B", "lab-text lab-text-b"],
    [`${euro(v.t2)} € + ${euro(v.m2)} € je km`, "lab-text-small"],
    ["", ""],
    [`Strecke x = ${fmt(v.x)} km:`, "lab-text-muted"],
    [`A: ${euro(A(v.x))} €`, "lab-text lab-text-a"],
    [`B: ${euro(B(v.x))} €`, "lab-text lab-text-b"],
    [cheaper, "lab-text-small"],
    ["", ""],
    ["Gleich teuer:", "lab-text-muted"],
  ];
  if (be === "immer") lines.push(["bei jeder Strecke", "lab-text lab-text-ok"]);
  else if (be === "keiner") lines.push(["nie (parallele Geraden)", "lab-text"]);
  else if (be.x < 0) lines.push([`erst bei x = ${fmt(be.x, 1)} km,`, "lab-text-small"], ["also nie", "lab-text"]);
  else lines.push([`bei ${fmt(be.x, 1)} km: ${euro(be.cost)} €`, "lab-text lab-text-ok"]);
  out += sidePanel(lines);
  const handleAt = (id: string, x: number, y: number, label: string, cls: string) => (plot.contains(x, y) ? handle(id, plot.X(x), plot.Y(y), label, cls) : "");
  out += handleAt("A0", 0, v.t1, "Grundgebühr von Tarif A", "lab-handle lab-handle-a");
  out += handleAt("B0", 0, v.t2, "Grundgebühr von Tarif B", "lab-handle lab-handle-b");
  out += handleAt("A1", TARIFF_MAX, A(TARIFF_MAX), "Preis je km von Tarif A", "lab-handle lab-handle-a");
  out += handleAt("B1", TARIFF_MAX, B(TARIFF_MAX), "Preis je km von Tarif B", "lab-handle lab-handle-b");
  out += handle("X", plot.X(v.x), plot.Y(0), "Strecke x");
  out += `</svg>`;
  return out;
}

// ─── 6.10 Flächen mit Determinanten ────────────────────────────────────────

export interface Vec {
  x: number;
  y: number;
}

/** The two-row determinant det(a, b) = a_x · b_y − a_y · b_x. */
export const det = (a: Vec, b: Vec): number => a.x * b.y - a.y * b.x;

/** The triangle of the area lab for the slider x: A, B (or Bₙ) and Cₙ. */
export function areaTriangle(v: LabValues): { A: Vec; B: Vec; C: Vec } {
  if (v.fig === 1) return { A: { x: -2, y: -1 }, B: { x: v.x, y: 0 }, C: { x: v.x, y: -0.5 * v.x + 4 } };
  return { A: { x: -6, y: 2 }, B: { x: 2, y: 0 }, C: { x: v.x, y: 0.5 * v.x + 2 } };
}

/** det(AB→, ACₙ→) of the area lab. */
export function areaDet(v: LabValues): number {
  const { A, B, C } = areaTriangle(v);
  return det({ x: B.x - A.x, y: B.y - A.y }, { x: C.x - A.x, y: C.y - A.y });
}

const areaPlot = () => new Plot(-7, 9, -4, 12, SQUARE_BOX);

const n1 = (value: number): string => value.toFixed(1);

/** A thin line with its own stroke width, for brackets and small arrows. */
function thin(x1: number, y1: number, x2: number, y2: number, cls: string, width = 1.2): string {
  return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${cls}" style="stroke-width:${width}" />`;
}

/** A vector name with a small arrow above it; returns the drawing and its width. */
function svgName(x: number, baseline: number, name: string, cls: string): { svg: string; w: number } {
  const w = name.length * (cls.includes("small") ? 7 : 8.4);
  const y = baseline - (cls.includes("small") ? 11 : 13);
  const stroke = cls.includes("lab-text-a") ? "lab-side-a" : cls.includes("lab-text-b") ? "lab-side-b" : "lab-ink";
  const svg = text(x, baseline, name, cls) + thin(x + 0.5, y, x + w, y, stroke) + thin(x + w - 3.5, y - 2.5, x + w, y, stroke) + thin(x + w - 3.5, y + 2.5, x + w, y, stroke);
  return { svg, w: w + 2 };
}

/** Round brackets, or the straight bars of a determinant, around a block from y0 to y1. */
function brackets(x0: number, x1: number, y0: number, y1: number, straight = false): string {
  if (straight) return thin(x0 + 2, y0, x0 + 2, y1, "lab-ink") + thin(x1 - 2, y0, x1 - 2, y1, "lab-ink");
  const mid = (y0 + y1) / 2;
  const curve = (x: number, bulge: number) => `<path d="M${n1(x + bulge)} ${n1(y0)} Q${n1(x - bulge)} ${n1(mid)} ${n1(x + bulge)} ${n1(y1)}" class="lab-ink" style="stroke-width:1.2;fill:none" />`;
  return curve(x0 + 2, 2.5) + curve(x1 - 2, -2.5);
}

/** One piece of an equation in the side panel: text, a vector name, a column or a 2×2 determinant. */
type Piece = { t: string; cls?: string } | { n: string; cls?: string } | { v: [string, string]; cls?: string } | { m: [string, string, string, string]; cls?: string };

/** An equation laid out from left to right around the middle line y. */
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
      out += brackets(cx, cx + w, y - 14, y + 17, true);
      cx += w + 3;
    }
  }
  return out;
}

/** A vector arrow in SVG units with a filled head. */
function vArrow(from: Pt, to: Pt, tone: "a" | "b"): string {
  return toneArrow(from.x, from.y, to.x, to.y, tone, 2.6);
}

/** The area term A(x) of the figure, valid where the vertices run against the clock. */
export const AREA_TERMS = ["A(x) = (3x + 6) FE", "A(x) = (−0,25x² + 1,5x + 4) FE"];

function determinantArea(v: LabValues): string {
  const plot = areaPlot();
  const { A, B, C } = areaTriangle(v);
  const u = { x: B.x - A.x, y: B.y - A.y };
  const w = { x: C.x - A.x, y: C.y - A.y };
  const D = det(u, w);
  const area = Math.abs(D) / 2;
  const [Ap, Bp, Cp] = [A, B, C].map((p) => plot.P(p.x, p.y));
  let out = open("Dreiecke mit einem Eckpunkt auf einer Geraden und ihr Flächeninhalt mit der Determinante");
  out += plot.clip("clip-da") + plot.grid(1, 2);
  let drawing = "";
  if (v.fig === 0) drawing += plot.lineThrough(0.5, 2, "lab-ghost") + plot.lineThrough(-0.25, 0.5, "lab-thin");
  else drawing += plot.lineThrough(-0.5, 4, "lab-ghost");
  drawing += polygon([Ap, Bp, Cp], D === 0 ? "lab-ghost" : "lab-fill-a");
  out += clipped("clip-da", drawing);
  out += vArrow(Ap, Bp, "a") + vArrow(Ap, Cp, "b");
  if (v.fig === 0) out += text(plot.X(7.2), plot.Y(0.5 * 7.2 + 2) - 8, "g", "lab-text lab-text-muted", "end");
  else out += text(plot.X(-5.5), plot.Y(-0.5 * -5.5 + 4) - 8, "h", "lab-text lab-text-muted", "start");
  const names = v.fig === 0 ? ["A", "B", "Cₙ"] : ["A", "Bₙ", "Cₙ"];
  for (const P of [Ap, Bp, Cp]) out += circle(P.x, P.y, 4.5, "lab-point");
  out += pointLabel(plot, Ap, names[0], "lab-text", -18, 5);
  out += pointLabel(plot, Bp, names[1], "lab-text", 9, v.fig === 1 ? 16 : 16);
  out += pointLabel(plot, Cp, names[2], "lab-text lab-text-b", 10, -10);
  // the calculation in the panel
  const PX = SQUARE_PANEL.x + 8;
  let panel = rect(SQUARE_PANEL.x, SQUARE_PANEL.y, SQUARE_PANEL.w, SQUARE_PANEL.h, "lab-panel", 'rx="10"');
  panel += text(PX, 32, v.fig === 0 ? "Dreiecke ABCₙ" : "Dreiecke ABₙCₙ", "lab-text-muted");
  panel += equation(PX, 64, [{ n: v.fig === 0 ? "AB" : "ABₙ", cls: "lab-text-small lab-text-a" }, { t: "=", cls: "lab-text-small" }, { v: [fmt(u.x), fmt(u.y)], cls: "lab-text-small lab-text-a" }]);
  panel += equation(PX + 88, 64, [{ n: "ACₙ", cls: "lab-text-small lab-text-b" }, { t: "=", cls: "lab-text-small" }, { v: [fmt(w.x), fmt(w.y)], cls: "lab-text-small lab-text-b" }]);
  panel += equation(PX, 112, [{ t: "det = ", cls: "lab-text-small" }, { m: [fmt(u.x), fmt(w.x), fmt(u.y), fmt(w.y)], cls: "lab-text-small" }]);
  const par = (z: number) => (z < 0 ? `(${fmt(z)})` : fmt(z));
  panel += text(PX, 148, `= ${par(u.x)} · ${par(w.y)} − ${par(u.y)} · ${par(w.x)}`, "lab-text-small");
  panel += text(PX, 166, `= ${fmt(D)}`, "lab-text-small");
  panel += text(PX, 190, `A = ½ · ${fmt(Math.abs(D))} = ${fmt(area)} FE`, D === 0 ? "lab-text lab-text-bad" : "lab-text lab-text-ok");
  panel += text(PX, 210, D > 0 ? "det > 0: gegen den Uhrzeiger" : D < 0 ? "det < 0: im Uhrzeigersinn" : "det = 0: alle auf einer Geraden", "lab-text-small");
  panel += text(PX, 230, AREA_TERMS[v.fig].replace(" FE", ""), "lab-text-small lab-text-a");
  // a small graph of A(x) over the slider range
  const mini = new Plot(-6, 8, 0, v.fig === 0 ? 30 : 15, { x: PX + 4, y: 242, w: SQUARE_PANEL.w - 26, h: 74 });
  panel += rect(mini.box.x, mini.box.y, mini.box.w, mini.box.h, "lab-plot-bg");
  panel += line(mini.X(0), mini.box.y, mini.X(0), mini.box.y + mini.box.h, "lab-grid");
  panel += branch(mini, (x) => areaOf({ ...v, x }), -6, 8, "lab-curve", 112);
  panel += circle(mini.X(v.x), mini.Y(area), 3.5, "lab-point-ok");
  panel += text(mini.box.x + 4, mini.box.y + 11, "A(x)", "lab-text-small");
  panel += text(mini.box.x + mini.box.w - 4, mini.box.y + mini.box.h - 4, "x", "lab-text-small", "end");
  out += panel;
  out += handle("C", Cp.x, Cp.y, v.fig === 0 ? "Punkt Cₙ auf g: x" : "Punkt Cₙ auf h: x", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

/** The area of the lab's triangle in FE. */
export function areaOf(v: LabValues): number {
  return Math.abs(areaDet(v)) / 2;
}

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
  "line-from-points": {
    render: lineFromPoints,
    handles: {
      P: { x: "px", y: "py", drag: (p) => ({ px: squarePlot().invX(p.x), py: squarePlot().invY(p.y) }) },
      Q: { x: "qx", y: "qy", drag: (p) => ({ qx: squarePlot().invX(p.x), qy: squarePlot().invY(p.y) }) },
    },
  },
  "parallel-family": {
    render: parallelFamily,
    handles: {
      T: { y: "t", drag: (p) => ({ t: squarePlot().invY(p.y) }) },
      P: { x: "px", y: "py", drag: (p) => ({ px: squarePlot().invX(p.x), py: squarePlot().invY(p.y) }) },
    },
  },
  "linear-model": {
    render: linearModel,
    handles: {
      A0: { y: "t1", drag: (p) => ({ t1: tariffPlot().invY(p.y) }) },
      B0: { y: "t2", drag: (p) => ({ t2: tariffPlot().invY(p.y) }) },
      A1: { y: "m1", drag: (p, v) => ({ m1: (tariffPlot().invY(p.y) - v.t1) / TARIFF_MAX }) },
      B1: { y: "m2", drag: (p, v) => ({ m2: (tariffPlot().invY(p.y) - v.t2) / TARIFF_MAX }) },
      X: { x: "x", drag: (p) => ({ x: tariffPlot().invX(p.x) }) },
    },
  },
  "determinant-area": {
    render: determinantArea,
    handles: {
      C: { x: "x", drag: (p) => ({ x: areaPlot().invX(p.x) }) },
    },
  },
};
