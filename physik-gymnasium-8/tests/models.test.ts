import { expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  extension,
  fallFactor,
  initialModelState,
  lampCurrent,
  lensImage,
  MODEL_SCENARIOS,
  modelReady,
  modelValues,
  PARAMS,
  ray,
  recordExploration,
  setModelValue,
  sourceCurrent,
} from "../src/models";
import { renderModel, renderModelOutput } from "../src/ui/models";

it.each(LESSONS)(
  "renders finite diagrams and has reachable, initially open goals ($id)",
  (lesson) => {
    const kind = lesson.model!;
    const defaults = modelValues(kind, initialModelState());
    expect(recordExploration(kind, [], {})).toEqual([]);
    expect(renderModel(lesson, [], {})).toContain("0 / 2 Ziele");
    const grid = PARAMS[kind].reduce<Record<string, number>[]>(
      (combinations, p) =>
        combinations.flatMap((combo) =>
          Array.from(
            { length: Math.floor((p.max - p.min) / p.step + 0.001) + 1 },
            (_, n) => setModelValue(kind, combo, p.key, p.min + n * p.step),
          ),
        ),
      [{}],
    );
    let achieved: string[] = [];
    for (const setting of grid) {
      achieved = recordExploration(kind, achieved, setting);
      const output = renderModelOutput(kind, { ...defaults, ...setting });
      expect(output).not.toMatch(/NaN|undefined|Infinity/);
      expect(output).toContain('role="img"');
      expect(output).toContain("<figcaption>");
    }
    expect(modelReady(kind, achieved)).toBe(true);
    expect(MODEL_SCENARIOS[kind]).toHaveLength(2);
  },
);

it("uses physical values for the selected teaching models", () => {
  expect(ray(0, 1, 1.5)).toBe(0);
  expect(ray(60, 1, 1.5)).toBeLessThan(60);
  expect(ray(30, 1.5, 1)).toBeGreaterThan(30);
  expect(ray(42, 1.5, 1)).toBeNull();
  expect(ray(75, 1.5, 1.45)).not.toBeNull();
  expect(ray(76, 1.5, 1.45)).toBeNull();
  expect(lensImage(5)).toBe(-10);
  expect(lensImage(10)).toBeNull();
  expect(lensImage(20)).toBe(20);
  expect(8 / lampCurrent(8)).toBeGreaterThan(4 / lampCurrent(4));
  expect(extension(3, 0)).toBe(6);
  expect(extension(6, 0)).toBeGreaterThan(12);
  expect(extension(6, 1)).toBe(6);
  expect(fallFactor(0)).toBeGreaterThan(fallFactor(1));
  expect(sourceCurrent(4.5, 2, 20, 0)).toBe(0);
  expect(sourceCurrent(4.5, 2, 20, 1)).toBeCloseTo(4.5 / 22);
});

it("credits a virtual magnifier image anywhere inside the focal length", () => {
  expect(recordExploration("sammellinse", [], { g: 9 })).toContain("2");
  expect(recordExploration("sammellinse", [], { g: 10 })).not.toContain("2");
});
