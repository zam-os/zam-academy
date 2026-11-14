import { drawScene } from "./figures";
import {
	chooseLab,
	LABS,
	labGoals,
	setTemperature,
	fmtDe,
	type LabState,
} from "./lab-model";
import type { LabKind } from "./model/types";
import { esc } from "./workshop";
export {
	chooseLab,
	freshLab,
	fmtDe,
	LABS,
	labGoals,
	setTemperature,
	type LabState,
} from "./lab-model";

function detail(kind: LabKind, state: LabState): string {
	if (state.mode === "transition")
		return "Am Zustandsübergang können zwei Zustände gleichzeitig vorliegen. Die Temperatur allein zeigt nicht, welcher Anteil bereits geschmolzen oder verdampft ist.";
	return (
		LABS[kind].choices.find((choice) => choice.id === state.mode)?.detail ??
		"Wähle einen der drei Vergleiche. Beobachte, was sich im Modell verändert, und lies die Erklärung darunter."
	);
}
const goalsHtml = (kind: LabKind, state: LabState) =>
	labGoals(kind, state)
		.map(
			(goal) =>
				`<li class="${goal.met ? "met" : ""}">${goal.met ? "✓" : "○"} ${esc(goal.text)}</li>`,
		)
		.join("");
export function renderLab(kind: LabKind, state: LabState): string {
	const d = LABS[kind];
	return `<section class="lab" data-lab="${kind}" aria-label="${esc(d.title)}"><div class="panel-heading"><span class="eyebrow">MODELLWERKSTATT</span><span class="done-mark" data-lab-count>${labGoals(kind, state).filter((g) => g.met).length} / 3 erkundet</span></div><h3>${esc(d.title)}</h3><div data-lab-stage tabindex="0" role="region" aria-label="Modellgrafik, auf kleinen Bildschirmen seitlich verschiebbar">${drawScene(kind, state)}</div><p class="small diagram-hint">Du kannst die Grafik seitlich verschieben, um alle Beschriftungen zu lesen.</p><div class="chip-row lab-controls">${d.choices.map((c) => `<button type="button" class="chip" data-lab-choice="${c.id}" aria-pressed="${state.mode === c.id}">${esc(c.label)}</button>`).join("")}</div>${kind === "particles" ? `<label class="temperature-control">Temperatur: <output data-temperature>${fmtDe(state.temperature)} °C</output><input type="range" min="-10" max="110" value="${state.temperature}" step="1" data-temperature-range aria-label="Temperatur in Grad Celsius"></label>` : ""}<p class="lab-detail" data-lab-detail aria-live="polite">${esc(detail(kind, state))}</p><ul class="lab-goals" data-lab-goals>${goalsHtml(kind, state)}</ul><p class="small">Die Erkundungsziele gelten für diese Sitzung. Deine Aufgaben und Selbsteinschätzungen werden im Browser gespeichert.</p><p class="small model-limit"><strong>Modellgrenze: </strong>${esc(d.limit)}</p></section>`;
}
export function mountLab(
	host: HTMLElement,
	kind: LabKind,
	state: LabState,
): void {
	const refresh = () => {
		host.querySelector("[data-lab-stage]")!.innerHTML = drawScene(kind, state);
		host.querySelector("[data-lab-detail]")!.textContent = detail(kind, state);
		host.querySelector("[data-lab-goals]")!.innerHTML = goalsHtml(kind, state);
		host.querySelector("[data-lab-count]")!.textContent =
			`${labGoals(kind, state).filter((g) => g.met).length} / 3 erkundet`;
		host
			.querySelectorAll<HTMLButtonElement>("[data-lab-choice]")
			.forEach((b) =>
				b.setAttribute(
					"aria-pressed",
					String(b.dataset.labChoice === state.mode),
				),
			);
		const range = host.querySelector<HTMLInputElement>(
			"[data-temperature-range]",
		);
		if (range) range.value = String(state.temperature);
		const output = host.querySelector("[data-temperature]");
		if (output) output.textContent = `${fmtDe(state.temperature)} °C`;
	};
	host.querySelectorAll<HTMLButtonElement>("[data-lab-choice]").forEach((b) =>
		b.addEventListener("click", () => {
			chooseLab(kind, state, b.dataset.labChoice!);
			refresh();
		}),
	);
	host
		.querySelector<HTMLInputElement>("[data-temperature-range]")
		?.addEventListener("input", (e) => {
			setTemperature(state, Number((e.target as HTMLInputElement).value));
			refresh();
		});
}
