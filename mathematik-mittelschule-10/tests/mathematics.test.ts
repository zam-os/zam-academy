import { describe, expect, it } from "vitest";
import { ruleResult } from "../src/lab/views-potenzen";
import { findLessonById } from "../src/curriculum";
import { applyAction, computeReadouts, defaultLabValues } from "../src/lab/engine";
import { overtakeYear } from "../src/lab/views-wachstum";
import { chord, isParallel, isSimilar, scaleText, sortedRatios, triangleSides } from "../src/lab/views-aehnlichkeit";
import { quadrant } from "../src/lab/views-trigonometrie";
import { compositeSurface, compositeVolumes, spilled } from "../src/lab/views-kugel";
import { arrangements, factorial, pathFraction, seatChoices, testTable } from "../src/lab/views-zufall";
import { DATA_SETS, fractionSolution, intersectionKind, lineThrough, modelFits, parabolaThrough } from "../src/lab/views-funktionen";

describe("Potenzen und Wurzeln", () => {
  it("fasst Potenzgesetze wie im Labor zusammen", () => {
    expect(ruleResult(0, 4, 6)).toBe("a¹⁰");
    expect(ruleResult(1, 3, 3)).toBe("a⁰ = 1");
    expect(ruleResult(1, 2, 5)).toBe("a⁻³");
    expect(ruleResult(2, 3, 4)).toBe("a¹²");
  });
});


describe("Exponentialfunktion", () => {
  it("findet das Jahr, in dem exponentielles Wachstum lineares überholt", () => {
    expect(overtakeYear(100, 10, 20)).toBe(1);
    expect(overtakeYear(100, 20, 10)).toBe(15);
    expect(100 * 1.1 ** 14).toBeLessThan(100 + 20 * 14);
  });
  it("rechnet die Beispiele der Lektionen richtig", () => {
    expect(1000 * 1.06 ** 20).toBeCloseTo(3207.14, 2);
    expect(50000 * 1.05 ** 4).toBeCloseTo(60775.31, 2);
    expect((15000 / 12000) ** (1 / 8)).toBeCloseTo(1.0283, 4);
    expect(Math.log10(0.5) / Math.log10(0.85)).toBeCloseTo(4.27, 2);
    expect(0.8 ** 3).toBeCloseTo(0.512, 12);
  });
});

describe("Ähnliche Figuren", () => {
  it("erkennt ähnliche Dreiecke auch bei vertauschten Winkeln", () => {
    expect(isSimilar({ alpha2: 60, beta2: 40, c2: 5 })).toBe(true);
    expect(isSimilar({ alpha2: 50, beta2: 60, c2: 6 })).toBe(false);
    const r = sortedRatios({ alpha2: 40, beta2: 60, c2: 7.5 });
    for (const k of r) expect(k).toBeCloseTo(1.5, 12);
    const s = triangleSides(40, 60, 5);
    expect(s.a + s.b).toBeGreaterThan(s.c);
  });
  it("schreibt Maßstäbe als ganze Zahlen und prüft Parallelen", () => {
    expect(scaleText(1.5)).toBe("3 : 2");
    expect(scaleText(0.5)).toBe("1 : 2");
    expect(scaleText(2.25)).toBe("9 : 4");
    expect(isParallel({ a: 4, a2: 8, b: 3, b2: 6 })).toBe(true);
    expect(chord(8, 6) / chord(4, 3)).toBeCloseTo(2, 12);
  });
});

describe("Trigonometrie und Kugeln", () => {
  it("ordnet Winkel den Quadranten zu", () => {
    expect([30, 150, 210, 330, 0, 90, 270, 360].map(quadrant)).toEqual([1, 2, 3, 4, 0, 0, 0, 0]);
  });
  it("lässt beim ganz versenkten Ball das Kugelvolumen überlaufen", () => {
    expect(spilled(3, 100)).toBeCloseTo((4 / 3) * Math.PI * 27, 9);
    expect(spilled(3, 100) / (2 * Math.PI * 27)).toBeCloseTo(2 / 3, 12);
  });
  it("berechnet zusammengesetzte Körper", () => {
    const silo = compositeVolumes(0, 3, 8);
    expect(silo.total).toBeCloseTo(90 * Math.PI, 9);
    expect(compositeSurface(0, 3, 8) - Math.PI * 9).toBeCloseTo(66 * Math.PI, 9);
    const quarter = compositeVolumes(0, 3, 6);
    expect(quarter.sphere / quarter.total).toBeCloseTo(0.25, 12);
    const box = compositeVolumes(2, 5, 8);
    expect(box.part).toBe(1000);
    expect(1 - box.sphere / box.part).toBeCloseTo(1 - Math.PI / 6, 12);
  });
});

describe("Wahrscheinlichkeiten", () => {
  it("zählt Reihenfolgen", () => {
    expect(factorial(5)).toBe(120);
    expect(new Set(arrangements(4, false)).size).toBe(24);
    const fixed = arrangements(5, true);
    expect(fixed).toHaveLength(24);
    expect(fixed.every((w) => w.startsWith("A"))).toBe(true);
    expect(seatChoices(4, true)).toEqual([1, 3, 2, 1]);
  });
  it("rechnet Pfade und den Schnelltest", () => {
    expect(pathFraction(4, 2, true, [0, 0, 1])).toEqual([24, 120]);
    expect(pathFraction(5, 3, true, [0, 0])).toEqual([20, 56]);
    expect(testTable({ prev: 1, sens: 90, spec: 90 }).ppv).toBeCloseTo(9 / 108, 12);
  });
  it("erreicht das Simulationsziel mit fünfmal „100× ziehen“", () => {
    const lab = findLessonById("st-1-baumdiagramm")!.lesson.lab;
    let v = defaultLabValues(lab);
    for (let i = 0; i < 5; i++) v = applyAction(lab, v, "hundert");
    expect(v.n).toBe(500);
    const goal = lab.goals.find((g) => g.id === "simulation")!;
    expect(goal.check(v, computeReadouts(lab, v))).toBe(true);
  });
});

describe("Funktionale Zusammenhänge", () => {
  it("bestimmt Geraden und Parabeln aus Punkten", () => {
    expect(lineThrough({ x1: 1, y1: 3, x2: 4, y2: 9 })).toEqual({ m: 2, t: 1 });
    expect(lineThrough({ x1: 2, y1: 0, x2: 2, y2: 5 })).toBeNull();
    const pq = parabolaThrough({ x1: 1, y1: 2, x2: 3, y2: 6, s: 1 })!;
    expect(pq.p).toBeCloseTo(-2, 12);
    expect(pq.q).toBeCloseTo(3, 12);
    const arch = parabolaThrough({ x1: 0, y1: 3, x2: 1, y2: 4, s: -1 })!;
    expect([arch.p, arch.q]).toEqual([2, 3]);
  });
  it("findet Schnittpunkte und Lösungen", () => {
    expect(intersectionKind(1, 2).xs).toEqual([-2, 3]);
    expect(intersectionKind(0, -4).D).toBe(0);
    expect(fractionSolution(6, 1, 2)).toBe(4);
    expect(fractionSolution(6, 2, 0)).toBeNull();
  });
  it("hat zu jeder Situation genau ein passendes Modell", () => {
    const fits = DATA_SETS.map((_, data) => {
      const found: string[] = [];
      for (let type = 0; type < 3; type++)
        for (let k = 1; k <= 24; k++) if (modelFits({ data, type, k })) found.push(`${type}:${k}`);
      return found;
    });
    expect(fits).toEqual([["0:3"], ["1:24"], ["2:5"]]);
  });
});
