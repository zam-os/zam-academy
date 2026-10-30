/** Only an already installed voice is used. Remote browser voices are excluded. */
export function localFrenchVoices(
	voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
	return voices
		.filter((voice) => voice.localService && /^fr(?:-|$)/i.test(voice.lang))
		.sort(
			(left, right) =>
				Number(right.lang.toLowerCase() === "fr-fr") -
				Number(left.lang.toLowerCase() === "fr-fr"),
		);
}
