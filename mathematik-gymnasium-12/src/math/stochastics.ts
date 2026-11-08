/**
 * Stochastik und Testtheorie für Mathematik 12 Gymnasium.
 */

/** Fakultät n! */
export function fact(n: number): number {
  if (n < 0) return 0;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

/** Binomialkoeffizient n über k. */
export function binom(n: number, k: number): number {
  if (k < 0 || k > n) return 0;
  if (k === 0 || k === n) return 1;
  const c = Math.min(k, n - k);
  let res = 1;
  for (let i = 1; i <= c; i++) {
    res = (res * (n - i + 1)) / i;
  }
  return Math.round(res);
}

/** Bernoulli-Wahrscheinlichkeit B(n, p, k) = binom(n, k) * p^k * (1-p)^(n-k). */
export function bernoulliProb(n: number, p: number, k: number): number {
  if (k < 0 || k > n) return 0;
  return binom(n, k) * Math.pow(p, k) * Math.pow(1 - p, n - k);
}

/** Kumulierte Binomialwahrscheinlichkeit P(X <= k). */
export function binomCdf(n: number, p: number, k: number): number {
  if (k < 0) return 0;
  if (k >= n) return 1;
  let sum = 0;
  for (let i = 0; i <= k; i++) {
    sum += bernoulliProb(n, p, i);
  }
  return sum;
}

/** Erwartungswert einer binomialverteilten Zufallsgröße: μ = n · p. */
export function binomMu(n: number, p: number): number {
  return n * p;
}

/** Standardabweichung einer binomialverteilten Zufallsgröße: σ = √(n · p · (1-p)). */
export function binomSigma(n: number, p: number): number {
  return Math.sqrt(n * p * (1 - p));
}

/**
 * Einseitiger rechtsseitiger Signifikanztest:
 * H0: p <= p0, H1: p > p0
 * Ablehnungsbereich A = {c, ..., n}
 * Gesucht: kleinstes c in {1, ..., n} mit P_p0(X >= c) = 1 - binomCdf(n, p0, c - 1) <= alpha.
 */
export function rightSidedCriticalValue(n: number, p0: number, alpha: number): {
  c: number;
  alphaReal: number;
} {
  for (let c = 0; c <= n; c++) {
    const pGreaterEqual = 1 - binomCdf(n, p0, c - 1);
    if (pGreaterEqual <= alpha + 1e-9) {
      return { c, alphaReal: pGreaterEqual };
    }
  }
  return { c: n, alphaReal: bernoulliProb(n, p0, n) };
}

/**
 * Einseitiger linksseitiger Signifikanztest:
 * H0: p >= p0, H1: p < p0
 * Ablehnungsbereich A = {0, ..., c}
 * Gesucht: größtes c in {0, ..., n} mit P_p0(X <= c) = binomCdf(n, p0, c) <= alpha.
 */
export function leftSidedCriticalValue(n: number, p0: number, alpha: number): {
  c: number;
  alphaReal: number;
} {
  let bestC = 0;
  let bestAlpha = 0;
  for (let c = 0; c <= n; c++) {
    const pLessEqual = binomCdf(n, p0, c);
    if (pLessEqual <= alpha + 1e-9) {
      bestC = c;
      bestAlpha = pLessEqual;
    } else {
      break;
    }
  }
  return { c: bestC, alphaReal: bestAlpha };
}

/** Fehler 2. Art (Beta-Fehler) bei gegebener Alternativwahrscheinlichkeit p1. */
export function betaErrorRightSided(n: number, p1: number, c: number): number {
  // Nichtablehnung H0 bedeutet X <= c - 1
  return binomCdf(n, p1, c - 1);
}

export function betaErrorLeftSided(n: number, p1: number, c: number): number {
  // Nichtablehnung H0 bedeutet X >= c + 1
  return 1 - binomCdf(n, p1, c);
}
