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
	toulouse: { name: "Toulouse", pin: [271, 326], labelAt: [286, 329] },
	bordeaux: { name: "Bordeaux", pin: [229, 276], labelAt: [239, 270] },
	rennes: { name: "Rennes", pin: [150, 127], labelAt: [158, 132] },
	nantes: { name: "Nantes", pin: [175, 192], labelAt: [184, 211] },
	lille: { name: "Lille", pin: [292, 56], labelAt: [302, 60] },
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
		labelAt: [252, 345],
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

const regions = [
	{ name: "Normandie", city: "Rouen", pin: [235, 90], labelAt: [247, 83], detail: "Nordwesten · Rouen liegt an der Seine, die in den Ärmelkanal mündet." },
	{ name: "Occitanie", city: "Toulouse", pin: FRANCE_CITIES.toulouse.pin, labelAt: [269, 309], detail: "Süden · Die Region reicht von den Pyrenäen bis zum Mittelmeer." },
	{ name: "Provence-Alpes-Côte d’Azur", city: "Marseille", pin: FRANCE_CITIES.marseille.pin, labelAt: [363, 312], detail: "Südosten · Marseille liegt am Mittelmeer, östlich des Rhônedeltas." },
] as const;

export function renderRegionMap(): string {
	return `<figure class="france-map region-map" data-explorer>
		<figcaption>Regionen auf der Lernskizze · Wähle einen Ort</figcaption>
		<svg viewBox="0 0 520 440" role="img" aria-label="Rouen im Nordwesten, Toulouse im Süden, Marseille im Südosten von Frankreich.">
			<rect width="520" height="440" rx="18" class="sea"/>
			<path class="land" d="${path(FRANCE_LAND)} Z"/>
			<g class="water-labels"><text x="47" y="45">La Manche</text><text x="18" y="234">Atlantique</text><text x="330" y="409">Méditerranée</text><text x="443" y="38">N ↑</text></g>
			<g class="map-rivers"><path d="${path(FRANCE_RIVERS.seine.points)}"/><path d="${path(FRANCE_RIVERS.garonne.points)}"/><path d="${path(FRANCE_RIVERS.rhone.points)}"/></g>
			<g class="map-cities">${regions.map(({ city, pin: [x, y], labelAt: [labelX, labelY] }, index) =>
				`<g data-region-marker="${index}"><circle class="region-halo" cx="${x}" cy="${y}" r="14"/><circle cx="${x}" cy="${y}" r="5"/><text x="${labelX}" y="${labelY}">${city}</text></g>`
			).join("")}</g>
		</svg>
		<div class="step-options" role="group" aria-label="Regionen">${regions.map(({city}, index) =>
			`<button type="button" data-step="${index}" aria-pressed="${index === 0}"><strong lang="fr">${city}</strong></button>`
		).join("")}</div>
		<div class="step-results" aria-live="polite">${regions.map(({name, detail}, index) =>
			`<div data-step-panel="${index}"${index ? " hidden" : ""}><p lang="fr">${name}</p><p class="small">${detail}</p></div>`
		).join("")}</div>
	</figure>`;
}

/** Marseille and Lille on the mainland sketch; Paris stays as orientation. */
export function renderCitiesMap(): string {
	const shown = [
		["marseille", 0],
		["lille", 1],
	] as const;
	return `<svg class="cities-map" viewBox="0 0 520 440" role="img" aria-label="Lernskizze Frankreichs: Marseille im Süden am Mittelmeer, Lille im Norden nahe Belgien, Paris dazwischen.">
		<rect width="520" height="440" rx="18" class="sea"/>
		<path class="land" d="${path(FRANCE_LAND)} Z"/>
		<g class="water-labels"><text x="47" y="45">La Manche</text><text x="18" y="234">Atlantique</text><text x="330" y="409">Méditerranée</text><text x="350" y="40">Belgique</text><text x="443" y="420">N ↑</text></g>
		<g class="map-cities"><circle cx="${FRANCE_CITIES.paris.pin[0]}" cy="${FRANCE_CITIES.paris.pin[1]}" r="4" class="map-reference"/><text x="${FRANCE_CITIES.paris.labelAt[0]}" y="${FRANCE_CITIES.paris.labelAt[1]}">Paris</text>${shown
			.map(([id, mark]) => {
				const city = FRANCE_CITIES[id];
				return `<g data-mark="${mark}"><circle class="region-halo" cx="${city.pin[0]}" cy="${city.pin[1]}" r="14"/><circle cx="${city.pin[0]}" cy="${city.pin[1]}" r="6"/><text x="${city.labelAt[0]}" y="${city.labelAt[1]}">${city.name}</text></g>`;
			})
			.join("")}</g>
	</svg><p class="small map-caption">Lernskizze · nicht maßstäblich.</p>`;
}

/** Québec as a learning sketch: the river runs from Montréal north-east past Québec to the Atlantic. */
export const QUEBEC_RIVER = [
	[120, 300],
	[190, 268],
	[268, 222],
	[318, 196],
	[400, 150],
	[470, 112],
	[540, 92],
] as const satisfies readonly MapPoint[];
export const QUEBEC_CITIES = {
	montreal: { name: "Montréal", pin: [190, 268], labelAt: [150, 296] },
	quebec: { name: "Québec", pin: [318, 196], labelAt: [290, 226] },
	ottawa: { name: "Ottawa", pin: [110, 262], labelAt: [40, 254] },
} as const satisfies Record<string, { name: string; pin: MapPoint; labelAt: MapPoint }>;

export function renderQuebecMap(): string {
	const { montreal, quebec, ottawa } = QUEBEC_CITIES;
	const city = (c: { name: string; pin: MapPoint; labelAt: MapPoint }, mark: number, star = false) =>
		`<g data-mark="${mark}"><circle class="region-halo" cx="${c.pin[0]}" cy="${c.pin[1]}" r="14"/>${star ? `<path d="M${c.pin[0]} ${c.pin[1] - 8} l2.4 5.6 6 .5 -4.6 4 1.4 5.9 -5.2 -3.2 -5.2 3.2 1.4 -5.9 -4.6 -4 6 -.5 Z" class="capital"/>` : `<circle cx="${c.pin[0]}" cy="${c.pin[1]}" r="6"/>`}<text x="${c.labelAt[0]}" y="${c.labelAt[1]}">${c.name}</text></g>`;
	return `<svg class="quebec-map" viewBox="0 0 600 380" role="img" aria-label="Lernskizze: Der Sankt-Lorenz-Strom fließt von Montréal nach Nordosten an der Stadt Québec vorbei zum Atlantik. Ottawa liegt westlich von Montréal außerhalb der Provinz.">
		<rect width="600" height="380" rx="18" class="sea"/>
		<path class="land" d="M0 0 H600 V70 L540 92 L470 112 L400 150 L318 196 L268 222 L190 268 L120 300 L0 330 Z"/>
		<path class="land land-south" d="M0 350 L130 316 L200 290 L280 248 L330 222 L410 180 L480 146 L600 120 V380 H0 Z"/>
		<path class="border" d="M168 0 L160 120 L150 290"/><g class="water-labels"><text x="380" y="40">Province de Québec</text><text x="498" y="124">Atlantique →</text><text x="40" y="365">États-Unis</text><text x="20" y="226">Ontario</text><text x="540" y="360">N ↑</text></g>
		<g data-mark="2" class="map-rivers"><path d="${path(QUEBEC_RIVER)}"/><text x="344" y="240">fleuve Saint-Laurent</text></g>
		<g class="map-cities"><g class="map-reference-city"><circle cx="${ottawa.pin[0]}" cy="${ottawa.pin[1]}" r="4" class="map-reference"/><text x="${ottawa.labelAt[0]}" y="${ottawa.labelAt[1]}">${ottawa.name}</text></g>${city(quebec, 0, true)}${city(montreal, 1)}</g>
	</svg><p class="small map-caption">Lernskizze · nicht maßstäblich. Ottawa ist die Hauptstadt Kanadas und liegt außerhalb der Provinz.</p>`;
}
