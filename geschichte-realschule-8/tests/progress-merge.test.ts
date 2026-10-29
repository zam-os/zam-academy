import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
  confirmWriting,
  freshProgress,
  invalidateWriting,
  loadProgress,
  recordQuizAnswer,
  recordWorkshopAnswer,
  saveProgress,
  STORAGE_KEY,
  updateDraft,
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
const first = LESSONS[0].id,
  second = LESSONS[1].id;
const key = writingKey(first, 1);
const text = "Ein neuer und selbständig formulierter Entwurf aus Tab A.";
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
    if (!next) throw Error("No queued save");
    next();
  };
}

describe("Cross-tab progress preservation", () => {
  it("merges drafts, confirmations, quiz and workshop marks from separate tabs", async () => {
    const a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, text);
    confirmWriting(a, first, 1, text);
    recordQuizAnswer(a, first, true);
    recordWorkshopAnswer(a, first, true);
    await saveProgress(a);
    updateDraft(b, second, 2, "Ein anderer Entwurf aus dem zweiten Tab.");
    recordQuizAnswer(b, second, true);
    recordWorkshopAnswer(b, second, true);
    await saveProgress(b);
    const result = loadProgress();
    expect(result.drafts[key]).toBe(text);
    expect(result.writingDone).toContain(key);
    expect(result.quizDone).toEqual(expect.arrayContaining([first, second]));
    expect(result.workshopDone).toEqual(
      expect.arrayContaining([first, second]),
    );
    expect(result.drafts[writingKey(second, 2)]).toBe(
      b.drafts[writingKey(second, 2)],
    );
    expect(b.drafts[key]).toBe(text);
  });
  it("does not overwrite a remote draft on deep-link, navigation or no-op saves", async () => {
    const a = loadProgress(),
      stale = loadProgress();
    updateDraft(a, first, 1, text);
    await saveProgress(a);
    stale.activeLessonId = second;
    stale.level = 2;
    stale.includeEnglish = true;
    await saveProgress(stale);
    expect(loadProgress().drafts[key]).toBe(text);
    expect(stale.activeLessonId).toBe(second);
    expect(stale.level).toBe(2);
    expect(stale.includeEnglish).toBe(true);
  });
  it("keeps the two levels independent and local navigation stable", async () => {
    const a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, text);
    await saveProgress(a);
    b.level = 2;
    b.activeLessonId = second;
    updateDraft(b, first, 2, "Eine eigenständige Antwort für den Transfer.");
    await saveProgress(b);
    expect(loadProgress().drafts[key]).toBe(text);
    expect(loadProgress().drafts[writingKey(first, 2)]).toContain("Transfer");
    expect(b.level).toBe(2);
    expect(b.activeLessonId).toBe(second);
  });
  it("does not restore an invalidated confirmation or deleted text from a stale tab", async () => {
    const seed = loadProgress();
    updateDraft(seed, first, 1, text);
    confirmWriting(seed, first, 1, text);
    await saveProgress(seed);
    const stale = loadProgress(),
      editor = loadProgress();
    updateDraft(editor, first, 1, "");
    await saveProgress(editor);
    recordQuizAnswer(stale, second, true);
    await saveProgress(stale);
    expect(loadProgress().drafts[key]).toBe("");
    expect(loadProgress().writingDone).not.toContain(key);
  });
  it("cannot attach a stale self-assessment to a remotely changed draft", async () => {
    const seed = loadProgress();
    updateDraft(seed, first, 1, text);
    await saveProgress(seed);
    const a = loadProgress(),
      b = loadProgress();
    const newer =
      "Ein neuer Text, den der andere Tab noch nicht verglichen hat.";
    updateDraft(a, first, 1, newer);
    await saveProgress(a);
    expect(confirmWriting(b, first, 1, text)).toBe(true);
    await saveProgress(b);
    expect(loadProgress().drafts[key]).toBe(newer);
    expect(loadProgress().writingDone).not.toContain(key);
    expect(confirmWriting(b, first, 1, text)).toBe(false);
  });
  it("persists an explicit request to revise and does not resurrect it on a stale save", async () => {
    const seed = loadProgress();
    updateDraft(seed, first, 1, text);
    confirmWriting(seed, first, 1, text);
    await saveProgress(seed);
    const stale = loadProgress(),
      editor = loadProgress();
    invalidateWriting(editor, first, 1);
    await saveProgress(editor);
    recordWorkshopAnswer(stale, second, true);
    await saveProgress(stale);
    expect(loadProgress().writingDone).not.toContain(key);
  });
  it("clears on explicit reset without resurrecting old evidence on navigation", async () => {
    const a = loadProgress();
    updateDraft(a, first, 1, text);
    recordQuizAnswer(a, first, true);
    await saveProgress(a);
    const stale = loadProgress();
    await saveProgress(freshProgress());
    stale.level = 2;
    await saveProgress(stale);
    expect(loadProgress().drafts).toEqual({});
    expect(loadProgress().quizDone).toEqual([]);
  });
  it("keeps unsaved edits for retry after storage failure", async () => {
    const a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, text);
    const write = localStorage.setItem;
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => stored.get(k) ?? null,
      setItem() {
        throw Error("full");
      },
    });
    expect(await saveProgress(a)).toBe(false);
    vi.stubGlobal("localStorage", {
      getItem: (k: string) => stored.get(k) ?? null,
      setItem: write,
    });
    recordQuizAnswer(b, second, true);
    await saveProgress(b);
    expect(await saveProgress(a)).toBe(true);
    expect(loadProgress().drafts[key]).toBe(text);
    expect(loadProgress().quizDone).toContain(second);
  });
  it("serializes saves through a Web Lock and retains both independent edits", async () => {
    let queue: Promise<unknown> = Promise.resolve();
    const request = vi.fn((_name: string, work: () => unknown) => {
      const next = queue.then(work);
      queue = next;
      return next;
    });
    vi.stubGlobal("navigator", { locks: { request } });
    const a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, text);
    updateDraft(
      b,
      second,
      1,
      "Ein anderer gleichzeitiger Entwurf bleibt erhalten.",
    );
    expect(await Promise.all([saveProgress(a), saveProgress(b)])).toEqual([
      true,
      true,
    ]);
    expect(request).toHaveBeenCalledTimes(2);
    expect(request.mock.calls.every(([name]) => name === STORAGE_KEY)).toBe(
      true,
    );
    expect(loadProgress().drafts[key]).toBe(text);
    expect(loadProgress().drafts[writingKey(second, 1)]).toBe(
      b.drafts[writingKey(second, 1)],
    );
  });
  it("keeps the latest local edit when A1, B1 and A2 queue for the same draft", async () => {
    const drain = deferredLocks(),
      a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, "A1: Eine erste Fassung aus diesem Tab.");
    const a1 = saveProgress(a);
    updateDraft(
      b,
      first,
      1,
      "B1: Eine zwischenzeitliche Fassung aus dem anderen Tab.",
    );
    const b1 = saveProgress(b);
    const newest = "A2: Der inzwischen überarbeitete eigene Text soll bleiben.";
    updateDraft(a, first, 1, newest);
    const a2 = saveProgress(a);
    drain();
    await a1;
    expect(a.drafts[key]).toBe(newest);
    drain();
    await b1;
    drain();
    await a2;
    expect(loadProgress().drafts[key]).toBe(newest);
  });
  it("does not replay an already acknowledged edit in an unrelated queued save", async () => {
    const drain = deferredLocks(),
      a = loadProgress(),
      b = loadProgress();
    updateDraft(a, first, 1, text);
    const a1 = saveProgress(a);
    const newer =
      "Eine neuere Fassung aus Tab B darf nicht überschrieben werden.";
    updateDraft(b, first, 1, newer);
    const b1 = saveProgress(b);
    recordQuizAnswer(a, second, true);
    const quiz = saveProgress(a);
    drain();
    await a1;
    drain();
    await b1;
    drain();
    await quiz;
    expect(loadProgress().drafts[key]).toBe(newer);
    expect(loadProgress().quizDone).toContain(second);
  });
  it("falls back when an offline origin refuses Web Locks", async () => {
    const a = loadProgress();
    updateDraft(a, first, 1, text);
    vi.stubGlobal("navigator", {
      locks: {
        request: () =>
          Promise.reject(new DOMException("Opaque origin", "SecurityError")),
      },
    });
    expect(await saveProgress(a)).toBe(true);
    expect(loadProgress().drafts[key]).toBe(text);
  });
});
