import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	adoptStored,
	completion,
	freshProgress,
	isComplete,
	loadProgress,
	mergeProgress,
	nextAttempt,
	parseProgress,
	recordGoals,
	recordQuiz,
	recordSolved,
	resetProgress,
	STORAGE_KEY,
	saveProgress,
	stars,
} from "../src/storage/progress";

class MemoryStorage {
	map = new Map<string, string>();
	failing = false;
	getItem(key: string) {
		return this.map.get(key) ?? null;
	}
	setItem(key: string, value: string) {
		if (this.failing) throw new Error("quota");
		this.map.set(key, value);
	}
	removeItem(key: string) {
		this.map.delete(key);
	}
}
let storage: MemoryStorage;
beforeEach(() => {
	storage = new MemoryStorage();
	Object.defineProperty(globalThis, "localStorage", { value: storage, configurable: true });
});
afterEach(() => {
	Reflect.deleteProperty(globalThis, "localStorage");
});

const first = LESSONS[0];

function finish(id: string, p = freshProgress()) {
	const l = LESSONS.find((x) => x.id === id);
	if (!l) throw new Error(id);
	recordQuiz(p, id);
	recordGoals(p, id, l.workshop.goals.map((g) => g.id));
	for (let i = 0; i < 3; i++) {
		recordSolved(p, id, 1);
		recordSolved(p, id, 2);
	}
	return p;
}

describe("Fortschritt", () => {
	it("survives garbage and drops unknown lessons and goals", () => {
		expect(parseProgress("{nope").quizDone).toEqual([]);
		expect(parseProgress("[1,2]").level).toBe(1);
		const p = parseProgress(
			JSON.stringify({
				epoch: "e1",
				level: 2,
				quizDone: [first.id, "x", first.id, 4],
				goals: { [first.id]: ["hund", "fake"], other: ["a"] },
				solved: { [first.id]: { 1: 2.7, 2: -3 }, other: { 1: 5 } },
				attempts: { [`${first.id}:1`]: 4, [`${first.id}:9`]: 3, "x:1": 1 },
			}),
		);
		expect(p.epoch).toBe("e1");
		expect(p.level).toBe(2);
		expect(p.quizDone).toEqual([first.id]);
		expect(p.goals).toEqual({ [first.id]: ["hund"] });
		expect(p.solved).toEqual({ [first.id]: { 1: 2, 2: 0 } });
		expect(p.attempts).toEqual({ [`${first.id}:1`]: 4 });
	});

	it("gives four stars and completes a lesson only with every step", () => {
		const p = freshProgress();
		expect(stars(p, first.id)).toEqual({ quiz: false, workshop: false, level1: false, level2: false });
		recordQuiz(p, first.id);
		recordGoals(p, first.id, ["hund", "angst"]);
		expect(stars(p, first.id).workshop).toBe(false);
		expect(recordGoals(p, first.id, ["hund", "freude"])).toEqual(["freude"]);
		for (let i = 0; i < 3; i++) recordSolved(p, first.id, 1);
		expect(isComplete(p, first.id)).toBe(false);
		for (let i = 0; i < 3; i++) recordSolved(p, first.id, 2);
		expect(isComplete(p, first.id)).toBe(true);
		expect(completion(p)).toEqual({ completed: 1, stars: 4, total: 45 });
	});

	it("merges two tabs by union and maximum", () => {
		const a = freshProgress();
		const b = { ...freshProgress(), epoch: a.epoch };
		recordQuiz(a, first.id);
		recordSolved(b, first.id, 2);
		recordSolved(b, first.id, 2);
		recordSolved(a, first.id, 2);
		nextAttempt(a, first.id, 1);
		const m = mergeProgress(a, b);
		expect(m.quizDone).toEqual([first.id]);
		expect(m.solved[first.id]).toEqual({ 1: 0, 2: 2 });
		expect(m.attempts[`${first.id}:1`]).toBe(1);
	});

	it("saves, adopts other tabs and lets a reset win", () => {
		const tabA = loadProgress();
		recordQuiz(tabA, first.id);
		const saved = saveProgress(tabA);
		expect(saved.saved).toBe(true);
		const tabB = loadProgress();
		expect(tabB.epoch).toBe(tabA.epoch);
		finish(LESSONS[1].id, tabB);
		saveProgress(tabB);
		const merged = saveProgress(saved.progress).progress;
		expect(isComplete(merged, LESSONS[1].id)).toBe(true);
		expect(merged.quizDone).toContain(first.id);

		const reset = saveProgress(resetProgress()).progress;
		expect(reset.quizDone).toEqual([]);
		// A stale tab saving afterwards adopts the reset instead of restoring.
		const stale = saveProgress(merged).progress;
		expect(stale.epoch).toBe(reset.epoch);
		expect(stale.quizDone).toEqual([]);
		expect(JSON.parse(storage.getItem(STORAGE_KEY) ?? "{}").quizDone).toEqual([]);
	});

	it("adopts another tab's save without writing back", () => {
		const tabA = loadProgress();
		tabA.level = 1;
		saveProgress(tabA);
		const tabB = { ...loadProgress(), level: 2 as const };
		recordQuiz(tabB, first.id);
		saveProgress(tabB);
		let writes = 0;
		const set = storage.setItem.bind(storage);
		storage.setItem = (k: string, v: string) => {
			writes++;
			set(k, v);
		};
		const adopted = adoptStored(tabA);
		expect(writes).toBe(0);
		expect(adopted.level).toBe(1);
		expect(adopted.quizDone).toEqual([first.id]);
	});

	it("keeps working when storage fails", () => {
		storage.failing = true;
		const p = finish(first.id);
		const result = saveProgress(p);
		expect(result.saved).toBe(false);
		expect(isComplete(result.progress, first.id)).toBe(true);
	});
});
