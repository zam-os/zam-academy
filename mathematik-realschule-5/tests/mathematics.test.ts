import { describe, expect, it } from "vitest";
import { intTermSteps } from "../src/lab/views-ganz";
import {
  angleKind,
  angleName,
  AREA,
  borrows,
  carries,
  convert,
  digitSum,
  divisionSteps,
  divisors,
  dual,
  factorText,
  foldNet,
  fromRoman,
  ggt,
  isPrime,
  kgv,
  LENGTH,
  MASS,
  NET_PATTERNS,
  notchArea,
  oppositeFace,
  primeFactors,
  quadrilateral,
  roman,
  romanParts,
  roundTo,
  sideKind,
  SOLIDS,
  sup,
  termSteps,
  TIME,
  validTriangle,
  VOLUME,
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

  it("rechnet Dualzahlen wie im Unterricht um", () => {
    expect(dual(13)).toBe("1101");
    expect(dual(1000)).toHaveLength(10);
    for (let n = 1; n < 256; n++) {
      const sum = [...dual(n)].reverse().reduce((acc, bit, i) => acc + Number(bit) * 2 ** i, 0);
      expect(sum).toBe(n);
    }
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
  it("rechnet Terme in der richtigen Reihenfolge", () => {
    expect(termSteps(0, 2, 3, 4)).toMatchObject({ value: 14, wrong: 20 });
    expect(termSteps(1, 1, 4, 4)).toMatchObject({ value: 20, wrong: 17 });
    expect(termSteps(2, 3, 2, 5)).toMatchObject({ value: 19, wrong: 55 });
  });

  it("zeigt in jedem Schritt des Terms denselben Wert", () => {
    for (const term of [0, 1, 2])
      for (let a = 1; a <= 9; a++)
        for (let b = 1; b <= 9; b++)
          for (let c = 1; c <= 9; c++) {
            const t = termSteps(term, a, b, c);
            expect(Number(t.steps[t.steps.length - 1])).toBe(t.value);
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

  it("bestimmt ggT und kgV", () => {
    expect(ggt(12, 18)).toBe(6);
    expect(kgv(12, 18)).toBe(36);
    for (let a = 2; a <= 40; a++)
      for (let b = 2; b <= 40; b++) {
        expect(ggt(a, b) * kgv(a, b)).toBe(a * b);
        expect(a % ggt(a, b)).toBe(0);
        expect(kgv(a, b) % a).toBe(0);
      }
  });
});

describe("Geometrie", () => {
  it("benennt Dreiecke nach Seiten und Winkeln", () => {
    expect(sideKind(5, 5, 5)).toBe("gleichseitig");
    expect(sideKind(3, 3, 5)).toBe("gleichschenklig");
    expect(sideKind(3, 4, 5)).toBe("unregelmäßig");
    expect(angleKind(3, 4, 5)).toBe("rechtwinklig");
    expect(angleKind(3, 3, 5)).toBe("stumpfwinklig");
    expect(angleKind(5, 5, 5)).toBe("spitzwinklig");
    expect(validTriangle(2, 2, 5)).toBe(false);
  });

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

  it("benennt Vierecke nach ihren Seiten und Winkeln", () => {
    expect(quadrilateral(4, 4, 0, 0).name).toBe("Quadrat");
    expect(quadrilateral(6, 3, 0, 0).name).toBe("Rechteck");
    expect(quadrilateral(6, 3, 2, 0).name).toBe("Parallelogramm");
    expect(quadrilateral(5, 4, 3, 0).name).toBe("Raute");
    expect(quadrilateral(6, 3, 0, 1).name).toBe("gleichschenkliges Trapez");
    expect(quadrilateral(6, 3, 1, 1).name).toBe("Trapez");
    // A Raute really has four equal sides.
    const [a, b, c, d] = quadrilateral(5, 4, 3, 0).points;
    const side = (p: typeof a, q: typeof a) => Math.hypot(p.x - q.x, p.y - q.y);
    expect([side(a, b), side(b, c), side(c, d), side(d, a)]).toEqual([5, 5, 5, 5]);
  });

  it("zählt bei Körpern Ecken, Kanten und Flächen wie der Eulersche Polyedersatz", () => {
    for (const body of SOLIDS.slice(0, 4))
      expect(body.ecken - body.kanten + body.flaechen, body.name).toBe(2);
    expect(SOLIDS.find((s) => s.name === "Kugel")?.kanten).toBe(0);
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
    expect(convert(TIME, 1, 3, 0)).toBe(86400);
    expect(convert(VOLUME, 2, 1, 0)).toBe(2000);
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
});
