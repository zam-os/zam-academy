import { esc } from "./practice";
import { renderFranceMap } from "./france-map";
import { bindExplorers, renderExplorer } from "./explorers";
import type { Lesson, Workshop } from "./types";
export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}
function illustration(lesson: Lesson): string {
	if (lesson.id.endsWith("-ville") || lesson.id.endsWith("-bretagne"))
		return renderFranceMap();
	return renderExplorer(lesson);
}
/**
 * Stable option order keyed to lesson and goal: the answer is stored first, so
 * a rotation by goal index alone would put it at the same place in every lesson.
 */
export function workshopOptions(lesson: Lesson, goal: number): string[] {
	const options = lesson.workshop.goals[goal].options;
	let seed = 2166136261;
	for (const character of `${lesson.id}:${goal}`)
		seed = Math.imul(seed ^ character.charCodeAt(0), 16777619) >>> 0;
	const offset = seed % options.length;
	return [...options.slice(offset), ...options.slice(0, offset)];
}
export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Wähle in jeder Zeile den passenden Baustein. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals.map((goal, i) => `<div class="construction-row" data-goal="${i}"><div><label for="workshop-${i}">${esc(goal.label)}</label><div class="word-chain">${goal.before ? `<span class="word-piece" lang="fr">${esc(goal.before)}</span>` : ""}<select id="workshop-${i}" data-workshop="${i}"><option value="">Baustein wählen…</option>${workshopOptions(lesson, i).map((option) => `<option lang="fr" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="${/^[.!?]$/.test(goal.after) ? "sentence-punctuation" : "word-piece"}" lang="fr">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`).join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}
export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	bindExplorers(container);
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
}
