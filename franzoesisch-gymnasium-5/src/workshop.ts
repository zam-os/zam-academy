import { esc } from "./practice";
import { renderFranceMap } from "./france-map";
import type { Lesson, Workshop } from "./types";
export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}
export function numberParts(value: number): number[] {
	const n = Math.max(0, Math.min(100, Math.round(value)));
	if (n === 100) return [100];
	if (n >= 80) return [20, 20, 20, 20, ...(n > 80 ? [n - 80] : [])];
	if (n >= 70) return [60, n - 60];
	if (n >= 20 && n % 10) return [Math.floor(n / 10) * 10, n % 10];
	return [n];
}
export function clockLabel(hour: number, minute: number): string {
	const names = [
		"zéro",
		"une",
		"deux",
		"trois",
		"quatre",
		"cinq",
		"six",
		"sept",
		"huit",
		"neuf",
		"dix",
		"onze",
		"douze",
		"treize",
		"quatorze",
		"quinze",
		"seize",
		"dix-sept",
		"dix-huit",
		"dix-neuf",
		"vingt",
		"vingt et une",
		"vingt-deux",
		"vingt-trois",
	];
	const h = Math.max(0, Math.min(23, Math.round(hour)));
	const m = [0, 15, 30, 45].includes(minute) ? minute : 0;
	const base =
		h === 0
			? "minuit"
			: h === 12
				? "midi"
				: `${names[h]} ${h === 1 ? "heure" : "heures"}`;
	return `${base}${m ? ` ${m === 15 ? "quinze" : m === 30 ? "trente" : "quarante-cinq"}` : ""}`;
}
function illustration(lesson: Lesson): string {
	if (["f5-france", "f5-paris", "f5-bretagne"].includes(lesson.id))
		return renderFranceMap();
	if (lesson.id === "f5-maison")
		return `<figure class="neighbourhood"><span>← à gauche<br><b>⌂</b><br>la maison</span><span>devant ↓<br>🐈<br>le chat</span><span>à droite →<br><b>♧</b><br>le parc</span></figure>`;
	if (lesson.workshop.kind === "clock")
		return `<div class="clock-explorer"><svg viewBox="0 0 220 220" role="img" aria-label="Uhr zum Einstellen"><circle cx="110" cy="110" r="95" class="clock-face"/>${Array.from({ length: 12 }, (_, i) => `<text x="${110 + 78 * Math.sin((i * Math.PI) / 6)}" y="${115 - 78 * Math.cos((i * Math.PI) / 6)}" text-anchor="middle">${i || 12}</text>`).join("")}<line id="hour-hand" x1="110" y1="110" x2="110" y2="58"/><line id="minute-hand" x1="110" y1="110" x2="110" y2="30"/><circle cx="110" cy="110" r="5"/></svg><div><label for="clock-hour">Stunde (24 Stunden)</label><input id="clock-hour" type="range" min="0" max="23" value="15"><label for="clock-minute">Minuten</label><select id="clock-minute"><option value="0">00</option><option value="15">15</option><option value="30" selected>30</option><option value="45">45</option></select><p id="clock-readout" lang="fr" aria-live="polite"></p></div></div>`;
	if (lesson.id === "f5-nombres")
		return `<div class="number-explorer"><label for="number-slider">Zahl zerlegen: 0 bis 100</label><input id="number-slider" type="range" min="0" max="100" value="81"><div id="number-parts" aria-live="polite"></div><p class="small">Die Bausteine zeigen die Zahlbildung in Frankreich, etwa 60 + 11 und 20 + 20 + 20 + 20 + 1.</p></div>`;
	return "";
}
export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Verbinde die Bausteine. Beobachte, was sich ändert, und erreiche die drei Ziele. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals.map((goal, i) => `<div class="construction-row" data-goal="${i}"><span class="goal-number" aria-hidden="true">${i + 1}</span><div><label for="workshop-${i}">${esc(goal.label)}</label><div class="word-chain"><span class="word-piece" lang="fr">${esc(goal.before)}</span><span aria-hidden="true">→</span><select id="workshop-${i}" data-workshop="${i}"><option value="">Baustein wählen…</option>${[...goal.options.slice(i + 1), ...goal.options.slice(0, i + 1)].map((option) => `<option lang="fr" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece" lang="fr">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`).join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
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
		});
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
		};
		number.addEventListener("input", update);
		update();
	}
}
