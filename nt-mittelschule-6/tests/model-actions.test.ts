import { describe, expect, it } from "vitest";
import { freshLab, LABS, labGoals, chooseLab } from "../src/lab-model";
import {
	actionCorrect,
	actionFor,
	actionMatches,
	actionState,
	applyModelAction,
	MODEL_ACTIONS,
} from "../src/model-actions";
import { answerInvestigation, usesModelControl } from "../src/investigations";
import { renderModelAction } from "../src/model-action-ui";
import { maleAnatomy } from "../src/figures/anatomy";
import type { LabKind } from "../src/model/types";
import { constructWitness } from "./model-action-witnesses";
const kinds = Object.keys(MODEL_ACTIONS) as LabKind[];
describe("learner-built models", () => {
	it("gives every model type at least one task with direct model manipulation", () => {
		expect(kinds).toHaveLength(25);
		expect(Object.keys(LABS)).toHaveLength(37);
		for (const kind of Object.keys(LABS) as LabKind[])
			expect(
				[0, 1, 2].some((i) => usesModelControl(kind, i)),
				kind,
			).toBe(true);
	});
	it.each(kinds)(
		"requires construction and explicit checking, rather than opening views or answering a quiz: %s",
		(kind) => {
			const s = freshLab();
			for (const choice of LABS[kind].choices) chooseLab(kind, s, choice.id);
			answerInvestigation(kind, s, 0, 0);
			applyModelAction(kind, s, { type: "check" });
			expect(actionMatches(kind, s)).toBe(false);
			expect(labGoals(kind, s)[0].met).toBe(false);
			constructWitness(kind, s);
			expect(actionCorrect(kind, s)).toBe(true);
			expect(actionMatches(kind, s)).toBe(false);
			expect(labGoals(kind, s)[0].met).toBe(false);
			applyModelAction(kind, s, { type: "check" });
			expect(actionMatches(kind, s)).toBe(true);
			expect(labGoals(kind, s)[0].met).toBe(true);
			expect(renderModelAction(kind, s)).not.toMatch(
				/\b(?:NaN|undefined|Infinity)\b/,
			);
			applyModelAction(kind, s, { type: "clear" });
			expect(actionCorrect(kind, s)).toBe(false);
			expect(labGoals(kind, s)[0].met).toBe(false);
		},
	);
	it("rejects reversed or extra food arrows and lets learners remove a mistaken edge", () => {
		const s = freshLab();
		constructWitness("foodweb", s);
		for (let i = 0; i < 2; i++) {
			applyModelAction("foodweb", s, { type: "node", id: "bird" });
			applyModelAction("foodweb", s, { type: "node", id: "leaf" });
			applyModelAction("foodweb", s, { type: "check" });
			expect(actionMatches("foodweb", s)).toBe(i === 1);
		}
	});
	it("rejects a swapped organ label instead of merely counting placed labels", () => {
		const s = freshLab();
		constructWitness("organs", s);
		applyModelAction("organs", s, { type: "select-label", label: "Eileiter" });
		applyModelAction("organs", s, { type: "place", target: "0" });
		applyModelAction("organs", s, { type: "check" });
		expect(actionMatches("organs", s)).toBe(false);
		expect(renderModelAction("organs", s)).toContain(
			"Markierung 1: Kleines Organ seitlich neben dem Eileiter; zugeordnet: Eileiter",
		);
	});
	it("requires predictions before both trials and reruns after editing a prediction", () => {
		const s = freshLab();
		expect(
			applyModelAction("solutions", s, { type: "run", trial: "salt" }),
		).toBe(false);
		constructWitness("solutions", s);
		applyModelAction("solutions", s, {
			type: "predict",
			trial: "salt",
			outcome: "klar und kaum leitend",
		});
		applyModelAction("solutions", s, { type: "run", trial: "salt" });
		expect(actionState("solutions", s).trials.salt).toEqual({
			prediction: "klar und kaum leitend",
			outcome: "klar und deutlich leitend",
		});
		applyModelAction("solutions", s, { type: "check" });
		expect(actionMatches("solutions", s)).toBe(false);
		applyModelAction("solutions", s, {
			type: "predict",
			trial: "salt",
			outcome: "klar und deutlich leitend",
		});
		expect(actionCorrect("solutions", s)).toBe(false);
		applyModelAction("solutions", s, { type: "run", trial: "salt" });
		expect(actionCorrect("solutions", s)).toBe(true);
		applyModelAction("solutions", s, {
			type: "predict",
			trial: "salt",
			outcome: "",
		});
		expect(
			applyModelAction("solutions", s, { type: "run", trial: "salt" }),
		).toBe(false);
		expect(actionCorrect("solutions", s)).toBe(false);
	});
	it("builds exactly one water molecule, not just three arbitrary atoms", () => {
		const s = freshLab();
		constructWitness("molecules", s);
		expect(
			renderModelAction("molecules", s).match(/class="atom-H"/g),
		).toHaveLength(2);
		expect(
			renderModelAction("molecules", s).match(/class="atom-O"/g),
		).toHaveLength(1);
		applyModelAction("molecules", s, { type: "atom", element: "H", delta: -1 });
		applyModelAction("molecules", s, { type: "atom", element: "O", delta: 1 });
		expect(actionCorrect("molecules", s)).toBe(false);
	});
	it("distinguishes a force direction from the current direction of motion", () => {
		const s = freshLab();
		applyModelAction("forces", s, { type: "point", x: 500, y: 200 });
		expect(actionCorrect("forces", s)).toBe(false);
		applyModelAction("forces", s, { type: "point", x: 300, y: 100 });
		expect(actionCorrect("forces", s)).toBe(true);
	});
	it("requires a hidden location behind the barrier, not the vehicle or a visible point", () => {
		const s = freshLab();
		for (const [x, y] of [
			[100, 180],
			[285, 180],
			[360, 30],
		]) {
			applyModelAction("traffic", s, { type: "point", x, y });
			expect(actionCorrect("traffic", s)).toBe(false);
		}
		for (const [x, y] of [
			[360, 180],
			[400, 80],
			[470, 50],
			[470, 180],
		]) {
			applyModelAction("traffic", s, { type: "point", x, y });
			expect(actionCorrect("traffic", s), `hidden point ${x},${y}`).toBe(true);
		}
	});
	it("clamps off-canvas positions and ignores invalid commands", () => {
		const s = freshLab();
		applyModelAction("forces", s, { type: "point", x: 1000, y: -20 });
		expect(actionState("forces", s).point).toEqual({ x: 570, y: 30 });
		const before = JSON.stringify(s);
		expect(
			applyModelAction("forces", s, { type: "point", x: NaN, y: 20 }),
		).toBe(false);
		expect(applyModelAction("forces", s, { type: "place", target: "0" })).toBe(
			false,
		);
		expect(applyModelAction("forces", s, { type: "node", id: "leaf" })).toBe(
			false,
		);
		expect(JSON.stringify(s)).toBe(before);
		expect(
			applyModelAction("inquiry", s, { type: "move", index: 0, delta: -1 }),
		).toBe(false);
		expect(
			applyModelAction("organs", s, {
				type: "select-label",
				label: "untrusted",
			}),
		).toBe(false);
		expect(actionFor("lever")).toBeUndefined();
	});
});
describe("male anatomy", () => {
	it("places two testes in the scrotum below the penis root and bladder in the front view", () => {
		const svg = maleAnatomy();
		const testes = [
			...svg.matchAll(
				/data-anatomy-part="testis" cx="(\d+)" cy="(\d+)" rx="(\d+)" ry="(\d+)"/g,
			),
		];
		expect(testes).toHaveLength(2);
		expect(svg).toContain('data-anatomy-part="scrotum"');
		expect(svg).toContain('data-anatomy-part="penis" d="M284,190');
		for (const [, x, y, rx, ry] of testes) {
			expect(Number(x) - Number(rx)).toBeGreaterThan(245);
			expect(Number(x) + Number(rx)).toBeLessThan(355);
			expect(Number(y) - Number(ry)).toBeGreaterThan(235);
			expect(Number(y) + Number(ry)).toBeLessThan(335);
		}
		expect(svg).toContain('data-anatomy-part="bladder" cx="300" cy="100"');
		expect(svg).toContain('data-anatomy-part="urethra"');
		expect(svg).toContain('data-anatomy-part="vas-deferens"');
		expect(svg).toContain("Vorderansicht");
	});
});
