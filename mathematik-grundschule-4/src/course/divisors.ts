import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { Investigation, InvestigationField } from "./investigations";
import type { ForestTask } from "./tasks";

const field = (
	label: string,
	value: number,
	hint: string,
): InvestigationField => ({ label, value, hint });
const rule = (labels: string[], hint: string): InvestigationField => ({
	label: "Meine Begründung",
	value: 1,
	hint,
	choices: labels.map((label, i) => ({ label, value: i + 1 })),
});
function worksheet(
	goal: 1 | 2,
	prompt: string,
	board: Investigation,
	hint: string,
	explanation: string,
): ForestTask {
	return {
		kind: "investigation",
		goal,
		prompt,
		investigation: board,
		answer: board.fields.map((f) => f.value),
		hint,
		explanation,
	};
}
function divide(total: number, size: number): ForestTask {
	const q = Math.floor(total / size),
		r = total % size,
		yes = r === 0;
	const hint =
		"Packe gleich große Gruppen. Multipliziere die Zahl der vollen Gruppen mit der Gruppengröße. Was bleibt vom Vorrat übrig? Nur Rest 0 bedeutet: Teiler.";
	return worksheet(
		1,
		`Milo hat ${format(total)} Samen und packt je ${size} Samen in einen Beutel. Ist ${size} ein Teiler von ${format(total)}? Rechne volle Beutel und Rest aus.`,
		{
			identity: ["divisor-check", total, size],
			caption: "Ohne Rest oder mit Rest?",
			headers: ["Angabe", "Anzahl"],
			rows: [
				["Samen insgesamt", format(total)],
				["Samen je Beutel", String(size)],
			],
			fields: [
				field(
					"Volle Beutel",
					q,
					"Wie oft passt die Gruppengröße ganz in den Vorrat?",
				),
				field(
					"Samen übrig",
					r,
					"Vorrat minus volle Beutel mal Gruppengröße ergibt den Rest.",
				),
				rule(
					[
						yes
							? `${size} ist ein Teiler, weil kein Samen übrig bleibt.`
							: `${size} ist kein Teiler, weil Samen übrig bleiben.`,
						yes
							? `${size} ist kein Teiler, weil mehrere Beutel entstehen.`
							: `${size} ist ein Teiler; ein Rest spielt keine Rolle.`,
					],
					hint,
				),
			],
		},
		hint,
		`${format(total)} : ${size} = ${q} Rest ${r}. ${size} ${yes ? "ist ein" : "ist kein"} Teiler von ${format(total)}. ${yes ? `${format(total)} ist ein Vielfaches von ${size}.` : `${format(total)} ist kein Vielfaches von ${size}.`} Probe: ${q} · ${size} + ${r} = ${format(total)}.`,
	);
}
function multiples(
	step: number,
	start: number,
	missingInside: boolean,
): ForestTask {
	const hint =
		"Ein Vielfaches entsteht durch Malnehmen mit einer ganzen Zahl. Gehe in gleich großen Schritten weiter und zähle den Startfaktor mit.";
	const factors = Array.from({ length: 5 }, (_, i) => start + i),
		holes = missingInside ? [1, 3, 4] : [2, 3, 4];
	return worksheet(
		2,
		`Untersuche die Vielfachen von ${step}. Ergänze die drei Lücken. In jeder Zeile kommt ein weiteres ${step}er-Paket dazu.`,
		{
			identity: ["multiples", step, start],
			caption: "Gleich große Pakete, immer ein Paket mehr",
			headers: ["Pakete", "Samen insgesamt"],
			rows: factors.map((f, i) => [
				String(f),
				holes.includes(i) ? "?" : format(f * step),
			]),
			fields: holes.map((i) =>
				field(`Samen bei ${factors[i]} Paketen`, factors[i] * step, hint),
			),
		},
		hint,
		`Die Vielfachen in der Tabelle lauten ${factors.map((n) => format(n * step)).join(", ")}. Jedes Mal kommen ${step} dazu. ${factors.at(-1)} · ${step} = ${format(factors[4] * step)}. Jede Tabellenzahl lässt sich ohne Rest durch ${step} teilen.`,
	);
}
function select(total: number, context: boolean): ForestTask {
	const numbers = Array.from({ length: 10 }, (_, i) => i + 1),
		answer = numbers.filter((d) => total % d === 0);
	return {
		kind: "divisors",
		goal: 3,
		numbers,
		answer,
		divisorTotal: total,
		prompt: context
			? `Du verteilst ${format(total)} Samen vollständig auf gleich gefüllte Beutel. Welche Beutelgrößen von 1 bis 10 Samen gehen ohne Rest auf? Wähle alle passenden Größen.`
			: `Welche Zahlen von 1 bis 10 sind Teiler von ${format(total)}? Wähle alle passenden Zahlen.`,
		hint: "Prüfe jede angebotene Zahl einzeln durch Teilen oder eine passende Malaufgabe. 1 ist immer ein Teiler. Eine Zahl ist nur dann Teiler, wenn der Rest 0 ist.",
		explanation: `Unter den Zahlen von 1 bis 10 passen ${answer.join(", ")}. ${answer.map((d) => `${d} · ${total / d} = ${format(total)}`).join("; ")}. Die übrigen angebotenen Zahlen lassen einen Rest. Gesucht sind hier nur Teiler von 1 bis 10, nicht alle Teiler der Zahl.`,
	};
}
export function divisorTask(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
			(seed + Math.imul(index + 1, 2246822519) + level * 104729) >>> 0,
		),
		int = (lo: number, hi: number) => lo + Math.floor(next() * (hi - lo + 1));
	if (index % 3 === 0) {
		const size = int(2, 10),
			q = int(level === 1 ? 2 : 11, level === 1 ? 10 : 50),
			rest = int(0, 1) ? int(1, size - 1) : 0;
		return divide(size * q + rest, size);
	}
	if (index % 3 === 1)
		return multiples(int(2, 10), level === 1 ? 1 : int(11, 30), level === 2);
	return select(
		int(level === 1 ? 2 : 51, level === 1 ? 10 : 90) * int(2, 10),
		level === 2,
	);
}
export function divisorLab(index: number): ForestTask {
	return [
		() => divide(28, 4),
		() => multiples(6, 1, false),
		() => select(24, false),
	][index % 3]();
}
export const divisorExit = (seed: number, index: number): ForestTask =>
	divisorTask(2, seed ^ 0xa54ff53a, index);
