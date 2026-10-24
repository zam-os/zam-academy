import { afterEach, describe, expect, it, vi } from "vitest";
import { waitForLocalEnglishVoice } from "../src/listening";

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
