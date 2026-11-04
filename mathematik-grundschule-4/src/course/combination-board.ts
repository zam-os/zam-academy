import { escapeHtml as html } from "../html";
import {
	type CombinationModel,
	combinationLabel,
	combinationTuple,
} from "./combinations";

export function combinationBoard(
	model: CombinationModel,
	choice: readonly number[] | null,
	selection: readonly number[],
	solved = false,
): string {
	const axes = solved
		? ""
		: model.axes
				.map(
					(a, i) =>
						`<fieldset class="combination-axis"><legend>${html(a.label)} · genau eine Auswahl</legend><div>${a.options.map((label, j) => `<button data-action="forest-combination-choice" data-col="${i}" data-value="${j}" aria-pressed="${choice?.[i] === j}">${html(label)}</button>`).join("")}</div></fieldset>`,
				)
				.join("");
	const draft =
		choice?.length === model.axes.length && choice.every((n) => n >= 0)
			? combinationLabel(model, choice)
			: "Wähle in jeder Reihe eine Möglichkeit.";
	const list = selection
		.map((code) => {
			const t = combinationTuple(model, code);
			return t
				? `<li><span>${html(combinationLabel(model, t))}</span>${solved ? "" : `<button data-action="forest-combination-remove" data-value="${code}" aria-label="${html(combinationLabel(model, t))} entfernen">Entfernen</button>`}</li>`
				: "";
		})
		.join("");
	return `<div class="combination-workshop">${axes}${solved ? "" : `<p class="selection-readout" aria-live="polite">${html(draft)}</p><button data-action="forest-combination-add">Möglichkeit eintragen</button>`}<h3>Deine Liste · ${selection.length} ${selection.length === 1 ? "Eintrag" : "Einträge"}</h3>${list ? `<ol class="combination-list">${list}</ol>` : "<p>Hier ist noch nichts eingetragen.</p>"}${solved ? "" : '<p class="fine-print">Gleiche Zusammenstellungen zählen nur einmal. Du kannst jeden Eintrag wieder entfernen.</p><button class="primary" data-action="forest-check">Meine Liste prüfen</button>'}</div>`;
}
