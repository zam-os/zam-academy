import { finalTask, finalLab, finalExit } from "./data-and-expeditions";
import { isFinalLesson } from "./worlds";
import { experimentMistake } from "./data-model";
import { geometryMistake } from "./geometry-model";
import { shapeTask, shapeLab, shapeExit } from "./geometry";
import { isShape } from "./worlds";
import { measureTask, measureLab, measureExit } from "./measurement";
import { isMeasure } from "./worlds";
import { acceptsWorkshop, type Scene, type Workshop } from "./workshop";
import { format, parseInteger } from "../math/place-value";
import { random } from "../practice/tasks";
import { arithmeticLab, arithmeticTask, isArithmetic } from "./arithmetic";
import type { ExtraLessonId } from "./catalog";
import {
	type CombinationModel,
	combinationExit,
	combinationLab,
	combinationMistake,
	combinationTask,
} from "./combinations";
import { divisorLab, divisorTask } from "./divisors";
import {
	type Investigation,
	investigationExit,
	investigationMistake,
	isInvestigation,
	patternLab,
	patternTask,
	storyLab,
	storyTask,
} from "./investigations";
import {
	writtenExit,
	writtenLab,
	writtenMistake,
	writtenTask,
} from "./written-addition";
import {
	type Algorithm,
	algorithmExit,
	algorithmLab,
	algorithmMistake,
	algorithmTask,
	isWrittenAlgorithm,
} from "./written-algorithms";
import {
	subtractionExit,
	subtractionLab,
	subtractionMistake,
	subtractionTask,
} from "./written-subtraction";
export type Answer = number | number[];
export type ForestTask = {
	kind:
		| "number"
		| "choice"
		| "order"
		| "parts"
		| "line"
		| "split"
		| "hops"
		| "groups"
		| "columns"
		| "subtraction"
		| "algorithm"
		| "investigation"
		| "combinations"
		| "divisors"
		| "model";
	model?: Workshop;
	variantSeed?: number;
	toolViews?: { label: string; scene: Scene }[];
	scene?: Scene;
	goal: 1 | 2 | 3;
	prompt: string;
	answer: Answer;
	hint: string;
	explanation: string;
	choices?: { value: number; label: string }[];
	numbers?: number[];
	line?: { start: number; step: number; marker: number };
	whole?: number;
	calculation?: { a: number; b: number; op: "+" | "−" | "·" | ":" };
	hops?: { start: number; unit: number; direction: 1 | -1 };
	groups?: { each: number };
	columns?: { a: number; b: number; shown?: number };
	subtraction?: { a: number; b: number; shown?: number };
	algorithm?: Algorithm;
	investigation?: Investigation;
	combination?: CombinationModel;
	divisorTotal?: number;
	inverseProbe?: boolean;
};
const equal = (a: number[], b: number[]) =>
	a.length === b.length && a.every((n, i) => n === b[i]);
export function answerText(answer: Answer): string {
	return Array.isArray(answer) ? answer.map(format).join("; ") : format(answer);
}
export function correctForest(
	task: ForestTask,
	answer: Answer | null,
): boolean {
	if (task.model)
		return Array.isArray(answer) && acceptsWorkshop(task.model, answer);
	if (Array.isArray(task.answer)) {
		if (!Array.isArray(answer)) return false;
		return task.kind === "parts" ||
			task.kind === "divisors" ||
			task.kind === "combinations"
			? equal(
					[...task.answer].sort((a, b) => a - b),
					[...answer].sort((a, b) => a - b),
				)
			: equal(task.answer, answer);
	}
	return answer === task.answer;
}
export function forestInput(text: string): number | null {
	return parseInteger(text);
}
function rng(seed: number) {
	const next = random(seed);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const shuffle = <T>(items: T[]): T[] => {
		const result = [...items];
		for (let i = result.length - 1; i > 0; i--) {
			const j = int(0, i);
			[result[i], result[j]] = [result[j], result[i]];
		}
		return result;
	};
	return { int, shuffle };
}
export function comparisonExplanation(a: number, b: number): string {
	if (a === b)
		return `${format(a)} und ${format(b)} sind gleich groß. Das Zeichen = passt.`;
	const relation = a < b ? "kleiner" : "größer";
	if (String(a).length !== String(b).length)
		return `${format(a)} ist ${relation} als ${format(b)}. Vergleiche zuerst die Anzahl der Stellen; die Zahl mit mehr Stellen ist größer.`;
	const names = [
		"Einerstelle",
		"Zehnerstelle",
		"Hunderterstelle",
		"Tausenderstelle",
		"Zehntausenderstelle",
		"Hunderttausenderstelle",
		"Millionenstelle",
	];
	const left = String(a),
		right = String(b),
		index = [...left].findIndex((digit, i) => digit !== right[i]);
	return `${format(a)} ist ${relation} als ${format(b)}. Von links entscheidet zuerst die ${names[left.length - index - 1]}: ${left[index]} ist ${relation} als ${right[index]}.`;
}
function compare(a: number, b: number, context = false): ForestTask {
	return {
		kind: "choice",
		goal: 1,
		prompt: context
			? `Zwei Inselwege sind mit ${format(a)} und ${format(b)} Schritten beschrieben. Welches Zeichen gehört zwischen die beiden Schrittzahlen?`
			: `Welches Zeichen passt? ${format(a)} □ ${format(b)}`,
		numbers: [a, b],
		answer: Math.sign(a - b),
		choices: [
			{ value: -1, label: "< ist kleiner als" },
			{ value: 0, label: "= ist gleich" },
			{ value: 1, label: "> ist größer als" },
		],
		hint: "Vergleiche die Stellenzahl und dann die Ziffern von links. Die offene Seite des Zeichens zeigt zur größeren Zahl.",
		explanation: comparisonExplanation(a, b),
	};
}
function ordered(numbers: number[]): ForestTask {
	const answer = [...numbers].sort((a, b) => a - b);
	return {
		kind: "order",
		goal: 3,
		prompt:
			"Ordne die Zahlen aufsteigend. Tippe zuerst die kleinste Zahl an, dann die nächste.",
		numbers,
		answer,
		hint: "Vergleiche zuerst die Stellenzahl, dann von links. Du kannst deine Auswahl zurücknehmen.",
		explanation: `Von klein nach groß: ${answer.map(format).join(" < ")}. Vergleiche bei ähnlichen Zahlen die erste unterschiedliche Stelle.`,
	};
}
export function forestTask(
	id: ExtraLessonId,
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	if (isFinalLesson(id)) return finalTask(id, level, seed, index);
	if (isShape(id)) return shapeTask(id, level, seed, index);
	if (isMeasure(id)) return measureTask(id, level, seed, index);
	if (id === "systematisch-kombinieren")
		return combinationTask(level, seed, index);
	if (id === "teiler-vielfache") return divisorTask(level, seed, index);
	if (id === "muster-zahlbeziehungen") return patternTask(level, seed, index);
	if (id === "sachaufgaben-mehrschrittig") return storyTask(level, seed, index);
	if (isWrittenAlgorithm(id)) return algorithmTask(id, level, seed, index);
	if (id === "schriftlich-subtrahieren")
		return subtractionTask(level, seed, index);
	if (id === "schriftlich-addieren") return writtenTask(level, seed, index);
	if (isArithmetic(id)) return arithmeticTask(id, level, seed, index);
	const { int, shuffle } = rng(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	if (id === "zahlen-vergleichen-ordnen") {
		if (level === 2 && index % 3 === 1) {
			const base = int(1, 8) * 100000,
				digit = int(1, 8);
			return ordered(
				shuffle([
					base + digit * 1000 + digit,
					base + digit * 100 + digit * 10,
					base + digit * 1000 + digit * 10,
				]),
			);
		}
		const size = level === 1 ? [1000, 10000, 100000][index % 3] : 100000;
		const a = int(size, Math.min(size * 9, 999999));
		const mode = rng((seed + level * 32452843) >>> 0).shuffle([0, 1, 2])[
			index % 3
		];
		let b =
			mode === 0
				? a
				: mode === 1
					? Math.min(1000000, a + int(1, 9) * 10 ** int(0, 2))
					: Math.max(0, a - int(1, 9) * 10 ** int(0, 2));
		if (level === 2 && index % 3 === 2 && a === b) b = a + int(1, 9);
		const task = compare(a, b, level === 2);
		if (level === 2 && index % 3 === 2) {
			const bigger = Math.max(a, b),
				smaller = Math.min(a, b);
			task.prompt = `Milo sagt: „${format(bigger)} ist größer als ${format(smaller)}.“ Welche Begründung passt?`;
			task.answer = 1;
			task.goal = 2;
			task.numbers = [bigger, smaller];
			task.explanation = comparisonExplanation(bigger, smaller);
			task.choices = shuffle([
				{ value: 1, label: comparisonExplanation(bigger, smaller) },
				{
					value: 2,
					label:
						"Die Einerstelle allein entscheidet immer, auch wenn links verschiedene Ziffern stehen.",
				},
				{ value: 3, label: "Die Zahl mit mehr Nullen ist immer größer." },
			]);
		}
		return task;
	}
	if (id === "zahlenstrahl-zahlenspruenge") {
		const step = [100, 1000, 10000][int(0, 2)];
		const start =
			int(0, Math.floor((1000000 - 10 * step) / (10 * step))) * 10 * step;
		const marker = int(1, 9);
		const line = { start, step, marker };
		if (level === 1)
			return {
				kind: "number",
				goal: 2,
				prompt: "Welche Zahl liegt an Milos markiertem Strich?",
				line,
				answer: start + marker * step,
				hint: "Zähle die zehn Abschnitte zwischen den Endzahlen. Teile deren Unterschied durch zehn und zähle vom linken Ende aus.",
				explanation: `Ein Schritt ist ${format(step)} groß. ${format(start)} + ${marker} · ${format(step)} = ${format(start + marker * step)}.`,
			};
		if (index % 3 === 0)
			return {
				kind: "number",
				goal: 1,
				prompt:
					"Zwischen den beschrifteten Enden liegen zehn gleich große Abschnitte. Wie groß ist ein Schritt?",
				line: { ...line, marker: -1 },
				answer: step,
				hint: "Berechne die Differenz der Endzahlen. Teile sie durch die Anzahl der Abschnitte, nicht durch die Anzahl der Striche.",
				explanation: `(${format(start + 10 * step)} − ${format(start)}) : 10 = ${format(step)}. Zehn gleich große Schritte ergeben den ganzen Abstand.`,
			};
		const direction = index % 3 === 1 ? 1 : -1;
		const begin = direction === 1 ? int(1, 5) : int(5, 9);
		const jumps = int(2, Math.min(4, direction === 1 ? 10 - begin : begin));
		const answer = start + (begin + direction * jumps) * step;
		return {
			kind: "number",
			goal: 3,
			prompt: `Milo startet bei ${format(start + begin * step)}. Er springt ${jumps} Abschnitte nach ${direction === 1 ? "rechts" : "links"}. Bei welcher Zahl landet er?`,
			line: { ...line, marker: begin },
			answer,
			hint: `Bestimme zuerst die Schrittweite. Nach ${direction === 1 ? "rechts addierst" : "links subtrahierst"} du für jeden Sprung dieselbe Schrittweite.`,
			explanation: `Ein Schritt ist ${format(step)} groß. ${format(start + begin * step)} ${direction === 1 ? "+" : "−"} ${jumps} · ${format(step)} = ${format(answer)}.`,
		};
	}
	if (level === 2 && index % 3 === 1) {
		const places = shuffle([0, 1, 2, 3, 4, 5]).slice(0, 3);
		const parts = places.map((place) => int(1, 8) * 10 ** place);
		const whole = parts.reduce((sum, n) => sum + n, 0);
		const distractors = [parts[0] * 10, parts[1] * 10].filter(
			(n) => n <= 1000000 && !parts.includes(n),
		);
		while (distractors.length < 2) {
			const n = int(1, 9) * 10 ** int(0, 5);
			if (!parts.includes(n) && !distractors.includes(n)) distractors.push(n);
		}
		return {
			kind: "parts",
			goal: 1,
			prompt: `Wähle genau die drei Stellenwertteile für ${format(whole)}.`,
			numbers: shuffle([...parts, ...distractors.slice(0, 2)]),
			answer: parts,
			hint: "Jede Ziffer hat ihren eigenen Stellenwert. Leere Stellen brauchst du nicht als Teil hinzuzufügen. Wähle drei Teile.",
			explanation: `${format(whole)} = ${[...parts]
				.sort((a, b) => b - a)
				.map(format)
				.join(" + ")}. Addiere die Werte der besetzten Stellen.`,
		};
	}
	const whole =
		level === 1
			? [1000, 10000, 100000, 1000000][index % 4]
			: [100000, 1000000][index % 2];
	const unit = level === 1 ? whole / 100 : whole / 1000;
	const part = int(12, level === 1 ? 89 : 899) * unit;
	const answer = whole - part;
	return {
		kind: "number",
		goal: 2,
		prompt:
			level === 1
				? `Ergänze den fehlenden Teil: ${format(part)} + □ = ${format(whole)}.`
				: `Milos Ziel sind ${format(whole)} gesammelte Blätter. Er hat ${format(part)}. Wie viele fehlen noch?`,
		whole,
		numbers: [part],
		answer,
		hint: "Ergänze vom bekannten Teil zum Ziel oder rechne ganze Zahl minus bekannter Teil. Prüfe anschließend durch Addieren.",
		explanation: `${format(whole)} − ${format(part)} = ${format(answer)}. Die Probe: ${format(part)} + ${format(answer)} = ${format(whole)}.`,
	};
}
export function forestLab(id: ExtraLessonId, goal: number): ForestTask {
	if (isFinalLesson(id)) return finalLab(id, goal);
	if (isShape(id)) return shapeLab(id, goal);
	if (isMeasure(id)) return measureLab(id, goal);
	if (id === "systematisch-kombinieren") return combinationLab(goal);
	if (id === "teiler-vielfache") return divisorLab(goal);
	if (id === "muster-zahlbeziehungen") return patternLab(goal);
	if (id === "sachaufgaben-mehrschrittig") return storyLab(goal);
	if (isWrittenAlgorithm(id)) return algorithmLab(id, goal);
	if (id === "schriftlich-subtrahieren") return subtractionLab(goal);
	if (id === "schriftlich-addieren") return writtenLab(goal);
	if (isArithmetic(id)) return arithmeticLab(id, goal);
	if (id === "zahlen-vergleichen-ordnen")
		return goal === 2
			? ordered([80080, 8800, 80008])
			: {
					...compare(goal === 0 ? 99999 : 507030, goal === 0 ? 100000 : 507003),
					goal: (goal + 1) as 1 | 2 | 3,
				};
	if (id === "zahlenstrahl-zahlenspruenge") {
		const start = [0, 200000, 900000][goal],
			step = [1000, 10000, 10000][goal],
			target = [4, 7, 10][goal];
		return {
			kind: "line",
			goal: (goal + 1) as 1 | 2 | 3,
			line: { start, step, marker: 0 },
			answer: target,
			prompt: `Setze Milos Blatt auf ${format(start + target * step)}. Verschiebe es mit dem Regler oder den Pfeiltasten.`,
			hint: "Links steht die Startzahl. Jeder Abschnitt ist gleich groß. Nutze die Endzahlen, um die Schrittweite zu bestimmen.",
			explanation: `${target} Schritte zu je ${format(step)} führen von ${format(start)} zu ${format(start + target * step)}.`,
		};
	}
	const whole = [1000, 100000, 1000000][goal],
		target = [3, 7, 4][goal];
	return {
		kind: "split",
		goal: (goal + 1) as 1 | 2 | 3,
		whole,
		answer: target,
		prompt: `Verteile ${format(whole)} so, dass die linke Truhe ${format((whole * target) / 10)} enthält. Was bleibt rechts?`,
		hint: "Verschiebe die Aufteilung. Die beiden Teile zusammen bleiben immer gleich groß.",
		explanation: `${format((whole * target) / 10)} + ${format((whole * (10 - target)) / 10)} = ${format(whole)}. Ein größerer linker Teil macht den rechten um genau denselben Betrag kleiner.`,
	};
}
export function forestMistake(task: ForestTask, answer: Answer | null): string {
	if (task.model?.scene.experiment)
		return Array.isArray(answer)
			? experimentMistake(task.model, answer)
			: task.hint;
	if (task.model?.scene.chart)
		return "Prüfe jede Kategorie und die Skala. Jede Beobachtung zählt genau einmal; ein größerer Skalenschritt ist nicht dasselbe wie ein Stück.";
	if (task.model?.scene.geometry)
		return Array.isArray(answer)
			? geometryMistake(task.model, answer)
			: task.hint;
	if (task.model) return task.hint;
	if (task.combination) return combinationMistake(task.combination, answer);
	if (task.divisorTotal)
		return "Prüfe jede angebotene Zahl. Nur eine Division mit Rest 0 passt. Vergiss die 1 nicht; sie teilt jede positive ganze Zahl ohne Rest.";
	if (task.investigation)
		return investigationMistake(task.investigation, answer);
	if (task.algorithm)
		return algorithmMistake(task, Array.isArray(answer) ? answer : null);
	if (task.kind === "subtraction")
		return subtractionMistake(task, Array.isArray(answer) ? answer : null);
	if (task.kind === "columns")
		return writtenMistake(task, Array.isArray(answer) ? answer : null);
	if (answer === null)
		return "Gib eine ganze Zahl von 0 bis 1 000 000 ein. Zum Beispiel: 1000, 1 000 oder 1.000.";
	if (task.kind === "hops" || task.kind === "groups") return task.hint;
	if (task.inverseProbe) return task.hint;
	if (task.calculation && typeof answer === "number") {
		const { a, b, op } = task.calculation;
		if (op === "−" && answer === a + b)
			return "Gesucht ist die Differenz. Ziehe ab oder ergänze vom kleineren zum größeren Wert. Prüfe durch Addieren.";
		if (op === "+" && answer === Math.abs(a - b))
			return "Gesucht ist die Summe. Zähle die beiden Mengen zusammen, statt ihren Unterschied zu bestimmen.";
		if (op === "·" && answer === a + b)
			return "Du hast die beiden Zahlen addiert. Hier gibt es gleich große Gruppen: Nimm die Anzahl der Gruppen mal den Inhalt einer Gruppe.";
		if (op === ":" && answer === a - b)
			return "Gleichmäßig teilen ist mehr als einmal abziehen. Welche Zahl ergibt mit dem Teiler multipliziert die ganze Menge?";
		if (
			(op === "·" || op === ":") &&
			(answer === Number(task.answer) / 10 ||
				answer === Number(task.answer) * 10)
		)
			return "Prüfe die Bündelgröße: Sind es Einer, Zehner, Hunderter oder Tausender? Nutze anschließend die Umkehraufgabe.";
	}
	if (task.kind === "choice") return task.hint;
	if (task.kind === "order")
		return "Beginne mit der kleinsten Zahl. Vergleiche von links und prüfe die Nullstellen. Du kannst die Auswahl zurücknehmen.";
	if (task.kind === "parts")
		return "Prüfe die Stellenwerte deiner drei Teile. Eine 4 bei den Tausendern bedeutet 4 000, nicht 40 000.";
	if (task.line && typeof answer === "number") {
		if (
			task.goal === 2 &&
			task.line.start > 0 &&
			answer === task.line.step * task.line.marker
		)
			return "Du hast die Startzahl nicht mitgezählt. Der Ausschnitt beginnt nicht immer bei 0.";
		return "Prüfe die Schrittweite und die Richtung. Zähle die Abschnitte zwischen den Strichen, nicht die Striche selbst.";
	}
	if (
		task.whole &&
		typeof answer === "number" &&
		answer === task.whole + (task.numbers?.[0] ?? 0)
	)
		return "Gesucht ist der fehlende Teil. Ziehe den bekannten Teil von der ganzen Zahl ab, statt beide zu addieren.";
	return task.hint;
}

export function forestExit(
	id: ExtraLessonId,
	seed: number,
	index: number,
): ForestTask {
	if (isFinalLesson(id)) return finalExit(id, seed, index);
	if (isShape(id)) return shapeExit(id, seed, index);
	if (isMeasure(id)) return measureExit(id, seed, index);
	if (id === "systematisch-kombinieren") return combinationExit(seed, index);
	if (isInvestigation(id)) return investigationExit(id, seed, index);
	if (isWrittenAlgorithm(id)) return algorithmExit(id, seed, index);
	if (id === "schriftlich-subtrahieren") return subtractionExit(seed, index);
	if (id === "schriftlich-addieren") return writtenExit(seed, index);
	if (id === "malnehmen-teilen" && index === 0) {
		const task = forestTask(id, 1, seed, 0);
		if (!task.calculation) throw new Error("Missing multiplication operands");
		const { a, b } = task.calculation;
		return {
			...task,
			prompt: `Milo füllt ${a} Körbe mit je ${format(b)} Samen. Wie viele Samen sind es zusammen?`,
			goal: 1,
		};
	}
	if (id === "zahlenstrahl-zahlenspruenge")
		return index === 0
			? forestTask(id, 1, seed, 0)
			: forestTask(id, 2, seed, index === 1 ? 0 : 2);
	if (id === "zahlen-zerlegen-ergaenzen" && index === 2) {
		const { int } = rng(seed),
			whole = [10000, 100000, 1000000][int(0, 2)],
			unit = whole / 100;
		const left = int(20, 60) * unit,
			delta = int(1, 9) * unit;
		return {
			kind: "choice",
			goal: 3,
			prompt: `Die ganze Zahl bleibt ${format(whole)}. Du machst den Teil ${format(left)} um ${format(delta)} größer. Was muss mit dem anderen Teil geschehen?`,
			answer: 1,
			choices: [
				{
					value: 1,
					label: `Er wird um ${format(delta)} kleiner, damit die Summe gleich bleibt.`,
				},
				{
					value: 2,
					label: `Er wird auch um ${format(delta)} größer, weil beide Teile zusammengehören.`,
				},
				{ value: 3, label: "Er bleibt unverändert; nur der erste Teil zählt." },
			],
			hint: `Prüfe es mit ${format(left)} + ${format(whole - left)}. Was fehlt noch bis ${format(whole)}, wenn links ${format(left + delta)} liegt?`,
			explanation: `${format(left + delta)} + ${format(whole - left - delta)} = ${format(whole)}. Wird ein Teil um ${format(delta)} größer, wird der andere um ${format(delta)} kleiner. Die Summe bleibt gleich.`,
		};
	}
	return forestTask(id, 2, seed, index);
}
