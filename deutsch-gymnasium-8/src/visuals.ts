import { renderLanguageModel, renderModelGoals } from "./language-model";
import { esc } from "./practice";
import type { Lesson } from "./types";

export function renderVisual(lesson: Lesson): string {
	return `<section class="panel visual-workshop" aria-labelledby="visual-title"><h2 id="visual-title">${esc(lesson.visual.title)}</h2><p class="small">Wähle eine der drei Varianten und vergleiche, was sich verändert.</p><div class="diagram" data-model-container>${renderLanguageModel(lesson)}</div><div class="visual-steps">${lesson.visual.steps.map((step, i) => `<button type="button" class="visual-step" data-visual-step="${i}" aria-pressed="false" aria-controls="visual-detail"><span class="step-label">${esc(step.label)}</span><strong>${esc(step.text)}</strong></button>`).join("")}</div><p id="visual-detail" role="status">Wähle eine Variante aus.</p>${renderModelGoals(lesson)}</section>`;
}

export function bindVisual(root: HTMLElement, lesson: Lesson): void {
	const explored = new Set<number>();
	const buttons =
		root.querySelectorAll<HTMLButtonElement>("[data-visual-step]");
	for (const [index, button] of Array.from(buttons).entries()) {
		button.addEventListener("click", () => {
			const step = lesson.visual.steps[index];
			if (!step) return;
			explored.add(index);
			const goalPanel = root.querySelector<HTMLElement>("[data-model-goals]");
			if (goalPanel) goalPanel.outerHTML = renderModelGoals(lesson, explored);
			const diagram = root.querySelector<HTMLElement>("[data-model-container]");
			if (diagram) diagram.innerHTML = renderLanguageModel(lesson, index);
			buttons.forEach((b) =>
				b.setAttribute("aria-pressed", String(b === button)),
			);
			const detail = root.querySelector<HTMLElement>("#visual-detail");
			if (detail) detail.textContent = `${step.label}: ${step.detail}`;
		});
	}
}
