import { gcd } from "./exercises/format";

/**
 * Exact arithmetic with whole numbers, so fractions never pass through
 * rounded decimals. Lessons, labs and generators share these models; the
 * tests check them against independent calculations.
 */

/** The fully reduced fraction, with the sign in the numerator. */
export function reduce(n: number, d: number): [number, number] {
  const g = gcd(n, d);
  const sign = d < 0 ? -1 : 1;
  return [(sign * n) / g, (sign * d) / g];
}

export function lcm(a: number, b: number): number {
  return Math.abs(a * b) / gcd(a, b);
}

export const addFractions = (
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number] => reduce(a * d + c * b, b * d);

export const subFractions = (
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number] => reduce(a * d - c * b, b * d);

export const mulFractions = (
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number] => reduce(a * c, b * d);

export const divFractions = (
  a: number,
  b: number,
  c: number,
  d: number,
): [number, number] => reduce(a * d, b * c);

export interface DecimalExpansion {
  integer: number;
  /** Decimals before the period. */
  pre: string;
  /** The repeating digits; empty for a finite decimal. */
  period: string;
  negative: boolean;
}

/** The exact decimal expansion of n/d by long division, with its period. */
export function expansion(n: number, d: number): DecimalExpansion {
  const negative = n * d < 0;
  let top = Math.abs(n);
  const bottom = Math.abs(d);
  const integer = Math.floor(top / bottom);
  top %= bottom;
  const seen = new Map<number, number>();
  let digits = "";
  while (top !== 0 && !seen.has(top)) {
    seen.set(top, digits.length);
    top *= 10;
    digits += String(Math.floor(top / bottom));
    top %= bottom;
  }
  if (top === 0) return { integer, pre: digits, period: "", negative };
  const start = seen.get(top) ?? 0;
  return {
    integer,
    pre: digits.slice(0, start),
    period: digits.slice(start),
    negative,
  };
}

/** A finite decimal exactly when the reduced denominator has only the prime factors 2 and 5. */
export function isFinite25(n: number, d: number): boolean {
  let [, rest] = reduce(n, d);
  rest = Math.abs(rest);
  for (const p of [2, 5]) while (rest % p === 0) rest /= p;
  return rest === 1;
}

/** "0,16̅" for plain text and drawings: a combining overline on the period. */
export function decimalText(n: number, d: number): string {
  const e = expansion(n, d);
  const sign = e.negative ? "−" : "";
  const period = [...e.period].map((digit) => `${digit}̅`).join("");
  const decimals = e.pre + period;
  return decimals ? `${sign}${e.integer},${decimals}` : `${sign}${e.integer}`;
}

/** The same with a real overline, for HTML. */
export function decimalHtml(n: number, d: number): string {
  const e = expansion(n, d);
  const sign = e.negative ? "−" : "";
  const decimals =
    e.pre + (e.period ? `<span class="periode">${e.period}</span>` : "");
  return decimals ? `${sign}${e.integer},${decimals}` : `${sign}${e.integer}`;
}

/** "1 3/4" for an unreduced n/d; a whole number stays whole. */
export function mixedText(n: number, d: number): string {
  const [z, m] = reduce(n, d);
  const sign = z < 0 ? "−" : "";
  const top = Math.abs(z);
  const whole = Math.floor(top / m);
  const rest = top % m;
  if (rest === 0) return `${sign}${whole}`;
  return whole === 0 ? `${sign}${rest}/${m}` : `${sign}${whole} ${rest}/${m}`;
}

export function fractionKind(z: number, n: number): string {
  if (z < n) return "echter Bruch";
  return z % n === 0 ? "unechter Bruch, genau ganze Zahl" : "unechter Bruch";
}

/** Rounds half up to the given decimals, by the rule taught in school. */
export function roundSchool(value: number, digits: number): number {
  const factor = 10 ** digits;
  const scaled = Math.abs(value) * factor;
  const up = Math.floor(Number((scaled + 0.5).toFixed(6)));
  const result = up / factor;
  return value < 0 ? -result : result;
}

/** A float result cleaned of binary noise, e.g. 0.1 + 0.2. */
export const clean = (value: number): number => Number(value.toFixed(9));

/** A point mirrored at the line through (px | py) with direction angle `deg`. */
export function mirrorPoint(
  x: number,
  y: number,
  deg: number,
  px = 0,
  py = 0,
): { x: number; y: number } {
  const t = (deg * Math.PI) / 180;
  const ux = Math.cos(t);
  const uy = Math.sin(t);
  const dx = x - px;
  const dy = y - py;
  const along = dx * ux + dy * uy;
  return {
    x: clean(px + 2 * along * ux - dx),
    y: clean(py + 2 * along * uy - dy),
  };
}

/** True when the polygon maps onto itself at the line through (px | py) with angle `deg`. */
export function isSymmetryAxis(
  polygon: Array<{ x: number; y: number }>,
  deg: number,
  px = 0,
  py = 0,
): boolean {
  return polygon.every((point) => {
    const image = mirrorPoint(point.x, point.y, deg, px, py);
    return polygon.some(
      (other) =>
        Math.abs(other.x - image.x) < 1e-6 &&
        Math.abs(other.y - image.y) < 1e-6,
    );
  });
}

/** Signed area of a polygon by the shoelace formula, for independent checks and the sense of rotation. */
export function signedArea(polygon: Array<{ x: number; y: number }>): number {
  let sum = 0;
  polygon.forEach((p, i) => {
    const q = polygon[(i + 1) % polygon.length];
    sum += p.x * q.y - q.x * p.y;
  });
  return sum / 2;
}
