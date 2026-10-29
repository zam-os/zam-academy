import { afterEach, describe, expect, it, vi } from "vitest";
import { LESSONS } from "../src/curriculum";
import {
	readLocalScript,
	speechChunks,
	waitForLocalEnglishVoice,
} from "../src/listening";

const local = { lang: "en-GB", localService: true } as SpeechSynthesisVoice;
const remote = { lang: "en-AU", localService: false } as SpeechSynthesisVoice;
function engine(initial: SpeechSynthesisVoice[] = []) {
	const target = new EventTarget();
	const getVoices = vi.fn(() => initial);
	return {
		getVoices,
		addEventListener: vi.fn(target.addEventListener.bind(target)),
		removeEventListener: vi.fn(target.removeEventListener.bind(target)),
		dispatch: () => target.dispatchEvent(new Event("voiceschanged")),
	};
}
afterEach(() => vi.useRealTimers());

describe("asynchronously loaded installed voices", () => {
	it("uses an already available local voice immediately", async () => {
		const synthesis = engine([remote, local]);
		expect(
			await waitForLocalEnglishVoice(synthesis, new AbortController().signal),
		).toBe(local);
		expect(synthesis.removeEventListener).toHaveBeenCalledWith(
			"voiceschanged",
			expect.any(Function),
		);
	});
	it("waits for voiceschanged on the first click and still excludes remote voices", async () => {
		vi.useFakeTimers();
		const synthesis = engine();
		const result = waitForLocalEnglishVoice(
			synthesis,
			new AbortController().signal,
		);
		synthesis.getVoices.mockReturnValue([remote]);
		synthesis.dispatch();
		let settled = false;
		void result.then(() => {
			settled = true;
		});
		await Promise.resolve();
		expect(settled).toBe(false);
		synthesis.getVoices.mockReturnValue([remote, local]);
		synthesis.dispatch();
		expect(await result).toBe(local);
		expect(vi.getTimerCount()).toBe(0);
	});
	it("offers the partner/transcript fallback after a bounded wait", async () => {
		vi.useFakeTimers();
		const synthesis = engine([remote]);
		const result = waitForLocalEnglishVoice(
			synthesis,
			new AbortController().signal,
			500,
		);
		await vi.advanceTimersByTimeAsync(500);
		expect(await result).toBeUndefined();
		expect(synthesis.removeEventListener).toHaveBeenCalledWith(
			"voiceschanged",
			expect.any(Function),
		);
	});
	it("cancels a pending request so navigation cannot start delayed speech", async () => {
		vi.useFakeTimers();
		const synthesis = engine(),
			request = new AbortController();
		const result = waitForLocalEnglishVoice(synthesis, request.signal);
		request.abort();
		synthesis.getVoices.mockReturnValue([local]);
		synthesis.dispatch();
		expect(await result).toBeUndefined();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("does not read voices after a request was already cancelled", async () => {
		const synthesis = engine([local]),
			request = new AbortController();
		request.abort();
		expect(
			await waitForLocalEnglishVoice(synthesis, request.signal),
		).toBeUndefined();
		expect(synthesis.getVoices).not.toHaveBeenCalled();
	});
});

function playback() {
	const spoken: SpeechSynthesisUtterance[] = [];
	const synthesis = {
		speak: vi.fn((utterance: SpeechSynthesisUtterance) =>
			spoken.push(utterance),
		),
		cancel: vi.fn(),
	};
	const create = (text: string) =>
		({ text, onend: null, onerror: null }) as SpeechSynthesisUtterance;
	const complete = vi.fn();
	const failed = vi.fn();
	const request = new AbortController();
	return { synthesis, create, spoken, complete, failed, request };
}
const longScript = "A short sentence introduces one useful detail. ".repeat(12);

describe("bounded local playback", () => {
	it("preserves every word of all three scripts in short utterances", () => {
		for (const lesson of LESSONS.filter((entry) => entry.listening)) {
			const chunks = speechChunks(lesson.material);
			expect(chunks.length).toBeGreaterThan(1);
			expect(chunks.every((chunk) => chunk.length <= 180)).toBe(true);
			expect(chunks.join(" ")).toBe(
				lesson.material.trim().replace(/\s+/g, " "),
			);
		}
	});
	it("counts completion only after the final chunk ends and ignores old events", () => {
		vi.useFakeTimers();
		const p = playback();
		readLocalScript(
			p.synthesis,
			p.create,
			longScript,
			local,
			p.request.signal,
			p,
		);
		const count = speechChunks(longScript).length;
		for (let index = 0; index < count; index++) {
			expect(p.complete).not.toHaveBeenCalled();
			const utterance = p.spoken[index];
			expect(utterance.voice).toBe(local);
			const ended = utterance.onend;
			ended?.call(utterance, {} as SpeechSynthesisEvent);
			ended?.call(utterance, {} as SpeechSynthesisEvent);
		}
		expect(p.spoken).toHaveLength(count);
		expect(p.complete).toHaveBeenCalledTimes(1);
		expect(p.failed).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("aborts without starting another chunk or counting completion", () => {
		vi.useFakeTimers();
		const p = playback();
		readLocalScript(
			p.synthesis,
			p.create,
			longScript,
			local,
			p.request.signal,
			p,
		);
		const lateEnd = p.spoken[0].onend;
		p.request.abort();
		lateEnd?.call(p.spoken[0], {} as SpeechSynthesisEvent);
		expect(p.spoken).toHaveLength(1);
		expect(p.synthesis.cancel).toHaveBeenCalledTimes(1);
		expect(p.complete).not.toHaveBeenCalled();
		expect(p.failed).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("releases a stalled engine with a fallback instead of false progress", async () => {
		vi.useFakeTimers();
		const p = playback();
		readLocalScript(
			p.synthesis,
			p.create,
			longScript,
			local,
			p.request.signal,
			p,
		);
		await vi.advanceTimersByTimeAsync(30_000);
		expect(p.failed).toHaveBeenCalledExactlyOnceWith("timeout");
		expect(p.complete).not.toHaveBeenCalled();
		expect(p.synthesis.cancel).toHaveBeenCalledTimes(1);
		p.spoken[0].onend?.({} as SpeechSynthesisEvent);
		expect(p.complete).not.toHaveBeenCalled();
	});
	it("keeps earlier successful chunks from hiding a later playback error", () => {
		vi.useFakeTimers();
		const p = playback();
		readLocalScript(
			p.synthesis,
			p.create,
			longScript,
			local,
			p.request.signal,
			p,
		);
		p.spoken[0].onend?.({} as SpeechSynthesisEvent);
		p.spoken[1].onerror?.({} as SpeechSynthesisErrorEvent);
		expect(p.failed).toHaveBeenCalledExactlyOnceWith("error");
		expect(p.complete).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
	});
	it("handles an exception from the browser and an already aborted request", () => {
		vi.useFakeTimers();
		const p = playback();
		p.synthesis.speak.mockImplementation(() => {
			throw new Error("Unavailable");
		});
		readLocalScript(
			p.synthesis,
			p.create,
			longScript,
			local,
			p.request.signal,
			p,
		);
		expect(p.failed).toHaveBeenCalledExactlyOnceWith("error");
		expect(p.complete).not.toHaveBeenCalled();
		expect(vi.getTimerCount()).toBe(0);
		const cancelled = playback();
		cancelled.request.abort();
		readLocalScript(
			cancelled.synthesis,
			cancelled.create,
			longScript,
			local,
			cancelled.request.signal,
			cancelled,
		);
		expect(cancelled.synthesis.speak).not.toHaveBeenCalled();
	});
});
