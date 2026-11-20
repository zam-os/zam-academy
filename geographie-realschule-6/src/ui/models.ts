import type { Lesson, ModelKind } from "../model/types";
import {
	CLIMATE_PROFILES,
	MODEL_SCENARIOS,
	MONTHS,
	RUNOFF_CASES,
	TRAFFIC_COUNTS,
	climateSummary,
	energyKwh,
	fmt,
	modelReady,
} from "../models";
import { esc } from "../workshop";
import { renderMap, renderStateFinder } from "./maps";

export interface ModelState {
	selected: string;
	hours: number;
	country: string;
}
export const initialModelState = (): ModelState => ({
	selected: "",
	hours: 5,
	country: "DEU",
});

function climateDiagram(id: keyof typeof CLIMATE_PROFILES): string {
	const profile = CLIMATE_PROFILES[id];
	const summary = climateSummary(profile.temperature, profile.rain);
	const x = (month: number) => 80 + month * 44;
	const celsius = (value: number) => 180 - value * 4;
	const millimeters = (value: number) => 220 - value * 1.5;
	const ticks = [0, 20, 40, 60, 80, 100, 120];
	const line = profile.temperature
		.map((value, month) => `${x(month)},${celsius(value)}`)
		.join(" ");
	return `<figure class="geo-figure"><figcaption>${esc(profile.label)}</figcaption>
		<div class="diagram-scroll" tabindex="0" aria-label="Diagramm, bei Bedarf horizontal verschiebbar">
		<svg class="geo-map climate-chart" viewBox="0 0 650 258" role="img" aria-label="Klimadiagramm für ${esc(profile.label)}. Eine Tabelle mit allen Werten steht unter dem Diagramm.">
		<text x="16" y="26">°C</text><text x="600" y="25">mm</text>
		${[-10, 0, 10, 20, 30].map((value) => `<text x="40" y="${celsius(value) + 4}" text-anchor="end">${fmt(value)}</text>`).join("")}
		${ticks.map((value) => `<path class="chart-grid" d="M55 ${millimeters(value)}H590"/><text x="600" y="${millimeters(value) + 4}">${value}</text>`).join("")}
		<path class="chart-axis" d="M55 40V220H590V40"/>
		${profile.rain.map((value, month) => `<rect class="rain-bar" x="${x(month) - 10}" y="${millimeters(value)}" width="20" height="${value * 1.5}"><title>${MONTHS[month]}: ${value} mm</title></rect>`).join("")}
		<polyline class="temperature-line" points="${line}"/>
		${profile.temperature.map((value, month) => `<circle class="temperature-dot" cx="${x(month)}" cy="${celsius(value)}" r="4"><title>${MONTHS[month]}: ${fmt(value)} °C</title></circle><text x="${x(month)}" y="243" text-anchor="middle">${MONTHS[month]}</text>`).join("")}
		</svg></div>
		<ul class="chart-key"><li><span class="key-temp">━</span> Temperatur · linke Skala</li><li><span class="key-rain">■</span> Niederschlag · rechte Skala</li></ul>
		<p role="status"><strong>Temperaturspanne ${fmt(summary.range)} °C · Jahresniederschlag ${fmt(summary.rain)} mm.</strong> ${esc(profile.note)}</p>
		<details><summary>Alle Monatswerte</summary><table class="geo-table"><thead><tr><th>Monat</th><th>Temperatur (°C)</th><th>Niederschlag (mm)</th></tr></thead><tbody>${MONTHS.map((month, i) => `<tr><th scope="row">${month}</th><td>${fmt(profile.temperature[i])}</td><td>${profile.rain[i]}</td></tr>`).join("")}</tbody></table></details>
		<p class="small map-credit">Erfundene Übungsdaten, keine Messreihe. Die Achsen sind für den Vergleich fest und folgen hier keinem Walter-Lieth-Maßstab.</p></figure>`;
}

function runoff(id: keyof typeof RUNOFF_CASES): string {
	const item = RUNOFF_CASES[id];
	const vegetation =
		id === "covered"
			? [70, 116, 162, 208]
					.map(
						(x, i) =>
							`<path class="plant" d="M${x} ${118 + i * 8}v-21m0 12l-9-9m9 9l9-9"/>`,
					)
					.join("")
			: "";
	const percolation = (
		id === "covered" ? [133, 203, 273] : id === "bare" ? [176] : []
	)
		.map((x) => `<path class="percolation" d="M${x} 155v42m-5-7l5 7 5-7"/>`)
		.join("");
	return `<figure class="geo-figure"><figcaption>Gleicher Regen, anderer Untergrund</figcaption>
		<div class="diagram-scroll" tabindex="0" aria-label="Hangmodell, bei Bedarf horizontal verschiebbar"><svg class="geo-map runoff-diagram" viewBox="0 0 650 230" role="img" aria-label="${item.surface}: ${item.soaks}. ${item.outflow}.">
		<path class="soil-side surface-${id}" d="M45 115L445 192H610V213H45Z"/>
		${[82, 129, 176, 223, 270, 317].map((x, i) => `<path class="raindash" d="M${x} ${53 + 4 * i}l-9 18"/>`).join("")}
		${vegetation}${percolation}
		<path class="moving-water" style="stroke-width:${item.width}" d="M315 165L454 191H569"/><path class="water-tip" d="M560 184L575 191L560 198Z"/>
		<text x="47" y="28">Gleicher Regen auf demselben Hang</text><text x="435" y="155">Abfluss</text>
		</svg></div>
		<p role="status"><strong>${item.soaks} · ${item.outflow}.</strong> ${item.note}</p>
		<p class="small map-credit">Schema ohne Messwerte. Bodenart, Regenstärke und Bodenfeuchte beeinflussen den tatsächlichen Abfluss.</p></figure>`;
}

function trafficDiagram(id: keyof typeof TRAFFIC_COUNTS): string {
	const counts = TRAFFIC_COUNTS[id];
	const categories = ["Autos", "Fahrräder", "Busse"];
	return `<figure class="geo-figure"><figcaption>Verkehr an einer Schulstraße · je 15 Minuten</figcaption>
		<div class="diagram-scroll" tabindex="0" aria-label="Balkendiagramm, bei Bedarf horizontal verschiebbar"><svg class="geo-map" viewBox="0 0 650 250" role="img" aria-label="${categories.map((name, i) => `${counts[i]} ${name}`).join(", ")}">
		${[0, 5, 10, 15, 20].map((n) => `<path class="chart-grid" d="M${134 + n * 22} 24v181"/><text x="${134 + n * 22}" y="229" text-anchor="middle">${n}</text>`).join("")}
		${counts.map((value, i) => `<text x="24" y="${65 + i * 55}">${categories[i]}</text><rect class="traffic-bar bar-${i}" x="134" y="${46 + i * 55}" width="${value * 22}" height="26" rx="3"/><text x="${145 + value * 22}" y="${65 + i * 55}">${value}</text>`).join("")}
		</svg></div><p class="small" role="status">${id === "morning" ? "Vor Schulbeginn" : "Nach Schulschluss"} · erfundene Zählwerte. Eine Personenzählung braucht zusätzlich Angaben zur Belegung.</p></figure>`;
}

function energyDiagram(state: ModelState): string {
	const watts = state.selected === "efficient" ? 10 : 60;
	const energy = energyKwh(watts, state.hours);
	const label = `${watts} W · ${state.hours} h = ${fmt(energy)} kWh`;
	return `<figure class="geo-figure"><figcaption>Stromverbrauch einer Lampe</figcaption>
		<label class="model-range" for="model-hours">Betriebszeit <output>${state.hours} h</output></label>
		<input id="model-hours" type="range" min="1" max="8" step="1" value="${state.hours}" aria-valuetext="${state.hours} Stunden" data-model-hours>
		<div class="diagram-scroll" tabindex="0" aria-label="Energiebalken, bei Bedarf horizontal verschiebbar"><svg class="geo-map" viewBox="0 0 650 116" role="img" aria-label="${label}">
		<rect x="25" y="42" width="600" height="31" rx="4" class="energy-track"/><rect x="25" y="42" width="${(energy / 0.5) * 600}" height="31" rx="4" class="energy-bar"/>
		<text x="25" y="101">0 kWh</text><text x="625" y="101" text-anchor="end">0,5 kWh</text></svg></div>
		<p role="status"><strong>${label}</strong></p><p class="small map-credit">Vergleiche zwei Lampen für dieselbe Betriebszeit. In jedem Fall muss das Licht für die Aufgabe ausreichen.</p></figure>`;
}

function modelContent(kind: ModelKind, state: ModelState): string {
	switch (kind) {
		case "europa":
			return state.selected === "states"
				? renderStateFinder(state.country)
				: renderMap(kind, state.selected || "relief");
		case "klima":
			return climateDiagram(
				(state.selected as keyof typeof CLIMATE_PROFILES) || "inland",
			);
		case "abfluss":
			return runoff((state.selected as keyof typeof RUNOFF_CASES) || "covered");
		case "zaehlung":
			return trafficDiagram(
				(state.selected as keyof typeof TRAFFIC_COUNTS) || "morning",
			);
		case "verbrauch":
			return energyDiagram(state);
		default:
			return renderMap(kind, state.selected || MODEL_SCENARIOS[kind][0].id);
	}
}

const modelDirections: Record<ModelKind, string> = {
	europa:
		"Wechsle zwischen Landschaften und Hauptstädten. Nutze die Nummern unter der Karte, um Länder und Orte zu verorten.",
	klima:
		"Vergleiche die drei Profile. Suche jeweils den wärmsten und den kältesten Monat und prüfe, wann besonders wenig Regen fällt.",
	abfluss:
		"Lass denselben Regen auf drei Oberflächen fallen. Vergleiche Versickerung und Abfluss.",
	verkehr:
		"Verfolge einen Wasserweg, einen Transitweg und Wege durch die Alpen. Wo wechseln Güter oder Menschen das Verkehrsmittel?",
	zaehlung:
		"Vergleiche dieselbe Schulstraße zu zwei Uhrzeiten. Wie verändern sich die Zahlen?",
	industrie:
		"Vergleiche die Lage der Fahrzeug- und Luftfahrtstandorte. Welche Länder und Orte sind beteiligt?",
	energie:
		"Suche Standorte und vergleiche die beiden Richtungen des Stromflusses. Folge jeweils der Pfeilspitze.",
	verbrauch:
		"Wähle beide Lampen und ändere ihre Betriebszeit. Halte die Zeit für einen fairen Vergleich gleich.",
	tourismus:
		"Wechsle zwischen Küste, Gebirge und Stadt. Welche Merkmale passen zur jeweiligen Reiseform?",
	kreta:
		"Verorte Kreta im Mittelmeer und wechsle dann zur Ortsansicht. Lies unten, welche Folgen an welchen Orten gemeldet wurden.",
};

export function renderModel(
	lesson: Lesson,
	visited: string[],
	state: ModelState,
): string {
	const kind = lesson.model!;
	return `<section class="panel exploration" aria-labelledby="model-heading"><h2 id="model-heading">Vergleichen und erklären</h2><p>${esc(modelDirections[kind])}</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map(({ id, label }) => `<button type="button" data-scenario="${id}" aria-pressed="${id === state.selected}">${visited.includes(id) ? "✓ " : ""}${esc(label)}</button>`).join("")}</div>${modelContent(kind, state)}<p class="small model-progress">${modelReady(kind, visited) ? "✓ Alle Ansichten geöffnet." : "Öffne alle Ansichten, um den Vergleich abzuschließen."}</p></section>`;
}
