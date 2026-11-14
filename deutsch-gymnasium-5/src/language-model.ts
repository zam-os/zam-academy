import { esc } from "./practice";
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
			? `<ol class="model-timeline" aria-label="Zeitlicher Bezug"><li class="model-time-point ${selection === 1 ? "time-active" : ""}">vorher</li><li class="model-time-point ${selection === 0 ? "time-active" : ""}">erzählter Fund</li><li class="model-time-point ${selection === -1 ? "time-active" : ""}">jetzt</li><li class="model-time-point ${selection === 2 ? "time-active" : ""}">zukünftig fertig</li></ol>`
			: "";
	const length = state && "length" in state ? state.length : undefined;
	const meter = length
		? `<div class="vowel-comparison"><span>Betonter Vokal: ${length === "short" ? "kurz" : "lang"}</span><span class="vowel-duration ${length}" aria-hidden="true"></span></div>`
		: "";
	const branch =
		kind === "meaning" && selection === 2
			? '<div class="meaning-pictures" aria-hidden="true"><svg viewBox="0 0 300 100"><path d="M20 35h85v28H20zM27 65v23m70-23v23m-77-40h85" class="diagram-line"/><path d="M180 35l45-25 45 25zM185 45h80m-70 5v32m25-32v32m25-32v32m-65 5h90" class="diagram-line"/></svg></div>'
			: "";
	return `${alphabet}${timeline}<div class="language-model model-${esc(kind)}" data-language-model role="img" aria-label="${esc(blocks.map((block) => `${block.label}: ${block.text}`).join("; "))}">${blocks.map((block, i) => `${kind === "syllables" && i ? '<span class="syllable-divider" aria-hidden="true">-</span>' : ""}<div class="model-block tone-${esc(block.tone)}"><span class="model-label">${esc(block.label)}</span><strong>${esc(block.text)}</strong>${kind === "syllables" ? '<svg class="syllable-bow" viewBox="0 0 100 25" aria-hidden="true"><path d="M3 3Q50 42 97 3"/></svg>' : ""}</div>`).join("")}</div>${meter}${branch}`;
}

export function renderModelGoals(
	lesson: Lesson,
	selections: ReadonlySet<number> = new Set(),
): string {
	const reached = exploredGoals(selections);
	return `<div class="model-goals" data-model-goals><p class="small">${reached.filter(Boolean).length} von 3 Veränderungen erkundet · das ist Übung, keine Bewertung.</p><ul>${lesson.visual.steps.map((step, i) => `<li class="model-goal" data-model-reached="${reached[i]}"><span aria-hidden="true">${reached[i] ? "✓" : "○"}</span> ${esc(step.label)}</li>`).join("")}</ul></div>`;
}
