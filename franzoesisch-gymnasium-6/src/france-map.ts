/** A schematic mainland map: city–river relationships remain exact in the sketch. */
export type MapPoint = readonly [number, number];

export const FRANCE_LAND = [
	[96, 116],
	[52, 100],
	[70, 80],
	[152, 94],
	[176, 47],
	[234, 64],
	[277, 27],
	[317, 69],
	[378, 88],
	[396, 155],
	[443, 199],
	[426, 272],
	[443, 310],
	[377, 361],
	[313, 343],
	[276, 381],
	[218, 360],
	[183, 316],
	[195, 253],
	[154, 202],
	[151, 145],
] as const satisfies readonly MapPoint[];

export const FRANCE_CITIES = {
	paris: { name: "Paris", pin: [270, 120], labelAt: [280, 124] },
	lyon: { name: "Lyon", pin: [365, 230], labelAt: [378, 228] },
	marseille: { name: "Marseille", pin: [370, 344], labelAt: [378, 337] },
	toulouse: { name: "Toulouse", pin: [271, 326], labelAt: [279, 335] },
	bordeaux: { name: "Bordeaux", pin: [229, 276], labelAt: [239, 270] },
	rennes: { name: "Rennes", pin: [150, 127], labelAt: [158, 132] },
	nantes: { name: "Nantes", pin: [175, 192], labelAt: [184, 211] },
} as const satisfies Record<
	string,
	{ name: string; pin: MapPoint; labelAt: MapPoint }
>;

export const FRANCE_RIVERS = {
	seine: {
		name: "Seine",
		labelAt: [238, 92],
		points: [
			[333, 155],
			[292, 143],
			FRANCE_CITIES.paris.pin,
			[235, 90],
			[205, 55.5],
		],
	},
	loire: {
		name: "Loire",
		labelAt: [225, 168],
		points: [
			[342, 233],
			[310, 201],
			[289, 176],
			[248, 182],
			[208, 197],
			FRANCE_CITIES.nantes.pin,
			[153, 183],
		],
	},
	rhone: {
		name: "Rhône",
		labelAt: [369, 284],
		points: [
			[399, 198],
			FRANCE_CITIES.lyon.pin,
			[359, 280],
			[350, 302],
			[338, 350],
		],
	},
	garonne: {
		name: "Garonne",
		labelAt: [237, 302],
		points: [
			[278, 350],
			FRANCE_CITIES.toulouse.pin,
			[250, 304],
			FRANCE_CITIES.bordeaux.pin,
			[193, 263.5],
		],
	},
} as const satisfies Record<
	string,
	{ name: string; labelAt: MapPoint; points: readonly MapPoint[] }
>;

export const FRANCE_MOUNTAINS = [
	{
		name: "Alpes",
		labelAt: [392, 251],
		peaks: [
			[[416, 239], [410, 255], [423, 255]],
			[[421, 266], [415, 281], [427, 281]],
			[[424, 291], [416, 307], [432, 307]],
		],
	},
	{
		name: "Pyrénées",
		labelAt: [245, 345],
		peaks: [
			[[231, 350], [223, 361], [239, 361]],
			[[252, 355], [244, 368], [260, 368]],
			[[275, 360], [266, 374], [280, 374]],
		],
	},
] as const satisfies readonly {
	name: string;
	labelAt: MapPoint;
	peaks: readonly (readonly MapPoint[])[];
}[];

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export const SAONE = {
	name: "Saône",
	labelAt: [370, 192] as const,
	points: [[345, 152], [351, 177], [361, 199], FRANCE_CITIES.lyon.pin] as const,
};

export function renderFranceMap(showSaone = false): string {
	const rivers = showSaone ? { ...FRANCE_RIVERS, saone: SAONE } : FRANCE_RIVERS;
	return `<figure class="france-map"><svg viewBox="0 0 600 440" role="img" aria-label="Lernskizze des europäischen Festlands Frankreichs: Städte, Flüsse, Meere und Gebirge. Norden ist oben.">
	<rect width="600" height="440" rx="18" class="sea"/>
	<path class="land" d="${path(FRANCE_LAND)} Z"/>
	<g class="water-labels"><text x="45" y="45">La Manche</text><text x="12" y="245">Atlantique</text><text x="367" y="413">Méditerranée</text><text x="510" y="38">N ↑</text></g>
	<g data-map-layer="rivers" class="map-rivers">${Object.entries(rivers)
		.map(
			([id, river]) =>
				`<path data-river="${id}" d="${path(river.points)}"/><text data-river-label="${id}" x="${river.labelAt[0]}" y="${river.labelAt[1]}">${river.name}</text>`,
		)
		.join("")}</g>
	<g data-map-layer="mountains" class="map-mountains">${FRANCE_MOUNTAINS.map(
		({ name, labelAt: [x, y], peaks }) =>
			`<path d="${peaks.map((peak) => `${path(peak)} Z`).join(" ")}"/><text x="${x}" y="${y}" text-anchor="middle">${name}</text>`,
	).join("")}</g>
	<g data-map-layer="cities" class="map-cities">${Object.entries(FRANCE_CITIES)
		.map(
			([id, city]) =>
				`<circle data-city="${id}" cx="${city.pin[0]}" cy="${city.pin[1]}" r="5"/><text data-city-label="${id}" x="${city.labelAt[0]}" y="${city.labelAt[1]}">${city.name}</text>`,
		)
		.join("")}<text x="79" y="109">Bretagne</text></g>
	</svg><figcaption>Lernskizze · europäisches Festland · nicht maßstäblich. Lage und Flussverlauf sind vereinfacht. Die Rhône mündet westlich von Marseille ins Mittelmeer.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["cities", "Städte"],
		["rivers", "Flüsse"],
		["mountains", "Gebirge"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}
