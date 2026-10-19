import type { AppLocale, DifficultyLevel } from "../i18n/translations";

/** Where this app is served; every ZAM card about it cites a lesson here. */
export const ZAM_ACADEMY_UML_URL = "https://academy.zam-os.org/uml/";

/** The ZAM cell that keeps what this app teaches (zam-os/zam). */
export const ZAM_UML_CELL_ID = "zam-academy:uml";
export const ZAM_UML_CELL_TITLE = "UML 2.5.1 (ZAM Academy)";

/**
 * The link a ZAM card cites for a lesson. Lesson ids are a public contract:
 * renaming one breaks every card that cites it.
 */
export function lessonLink(lessonId: string): string {
  return `${ZAM_ACADEMY_UML_URL}#lesson=${encodeURIComponent(lessonId)}`;
}

/** What the learner says to their agent in ZAM to take the cell. */
export function zamEnrolRequest(locale: AppLocale): string {
  return locale === "en"
    ? `Enrol me in the cell “${ZAM_UML_CELL_TITLE}”.`
    : `Nimm mich in die Zelle „${ZAM_UML_CELL_TITLE}“ auf.`;
}

export interface ParsedTrainingDeepLink {
  lessonId?: string;
  level?: DifficultyLevel;
  locale?: AppLocale;
}

/**
 * Reads `#lesson=<lesson id>` (as ZAM cards cite it), optionally with
 * `level=1|2` and `lang=de|en`, from the URL hash or query. The caller checks
 * that the lesson exists.
 */
export function parseTrainingDeepLink(
  hash: string,
  search = "",
): ParsedTrainingDeepLink {
  const result: ParsedTrainingDeepLink = {};
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

  const rawLang = (params.get("lang") ?? params.get("locale"))
    ?.trim()
    .toLowerCase();
  if (rawLang === "de" || rawLang === "en") {
    result.locale = rawLang;
  }

  return result;
}
