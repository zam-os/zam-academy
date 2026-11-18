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
