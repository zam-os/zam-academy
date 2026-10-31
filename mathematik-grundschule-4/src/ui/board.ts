import { LETTERS, NAMES, WEIGHTS, type Counts } from "../math/place-value";

export function board(
	counts: Counts,
	editable = false,
	highlight?: number,
	exchanges = false,
): string {
	return `<div class="place-board" role="group" aria-label="Stellenwerttafel"><div class="place-columns">${[
		3, 2, 1, 0,
	]
		.map(
			(
				i,
			) => `<section class="place-column column-${i}${highlight === i ? " highlighted" : ""}">
    <h3><abbr title="${NAMES[i]}">${LETTERS[i]}</abbr><span>${NAMES[i]}</span></h3>
    <div class="pieces" aria-label="${counts[i]} ${NAMES[i]}">${Array.from({ length: Math.min(counts[i], 18) }, () => `<span class="block block-${i}" aria-hidden="true"></span>`).join("")}${counts[i] === 0 ? '<span class="empty-column" aria-hidden="true">—</span>' : ""}${counts[i] > 18 ? `<span class="more-pieces">+ ${counts[i] - 18} weitere</span>` : ""}</div>
    <div class="count" aria-label="${counts[i]} ${NAMES[i]}">${counts[i]}</div>
    ${editable ? `<div class="count-controls"><button data-action="decrease" data-col="${i}" aria-label="Einen ${NAMES[i]} wegnehmen" ${counts[i] === 0 ? "disabled" : ""}>−</button><button data-action="increase" data-col="${i}" aria-label="Einen ${NAMES[i]} dazulegen" ${counts[i] >= 9 || counts.reduce((s, n, j) => s + n * WEIGHTS[j], 0) + WEIGHTS[i] > 9999 ? "disabled" : ""}>+</button></div>` : ""}
    ${exchanges ? `<div class="exchange-controls">${i < 3 ? `<button data-action="bundle" data-col="${i}" ${counts[i] < 10 ? "disabled" : ""} aria-label="Zehn ${NAMES[i]} bündeln">10 bündeln</button>` : ""}${i > 0 ? `<button data-action="unbundle" data-col="${i}" ${counts[i] === 0 ? "disabled" : ""} aria-label="Einen ${NAMES[i]} entbündeln">1 entbündeln</button>` : ""}</div>` : ""}
    </section>`,
		)
		.join(
			"",
		)}</div><p class="board-legend">E = Einer · Z = Zehner · H = Hunderter · T = Tausender</p></div>`;
}
