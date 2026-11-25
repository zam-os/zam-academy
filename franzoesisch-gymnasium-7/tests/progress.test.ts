import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	forgetLegacyEntries,
	freshProgress,
	LEGACY_STORAGE_KEY,
	STORAGE_KEY,
	isComplete,
	loadProgress,
	markSyntheticListening,
	mergeProgress,
	parseProgress,
	resetProgress,
	saveProgress,
	setPartnerListening,
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
const id = "f7-1-appel",
	key = writingKey(id, 1);
const firstText = "I confirm the new time and explain the next action.";
const changedText = "I have revised my notes about the changed appointment.";

describe("independent listening evidence", () => {
	it("does not count an empty evidence object as a completed listening activity", () => {
		const p = freshProgress();
		p.quizDone.push(id);
		p.practiceDone.push(id);
		p.workshopDone.push(id);
		updateDraft(p, id, 1, firstText);
		p.writingDone.push(key);
		p.listening[id] = { synthetic: false, partner: false };
		expect(isComplete(p, id)).toBe(false);
		markSyntheticListening(p, id);
		expect(isComplete(p, id)).toBe(true);
	});
	it("keeps completed speech when partner confirmation is checked, unchecked and reloaded", () => {
		const tab = openTab();
		markSyntheticListening(tab.progress, id);
		tab.save();
		setPartnerListening(tab.progress, id, true);
		tab.save();
		setPartnerListening(tab.progress, id, false);
		tab.save();
		expect(loadProgress().listening[id]).toEqual({
			synthetic: true,
			partner: false,
		});
	});
	it("can withdraw partner confirmation when there was no completed speech", () => {
		const tab = openTab();
		setPartnerListening(tab.progress, id, true);
		tab.save();
		setPartnerListening(tab.progress, id, false);
		tab.save();
		expect(loadProgress().listening[id]).toBeUndefined();
	});
	it("reads both original single-mode saves and rejects invalid new evidence", () => {
		const parsed = parseProgress(
			JSON.stringify({
				listening: {
					[id]: "synthetic",
					"f7-1-chanson": "partner",
					unknown: { synthetic: true },
				},
			}),
		);
		expect(parsed.listening).toEqual({
			[id]: { synthetic: true, partner: false },
			"f7-1-chanson": { synthetic: false, partner: true },
		});
		expect(
			parseProgress(
				JSON.stringify({
					listening: { [id]: { synthetic: "true", partner: 1 } },
				}),
			).listening,
		).toEqual({});
	});
});

describe("two open tabs", () => {
	it("preserves another tab's draft, assessment, completed checks and listening on navigation", () => {
		const first = openTab(),
			stale = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.writingDone.push(key);
		first.progress.quizDone.push(id);
		first.progress.practiceDone.push(id);
		first.progress.workshopDone.push(id);
		markSyntheticListening(first.progress, id);
		first.save();
		stale.progress.activeLessonId = "f7-1-echange";
		stale.progress.level = 2;
		stale.save();
		expect(loadProgress().drafts[key]).toBe(firstText);
		expect(isComplete(loadProgress(), id)).toBe(true);
		expect(stale.progress.activeLessonId).toBe("f7-1-echange");
		expect(stale.progress.level).toBe(2);
	});
	it("joins work on different drafts without treating stale drafts as edits", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.save();
		updateDraft(second.progress, "f7-1-echange", 2, changedText);
		second.save();
		first.progress.quizDone.push(id);
		first.save();
		expect(loadProgress().drafts).toEqual({
			[key]: firstText,
			"f7-1-echange:2": changedText,
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
		stale.progress.quizDone.push("f7-1-echange");
		stale.save();
		expect(loadProgress().drafts[key]).toBe(changedText);
		expect(loadProgress().writingDone).not.toContain(key);
	});
	it("saves an actual new edit, including clearing a draft, while keeping unrelated work", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push("f7-1-echange");
		first.save();
		updateDraft(second.progress, id, 1, changedText);
		second.save();
		updateDraft(first.progress, id, 1, "");
		first.save();
		expect(loadProgress().drafts[key]).toBe("");
		expect(loadProgress().quizDone).toContain("f7-1-echange");
	});
	it("joins completed speech and partner confirmation and does not revive a withdrawn check", () => {
		const speech = openTab(),
			partner = openTab();
		markSyntheticListening(speech.progress, id);
		speech.save();
		setPartnerListening(partner.progress, id, true);
		partner.save();
		const stale = openTab();
		setPartnerListening(partner.progress, id, false);
		partner.save();
		stale.save();
		expect(loadProgress().listening[id]).toEqual({
			synthetic: true,
			partner: false,
		});
	});
	it("adopts a storage event without changing this tab's lesson or level", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		own.activeLessonId = "f7-1-echange";
		own.level = 2;
		updateDraft(stored, id, 1, firstText);
		stored.writingDone.push(key);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.writingDone).toContain(key);
		expect(merged.activeLessonId).toBe("f7-1-echange");
		expect(merged.level).toBe(2);
	});
	it("keeps an unsaved local edit while receiving unrelated storage changes", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		updateDraft(own, id, 1, firstText);
		stored.quizDone.push("f7-1-echange");
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.quizDone).toContain("f7-1-echange");
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

describe("progress from the former two-path app", () => {
	const former = {
		...freshProgress(),
		activeLessonId: "f7-1-appel",
		level: 2,
		quizDone: ["f7-1-appel", "f7-2-hotel"],
		drafts: {
			"f7-1-appel:1": firstText,
			"f7-2-hotel:1": changedText,
		},
		writingDone: ["f7-1-appel:1", "f7-2-hotel:1"],
		listening: {
			"f7-1-appel": { partner: true, synthetic: false },
			"f7-2-hotel": { partner: true, synthetic: false },
		},
	};

	it("carries the draft, comparison and partner evidence through the first save", () => {
		localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(former));
		const tab = openTab();
		tab.save();
		expect(loadProgress()).toMatchObject({
			activeLessonId: "f7-1-appel",
			level: 2,
			quizDone: ["f7-1-appel"],
			drafts: { "f7-1-appel:1": firstText },
			writingDone: ["f7-1-appel:1"],
			listening: { "f7-1-appel": { partner: true, synthetic: false } },
		});
		expect(Object.keys(loadProgress().drafts)).toEqual(["f7-1-appel:1"]);
		expect(localStorage.getItem(LEGACY_STORAGE_KEY)).toBe(JSON.stringify(former));
		expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
	});

	it("clears this path from both stores without deleting the other path's work", () => {
		localStorage.setItem(LEGACY_STORAGE_KEY, JSON.stringify(former));
		const inherited = loadProgress();
		expect(saveProgress(resetProgress(inherited), inherited)).toBe(true);
		forgetLegacyEntries();
		expect(loadProgress().drafts).toEqual({});
		const legacy = JSON.parse(localStorage.getItem(LEGACY_STORAGE_KEY)!);
		expect(legacy.quizDone).toEqual(["f7-2-hotel"]);
		expect(legacy.drafts).toEqual({ "f7-2-hotel:1": changedText });
		expect(legacy.writingDone).toEqual(["f7-2-hotel:1"]);
		expect(Object.keys(legacy.listening)).toEqual(["f7-2-hotel"]);
	});
});
