const REAL_MINUS = "\u2212";

/** Formats numbers for German primary-school text: decimal comma, thousands spaces, U+2212 minus. */
export function fmt(value: number, maxDecimals = 2): string {
	if (!Number.isFinite(value)) throw new Error("Ungültiger Zahlenwert.");
	const negative = value < 0;
	const abs = Math.abs(value);
	const factor = 10 ** maxDecimals;
	const rounded = Math.round(abs * factor) / factor;
	const [intPart, decPart] = rounded.toFixed(maxDecimals).split(".");
	const groupedInt =
		intPart.length >= 4
			? intPart.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
			: intPart;
	const trimmedDec = (decPart ?? "").replace(/0+$/, "");
	const body = trimmedDec ? `${groupedInt},${trimmedDec}` : groupedInt;
	return negative && rounded !== 0 ? `${REAL_MINUS}${body}` : body;
}

/** Deterministic 32-bit PRNG (Mulberry32) so generated tasks are reproducible in tests and varied in play. */
export function createRng(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let t = Math.imul(state ^ (state >>> 15), 1 | state);
		t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

export function pick<T>(rng: () => number, items: ReadonlyArray<T>): T {
	if (items.length === 0) throw new Error("Auswahlliste ist leer.");
	const index = Math.min(items.length - 1, Math.floor(rng() * items.length));
	return items[index];
}

export function shuffleWithAnswer(
	rng: () => number,
	correct: string,
	wrongs: ReadonlyArray<string>,
	wrongReasons?: ReadonlyArray<string>,
): {
	options: string[];
	correctIndex: number;
	mistakeHints: Record<number, string>;
} {
	const entries = [
		{ text: correct, isCorrect: true, reason: "" },
		...wrongs.map((text, idx) => ({
			text,
			isCorrect: false,
			reason:
				wrongReasons?.[idx] ??
				"Schau noch einmal genau auf den Merksatz und die Schlüsselwörter in der Aufgabe.",
		})),
	];
	for (let i = entries.length - 1; i > 0; i--) {
		const j = Math.floor(rng() * (i + 1));
		const tmp = entries[i];
		entries[i] = entries[j];
		entries[j] = tmp;
	}
	const mistakeHints: Record<number, string> = {};
	let correctIndex = 0;
	entries.forEach((entry, idx) => {
		if (entry.isCorrect) correctIndex = idx;
		else mistakeHints[idx] = entry.reason;
	});
	return {
		options: entries.map((e) => e.text),
		correctIndex,
		mistakeHints,
	};
}

export function escapeHtml(input: string): string {
	return input.replace(
		/[&<>"']/g,
		(ch) =>
			({
				"&": "&amp;",
				"<": "&lt;",
				">": "&gt;",
				'"': "&quot;",
				"'": "&#39;",
			})[ch] ?? ch,
	);
}
