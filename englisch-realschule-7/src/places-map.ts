/** Schematic learning maps. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

interface Place {
	name: string;
	pin: MapPoint;
	labelAt: MapPoint;
	anchor: "start" | "middle" | "end";
}

/* ---------- Roman Britain: Britannia, Caledonia, Hibernia ---------- */

export const RB_CALEDONIA = [
	[230, 24],
	[344, 20],
	[378, 86],
	[370, 150],
	[236, 156],
	[222, 100],
] as const satisfies readonly MapPoint[];

export const RB_BRITANNIA = [
	[236, 156],
	[370, 150],
	[384, 226],
	[412, 324],
	[202, 356],
	[204, 224],
	[250, 206],
] as const satisfies readonly MapPoint[];

export const RB_HIBERNIA = [
	[30, 168],
	[142, 156],
	[158, 250],
	[128, 336],
	[52, 344],
	[24, 246],
] as const satisfies readonly MapPoint[];

/** Roman towns; the caption gives today's names. All lay in the province. */
export const RB_TOWNS = {
	eboracum: { name: "Eboracum", pin: [336, 202], labelAt: [336, 190], anchor: "middle", region: "britannia" },
	aquaeSulis: { name: "Aquae Sulis", pin: [262, 306], labelAt: [262, 294], anchor: "middle", region: "britannia" },
	londinium: { name: "Londinium", pin: [352, 300], labelAt: [352, 320], anchor: "middle", region: "britannia" },
	camulodunum: { name: "Camulodunum", pin: [384, 270], labelAt: [390, 258], anchor: "end", region: "britannia" },
} as const satisfies Record<string, Place & { region: "britannia" }>;

/** Hadrian's Wall runs across the north of the province, inside Britannia. */
export const RB_WALL = [
	[246, 168],
	[300, 162],
	[364, 162],
] as const satisfies readonly MapPoint[];

/* ---------- Ireland: Republic of Ireland and Northern Ireland ---------- */

export const IE_NORTHERN_IRELAND = [
	[250, 40],
	[350, 52],
	[372, 120],
	[330, 168],
	[250, 160],
	[228, 104],
] as const satisfies readonly MapPoint[];

export const IE_REPUBLIC = [
	[120, 40],
	[250, 40],
	[228, 104],
	[250, 160],
	[330, 168],
	[352, 230],
	[340, 330],
	[290, 420],
	[150, 430],
	[60, 380],
	[40, 260],
	[70, 150],
	[110, 110],
] as const satisfies readonly MapPoint[];

export const IE_CITIES = {
	belfast: { name: "Belfast", pin: [320, 110], labelAt: [320, 96], anchor: "middle", state: "ni" },
	dublin: { name: "Dublin", pin: [318, 236], labelAt: [318, 222], anchor: "middle", state: "republic" },
	galway: { name: "Galway", pin: [110, 250], labelAt: [110, 236], anchor: "middle", state: "republic" },
	limerick: { name: "Limerick", pin: [150, 316], labelAt: [150, 302], anchor: "middle", state: "republic" },
	cork: { name: "Cork", pin: [190, 396], labelAt: [190, 382], anchor: "middle", state: "republic" },
} as const satisfies Record<string, Place & { state: "ni" | "republic" }>;

/* ---------- Dublin city centre (blocks along the River Liffey) ---------- */

export const DUBLIN_BLOCKS = {
	oconnell: [
		[262, 24],
		[338, 24],
		[338, 130],
		[262, 130],
	],
	templeBar: [
		[160, 166],
		[282, 166],
		[282, 214],
		[160, 214],
	],
	trinity: [
		[318, 170],
		[450, 170],
		[450, 238],
		[318, 238],
	],
	castle: [
		[60, 222],
		[170, 222],
		[170, 276],
		[60, 276],
	],
	stephensGreen: [
		[250, 268],
		[400, 268],
		[400, 314],
		[250, 314],
	],
} as const satisfies Record<string, readonly MapPoint[]>;

export const DUBLIN_PLACES = {
	spire: { name: "The Spire", pin: [300, 66], labelAt: [306, 54], anchor: "start", block: "oconnell" },
	templeBar: { name: "Temple Bar", pin: [220, 196], labelAt: [220, 186], anchor: "middle", block: "templeBar" },
	trinity: { name: "Trinity College", pin: [384, 214], labelAt: [384, 200], anchor: "middle", block: "trinity" },
	castle: { name: "Dublin Castle", pin: [114, 258], labelAt: [114, 244], anchor: "middle", block: "castle" },
	green: { name: "St Stephen's Green", pin: [326, 300], labelAt: [326, 288], anchor: "middle", block: "stephensGreen" },
} as const satisfies Record<string, Place & { block: keyof typeof DUBLIN_BLOCKS }>;

/* ---------- Across the Atlantic: routes of Irish emigrants ---------- */

export const AT_NORTH_AMERICA = [
	[20, 40],
	[190, 30],
	[210, 120],
	[180, 250],
	[20, 270],
] as const satisfies readonly MapPoint[];

export const AT_IRELAND = [
	[466, 86],
	[520, 84],
	[530, 140],
	[500, 184],
	[460, 168],
] as const satisfies readonly MapPoint[];

export const AT_BRITAIN = [
	[540, 40],
	[580, 40],
	[590, 170],
	[560, 212],
	[536, 140],
] as const satisfies readonly MapPoint[];

export const AT_PORTS = {
	quebec: { name: "Quebec", pin: [150, 70], labelAt: [150, 58], anchor: "middle", land: "america" },
	boston: { name: "Boston", pin: [178, 118], labelAt: [170, 106], anchor: "end", land: "america" },
	newYork: { name: "New York", pin: [168, 164], labelAt: [160, 182], anchor: "end", land: "america" },
	cork: { name: "Cork", pin: [486, 164], labelAt: [480, 154], anchor: "end", land: "ireland" },
	dublin: { name: "Dublin", pin: [512, 116], labelAt: [506, 104], anchor: "end", land: "ireland" },
	liverpool: { name: "Liverpool", pin: [552, 120], labelAt: [558, 108], anchor: "middle", land: "britain" },
} as const satisfies Record<string, Place & { land: "america" | "ireland" | "britain" }>;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

function pins(places: Record<string, Place>, ids: string[]): string {
	return ids
		.map((id) => {
			const place = places[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name.replace(/'/g, "&#39;")}</text>`;
		})
		.join("");
}

function controls(layers: [string, string][]): string {
	return `<div class="map-controls" aria-label="Kartenebenen">${layers
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

export function renderRomanBritainMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 460 400" role="img" aria-label="Lernskizze der Britischen Inseln zur Römerzeit: Provinz Britannia, Caledonia im Norden, Hibernia im Westen und der Hadrianswall. Norden ist oben. Nicht maßstäblich.">
	<rect width="460" height="400" rx="16" class="sea"/>
	<g data-map-layer="lands">
		<path class="land region" data-region="caledonia" d="${path(RB_CALEDONIA)} Z"/>
		<path class="land region roman" data-region="britannia" d="${path(RB_BRITANNIA)} Z"/>
		<path class="land region" data-region="hibernia" d="${path(RB_HIBERNIA)} Z"/>
		<text class="region-name" text-anchor="middle" x="300" y="80">Caledonia</text>
		<text class="region-name" text-anchor="middle" x="300" y="96">never conquered</text>
		<text class="region-name" text-anchor="middle" x="262" y="236">Britannia</text>
		<text class="region-name" text-anchor="middle" x="262" y="250">Roman province</text>
		<text class="region-name" text-anchor="middle" x="90" y="246">Hibernia</text>
		<text class="region-name" text-anchor="middle" x="90" y="260">never Roman</text>
	</g>
	<g data-map-layer="wall">
		<path class="wall-line" d="${path(RB_WALL)}"/>
		<text class="region-name" text-anchor="end" x="238" y="172">Hadrian's Wall</text>
	</g>
	<g data-map-layer="towns" class="map-cities">${pins(RB_TOWNS, ["eboracum", "aquaeSulis", "londinium", "camulodunum"])}</g>
	<g class="water-labels"><text x="392" y="112">North Sea</text><text text-anchor="middle" x="180" y="290">Irish Sea</text><text x="424" y="24">N ↑</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Römische Städte und ihre heutigen Namen: Londinium = London, Eboracum = York, Aquae Sulis = Bath, Camulodunum = Colchester. Die Römer eroberten ab AD 43 den Süden der Insel (Britannia). Der Hadrianswall sicherte ab AD 122 die Nordgrenze; Caledonia (Schottland) und Hibernia (Irland) wurden nie römische Provinz.</figcaption></figure>${controls([
		["lands", "Gebiete"],
		["wall", "Hadrianswall"],
		["towns", "Römerstädte"],
	])}`;
}

export function renderIrelandMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 420 460" role="img" aria-label="Lernskizze der Insel Irland mit der Republik Irland und Nordirland, fünf Städten und dem Fluss Shannon. Norden ist oben. Nicht maßstäblich.">
	<rect width="420" height="460" rx="16" class="sea"/>
	<g data-map-layer="states">
		<path class="land region republic" data-state="republic" d="${path(IE_REPUBLIC)} Z"/>
		<path class="land region north" data-state="ni" d="${path(IE_NORTHERN_IRELAND)} Z"/>
		<text class="region-name" text-anchor="middle" x="270" y="300">Republic of Ireland</text>
		<text class="region-name" text-anchor="middle" x="270" y="314">EU · euro</text>
		<text class="region-name" text-anchor="middle" x="300" y="140">Northern Ireland</text>
		<text class="region-name" text-anchor="middle" x="300" y="154">UK · pound</text>
	</g>
	<g data-map-layer="waters" class="water-labels">
		<path class="river-line" d="M196 132 C186 196, 200 250, 150 316"/>
		<text x="200" y="236">Shannon</text>
		<text x="14" y="120">Atlantic</text>
		<text x="362" y="300">Irish</text>
		<text x="362" y="314">Sea</text>
		<text x="384" y="24">N ↑</text>
	</g>
	<g data-map-layer="cities" class="map-cities">${pins(IE_CITIES, ["belfast", "dublin", "galway", "limerick", "cork"])}</g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Auf der Insel Irland liegen zwei Staaten: die Republik Irland (Hauptstadt Dublin, EU-Mitglied, Euro) und Nordirland (Hauptstadt Belfast, Teil des Vereinigten Königreichs, Pfund). Der Shannon ist der längste Fluss der Insel.</figcaption></figure>${controls([
		["states", "Staaten"],
		["cities", "Städte"],
		["waters", "Gewässer"],
	])}`;
}

export function renderDublinMap(): string {
	const block = (key: keyof typeof DUBLIN_BLOCKS, extra = "") =>
		`<path class="land block${extra}" data-block="${key}" d="${path(DUBLIN_BLOCKS[key])} Z"/>`;
	return `<figure class="places-map"><svg viewBox="0 0 560 330" role="img" aria-label="Wegeskizze der Dubliner Innenstadt mit dem Fluss Liffey, der O'Connell Street, Temple Bar, Trinity College, Dublin Castle und St Stephen's Green. Norden ist oben. Nicht maßstäblich.">
	<rect width="560" height="330" rx="16" class="sea"/>
	<g data-map-layer="places">
		${block("oconnell")}${block("templeBar")}${block("trinity")}${block("castle")}${block("stephensGreen", " park")}
		<text class="region-name" x="256" y="100" text-anchor="end">O'Connell Street</text>
		<text class="region-name" x="316" y="258">Grafton Street ↓</text>
	</g>
	<g data-map-layer="river" class="water-labels">
		<path class="river-line" d="M16 148 H544"/>
		<rect x="284" y="138" width="34" height="20" rx="3" class="land"/>
		<text x="40" y="142">River Liffey</text>
		<text x="324" y="142">O'Connell Bridge</text>
		<text x="524" y="24">N ↑</text>
	</g>
	<g data-map-layer="route">
		<path class="route-line" d="M300 74 V250 H310 V268" stroke-dasharray="6 4"/>
	</g>
	<g data-map-layer="sights" class="map-cities">${pins(DUBLIN_PLACES, ["spire", "templeBar", "trinity", "castle", "green"])}</g>
	</svg><figcaption>Wegeskizze · Norden oben · nicht maßstäblich. Die gestrichelte Route führt von der O'Connell Street über die O'Connell Bridge, an Trinity College vorbei und die Grafton Street hinunter zum St Stephen's Green.</figcaption></figure>${controls([
		["places", "Viertel"],
		["sights", "Sehenswürdigkeiten"],
		["route", "Route"],
	])}`;
}

export function renderEmigrationMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 600 300" role="img" aria-label="Lernskizze des Nordatlantiks mit Auswanderungsrouten aus Irland über Liverpool nach Quebec, Boston und New York. Nicht maßstäblich.">
	<rect width="600" height="300" rx="16" class="sea"/>
	<g data-map-layer="lands">
		<path class="land region" data-land="america" d="${path(AT_NORTH_AMERICA)} Z"/>
		<path class="land region republic" data-land="ireland" d="${path(AT_IRELAND)} Z"/>
		<path class="land region" data-land="britain" d="${path(AT_BRITAIN)} Z"/>
		<text class="region-name" x="40" y="220">North America</text>
		<text class="region-name" text-anchor="middle" x="494" y="138">Ireland</text>
		<text class="region-name" text-anchor="middle" x="566" y="190">Britain</text>
	</g>
	<g data-map-layer="routes">
		<path class="route-line" d="M486 164 C400 250, 260 230, 168 164" stroke-dasharray="7 5"/>
		<path class="route-line" d="M512 116 L552 120" stroke-dasharray="4 4"/>
		<path class="route-line" d="M552 120 C470 30, 260 40, 178 118" stroke-dasharray="7 5"/>
		<path class="route-line" d="M486 164 C420 20, 240 10, 150 70" stroke-dasharray="3 6"/>
		<text class="region-name" text-anchor="middle" x="330" y="150">Atlantic Ocean</text>
		<text class="region-name" text-anchor="middle" x="330" y="166">several weeks by sailing ship</text>
	</g>
	<g data-map-layer="ports" class="map-cities">${pins(AT_PORTS, ["quebec", "boston", "newYork", "cork", "dublin", "liverpool"])}</g>
	</svg><figcaption>Lernskizze · nicht maßstäblich. Während der Großen Hungersnot (1845–1852) verließen sehr viele Menschen Irland, oft über Liverpool. Ziele waren u. a. Quebec in Kanada sowie Boston und New York in den USA.</figcaption></figure>${controls([
		["lands", "Länder"],
		["routes", "Routen"],
		["ports", "Häfen"],
	])}`;
}
