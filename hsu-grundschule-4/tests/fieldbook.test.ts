import { firstMissingLabStep, lessonSteps } from "../src/lesson-steps";
import { describe, expect, it } from "vitest";
import { renderFieldMap } from "../src/companion/field-map";
import { LESSON_BY_ID, STAGES } from "../src/curriculum";
import { CouncilMeeting, SITES, type Site } from "../src/labs/council";
import { parseProgress } from "../src/storage/progress";

describe("Lotta's field map and council", () => {
	it("connects every landscape stop to its world", () => {
		for (const stage of STAGES) {
			const map = renderFieldMap(stage.id, "resting");
			expect(map.match(/data-action="choose-world"/g)).toHaveLength(
				STAGES.length,
			);
			expect(map).toContain(
				`data-world="${stage.id}" aria-controls="world-stations" aria-pressed="true"`,
			);
			expect(map).toContain("lotta-mood-resting");
		}
	});

	it("reads bookmarks and retains the progress of an older field book", () => {
		const id = "unsere-gemeinde";
		const legacy = {
			schema: 1,
			lessons: {
				[id]: {
					goalsReached: ["g2-gemeinwohl"],
					quizSolved: true,
					level1Correct: 1,
					level2Correct: 0,
				},
			},
		};
		for (const lastLessonId of [undefined, id]) {
			const result = parseProgress(JSON.stringify({ ...legacy, lastLessonId }));
			expect(result.corrupted).toBe(false);
			expect(result.progress.lastLessonId).toBe(lastLessonId ?? null);
			expect(result.progress.lessons[id].goalsReached).toEqual([
				"g2-gemeinwohl",
			]);
		}
	});

	it("only counts places explored in the model, even when returning to the selected site", () => {
		const meeting = new CouncilMeeting();
		meeting.selectSite("schulwiese", "voices");
		meeting.listen(0);
		meeting.listen(1);
		meeting.selectSite("obstanger", "proposal");
		meeting.reason = 0;
		expect(meeting.visited.size).toBe(0);
		expect(meeting.submit()).toBeNull();
		meeting.selectSite("obstanger", "places");
		expect(meeting.visited.size).toBe(1);
		expect(meeting.submit()).toBeNull();
		meeting.selectSite("schulwiese", "places");
		expect(meeting.ready).toBe(true);
	});

	for (const chosen of Object.keys(SITES) as Site[]) {
		it(`accepts a reasoned proposal for ${chosen} after weighing alternatives`, () => {
			const meeting = new CouncilMeeting();
			const other = chosen === "obstanger" ? "schulwiese" : "obstanger";
			meeting.selectSite(other, "places");
			meeting.listen(0);
			meeting.selectSite(chosen, "places");
			meeting.listen(0);
			expect(meeting.ready).toBe(false);
			expect(meeting.submit()).toBeNull();
			meeting.listen(1);
			expect(meeting.ready).toBe(true);
			expect(meeting.submit()).toBeNull();
			meeting.reason = 1;
			expect(meeting.submit()).toBe(chosen);
			const goal = LESSON_BY_ID.get("unsere-gemeinde")!.lab.goals[2];
			expect(goal.id).toBe("g2-gemeinwohl");
			expect(goal.check({ vorschlag: chosen })).toBe(true);
			meeting.selectSite(other, "places");
			expect(meeting.reason).toBeNull();
			expect(meeting.submitted).toBe(false);
		});
	}
});

describe("station steps", () => {
	it("gives every discovery and lab step its own authored Lotta line", () => {
		for (const lesson of LESSON_BY_ID.values()) {
			const steps = lessonSteps(lesson);
			const expected = [
				...lesson.factCards.map((card) => card.lottaPrompt),
				...lesson.lab.goals.map((goal) => goal.lottaPrompt),
			];
			const prompts = steps
				.filter(
					(step) =>
						step.kind === "discover" ||
						step.kind === "lab" ||
						(step.kind === "council" && step.phase === "places"),
				)
				.map((step) => step.prompt);
			expect(prompts).toEqual(expected);
			expect(prompts.every((text) => text.trim().length > 0)).toBe(true);
			expect(new Set(steps.map((step) => step.prompt)).size).toBe(steps.length);
		}
	});

	it("keeps every fact, lab control and both task levels reachable", () => {
		for (const lesson of LESSON_BY_ID.values()) {
			const steps = lessonSteps(lesson);
			expect(
				steps.filter((s) => s.kind === "discover").map((s) => s.index),
			).toEqual(lesson.factCards.map((_, i) => i));
			const labSteps = steps.filter((s) => s.kind === "lab" || s.kind === "council")
				.filter((s) => s.kind === "lab" || s.phase === "places");
			expect(labSteps.map((s) => s.goal)).toEqual(lesson.lab.goals);
			expect(new Set(labSteps.flatMap((s) => s.goal.controls))).toEqual(
				new Set(lesson.lab.controls.map((c) => c.key)),
			);
			for (const [index, goal] of lesson.lab.goals.entries()) {
				const others = lesson.lab.goals.filter((g) => g !== goal).map((g) => g.id);
				expect(steps[firstMissingLabStep(steps, others)]).toBe(labSteps[index]);
			}
			expect(
				steps.filter((s) => s.kind === "practice").map((s) => s.level),
			).toEqual([1, 2]);
			expect(steps.filter((s) => s.kind === "quiz")).toHaveLength(1);
			expect(
				steps.filter((s) => s.kind === "council").map((s) => s.phase),
			).toEqual(
				lesson.id === "unsere-gemeinde" ? ["places", "voices", "proposal"] : [],
			);
			expect(steps.at(-1)?.kind).toBe("book");
		}
	});
});
