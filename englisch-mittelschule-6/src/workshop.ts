import { esc } from "./practice";
import {
	renderTownMap,
	renderUkCitiesMap,
	renderUsaMap,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

const ONES = [
	"zero",
	"one",
	"two",
	"three",
	"four",
	"five",
	"six",
	"seven",
	"eight",
	"nine",
	"ten",
	"eleven",
	"twelve",
	"thirteen",
	"fourteen",
	"fifteen",
	"sixteen",
	"seventeen",
	"eighteen",
	"nineteen",
];
const TENS = [
	"",
	"",
	"twenty",
	"thirty",
	"forty",
	"fifty",
	"sixty",
	"seventy",
	"eighty",
	"ninety",
];

/** Decompose any number from 0 to 1000 into hundreds, tens and ones. */
export function numberParts(value: number): number[] {
	const n = Math.max(0, Math.min(1000, Math.round(value)));
	if (n === 0) return [0];
	if (n === 1000) return [1000];
	const parts: number[] = [];
	const hundreds = Math.floor(n / 100) * 100;
	const rem = n % 100;
	if (hundreds) parts.push(hundreds);
	if (rem > 0) {
		if (rem >= 20 && rem % 10) {
			parts.push(Math.floor(rem / 10) * 10, rem % 10);
		} else {
			parts.push(rem);
		}
	}
	return parts;
}

/** British English number words from 0 to 1000 (using 'and' after hundreds). */
export function numberWords(value: number): string {
	const n = Math.max(0, Math.min(1000, Math.round(value)));
	if (n === 1000) return "one thousand";
	if (n === 0) return "zero";
	const twoDigit = (x: number): string => {
		if (x < 20) return ONES[x];
		const tens = Math.floor(x / 10);
		const ones = x % 10;
		return ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens];
	};
	if (n < 100) return twoDigit(n);
	const hundreds = Math.floor(n / 100);
	const rem = n % 100;
	return rem
		? `${ONES[hundreds]} hundred and ${twoDigit(rem)}`
		: `${ONES[hundreds]} hundred`;
}

const ORDINAL_ONES = [
	"",
	"first",
	"second",
	"third",
	"fourth",
	"fifth",
	"sixth",
	"seventh",
	"eighth",
	"ninth",
	"tenth",
	"eleventh",
	"twelfth",
	"thirteenth",
	"fourteenth",
	"fifteenth",
	"sixteenth",
	"seventeenth",
	"eighteenth",
	"nineteenth",
];

/** Short ordinal figure with suffix for 1..31 (e.g. 1st, 2nd, 12th, 21st). */
export function ordinalSuffix(value: number): string {
	const n = Math.max(1, Math.min(31, Math.round(value)));
	if (n >= 11 && n <= 13) return `${n}th`;
	const last = n % 10;
	if (last === 1) return `${n}st`;
	if (last === 2) return `${n}nd`;
	if (last === 3) return `${n}rd`;
	return `${n}th`;
}

/** English ordinal word for 1..31 (first .. thirty-first). */
export function ordinalWord(value: number): string {
	const n = Math.max(1, Math.min(31, Math.round(value)));
	if (n < 20) return ORDINAL_ONES[n];
	if (n === 20) return "twentieth";
	if (n === 30) return "thirtieth";
	const tens = Math.floor(n / 10);
	const ones = n % 10;
	return `${TENS[tens]}-${ORDINAL_ONES[ones]}`;
}

export function britishDateSpoken(day: number, month: string): string {
	return `the ${ordinalWord(day)} of ${month}`;
}

/**
 * Germanic comparison of regular monosyllabic adjectives (tall/short) for Grade 6 Mittelschule.
 * Never emits Romance more/most forms.
 */
export function comparisonOutput(
	heightA: number,
	heightB: number,
): { en: string; de: string } {
	const a = Math.max(10, Math.min(100, Math.round(heightA)));
	const b = Math.max(10, Math.min(100, Math.round(heightB)));
	if (a === b) {
		return {
			en: `Tower A (${a} m) is as tall as Tower B (${b} m).`,
			de: "Gleichstand: Bei gleicher Höhe verwendest du as + Grundform + as.",
		};
	}
	if (a > b) {
		return {
			en: `Tower A (${a} m) is taller than Tower B (${b} m). Tower A is the tallest.`,
			de: "Komparativ mit -er + than, Superlativ mit the + -est.",
		};
	}
	return {
		en: `Tower B (${b} m) is taller than Tower A (${a} m). Tower A is shorter than Tower B.`,
		de: "Beide Vergleichsformen hängen -er an (taller, shorter) und stehen vor than.",
	};
}

function illustration(lesson: Lesson): string {
	if (lesson.mapKind === "uk") return renderUkCitiesMap();
	if (lesson.mapKind === "usa") return renderUsaMap();
	if (lesson.mapKind === "town") return renderTownMap();
	if (lesson.workshop.kind === "number")
		return `<div class="number-explorer"><label for="number-slider">Zahl zerlegen: 0 bis 1000</label><input id="number-slider" type="range" min="0" max="1000" value="347"><div id="number-parts" aria-live="polite"></div><p id="number-words" lang="en" aria-live="polite"></p><p class="small">Nach hundred folgt im britischen Englisch and vor Zehnern und Einern: three hundred and forty-seven.</p></div>`;
	if (lesson.workshop.kind === "ordinal")
		return `<div class="ordinal-explorer"><div class="explorer-row"><div><label for="ordinal-slider">Tag im Monat: 1 bis 31</label><input id="ordinal-slider" type="range" min="1" max="31" value="14"></div><div><label for="ordinal-month">Monat</label><select id="ordinal-month"><option>January</option><option>February</option><option>March</option><option>April</option><option selected>May</option><option>June</option><option>July</option><option>August</option><option>September</option><option>October</option><option>November</option><option>December</option></select></div></div><div class="ordinal-readout"><span id="ordinal-figure" class="number-part" lang="en"></span><span id="ordinal-word" lang="en" aria-live="polite"></span></div><p id="ordinal-date" lang="en" aria-live="polite"></p><p class="small">Achte auf die Ausnahmen: first (1st), second (2nd), third (3rd), fifth (5th), eighth (8th), ninth (9th), twelfth (12th) und -ieth bei 20th/30th.</p></div>`;
	if (lesson.workshop.kind === "compare")
		return `<div class="compare-explorer"><div class="explorer-row"><div><label for="compare-a">Tower A: <span id="compare-a-val">65 m</span></label><input id="compare-a" type="range" min="10" max="100" value="65"></div><div><label for="compare-b">Tower B: <span id="compare-b-val">40 m</span></label><input id="compare-b" type="range" min="10" max="100" value="40"></div></div><svg viewBox="0 0 340 140" role="img" aria-label="Balkenvergleich von Tower A und Tower B"><line x1="20" y1="120" x2="320" y2="120" class="compare-baseline"/><rect id="bar-a" x="75" y="55" width="60" height="65" rx="6" class="compare-bar-a"/><rect id="bar-b" x="205" y="80" width="60" height="40" rx="6" class="compare-bar-b"/><text x="105" y="136" text-anchor="middle">Tower A</text><text x="235" y="136" text-anchor="middle">Tower B</text></svg><p id="compare-en" lang="en" aria-live="polite"></p><p id="compare-de" class="small" aria-live="polite"></p></div>`;
	return "";
}

export function renderWorkshop(lesson: Lesson): string {
	const mode = lesson.workshop.mode ?? "select";
	const useChips = mode === "chips" || mode === "order" || mode === "hotspot";
	const hint =
		mode === "order"
			? "Klicke die passende Wortfolge an und baue den Satz Schritt für Schritt zusammen."
			: mode === "chips"
				? "Wähle die passende Zuordnungskarte per Klick aus."
				: mode === "hotspot"
					? "Erkunde das Bild bzw. die Karte und klicke den passenden Baustein an."
					: "Wähle passende Bausteine aus, prüfe das Ergebnis und erreiche alle drei Ziele. Du kannst jede Auswahl ändern.";
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>${hint}</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals
		.map((goal, i) => {
			const rotated = [
				...goal.options.slice(i + 1),
				...goal.options.slice(0, i + 1),
			];
			const control = useChips
				? `<input type="hidden" id="workshop-${i}" data-workshop="${i}" value=""><span class="word-slot" data-slot="${i}" lang="en" aria-live="polite">___</span>`
				: `<select id="workshop-${i}" data-workshop="${i}"><option value="">Baustein wählen…</option>${rotated.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>`;
			const chipsHtml = useChips
				? `<div class="chip-group" role="group" aria-label="${esc(goal.label)}">${rotated.map((option) => `<button type="button" class="chip-option" data-goal-chip="${i}" data-value="${esc(option)}" aria-pressed="false" lang="en">${esc(option)}</button>`).join("")}</div>`
				: "";
			return `<div class="construction-row" data-goal="${i}"><span class="goal-number" aria-hidden="true">${i + 1}</span><div><label for="workshop-${i}">${esc(goal.label)}</label><div class="word-chain">${goal.before ? `<span class="word-piece" lang="en">${esc(goal.before)}</span><span aria-hidden="true">→</span>` : ""}${control}${goal.after ? `<span class="word-piece" lang="en">${esc(goal.after)}</span>` : ""}</div>${chipsHtml}<p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [
		...container.querySelectorAll<HTMLSelectElement | HTMLInputElement>(
			"[data-workshop]",
		),
	];
	const evaluate = () => {
		const reached = workshopGoals(
			lesson.workshop,
			inputs.map((entry) => entry.value),
		);
		container
			.querySelectorAll<HTMLElement>("[data-goal]")
			.forEach((row, i) => {
				row.dataset.reached = String(reached[i]);
				row.querySelector(".goal-feedback")!.textContent = reached[i]
					? `✓ ${lesson.workshop.goals[i].explanation}`
					: inputs[i].value
						? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
						: "Ziel noch offen.";
			});
		const count = reached.filter(Boolean).length;
		container.querySelector("#workshop-status")!.textContent =
			`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
		if (count === 3) complete();
	};
	for (const input of inputs) input.addEventListener("change", evaluate);
	for (const chip of container.querySelectorAll<HTMLButtonElement>(
		"[data-goal-chip]",
	)) {
		chip.addEventListener("click", () => {
			const goalIndex = Number(chip.dataset.goalChip);
			const value = chip.dataset.value ?? "";
			const target = inputs[goalIndex];
			if (!target) return;
			target.value = value;
			for (const sibling of container.querySelectorAll<HTMLButtonElement>(
				`[data-goal-chip="${goalIndex}"]`,
			)) {
				sibling.setAttribute("aria-pressed", String(sibling === chip));
			}
			const slot = container.querySelector<HTMLElement>(
				`[data-slot="${goalIndex}"]`,
			);
			if (slot) {
				slot.textContent = value;
				slot.dataset.filled = "true";
			}
			evaluate();
		});
	}
	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-map-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			for (const other of container.querySelectorAll("[data-map-focus]"))
				other.setAttribute(
					"aria-pressed",
					String(other === button && selected),
				);
			for (const layer of container.querySelectorAll<SVGGElement>(
				"[data-map-layer]",
			))
				layer.style.opacity =
					selected && layer.dataset.mapLayer !== button.dataset.mapFocus
						? "0.18"
						: "1";
		});

	const number = container.querySelector<HTMLInputElement>("#number-slider");
	if (number) {
		const update = () => {
			const n = Number(number.value);
			container.querySelector("#number-parts")!.innerHTML =
				`<strong>${n} = </strong>${numberParts(n)
					.map((part) => `<span class="number-part">${part}</span>`)
					.join('<span aria-hidden="true"> + </span>')}`;
			container.querySelector("#number-words")!.textContent =
				`Englisch: ${numberWords(n)}`;
		};
		number.addEventListener("input", update);
		update();
	}

	const ordinalSlider = container.querySelector<HTMLInputElement>("#ordinal-slider");
	const ordinalMonth = container.querySelector<HTMLSelectElement>("#ordinal-month");
	if (ordinalSlider && ordinalMonth) {
		const update = () => {
			const day = Number(ordinalSlider.value);
			const month = ordinalMonth.value;
			container.querySelector("#ordinal-figure")!.textContent = ordinalSuffix(day);
			container.querySelector("#ordinal-word")!.textContent = ordinalWord(day);
			container.querySelector("#ordinal-date")!.textContent =
				`Gesprochenes Datum (UK): ${britishDateSpoken(day, month)}`;
		};
		ordinalSlider.addEventListener("input", update);
		ordinalMonth.addEventListener("change", update);
		update();
	}

	const compareA = container.querySelector<HTMLInputElement>("#compare-a");
	const compareB = container.querySelector<HTMLInputElement>("#compare-b");
	if (compareA && compareB) {
		const update = () => {
			const a = Number(compareA.value);
			const b = Number(compareB.value);
			container.querySelector("#compare-a-val")!.textContent = `${a} m`;
			container.querySelector("#compare-b-val")!.textContent = `${b} m`;
			const barA = container.querySelector("#bar-a")!;
			const barB = container.querySelector("#bar-b")!;
			barA.setAttribute("y", String(120 - a));
			barA.setAttribute("height", String(a));
			barB.setAttribute("y", String(120 - b));
			barB.setAttribute("height", String(b));
			const out = comparisonOutput(a, b);
			container.querySelector("#compare-en")!.textContent = out.en;
			container.querySelector("#compare-de")!.textContent = out.de;
		};
		compareA.addEventListener("input", update);
		compareB.addEventListener("input", update);
		update();
	}
}
