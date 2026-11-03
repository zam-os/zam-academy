export const ACADEMY_HOME_URL = "https://academy.zam-os.org/";
export const PACKAGE_BASE_URL =
	"https://academy.zam-os.org/hsu-grundschule-4/";

export function lessonSourceUrl(lessonId: string): string {
	return `${PACKAGE_BASE_URL}#lesson=${lessonId}`;
}

export function parseLessonHash(
	hash: string,
	knownIds: ReadonlySet<string>,
): string | null {
	const cleaned = hash.startsWith("#") ? hash.slice(1) : hash;
	const params = new URLSearchParams(cleaned);
	const candidate = params.get("lesson")?.trim() ?? "";
	return candidate && knownIds.has(candidate) ? candidate : null;
}
