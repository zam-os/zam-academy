export const MAX_NUMBER = 1_000_000;
export const WEIGHTS = [1, 10, 100, 1000, 10000, 100000, 1000000] as const;
export const NAMES = [
	"Einer",
	"Zehner",
	"Hunderter",
	"Tausender",
	"Zehntausender",
	"Hunderttausender",
	"Millionen",
] as const;
export const LETTERS = ["E", "Z", "H", "T", "ZT", "HT", "M"] as const;
export type Counts = number[];
export type Column = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export function validCounts(value: unknown): value is Counts {
	return (
		Array.isArray(value) &&
		[4, 7].includes(value.length) &&
		value.every((n) => Number.isSafeInteger(n) && n >= 0 && n <= MAX_NUMBER) &&
		value.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0) <= MAX_NUMBER
	);
}

export function total(counts: Counts): number {
	if (!validCounts(counts))
		throw new Error("Ungültige Stellenwertdarstellung.");
	return counts.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0);
}

export function digits(value: number): Counts {
	if (!Number.isSafeInteger(value) || value < 0 || value > MAX_NUMBER)
		throw new Error("Die Zahl muss zwischen 0 und 1 000 000 liegen.");
	return WEIGHTS.map((weight) => Math.floor(value / weight) % 10) as Counts;
}

export function exchange(
	counts: Counts,
	column: Column,
	direction: "bundle" | "unbundle",
): Counts | null {
	if (!validCounts(counts)) return null;
	const next = WEIGHTS.map((_, i) => counts[i] ?? 0);
	if (direction === "bundle") {
		if (column === 6 || next[column] < 10) return null;
		next[column] -= 10;
		next[column + 1] += 1;
	} else {
		if (column === 0 || next[column] < 1) return null;
		next[column] -= 1;
		next[column - 1] += 10;
	}
	return validCounts(next) && total(next) === total(counts) ? next : null;
}

/** Whole numbers, optionally grouped by spaces or German thousands dots. */
export function parseInteger(input: string): number | null {
	const value = input.trim();
	if (
		!/^(?:\d{1,7}|[1-9]\d{0,2}(?:[ \u00a0\u202f]\d{3}){1,2}|[1-9]\d{0,2}(?:\.\d{3}){1,2})$/.test(
			value,
		)
	)
		return null;
	const n = Number(value.replace(/[ .\u00a0\u202f]/g, ""));
	return Number.isSafeInteger(n) && n >= 0 && n <= MAX_NUMBER ? n : null;
}

export function format(n: number): string {
	return String(n).replace(/(\d)(?=(\d{3})+$)/g, "$1\u202f");
}

export function describe(counts: Counts): string {
	return (
		WEIGHTS.map((_, i) => i)
			.reverse()
			.filter((i) => counts[i])
			.map((i) => `${counts[i]} ${LETTERS[i]}`)
			.join(" · ") || "0 Einer"
	);
}
