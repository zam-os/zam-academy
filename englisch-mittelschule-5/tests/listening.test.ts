import { describe, expect, it, vi } from "vitest";
import {
	localEnglishVoices,
	readLocalScript,
	speechChunks,
	waitForLocalEnglishVoice,
} from "../src/listening";

function voice(lang: string, localService: boolean): SpeechSynthesisVoice {
	return {
		default: false,
		lang,
		localService,
		name: `${lang}-${localService ? "local" : "remote"}`,
		voiceURI: lang,
	};
}

describe("local listening engine", () => {
	it("filters only locally installed English voices", () => {
		const voices = [
			voice("de-DE", true),
			voice("en-GB", false),
			voice("en-GB", true),
			voice("en-US", true),
		];
		expect(localEnglishVoices(voices).map((v) => v.lang)).toEqual([
			"en-GB",
			"en-US",
		]);
	});

	it("splits long listening scripts cleanly into short chunks", () => {
		const longText =
			"Good morning, class! Please open your books at page ten. Look at the first picture and listen carefully to every sentence. Then write three simple English words into your exercise book and compare with your partner.";
		const chunks = speechChunks(longText);
		expect(chunks.length).toBeGreaterThan(1);
		for (const chunk of chunks) {
			expect(chunk.length).toBeLessThanOrEqual(180);
		}
		expect(chunks.join(" ")).toBe(longText);
	});

	it("speaks chunks sequentially and calls complete on final onend", () => {
		const spoken: string[] = [];
		const complete = vi.fn();
		const failed = vi.fn();
		const controller = new AbortController();

		const synthesis = {
			cancel: vi.fn(),
			speak(utterance: SpeechSynthesisUtterance) {
				spoken.push(utterance.text);
				utterance.onend?.(new Event("end") as SpeechSynthesisEvent);
			},
		};
		const createUtterance = (text: string) =>
			({ text, lang: "", rate: 1, onend: null, onerror: null }) as unknown as SpeechSynthesisUtterance;

		readLocalScript(
			synthesis,
			createUtterance,
			"Hello class. Please open your books now.",
			voice("en-GB", true),
			controller.signal,
			{ complete, failed },
		);

		expect(spoken).toEqual(["Hello class. Please open your books now."]);
		expect(complete).toHaveBeenCalledTimes(1);
		expect(failed).not.toHaveBeenCalled();
	});

	it("resolves installed voices immediately when available", async () => {
		const controller = new AbortController();
		const synth = {
			getVoices: () => [voice("en-GB", true)],
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
		};
		const found = await waitForLocalEnglishVoice(synth, controller.signal);
		expect(found?.lang).toBe("en-GB");
	});
});
