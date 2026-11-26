import { describe, expect, it } from "vitest";
import {
	completion,
	freshProgress,
	isComplete,
	mergeProgress,
	parseProgress,
	resetProgress,
	STORAGE_KEY,
	updateDraft,
	writingKey,
} from "../src/storage/progress";

describe("local progress storage and multi-tab merging", () => {
	it("isolates its storage key and recovers safely from corrupt JSON", () => {
		expect(STORAGE_KEY).toBe("latein_gym7_l2_academy_progress_v1");
		for (const raw of [null, "null", "[]", "42", "{broken"]) {
			expect(parseProgress(raw)).toEqual(freshProgress());
		}
		const p = parseProgress(
			JSON.stringify({
				workshopDone: ["invalid-id", "l7-u-deklination", "l7-u-deklination"],
				level: 2,
			}),
		);
		expect(p.workshopDone).toEqual(["l7-u-deklination"]);
		expect(p.level).toBe(2);
	});

	it("requires workshop, quiz, practice and self-assessed level-1 writing for completion", () => {
		const p = freshProgress();
		const id = p.activeLessonId;
		p.quizDone.push(id);
		p.practiceDone.push(id);
		updateDraft(
			p,
			id,
			1,
			"Der Konsul führt das römische Heer gegen die Feinde.",
		);
		p.writingDone.push(writingKey(id, 1));
		expect(isComplete(p, id)).toBe(false);
		p.workshopDone.push(id);
		expect(isComplete(p, id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, total: 40, percent: 3 });

		updateDraft(p, id, 1, "Geänderter Entwurf mit neuer Formulierung.");
		expect(isComplete(p, id)).toBe(false);
	});

	it("merges concurrent tab progress and respects confirmed resets", () => {
		const base = freshProgress();
		const tabA = structuredClone(base);
		const tabB = structuredClone(base);
		tabA.quizDone.push("l7-u-deklination");
		tabB.workshopDone.push("l7-e-deklination");
		const merged = mergeProgress(tabA, tabB, base);
		expect(merged.quizDone).toEqual(["l7-u-deklination"]);
		expect(merged.workshopDone).toEqual(["l7-e-deklination"]);

		const wiped = resetProgress(merged);
		const afterReset = mergeProgress(wiped, tabB, base);
		expect(afterReset.quizDone).toEqual([]);
		expect(afterReset.workshopDone).toEqual([]);
	});
});
