import type { DifficultyLevel } from "../model/types";

/** Links back to the learning path from every card of the ZAM cell. */

export const ACADEMY_BASE_URL =
  "https://academy.zam-os.org/mathematik-gymnasium-7/";

export const ZAM_CELL_ID = "zam-academy:mathematik-gymnasium-7";
export const ZAM_CELL_TITLE = "Mathematik 7 Gymnasium (ZAM Academy)";

export function lessonLink(lessonId: string): string {
  return `${ACADEMY_BASE_URL}#lesson=${encodeURIComponent(lessonId)}`;
}

export function zamEnrolRequest(): string {
  return `Bitte nimm das Paket „${ZAM_CELL_TITLE}“ (${ZAM_CELL_ID}) in mein ZAM auf.`;
}

export interface TrainingDeepLink {
  lessonId?: string;
  level?: DifficultyLevel;
}

/**
 * Reads `#lesson=<id>` and optional `&level=1|2` from a URL hash or query.
 * The caller validates that `lessonId` is an existing lesson.
 */
export function parseTrainingDeepLink(
  hash: string,
  search = "",
): TrainingDeepLink {
  const result: TrainingDeepLink = {};
  const cleanHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const cleanSearch = search.startsWith("?") ? search.slice(1) : search;
  const combined = [cleanSearch, cleanHash].filter(Boolean).join("&");
  if (!combined) return result;

  const params = new URLSearchParams(combined);
  const rawLesson = params.get("lesson")?.trim();
  if (rawLesson && /^[a-z0-9-]{1,64}$/.test(rawLesson)) {
    result.lessonId = rawLesson;
  }
  const rawLevel = params.get("level")?.trim();
  if (rawLevel === "1" || rawLevel === "2") {
    result.level = Number(rawLevel) as DifficultyLevel;
  }
  return result;
}
