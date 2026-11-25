import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	freshProgress,
	handOverSecondLanguage,
	SECOND_LANGUAGE_STORAGE_KEY,
	secondLanguageEntries,
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
const id = "f6-1-meteo",
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
					"f6-1-trajet": "partner",
					unknown: { synthetic: true },
				},
			}),
		);
		expect(parsed.listening).toEqual({
			[id]: { synthetic: true, partner: false },
			"f6-1-trajet": { synthetic: false, partner: true },
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
		stale.progress.activeLessonId = "f6-1-routine";
		stale.progress.level = 2;
		stale.save();
		expect(loadProgress().drafts[key]).toBe(firstText);
		expect(isComplete(loadProgress(), id)).toBe(true);
		expect(stale.progress.activeLessonId).toBe("f6-1-routine");
		expect(stale.progress.level).toBe(2);
	});
	it("joins work on different drafts without treating stale drafts as edits", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.save();
		updateDraft(second.progress, "f6-1-routine", 2, changedText);
		second.save();
		first.progress.quizDone.push(id);
		first.save();
		expect(loadProgress().drafts).toEqual({
			[key]: firstText,
			"f6-1-routine:2": changedText,
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
		stale.progress.quizDone.push("f6-1-routine");
		stale.save();
		expect(loadProgress().drafts[key]).toBe(changedText);
		expect(loadProgress().writingDone).not.toContain(key);
	});
	it("saves an actual new edit, including clearing a draft, while keeping unrelated work", () => {
		const first = openTab(),
			second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push("f6-1-routine");
		first.save();
		updateDraft(second.progress, id, 1, changedText);
		second.save();
		updateDraft(first.progress, id, 1, "");
		first.save();
		expect(loadProgress().drafts[key]).toBe("");
		expect(loadProgress().quizDone).toContain("f6-1-routine");
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
		own.activeLessonId = "f6-1-routine";
		own.level = 2;
		updateDraft(stored, id, 1, firstText);
		stored.writingDone.push(key);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.writingDone).toContain(key);
		expect(merged.activeLessonId).toBe("f6-1-routine");
		expect(merged.level).toBe(2);
	});
	it("keeps an unsaved local edit while receiving unrelated storage changes", () => {
		const baseline = freshProgress(),
			own = structuredClone(baseline),
			stored = freshProgress();
		updateDraft(own, id, 1, firstText);
		stored.quizDone.push("f6-1-routine");
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.quizDone).toContain("f6-1-routine");
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

describe("hand-over of the second-language lessons", () => {
	const saved = {
		activeLessonId: "f6-2-paris",
		level: 2,
		quizDone: ["f6-2-bonjour", "f6-1-routine"],
		writingDone: ["f6-2-bonjour:1", "f6-1-routine:1"],
		drafts: {
			"f6-2-bonjour:1": "Bonjour, Madame. Je m’appelle Lina.",
			"f6-1-routine:1": "Le matin, je me lève à sept heures.",
		},
		listening: { "f6-2-sons": { synthetic: true, partner: false } },
	};
	it("gives only second-language entries to the new package before this one saves", () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
		const tab = openTab();
		const handed = JSON.parse(localStorage.getItem(SECOND_LANGUAGE_STORAGE_KEY)!);
		expect(handed).toEqual({
			activeLessonId: "f6-2-paris",
			level: 2,
			quizDone: ["f6-2-bonjour"],
			practiceDone: [],
			workshopDone: [],
			writingDone: ["f6-2-bonjour:1"],
			drafts: { "f6-2-bonjour:1": "Bonjour, Madame. Je m’appelle Lina." },
			listening: { "f6-2-sons": { synthetic: true, partner: false } },
		});
		expect(JSON.stringify(handed)).not.toContain("f6-1-");
		tab.save();
		expect(localStorage.getItem(STORAGE_KEY)).not.toContain("f6-2-");
		expect(tab.progress.quizDone).toEqual(["f6-1-routine"]);
	});
	it("never overwrites state the new package already has, and skips states without such entries", () => {
		localStorage.setItem(SECOND_LANGUAGE_STORAGE_KEY, "{\"quizDone\":[]}");
		localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
		handOverSecondLanguage();
		expect(localStorage.getItem(SECOND_LANGUAGE_STORAGE_KEY)).toBe("{\"quizDone\":[]}");
		expect(secondLanguageEntries(JSON.stringify({ quizDone: ["f6-1-routine"] }))).toBeNull();
		for (const raw of [null, "bad json", "[]"]) expect(secondLanguageEntries(raw)).toBeNull();
	});
});

describe("review #197: hand-over that cannot be written", () => {
	it("keeps the second-language entries in this package's state until the hand-over succeeds", () => {
		const draft = "Bonjour, Madame. Je m’appelle Lina et j’habite à Lyon.";
		const saved = {
			quizDone: ["f6-2-bonjour", "f6-1-routine"],
			drafts: { "f6-2-bonjour:1": draft },
			listening: { "f6-2-sons": { synthetic: false, partner: true } },
		};
		localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
		const setItem = localStorage.setItem;
		let full = true;
		vi.stubGlobal("localStorage", {
			getItem: localStorage.getItem,
			setItem: (key: string, value: string) => {
				if (full && key === SECOND_LANGUAGE_STORAGE_KEY)
					throw new DOMException("full", "QuotaExceededError");
				setItem(key, value);
			},
		});
		const tab = openTab();
		tab.progress.quizDone.push("f6-1-intentions");
		tab.save();
		expect(localStorage.getItem(SECOND_LANGUAGE_STORAGE_KEY)).toBeNull();
		const kept = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
		expect(kept.drafts["f6-2-bonjour:1"]).toBe(draft);
		expect(kept.quizDone).toEqual(expect.arrayContaining(["f6-2-bonjour", "f6-1-routine", "f6-1-intentions"]));
		expect(kept.listening["f6-2-sons"]).toEqual({ synthetic: false, partner: true });
		full = false;
		const next = openTab();
		next.save();
		const handed = JSON.parse(localStorage.getItem(SECOND_LANGUAGE_STORAGE_KEY)!);
		expect(handed.drafts["f6-2-bonjour:1"]).toBe(draft);
		expect(localStorage.getItem(STORAGE_KEY)).not.toContain("f6-2-");
	});
	it("deletes pending second-language texts on a confirmed reset", () => {
		localStorage.setItem(STORAGE_KEY, JSON.stringify({ drafts: { "f6-2-bonjour:1": "Bonjour, Madame. Je m’appelle Lina." } }));
		const setItem = localStorage.setItem;
		vi.stubGlobal("localStorage", {
			getItem: localStorage.getItem,
			setItem: (key: string, value: string) => {
				if (key === SECOND_LANGUAGE_STORAGE_KEY) throw new DOMException("full", "QuotaExceededError");
				setItem(key, value);
			},
		});
		const tab = openTab();
		const reset = resetProgress(tab.progress);
		expect(saveProgress(reset, tab.progress)).toBe(true);
		expect(localStorage.getItem(STORAGE_KEY)).not.toContain("f6-2-");
	});
});
