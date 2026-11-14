import { describe, expect, it } from "vitest";
import {
	chooseLab,
	fmtDe,
	freshLab,
	LABS,
	labGoals,
	renderLab,
	setTemperature,
} from "../src/labs";
import { drawScene } from "../src/figures";
import type { LabKind } from "../src/model/types";

describe("Chemistry model behaviour", () => {
	const kinds = Object.keys(LABS) as LabKind[];
	it.each(kinds)(
		"starts unselected and proves each goal through an actual action: %s",
		(kind) => {
			const s = freshLab();
			expect(labGoals(kind, s).some((g) => g.met)).toBe(false);
			for (const [i, choice] of LABS[kind].choices.entries()) {
				chooseLab(kind, s, choice.id);
				expect(labGoals(kind, s)[i].met).toBe(true);
				const html = renderLab(kind, s);
				expect(html).toContain(choice.detail);
				expect(html).toContain('role="img"');
				expect(html).not.toMatch(/\b(?:NaN|undefined|Infinity)\b/);
			}
			expect(labGoals(kind, s).every((g) => g.met)).toBe(true);
			chooseLab(kind, s, "untrusted");
			expect(s.mode).toBe(LABS[kind].choices[2].id);
			expect(s.seen).toHaveLength(3);
		},
	);
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
});
