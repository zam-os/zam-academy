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
