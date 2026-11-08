import { describe, expect, it } from "vitest";
import {
  convertVolume,
  interest,
  isTerminating,
  periodOne,
  roundHalfAway,
  roundTo,
  trapArea,
} from "../src/curriculum/math";

describe("Rechenhelfer", () => {
  it("rounds halves away from zero", () => {
    expect(roundHalfAway(1.5)).toBe(2);
    expect(roundHalfAway(-1.5)).toBe(-2);
    expect(roundTo(1.25, 1)).toBe(1.3);
    expect(roundTo(-1.25, 1)).toBe(-1.3);
  });

  it("recognises terminating fractions and a one-digit period", () => {
    expect(isTerminating(1, 8)).toBe(true);
    expect(isTerminating(1, 6)).toBe(false);
    expect(periodOne(3)).toEqual({ n: 1, d: 3 });
    expect(periodOne(9)).toEqual({ n: 1, d: 1 });
  });

  it("keeps interest, trapezoid area and volume units exact", () => {
    expect(interest(200, 3)).toBe(6);
    expect(trapArea(8, 4, 2)).toBe(12);
    expect(convertVolume(3, "l", "ml")).toBe(3000);
    expect(convertVolume(2, "m3", "l")).toBe(2000);
    expect(convertVolume(7, "cm3", "ml")).toBe(7);
  });
});
