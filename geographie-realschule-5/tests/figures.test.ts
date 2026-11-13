import { describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	FIGURES,
	renderFigure,
	renderHeroArt,
	renderStageArt,
} from "../src/figures";

describe("explanatory graphics", () => {
	it("covers the complete learning path without orphaned figures", () => {
		expect(Object.keys(FIGURES).sort()).toEqual(
			LESSONS.map((l) => l.id).sort(),
		);
	});
	it.each(LESSONS)(
		"offers an accessible explanation and selectable parts: $id",
		(lesson) => {
			const figure = FIGURES[lesson.id];
			const html = renderFigure(lesson.id);
			expect(figure.alt.length).toBeGreaterThan(80);
			expect(figure.caption.length).toBeGreaterThan(60);
			expect(figure.question).not.toBe(lesson.quiz.question);
			expect(figure.parts.length).toBeGreaterThanOrEqual(2);
			expect(new Set(figure.parts.map((p) => p.label)).size).toBe(
				figure.parts.length,
			);
			const drawnParts = [
				...new Set(
					[...figure.draw().matchAll(/data-part="(\d+)"/g)].map((m) =>
						Number(m[1]),
					),
				),
			].sort();
			expect(drawnParts).toEqual(figure.parts.map((_, i) => i + 1));
			expect(html).toContain(
				`aria-labelledby="${lesson.id}-figure-title ${lesson.id}-figure-description"`,
			);
			expect(html).toContain('role="status" aria-live="polite"');
			expect(html).not.toMatch(
				/<image|<script|<foreignObject|https?:|\bNaN\b|undefined/,
			);
			expect([...html.matchAll(/<button\b/g)]).toHaveLength(
				figure.parts.length + 1,
			);
			expect([...html.matchAll(/aria-pressed="true"/g)]).toHaveLength(1);
			for (const [index, entry] of figure.parts.entries()) {
				expect(entry.note.length).toBeGreaterThan(60);
				expect(renderFigure(lesson.id, index + 1)).toContain(entry.note);
			}
		},
	);
	it("keeps context available and rejects invalid focus values", () => {
		const id = "geo-erdbewegungen";
		for (const focus of [NaN, Infinity, -1, 1.5, 100])
			expect(renderFigure(id, focus)).toBe(renderFigure(id, 0));
		expect(renderFigure("unknown")).toBe("");
		expect(renderFigure(id, 1)).toContain(
			'class="visual-part is-muted" data-part="2"',
		);
		expect(renderFigure(id, 1)).not.toContain(
			'class="visual-part is-muted" data-part="1"',
		);
		expect(renderFigure(id, 0)).not.toContain("is-muted");
	});
	it("labels limits that matter for geographical reasoning", () => {
		expect(FIGURES["geo-massstab"].caption).toContain("kein Zentimetermaß");
		expect(FIGURES["geo-grosslandschaften"].caption).toContain(
			"kein vermessenes Profil",
		);
		expect(FIGURES["geo-themenkarten"].caption).toContain(
			"erfundene Verteilung",
		);
		expect(FIGURES["geo-deutschland"].caption).toContain("keine Grenzkarte");
		expect(FIGURES["geo-erdgeschichte"].parts[2].note).toContain(
			"Bruchteil des letzten Punktes",
		);
	});
	it("keeps decorative path illustrations out of the accessibility tree", () => {
		expect(renderHeroArt()).toContain('aria-hidden="true"');
		for (let lb = 1; lb <= 7; lb++)
			expect(renderStageArt(lb)).toContain('aria-hidden="true"');
		expect(renderStageArt(0)).toBe("");
	});
});
