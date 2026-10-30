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

/** Keep each utterance short: some browsers stall on long single utterances. */
export function speechChunks(text: string): string[] {
	const chunks: string[] = [];
	let remaining = text.trim().replace(/\s+/g, " ");
	while (remaining.length > 180) {
		const window = remaining.slice(0, 181);
		const boundary = [...window.matchAll(/[.!?;:,](?=\s)/g)]
			.map((match) => match.index + 1)
			.filter((index) => index >= 60)
			.at(-1);
		let end = boundary ?? window.lastIndexOf(" ");
		// A single long word remains intact; ordinary lesson prose uses spaces.
		if (end <= 0) end = remaining.indexOf(" ");
		if (end <= 0) break;
		chunks.push(remaining.slice(0, end));
		remaining = remaining.slice(end).trimStart();
	}
	if (remaining) chunks.push(remaining);
	return chunks;
}

/** Only the final successful onend counts. Timeout, errors and abort never do. */
export function readLocalScript(
	synthesis: Pick<SpeechSynthesis, "speak" | "cancel">,
	createUtterance: (text: string) => SpeechSynthesisUtterance,
	text: string,
	voice: SpeechSynthesisVoice,
	signal: AbortSignal,
	callbacks: {
		complete: () => void;
		failed: (reason: "error" | "timeout") => void;
	},
): void {
	if (signal.aborted) return;
	const chunks = speechChunks(text);
	let nextIndex = 0;
	let current: SpeechSynthesisUtterance | undefined;
	let timer: ReturnType<typeof setTimeout> | undefined;
	let settled = false;
	const finish = (reason: "complete" | "error" | "timeout" | "abort") => {
		if (settled) return;
		settled = true;
		clearTimeout(timer);
		signal.removeEventListener("abort", aborted);
		if (current) {
			current.onend = null;
			current.onerror = null;
		}
		if (reason !== "complete") {
			try {
				synthesis.cancel();
			} catch {
				// The fallback remains usable even if the browser engine fails.
			}
		}
		current = undefined;
		if (reason === "complete") callbacks.complete();
		else if (reason !== "abort") callbacks.failed(reason);
	};
	const aborted = () => finish("abort");
	const next = () => {
		if (settled) return;
		if (nextIndex >= chunks.length) {
			finish("complete");
			return;
		}
		try {
			const utterance = createUtterance(chunks[nextIndex++]);
			current = utterance;
			utterance.voice = voice;
			utterance.lang = voice.lang;
			utterance.rate = 0.95;
			utterance.onend = () => {
				if (settled || current !== utterance) return;
				clearTimeout(timer);
				current = undefined;
				next();
			};
			utterance.onerror = () => {
				if (current === utterance) finish("error");
			};
			// Generous at ordinary reading speed; a stalled engine must release UI.
			timer = setTimeout(() => finish("timeout"), 30_000);
			synthesis.speak(utterance);
		} catch {
			finish("error");
		}
	};
	signal.addEventListener("abort", aborted, { once: true });
	if (chunks.length === 0) finish("error");
	else next();
}

/** Browsers may populate installed voices only after the first getVoices call. */
export function waitForLocalFrenchVoice(
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
				const voice = localFrenchVoices(synthesis.getVoices())[0];
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
