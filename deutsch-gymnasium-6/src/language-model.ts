import { esc } from "./practice";
import { renderStoryModel } from "./story-model";
import type { Lesson, ModelBlock } from "./types";

export function modelBlocks(lesson: Lesson, selection: number): ModelBlock[] {
	return (
		lesson.visual.steps[selection]?.blocks ??
		lesson.visual.initial?.blocks ??
		[]
	);
}

export function exploredGoals(selections: ReadonlySet<number>): boolean[] {
	return [0, 1, 2].map((index) => selections.has(index));
}

/** Each control changes the words, their order, inflection or visible grouping. */
export function renderLanguageModel(lesson: Lesson, selection = -1): string {
	const blocks = modelBlocks(lesson, selection);
	const state = lesson.visual.steps[selection] ?? lesson.visual.initial;
	const kind = lesson.visual.kind;
	const alphabet =
		kind === "dictionary"
			? `<div class="model-alphabet" aria-label="Alphabetischer Weg zum Stichwort">${Array.from(
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ",
				)
					.map((letter) => {
						const entry = blocks.find((block) => block.tone === "entry")?.text;
						return `<span class="${entry?.toLocaleUpperCase("de").startsWith(letter) ? "letter-active" : ""}">${letter}</span>`;
					})
					.join("")}</div>`
			: "";
	const timeline =
		kind === "tense"
			? `<ol class="model-timeline" aria-label="Zeitlicher Bezug"><li class="model-time-point ${selection === 1 ? "time-active" : ""}">vorher</li><li class="model-time-point ${selection === 0 ? "time-active" : ""}">vergangener Bezug</li><li class="model-time-point ${selection === -1 ? "time-active" : ""}">Gegenwart</li><li class="model-time-point ${selection === 2 ? "time-active" : ""}">künftiger Abschluss</li></ol>`
			: "";
	const length = state && "length" in state ? state.length : undefined;
	const meter = length
		? `<div class="vowel-comparison"><span>Betonter Vokal: ${length === "short" ? "kurz" : "lang"}</span><span class="vowel-duration ${length}" aria-hidden="true"></span></div>`
		: "";
	return `${renderStoryModel(kind, selection)}${alphabet}${timeline}<div class="language-model model-${esc(kind)}" data-language-model role="img" aria-label="${esc(blocks.map((block) => `${block.label}: ${block.text}`).join("; "))}">${blocks.map((block, i) => `${kind === "syllables" && i ? '<span class="syllable-divider" aria-hidden="true">-</span>' : ""}<div class="model-block tone-${esc(block.tone)}"><span class="model-label">${esc(block.label)}</span><strong>${esc(block.text)}</strong>${kind === "syllables" ? '<svg class="syllable-bow" viewBox="0 0 100 25" aria-hidden="true"><path d="M3 3Q50 42 97 3"/></svg>' : ""}</div>`).join("")}</div>${meter}`;
}

export function renderModelGoals(
	lesson: Lesson,
	selections: ReadonlySet<number> = new Set(),
): string {
	const reached = exploredGoals(selections);
	return `<div class="model-goals" data-model-goals><p class="small">${reached.filter(Boolean).length} von 3 Veränderungen erkundet · das ist Übung, keine Bewertung.</p><ul>${lesson.visual.steps.map((step, i) => `<li class="model-goal" data-model-reached="${reached[i]}"><span aria-hidden="true">${reached[i] ? "✓" : "○"}</span> ${esc(step.label)}</li>`).join("")}</ul></div>`;
}
