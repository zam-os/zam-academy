/** Schematic learning maps. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

/** Outer silhouette of England, Scotland and Wales. The country polygons sit inside it. */
export const GREAT_BRITAIN = [
	[250, 36],
	[330, 24],
	[390, 70],
	[370, 150],
	[410, 210],
	[390, 330],
	[300, 350],
	[270, 250],
	[230, 230],
	[210, 190],
	[250, 150],
	[240, 80],
] as const satisfies readonly MapPoint[];

/** Outer silhouette of the island of Ireland, larger than Wales. */
export const IRELAND_ISLAND = [
	[36, 168],
	[96, 150],
	[156, 168],
	[168, 230],
	[140, 330],
	[70, 352],
	[24, 300],
	[20, 220],
] as const satisfies readonly MapPoint[];

export const CANADA = [
	[380, 40],
	[560, 28],
	[590, 130],
	[400, 140],
] as const satisfies readonly MapPoint[];

export const LOWER_48 = [
	[400, 150],
	[590, 145],
	[580, 280],
	[410, 290],
] as const satisfies readonly MapPoint[];

export const ALASKA = [
	[330, 40],
	[375, 36],
	[378, 90],
	[328, 95],
] as const satisfies readonly MapPoint[];

export const HAWAII = [
	[350, 230],
	[370, 225],
	[372, 245],
	[348, 248],
] as const satisfies readonly MapPoint[];

export const SCOTLAND = [
	[250, 36],
	[330, 24],
	[390, 70],
	[360, 148],
	[250, 140],
	[240, 80],
] as const satisfies readonly MapPoint[];

export const ENGLAND = [
	[268, 148],
	[360, 148],
	[410, 210],
	[390, 330],
	[300, 350],
	[278, 250],
	[286, 190],
] as const satisfies readonly MapPoint[];

export const WALES = [
	[214, 196],
	[268, 186],
	[276, 236],
	[248, 278],
	[210, 246],
] as const satisfies readonly MapPoint[];

export const NORTHERN_IRELAND = [
	[78, 156],
	[140, 150],
	[156, 196],
	[108, 214],
	[72, 190],
] as const satisfies readonly MapPoint[];

export const REPUBLIC_OF_IRELAND = [
	[36, 196],
	[108, 214],
	[156, 210],
	[168, 250],
	[140, 330],
	[70, 352],
	[24, 300],
	[24, 230],
] as const satisfies readonly MapPoint[];

export const PLACES = {
	london: { name: "London", pin: [340, 240], labelAt: [350, 230], anchor: "start", land: "england" },
	edinburgh: { name: "Edinburgh", pin: [310, 84], labelAt: [310, 70], anchor: "middle", land: "scotland" },
	cardiff: { name: "Cardiff", pin: [242, 230], labelAt: [242, 216], anchor: "middle", land: "wales" },
	dublin: { name: "Dublin", pin: [78, 270], labelAt: [88, 260], anchor: "start", land: "republic" },
	belfast: { name: "Belfast", pin: [112, 182], labelAt: [112, 168], anchor: "middle", land: "northern-ireland" },
	ottawa: { name: "Ottawa", pin: [480, 90], labelAt: [488, 78], anchor: "start", land: "canada" },
	washington: { name: "Washington, D.C.", pin: [470, 228], labelAt: [470, 214], anchor: "middle", land: "lower48" },
	newYork: { name: "New York", pin: [548, 178], labelAt: [548, 164], anchor: "middle", land: "lower48" },
} as const;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

function pins(ids: (keyof typeof PLACES)[]): string {
	return ids
		.map((id) => {
			const place = PLACES[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name}</text>`;
		})
		.join("");
}

export function renderBritishIsles(): string {
	return `<figure class="places-map"><svg viewBox="0 0 460 390" role="img" aria-label="Lernskizze der Britischen Inseln. Norden ist oben. Nicht maßstäblich. Ireland ist größer als Wales, dazwischen liegt die Irish Sea.">
	<rect width="460" height="390" rx="16" class="sea"/>
	<g data-map-layer="countries"><path class="land region" data-land="scotland" d="${path(SCOTLAND)} Z"/><path class="land region" data-land="england" d="${path(ENGLAND)} Z"/><path class="land region" data-land="wales" d="${path(WALES)} Z"/><path class="land region" data-land="republic" d="${path(REPUBLIC_OF_IRELAND)} Z"/><path class="land region" data-land="northern-ireland" d="${path(NORTHERN_IRELAND)} Z"/><text class="region-name" text-anchor="middle" x="300" y="128">Scotland</text><text class="region-name" text-anchor="middle" x="340" y="310">England</text><text class="region-name" text-anchor="middle" x="240" y="258">Wales</text><text class="region-name" text-anchor="middle" x="114" y="142">Northern Ireland</text><text class="region-name" text-anchor="middle" x="96" y="318">Republic of</text><text class="region-name" text-anchor="middle" x="96" y="330">Ireland</text></g>
	<g data-map-layer="waters" class="water-labels"><text x="382" y="108">North Sea</text><text x="12" y="36">Atlantic</text><text text-anchor="middle" x="192" y="188">Irish</text><text text-anchor="middle" x="192" y="200">Sea</text><text x="292" y="374">English Channel</text><text x="424" y="24">N ↑</text></g>
	<g data-map-layer="cities" class="map-cities">${pins(["edinburgh", "belfast", "dublin", "cardiff", "london"])}</g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Scotland, England und Wales liegen auf Great Britain. Northern Ireland und die Republic of Ireland teilen sich die Insel Ireland. Dazwischen liegt die Irish Sea.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["countries", "Länder"],
		["cities", "Städte"],
		["waters", "Gewässer"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

export function renderNorthAmerica(): string {
	return `<figure class="places-map"><svg viewBox="0 0 640 340" role="img" aria-label="Lernskizze von Nordamerika mit Alaska und Hawaii. Norden ist oben. Nicht maßstäblich.">
	<rect width="640" height="340" rx="16" class="sea"/>
	<g data-map-layer="countries"><path class="land" data-land="canada" d="${path(CANADA)} Z"/><path class="land" data-land="lower48" d="${path(LOWER_48)} Z"/><path class="land" data-land="alaska" d="${path(ALASKA)} Z"/><path class="land" data-land="hawaii" d="${path(HAWAII)} Z"/></g>
	<g data-map-layer="waters" class="water-labels"><text x="300" y="200">Pacific</text><text x="608" y="28">N ↑</text></g>
	<g data-map-layer="cities" class="map-cities">${pins(["ottawa", "washington", "newYork"])}<text x="340" y="70">Alaska</text><text x="348" y="220">Hawaii</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Alaska und Hawaii liegen außerhalb der Lower 48. Ottawa liegt in Kanada.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["countries", "Länder"],
		["cities", "Städte"],
		["waters", "Gewässer"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}
