import { beforeEach, describe, expect, it } from "vitest";
import {
	completion,
	isComplete,
	loadProgress,
	markSyntheticListening,
	mergeProgress,
	resetProgress,
	STORAGE_KEY,
	saveProgress,
	setPartnerListening,
	updateDraft,
	writingKey,
} from "../src/storage/progress";

function memoryStorage() {
	const store = new Map<string, string>();
	return {
		getItem: (key: string) => store.get(key) ?? null,
		setItem: (key: string, value: string) => void store.set(key, value),
		removeItem: (key: string) => void store.delete(key),
	};
}

describe("localStorage progress model", () => {
	beforeEach(() => {
		const storage = memoryStorage();
		Object.defineProperty(globalThis, "localStorage", {
			value: storage,
			configurable: true,
		});
	});

	it("uses the package-unique STORAGE_KEY", () => {
		expect(STORAGE_KEY).toBe("englisch_ms5_academy_progress_v1");
	});

	it("marks a lesson complete only after workshop, quiz, practice and L1 writing", () => {
		const progress = loadProgress();
		const id = "e5m-british-isles";
		expect(isComplete(progress, id)).toBe(false);

		progress.workshopDone.push(id);
		progress.quizDone.push(id);
		progress.practiceDone.push(id);
		updateDraft(progress, id, 1, "England, Scotland and Wales are in Great Britain.");
		progress.writingDone.push(writingKey(id, 1));
		expect(isComplete(progress, id)).toBe(true);
		expect(completion(progress).completed).toBe(1);
		expect(completion(progress).total).toBe(36);

		const listenId = "e5m-family-listening";
		progress.workshopDone.push(listenId);
		progress.quizDone.push(listenId);
		progress.practiceDone.push(listenId);
		updateDraft(progress, listenId, 1, "My parents and sister live in Bavaria.");
		progress.writingDone.push(writingKey(listenId, 1));
		expect(isComplete(progress, listenId)).toBe(false);
		setPartnerListening(progress, listenId, true);
		expect(isComplete(progress, listenId)).toBe(true);
	});

	it("saves, merges concurrent writes and resets cleanly", () => {
		const empty = loadProgress();
		const a = loadProgress();
		const b = loadProgress();

		a.quizDone.push("e5m-british-isles");
		expect(saveProgress(a, empty)).toBe(true);

		b.workshopDone.push("e5m-world-language");
		expect(saveProgress(b, empty)).toBe(true);

		const reloaded = loadProgress();
		expect(reloaded.quizDone).toContain("e5m-british-isles");
		expect(reloaded.workshopDone).toContain("e5m-world-language");

		updateDraft(reloaded, "e5m-british-isles", 1, "My test draft over 20 characters");
		reloaded.writingDone.push(writingKey("e5m-british-isles", 1));
		updateDraft(reloaded, "e5m-british-isles", 1, "Updated draft text over 20 chars");
		expect(reloaded.writingDone).not.toContain(writingKey("e5m-british-isles", 1));

		setPartnerListening(reloaded, "e5m-family-listening", true);
		markSyntheticListening(reloaded, "e5m-family-listening");
		expect(reloaded.listening["e5m-family-listening"]).toEqual({
			partner: true,
			synthetic: true,
		});

		const merged = mergeProgress(reloaded, b, empty);
		expect(merged.listening["e5m-family-listening"]?.partner).toBe(true);

		const cleared = resetProgress(reloaded);
		expect(cleared.quizDone).toEqual([]);
	});
});
