/** Integer helpers for grade-6 arithmetic. Answers stay exact. */

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

/** Reduced positive denominator. The sign sits on the numerator. */
export function reduce(numerator: number, denominator: number): { n: number; d: number } {
  const sign = numerator * denominator < 0 ? -1 : 1;
  const g = gcd(numerator, denominator);
  return { n: (sign * Math.abs(Math.round(numerator))) / g, d: Math.abs(Math.round(denominator)) / g };
}

/** A fully reduced denominator has only the prime factors 2 and 5. */
export function isTerminating(numerator: number, denominator: number): boolean {
  let d = reduce(numerator, denominator).d;
  while (d % 2 === 0) d /= 2;
  while (d % 5 === 0) d /= 5;
  return d === 1;
}

/** 0.\overline{digit} as a reduced fraction, digit from 1 to 9. */
export function periodOne(digit: number): { n: number; d: number } {
  return reduce(digit, 9);
}

export function paraArea(base: number, height: number): number {
  return base * height;
}

export function triArea(base: number, height: number): number {
  return (base * height) / 2;
}

export function trapArea(a: number, c: number, height: number): number {
  return ((a + c) / 2) * height;
}

export function boxVolume(a: number, b: number, c: number): number {
  return a * b * c;
}

export function boxSurface(a: number, b: number, c: number): number {
  return 2 * (a * b + a * c + b * c);
}

/** Simple interest for one period: Z = K · p / 100. */
export function interest(capital: number, percent: number): number {
  return (capital * percent) / 100;
}

export function mean(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Half away from zero, so 1,5 becomes 2 and −1,5 becomes −2. */
export function roundHalfAway(value: number): number {
  const sign = value < 0 ? -1 : 1;
  return sign * Math.round(Math.abs(value));
}

export function roundTo(value: number, digits: number): number {
  const factor = 10 ** digits;
  return roundHalfAway(value * factor) / factor;
}

/** Volume unit as a power of 1000 relative to the cubic centimetre. */
const VOLUME: Record<string, number> = {
  mm3: 0.001,
  cm3: 1,
  ml: 1,
  dm3: 1000,
  l: 1000,
  m3: 1_000_000,
};

export function convertVolume(value: number, from: string, to: string): number {
  return (value * VOLUME[from]) / VOLUME[to];
}
