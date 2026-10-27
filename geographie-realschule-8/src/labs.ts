import countries from "./data/countries.json";
import { esc } from "./practice";

export type LabKind =
	| "america"
	| "asia"
	| "russia"
	| "monsoon"
	| "water"
	| "chain"
	| "hdi"
	| "stats";
export interface LabState {
	selected: string;
	visited: string[];
	season: string;
	withdrawal: number;
	share: number;
	health: number;
	education: number;
	income: number;
	total: number;
	population: number;
	changed: boolean;
}
export const freshLab = (): LabState => ({
	selected: "",
	visited: [],
	season: "",
	withdrawal: 0,
	share: 20,
	health: 0.8,
	education: 0.8,
	income: 0.2,
	total: 600,
	population: 20,
	changed: false,
});
export const fmt = (n: number, digits = 0): string =>
	n.toLocaleString("de-DE", { maximumFractionDigits: digits });
function range(n: number, min: number, max: number): number {
	if (!Number.isFinite(n) || n < min || n > max)
		throw new Error("Invalid model value");
	return n;
}
/** One fictional time step; all terms use the same arbitrary volume unit. */
export function waterBalance(withdrawal: number) {
	range(withdrawal, 0, 40);
	return {
		start: 100,
		inflow: 30,
		evaporation: 20,
		withdrawal,
		end: 110 - withdrawal,
	};
}
/** Fixed price of 100; shifting the manufacturing share changes the trade share. No profit model. */
export function priceShares(manufacturing: number): number[] {
	range(manufacturing, 10, 50);
	return [10, manufacturing, 10, 20, 60 - manufacturing];
}
/** Already normalised fictional indices; not a conversion of real country raw data. */
export function developmentIndex(
	health: number,
	education: number,
	income: number,
): number {
	[health, education, income].forEach((n) => {
		range(n, 0.1, 1);
	});
	return Math.cbrt(health * education * income);
}
/** Billion units divided by million persons yields thousand units per person. */
export function perCapita(total: number, population: number): number {
	range(total, 100, 1000);
	range(population, 10, 100);
	return (total * 1000) / population;
}
export const RAIN = {
	summer: [20, 20, 20, 40, 90, 250, 250, 250, 250, 100, 40, 20],
	winter: [90, 80, 60, 30, 20, 10, 10, 10, 20, 40, 70, 90],
};
export interface MapPoint {
	id: string;
	name: string;
	lon: number;
	lat: number;
	note: string;
}
export const MAPS = {
	america: {
		title: "Amerika",
		bounds: [-170, -30, -60, 80],
		points: [
			{
				id: "rockies",
				name: "Rocky Mountains",
				lon: -110,
				lat: 43,
				note: "Orientierungspunkt im westlichen Nordamerika; der Gebirgszug ist viel ausgedehnter als dieser Punkt.",
			},
			{
				id: "mississippi",
				name: "Mississippi",
				lon: -90,
				lat: 35,
				note: "Orientierungspunkt am Flusssystem der Inneren Ebenen; kein eingezeichneter vollständiger Flusslauf.",
			},
			{
				id: "caribbean",
				name: "Karibik",
				lon: -75,
				lat: 18,
				note: "Insel- und Meeresraum zwischen Nord- und Südamerika.",
			},
			{
				id: "amazon",
				name: "Amazonasbecken",
				lon: -60,
				lat: -3,
				note: "Großraum östlich der Anden; der Punkt ist kein Flusslauf oder Gebietsumriss.",
			},
			{
				id: "andes",
				name: "Anden",
				lon: -68,
				lat: -20,
				note: "Gebirgskette am westlichen Rand Südamerikas.",
			},
			{
				id: "toronto",
				name: "Toronto",
				lon: -79.38,
				lat: 43.65,
				note: "Stadt im südlichen Kanada, im Raum der Großen Seen.",
			},
			{
				id: "saopaulo",
				name: "São Paulo",
				lon: -46.63,
				lat: -23.55,
				note: "Metropole im Südosten Brasiliens, nahe der Atlantikküste.",
			},
		] as MapPoint[],
	},
	asia: {
		title: "China und Indien",
		bounds: [55, 145, 0, 60],
		points: [
			{
				id: "himalaya",
				name: "Himalaya",
				lon: 86,
				lat: 28,
				note: "Gebirgsgürtel nördlich des indischen Subkontinents; Tibet schließt im Norden an.",
			},
			{
				id: "ganges",
				name: "Gangesebene",
				lon: 84,
				lat: 25,
				note: "Tiefland südlich des Himalaya; der Ganges entwässert zum Golf von Bengalen.",
			},
			{
				id: "beijing",
				name: "Beijing",
				lon: 116.4,
				lat: 39.9,
				note: "Hauptstadt im Norden Chinas.",
			},
			{
				id: "shanghai",
				name: "Shanghai",
				lon: 121.47,
				lat: 31.23,
				note: "Wirtschaftszentrum an Chinas Ostküste im Raum der Jangtsemündung.",
			},
			{
				id: "delhi",
				name: "Delhi",
				lon: 77.2,
				lat: 28.6,
				note: "Großstadt im nördlichen Binnenland Indiens.",
			},
			{
				id: "mumbai",
				name: "Mumbai",
				lon: 72.88,
				lat: 19.08,
				note: "Großstadt an der indischen Westküste am Arabischen Meer.",
			},
			{
				id: "bengaluru",
				name: "Bengaluru",
				lon: 77.59,
				lat: 12.97,
				note: "Wirtschaftszentrum im südindischen Binnenland.",
			},
		] as MapPoint[],
	},
	russia: {
		title: "Russland und Zentralasien",
		bounds: [20, 190, 30, 82],
		points: [
			{
				id: "moscow",
				name: "Moskau",
				lon: 37.62,
				lat: 55.75,
				note: "Hauptstadt im europäischen Teil Russlands, westlich des Ural.",
			},
			{
				id: "ural",
				name: "Ural",
				lon: 60,
				lat: 60,
				note: "Gebirgsraum zwischen osteuropäischer und westsibirischer Ebene.",
			},
			{
				id: "siberia",
				name: "Westsibirien",
				lon: 75,
				lat: 60,
				note: "Großer Raum östlich des Ural; kein Punkt kann seine Vielfalt vollständig zeigen.",
			},
			{
				id: "aral",
				name: "Aralsee",
				lon: 60,
				lat: 45,
				note: "Zentralasien: Kasachstan und Usbekistan. Er liegt nicht in Russland.",
			},
			{
				id: "vladivostok",
				name: "Wladiwostok",
				lon: 131.89,
				lat: 43.12,
				note: "Stadt an Russlands pazifischer Seite; große Entfernung zu Moskau.",
			},
		] as MapPoint[],
	},
};
export function goals(kind: LabKind, state: LabState): boolean[] {
	if (kind === "america" || kind === "asia" || kind === "russia")
		return [
			state.visited.includes(MAPS[kind].points[0].id),
			state.visited.length >= 3,
		];
	if (kind === "monsoon")
		return [state.season === "summer", state.season === "winter"];
	if (kind === "water")
		return [
			state.changed && state.withdrawal === 10,
			state.changed && state.withdrawal > 10,
		];
	if (kind === "chain")
		return [
			state.changed && state.share > 20,
			state.changed && state.share === 50,
		];
	if (kind === "hdi")
		return [
			state.changed && state.income >= 0.8,
			state.changed && state.education < 0.4,
		];
	return [
		state.changed && state.total === 600 && state.population === 60,
		state.changed && state.total === 900 && state.population === 60,
	];
}
const descriptions: Record<LabKind, string[]> = {
	america: [
		"Rocky Mountains verorten",
		"Mindestens drei Orte oder Räume vergleichen",
	],
	asia: ["Himalaya verorten", "Mindestens drei Orte oder Räume vergleichen"],
	russia: ["Moskau verorten", "Mindestens drei Orte oder Räume vergleichen"],
	monsoon: [
		"Sommermodell mit feuchter Luft vom Meer untersuchen",
		"Wintermodell zum Vergleich untersuchen",
	],
	water: [
		"Eine ausgeglichene Bilanz einstellen",
		"Eine abnehmende Bilanz einstellen",
	],
	chain: [
		"Fertigungsanteil erhöhen",
		"Den Fertigungsanteil auf 50 setzen und Handel vergleichen",
	],
	hdi: [
		"Einkommensindex auf mindestens 0,8 erhöhen",
		"Bildungsindex unter 0,4 setzen und vergleichen",
	],
	stats: [
		"Bei gleicher Gesamtleistung die Bevölkerung auf 60 setzen",
		"Land B mit 900 Mrd. und 60 Mio. einstellen",
	],
};
type Position = number[];
function mapSvg(kind: keyof typeof MAPS, selected: string): string {
	const map = MAPS[kind],
		[west, east, south, north] = map.bounds;
	const project = ([rawLon, lat]: Position): Position => {
		const lon = kind === "russia" && rawLon < 0 ? rawLon + 360 : rawLon;
		return [
			((lon - west) / (east - west)) * 800,
			((north - lat) / (north - south)) * 440,
		];
	};
	const outline = (coordinates: Position[][][]): string =>
		coordinates
			.map((polygon) =>
				polygon
					.map(
						(ring) =>
							`${ring
								.map(
									(point, index) =>
										`${index ? "L" : "M"}${project(point)
											.map((n) => n.toFixed(2))
											.join(",")}`,
								)
								.join(" ")} Z`,
					)
					.join(" "),
			)
			.join(" ");
	const paths = countries
		.map((country) => {
			const geometry = country.geometry as {
				type: string;
				coordinates: unknown;
			};
			const polygons = (
				geometry.type === "Polygon"
					? [geometry.coordinates]
					: geometry.coordinates
			) as Position[][][];
			return `<path d="${outline(polygons)}"><title>${esc(country.name)}</title></path>`;
		})
		.join("");
	const grid = [];
	for (let lat = Math.ceil(south / 20) * 20; lat <= north; lat += 20) {
		const y = project([west, lat])[1];
		grid.push(
			`<path class="grid-line" d="M0,${y}H800"/><text x="6" y="${y - 4}">${lat}°</text>`,
		);
	}
	for (let lon = Math.ceil(west / 20) * 20; lon <= east; lon += 20) {
		const x = project([lon, south])[0];
		grid.push(
			`<path class="grid-line" d="M${x},0V440"/><text x="${x + 4}" y="434">${lon > 180 ? lon - 360 : lon}°</text>`,
		);
	}
	return `<svg class="geo-map" viewBox="0 0 800 440" role="img" aria-label="Orientierungskarte ${esc(map.title)} mit Gradnetz und ausgewählten Punkten. Die Auswahl darunter erläutert jeden Punkt."><defs><clipPath id="geo-clip"><rect width="800" height="440"/></clipPath></defs><g clip-path="url(#geo-clip)"><g class="countries">${paths}</g><g class="graticule">${grid.join("")}</g>${map.points
		.map((point, index) => {
			const [x, y] = project([point.lon, point.lat]);
			return `<circle class="map-dot ${selected === point.id ? "active" : ""}" cx="${x}" cy="${y}" r="${selected === point.id ? 8 : 5}"/><text class="point-number" x="${x + 10}" y="${y - 6}">${index + 1}</text>`;
		})
		.join("")}</g><text x="760" y="24">N ↑</text></svg>`;
}
const slider = (
	key: string,
	label: string,
	value: number,
	min: number,
	max: number,
	step = 1,
): string =>
	`<label class="lab-control">${label}<input data-value="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}"><output>${fmt(value, 2)}</output></label>`;
export function renderLab(kind: LabKind, state: LabState): string {
	let body = "";
	if (kind === "america" || kind === "asia" || kind === "russia") {
		const map = MAPS[kind],
			point = map.points.find((p) => p.id === state.selected);
		body = `${mapSvg(kind, state.selected)}<div class="map-buttons">${map.points.map((p, i) => `<button type="button" class="button secondary" data-point="${p.id}" aria-pressed="${state.selected === p.id}">${i + 1} · ${esc(p.name)}</button>`).join("")}</div><p class="readout" role="status">${point ? esc(point.note) : "Wähle einen Orientierungspunkt. Nord ist oben; vergleiche Himmelsrichtungen mit dem Gradnetz."}</p><p class="small">Natural Earth 5.1.1 · Public Domain · vereinfachte Länderumrisse. Äquidistante Zylinderprojektion, nicht flächentreu; keine präzise Entfernungsmessung. Punkte ersetzen keine Gebirgs-, Fluss- oder Flächengrenzen. Grenzen nach Datensatz 5.1.1; keine Aussage über völkerrechtliche Anerkennung.</p>`;
	} else if (kind === "monsoon") {
		const rain =
			state.season === "summer"
				? RAIN.summer
				: state.season === "winter"
					? RAIN.winter
					: null;
		body = `<div class="map-buttons"><button class="button secondary" data-season="summer" aria-pressed="${state.season === "summer"}">Sommermodell</button><button class="button secondary" data-season="winter" aria-pressed="${state.season === "winter"}">Wintermodell</button></div><p class="readout" role="status">${state.season === "summer" ? "Feuchte Luft: Meer → Land. Aufsteigen kann Regen fördern." : state.season === "winter" ? "Überwiegend Land → Meer; örtliche und regionale Ausnahmen bleiben möglich." : "Wähle eine Jahreszeit und vergleiche die erfundene Regenverteilung."}</p>${rain ? `<svg class="rain-chart" viewBox="0 0 680 250" role="img" aria-label="Fiktive monatliche Niederschläge, Skala 0 bis 300 Millimeter"><text x="2" y="18">mm</text>${[0, 100, 200, 300].map((n) => `<text x="2" y="${220 - n * 0.6}">${n}</text><path d="M35,${220 - n * 0.6}H670" class="grid-line"/>`).join("")}${rain.map((n, i) => `<rect x="${40 + i * 52}" y="${220 - n * 0.6}" width="34" height="${n * 0.6}"/><text x="${45 + i * 52}" y="242">${i + 1}</text>`).join("")}</svg><table><caption>Erfundene Monatswerte in mm · kein Ort, keine Messreihe</caption><thead><tr><th>Monat</th>${rain.map((_, i) => `<th>${i + 1}</th>`).join("")}</tr></thead><tbody><tr><th>Niederschlag</th>${rain.map((n) => `<td>${n}</td>`).join("")}</tr></tbody></table><p>Jahressumme: ${fmt(rain.reduce((a, b) => a + b, 0))} mm</p>` : ""}<p class="small">Zwei erfundene Profile zur Untersuchung saisonaler Konzentration; kein Vorhersagemodell und kein reales Klimadiagramm.</p>`;
	} else if (kind === "water") {
		const w = waterBalance(state.withdrawal);
		body = `${slider("withdrawal", "Zusätzliche Entnahme · Modellvolumen", state.withdrawal, 0, 40)}<p class="readout" role="status">100 + 30 − 20 − ${fmt(w.withdrawal)} = ${fmt(w.end)} Volumeneinheiten</p><div class="water-level" style="--fill:${(w.end / 140) * 100}%"><span>Endvorrat ${fmt(w.end)}</span></div><p>Bei Entnahme 10 ist die Bilanz ausgeglichen. Mehr Entnahme senkt den Vorrat. Alle anderen Größen bleiben konstant.</p><p class="small">Ein erfundener Zeitschritt, keine Volumen- oder Flächenprognose für den Aralsee. Volumen und Fläche sind unterschiedliche Größen.</p>`;
	} else if (kind === "chain") {
		const values = priceShares(state.share),
			labels = ["Rohstoffe", "Fertigung", "Transport", "Entwicklung", "Handel"];
		body = `${slider("share", "Fertigung · Anteil an 100 Geldeinheiten", state.share, 10, 50)}<div class="share-bar" aria-hidden="true">${values.map((n, i) => `<span style="width:${n}%;--part:${i}">${n}</span>`).join("")}</div><table><caption>Fiktiver konstanter Verkaufspreis: 100</caption><tbody>${values.map((n, i) => `<tr><th>${labels[i]}</th><td>${n} %</td></tr>`).join("")}</tbody></table><p class="small">Nur die Verteilungslogik wird verändert. Anteile sind weder gemessene Branchendaten noch Gewinne oder Löhne.</p>`;
	} else if (kind === "hdi") {
		body = `${slider("health", "Gesundheitsindex", state.health, 0.1, 1, 0.1)}${slider("education", "Bildungsindex", state.education, 0.1, 1, 0.1)}${slider("income", "Einkommensindex", state.income, 0.1, 1, 0.1)}<p class="readout" role="status">Geometrisches Mittel: ${fmt(developmentIndex(state.health, state.education, state.income), 3)}</p><p class="small">Fiktive, bereits normierte Teilindizes. Das Modell berechnet keine echten Länderwerte aus Schuljahren oder Einkommen und bildet Verteilung und Rechte nicht ab.</p>`;
	} else {
		body = `${slider("total", "Gesamtleistung · Milliarden Geldeinheiten", state.total, 100, 1000, 100)}${slider("population", "Bevölkerung · Millionen Menschen", state.population, 10, 100, 10)}<p class="readout" role="status">Pro Kopf: ${fmt(perCapita(state.total, state.population))} Geldeinheiten</p><p class="small">Erfundene Länderwerte. Gleiche Gesamtsumme bei mehr Menschen bedeutet einen kleineren Pro-Kopf-Wert; die Verteilung innerhalb des Landes bleibt offen.</p>`;
	}
	return `<section class="panel lab" id="lab"><h2>Erkunden und vergleichen</h2>${body}<ul class="lab-goals">${descriptions[kind].map((d, i) => `<li>${goals(kind, state)[i] ? "✓" : "○"} ${d}</li>`).join("")}</ul><p class="small">Erkundungsziele zeigen den aktuellen Modellzustand und zählen nicht als Prüfung oder persönliche ZAM-Bewertung. Vergleiche die Zustände und begründe den Unterschied selbst.</p></section>`;
}
export function mountLab(
	root: HTMLElement,
	kind: LabKind,
	state: LabState,
): void {
	const refresh = () => {
		const point = root.querySelector<HTMLElement>("button:focus")?.dataset;
		root.outerHTML = renderLab(kind, state);
		const next = document.querySelector<HTMLElement>("#lab");
		if (next) {
			mountLab(next, kind, state);
			if (point?.point)
				next
					.querySelector<HTMLElement>(`[data-point="${point.point}"]`)
					?.focus();
			if (point?.season)
				next
					.querySelector<HTMLElement>(`[data-season="${point.season}"]`)
					?.focus();
		}
	};
	root.querySelectorAll<HTMLButtonElement>("[data-point]").forEach(
		(button) =>
			void button.addEventListener("click", () => {
				state.selected = button.dataset.point ?? "";
				state.visited = [...new Set([...state.visited, state.selected])];
				refresh();
			}),
	);
	root.querySelectorAll<HTMLButtonElement>("[data-season]").forEach(
		(button) =>
			void button.addEventListener("click", () => {
				state.season = button.dataset.season ?? "";
				refresh();
			}),
	);
	root.querySelectorAll<HTMLInputElement>("[data-value]").forEach(
		(input) =>
			void input.addEventListener("input", () => {
				const key = input.dataset.value as
					| "withdrawal"
					| "share"
					| "health"
					| "education"
					| "income"
					| "total"
					| "population";
				state[key] = Number(input.value);
				state.changed = true;
				const output = input.parentElement?.querySelector("output");
				if (output) output.textContent = fmt(state[key], 2);
				// Keep the active native range element mounted so dragging and keyboard
				// adjustment continue across readout updates.
				const template = document.createElement("template");
				template.innerHTML = renderLab(kind, state);
				for (const selector of [
					".readout",
					".water-level",
					".share-bar",
					"table",
					".lab-goals",
				]) {
					const fresh = template.content.querySelector(selector),
						old = root.querySelector(selector);
					if (fresh && old) old.replaceWith(fresh);
				}
			}),
	);
}
