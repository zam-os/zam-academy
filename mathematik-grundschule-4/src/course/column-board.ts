import { format } from "../math/place-value";
import {
	additionColumns,
	COLUMN_NAMES,
	COLUMN_WORDS,
} from "./written-addition";

export function columnBoard(
	columns: { a: number; b: number; shown?: number },
	work: readonly string[] = [],
	solved = false,
	interactive = true,
): string {
	const { a, b, shown } = columns,
		model = additionColumns(a, b);
	const places = Array.from(
		{ length: model.width },
		(_, i) => model.width - i - 1,
	);
	const staticError = shown !== undefined && !interactive && !solved;
	const operand = (n: number, col: number) =>
		col < String(n).length ? String(Math.floor(n / 10 ** col) % 10) : "";
	const field = (index: number, col: number, carry = false) => {
		const raw = work[index] ?? "",
			value = (carry ? /^[01]$/ : /^[0-9]$/).test(raw) ? raw : "";
		const label = carry
			? `Übertrag zu ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})`
			: `Ergebnis ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})`;
		return solved
			? `<output aria-label="${label}">${value || "0"}</output>`
			: `<input id="column-${index}" data-action="forest-column" data-col="${index}" data-carry="${carry}" aria-label="${label}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" spellcheck="false" pattern="${carry ? "[01]" : "[0-9]"}" value="${value}">`;
	};
	return `<div class="column-workshop"><p class="column-direction">Beginne rechts bei E. Die kleinen Überträge gehören jeweils eine Spalte nach links.</p><div class="column-scroll" tabindex="0" role="region" aria-label="Rechentafel, bei Bedarf seitlich verschiebbar"><table class="column-board"><caption>${format(a)} + ${format(b)}</caption><thead><tr><th scope="col">Stelle</th>${places.map((col) => `<th scope="col"><abbr title="${COLUMN_WORDS[col]}">${COLUMN_NAMES[col]}</abbr></th>`).join("")}</tr></thead><tbody><tr><th scope="row">1. Zahl</th>${places.map((col) => `<td>${operand(a, col)}</td>`).join("")}</tr><tr><th scope="row">+ 2. Zahl</th>${places.map((col) => `<td>${operand(b, col)}</td>`).join("")}</tr>${staticError ? "" : `<tr class="carry-row"><th scope="row">Übertrag</th>${places.map((col) => `<td>${col === 0 ? '<span aria-label="Kein Übertrag zu den Einern">–</span>' : field(6 + col, col, true)}</td>`).join("")}</tr>`}<tr class="column-result"><th scope="row">${staticError ? "Milos Summe" : "Ergebnis"}</th>${places.map((col) => `<td>${staticError ? operand(shown, col) : field(col, col)}</td>`).join("")}</tr></tbody></table></div>${staticError ? "" : '<p class="fine-print" id="column-input-note" role="status">Pro Feld eine Ziffer. Ohne Übertrag darf die kleine Zelle leer bleiben. Große Tafeln kannst du seitlich verschieben.</p>'}</div>`;
}
