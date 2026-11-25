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

describe("Latein 6 L2 progress and multi-tab state", () => {
	it("uses an isolated storage key and starts clean", () => {
		expect(STORAGE_KEY).toBe("latein_gym6_l2_academy_progress_v1");
		const fresh = freshProgress();
		expect(fresh.activeLessonId).toBe("l6-aussprache");
		expect(completion(fresh)).toEqual({ completed: 0, total: 40, percent: 0 });
	});

	it("merges tab progress without overwriting concurrent edits", () => {
		const base = freshProgress();
		const stored = freshProgress();
		stored.quizDone.push("l6-perfekt");
		updateDraft(stored, "l6-perfekt", 1, "Perfektstamm plus Endungen -i, -isti, -it.");
		stored.writingDone.push(writingKey("l6-perfekt", 1));

		const own = freshProgress();
		own.workshopDone.push("l6-a-o-deklination");
		updateDraft(own, "l6-a-o-deklination", 1, "Eigener Text zu a- und o-Deklination.");

		const merged = mergeProgress(stored, own, base);
		expect(merged.quizDone).toContain("l6-perfekt");
		expect(merged.workshopDone).toContain("l6-a-o-deklination");
		expect(merged.writingDone).toContain(writingKey("l6-perfekt", 1));
	});

	it("respects confirmed resets across tabs and checks aloudDone", () => {
		const older = freshProgress();
		older.workshopDone.push("l6-aussprache");
		const reset = resetProgress(older);
		const merged = mergeProgress(reset, older, older);
		expect(merged.workshopDone).toEqual([]);
		expect(merged.resetAt).toBe(reset.resetAt);

		const parsed = parseProgress(
			JSON.stringify({
				aloudDone: ["l6-aussprache", "l6-perfekt", "l6-herakles-aeneas"],
			}),
		);
		expect(parsed.aloudDone).toEqual(["l6-aussprache", "l6-herakles-aeneas"]);
		expect(isComplete(parsed, "l6-aussprache")).toBe(false);
	});
});
