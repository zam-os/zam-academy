import { fmt, MINUS, round } from "../exercises/format";

/** Pure math helpers for Mathematik 8 Gymnasium: functions, lines, hyperbolas, fractions, Laplace, 2x2 systems, circles & cylinders. */

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

export function simplifyFrac(
  num: number,
  den: number,
): { num: number; den: number } {
  if (den === 0) throw new Error("Denominator must not be zero");
  const sign = den < 0 ? -1 : 1;
  const g = gcd(num, den);
  return {
    num: (sign * Math.round(num)) / g,
    den: (sign * Math.round(den)) / g,
  };
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

export function coefOf(p: Poly, m: Mono): number {
  const key = monoKey(m);
  return normPoly(p).find((t) => monoKey(t.m) === key)?.c ?? 0;
}

// ─── Linear functions & inequalities (LB 1, LB 2) ─────────────────────────────

export interface Point2D {
  x: number;
  y: number;
}

export function dist2D(a: Point2D, b: Point2D): number {
  return Math.hypot(b.x - a.x, b.y - a.y);
}

export function lineThroughPoints(
  p1: Point2D,
  p2: Point2D,
): { m: number; t: number } | null {
  const dx = p2.x - p1.x;
  if (Math.abs(dx) < 1e-9) return null;
  const m = (p2.y - p1.y) / dx;
  const t = p1.y - m * p1.x;
  return { m: round(m, 9), t: round(t, 9) };
}

export function lineZero(m: number, t: number): number | null {
  if (Math.abs(m) < 1e-9) return null;
  return round(-t / m, 9);
}

export function intersectLines(
  m1: number,
  t1: number,
  m2: number,
  t2: number,
):
  | { kind: "one"; point: Point2D }
  | { kind: "parallel" }
  | { kind: "identical" } {
  const dm = m1 - m2;
  if (Math.abs(dm) < 1e-9) {
    return Math.abs(t1 - t2) < 1e-9
      ? { kind: "identical" }
      : { kind: "parallel" };
  }
  const x = round((t2 - t1) / dm, 9);
  const y = round(m1 * x + t1, 9);
  return { kind: "one", point: { x, y } };
}

export type InequalityOp = "<" | "<=" | ">" | ">=";

function holdsConst(left: number, op: InequalityOp, right: number): boolean {
  if (op === "<") return left < right;
  if (op === "<=") return left <= right;
  if (op === ">") return left > right;
  return left >= right;
}

/**
 * Solves `a·x + b <op> c·x + d` and formats the result in Bavarian school
 * interval notation (`]−∞; x₀[`, `[x₀; ∞[`, `ℝ`, `∅`).
 */
export function solveLinearInequality(
  a: number,
  b: number,
  op: InequalityOp,
  c: number,
  d: number,
):
  | {
      kind: "ray";
      bound: number;
      dir: "<" | ">";
      closed: boolean;
      interval: string;
    }
  | { kind: "all"; interval: string }
  | { kind: "none"; interval: string } {
  const coef = a - c;
  const rhs = d - b;
  const closed = op === "<=" || op === ">=";
  if (Math.abs(coef) < 1e-9) {
    return holdsConst(0, op, rhs)
      ? { kind: "all", interval: "ℝ" }
      : { kind: "none", interval: "∅" };
  }
  const bound = round(rhs / coef, 9);
  let dir: "<" | ">" = op === "<" || op === "<=" ? "<" : ">";
  if (coef < 0) dir = dir === "<" ? ">" : "<";
  const bStr = fmt(bound, 2);
  const interval =
    dir === "<"
      ? `]${MINUS}∞; ${bStr}${closed ? "]" : "["}`
      : `${closed ? "[" : "]"}${bStr}; ∞[`;
  return { kind: "ray", bound, dir, closed, interval };
}

export function isDirectProportional(
  pairs: readonly Point2D[],
  tol = 1e-6,
): { ok: boolean; a: number | null } {
  const valid = pairs.filter((p) => Math.abs(p.x) > 1e-9);
  if (valid.length === 0) return { ok: false, a: null };
  if (pairs.some((p) => Math.abs(p.x) <= 1e-9 && Math.abs(p.y) > tol)) {
    return { ok: false, a: null };
  }
  const a = valid[0].y / valid[0].x;
  const ok = valid.every((p) => Math.abs(p.y / p.x - a) <= tol);
  return { ok, a: ok ? round(a, 9) : null };
}

// ─── Gebrochen-rationale Funktionen & Bruchterme (LB 3, LB 4) ────────────────

export function hyperbolaEval(
  x: number,
  a: number,
  b: number,
  c: number,
): number {
  const denom = x + b;
  if (Math.abs(denom) < 1e-9) return Number.NaN;
  return a / denom + c;
}

export function hyperbolaDomainGap(b: number): number {
  return round(-b, 9) === 0 ? 0 : round(-b, 9);
}

export function hyperbolaYIntercept(
  a: number,
  b: number,
  c: number,
): number | null {
  if (Math.abs(b) < 1e-9) return null;
  return round(a / b + c, 9);
}

export function hyperbolaZero(
  a: number,
  b: number,
  c: number,
): number | null {
  if (Math.abs(a) < 1e-9 || Math.abs(c) < 1e-9) return null;
  return round(-a / c - b, 9);
}

export function isInverseProportional(
  pairs: readonly Point2D[],
  tol = 1e-6,
): { ok: boolean; a: number | null } {
  if (pairs.length === 0) return { ok: false, a: null };
  if (pairs.some((p) => Math.abs(p.x) <= 1e-9 || Math.abs(p.y) <= 1e-9)) {
    return { ok: false, a: null };
  }
  const a = pairs[0].x * pairs[0].y;
  const ok = pairs.every((p) => Math.abs(p.x * p.y - a) <= tol);
  return { ok, a: ok ? round(a, 9) : null };
}

export function intPower(base: number, exponent: number): number {
  if (base === 0 && exponent <= 0) return Number.NaN;
  return round(base ** Math.round(exponent), 12);
}

/**
 * Solves `a / (x + b) = c / (x + d)` over the maximal domain `ℚ \ {−b, −d}`.
 */
export function solveSimpleFracEq(
  a: number,
  b: number,
  c: number,
  d: number,
):
  | { kind: "one"; x: number }
  | { kind: "extraneous"; candidate: number }
  | { kind: "all" }
  | { kind: "none" } {
  const coef = a - c;
  const rhs = c * b - a * d;
  if (Math.abs(coef) < 1e-9) {
    return Math.abs(rhs) < 1e-9 ? { kind: "all" } : { kind: "none" };
  }
  const x = round(rhs / coef, 9);
  if (Math.abs(x + b) < 1e-9 || Math.abs(x + d) < 1e-9) {
    return { kind: "extraneous", candidate: x };
  }
  return { kind: "one", x };
}

// ─── Laplace-Experimente & Stochastik (LB 5) ─────────────────────────────────

export function laplaceProb(favorable: number, total: number): number {
  if (total <= 0) return 0;
  return round(favorable / total, 9);
}

export function complementProb(p: number): number {
  return round(1 - p, 9);
}

export function countingTotal(choices: readonly number[]): number {
  return choices.reduce((acc, c) => acc * c, 1);
}

export function relFreq(hits: number, trials: number): number {
  if (trials <= 0) return 0;
  return round(hits / trials, 9);
}

export function seededSampleSim(
  n: number,
  p: number,
  seed: number,
): {
  hits: number;
  freq: number;
  series: Array<{ n: number; freq: number }>;
} {
  let state = ((Math.round(seed) * 1103515245 + 12345) >>> 0) || 1;
  let hits = 0;
  const total = Math.max(1, Math.round(n));
  const checkpoints = Math.min(20, total);
  const step = Math.max(1, Math.floor(total / checkpoints));
  const series: Array<{ n: number; freq: number }> = [];
  for (let i = 1; i <= total; i++) {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    const u = state / 4294967296;
    if (u < p) hits++;
    if (i % step === 0 || i === total) {
      series.push({ n: i, freq: hits / i });
    }
  }
  return { hits, freq: round(hits / total, 4), series };
}

// ─── Lineare Gleichungssysteme 2×2 (LB 6) ────────────────────────────────────

/**
 * Solves `a1·x + b1·y = c1` and `a2·x + b2·y = c2`.
 */
export function solve2x2(
  a1: number,
  b1: number,
  c1: number,
  a2: number,
  b2: number,
  c2: number,
):
  | { kind: "unique"; x: number; y: number }
  | { kind: "none" }
  | { kind: "infinite" } {
  const det = a1 * b2 - a2 * b1;
  const detX = c1 * b2 - c2 * b1;
  const detY = a1 * c2 - a2 * c1;
  if (Math.abs(det) < 1e-9) {
    return Math.abs(detX) < 1e-9 && Math.abs(detY) < 1e-9
      ? { kind: "infinite" }
      : { kind: "none" };
  }
  return {
    kind: "unique",
    x: round(detX / det, 9),
    y: round(detY / det, 9),
  };
}

// ─── Kreis, Prisma & Zylinder (LB 7) ─────────────────────────────────────────

export function circleCircumference(r: number): number {
  return 2 * Math.PI * r;
}

export function circleArea(r: number): number {
  return Math.PI * r * r;
}

export function sectorArc(r: number, alphaDeg: number): number {
  return 2 * Math.PI * r * (alphaDeg / 360);
}

export function sectorArea(r: number, alphaDeg: number): number {
  return Math.PI * r * r * (alphaDeg / 360);
}

export function annulusArea(rOuter: number, rInner: number): number {
  return Math.PI * (rOuter * rOuter - rInner * rInner);
}

export function regularPolygonPerimeter(n: number, r: number): number {
  return 2 * n * r * Math.sin(Math.PI / n);
}

export function regularPolygonArea(n: number, r: number): number {
  return 0.5 * n * r * r * Math.sin((2 * Math.PI) / n);
}

export function cylinderLateral(r: number, h: number): number {
  return 2 * Math.PI * r * h;
}

export function cylinderSurface(r: number, h: number): number {
  return 2 * Math.PI * r * (r + h);
}

export function cylinderVolume(r: number, h: number): number {
  return Math.PI * r * r * h;
}

export function prismVolume(baseArea: number, h: number): number {
  return baseArea * h;
}

export function prismSurface(
  baseArea: number,
  basePerimeter: number,
  h: number,
): number {
  return 2 * baseArea + basePerimeter * h;
}
