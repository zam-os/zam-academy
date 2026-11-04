import { format, parseInteger } from "../math/place-value";
export type FieldFormat = { scale: 10 | 100 | 1000 } | { clock: true };
// Canonical answers are integer base units. Decimal notation is opt-in; the
// existing integer parser (including German thousands dots) stays unchanged.
export function parseQuantity(text: string, spec?: FieldFormat): number | null {
	if (!spec) return parseInteger(text);
	const s = text.trim();
	if ("clock" in spec) {
		const m = /^(\d{1,2}):([0-5]\d)$/.exec(s);
		return m && Number(m[1]) < 24 ? Number(m[1]) * 60 + Number(m[2]) : null;
	}
	const digits = String(spec.scale).length - 1;
	const m =
		/^(\d{1,6}|[1-9]\d{0,2}(?:[ \u00a0\u202f]\d{3}){1,2})(?:[.,](\d{1,3}))?$/.exec(
			s,
		);
	if (!m || (m[2]?.length ?? 0) > digits) return null;
	const n =
		Number(m[1].replace(/[ \u00a0\u202f]/g, "")) * spec.scale +
		Number((m[2] ?? "").padEnd(digits, "0"));
	return Number.isSafeInteger(n) && n <= 1000000 ? n : null;
}
export function quantityText(n: number, spec?: FieldFormat): string {
	if (!spec) return format(n);
	if ("clock" in spec)
		return `${String(Math.floor(n / 60)).padStart(2, "0")}:${String(n % 60).padStart(2, "0")}`;
	const digits = String(spec.scale).length - 1;
	return `${format(Math.floor(n / spec.scale))},${String(n % spec.scale).padStart(digits, "0")}`;
}
export function quantityNote(spec?: FieldFormat): string {
	if (!spec) return "Ganze Zahl, zum Beispiel 1000, 1 000 oder 1.000.";
	return "clock" in spec
		? "Uhrzeit als Stunde:Minute, zum Beispiel 08:05 (00:00 bis 23:59)."
		: `Komma oder Punkt als Dezimalzeichen, höchstens ${String(spec.scale).length - 1} Nachkommastellen. Tausender nur mit Leerzeichen, zum Beispiel 1 000,5.`;
}
