import { describe, expect, it } from "vitest";
import { LESSONS, findLesson } from "../src/curriculum";
import {
	exploredGoals,
	modelBlocks,
	renderLanguageModel,
} from "../src/language-model";
import { renderVisual } from "../src/visuals";

function model(id: string, selection: number) {
	const lesson = findLesson(id);
	if (!lesson) throw new Error(`Missing lesson ${id}`);
	return renderLanguageModel(lesson, selection);
}

describe("Interactive visual examples", () => {
	it.each(LESSONS)(
		"$id starts unresolved and has three distinct reachable states",
		(lesson) => {
			expect(exploredGoals(new Set())).toEqual([false, false, false]);
			expect(exploredGoals(new Set([0, 1, 2]))).toEqual([true, true, true]);
			expect(lesson.visual.steps).toHaveLength(3);
			expect(
				new Set(
					[-1, 0, 1, 2].map((selection) =>
						JSON.stringify(modelBlocks(lesson, selection)),
					),
				).size,
			).toBe(4);
			expect(renderVisual(lesson).match(/data-visual-step=/g)).toHaveLength(3);
			expect(renderVisual(lesson)).not.toContain('data-model-reached="true"');
		},
	);

	it("shows scaled book counts and highlights each day's bar", () => {
		const html = model("d8-informierend-material", 0);
		expect(html).toContain('data-chart-bar="0" data-emphasis="true"');
		expect(html).toContain('data-chart-bar="1" data-emphasis="false"');
		expect(html).toContain("width: 60%");
		expect(html).toContain("width: 80%");
		expect(
			model("d8-informierend-material", 2).match(/data-emphasis="true"/g),
		).toHaveLength(2);
	});

	it("changes stage positions and marks the selected view of the storyboard", () => {
		expect(model("d8-theater-standbild", 0)).toContain("nebeneinander links");
		expect(model("d8-theater-standbild", 2)).toContain(
			"Ilja zeigt auf die Uhr",
		);
		expect(model("d8-ton-und-film", 1)).toContain(
			'class="storyboard" data-shot="1"',
		);
		expect(model("d8-ton-und-film", 1)).toContain("Hand am Geländer");
		expect(model("d8-mug-inszenierung", 2)).toContain("Enger Lichtkreis");
	});

	it("keeps tense, case, sentence boundaries and voice visible in context", () => {
		expect(model("d8-tempus-zeitbezug", 1)).toContain(
			'time-active">8:50 · Warten',
		);
		expect(model("d8-sprachsystem-satzbau", 1)).toContain("Den neuen Plan");
		expect(model("d8-infinitiv-partizip-komma", 0)).toContain(
			"Die Redaktion hofft,",
		);
		expect(model("d8-infinitiv-partizip-komma", 1)).toContain(
			"braucht nicht zu warten.",
		);
		expect(model("d8-modus-genus-verbi", 1)).toContain(
			"der Plan werde geprüft.",
		);
		expect(model("d8-rechtschreib-werkstatt", 2)).toContain(
			"wegen der fehlenden Zeilen",
		);
	});

	it("distinguishes a required comma, a bare infinitive with two spellings and an unseparated predicate", () => {
		const id = "d8-infinitiv-partizip-komma";
		const lesson = findLesson(id);
		expect(lesson?.visual.steps[0].detail).toContain("braucht ein Komma");
		expect(lesson?.cases[0].answer).toBe(
			"Der zu-Infinitiv gehört zum mehrteiligen Prädikat.",
		);
		expect(lesson?.tasks[1].model).toContain(
			"Er braucht es nicht zu schneiden.",
		);
		expect(lesson?.tasks[2].model).toContain(
			"„Ada versucht, das Schild zu sichern“ braucht ein Komma",
		);
		expect(lesson?.tasks[2].model).toContain(
			"„Ada versucht zu helfen“ und „Ada versucht, zu helfen“ sind beide zulässig",
		);
		expect(lesson?.sourceIds).toContain("komma-nebensaetze");
	});
});
