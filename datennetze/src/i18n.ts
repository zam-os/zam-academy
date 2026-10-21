export type Language = "de" | "en";
export const LANGUAGE_KEY = "zam-academy-datennetze-language-v1";
export function isLanguage(value: unknown): value is Language {
	return value === "de" || value === "en";
}
export function translator(
	language: Language,
): (german: string, english: string) => string {
	return (german, english) => (language === "en" ? english : german);
}
export function readLanguage(
	hash: string,
	storage?: { getItem(key: string): string | null },
): Language {
	const params = new URLSearchParams(hash.replace(/^#/, ""));
	if (params.has("lang")) return params.get("lang") === "en" ? "en" : "de";
	try {
		return storage?.getItem(LANGUAGE_KEY) === "en" ? "en" : "de";
	} catch {
		return "de";
	}
}
export function languageHash(lesson: string, language: Language): string {
	return `lesson=${encodeURIComponent(lesson)}&lang=${language}`;
}
