import { escapeHtml as html } from "../html";
import { random } from "../practice/tasks";
import type { Workshop } from "./workshop";
export interface DataChart {
	labels: string[];
	values: number[];
	scale: number;
	max: number;
	unit: string;
	hidden?: number[];
	observations?: number[];
	collection?: boolean;
}
export interface ChanceExperiment {
	red: number;
	blue: number;
	seed: number;
	draws: number;
	previous?: { red: number; blue: number; seed: number };
	variable?: { total: number; initialRed: number };
}
export const colouredBalls = (red: number, blue: number) =>
	`${red} rote Kugel${red === 1 ? "" : "n"} und ${blue} blaue Kugel${blue === 1 ? "" : "n"}`;
export function drawsFor(e: ChanceExperiment, count = e.draws): number[] {
	const next = random(e.seed);
	return Array.from({ length: count }, () =>
		Number(next() * (e.red + e.blue) < e.red),
	);
}
export const compositionChoice = (e: ChanceExperiment) =>
	e.red === e.blue ? 3 : e.red > e.blue ? 1 : 2;
export function validExperimentState(
	state: number[],
	e: ChanceExperiment,
): boolean {
	return (
		state.length === (e.variable ? 6 : 5) &&
		state.every(Number.isSafeInteger) &&
		state[0] >= 0 &&
		state[0] <= 3 &&
		state[1] >= 0 &&
		state[1] <= e.draws &&
		state[2] >= 0 &&
		state[2] <= e.draws &&
		state[3] >= 0 &&
		state[3] <= 3 &&
		state[4] >= 0 &&
		state[4] <= 3 &&
		(state[1] === 0 || state[0] > 0) &&
		(!e.variable || (state[5] >= 1 && state[5] < e.variable.total))
	);
}
export function acceptsExperiment(m: Workshop, state: number[]): boolean {
	const e = m.scene.experiment;
	if (!e || !validExperimentState(state, e)) return false;
	return (
		state[0] > 0 &&
		(!e.variable || state[5] === e.red) &&
		state[1] === e.draws &&
		state[2] === drawsFor(e).reduce((s, n) => s + n, 0) &&
		state[3] === compositionChoice(e) &&
		state[4] === 1
	);
}
export function dataChartView(c: DataChart): string {
	const width = 540,
		height = 220,
		left = 50,
		bottom = 170,
		plotHeight = 140,
		barWidth = 80,
		gap = 65;
	const labelEvery = Math.ceil(c.max / c.scale / 7);
	const ticks = Array.from(
		{ length: Math.floor(c.max / c.scale) + 1 },
		(_, i) => i * c.scale,
	);
	return `<div class="world-scene-scroll" tabindex="0" role="region" aria-label="Säulendiagramm, bei Bedarf seitlich verschiebbar"><svg class="world-scene chart-scene" viewBox="0 0 ${width} ${height}" role="img" aria-label="Diagramm. Ein Skalenabschnitt bedeutet ${c.scale} ${html(c.unit)}. ${c.labels.map((s, i) => `${s}: ${c.hidden?.includes(i) ? "nicht angegeben" : c.values[i]}`).join("; ")}">${ticks.map((n) => `<path d="M${left} ${bottom - (n / c.max) * plotHeight}H520" stroke="var(--line)"/>${(n / c.scale) % labelEvery === 0 ? `<text x="${left - 8}" y="${bottom - (n / c.max) * plotHeight + 5}" text-anchor="end">${n}</text>` : ""}`).join("")}${c.labels
		.map((s, i) => {
			const x = left + 25 + i * (barWidth + gap),
				hidden = c.hidden?.includes(i);
			return `${hidden ? `<text x="${x + barWidth / 2}" y="120" text-anchor="middle">?</text>` : `<rect x="${x}" y="${bottom - (c.values[i] / c.max) * plotHeight}" width="${barWidth}" height="${(c.values[i] / c.max) * plotHeight}" fill="var(--world-accent)"/>`}<text x="${x + barWidth / 2}" y="195" text-anchor="middle">${html(s)}</text>`;
		})
		.join(
			"",
		)}</svg></div><p class="fine-print">Ein Skalenabschnitt = ${c.scale} ${html(c.unit)}. Gleiche Werte bekommen gleich hohe Säulen. Bei Bedarf seitlich verschieben.</p>`;
}
export function chartWorkshopView(
	m: Workshop,
	state: number[],
	solved: boolean,
): string {
	const c = m.scene.chart;
	if (!c) return "";
	const count = c.collection
		? state[c.labels.length]
		: (c.observations?.length ?? 0);
	const observations = c.observations?.slice(0, count) ?? [];
	return `<div class="world-workshop"><p>${c.collection ? `Beobachtungen: ${count} von ${c.observations?.length ?? 0}. Zähle selbst in deinen Säulen mit.` : "Übertrage die angegebenen Daten in die Säulen."}</p>${c.observations ? `<div class="observation-list" aria-live="polite">${observations.map((n, i) => `<span>${i + 1}. ${html(c.labels[n])}</span>`).join("") || "Noch keine Beobachtung aufgedeckt."}</div>` : `<table><caption>Vorgegebene Modelldaten</caption><tbody>${c.labels.map((s, i) => `<tr><th scope="row">${html(s)}</th><td>${c.values[i]} ${html(c.unit)}</td></tr>`).join("")}</tbody></table>`}${c.collection && !solved ? `<button data-action="forest-data-observe" ${count === (c.observations?.length ?? 0) ? "disabled" : ""}>Nächste Beobachtung aufdecken</button>` : ""}${dataChartView({ ...c, values: state.slice(0, c.labels.length), hidden: [] })}<div class="model-controls">${c.labels.map((s, i) => `<div class="model-control"><strong>${html(s)}</strong><div><button data-action="forest-model" data-col="${i}" data-value="-1" aria-label="${html(s)} verringern" ${solved || state[i] === 0 ? "disabled" : ""}>−</button><output>${state[i]}</output><button data-action="forest-model" data-col="${i}" data-value="1" aria-label="${html(s)} erhöhen" ${solved || state[i] === m.controls[i].max ? "disabled" : ""}>+</button></div></div>`).join("")}</div>${solved ? "" : '<button data-action="forest-model-reset">Säulen und Beobachtungen zurücksetzen</button>'}<p class="fine-print">Das sind Modelldaten in der App. Eine eigene Befragung oder Sammlung außerhalb der App wird nicht beobachtet.</p></div>`;
}
export function experimentView(
	m: Workshop,
	state: number[],
	solved: boolean,
): string {
	const e = m.scene.experiment;
	if (!e) return "";
	const current = e.variable
		? { ...e, red: state[5], blue: e.variable.total - state[5] }
		: e;
	const log = drawsFor(current, state[1]),
		done = state[1] === e.draws;
	const chances = [
		"Rot hat die größere Chance.",
		"Blau hat die größere Chance.",
		"Beide haben die gleiche Chance.",
	];
	const options = (
		action: string,
		col: number,
		labels: string[],
		disabled: boolean,
	) => {
		const choices = labels.map((label, i) => ({ label, value: i + 1 }));
		// Mix nearby authored seeds; semantic option values do not depend on position.
		const next = random(
			(Math.imul(e.seed, 0x85ebca6b) ^ Math.imul(col + 1, 0x9e3779b9) ^ 1) >>>
				0,
		);
		for (let i = choices.length - 1; i > 0; i--) {
			const j = Math.floor(next() * (i + 1));
			[choices[i], choices[j]] = [choices[j], choices[i]];
		}
		return `<div class="answer-options">${choices.map(({ label, value }) => `<button data-action="${action}" data-col="${col}" data-value="${value}" aria-pressed="${state[col] === value}" ${disabled ? "disabled" : ""}>${html(label)}</button>`).join("")}</div>`;
	};
	return `<div class="world-workshop"><p>Im Beutel: <strong>${colouredBalls(current.red, current.blue)}</strong>. Alle Kugeln sind gleich groß und gleich gut zu greifen. Nach jeder Ziehung kommt die Kugel zurück; dann wird neu gemischt.</p>${e.previous ? `<p>Vergleich mit dem vorigen Versuch: ${colouredBalls(e.previous.red, e.previous.blue)}. Dort beobachtet: ${drawsFor({ ...e, ...e.previous }).reduce((s, n) => s + n, 0)}-mal Rot in ${e.draws} Ziehungen. ${current.red === e.previous.red && current.blue === e.previous.blue ? "Die Bedingungen sind noch gleich; stelle den neuen Beutelinhalt ein." : "Die Beutelbedingungen unterscheiden sich."}</p>` : ""}${e.variable ? `<div class="model-control"><strong>Beutel für diesen Vergleich einstellen: ${e.red} rote Kugeln, insgesamt ${e.variable.total}.</strong><div><button data-action="forest-experiment-change" data-value="-1" aria-label="Rote Kugeln im Beutel verringern" ${solved || state[1] > 0 || state[5] === 1 ? "disabled" : ""}>−</button><output>${state[5]} rot / ${e.variable.total - state[5]} blau</output><button data-action="forest-experiment-change" data-value="1" aria-label="Rote Kugeln im Beutel erhöhen" ${solved || state[1] > 0 || state[5] === e.variable.total - 1 ? "disabled" : ""}>+</button></div></div>` : ""}<fieldset><legend>Deine Vermutung vor dem Versuch</legend>${options("forest-experiment-predict", 0, chances, solved || state[1] > 0)}</fieldset><p>${state[1] > 0 ? "Deine anfängliche Vermutung bleibt für diesen Versuch festgehalten. Eine andere Beobachtung ist möglich; du darfst daraus lernen." : "Wähle eine Vermutung und starte dann den Versuch."}</p><button data-action="forest-experiment-draw" ${solved || state[0] === 0 || done || (e.variable && state[5] !== e.red) ? "disabled" : ""}>Eine Kugel ziehen und zurücklegen</button><p>Gezogen: ${state[1]} von ${e.draws}</p><ol class="draw-log" aria-live="polite">${log.map((n) => `<li class="${n ? "red-draw" : "blue-draw"}">${n ? "Rot" : "Blau"}</li>`).join("")}</ol>${done ? `<div class="model-control"><strong>Wie oft hast du Rot beobachtet?</strong><div><button data-action="forest-model" data-col="2" data-value="-1" aria-label="Rote Beobachtungen verringern" ${solved || state[2] === 0 ? "disabled" : ""}>−</button><output>${state[2]}</output><button data-action="forest-model" data-col="2" data-value="1" aria-label="Rote Beobachtungen erhöhen" ${solved || state[2] === e.draws ? "disabled" : ""}>+</button></div></div><fieldset><legend>Was folgt aus dem Beutelinhalt für die Chancen?</legend>${options("forest-experiment-conclude", 3, chances, solved)}</fieldset><fieldset><legend>Was weißt du über die nächste einzelne Ziehung?</legend>${options("forest-experiment-conclude", 4, ["Sie ist nicht sicher vorhersagbar; eine größere Chance ist keine Garantie.", "Nach diesen Versuchen muss jetzt Rot kommen.", "Die häufigere Farbe kommt ab jetzt bei jeder Ziehung."], solved)}</fieldset>` : ""}${solved || state[1] > 0 ? "" : '<button data-action="forest-model-reset">Diesen Versuch von vorne beginnen</button>'}<p class="fine-print">Dein Modellversuch wird mit deinem Lernstand gespeichert. Du kannst später weiterzählen.</p></div>`;
}
export function experimentMistake(m: Workshop, state: number[]): string {
	const e = m.scene.experiment;
	if (!e) return "Prüfe deine Daten.";
	if (e.variable && state[5] !== e.red)
		return `Stelle für diesen Vergleich ${e.red} rote Kugeln bei insgesamt ${e.variable.total} ein. Die übrigen sind blau.`;
	if (!state[0])
		return "Wähle zuerst eine Vermutung. Sie darf sich im Versuch als unpassend erweisen.";
	if (state[1] < e.draws)
		return `Führe erst alle ${e.draws} Ziehungen durch. Nach jeder Ziehung wird zurückgelegt und gemischt.`;
	if (state[2] !== drawsFor(e).reduce((s, n) => s + n, 0))
		return "Zähle nur die roten Einträge in deinem Versuchsprotokoll. Rot und Blau zusammen müssen alle Ziehungen ergeben.";
	if (state[3] !== compositionChoice(e))
		return "Vergleiche den Beutelinhalt. Mehr gleich gut greifbare Kugeln einer Farbe bedeuten eine größere Chance, aber keine Garantie. Die kurze Beobachtungsreihe muss die Chancen nicht genau abbilden.";
	return "Eine einzelne nächste Ziehung ist bei diesem Beutel nicht sicher. Auch eine lange Reihe erzwingt keinen Ausgleich beim nächsten Mal.";
}
