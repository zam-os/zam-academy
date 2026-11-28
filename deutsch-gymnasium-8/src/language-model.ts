import { esc } from "./practice";
import type { Lesson, ModelBlock } from "./types";

export function modelBlocks(lesson: Lesson, selection: number): ModelBlock[] {
	return lesson.visual.steps[selection]?.blocks ?? lesson.visual.initial.blocks;
}

export function exploredGoals(selections: ReadonlySet<number>): boolean[] {
	return [0, 1, 2].map((index) => selections.has(index));
}

function barChart(selection: number): string {
	const days = [
		{ label: "Dienstag", books: 18 },
		{ label: "Donnerstag", books: 24 },
	];
	return `<div class="books-chart" role="img" aria-label="Ausgeliehene Bücher in der Testwoche: Dienstag 18, Donnerstag 24. Skala von null bis 30."><div class="chart-unit">Ausgeliehene Bücher</div>${days.map(({ label, books }, index) => `<div class="books-row" data-chart-bar="${index}" data-emphasis="${selection === index || selection === 2}"><span>${label}</span><div class="books-track"><span style="width: ${(books / 30) * 100}%"></span></div><strong>${books}</strong></div>`).join("")}<div class="books-axis" aria-hidden="true"><span>0</span><span>10</span><span>20</span><span>30</span></div></div>`;
}

function storyboard(selection: number): string {
	return `<div class="storyboard" data-shot="${selection}" role="img" aria-label="Drei Einstellungen an einer Haltestelle: leerer Weg in der Totalen, Hand am Geländer in Nahaufnahme und zwei näher kommende Scheinwerfer.">
		<div class="film-frame" data-frame="0"><div class="film-drawing road" aria-hidden="true"></div><span>Leerer Weg</span></div>
		<div class="film-frame" data-frame="1"><div class="film-drawing railing" aria-hidden="true"><span>✋</span></div><span>Hand am Geländer</span></div>
		<div class="film-frame" data-frame="2"><div class="film-drawing headlights" aria-hidden="true"></div><span>Scheinwerfer</span></div>
	</div>`;
}

function stagePlan(kind: "stage" | "lighting", selection: number): string {
	if (kind === "lighting")
		return `<div class="stage-plan stage-light" data-shot="${selection}" role="img" aria-label="${selection < 2 ? "Weite beleuchtete Spielfläche" : "Enger Lichtkreis um den einzelnen Schuh"}"><div class="stage-spot"><span aria-hidden="true">👟</span></div></div>`;
	const together = selection === 0;
	return `<div class="stage-plan" data-shot="${selection}" role="img" aria-label="${together ? "Mara und Ilja stehen nebeneinander links von der Tür." : "Mara links und Ilja rechts von der Tür."}${selection === 2 ? " Ilja zeigt auf die Uhr." : ""}"><span class="stage-mara">Mara</span><span class="stage-door">Tür</span><span class="stage-ilja">Ilja</span>${selection === 2 ? '<span class="stage-clock">Uhr</span>' : ""}</div>`;
}

function timeline(selection: number): string {
	return `<ol class="model-timeline" aria-label="Zeitliche Reihenfolge: Warten, Öffnung, nächster Tag">
		<li class="model-time-point ${selection === 1 ? "time-active" : ""}">8:50 · Warten</li>
		<li class="model-time-point ${selection === 0 ? "time-active" : ""}">9:00 · Öffnung</li>
		<li class="model-time-point ${selection === 2 ? "time-active" : ""}">Morgen</li></ol>`;
}

export function renderLanguageModel(lesson: Lesson, selection = -1): string {
	const blocks = modelBlocks(lesson, selection);
	const kind = lesson.visual.kind;
	let graphic = "";
	if (kind === "chart") graphic = barChart(selection);
	if (kind === "storyboard") graphic = storyboard(selection);
	if (kind === "stage" || kind === "lighting")
		graphic = stagePlan(kind, selection);
	if (kind === "tense") graphic = timeline(selection);

	return `${graphic}<div class="language-model model-${kind}" data-language-model role="group" aria-label="Beispiel">${blocks.map((block) => `<div class="model-block tone-${esc(block.tone)}"><span class="model-label">${esc(block.label)}</span><strong>${esc(block.text)}</strong></div>`).join("")}</div>`;
}

export function renderModelGoals(
	lesson: Lesson,
	selections: ReadonlySet<number> = new Set(),
): string {
	const reached = exploredGoals(selections);
	return `<div class="model-goals" data-model-goals><p class="small">${reached.filter(Boolean).length} von 3 Varianten erkundet</p><ul>${lesson.visual.steps.map((step, i) => `<li class="model-goal" data-model-reached="${reached[i]}"><span aria-hidden="true">${reached[i] ? "✓" : "○"}</span> ${esc(step.label)}</li>`).join("")}</ul></div>`;
}
