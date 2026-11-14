import { drawInvestigation, drawScene } from "./figures";
import {
	chooseLab,
	LABS,
	labGoals,
	setTemperature,
	fmtDe,
	type LabState,
} from "./lab-model";
import {
	answerInvestigation,
	ENERGY_STEPS,
	goalKey,
	investigationMatches,
	INVESTIGATIONS,
	moveEnergy,
	setLabQuantity,
	usesModelControl,
	type Quantity,
} from "./investigations";
import type { LabKind } from "./model/types";
import {
	getParameter,
	modelReadout,
	parameterFor,
	setParameter,
} from "./extended-models";
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
		"Wähle einen Vergleich und beobachte das Modell. Im Forschungsauftrag darunter kannst du Vorhersagen selbst prüfen."
	);
}
const goalsHtml = (kind: LabKind, state: LabState) =>
	labGoals(kind, state)
		.map(
			(goal) =>
				`<li class="${goal.met ? "met" : ""}">${goal.met ? "✓" : "○"} ${esc(goal.text)}</li>`,
		)
		.join("");
const energyOrderHtml = (state: LabState) =>
	`<ol class="energy-order">${state.energyOrder.map((step, index) => `<li><span>${esc(ENERGY_STEPS[step])}</span><div><button type="button" class="icon-button" data-energy-move="${index}" data-delta="-1" aria-label="${esc(ENERGY_STEPS[step])} nach oben" ${index === 0 ? "disabled" : ""}>↑</button><button type="button" class="icon-button" data-energy-move="${index}" data-delta="1" aria-label="${esc(ENERGY_STEPS[step])} nach unten" ${index === 3 ? "disabled" : ""}>↓</button></div></li>`).join("")}</ol>`;
function modelControl(kind: LabKind, state: LabState, index: number): string {
	const parameter = parameterFor(kind);
	if (parameter)
		return `<label>${esc(parameter.label)}: <output data-extended-output>${fmtDe(getParameter(kind, state))} ${esc(parameter.unit)}</output><input type="range" min="${parameter.min}" max="${parameter.max}" step="${parameter.step}" value="${getParameter(kind, state)}" data-model-parameter></label><p class="model-readout" data-model-readout aria-live="polite">${esc(modelReadout(kind, state))}</p>`;
	if (kind === "particles")
		return `<p class="small">Nutze den Temperaturregler oberhalb. Ziel: ${index === 0 ? "Schmelzübergang" : "Siedeübergang"} bei normalem Luftdruck.</p>`;
	if (kind === "electrolysis" && index === 0)
		return `<div class="molecule-inputs"><label>Wasserstoffmoleküle <input type="number" min="0" max="4" step="1" value="${state.hydrogenCount}" data-quantity="hydrogenCount"></label><label>Sauerstoffmoleküle <input type="number" min="0" max="3" step="1" value="${state.oxygenCount}" data-quantity="oxygenCount"></label></div><p class="small" data-atom-count>Links: 4 H und 2 O · rechts: ${state.hydrogenCount * 2} H und ${state.oxygenCount * 2} O</p>`;
	if (kind === "electrolysis")
		return `<label>Wasserstoff zu 10 ml Sauerstoff: <output data-quantity-output="hydrogenVolume">${fmtDe(state.hydrogenVolume)} ml</output><input type="range" min="0" max="40" step="5" value="${state.hydrogenVolume}" data-quantity="hydrogenVolume"></label><div data-investigation-figure tabindex="0" role="region" aria-label="Vergleich der Gasvolumen">${drawInvestigation(kind, state)}</div>`;
	if (kind === "anomaly")
		return `<label>Temperatur: <output data-quantity-output="densityTemperature">${fmtDe(state.densityTemperature)} °C</output><input type="range" min="0" max="20" step="1" value="${state.densityTemperature}" data-quantity="densityTemperature"></label><div data-investigation-figure tabindex="0" role="region" aria-label="Qualitative Dichtekurve">${drawInvestigation(kind, state)}</div>`;
	return `<div data-energy-order>${energyOrderHtml(state)}</div>`;
}
function feedback(kind: LabKind, state: LabState, index: number): string {
	const question = INVESTIGATIONS[kind][index];
	if (
		investigationMatches(kind, state, index) ||
		(kind === "particles" && labGoals(kind, state)[index].met)
	)
		return `✓ ${question.explanation}`;
	const attempted =
		state.parameters[kind] !== undefined ||
		state.answers[goalKey(kind, index)] !== undefined ||
		(kind === "electrolysis" && index === 0 && state.customProducts);
	return attempted ? `Prüfe noch einmal: ${question.hint}` : question.hint;
}
function renderInvestigation(kind: LabKind, state: LabState): string {
	return `<details class="lab-investigation"><summary>Forschungsauftrag · drei Modellziele selbst lösen</summary><p>Formuliere eine Vorhersage, verändere das Modell und prüfe die Erklärung. Die Vergleichsknöpfe allein lösen die Ziele noch nicht.</p>${INVESTIGATIONS[kind].map((q, index) => `<fieldset class="investigation-task"><legend>${index + 1} · ${esc(q.goal)}</legend><p>${esc(q.prompt)}</p>${usesModelControl(kind, index) ? modelControl(kind, state, index) : `<div class="chip-row">${q.options.map((option, value) => `<button type="button" class="chip" data-investigation-answer="${index}" data-answer="${value}" aria-pressed="${state.answers[goalKey(kind, index)] === value}">${esc(option)}</button>`).join("")}</div>`}<p class="small" data-investigation-feedback="${index}" aria-live="polite">${esc(feedback(kind, state, index))}</p></fieldset>`).join("")}</details>`;
}
export function renderLab(kind: LabKind, state: LabState): string {
	const d = LABS[kind];
	return `<section class="lab" data-lab="${kind}" aria-label="${esc(d.title)}"><div class="panel-heading"><span class="eyebrow">MODELLWERKSTATT</span><span class="done-mark" data-lab-count>${labGoals(kind, state).filter((g) => g.met).length} / 3 Modellziele gelöst</span></div><h3>${esc(d.title)}</h3><div data-lab-stage tabindex="0" role="region" aria-label="Modellgrafik, auf kleinen Bildschirmen seitlich verschiebbar">${drawScene(kind, state)}</div><p class="small diagram-hint">Du kannst die Grafik seitlich verschieben, um alle Beschriftungen zu lesen.</p><div class="chip-row lab-controls">${d.choices.map((c) => `<button type="button" class="chip" data-lab-choice="${c.id}" aria-pressed="${state.mode === c.id}">${esc(c.label)}</button>`).join("")}</div>${kind === "particles" ? `<label class="temperature-control">Temperatur: <output data-temperature>${fmtDe(state.temperature)} °C</output><input type="range" min="-10" max="110" value="${state.temperature}" step="1" data-temperature-range aria-label="Temperatur in Grad Celsius"></label>` : ""}<p class="lab-detail" data-lab-detail aria-live="polite">${esc(detail(kind, state))}</p>${renderInvestigation(kind, state)}<ul class="lab-goals" data-lab-goals>${goalsHtml(kind, state)}</ul><p class="small">Die Modellziele gelten für diese Sitzung. Deine Aufgaben und Selbsteinschätzungen werden im Browser gespeichert.</p><p class="small model-limit"><strong>Modellgrenze: </strong>${esc(d.limit)}</p></section>`;
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
			`${labGoals(kind, state).filter((g) => g.met).length} / 3 Modellziele gelöst`;
		host
			.querySelectorAll<HTMLButtonElement>("[data-lab-choice]")
			.forEach((b) =>
				b.setAttribute(
					"aria-pressed",
					String(b.dataset.labChoice === state.mode),
				),
			);
		host
			.querySelectorAll<HTMLButtonElement>("[data-investigation-answer]")
			.forEach((b) =>
				b.setAttribute(
					"aria-pressed",
					String(
						state.answers[
							goalKey(kind, Number(b.dataset.investigationAnswer))
						] === Number(b.dataset.answer),
					),
				),
			);
		host
			.querySelectorAll<HTMLElement>("[data-investigation-feedback]")
			.forEach((p) => {
				p.textContent = feedback(
					kind,
					state,
					Number(p.dataset.investigationFeedback),
				);
			});
		const range = host.querySelector<HTMLInputElement>(
			"[data-temperature-range]",
		);
		if (range) range.value = String(state.temperature);
		const output = host.querySelector("[data-temperature]");
		if (output) output.textContent = `${fmtDe(state.temperature)} °C`;
		host
			.querySelectorAll<HTMLInputElement>("[data-quantity]")
			.forEach((input) => {
				const value = String(state[input.dataset.quantity as Quantity]);
				if (input.value !== value) input.value = value;
			});
		host
			.querySelectorAll<HTMLOutputElement>("[data-quantity-output]")
			.forEach((el) => {
				const key = el.dataset.quantityOutput as Quantity;
				el.textContent = `${fmtDe(state[key])} ${key === "densityTemperature" ? "°C" : "ml"}`;
			});
		const counts = host.querySelector("[data-atom-count]");
		const parameter = parameterFor(kind);
		const parameterInput = host.querySelector<HTMLInputElement>(
			"[data-model-parameter]",
		);
		if (parameterInput)
			parameterInput.value = String(getParameter(kind, state));
		const parameterOutput = host.querySelector("[data-extended-output]");
		if (parameterOutput && parameter)
			parameterOutput.textContent = `${fmtDe(getParameter(kind, state))} ${parameter.unit}`;
		const readout = host.querySelector("[data-model-readout]");
		if (readout) readout.textContent = modelReadout(kind, state);
		if (counts)
			counts.textContent = `Links: 4 H und 2 O · rechts: ${state.hydrogenCount * 2} H und ${state.oxygenCount * 2} O`;
		const chart = host.querySelector("[data-investigation-figure]");
		if (chart) chart.innerHTML = drawInvestigation(kind, state);
		const order = host.querySelector("[data-energy-order]");
		if (order) order.innerHTML = energyOrderHtml(state);
	};
	host.addEventListener("click", (event) => {
		if (!(event.target instanceof Element)) return;
		const choice = event.target.closest<HTMLButtonElement>("[data-lab-choice]");
		const answer = event.target.closest<HTMLButtonElement>(
			"[data-investigation-answer]",
		);
		const move = event.target.closest<HTMLButtonElement>("[data-energy-move]");
		if (choice) chooseLab(kind, state, choice.dataset.labChoice!);
		else if (answer)
			answerInvestigation(
				kind,
				state,
				Number(answer.dataset.investigationAnswer),
				Number(answer.dataset.answer),
			);
		else if (move)
			moveEnergy(
				state,
				Number(move.dataset.energyMove),
				Number(move.dataset.delta),
			);
		else return;
		refresh();
		if (move)
			host
				.querySelector<HTMLButtonElement>(
					`[data-energy-move="${Number(move.dataset.energyMove) + Number(move.dataset.delta)}"][data-delta="${-Number(move.dataset.delta)}"]`,
				)
				?.focus({ preventScroll: true });
	});
	host.addEventListener("input", (event) => {
		if (!(event.target instanceof HTMLInputElement)) return;
		if (event.target.hasAttribute("data-temperature-range"))
			setTemperature(state, Number(event.target.value));
		else if (event.target.hasAttribute("data-model-parameter"))
			setParameter(kind, state, Number(event.target.value));
		else if (event.target.dataset.quantity)
			setLabQuantity(
				kind,
				state,
				event.target.dataset.quantity as Quantity,
				Number(event.target.value),
			);
		else return;
		refresh();
	});
	requestAnimationFrame(() => {
		if (
			[
				"molecules",
				"tension",
				"soilLife",
				"particles",
				"gases",
				"properties",
			].includes(kind)
		) {
			const stage = host.querySelector<HTMLElement>("[data-lab-stage]")!;
			stage.scrollLeft = Math.max(
				0,
				(stage.scrollWidth - stage.clientWidth) / 2,
			);
		}
	});
}
