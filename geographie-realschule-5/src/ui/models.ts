import countries from "../data/countries.json";
import type { Lesson, ModelKind } from "../model/types";
import {
	CAPITALS,
	fmt,
	MODEL_SCENARIOS,
	modelReady,
	realDistanceMeters,
	THEMATIC_POINTS,
	WORLD_PLACES,
} from "../models";
import { esc } from "../workshop";

export interface ModelState {
	selected: string;
	centimeters: number;
}
export const initialModelState = (_kind: ModelKind): ModelState => ({
	selected: "",
	centimeters: 1,
});
export function applyScenario(
	kind: ModelKind,
	state: ModelState,
	id: string,
): ModelState {
	return MODEL_SCENARIOS[kind].some((s) => s.id === id)
		? { ...state, selected: id }
		: state;
}
type Bounds = [number, number, number, number];
const world: Bounds = [-180, 180, -90, 90];
const germany: Bounds = [5, 16, 47, 56];
/** Longitude correction improves the regional aspect, without claiming distance/area fidelity. */
export function mapPoint(
	lon: number,
	lat: number,
	bounds: Bounds,
): [number, number] {
	const isWorld = bounds[0] === -180;
	const width = isWorld
		? 640
		: (((bounds[1] - bounds[0]) *
				Math.cos((((bounds[2] + bounds[3]) / 2) * Math.PI) / 180)) /
				(bounds[3] - bounds[2])) *
			380;
	return [
		(700 - width) / 2 + ((lon - bounds[0]) / (bounds[1] - bounds[0])) * width,
		25 + ((bounds[3] - lat) / (bounds[3] - bounds[2])) * (isWorld ? 320 : 380),
	];
}
function path(ring: number[][], bounds: Bounds): string {
	return (
		ring
			.map(
				([lon, lat], i) =>
					`${i ? "L" : "M"}${mapPoint(lon, lat, bounds)
						.map((n) => n.toFixed(2))
						.join(",")}`,
			)
			.join(" ") + "Z"
	);
}
function geometry(bounds: Bounds): string {
	const isRegional = bounds !== world;
	return countries
		.map((country) => {
			const polygons = (
				country.geometry.type === "Polygon"
					? [country.geometry.coordinates]
					: country.geometry.coordinates
			) as number[][][][];
			// Keep neighbouring land in the same geographic window, including polygons
			// whose edges cross the frame. SVG clipping trims them at the projected bounds.
			const visible = polygons.filter(([outer]) => {
				const longitudes = outer.map((point) => point[0]);
				const latitudes = outer.map((point) => point[1]);
				return (
					Math.max(...longitudes) >= bounds[0] &&
					Math.min(...longitudes) <= bounds[1] &&
					Math.max(...latitudes) >= bounds[2] &&
					Math.min(...latitudes) <= bounds[3]
				);
			});
			if (!visible.length) return "";
			const className =
				isRegional && country.code !== "DEU" ? "map-context" : "map-country";
			return `<path data-map-country="${country.code}" d="${visible.map((poly) => poly.map((ring) => path(ring, bounds)).join(" ")).join(" ")}" class="${className}"><title>${esc(country.name)}</title></path>`;
		})
		.join("");
}

function dot(
	lon: number,
	lat: number,
	name: string,
	bounds: Bounds,
	selected = false,
	label = true,
	id?: string,
): string {
	const [x, y] = mapPoint(lon, lat, bounds);
	return `<g class="${selected ? "map-selected" : "map-place"}" ${id ? `data-country="${id}" role="button" tabindex="0" aria-label="${esc(name)} auswählen"` : ""}><circle cx="${x}" cy="${y}" r="${selected ? 8 : 4}"/><title>${esc(name)}</title>${label ? `<text x="${x + (x > 580 ? -10 : 10)}" y="${y - 8}" text-anchor="${x > 580 ? "end" : "start"}">${esc(name)}</text>` : ""}</g>`;
}
function graticule(): string {
	return (
		[-60, -30, 0, 30, 60]
			.map((lat) => {
				const [, y] = mapPoint(0, lat, world);
				return `<path d="M30 ${y}H670" class="${lat === 0 ? "equator" : "grid-line"}"/><text x="32" y="${y - 4}">${Math.abs(lat)}° ${lat > 0 ? "N" : lat < 0 ? "S" : "Äquator"}</text>`;
			})
			.join("") +
		[-120, -60, 0, 60, 120]
			.map((lon) => {
				const [x] = mapPoint(lon, 0, world);
				return `<path d="M${x} 25V345" class="${lon === 0 ? "equator" : "grid-line"}"/><text x="${x + 3}" y="372">${Math.abs(lon)}° ${lon > 0 ? "O" : lon < 0 ? "W" : "Greenwich"}</text>`;
			})
			.join("")
	);
}
function mapSvg(body: string, isWorld = false): string {
	// The sea background, land clipping and annotations share the same projection.
	const bounds = isWorld ? world : germany;
	const [x, y] = mapPoint(bounds[0], bounds[3], bounds);
	const [right, bottom] = mapPoint(bounds[1], bounds[2], bounds);
	const frame = `x="${x}" y="${y}" width="${right - x}" height="${bottom - y}"`;
	const clipId = isWorld ? "world-map-frame" : "regional-map-frame";
	return `<svg class="geo-map ${isWorld ? "world-map" : "regional-map"}" viewBox="0 0 700 440" role="img" aria-label="${isWorld ? "Weltkarte mit Gradnetz und ausgewähltem Ort" : "Deutschland und benachbarte Landflächen mit ausgewählten Orientierungspunkten"}"><defs><clipPath id="${clipId}"><rect ${frame}/></clipPath></defs><rect ${frame} class="map-water"/><g clip-path="url(#${clipId})">${geometry(bounds)}</g><rect ${frame} class="map-frame"/>${body}<text x="650" y="45">N ↑</text></svg>${isWorld ? "" : '<p class="small map-legend">Helle Landfläche: Deutschland. Gedämpfte Landflächen: Nachbarländer. Getönte Flächen innerhalb des Kartenrahmens: Meer.</p>'}`;
}
function seaLabels(): string {
	return [
		{ id: "north-sea", name: "Nordsee", lon: 7, lat: 54.6 },
		{ id: "baltic-sea", name: "Ostsee", lon: 14.3, lat: 54.8 },
	]
		.map((sea) => {
			const [x, y] = mapPoint(sea.lon, sea.lat, germany);
			return `<text data-sea-label="${sea.id}" x="${x}" y="${y}" text-anchor="middle">${sea.name}</text>`;
		})
		.join("");
}

function content(kind: ModelKind, state: ModelState): string {
	if (kind === "world") {
		const selected = WORLD_PLACES.find((p) => p.id === state.selected);
		return `${mapSvg(graticule() + WORLD_PLACES.map((p) => dot(p.lon, p.lat, p.name, world, p.id === state.selected, true, p.id)).join(""), true)}<p class="model-readout" role="status">${selected ? esc(selected.note) : "Wähle nacheinander drei Orte und vergleiche ihre Lage zu Äquator und Nullmeridian."}</p><p class="small">Vereinfachte Weltkarte · längen- und flächenverzerrend, besonders in Polnähe · nicht zum Messen. Die Umrisse sind keine Reliefkarte.</p>`;
	}
	if (kind === "germany") {
		const selected = CAPITALS.find((p) => p[0] === state.selected);
		return `${mapSvg(CAPITALS.map((p) => dot(p[3], p[4], p[1], germany, p[0] === state.selected, p[0] === state.selected, p[0])).join("") + seaLabels())}<p class="model-readout" role="status">${selected ? `${esc(selected[1])} · ${esc(selected[2])}` : "Wähle einen Hauptstadtpunkt. Das Modell zeichnet keine Grenzen der Bundesländer oder Regierungsbezirke."}</p><details><summary>Alle 16 Landeshauptstädte und die sieben bayerischen Regierungssitze</summary><div class="scenario-buttons">${CAPITALS.map((p) => `<button type="button" data-country="${p[0]}" aria-pressed="${state.selected === p[0]}">${esc(p[1])} · ${esc(p[2])}</button>`).join("")}</div></details><p class="small">München ist zugleich Landeshauptstadt und Regierungssitz von Oberbayern. Punkte zeigen ungefähre Lagen; prüfe Verwaltungsgrenzen im Atlas.</p>`;
	}
	if (kind === "thematic") {
		const mode =
			state.selected === "agriculture" ? "agriculture" : "settlement";
		const points = THEMATIC_POINTS[mode];
		return `<h3>${mode === "settlement" ? "Ausgewählte Stadtregionen" : "Ausgewählte Agrarräume"}</h3>${mapSvg(points.map((p) => dot(p.lon, p.lat, p.name, germany)).join(""))}<ul>${points.map((p) => `<li><strong>${esc(p.name)}</strong>: ${esc(p.meaning)}</li>`).join("")}</ul><p class="small">Legende: Punkte markieren qualitative Unterrichtsbeispiele. Keine flächendeckende Statistik oder aktuelle Messung; unmarkierte Räume sind nicht leer. Redaktion: 13. November 2026. Gleicher Ausschnitt und gleiche Projektion erleichtern den Vergleich.</p>`;
	}
	if (kind === "scale") {
		const denominator = state.selected === "overview" ? 50000 : 25000;
		const meters = realDistanceMeters(state.centimeters, denominator);
		return `<label class="model-range">Gemessene Strecke auf einer unveränderten Papierkarte: <output>${fmt(state.centimeters)} cm</output><input type="range" data-model-range="centimeters" min="1" max="8" step="1" value="${state.centimeters}" aria-label="Kartenstrecke in Zentimetern"></label><p class="model-readout" role="status">${fmt(state.centimeters)} cm bei 1 : ${fmt(denominator).replaceAll(".", " ")} entsprechen ${fmt(meters)} m = ${fmt(meters / 1000)} km.</p><svg class="geo-map" viewBox="0 0 700 150" role="img" aria-label="Schematische Strecke und Vergleich von Luftlinie und gebogenem Weg"><path d="M60 100L640 100" class="equator"/><path d="M60 100Q200 0 350 70T640 100" class="route-line"/><circle cx="60" cy="100" r="6"/><circle cx="640" cy="100" r="6"/><text x="60" y="135">A</text><text x="620" y="135">B</text><text x="70" y="25">Gebogener Weg und gerade Luftlinie</text></svg><p class="small">Die Bildschirmzeichnung ist schematisch und kein Zentimetermaß. Der Regler bezeichnet eine bereits gemessene Papierstrecke. Du vergleichst dieselbe Kartenlänge bei zwei Maßstäben.</p>`;
	}
	if (kind === "relief") {
		const spacing = state.selected === "steep" ? 32 : 110;
		return `<svg class="geo-map" viewBox="0 0 700 330" role="img" aria-label="Schematische Höhenlinien und Nord-Süd-Abfolge der Großlandschaften">${[0, 1, 2].map((i) => `<path d="M${70 + i * spacing} 35V145" class="contour-line"/><text x="${75 + i * spacing}" y="${45 + i * 25}">${200 + i * 100} m</text>`).join("")}<text x="430" y="70">Gleicher Höhenabstand</text><text x="430" y="100">Eng = steiler</text><path d="M45 280L130 275L190 245L220 265L260 225L320 265L430 240L490 245L530 185L560 240L600 170L650 230" class="route-line"/><text x="40" y="315">N · Tiefland</text><text x="200" y="315">Mittelgebirge</text><text x="390" y="315">Alpenvorland</text><text x="570" y="315">Alpen · S</text></svg><p class="model-readout" role="status">${state.selected === "steep" ? "Enge Linien: derselbe Höhenunterschied auf kürzerer Strecke." : "Weite Linien: derselbe Höhenunterschied auf längerer Strecke."}</p><p class="small">Höhenlinien und Nord-Süd-Profil sind zwei getrennte schematische Darstellungen ohne messbaren Maßstab. Das Profil steht für die grobe Raumfolge, nicht für eine vermessene Reiseroute.</p>`;
	}
	const june = state.selected !== "december";
	return `<svg class="geo-map" viewBox="0 0 700 260" role="img" aria-label="Schematische Sonnenstrahlen und geneigte Erdachse im nördlichen ${june ? "Sommer" : "Winter"}"><circle cx="95" cy="130" r="55" class="sun"/><text x="60" y="225">Sonne</text>${[90, 130, 170].map((y) => `<path d="M170 ${y}H390" class="sun-ray"/>`).join("")}<circle cx="500" cy="130" r="70" class="earth"/><path d="M500 60A70 70 0 0 1 500 200Z" class="night"/><path d="M${june ? 455 : 545} 30L${june ? 545 : 455} 230" class="equator"/><text x="${june ? 435 : 550}" y="35">N</text><text x="${june ? 550 : 435}" y="235">S</text><text x="395" y="255">Geneigte Achse · Schema, nicht maßstäblich</text></svg><p class="model-readout" role="status">${june ? "Juni: Die Nordhalbkugel ist zur Sonne geneigt. Längere Tage und steilere Einstrahlung begünstigen den nördlichen Sommer." : "Dezember: Die Nordhalbkugel ist von der Sonne weg geneigt. Kürzere Tage und flachere Einstrahlung führen zum nördlichen Winter."}</p><p class="small">Die Sonne ist links. Die beiden Ansichten sind jeweils zur Sonne ausgerichtet; die Achse behält im Weltraum annähernd ihre Richtung. Die Zeichnung zeigt keine maßstäbliche Umlaufbahn. Drehe einen Globus im Licht, um Tag und Nacht zu prüfen.</p>`;
}
export function renderModel(
	lesson: Lesson,
	visited: string[],
	state: ModelState,
): string {
	const kind = lesson.model!;
	return `<section class="panel exploration"><span class="eyebrow">KARTEN- UND MODELLWERKSTATT</span><h2>Vergleichen und erklären</h2><p>Öffne alle Vergleichssituationen und erläutere, was sich verändert. Das Häkchen bestätigt nur das Öffnen, nicht dein Verständnis.</p><div class="scenario-buttons">${MODEL_SCENARIOS[kind].map((s) => `<button type="button" data-scenario="${s.id}" aria-pressed="${s.id === state.selected}">${visited.includes(s.id) ? "✓ " : ""}${esc(s.label)}</button>`).join("")}</div>${content(kind, state)}<p class="small">${modelReady(kind, visited) ? "✓ Alle Vergleichssituationen geöffnet." : "Öffne die noch nicht markierten Vergleichssituationen."}</p></section>`;
}
