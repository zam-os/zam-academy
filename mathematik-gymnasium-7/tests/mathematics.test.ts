import { describe, expect, it } from "vitest";
import {
  angleDeg,
  circumcenter,
  coefOf,
  dist2D,
  fiveNumbers,
  gcd,
  incenter,
  inradius,
  lcm,
  median,
  midpoint,
  normPoly,
  percentAfter,
  percentChainPercent,
  polyAdd,
  polyEval,
  polygonAngleSum,
  polyHtml,
  polyMul,
  polySub,
  polyText,
  quartiles,
  reflectOverDiagonalYEqualsX,
  reflectOverHorizontal,
  reflectOverPoint,
  reflectOverVertical,
  roundHalfAway,
  roundTo,
  sswSolutions,
  triangleValid,
} from "../src/curriculum/math";

describe("Rechen- und Termhelfer", () => {
  it("computes gcd, lcm and rounds halves away from zero", () => {
    expect(gcd(24, 36)).toBe(12);
    expect(lcm(12, 18)).toBe(36);
    expect(roundHalfAway(1.5)).toBe(2);
    expect(roundHalfAway(-1.5)).toBe(-2);
    expect(roundTo(1.25, 1)).toBe(1.3);
    expect(roundTo(-1.25, 1)).toBe(-1.3);
  });

  it("normalizes, adds, multiplies and evaluates multivariable polynomials", () => {
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

    const sum = polyAdd(a, b);
    expect(normPoly(sum)).toEqual([{ c: 4, m: { x: 1 } }]);
    expect(coefOf(polySub(a, b), {})).toBe(6);
    expect(polyText([{ c: 1, m: { x: 2 } }, { c: -2, m: { x: 1 } }])).toBe("x² − 2x");
    expect(polyHtml([{ c: 1, m: { a: 2 } }])).toBe("a<sup>2</sup>");
  });
});

describe("Geometrie, Prozent und Daten", () => {
  it("handles reflections, midpoints, angles and polygon angle sums", () => {
    const p = { x: 3, y: -1 };
    expect(reflectOverVertical(p, 1)).toEqual({ x: -1, y: -1 });
    expect(reflectOverHorizontal(p, 2)).toEqual({ x: 3, y: 5 });
    expect(reflectOverDiagonalYEqualsX(p)).toEqual({ x: -1, y: 3 });
    expect(reflectOverPoint(p, { x: 1, y: 1 })).toEqual({ x: -1, y: 3 });
    expect(midpoint({ x: -2, y: 4 }, { x: 4, y: 6 })).toEqual({ x: 1, y: 5 });
    expect(dist2D({ x: 0, y: 0 }, { x: 3, y: 4 })).toBe(5);
    expect(angleDeg({ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 0, y: 4 })).toBeCloseTo(90, 6);
    expect(polygonAngleSum(3)).toBe(180);
    expect(polygonAngleSum(6)).toBe(720);
  });

  it("checks triangle inequality, circumcenter, incenter and SsW cases", () => {
    expect(triangleValid(3, 4, 5)).toBe(true);
    expect(triangleValid(3, 5, 8)).toBe(false);

    const A = { x: 0, y: 0 };
    const B = { x: 4, y: 0 };
    const C = { x: 0, y: 3 };
    expect(circumcenter(A, B, C)).toEqual({ x: 2, y: 1.5 });
    expect(incenter(A, B, C)).toEqual({ x: 1, y: 1 });
    expect(inradius(A, B, C)).toBeCloseTo(1, 6);

    expect(sswSolutions(5, 7, 50).count).toBe(1);
    expect(sswSolutions(5, 4, 40).count).toBe(2);
    expect(sswSolutions(5, 2, 60).count).toBe(0);
  });

  it("computes percent chains and five-number data summaries", () => {
    expect(percentAfter(200, 15)).toBeCloseTo(230, 8);
    expect(percentChainPercent(10, -10)).toBeCloseTo(-1, 8);
    expect(median([7, 2, 11, 4])).toBe(5.5);
    expect(quartiles([2, 4, 5, 8, 10, 12, 15])).toEqual({ q1: 4, q2: 8, q3: 12 });
    expect(fiveNumbers([2, 4, 5, 8, 10, 12, 15])).toEqual({
      min: 2,
      q1: 4,
      q2: 8,
      q3: 12,
      max: 15,
      span: 13,
      iqr: 8,
    });
  });
});
