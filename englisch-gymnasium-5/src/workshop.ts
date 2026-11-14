import { esc } from "./practice";
import { renderBritishIsles, renderNorthAmerica } from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

const HOURS = [
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
];

export function clockLabel(hour: number, minute: number): string {
	const h = Math.max(0, Math.min(23, Math.round(hour)));
	const m = [0, 15, 30, 45].includes(minute) ? minute : 0;
	const name = HOURS[h % 12];
	const next = HOURS[(h + 1) % 12];
	if (m === 0) {
		if (h === 0) return "midnight";
		return `${name} o'clock`;
	}
	if (m === 15) return `quarter past ${name}`;
	if (m === 30) return `half past ${name}`;
	return `quarter to ${next}`;
}

export function ordinal(value: number): string {
	const n = Math.round(value);
	if (n < 1 || n > 31) return "";
	const suffix =
		n % 100 >= 11 && n % 100 <= 13
			? "th"
			: n % 10 === 1
				? "st"
				: n % 10 === 2
					? "nd"
					: n % 10 === 3
						? "rd"
						: "th";
	return `${n}${suffix}`;
}

function illustration(lesson: Lesson): string {
	if (lesson.id === "e5-uk" || lesson.id === "e5-london") return renderBritishIsles();
	if (lesson.id === "e5-america") return renderNorthAmerica();
	if (lesson.workshop.kind === "clock")
		return `<div class="clock-explorer"><svg viewBox="0 0 220 220" role="img" aria-label="Uhr zum Einstellen"><circle cx="110" cy="110" r="95" class="clock-face"/>${Array.from({ length: 12 }, (_, i) => `<text x="${110 + 78 * Math.sin((i * Math.PI) / 6)}" y="${115 - 78 * Math.cos((i * Math.PI) / 6)}" text-anchor="middle">${i || 12}</text>`).join("")}<line id="hour-hand" x1="110" y1="110" x2="110" y2="58"/><line id="minute-hand" x1="110" y1="110" x2="110" y2="30"/><circle cx="110" cy="110" r="5"/></svg><div><label for="clock-hour">Stunde (24 Stunden)</label><input id="clock-hour" type="range" min="0" max="23" value="15"><label for="clock-minute">Minuten</label><select id="clock-minute"><option value="0">00</option><option value="15">15</option><option value="30" selected>30</option><option value="45">45</option></select><p id="clock-readout" lang="en" aria-live="polite"></p></div></div>`;
	if (lesson.workshop.kind === "number")
		return `<div class="number-explorer"><label for="number-slider">Ordnungszahl für ein Datum: 1 bis 31</label><input id="number-slider" type="range" min="1" max="31" value="22"><p id="ordinal-readout" lang="en" aria-live="polite"></p><p class="small">Die Endung folgt 1st, 2nd, 3rd. 11, 12 und 13 behalten th.</p></div>`;
	return "";
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Verbinde die Bausteine. Beobachte, was sich ändert, und erreiche die drei Ziele. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals
		.map((goal, index) => {
			const options = [
				...goal.options.slice(index + 1),
				...goal.options.slice(0, index + 1),
			];
			return `<div class="construction-row" data-goal="${index}"><span class="goal-number" aria-hidden="true">${index + 1}</span><div><label for="workshop-${index}">${esc(goal.label)}</label><div class="word-chain"><span class="word-piece" lang="en">${esc(goal.before)}</span><span aria-hidden="true">→</span><select id="workshop-${index}" data-workshop="${index}"><option value="">Baustein wählen…</option>${options.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece" lang="en">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [
		...container.querySelectorAll<HTMLSelectElement>("[data-workshop]"),
	];
	for (const input of inputs)
		input.addEventListener("change", () => {
			const reached = workshopGoals(
				lesson.workshop,
				inputs.map((entry) => entry.value),
			);
			container.querySelectorAll<HTMLElement>("[data-goal]").forEach((row, index) => {
				row.dataset.reached = String(reached[index]);
				row.querySelector(".goal-feedback")!.textContent = reached[index]
					? `✓ ${lesson.workshop.goals[index].explanation}`
					: inputs[index].value
						? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
						: "Ziel noch offen.";
			});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});
	for (const button of container.querySelectorAll<HTMLButtonElement>("[data-map-focus]"))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			for (const other of container.querySelectorAll("[data-map-focus]"))
				other.setAttribute("aria-pressed", String(other === button && selected));
			for (const layer of container.querySelectorAll<SVGGElement>("[data-map-layer]"))
				layer.style.opacity =
					selected && layer.dataset.mapLayer !== button.dataset.mapFocus ? "0.18" : "1";
		});
	const hour = container.querySelector<HTMLInputElement>("#clock-hour");
	const minute = container.querySelector<HTMLSelectElement>("#clock-minute");
	if (hour && minute) {
		const update = () => {
			const h = Number(hour.value);
			const m = Number(minute.value);
			container.querySelector("#hour-hand")!.setAttribute("transform", `rotate(${h * 30 + m / 2} 110 110)`);
			container.querySelector("#minute-hand")!.setAttribute("transform", `rotate(${m * 6} 110 110)`);
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
			container.querySelector("#ordinal-readout")!.textContent = ordinal(n);
		};
		number.addEventListener("input", update);
		update();
	}
}
