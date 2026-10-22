import { fmt } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  arrow,
  circle,
  clipped,
  esc,
  handle,
  infoBox,
  type LabView,
  line,
  open,
  path,
  Plot,
  type Pt,
  r1,
  rect,
  text,
} from "./svg";

// ─── Terms as the blackboard writes them ───────────────────────────────────
// Plain text (titles, readouts, goals) gets Unicode superscripts, HTML gets
// <sup>/<sub>, and the SVG drawings a small markup: ^{…} and _{…}.

const SUP: Record<string, string> = {
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
  "+": "⁺",
  "−": "⁻",
  "(": "⁽",
  ")": "⁾",
  x: "ˣ",
  t: "ᵗ",
  n: "ⁿ",
  " ": "",
};

const SUB: Record<string, string> = {
  "0": "₀",
  "1": "₁",
  "2": "₂",
  "3": "₃",
  "4": "₄",
  "5": "₅",
  "6": "₆",
  "7": "₇",
  "8": "₈",
  "9": "₉",
};

/** base^exponent as plain text: superscripts where every character has one ("3ˣ⁻¹"), else "3^(x : 2)". */
export function powText(base: string, exponent: string): string {
  const chars = [...exponent];
  return chars.every((ch) => ch in SUP) ? base + chars.map((ch) => SUP[ch]).join("") : `${base}^(${exponent})`;
}

/** "x − 2", "x + 1" or "x": the variable shifted by b. */
export function shiftedArg(b: number, variable = "x"): string {
  if (b === 0) return variable;
  return b > 0 ? `${variable} − ${fmt(b)}` : `${variable} + ${fmt(-b)}`;
}

/** " + 3", " − 2" or "": a constant added at the end of a term. */
export function plusConst(c: number, digits = 2): string {
  const rounded = Number(c.toFixed(digits));
  if (rounded === 0) return "";
  return rounded > 0 ? ` + ${fmt(rounded, digits)}` : ` − ${fmt(-rounded, digits)}`;
}

/** The factor in front of a power or logarithm: "", "−", "2 · ", "−0,5 · ". */
export function factorText(k: number): string {
  if (k === 1) return "";
  if (k === -1) return "−";
  return `${fmt(k)} · `;
}

/** k times a variable: "x", "−x", "2x". */
function times(k: number, variable: string): string {
  if (k === 1) return variable;
  if (k === -1) return `−${variable}`;
  return `${fmt(k)}${variable}`;
}

/** log to base a as plain text: lg, log₂, log₀,₅. */
export function logName(a: number): string {
  return a === 10 ? "lg" : `log${[...fmt(a)].map((ch) => SUB[ch] ?? ch).join("")}`;
}

/** log to base a as HTML. */
export function logNameHtml(a: number): string {
  return a === 10 ? "lg" : `log<sub>${fmt(a)}</sub>`;
}

/** log to base a in the SVG markup. */
function logNameSvg(a: number): string {
  return a === 10 ? "lg" : `log_{${fmt(a)}}`;
}

/** The argument of a logarithm: " x" or "(x − 2)". */
function logArg(b: number): string {
  return b === 0 ? " x" : `(${shiftedArg(b)})`;
}

/** k · a^(x − b) + c as plain text, e.g. "2 · 3ˣ⁻¹ − 4". */
export function expText(k: number, a: number, b = 0, c = 0, variable = "x"): string {
  return `${factorText(k)}${powText(fmt(a), shiftedArg(b, variable))}${plusConst(c)}`;
}

/** k · a^(x − b) + c as HTML, e.g. "2 · 3<sup>x − 1</sup> − 4". */
export function expHtml(k: number, a: number, b = 0, c = 0, variable = "x"): string {
  return `${factorText(k)}${fmt(a)}<sup>${shiftedArg(b, variable)}</sup>${plusConst(c)}`;
}

/** k · a^(x − b) + c in the SVG markup. */
export function expSvg(k: number, a: number, b = 0, c = 0, variable = "x"): string {
  return `${factorText(k)}${fmt(a)}^{${shiftedArg(b, variable)}}${plusConst(c)}`;
}

/** k · log_a(x − b) + c as plain text, e.g. "2 · log₃(x − 1) − 2". */
export function logText(k: number, a: number, b = 0, c = 0): string {
  return `${factorText(k)}${logName(a)}${logArg(b)}${plusConst(c)}`;
}

/** k · log_a(x − b) + c as HTML. */
export function logHtml(k: number, a: number, b = 0, c = 0): string {
  return `${factorText(k)}${logNameHtml(a)}${logArg(b)}${plusConst(c)}`;
}

/** k · log_a(x − b) + c in the SVG markup. */
function logSvg(k: number, a: number, b = 0, c = 0): string {
  return `${factorText(k)}${logNameSvg(a)}${logArg(b)}${plusConst(c)}`;
}

/** log to base a of x. */
export function logBase(a: number, x: number): number {
  return Math.log(x) / Math.log(a);
}

/** A table value: two decimals, three for small numbers. */
function fmtValue(value: number): string {
  return fmt(value, Math.abs(value) < 0.1 && value !== 0 ? 3 : 2);
}

// ─── SVG text with exponents and indices ───────────────────────────────────

/** Characters a reader sees, exponents and indices counted smaller. */
function visibleWidth(content: string): number {
  let width = 0;
  let small = false;
  for (let i = 0; i < content.length; i++) {
    const ch = content[i];
    if ((ch === "^" || ch === "_") && content[i + 1] === "{") {
      small = true;
      i++;
      continue;
    }
    if (ch === "}" && small) {
      small = false;
      continue;
    }
    width += small ? 0.72 : 1;
  }
  return width;
}

/** An SVG text line in which ^{…} is raised and _{…} lowered, e.g. "y = 2 · 3^{x − 1}" or "log_{2} x". */
function mtext(x: number, y: number, content: string, cls = "lab-text", anchor: "start" | "middle" | "end" = "start"): string {
  let out = `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">`;
  let offset = 0;
  let last = 0;
  for (const match of content.matchAll(/([\^_])\{([^}]*)\}/g)) {
    const at = match.index ?? 0;
    const before = content.slice(last, at);
    if (before) {
      out += `<tspan dy="${-offset}">${esc(before)}</tspan>`;
      offset = 0;
    }
    const target = match[1] === "^" ? -5 : 3;
    out += `<tspan dy="${target - offset}" font-size="72%">${esc(match[2])}</tspan>`;
    offset = target;
    last = at + match[0].length;
  }
  const rest = content.slice(last);
  if (rest || offset !== 0) out += `<tspan dy="${-offset}">${esc(rest)}</tspan>`;
  return `${out}</text>`;
}

function charWidth(cls: string): number {
  return cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : 7.3;
}

/** The size of a panel of text lines. */
function panelSize(lines: Array<[string, string]>): { w: number; h: number } {
  const shown = lines.filter(([content]) => content);
  return { w: Math.max(0, ...shown.map(([content, cls]) => visibleWidth(content) * charWidth(cls))) + 16, h: shown.length * 20 + 8 };
}

/** Lines with exponents on a soft panel; (x, y) is the baseline of the first line. */
function mathBox(x: number, y: number, lines: Array<[string, string]>): string {
  const shown = lines.filter(([content]) => content);
  if (shown.length === 0) return "";
  const { w, h } = panelSize(shown);
  let out = rect(x - 8, y - 17, w, h, "lab-panel", 'rx="8"');
  shown.forEach(([content, cls], i) => {
    out += mtext(x, y + i * 20, content, cls);
  });
  return out;
}

/** Points of a curve in SVG pixels, for finding a free corner. */
function samplePixels(plot: Plot, point: (u: number) => [number, number] | null, u0: number, u1: number, samples = 160): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i <= samples; i++) {
    const p = point(u0 + ((u1 - u0) * i) / samples);
    if (p && Number.isFinite(p[0]) && Number.isFinite(p[1])) out.push(plot.P(p[0], p[1]));
  }
  return out;
}

/** A panel of lines in the plot corner that covers the fewest of the given points; top corners first. */
function cornerBox(plot: Plot, lines: Array<[string, string]>, avoid: Pt[]): string {
  const box = cornerRect(plot, lines, avoid);
  return mathBox(box.left + 8, box.top + 17, lines);
}

/** The corner of the plot where the panel covers the fewest of the points to avoid. */
function cornerRect(plot: Plot, lines: Array<[string, string]>, avoid: Pt[]): { left: number; top: number; w: number; h: number } {
  const { w, h } = panelSize(lines);
  const { x, y, w: bw, h: bh } = plot.box;
  const corners = [
    { left: x + 6, top: y + 6 },
    { left: x + bw - 6 - w, top: y + 6 },
    { left: x + 6, top: y + bh - 6 - h },
    { left: x + bw - 6 - w, top: y + bh - 6 - h },
  ];
  let best = corners[0];
  let bestHits = Number.POSITIVE_INFINITY;
  for (const corner of corners) {
    const hits = avoid.filter((p) => p.x >= corner.left - 4 && p.x <= corner.left + w + 4 && p.y >= corner.top - 4 && p.y <= corner.top + h + 4).length;
    if (hits < bestHits) {
      best = corner;
      bestHits = hits;
    }
  }
  return { ...best, w, h };
}

/** A curve given by a parameter, cut where it leaves a generous margin around the plot. */
function paramCurve(plot: Plot, point: (u: number) => [number, number] | null, u0: number, u1: number, cls: string, samples = 480): string {
  const mx = plot.xmax - plot.xmin;
  const my = plot.ymax - plot.ymin;
  let d = "";
  let pen = false;
  for (let i = 0; i <= samples; i++) {
    const p = point(u0 + ((u1 - u0) * i) / samples);
    if (
      !p ||
      !Number.isFinite(p[0]) ||
      !Number.isFinite(p[1]) ||
      p[0] < plot.xmin - mx ||
      p[0] > plot.xmax + mx ||
      p[1] < plot.ymin - my ||
      p[1] > plot.ymax + my
    ) {
      pen = false;
      continue;
    }
    d += `${pen ? "L" : "M"}${r1(plot.X(p[0]))} ${r1(plot.Y(p[1]))} `;
    pen = true;
  }
  return d ? path(d.trim(), cls) : "";
}

/** The vertical line x = c across the plot. */
function vline(plot: Plot, x: number, cls: string): string {
  return line(plot.X(x), plot.Y(plot.ymin), plot.X(x), plot.Y(plot.ymax), cls);
}

/** The horizontal line y = c across the plot. */
function hline(plot: Plot, y: number, cls: string): string {
  return line(plot.X(plot.xmin), plot.Y(y), plot.X(plot.xmax), plot.Y(y), cls);
}

// ─── 5.1 Exponentialfunktion y = k · aˣ ────────────────────────────────────

export const expGraphPlot = () => new Plot(-4, 5, -4, 10, { x: 20, y: 14, w: 330, h: 312 });

/** The comparison of the lab: the line or the parabola through (0 | k) and (1 | k · a). */
export function comparison(v: LabValues): ((x: number) => number) | null {
  const d = v.k * (v.a - 1);
  if (v.cmp === 1) return (x) => v.k + d * x;
  if (v.cmp === 2) return (x) => v.k + d * x * x;
  return null;
}

/** Where the factor handle sits: at (1 | k · a), or at (−1 | k : a) when that is out of view. */
function factorHandle(v: LabValues, plot: Plot): Pt | null {
  if (v.k === 0) return null;
  if (plot.contains(1, v.k * v.a)) return plot.P(1, v.k * v.a);
  if (plot.contains(-1, v.k / v.a)) return plot.P(-1, v.k / v.a);
  return null;
}

function expGraph(v: LabValues): string {
  const plot = expGraphPlot();
  const f = (x: number) => v.k * v.a ** x;
  const g = comparison(v);
  const d = v.k * (v.a - 1);
  let out = open("Graph einer Exponentialfunktion y = k · aˣ mit Wertetabelle");
  out += plot.clip("clip-exp") + plot.grid(1, 2);
  if (v.a !== 1 && v.k !== 0) {
    // The curve approaches the x-axis where aˣ shrinks; the label goes to the other side.
    const right = v.a > 1;
    out += line(plot.X(plot.xmin), plot.Y(0), plot.X(plot.xmax), plot.Y(0), "lab-curve-c");
    out += text(right ? plot.X(4.2) : plot.X(-3.9), plot.Y(0) - 6, "Asymptote y = 0", "lab-text-small lab-text-c", right ? "end" : "start");
  }
  if (g) out += clipped("clip-exp", plot.graph(g, "lab-curve-2"));
  out += clipped("clip-exp", plot.graph(f, "lab-curve"));
  for (const x of [2, 3, 4]) {
    if (plot.contains(x, f(x))) out += circle(plot.X(x), plot.Y(f(x)), 3.5, "lab-point-a");
    if (g && plot.contains(x, g(x))) out += circle(plot.X(x), plot.Y(g(x)), 3.5, "lab-point-b");
  }
  // Labels below the points, on the side where the curve rises away from them.
  const K = plot.P(0, v.k);
  const leftLabel = v.a < 1;
  out += text(K.x + (leftLabel ? -9 : 9), K.y + 18, "(0 | k)", "lab-text-small", leftLabel ? "end" : "start");
  const F = factorHandle(v, plot);
  if (F) out += text(F.x + (F.x > K.x ? 12 : -12), F.y + 4, F.x > K.x ? "(1 | k · a)" : "(−1 | k : a)", "lab-text-small", F.x > K.x ? "start" : "end");
  out += handle("k", K.x, K.y, "Anfangswert k: Punkt (0 | k)", "lab-handle lab-handle-a");
  if (F) out += handle("a", F.x, F.y, "Basis a: Punkt eine Einheit neben der y-Achse");

  // The table of values: constant factor beside constant difference.
  const left = 360;
  out += rect(left, 14, 154, 312, "lab-panel", 'rx="8"');
  const cx = g ? [376, 424, 482] : [384, 452];
  out += text(left + 8, 34, "Wertetabelle", "lab-text");
  out += text(cx[0], 56, "x", "lab-text-axis", "middle");
  out += mtext(cx[1], 56, v.k === 1 ? "a^{x}" : "k · a^{x}", "lab-text lab-text-a", "middle");
  if (g) out += text(cx[2], 56, v.cmp === 1 ? "Gerade" : "Parabel", "lab-text lab-text-b", "middle");
  for (let x = 0; x <= 4; x++) {
    const y = 80 + x * 46;
    out += text(cx[0], y, String(x), "lab-text", "middle");
    out += text(cx[1], y, fmtValue(f(x)), "lab-text", "middle");
    if (g) out += text(cx[2], y, fmtValue(g(x)), "lab-text", "middle");
    if (x < 4) {
      out += text(cx[1], y + 24, `↓ · ${fmt(v.a, 2)}`, "lab-text-small lab-text-a", "middle");
      if (g) {
        const step = v.cmp === 1 ? d : d * (2 * x + 1);
        out += text(cx[2], y + 24, `↓ ${step < 0 ? "−" : "+"} ${fmtValue(Math.abs(step))}`, "lab-text-small lab-text-b", "middle");
      }
    }
  }
  out += text(left + 8, 290, "Exponentiell: gleicher Faktor", "lab-text-small lab-text-a");
  if (g) out += text(left + 8, 308, v.cmp === 1 ? "Gerade: gleicher Zuwachs" : "Parabel: Zuwachs wächst", "lab-text-small lab-text-b");
  return out + "</svg>";
}

// ─── 5.2 Wachstum und Abklingen ────────────────────────────────────────────

/** The measured values of the third Laborauftrag: 300 · 1,2ᵗ. */
export const GROWTH_DATA: Array<[number, number]> = [
  [0, 300],
  [1, 360],
  [2, 432],
];

/** The plot of N(t) : N₀ over 30 time steps; the axis shows the absolute values. */
export const growthPlot = () => new Plot(0, 30, 0, 4.4, { x: 54, y: 20, w: 294, h: 290 });

/** Time after which the stock has doubled (p > 0) or halved (p < 0); null for p = 0. */
export function characteristicTime(p: number): number | null {
  if (p === 0) return null;
  return Math.log(2) / Math.abs(Math.log(1 + p / 100));
}

function growth(v: LabValues): string {
  const plot = growthPlot();
  const a = 1 + v.p / 100;
  const rel = (t: number) => a ** t;
  const T = characteristicTime(v.p);
  let out = open("Exponentielles Wachstum oder Abklingen eines Bestands über der Zeit");
  out += plot.clip("clip-growth");
  out += rect(plot.box.x, plot.box.y, plot.box.w, plot.box.h, "lab-plot-bg");
  for (let t = 5; t <= 30; t += 5) out += line(plot.X(t), plot.Y(0), plot.X(t), plot.Y(4.4), "lab-grid");
  const levels: Array<[number, string]> = [
    [0.25, "¼ N₀"],
    [0.5, "½ N₀"],
    [1, "N₀"],
    [2, "2 N₀"],
    [4, "4 N₀"],
  ];
  for (const [level] of levels) {
    out += line(plot.X(0), plot.Y(level), plot.X(30), plot.Y(level), "lab-grid");
    out += text(plot.box.x - 5, plot.Y(level) + 4, fmt(v.N0 * level, 0), "lab-text-tick", "end");
  }
  out += line(plot.X(0), plot.Y(0), plot.X(30) + 6, plot.Y(0), "lab-ink");
  for (let t = 0; t <= 30; t += 5) out += text(plot.X(t), plot.Y(0) + 14, String(t), "lab-text-tick", "middle");
  out += text(plot.X(30), plot.Y(0) + 28, "Zeit t", "lab-text-axis", "end");
  // one bar per time step: each one is a times the one before
  let bars = "";
  for (let t = 0; t <= 30; t++) {
    if (rel(t) > 4.4) break;
    bars += rect(plot.X(t) - 3, plot.Y(rel(t)), 6, plot.Y(0) - plot.Y(rel(t)), t === v.t ? "lab-bar-ok" : "lab-bar-ghost");
  }
  out += clipped("clip-growth", bars + plot.graph(rel, "lab-curve"));
  // doubling or halving times: the same span between every two levels
  let timeLabel = "";
  if (T !== null) {
    const steps = v.p > 0 ? [2, 4] : [0.5, 0.25, 0.125];
    steps.forEach((level, i) => {
      const t = T * (i + 1);
      if (t > 30) return;
      out += clipped("clip-growth", line(plot.X(0), plot.Y(level), plot.X(t), plot.Y(level), "lab-dashed") + line(plot.X(t), plot.Y(level), plot.X(t), plot.Y(0), "lab-dashed"));
      out += circle(plot.X(t), plot.Y(level), 4, "lab-point-b");
      if (i === 0) {
        const name = v.p > 0 ? `Verdopplung nach ${fmt(T, 2)}` : `Halbierung nach ${fmt(T, 2)}`;
        const leftSide = t > 15;
        timeLabel = infoBox(plot.X(t) + (leftSide ? -12 : 12), plot.Y(level) - 10, [[name, "lab-text-small lab-text-b"]], leftSide ? "end" : "start");
      }
    });
  }
  // the levels N₀, 2 N₀, … on small panels over bars and curve
  for (const [level, name] of levels.slice(1)) out += infoBox(plot.X(30) - 4, plot.Y(level) + 4, [[name, "lab-text-small"]], "end");
  out += timeLabel;
  // the measured values of the third Laborauftrag
  const fits = v.N0 === GROWTH_DATA[0][1] && v.p === 20;
  for (const [t, N] of GROWTH_DATA) {
    const y = N / v.N0;
    if (y <= 4.4) out += circle(plot.X(t), plot.Y(y), 5, fits ? "lab-point-ok" : "lab-target");
  }
  const Nt = v.N0 * rel(v.t);
  if (rel(v.t) <= 4.4) {
    out += line(plot.X(v.t), plot.Y(0), plot.X(v.t), plot.Y(rel(v.t)), "lab-dashed");
    out += circle(plot.X(v.t), plot.Y(rel(v.t)), 5.5, "lab-point-ok");
  }
  out += mathBox(367, 40, [
    ["N(t) = N_{0} · a^{t}", "lab-text"],
    [`a = 1 ${v.p < 0 ? "−" : "+"} ${fmt(Math.abs(v.p))} % = ${fmt(a, 2)}`, "lab-text-muted"],
    [`N(t) = ${fmt(v.N0)} · ${fmt(a, 2)}^{t}`, "lab-text lab-text-a"],
    [`N(${v.t}) ≈ ${fmt(Nt, 2)}`, "lab-text lab-text-ok"],
    [T === null ? "p = 0: N bleibt gleich" : v.p > 0 ? `Verdopplungszeit ≈ ${fmt(T, 2)}` : `Halbwertszeit ≈ ${fmt(T, 2)}`, "lab-text-small"],
    ["Kreise: die Messwerte", "lab-text-small"],
    ["(0 | 300), (1 | 360),", "lab-text-small"],
    ["(2 | 432)", "lab-text-small"],
  ]);
  out += handle("t", plot.X(v.t), plot.Y(0), "Zeitpunkt t");
  return out + "</svg>";
}

// ─── 5.3 Der Logarithmus löst aˣ = b ───────────────────────────────────────

export const logSolvePlot = () => new Plot(-5, 7, -3, 17);

/** The x on the plot's right edge where the handle of the line y = b sits. */
const B_HANDLE_X = 6.3;

function logSolve(v: LabValues): string {
  const plot = logSolvePlot();
  const f = (x: number) => v.a ** x;
  let out = open("Der Graph von y = aˣ und die Gerade y = b: Der Schnittpunkt liegt bei x = log_a b");
  out += plot.clip("clip-solve") + plot.grid(1, 2);
  out += clipped("clip-solve", plot.graph(f, "lab-curve"));
  out += plot.lineThrough(0, v.b, "lab-curve-2");
  // log_a 1 = 0 and log_a a = 1
  out += circle(plot.X(0), plot.Y(1), 3.5, "lab-point-a");
  if (plot.contains(1, v.a)) out += circle(plot.X(1), plot.Y(v.a), 3.5, "lab-point-a");
  const lines: Array<[string, string]> = [[`${fmt(v.a)}^{x} = ${fmt(v.b)}`, "lab-text lab-text-big"]];
  if (v.b > 0) {
    const x = logBase(v.a, v.b);
    const S = plot.P(x, v.b);
    out += line(S.x, S.y, S.x, plot.Y(0), "lab-dashed");
    out += circle(S.x, plot.Y(0), 4, "lab-point-ok");
    const label = `x = ${logNameSvg(v.a)} ${fmt(v.b)} ≈ ${fmt(x, 2)}`;
    const half = (visibleWidth(label) * charWidth("small")) / 2;
    const labelX = Math.min(Math.max(S.x, plot.box.x + half + 2), plot.box.x + plot.box.w - half - 2);
    out += mtext(labelX, plot.Y(0) + 30, label, "lab-text-small lab-text-ok", "middle");
    lines.push([`x = ${logNameSvg(v.a)} ${fmt(v.b)} ≈ ${fmt(x, 3)}`, "lab-text lab-text-ok"]);
    lines.push([v.a === 10 ? "Taschenrechner: Taste log" : `Taschenrechner: lg ${fmt(v.b)} : lg ${fmt(v.a)}`, "lab-text-muted"]);
  } else {
    lines.push(["keine Lösung:", "lab-text lab-text-bad"]);
    lines.push([`${fmt(v.a)}^{x} ist immer positiv`, "lab-text-muted"]);
  }
  out += text(plot.X(B_HANDLE_X) - 12, plot.Y(v.b) + 18, "y = b", "lab-text-small lab-text-b", "end");
  // The panel goes where the curve is not: left for a > 1, right for a < 1. Handles come last, above it.
  const { w } = panelSize(lines);
  out += mathBox(v.a > 1 ? plot.box.x + 14 : plot.box.x + plot.box.w - w + 2, plot.box.y + 24, lines);
  if (v.b > 0) {
    const S = plot.P(logBase(v.a, v.b), v.b);
    out += handle("S", S.x, S.y, "Schnittpunkt S entlang der Kurve", "lab-handle lab-handle-a");
  }
  out += handle("b", plot.X(B_HANDLE_X), plot.Y(v.b), "Gerade y = b", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 5.4 Logarithmensätze ──────────────────────────────────────────────────

/** The number line of logarithms: lg values from L0 to L1 between the SVG x0 and x1. */
const RULE = { x0: 34, x1: 496, L0: -1.2, L1: 3.2 };
const ROWS = { a: 70, b: 110, result: 150, wrong: 190, axis: 232, numbers: 282 };

/** The SVG x of a logarithm value on the number line. */
export function ruleX(L: number): number {
  return RULE.x0 + ((L - RULE.L0) / (RULE.L1 - RULE.L0)) * (RULE.x1 - RULE.x0);
}

/** The logarithm value at an SVG x. */
export function ruleL(px: number): number {
  return RULE.L0 + ((px - RULE.x0) / (RULE.x1 - RULE.x0)) * (RULE.L1 - RULE.L0);
}

/** True when a logarithm value is on the visible part of the number line. */
export function onRule(L: number): boolean {
  return Number.isFinite(L) && L >= RULE.L0 && L <= RULE.L1;
}

const lg = Math.log10;

/** Where the handles of each rule sit, in logarithm units: the tips of the arrows. */
export function ruleGeometry(v: LabValues): { u: number; v: number | null; r: number | null } {
  const lu = lg(v.u);
  const lv = lg(v.v);
  if (v.rule === 0) return { u: lu, v: lu + lv, r: null };
  if (v.rule === 1) return { u: lu, v: lu - lv, r: null };
  if (v.rule === 2) return { u: lu, v: null, r: v.r * lu };
  return { u: lu, v: lv, r: null };
}

function bar(L0: number, L1: number, y: number, cls: string): string {
  return rect(Math.min(ruleX(L0), ruleX(L1)), y - 7, Math.abs(ruleX(L1) - ruleX(L0)), 14, cls, 'rx="3"');
}

/** A small label that starts at the logarithm value L but stays inside the drawing. */
function ruleLabel(L: number, y: number, content: string, cls: string): string {
  const width = visibleWidth(content) * charWidth("small");
  const x = Math.max(RULE.x0, Math.min(ruleX(Math.max(RULE.L0, Math.min(L, RULE.L1))), RULE.x1 + 18 - width));
  return mtext(x, y, content, cls);
}

function logRules(v: LabValues): string {
  const lu = lg(v.u);
  const lv = lg(v.v);
  const geo = ruleGeometry(v);
  let out = open("Logarithmensätze am Zahlenstrahl der Logarithmen");
  out += `<clipPath id="clip-rules"><rect x="${RULE.x0 - 6}" y="40" width="${RULE.x1 - RULE.x0 + 12}" height="260" /></clipPath>`;
  // the two scales: logarithms above, the numbers themselves below
  out += line(RULE.x0, ROWS.axis, RULE.x1 + 6, ROWS.axis, "lab-ink");
  out += line(RULE.x0, ROWS.numbers, RULE.x1 + 6, ROWS.numbers, "lab-ink");
  for (let n = -2; n <= 3; n++) {
    if (onRule(n)) {
      out += line(ruleX(n), ROWS.axis - 5, ruleX(n), ROWS.axis + 5, "lab-ink");
      out += text(ruleX(n), ROWS.axis + 18, fmt(n), "lab-text-tick", "middle");
      out += line(ruleX(n), ROWS.numbers - 6, ruleX(n), ROWS.numbers + 6, "lab-ink");
      out += text(ruleX(n), ROWS.numbers + 20, fmt(10 ** n, 3), "lab-text-tick", "middle");
    }
    for (let m = 2; m <= 9; m++) {
      const L = n + lg(m);
      if (onRule(L)) out += line(ruleX(L), ROWS.numbers - 3, ruleX(L), ROWS.numbers + 3, "lab-thin");
    }
  }
  for (const half of [-0.5, 0.5, 1.5, 2.5]) out += line(ruleX(half), ROWS.axis - 3, ruleX(half), ROWS.axis + 3, "lab-thin");
  out += line(ruleX(0), ROWS.a - 16, ruleX(0), ROWS.axis, "lab-dashed");
  out += text(RULE.x0 - 4, ROWS.axis + 4, "lg", "lab-text-axis", "end");
  out += text(RULE.x0 - 4, ROWS.numbers + 4, "Zahl", "lab-text-axis", "end");
  out += text(RULE.x0, 330, "Oben die Logarithmen (Hochzahlen von 10), unten die Zahlen selbst.", "lab-text-small");

  const titles = [
    "Produktsatz: lg(u · v) = lg u + lg v",
    "Quotientensatz: lg(u : v) = lg u − lg v",
    "Potenzsatz: lg(u^{r}) = r · lg u",
    "Basiswechsel: log_{u} v = lg v : lg u",
  ];
  out += mtext(RULE.x0, 28, titles[v.rule] ?? titles[0], "lab-text lab-text-big");
  const U = fmt(v.u);
  const V = fmt(v.v);
  let drawing = "";
  let labels = "";
  let result: number | null = null;
  if (v.rule === 0 || v.rule === 1) {
    const sign = v.rule === 0 ? 1 : -1;
    result = lu + sign * lv;
    drawing += arrow(ruleX(0), ROWS.a, ruleX(lu), ROWS.a, "lab-side-a", 3);
    labels += ruleLabel(Math.min(0, lu), ROWS.a - 13, `lg ${U} ≈ ${fmt(lu, 3)}`, "lab-text-small lab-text-a");
    drawing += line(ruleX(lu), ROWS.a, ruleX(lu), ROWS.b, "lab-dashed");
    drawing += arrow(ruleX(lu), ROWS.b, ruleX(result), ROWS.b, "lab-side-b", 3);
    labels += ruleLabel(Math.min(lu, result), ROWS.b - 13, `${sign > 0 ? "+" : "−"} lg ${V} ≈ ${fmt(lv, 3)}`, "lab-text-small lab-text-b");
    const number = v.rule === 0 ? v.u * v.v : v.u / v.v;
    drawing += bar(0, result, ROWS.result, "lab-fill-ok");
    labels += ruleLabel(Math.max(0, result) + 0.08, ROWS.result + 4, `lg(${U} ${v.rule === 0 ? "·" : ":"} ${V}) = lg ${fmt(number, 3)} ≈ ${fmt(result, 3)} ✓`, "lab-text-small lab-text-ok");
    // the classic slip: the logarithm of the sum, or the quotient of the logarithms
    const wrong = v.rule === 0 ? lg(v.u + v.v) : lv === 0 ? null : lu / lv;
    if (wrong !== null) {
      const hit = Math.abs(wrong - result) < 1e-9;
      if (onRule(wrong)) drawing += circle(ruleX(wrong), ROWS.wrong, 5, hit ? "lab-point-ok" : "lab-point-bad");
      const label = v.rule === 0 ? `lg(${U} + ${V}) ≈ ${fmt(wrong, 3)}` : `lg ${U} : lg ${V} ≈ ${fmt(wrong, 3)}`;
      labels += ruleLabel(wrong + 0.09, ROWS.wrong + 4, `${hit ? "zufällig gleich: " : "falsch: "}${label}`, hit ? "lab-text-small lab-text-ok" : "lab-text-small lab-text-bad");
    } else {
      labels += ruleLabel(0.09, ROWS.wrong + 4, "falsch: lg u : lg v (hier Division durch 0)", "lab-text-small lab-text-bad");
    }
  } else if (v.rule === 2) {
    result = v.r * lu;
    drawing += arrow(ruleX(0), ROWS.a, ruleX(lu), ROWS.a, "lab-side-a", 3);
    labels += ruleLabel(Math.min(0, lu), ROWS.a - 13, `lg ${U} ≈ ${fmt(lu, 3)}`, "lab-text-small lab-text-a");
    drawing += arrow(ruleX(0), ROWS.b, ruleX(result), ROWS.b, "lab-side-b", 3);
    // marks every whole multiple of lg u along the r-fold arrow
    for (let j = 1; j < Math.abs(v.r); j++) drawing += line(ruleX(Math.sign(v.r) * j * lu), ROWS.b - 6, ruleX(Math.sign(v.r) * j * lu), ROWS.b + 6, "lab-ink");
    labels += ruleLabel(Math.min(0, result), ROWS.b - 13, `${fmt(v.r)} · lg ${U} ≈ ${fmt(result, 3)}`, "lab-text-small lab-text-b");
    drawing += bar(0, result, ROWS.result, "lab-fill-ok");
    labels += ruleLabel(Math.max(0, result) + 0.08, ROWS.result + 4, `lg(${U}^{${fmt(v.r)}}) = lg ${fmt(v.u ** v.r, 3)} ≈ ${fmt(result, 3)} ✓`, "lab-text-small lab-text-ok");
    const wrong = lu ** v.r;
    if (Number.isFinite(wrong)) {
      if (onRule(wrong)) drawing += circle(ruleX(wrong), ROWS.wrong, 5, "lab-point-bad");
      labels += ruleLabel(wrong + 0.09, ROWS.wrong + 4, `falsch: (lg ${U})^{${fmt(v.r)}} ≈ ${fmt(wrong, 3)}`, "lab-text-small lab-text-bad");
    } else {
      labels += ruleLabel(0.09, ROWS.wrong + 4, `falsch: (lg ${U})^{${fmt(v.r)}} ist hier nicht definiert`, "lab-text-small lab-text-bad");
    }
  } else {
    // log_u v: how many copies of lg u fill lg v
    drawing += arrow(ruleX(0), ROWS.a, ruleX(lv), ROWS.a, "lab-side-b", 3);
    labels += ruleLabel(Math.min(0, lv), ROWS.a - 13, `lg ${V} ≈ ${fmt(lv, 3)}`, "lab-text-small lab-text-b");
    if (lu === 0) {
      labels += ruleLabel(0.09, ROWS.b + 4, "Basis u = 1 ist nicht erlaubt: lg 1 = 0.", "lab-text-small lab-text-bad");
    } else {
      const copies = lv / lu;
      const whole = Math.min(Math.floor(Math.abs(copies) + 1e-9), 40);
      const dir = Math.sign(copies) || 1;
      for (let j = 0; j < whole; j++) drawing += bar(dir * j * lu, dir * (j + 1) * lu, ROWS.b, j % 2 === 0 ? "lab-fill-a" : "lab-fill-c");
      if (Math.abs(copies) - whole > 1e-9) drawing += bar(dir * whole * lu, lv, ROWS.b, "lab-target");
      labels += ruleLabel(Math.max(0, lv, dir * whole * lu) + 0.08, ROWS.b + 4, `${fmt(Math.abs(copies), 3)}-mal lg ${U}`, "lab-text-small lab-text-a");
      labels += mtext(RULE.x0, ROWS.result + 4, `log_{${U}} ${V} = lg ${V} : lg ${U} ≈ ${fmt(copies, 3)}`, "lab-text lab-text-ok");
      const wrong = lg(v.v / v.u);
      if (onRule(wrong)) drawing += circle(ruleX(wrong), ROWS.wrong, 5, Math.abs(wrong - copies) < 1e-9 ? "lab-point-ok" : "lab-point-bad");
      labels += ruleLabel(wrong + 0.09, ROWS.wrong + 4, `falsch: lg(${V} : ${U}) ≈ ${fmt(wrong, 3)}`, "lab-text-small lab-text-bad");
    }
  }
  if (result !== null) {
    drawing += line(ruleX(result), ROWS.result + 8, ruleX(result), ROWS.numbers, "lab-dashed");
    if (onRule(result)) drawing += circle(ruleX(result), ROWS.numbers, 4.5, "lab-point-ok");
  }
  out += clipped("clip-rules", drawing) + labels;
  // handles at the arrow tips, where they are on the number line
  const uRow = v.rule === 3 ? ROWS.b : ROWS.a;
  if (!(v.rule === 3 && lu === 0) && onRule(geo.u)) out += handle("u", ruleX(geo.u), uRow, "Zahl u", "lab-handle lab-handle-a");
  if (geo.v !== null && onRule(geo.v)) out += handle("v", ruleX(geo.v), v.rule === 3 ? ROWS.a : ROWS.b, "Zahl v", "lab-handle lab-handle-b");
  if (geo.r !== null && Math.abs(lu) > 0.02 && onRule(geo.r)) out += handle("r", ruleX(geo.r), ROWS.b, "Hochzahl r", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 5.5 y = k · a^(x − b) + c ─────────────────────────────────────────────

/** Equal units on both axes, so the mirror image at y = x looks right. */
export const shiftPlot = () => new Plot(-7.5, 7.5, -5, 5, { x: 26, y: 14, w: 468, h: 312 });

/** The asymptote's handle sits on the side where the curve is far from it. */
function cHandleX(v: LabValues): number {
  return v.a < 1 ? -6.6 : 6.6;
}

function inverseArg(k: number, c: number): string {
  return k === 1 ? shiftedArg(c) : `(${shiftedArg(c)}) : ${k < 0 ? `(${fmt(k)})` : fmt(k)}`;
}

/** The inverse of y = k · a^(x − b) + c as plain text: y = log_a((x − c) : k) + b. */
export function expInverseText(k: number, a: number, b: number, c: number): string {
  if (k === 0) return "keine (k = 0)";
  return `y = ${logName(a)}(${inverseArg(k, c)})${plusConst(b)}`;
}

function expShift(v: LabValues): string {
  const plot = shiftPlot();
  const f = (x: number) => v.k * v.a ** (x - v.b) + v.c;
  let out = open("Verschobene und gestreckte Exponentialfunktion mit Asymptote, Wertemenge und Umkehrfunktion");
  out += plot.clip("clip-shift") + plot.grid(1, 2);
  // W along the y-axis: everything above (k > 0) or below (k < 0) the asymptote.
  // The bar sits just right of the axis so the tick numbers on its left stay readable.
  if (v.k !== 0) {
    const top = v.k > 0 ? plot.ymax : v.c;
    const bottom = v.k > 0 ? v.c : plot.ymin;
    if (top > bottom) out += rect(plot.X(0) + 2, plot.Y(top), 8, plot.Y(bottom) - plot.Y(top), "lab-fill-b");
  }
  // The asymptote's label sits where the curve comes close, on the far side of the line.
  out += hline(plot, v.c, "lab-curve-c");
  const approachRight = v.a < 1;
  // below the line it would sit on the x-axis numbers when c = 0
  const below = v.k >= 0 ? (v.c === 0 ? 27 : 15) : -6;
  const label: Pt = { x: approachRight ? plot.X(7.3) : plot.X(-7.3), y: plot.Y(v.c) + below };
  out += text(label.x, label.y, `Asymptote y = ${fmt(v.c)}`, "lab-text-small lab-text-c", approachRight ? "end" : "start");
  const avoid: Pt[] = samplePixels(plot, (x) => [x, f(x)], plot.xmin, plot.xmax);
  for (let i = 0; i <= 10; i++) avoid.push({ x: label.x + (approachRight ? -i * 10 : i * 10), y: label.y - 4 });
  if (v.inv === 1 && v.k !== 0) {
    out += clipped("clip-shift", plot.lineThrough(1, 0, "lab-ghost"));
    out += vline(plot, v.c, "lab-dashed");
    out += clipped("clip-shift", paramCurve(plot, (s) => [f(s), s], plot.ymin - 3, plot.ymax + 3, "lab-curve-dashed"));
    avoid.push(...samplePixels(plot, (s) => [f(s), s], plot.ymin, plot.ymax));
  }
  out += clipped("clip-shift", plot.graph(f, "lab-curve"));
  const f0 = f(0);
  if (plot.contains(0, f0)) out += circle(plot.X(0), plot.Y(f0), 4, "lab-point-a");
  if (v.k !== 0 && -v.c / v.k > 0) {
    const zero = v.b + logBase(v.a, -v.c / v.k);
    if (plot.contains(zero, 0)) out += circle(plot.X(zero), plot.Y(0), 4.5, "lab-point-ok");
  }
  // The point's label goes above it, on the side where the curve is lower.
  const P = plot.P(v.b, v.k + v.c);
  const pVisible = plot.contains(v.b, v.k + v.c);
  const rising = v.k * (v.a - 1) > 0;
  // Just below the x-axis it would sit on the tick numbers, so there it moves above the axis.
  const pLabelY = P.y - 10 > plot.Y(0) + 4 && P.y - 10 < plot.Y(0) + 24 ? plot.Y(0) - 6 : P.y - 10;
  if (pVisible) out += text(P.x + (rising ? -11 : 11), pLabelY, `(${fmt(v.b)} | ${fmt(v.k + v.c)})`, "lab-text-small", rising ? "end" : "start");
  const C = plot.P(cHandleX(v), v.c);
  const lines: Array<[string, string]> = [
    [v.k === 0 ? `y = ${fmt(v.c)} (k = 0)` : `y = ${expSvg(v.k, v.a, v.b, v.c)}`, "lab-text lab-text-big"],
    [`Asymptote y = ${fmt(v.c)}`, "lab-text lab-text-c"],
    [v.k === 0 ? "keine Exponentialfunktion" : `𝔻 = ℝ, 𝕎 = {y | y ${v.k > 0 ? ">" : "<"} ${fmt(v.c)}}`, "lab-text-muted"],
  ];
  if (v.inv === 1 && v.k !== 0) lines.push([`Umkehrfunktion: y = ${logNameSvg(v.a)}(${inverseArg(v.k, v.c)})${plusConst(v.b)}`, "lab-text-small lab-text-b"]);
  avoid.push(P, C);
  const box = cornerRect(plot, lines, avoid);
  out += mathBox(box.left + 8, box.top + 17, lines);
  // "W" beside the bar, near the asymptote or at its open end: wherever the panel
  // leaves room and neither a curve, a tick number, the y-axis name nor the label
  // of (b | k + c) is close.
  if (v.k !== 0) {
    const busy: Pt[] = [
      ...avoid,
      ...[-4, -2, 2, 4].map((n) => ({ x: plot.X(0) - 10, y: plot.Y(n) })),
      { x: plot.X(0) + 10, y: plot.Y(plot.ymax) + 6 },
      { x: P.x + (rising ? -40 : 40), y: pLabelY - 4 },
    ];
    const clearance = (p: Pt) => Math.min(...busy.map((b) => Math.hypot(b.x - p.x, b.y - p.y)));
    const inBox = (p: Pt) => p.x > box.left - 12 && p.x < box.left + box.w + 12 && p.y > box.top - 10 && p.y < box.top + box.h + 10;
    const near = v.k > 0 ? Math.min(v.c + 0.8, plot.ymax - 0.4) : Math.max(v.c - 0.8, plot.ymin + 0.4);
    const far = v.k > 0 ? plot.ymax - 0.4 : plot.ymin + 0.4;
    const candidates = [near, far]
      .flatMap((y) => [
        { x: plot.X(0) + 18, y: plot.Y(y), right: true },
        { x: plot.X(0) - 10, y: plot.Y(y), right: false },
      ])
      .filter((p) => !inBox(p));
    if (candidates.length) {
      const best = candidates.reduce((a, b) => (clearance(b) > clearance(a) ? b : a));
      out += text(best.x + (best.right ? -4 : 4), best.y + 4, "W", "lab-text-small lab-text-b", best.right ? "start" : "end");
    }
  }
  // handles last, above the panel
  if (pVisible) out += handle("P", P.x, P.y, "Punkt (b | k + c): verschiebt waagrecht und streckt", "lab-handle lab-handle-a");
  out += handle("c", C.x, C.y, "Asymptote y = c: verschiebt senkrecht", "lab-handle lab-handle-b");
  return out + "</svg>";
}

// ─── 5.6 Logarithmusfunktionen ─────────────────────────────────────────────

export const logGraphPlot = () => new Plot(-7.5, 7.5, -5, 5, { x: 26, y: 14, w: 468, h: 312 });

/** Where the stretch handle sits: where log_a(x − b) = 1, or = −1 when that is out of view. */
export function stretchPoint(v: LabValues, plot: Plot): { x: number; y: number } | null {
  if (v.k === 0) return null;
  if (plot.contains(v.b + v.a, v.c + v.k)) return { x: v.b + v.a, y: v.c + v.k };
  if (plot.contains(v.b + 1 / v.a, v.c - v.k)) return { x: v.b + 1 / v.a, y: v.c - v.k };
  return null;
}

/** The inverse of y = k · log_a(x − b) + c as plain text: y = a^((x − c) : k) + b. */
export function logInverseText(k: number, a: number, b: number, c: number): string {
  if (k === 0) return "keine (k = 0)";
  return `y = ${powText(fmt(a), inverseArg(k, c))}${plusConst(b)}`;
}

/** The B-handle sits on the asymptote at this height. */
const B_HANDLE_Y = 4.2;

function logGraph(v: LabValues): string {
  const plot = logGraphPlot();
  // the graph by its y: x = b + a^((y − c) : k), which reaches into the asymptote
  const point = (y: number): [number, number] | null => (v.k === 0 ? null : [v.b + v.a ** ((y - v.c) / v.k), y]);
  let out = open("Graph einer Logarithmusfunktion mit senkrechter Asymptote und Spiegelbild an y = x");
  out += plot.clip("clip-log") + plot.grid(1, 2);
  // D along the x-axis: every x right of the asymptote
  const dLeft = Math.max(v.b, plot.xmin);
  out += rect(plot.X(dLeft), plot.Y(0) - 5, plot.X(plot.xmax) - plot.X(dLeft), 10, "lab-fill-b");
  out += text(plot.X(plot.xmax) - 4, plot.Y(0) + 16, "D", "lab-text-small lab-text-b", "end");
  out += vline(plot, v.b, "lab-curve-c");
  const label: Pt = { x: plot.X(v.b) + (v.b > 4 ? -6 : 6), y: plot.Y(-4.6) };
  out += text(label.x, label.y, `Asymptote x = ${fmt(v.b)}`, "lab-text-small lab-text-c", v.b > 4 ? "end" : "start");
  const avoid: Pt[] = samplePixels(plot, point, plot.ymin, plot.ymax);
  for (let i = 0; i <= 10; i++) avoid.push({ x: label.x + (v.b > 4 ? -i * 10 : i * 10), y: label.y - 4 });
  if (v.mirror === 1 && v.k !== 0) {
    const inverse = (x: number) => v.a ** ((x - v.c) / v.k) + v.b;
    out += clipped("clip-log", plot.lineThrough(1, 0, "lab-ghost"));
    out += hline(plot, v.b, "lab-dashed");
    out += clipped("clip-log", plot.graph(inverse, "lab-curve-dashed"));
    avoid.push(...samplePixels(plot, (x) => [x, inverse(x)], plot.xmin, plot.xmax));
  }
  if (v.k === 0) out += clipped("clip-log", line(plot.X(v.b), plot.Y(v.c), plot.X(plot.xmax), plot.Y(v.c), "lab-curve"));
  else out += clipped("clip-log", paramCurve(plot, point, plot.ymin - 2, plot.ymax + 2, "lab-curve", 600));
  if (v.k !== 0) {
    const zero = v.b + v.a ** (-v.c / v.k);
    if (plot.contains(zero, 0)) out += circle(plot.X(zero), plot.Y(0), 4.5, "lab-point-ok");
  }
  const A = plot.P(v.b + 1, v.c);
  const aVisible = plot.contains(v.b + 1, v.c);
  if (aVisible) out += text(A.x + 11, A.y + 16, `(${fmt(v.b + 1)} | ${fmt(v.c)})`, "lab-text-small");
  const K = stretchPoint(v, plot);
  const B = plot.P(v.b, B_HANDLE_Y);
  const lines: Array<[string, string]> = [
    [v.k === 0 ? `y = ${fmt(v.c)} (k = 0)` : `y = ${logSvg(v.k, v.a, v.b, v.c)}`, "lab-text lab-text-big"],
    [`Asymptote x = ${fmt(v.b)}`, "lab-text lab-text-c"],
    [`𝔻 = {x | x > ${fmt(v.b)}}, 𝕎 = ℝ`, "lab-text-muted"],
  ];
  if (v.mirror === 1 && v.k !== 0) lines.push([`Spiegelbild: y = ${fmt(v.a)}^{${inverseArg(v.k, v.c)}}${plusConst(v.b)}`, "lab-text-small lab-text-b"]);
  avoid.push(A, B);
  if (K) avoid.push(plot.P(K.x, K.y));
  out += cornerBox(plot, lines, avoid);
  // handles last, above the panel
  if (aVisible) out += handle("A", A.x, A.y, "Punkt (b + 1 | c): verschiebt den Graphen", "lab-handle lab-handle-a");
  if (K) out += handle("k", plot.X(K.x), plot.Y(K.y), "Streckfaktor k", "lab-handle lab-handle-b");
  out += handle("b", B.x, B.y, "Asymptote x = b", "lab-handle");
  return out + "</svg>";
}

// ─── 5.7 Funktionsgraphen abbilden ─────────────────────────────────────────

/** Equal units again; the band above the plot holds the equations. */
export const mapPlot = () => new Plot(-7.5, 7.5, -4, 4, { x: 20, y: 74, w: 480, h: 256 });

/** The original graphs: y = 2ˣ, y = log₂ x and y = x², each as a curve with a parameter. */
const ORIGINALS: Array<(u: number) => [number, number]> = [(u) => [u, 2 ** u], (u) => [2 ** u, u], (u) => [u, u * u]];

/** A point on each original graph that the lab maps visibly. */
export const MAP_POINT: Array<[number, number]> = [
  [1, 2],
  [2, 1],
  [1, 1],
];

/** The image of a point under the chosen mapping. */
export function mapPoint(v: LabValues, [x, y]: [number, number]): [number, number] {
  switch (v.map) {
    case 0:
      return [x + v.vx, y + v.vy];
    case 1:
      return [x, -y];
    case 2:
      return [-x, y];
    case 3:
      return [y, x];
    default:
      return [v.k * x, v.k * y];
  }
}

/** The argument x : k in plain text. */
function overK(k: number): string {
  if (k === 1) return "x";
  if (k === -1) return "−x";
  return k > 0 ? `x : ${fmt(k)}` : `−x : ${fmt(-k)}`;
}

/** The equation of the image graph: plain text for readouts, markup for the drawing. */
export function imageEquation(v: LabValues): { text: string; svg: string } {
  const k = v.k;
  const same = (t: string) => ({ text: t, svg: t });
  if (v.map === 4 && k === 0) return same("k = 0: Alle Punkte fallen auf O");
  if (v.map === 4 && k === 1) return same("k = 1: Jeder Punkt bleibt, wo er ist");
  if (v.f === 0) {
    switch (v.map) {
      case 0:
        return { text: `y = ${expText(1, 2, v.vx, v.vy)}`, svg: `y = ${expSvg(1, 2, v.vx, v.vy)}` };
      case 1:
        return { text: "y = −2ˣ", svg: "y = −2^{x}" };
      case 2:
        return { text: "y = 2⁻ˣ = 0,5ˣ", svg: "y = 2^{−x} = 0,5^{x}" };
      case 3:
        return { text: "y = log₂ x", svg: "y = log_{2} x" };
      default: {
        const base = 2 ** (1 / k);
        const exact = Math.abs(base - Number(base.toFixed(2))) < 1e-9;
        const simple = `${exact ? "=" : "≈"} ${factorText(k)}${fmt(base, 2)}`;
        return {
          text: `y = ${factorText(k)}${powText("2", overK(k))} ${simple}ˣ`,
          svg: `y = ${factorText(k)}2^{${overK(k)}} ${simple}^{x}`,
        };
      }
    }
  }
  if (v.f === 1) {
    switch (v.map) {
      case 0:
        return { text: `y = ${logText(1, 2, v.vx, v.vy)}`, svg: `y = ${logSvg(1, 2, v.vx, v.vy)}` };
      case 1:
        return { text: "y = −log₂ x = log₀,₅ x", svg: "y = −log_{2} x = log_{0,5} x" };
      case 2:
        return { text: "y = log₂(−x)", svg: "y = log_{2}(−x)" };
      case 3:
        return { text: "y = 2ˣ", svg: "y = 2^{x}" };
      default: {
        const arg = k === -1 ? "(−x)" : `(${overK(k)})`;
        if (k > 0) {
          const c = -k * Math.log2(k);
          const exact = Math.abs(c - Number(c.toFixed(2))) < 1e-9;
          const tail = `${exact ? "=" : "≈"} ${fmt(k)} · log`;
          return {
            text: `y = ${fmt(k)} · log₂${arg} ${tail}₂ x${plusConst(c)}`,
            svg: `y = ${fmt(k)} · log_{2}${arg} ${tail}_{2} x${plusConst(c)}`,
          };
        }
        return { text: `y = ${factorText(k)}log₂${arg}`, svg: `y = ${factorText(k)}log_{2}${arg}` };
      }
    }
  }
  switch (v.map) {
    case 0:
      return same(`y = ${v.vx === 0 ? "x²" : `(${shiftedArg(v.vx)})²`}${plusConst(v.vy)}`);
    case 1:
      return same("y = −x²");
    case 2:
      return same("y = (−x)² = x²");
    case 3:
      return same("x = y²: kein Funktionsgraph");
    default: {
      const coefficient = 1 / k;
      const exact = Math.abs(coefficient - Number(coefficient.toFixed(2))) < 1e-9;
      return same(`y = ${factorText(k)}(${overK(k)})² ${exact ? "=" : "≈"} ${times(Number(coefficient.toFixed(2)), "x²")}`);
    }
  }
}

/** The mapping rule for the graph's equation, with the lab's numbers. */
export function mapRule(v: LabValues): string {
  switch (v.map) {
    case 0:
      return `y = f(${shiftedArg(v.vx)})${plusConst(v.vy)}`;
    case 1:
      return "y = −f(x)";
    case 2:
      return "y = f(−x)";
    case 3:
      return "x und y tauschen: Umkehrfunktion";
    default:
      return v.k === 0 ? "k = 0 ist keine Streckung" : `y = ${factorText(v.k)}f(${overK(v.k)})`;
  }
}

/** Where a point goes: "(x | y) → (x + 2 | y + 1)". */
export function mapPointRule(v: LabValues): string {
  const plus = (variable: string, d: number) => (d === 0 ? variable : d > 0 ? `${variable} + ${fmt(d)}` : `${variable} − ${fmt(-d)}`);
  switch (v.map) {
    case 0:
      return `(x | y) → (${plus("x", v.vx)} | ${plus("y", v.vy)})`;
    case 1:
      return "(x | y) → (x | −y)";
    case 2:
      return "(x | y) → (−x | y)";
    case 3:
      return "(x | y) → (y | x)";
    default:
      return v.k === 0 ? "(x | y) → (0 | 0)" : `(x | y) → (${times(v.k, "x")} | ${times(v.k, "y")})`;
  }
}

export const MAP_NAMES = ["Verschiebung um v→", "Spiegelung an der x-Achse", "Spiegelung an der y-Achse", "Spiegelung an y = x", "zentrische Streckung an O"];
export const MAP_ORIGINALS = ["y = 2ˣ", "y = log₂ x", "y = x²"];
const ORIGINALS_SVG = ["y = 2^{x}", "y = log_{2} x", "y = x²"];

function graphMap(v: LabValues): string {
  const plot = mapPlot();
  const original = ORIGINALS[v.f] ?? ORIGINALS[0];
  const P0 = MAP_POINT[v.f] ?? MAP_POINT[0];
  const image = (u: number) => mapPoint(v, original(u));
  let out = open("Ein Funktionsgraph und sein Bild bei Verschiebung, Spiegelung oder zentrischer Streckung");
  out += plot.clip("clip-map") + plot.grid(1, 2);
  // the mapping itself: the mirror axis or the centre
  if (v.map === 1) out += hline(plot, 0, "lab-curve-c");
  if (v.map === 2) out += vline(plot, 0, "lab-curve-c");
  if (v.map === 3) out += clipped("clip-map", plot.lineThrough(1, 0, "lab-curve-c"));
  out += clipped("clip-map", paramCurve(plot, original, -12, 12, "lab-curve", 720));
  const collapsed = v.map === 4 && v.k === 0;
  if (!collapsed) out += clipped("clip-map", paramCurve(plot, image, -12, 12, "lab-curve-2", 720));
  const [qx, qy] = mapPoint(v, P0);
  const P = plot.P(P0[0], P0[1]);
  const Q = plot.P(qx, qy);
  const qVisible = plot.contains(qx, qy);
  if (v.map === 0) {
    out += clipped("clip-map", arrow(P.x, P.y, Q.x, Q.y, "lab-ink", 2));
    out += text((P.x + Q.x) / 2 + 8, (P.y + Q.y) / 2 - 6, "v→", "lab-text-small");
  } else if (v.map === 4) {
    out += circle(plot.X(0), plot.Y(0), 4, "lab-dot-small");
    out += text(plot.X(0) - 8, plot.Y(0) + 14, "O", "lab-text-small", "end");
    out += clipped("clip-map", line(plot.X(0), plot.Y(0), Q.x, Q.y, "lab-dashed") + line(plot.X(0), plot.Y(0), P.x, P.y, "lab-dashed"));
  } else {
    out += clipped("clip-map", line(P.x, P.y, Q.x, Q.y, "lab-dashed"));
  }
  out += circle(P.x, P.y, 5, "lab-point-a");
  out += text(P.x - 8, P.y - 8, "P", "lab-text-small lab-text-a", "end");
  if (qVisible) {
    out += circle(Q.x, Q.y, 5, "lab-point-b");
    out += text(Q.x + 9, Q.y - 9, "P'", "lab-text-small lab-text-b");
  }
  if (v.map === 0 && qVisible) out += handle("v", Q.x, Q.y, "Bildpunkt P': Verschiebungsvektor ziehen", "lab-handle lab-handle-b");
  if (v.map === 4 && qVisible && v.k !== 0) out += handle("k", Q.x, Q.y, "Bildpunkt P' auf dem Strahl von O: Streckfaktor k", "lab-handle lab-handle-b");
  // the equations above the plot
  const eq = imageEquation(v);
  out += mtext(24, 24, `Urgraph: ${ORIGINALS_SVG[v.f] ?? ORIGINALS_SVG[0]}`, "lab-text lab-text-a");
  const name = v.map === 0 ? `Verschiebung um v→ = (${fmt(v.vx)} | ${fmt(v.vy)})` : v.map === 4 ? `zentrische Streckung an O, k = ${fmt(v.k)}` : (MAP_NAMES[v.map] ?? "");
  out += text(500, 24, name, "lab-text-muted", "end");
  out += mtext(24, 47, `Bildgraph: ${eq.svg}`, "lab-text lab-text-b lab-text-big");
  out += text(24, 66, `${mapPointRule(v)}   ·   ${mapRule(v)}`, "lab-text-small");
  return out + "</svg>";
}

// ─── The views of the stage ────────────────────────────────────────────────

export const EXPONENTIAL_LOGARITHMUS_VIEWS: Record<"exp-graph" | "growth" | "log-solve" | "log-rules" | "exp-shift" | "log-graph" | "graph-map", LabView> = {
  "exp-graph": {
    render: expGraph,
    handles: {
      k: { y: "k", drag: (p) => ({ k: expGraphPlot().invY(p.y) }) },
      a: {
        y: "a",
        drag: (p, v) => {
          if (v.k === 0) return {};
          const plot = expGraphPlot();
          const y = plot.invY(p.y);
          if (plot.invX(p.x) >= 0) return { a: y / v.k };
          return Math.abs(y) < 1e-6 ? {} : { a: v.k / y };
        },
      },
    },
  },
  growth: {
    render: growth,
    handles: {
      t: { x: "t", drag: (p) => ({ t: growthPlot().invX(p.x) }) },
    },
  },
  "log-solve": {
    render: logSolve,
    handles: {
      b: { y: "b", drag: (p) => ({ b: logSolvePlot().invY(p.y) }) },
      S: { x: "b", drag: (p, v) => ({ b: v.a ** logSolvePlot().invX(p.x) }) },
    },
  },
  "log-rules": {
    render: logRules,
    handles: {
      u: { x: "u", drag: (p) => ({ u: 10 ** ruleL(p.x) }) },
      v: {
        x: "v",
        drag: (p, v) => {
          const L = ruleL(p.x);
          if (v.rule === 0) return { v: 10 ** (L - lg(v.u)) };
          if (v.rule === 1) return { v: 10 ** (lg(v.u) - L) };
          if (v.rule === 3) return { v: 10 ** L };
          return {};
        },
      },
      r: {
        x: "r",
        drag: (p, v) => {
          const lu = lg(v.u);
          return v.rule === 2 && Math.abs(lu) > 0.02 ? { r: ruleL(p.x) / lu } : {};
        },
      },
    },
  },
  "exp-shift": {
    render: expShift,
    handles: {
      P: {
        x: "b",
        y: "k",
        drag: (p, v) => {
          const plot = shiftPlot();
          return { b: plot.invX(p.x), k: plot.invY(p.y) - v.c };
        },
      },
      c: { y: "c", drag: (p) => ({ c: shiftPlot().invY(p.y) }) },
    },
  },
  "log-graph": {
    render: logGraph,
    handles: {
      A: {
        x: "b",
        y: "c",
        drag: (p) => {
          const plot = logGraphPlot();
          return { b: plot.invX(p.x) - 1, c: plot.invY(p.y) };
        },
      },
      k: {
        y: "k",
        drag: (p, v) => {
          const plot = logGraphPlot();
          // the handle sits where log_a(x − b) is 1 or −1; the nearer one decides
          const x = plot.invX(p.x);
          const unit = Math.abs(x - (v.b + v.a)) <= Math.abs(x - (v.b + 1 / v.a)) ? 1 : -1;
          return { k: unit * (plot.invY(p.y) - v.c) };
        },
      },
      b: { x: "b", drag: (p) => ({ b: logGraphPlot().invX(p.x) }) },
    },
  },
  "graph-map": {
    render: graphMap,
    handles: {
      v: {
        x: "vx",
        y: "vy",
        drag: (p, v) => {
          const plot = mapPlot();
          const [px, py] = MAP_POINT[v.f] ?? MAP_POINT[0];
          return { vx: plot.invX(p.x) - px, vy: plot.invY(p.y) - py };
        },
      },
      k: {
        x: "k",
        drag: (p, v) => {
          const plot = mapPlot();
          const [px, py] = MAP_POINT[v.f] ?? MAP_POINT[0];
          return { k: (plot.invX(p.x) * px + plot.invY(p.y) * py) / (px * px + py * py) };
        },
      },
    },
  },
};
