import { describe, expect, it } from "vitest";
import { drawScene } from "../src/figures";
import {
	EXTENDED_LABS,
	modelReadings,
	modelReadout,
	parameterFor,
	setParameter,
} from "../src/extended-models";
import { freshLab, labGoals } from "../src/lab-model";
import type { ExtendedKind } from "../src/model/types";

function readings(kind: ExtendedKind, value: number) {
	const state = freshLab();
	setParameter(kind, state, value);
	return modelReadings(kind, state);
}
describe("Independent school-model calculations", () => {
	it("draws opposing torque directions for both lever arrangements", () => {
		for (const mode of ["one", "two"]) {
			const state = freshLab();
			setParameter("lever", state, 60);
			state.mode = mode;
			const svg = drawScene("lever", state);
			const vector = (role: string) => {
				const match = svg.match(
					new RegExp(
						`<g data-lever-${role}>[\\s\\S]*?<path d="M([^,]+),([^L]+)L([^,]+),([^\"]+)"`,
					),
				)!;
				return {
					x: Number(match[1]),
					sign: Math.sign(Number(match[4]) - Number(match[2])),
				};
			};
			const pivot = mode === "one" ? 85 : 245,
				load = vector("load"),
				effort = vector("effort");
			expect(load.sign).toBe(1);
			expect(effort.sign).toBe(mode === "one" ? -1 : 1);
			// 6 N at a 20 cm arm balances 2 N at 60 cm, with opposite signed moments.
			expect(
				(load.x - pivot) * 6 * load.sign + (effort.x - pivot) * 2 * effort.sign,
			).toBe(0);
		}
	});
	it("places the ramp load and force in the incline's coordinate frame", () => {
		const state = freshLab();
		setParameter("machines", state, 2);
		const svg = drawScene("machines", state);
		const angle = Number(
			svg.match(
				/data-ramp-load transform="translate\([^)]+\) rotate\(([^)]+)\)"/,
			)![1],
		);
		expect(angle).toBeCloseTo(-30, 8);
		expect(svg).toContain('x="-25" y="-35" width="50" height="35"');
		expect(svg).toContain("M0,-55L65,-55");
	});
	it("reads the specified spring's force/extension scale", () => {
		expect(readings("forceMeter", 0)).toEqual({ force: 0, extension: 0 });
		expect(readings("forceMeter", 3)).toEqual({ force: 3, extension: 6 });
		expect(readings("forceMeter", 6)).toEqual({ force: 6, extension: 12 });
	});
	it("distinguishes a zero path from ideal lifting work", () => {
		expect(readings("work", 0).work).toBe(0);
		expect(readings("work", 3).work).toBe(60);
		expect(readings("work", 5).work).toBe(100);
	});
	it("balances 6 N at a 20 cm load arm across the lever table", () => {
		for (const [arm, force] of [
			[20, 6],
			[40, 3],
			[60, 2],
			[80, 1.5],
		])
			expect(readings("lever", arm).effort).toBe(force);
	});
	it("trades ramp force for distance without creating ideal work", () => {
		for (const [length, force] of [
			[2, 30],
			[3, 20],
			[5, 12],
		]) {
			const r = readings("machines", length);
			expect(r.effort).toBe(force);
			expect(r.effort * r.length).toBe(60);
			expect(r.work).toBe(60);
		}
	});
	it("keeps seconds/metres and hours/kilometres consistent", () => {
		expect(readings("speed", 12)).toEqual({
			distance: 60,
			time: 12,
			speed: 5,
			kmh: 18,
		});
		expect(readings("speed", 30)).toEqual({
			distance: 60,
			time: 30,
			speed: 2,
			kmh: 7.2,
		});
		expect(readings("motionGraph", 3)).toEqual({ speed: 3, distance: 24 });
		expect(readings("motionGraph", 0).distance).toBe(0);
	});
	it("separates reaction and braking distance rather than promising real safety", () => {
		for (const [speed, reaction, braking, total] of [
			[30, 9, 9, 18],
			[50, 15, 25, 40],
			[60, 18, 36, 54],
			[90, 27, 81, 108],
		])
			expect(readings("stopping", speed)).toEqual({
				speed,
				reaction,
				braking,
				total,
			});
		expect(
			readings("stopping", 60).braking / readings("stopping", 30).braking,
		).toBe(4);
	});
});

describe("Bounded model proposals", () => {
	const kinds = (Object.keys(EXTENDED_LABS) as ExtendedKind[]).filter((k) =>
		parameterFor(k),
	);
	it.each(kinds)(
		"renders finite values throughout %s's control range",
		(kind) => {
			const definition = parameterFor(kind)!;
			const state = freshLab();
			expect(labGoals(kind, state).some((g) => g.met)).toBe(false);
			for (
				let value = definition.min;
				value <= definition.max;
				value += definition.step
			) {
				setParameter(kind, state, value);
				expect(
					Object.values(modelReadings(kind, state)).every(Number.isFinite),
				).toBe(true);
				expect(drawScene(kind, state) + modelReadout(kind, state)).not.toMatch(
					/NaN|Infinity|undefined/,
				);
			}
			setParameter(kind, state, definition.min - 100);
			expect(state.parameters[kind]).toBe(definition.min);
			setParameter(kind, state, definition.max + 100);
			expect(state.parameters[kind]).toBe(definition.max);
			setParameter(kind, state, NaN);
			setParameter(kind, state, Infinity);
			expect(state.parameters[kind]).toBe(definition.max);
		},
	);
});
