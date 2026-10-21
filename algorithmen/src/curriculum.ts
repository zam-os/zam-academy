import { type RunResult, runProgram, type Value } from "./engine";
import { type Locale, localeFromHash } from "./i18n";
import englishLessons from "./lessons.en.json";
import lessons from "./lessons.json";
export interface Case {
	inputs: Value[];
	expected: string[];
}
export interface Lesson {
	id: string;
	stage: number;
	title: string;
	goal: string;
	paragraphs: string[];
	model: string[];
	task: string;
	starter: string;
	solution: string;
	hint: string;
	tests: Case[];
	question: string;
	options: string[];
	correct: number;
	explanation: string;
}
export const LESSONS = lessons as Lesson[];
export const EN_LESSONS = englishLessons as Lesson[];
export const lessonsForLocale = (locale: Locale): Lesson[] =>
	locale === "en" ? EN_LESSONS : LESSONS;
export const STAGES = [
	"Abläufe und Werte",
	"Entscheidungen und Schleifen",
	"Felder und Funktionen",
	"Prüfen und verbessern",
];
export const SOURCES = [
	{
		title: "LehrplanPLUS Bayern · Informationstechnologie · Modul 2.6.1",
		url: "https://www.lehrplanplus.bayern.de/fachlehrplan/realschule/9/it",
	},
	{
		title: "ECMA-262 · Sprachstandard JavaScript (ECMAScript)",
		url: "https://tc39.es/ecma262/",
	},
];
export const findLesson = (id: string, locale: Locale = "de") =>
	lessonsForLocale(locale).find((lesson) => lesson.id === id);
export const lessonLink = (id: string) =>
	`https://academy.zam-os.org/algorithmen/#lesson=${encodeURIComponent(id)}`;
export function lessonFromHash(
	hash: string,
	locale: Locale = localeFromHash(hash),
): Lesson | undefined {
	const id = new URLSearchParams(hash.replace(/^#/, "")).get("lesson");
	return id ? findLesson(id, locale) : undefined;
}
export function checkCode(
	lesson: Lesson,
	code: string,
	locale: Locale = "de",
): { passed: boolean; results: RunResult[] } {
	const results = lesson.tests.map((test) =>
		runProgram(code, test.inputs, 1200, locale),
	);
	return {
		passed: results.every(
			(result, i) =>
				result.ok &&
				JSON.stringify(result.output) ===
					JSON.stringify(lesson.tests[i].expected),
		),
		results,
	};
}
