import type { Level } from "../types";

export const ZAM_ACADEMY_APP_URL =
	"https://academy.zam-os.org/deutsch-grundschule-4/";
export const ZAM_CELL_ID = "zam-academy:deutsch-grundschule-4";
export const lessonLink = (id: string): string =>
	`${ZAM_ACADEMY_APP_URL}#lesson=${encodeURIComponent(id)}`;

/** Read `#lesson=<id>&level=<1|2>` (or the same in the query string). */
export function parseDeepLink(
	hash: string,
	search = "",
): { lessonId?: string; level?: Level; view?: string } {
	const params = new URLSearchParams(
		[hash.replace(/^#/, ""), search.replace(/^\?/, "")]
			.filter(Boolean)
			.join("&"),
	);
	const lessonId = params.get("lesson")?.trim();
	const level = params.get("level");
	const view = params.get("view") ?? undefined;
	return {
		...(lessonId && /^[a-z0-9-]{1,64}$/.test(lessonId) ? { lessonId } : {}),
		...(level === "1" || level === "2" ? { level: Number(level) as Level } : {}),
		...(view ? { view } : {}),
	};
}
