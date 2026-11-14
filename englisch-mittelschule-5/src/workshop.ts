import { esc } from "./practice";
import { renderUkMap } from "./uk-map";
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

export function numberParts(value: number): number[] {
	const n = Math.max(0, Math.min(100, Math.round(value)));
	if (n === 100) return [100];
	if (n >= 20 && n % 10) return [Math.floor(n / 10) * 10, n % 10];
	return [n];
}

export function numberWords(value: number): string {
	const n = Math.max(0, Math.min(100, Math.round(value)));
	if (n === 100) return "one hundred";
	if (n < 20) return ONES[n];
	const tens = Math.floor(n / 10);
	const ones = n % 10;
	return ones ? `${TENS[tens]}-${ONES[ones]}` : TENS[tens];
}

const HOUR_WORDS = [
	"twelve",
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
];

export function clockLabel(hour: number, minute: number): string {
	const h24 = Math.max(0, Math.min(23, Math.round(hour)));
	const m = [0, 15, 30, 45].includes(minute) ? minute : 0;
	const h12 = h24 % 12 || 12;
	const next12 = (h24 + 1) % 12 || 12;
	if (m === 0) return `${HOUR_WORDS[h12]} o'clock`;
	if (m === 15) return `quarter past ${HOUR_WORDS[h12]}`;
	if (m === 30) return `half past ${HOUR_WORDS[h12]}`;
	return `quarter to ${HOUR_WORDS[next12]}`;
}

function illustration(lesson: Lesson): string {
	if (lesson.id === "e5m-british-isles") return renderUkMap();
	if (lesson.workshop.kind === "clock")
		return `<div class="clock-explorer"><svg viewBox="0 0 220 220" role="img" aria-label="Uhr zum Einstellen"><circle cx="110" cy="110" r="95" class="clock-face"/>${Array.from({ length: 12 }, (_, i) => `<text x="${110 + 78 * Math.sin((i * Math.PI) / 6)}" y="${115 - 78 * Math.cos((i * Math.PI) / 6)}" text-anchor="middle">${i || 12}</text>`).join("")}<line id="hour-hand" x1="110" y1="110" x2="110" y2="58"/><line id="minute-hand" x1="110" y1="110" x2="110" y2="30"/><circle cx="110" cy="110" r="5"/></svg><div><label for="clock-hour">Stunde (24 Stunden)</label><input id="clock-hour" type="range" min="0" max="23" value="15"><label for="clock-minute">Minuten</label><select id="clock-minute"><option value="0">00</option><option value="15">15</option><option value="30" selected>30</option><option value="45">45</option></select><p id="clock-readout" lang="en" aria-live="polite"></p></div></div>`;
	if (lesson.workshop.kind === "number")
		return `<div class="number-explorer"><label for="number-slider">Zahl zerlegen: 0 bis 100</label><input id="number-slider" type="range" min="0" max="100" value="42"><div id="number-parts" aria-live="polite"></div><p id="number-words" lang="en" aria-live="polite"></p><p class="small">Ab 21 verbindest du Zehner und Einer mit Bindestrich: forty-two, ninety-nine.</p></div>`;
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
	const hour = container.querySelector<HTMLInputElement>("#clock-hour"),
		minute = container.querySelector<HTMLSelectElement>("#clock-minute");
	if (hour && minute) {
		const update = () => {
			const h = Number(hour.value),
				m = Number(minute.value);
			container
				.querySelector("#hour-hand")!
				.setAttribute("transform", `rotate(${h * 30 + m / 2} 110 110)`);
			container
				.querySelector("#minute-hand")!
				.setAttribute("transform", `rotate(${m * 6} 110 110)`);
			container.querySelector("#clock-readout")!.textContent =
				`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} · ${clockLabel(h, m)}`;
		};
		hour.addEventListener("input", update);
		minute.addEventListener("change", update);
		update();
	}
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
}
