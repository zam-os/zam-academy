import { bindLiveModel, renderLiveModel } from "./models";
import { esc } from "./practice";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

export function renderWorkshop(lesson: Lesson): string {
	const modelHtml = lesson.workshop.liveModel
		? renderLiveModel(lesson.workshop.liveModel)
		: "";
	return `<section class="panel workshop" aria-labelledby="workshop-title">
		<h2 id="workshop-title">Deine Entdeckerwerkstatt</h2>
		<p>Verbinde die Bausteine, prüfe Formen oder Zusammenhänge und erreiche alle drei Ziele. Du kannst jede Auswahl beliebig ändern.</p>
		${modelHtml}
		<div class="construction">
			${lesson.workshop.goals
				.map(
					(goal, i) => `<div class="construction-row" data-goal="${i}">
						<span class="goal-number" aria-hidden="true">${i + 1}</span>
						<div>
							<label for="workshop-${i}">${esc(goal.label)}</label>
							<div class="word-chain">
								<span class="word-piece">${esc(goal.before.replace(/\s*→\s*$/, ""))}</span>
								<span aria-hidden="true">→</span>
								<select id="workshop-${i}" data-workshop="${i}">
									<option value="">Baustein wählen …</option>
									${[...goal.options.slice(i + 1), ...goal.options.slice(0, i + 1)]
										.map(
											(option) =>
												`<option value="${esc(option)}">${esc(option)}</option>`,
										)
										.join("")}
								</select>
								${goal.after ? `<span class="word-piece">${esc(goal.after)}</span>` : ""}
							</div>
							<p class="goal-feedback small" role="status">Ziel noch offen.</p>
						</div>
					</div>`,
				)
				.join("")}
		</div>
		<p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p>
	</section>`;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	if (lesson.workshop.liveModel) {
		bindLiveModel(lesson.workshop.liveModel, container);
	}
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
							? "Noch offen. Vergleiche den Baustein mit der Erklärung, dem Schaubild und dem Material."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});
}
