import { describe, expect, it } from "vitest";
import { constructWitness } from "./model-action-witnesses";
import { actionFor, applyModelAction } from "../src/model-actions";
import {
	chooseLab,
	fmtDe,
	freshLab,
	LABS,
	labGoals,
	renderLab,
	setTemperature,
} from "../src/labs";
import { parameterFor, setParameter } from "../src/extended-models";
import { drawScene } from "../src/figures";
import type { LabKind } from "../src/model/types";
import {
	answerInvestigation,
	investigationMatches,
	INVESTIGATIONS,
	moveEnergy,
	setLabQuantity,
	usesModelControl,
} from "../src/investigations";

describe("Natur und Technik model behaviour", () => {
	const kinds = Object.keys(LABS) as LabKind[];
	it.each(kinds)(
		"does not award goals just for opening the three model explanations: %s",
		(kind) => {
			const s = freshLab();
			expect(labGoals(kind, s).some((g) => g.met)).toBe(false);
			for (const choice of LABS[kind].choices) {
				chooseLab(kind, s, choice.id);
				expect(labGoals(kind, s).some((g) => g.met)).toBe(false);
				const html = renderLab(kind, s);
				expect(html).toContain(choice.detail);
				expect(html).toContain('role="img"');
				expect(html).not.toMatch(/\b(?:NaN|undefined|Infinity)\b/);
			}
			chooseLab(kind, s, "untrusted");
			expect(s.mode).toBe(LABS[kind].choices[2].id);
			expect(s.seen).toHaveLength(3);
		},
	);
	const answers: Record<LabKind, number[]> = {
		inquiry: [1, 2, 0],
		safety: [2, 0, 1],
		waterUse: [2, 0, 1],
		properties: [1, 2, 0],
		solutions: [1, 2, 0],
		tension: [2, 0, 1],
		particles: [0, 0, 1],
		anomaly: [0, 0, 2],
		molecules: [1, 2, 0],
		electrolysis: [0, 0, 1],
		gases: [2, 0, 1],
		hydro: [0, 1, 2],
		foodweb: [0, 1, 2],
		photosynthesis: [0, 1, 2],
		soilLife: [1, 2, 0],
		soil: [2, 0, 1],
		aquaticKey: [0, 1, 2],
		microscope: [0, 1, 2],
		fish: [1, 2, 0],
		aquaticWeb: [1, 2, 0],
		habitat: [2, 0, 1],
		puberty: [0, 1, 2],
		organs: [1, 2, 0],
		fertilisation: [0, 1, 2],
		pregnancy: [1, 2, 0],
		contraception: [2, 0, 1],
		forces: [1, 2, 0],
		forceMeter: [0, 1, 2],
		work: [0, 1, 2],
		lever: [0, 1, 2],
		machines: [0, 1, 2],
		ergonomics: [0, 1, 2],
		speed: [0, 1, 2],
		motionGraph: [0, 1, 2],
		stopping: [0, 1, 2],
		inertia: [0, 1, 2],
		traffic: [1, 2, 0],
	};
	it.each(kinds)(
		"requires correct model work or a reasoned answer for all three goals: %s",
		(kind) => {
			const state = freshLab();
			if (actionFor(kind)) {
				constructWitness(kind, state);
				applyModelAction(kind, state, { type: "check" });
			}
			const witness: Record<string, number> = {
				microscope: 5,
				forceMeter: 3,
				work: 3,
				lever: 60,
				machines: 3,
				speed: 12,
				motionGraph: 3,
				stopping: 50,
			};
			if (parameterFor(kind)) setParameter(kind, state, witness[kind]);
			if (kind === "particles") {
				setTemperature(state, 0);
				setTemperature(state, 100);
			}
			if (kind === "electrolysis") {
				setLabQuantity(kind, state, "hydrogenCount", 2);
				expect(labGoals(kind, state)[0].met).toBe(false);
				setLabQuantity(kind, state, "oxygenCount", 1);
				setLabQuantity(kind, state, "hydrogenVolume", 20);
			}
			if (kind === "anomaly") {
				setLabQuantity(kind, state, "densityTemperature", 3);
				expect(labGoals(kind, state)[0].met).toBe(false);
				setLabQuantity(kind, state, "densityTemperature", 4);
			}
			if (kind === "hydro") {
				for (const index of [0, 1, 0, 2]) moveEnergy(state, index, 1);
				expect(state.energyOrder).toEqual([0, 1, 2, 3]);
			}
			INVESTIGATIONS[kind].forEach((question, index) => {
				expect(question.goal.length).toBeGreaterThan(25);
				if (usesModelControl(kind, index)) return;
				expect(new Set(question.options).size).toBe(3);
				answerInvestigation(kind, state, index, (answers[kind][index] + 1) % 3);
				expect(labGoals(kind, state)[index].met).toBe(false);
				answerInvestigation(kind, state, index, answers[kind][index]);
				expect(labGoals(kind, state)[index].met).toBe(true);
			});
			expect(labGoals(kind, state).every((g) => g.met)).toBe(true);
		},
	);
	it("distinguishes an unbalanced atom proposal from a previously solved goal", () => {
		const state = freshLab();
		setLabQuantity("electrolysis", state, "hydrogenCount", 2);
		setLabQuantity("electrolysis", state, "oxygenCount", 1);
		expect(investigationMatches("electrolysis", state, 0)).toBe(true);
		setLabQuantity("electrolysis", state, "oxygenCount", 2);
		expect(investigationMatches("electrolysis", state, 0)).toBe(false);
		expect(drawScene("electrolysis", state)).toContain("rechts: 4 H und 4 O");
		expect(renderLab("electrolysis", state)).toMatch(
			/data-investigation-feedback="0"[^>]*>Prüfe noch einmal:/,
		);
	});
	it("keeps model quantities finite and rejects answers for numeric-only tasks", () => {
		const state = freshLab();
		answerInvestigation("electrolysis", state, 0, 0);
		expect(state.answers).toEqual({});
		answerInvestigation("inquiry", state, 0, -1);
		expect(state.answers).toEqual({});
		setLabQuantity("electrolysis", state, "hydrogenCount", Number.NaN);
		expect(state.hydrogenCount).toBe(0);
		setLabQuantity("anomaly", state, "hydrogenCount", 2);
		expect(state.hydrogenCount).toBe(0);
		setLabQuantity("electrolysis", state, "hydrogenVolume", 500);
		expect(state.hydrogenVolume).toBe(40);
		const before = [...state.energyOrder];
		moveEnergy(state, 0, -1);
		expect(state.energyOrder).toEqual(before);
	});
	it("handles all integer temperatures, preserves molecule counts and marks phase coexistence", () => {
		const s = freshLab();
		for (let t = -10; t <= 110; t++) {
			setTemperature(s, t);
			const svg = drawScene("particles", s);
			expect(svg.match(/class="atom-O"/g)).toHaveLength(12);
			expect(svg.match(/class="atom-H"/g)).toHaveLength(24);
			expect(svg).not.toMatch(/NaN|undefined|Infinity/);
			expect(s.mode).toBe(
				t === 0 || t === 100
					? "transition"
					: t < 0
						? "solid"
						: t > 100
							? "gas"
							: "liquid",
			);
		}
		const before = { ...s };
		setTemperature(s, Number.NaN);
		expect(s).toEqual(before);
		setTemperature(s, 400);
		expect(s.temperature).toBe(110);
	});
	it("conserves the atoms in two water molecules and their hydrogen/oxygen products", () => {
		const before = drawScene("electrolysis", { ...freshLab(), mode: "before" });
		const bothSides = drawScene("electrolysis", {
			...freshLab(),
			mode: "after",
		});
		expect(before.match(/class="atom-H"/g)).toHaveLength(4);
		expect(before.match(/class="atom-O"/g)).toHaveLength(2);
		// The final picture contains the same four H and two O atoms on EACH side.
		expect(bothSides.match(/class="atom-H"/g)).toHaveLength(8);
		expect(bothSides.match(/class="atom-O"/g)).toHaveLength(4);
		expect(bothSides).toContain("2 H₂ und 1 O₂");
		expect(bothSides).toContain("2 : 1");
	});
	it("formats negatives and decimals for German learners", () => {
		expect(fmtDe(-3.5, 1)).toBe("−3,5");
		expect(fmtDe(-0)).toBe("0");
		expect(fmtDe(23.5, 1)).toBe("23,5");
	});
	it("changes thermometer height together with the displayed reference temperature", () => {
		expect(drawScene("properties", { ...freshLab(), mode: "melt" })).toContain(
			"M255,190V205",
		);
		expect(
			drawScene("properties", { ...freshLab(), mode: "compare" }),
		).toContain("M255,168V205");
		expect(drawScene("properties", { ...freshLab(), mode: "boil" })).toContain(
			"M255,80V205",
		);
	});
	it("places every water-strider foot at the bottom of its surface depression", () => {
		const scene = drawScene("tension", { ...freshLab(), mode: "strider" });
		const surface = scene.match(/d="([^"]+)" class="surface-line /)![1];
		const depressions = [
			...surface.matchAll(/H([\d.]+)Q([\d.]+),([\d.]+) ([\d.]+),160/g),
		];
		expect(depressions).toHaveLength(6);
		for (const [, start, control, height, end] of depressions) {
			const x = Number(start) / 4 + Number(control) / 2 + Number(end) / 4;
			const y = 80 + Number(height) / 2;
			expect(scene).toContain(`L${x},${y}`);
		}
	});
	it("draws visible segment boundaries on the ringed worm", () => {
		const scene = drawScene("soilLife", { ...freshLab(), mode: "worm" });
		expect(scene.match(/class="worm-ring"/g)).toHaveLength(22);
		expect(scene).not.toMatch(/NaN|undefined|Infinity/);
	});
});
