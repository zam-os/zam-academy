import { describe, expect, it } from "vitest";
import { ALL_LESSONS } from "../src/curriculum";
import { createRng, seedFrom } from "../src/exercises/rng";
import { checkTask, parseNumber } from "../src/exercises/checker";
import { decimal, PREFIXES } from "../src/powers";

/** Independent evaluation by repeated multiplication and division. */
function repeated(base: number, exponent: number): number {
  let value = 1;
  for (let i = 0; i < Math.abs(exponent); i++)
    value = exponent < 0 ? value / base : value * base;
  return value;
}

describe("Potenzregeln und Größen", () => {
  for (const lesson of ALL_LESSONS.filter((entry) =>
    entry.id.startsWith("pt-"),
  )) {
    for (const generator of lesson.exercises) {
      for (const level of [1, 2] as const) {
        it(`${lesson.id}/${generator.id} L${level}: 200 independently recomputed scenarios`, () => {
          for (let seed = 1; seed <= 200; seed++) {
            const task = generator.make(
              createRng(seedFrom(`${generator.id}/${seed}`)),
              level,
            );
            const meta = task.meta!;
            const values = task.fields.map((field) =>
              field.kind === "number" ? field.answer : field.correctIndex,
            );
            if (generator.id === "kehrwert") {
              expect(values[0]).toBe(
                level === 1 ? repeated(meta.a, meta.n) : -meta.n,
              );
              expect(values[1]).toBeCloseTo(
                (level === 1 ? 1 : meta.initial) * repeated(meta.a, -meta.n),
                9,
              );
            }
            if (generator.id === "vorzeichen-und-null") {
              expect(values[0]).toBeCloseTo(
                repeated(level === 1 ? -meta.a : meta.a, -meta.n),
                9,
              );
              expect(values[1]).toBeCloseTo(
                level === 1 ? 1 : repeated(-meta.a, -meta.n),
                9,
              );
            }
            if (generator.id === "produkt") {
              if (level === 1) expect(values[0]).toBe(meta.c * meta.d);
              for (const x of [0.5, 2, 3]) {
                const combined = level === 1 ? values[1] : values[0];
                expect(repeated(x, combined)).toBeCloseTo(
                  repeated(x, meta.m) * repeated(x, meta.n),
                  8,
                );
              }
              if (level === 2)
                expect(values[1]).toBeCloseTo(
                  meta.c * repeated(2, meta.m) * meta.d * repeated(2, meta.n),
                  8,
                );
            }
            if (generator.id === "quotient") {
              if (level === 1) {
                expect(repeated(2, values[0])).toBeCloseTo(
                  repeated(2, meta.m) / repeated(2, meta.n),
                  8,
                );
              } else expect(values[0]).toBe(meta.n);
              expect(values[1]).toBeCloseTo(
                repeated(2, meta.m) / repeated(2, meta.n),
                8,
              );
            }
            if (generator.id === "gleicher-exponent") {
              const left = repeated(
                meta.quotient ? meta.a * meta.b : meta.a,
                meta.n,
              );
              const right = repeated(meta.b, meta.n);
              expect(values[1]).toBeCloseTo(
                meta.quotient ? left / right : left * right,
                8,
              );
            }
            if (generator.id === "potenz-potenzieren") {
              for (const x of [0.5, 2, -2])
                expect(repeated(x, values[0])).toBeCloseTo(
                  repeated(repeated(x, meta.m), meta.n),
                  8,
                );
              if (level === 2) {
                expect(values[2] === 0).toBe(
                  repeated(2, values[0]) === repeated(2, values[1]),
                );
              } else
                expect(values[1]).toBeCloseTo(
                  repeated(repeated(2, meta.m), meta.n),
                  9,
                );
            }
            if (generator.id === "normieren") {
              expect(values[0]).toBeGreaterThanOrEqual(1);
              expect(values[0]).toBeLessThan(10);
              const original =
                level === 1
                  ? meta.a * repeated(10, meta.n)
                  : meta.a *
                    repeated(10, meta.shift) *
                    repeated(10, meta.n - meta.shift);
              expect(
                (values[0] * repeated(10, values[1])) / original,
              ).toBeCloseTo(1, 10);
            }
            if (generator.id === "mit-zehnerpotenzen-rechnen") {
              expect(values[0]).toBeGreaterThanOrEqual(1);
              expect(values[0]).toBeLessThan(10);
              const original =
                meta.a * repeated(10, meta.m) * meta.b * repeated(10, meta.n);
              expect(
                (values[0] * repeated(10, values[1])) / original,
              ).toBeCloseTo(1, 10);
            }
            if (generator.id === "vorsilbe-lesen") {
              if (level === 1) expect(values[0]).toBe(meta.exponent);
              else
                expect(
                  (repeated(10, values[0]) * repeated(10, meta.to)) /
                    repeated(10, meta.from),
                ).toBeCloseTo(1, 10);
            }
            if (generator.id === "einheiten-umrechnen") {
              const dimension = level;
              const oldValue =
                meta.amount * repeated(repeated(10, meta.from), dimension);
              const newValue =
                meta.amount *
                repeated(10, values[0]) *
                repeated(repeated(10, meta.to), dimension);
              expect(newValue / oldValue).toBeCloseTo(1, 10);
              if (level === 1)
                expect(
                  (values[1] * repeated(10, meta.to)) / oldValue,
                ).toBeCloseTo(1, 10);
            }
          }
        });
      }
    }
  }

  it("covers every prefix from atto to exa without conflating milli and mega", () => {
    expect(PREFIXES.map((p) => p.exponent)).toEqual([
      -18, -15, -12, -9, -6, -3, -2, -1, 0, 1, 2, 3, 6, 9, 12, 15, 18,
    ]);
    expect(PREFIXES.find((p) => p.symbol === "m")!.exponent).toBe(-3);
    expect(PREFIXES.find((p) => p.symbol === "M")!.exponent).toBe(6);
  });

  it("keeps tiny nonzero values visible and accepts decimal commas, points and fractions", () => {
    expect(decimal(7.2e-10)).toBe("0,00000000072");
    expect(parseNumber("0,000001")).toBe(0.000001);
    expect(parseNumber("0.000001")).toBe(0.000001);
    expect(parseNumber("1/625")).toBe(1 / 625);
    expect(parseNumber("0⁻¹")).toBeNull();
    const task = ALL_LESSONS[4].exercises[1].make(createRng(2), 1);
    const field = {
      kind: "number" as const,
      label: "x",
      answer: 1e-6,
      unit: "m",
      digits: 6,
    };
    expect(checkTask({ ...task, fields: [field] }, ["0"]).status).toBe("wrong");
    expect(checkTask({ ...task, fields: [field] }, ["0,000001"]).status).toBe(
      "correct",
    );
  });
});
