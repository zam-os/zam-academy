/**
 * Analysis und Differentialrechnung für Mathematik 12 Gymnasium.
 */

export interface PolyTerm {
  coeff: number;
  exp: number;
}

/** Berechnet P(x) für ein Polynom gegeben als Koeffizientenarray [a0, a1, a2, ...] (Index = Potenz). */
export function evalPoly(coeffs: number[], x: number): number {
  return coeffs.reduce((sum, c, exp) => sum + c * Math.pow(x, exp), 0);
}

/** Ableitung eines Polynoms. */
export function derivPoly(coeffs: number[]): number[] {
  if (coeffs.length <= 1) return [0];
  return coeffs.slice(1).map((c, i) => c * (i + 1));
}

/** Stammfunktion eines Polynoms mit C = 0. */
export function intPoly(coeffs: number[]): number[] {
  return [0, ...coeffs.map((c, i) => c / (i + 1))];
}

/** Formatierung eines Polynoms als HTML-String. */
export function formatPoly(coeffs: number[], variable = "x"): string {
  const parts: string[] = [];
  for (let exp = coeffs.length - 1; exp >= 0; exp--) {
    const c = coeffs[exp];
    if (Math.abs(c) < 1e-9) continue;
    const sign = c < 0 ? "−" : parts.length > 0 ? "+" : "";
    const absC = Math.abs(c);
    const coeffStr =
      exp === 0
        ? String(absC)
        : Math.abs(absC - 1) < 1e-9
          ? ""
          : String(absC);
    const varStr = exp === 0 ? "" : exp === 1 ? variable : `${variable}<sup>${exp}</sup>`;
    parts.push(`${sign}${parts.length > 0 ? " " : ""}${coeffStr}${varStr}`);
  }
  return parts.length === 0 ? "0" : parts.join(" ");
}

/**
 * Produktregel: (u · v)' = u' · v + u · v'
 * Für f(x) = (ax + b) · e^{kx}:
 * f'(x) = a · e^{kx} + (ax + b) · k · e^{kx} = (k·a·x + a + k·b) · e^{kx}
 */
export function derivLinearExp(a: number, b: number, k: number): { aPrime: number; bPrime: number } {
  return {
    aPrime: k * a,
    bPrime: a + k * b,
  };
}

/**
 * Quotientenregel: (u / v)' = (u' · v - u · v') / v²
 * Für u(x) = ax + b, v(x) = cx + d:
 * u' = a, v' = c
 * u'v - uv' = a(cx + d) - c(ax + b) = ad - bc
 */
export function derivLinearQuotient(a: number, b: number, c: number, d: number): number {
  return a * d - b * c;
}

/**
 * Ableitung von f(x) = ln(ax + b):
 * f'(x) = a / (ax + b)
 */
export function derivLnLinear(a: number, b: number, x: number): number {
  return a / (a * x + b);
}

/**
 * Ableitung von f(x) = x^r für rationales r:
 * f'(x) = r · x^{r-1}
 */
export function derivPower(r: number, x: number): number {
  return r * Math.pow(x, r - 1);
}
