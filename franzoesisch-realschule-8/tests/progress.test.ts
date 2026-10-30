import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	freshProgress,
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
const id = "f8-ecouter-rendezvous",
	key = writingKey(id, 1);
const firstText = "I confirm the new time and explain the next action.";
const changedText = "I have revised my notes about the changed appointment.";

describe("independent listening evidence", () => {
	it("does not count an empty evidence object as a completed listening activity", () => {
		const p = freshProgress();
		p.quizDone.push(id);
		p.practiceDone.push(id);
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
					"f8-ecouter-gare": "partner",
					unknown: { synthetic: true },
				},
			}),
		);
		expect(parsed.listening).toEqual({
			[id]: { synthetic: true, partner: false },
			"f8-ecouter-gare": { synthetic: false, partner: true },
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
		markSyntheticListening(first.progress, id);
		first.save();
		stale.progress.activeLessonId = "f8-amis";
		stale.progress.level = 2;
		stale.save();
		expect(loadProgress().drafts[key]).toBe(firstText);
		expect(isComplete(loadProgress(), id)).toBe(true);
		expect(stale.progress.activeLessonId).toBe("f8-amis");
		expect(stale.progress.level).toBe(2);
	});
	it("joins work on different drafts without treating stale drafts as edits", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.save();
		updateDraft(second.progress, "f8-amis", 2, changedText);
		second.save();
		first.progress.quizDone.push(id);
		first.save();
		expect(loadProgress().drafts).toEqual({
			[key]: firstText,
			"f8-amis:2": changedText,
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
		stale.progress.quizDone.push("f8-amis");
		stale.save();
		expect(loadProgress().drafts[key]).toBe(changedText);
		expect(loadProgress().writingDone).not.toContain(key);
	});
	it("saves an actual new edit, including clearing a draft, while keeping unrelated work", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push("f8-amis");
		first.save();
		updateDraft(second.progress, id, 1, changedText);
		second.save();
		updateDraft(first.progress, id, 1, "");
		first.save();
		expect(loadProgress().drafts[key]).toBe("");
		expect(loadProgress().quizDone).toContain("f8-amis");
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
		own.activeLessonId = "f8-amis";
		own.level = 2;
		updateDraft(stored, id, 1, firstText);
		stored.writingDone.push(key);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.writingDone).toContain(key);
		expect(merged.activeLessonId).toBe("f8-amis");
		expect(merged.level).toBe(2);
	});
	it("keeps an unsaved local edit while receiving unrelated storage changes", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		updateDraft(own, id, 1, firstText);
		stored.quizDone.push("f8-amis");
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.quizDone).toContain("f8-amis");
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
