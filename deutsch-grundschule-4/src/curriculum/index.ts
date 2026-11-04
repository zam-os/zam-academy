import cell from "../../cell.json";
import type { Lesson, ReadyLesson, Source, Stage } from "../types";
import { BAHNHOF } from "./bahnhof";
import { DETEKTIV } from "./detektiv";
import { LESEWERKSTATT } from "./lesewerkstatt";
import { WERKSTATT } from "./werkstatt";
import { WOERTERSCHATZ } from "./woerterschatz";

export const STAGES: Stage[] = [
	{
		id: "werkstatt",
		title: "Wörterwerkstatt",
		subtitle: "Wortarten, Fälle, Zeitformen und Wörter bauen",
		icon: "🔧",
		greeting: "Willkommen in meiner Werkstatt! Hier bauen, drehen und sortieren wir Wörter.",
	},
	{
		id: "bahnhof",
		title: "Satzbahnhof",
		subtitle: "Satzarten, wörtliche Rede und Satzglieder",
		icon: "🚂",
		greeting: "Alles einsteigen! Jeder Satz ist ein Zug, jedes Satzglied ein Waggon.",
	},
	{
		id: "detektiv",
		title: "Detektivbüro",
		subtitle: "Rechtschreib-Tricks: verlängern, ableiten, entlarven",
		icon: "🔍",
		greeting: "Psst, Detektivin oder Detektiv! Mit unseren Tricks findest du jede richtige Schreibung.",
	},
	{
		id: "woerterschatz",
		title: "Wörterschatz",
		subtitle: "Der Grundwortschatz: Wörter sicher schreiben und merken",
		icon: "💎",
		greeting: "Hier liegt mein Schatz: Wörter, die du immer wieder brauchst. Üben wir sie zusammen!",
	},
	{
		id: "lesewerkstatt",
		title: "Lesewerkstatt",
		subtitle: "Texte, Tabellen, Geschichten, Gedichte und Medien verstehen",
		icon: "📖",
		greeting: "Komm rein und nimm dir einen Text! Gemeinsam finden wir heraus, was in ihm steckt.",
	},
];

export const SOURCES: Source[] = [
	{
		id: "lehrplan",
		label: "LehrplanPLUS Bayern · Grundschule Deutsch 3/4",
		url: "https://www.lehrplanplus.bayern.de/fachlehrplan/grundschule/4/deutsch",
	},
	{
		id: "regelwerk",
		label: "Rat für deutsche Rechtschreibung · Amtliches Regelwerk",
		url: "https://www.rechtschreibrat.com/regeln-und-woerterverzeichnis/",
	},
	{
		id: "grundwortschatz",
		label: "ISB München · Grundwortschatz für die Jahrgangsstufen 3 und 4",
		url: "https://www.lehrplanplus.bayern.de/serviceinformation/l43316",
	},
];

// The quick check reuses the lesson's first tier-1 card. Card text lives
// only in cell.json; the lesson adds one more wrong answer and the feedback.
function ready(lesson: Lesson): ReadyLesson {
	const atom = cell.atoms.find((a) => a.slug === `gs4d-${lesson.id}`);
	const item = atom?.practice_items.find((i) => i.tier === "tier1_fast");
	const fast = item?.fast_check;
	if (!item || !fast || fast.options.length !== 2 || fast.correct_index !== 0)
		throw new Error(`Missing quick check card for ${lesson.id}`);
	return {
		...lesson,
		quiz: {
			question: item.question,
			answer: item.concept,
			wrong: [fast.options[1], lesson.check.wrong],
			explanation: lesson.check.explanation,
		},
	};
}

export const LESSONS: ReadyLesson[] = [...WERKSTATT, ...BAHNHOF, ...DETEKTIV, ...WOERTERSCHATZ, ...LESEWERKSTATT].map(ready);

export const findLesson = (id: string): ReadyLesson | undefined =>
	LESSONS.find((lesson) => lesson.id === id);

/** Stable answer order with different correct positions across lessons. */
export function quizOptions(lesson: ReadyLesson): string[] {
	const options = [lesson.quiz.answer, ...lesson.quiz.wrong];
	let seed = 2166136261;
	for (const character of lesson.id)
		seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
	const offset = seed % options.length;
	return [...options.slice(offset), ...options.slice(0, offset)];
}
