import { describe, expect, it } from "vitest";
import {
  evalPoly,
  derivPoly,
  intPoly,
  formatPoly,
  derivLinearExp,
  derivLinearQuotient,
  derivLnLinear,
  derivPower,
} from "../src/math/calculus";
import {
  fact,
  binom,
  bernoulliProb,
  binomCdf,
  binomMu,
  binomSigma,
  rightSidedCriticalValue,
  leftSidedCriticalValue,
  betaErrorRightSided,
} from "../src/math/stochastics";
import {
  add3,
  sub3,
  scale3,
  dot3,
  len3,
  angleDeg3,
  cross3,
  areaParallelogram3,
  areaTriangle3,
  volumeSpat3,
  volumePyramid3,
  project3D,
  type Vec3,
} from "../src/math/vectors";

describe("Analysis / Calculus (LB 1 & LB 4)", () => {
  it("evaluates, differentiates, and integrates polynomials correctly", () => {
    // p(x) = 2 - 3x + x^2 -> coeffs: [2, -3, 1]
    const p = [2, -3, 1];
    expect(evalPoly(p, 0)).toBe(2);
    expect(evalPoly(p, 1)).toBe(0);
    expect(evalPoly(p, 2)).toBe(0);
    expect(evalPoly(p, 3)).toBe(2);

    // p'(x) = -3 + 2x -> coeffs: [-3, 2]
    const dp = derivPoly(p);
    expect(dp).toEqual([-3, 2]);
    expect(evalPoly(dp, 1.5)).toBe(0);

    // Constant polynomial derivative
    expect(derivPoly([5])).toEqual([0]);

    // Integral: P(x) = 2x - 1.5x^2 + (1/3)x^3 -> coeffs: [0, 2, -1.5, 1/3]
    const intP = intPoly(p);
    expect(intP[0]).toBe(0);
    expect(intP[1]).toBe(2);
    expect(intP[2]).toBe(-1.5);
    expect(Math.abs(intP[3] - 1 / 3)).toBeLessThan(1e-9);

    // Fundamental theorem of calculus check: derivPoly(intPoly(p)) == p
    const dIntP = derivPoly(intP);
    expect(dIntP.length).toBe(p.length);
    for (let i = 0; i < p.length; i++) {
      expect(Math.abs(dIntP[i] - p[i])).toBeLessThan(1e-9);
    }
  });

  it("formats polynomials cleanly as HTML strings", () => {
    expect(formatPoly([0])).toBe("0");
    expect(formatPoly([5])).toBe("5");
    expect(formatPoly([-3])).toBe("−3");
    // p(x) = 2 - 3x + x^2 -> "x<sup>2</sup> − 3x + 2"
    expect(formatPoly([2, -3, 1])).toBe("x<sup>2</sup> − 3x + 2");
    // p(x) = -x^3 + 4x -> "−x<sup>3</sup> + 4x"
    expect(formatPoly([0, 4, 0, -1])).toBe("−x<sup>3</sup> + 4x");
  });

  it("computes product rule for linear-exponential functions (ax + b) * e^{kx}", () => {
    // f(x) = (2x + 1) * e^{3x} -> f'(x) = (6x + 5) * e^{3x}
    const res = derivLinearExp(2, 1, 3);
    expect(res.aPrime).toBe(6);
    expect(res.bPrime).toBe(5);

    // f(x) = (x - 2) * e^{-x} -> a=1, b=-2, k=-1 -> f'(x) = (-x + 1 + 2) * e^{-x} = (-x + 3) * e^{-x}
    const res2 = derivLinearExp(1, -2, -1);
    expect(res2.aPrime).toBe(-1);
    expect(res2.bPrime).toBe(3);
  });

  it("computes quotient rule numerator for linear quotients (ax + b) / (cx + d)", () => {
    // (u/v)' numerator is ad - bc
    // (2x + 3) / (x - 1) -> a=2, b=3, c=1, d=-1 -> 2*(-1) - 3*1 = -5
    expect(derivLinearQuotient(2, 3, 1, -1)).toBe(-5);
    // (3x - 2) / (2x + 4) -> 3*4 - (-2)*2 = 12 + 4 = 16
    expect(derivLinearQuotient(3, -2, 2, 4)).toBe(16);
  });

  it("computes logarithmic and power derivatives", () => {
    // f(x) = ln(2x + 4) -> f'(1) = 2 / (2*1 + 4) = 2/6 = 1/3
    expect(Math.abs(derivLnLinear(2, 4, 1) - 1 / 3)).toBeLessThan(1e-9);

    // f(x) = x^{0.5} (sqrt(x)) -> f'(4) = 0.5 * 4^{-0.5} = 0.5 * 0.5 = 0.25
    expect(derivPower(0.5, 4)).toBe(0.25);
    // f(x) = x^{-1} -> f'(2) = -1 * 2^{-2} = -0.25
    expect(derivPower(-1, 2)).toBe(-0.25);
  });
});

describe("Stochastik / Testtheorie (LB 2 & LB 3)", () => {
  it("computes factorial and binomial coefficients", () => {
    expect(fact(0)).toBe(1);
    expect(fact(1)).toBe(1);
    expect(fact(5)).toBe(120);
    expect(fact(7)).toBe(5040);

    expect(binom(5, 0)).toBe(1);
    expect(binom(5, 1)).toBe(5);
    expect(binom(5, 2)).toBe(10);
    expect(binom(5, 3)).toBe(10);
    expect(binom(5, 5)).toBe(1);
    expect(binom(10, 4)).toBe(210);
    expect(binom(5, 6)).toBe(0);
    expect(binom(5, -1)).toBe(0);
  });

  it("computes Bernoulli probabilities and binomial cumulative distribution function", () => {
    // Fair coin, n=4, p=0.5
    // P(X=2) = 6 * (0.5)^4 = 6/16 = 0.375
    expect(bernoulliProb(4, 0.5, 2)).toBe(0.375);
    expect(bernoulliProb(4, 0.5, 0)).toBe(0.0625);
    expect(bernoulliProb(4, 0.5, 4)).toBe(0.0625);

    // CDF sums to 1
    expect(Math.abs(binomCdf(4, 0.5, 4) - 1)).toBeLessThan(1e-9);
    // P(X <= 1) = P(0) + P(1) = 0.0625 + 0.25 = 0.3125
    expect(Math.abs(binomCdf(4, 0.5, 1) - 0.3125)).toBeLessThan(1e-9);
  });

  it("computes expected value and standard deviation for binomial distribution", () => {
    // n=100, p=0.2 -> mu = 20, var = 100 * 0.2 * 0.8 = 16 -> sigma = 4
    expect(binomMu(100, 0.2)).toBe(20);
    expect(binomSigma(100, 0.2)).toBe(4);
  });

  it("computes right-sided and left-sided critical values and significance levels", () => {
    // n=50, p0=0.3, alpha=0.05
    const right = rightSidedCriticalValue(50, 0.3, 0.05);
    // P(X >= c) <= 0.05
    expect(right.c).toBeGreaterThan(15);
    expect(right.alphaReal).toBeLessThanOrEqual(0.05);
    expect(1 - binomCdf(50, 0.3, right.c - 1)).toBeCloseTo(right.alphaReal, 6);

    const left = leftSidedCriticalValue(50, 0.3, 0.05);
    // P(X <= c) <= 0.05
    expect(left.c).toBeLessThan(15);
    expect(left.alphaReal).toBeLessThanOrEqual(0.05);
    expect(binomCdf(50, 0.3, left.c)).toBeCloseTo(left.alphaReal, 6);
  });

  it("computes beta error (Type II error) for given alternative probability", () => {
    // n=50, p1=0.5, critical value c=21 (H0 rejected if X >= 21)
    // Beta = P(X <= 20 | p=0.5)
    const beta = betaErrorRightSided(50, 0.5, 21);
    expect(beta).toBeGreaterThan(0);
    expect(beta).toBeLessThan(1);
    expect(beta).toBeCloseTo(binomCdf(50, 0.5, 20), 8);
  });
});

describe("Vektorgeometrie im Raum (LB 5)", () => {
  const u: Vec3 = [1, 2, 3];
  const v: Vec3 = [4, -1, 2];

  it("performs 3D vector arithmetic", () => {
    expect(add3(u, v)).toEqual([5, 1, 5]);
    expect(sub3(u, v)).toEqual([-3, 3, 1]);
    expect(scale3(u, 2)).toEqual([2, 4, 6]);
  });

  it("computes dot product, vector length, and angle between vectors", () => {
    // u . v = 1*4 + 2*(-1) + 3*2 = 4 - 2 + 6 = 8
    expect(dot3(u, v)).toBe(8);
    // |u| = sqrt(1 + 4 + 9) = sqrt(14)
    expect(len3(u)).toBe(Math.sqrt(14));

    // Orthogonal vectors: [1, 0, 0] and [0, 1, 0] -> angle = 90 deg
    expect(angleDeg3([1, 0, 0], [0, 1, 0])).toBe(90);
    // Parallel vectors: [1, 2, 3] and [2, 4, 6] -> angle = 0 deg
    expect(angleDeg3([1, 2, 3], [2, 4, 6])).toBeCloseTo(0, 5);
    // Anti-parallel: [1, 0, 0] and [-1, 0, 0] -> angle = 180 deg
    expect(angleDeg3([1, 0, 0], [-1, 0, 0])).toBeCloseTo(180, 5);
  });

  it("computes cross product and geometric areas", () => {
    // e1 x e2 = e3
    expect(cross3([1, 0, 0], [0, 1, 0])).toEqual([0, 0, 1]);
    // u x v:
    // x: 2*2 - 3*(-1) = 4 + 3 = 7
    // y: 3*4 - 1*2 = 12 - 2 = 10
    // z: 1*(-1) - 2*4 = -1 - 8 = -9
    expect(cross3(u, v)).toEqual([7, 10, -9]);

    // Cross product is orthogonal to both inputs: (u x v) . u = 0 and (u x v) . v = 0
    const uv = cross3(u, v);
    expect(dot3(uv, u)).toBe(0);
    expect(dot3(uv, v)).toBe(0);

    // Parallelogram and triangle areas
    const pArea = areaParallelogram3(u, v);
    expect(pArea).toBe(len3(uv));
    expect(areaTriangle3(u, v)).toBe(0.5 * pArea);
  });

  it("computes spat volume and pyramid volume", () => {
    const w: Vec3 = [0, 0, 5];
    // Spat volume = |(u x v) . w| = |[7, 10, -9] . [0, 0, 5]| = |-45| = 45
    expect(volumeSpat3(u, v, w)).toBe(45);
    expect(volumePyramid3(u, v, w)).toBe(45 / 6);
  });

  it("projects 3D coordinates into 2D SVG canvas plane", () => {
    const origin = project3D([0, 0, 0], 240, 160, 20);
    expect(origin).toEqual({ x: 240, y: 160 });

    // Along x2 (horizontal to right): [0, 2, 0] -> x should increase by 2 * 20 = 40
    const x2Point = project3D([0, 2, 0], 240, 160, 20);
    expect(x2Point).toEqual({ x: 280, y: 160 });

    // Along x3 (vertical up): [0, 0, 2] -> y should decrease by 2 * 20 = 40
    const x3Point = project3D([0, 0, 2], 240, 160, 20);
    expect(x3Point).toEqual({ x: 240, y: 120 });
  });
});
