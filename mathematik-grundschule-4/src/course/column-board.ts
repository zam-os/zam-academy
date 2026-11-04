import { format } from "../math/place-value";
import {
	additionColumns,
	COLUMN_NAMES,
	COLUMN_WORDS,
} from "./written-addition";

export function columnBoard(
	columns: { a: number; b: number; shown?: number; extra?: number[] },
	work: readonly string[] = [],
	solved = false,
	interactive = true,
): string {
	const { a, b, shown } = columns,
		model = additionColumns(a, b, columns.extra);
	const places = Array.from(
		{ length: model.width },
		(_, i) => model.width - i - 1,
	);
	const staticError = shown !== undefined && !interactive && !solved;
	const operand = (n: number, col: number) =>
		col < String(n).length ? String(Math.floor(n / 10 ** col) % 10) : "";
	const field = (index: number, col: number, carry = false) => {
		const raw = work[index] ?? "",
			value = (carry ? /^[0-3]$/ : /^[0-9]$/).test(raw) ? raw : "";
		const label = carry
			? `Übertrag zu ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})`
			: `Ergebnis ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})`;
		return solved
			? `<output aria-label="${label}">${value || "0"}</output>`
			: `<input id="column-${index}" data-action="forest-column" data-col="${index}" data-carry="${carry}" tabindex="${index === 0 ? 0 : -1}" aria-describedby="column-input-note" aria-label="${label}" type="text" inputmode="numeric" maxlength="1" autocomplete="off" spellcheck="false" pattern="${carry ? "[0-3]" : "[0-9]"}" value="${value}">`;
	};
	return `<div class="column-workshop"><p class="column-direction">Beginne rechts bei E. Die kleinen Überträge gehören jeweils eine Spalte nach links.</p><div class="column-scroll" tabindex="0" role="region" aria-label="Rechentafel, bei Bedarf seitlich verschiebbar"><table class="column-board"><caption>${[a, b, ...(columns.extra ?? [])].map(format).join(" + ")}</caption><thead><tr><th scope="col">Stelle</th>${places.map((col) => `<th scope="col"><abbr title="${COLUMN_WORDS[col]}">${COLUMN_NAMES[col]}</abbr></th>`).join("")}</tr></thead><tbody>${[a, b, ...(columns.extra ?? [])].map((n, i) => `<tr><th scope="row">${i ? "+ " : ""}${i + 1}. Zahl</th>${places.map((col) => `<td>${operand(n, col)}</td>`).join("")}</tr>`).join("")}${staticError ? "" : `<tr class="carry-row"><th scope="row">Übertrag</th>${places.map((col) => `<td>${col === 0 ? '<span aria-hidden="true">–</span><span class="visually-hidden">Kein Übertrag zu den Einern</span>' : field(6 + col, col, true)}</td>`).join("")}</tr>`}<tr class="column-result"><th scope="row">${staticError ? "Milos Summe" : "Ergebnis"}</th>${places.map((col) => `<td>${staticError ? operand(shown, col) : field(col, col)}</td>`).join("")}</tr></tbody></table></div>${staticError ? "" : solved ? '<p class="fine-print">Große Tafeln kannst du seitlich verschieben.</p>' : '<p class="fine-print" id="column-input-note">Pro Feld eine Ziffer. Ohne Übertrag darf die kleine Zelle leer bleiben. Mit der Tabulatortaste gehst du in Rechenreihenfolge weiter. Große Tafeln kannst du seitlich verschieben.</p><p class="fine-print" id="column-input-error" role="status"></p>'}</div>`;
}
