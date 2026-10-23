import { fmt, fracText, shifted, term, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import { arrow, circle, clamp, clipped, esc, handle, type LabView, line, open, path, Plot, polyline, r1, rect, text } from "./svg";

// ─── Shared helpers of this stage ──────────────────────────────────────────

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** An integer as Unicode superscript for plain texts: −2 → "⁻²". */
export function supInt(n: number): string {
  const digits = String(Math.abs(Math.round(n)))
    .split("")
    .map((digit) => SUPERSCRIPT[Number(digit)])
    .join("");
  return `${n < 0 ? "⁻" : ""}${digits}`;
}

/** The root sign with its index for plain texts: √, ∛, ∜, ⁵√. */
export function rootSign(n: number): string {
  if (n === 2) return "√";
  if (n === 3) return "∛";
  if (n === 4) return "∜";
  return `${supInt(n)}√`;
}

/** A number after a plain root sign: "8", "(−8)". */
function radicand(value: number): string {
  return value < 0 ? `(${fmt(value)})` : fmt(value);
}

/** An exponent as a reduced fraction text: 0,5 → "1/2", −3 → "−3". */
export function exponentText(c: number): string {
  for (let q = 1; q <= 12; q++) {
    const p = Math.round(c * q);
    if (Math.abs(p / q - c) < 1e-9) return fracText(p, q);
  }
  return fmt(c, 3);
}

/**
 * y = x^c the way the Realschule defines it: a fraction in the exponent
 * needs x ≥ 0 (x > 0 when it is negative), and x = 0 is no input for c < 0.
 */
export function powerOf(x: number, c: number): number {
  if (x === 0) return c > 0 ? 0 : Number.NaN;
  if (Number.isInteger(c)) return x ** c;
  return x > 0 ? x ** c : Number.NaN;
}

const near = (value: number, target: number) => Math.abs(value - target) < 1e-9 * Math.max(1, Math.abs(target));

/** "=" when the value is exact at `digits` decimals, "≈" otherwise. */
const eqSign = (value: number, digits: number) => (near(value, Number(value.toFixed(digits))) ? "=" : "≈");

/** A positive value as a learner writes it: 4, 1/8, otherwise 1,4142 (exact: false). */
export function valueText(value: number): { text: string; exact: boolean } {
  const whole = Math.round(value);
  if (whole !== 0 && near(value, whole)) return { text: fmt(whole, 0), exact: true };
  const inverse = Math.round(1 / value);
  if (inverse > 1 && near(1 / value, inverse)) return { text: `1/${fmt(inverse, 0)}`, exact: true };
  return { text: fmt(value, 4), exact: false };
}

/** A value with "≈" in front when it is rounded. */
export function approxText(value: number): string {
  const { text: shown, exact } = valueText(value);
  return exact ? shown : `≈ ${shown}`;
}

/** One piece of an SVG text line: plain, or raised and smaller as an exponent. */
interface Seg {
  t: string;
  sup?: boolean;
}

const T = (t: string): Seg => ({ t });
const S = (t: string): Seg => ({ t, sup: true });

/** A text line whose exponents are raised tspans, e.g. 8 with the exponent 2/3. */
function richText(x: number, y: number, segs: Seg[], cls: string, anchor: "start" | "middle" | "end" = "start"): string {
  let out = `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">`;
  let raised = false;
  for (const seg of segs) {
    if (!seg.t) continue;
    const shift = seg.sup && !raised ? -6 : !seg.sup && raised ? 6 : 0;
    raised = Boolean(seg.sup);
    out += `<tspan${shift ? ` dy="${shift}"` : ""}${seg.sup ? ' font-size="75%"' : ""}>${esc(seg.t)}</tspan>`;
  }
  return `${out}</text>`;
}

const charWidth = (cls: string) => (cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : cls.includes("muted") ? 6.7 : 7.3);

function richWidth(segs: Seg[], cls: string): number {
  return segs.reduce((width, seg) => width + seg.t.length * (seg.sup ? 0.75 : 1), 0) * charWidth(cls);
}

/** Rich text lines on a soft panel sized to the longest line. */
function richBox(x: number, y: number, lines: Array<[Seg[], string]>, gap = 23): string {
  const width = Math.max(...lines.map(([segs, cls]) => richWidth(segs, cls))) + 16;
  let out = rect(x - 8, y - 19, width, lines.length * gap + 6, "lab-panel", 'rx="8"');
  lines.forEach(([segs, cls], i) => {
    out += richText(x, y + i * gap, segs, cls);
  });
  return out;
}

/** The plot area left of the info panel, and the panel itself. */
const GRAPH_BOX = { x: 20, y: 14, w: 324, h: 312 };
const PANEL = { x: 352, y: 14, w: 160, h: 312 };

/** A panel line: plain or rich text and its class; an empty text leaves a small gap. */
type PanelLine = [Seg[] | string, string];

function sidePanel(lines: PanelLine[], panel = PANEL): string {
  let out = rect(panel.x, panel.y, panel.w, panel.h, "lab-panel", 'rx="10"');
  let y = panel.y + 24;
  for (const [content, cls] of lines) {
    if (content === "") {
      y += 9;
      continue;
    }
    out += typeof content === "string" ? text(panel.x + 10, y, content, cls) : richText(panel.x + 10, y, content, cls);
    y += cls.includes("big") ? 25 : 20;
  }
  return out;
}

function tick(value: number): string {
  return fmt(Math.round(value * 100) / 100, 2);
}

/** Background, grid and axes of a plot whose x and y steps differ. */
function axesXY(plot: Plot, xStep: number, yStep: number, xLabelEvery: number, yLabelEvery: number): string {
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
  out += text(box.x + box.w - 4, y0 - 6, "x", "lab-text-axis", "end");
  out += text(x0 + 6, box.y + 10, "y", "lab-text-axis");
  for (let x = Math.ceil(plot.xmin / xLabelEvery) * xLabelEvery; x <= plot.xmax - 0.5 * xLabelEvery + 1e-9; x += xLabelEvery) {
    if (Math.abs(x) > 1e-9) out += text(plot.X(x), y0 + 13, tick(x), "lab-text-tick", "middle");
  }
  for (let y = Math.ceil(plot.ymin / yLabelEvery) * yLabelEvery; y <= plot.ymax - 0.5 * yLabelEvery + 1e-9; y += yLabelEvery) {
    if (Math.abs(y) > 1e-9) out += text(x0 - 5, plot.Y(y) + 4, tick(y), "lab-text-tick", "end");
  }
  return out;
}

/**
 * A parametric curve t ↦ point(t) as one path. Samples crowd at both ends,
 * where a pole or the vertical tangent of a root sits, and both coordinates
 * are clamped just outside the box, so a branch runs into the frame instead
 * of stopping short. Wrap it in clipped().
 */
function curve(plot: Plot, point: (t: number) => [number, number], t0: number, t1: number, cls: string, samples = 240): string {
  if (!(t1 > t0)) return "";
  const spanX = plot.xmax - plot.xmin;
  const spanY = plot.ymax - plot.ymin;
  let d = "";
  for (let i = 0; i <= samples; i++) {
    const t = t0 + ((t1 - t0) * (1 - Math.cos((Math.PI * i) / samples))) / 2;
    const [x, y] = point(t);
    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
    const px = plot.X(clamp(x, plot.xmin - spanX, plot.xmax + spanX));
    const py = plot.Y(clamp(y, plot.ymin - spanY, plot.ymax + spanY));
    d += `${d ? "L" : "M"}${r1(px)} ${r1(py)} `;
  }
  return d ? path(d.trim(), cls) : "";
}

/** The graph of f between x0 and x1 (see curve). */
function branch(plot: Plot, f: (x: number) => number, x0: number, x1: number, cls: string): string {
  return curve(plot, (t) => [t, f(t)], x0, x1, cls);
}

/** The mirror image of the graph of f between x0 and x1 at the line y = x. */
function mirrored(plot: Plot, f: (x: number) => number, x0: number, x1: number, cls: string): string {
  return curve(plot, (t) => [f(t), t], x0, x1, cls);
}

/**
 * The branches of a power graph whose special point sits at x = s: two
 * around a pole (c < 0), one from the start of a root function, one for a
 * whole parabola. The curve never crosses the pole.
 */
function powerBranches(plot: Plot, f: (x: number) => number, s: number, c: number, cls: string): string {
  if (c < 0) return branch(plot, f, plot.xmin, s, cls) + branch(plot, f, s, plot.xmax, cls);
  if (!Number.isInteger(c)) return branch(plot, f, s, plot.xmax, cls);
  return branch(plot, f, plot.xmin, plot.xmax, cls);
}

/** An arrow in the colour of side a or b, with a filled head. */
function colouredArrow(x1: number, y1: number, x2: number, y2: number, colour: "a" | "b"): string {
  const len = Math.hypot(x2 - x1, y2 - y1);
  if (len < 1) return "";
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const head = Math.min(10, len / 2);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const wing = head * 0.55;
  return (
    line(x1, y1, bx, by, `lab-side-${colour}`) +
    `<polygon points="${r1(x2)},${r1(y2)} ${r1(bx - uy * wing)},${r1(by + ux * wing)} ${r1(bx + uy * wing)},${r1(by - ux * wing)}" class="lab-bar-${colour}" />`
  );
}

function point(x: number, y: number): string {
  return `(${fmt(x, 2)} | ${fmt(y, 3)})`;
}

// ─── 4.1 Die Potenzleiter ──────────────────────────────────────────────────

export const LADDER_BASES = [2, 4, 8, 9, 16, 27];

/** Sub-step k of the ladder (the numerator of the exponent k/q) in SVG x. */
const LADDER = { cx: 276, y: 214, unit: 25, row1: 134, row2: 174 };
const ladderX = (k: number) => LADDER.cx + k * LADDER.unit;

/** The value a^(k/q) of ladder step k. */
export function ladderValue(a: number, k: number, q: number): number {
  return a ** (k / q);
}

function powerRules(v: LabValues): string {
  const { a, q, m, n } = v;
  const sum = m + n;
  const r = fracText(m, q);
  const s = fracText(n, q);
  let out = open("Die Potenzleiter: Potenzen mit gleicher Basis multiplizieren heißt, ihre Stufen aneinanderzuhängen");
  // the ladder: one tick per sub-step 1/q, whole exponents taller
  out += arrow(ladderX(-8) - 14, LADDER.y, ladderX(8) + 20, LADDER.y, "lab-axis", 1.4);
  for (let k = -8; k <= 8; k++) {
    const whole = k % q === 0;
    out += line(ladderX(k), LADDER.y - (whole ? 8 : 4), ladderX(k), LADDER.y + (whole ? 8 : 4), whole ? "lab-ink" : "lab-thin");
    out += text(ladderX(k), LADDER.y + 22, fracText(k, q), "lab-text-tick", "middle");
  }
  out += text(6, LADDER.y + 22, "Exponent", "lab-text-small");
  out += text(6, LADDER.y + 43, "Wert", "lab-text-small");
  // values at the whole exponents, unless they collide with the result
  const result = approxText(ladderValue(a, sum, q));
  const resultWidth = result.length * 7.8;
  const resultX = clamp(ladderX(sum), resultWidth / 2 + 6, 514 - resultWidth / 2);
  const taken: Array<[number, number]> = [[resultX - resultWidth / 2, resultX + resultWidth / 2]];
  for (const j of [0, 1, -1, 2, -2]) {
    const k = j * q;
    if (Math.abs(k) > 8 || k === sum) continue;
    const label = valueText(ladderValue(a, k, q)).text;
    const half = (label.length * 5.6) / 2;
    const [left, right] = [ladderX(k) - half, ladderX(k) + half];
    if (taken.some(([l, r]) => left < r + 5 && right > l - 5)) continue;
    taken.push([left, right]);
    out += text(ladderX(k), LADDER.y + 43, label, "lab-text-tick", "middle");
  }
  // the two factors as arrows, the second one hung onto the first
  out += line(ladderX(0), LADDER.row1, ladderX(0), LADDER.y, "lab-dashed");
  out += line(ladderX(m), LADDER.row1, ladderX(m), LADDER.y, "lab-dashed");
  out += line(ladderX(sum), LADDER.row2, ladderX(sum), LADDER.y, "lab-dashed");
  out += colouredArrow(ladderX(0), LADDER.row1, ladderX(m), LADDER.row1, "a");
  out += colouredArrow(ladderX(m), LADDER.row2, ladderX(sum), LADDER.row2, "b");
  out += richText((ladderX(0) + ladderX(m)) / 2, LADDER.row1 - 13, [T(`· ${a}`), S(r)], "lab-text lab-text-a", "middle");
  out += richText((ladderX(m) + ladderX(sum)) / 2, LADDER.row2 - 13, [T(`· ${a}`), S(s)], "lab-text lab-text-b", "middle");
  out += circle(ladderX(0), LADDER.y, 4, "lab-point");
  out += circle(ladderX(sum), LADDER.y, 7, "lab-point-ok");
  out += text(resultX, LADDER.y + 43, result, "lab-text lab-text-ok", "middle");
  // the equation and its values
  const left = valueText(ladderValue(a, m, q));
  const right = valueText(ladderValue(a, n, q));
  const both = valueText(ladderValue(a, m, q) * ladderValue(a, n, q));
  const exact = left.exact && right.exact && both.exact;
  out += richBox(24, 38, [
    [[T(`${a}`), S(r), T(" · "), T(`${a}`), S(s), T(" = "), T(`${a}`), S(fracText(sum, q))], "lab-text lab-text-big"],
    [[T(`${left.text} · ${right.text} ${exact ? "=" : "≈"} ${both.text}`)], "lab-text-muted"],
  ]);
  const step = valueText(ladderValue(a, 1, q));
  out += richText(
    14,
    LADDER.y + 76,
    q === 1
      ? [T(`Eine Stufe nach rechts heißt · ${a}, eine nach links : ${a}.`)]
      : [T(`${q} Teilstufen sind eine Stufe. Eine Teilstufe: · ${a}`), S(`1/${q}`), T(` = · ${rootSign(q)}${a} ${step.exact ? "=" : "≈"} · ${step.text}`)],
    "lab-text",
  );
  out += text(14, LADDER.y + 98, "Nach links (negativer Exponent) wird geteilt: a hoch −r = 1 : a hoch r.", "lab-text-small");
  out += handle("m", ladderX(m), LADDER.row1, "Ende des ersten Pfeils: Zähler m", "lab-handle lab-handle-a");
  out += handle("n", ladderX(sum), LADDER.row2, "Ende des zweiten Pfeils: Zähler n", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

// ─── 4.2 Die Wurzel als Schnittstelle ──────────────────────────────────────

const rootPlot = () => new Plot(-4, 6, -18, 34, GRAPH_BOX);

/** The real solutions of xⁿ = a, sorted. */
export function powerEquationSolutions(n: number, a: number): number[] {
  if (a === 0) return [0];
  const root = Math.abs(a) ** (1 / n);
  if (n % 2 === 0) return a > 0 ? [-root, root] : [];
  return [a > 0 ? root : -root];
}

function rootPower(v: LabValues): string {
  const plot = rootPlot();
  const { n, a } = v;
  const f = (x: number) => x ** n;
  const solutions = powerEquationSolutions(n, a);
  let out = open("Der Graph von y = x hoch n und die Gerade y = a: Die n-te Wurzel ist die Schnittstelle");
  out += plot.clip("clip-root") + axesXY(plot, 1, 4, 1, 8);
  out += clipped(
    "clip-root",
    branch(plot, f, plot.xmin, 0, "lab-ghost") +
      branch(plot, f, 0, plot.xmax, "lab-curve") +
      line(plot.X(plot.xmin), plot.Y(a), plot.X(plot.xmax), plot.Y(a), "lab-curve-2"),
  );
  const top = 30 ** (1 / n);
  out += richText(plot.X(top) - 8, plot.Y(30), [T("y = x"), S(String(n))], "lab-text lab-text-a", "end");
  for (const x of solutions) {
    const P = plot.P(x, a);
    out += line(P.x, P.y, P.x, plot.Y(0), "lab-dashed");
    out += circle(P.x, P.y, 6, x >= 0 ? "lab-point-ok" : "lab-point-b");
    const label = x >= 0 ? `${rootSign(n)}${radicand(a)} ${eqSign(x, 2)} ${fmt(x, 2)}` : `x ${eqSign(x, 2)} ${fmt(x, 2)}`;
    out += text(P.x, a >= 0 ? plot.Y(0) + 28 : plot.Y(0) - 10, label, x >= 0 ? "lab-text lab-text-ok" : "lab-text lab-text-b", "middle");
  }
  const lines: PanelLine[] = [[[T("x"), S(String(n)), T(` = ${fmt(a)}`)], "lab-text lab-text-big"]];
  if (a >= 0) {
    const root = a ** (1 / n);
    lines.push([[T(`${rootSign(n)}${radicand(a)} = ${radicand(a)}`), S(`1/${n}`)], "lab-text"], [`${eqSign(root, 3)} ${fmt(root, 3)}`, "lab-text lab-text-ok"]);
  } else {
    lines.push([`${rootSign(n)}${radicand(a)} ist nicht`, "lab-text"], ["definiert (a < 0).", "lab-text"]);
  }
  lines.push(["", ""], ["Lösungen von xⁿ = a:", "lab-text-muted"]);
  if (solutions.length === 0) lines.push(["keine Lösung", "lab-text lab-text-bad"]);
  if (solutions.length === 1) lines.push([`x ${eqSign(solutions[0], 3)} ${fmt(solutions[0], 3)}`, "lab-text"]);
  if (solutions.length === 2) {
    lines.push([`x₁ ${eqSign(solutions[0], 3)} ${fmt(solutions[0], 3)}`, "lab-text"], [`x₂ ${eqSign(solutions[1], 3)} ${fmt(solutions[1], 3)}`, "lab-text"]);
  }
  lines.push(["", ""]);
  if (n % 2 === 0) {
    lines.push(["n gerade: xⁿ ist nie", "lab-text-small"], ["negativ, und x und −x", "lab-text-small"], ["haben dieselbe Potenz.", "lab-text-small"]);
  } else {
    lines.push(["n ungerade: genau eine", "lab-text-small"], ["Lösung, bei a < 0", "lab-text-small"], ["eine negative.", "lab-text-small"]);
  }
  out += sidePanel(lines);
  const H = plot.P(5.3, a);
  out += text(H.x - 14, H.y - 10, "y = a", "lab-text-small lab-text-b", "end");
  out += handle("a", H.x, H.y, "Gerade y = a");
  out += `</svg>`;
  return out;
}

// ─── 4.3 Der Zoo der Potenzfunktionen ──────────────────────────────────────

export const ZOO_EXPONENTS = [-3, -2, -1, -0.5, 1 / 3, 0.5, 2, 3, 4];

const zooPlot = () => new Plot(-3.24, 3.24, -2.6, 3.64, GRAPH_BOX);

/** Definition set, value set, symmetry and asymptotes of y = x^c. */
export function basicSets(c: number): { D: string; W: string; symmetry: string; asymptotes: string } {
  const asymptotes = c < 0 ? "x = 0 und y = 0" : "keine";
  if (!Number.isInteger(c)) {
    return { D: c > 0 ? "ℝ₀⁺" : "ℝ⁺", W: c > 0 ? "ℝ₀⁺" : "ℝ⁺", symmetry: "keine", asymptotes };
  }
  const even = c % 2 === 0;
  const symmetry = even ? "achsensymmetrisch zur y-Achse" : "punktsymmetrisch zum Ursprung";
  if (c > 0) return { D: "ℝ", W: even ? "ℝ₀⁺" : "ℝ", symmetry, asymptotes };
  return { D: "ℝ ∖ {0}", W: even ? "ℝ⁺" : "ℝ ∖ {0}", symmetry, asymptotes };
}

function powerGraph(v: LabValues): string {
  const plot = zooPlot();
  const { c, x } = v;
  const f = (t: number) => powerOf(t, c);
  const { box } = plot;
  let out = open("Der Graph einer Potenzfunktion y = x hoch c mit einem Punkt P und seinem Partner an der Stelle −x");
  out += plot.clip("clip-zoo") + plot.grid(1, 1);
  let curves = "";
  if (c < 0) {
    curves += line(plot.X(0), box.y, plot.X(0), box.y + box.h, "lab-curve-c") + line(box.x, plot.Y(0), box.x + box.w, plot.Y(0), "lab-curve-c");
  }
  curves += powerBranches(plot, f, 0, c, "lab-curve");
  out += clipped("clip-zoo", curves);
  // the points every graph of this kind passes through
  const common: Array<[number, number]> = [[1, 1]];
  if (c > 0) common.push([0, 0]);
  if (Number.isInteger(c)) common.push([-1, c % 2 === 0 ? 1 : -1]);
  for (const [px, py] of common) {
    const P = plot.P(px, py);
    out += circle(P.x, P.y, 4, "lab-point");
    if (px === 0) continue;
    // beside the point on the side the graph leaves free
    const below = (c > 0) === (py > 0);
    out += text(P.x + (px > 0 ? 8 : -8), P.y + (below ? 16 : -9),`(${fmt(px)} | ${fmt(py)})`, "lab-text-small", px > 0 ? "start" : "end");
  }
  const y = f(x);
  const yMirror = f(-x);
  const H = plot.P(x, 0);
  if (Number.isFinite(y) && plot.contains(x, y)) {
    const P = plot.P(x, y);
    if (x !== 0 && Number.isFinite(yMirror) && plot.contains(-x, yMirror)) {
      const Q = plot.P(-x, yMirror);
      out += line(P.x, P.y, Q.x, Q.y, "lab-dashed");
      out += circle(Q.x, Q.y, 6, "lab-point-b");
      out += text(Q.x + (x > 0 ? -10 : 10), Q.y - 9, "P′", "lab-text lab-text-b", x > 0 ? "end" : "start");
    }
    out += line(H.x, H.y, P.x, P.y, "lab-dashed");
    out += circle(P.x, P.y, 6, "lab-point-a");
    out += text(P.x + (x >= 0 ? 10 : -10), P.y - 9, "P", "lab-text lab-text-a", x >= 0 ? "start" : "end");
  }
  const sets = basicSets(c);
  const alias = c === 0.5 ? " = √x" : c === 1 / 3 ? " = ∛x" : c === -0.5 ? " = 1 : √x" : c === -1 ? " = 1 : x" : c < 0 ? ` = 1 : x${supInt(-c)}` : "";
  const lines: PanelLine[] = [
    [[T("y = x"), S(exponentText(c)), T(alias)], "lab-text lab-text-big"],
    [`𝔻 = ${sets.D}`, "lab-text"],
    [`𝕎 = ${sets.W}`, "lab-text"],
    ["", ""],
    ["Symmetrie:", "lab-text-muted"],
  ];
  if (sets.symmetry === "keine") lines.push(["keine (nur x ≥ 0)", "lab-text-small"]);
  else {
    const axial = sets.symmetry.startsWith("achsen");
    lines.push([axial ? "achsensymmetrisch" : "punktsymmetrisch", "lab-text-small"], [axial ? "zur y-Achse" : "zum Ursprung", "lab-text-small"]);
  }
  lines.push(["Asymptoten:", "lab-text-muted"], [sets.asymptotes, c < 0 ? "lab-text lab-text-c" : "lab-text"], ["", ""]);
  lines.push([Number.isFinite(y) ? `P${point(x, y)}` : `P: ${fmt(x, 2)} ∉ 𝔻`, "lab-text-small"]);
  if (x !== 0) lines.push([Number.isFinite(yMirror) ? `P′${point(-x, yMirror)}` : `P′: ${fmt(-x, 2)} ∉ 𝔻`, "lab-text-small"]);
  out += sidePanel(lines);
  out += handle("x", H.x, H.y, "Stelle x von P");
  out += `</svg>`;
  return out;
}

// ─── 4.4 Verschieben und Strecken ──────────────────────────────────────────

export const SHIFT_EXPONENTS = [-2, -1, 0.5, 2, 3];

const shiftPlot = () => new Plot(-6, 6, -6, 6, GRAPH_BOX);

/** y = a(x + b)^c + d at x. */
export function shiftedPower(a: number, b: number, c: number, d: number, x: number): number {
  return a * powerOf(x + b, c) + d;
}

/** Definition set, value set and asymptotes of y = a(x + b)^c + d. */
export function shiftedSets(a: number, b: number, c: number, d: number): { D: string; W: string; asymptotes: string } {
  const xb = fmt(-b);
  const yd = fmt(d);
  const D = c < 0 ? `ℝ ∖ {${xb}}` : Number.isInteger(c) ? "ℝ" : `{x | x ≥ ${xb}}`;
  let W: string;
  if (a === 0) W = `{${yd}}`;
  else if (Number.isInteger(c) && Math.abs(c) % 2 === 1) W = c < 0 ? `ℝ ∖ {${yd}}` : "ℝ";
  else {
    const strict = c < 0;
    W = `{y | y ${a > 0 ? (strict ? ">" : "≥") : strict ? "<" : "≤"} ${yd}}`;
  }
  return { D, W, asymptotes: c < 0 && a !== 0 ? `x = ${xb} und y = ${yd}` : "keine" };
}

/** The factor in front of a term: "", "−", "2", "−0,5". */
function factor(a: number): string {
  return a === 1 ? "" : a === -1 ? "−" : fmt(a);
}

/** y = a(x + b)^c + d as plain text with Unicode exponents; c = 1/2 as a square root. */
export function shiftedPowerText(a: number, b: number, c: number, d: number): string {
  if (a === 0) return `y = ${fmt(d)}`;
  const base = shifted(-b);
  const core = c === 0.5 ? `${factor(a)}√${base}` : `${factor(a)}${base}${supInt(c)}`;
  return `y = ${core}${term(d, "", false)}`;
}

function shiftedPowerSegs(a: number, b: number, c: number, d: number): Seg[] {
  if (a === 0) return [T(`y = ${fmt(d)}`)];
  return [T(`y = ${factor(a)}${shifted(-b)}`), S(exponentText(c)), T(term(d, "", false))];
}

/** The target point of the root goal. */
export const SHIFT_TARGET = { x: 2, y: 5 };

function powerShift(v: LabValues): string {
  const plot = shiftPlot();
  const { a, b, c, d } = v;
  const { box } = plot;
  const f = (x: number) => shiftedPower(a, b, c, d, x);
  let out = open("Der Graph von y = a mal (x + b) hoch c plus d mit ziehbarem Punkt M und Streckpunkt");
  out += plot.clip("clip-shift") + plot.grid(1, 2);
  let curves = powerBranches(plot, (x) => powerOf(x, c), 0, c, "lab-ghost");
  if (c < 0 && a !== 0) {
    curves += line(plot.X(-b), box.y, plot.X(-b), box.y + box.h, "lab-curve-c") + line(box.x, plot.Y(d), box.x + box.w, plot.Y(d), "lab-curve-c");
  }
  curves += powerBranches(plot, f, -b, c, "lab-curve");
  out += clipped("clip-shift", curves);
  if (c < 0 && a !== 0) {
    // at the ends the axis names leave free: bottom for x = −b, left for y = d
    out += text(plot.X(-b) + 5, box.y + box.h - 8, `x = ${fmt(-b)}`, "lab-text-small lab-text-c");
    out += text(box.x + 5, plot.Y(d) - 6, `y = ${fmt(d)}`, "lab-text-small lab-text-c");
  }
  const hit = Math.abs(f(SHIFT_TARGET.x) - SHIFT_TARGET.y) < 1e-9;
  const target = plot.P(SHIFT_TARGET.x, SHIFT_TARGET.y);
  out += circle(target.x, target.y, 7, hit ? "lab-point-ok" : "lab-target");
  out += text(target.x + 10, target.y + 16, "T(2 | 5)", "lab-text-small");
  const M = plot.P(-b, d);
  const A = plot.P(-b + 1, d + a);
  out += polyline([M, plot.P(-b + 1, d), A], "lab-dashed");
  out += text(M.x - 10, M.y + 18, "M", "lab-text lab-text-c", "end");
  out += text(A.x + 12, A.y + 4, "a", "lab-text lab-text-b");
  const sets = shiftedSets(a, b, c, d);
  const lines: PanelLine[] = [[shiftedPowerSegs(a, b, c, d), "lab-text lab-text-a"]];
  if (c === 0.5 && a !== 0) lines.push([`= ${shiftedPowerText(a, b, c, d).slice(4)}`, "lab-text-muted"]);
  lines.push(["", ""], [`M(${fmt(-b)} | ${fmt(d)})`, "lab-text lab-text-c"], [`𝔻 = ${sets.D}`, "lab-text"], [`𝕎 = ${sets.W}`, "lab-text"], ["", ""], ["Asymptoten:", "lab-text-muted"]);
  if (sets.asymptotes === "keine") lines.push(["keine", "lab-text"]);
  else lines.push([`x = ${fmt(-b)}`, "lab-text"], [`y = ${fmt(d)}`, "lab-text"]);
  lines.push(["", ""]);
  if (a === 0) lines.push(["a = 0: keine", "lab-text-small lab-text-bad"], ["Potenzfunktion", "lab-text-small lab-text-bad"]);
  else lines.push(["Von M aus 1 nach rechts", "lab-text-small"], [`und ${fmt(a)} nach oben: Punkt a`, "lab-text-small"]);
  out += sidePanel(lines);
  out += handle("M", M.x, M.y, "Punkt M(−b | d): verschieben");
  out += handle("A", A.x, A.y, "Punkt (−b + 1 | d + a): strecken", "lab-handle lab-handle-b");
  out += `</svg>`;
  return out;
}

// ─── 4.5 Der Spiegel y = x ─────────────────────────────────────────────────

export const MIRROR_EXPONENTS = [2, -2, 0.5, -1];

const MIRROR_BOX = { x: 20, y: 14, w: 312, h: 312 };
const MIRROR_PANEL = { x: 340, y: 14, w: 172, h: 312 };
const mirrorPlot = () => new Plot(-5, 5, -5, 5, MIRROR_BOX);

/** f: y = (x + b)^c + d with its (restricted) domain, and its inverse where there is one. */
export interface MirrorCase {
  f: (x: number) => number;
  inD: (x: number) => boolean;
  invertible: boolean;
  /** f⁻¹ where it is defined, NaN elsewhere (also when f is not invertible). */
  inverse: (x: number) => number;
  fText: string;
  D: string;
  W: string;
  invText: string;
  Dinv: string;
  Winv: string;
}

export function mirrorCase(v: LabValues): MirrorCase {
  const { c, b, d } = v;
  const s = -b;
  const restricted = v.r === 1;
  const f = (x: number) => powerOf(x + b, c) + d;
  const xs = fmt(s);
  const yd = fmt(d);
  const minusB = term(-b, "", false);
  if (c === 2) {
    return {
      f,
      inD: (x) => !restricted || x >= s,
      invertible: restricted,
      inverse: (x) => (restricted && x >= d ? Math.sqrt(x - d) - b : Number.NaN),
      fText: `y = ${vertexForm(1, s, d)}`,
      D: restricted ? `{x | x ≥ ${xs}}` : "ℝ",
      W: `{y | y ≥ ${yd}}`,
      invText: restricted ? `y = √${shifted(d)}${minusB}` : "nicht umkehrbar",
      Dinv: restricted ? `{x | x ≥ ${yd}}` : "–",
      Winv: restricted ? `{y | y ≥ ${xs}}` : "–",
    };
  }
  if (c === -2) {
    return {
      f,
      inD: (x) => (restricted ? x > s : x !== s),
      invertible: restricted,
      inverse: (x) => (restricted && x > d ? 1 / Math.sqrt(x - d) - b : Number.NaN),
      fText: `y = ${shifted(s)}⁻²${term(d, "", false)}`,
      D: restricted ? `{x | x > ${xs}}` : `ℝ ∖ {${xs}}`,
      W: `{y | y > ${yd}}`,
      invText: restricted ? `y = 1/√${shifted(d)}${minusB}` : "nicht umkehrbar",
      Dinv: restricted ? `{x | x > ${yd}}` : "–",
      Winv: restricted ? `{y | y > ${xs}}` : "–",
    };
  }
  if (c === 0.5) {
    return {
      f,
      inD: (x) => x >= s,
      invertible: true,
      inverse: (x) => (x >= d ? (x - d) ** 2 - b : Number.NaN),
      fText: `y = √${shifted(s)}${term(d, "", false)}`,
      D: `{x | x ≥ ${xs}}`,
      W: `{y | y ≥ ${yd}}`,
      invText: `y = ${vertexForm(1, d, -b)}`,
      Dinv: `{x | x ≥ ${yd}}`,
      Winv: `{y | y ≥ ${xs}}`,
    };
  }
  return {
    f,
    inD: (x) => x !== s,
    invertible: true,
    inverse: (x) => (x !== d ? 1 / (x - d) - b : Number.NaN),
    fText: `y = ${shifted(s)}⁻¹${term(d, "", false)}`,
    D: `ℝ ∖ {${xs}}`,
    W: `ℝ ∖ {${yd}}`,
    invText: `y = ${shifted(d)}⁻¹${minusB}`,
    Dinv: `ℝ ∖ {${yd}}`,
    Winv: `ℝ ∖ {${xs}}`,
  };
}

/** P on the graph of f at x and its mirror partner P′, when both lie in the drawing. */
export function mirrorPoints(v: LabValues): { P: [number, number]; Q: [number, number] } | null {
  const mc = mirrorCase(v);
  if (!mc.inD(v.x)) return null;
  const y = mc.f(v.x);
  if (!Number.isFinite(y) || Math.abs(y) > 5) return null;
  return { P: [v.x, y], Q: [y, v.x] };
}

function inverseMirror(v: LabValues): string {
  const plot = mirrorPlot();
  const { c, d } = v;
  const s = -v.b;
  const mc = mirrorCase(v);
  const { box } = plot;
  const even = c === 2 || c === -2;
  let out = open("Der Graph einer Funktion f und sein Spiegelbild an der Geraden y = x");
  out += plot.clip("clip-mirror") + plot.grid(1, 1);
  let curves = line(plot.X(-5), plot.Y(-5), plot.X(5), plot.Y(5), "lab-ghost");
  if (c < 0) {
    for (const xv of [s, d]) curves += line(plot.X(xv), box.y, plot.X(xv), box.y + box.h, "lab-dashed");
    for (const yv of [d, s]) curves += line(box.x, plot.Y(yv), box.x + box.w, plot.Y(yv), "lab-dashed");
  }
  // the parts of f: the domain in blue, a part cut off by the restriction in grey
  const parts: Array<[number, number]> = c === 0.5 || (even && v.r === 1) ? [[s, 5]] : c === 2 ? [[-5, 5]] : [[-5, s], [s, 5]];
  if (even && v.r === 1) curves += branch(plot, mc.f, -5, s, "lab-ghost");
  for (const [x0, x1] of parts) curves += branch(plot, mc.f, x0, x1, "lab-curve");
  for (const [x0, x1] of parts) curves += mirrored(plot, mc.f, x0, x1, "lab-curve-2");
  out += clipped("clip-mirror", curves);
  out += text(plot.X(4.6), plot.Y(4.2), "y = x", "lab-text-small", "end");
  const lines: PanelLine[] = [
    [`f: ${mc.fText}`, "lab-text-muted lab-text-a"],
    [`𝔻 = ${mc.D}`, "lab-text-small"],
    [`𝕎 = ${mc.W}`, "lab-text-small"],
    ["", ""],
  ];
  if (mc.invertible) {
    lines.push(["Umkehrfunktion f⁻¹:", "lab-text-muted"], [mc.invText, "lab-text-muted lab-text-b"], [`𝔻 = ${mc.Dinv}`, "lab-text-small"], [`𝕎 = ${mc.Winv}`, "lab-text-small"]);
  } else {
    // a vertical line meets the mirror image twice: it is no graph of a function
    const xt = d + 1.5;
    const w = c === 2 ? Math.sqrt(1.5) : 1 / Math.sqrt(1.5);
    out += line(plot.X(xt), box.y, plot.X(xt), box.y + box.h, "lab-thin lab-bad-stroke");
    for (const yt of [s - w, s + w]) out += circle(plot.X(xt), plot.Y(yt), 5, "lab-point-bad");
    out += text(plot.X(xt) + 5, box.y + box.h - 8, "zwei y-Werte", "lab-text-small lab-text-bad");
    lines.push(
      ["f ist nicht umkehrbar:", "lab-text-muted lab-text-bad"],
      [`f(${fmt(s - w, 2)}) = f(${fmt(s + w, 2)}) = ${fmt(xt, 2)}`, "lab-text-small"],
      ["Das Spiegelbild ist kein", "lab-text-small"],
      ["Funktionsgraph.", "lab-text-small"],
    );
  }
  const points = mirrorPoints(v);
  lines.push(["", ""]);
  if (points) {
    const P = plot.P(...points.P);
    const Q = plot.P(...points.Q);
    out += line(P.x, P.y, Q.x, Q.y, "lab-dashed");
    out += circle((P.x + Q.x) / 2, (P.y + Q.y) / 2, 2.5, "lab-dot-small");
    out += text(P.x + 11, P.y - 9, "P", "lab-text lab-text-a");
    out += text(Q.x + 11, Q.y - 9, "P′", "lab-text lab-text-b");
    lines.push([`P${point(points.P[0], points.P[1])}`, "lab-text-small"], [`P′${point(points.Q[0], points.Q[1])}`, "lab-text-small"]);
    out += sidePanel(lines, MIRROR_PANEL);
    out += handle("P", P.x, P.y, "Punkt P auf dem Graphen von f", "lab-handle lab-handle-a");
    out += handle("Q", Q.x, Q.y, "Spiegelpunkt P′", "lab-handle lab-handle-b");
  } else {
    const inside = mc.inD(v.x);
    lines.push([inside ? "P liegt außerhalb der" : `P: x = ${fmt(v.x, 2)} liegt nicht`, "lab-text-small"], [inside ? "Zeichnung." : "in 𝔻.", "lab-text-small"]);
    out += sidePanel(lines, MIRROR_PANEL);
  }
  out += `</svg>`;
  return out;
}

export const POTENZEN_VIEWS: Record<"power-rules" | "root-power" | "power-graph" | "power-shift" | "inverse-mirror", LabView> = {
  "power-rules": {
    render: powerRules,
    handles: {
      m: { x: "m", drag: (p) => ({ m: (p.x - LADDER.cx) / LADDER.unit }) },
      n: { x: "n", drag: (p, v) => ({ n: (p.x - LADDER.cx) / LADDER.unit - v.m }) },
    },
  },
  "root-power": {
    render: rootPower,
    handles: {
      a: { y: "a", drag: (p) => ({ a: rootPlot().invY(p.y) }) },
    },
  },
  "power-graph": {
    render: powerGraph,
    handles: {
      x: { x: "x", drag: (p) => ({ x: zooPlot().invX(p.x) }) },
    },
  },
  "power-shift": {
    render: powerShift,
    handles: {
      M: {
        x: "b",
        y: "d",
        drag: (p) => {
          const plot = shiftPlot();
          return { b: -plot.invX(p.x), d: plot.invY(p.y) };
        },
      },
      A: { y: "a", drag: (p, v) => ({ a: shiftPlot().invY(p.y) - v.d }) },
    },
  },
  "inverse-mirror": {
    render: inverseMirror,
    handles: {
      P: { x: "x", drag: (p) => ({ x: mirrorPlot().invX(p.x) }) },
      Q: { y: "x", drag: (p) => ({ x: mirrorPlot().invY(p.y) }) },
    },
  },
};
