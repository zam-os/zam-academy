import { findLesson, LESSONS } from "./curriculum";
import { asLocale, type Locale } from "./i18n";
export const STORAGE_KEY = "zam_academy_algorithmen_v1";
export interface Progress {
	locale: Locale;
	draftsEn: Record<string, string>;
	completed: string[];
	quiz: string[];
	drafts: Record<string, string>;
}
export const freshProgress = (): Progress => ({
	locale: "de",
	draftsEn: {},
	completed: [],
	quiz: [],
	drafts: {},
});
export function parseProgress(raw: string | null): Progress {
	const clean = freshProgress();
	try {
		const data: unknown = JSON.parse(raw ?? "null");
		if (!data || typeof data !== "object") return clean;
		const x = data as Record<string, unknown>;
		clean.locale = asLocale(x.locale);
		for (const key of ["completed", "quiz"] as const)
			if (Array.isArray(x[key]))
				clean[key] = [
					...new Set(
						(x[key] as unknown[]).filter(
							(id): id is string => typeof id === "string" && !!findLesson(id),
						),
					),
				];

		for (const key of ["drafts", "draftsEn"] as const) {
			if (x[key] && typeof x[key] === "object")
				for (const lesson of LESSONS) {
					const value = (x[key] as Record<string, unknown>)[lesson.id];
					if (typeof value === "string" && value.length <= 20000)
						clean[key][lesson.id] = value;
				}
		}
	} catch {
		/* A damaged save should not prevent learning. */
	}
	return clean;
}
export const isComplete = (progress: Progress, id: string) =>
	progress.completed.includes(id) && progress.quiz.includes(id);

export const draftFor = (
	progress: Progress,
	locale: Locale,
	lessonId: string,
): string | undefined =>
	(locale === "en" ? progress.draftsEn : progress.drafts)[lessonId];
export function saveDraft(
	progress: Progress,
	locale: Locale,
	lessonId: string,
	code: string,
): void {
	if (findLesson(lessonId))
		(locale === "en" ? progress.draftsEn : progress.drafts)[lessonId] =
			code.slice(0, 20000);
}
/** Switch presentation language without rewriting either language's code or learning evidence. */
export function switchProgressLocale(
	progress: Progress,
	target: Locale,
	lessonId: string | null,
	currentCode?: string,
): Progress {
	const updated: Progress = {
		...progress,
		locale: target,
		drafts: { ...progress.drafts },
		draftsEn: { ...progress.draftsEn },
	};
	if (lessonId && currentCode !== undefined)
		saveDraft(updated, progress.locale, lessonId, currentCode);
	return updated;
}
