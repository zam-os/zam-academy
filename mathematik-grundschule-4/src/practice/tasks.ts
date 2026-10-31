import { digits, format, type Counts } from "../math/place-value";

export const LESSON_ID = "stellenwerte-buendeln";
export const CONTENT_VERSION = 1;
export const STEPS = [
	"welcome",
	"entry-read",
	"entry-bundle",
	"learn-a",
	"build-small",
	"build-large",
	"digit",
	"mission-a-end",
	"learn-b",
	"bundle",
	"exchange",
	"reason",
	"explain",
	"exit-read",
	"exit-zero",
	"exit-exchange",
	"finished",
] as const;
export type Step = (typeof STEPS)[number];
export type Family =
	| "read"
	| "build"
	| "digit"
	| "zero"
	| "bundle"
	| "exchange"
	| "reason";
export interface Task {
	family: Family;
	goal: "G1" | "G2" | "G3" | "G4";
	prompt: string;
	answer: number;
	model: Counts;
	hint: string;
	explanation: string;
	options?: { value: number; label: string }[];
	column?: number;
}

export function random(seed: number): () => number {
	let state = seed >>> 0;
	return () => {
		state = (state + 0x6d2b79f5) >>> 0;
		let value = Math.imul(state ^ (state >>> 15), state | 1);
		value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
		return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
	};
}

export function taskFor(
	step: Step | "later-read" | "later-zero" | "later-exchange",
	seed: number,
): Task | null {
	const rand = random(
		seed + [...step].reduce((n, c) => n + c.charCodeAt(0), 0),
	);
	const pick = (values: number[]) => values[Math.floor(rand() * values.length)];
	if (step === "entry-read" || step === "exit-read" || step === "later-read") {
		const answer =
			step === "entry-read"
				? pick([305, 402, 608])
				: (1 + Math.floor(rand() * 9)) * 1000 +
					(1 + Math.floor(rand() * 9)) * 10 +
					(1 + Math.floor(rand() * 9));
		return {
			family: "read",
			goal: "G2",
			prompt: "Welche Zahl zeigt die Stellenwerttafel?",
			answer,
			model: digits(answer),
			hint: "Lies von links nach rechts. Eine leere Stelle bleibt als Null erhalten.",
			explanation: `Die Tafel zeigt ${format(answer)}. Jede Spalte hat ihren eigenen Wert.`,
		};
	}
	if (step === "build-small" || step === "build-large") {
		const answer = step === "build-small" ? 306 : 2047;
		return {
			family: "build",
			goal: step === "build-small" ? "G3" : "G2",
			prompt: `Baue die Zahl ${format(answer)} in der Stellenwerttafel.`,
			answer,
			model: [0, 0, 0, 0],
			hint:
				step === "build-small"
					? "Du brauchst 3 Hunderter, keinen Zehner und 6 Einer."
					: "Du brauchst 2 Tausender, keinen Hunderter, 4 Zehner und 7 Einer.",
			explanation: `${format(answer)} besteht aus ${digits(answer)
				.map(
					(n, i) =>
						`${n} ${["Einern", "Zehnern", "Hundertern", "Tausendern"][i]}`,
				)
				.reverse()
				.join(", ")}.`,
		};
	}
	if (step === "digit") {
		const value = pick([3402, 5206, 7401]);
		const digit = digits(value)[2];
		return {
			family: "digit",
			goal: "G1",
			prompt: `Wie viel ist die Ziffer ${digit} an der Hunderterstelle in ${format(value)} wert?`,
			answer: digit * 100,
			model: digits(value),
			column: 2,
			hint: `Ein Hunderter ist 100 wert. Hier liegen ${digit} Hunderter.`,
			explanation: `${digit} Hunderter haben den Wert ${digit * 100}.`,
		};
	}
	if (step === "entry-bundle" || step === "bundle") {
		return {
			family: "bundle",
			goal: "G4",
			prompt: "Bündle die zehn Einer zu einem Zehner.",
			answer: 10,
			model: [10, 0, 0, 0],
			hint: "Wähle bei den Einern „10 bündeln“. Aus zehn Einern wird ein Zehner.",
			explanation:
				"10 Einer sind genauso viel wie 1 Zehner. Der Wert bleibt 10.",
		};
	}
	if (step === "exchange") {
		return {
			family: "exchange",
			goal: "G4",
			prompt:
				"Tausche einen Hunderter gegen zehn Zehner. Die Zahl bleibt gleich.",
			answer: 142,
			model: [2, 4, 1, 0],
			hint: "Wähle beim Hunderter „1 entbündeln“. Die vier Zehner bleiben liegen.",
			explanation:
				"Aus 1 Hunderter und 4 Zehnern werden 14 Zehner. Mit den 2 Einern bleibt der Wert 142.",
		};
	}
	if (step === "reason") {
		return {
			family: "reason",
			goal: "G4",
			prompt:
				"Warum bleiben 14 Zehner und 2 Einer genauso viel wie 1 Hunderter, 4 Zehner und 2 Einer?",
			answer: 1,
			model: [2, 14, 0, 0],
			options: [
				{
					value: 1,
					label: "Ein Hunderter und zehn Zehner haben denselben Wert.",
				},
				{ value: 0, label: "Mehr Stücke bedeuten immer eine größere Zahl." },
			],
			hint: "Vergleiche den Wert der Stücke, nicht ihre Anzahl.",
			explanation: "Die Bündel sehen anders aus. Ihr Gesamtwert bleibt gleich.",
		};
	}
	if (step === "exit-zero" || step === "later-zero") {
		const answer = pick([4060, 7030, 5080]);
		const model = digits(answer);
		return {
			family: "zero",
			goal: "G3",
			prompt: `${model[3]} Tausender, 0 Hunderter, ${model[1]} Zehner und 0 Einer: Welche Zahl ist das?`,
			answer,
			model,
			options: [
				{ value: answer, label: format(answer) },
				{ value: answer / 10, label: format(answer / 10) },
				{
					value: model[3] * 1000 + model[1],
					label: format(model[3] * 1000 + model[1]),
				},
			],
			hint: "Die Hunderter und die Einer bleiben als leere Spalten sichtbar.",
			explanation: `Die beiden leeren Stellen werden mit Null geschrieben: ${format(answer)}.`,
		};
	}
	if (step === "exit-exchange" || step === "later-exchange") {
		const h = pick([2, 3, 4]);
		const t = pick([11, 13, 15]);
		const e = pick([2, 5, 7]);
		return {
			family: "read",
			goal: "G4",
			prompt: "Wie viel sind diese Bündel zusammen wert?",
			answer: h * 100 + t * 10 + e,
			model: [e, t, h, 0],
			hint: `Rechne ${h} Hunderter und ${t} Zehner zusammen. Die Einer kommen dazu.`,
			explanation: `${h} Hunderter und ${t} Zehner sind ${h * 100 + t * 10}. Mit ${e} Einern sind es ${h * 100 + t * 10 + e}.`,
		};
	}
	return null;
}

export function orderedOptions(
	task: Task,
	seed: number,
): NonNullable<Task["options"]> {
	const options = [...(task.options ?? [])];
	const rand = random(seed);
	for (let i = options.length - 1; i > 0; i--) {
		const j = Math.floor(rand() * (i + 1));
		[options[i], options[j]] = [options[j], options[i]];
	}
	return options;
}

export function recallSeed(
	previous: number,
	candidate: () => number = () => crypto.getRandomValues(new Uint32Array(1))[0],
): number {
	const pairs = [
		["later-read", "exit-read"],
		["later-zero", "exit-zero"],
		["later-exchange", "exit-exchange"],
	] as const;
	for (let i = 0; i < 128; i++) {
		const next = candidate();
		if (
			pairs.every(
				([later, exit]) =>
					taskFor(later, next)?.answer !== taskFor(exit, previous)?.answer,
			)
		)
			return next;
	}
	throw new Error(
		"Neue Aufgaben sind gerade nicht verfügbar. Versuche es später noch einmal.",
	);
}
