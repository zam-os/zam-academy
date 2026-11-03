import { format } from "../math/place-value";
import { COLUMN_NAMES, COLUMN_WORDS } from "./written-addition";
import {
	freshSubtractionWork,
	subtractionColumns,
	unbundleSubtraction,
	type SubtractionWork,
} from "./written-subtraction";

export function subtractionBoard(
	operands: { a: number; b: number; shown?: number },
	saved: SubtractionWork | null = null,
	solved = false,
): string {
	const { a, b, shown } = operands,
		work = saved ?? freshSubtractionWork(a);
	const { width } = subtractionColumns(a, b);
	const places = Array.from({ length: width }, (_, i) => width - i - 1);
	const operand = (n: number, col: number) =>
		col < String(n).length ? Math.floor(n / 10 ** col) % 10 : "";
	const field = (col: number) =>
		solved
			? `<output aria-label="Ergebnis ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})">${work.result[col] || "0"}</output>`
			: `<input id="subtraction-${col}" data-action="forest-subtract-digit" data-col="${col}" tabindex="${col === 0 ? 0 : -1}" aria-describedby="subtraction-input-note" aria-label="Ergebnis ${COLUMN_WORDS[col]} (${COLUMN_NAMES[col]})" type="text" inputmode="numeric" maxlength="1" pattern="[0-9]" autocomplete="off" spellcheck="false" value="${/^[0-9]$/.test(work.result[col]) ? work.result[col] : ""}">`;
	return `<div class="column-workshop"><p class="column-direction">Beginne rechts bei E. Entbündle bei Bedarf in der oberen Zahl: ein größeres Bündel wird zu zehn kleineren. Die Zahl behält ihren Wert.</p>${shown === undefined ? "" : `<p>Milos Ergebnis zum Überprüfen: <strong>${format(shown)}</strong></p>`}<div class="column-scroll" tabindex="0" role="region" aria-label="Subtraktionstafel, bei Bedarf seitlich verschiebbar"><table class="column-board subtraction-board"><caption>${format(a)} − ${format(b)}</caption><thead><tr><th scope="col">Stelle</th>${places.map((col) => `<th scope="col"><abbr title="${COLUMN_WORDS[col]}">${COLUMN_NAMES[col]}</abbr></th>`).join("")}</tr></thead><tbody><tr><th scope="row">Obere Zahl</th>${places.map((col) => `<td>${operand(a, col)}</td>`).join("")}</tr><tr class="regroup-row"><th scope="row">Jetzt oben</th>${places.map((col) => `<td><output aria-label="Jetzt ${work.bundles[col]} ${COLUMN_WORDS[col]}">${work.bundles[col]}</output>${!solved && col > 0 ? `<button class="unbundle-button" data-action="forest-unbundle" data-col="${col}" aria-label="1 ${COLUMN_NAMES[col]} in 10 ${COLUMN_NAMES[col - 1]} tauschen" ${unbundleSubtraction(work.bundles, col) ? "" : "disabled"}>1 ${COLUMN_NAMES[col]}<br>→ 10 ${COLUMN_NAMES[col - 1]}</button>` : ""}</td>`).join("")}</tr><tr><th scope="row">− abziehen</th>${places.map((col) => `<td>${operand(b, col)}</td>`).join("")}</tr><tr class="column-result"><th scope="row">Ergebnis</th>${places.map((col) => `<td>${field(col)}</td>`).join("")}</tr></tbody></table></div>${solved ? "" : '<button class="text-button" data-action="forest-reset-bundles">Bündel zurücksetzen</button><p class="fine-print" id="subtraction-input-note">Die Knöpfe tauschen Bündel; die obere Zahl bleibt gleich. Pro Ergebnisfeld eine Ziffer, auch bei 0. Mit Tab gehst du von rechts nach links. Große Tafeln kannst du seitlich verschieben.</p><p class="fine-print" id="subtraction-input-error" role="status"></p>'}</div>`;
}
