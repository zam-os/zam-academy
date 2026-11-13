import { describe, expect, it } from "vitest";
import {
  compositeArea,
  compositeSolid,
  compound,
  compoundTable,
  days360,
  daysFor,
  decimalString,
  diceCount,
  effectiveRate,
  factorOf,
  fromSci,
  interest,
  outcomes,
  pyramidSolid,
  rateFor,
  capitalFor,
  regularPolygon,
  sci,
  setText,
  SOLIDS,
  squarePyramid,
  yearInterest,
  yearsUntil,
} from "../src/models";

describe("Zinsrechnung", () => {
  it("rechnet die Beispiele der Lektionen nach", () => {
    expect(yearInterest(2400, 1.5)).toBeCloseTo(36, 10);
    expect(interest(3600, 2, 150)).toBeCloseTo(30, 10);
    expect(interest(3600, 2, 75)).toBeCloseTo(15, 10);
    expect(daysFor(50, 4000, 3)).toBeCloseTo(150, 10);
    expect(rateFor(30, 2000, 270)).toBeCloseTo(2, 10);
    expect(capitalFor(25, 2.5, 120)).toBeCloseTo(3000, 10);
    expect(effectiveRate(400, 12, 90)).toBeCloseTo(12, 10);
  });

  it("zählt Zinstage im Bankjahr mit 30 Tagen je Monat", () => {
    expect(days360(10, 2, 25, 4)).toBe(75);
    expect(days360(1, 0, 1, 1)).toBe(30);
    expect(days360(31, 0, 31, 2)).toBe(60);
  });

  it("führt die Zinseszinstabelle wie eine Bank: jedes Jahr auf Cent gerundet", () => {
    const rows = compoundTable(5000, 2, 3);
    expect(rows.map((r) => r.interest)).toEqual([100, 102, 104.04]);
    expect(rows.at(-1)!.end).toBe(5306.04);
    for (let start = 1000; start <= 10000; start += 700)
      for (const p of [1, 2.5, 4, 7.5])
        for (const n of [1, 5, 10]) {
          const end = compoundTable(start, p, n).at(-1)!.end;
          expect(Math.abs(end - compound(start, p, n))).toBeLessThan(0.01 * n);
        }
  });

  it("rechnet mit dem Zinsfaktor wie in den Laboraufträgen", () => {
    expect(factorOf(3.5)).toBeCloseTo(1.035, 12);
    expect(compound(4000, 3, 5)).toBeCloseTo(4637.1, 1);
    expect(yearsUntil(1000, 5, 2000)).toBe(15);
    expect(yearsUntil(5000, 4, 6000)).toBe(5);
    expect(compound(4000, 4, 6)).toBeGreaterThan(5000);
    expect(compound(4000, 3.5, 6)).toBeLessThan(5000);
  });
});

describe("Zehnerpotenzen", () => {
  it("schreibt Zahlen ohne Rundungsrauschen aus", () => {
    expect(decimalString(4.5, 6)).toBe("4.500.000");
    expect(decimalString(7.2, -4)).toBe("0,00072");
    expect(decimalString(9.9, -9)).toBe("0,0000000099");
    expect(decimalString(1.25, 1)).toBe("12,5");
    for (let n = -9; n <= 12; n++)
      for (const a of [1, 2.5, 9.9]) {
        const s = sci(fromSci(a, n));
        expect(s.a).toBeCloseTo(a, 9);
        expect(s.n).toBe(n);
      }
  });
});

describe("Geometrie und Körper", () => {
  it("rechnet regelmäßige Vielecke und Pyramiden nach", () => {
    expect(regularPolygon(8, 4).centre).toBe(45);
    expect(regularPolygon(8, 4).interior).toBe(135);
    expect(regularPolygon(6, 4).apothem).toBeCloseTo(3.4641, 4);
    expect(squarePyramid(6, 4).hs).toBeCloseTo(5, 12);
    expect(squarePyramid(6, 4).s).toBeCloseTo(Math.sqrt(34), 12);
    for (const kind of SOLIDS.slice(0, 4)) {
      const p = pyramidSolid(kind, 4, 5);
      // Eulerscher Polyedersatz: E − K + F = 2.
      expect(p.vertices - p.edges + p.faces).toBe(2);
    }
  });

  it("rechnet zusammengesetzte Figuren auf beiden Wegen gleich", () => {
    for (let w = 4; w <= 12; w++)
      for (let h = 3; h <= 10; h++)
        for (const x of [1, 2.5, 4])
          for (const y of [1, 3, 6]) {
            const L = compositeArea(0, w, h, x, y);
            expect(L.parts[0] + L.parts[1]).toBeCloseTo(L.whole - L.missing, 9);
            const R = compositeArea(2, w, h, x, y);
            expect(R.parts[0] + R.parts[1]).toBeCloseTo(R.whole - R.missing, 9);
          }
  });

  it("rechnet Körperbeispiele der Lektionen nach", () => {
    const silo = compositeSolid(2, 4, 0, 8, 1.5);
    expect(silo.total).toBeCloseTo(106.81, 2);
    expect(compositeSolid(1, 5, 0, 3, 3).total).toBe(100);
  });
});

describe("Wahrscheinlichkeiten", () => {
  it("zählt Ergebnisse von zwei Würfeln", () => {
    expect(diceCount(0, 7)).toBe(6);
    expect(diceCount(0, 12)).toBe(1);
    expect(diceCount(2, 0)).toBe(6);
    expect(diceCount(3, 0)).toBe(11);
    let all = 0;
    for (let s = 2; s <= 12; s++) all += diceCount(0, s);
    expect(all).toBe(36);
  });

  it("listet Ereignisse als Mengen", () => {
    expect(outcomes(8, 2).favourable).toEqual([2, 3, 5, 7]);
    expect(setText([2, 4, 6])).toBe("{2; 4; 6}");
  });
});
