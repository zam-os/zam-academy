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
	return `${format(a)} + ${format(b)} = ${format(a + b)}. ${steps.join(" ")} Tauschprobe: ${format(b)} + ${format(a)} = ${format(a + b)}. Rechne die Tauschaufgabe neu und vergleiche beide Summen.`;
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
	const variant = index % 3,
		width = level === 1 ? int(4, 5) : 6;
	const sameLength = level === 1 && int(0, 1) === 1;
	const left: number[] = [],
		right: number[] = [];
	let incoming = 0;
	for (let col = 0; col < width; col++) {
		// Level 1: no carry, one carry, or two separated carries. Level 2:
		// a guaranteed chain at E/Z, a zero at T, and a shorter second summand.
		const outgoing =
			level === 1
				? variant !== 0 && (col === 0 || (variant === 2 && col === 2))
				: col < 2 || ((col === 2 || col === 4) && int(0, 1) === 1);
		const top = col === width - 1;
		if (level === 2 && col === 3) {
			left.push(0);
			right.push(int(0, 8));
		} else if (outgoing) {
			const digit = int(5, 8);
			left.push(digit);
			right.push(int(10 - incoming - digit, 9));
		} else {
			const digit = int(top ? 1 : 0, 6);
			left.push(digit);
			const shorter = top && !sameLength;
			const positive =
				(top && sameLength) || (!sameLength && col === width - 2);
			right.push(shorter ? 0 : int(positive ? 1 : 0, 9 - incoming - digit));
		}
		incoming = Math.floor((left[col] + right[col] + incoming) / 10);
	}
	const number = (digits: number[]) =>
		digits.reduce((total, digit, col) => total + digit * 10 ** col, 0);
	const a = number(left),
		b = number(right),
		model = additionColumns(a, b);
	if (level === 1)
		return board(
			a,
			b,
			variant === 0 ? 1 : 2,
			variant === 0
				? `Addiere ${format(a)} und ${format(b)} schriftlich. Stelle gleiche Stellenwerte untereinander.`
				: `Rechne ${format(a)} + ${format(b)} schriftlich. Arbeite Spalte für Spalte und notiere jeden Übertrag.`,
		);
	const carryPlaces = model.carries.flatMap((carry, col) =>
		carry ? [col] : [],
	);
	const omitted = carryPlaces[int(0, carryPlaces.length - 1)],
		delta = 10 ** omitted;
	const shown = a + b - delta;
	if (variant === 2) {
		const others = Array.from({ length: width - 1 }, (_, i) => i + 1).filter(
			(col) => col !== omitted,
		);
		const first = others.splice(int(0, others.length - 1), 1)[0],
			second = others[int(0, others.length - 1)];
		return {
			kind: "choice",
			goal: 3,
			columns: { a, b, shown },
			calculation: { a, b, op: "+" },
			prompt: `Milo notiert ${format(shown)} als Summe von ${format(a)} und ${format(b)}. Prüfe seine Rechnung. Welche Korrektur passt?`,
			answer: 1,
			choices: [omitted, first, second].map((col, i) => ({
				value: i + 1,
				label: `Es fehlen ${format(10 ** col)}. Prüfe den Übertrag zur Spalte ${COLUMN_NAMES[col]}.`,
			})),
			hint: "Rechne die Summe selbst und vergleiche sie mit Milos Ergebnis. Welchen Wert hat der Unterschied?",
			explanation: `Milos Summe ist um ${format(delta)} zu klein. Ein Übertrag zur Spalte ${COLUMN_NAMES[omitted]} hat den Wert ${format(delta)}. ${writtenExplanation(a, b)}`,
		};
	}
	return variant === 1
		? board(
				a,
				b,
				3,
				`Milo notiert ${format(shown)} als Summe von ${format(a)} und ${format(b)}. Rechne selbst schriftlich und verbessere sein Ergebnis.`,
				shown,
			)
		: board(
				a,
				b,
				2,
				`Im Saatgutlager liegen ${format(a)} Samen. Es kommen ${format(b)} dazu. Wie viele Samen sind es jetzt? Rechne schriftlich und prüfe deine Summe.`,
			);
}
export function writtenExit(seed: number, index: number): ForestTask {
	return index === 0
		? writtenTask(1, seed, 0)
		: index === 1
			? writtenTask(2, seed, 0)
			: writtenTask(2, seed, 1);
}
// Format/completion notices do not spend a learner's first mathematical attempt.
export function columnValidation(
	a: number,
	b: number,
	work: readonly string[],
): string | null {
	const answer = columnAnswer(a, b, work);
	if (!answer)
		return "Fülle jede sichtbare Ergebniszelle mit genau einer Ziffer. In die Übertragszeile kommt nur 0 oder 1; ohne Übertrag darf sie leer bleiben.";
	const model = additionColumns(a, b);
	const resultCorrect = model.result.every(
		(digit, col) => digit === answer[col],
	);
	const allCarriesBlank = Array.from(
		{ length: model.width - 1 },
		(_, i) => work[7 + i],
	).every((value) => value === "");
	if (
		resultCorrect &&
		model.carries.some((carry) => carry === 1) &&
		allCarriesBlank
	)
		return "Deine Ergebnisziffern passen. Trage auch deine Überträge in die kleinen Zellen ein, damit Milo deinen Rechenweg sehen kann.";
	return null;
}
export function columnOrder(width: number): number[] {
	return Array.from({ length: width }, (_, col) =>
		col === 0 ? [0] : [6 + col, col],
	).flat();
}
export function writtenMistake(
	task: ForestTask,
	answer: number[] | null,
): string {
	if (!task.columns) return task.hint;
	if (!answer)
		return "Fülle jede sichtbare Ergebniszelle mit genau einer Ziffer. In die Übertragszeile kommt nur 0 oder 1; ohne Übertrag darf sie leer bleiben.";
	const m = additionColumns(task.columns.a, task.columns.b);
	for (let col = 0; col < m.width; col++) {
		if (answer[col] !== m.result[col])
			return `Prüfe die ${COLUMN_WORDS[col]}spalte (${COLUMN_NAMES[col]}). Addiere die beiden Ziffern und den ankommenden Übertrag. Schreibe nur die Einerziffer dieser Spaltensumme ins Ergebnis.`;
		const next = col + 1;
		if (next < m.width && answer[6 + next] !== m.carries[next]) {
			if (answer[6 + next] > m.carries[next])
				return `Prüfe den Übertrag zur Spalte ${COLUMN_NAMES[next]}. In der ${COLUMN_WORDS[col]}spalte entsteht kein voller Zehner. Lass die Übertragszelle leer oder schreibe 0.`;
			return `Prüfe den Übertrag zur Spalte ${COLUMN_NAMES[next]}. Zehn ${COLUMN_WORDS[col]} werden zu ${next === 6 ? "einer Million" : `einem ${COLUMN_WORDS[next]}`}. Trage den Übertrag in der nächsten Spalte links ein und rechne ihn dort mit.`;
		}
	}
	return task.hint;
}
