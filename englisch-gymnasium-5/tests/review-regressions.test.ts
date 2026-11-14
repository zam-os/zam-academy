import { describe, expect, it } from "vitest";
import { findLesson } from "../src/curriculum";
import { checkPractice } from "../src/practice";
import { clockLabel } from "../src/workshop";

describe("reviewed learner-facing language", () => {
	it("does not accept a dotted time as half past or quarter to", () => {
		const lesson = findLesson("e5-time")!;
		expect(checkPractice(lesson.practice, ["7.30", "7.45"])).toEqual([false, false]);
		expect(checkPractice(lesson.practice, ["past", "to"])).toEqual([true, true]);
	});
	it("keeps goes with the o-rule and put on as a practised verb", () => {
		expect(findLesson("e5-simple-present")!.paragraphs.join(" ")).toContain(
			"goes gehört zur o-Regel",
		);
		expect(findLesson("e5-clothes")!.practice.some((item) => item.answers.includes("put"))).toBe(
			true,
		);
	});
	it.each([
		[0, 0, "midnight"],
		[0, 30, "half past twelve"],
		[12, 0, "twelve o'clock"],
		[15, 30, "half past three"],
		[21, 45, "quarter to ten"],
	] as const)("reads %i:%i as %s", (hour, minute, expected) => {
		expect(clockLabel(hour, minute)).toBe(expected);
	});
});
