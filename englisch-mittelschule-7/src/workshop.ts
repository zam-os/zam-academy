import { esc } from "./practice";
import type { Diagram, Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

function renderDiagram(diagram: Diagram): string {
	return `<figure class="learning-diagram"><figcaption>${esc(diagram.title)}</figcaption><ol class="diagram-row">${diagram.tiles.map((tile) => `<li><strong>${esc(tile.label)}</strong><span>${esc(tile.detail)}</span></li>`).join("")}</ol></figure>`;
}

function renderIreland(): string {
	return `<figure class="learning-map">
		<figcaption>Die Insel Irland und Großbritannien · schematisch</figcaption>
		<div class="map-surface" role="img" aria-label="Die Insel Irland liegt westlich von Großbritannien. Nordirland und Belfast liegen im Nordosten der Insel. Dublin liegt weiter südlich an der Ostküste der Republik Irland. Dazwischen liegt die Irische See.">
			<div class="land-shape ireland-shape"></div>
			<div class="land-shape britain-shape"></div>
			<span class="map-north" aria-hidden="true">↑ N</span>
			<span class="map-pin map-belfast" aria-hidden="true"><span class="map-label map-city-name">Belfast</span></span>
			<span class="map-pin map-dublin" aria-hidden="true"><span class="map-label map-city-name">Dublin</span></span>
			<span class="map-label map-sea" aria-hidden="true">Irische See</span>
			<span class="map-label map-britain" aria-hidden="true">Großbritannien</span>
		</div>
		<div class="map-legend" role="group" aria-label="Gebiete auf der Karte hervorheben"><button class="chip-option" data-map-focus="ie" type="button" aria-pressed="false"><span class="map-key irish-key" aria-hidden="true"></span>Republik Irland</button><button class="chip-option" data-map-focus="uk" type="button" aria-pressed="false"><span class="map-key uk-key" aria-hidden="true"></span>Vereinigtes Königreich</button></div><p class="small" id="map-note" role="status">Wähle ein Gebiet, um es auf der Karte hervorzuheben.</p>
	</figure>`;
}

const timeline = {
	result: "Sam has written the title. It is ready now.",
	time: "Sam wrote the title yesterday.",
};

function renderTimeline(): string {
	return `<div class="timeline-example"><label for="time-focus">Was willst du betonen?</label><select id="time-focus">
		<option value="result">Das Ergebnis jetzt</option><option value="time">Den Zeitpunkt gestern</option>
	</select><output id="time-example" for="time-focus" lang="en">${timeline.result}</output></div>`;
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Werkstatt</h2><p>Wähle für jedes Ziel einen Baustein. Du kannst deine Auswahl ändern.</p>
		${lesson.id === "e7-island-ireland" ? renderIreland() : ""}
		${lesson.diagram ? renderDiagram(lesson.diagram) : ""}
		${lesson.id === "e7-perfect-form" ? renderTimeline() : ""}
		<div class="construction">${lesson.workshop.goals.map((goal, index) => {
			const offset = (lesson.id.length + index) % 3;
			const options = [...goal.options.slice(offset), ...goal.options.slice(0, offset)];
			return `<div class="construction-row" data-goal="${index}"><div><h3 id="goal-${index}">${esc(goal.label)}</h3>
				${goal.before || goal.after ? `<div class="word-chain" lang="en">${goal.before ? `<span class="word-piece">${esc(goal.before)}</span>` : ""}<span class="word-slot" data-slot="${index}" aria-live="polite">___</span>${goal.after ? `<span class="word-piece">${esc(goal.after)}</span>` : ""}</div>` : ""}
				<div class="chip-group" role="group" aria-labelledby="goal-${index}">${options.map((choice) => `<button type="button" class="chip-option" data-goal-chip="${index}" data-value="${esc(choice)}" aria-pressed="false">${esc(choice)}</button>`).join("")}</div>
				<p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		}).join("")}</div>
		<p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(lesson: Lesson, container: HTMLElement, complete: () => void): void {
	const timeFocus = container.querySelector<HTMLSelectElement>("#time-focus");
	const example = container.querySelector<HTMLOutputElement>("#time-example");
	timeFocus?.addEventListener("change", () => {
		if (example) example.value = timeFocus.value === "time" ? timeline.time : timeline.result;
	});
	const map = container.querySelector<HTMLElement>(".map-surface");
	const mapNote = container.querySelector<HTMLElement>("#map-note");
	const mapButtons = [...container.querySelectorAll<HTMLButtonElement>("[data-map-focus]")];
	for (const button of mapButtons) {
		button.addEventListener("click", () => {
			if (!map || !mapNote) return;
			const highlight = map.dataset.highlight === button.dataset.mapFocus ? "" : button.dataset.mapFocus ?? "";
			map.dataset.highlight = highlight;
			for (const option of mapButtons) option.setAttribute("aria-pressed", String(option.dataset.mapFocus === highlight));
			mapNote.textContent = highlight === "ie" ? "Dublin liegt in der Republik Irland."
				: highlight === "uk" ? "Nordirland mit Belfast gehört zum UK, ebenso wie England, Schottland und Wales."
				: "Beide Gebiete sind sichtbar.";
		});
	}
	const answers = lesson.workshop.goals.map(() => "");
	const status = container.querySelector<HTMLElement>("#workshop-status")!;
	const rows = [...container.querySelectorAll<HTMLElement>("[data-goal]")];
	rows.forEach((row, index) => {
		const buttons = [...row.querySelectorAll<HTMLButtonElement>("[data-goal-chip]")];
		const feedback = row.querySelector<HTMLElement>(".goal-feedback")!;
		const slot = row.querySelector<HTMLElement>("[data-slot]");
		for (const button of buttons) {
			button.addEventListener("click", () => {
				answers[index] = button.dataset.value ?? "";
				for (const option of buttons) option.setAttribute("aria-pressed", String(option === button));
				if (slot) {
					slot.textContent = answers[index];
					slot.dataset.filled = "true";
				}
				const reached = workshopGoals(lesson.workshop, answers);
				row.dataset.reached = String(reached[index]);
				feedback.textContent = reached[index]
					? `✓ ${lesson.workshop.goals[index].explanation}`
					: "Noch offen. Prüfe die Erklärung oder das Material und wähle erneut.";
				const count = reached.filter(Boolean).length;
				status.textContent = `${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
				if (count === 3) complete();
			});
		}
	});
}
