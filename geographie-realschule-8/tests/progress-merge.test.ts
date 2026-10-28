import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	confirmWriting,
	freshProgress,
	isComplete,
	loadProgress,
	recordQuizAnswer,
	STORAGE_KEY,
	saveProgress,
	submitCaseAnswers,
	updateDraft,
	updateProject,
	writingKey,
} from "../src/storage/progress";

let stored: Map<string, string>;
beforeEach(() => {
	stored = new Map();
	vi.stubGlobal("navigator", {});
	vi.stubGlobal("localStorage", {
		getItem: (key: string) => stored.get(key) ?? null,
		setItem: (key: string, value: string) => {
			stored.set(key, value);
		},
	});
});
afterEach(() => vi.unstubAllGlobals());
const first = LESSONS[0];
const second = LESSONS[1];
const key = writingKey(first.id, 2);

function deferredLocks() {
	const queue: Array<() => void> = [];
	vi.stubGlobal("navigator", {
		locks: {
			request: (_name: string, work: () => boolean) =>
				new Promise<boolean>((resolve) => queue.push(() => resolve(work()))),
		},
	});
	return () => {
		const next = queue.shift();
		if (!next) throw new Error("No queued save");
		next();
	};
}

describe("Saving independently loaded tabs", () => {
	it("preserves another tab's draft, confirmation, quiz and submitted cases", async () => {
		const a = loadProgress();
		const b = loadProgress();
		a.level = 2;
		updateDraft(a, first.id, 2, "Mein neuer Transfertext aus dem ersten Tab.");
		confirmWriting(a, first.id, 2, a.drafts[key]);
		recordQuizAnswer(a, first.id, true);
		submitCaseAnswers(
			a,
			first.id,
			first.cases.map((c) => c.answer),
		);
		expect(await saveProgress(a)).toBe(true);
		updateDraft(b, second.id, 1, "Mein eigener Text für die andere Lektion.");
		recordQuizAnswer(b, second.id, true);
		submitCaseAnswers(
			b,
			second.id,
			second.cases.map((c) => c.answer),
		);
		expect(await saveProgress(b)).toBe(true);
		const result = loadProgress();
		expect(result.drafts[key]).toBe(a.drafts[key]);
		expect(result.writingDone).toContain(key);
		expect(result.quizDone).toEqual(
			expect.arrayContaining([first.id, second.id]),
		);
		expect(result.cases[first.id]).toEqual(first.cases.map((c) => c.answer));
		expect(result.cases[second.id]).toEqual(second.cases.map((c) => c.answer));
		expect(isComplete(result, first.id, 2)).toBe(true);
		expect(b.level).toBe(1);
	});
	it("merges separate levels of the same lesson without moving the visible level", async () => {
		const a = loadProgress();
		const b = loadProgress();
		a.level = 2;
		updateDraft(a, first.id, 2, "Die Antwort für Level zwei bleibt erhalten.");
		expect(await saveProgress(a)).toBe(true);
		updateDraft(b, first.id, 1, "Die Antwort für Level eins steht separat.");
		expect(await saveProgress(b)).toBe(true);
		const result = loadProgress();
		expect(result.drafts[writingKey(first.id, 1)]).toBe(
			b.drafts[writingKey(first.id, 1)],
		);
		expect(result.drafts[key]).toBe(a.drafts[key]);
		expect(b.level).toBe(1);
	});
	it("does not resurrect removed evidence when an older tab saves unrelated work", async () => {
		const seed = loadProgress();
		updateDraft(seed, first.id, 2, "Ursprünglich bestätigter Transfertext.");
		confirmWriting(seed, first.id, 2, seed.drafts[key]);
		recordQuizAnswer(seed, first.id, true);
		submitCaseAnswers(
			seed,
			first.id,
			first.cases.map((c) => c.answer),
		);
		await saveProgress(seed);
		const stale = loadProgress();
		const editor = loadProgress();
		updateDraft(
			editor,
			first.id,
			2,
			"Geänderter Text muss neu verglichen werden.",
		);
		recordQuizAnswer(editor, first.id, false);
		submitCaseAnswers(editor, first.id, [
			first.cases[0].options.find((o) => o !== first.cases[0].answer) ?? "",
			first.cases[1].answer,
		]);
		await saveProgress(editor);
		updateDraft(
			stale,
			second.id,
			1,
			"Ein unabhängiger Entwurf im älteren Tab.",
		);
		await saveProgress(stale);
		const result = loadProgress();
		expect(result.drafts[key]).toBe(editor.drafts[key]);
		expect(result.writingDone).not.toContain(key);
		expect(result.quizDone).not.toContain(first.id);
		expect(result.cases[first.id]).toEqual(editor.cases[first.id]);
		expect(isComplete(result, first.id, 2)).toBe(false);
	});
	it("cannot confirm another tab's changed text with a stale comparison", async () => {
		const seed = loadProgress();
		updateDraft(
			seed,
			first.id,
			2,
			"Der ursprüngliche noch unbestätigte Entwurf.",
		);
		await saveProgress(seed);
		const a = loadProgress();
		const b = loadProgress();
		updateDraft(
			a,
			first.id,
			2,
			"Ein anderer Entwurf, den Tab B nicht verglichen hat.",
		);
		await saveProgress(a);
		confirmWriting(b, first.id, 2, b.drafts[key]);
		await saveProgress(b);
		expect(loadProgress().drafts[key]).toBe(a.drafts[key]);
		expect(loadProgress().writingDone).not.toContain(key);
		expect(b.writingDone).not.toContain(key);
	});
	it("retains an explicit invalidation and supports retry after a failed write", async () => {
		const a = loadProgress();
		const b = loadProgress();
		updateDraft(
			a,
			first.id,
			2,
			"Ein lokaler Entwurf wartet auf das Speichern.",
		);
		const original = localStorage.setItem;
		vi.stubGlobal("localStorage", {
			getItem: (k: string) => stored.get(k) ?? null,
			setItem() {
				throw new Error("full");
			},
		});
		expect(await saveProgress(a)).toBe(false);
		expect(a.drafts[key]).toContain("wartet");
		vi.stubGlobal("localStorage", {
			getItem: (k: string) => stored.get(k) ?? null,
			setItem: original,
		});
		recordQuizAnswer(b, second.id, true);
		await saveProgress(b);
		expect(await saveProgress(a)).toBe(true);
		expect(loadProgress().quizDone).toContain(second.id);
		expect(loadProgress().drafts[key]).toBe(a.drafts[key]);
	});
	it("clears all saved progress on explicit reset and does not resurrect stale fields", async () => {
		const p = loadProgress();
		updateDraft(
			p,
			first.id,
			2,
			"Dieser Entwurf soll ausdrücklich gelöscht werden.",
		);
		recordQuizAnswer(p, first.id, true);
		await saveProgress(p);
		const stale = loadProgress();
		expect(await saveProgress(freshProgress())).toBe(true);
		expect(JSON.parse(stored.get(STORAGE_KEY) ?? "null")).toEqual(
			freshProgress(),
		);
		stale.level = 2;
		await saveProgress(stale);
		expect(loadProgress().drafts).toEqual({});
		expect(loadProgress().quizDone).toEqual([]);
	});
	it("serializes overlapping saves for the whole merge through one Web Lock", async () => {
		const a = loadProgress();
		const b = loadProgress();
		updateDraft(
			a,
			first.id,
			2,
			"Ein Entwurf aus dem ersten gleichzeitig geöffneten Tab.",
		);
		updateDraft(
			b,
			second.id,
			1,
			"Ein anderer Entwurf aus dem zweiten geöffneten Tab.",
		);
		let queue: Promise<unknown> = Promise.resolve();
		let held = false;
		const request = vi.fn((_name: string, work: () => unknown) => {
			const run = queue.then(() => {
				held = true;
				try {
					return work();
				} finally {
					held = false;
				}
			});
			queue = run.catch(() => undefined);
			return run;
		});
		vi.stubGlobal("navigator", { locks: { request } });
		vi.stubGlobal("localStorage", {
			getItem: (name: string) => stored.get(name) ?? null,
			setItem: (name: string, value: string) => {
				expect(held).toBe(true);
				stored.set(name, value);
			},
		});
		expect(await Promise.all([saveProgress(a), saveProgress(b)])).toEqual([
			true,
			true,
		]);
		expect(request).toHaveBeenCalledTimes(2);
		expect(request.mock.calls.every(([name]) => name === STORAGE_KEY)).toBe(
			true,
		);
		const result = loadProgress();
		expect(result.drafts[key]).toBe(a.drafts[key]);
		expect(result.drafts[writingKey(second.id, 1)]).toBe(
			b.drafts[writingKey(second.id, 1)],
		);
	});
	it("keeps the latest edit when A1, B1 and A2 wait in the lock queue", async () => {
		const drain = deferredLocks();
		const a = loadProgress();
		const b = loadProgress();
		updateDraft(a, first.id, 2, "A1: Der erste Entwurf aus diesem Tab.");
		const a1 = saveProgress(a);
		updateDraft(b, first.id, 2, "B1: Der andere Tab schreibt seinen Entwurf.");
		const b1 = saveProgress(b);
		const newest =
			"A2: Mein inzwischen weiterentwickelter Entwurf bleibt erhalten.";
		updateDraft(a, first.id, 2, newest);
		const a2 = saveProgress(a);
		drain();
		expect(await a1).toBe(true);
		expect(a.drafts[key]).toBe(newest);
		drain();
		expect(await b1).toBe(true);
		expect(loadProgress().drafts[key]).toBe(b.drafts[key]);
		drain();
		expect(await a2).toBe(true);
		expect(loadProgress().drafts[key]).toBe(newest);
		expect(a.drafts[key]).toBe(newest);
	});
	it("does not replay an acknowledged draft in a second queued save", async () => {
		const drain = deferredLocks();
		const a = loadProgress();
		const b = loadProgress();
		updateDraft(a, first.id, 2, "A1: Dieser Entwurf wird zuerst gespeichert.");
		const a1 = saveProgress(a);
		updateDraft(
			b,
			first.id,
			2,
			"B1: Diese neue Fassung ersetzt den ersten Entwurf.",
		);
		const b1 = saveProgress(b);
		recordQuizAnswer(a, second.id, true);
		const aQuiz = saveProgress(a);
		drain();
		await a1;
		drain();
		await b1;
		drain();
		expect(await aQuiz).toBe(true);
		expect(loadProgress().drafts[key]).toBe(b.drafts[key]);
		expect(loadProgress().quizDone).toContain(second.id);
		expect(a.drafts[key]).toBe(b.drafts[key]);
	});
	it("refuses a confirmation after the in-memory draft changed during a queued save", async () => {
		const a = loadProgress();
		const b = loadProgress();
		const compared = "Diesen alten Entwurf habe ich mit dem Muster verglichen.";
		updateDraft(a, first.id, 2, compared);
		await saveProgress(a);
		updateDraft(
			b,
			first.id,
			2,
			"Ein inzwischen geänderter Entwurf aus dem anderen Tab.",
		);
		await saveProgress(b);
		// The storage callback has already adopted the other draft, while
		// a still-visible comparison can refer to the previous textarea value.
		await saveProgress(a);
		expect(confirmWriting(a, first.id, 2, compared)).toBe(false);
		await saveProgress(a);
		expect(loadProgress().writingDone).not.toContain(key);
	});
	it("keeps the merge fallback usable when an offline origin refuses Web Locks", async () => {
		const a = loadProgress();
		updateDraft(
			a,
			first.id,
			2,
			"Dieser Offline-Entwurf soll gespeichert werden.",
		);
		vi.stubGlobal("navigator", {
			locks: {
				request: () =>
					Promise.reject(new DOMException("Opaque origin", "SecurityError")),
			},
		});
		expect(await saveProgress(a)).toBe(true);
		expect(loadProgress().drafts[key]).toBe(a.drafts[key]);
	});
	it("reports other lock failures without discarding pending local changes", async () => {
		const a = loadProgress();
		updateDraft(
			a,
			first.id,
			2,
			"Dieser Entwurf wartet nach einem Fehler weiter.",
		);
		vi.stubGlobal("navigator", {
			locks: { request: () => Promise.reject(new Error("Lock failed")) },
		});
		expect(await saveProgress(a)).toBe(false);
		expect(a.drafts[key]).toContain("wartet");
		vi.stubGlobal("navigator", {});
		expect(await saveProgress(a)).toBe(true);
		expect(loadProgress().drafts[key]).toBe(a.drafts[key]);
	});
	it("retains an explicit wrong submission across a failed write and retry", async () => {
		const a = loadProgress();
		const b = loadProgress();
		recordQuizAnswer(a, first.id, false);
		const original = localStorage.setItem;
		vi.stubGlobal("localStorage", {
			getItem: (k: string) => stored.get(k) ?? null,
			setItem() {
				throw new Error("full");
			},
		});
		expect(await saveProgress(a)).toBe(false);
		vi.stubGlobal("localStorage", {
			getItem: (k: string) => stored.get(k) ?? null,
			setItem: original,
		});
		recordQuizAnswer(b, first.id, true);
		await saveProgress(b);
		expect(loadProgress().quizDone).toContain(first.id);
		expect(await saveProgress(a)).toBe(true);
		expect(loadProgress().quizDone).not.toContain(first.id);
	});
});

describe("Shared geography project", () => {
	it("merges separate project fields alongside independent lesson work", async () => {
		const a = loadProgress();
		const b = loadProgress();
		updateProject(a, "place", "Öffentlicher Platz am Rathaus");
		await saveProgress(a);
		updateProject(
			b,
			"question",
			"Welche räumlichen Folgen hat die neue Straßenführung?",
		);
		updateDraft(
			b,
			second.id,
			1,
			"Ein unabhängiger Entwurf in der Geographie-Lektion.",
		);
		await saveProgress(b);
		const result = loadProgress();
		expect(result.project.place).toBe(a.project.place);
		expect(result.project.question).toBe(b.project.question);
		expect(result.drafts[writingKey(second.id, 1)]).toBe(
			b.drafts[writingKey(second.id, 1)],
		);
	});
	it("keeps a newer project edit while older saves wait for the lock", async () => {
		const drain = deferredLocks();
		const a = loadProgress();
		const b = loadProgress();
		updateProject(a, "place", "Erster öffentlicher Ort");
		const a1 = saveProgress(a);
		updateProject(b, "place", "Ein anderer öffentlicher Ort");
		const b1 = saveProgress(b);
		updateProject(a, "place", "Der inzwischen gewählte Untersuchungsort");
		const newest = a.project.place;
		const a2 = saveProgress(a);
		drain();
		await a1;
		expect(a.project.place).toBe(newest);
		drain();
		await b1;
		drain();
		await a2;
		expect(loadProgress().project.place).toBe(newest);
	});
	it("does not resurrect a reset project or lose another tab's cleared field", async () => {
		const seed = loadProgress();
		updateProject(seed, "place", "Ein inzwischen verworfener Untersuchungsort");
		await saveProgress(seed);
		const stale = loadProgress();
		const editor = loadProgress();
		updateProject(editor, "place", "");
		await saveProgress(editor);
		recordQuizAnswer(stale, first.id, true);
		await saveProgress(stale);
		expect(loadProgress().project.place).toBe("");
		updateProject(
			stale,
			"question",
			"Diese Frage wird beim Zurücksetzen gelöscht.",
		);
		await saveProgress(stale);
		const older = loadProgress();
		await saveProgress(freshProgress());
		older.level = 2;
		await saveProgress(older);
		expect(loadProgress().project).toEqual(freshProgress().project);
	});
});
