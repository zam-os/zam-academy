import { describe, expect, it } from "vitest";
import { intTermSteps } from "../src/lab/views-ganz";
import { ADD_TERMS, LAKE_AREA, MIXED_TERMS, regroupSteps, REGROUP_TERMS, sizeTimes } from "../src/lab/views-gym";
import { timeText } from "../src/lab/views-groessen";
import { bigNumber } from "../src/lab/views-natuerlich";
import {
  additiveEquation,
  angleName,
  AREA,
  borrows,
  boxSurface,
  carries,
  circleLine,
  circleLinePoints,
  convert,
  digitSum,
  divisionSteps,
  divisors,
  factorText,
  foldNet,
  fromRoman,
  isPrime,
  LENGTH,
  MASS,
  multiplicativeEquation,
  NET_PATTERNS,
  notchArea,
  oppositeFace,
  primeFactors,
  quadName,
  roman,
  romanParts,
  roundTo,
  stackSurface,
  sup,
  termKind,
  termSolve,
  termText,
  termValue,
  TIME,
  twoCircles,
  twoCirclesPoints,
} from "../src/models";

describe("Zahlensysteme", () => {
  it("rechnet römische Zahlen in beide Richtungen um", () => {
    expect(roman(4)).toBe("IV");
    expect(roman(14)).toBe("XIV");
    expect(roman(49)).toBe("XLIX");
    expect(roman(1666)).toBe("MDCLXVI");
    expect(roman(1994)).toBe("MCMXCIV");
    for (let n = 1; n <= 3000; n++) {
      expect(fromRoman(roman(n))).toBe(n);
      expect(roman(n)).not.toMatch(/IIII|XXXX|CCCC|VV|LL|DD/);
      expect(romanParts(n).reduce((sum, [value]) => sum + value, 0)).toBe(n);
    }
  });

  it("baut große Zahlen aus Millionen und Tausendern", () => {
    expect(bigNumber(4, 587, 420)).toBe(4_587_420);
  });

  it("schreibt Exponenten hochgestellt", () => {
    expect(sup(2)).toBe("²");
    expect(sup(10)).toBe("¹⁰");
  });
});

describe("Runden und schriftliche Verfahren", () => {
  it("rundet ab der Mitte auf", () => {
    expect(roundTo(2650, 100)).toBe(2700);
    expect(roundTo(3499, 1000)).toBe(3000);
    expect(roundTo(4995, 10)).toBe(5000);
    expect(roundTo(79846, 1000)).toBe(80000);
    expect(roundTo(79846, 100)).toBe(79800);
  });

  it("zählt Überträge und Entbündelungen", () => {
    expect(carries(456, 789).reduce((a, b) => a + b, 0)).toBe(3);
    expect(carries(423, 152).reduce((a, b) => a + b, 0)).toBe(0);
    expect(borrows(503, 178).reduce((a, b) => a + b, 0)).toBe(2);
    expect(borrows(575, 152).reduce((a, b) => a + b, 0)).toBe(0);
  });

  it("teilt schriftlich Stelle für Stelle und findet den Rest", () => {
    const steps = divisionSteps(999, 8);
    expect(steps.map((s) => s.digit).join("")).toBe("124");
    expect(steps[steps.length - 1].rest).toBe(7);
    for (let a = 100; a < 1000; a += 37)
      for (let b = 2; b <= 25; b++) {
        const list = divisionSteps(a, b);
        expect(Number(list.map((s) => s.digit).join(""))).toBe(Math.floor(a / b));
        expect(list[list.length - 1].rest).toBe(a % b);
      }
  });
});

describe("Rechenregeln und Rechengesetze", () => {
  it("löst die drei Gleichungsformen mit der Umkehraufgabe", () => {
    for (const form of [0, 1, 2])
      for (let a = -20; a <= 20; a += 3)
        for (let b = -20; b <= 20; b += 3) {
          const eq = additiveEquation(form, a, b);
          expect(eq.left(eq.solution!)).toBe(b);
        }
    for (const form of [0, 1, 2])
      for (let a = -12; a <= 12; a++) {
        if (a === 0) continue;
        for (let x = -15; x <= 15; x++) {
          if (x === 0) continue;
          const b = form === 0 ? a * x : form === 1 ? x : a;
          const dividend = form === 2 ? a * x : a;
          const eq = multiplicativeEquation(form, dividend, b);
          expect(eq.solution, `${form} ${a} ${x}`).not.toBeNull();
          expect(eq.left(eq.solution!)).toBe(b);
        }
      }
    expect(multiplicativeEquation(0, 5, 7).solution).toBeNull();
    expect(multiplicativeEquation(2, 5, 0).solution).toBeNull();
  });

  it("gliedert Terme und rechnet sie in Schritten", () => {
    expect(ADD_TERMS.map(termValue)).toEqual([13, 18, 26]);
    expect(ADD_TERMS.map(termKind)).toEqual(["Differenz", "Summe", "Differenz"]);
    expect(MIXED_TERMS.map(termValue)).toEqual([-6, -36, -16, 3]);
    expect(MIXED_TERMS.map(termKind)).toEqual(["Summe", "Produkt", "Differenz", "Quotient"]);
    expect(termText(MIXED_TERMS[1])).toBe("(6 + 3) · (−4)");
    expect(termText(MIXED_TERMS[2])).toBe("48 : (−6) − 2³");
    expect(termSolve(MIXED_TERMS[0])).toEqual(["6 + (−12)", "−6"]);
    expect(termSolve(MIXED_TERMS[2]).at(-1)).toBe("−16");
    expect(termSolve(MIXED_TERMS[3]).at(-1)).toBe("3");
  });

  it("ordnet Summen geschickt, ohne den Wert zu ändern", () => {
    expect(regroupSteps(REGROUP_TERMS[0], true)).toEqual([50, 37, 30]);
    for (const numbers of REGROUP_TERMS) {
      const sum = numbers.reduce((a, b) => a + b, 0);
      expect(regroupSteps(numbers, false).at(-1)).toBe(sum);
      expect(regroupSteps(numbers, true).at(-1)).toBe(sum);
      const round = (order: boolean) => regroupSteps(numbers, order).filter((s) => s % 10 === 0).length;
      expect(round(true)).toBeGreaterThan(round(false));
    }
  });

  it("rechnet Terme mit ganzen Zahlen richtig", () => {
    expect(intTermSteps(0, -5, 3, -2).value).toBe(-11);
    expect(intTermSteps(1, -4, 1, -3).value).toBe(9);
    expect(intTermSteps(2, -2, -3, -4).value).toBe(-14);
    expect(intTermSteps(0, -5, 3, -2).text).toBe("−5 + 3 · (−2)");
  });
});

describe("Teilbarkeit", () => {
  it("prüft die Regeln gegen die Division", () => {
    for (let n = 1; n <= 2000; n++) {
      const text = String(n);
      expect(digitSum(n) % 3 === 0).toBe(n % 3 === 0);
      expect(digitSum(n) % 9 === 0).toBe(n % 9 === 0);
      expect(Number(text.slice(-2)) % 4 === 0).toBe(n % 4 === 0);
      expect(["0", "5"].includes(text.slice(-1))).toBe(n % 5 === 0);
    }
  });

  it("findet Teilermengen und Primzahlen", () => {
    expect(divisors(12)).toEqual([1, 2, 3, 4, 6, 12]);
    expect(divisors(60)).toHaveLength(12);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(2)).toBe(true);
    expect(isPrime(101)).toBe(true);
    expect(isPrime(91)).toBe(false);
  });

  it("zerlegt in Primfaktoren", () => {
    expect(primeFactors(60)).toEqual([2, 2, 3, 5]);
    expect(factorText(60)).toBe("2² · 3 · 5");
    expect(factorText(128)).toBe("2⁷");
    for (let n = 2; n <= 500; n++) {
      const factors = primeFactors(n);
      expect(factors.reduce((a, b) => a * b, 1)).toBe(n);
      expect(factors.every(isPrime)).toBe(true);
    }
  });

});

describe("Geometrie", () => {
  it("benennt alle Winkelarten und ihre Grenzen", () => {
    expect([0, 45, 90, 135, 180, 270, 360].map(angleName)).toEqual([
      "Nullwinkel",
      "spitzer Winkel",
      "rechter Winkel",
      "stumpfer Winkel",
      "gestreckter Winkel",
      "überstumpfer Winkel",
      "Vollwinkel",
    ]);
  });

  it("nennt für jedes Viereck den genauesten Namen", () => {
    const name = (...p: number[]) =>
      quadName([0, 2, 4, 6].map((i) => ({ x: p[i], y: p[i + 1] })));
    expect(name(1, 1, 5, 1, 5, 5, 1, 5)).toBe("Quadrat");
    expect(name(1, 1, 7, 1, 7, 4, 1, 4)).toBe("Rechteck");
    expect(name(1, 1, 6, 1, 9, 5, 4, 5)).toBe("Raute");
    expect(name(1, 1, 7, 1, 9, 4, 3, 4)).toBe("Parallelogramm");
    expect(name(1, 1, 5, 1, 4, 4, 1, 5)).toBe("Drachenviereck");
    expect(name(1, 1, 7, 1, 5, 4, 2, 4)).toBe("Trapez");
    expect(name(1, 1, 7, 2, 6, 5, 2, 3)).toBe("allgemeines Viereck");
    // Crossed, dented and flat corners have no standard name.
    expect(name(1, 1, 5, 1, 1, 5, 5, 5)).toBe("kein einfaches Viereck");
    expect(name(1, 1, 5, 1, 2, 2, 1, 5)).toBe("kein einfaches Viereck");
    expect(name(1, 1, 3, 1, 5, 1, 1, 5)).toBe("kein einfaches Viereck");
  });

  it("entscheidet die Lage von Kreis und Gerade und von zwei Kreisen", () => {
    expect(circleLine(5, 3)).toBe("Passante");
    expect(circleLine(3, 3)).toBe("Tangente");
    expect(circleLine(1, 3)).toBe("Sekante");
    expect([circleLinePoints(5, 3), circleLinePoints(3, 3), circleLinePoints(1, 3)]).toEqual([0, 1, 2]);
    expect(twoCircles(7, 3, 2)).toBe("liegen außerhalb voneinander");
    expect(twoCircles(5, 3, 2)).toBe("berühren sich von außen");
    expect(twoCircles(3, 3, 2)).toBe("schneiden sich");
    expect(twoCircles(1, 3, 2)).toBe("berühren sich von innen");
    expect(twoCircles(1, 5, 2)).toBe("einer liegt im anderen");
    expect(twoCircles(0, 3, 2)).toBe("haben denselben Mittelpunkt");
    expect([twoCirclesPoints(7, 3, 2), twoCirclesPoints(5, 3, 2), twoCirclesPoints(3, 3, 2), twoCirclesPoints(1, 3, 2)]).toEqual([0, 1, 2, 1]);
    expect(twoCirclesPoints(0, 3, 3)).toBe(Infinity);
  });

  it("berechnet Oberflächen von Quader und zusammengesetzten Körpern", () => {
    expect(boxSurface(5, 3, 2)).toBe(62);
    expect(boxSurface(3, 3, 3)).toBe(54);
    expect(stackSurface(6, 3, 4, 2)).toBe(108 + 16);
    // Direct count: both bodies minus the two touching faces.
    for (const [a, b, c, k] of [[6, 3, 4, 2], [5, 4, 3, 1], [8, 3, 6, 4]])
      expect(stackSurface(a, b, c, k)).toBe(boxSurface(a, b, c) + 6 * k * k - 2 * k * k);
  });

  it("faltet Würfelnetze richtig und erkennt Muster ohne Würfel", () => {
    expect(foldNet(NET_PATTERNS[0].cells)).not.toBeNull();
    expect(oppositeFace(NET_PATTERNS[0], 1)).toBe(6);
    expect(oppositeFace(NET_PATTERNS[0], 2)).toBe(4);
    expect(oppositeFace(NET_PATTERNS[0], 3)).toBe(5);
    expect(oppositeFace(NET_PATTERNS[1], 2)).toBe(5);
    expect(NET_PATTERNS.map((p) => foldNet(p.cells) !== null)).toEqual([true, true, true, false, false, false]);
  });
});

describe("Größen und Flächen", () => {
  it("rechnet Einheiten ohne Rundungsfehler um", () => {
    expect(convert(LENGTH, 3, 4, 3)).toBe(3000);
    expect(convert(LENGTH, 1, 3, 0)).toBe(1000);
    expect(convert(MASS, 2500, 1, 2)).toBe(2.5);
    expect(convert(MASS, 4, 3, 2)).toBe(4000);
    expect(convert(TIME, 2, 2, 1)).toBe(120);
    expect(TIME.units).toEqual(["s", "min", "h"]);
    expect(convert(AREA, 3, 3, 2)).toBe(300);
    expect(convert(AREA, 5, 5, 3)).toBe(50000);
    expect(convert(AREA, 2, 6, 5)).toBe(200);
  });

  it("nutzt bei Flächen immer die Umrechnungszahl 100", () => {
    expect(new Set(AREA.factors)).toEqual(new Set([100]));
    expect(AREA.units).toEqual(["mm²", "cm²", "dm²", "m²", "a", "ha", "km²"]);
  });

  it("rechnet beide Wege für zusammengesetzte Flächen gleich", () => {
    expect(notchArea(10, 8, 4, 3)).toBe(68);
    for (let w = 5; w <= 12; w++)
      for (let h = 4; h <= 10; h++)
        for (let cw = 1; cw <= 4; cw++)
          for (let ch = 1; ch <= 3; ch++) {
            const parts = w * (h - ch) + (w - cw) * ch;
            expect(parts).toBe(notchArea(w, h, cw, ch));
          }
  });

  it("rechnet mit Größen und schreibt die Zeit ohne Komma", () => {
    expect(sizeTimes(0, 3, 20, 4)).toBe("12 m 80 cm");
    expect(sizeTimes(2, 1, 25, 8)).toBe("10 €");
    expect(sizeTimes(1, 2, 50, 3)).toBe("6 kg 150 g");
    expect(timeText(5400)).toBe("1 h 30 min");
    expect(timeText(200)).toBe("3 min 20 s");
  });

  it("legt für den See einen festen Flächeninhalt zugrunde", () => {
    expect(LAKE_AREA).toBe(24);
  });
});
