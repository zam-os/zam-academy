import {
	digits,
	describe,
	format,
	total,
	WEIGHTS,
	NAMES,
	LETTERS,
	type Counts,
	type Column,
} from "../math/place-value";

export const LESSON_ID = "stellenwerte-buendeln";
export const REQUIRED_CORRECT = 3;
export const STEPS = [
	"welcome",
	"entry-read",
	"entry-bundle",
	"learn-a",
	"build-small",
	"build-large",
	"digit",
	"practice-a",
	"mission-a-end",
	"learn-b",
	"bundle",
	"exchange",
	"reason",
	"explain",
	"practice-b",
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
	target?: Counts;
	numeral?: number;
	level?: 1 | 2;
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
function generator(seed: number) {
	const rand = random(seed);
	const int = (low: number, high: number) =>
		low + Math.floor(rand() * (high - low + 1));
	// Zeros rotate across all non-leading positions, rather than one learned pattern.
	const number = (places: number, zero = false) => {
		const d = digits(0);
		for (let i = 0; i < places; i++) d[i] = int(i === places - 1 ? 1 : 0, 9);
		if (zero) d[int(0, places - 2)] = 0;
		return total(d);
	};
	return { int, number };
}
function readTask(answer: number, zero = false): Task {
	return {
		family: zero ? "zero" : "read",
		goal: zero ? "G3" : "G2",
		prompt: zero
			? "Welche Zahl zeigen die Bündel? Achte auf die leeren Stellen."
			: "Welche Zahl zeigen die Bündel in der Stellenwerttafel?",
		answer,
		model: digits(answer),
		hint: "Zähle die Bündel in jeder Spalte. Schreibe auch für jede leere Stelle zwischen den Ziffern eine Null.",
		explanation: `${describe(digits(answer))} ergeben ${format(answer)}. Eine leere Stelle wird mit 0 geschrieben.`,
	};
}
function buildTask(answer: number): Task {
	return {
		family: "build",
		goal: String(answer).includes("0") ? "G3" : "G2",
		prompt: `Baue ${format(answer)} mit höchstens 9 Bündeln je Stelle.`,
		answer,
		model: digits(0),
		hint: `Zerlege die Zahl in Stellen: ${describe(digits(answer))}.`,
		explanation: `${format(answer)} besteht aus ${describe(digits(answer))}. Die Spalten bleiben in ihrer Reihenfolge.`,
	};
}
function exchangeTask(
	seed: number,
	direction: "bundle" | "unbundle",
	entry = false,
): Task {
	const { int } = generator(seed);
	const column = (
		entry ? 0 : direction === "unbundle" ? int(1, 5) : int(0, 4)
	) as Column;
	const model = digits(0);
	// Two eligible places make the choice of exchange meaningful.
	model[column] = direction === "bundle" ? int(10, 18) : int(1, 4);
	model[direction === "bundle" ? (column + 2) % 5 : (column % 5) + 1] +=
		direction === "bundle" ? int(10, 15) : int(1, 8);
	const target = [...model];
	if (direction === "bundle") {
		target[column] -= 10;
		target[column + 1] += 1;
	} else {
		target[column] -= 1;
		target[column - 1] += 10;
	}
	return {
		family: direction === "bundle" ? "bundle" : "exchange",
		goal: "G4",
		prompt:
			direction === "bundle"
				? `Bündle genau 10 ${NAMES[column]} zur nächstgrößeren Einheit. Lass die anderen Bündel liegen.`
				: `Entbündle genau 1 ${NAMES[column]} in die nächstkleinere Einheit. Lass die anderen Bündel liegen.`,
		answer: total(model),
		model,
		target,
		column,
		hint:
			direction === "bundle"
				? `10 ${LETTERS[column]} haben denselben Wert wie 1 ${LETTERS[column + 1]}.`
				: `1 ${LETTERS[column]} hat denselben Wert wie 10 ${LETTERS[column - 1]}.`,
		explanation: `${describe(model)} und ${describe(target)} haben denselben Wert: ${format(total(model))}. Nur die Bündelung ändert sich.`,
	};
}
export function taskFor(
	step: Step | "later-read" | "later-zero" | "later-exchange",
	seed: number,
): Task | null {
	const code = [...step].reduce(
		(n, c) => Math.imul(n, 31) + c.charCodeAt(0),
		0,
	);
	const { int, number } = generator(seed + code);
	if (
		[
			"entry-read",
			"exit-read",
			"later-read",
			"exit-zero",
			"later-zero",
		].includes(step)
	)
		return readTask(
			number(
				step === "entry-read" ? 3 : int(4, 6),
				step.includes("zero") || step === "entry-read",
			),
			step.includes("zero"),
		);
	if (step === "build-small" || step === "build-large")
		return buildTask(number(step === "build-small" ? 3 : int(4, 6), true));
	if (step === "digit") {
		const numeral = number(int(4, 6));
		const positions = digits(numeral)
			.map((n, i) => (n ? i : -1))
			.filter((i) => i >= 0);
		const column = positions[int(0, positions.length - 1)];
		const digit = digits(numeral)[column];
		return {
			family: "digit",
			goal: "G1",
			prompt: "Welchen Wert hat die markierte Ziffer?",
			answer: digit * WEIGHTS[column],
			numeral,
			column,
			model: digits(numeral),
			hint: `Zähle die Stellen von rechts: E, Z, H, T, ZT, HT. Die markierte Ziffer steht bei ${NAMES[column]}.`,
			explanation: `${digit} ${NAMES[column]} ${digit === 1 ? "hat" : "haben"} den Wert ${format(digit * WEIGHTS[column])}.`,
		};
	}
	if (step === "entry-bundle" || step === "bundle")
		return exchangeTask(seed + code, "bundle", step === "entry-bundle");
	if (step === "exchange") return exchangeTask(seed + code, "unbundle");
	if (step === "reason") {
		const column = int(1, 5);
		const count = int(1, 8);
		const upper = LETTERS[column],
			lower = LETTERS[column - 1];
		const model = digits(0);
		model[column - 1] = count * 10;
		return {
			family: "reason",
			goal: "G4",
			prompt: `Milo tauscht ${count} ${upper} gegen ${count * 10} ${lower}. Warum bleibt der Wert gleich?`,
			answer: 1,
			model,
			options: [
				{
					value: 1,
					label: `1 ${upper} ist genauso viel wie 10 ${lower}. Beim Tauschen bleibt der Wert gleich.`,
				},
				{ value: 0, label: `1 ${upper} ist genauso viel wie 100 ${lower}.` },
				{
					value: 2,
					label: "Beim Entbündeln wird der Wert zehnmal so groß wie vorher.",
				},
			],
			hint: `Vergleiche den Wert von 1 ${upper} mit dem Wert von 10 ${lower}.`,
			explanation: `${count} ${upper} und ${count * 10} ${lower} haben denselben Wert: ${format(total(model))}. Die Anzahl der Stücke ändert sich, ihr Gesamtwert bleibt gleich.`,
		};
	}
	if (step === "exit-exchange" || step === "later-exchange") {
		const column = int(1, 3);
		const model = digits(number(5));
		model[column] = int(11, 18);
		return {
			family: "exchange",
			goal: "G4",
			prompt:
				"Milo hat mehr als 9 Bündel in einer Spalte. Welche Zahl ist dargestellt?",
			answer: total(model),
			model,
			hint: `10 ${LETTERS[column]} sind 1 ${LETTERS[column + 1]}. Bündle im Kopf und beachte die anderen Spalten.`,
			explanation: `${describe(model)} ergeben ${format(total(model))}. Zehn gleichartige Bündel werden zu einem Bündel der nächstgrößeren Einheit.`,
		};
	}
	return null;
}
/** Guided representation practice and transfer with noncanonical bundles are different generators. */
export function practiceTask(level: 1 | 2, seed: number, index: number): Task {
	const taskSeed = (seed + Math.imul(index + 1, 2654435761)) >>> 0;
	let task: Task | null;
	if (level === 1)
		task = taskFor(
			index % 3 === 0 ? "exit-read" : index % 3 === 1 ? "build-large" : "digit",
			taskSeed,
		);
	else
		task = taskFor(
			index % 3 === 0
				? "exit-exchange"
				: index % 3 === 1
					? "bundle"
					: "exchange",
			taskSeed,
		);
	if (!task) throw new Error("Die nächste Aufgabe fehlt.");
	return { ...task, level };
}
export function correctTask(
	task: Task,
	input: number | null,
	workspace: Counts,
): boolean {
	if (task.family === "build")
		return digits(task.answer).every((n, i) => n === (workspace[i] ?? 0));
	if (task.target)
		return task.target.every((n, i) => n === (workspace[i] ?? 0));
	return input === task.answer;
}
export function mistakeHint(
	task: Task,
	input: number | null,
	workspace: Counts,
): string {
	if (task.family === "build") {
		const expected = digits(task.answer);
		const shifted = expected.findIndex((n, i) => n !== (workspace[i] ?? 0));
		return `Prüfe die Spalte ${NAMES[Math.max(0, shifted)]}. Jede Ziffer gehört an ihre eigene Stelle. Leere Stellen brauchen 0 Bündel.`;
	}
	if (task.target)
		return "Prüfe, welche Einheit du tauschen sollst. Der Gesamtwert allein reicht nicht: Auch die geforderte Bündelung muss stimmen.";
	if (input === null)
		return "Schreibe eine ganze Zahl von 0 bis 1 000 000. Tausender kannst du mit Leerzeichen gliedern, zum Beispiel 30 407.";
	if (task.family === "digit")
		return "Gesucht ist der Wert der Ziffer, nicht nur die Ziffer selbst. Ein Bündel links ist zehnmal so viel wert wie eines rechts daneben.";
	if (
		String(task.answer).includes("0") &&
		input === Number(String(task.answer).replaceAll("0", ""))
	)
		return "Du hast leere Stellen übersprungen. Die Null hält ihren Platz frei: Einer bleiben rechts, Zehner daneben und Hunderter an der dritten Stelle.";
	if (task.family === "exchange") {
		const column = task.model.findIndex((count) => count >= 10);
		if (column >= 0) {
			const count = task.model[column];
			const concatenated = Number([...task.model].reverse().join(""));
			if (input === concatenated) {
				const remainder = count % 10;
				return `Schreibe Bündelzahlen nicht einfach nebeneinander. ${count} ${LETTERS[column]} sind ${Math.floor(count / 10)} ${LETTERS[column + 1]}${remainder ? ` und ${remainder} ${LETTERS[column]}` : ""}. Rechne erst den Wert jeder Spalte aus.`;
			}
			return `Prüfe die ${NAMES[column]}: Ein Bündel dort ist ${format(WEIGHTS[column])} wert. Addiere die Werte aller Spalten.`;
		}
	}
	if (task.family === "reason") return task.hint;
	return "Lies die Spalten von rechts: E, Z, H, T, ZT, HT. Prüfe besonders die Nullstellen und die Größe jedes Bündels.";
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
