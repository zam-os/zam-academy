import { fmt, round, sum } from "../exercises/format";
import { infoBox, Plot, type Pt } from "./svg";

/**
 * Helpers the function labs of every stage share: polynomials, the "=" or
 * "≈" in front of a rounded value, and an info panel that finds the corner
 * of the plot where it hides the least of the graphs.
 */

export type Line = [string, string];

/** "=" when `value` is exact at `digits` decimals, "≈" when it is shown rounded. */
export function rel(value: number, digits = 2): string {
  return Math.abs(value - round(value, digits)) < 1e-9 ? "=" : "≈";
}

/** A value with "=" or "≈" in front: "= 2,5" or "≈ 0,33". */
export function eq(value: number, digits = 2): string {
  return `${rel(value, digits)} ${fmt(value, digits)}`;
}

/** Coefficients from the highest power down: [a, b, c, d] is a·x³ + b·x² + c·x + d. */
export type Poly = number[];

export function polyAt(p: Poly, x: number): number {
  return p.reduce((acc, coefficient) => acc * x + coefficient, 0);
}

export function polyDerivative(p: Poly): Poly {
  const n = p.length - 1;
  if (n <= 0) return [0];
  return p.slice(0, -1).map((coefficient, i) => coefficient * (n - i));
}

const POWERS = ["", "x", "x²", "x³", "x⁴", "x⁵", "x⁶"];

/** A polynomial written the blackboard way: [1, 0, −3, 2] → "x³ − 3x + 2". */
export function polyText(p: Poly, digits = 2): string {
  const n = p.length - 1;
  return sum(p.map((coefficient, i) => [coefficient, POWERS[n - i]] as [number, string]), digits);
}

/** The degree of a polynomial, −1 for the zero polynomial. */
export function degreeOf(p: Poly): number {
  const n = p.length - 1;
  for (let i = 0; i <= n; i++) if (Math.abs(p[i]) > 1e-12) return n - i;
  return -1;
}

/** Real roots of a·x² + b·x + c = 0, sorted; a linear or constant equation is handled too. */
export function quadraticRoots(a: number, b: number, c: number): number[] {
  if (Math.abs(a) < 1e-12) return Math.abs(b) < 1e-12 ? [] : [-c / b];
  const D = b * b - 4 * a * c;
  if (D < -1e-12) return [];
  if (Math.abs(D) <= 1e-12) return [-b / (2 * a)];
  const r = Math.sqrt(D);
  return [(-b - r) / (2 * a), (-b + r) / (2 * a)].sort((p, q) => p - q);
}

/** True when two functions agree on a fine sample of [xmin; xmax] wherever both are defined, and are defined at the same places. */
export function sameGraph(f: (x: number) => number, g: (x: number) => number, xmin = -5, xmax = 5): boolean {
  for (let i = 0; i <= 200; i++) {
    const x = xmin + ((xmax - xmin) * i) / 200 + 1e-7;
    const a = f(x);
    const b = g(x);
    if (Number.isFinite(a) !== Number.isFinite(b)) return false;
    if (Number.isFinite(a) && Math.abs(a - b) > 1e-6 * Math.max(1, Math.abs(a))) return false;
  }
  return true;
}

/** A point as the drawing labels it: "P(2 | −1)". */
export function pointLabel(name: string, x: number, y: number, digits = 2): string {
  return `${name}(${fmt(x, digits)} | ${fmt(y, digits)})`;
}

/** The size infoBox() gives a panel with these lines. */
function panelSize(lines: Line[]): { w: number; h: number } {
  const shown = lines.filter(([content]) => content);
  const widthOf = ([content, cls]: Line) => content.length * (cls.includes("big") ? 9.2 : cls.includes("small") ? 6.2 : 7.3);
  return { w: Math.max(0, ...shown.map(widthOf)) + 16, h: shown.length * 20 + 8 };
}

/**
 * An info panel in the corner of the plot where it hides the fewest curve
 * points and no handle, so the drawing stays readable wherever the learner
 * drags.
 */
export function placeInfo(plot: Plot, lines: Line[], avoid: Pt[], curves: Array<(x: number) => number>): string {
  const { w, h } = panelSize(lines);
  const { x: bx, y: by, w: bw, h: bh } = plot.box;
  const candidates = [
    { x: bx + 14, y: by + 22, anchor: "start" as const },
    { x: bx + bw - 14, y: by + 22, anchor: "end" as const },
    { x: bx + 14, y: by + bh - h + 11, anchor: "start" as const },
    { x: bx + bw - 14, y: by + bh - h + 11, anchor: "end" as const },
  ];
  const samples: Array<{ p: Pt; length: number }> = [];
  for (const f of curves) {
    let previous: Pt | null = null;
    for (let i = 0; i <= 240; i++) {
      const x = plot.xmin + ((plot.xmax - plot.xmin) * i) / 240;
      const y = f(x);
      if (!Number.isFinite(y) || y < plot.ymin || y > plot.ymax) {
        previous = null;
        continue;
      }
      const p = plot.P(x, y);
      samples.push({ p, length: previous ? Math.hypot(p.x - previous.x, p.y - previous.y) : 1 });
      previous = p;
    }
  }
  let best = candidates[0];
  let bestScore = Number.POSITIVE_INFINITY;
  for (const candidate of candidates) {
    const left = candidate.anchor === "start" ? candidate.x - 8 : candidate.x - w + 8;
    const top = candidate.y - 17;
    const inside = (p: Pt, pad: number) => p.x >= left - pad && p.x <= left + w + pad && p.y >= top - pad && p.y <= top + h + pad;
    const covered = samples.filter((sample) => inside(sample.p, 2)).reduce((total, sample) => total + sample.length, 0);
    const score = covered + 400 * avoid.filter((p) => inside(p, 14)).length;
    if (score < bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return infoBox(best.x, best.y, lines, best.anchor);
}

/** The y-pixel of a value, held inside the plot box so a handle stays grabbable. */
export function clampY(plot: Plot, y: number): number {
  return Math.min(plot.box.y + plot.box.h, Math.max(plot.box.y, plot.Y(y)));
}

/** The x-pixel of a value, held inside the plot box. */
export function clampX(plot: Plot, x: number): number {
  return Math.min(plot.box.x + plot.box.w, Math.max(plot.box.x, plot.X(x)));
}
