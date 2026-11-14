/** Schematic learning maps. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

export const GREAT_BRITAIN = [
	[150, 36],
	[190, 28],
	[220, 70],
	[210, 130],
	[230, 190],
	[205, 270],
	[160, 300],
	[125, 250],
	[115, 170],
	[125, 90],
] as const satisfies readonly MapPoint[];

export const IRELAND_ISLAND = [
	[78, 150],
	[108, 140],
	[118, 190],
	[100, 250],
	[70, 255],
	[55, 200],
	[60, 160],
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

export const PLACES = {
	london: { name: "London", pin: [190, 200], labelAt: [198, 196], land: "gb" },
	edinburgh: { name: "Edinburgh", pin: [170, 70], labelAt: [178, 66], land: "gb" },
	cardiff: { name: "Cardiff", pin: [145, 185], labelAt: [108, 178], land: "gb" },
	dublin: { name: "Dublin", pin: [82, 200], labelAt: [20, 214], land: "ireland" },
	belfast: { name: "Belfast", pin: [100, 160], labelAt: [20, 150], land: "ireland" },
	ottawa: { name: "Ottawa", pin: [480, 90], labelAt: [488, 86], land: "canada" },
	washington: { name: "Washington, D.C.", pin: [500, 190], labelAt: [508, 186], land: "lower48" },
	newYork: { name: "New York", pin: [540, 175], labelAt: [548, 170], land: "lower48" },
} as const;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

function pins(ids: (keyof typeof PLACES)[]): string {
	return ids
		.map((id) => {
			const place = PLACES[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}">${place.name}</text>`;
		})
		.join("");
}

export function renderBritishIsles(): string {
	return `<figure class="places-map"><svg viewBox="0 0 320 360" role="img" aria-label="Lernskizze der Britischen Inseln. Norden ist oben. Nicht maßstäblich.">
	<rect width="320" height="360" rx="16" class="sea"/>
	<g data-map-layer="countries"><path class="land" data-land="gb" d="${path(GREAT_BRITAIN)} Z"/><path class="land" data-land="ireland" d="${path(IRELAND_ISLAND)} Z"/></g>
	<g data-map-layer="waters" class="water-labels"><text x="236" y="48">North Sea</text><text x="16" y="300">Atlantic</text><text x="70" y="340">English Channel</text><text x="270" y="24">N ↑</text></g>
	<g data-map-layer="cities" class="map-cities">${pins(["edinburgh", "belfast", "dublin", "cardiff", "london"])}</g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. London, Edinburgh und Cardiff liegen auf Great Britain. Dublin und Belfast liegen auf der Insel Ireland.</figcaption></figure>
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
	<g data-map-layer="waters" class="water-labels"><text x="300" y="200">Pacific</text><text x="520" y="40">N ↑</text></g>
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
