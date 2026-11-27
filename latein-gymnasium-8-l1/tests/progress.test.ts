import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	freshProgress,
	isComplete,
	loadProgress,
	mergeProgress,
	resetProgress,
	saveProgress,
	updateDraft,
	writingKey,
} from "../src/storage/progress";

beforeEach(() => {
	const values = new Map<string, string>();
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => values.get(key) ?? null,
		setItem: (key: string, value: string) => {
			values.set(key, value);
		},
	});
});
afterEach(() => vi.unstubAllGlobals());

function openTab() {
	const progress = loadProgress();
	let baseline = structuredClone(progress);
	return {
		progress,
		save() {
			expect(saveProgress(progress, baseline)).toBe(true);
			baseline = structuredClone(progress);
		},
	};
}

const id = "l8-gerundiv-praedikativ";
const otherId = "l8-wortschatz-kontext";
const key = writingKey(id, 1);
const firstText =
	"Karthago muss zerstört werden, und gute Bürger müssen die Gesetze stets achten.";
const changedText =
	"Die Gesandten kamen nach Rom, um den Senat um einen gerechten Frieden zu bitten.";

describe("two open tabs", () => {
	it("preserves another tab's draft, assessment and completed checks on navigation", () => {
		const first = openTab(),
			stale = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.writingDone.push(key);
		first.progress.quizDone.push(id);
		first.progress.practiceDone.push(id);
		first.progress.workshopDone.push(id);
		first.save();
		stale.progress.activeLessonId = otherId;
		stale.progress.level = 2;
		stale.save();
		expect(loadProgress().drafts[key]).toBe(firstText);
		expect(isComplete(loadProgress(), id)).toBe(true);
		expect(stale.progress.activeLessonId).toBe(otherId);
		expect(stale.progress.level).toBe(2);
	});

	it("joins work on different drafts without treating stale drafts as edits", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.save();
		updateDraft(second.progress, otherId, 2, changedText);
		second.save();
		first.progress.quizDone.push(id);
		first.save();
		expect(loadProgress().drafts).toEqual({
			[key]: firstText,
			[`${otherId}:2`]: changedText,
		});
	});

	it("does not restore an assessment belonging to the old text", () => {
		const seed = openTab();
		updateDraft(seed.progress, id, 1, firstText);
		seed.progress.writingDone.push(key);
		seed.save();
		const editor = openTab(),
			stale = openTab();
		updateDraft(editor.progress, id, 1, changedText);
		editor.save();
		stale.progress.quizDone.push(otherId);
		stale.save();
		expect(loadProgress().drafts[key]).toBe(changedText);
		expect(loadProgress().writingDone).not.toContain(key);
	});

	it("saves an actual new edit, including clearing a draft, while keeping unrelated work", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push(otherId);
		first.save();
		updateDraft(second.progress, id, 1, changedText);
		second.save();
		updateDraft(first.progress, id, 1, "");
		first.save();
		expect(loadProgress().drafts[key]).toBe("");
		expect(loadProgress().quizDone).toContain(otherId);
	});

	it("adopts a storage event without changing this tab's lesson or level", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		own.activeLessonId = otherId;
		own.level = 2;
		updateDraft(stored, id, 1, firstText);
		stored.writingDone.push(key);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.writingDone).toContain(key);
		expect(merged.activeLessonId).toBe(otherId);
		expect(merged.level).toBe(2);
	});

	it("keeps an unsaved local edit while receiving unrelated storage changes", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		updateDraft(own, id, 1, firstText);
		stored.quizDone.push(otherId);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.quizDone).toContain(otherId);
	});

	it("propagates a confirmed reset and prevents a stale tab from resurrecting progress", () => {
		const first = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push(id);
		first.save();
		const stale = openTab();
		Object.assign(first.progress, resetProgress(first.progress));
		first.save();
		stale.save();
		expect(loadProgress().drafts).toEqual({});
		expect(loadProgress().quizDone).toEqual([]);
		expect(loadProgress().resetAt).toBeGreaterThan(0);
	});
});
