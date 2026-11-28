import { describe, expect, it } from "vitest";
import {
  annulusArea,
  circleArea,
  circleCircumference,
  coefOf,
  complementProb,
  countingTotal,
  cylinderLateral,
  cylinderSurface,
  cylinderVolume,
  dist2D,
  gcd,
  hyperbolaDomainGap,
  hyperbolaEval,
  hyperbolaYIntercept,
  hyperbolaZero,
  intPower,
  intersectLines,
  isDirectProportional,
  isInverseProportional,
  laplaceProb,
  lcm,
  lineThroughPoints,
  lineZero,
  normPoly,
  polyAdd,
  polyEval,
  polyHtml,
  polyMul,
  polySub,
  polyText,
  prismSurface,
  prismVolume,
  regularPolygonArea,
  regularPolygonPerimeter,
  relFreq,
  roundHalfAway,
  roundTo,
  sectorArc,
  sectorArea,
  seededSampleSim,
  simplifyFrac,
  solve2x2,
  solveLinearInequality,
  solveSimpleFracEq,
} from "../src/curriculum/math";

describe("Arithmetik, Brüche und Polynome", () => {
  it("computes gcd, lcm, simplified fractions and rounding", () => {
    expect(gcd(24, 36)).toBe(12);
    expect(lcm(12, 18)).toBe(36);
    expect(simplifyFrac(-6, 8)).toEqual({ num: -3, den: 4 });
    expect(simplifyFrac(6, -8)).toEqual({ num: -3, den: 4 });
    expect(roundHalfAway(1.5)).toBe(2);
    expect(roundHalfAway(-1.5)).toBe(-2);
    expect(roundTo(1.25, 1)).toBe(1.3);
  });

  it("normalizes, adds, multiplies and evaluates polynomials", () => {
    const a = [
      { c: 2, m: { x: 1 } },
      { c: 3, m: {} },
    ];
    const b = [
      { c: 2, m: { x: 1 } },
      { c: -3, m: {} },
    ];
    const diffSq = polyMul(a, b);
    expect(coefOf(diffSq, { x: 2 })).toBe(4);
    expect(coefOf(diffSq, { x: 1 })).toBe(0);
    expect(coefOf(diffSq, {})).toBe(-9);
    expect(polyEval(diffSq, { x: 3 })).toBe(27);
    expect(normPoly(polyAdd(a, b))).toEqual([{ c: 4, m: { x: 1 } }]);
    expect(coefOf(polySub(a, b), {})).toBe(6);
    expect(polyText([{ c: 1, m: { x: 2 } }, { c: -2, m: { x: 1 } }])).toBe("x² − 2x");
    expect(polyHtml([{ c: 1, m: { a: 2 } }])).toBe("a<sup>2</sup>");
  });
});

describe("Lineare & gebrochen-rationale Funktionen, Bruchterme", () => {
  it("computes lines, zeros, intersections, inequalities and proportionality", () => {
    expect(dist2D({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(lineThroughPoints({ x: 1, y: 3 }, { x: 3, y: 7 })).toEqual({ m: 2, t: 1 });
    expect(lineThroughPoints({ x: 2, y: 1 }, { x: 2, y: 5 })).toBeNull();
    expect(lineZero(2, -6)).toBe(3);
    expect(lineZero(0, 4)).toBeNull();

    expect(intersectLines(2, -1, -1, 5)).toEqual({
      kind: "one",
      point: { x: 2, y: 3 },
    });
    expect(intersectLines(2, 1, 2, -3)).toEqual({ kind: "parallel" });
    expect(intersectLines(2, 1, 2, 1)).toEqual({ kind: "identical" });

    expect(solveLinearInequality(-2, 4, "<", 0, 10)).toEqual({
      kind: "ray",
      bound: -3,
      dir: ">",
      closed: false,
      interval: "]−3; ∞[",
    });
    expect(solveLinearInequality(2, 1, ">=", 2, 5)).toEqual({
      kind: "none",
      interval: "∅",
    });
    expect(solveLinearInequality(2, 5, ">=", 2, 1)).toEqual({
      kind: "all",
      interval: "ℝ",
    });

    expect(isDirectProportional([{ x: 2, y: 5 }, { x: 4, y: 10 }])).toEqual({
      ok: true,
      a: 2.5,
    });
    expect(isDirectProportional([{ x: 0, y: 1 }, { x: 2, y: 5 }])).toEqual({
      ok: false,
      a: null,
    });
  });

  it("evaluates hyperbolas, powers and simple fractional equations", () => {
    expect(hyperbolaDomainGap(3)).toBe(-3);
    expect(hyperbolaEval(-3, 4, 3, 1)).toBeNaN();
    expect(hyperbolaEval(1, 4, 3, 1)).toBe(2);
    expect(hyperbolaYIntercept(6, 3, -1)).toBe(1);
    expect(hyperbolaYIntercept(6, 0, 1)).toBeNull();
    expect(hyperbolaZero(6, 1, -2)).toBe(2);
    expect(isInverseProportional([{ x: 2, y: 6 }, { x: 3, y: 4 }])).toEqual({
      ok: true,
      a: 12,
    });

    expect(intPower(2, -3)).toBe(0.125);
    expect(intPower(5, 0)).toBe(1);
    expect(intPower(0, -1)).toBeNaN();

    expect(solveSimpleFracEq(2, -1, 4, 3)).toEqual({ kind: "one", x: 5 });
    expect(solveSimpleFracEq(2, 1, 2, 1)).toEqual({ kind: "all" });
    expect(solveSimpleFracEq(2, 1, 3, 1)).toEqual({
      kind: "extraneous",
      candidate: -1,
    });
  });
});

describe("Stochastik, LGS 2×2 sowie Kreis und Zylinder", () => {
  it("computes Laplace probabilities, counting principle and simulations", () => {
    expect(laplaceProb(3, 12)).toBe(0.25);
    expect(complementProb(0.35)).toBe(0.65);
    expect(countingTotal([3, 4, 2])).toBe(24);
    expect(relFreq(18, 40)).toBe(0.45);
    const sim = seededSampleSim(200, 0.5, 3);
    expect(sim.hits).toBeGreaterThan(60);
    expect(sim.hits).toBeLessThan(140);
    expect(sim.series[sim.series.length - 1].n).toBe(200);
  });

  it("solves 2x2 linear systems for all three cases", () => {
    expect(solve2x2(1, 1, 5, 2, -1, 1)).toEqual({ kind: "unique", x: 2, y: 3 });
    expect(solve2x2(2, -1, 4, 4, -2, 1)).toEqual({ kind: "none" });
    expect(solve2x2(2, -1, 4, 4, -2, 8)).toEqual({ kind: "infinite" });
  });

  it("computes circles, sectors, polygons, prisms and cylinders", () => {
    expect(circleCircumference(5)).toBeCloseTo(10 * Math.PI, 9);
    expect(circleArea(5)).toBeCloseTo(25 * Math.PI, 9);
    expect(sectorArc(6, 90)).toBeCloseTo(3 * Math.PI, 9);
    expect(sectorArea(6, 90)).toBeCloseTo(9 * Math.PI, 9);
    expect(annulusArea(5, 3)).toBeCloseTo(16 * Math.PI, 9);
    expect(regularPolygonArea(1000, 1)).toBeCloseTo(Math.PI, 4);
    expect(regularPolygonPerimeter(1000, 1)).toBeCloseTo(2 * Math.PI, 4);
    expect(cylinderLateral(3, 5)).toBeCloseTo(30 * Math.PI, 9);
    expect(cylinderSurface(3, 5)).toBeCloseTo(48 * Math.PI, 9);
    expect(cylinderVolume(3, 5)).toBeCloseTo(45 * Math.PI, 9);
    expect(prismVolume(12, 5)).toBe(60);
    expect(prismSurface(12, 16, 5)).toBe(104);
  });
});
