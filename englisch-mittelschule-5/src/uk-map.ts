/** A schematic map of the British Isles: nations, capitals, islands and seas. */
export type MapPoint = readonly [number, number];

export const SCOTLAND_LAND = [
	[244, 20],
	[342, 24],
	[356, 66],
	[338, 86],
	[366, 114],
	[354, 158],
	[276, 166],
	[226, 128],
	[222, 68],
] as const satisfies readonly MapPoint[];

export const ENGLAND_LAND = [
	[276, 166],
	[354, 158],
	[396, 224],
	[442, 290],
	[456, 354],
	[388, 386],
	[298, 396],
	[244, 412],
	[286, 344],
	[296, 286],
	[296, 214],
] as const satisfies readonly MapPoint[];

export const WALES_LAND = [
	[296, 214],
	[296, 286],
	[286, 344],
	[222, 334],
	[216, 250],
	[244, 214],
] as const satisfies readonly MapPoint[];

export const NORTHERN_IRELAND_LAND = [
	[134, 122],
	[210, 126],
	[212, 190],
	[134, 196],
] as const satisfies readonly MapPoint[];

export const REPUBLIC_OF_IRELAND_LAND = [
	[134, 122],
	[134, 196],
	[212, 190],
	[196, 290],
	[128, 336],
	[70, 298],
	[70, 196],
	[100, 134],
] as const satisfies readonly MapPoint[];

export const UK_CITIES = {
	london: {
		name: "London",
		country: "England",
		pin: [368, 344],
		labelAt: [377, 348],
	},
	edinburgh: {
		name: "Edinburgh",
		country: "Scotland",
		pin: [342, 134],
		labelAt: [254, 138],
	},
	cardiff: {
		name: "Cardiff",
		country: "Wales",
		pin: [272, 322],
		labelAt: [228, 308],
	},
	belfast: {
		name: "Belfast",
		country: "Northern Ireland",
		pin: [198, 172],
		labelAt: [138, 176],
	},
	dublin: {
		name: "Dublin",
		country: "Republic of Ireland",
		pin: [184, 232],
		labelAt: [128, 236],
	},
} as const satisfies Record<
	string,
	{ name: string; country: string; pin: MapPoint; labelAt: MapPoint }
>;

const polyPath = (points: readonly MapPoint[]) =>
	points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export function renderUkMap(): string {
	return `<figure class="uk-map"><svg viewBox="0 0 600 460" role="img" aria-label="Lernskizze der Britischen Inseln: Großbritannien (Scotland, England, Wales), Northern Ireland und die Republic of Ireland sowie die umliegenden Meere. Norden ist oben.">
	<rect width="600" height="460" rx="18" class="sea"/>
	<g data-map-layer="islands" class="map-islands">
		<path class="land land-uk" d="${polyPath(SCOTLAND_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(ENGLAND_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(WALES_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(NORTHERN_IRELAND_LAND)} Z"/>
		<path class="land land-ie" d="${polyPath(REPUBLIC_OF_IRELAND_LAND)} Z"/>
	</g>
	<g data-map-layer="seas" class="water-labels">
		<text x="18" y="96">Atlantic</text>
		<text x="18" y="116">Ocean</text>
		<text x="434" y="140">North Sea</text>
		<text x="218" y="204">Irish Sea</text>
		<text x="330" y="424">English Channel</text>
		<text x="520" y="40">N ↑</text>
	</g>
	<g data-map-layer="countries" class="map-cities">
		<text class="country-label" x="266" y="76">Scotland</text>
		<text class="country-label" x="332" y="256">England</text>
		<text class="country-label" x="234" y="264">Wales</text>
		<text class="country-label" x="140" y="148">N. Ireland</text>
		<text class="country-label" x="80" y="280">Republic of Ireland</text>
		${Object.entries(UK_CITIES)
			.map(
				([id, city]) =>
					`<circle data-city="${id}" cx="${city.pin[0]}" cy="${city.pin[1]}" r="5"/><text data-city-label="${id}" x="${city.labelAt[0]}" y="${city.labelAt[1]}">${city.name}</text>`,
			)
			.join("")}
	</g>
	</svg><figcaption>Lernskizze · Britische Inseln · nicht maßstäblich. England, Scotland, Wales und Northern Ireland bilden das United Kingdom (UK). Die Republic of Ireland ist ein eigener Staat.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["countries", "Länder & Hauptstädte"],
		["islands", "Inseln"],
		["seas", "Meere"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}
