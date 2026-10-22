import { fmt, linear, paren, quadratic, round, shifted, term, vertexForm } from "../exercises/format";
import type { LabValues } from "../model/types";
import {
  arrow,
  circle,
  clipped,
  handle,
  infoBox,
  type LabView,
  line,
  open,
  Plot,
  type Pt,
  rect,
  text,
} from "./svg";

// ─── Shared helpers ─────────────────────────────────────────────────────────

/** "=" when `value` is exact at `digits` decimals, "≈" when it is shown rounded. */
export function rel(value: number, digits = 2): string {
  return Math.abs(value - round(value, digits)) < 1e-9 ? "=" : "≈";
}

/** The real solutions of a·x² + b·x + c = 0, sorted; empty when there are none. */
export function quadraticRoots(a: number, b: number, c: number): number[] {
  if (a === 0) return b === 0 ? [] : [-c / b];
  const D = b * b - 4 * a * c;
  if (D < 0) return [];
  if (D === 0) return [-b / (2 * a)];
  const r = Math.sqrt(D);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((p, q) => p - q);
}

/** The vertex of y = a·x² + b·x + c (a ≠ 0). */
export function vertexOf(a: number, b: number, c: number): { x: number; y: number } {
  return { x: -b / (2 * a), y: c - (b * b) / (4 * a) };
}

type Line = [string, string];

/** The size infoBox() gives a panel with these lines. */
function panelSize(lines: Line[]): { w: number; h: number } {
  const shown = lines.filter(([content]) => content);
  const widthOf = ([content, cls]: Line) => content.length * (cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : 7.3);
  return { w: Math.max(0, ...shown.map(widthOf)) + 16, h: shown.length * 20 + 8 };
}

/**
 * An info panel in the corner of the plot where it hides the fewest curve
 * points and no handle, so the drawing stays readable wherever the learner
 * drags the parabola.
 */
function placeInfo(plot: Plot, lines: Line[], avoid: Pt[], curves: Array<(x: number) => number>): string {
  const { w, h } = panelSize(lines);
  const { x: bx, y: by, w: bw, h: bh } = plot.box;
  const candidates = [
    { x: bx + 14, y: by + 22, anchor: "start" as const },
    { x: bx + bw - 14, y: by + 22, anchor: "end" as const },
    { x: bx + 14, y: by + bh - h + 11, anchor: "start" as const },
    { x: bx + bw - 14, y: by + bh - h + 11, anchor: "end" as const },
  ];
  const samples: Pt[] = [];
  for (const f of curves) {
    for (let i = 0; i <= 160; i++) {
      const x = plot.xmin + ((plot.xmax - plot.xmin) * i) / 160;
      const y = f(x);
      if (Number.isFinite(y) && y >= plot.ymin && y <= plot.ymax) samples.push(plot.P(x, y));
    }
  }
  let best = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const left = candidate.anchor === "start" ? candidate.x - 8 : candidate.x - w + 8;
    const top = candidate.y - 17;
    const inside = (p: Pt, pad: number) => p.x >= left - pad && p.x <= left + w + pad && p.y >= top - pad && p.y <= top + h + pad;
    const score = samples.filter((p) => inside(p, 2)).length + 60 * avoid.filter((p) => inside(p, 14)).length;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return infoBox(best.x, best.y, lines, best.anchor);
}

/** A point label in the drawing, e.g. "P(2 | −1)". */
function pointText(name: string, x: number, y: number, digits = 2): string {
  return `${name}(${fmt(x, digits)} | ${fmt(y, digits)})`;
}

// ─── 7.1 Parabeln und ihre Parameter ───────────────────────────────────────

const paramsPlot = () => new Plot(-9, 9, -6, 6);

/** Opening and shape of y = a(x − x_S)² + y_S compared with the normal parabola. */
export function shapeOf(a: number): string {
  if (a === 0) return "a = 0: keine Parabel, sondern eine Gerade";
  const opening = a > 0 ? "nach oben geöffnet" : "nach unten geöffnet";
  const size = Math.abs(a);
  const form = size > 1 ? "gestreckt (schmaler)" : size < 1 ? "gestaucht (breiter)" : "so weit wie die Normalparabel";
  return `${opening}, ${form}`;
}

function parabolaParams(v: LabValues): string {
  const plot = paramsPlot();
  const f = (x: number) => v.a * (x - v.xs) ** 2 + v.ys;
  const c = v.a * v.xs * v.xs + v.ys;
  let out = open("Eine Parabel mit ziehbarem Scheitelpunkt und Formpunkt, die Normalparabel zum Vergleich");
  out += plot.clip("clip-params") + plot.grid(1, 2);
  const axis = line(plot.X(v.xs), plot.Y(plot.ymin), plot.X(v.xs), plot.Y(plot.ymax), "lab-dashed");
  out += clipped("clip-params", axis + plot.graph((x) => x * x, "lab-ghost") + plot.graph(f, v.a === 0 ? "lab-curve-2" : "lab-curve"));
  // The template of the parabola: from S one to the right and a up.
  const S = plot.P(v.xs, v.ys);
  const R = plot.P(v.xs + 1, v.ys);
  const A = plot.P(v.xs + 1, v.ys + v.a);
  out += line(S.x, S.y, R.x, R.y, "lab-thin") + line(R.x, R.y, A.x, A.y, "lab-side-b");
  out += text((S.x + R.x) / 2, S.y + (v.a >= 0 ? 15 : -7), "1", "lab-text-small", "middle");
  out += text(A.x + 15, A.y + (v.a >= 0 ? -6 : 14), `a = ${fmt(v.a)}`, "lab-text lab-text-b");
  out += text(S.x - 10, S.y + (v.a >= 0 ? 20 : -12), pointText("S", v.xs, v.ys), "lab-text lab-text-a", "end");
  if (v.a !== 0 && v.xs !== 0 && plot.contains(0, c)) {
    // Where the parabola meets the y-axis: (0 | c) of the general form.
    const C = plot.P(0, c);
    const right = v.xs < 0;
    out += circle(C.x, C.y, 5, "lab-point-a");
    out += text(C.x + (right ? 9 : -9), C.y - 7, `(0 | ${fmt(c)})`, "lab-text-small", right ? "start" : "end");
  }
  const lines: Line[] =
    v.a === 0
      ? [["a = 0: keine Parabel", "lab-text lab-text-bad"], [`y = ${fmt(v.ys)} ist eine Gerade`, "lab-text-muted"]]
      : [
          [`y = ${vertexForm(v.a, v.xs, v.ys)}`, "lab-text lab-text-big"],
          [`= ${quadratic(v.a, -2 * v.a * v.xs, c)}`, "lab-text-muted"],
          [shapeOf(v.a), "lab-text-small"],
          ["gestrichelt: Normalparabel y = x²", "lab-text-small"],
        ];
  out += placeInfo(plot, lines, [S, A], [f, (x) => x * x]);
  out += handle("S", S.x, S.y, "Scheitelpunkt S");
  out += handle("a", A.x, A.y, "Formpunkt: 1 nach rechts, a nach oben", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 7.2 Quadratische Ergänzung mit Kacheln ────────────────────────────────

const TILE = { x0: 46, y0: 78, X: 112, u: 14 };

/** The corner square with side s completes x² + px to a square exactly when s = |p| : 2. */
export function completionFits(v: LabValues): boolean {
  return Math.abs(v.s - Math.abs(v.p) / 2) < 1e-9;
}

/** The vertex of y = a(x² + px) + c, read off after completing the square. */
export function completedVertex(v: LabValues): { xs: number; ys: number } {
  return { xs: -v.p / 2, ys: v.c - v.a * (v.p / 2) ** 2 };
}

/** The factor in front of a bracket: "" for 1, "−" for −1. */
function factorText(a: number): string {
  return a === 1 ? "" : a === -1 ? "−" : fmt(a);
}

function completingSquare(v: LabValues): string {
  const { x0, y0, X, u } = TILE;
  const h = Math.abs(v.p) / 2;
  const H = h * u;
  const s = Math.max(0, v.s) * u;
  const q = v.s * v.s;
  const fits = completionFits(v);
  const inner = quadratic(1, v.p, 0);
  let out = open("Algebra-Kacheln zur quadratischen Ergänzung und der Weg zur Scheitelpunktsform");
  out += text(x0 - 26, 32, `Kacheln für ${inner}`, "lab-text lab-text-big");
  out += rect(x0, y0, X, X, "lab-fill-a");
  if (v.p >= 0) {
    // x² + px: the square x², two strips (p/2)·x and the missing corner (p/2)².
    out += text(x0 + X / 2, y0 + X / 2 + 6, "x²", "lab-text lab-text-a lab-text-big", "middle");
    if (h > 0) {
      out += rect(x0 + X, y0, H, X, "lab-fill-b") + rect(x0, y0 + X, X, H, "lab-fill-b");
      out += rect(x0 + X, y0 + X, H, H, "lab-target");
      out += text(x0 + X + H + 6, y0 + X / 2 + 4, `${fmt(h)}x`, "lab-text lab-text-b");
      out += text(x0 + X / 2, y0 + X + H + 16, `${fmt(h)}x`, "lab-text lab-text-b", "middle");
      out += text(x0 + X + H / 2, y0 - 8, fmt(h), "lab-text-axis", "middle");
      out += text(x0 - 8, y0 + X + H / 2 + 4, fmt(h), "lab-text-axis", "end");
    }
    if (v.s > 0) out += rect(x0 + X, y0 + X, s, s, fits ? "lab-fill-ok" : "lab-fill-c");
    out += text(x0 + X / 2, y0 - 8, "x", "lab-text-axis", "middle");
    out += text(x0 - 8, y0 + X / 2 + 4, "x", "lab-text-axis", "end");
    if (fits && h > 0) out += rect(x0, y0, X + H, X + H, "lab-side-ok");
  } else {
    // x² − px: two strips (p/2)·x are cut away; their overlap in the corner was
    // cut twice, so the corner square comes back once.
    out += rect(x0 + X - H, y0, H, X, "lab-fill-b") + rect(x0, y0 + X - H, X, H, "lab-fill-b");
    out += rect(x0 + X - H, y0 + X - H, H, H, "lab-target");
    if (v.s > 0) out += rect(x0 + X - s, y0 + X - s, s, s, fits ? "lab-fill-ok" : "lab-fill-c");
    const rest = (X - H) / 2;
    out += text(x0 + rest, y0 + rest + 6, fits ? `(x − ${fmt(h)})²` : "x²", fits ? "lab-text lab-text-ok" : "lab-text lab-text-a lab-text-big", "middle");
    out += text(x0 + X + 6, y0 + X / 2 + 4, `−${fmt(h)}x`, "lab-text lab-text-b");
    out += text(x0 + X / 2, y0 + X + 16, `−${fmt(h)}x`, "lab-text lab-text-b", "middle");
    out += text(x0 + rest, y0 - 8, `x − ${fmt(h)}`, "lab-text-axis", "middle");
    out += text(x0 + X - H / 2, y0 - (H < 40 ? 22 : 8), fmt(h), "lab-text-axis", "middle");
    out += text(x0 - 8, y0 + rest + 4, `x − ${fmt(h)}`, "lab-text-axis", "end");
    out += text(x0 - 8, y0 + X - H / 2 + 4, fmt(h), "lab-text-axis", "end");
    if (fits) out += rect(x0, y0, X - H, X - H, "lab-side-ok");
  }
  out += text(
    x0 - 26,
    306,
    v.p === 0 ? "Ohne x-Glied ist x² schon ein Quadrat." : fits ? `${quadratic(1, v.p, q)} = ${shifted(-v.p / 2)}²` : "Ziehe die Ecke, bis das Quadrat passt.",
    fits ? "lab-text lab-text-ok" : "lab-text-muted",
  );

  // The way to the vertex form, line by line.
  const { xs, ys } = completedVertex(v);
  const factor = factorText(v.a);
  const constant = term(v.c, "", false);
  const bracket = (body: string) => (v.a === 1 ? body : `${factor}[${body}]`);
  const lines: Line[] = [[`y = ${quadratic(v.a, v.a * v.p, v.c)}`, "lab-text lab-text-big"]];
  if (v.p === 0) {
    lines.push(
      fits
        ? [`S(0 | ${fmt(v.c)}), 𝕎 = {y | y ${v.a > 0 ? "≥" : "≤"} ${fmt(v.c)}}`, "lab-text lab-text-c"]
        : ["Ohne x-Glied gibt es nichts zu ergänzen.", "lab-text lab-text-bad"],
    );
  } else {
    if (v.a !== 1) lines.push([`= ${factor}[${inner}]${constant}`, "lab-text"]);
    if (v.s === 0) {
      lines.push(["Ergänze: Ziehe das Eckquadrat auf.", "lab-text-muted"]);
    } else {
      const added = fmt(q);
      lines.push([`= ${bracket(`${inner} + ${added} − ${added}`)}${constant}`, "lab-text"]);
      if (fits) {
        lines.push([`= ${bracket(`${shifted(xs)}² − ${added}`)}${constant}`, "lab-text"]);
        lines.push([`= ${vertexForm(v.a, xs, ys)}`, "lab-text lab-text-ok lab-text-big"]);
        lines.push([`S(${fmt(xs)} | ${fmt(ys)}), 𝕎 = {y | y ${v.a > 0 ? "≥" : "≤"} ${fmt(ys)}}`, "lab-text lab-text-c"]);
        lines.push(["Rückweg: ausmultiplizieren", "lab-text-small"]);
        lines.push([`${factor}(${quadratic(1, v.p, q)})${term(ys, "", false)} = ${quadratic(v.a, v.a * v.p, v.c)}`, "lab-text-small"]);
      } else {
        lines.push([v.s < Math.abs(v.p) / 2 ? "Das Eckquadrat ist zu klein." : "Das Eckquadrat ist zu groß.", "lab-text lab-text-bad"]);
        lines.push(["Ein Binom entsteht nur mit (p : 2)².", "lab-text-small"]);
      }
    }
  }
  lines.forEach(([content, cls], i) => {
    out += text(252, 44 + i * 25, content, cls);
  });
  const corner = v.p >= 0 ? { x: x0 + X + s, y: y0 + X + s } : { x: x0 + X - s, y: y0 + X - s };
  out += handle("corner", corner.x, corner.y, "Ecke des Ergänzungsquadrats");
  out += "</svg>";
  return out;
}

// ─── 7.3 Parabelgleichungen bestimmen ──────────────────────────────────────

const fitPlot = () => new Plot(-8, 8, -5, 6);

export interface ParabolaFit {
  ok: boolean;
  a: number;
  b: number;
  c: number;
  /** Why no parabola fits, when `ok` is false. */
  reason: string;
}

/**
 * The parabola through the dragged points: from the vertex S and a point P
 * (mode 0), or from a fixed a and two points P and Q (mode 1), where
 * inserting both points gives a linear system for b and c.
 */
export function fitParabola(v: LabValues): ParabolaFit {
  if (v.mode === 0) {
    if (v.xp === v.xs) {
      return { ok: false, a: 0, b: 0, c: 0, reason: v.yp === v.ys ? "P liegt auf S: Ziehe P weg." : "P liegt senkrecht über oder unter S: keine Parabel." };
    }
    const a = (v.yp - v.ys) / (v.xp - v.xs) ** 2;
    if (a === 0) return { ok: false, a, b: 0, c: v.ys, reason: "P liegt so hoch wie S: a = 0, keine Parabel." };
    return { ok: true, a, b: -2 * a * v.xs, c: a * v.xs * v.xs + v.ys, reason: "" };
  }
  if (v.xp === v.xq) {
    return { ok: false, a: v.a, b: 0, c: 0, reason: v.yp === v.yq ? "P und Q fallen zusammen: Ziehe Q weg." : "P und Q liegen senkrecht übereinander: keine Parabel." };
  }
  const b = (v.yq - v.yp) / (v.xq - v.xp) - v.a * (v.xp + v.xq);
  const c = v.yp - v.a * v.xp * v.xp - b * v.xp;
  return { ok: true, a: v.a, b, c, reason: "" };
}

function parabolaFit(v: LabValues): string {
  const plot = fitPlot();
  const fit = fitParabola(v);
  const f = (x: number) => fit.a * x * x + fit.b * x + fit.c;
  let out = open("Eine Parabel durch ziehbare Punkte: Scheitel und Punkt oder zwei Punkte bei festem a");
  out += plot.clip("clip-fit") + plot.grid(1, 2);
  const avoid: Pt[] = [plot.P(v.xp, v.yp)];
  if (fit.ok) {
    const S = vertexOf(fit.a, fit.b, fit.c);
    const axis = line(plot.X(S.x), plot.Y(plot.ymin), plot.X(S.x), plot.Y(plot.ymax), "lab-dashed");
    out += clipped("clip-fit", axis + plot.graph(f, "lab-curve"));
    if (v.mode === 0 && plot.contains(2 * v.xs - v.xp, v.yp)) {
      // The mirror image of P on the other side of the axis lies on the parabola too.
      const M = plot.P(2 * v.xs - v.xp, v.yp);
      out += circle(M.x, M.y, 4, "lab-dot-small") + text(M.x, M.y - 9, "P′", "lab-text-small", "middle");
    }
    if (v.mode === 1 && plot.contains(S.x, S.y)) {
      const P = plot.P(S.x, S.y);
      out += circle(P.x, P.y, 5, "lab-point-ok");
      out += text(P.x + 8, P.y + (fit.a > 0 ? 17 : -9), `S(${fmt(S.x, 2)} | ${fmt(S.y, 2)})`, "lab-text-small");
    }
  }
  let lines: Line[];
  if (v.mode === 0) {
    lines = [
      [`${pointText("S", v.xs, v.ys)}, ${pointText("P", v.xp, v.yp)}`, "lab-text"],
      fit.ok
        ? [`a = (${fmt(v.yp)} − ${paren(v.ys)}) : (${fmt(v.xp)} − ${paren(v.xs)})² ${rel(fit.a, 3)} ${fmt(fit.a, 3)}`, "lab-text-muted"]
        : [fit.reason, "lab-text lab-text-bad"],
      [fit.ok ? `y ${rel(fit.a, 3)} ${vertexForm(fit.a, v.xs, v.ys, 3)}` : "", "lab-text lab-text-big"],
    ];
    avoid.push(plot.P(v.xs, v.ys));
  } else {
    const exact = fit.ok && rel(fit.b, 3) === "=" && rel(fit.c, 3) === "=";
    lines = [
      [`y = ${term(v.a, "x²", true)} + bx + c durch P und Q`, "lab-text"],
      [`I: ${fmt(v.yp)} = ${fmt(v.a * v.xp * v.xp)}${term(v.xp, "b", false)} + c`, "lab-text-muted"],
      [`II: ${fmt(v.yq)} = ${fmt(v.a * v.xq * v.xq)}${term(v.xq, "b", false)} + c`, "lab-text-muted"],
      fit.ok
        ? [`b ${rel(fit.b, 3)} ${fmt(fit.b, 3)}, c ${rel(fit.c, 3)} ${fmt(fit.c, 3)}`, "lab-text-muted"]
        : [fit.reason, "lab-text lab-text-bad"],
      [fit.ok ? `y ${exact ? "=" : "≈"} ${quadratic(fit.a, fit.b, fit.c, 3)}` : "", "lab-text lab-text-big"],
    ];
    avoid.push(plot.P(v.xq, v.yq));
  }
  out += placeInfo(plot, lines, avoid, fit.ok ? [f] : []);
  const P = plot.P(v.xp, v.yp);
  out += text(P.x + 12, P.y - 10, pointText("P", v.xp, v.yp), "lab-text-small");
  if (v.mode === 0) {
    const S = plot.P(v.xs, v.ys);
    out += text(S.x + 12, S.y + 18, pointText("S", v.xs, v.ys), "lab-text-small");
    out += handle("S", S.x, S.y, "Scheitelpunkt S");
  } else {
    const Q = plot.P(v.xq, v.yq);
    out += text(Q.x + 12, Q.y - 10, pointText("Q", v.xq, v.yq), "lab-text-small");
    out += handle("Q", Q.x, Q.y, "Punkt Q", "lab-handle lab-handle-a");
  }
  out += handle("P", P.x, P.y, "Punkt P", "lab-handle lab-handle-b");
  out += "</svg>";
  return out;
}

// ─── 7.4 Extremwertprobleme: das Gehege ────────────────────────────────────

export interface FenceModel {
  /** The fence: k·x + j·y = L, x at right angles to the wall. */
  k: number;
  j: number;
  /** x must stay below xmax, or there is no fence left for y. */
  xmax: number;
  xBest: number;
  areaBest: number;
}

/** mode 0: at a wall (2x + y = L), 1: at a wall with a divider (3x + y = L), 2: free-standing (2x + 2y = L). */
export function fenceModel(mode: number, L: number): FenceModel {
  const k = mode === 1 ? 3 : 2;
  const j = mode === 2 ? 2 : 1;
  return { k, j, xmax: L / k, xBest: L / (2 * k), areaBest: (L * L) / (4 * k * j) };
}

/** The other side y of the rectangle; zero or less when the fence is used up. */
export function fenceSide(v: LabValues): number {
  const { k, j } = fenceModel(v.mode, v.L);
  return (v.L - k * v.x) / j;
}

export function fenceArea(v: LabValues): number {
  const y = fenceSide(v);
  return y > 0 ? v.x * y : 0;
}

const FENCE = { x0: 34, y0: 104 };

/** Pixels per metre: the longest possible sides still fit the left half. */
function fenceScale(v: LabValues): number {
  const { j, xmax } = fenceModel(v.mode, v.L);
  return Math.min(16, 232 / (v.L / j), 196 / xmax);
}

function fencePlot(v: LabValues): Plot {
  const { xmax, areaBest } = fenceModel(v.mode, v.L);
  return new Plot(0, xmax, 0, areaBest * 1.2, { x: 312, y: 84, w: 188, h: 206 });
}

function fence(v: LabValues): string {
  const { k, j, xmax, xBest, areaBest } = fenceModel(v.mode, v.L);
  const y = fenceSide(v);
  const area = fenceArea(v);
  const { x0, y0 } = FENCE;
  const scale = fenceScale(v);
  let out = open("Ein rechteckiges Gehege aus einem Zaun fester Länge und sein Flächeninhalt als Parabel");
  const rule = v.mode === 2 ? `2x + 2y = ${v.L}` : `${k}x + y = ${v.L}`;
  const sideTerm = v.mode === 2 ? `${fmt(v.L / 2)} − x` : `${v.L} − ${k}x`;
  out += text(20, 26, `Zaun ${v.L} m: ${rule}`, "lab-text lab-text-big");
  out += text(20, 48, `A(x) = x · (${sideTerm}) = ${vertexForm(-k / j, xBest, areaBest)}`, "lab-text");
  out += text(20, 68, `𝔻 = {x | 0 < x < ${fmt(xmax)}}`, "lab-text-muted");
  if (v.mode !== 2) {
    out += rect(x0 - 8, y0 - 10, 248, 10, "lab-shape-2");
    out += text(x0 + 116, y0 - 14, "Mauer", "lab-text-small", "middle");
  }
  if (y > 0) {
    // x runs at right angles to the wall, y along it.
    const w = y * scale;
    const h = v.x * scale;
    out += rect(x0, y0, w, h, "lab-fill-ok");
    const d = v.mode === 2 ? `M${x0} ${y0} H${x0 + w} V${y0 + h} H${x0} Z` : `M${x0} ${y0} V${y0 + h} H${x0 + w} V${y0}`;
    out += `<path d="${d}" class="lab-fence" />`;
    if (v.mode === 1) out += line(x0 + w / 2, y0, x0 + w / 2, y0 + h, "lab-fence");
    out += text(x0 + w / 2, y0 + h + 17, `y = ${fmt(y, 2)} m`, "lab-text", "middle");
    out += text(x0 + w + 8, y0 + h / 2 + 4, `x = ${fmt(v.x, 2)} m`, "lab-text");
    if (h > 26 && w > 70) out += text(x0 + (v.mode === 1 ? w / 4 : w / 2), y0 + h / 2 + 6, `${fmt(area, 2)} m²`, "lab-text lab-text-big", "middle");
  } else {
    out += text(x0, y0 + 34, `Für x ≥ ${fmt(xmax)} reicht der Zaun nicht:`, "lab-text lab-text-bad");
    out += text(x0, y0 + 54, "x liegt nicht in der Definitionsmenge.", "lab-text lab-text-bad");
  }
  // A(x) over the Definitionsmenge.
  const plot = fencePlot(v);
  const { x: bx, y: by, w: bw, h: bh } = plot.box;
  out += rect(bx, by, bw, bh, "lab-plot-bg") + plot.clip("clip-fence");
  out += clipped("clip-fence", plot.graph((x) => (x * (v.L - k * x)) / j, "lab-curve"));
  out += arrow(bx, by + bh, bx + bw + 6, by + bh, "lab-axis", 1.4) + arrow(bx, by + bh, bx, by - 6, "lab-axis", 1.4);
  out += line(bx, by + bh, bx + bw, by + bh, "lab-side-ok");
  out += text(bx, by - 10, "A in m²", "lab-text-axis");
  out += text(bx + bw, by + bh + 30, "x in m", "lab-text-axis", "end");
  out += text(bx, by + bh + 14, "0", "lab-text-tick", "middle");
  out += text(plot.X(xBest), by + bh + 14, fmt(xBest), "lab-text-tick", "middle");
  out += text(bx + bw, by + bh + 14, fmt(xmax), "lab-text-tick", "middle");
  const B = plot.P(xBest, areaBest);
  out += line(B.x, B.y, B.x, by + bh, "lab-dashed");
  out += circle(B.x, B.y, 5, "lab-point-ok");
  out += text(B.x, B.y - 10, `A_max = ${fmt(areaBest, 2)}`, "lab-text-small", "middle");
  if (y > 0) {
    const P = plot.P(v.x, area);
    out += line(bx, P.y, P.x, P.y, "lab-dashed");
    out += handle("graph", P.x, P.y, "Punkt auf dem Graphen von A: x ändern", "lab-handle lab-handle-b");
    out += handle("corner", x0 + y * scale, y0 + v.x * scale, "Ecke des Geheges: x ändern");
  }
  out += "</svg>";
  return out;
}

// ─── 7.5 Lösungsformel und Diskriminante ───────────────────────────────────

const discPlot = () => new Plot(-8, 8, -6.5, 6.5);

function discriminant(v: LabValues): string {
  const plot = discPlot();
  const D = v.b * v.b - 4 * v.a * v.c;
  const roots = v.a === 0 ? [] : quadraticRoots(v.a, v.b, v.c);
  const f = (x: number) => v.a * x * x + v.b * x + v.c;
  let out = open("Eine Parabel, ihre Nullstellen und die Diskriminante der Gleichung");
  out += plot.clip("clip-disc") + plot.grid(1, 2);
  const avoid: Pt[] = [plot.P(0, v.c)];
  if (v.a !== 0) {
    const S = vertexOf(v.a, v.b, v.c);
    out += clipped("clip-disc", line(plot.X(S.x), plot.Y(plot.ymin), plot.X(S.x), plot.Y(plot.ymax), "lab-dashed"));
    if (plot.contains(S.x, S.y)) {
      const P = plot.P(S.x, S.y);
      out += circle(P.x, P.y, 4, "lab-dot-small");
      avoid.push(P);
    }
  }
  out += clipped("clip-disc", plot.graph(f, v.a === 0 ? "lab-curve-2" : "lab-curve"));
  for (const x of roots) {
    if (!plot.contains(x, 0)) continue;
    const P = plot.P(x, 0);
    out += circle(P.x, P.y, 6, "lab-point-ok");
    avoid.push(P);
  }
  const lines: Line[] =
    v.a === 0
      ? [["a = 0: keine quadratische Gleichung", "lab-text lab-text-bad"]]
      : [
          [`${quadratic(v.a, v.b, v.c)} = 0`, "lab-text lab-text-big"],
          [`D = ${paren(v.b)}² − 4 · ${paren(v.a)} · ${paren(v.c)} = ${fmt(D)}`, D > 0 ? "lab-text lab-text-ok" : D === 0 ? "lab-text lab-text-c" : "lab-text lab-text-bad"],
          [
            D < 0 ? "D < 0: keine Lösung, L = { }" : D === 0 ? `D = 0: genau eine Lösung x ${rel(roots[0])} ${fmt(roots[0])}` : `x₁,₂ = (${fmt(-v.b)} ± √${fmt(D)}) : ${paren(2 * v.a)}`,
            "lab-text-muted",
          ],
          [D > 0 ? `L ${rel(roots[0]) === "=" && rel(roots[1]) === "=" ? "=" : "≈"} {${fmt(roots[0])}; ${fmt(roots[1])}}` : "", "lab-text-muted"],
        ];
  out += placeInfo(plot, lines, avoid, [f]);
  // The sign of D as a bar on the right.
  const gx = 480;
  const g0 = 172;
  const bar = Math.max(-110, Math.min(110, D * 2));
  out += line(gx - 14, g0, gx + 14, g0, "lab-ink");
  out += rect(gx - 8, D >= 0 ? g0 - bar : g0, 16, Math.abs(bar), D > 0 ? "lab-bar-ok" : "lab-bar-bad");
  out += circle(gx, g0, D === 0 ? 7 : 3, D === 0 ? "lab-point-a" : "lab-dot-small");
  out += text(gx, g0 - 118, "D", "lab-text-axis", "middle");
  const C = plot.P(0, v.c);
  out += handle("c", C.x, C.y, "Schnittpunkt mit der y-Achse: c ändern");
  out += "</svg>";
  return out;
}

// ─── 7.6 Schnittpunkte von Parabel und Gerade bzw. zweier Parabeln ─────────

/** The fixed parabola of the lab: p: y = 0,5x² − 2. */
export const BASE_PARABOLA = { a: 0.5, b: 0, c: -2 };

const interPlot = () => new Plot(-8, 8, -6, 6.5);

export interface IntersectionInfo {
  /** p − g = 0 or p − p₂ = 0 as A·x² + B·x + C = 0. */
  A: number;
  B: number;
  C: number;
  /** The discriminant, null when x² cancels (equal a). */
  D: number | null;
  xs: number[];
  /** Both parabolas are the same. */
  same: boolean;
}

/** The difference equation of the lab and its solutions: mode 0 a line g: y = mx + t, mode 1 a parabola p₂: y = a₂(x − d)² + e. */
export function intersectionInfo(v: LabValues): IntersectionInfo {
  const p = BASE_PARABOLA;
  const A = v.mode === 0 ? p.a : p.a - v.a2;
  const B = v.mode === 0 ? p.b - v.m : p.b + 2 * v.a2 * v.d;
  const C = v.mode === 0 ? p.c - v.t : p.c - (v.a2 * v.d * v.d + v.e);
  if (A === 0) {
    if (B === 0) return { A, B, C, D: null, xs: [], same: C === 0 };
    return { A, B, C, D: null, xs: [-C / B], same: false };
  }
  return { A, B, C, D: B * B - 4 * A * C, xs: quadraticRoots(A, B, C), same: false };
}

/** What the learner reads off: Sekante, Tangente, Passante or the number of common points. */
export function intersectionKind(v: LabValues): string {
  const info = intersectionInfo(v);
  if (info.same) return "dieselbe Parabel: unendlich viele gemeinsame Punkte";
  if (info.D === null) return info.xs.length === 1 ? "x² fällt weg: genau ein Schnittpunkt" : "x² fällt weg: kein gemeinsamer Punkt";
  if (v.mode === 0) return info.D > 0 ? "Sekante: zwei Schnittpunkte" : info.D === 0 ? "Tangente: ein Berührpunkt" : "Passante: kein gemeinsamer Punkt";
  return info.D > 0 ? "zwei Schnittpunkte" : info.D === 0 ? "ein Berührpunkt" : "kein gemeinsamer Punkt";
}

/** The other end of the line's slope handle: 2 units along the line, inside the plot. */
function slopeHandlePoint(m: number, t: number, plot: Plot): { x: number; y: number } {
  const len = Math.hypot(1, m);
  const forward = { x: 2 / len, y: t + (2 * m) / len };
  if (plot.contains(forward.x, forward.y)) return forward;
  return { x: -2 / len, y: t - (2 * m) / len };
}

function intersections(v: LabValues): string {
  const plot = interPlot();
  const p = BASE_PARABOLA;
  const info = intersectionInfo(v);
  const f1 = (x: number) => p.a * x * x + p.b * x + p.c;
  const f2 = v.mode === 0 ? (x: number) => v.m * x + v.t : (x: number) => v.a2 * (x - v.d) ** 2 + v.e;
  let out = open(v.mode === 0 ? "Eine Parabel und eine Gerade: Sekante, Tangente oder Passante" : "Zwei Parabeln und ihre gemeinsamen Punkte");
  out += plot.clip("clip-inter") + plot.grid(1, 2);
  out += clipped("clip-inter", plot.graph(f1, "lab-curve") + (v.mode === 0 ? plot.lineThrough(v.m, v.t, "lab-curve-2") : plot.graph(f2, "lab-curve-2")));
  const avoid: Pt[] = [];
  for (const x of info.xs) {
    const y = f1(x);
    if (!plot.contains(x, y)) continue;
    const P = plot.P(x, y);
    out += circle(P.x, P.y, 6, "lab-point-ok");
    avoid.push(P);
  }
  const second = v.mode === 0 ? `g: y = ${linear(v.m, v.t)}` : `p₂: y = ${vertexForm(v.a2, v.d, v.e)}`;
  const D = info.D;
  const lines: Line[] = [
    [`p: y = ${quadratic(p.a, p.b, p.c)}, ${second}`, "lab-text"],
    [`Gleichsetzen: ${quadratic(info.A, info.B, info.C)} = 0`, "lab-text-muted"],
    [D === null ? "kein x² mehr: lineare Gleichung" : `D = ${fmt(D, 3)}`, "lab-text-muted"],
    [intersectionKind(v), D !== null && D > 0 ? "lab-text lab-text-ok" : D === 0 || info.xs.length === 1 ? "lab-text lab-text-c" : "lab-text lab-text-bad"],
  ];
  if (v.mode === 0) {
    const T = plot.P(0, v.t);
    const s = slopeHandlePoint(v.m, v.t, plot);
    const M = plot.P(s.x, s.y);
    out += placeInfo(plot, lines, [...avoid, T, M], [f1, f2]);
    out += handle("t", T.x, T.y, "Achsenabschnitt t der Geraden");
    out += handle("m", M.x, M.y, "Steigung m der Geraden", "lab-handle lab-handle-b");
  } else {
    const S = plot.P(v.d, v.e);
    out += placeInfo(plot, lines, [...avoid, S], [f1, f2]);
    out += handle("S2", S.x, S.y, "Scheitel der zweiten Parabel", "lab-handle lab-handle-b");
  }
  out += "</svg>";
  return out;
}

export const QUADRATISCH_VIEWS: Record<"parabola-params" | "completing-square" | "parabola-fit" | "fence" | "discriminant" | "intersections", LabView> = {
  "parabola-params": {
    render: parabolaParams,
    handles: {
      S: {
        x: "xs",
        y: "ys",
        drag: (p) => {
          const plot = paramsPlot();
          return { xs: plot.invX(p.x), ys: plot.invY(p.y) };
        },
      },
      a: { y: "a", drag: (p, v) => ({ a: paramsPlot().invY(p.y) - v.ys }) },
    },
  },
  "completing-square": {
    render: completingSquare,
    handles: {
      corner: {
        x: "s",
        drag: (p, v) => {
          const { x0, y0, X, u } = TILE;
          const side =
            v.p >= 0
              ? Math.max(0, p.x - (x0 + X), p.y - (y0 + X)) / u
              : Math.max(0, x0 + X - p.x, y0 + X - p.y) / u;
          return { s: side };
        },
      },
    },
  },
  "parabola-fit": {
    render: parabolaFit,
    handles: {
      S: {
        x: "xs",
        y: "ys",
        drag: (p) => {
          const plot = fitPlot();
          return { xs: plot.invX(p.x), ys: plot.invY(p.y) };
        },
      },
      P: {
        x: "xp",
        y: "yp",
        drag: (p) => {
          const plot = fitPlot();
          return { xp: plot.invX(p.x), yp: plot.invY(p.y) };
        },
      },
      Q: {
        x: "xq",
        y: "yq",
        drag: (p) => {
          const plot = fitPlot();
          return { xq: plot.invX(p.x), yq: plot.invY(p.y) };
        },
      },
    },
  },
  fence: {
    render: fence,
    handles: {
      corner: { x: "x", drag: (p, v) => ({ x: (p.y - FENCE.y0) / fenceScale(v) }) },
      graph: { x: "x", drag: (p, v) => ({ x: fencePlot(v).invX(p.x) }) },
    },
  },
  discriminant: {
    render: discriminant,
    handles: {
      c: { y: "c", drag: (p) => ({ c: discPlot().invY(p.y) }) },
    },
  },
  intersections: {
    render: intersections,
    handles: {
      t: { y: "t", drag: (p) => ({ t: interPlot().invY(p.y) }) },
      m: {
        y: "m",
        drag: (p, v) => {
          const plot = interPlot();
          const x = plot.invX(p.x);
          if (Math.abs(x) < 0.3) return {};
          return { m: (plot.invY(p.y) - v.t) / x };
        },
      },
      S2: {
        x: "d",
        y: "e",
        drag: (p) => {
          const plot = interPlot();
          return { d: plot.invX(p.x), e: plot.invY(p.y) };
        },
      },
    },
  },
};
