import type { Level } from "../types";

export const ZAM_ACADEMY_APP_URL =
	"https://academy.zam-os.org/englisch-realschule-9/";
export const ZAM_CELL_ID = "zam-academy:englisch-realschule-9";
export const lessonLink = (id: string): string =>
	`${ZAM_ACADEMY_APP_URL}#lesson=${encodeURIComponent(id)}`;

/** Navigation must not resurrect an old query-string lesson after a reload. */
export function trainingBaseUrl(pathname: string, search: string): string {
	const params = new URLSearchParams(search);
	params.delete("lesson");
	params.delete("level");
	const query = params.toString();
	return `${pathname}${query ? `?${query}` : ""}`;
}

export function parseTrainingDeepLink(
	hash: string,
	search = "",
): { lessonId?: string; level?: Level } {
	const params = new URLSearchParams(
		[hash.replace(/^#/, ""), search.replace(/^\?/, "")]
			.filter(Boolean)
			.join("&"),
	);
	const lessonId = params.get("lesson")?.trim();
	const level = params.get("level");
	return {
		...(lessonId && /^[a-z0-9-]{1,64}$/.test(lessonId) ? { lessonId } : {}),
		...(level === "1" || level === "2"
			? { level: Number(level) as Level }
			: {}),
	};
}
