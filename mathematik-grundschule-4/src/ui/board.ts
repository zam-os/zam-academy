import {
	LETTERS,
	NAMES,
	WEIGHTS,
	MAX_NUMBER,
	format,
	digits,
	type Counts,
} from "../math/place-value";

export function board(
	counts: Counts,
	editable = false,
	highlight?: number,
	exchanges = false,
	showDigits = true,
	places?: number,
): string {
	const width =
		places ??
		Math.max(
			4,
			counts.reduce((last, n, i) => (n > 0 ? i + 1 : last), 0),
		);
	const columns = Array.from({ length: width }, (_, i) => width - i - 1);
	return `<div class="place-board${width >= 6 ? " wide" : ""}" role="group" aria-label="Stellenwerttafel"><div class="place-columns" style="--columns:${width}">${columns
		.map((i) => {
			const count = counts[i] ?? 0;
			return `<section class="place-column column-${i}${highlight === i ? " highlighted" : ""}"><h3><abbr title="${NAMES[i]}">${LETTERS[i]}</abbr><span>${NAMES[i]}</span></h3><div class="pieces" aria-label="${count} ${NAMES[i]}">${Array.from({ length: Math.min(count, 18) }, () => `<span class="block block-${Math.min(i, 3)}" aria-hidden="true"></span>`).join("")}${count === 0 ? '<span class="empty-column" aria-hidden="true">—</span>' : ""}${count > 18 ? `<span class="more-pieces">+ ${count - 18} weitere</span>` : ""}</div>${showDigits ? `<div class="count">${count}</div>` : ""}${editable ? `<div class="count-controls"><button data-action="decrease" data-col="${i}" aria-label="Einen ${NAMES[i]} wegnehmen" ${count === 0 ? "disabled" : ""}>−</button><button data-action="increase" data-col="${i}" aria-label="Einen ${NAMES[i]} dazulegen" ${count >= 9 || counts.reduce((s, n, j) => s + n * WEIGHTS[j], 0) + WEIGHTS[i] > MAX_NUMBER ? "disabled" : ""}>+</button></div>` : ""}</section>`;
		})
		.join(
			"",
		)}</div><p class="board-legend">${Array.from({ length: width }, (_, i) => `${LETTERS[i]} ${NAMES[i]}`).join(" · ")}</p>${exchanges ? `<div class="exchange-choices">${columns.flatMap((i) => [i < 6 ? `<button data-action="bundle" data-col="${i}" ${(counts[i] ?? 0) < 10 ? "disabled" : ""} aria-label="Zehn ${NAMES[i]} bündeln">10 ${LETTERS[i]} → 1 ${LETTERS[i + 1]}</button>` : "", i > 0 ? `<button data-action="unbundle" data-col="${i}" ${!counts[i] ? "disabled" : ""} aria-label="Einen ${NAMES[i]} entbündeln">1 ${LETTERS[i]} → 10 ${LETTERS[i - 1]}</button>` : ""]).join("")}</div>` : ""}</div>`;
}

/** Keep thousands grouping while counting only digits to identify a decimal position. */
export function markedNumeral(value: number, column: number): string {
	let position = String(value).length;
	const text = format(value)
		.split("")
		.map((char) => {
			if (!/[0-9]/.test(char)) return char;
			position -= 1;
			return position === column ? `<mark>${char}</mark>` : char;
		})
		.join("");
	return `<p class="digit-numeral" aria-label="${format(value)}, markierte Ziffer ${digits(value)[column]}">${text}</p>`;
}
