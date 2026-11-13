import { fmt, MINUS, round } from "../exercises/format";

/** Pure math helpers for Mathematik 7 Gymnasium: terms, symmetry, angles, data, triangles. */

// ─── Number & fraction helpers ──────────────────────────────────────────────

export function gcd(a: number, b: number): number {
  let x = Math.abs(Math.round(a));
  let y = Math.abs(Math.round(b));
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

export function lcm(a: number, b: number): number {
  const x = Math.abs(Math.round(a));
  const y = Math.abs(Math.round(b));
  if (x === 0 || y === 0) return 0;
  return (x / gcd(x, y)) * y;
}

export function roundHalfAway(value: number): number {
  const sign = value < 0 ? -1 : 1;
  return sign * Math.round(Math.abs(value));
}

export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return roundHalfAway(value * factor) / factor;
}

// ─── Terms & polynomials (several variables a, b, x, y) ──────────────────────

const SUPERSCRIPT = "⁰¹²³⁴⁵⁶⁷⁸⁹";

/** Integer as Unicode superscript for plain texts: 2 → "²", −1 → "⁻¹". */
export function supText(n: number): string {
  const digits = String(Math.abs(Math.round(n)))
    .split("")
    .map((digit) => SUPERSCRIPT[Number(digit)])
    .join("");
  return `${n < 0 ? "⁻" : ""}${digits}`;
}

export const VARS = ["a", "b", "x", "y"] as const;
export type Var = (typeof VARS)[number];
export type Mono = Partial<Record<Var, number>>;

export interface Term {
  c: number;
  m: Mono;
}

export type Poly = Term[];

const exp = (m: Mono, v: Var) => m[v] ?? 0;

function cleanMono(m: Mono): Mono {
  const out: Mono = {};
  for (const v of VARS) if (exp(m, v) !== 0) out[v] = exp(m, v);
  return out;
}

function monoKey(m: Mono): string {
  return VARS.map((v) => exp(m, v)).join(",");
}

function compareTerms(s: Term, t: Term): number {
  for (const v of VARS) {
    const d = exp(t.m, v) - exp(s.m, v);
    if (d !== 0) return d;
  }
  return 0;
}

export function normPoly(p: Poly): Poly {
  const map = new Map<string, Term>();
  for (const t of p) {
    const key = monoKey(t.m);
    const before = map.get(key);
    map.set(key, { c: (before?.c ?? 0) + t.c, m: cleanMono(t.m) });
  }
  return [...map.values()]
    .map((t) => ({ c: round(t.c, 9), m: t.m }))
    .filter((t) => t.c !== 0)
    .sort(compareTerms);
}

export function polyAdd(...ps: Poly[]): Poly {
  return normPoly(ps.flat());
}

export function polyScale(p: Poly, k: number): Poly {
  return normPoly(p.map((t) => ({ c: t.c * k, m: t.m })));
}

export function polySub(p: Poly, q: Poly): Poly {
  return polyAdd(p, polyScale(q, -1));
}

export function polyMul(p: Poly, q: Poly): Poly {
  const out: Poly = [];
  for (const s of p) {
    for (const t of q) {
      const m: Mono = {};
      for (const v of VARS) m[v] = exp(s.m, v) + exp(t.m, v);
      out.push({ c: s.c * t.c, m });
    }
  }
  return normPoly(out);
}

export function polyEval(p: Poly, values: Partial<Record<Var, number>>): number {
  let total = 0;
  for (const t of p) {
    let prod = t.c;
    for (const v of VARS) {
      const e = exp(t.m, v);
      if (e !== 0) prod *= (values[v] ?? 0) ** e;
    }
    total += prod;
  }
  return round(total, 9);
}

export function varsHtml(m: Mono): string {
  return VARS.filter((v) => exp(m, v) > 0)
    .map((v) => {
      const e = exp(m, v);
      return e === 1 ? v : `${v}<sup>${e}</sup>`;
    })
    .join("");
}

export function varsText(m: Mono): string {
  return VARS.filter((v) => exp(m, v) > 0)
    .map((v) => {
      const e = exp(m, v);
      return e === 1 ? v : `${v}${supText(e)}`;
    })
    .join("");
}

function monoFormat(c: number, m: Mono, varsOf: (m: Mono) => string): string {
  const vs = varsOf(m);
  if (!vs) return fmt(c, 2);
  if (c === 1) return vs;
  if (c === -1) return `${MINUS}${vs}`;
  return `${fmt(c, 2)}${vs}`;
}

export function monoHtml(c: number, m: Mono): string {
  return monoFormat(c, m, varsHtml);
}

export function monoText(c: number, m: Mono): string {
  return monoFormat(c, m, varsText);
}

function polyFormat(
  p: Poly,
  normalizeFirst: boolean,
  varsOf: (m: Mono) => string,
): string {
  const items = normalizeFirst ? normPoly(p) : p.filter((t) => t.c !== 0);
  if (items.length === 0) return "0";
  return items
    .map((t, i) => {
      if (i === 0) return monoFormat(t.c, t.m, varsOf);
      const body = monoFormat(Math.abs(t.c), t.m, varsOf);
      return `${t.c < 0 ? ` ${MINUS} ` : " + "}${body}`;
    })
    .join("");
}

export function polyHtml(p: Poly, normalizeFirst = true): string {
  return polyFormat(p, normalizeFirst, varsHtml);
}

export function polyText(p: Poly, normalizeFirst = true): string {
  return polyFormat(p, normalizeFirst, varsText);
}

/** Coefficient of a specific monomial inside a polynomial. */
export function coefOf(p: Poly, m: Mono): number {
  const key = monoKey(m);
  return normPoly(p).find((t) => monoKey(t.m) === key)?.c ?? 0;
}

// ─── Symmetry & planar geometry helpers ─────────────────────────────────────

export interface Point2D {
  x: number;
  y: number;
}

export function dist2D(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function reflectOverVertical(p: Point2D, xAxis: number): Point2D {
  return { x: 2 * xAxis - p.x, y: p.y };
}

export function reflectOverHorizontal(p: Point2D, yAxis: number): Point2D {
  return { x: p.x, y: 2 * yAxis - p.y };
}

export function reflectOverDiagonalYEqualsX(p: Point2D): Point2D {
  return { x: p.y, y: p.x };
}

export function reflectOverPoint(p: Point2D, center: Point2D): Point2D {
  return { x: 2 * center.x - p.x, y: 2 * center.y - p.y };
}

export function midpoint(a: Point2D, b: Point2D): Point2D {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

export function angleDeg(vertex: Point2D, p1: Point2D, p2: Point2D): number {
  const ux = p1.x - vertex.x;
  const uy = p1.y - vertex.y;
  const vx = p2.x - vertex.x;
  const vy = p2.y - vertex.y;
  const nu = Math.hypot(ux, uy);
  const nv = Math.hypot(vx, vy);
  if (nu < 1e-9 || nv < 1e-9) return 0;
  const cos = Math.max(-1, Math.min(1, (ux * vx + uy * vy) / (nu * nv)));
  return (Math.acos(cos) * 180) / Math.PI;
}

/** Sum of interior angles in a simple n-gon: (n − 2) · 180°. */
export function polygonAngleSum(n: number): number {
  return (n - 2) * 180;
}

// ─── Triangle & congruence helpers ──────────────────────────────────────────

export function triangleValid(a: number, b: number, c: number): boolean {
  return a > 0 && b > 0 && c > 0 && a + b > c && a + c > b && b + c > a;
}

export function circumcenter(A: Point2D, B: Point2D, C: Point2D): Point2D | null {
  const d = 2 * (A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y));
  if (Math.abs(d) < 1e-9) return null;
  const a2 = A.x * A.x + A.y * A.y;
  const b2 = B.x * B.x + B.y * B.y;
  const c2 = C.x * C.x + C.y * C.y;
  return {
    x: (a2 * (B.y - C.y) + b2 * (C.y - A.y) + c2 * (A.y - B.y)) / d,
    y: (a2 * (C.x - B.x) + b2 * (A.x - C.x) + c2 * (B.x - A.x)) / d,
  };
}

export function incenter(A: Point2D, B: Point2D, C: Point2D): Point2D {
  const a = dist2D(B, C);
  const b = dist2D(A, C);
  const c = dist2D(A, B);
  const p = a + b + c || 1;
  return {
    x: (a * A.x + b * B.x + c * C.x) / p,
    y: (a * A.y + b * B.y + c * C.y) / p,
  };
}

export function inradius(A: Point2D, B: Point2D, C: Point2D): number {
  const a = dist2D(B, C);
  const b = dist2D(A, C);
  const c = dist2D(A, B);
  const s = (a + b + c) / 2;
  const area2 = Math.abs(
    A.x * (B.y - C.y) + B.x * (C.y - A.y) + C.x * (A.y - B.y),
  );
  return s > 1e-9 ? area2 / (2 * s) : 0;
}

/**
 * Given side b = |AC|, angle alpha at A (in degrees) and opposite side a = |BC|,
 * returns how many non-degenerate triangles exist (0, 1 or 2) and the two
 * candidate distances c along ray AB when a triangle exists.
 */
export function sswSolutions(
  b: number,
  a: number,
  alphaDeg: number,
): { count: 0 | 1 | 2; cs: number[]; height: number } {
  const rad = (alphaDeg * Math.PI) / 180;
  const sinA = Math.sin(rad);
  const cosA = Math.cos(rad);
  const height = b * sinA;
  const disc = a * a - height * height;
  if (alphaDeg <= 0 || alphaDeg >= 180 || b <= 0 || a <= 0) {
    return { count: 0, cs: [], height };
  }
  if (disc < -1e-6) return { count: 0, cs: [], height };
  const root = Math.sqrt(Math.max(0, disc));
  const c1 = b * cosA - root;
  const c2 = b * cosA + root;
  const positives = [c1, c2].filter((v) => v > 1e-5);
  if (positives.length === 2 && Math.abs(c1 - c2) < 1e-4) {
    return { count: 1, cs: [c2], height };
  }
  const unique = positives.length === 2 ? [c1, c2] : positives;
  return {
    count: unique.length === 2 ? 2 : unique.length === 1 ? 1 : 0,
    cs: unique,
    height,
  };
}

// ─── Percent & descriptive statistics helpers ───────────────────────────────

export function percentAfter(base: number, changePercent: number): number {
  return round(base * (1 + changePercent / 100), 9);
}

export function percentChainPercent(p1: number, p2: number): number {
  return round(((1 + p1 / 100) * (1 + p2 / 100) - 1) * 100, 9);
}

export function sorted(values: readonly number[]): number[] {
  return [...values].sort((a, b) => a - b);
}

export function mean(values: readonly number[]): number {
  return values.reduce((acc, v) => acc + v, 0) / values.length;
}

export function median(values: readonly number[]): number {
  const s = sorted(values);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 === 1 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

/**
 * Lower and upper quartile as the medians of the lower and upper half of the
 * ordered list; for odd length, the median itself belongs to neither half.
 */
export function quartiles(values: readonly number[]): {
  q1: number;
  q2: number;
  q3: number;
} {
  const s = sorted(values);
  const half = Math.floor(s.length / 2);
  const lower = s.slice(0, half);
  const upper = s.slice(s.length % 2 === 1 ? half + 1 : half);
  return {
    q1: median(lower),
    q2: median(s),
    q3: median(upper),
  };
}

export function fiveNumbers(values: readonly number[]) {
  const s = sorted(values);
  const { q1, q2, q3 } = quartiles(s);
  return {
    min: s[0],
    q1,
    q2,
    q3,
    max: s[s.length - 1],
    span: s[s.length - 1] - s[0],
    iqr: q3 - q1,
  };
}
