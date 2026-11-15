import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import { checkAnswer, parseNumberCandidates } from "../src/exercises/checker";
import { fmt } from "../src/exercises/format";
import { makeExercise } from "../src/exercises/generators";
import { createRng, type Rng } from "../src/exercises/rng";
import type { CalculationKind, ModelKind } from "../src/model/types";
import {
	applyScenario,
	extension,
	initialModelState,
	lampStates,
	lensImage,
	massOf,
	MODEL_SCENARIOS,
	modelReady,
	modelValues,
	PARAMS,
	recordExploration,
	refractedAngle,
	setModelValue,
	uniformMotion,
} from "../src/models";
import { renderFigure, renderModel } from "../src/ui/models";

describe("physical relationships and model boundaries", () => {
	it("uses proportional uniform motion, Hooke extension and density", () => {
		expect(uniformMotion(3, 5)).toBe(15);
		expect(uniformMotion(3, 10)).toBe(30);
		expect(extension(4, 2)).toBe(2);
		expect(extension(6, 2)).toBe(3);
		expect(extension(6.5, 2)).toBeNull();
		expect(massOf(2.7, 20)).toBe(54);
	});
	it("refracts to/from the normal and separates total reflection", () => {
		expect(refractedAngle(0, false)).toBe(0);
		expect(refractedAngle(35, false)).toBeLessThan(35);
		expect(refractedAngle(35, true)).toBeGreaterThan(35);
		expect(refractedAngle(55, true)).toBeNull();
		expect(refractedAngle(55, false)).not.toBeNull();
		const inside = refractedAngle(35, false)!;
		expect(refractedAngle(inside, true)).toBeCloseTo(35);
	});
	it("distinguishes real, virtual and focal-plane images", () => {
		expect(lensImage(15, 30)).toEqual({ b: 30, scale: -1, kind: "real" });
		expect(lensImage(15, 10)).toEqual({ b: -30, scale: 3, kind: "virtual" });
		expect(lensImage(15, 15)).toEqual({ b: null, scale: null, kind: "focus" });
	});
	it("satisfies the full switch truth table without a short-circuit path", () => {
		for (const a of [false, true])
			for (const b of [false, true]) {
				expect(lampStates(false, a, b, false)).toEqual([a && b, a && b]);
				expect(lampStates(true, a, b, false)).toEqual([a, b]);
				expect(lampStates(true, a, b, true)).toEqual([false, false]);
			}
	});
	it("rejects malformed controls and never starts with credited comparisons", () => {
		const state = initialModelState();
		for (const kind of Object.keys(PARAMS) as ModelKind[]) {
			expect(modelReady(kind, [])).toBe(false);
			expect(setModelValue(kind, state, "untrusted", 1)).toBe(state);
			const p = PARAMS[kind][0];
			expect(setModelValue(kind, state, p.key, NaN)).toBe(state);
			expect(setModelValue(kind, state, p.key, p.max + p.step)).toBe(state);
			expect(setModelValue(kind, state, p.key, p.min + p.step / 2)).toBe(state);
			const scenarios = MODEL_SCENARIOS[kind];
			expect(new Set(scenarios.map((s) => JSON.stringify(s.values))).size).toBe(
				scenarios.length,
			);
			let seen: string[] = [];
			for (const scenario of scenarios) {
				const next = applyScenario(kind, state, scenario.id);
				expect(modelValues(kind, next)).toEqual(scenario.values);
				const html = renderModel(
					LESSONS.find((l) => l.model === kind)!,
					seen,
					next,
				);
				expect(html).not.toMatch(/NaN|Infinity|undefined/);
				expect(html).toContain('role="img"');
				seen = recordExploration(kind, seen, scenario.id);
			}
			expect(modelReady(kind, seen)).toBe(true);
			expect(recordExploration(kind, seen, scenarios[0].id)).toEqual(seen);
			expect(recordExploration(kind, seen, "unknown")).toEqual(seen);
		}
	});
	it("renders finite geometry across every allowed discrete slider setting", () => {
		for (const kind of Object.keys(PARAMS) as ModelKind[]) {
			const sweep = (at: number, values: Record<string, number>): void => {
				if (at === PARAMS[kind].length) {
					expect(renderFigure(kind, values)).not.toMatch(
						/NaN|Infinity|undefined/,
					);
					return;
				}
				const p = PARAMS[kind][at];
				for (let step = 0; step <= Math.round((p.max - p.min) / p.step); step++)
					sweep(at + 1, { ...values, [p.key]: p.min + step * p.step });
			};
			sweep(0, {});
		}
	});
});
const reference: Record<CalculationKind, [number, number]> = {
	length: [2.2, 21],
	speed: [2, 20],
	spring: [6, 4],
	weight: [2, 2],
	volume: [2, 0.004],
	density: [2, 30],
};
describe("independently calculated exercise references and German input", () => {
	it("rejects copied givens and common missed steps across 2,000 seeds per family and level", () => {
		for (const kind of Object.keys(reference) as CalculationKind[])
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 2000; seed++) {
					const t = makeExercise(kind, createRng(seed), level);
					const givens = [...t.prompt.matchAll(/\d+(?:,\d+)?/g)].map(
						([value]) => Number(value.replace(",", ".")),
					);
					const [x, y, z] = givens;
					let missedSteps: number[];
					switch (kind) {
						case "length":
							missedSteps = level === 1 ? [x * 10] : [y - x, y * 10];
							break;
						case "speed":
							missedSteps = level === 1 ? [x * y, y / x] : [y / x];
							break;
						case "spring":
							missedSteps =
								level === 1
									? [x + y, x / y]
									: [z - x, y / x, y / z, y * (z - x)];
							break;
						case "weight":
							missedSteps =
								level === 1 ? [x * y, x / y, x / 1000] : [x * y, x / y];
							break;
						case "volume":
							missedSteps = level === 1 ? [x + y, x - y] : [x * y * z];
							break;
						case "density":
							missedSteps =
								level === 1 || t.unit === "cm³"
									? [y / x, x * y]
									: [y / x, x + y];
							break;
					}
					for (const wrong of [...givens, ...missedSteps])
						expect(
							checkAnswer(t, wrong.toFixed(6)).status,
							`${kind} L${level}, seed ${seed}, copied value or missed step ${wrong}: ${t.prompt}`,
						).toBe("wrong");
				}
	});
	for (const [kind, answers] of Object.entries(reference))
		for (const level of [1, 2] as const)
			it(`${kind}, level ${level}`, () => {
				const rng: Rng = { int: (min) => min };
				expect(
					makeExercise(kind as CalculationKind, rng, level).answer,
				).toBeCloseTo(answers[level - 1], 10);
			});
	it("checks both numeric levels over seeded tasks with comma/point and useful error rejection", () => {
		for (const kind of Object.keys(reference) as CalculationKind[])
			for (const level of [1, 2] as const)
				for (let seed = 0; seed < 100; seed++) {
					const t = makeExercise(kind, createRng(seed), level);
					expect(Number.isFinite(t.answer)).toBe(true);
					for (const input of [
						t.answer.toFixed(3),
						t.answer.toFixed(3).replace(".", ","),
					])
						expect(checkAnswer(t, input).status).toBe("correct");
					expect(checkAnswer(t, String(t.answer + 10)).status).toBe("wrong");
					expect(checkAnswer(t, "").status).toBe("invalid");
					expect(t.prompt + t.solutionHtml).not.toMatch(/\d\.\d|-\d/);
					expect(t.prompt).not.toBe(
						makeExercise(kind, createRng(seed), level === 1 ? 2 : 1).prompt,
					);
				}
		expect(fmt(-3.25)).toBe("−3,25");
		expect(parseNumberCandidates("−3,25 cm")).toEqual([-3.25]);
		expect(parseNumberCandidates("1.234,5")).toEqual([1234.5]);
	});
});
