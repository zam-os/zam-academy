import { format } from "../math/place-value";
import { random } from "../practice/tasks";
import type { ForestTask } from "./tasks";

export const COLUMN_NAMES = ["E", "Z", "H", "T", "ZT", "HT", "M"] as const;
export const COLUMN_WORDS = [
	"Einer",
	"Zehner",
	"Hunderter",
	"Tausender",
	"Zehntausender",
	"Hunderttausender",
	"Millionen",
] as const;
// Seven result digits followed by carries into Z, H, T, ZT, HT and M.
export const emptyColumnWork = (): string[] => Array<string>(13).fill("");
export function additionColumns(a: number, b: number) {
	if (
		![a, b].every((n) => Number.isSafeInteger(n) && n >= 0) ||
		a + b > 1_000_000
	)
		throw new Error("Addition outside the lesson range");
	const digits = (n: number) =>
		Array.from({ length: 7 }, (_, i) => Math.floor(n / 10 ** i) % 10);
	const left = digits(a),
		right = digits(b),
		result: number[] = [],
		carries = Array<number>(7).fill(0),
		totals: number[] = [];
	for (let col = 0; col < 7; col++) {
		const total = left[col] + right[col] + carries[col];
		totals.push(total);
		result.push(total % 10);
		if (col < 6) carries[col + 1] = Math.floor(total / 10);
	}
	return {
		left,
		right,
		result,
		carries,
		totals,
		width: Math.max(String(a).length, String(b).length, String(a + b).length),
		answer: [...result, ...carries.slice(1)],
	};
}
export function columnAnswer(
	a: number,
	b: number,
	work: readonly string[],
): number[] | null {
	const { width } = additionColumns(a, b);
	if (work.length !== 13) return null;
	const result = Array<number>(13).fill(0);
	for (let col = 0; col < width; col++) {
		if (!/^[0-9]$/.test(work[col])) return null;
		result[col] = Number(work[col]);
		if (col > 0) {
			const value = work[6 + col];
			if (!/^[01]?$/.test(value)) return null;
			result[6 + col] = Number(value);
		}
	}
	return result;
}
export function writtenExplanation(a: number, b: number): string {
	const m = additionColumns(a, b);
	const steps = m.totals
		.slice(0, m.width)
		.map(
			(total, col) =>
				`${COLUMN_NAMES[col]}: ${m.left[col]} + ${m.right[col]}${m.carries[col] ? " + 1 Übertrag" : ""} = ${total}; schreibe ${m.result[col]}${total >= 10 ? `, übertrage 1 zu ${COLUMN_NAMES[col + 1]}` : ""}.`,
		);
	return `${format(a)} + ${format(b)} = ${format(a + b)}. ${steps.join(" ")} Probe: ${format(a + b)} − ${format(b)} = ${format(a)}.`;
}
function board(
	a: number,
	b: number,
	goal: 1 | 2 | 3,
	prompt: string,
	shown?: number,
): ForestTask {
	return {
		kind: "columns",
		goal,
		prompt,
		columns: { a, b, ...(shown === undefined ? {} : { shown }) },
		calculation: { a, b, op: "+" },
		answer: additionColumns(a, b).answer,
		hint: "Beginne rechts bei den Einern. Addiere die beiden Ziffern und einen ankommenden Übertrag. Schreibe nur die Einerziffer der Spaltensumme ins Ergebnis; ein voller Zehner geht als 1 in die nächste Spalte links. Eine leere Übertragszelle bedeutet 0.",
		explanation: writtenExplanation(a, b),
	};
}
export function writtenLab(goal: number): ForestTask {
	const a = [2345, 2687, 999999][goal],
		b = [123, 1548, 1][goal];
	return board(
		a,
		b,
		(goal + 1) as 1 | 2 | 3,
		[
			"Addiere 2 345 und 123 schriftlich. Fülle die Ergebniszeile; hier brauchst du keinen Übertrag.",
			"Addiere 2 687 und 1 548. Trage die Ergebnisziffern und alle Überträge in die nächste Spalte links ein.",
			"Addiere 999 999 und 1. Verfolge die Übertragskette bis zur Million und prüfe das Ergebnis.",
		][goal],
	);
}
export function writtenTask(
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
	if (level === 1 && variant === 0) {
		const width = int(4, 6),
			left = Array.from({ length: width }, (_, i) =>
				int(i === width - 1 ? 1 : 0, 7),
			);
		const right = left.map((n, i) => (i === width - 1 ? 0 : int(0, 9 - n)));
		right[0] = Math.max(1, right[0]); // left ones <=7, so this remains carry-free.
		const number = (digits: number[]) =>
			digits.reduce((s, n, i) => s + n * 10 ** i, 0);
		const a = number(left),
			b = number(right);
		return board(
			a,
			b,
			1,
			`Addiere ${format(a)} und ${format(b)} schriftlich. Achte auch bei unterschiedlich langen Zahlen auf die Stellen.`,
		);
	}
	// Different lengths and zero positions occur naturally; the ones always cause a carry.
	const a = int(12000, 650000),
		ones = int(5, 9),
		b = int(100, 25000) * 10 + ones;
	const adjusted = a - (a % 10) + int(5, 9);
	if (level === 2 && variant === 2) {
		const shown = adjusted + b - 10;
		return {
			kind: "choice",
			goal: 3,
			columns: { a: adjusted, b, shown },
			calculation: { a: adjusted, b, op: "+" },
			prompt: `Milo hat bei ${format(adjusted)} + ${format(b)} den Übertrag von den Einern zu den Zehnern vergessen. Er notiert ${format(shown)}. Was erklärt den Fehler?`,
			answer: 1,
			choices: [
				{
					value: 1,
					label:
						"Ein Zehner fehlt. Das Ergebnis ist um 10 zu klein; der Übertrag gehört in die Zehnerspalte.",
				},
				{
					value: 2,
					label: "Ein Einer fehlt. Das Ergebnis ist nur um 1 zu klein.",
				},
				{
					value: 3,
					label:
						"Die Übertragsziffer darf immer weggelassen werden; das Ergebnis bleibt gleich.",
				},
			],
			hint: "Ein Übertrag von den Einern zählt in der nächsten Spalte als ein Zehner. Welchen Wert hat dieser Zehner?",
			explanation: `Die Einerspalte ergibt ${(adjusted % 10) + (b % 10)}. Ein voller Zehner muss zur Zehnerspalte. ${format(shown)} + 10 = ${format(adjusted + b)}. ${writtenExplanation(adjusted, b)}`,
		};
	}
	if (level === 2 && variant === 1)
		return board(
			adjusted,
			b,
			3,
			`Milo notiert ${format(adjusted + b - 10)} als Summe von ${format(adjusted)} und ${format(b)}. Rechne selbst schriftlich und verbessere sein Ergebnis.`,
			adjusted + b - 10,
		);
	return board(
		adjusted,
		b,
		2,
		level === 1
			? `Rechne ${format(adjusted)} + ${format(b)} schriftlich. Denke in jeder Spalte an den ankommenden Übertrag.`
			: `Im Saatgutlager liegen ${format(adjusted)} Samen. Es kommen ${format(b)} dazu. Wie viele Samen sind es jetzt? Rechne schriftlich und prüfe deine Summe.`,
	);
}
export function writtenExit(seed: number, index: number): ForestTask {
	return index === 0
		? writtenTask(1, seed, 0)
		: index === 1
			? writtenTask(2, seed, 0)
			: writtenTask(2, seed, 2);
}
export function writtenMistake(
	task: ForestTask,
	answer: number[] | null,
): string {
	if (!task.columns) return task.hint;
	if (!answer)
		return "Fülle jede sichtbare Ergebniszelle mit genau einer Ziffer. In die Übertragszeile kommt nur 0 oder 1; ohne Übertrag darf sie leer bleiben.";
	const m = additionColumns(task.columns.a, task.columns.b);
	for (let col = 1; col < m.width; col++)
		if (answer[6 + col] !== m.carries[col])
			return `Prüfe den Übertrag zur Spalte ${COLUMN_NAMES[col]}. Zehn ${COLUMN_WORDS[col - 1]} werden zu ${col === 6 ? "einer Million" : `einem ${COLUMN_WORDS[col]}`}. Rechne den Übertrag dort mit.`;
	for (let col = 0; col < m.width; col++)
		if (answer[col] !== m.result[col])
			return `Prüfe die ${COLUMN_WORDS[col]}spalte (${COLUMN_NAMES[col]}). Addiere die beiden Ziffern und den ankommenden Übertrag. Schreibe nur die Einerziffer dieser Spaltensumme ins Ergebnis.`;
	return task.hint;
}
