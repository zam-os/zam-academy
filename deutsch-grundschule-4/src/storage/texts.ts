// Free texts from the Schreibtisch. They never leave this browser, nothing reads
// or rates them, and a reset removes them together with the progress.
export const TEXTS_KEY = "deutsch_gs4_texts_v1";
export const MAX_TEXT = 6000;

export type Texts = Record<string, string>;

export function parseTexts(raw: string | null): Texts {
	try {
		const data: unknown = JSON.parse(raw ?? "null");
		if (!data || typeof data !== "object" || Array.isArray(data)) return {};
		const texts: Texts = {};
		for (const [id, value] of Object.entries(data))
			if (typeof value === "string" && value) texts[id] = value.slice(0, MAX_TEXT);
		return texts;
	} catch {
		return {};
	}
}

export function loadText(lessonId: string): string {
	try {
		return parseTexts(localStorage.getItem(TEXTS_KEY))[lessonId] ?? "";
	} catch {
		return "";
	}
}

/** False when the browser refuses to store: the child should copy the text. */
export function saveText(lessonId: string, value: string): boolean {
	try {
		const texts = parseTexts(localStorage.getItem(TEXTS_KEY));
		if (value) texts[lessonId] = value.slice(0, MAX_TEXT);
		else delete texts[lessonId];
		localStorage.setItem(TEXTS_KEY, JSON.stringify(texts));
		return true;
	} catch {
		return false;
	}
}

export function clearTexts(): void {
	try {
		localStorage.removeItem(TEXTS_KEY);
	} catch {
		// Nothing stored, nothing to clear.
	}
}
