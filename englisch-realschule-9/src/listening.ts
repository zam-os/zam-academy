/** Only an already installed voice is used. Remote browser voices are excluded. */
export function localEnglishVoices(
	voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
	return voices
		.filter((voice) => voice.localService && /^en(?:-|$)/i.test(voice.lang))
		.sort(
			(left, right) =>
				Number(right.lang.toLowerCase() === "en-au") -
				Number(left.lang.toLowerCase() === "en-au"),
		);
}

/** Browsers may populate installed voices only after the first getVoices call. */
export function waitForLocalEnglishVoice(
	synthesis: Pick<
		SpeechSynthesis,
		"getVoices" | "addEventListener" | "removeEventListener"
	>,
	signal: AbortSignal,
	timeoutMs = 1500,
): Promise<SpeechSynthesisVoice | undefined> {
	return new Promise((resolve) => {
		let timer: ReturnType<typeof setTimeout> | undefined;
		const finish = (voice?: SpeechSynthesisVoice) => {
			clearTimeout(timer);
			synthesis.removeEventListener("voiceschanged", changed);
			signal.removeEventListener("abort", aborted);
			resolve(voice);
		};
		const aborted = () => finish();
		const changed = () => {
			try {
				const voice = localEnglishVoices(synthesis.getVoices())[0];
				if (voice) finish(voice);
			} catch {
				finish();
			}
		};
		if (signal.aborted) {
			resolve(undefined);
			return;
		}
		synthesis.addEventListener("voiceschanged", changed);
		signal.addEventListener("abort", aborted, { once: true });
		timer = setTimeout(() => finish(), timeoutMs);
		changed();
	});
}
