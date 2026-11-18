import { lessonSteps } from "../src/lesson-steps";
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

	for (const chosen of Object.keys(SITES) as Site[]) {
		it(`accepts a reasoned proposal for ${chosen} after weighing alternatives`, () => {
			const meeting = new CouncilMeeting();
			const other = chosen === "obstanger" ? "schulwiese" : "obstanger";
			meeting.visit(other);
			meeting.listen(0);
			meeting.visit(chosen);
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
			meeting.visit(other);
			expect(meeting.reason).toBeNull();
			expect(meeting.submitted).toBe(false);
		});
	}
});

describe("station steps", () => {
	it("keeps every fact, lab control and both task levels reachable", () => {
		for (const lesson of LESSON_BY_ID.values()) {
			const steps = lessonSteps(lesson);
			expect(
				steps.filter((s) => s.kind === "discover").map((s) => s.index),
			).toEqual(lesson.factCards.map((_, i) => i));
			expect(
				steps.filter((s) => s.kind === "lab").map((s) => s.control),
			).toEqual(
				lesson.lab.controls
					.filter((c) => c.key !== "vorschlag")
					.map((c) => c.key),
			);
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
