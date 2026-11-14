import { esc } from "./practice";
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
	return `${names[h]} ${h === 1 ? "heure" : "heures"}${m ? ` ${m === 15 ? "quinze" : m === 30 ? "trente" : "quarante-cinq"}` : ""}`;
}
function franceMap(): string {
	return `<figure class="france-map"><svg viewBox="0 0 600 440" role="img" aria-label="Lernskizze des europäischen Festlands Frankreichs: Städte, Flüsse, Meere und Gebirge. Norden ist oben."><rect width="600" height="440" rx="18" class="sea"/><path class="land" d="M96 116 L52 100 70 80 152 94 176 47 234 64 277 27 317 69 378 88 396 155 443 199 426 272 443 310 377 361 313 343 276 381 218 360 183 316 195 253 154 202 151 145 Z"/><g class="water-labels"><text x="45" y="45">La Manche</text><text x="12" y="245">Atlantique</text><text x="367" y="413">Méditerranée</text><text x="510" y="38">N ↑</text></g><g data-map-layer="rivers" class="map-rivers"><path d="M333 155 Q277 90 220 104 L185 88"/><text x="239" y="91">Seine</text><path d="M342 233 Q290 260 270 176 Q226 161 173 190"/><text x="216" y="178">Loire</text><path d="M367 228 Q350 270 363 345"/><text x="376" y="281">Rhône</text><path d="M278 350 Q256 299 232 290 L222 269"/><text x="154" y="311">Garonne</text></g><g data-map-layer="mountains" class="map-mountains"><path d="M415 234 l-14 27 26 0 Z M423 264 l-14 27 26 0 Z M423 293 l-14 27 26 0 Z M230 350 l-14 22 26 0 Z M257 361 l-14 22 26 0 Z M283 364 l-14 22 26 0 Z"/><text x="452" y="283">Alpes</text><text x="182" y="407">Pyrénées</text></g><g data-map-layer="cities" class="map-cities"><circle cx="270" cy="120" r="5"/><text x="280" y="124">Paris</text><circle cx="365" cy="230" r="5"/><text x="378" y="228">Lyon</text><circle cx="370" cy="344" r="5"/><text x="383" y="350">Marseille</text><circle cx="271" cy="326" r="5"/><text x="279" y="320">Toulouse</text><circle cx="229" cy="276" r="5"/><text x="148" y="272">Bordeaux</text><circle cx="150" cy="127" r="5"/><text x="79" y="157">Rennes</text><text x="52" y="109">Bretagne</text></g></svg><figcaption>Lernskizze · europäisches Festland · nicht maßstäblich. Lage und Flussverlauf sind vereinfacht.</figcaption></figure><div class="map-controls" aria-label="Kartenebenen">${[
		["cities", "Städte"],
		["rivers", "Flüsse"],
		["mountains", "Gebirge"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}
function illustration(lesson: Lesson): string {
	if (["f5-france", "f5-paris", "f5-bretagne"].includes(lesson.id))
		return franceMap();
	if (lesson.id === "f5-maison")
		return `<figure class="neighbourhood"><span>← à gauche<br><b>⌂</b><br>la maison</span><span>devant ↓<br>🐈<br>le chat</span><span>à droite →<br><b>♧</b><br>le parc</span></figure>`;
	if (lesson.workshop.kind === "clock")
		return `<div class="clock-explorer"><svg viewBox="0 0 220 220" role="img" aria-label="Uhr zum Einstellen"><circle cx="110" cy="110" r="95" class="clock-face"/>${Array.from({ length: 12 }, (_, i) => `<text x="${110 + 78 * Math.sin((i * Math.PI) / 6)}" y="${115 - 78 * Math.cos((i * Math.PI) / 6)}" text-anchor="middle">${i || 12}</text>`).join("")}<line id="hour-hand" x1="110" y1="110" x2="110" y2="58"/><line id="minute-hand" x1="110" y1="110" x2="110" y2="30"/><circle cx="110" cy="110" r="5"/></svg><div><label for="clock-hour">Stunde (24 Stunden)</label><input id="clock-hour" type="range" min="0" max="23" value="15"><label for="clock-minute">Minuten</label><select id="clock-minute"><option value="0">00</option><option value="15">15</option><option value="30" selected>30</option><option value="45">45</option></select><p id="clock-readout" lang="fr" aria-live="polite"></p></div></div>`;
	if (lesson.id === "f5-nombres")
		return `<div class="number-explorer"><label for="number-slider">Zahl zerlegen: 0 bis 100</label><input id="number-slider" type="range" min="0" max="100" value="81"><div id="number-parts" aria-live="polite"></div><p class="small">Die Bausteine zeigen die Zahlbildung in Frankreich, etwa 60 + 11 und 4 · 20 + 1.</p></div>`;
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
