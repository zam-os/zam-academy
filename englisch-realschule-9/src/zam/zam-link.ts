import type { Level } from "../types";

/** Where this app is served; every ZAM card about it cites a lesson here. */
export const ZAM_ACADEMY_APP_URL =
	"https://academy.zam-os.org/englisch-realschule-9/";
/** The ZAM cell that keeps what this app teaches (cell.json in this folder). */
export const ZAM_CELL_ID = "zam-academy:englisch-realschule-9";
export const ZAM_CELL_TITLE = "Englisch 9 Realschule (ZAM Academy)";
/** Lesson ids are a public contract: renaming one breaks every citing card. */
export const lessonLink = (id: string): string =>
	`${ZAM_ACADEMY_APP_URL}#lesson=${encodeURIComponent(id)}`;

/** What the learner says to their agent in ZAM to take the cell. */
export function zamEnrolRequest(): string {
	return `Nimm mich in die Zelle „${ZAM_CELL_TITLE}“ auf.`;
}

/** Navigation must not resurrect an old query-string lesson after a reload. */
export function trainingBaseUrl(pathname: string, search: string): string {
	const params = new URLSearchParams(search);
	params.delete("lesson");
	params.delete("level");
	const query = params.toString();
	return `${pathname}${query ? `?${query}` : ""}`;
}

/** Read a public lesson/level link from hash or query; the caller checks existence. */
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
