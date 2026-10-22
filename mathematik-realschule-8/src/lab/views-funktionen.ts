import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import { arrow, circle, clamp, clipped, handle, type LabView, line, open, path, Plot, polygon, type Pt, r1, rect, text } from "./svg";

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
  "origin-line": placeholder,
  perpendicular: placeholder,
  "line-mx-t": placeholder,
  "line-from-points": placeholder,
  "parallel-family": placeholder,
  "linear-model": placeholder,
  "determinant-area": placeholder,
};
