import type { Language } from "./i18n";
import englishData from "./lessons.en.json";
import data from "./lessons.json";
export type Activity =
	| {
			kind: "choice";
			prompt: string;
			options: string[];
			correct: number;
			feedback: string;
	  }
	| {
			kind: "number";
			prompt: string;
			answer: number;
			unit: string;
			feedback: string;
	  }
	| { kind: "lab"; prompt: string; challenge: string };
export interface Lesson {
	id: string;
	stage: number;
	title: string;
	intro: string;
	paragraphs: string[];
	example: string;
	takeaway: string;
	quiz: {
		question: string;
		options: string[];
		correct: number;
		feedback: string;
	};
	activity: Activity;
	optional: boolean;
}
export const lessons = data as Lesson[];
export const stages = [
	"Netze bauen",
	"Adressen verstehen",
	"Daten auf die Reise schicken",
	"Fehler finden und sicher verbinden",
];
export const requiredLessons = lessons.filter((lesson) => !lesson.optional);
export function optionOrder(length: number, seed: string): number[] {
	let hash = [...seed].reduce(
		(n, char) => (n * 31 + char.charCodeAt(0)) >>> 0,
		7,
	);
	const indices = Array.from({ length }, (_, i) => i);
	for (let i = indices.length - 1; i > 0; i -= 1) {
		hash = (Math.imul(hash, 1664525) + 1013904223) >>> 0;
		const j = hash % (i + 1);
		[indices[i], indices[j]] = [indices[j], indices[i]];
	}
	return indices;
}
export function validLessonId(value: string | null | undefined): string {
	return lessons.some((lesson) => lesson.id === value) ? value! : lessons[0].id;
}
export const protocolReferences: Record<
	string,
	{ label: string; url: string }[]
> = {
	"net-dhcp": [
		{
			label: "DHCP · RFC 2131 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc2131.html",
		},
	],
	"net-dns": [
		{
			label: "DNS · RFC 1034 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc1034.html",
		},
	],
	"net-tcp-udp": [
		{
			label: "TCP · RFC 9293 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc9293.html",
		},
	],
	"net-http": [
		{
			label: "HTTP · RFC 9110 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc9110.html",
		},
	],
	"net-smtp": [
		{
			label: "SMTP · RFC 5321 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc5321.html",
		},
	],
	"net-https": [
		{
			label: "TLS 1.3 · RFC 8446 (englisch)",
			url: "https://www.rfc-editor.org/rfc/rfc8446.html",
		},
	],
};

export function getLessons(language: Language): Lesson[] {
	return language === "en" ? (englishData as Lesson[]) : lessons;
}
export function getStages(language: Language): string[] {
	return language === "en"
		? [
				"Build networks",
				"Understand addresses",
				"Send data on its journey",
				"Find faults and connect securely",
			]
		: stages;
}
