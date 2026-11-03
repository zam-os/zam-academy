import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	applyLabOption,
	defaultLabState,
	evaluateLab,
	renderLabSceneSvg,
} from "../src/labs";
import type { LabControl, LabState } from "../src/model/types";

function cartesianStates(controls: ReadonlyArray<LabControl>): LabState[] {
	let acc: LabState[] = [{}];
	for (const ctrl of controls) {
		const next: LabState[] = [];
		for (const base of acc) {
			for (const opt of ctrl.options) {
				next.push({ ...base, [ctrl.key]: opt.value });
			}
		}
		acc = next;
	}
	return acc;
}

describe("Interactive Mitmach-Labore across all 20 stations", () => {
	for (const lesson of LESSONS) {
		it(`Station ${lesson.number} (${lesson.id}): 0/3 goals at start, every witness reaches its goal, all states render cleanly`, () => {
			const init = defaultLabState(lesson);
			const startEval = evaluateLab(lesson, init);
			expect(startEval.reachedGoalIds).toEqual([]);
			expect(startEval.allReached).toBe(false);

			for (const goal of lesson.lab.goals) {
				let state = defaultLabState(lesson);
				for (const [k, v] of Object.entries(goal.witness)) {
					state = applyLabOption(lesson, state, k, v);
				}
				const witnessEval = evaluateLab(lesson, state);
				expect(witnessEval.reachedGoalIds).toContain(goal.id);
			}

			const allStates = cartesianStates(lesson.lab.controls);
			expect(allStates.length).toBeGreaterThanOrEqual(4);
			for (const s of allStates) {
				const ev = evaluateLab(lesson, s);
				expect(ev.readouts.length).toBeGreaterThanOrEqual(2);
				for (const ro of ev.readouts) {
					expect(ro.label.length).toBeGreaterThan(2);
					expect(ro.value.length).toBeGreaterThan(2);
				}
				const svg = renderLabSceneSvg(lesson, s);
				expect(svg).toContain("<svg");
				expect(svg).toContain("</svg>");
			}
		});
	}

	it("Station 16 (orientierung-und-kartenlesen): only reports 6 cm = 1,5 km when the 1 : 25 000 hiking map is active", () => {
		const station16 = LESSONS.find(
			(l) => l.id === "orientierung-und-kartenlesen",
		);
		expect(station16).toBeDefined();
		if (!station16) return;

		const onEuropeMap = evaluateLab(station16, {
			nordung: "genordet",
			peilung: "suedost",
			kartenwahl: "weltkarte",
		});
		const peilungEurope = onEuropeMap.readouts.find(
			(r) => r.label === "Peilung zur Hütte",
		);
		expect(peilungEurope?.value).not.toContain("6 cm = 1,5 km");
		expect(peilungEurope?.value).toContain("300 km");

		const onHikingMap = evaluateLab(station16, {
			nordung: "genordet",
			peilung: "suedost",
			kartenwahl: "wanderkarte",
		});
		const peilungHiking = onHikingMap.readouts.find(
			(r) => r.label === "Peilung zur Hütte",
		);
		expect(peilungHiking?.value).toContain("6 cm = 1,5 km");
	});
});
