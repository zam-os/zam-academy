import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { ForestTask } from "./tasks";
import { COLUMN_NAMES, COLUMN_WORDS } from "./written-addition";

export interface SubtractionWork {
	bundles: number[];
	result: string[];
}
const digits = (n: number) =>
	Array.from({ length: 7 }, (_, col) => Math.floor(n / 10 ** col) % 10);
export const bundleValue = (bundles: readonly number[]) =>
	bundles.reduce((sum, n, col) => sum + n * 10 ** col, 0);
export const freshSubtractionWork = (a: number): SubtractionWork => ({
	bundles: digits(a),
	result: Array<string>(7).fill(""),
});
export function validSubtractionWork(raw: unknown): raw is SubtractionWork {
	if (!raw || typeof raw !== "object") return false;
	const w = raw as SubtractionWork;
	return (
		Array.isArray(w.bundles) &&
		w.bundles.length === 7 &&
		w.bundles.every((n) => Number.isInteger(n) && n >= 0 && n <= 19) &&
		Array.isArray(w.result) &&
		w.result.length === 7 &&
		w.result.every((n) => typeof n === "string" && /^[0-9]?$/.test(n))
	);
}
// Exchange one bundle for ten of the adjacent smaller place, preserving value.
export function unbundleSubtraction(
	bundles: readonly number[],
	col: number,
): number[] | null {
	if (
		!Number.isInteger(col) ||
		col < 1 ||
		col > 6 ||
		bundles.length !== 7 ||
		!bundles.every((n) => Number.isInteger(n) && n >= 0 && n <= 19) ||
		bundles[col] < 1 ||
		bundles[col - 1] > 9
	)
		return null;
	const next = [...bundles];
	next[col]--;
	next[col - 1] += 10;
	return next;
}
export function subtractionColumns(a: number, b: number) {
	if (
		![a, b].every((n) => Number.isSafeInteger(n) && n >= 0) ||
		b > a ||
		a > 1_000_000
	)
		throw new Error("Subtraction outside the lesson range");
	let bundles = digits(a);
	const bottom = digits(b),
		exchanges: number[] = [];
	for (let col = 0; col < 7; col++) {
		if (bundles[col] >= bottom[col]) continue;
		let source = col + 1;
		while (bundles[source] === 0) source++;
		for (; source > col; source--) {
			const next = unbundleSubtraction(bundles, source);
			if (!next) throw new Error("Invalid regrouping");
			bundles = next;
			exchanges.push(source);
		}
	}
	const result = bundles.map((n, col) => n - bottom[col]);
	return {
		bundles,
		bottom,
		result,
		exchanges,
		width: String(a).length,
		answer: [...result, ...bundles],
	};
}
export function subtractionAnswer(
	a: number,
	b: number,
	work: SubtractionWork,
): number[] | null {
	const { width } = subtractionColumns(a, b);
	if (!validSubtractionWork(work) || bundleValue(work.bundles) !== a)
		return null;
	const result = Array<number>(7).fill(0);
	for (let col = 0; col < width; col++) {
		if (!/^[0-9]$/.test(work.result[col])) return null;
		result[col] = Number(work.result[col]);
	}
	return [...result, ...work.bundles];
}
export function subtractionValidation(
	a: number,
	b: number,
	work: SubtractionWork,
): string | null {
	const answer = subtractionAnswer(a, b, work);
	if (!answer)
		return "Fülle jede sichtbare Ergebniszelle mit einer Ziffer. Schreibe auch bei einer leeren Ergebnisstelle 0.";
	const model = subtractionColumns(a, b);
	if (
		model.result.every((n, col) => n === answer[col]) &&
		!model.bundles.every((n, col) => n === work.bundles[col])
	) {
		if (work.bundles.some((n, col) => n - model.bottom[col] > 9))
			return "Dein Ergebnis passt. Oben liegen aber zu viele kleine Bündel in einer Spalte. Nutze Bündel zurücksetzen und entbündle nur dort, wo die obere Menge zum Abziehen nicht reicht.";
		return "Dein Ergebnis passt. Zeige auch das Entbündeln in der oberen Zahl: Tausche links ein größeres Bündel in zehn kleinere, bis du in jeder Spalte abziehen kannst.";
	}
	return null;
}
export function subtractionExplanation(a: number, b: number): string {
	const m = subtractionColumns(a, b);
	const exchanges = m.exchanges.map(
		(col) => `1 ${COLUMN_NAMES[col]} in 10 ${COLUMN_NAMES[col - 1]} tauschen`,
	);
	const steps = m.result
		.slice(0, m.width)
		.map(
			(n, col) =>
				`${COLUMN_NAMES[col]}: ${m.bundles[col]} − ${m.bottom[col]} = ${n}`,
		);
	return `${format(a)} − ${format(b)} = ${format(a - b)}. ${exchanges.length ? `Entbündeln: ${exchanges.join("; ")}. Die obere Zahl behält ihren Wert. ` : "Kein Entbündeln nötig. "}${steps.join("; ")}. Additionsprobe: ${format(a - b)} + ${format(b)} = ${format(a)}.`;
}
function board(
	a: number,
	b: number,
	goal: 1 | 2 | 3,
	prompt: string,
	shown?: number,
): ForestTask {
	return {
		kind: "subtraction",
		goal,
		prompt,
		subtraction: { a, b, ...(shown === undefined ? {} : { shown }) },
		calculation: { a, b, op: "−" },
		answer: subtractionColumns(a, b).answer,
		hint: "Beginne rechts bei den Einern. Reicht die obere Menge nicht, tausche ein Bündel links daneben in zehn kleinere. Steht dort 0, beginne weiter links. Die obere Zahl behält ihren Wert. Ziehe dann unten von oben ab. Prüfe mit Ergebnis plus abgezogener Zahl.",
		explanation: subtractionExplanation(a, b),
	};
}
export function subtractionLab(goal: number): ForestTask {
	return [
		() =>
			board(
				5768,
				243,
				1,
				"Rechne 5 768 − 243 schriftlich. Hier kannst du in jeder Spalte sofort abziehen.",
			),
		() =>
			board(
				5342,
				1218,
				2,
				"Rechne 5 342 − 1 218. Tausche mit den Knöpfen passende Bündel in der oberen Zahl und trage dein Ergebnis ein.",
			),
		() =>
			board(
				10000,
				1,
				3,
				"Rechne 10 000 − 1. Wie kommst du über die Nullstellen zu den Einern? Prüfe danach mit der Additionsprobe.",
			),
	][goal]();
}
export function subtractionTask(
	level: 1 | 2,
	seed: number,
	index: number,
): ForestTask {
	const next = random(
		(seed + Math.imul(index + 1, 2654435761) + level * 104729) >>> 0,
	);
	const int = (lo: number, hi: number) =>
		lo + Math.floor(next() * (hi - lo + 1));
	const variant = index % 3;
	let a: number, b: number;
	if (level === 1) {
		const width = int(4, 5),
			top: number[] = [],
			bottom: number[] = [];
		let borrowed = 0;
		for (let col = 0; col < width; col++) {
			const outgoing =
				variant !== 0 && (col === 0 || (variant === 2 && col === 2));
			const digit = int(
				Math.max(borrowed, col === width - 1 ? 2 : 0),
				outgoing ? 7 : 9,
			);
			top.push(digit);
			bottom.push(
				outgoing
					? int(digit - borrowed + 1, 9)
					: int(col === width - 1 ? 1 : 0, digit - borrowed),
			);
			borrowed = outgoing ? 1 : 0;
		}
		a = bundleValue(top);
		b = bundleValue(bottom);
	} else {
		// A nonzero hundreds digit donates through a zero tens place; the
		// five-digit subtrahend stays shorter than the six-digit minuend.
		a =
			int(2, 9) * 100000 +
			int(0, 9) * 10000 +
			int(0, 9) * 1000 +
			int(1, 9) * 100 +
			int(0, 4);
		b =
			int(1, 9) * 10000 +
			int(0, 9) * 1000 +
			int(0, 8) * 100 +
			int(1, 8) * 10 +
			int(5, 9);
	}
	if (level === 1)
		return board(
			a,
			b,
			variant === 0 ? 1 : 2,
			`Rechne ${format(a)} − ${format(b)} schriftlich. ${variant === 0 ? "Stelle gleiche Stellenwerte untereinander." : "Entbündle dort, wo die obere Menge nicht reicht."}`,
		);
	if (variant === 2) {
		const shown = Number(
			String(a)
				.padStart(7, "0")
				.split("")
				.map((digit, i) =>
					Math.abs(Number(digit) - Number(String(b).padStart(7, "0")[i])),
				)
				.join(""),
		);
		return board(
			a,
			b,
			3,
			`Milo erhält ${format(shown)} für ${format(a)} − ${format(b)}. Rechne selbst, verbessere seine Rechnung und prüfe durch Addieren.`,
			shown,
		);
	}
	if (variant === 1)
		return {
			kind: "number",
			goal: 3,
			calculation: { a, b, op: "−" },
			prompt: `Prüfe mit der Additionsprobe: Milo hat von ${format(a)} genau ${format(b)} weggenommen. Welche Zahl muss er zu ${format(b)} addieren, um wieder ${format(a)} zu erhalten?`,
			answer: a - b,
			inverseProbe: true,
			hint: "Gesucht ist der Rest. Rechne die Differenz auf Papier und addiere danach die weggenommene Zahl dazu. Die Summe muss die Startzahl sein.",
			explanation: subtractionExplanation(a, b),
		};
	return board(
		a,
		b,
		2,
		`Milo hat ${format(a)} Samen. Er verteilt ${format(b)}. Wie viele bleiben? Rechne schriftlich und prüfe mit der Additionsprobe.`,
	);
}
export function subtractionExit(seed: number, index: number): ForestTask {
	return index === 0
		? subtractionTask(1, seed, 0)
		: index === 1
			? subtractionTask(2, seed, 0)
			: subtractionTask(2, seed, 2);
}
export function subtractionMistake(
	task: ForestTask,
	answer: number[] | null,
): string {
	if (!task.subtraction || !answer)
		return "Fülle jede sichtbare Ergebniszelle mit einer Ziffer, auch bei 0.";
	const { a, b } = task.subtraction,
		model = subtractionColumns(a, b);
	for (let col = 0; col < model.width; col++) {
		const top = answer[7 + col],
			bottom = model.bottom[col];
		if (top < bottom)
			return `In der ${COLUMN_WORDS[col]}spalte (${COLUMN_NAMES[col]}) reicht die obere Menge nicht. Entbündle ein größeres Bündel links. Tausche bei Nullstellen von weiter links schrittweise bis hierher.`;
		if (top - bottom > 9)
			return `In der ${COLUMN_WORDS[col]}spalte liegen zu viele kleine Bündel. Setze die Bündel zurück und entbündle nur dort, wo du sonst nicht abziehen kannst.`;
		if (answer[col] !== top - bottom)
			return `Prüfe die ${COLUMN_WORDS[col]}spalte (${COLUMN_NAMES[col]}). Ziehe die untere Menge von der jetzt angezeigten oberen Menge ab. Vertausche die beiden Mengen nicht.`;
	}
	return task.hint;
}
