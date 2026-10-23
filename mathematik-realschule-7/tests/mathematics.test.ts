import { describe, expect, it } from "vitest";
import { ALL_LESSONS, findLessonById } from "../src/curriculum";
import { sampleExpectation } from "../src/curriculum/stage-8-daten";
import { compare } from "../src/curriculum/stage-6-algebra";
import { createRng, seedFrom } from "../src/exercises/rng";
import {
  angle,
  distance,
  statistics,
  polygonFromAngles,
  triangle,
  validTriangle,
} from "../src/models";
import { defaultLabValues, computeReadouts } from "../src/lab/engine";
import { labView } from "../src/lab/visuals";
import type { DifficultyLevel, ExerciseTask } from "../src/model/types";
const generate = (
  id: string,
  generator: string,
  seed: number,
  level: DifficultyLevel,
): ExerciseTask => {
  const lesson = findLessonById(id)!.lesson;
  return lesson.exercises
    .find((g) => g.id === generator)!
    .make(createRng(seed), level);
};
const numbers = (task: ExerciseTask) =>
  task.fields.filter((f) => f.kind === "number").map((f) => f.answer);
const selections = (task: ExerciseTask) =>
  task.fields.filter((f) => f.kind === "choice").map((f) => f.correctIndex);
function circles(svg: string, cls: string) {
  return [
    ...svg.matchAll(
      new RegExp(
        `<circle cx="([\\d.-]+)" cy="([\\d.-]+)" r="([\\d.-]+)" class="${cls}"`,
        "g",
      ),
    ),
  ].map((m) => ({ x: Number(m[1]), y: Number(m[2]), r: Number(m[3]) }));
}

describe("Unabhängige mathematische Gegenproben", () => {
  it("constructs the actual entered interior angles instead of a regular placeholder", () => {
    for (const alpha of [20, 40, 60, 80, 100, 120, 140])
      for (const beta of [20, 40, 60, 80, 100, 120, 140])
        for (const gamma of [20, 40, 60, 80, 100, 120, 140])
          for (const n of [3, 4]) {
            const angles =
              n === 3
                ? [alpha, beta, 180 - alpha - beta]
                : [alpha, beta, gamma, 360 - alpha - beta - gamma];
            const vertices = polygonFromAngles(angles),
              valid = angles.every((a) => a > 0 && a < 180);
            expect(vertices !== null, angles.join(",")).toBe(valid);
            if (!vertices) continue;
            vertices.forEach((P, i) => {
              expect(
                angle(vertices[(i + n - 1) % n], P, vertices[(i + 1) % n]),
                angles.join(","),
              ).toBeCloseTo(angles[i], 7);
            });
          }
  });

  it("reconstructs SSS triangles with the given lengths and the right side-angle ordering", () => {
    const rng = createRng(405);
    for (let i = 0; i < 500; i++) {
      const a = rng.int(1, 12),
        b = rng.int(1, 12),
        c = rng.int(1, 12),
        C = triangle(a, b, c);
      const sides = [a, b, c].sort((x, y) => x - y);
      expect(validTriangle(a, b, c)).toBe(sides[0] + sides[1] > sides[2]);
      if (!C) continue;
      const A = { x: 0, y: 0 },
        B = { x: c, y: 0 };
      expect(distance(A, C)).toBeCloseTo(b, 9);
      expect(distance(B, C)).toBeCloseTo(a, 9);
      const alpha = angle(B, A, C),
        beta = angle(A, B, C),
        gamma = angle(A, C, B);
      expect(alpha + beta + gamma).toBeCloseTo(180, 8);
      if (a !== b) expect(Math.sign(alpha - beta)).toBe(Math.sign(a - b));
    }
  });
  it("draws circumcircles through every vertex and incircles tangent to every side", () => {
    const lesson = findLessonById("ol-7-umkreis-inkreis")!.lesson,
      view = labView(lesson.lab.kind);
    for (const x of [-2, -1, 0, 1, 2])
      for (const h of [1, 2, 3, 4, 5])
        for (const mode of [0, 1]) {
          const v = { x, h, mode },
            svg = view.render(v, computeReadouts(lesson.lab, v)),
            circle = circles(svg, "lab-curve-2")[0];
          expect(circle).toBeDefined();
          // Drawing has a known equal-unit coordinate map: x = 106 + 22(x+7), y = 25 + 22(7-y).
          const centre = {
              x: (circle.x - 106) / 22 - 7,
              y: 7 - (circle.y - 25) / 22,
            },
            radius = circle.r / 22,
            A = { x: -3, y: 0 },
            B = { x: 3, y: 0 },
            C = { x, y: h };
          if (mode === 0)
            for (const vertex of [A, B, C])
              expect(distance(centre, vertex)).toBeCloseTo(radius, 2);
          else
            for (const [P, Q] of [
              [A, B],
              [B, C],
              [C, A],
            ]) {
              const areaTwice = Math.abs(
                (Q.x - P.x) * (centre.y - P.y) - (Q.y - P.y) * (centre.x - P.x),
              );
              expect(areaTwice / distance(P, Q)).toBeCloseTo(radius, 2);
            }
        }
  });
  it("draws both tangent points on the circle with perpendicular tangent and radius", () => {
    const l = findLessonById("ol-5-tangenten-konstruktion")!.lesson,
      view = labView(l.lab.kind);
    for (const radius of [2, 3, 4])
      for (const d of [5, 6, 7, 8, 9]) {
        const v = { radius, d, step: 4 },
          svg = view.render(v, computeReadouts(l.lab, v)),
          points = circles(svg, "lab-dot-small").filter((p) => p.r === 5);
        expect(points).toHaveLength(2);
        for (const point of points) {
          const x = (point.x - 20) / 30 - 5,
            y = 5 - (point.y - 30) / 30;
          expect(Math.hypot(x, y)).toBeCloseTo(radius, 2);
          expect(x * (d - x) - y * y).toBeCloseTo(0, 1);
        }
      }
  });
  it("verifies coordinate, midpoint and area task results geometrically", () => {
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 200; seed++) {
        let t = generate("pv-1-verschiebung", "bildpunkt", seed, level),
          m = t.meta!,
          n = numbers(t);
        expect(n[0] - m.x).toBe(m.u);
        expect(n[1] - m.y).toBe(m.v);
        if (level === 2) {
          expect(n[2] - n[0]).toBe(3);
          expect(n[3]).toBe(n[1]);
        }
        t = generate("pv-4-parallelogramm-mitte", "mitte", seed, level);
        m = t.meta!;
        n = numbers(t);
        if (level === 1) {
          expect(n[0] - m.x).toBe(m.u - n[0]);
          expect(n[1] - m.y).toBe(m.v - n[1]);
        } else {
          expect((m.x + n[0]) / 2).toBe((m.x + m.u) / 2);
          expect((m.y + n[1]) / 2).toBe((m.y + m.v) / 2);
        }
        t = generate("pv-5-determinante", "flaeche", seed, level);
        m = t.meta!;
        n = numbers(t);
        // Shoelace over the closed triangle, rather than the lesson's determinant helper.
        const vertices = [
          { x: 0, y: 0 },
          { x: m.u, y: m.v },
          { x: m.p, y: m.q },
        ];
        let sum = 0;
        for (let i = 0; i < 3; i++) {
          const P = vertices[i],
            Q = vertices[(i + 1) % 3];
          sum += (Q.x - P.x) * (Q.y + P.y);
        }
        const area = Math.abs(sum) / 2;
        expect(n[level === 1 ? 1 : 0]).toBe(area);
        if (level === 2) expect(n[1]).toBe(area * 100);
      }
  });
  it("checks equation solutions by substitution and inequality directions on both sides of the boundary", () => {
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 250; seed++) {
        let t = generate("al-2-gleichungen", "ax-plus-b", seed, level),
          m = t.meta!,
          x = numbers(t)[0];
        expect((level === 1 ? m.a : m.a + m.d) * x + m.b).toBe(
          (level === 1 ? 0 : m.d) * x + m.c,
        );
        t = generate("al-3-ungleichungen", "loesen-grenze", seed, level);
        m = t.meta!;
        const boundary = numbers(t)[0],
          relation = selections(t)[0];
        expect(m.a * boundary + m.b).toBe(m.c);
        for (const probe of [boundary - 1, boundary, boundary + 1])
          expect(compare(probe, boundary, relation)).toBe(
            compare(m.a * probe + m.b, m.c, m.rel),
          );
        t = generate("al-5-sachungleichungen", "maximale-anzahl", seed, level);
        m = t.meta!;
        x = numbers(t)[0];
        const allowed = (v: number) =>
          level === 1
            ? m.fee + m.price * v <= m.budget
            : m.fee + m.price * v < m.budget;
        expect(allowed(x)).toBe(true);
        expect(allowed(x + 1)).toBe(false);
        t = generate("al-5-sachungleichungen", "mindestens", seed, level);
        m = t.meta!;
        x = numbers(t)[0];
        const enough = (v: number) =>
          level === 1
            ? m.base + m.price * v >= m.target
            : m.base + m.price * v > m.target;
        expect(enough(x)).toBe(true);
        expect(enough(x - 1)).toBe(false);
      }
  });
  it("checks price and interest results with forward and backward transactions", () => {
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 250; seed++) {
        let t = generate(
            "pr-1-veraenderter-grundwert",
            "ein-schritt",
            seed,
            level,
          ),
          m = t.meta!,
          result = numbers(t)[0];
        const change = (m.base * m.p) / 100,
          first = m.up ? m.base + change : m.base - change;
        expect(result).toBeCloseTo(
          level === 1
            ? first
            : m.up
              ? first - (first * m.p) / 100
              : first + (first * m.p) / 100,
          8,
        );
        t = generate("pr-2-grundwert-zurueck", "alter-preis", seed, level);
        m = t.meta!;
        result = numbers(t)[0];
        expect(result - (result * m.p) / 100).toBeCloseTo(m.value, 9);
        t = generate("pr-2-grundwert-zurueck", "netto-aenderung", seed, level);
        m = t.meta!;
        result = numbers(t)[0];
        expect(result + (result * m.tax) / 100).toBeCloseTo(m.gross, 9);
        t = generate("pr-3-zinsrechnung", "kapital-zinssatz", seed, level);
        m = t.meta!;
        result = numbers(t)[0];
        expect(
          level === 1 ? (result * m.p) / 100 : (m.capital * result) / 100,
        ).toBeCloseTo(m.z, 9);
      }
  });
  it("retains the fixed work product in inverse-proportion tasks", () => {
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 250; seed++) {
        const t = generate(
            "pr-4-indirekt-proportional",
            "produkt-tabelle",
            seed,
            level,
          ),
          m = t.meta!,
          n = numbers(t),
          answer = n[level === 1 ? 1 : 0];
        expect(answer * m.next).toBeCloseTo(m.k, 9);
        expect(n[level === 1 ? 0 : 1]).toBe(m.k);
      }
  });
  it("checks mean, median, modes and range without depending on the displayed algorithm", () => {
    expect(statistics([9, 4, 2, 6, 4])).toMatchObject({
      mean: 5,
      median: 4,
      range: 7,
      modes: [4],
    });
    expect(statistics([2, 4, 6, 9]).median).toBe(5);
    expect(statistics([7, 2, 5, 2, 5]).modes).toEqual([2, 5]);
    expect(statistics([1, 1, 1]).range).toBe(0);
    for (const level of [1, 2] as const)
      for (let seed = 1; seed <= 200; seed++) {
        const t = generate("da-1-kenngroessen", "fuenf-werte", seed, level),
          b = t.meta!.base,
          n = numbers(t);
        expect(n[0]).toBe(b + (level === 1 ? 2 : 3));
        expect(n[1]).toBe(b + (level === 1 ? 1 : 2));
        if (level === 2) expect(n[2]).toBe(8);
      }
    expect(sampleExpectation(20, 20)).toBe(50);
    expect(sampleExpectation(10, 30)).toBe(65);
    expect(sampleExpectation(0, 0)).toBeNull();
  });
  it("keeps circle boundary membership distinct for strict, closed and intersected regions", () => {
    const circle = findLessonById("ol-1-kreisbereiche")!.lesson.lab;
    for (const [mode, yes] of [
      [0, true],
      [1, true],
      [2, true],
      [3, false],
    ] as const)
      expect(
        computeReadouts(circle, { x: 3, y: 0, radius: 3, mode }).belongs,
      ).toBe(yes ? "ja" : "nein");
    const intersection = findLessonById("ol-6-ortsschnitte")!.lesson.lab;
    expect(computeReadouts(intersection, { x: 1, y: 0, mode: 0 }).belongs).toBe(
      "ja",
    );
    expect(computeReadouts(intersection, { x: 1, y: 0, mode: 2 }).belongs).toBe(
      "nein",
    );
    const thales = findLessonById("ol-3-thales")!.lesson.lab;
    expect(computeReadouts(thales, { x: 3.2, y: 2.4 }).on).toBe(
      "auf dem Kreis",
    );
    expect(computeReadouts(thales, { x: 4, y: 0 }).angle).toBe("kein Dreieck");
  });
  it("makes level two a different task and supplies an interactive handle in every lesson", () => {
    for (const lesson of ALL_LESSONS) {
      for (const g of lesson.exercises) {
        const first = g.make(createRng(seedFrom(g.id)), 1),
          second = g.make(createRng(seedFrom(g.id)), 2);
        expect(first.prompt, `${lesson.id}/${g.id}`).not.toBe(second.prompt);
      }
      const v = defaultLabValues(lesson.lab),
        view = labView(lesson.lab.kind);
      expect(Object.keys(view.handles ?? {}).length, lesson.id).toBeGreaterThan(
        0,
      );
      expect(view.render(v, computeReadouts(lesson.lab, v))).toContain(
        "data-handle=",
      );
    }
  });
});
