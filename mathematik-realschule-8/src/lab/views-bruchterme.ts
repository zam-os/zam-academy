import { fmt, fracText, paren, sum } from "../exercises/format";
import type { LabValues } from "../model/types";
import { arrow, circle, clamp, clipped, handle, type LabView, line, open, path, Plot, polygon, type Pt, r1, rect, text } from "./svg";

// ─── Numbers, terms and sets ───────────────────────────────────────────────

const MINUS = "−";

/** True when a value has at most two decimals, so fmt() shows it exactly. */
export const exact2 = (value: number): boolean => Math.abs(value * 100 - Math.round(value * 100)) < 1e-9;

/** A number the way the board writes it: 2,5 or, when the decimal does not end, 2/3. */
export function numText(value: number): string {
  if (exact2(value)) return fmt(value, 2);
  for (let d = 3; d <= 24; d++) {
    const n = value * d;
    if (Math.abs(n - Math.round(n)) < 1e-9) return fracText(Math.round(n), d);
  }
  return fmt(value, 2);
}

/** A value with its relation sign: "= 1,5", or "≈ 1,33" when it is rounded. */
export const equalsText = (value: number): string => `${exact2(value) ? "=" : "≈"} ${fmt(value, 2)}`;

/** A set of excluded numbers as Bavaria writes it: "{−3; 2}". */
export function setText(values: number[]): string {
  return values.length === 0 ? "{ }" : `{${values.map((v) => numText(v)).join("; ")}}`;
}

/** "ℚ ∖ {−3; 2}", or "ℚ" when nothing is excluded. */
export function domainText(zeros: number[], G = "ℚ"): string {
  return zeros.length === 0 ? G : `${G} ∖ ${setText(zeros)}`;
}

/** "x − 2", "x + 3", "x": x + b. */
export const xPlus = (b: number): string => sum([[1, "x"], [b, ""]]);

/** "2x − 3": m·x + n. */
export const lin = (m: number, n: number): string => sum([[m, "x"], [n, ""]]);

/** Distinct values in increasing order, −0 as 0. */
export const sortedUnique = (values: number[]): number[] =>
  [...new Set(values.map((v) => Math.round(v * 1e9) / 1e9 + 0))].sort((a, b) => a - b);

/** A polynomial as coefficients from the constant up: [c₀, c₁, c₂, …]. */
export type Poly = number[];

export function polyMul(p: Poly, q: Poly): Poly {
  const out = new Array(p.length + q.length - 1).fill(0);
  p.forEach((a, i) => q.forEach((b, j) => (out[i + j] += a * b)));
  return out;
}

export const polyEval = (p: Poly, x: number): number => p.reduce((s, c, i) => s + c * x ** i, 0);

const POWERS = ["", "x", "x²", "x³", "x⁴"];

/** "2x² − 2x − 4", "0" for the zero polynomial. */
export function polyText(p: Poly): string {
  const parts: Array<[number, string]> = [];
  for (let i = p.length - 1; i >= 0; i--) parts.push([Math.round(p[i] * 1e9) / 1e9, POWERS[i]]);
  return sum(parts, 4);
}

// ─── SVG helpers ───────────────────────────────────────────────────────────

/** Rough width of one character of a lab text class. */
function charWidth(cls: string): number {
  return cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : cls.includes("muted") ? 6.7 : 7.3;
}

/** Text in the stage accent colour. */
function accentText(x: number, y: number, content: string, cls = "lab-text lab-text-big", anchor: "start" | "middle" | "end" = "start"): string {
  return text(x, y, content, cls, anchor).replace("<text ", '<text style="fill:var(--accent)" ');
}

/** The width of a stacked fraction in SVG. */
const fracWidth = (top: string, bottom: string, cls: string): number => Math.max(top.length, bottom.length) * charWidth(cls) + 8;

/** A stacked fraction in SVG with its bar at height y; returns the drawing and its width. */
function fracSvg(x: number, y: number, top: string, bottom: string, cls = "lab-text"): { svg: string; w: number } {
  const w = fracWidth(top, bottom, cls);
  const svg =
    text(x + w / 2, y - 5, top, cls, "middle") +
    `<line x1="${r1(x)}" y1="${r1(y)}" x2="${r1(x + w)}" y2="${r1(y)}" class="lab-ink" style="stroke-width:1.3" />` +
    text(x + w / 2, y + 15, bottom, cls, "middle");
  return { svg, w };
}

/** Background, grid and axes of a plot whose x and y steps differ. */
function axes(plot: Plot, xStep: number, yStep: number, yLabelEvery: number): string {
  const { box } = plot;
  let out = rect(box.x, box.y, box.w, box.h, "lab-plot-bg");
  for (let x = Math.ceil(plot.xmin / xStep) * xStep; x <= plot.xmax + 1e-9; x += xStep) out += line(plot.X(x), box.y, plot.X(x), box.y + box.h, "lab-grid");
  for (let y = Math.ceil(plot.ymin / yStep) * yStep; y <= plot.ymax + 1e-9; y += yStep) out += line(box.x, plot.Y(y), box.x + box.w, plot.Y(y), "lab-grid");
  const x0 = clamp(plot.X(0), box.x, box.x + box.w);
  const y0 = clamp(plot.Y(0), box.y, box.y + box.h);
  out += arrow(box.x, y0, box.x + box.w + 4, y0, "lab-axis", 1.4);
  out += arrow(x0, box.y + box.h, x0, box.y - 4, "lab-axis", 1.4);
  out += text(box.x + box.w - 4, y0 - 6, "x", "lab-text-axis", "end");
  out += text(x0 + 6, box.y + 10, "y", "lab-text-axis");
  for (let x = Math.ceil(plot.xmin); x <= plot.xmax - 0.4; x++) if (x !== 0) out += text(plot.X(x), y0 + 13, fmt(x), "lab-text-tick", "middle");
  for (let y = Math.ceil(plot.ymin / yLabelEvery) * yLabelEvery; y <= plot.ymax - 0.5 * yLabelEvery + 1e-9; y += yLabelEvery) {
    if (Math.abs(y) > 1e-9) out += text(x0 - 5, plot.Y(y) + 4, fmt(y), "lab-text-tick", "end");
  }
  return out;
}

/** The graph of f between x0 and x1 as one path, its values clamped far outside the box; wrap it in clipped(). */
function branch(plot: Plot, f: (x: number) => number, x0: number, x1: number, cls: string, style = "", samples = 160): string {
  if (!(x1 > x0)) return "";
  const span = plot.ymax - plot.ymin;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const x = x0 + ((x1 - x0) * i) / samples;
    const y = f(x);
    if (!Number.isFinite(y)) continue;
    d += `${d ? "L" : "M"}${r1(plot.X(x))} ${r1(plot.Y(clamp(y, plot.ymin - span, plot.ymax + span)))} `;
  }
  return d ? path(d.trim(), cls, style) : "";
}

/** The pieces of a graph between the excluded numbers, a small gap around each. */
function graphPieces(plot: Plot, f: (x: number) => number, zeros: number[], cls: string, style: string): string {
  const cuts = [plot.xmin, ...zeros.filter((z) => z > plot.xmin && z < plot.xmax), plot.xmax];
  let out = "";
  for (let i = 0; i < cuts.length - 1; i++) {
    const lo = i === 0 ? cuts[i] : cuts[i] + 0.02;
    const hi = i === cuts.length - 2 ? cuts[i + 1] : cuts[i + 1] - 0.02;
    out += branch(plot, f, lo, hi, cls, style);
  }
  return out;
}

// ─── 5.1 Bruchterme ────────────────────────────────────────────────────────

/** The Nenner types of T₂ in the lab. */
export const T2_TYPES = ["a · x + c", "x² + 1", "x² − 4"];

/** T₁(x) = 6 : (x − b); NaN where it has no value. */
export const t1 = (v: LabValues, x: number): number => (x - v.b === 0 ? Number.NaN : 6 / (x - v.b));

/** The Nenner of T₂ at x. */
export function n2(v: LabValues, x: number): number {
  if (v.typ === 1) return x * x + 1;
  if (v.typ === 2) return x * x - 4;
  return v.a * x + v.c;
}

/** True when the Nenner of T₂ is 0 for every x (a = c = 0). */
export const n2Vanishes = (v: LabValues): boolean => v.typ === 0 && v.a === 0 && v.c === 0;

/** True when T₂ has a variable in its Nenner, so it is a Bruchterm. */
export const t2IsFraction = (v: LabValues): boolean => v.typ !== 0 || v.a !== 0;

/** T₂(x) = (x + 1) : N₂(x); NaN where it has no value. */
export function t2(v: LabValues, x: number): number {
  const n = n2(v, x);
  return Math.abs(n) < 1e-12 ? Number.NaN : (x + 1) / n;
}

/** The numbers the Nenner of T₂ excludes. */
export function t2Zeros(v: LabValues): number[] {
  if (v.typ === 1) return [];
  if (v.typ === 2) return [-2, 2];
  if (v.a === 0) return [];
  return [-v.c / v.a + 0];
}

/** "T₂(x) = (x + 1) : (2x − 3)" as plain text. */
export function t2Text(v: LabValues): string {
  if (v.typ === 1) return "(x + 1) : (x² + 1)";
  if (v.typ === 2) return "(x + 1) : (x² − 4)";
  if (v.a === 0) return `(x + 1) : ${paren(v.c)}`;
  return `(x + 1) : (${lin(v.a, v.c)})`;
}

const t2Denominator = (v: LabValues): string => (v.typ === 1 ? "x² + 1" : v.typ === 2 ? "x² − 4" : v.a === 0 ? fmt(v.c) : lin(v.a, v.c));

/** The Definitionsmenge of T₂ in words. */
export function t2Domain(v: LabValues): string {
  if (n2Vanishes(v)) return "D₂ = { }: Der Nenner ist immer 0.";
  if (!t2IsFraction(v)) return "D₂ = ℚ, aber T₂ ist kein Bruchterm: Im Nenner steht keine Variable.";
  return `D₂ = ${domainText(t2Zeros(v))}`;
}

/** A value of a term for the lab: the number, or why there is none. */
export function valueText(name: string, x: number, value: number): string {
  if (Number.isNaN(value)) return `${name}(${fmt(x)}): kein Wert, der Nenner ist 0`;
  return `${name}(${fmt(x)}) ${exact2(value) ? "=" : "≈"} ${fmt(value, 2)}`;
}

const T_BOX = { x: 20, y: 14, w: 300, h: 312 };
const T_PANEL = { x: 328, y: 14, w: 184, h: 312 };
const termPlot = () => new Plot(-5.5, 5.5, -8, 8, T_BOX);
/** Where the handle of x sits: in the strip below the graphs. */
const X_HANDLE_Y = -7.2;

function fractionTermView(v: LabValues): string {
  const plot = termPlot();
  const zeros1 = [v.b];
  const zeros2 = n2Vanishes(v) ? [] : t2Zeros(v);
  let out = open("Zwei Bruchterme als Punkte und Graphen; an den ausgeschlossenen Zahlen haben sie keinen Wert");
  out += plot.clip("clip-br1") + axes(plot, 1, 2, 4);

  // the excluded numbers: a dashed line and a hollow circle on the x-axis
  const marks = sortedUnique([...zeros1, ...zeros2]).filter((z) => z > plot.xmin && z < plot.xmax);
  marks.forEach((z, i) => {
    out += line(plot.X(z), plot.box.y, plot.X(z), plot.box.y + plot.box.h, "lab-dashed");
    const both = zeros1.includes(z) && zeros2.some((w) => Math.abs(w - z) < 1e-9);
    const cls = both ? "lab-text-small" : zeros1.includes(z) ? "lab-text-small lab-text-a" : "lab-text-small lab-text-b";
    out += text(clamp(plot.X(z) + 4, plot.box.x + 4, plot.box.x + plot.box.w - 60), plot.box.y + 14 + 14 * (i % 2), `x = ${numText(z)}${both ? " (beide)" : ""}`, cls);
  });

  // the graphs, thin, and the values of the table at the whole numbers
  let graphs = graphPieces(plot, (x) => t1(v, x), zeros1, "lab-side-a", 'style="stroke-width:2;opacity:0.75"');
  if (!n2Vanishes(v)) graphs += graphPieces(plot, (x) => t2(v, x), zeros2, "lab-side-b", 'style="stroke-width:2;opacity:0.75"');
  for (let x = -5; x <= 5; x++) {
    const y1 = t1(v, x);
    const y2 = t2(v, x);
    if (Number.isFinite(y1)) graphs += circle(plot.X(x), plot.Y(y1), 3.2, "lab-point-a");
    if (Number.isFinite(y2)) graphs += circle(plot.X(x), plot.Y(y2), 3.2, "lab-point-b");
  }
  out += clipped("clip-br1", graphs);
  marks.forEach((z) => (out += circle(plot.X(z), plot.Y(0), 4.5, "lab-ghost")));

  // the chosen x
  const X = plot.X(v.x);
  out += line(X, plot.box.y, X, plot.box.y + plot.box.h, "lab-thin");
  const values: Array<[number, string, string]> = [
    [t1(v, v.x), "lab-point-a", "a"],
    [n2Vanishes(v) ? Number.NaN : t2(v, v.x), "lab-point-b", "b"],
  ];
  values.forEach(([y, cls, tone], i) => {
    if (Number.isNaN(y)) {
      out += text(X, plot.Y(0) - 8 - 14 * i, "✗", `lab-text lab-text-bad`, "middle");
      return;
    }
    if (y > plot.ymax || y < plot.ymin) {
      const edge = y > plot.ymax ? plot.box.y + 8 : plot.box.y + plot.box.h - 28;
      out += text(X + (tone === "a" ? -6 : 6), edge, y > 0 ? "↑" : "↓", `lab-text lab-text-${tone}`, tone === "a" ? "end" : "start");
      return;
    }
    out += circle(X, plot.Y(y), 6, cls);
  });
  out += handle("x", X, plot.Y(X_HANDLE_Y), "Stelle x");

  // the side panel: the two terms and a value table around x
  const P = T_PANEL;
  let px = P.x + 8;
  out += rect(P.x, P.y, P.w, P.h, "lab-panel", 'rx="10"');
  out += text(px, 46, "T₁ =", "lab-text lab-text-a");
  out += fracSvg(px + 34, 41, "6", xPlus(-v.b), "lab-text").svg;
  out += text(px, 92, "T₂ =", "lab-text lab-text-b");
  out += fracSvg(px + 34, 87, "x + 1", t2Denominator(v), "lab-text").svg;
  const cols = [P.x + 10, P.x + 62, P.x + 124];
  let y = 128;
  out += text(cols[0], y, "x", "lab-text-muted") + text(cols[1], y, "T₁(x)", "lab-text-muted lab-text-a") + text(cols[2], y, "T₂(x)", "lab-text-muted lab-text-b");
  out += line(P.x + 6, y + 6, P.x + P.w - 6, y + 6, "lab-thin");
  for (const dx of [-1, -0.5, 0, 0.5, 1]) {
    y += 19;
    const x = v.x + dx;
    if (dx === 0) out += rect(P.x + 4, y - 14, P.w - 8, 19, "lab-cell-sum", 'rx="4"');
    const cell = (value: number) => (Number.isNaN(value) ? ["kein Wert", "lab-text-small lab-text-bad"] : [fmt(value, 2), "lab-text-small"]);
    const [c1, k1] = cell(t1(v, x));
    const [c2, k2] = cell(n2Vanishes(v) ? Number.NaN : t2(v, x));
    out += text(cols[0], y, fmt(x, 1), "lab-text-small") + text(cols[1], y, c1, k1) + text(cols[2], y, c2, k2);
  }
  out += text(px, y + 18, "Werte auf 2 Dezimalen gerundet", "lab-text-small");
  out += text(px, 264, `D₁ = ${domainText(zeros1)}`, "lab-text-small lab-text-a");
  out += text(px, 282, n2Vanishes(v) ? "D₂ = { }" : t2IsFraction(v) ? `D₂ = ${domainText(zeros2)}` : "D₂ = ℚ: kein Bruchterm", "lab-text-small lab-text-b");
  px = P.x + 8;
  out += text(px, 312, "Ziehe x unten im Bild.", "lab-text-small");
  out += "</svg>";
  return out;
}

// ─── 5.2 Die Definitionsmenge bestimmen ────────────────────────────────────

export const FACTOR_TYPES = ["kein Faktor", "(x − a)", "x²", "(x² + 1)"];

/** The factor polynomial of a slot: (x − a), x², x² + 1, or 1 for none. */
function factorPoly(type: number, a: number): Poly {
  if (type === 1) return [-a + 0, 1];
  if (type === 2) return [0, 0, 1];
  if (type === 3) return [1, 0, 1];
  return [1];
}

function factorText(type: number, a: number): string {
  if (type === 1) return a === 0 ? "x" : `(${xPlus(-a)})`;
  if (type === 2) return "x²";
  if (type === 3) return "(x² + 1)";
  return "";
}

/** The Nenner of the builder as a polynomial. */
export const builderPoly = (v: LabValues): Poly => polyMul(polyMul([v.k], factorPoly(v.f1, v.a1)), factorPoly(v.f2, v.a2));

/** The numbers the built Nenner excludes, in increasing order. */
export function builderZeros(v: LabValues): number[] {
  const zeros: number[] = [];
  for (const [type, a] of [
    [v.f1, v.a1],
    [v.f2, v.a2],
  ]) {
    if (type === 1) zeros.push(a);
    if (type === 2) zeros.push(0);
  }
  return sortedUnique(zeros);
}

/** True when the built Nenner contains x. */
export const builderHasX = (v: LabValues): boolean => v.f1 !== 0 || v.f2 !== 0;

/** "2(x − 2)(x + 1)", "2x(x − 4)", "x²(x² + 1)", "x − 2", "3": the product as the board writes it. */
export function builderText(v: LabValues): string {
  const factors = [factorText(v.f1, v.a1), factorText(v.f2, v.a2)].filter(Boolean);
  if (factors.length === 0) return fmt(v.k);
  // a single bracket needs no brackets: "x − 2", "x² + 1"
  if (factors.length === 1 && v.k === 1 && factors[0].startsWith("(")) return factors[0].slice(1, -1);
  // a bare x or x² goes first: "x(x − 4)", never "(x − 4)x"; and x before x²
  const bare = (t: string) => !t.startsWith("(");
  factors.sort((p, q) => Number(!bare(p)) - Number(!bare(q)) || (bare(p) && bare(q) ? p.length - q.length : 0));
  const body = factors.join(factors.length === 2 && !factors[0].startsWith("(") && !factors[1].startsWith("(") ? " · " : "");
  return `${v.k === 1 ? "" : v.k === -1 ? MINUS : fmt(v.k)}${body}`;
}

/** One line per factor: when is it 0? */
function factorLines(type: number, a: number): string[] {
  if (type === 1) return a === 0 ? ["x = 0"] : [`${xPlus(-a)} = 0  ⇔  x = ${numText(a)}`];
  if (type === 2) return ["x² = 0  ⇔  x = 0"];
  if (type === 3) return ["x² + 1 = 0 hat keine Lösung, denn x² + 1 ≥ 1"];
  return [];
}

function domainView(v: LabValues): string {
  const zeros = builderZeros(v);
  const hasX = builderHasX(v);
  let out = open("Ein Nenner aus Faktoren, seine Nullstellen auf der Zahlengerade und die Definitionsmenge");
  out += rect(10, 10, 500, 236, "lab-panel", 'rx="10"');
  out += text(24, 50, "T(x) =", "lab-text lab-text-big");
  out += fracSvg(88, 44, "5", builderText(v), "lab-text lab-text-big").svg;
  out += text(24, 92, `Nenner ausmultipliziert: N(x) = ${polyText(builderPoly(v))}`, "lab-text");
  out += text(24, 122, "Nenner gleich 0 setzen:", "lab-text-muted");
  const lines: Array<[string, string]> = [];
  if (!hasX) {
    lines.push([`N(x) = ${fmt(v.k)} ist nie 0.`, "lab-text"]);
    lines.push(["Im Nenner steht keine Variable: kein Bruchterm.", "lab-text-small"]);
  } else {
    const both = v.f1 !== 0 && v.f2 !== 0;
    // a single factor without a number before it is solved in its own line
    if (both || v.k !== 1) lines.push([`${builderText(v)} = 0`, "lab-text"]);
    if (both) lines.push(["Ein Produkt ist 0, wenn ein Faktor 0 ist:", "lab-text-small"]);
    else if (v.k !== 1) lines.push([`Der Zahlfaktor ${fmt(v.k)} ist nie 0:`, "lab-text-small"]);
    for (const [type, a] of [
      [v.f1, v.a1],
      [v.f2, v.a2],
    ]) {
      for (const l of factorLines(type, a)) lines.push([l, "lab-text"]);
    }
  }
  lines.slice(0, 5).forEach(([content, cls], i) => (out += text(36, 144 + 20 * i, content, cls)));
  // the Definitionsmenge, big
  out += text(350, 122, "Definitionsmenge:", "lab-text-muted");
  out += accentText(350, 150, `D = ${domainText(zeros)}`);
  out += text(350, 172, zeros.length === 0 ? "Keine Zahl fällt weg." : zeros.length === 1 ? "Eine Zahl fällt weg." : `${zeros.length} Zahlen fallen weg.`, "lab-text-small");

  // the number line from −6 to 6: D thick, the excluded numbers as holes
  const NL = { x0: 34, x1: 486, y: 284, lo: -6, hi: 6 };
  const X = (t: number) => NL.x0 + ((t - NL.lo) / (NL.hi - NL.lo)) * (NL.x1 - NL.x0);
  out += line(NL.x0 - 10, NL.y, NL.x1 + 10, NL.y, "lab-axis");
  out += line(NL.x0, NL.y, NL.x1, NL.y, "lab-side-ok");
  for (let t = NL.lo; t <= NL.hi; t++) {
    out += line(X(t), NL.y - 5, X(t), NL.y + 5, "lab-thin");
    out += text(X(t), NL.y + 20, fmt(t), "lab-text-tick", "middle");
  }
  for (const z of zeros) {
    if (z < NL.lo || z > NL.hi) continue;
    out += circle(X(z), NL.y, 6, "lab-panel") + `<circle cx="${r1(X(z))}" cy="${NL.y}" r="6" class="lab-bad-stroke" style="fill:none;stroke-width:2.2" />`;
    out += text(X(z), NL.y - 12, numText(z), "lab-text-small lab-text-bad", "middle");
  }
  out += text(NL.x0 - 10, NL.y + 42, "Grün: Zahlen, die du einsetzen darfst; Kreise: ausgeschlossen.", "lab-text-small");
  out += "</svg>";
  return out;
}

// ─── 5.3 Verhältnisgleichungen ─────────────────────────────────────────────

/** The two sides a : (x + b) and c : (x + d) at x; NaN where a Nenner is 0. */
export function sides(v: LabValues, x = v.x): { left: number; right: number } {
  return { left: x + v.b === 0 ? Number.NaN : v.a / (x + v.b), right: x + v.d === 0 ? Number.NaN : v.c / (x + v.d) };
}

export interface ProportionSolution {
  /** The excluded numbers −b and −d, increasing. */
  excluded: number[];
  /** 0: one candidate x0; 1: no x-term and no solution; 2: both sides the same term. */
  kind: number;
  /** The x the cross product gives (kind 0). */
  x0: number;
  /** True when that candidate is an excluded number, so L = { }. */
  excludedCandidate: boolean;
}

/** a · (x + d) = c · (x + b) ⇔ (a − c) · x = c · b − a · d. */
export function solveProportion(v: LabValues): ProportionSolution {
  const excluded = sortedUnique([-v.b, -v.d]);
  const A = v.a - v.c;
  const B = v.c * v.b - v.a * v.d;
  if (A === 0) return { excluded, kind: B === 0 ? 2 : 1, x0: Number.NaN, excludedCandidate: false };
  const x0 = B / A + 0;
  return { excluded, kind: 0, x0, excludedCandidate: excluded.some((e) => Math.abs(e - x0) < 1e-9) };
}

/** The Lösungsmenge in the Bavarian notation. */
export function solutionSet(v: LabValues): string {
  const s = solveProportion(v);
  if (s.kind === 1) return "L = { }";
  if (s.kind === 2) return `L = D = ${domainText(s.excluded)}`;
  return s.excludedCandidate ? "L = { }" : `L = {${numText(s.x0)}}`;
}

/** "6 : (x − 2) = 4 : (x + 1)". */
export const proportionText = (v: LabValues): string => `${paren(v.a)} : (${xPlus(v.b)}) = ${paren(v.c)} : (${xPlus(v.d)})`;

/** "6(x + 1) = 4(x − 2)": the equation after multiplying with the Hauptnenner. */
export function crossText(v: LabValues): string {
  const factor = (k: number, b: number) => (b === 0 ? `${fmt(k)}x` : k === 1 ? `(${xPlus(b)})` : k === -1 ? `${MINUS}(${xPlus(b)})` : `${fmt(k)}(${xPlus(b)})`);
  return `${factor(v.a, v.d)} = ${factor(v.c, v.b)}`;
}

/** The balance: equal, which side is heavier, or a side without a value. */
export function balanceText(v: LabValues): string {
  const { left, right } = sides(v);
  if (Number.isNaN(left) || Number.isNaN(right)) return `Für x = ${fmt(v.x)} hat ${Number.isNaN(left) && Number.isNaN(right) ? "keine Seite" : Number.isNaN(left) ? "die linke Seite" : "die rechte Seite"} einen Wert: Der Nenner ist 0.`;
  if (Math.abs(left - right) < 1e-9) return `Gleichgewicht: Beide Seiten haben den Wert ${numText(left)}.`;
  return left > right ? "Die linke Seite ist größer." : "Die rechte Seite ist größer.";
}

function proportionView(v: LabValues): string {
  const { left, right } = sides(v);
  const defined = !Number.isNaN(left) && !Number.isNaN(right);
  const s = solveProportion(v);
  let out = open("Eine Waage mit zwei Bruchtermen, darunter die Zahlengerade für x");
  out += rect(10, 10, 320, 252, "lab-plot-bg", 'rx="10"');
  // the beam tilts towards the larger side, at most 12°
  const pivot = { x: 172, y: 92 };
  const tilt = defined ? clamp(Math.atan(left - right) * (12 / (Math.PI / 2)), -12, 12) : 0;
  const rad = (tilt * Math.PI) / 180;
  const half = 110;
  const L = { x: pivot.x - half * Math.cos(rad), y: pivot.y + half * Math.sin(rad) };
  const R = { x: pivot.x + half * Math.cos(rad), y: pivot.y - half * Math.sin(rad) };
  out += polygon([{ x: pivot.x, y: pivot.y }, { x: pivot.x - 16, y: 242 }, { x: pivot.x + 16, y: 242 }], "lab-fulcrum");
  out += line(L.x, L.y, R.x, R.y, defined ? "lab-ink" : "lab-dashed");
  out += circle(pivot.x, pivot.y, 4, "lab-dot-small");
  const pan = (end: Pt, top: string, bottom: string, value: number, tone: string): string => {
    let svg = line(end.x, end.y, end.x - 46, end.y + 56, "lab-thin") + line(end.x, end.y, end.x + 46, end.y + 56, "lab-thin");
    svg += rect(end.x - 54, end.y + 56, 108, 64, Number.isNaN(value) ? "lab-cell" : `lab-fill-${tone}`, 'rx="6"');
    const cls = `lab-text lab-text-${tone}`;
    svg += fracSvg(end.x - fracWidth(top, bottom, cls) / 2, end.y + 82, top, bottom, cls).svg;
    svg += text(end.x, end.y + 114, Number.isNaN(value) ? "kein Wert" : equalsText(value), Number.isNaN(value) ? "lab-text-small lab-text-bad" : "lab-text-small", "middle");
    return svg;
  };
  out += pan(L, fmt(v.a), xPlus(v.b), left, "a");
  out += pan(R, fmt(v.c), xPlus(v.d), right, "b");
  out += text(172, 30, defined ? (Math.abs(left - right) < 1e-9 ? "Gleichgewicht" : left > right ? "links mehr" : "rechts mehr") : "eine Seite hat keinen Wert", defined && Math.abs(left - right) < 1e-9 ? "lab-text lab-text-ok" : defined ? "lab-text-muted" : "lab-text lab-text-bad", "middle");

  // the number line for x with the excluded numbers
  const NL = { x0: 30, x1: 314, y: 300, lo: -10, hi: 10 };
  const X = (t: number) => NL.x0 + ((t - NL.lo) / (NL.hi - NL.lo)) * (NL.x1 - NL.x0);
  out += line(NL.x0 - 6, NL.y, NL.x1 + 6, NL.y, "lab-axis");
  for (let t = NL.lo; t <= NL.hi; t += 2) {
    out += line(X(t), NL.y - 4, X(t), NL.y + 4, "lab-thin");
    out += text(X(t), NL.y + 18, fmt(t), "lab-text-tick", "middle");
  }
  for (const e of s.excluded) {
    if (e < NL.lo || e > NL.hi) continue;
    out += `<circle cx="${r1(X(e))}" cy="${NL.y}" r="5" class="lab-bad-stroke" style="fill:none;stroke-width:2" />`;
  }
  out += handle("x", X(v.x), NL.y, "Wert von x");
  out += text(NL.x0 - 8, NL.y - 14, `x = ${fmt(v.x)}`, "lab-text-small");

  // the side panel: D, the cross product and, when shown, the solution
  const PX = 342;
  out += text(PX, 30, `D = ${domainText(s.excluded)}`, "lab-text");
  out += text(PX, 58, "mit dem Hauptnenner", "lab-text-muted");
  out += text(PX, 76, "multipliziert:", "lab-text-muted");
  out += text(PX, 98, crossText(v), "lab-text");
  const crossLeft = v.a * (v.x + v.d);
  const crossRight = v.c * (v.x + v.b);
  out += text(PX, 124, `bei x = ${fmt(v.x)}: links ${fmt(crossLeft)}, rechts ${fmt(crossRight)}`, "lab-text-small");
  if (v.rechnung === 1) {
    const A = v.a - v.c;
    const B = v.c * v.b - v.a * v.d;
    out += text(PX, 156, `${sum([[A, "x"]]) === "0" ? "0 · x" : sum([[A, "x"]])} = ${fmt(B)}`, "lab-text");
    if (s.kind === 0) {
      out += text(PX, 178, `x = ${numText(s.x0)}`, "lab-text");
      out += text(PX, 204, s.excludedCandidate ? `${numText(s.x0)} ∉ D` : `${numText(s.x0)} ∈ D`, s.excludedCandidate ? "lab-text lab-text-bad" : "lab-text lab-text-ok");
    } else {
      out += text(PX, 178, s.kind === 1 ? "falsch für jedes x" : "wahr für jedes x aus D", s.kind === 1 ? "lab-text lab-text-bad" : "lab-text lab-text-ok");
    }
    out += accentText(PX, 236, solutionSet(v));
  } else {
    out += text(PX, 160, "Die Lösung ist verdeckt.", "lab-text-small");
    out += text(PX, 177, "Rechne erst selbst.", "lab-text-small");
  }
  out += text(PX, 300, "Ziehe x auf der Zahlengerade.", "lab-text-small");
  out += "</svg>";
  return out;
}

// ─── The views of the stage ────────────────────────────────────────────────

export const BRUCHTERME_VIEWS: Record<"fraction-term" | "domain" | "proportion-equation", LabView> = {
  "fraction-term": {
    render: fractionTermView,
    handles: { x: { x: "x", drag: (p) => ({ x: termPlot().invX(p.x) }) } },
  },
  domain: { render: domainView },
  "proportion-equation": {
    render: proportionView,
    handles: { x: { x: "x", drag: (p) => ({ x: -10 + ((p.x - 30) / (314 - 30)) * 20 }) } },
  },
};

