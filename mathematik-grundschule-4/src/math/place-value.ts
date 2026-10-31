export const WEIGHTS = [1, 10, 100, 1000] as const;
export const NAMES = ["Einer", "Zehner", "Hunderter", "Tausender"] as const;
export const LETTERS = ["E", "Z", "H", "T"] as const;
export type Counts = [number, number, number, number];
export type Column = 0 | 1 | 2 | 3;

export function validCounts(value: unknown): value is Counts {
	return (
		Array.isArray(value) &&
		value.length === 4 &&
		value.every((n) => Number.isSafeInteger(n) && n >= 0 && n <= 9999) &&
		value.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0) <= 9999
	);
}

export function total(counts: Counts): number {
	if (!validCounts(counts))
		throw new Error("Ungültige Stellenwertdarstellung.");
	return counts.reduce((sum, n, i) => sum + n * WEIGHTS[i], 0);
}

export function digits(value: number): Counts {
	if (!Number.isSafeInteger(value) || value < 0 || value > 9999)
		throw new Error("Die Zahl muss zwischen 0 und 9 999 liegen.");
	return WEIGHTS.map((weight) => Math.floor(value / weight) % 10) as Counts;
}

export function exchange(
	counts: Counts,
	column: Column,
	direction: "bundle" | "unbundle",
): Counts | null {
	if (!validCounts(counts)) return null;
	const next = [...counts] as Counts;
	if (direction === "bundle") {
		if (column === 3 || next[column] < 10) return null;
		next[column] -= 10;
		next[column + 1] += 1;
	} else {
		if (column === 0 || next[column] < 1) return null;
		next[column] -= 1;
		next[column - 1] += 10;
	}
	return validCounts(next) && total(next) === total(counts) ? next : null;
}

/** Integer-only input: no decimal/exponent/prefix acceptance. */
export function parseInteger(input: string): number | null {
	const value = input.trim();
	if (!/^(?:\d{1,4}|[1-9][ \u00a0\u202f]\d{3})$/.test(value)) return null;
	const n = Number(value.replace(/[ \u00a0\u202f]/g, ""));
	return Number.isSafeInteger(n) && n >= 0 && n <= 9999 ? n : null;
}

export function format(n: number): string {
	return String(n).replace(/(\d)(?=(\d{3})+$)/g, "$1\u202f");
}

export function describe(counts: Counts): string {
	return [3, 2, 1, 0].map((i) => `${counts[i]} ${LETTERS[i]}`).join(" · ");
}
