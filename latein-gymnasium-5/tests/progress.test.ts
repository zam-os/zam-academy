import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
	freshProgress,
	isComplete,
	loadProgress,
	markSyntheticRecitation,
	mergeProgress,
	parseProgress,
	resetProgress,
	saveProgress,
	setPartnerRecitation,
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

const id = "l5-vortrag-stellungnahme";
const otherId = "l5-aussprache-betonung";
const plainId = "l5-grundwortschatz-lernen";
const key = writingKey(id, 1);
const firstText =
	"Der Frieden schützt das Zusammenleben und bleibt eine gemeinsame Aufgabe.";
const changedText =
	"Ich habe meinen Entwurf zur Stellungnahme über den Frieden überarbeitet.";

describe("independent recitation evidence", () => {
	it("does not count an empty evidence object as a completed recitation activity", () => {
		const p = freshProgress();
		p.quizDone.push(id);
		p.practiceDone.push(id);
		p.workshopDone.push(id);
		updateDraft(p, id, 1, firstText);
		p.writingDone.push(key);
		p.recitation[id] = { synthetic: false, partner: false };
		expect(isComplete(p, id)).toBe(false);
		markSyntheticRecitation(p, id);
		expect(isComplete(p, id)).toBe(true);
	});

	it("keeps completed speech when partner confirmation is checked, unchecked and reloaded", () => {
		const tab = openTab();
		markSyntheticRecitation(tab.progress, id);
		tab.save();
		setPartnerRecitation(tab.progress, id, true);
		tab.save();
		setPartnerRecitation(tab.progress, id, false);
		tab.save();
		expect(loadProgress().recitation[id]).toEqual({
			synthetic: true,
			partner: false,
		});
	});

	it("can withdraw partner confirmation when there was no completed speech", () => {
		const tab = openTab();
		setPartnerRecitation(tab.progress, id, true);
		tab.save();
		setPartnerRecitation(tab.progress, id, false);
		tab.save();
		expect(loadProgress().recitation[id]).toBeUndefined();
	});

	it("reads both single-mode saves and rejects invalid evidence", () => {
		const parsed = parseProgress(
			JSON.stringify({
				recitation: {
					[id]: "synthetic",
					[otherId]: "partner",
					unknown: { synthetic: true },
				},
			}),
		);
		expect(parsed.recitation).toEqual({
			[id]: { synthetic: true, partner: false },
			[otherId]: { synthetic: false, partner: true },
		});
		expect(
			parseProgress(
				JSON.stringify({
					recitation: { [id]: { synthetic: "true", partner: 1 } },
				}),
			).recitation,
		).toEqual({});
	});
});

describe("two open tabs", () => {
	it("preserves another tab's draft, assessment, completed checks and recitation on navigation", () => {
		const first = openTab();
		const stale = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.writingDone.push(key);
		first.progress.quizDone.push(id);
		first.progress.practiceDone.push(id);
		first.progress.workshopDone.push(id);
		markSyntheticRecitation(first.progress, id);
		first.save();
		stale.progress.activeLessonId = plainId;
		stale.progress.level = 2;
		stale.save();
		expect(loadProgress().drafts[key]).toBe(firstText);
		expect(isComplete(loadProgress(), id)).toBe(true);
		expect(stale.progress.activeLessonId).toBe(plainId);
		expect(stale.progress.level).toBe(2);
	});

	it("joins work on different drafts without treating stale drafts as edits", () => {
		const first = openTab();
		const second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.save();
		updateDraft(second.progress, plainId, 2, changedText);
		second.save();
		first.progress.quizDone.push(id);
		first.save();
		expect(loadProgress().drafts).toEqual({
			[key]: firstText,
			[`${plainId}:2`]: changedText,
		});
	});

	it("does not restore an assessment belonging to the old text", () => {
		const seed = openTab();
		updateDraft(seed.progress, id, 1, firstText);
		seed.progress.writingDone.push(key);
		seed.save();
		const editor = openTab();
		const stale = openTab();
		updateDraft(editor.progress, id, 1, changedText);
		editor.save();
		stale.progress.quizDone.push(plainId);
		stale.save();
		expect(loadProgress().drafts[key]).toBe(changedText);
		expect(loadProgress().writingDone).not.toContain(key);
	});

	it("saves an actual new edit, including clearing a draft, while keeping unrelated work", () => {
		const first = openTab();
		const second = openTab();
		updateDraft(first.progress, id, 1, firstText);
		first.progress.quizDone.push(plainId);
		first.save();
		updateDraft(second.progress, id, 1, changedText);
		second.save();
		updateDraft(first.progress, id, 1, "");
		first.save();
		expect(loadProgress().drafts[key]).toBe("");
		expect(loadProgress().quizDone).toContain(plainId);
	});

	it("joins completed speech and partner confirmation and does not revive a withdrawn check", () => {
		const speech = openTab();
		const partner = openTab();
		markSyntheticRecitation(speech.progress, id);
		speech.save();
		setPartnerRecitation(partner.progress, id, true);
		partner.save();
		const stale = openTab();
		setPartnerRecitation(partner.progress, id, false);
		partner.save();
		stale.save();
		expect(loadProgress().recitation[id]).toEqual({
			synthetic: true,
			partner: false,
		});
	});

	it("adopts a storage event without changing this tab's lesson or level", () => {
		const baseline = freshProgress();
		const own = structuredClone(baseline);
		const stored = freshProgress();
		own.activeLessonId = plainId;
		own.level = 2;
		updateDraft(stored, id, 1, firstText);
		stored.writingDone.push(key);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.writingDone).toContain(key);
		expect(merged.activeLessonId).toBe(plainId);
		expect(merged.level).toBe(2);
	});

	it("keeps an unsaved local edit while receiving unrelated storage changes", () => {
		const baseline = freshProgress();
		const own = structuredClone(baseline);
		const stored = freshProgress();
		updateDraft(own, id, 1, firstText);
		stored.quizDone.push(plainId);
		const merged = mergeProgress(stored, own, baseline);
		expect(merged.drafts[key]).toBe(firstText);
		expect(merged.quizDone).toContain(plainId);
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
