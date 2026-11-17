/** Schematic learning maps. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

/* ---------- USA Regions (Contiguous 48 + Alaska + Hawaii) ---------- */

export const US_WEST = [
	[92, 62],
	[196, 62],
	[196, 258],
	[112, 246],
	[88, 174],
] as const satisfies readonly MapPoint[];

export const US_ROCKIES = [
	[196, 62],
	[310, 62],
	[310, 268],
	[196, 258],
] as const satisfies readonly MapPoint[];

export const US_MIDWEST = [
	[310, 62],
	[462, 62],
	[462, 184],
	[310, 184],
] as const satisfies readonly MapPoint[];

export const US_SOUTH = [
	[310, 184],
	[462, 184],
	[462, 194],
	[562, 194],
	[528, 294],
	[486, 298],
	[462, 256],
	[374, 266],
	[342, 294],
	[310, 268],
] as const satisfies readonly MapPoint[];

export const US_MID_ATLANTIC = [
	[462, 138],
	[580, 138],
	[562, 194],
	[462, 194],
] as const satisfies readonly MapPoint[];

export const US_NORTHEAST = [
	[462, 62],
	[594, 52],
	[580, 138],
	[462, 138],
] as const satisfies readonly MapPoint[];

export const US_ALASKA = [
	[28, 36],
	[114, 32],
	[118, 92],
	[34, 96],
] as const satisfies readonly MapPoint[];

export const US_HAWAII = [
	[26, 264],
	[92, 260],
	[96, 304],
	[24, 308],
] as const satisfies readonly MapPoint[];

export const US_CITIES = {
	seattle: { name: "Seattle", pin: [118, 88] as MapPoint, labelAt: [128, 86] as MapPoint, anchor: "start", region: "west" },
	losAngeles: { name: "Los Angeles", pin: [118, 212] as MapPoint, labelAt: [128, 210] as MapPoint, anchor: "start", region: "west" },
	denver: { name: "Denver", pin: [252, 166] as MapPoint, labelAt: [252, 152] as MapPoint, anchor: "middle", region: "rockies" },
	chicago: { name: "Chicago", pin: [404, 128] as MapPoint, labelAt: [404, 114] as MapPoint, anchor: "middle", region: "midwest" },
	houston: { name: "Houston", pin: [358, 250] as MapPoint, labelAt: [358, 237] as MapPoint, anchor: "middle", region: "south" },
	miami: { name: "Miami", pin: [498, 270] as MapPoint, labelAt: [494, 258] as MapPoint, anchor: "middle", region: "south" },
	newYork: { name: "New York", pin: [538, 116] as MapPoint, labelAt: [534, 102] as MapPoint, anchor: "middle", region: "northeast" },
	washington: { name: "Washington, D.C.", pin: [510, 182] as MapPoint, labelAt: [508, 170] as MapPoint, anchor: "middle", region: "midAtlantic" },
} as const;

/* ---------- London Metropolis Zones ---------- */

export const LDN_NORTH = [
	[90, 40],
	[390, 40],
	[390, 124],
	[90, 124],
] as const satisfies readonly MapPoint[];

export const LDN_WEST_END = [
	[70, 124],
	[245, 124],
	[245, 206],
	[70, 206],
] as const satisfies readonly MapPoint[];

export const LDN_CITY = [
	[245, 124],
	[342, 124],
	[342, 198],
	[245, 198],
] as const satisfies readonly MapPoint[];

export const LDN_EAST = [
	[342, 108],
	[492, 108],
	[492, 204],
	[342, 204],
] as const satisfies readonly MapPoint[];

export const LDN_SOUTH = [
	[90, 208],
	[492, 208],
	[492, 282],
	[90, 282],
] as const satisfies readonly MapPoint[];

export const LDN_PLACES = {
	camden: { name: "Camden Market", pin: [204, 82] as MapPoint, labelAt: [212, 72] as MapPoint, anchor: "start", zone: "north" },
	buckingham: { name: "Buckingham Palace", pin: [122, 164] as MapPoint, labelAt: [124, 150] as MapPoint, anchor: "middle", zone: "west" },
	bigBen: { name: "Big Ben", pin: [204, 178] as MapPoint, labelAt: [204, 164] as MapPoint, anchor: "middle", zone: "west" },
	tower: { name: "Tower of London", pin: [296, 178] as MapPoint, labelAt: [296, 165] as MapPoint, anchor: "middle", zone: "city" },
	brickLane: { name: "Brick Lane", pin: [382, 150] as MapPoint, labelAt: [390, 140] as MapPoint, anchor: "start", zone: "east" },
	canaryWharf: { name: "Canary Wharf", pin: [436, 184] as MapPoint, labelAt: [432, 170] as MapPoint, anchor: "middle", zone: "east" },
	greenwich: { name: "Greenwich", pin: [426, 246] as MapPoint, labelAt: [426, 232] as MapPoint, anchor: "middle", zone: "south" },
} as const;

/* ---------- Great Britain Regions (Scotland, North, Wales, Midlands, South-West) ---------- */

export const GB_HIGHLANDS = [
	[244, 30],
	[342, 24],
	[374, 82],
	[348, 104],
	[232, 104],
] as const satisfies readonly MapPoint[];

export const GB_LOWLANDS = [
	[224, 104],
	[372, 104],
	[366, 156],
	[236, 156],
] as const satisfies readonly MapPoint[];

export const GB_NORTH_ENGLAND = [
	[256, 156],
	[368, 156],
	[382, 224],
	[266, 224],
] as const satisfies readonly MapPoint[];

export const GB_WALES = [
	[204, 224],
	[272, 224],
	[276, 294],
	[210, 294],
] as const satisfies readonly MapPoint[];

export const GB_SOUTH_ENGLAND = [
	[272, 224],
	[396, 224],
	[412, 324],
	[202, 356],
	[202, 314],
	[276, 294],
] as const satisfies readonly MapPoint[];

export const IRELAND_ISLAND = [
	[30, 168],
	[142, 156],
	[158, 250],
	[128, 336],
	[52, 344],
	[24, 246],
] as const satisfies readonly MapPoint[];

export const GB_CITIES = {
	inverness: { name: "Inverness", pin: [298, 66] as MapPoint, labelAt: [298, 54] as MapPoint, anchor: "middle", region: "highlands" },
	edinburgh: { name: "Edinburgh", pin: [334, 134] as MapPoint, labelAt: [334, 122] as MapPoint, anchor: "middle", region: "lowlands" },
	glasgow: { name: "Glasgow", pin: [256, 136] as MapPoint, labelAt: [256, 124] as MapPoint, anchor: "middle", region: "lowlands" },
	york: { name: "York", pin: [338, 196] as MapPoint, labelAt: [338, 184] as MapPoint, anchor: "middle", region: "north" },
	cardiff: { name: "Cardiff", pin: [242, 272] as MapPoint, labelAt: [242, 258] as MapPoint, anchor: "middle", region: "wales" },
	london: { name: "London", pin: [358, 292] as MapPoint, labelAt: [358, 278] as MapPoint, anchor: "middle", region: "south" },
	plymouth: { name: "Plymouth", pin: [244, 336] as MapPoint, labelAt: [248, 324] as MapPoint, anchor: "middle", region: "south" },
} as const;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

function pins<T extends Record<string, { name: string; pin: MapPoint; labelAt: MapPoint; anchor: string }>>(
	places: T,
	ids: (keyof T)[],
): string {
	return ids
		.map((id) => {
			const place = places[id];
			return `<circle data-city="${String(id)}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="5"/><text data-city-label="${String(id)}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name}</text>`;
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

export function renderUsaMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 640 330" role="img" aria-label="Lernskizze der USA mit ihren Regionen, Alaska und Hawaii. Norden ist oben. Nicht maßstäblich.">
	<rect width="640" height="330" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land region" data-region="west" d="${path(US_WEST)} Z"/>
		<path class="land region" data-region="rockies" d="${path(US_ROCKIES)} Z"/>
		<path class="land region" data-region="midwest" d="${path(US_MIDWEST)} Z"/>
		<path class="land region" data-region="south" d="${path(US_SOUTH)} Z"/>
		<path class="land region" data-region="midAtlantic" d="${path(US_MID_ATLANTIC)} Z"/>
		<path class="land region" data-region="northeast" d="${path(US_NORTHEAST)} Z"/>
		<path class="land region" data-region="alaska" d="${path(US_ALASKA)} Z"/>
		<path class="land region" data-region="hawaii" d="${path(US_HAWAII)} Z"/>
		<text class="region-name" text-anchor="middle" x="142" y="150">West</text>
		<text class="region-name" text-anchor="middle" x="252" y="114">Mountain</text>
		<text class="region-name" text-anchor="middle" x="414" y="88">Midwest</text>
		<text class="region-name" text-anchor="middle" x="412" y="216">South</text>
		<text class="region-name" text-anchor="middle" x="514" y="151">Mid-Atlantic</text>
		<text class="region-name" text-anchor="middle" x="526" y="76">Northeast</text>
		<text class="region-name" text-anchor="middle" x="72" y="68">Alaska</text>
		<text class="region-name" text-anchor="middle" x="60" y="288">Hawaii</text>
	</g>
	<g data-map-layer="waters" class="water-labels">
		<path class="river-line" d="M352 80 C358 132, 370 188, 380 262"/>
		<text x="36" y="168">Pacific</text>
		<text x="588" y="214" text-anchor="end">Atlantic</text>
		<text x="418" y="302">Gulf of Mexico</text>
		<text x="372" y="176">Mississippi</text>
		<text x="604" y="26">N ↑</text>
	</g>
	<g data-map-layer="cities" class="map-cities">${pins(US_CITIES, ["seattle", "losAngeles", "denver", "chicago", "houston", "miami", "newYork", "washington"])}</g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Die USA haben 50 Bundesstaaten: 48 zusammenhängende Staaten plus Alaska im Nordwesten und Hawaii im Pazifik. Hauptstadt ist Washington, D.C.</figcaption></figure>${controls([
		["regions", "Regionen"],
		["cities", "Städte"],
		["waters", "Gewässer"],
	])}`;
}

export function renderLondonMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 560 310" role="img" aria-label="Lernskizze von London mit Stadtteilen entlang der Themse. Norden ist oben. Nicht maßstäblich.">
	<rect width="560" height="310" rx="16" class="sea"/>
	<g data-map-layer="zones">
		<path class="land region" data-zone="north" d="${path(LDN_NORTH)} Z"/>
		<path class="land region" data-zone="west" d="${path(LDN_WEST_END)} Z"/>
		<path class="land region" data-zone="city" d="${path(LDN_CITY)} Z"/>
		<path class="land region" data-zone="east" d="${path(LDN_EAST)} Z"/>
		<path class="land region" data-zone="south" d="${path(LDN_SOUTH)} Z"/>
		<text class="region-name" text-anchor="middle" x="148" y="64">North London</text>
		<text class="region-name" text-anchor="middle" x="150" y="196">West End</text>
		<text class="region-name" text-anchor="middle" x="294" y="138">City</text>
		<text class="region-name" text-anchor="middle" x="418" y="120">East End &amp; Docklands</text>
		<text class="region-name" text-anchor="middle" x="210" y="256">South London</text>
	</g>
	<g data-map-layer="thames" class="water-labels">
		<path class="river-line" d="M56 218 C156 196, 232 214, 336 202 C408 194, 466 226, 518 214"/>
		<text x="140" y="226">River Thames</text>
		<text x="524" y="24">N ↑</text>
	</g>
	<g data-map-layer="places" class="map-cities">${pins(LDN_PLACES, ["camden", "buckingham", "bigBen", "tower", "brickLane", "canaryWharf", "greenwich"])}</g>
	</svg><figcaption>Lernskizze von London · Norden oben · nicht maßstäblich. Die Themse fließt von Westen nach Osten durch die Metropole. Vielfalt zeigt sich u. a. in Camden, Brick Lane und den Docklands.</figcaption></figure>${controls([
		["zones", "Stadtteile"],
		["places", "Orte"],
		["thames", "Themse"],
	])}`;
}

export function renderBritainRegionsMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 460 385" role="img" aria-label="Lernskizze der Regionen Großbritanniens mit Schottland, Nordengland, Wales und Südwestengland. Norden ist oben. Nicht maßstäblich.">
	<rect width="460" height="385" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land region" data-region="highlands" d="${path(GB_HIGHLANDS)} Z"/>
		<path class="land region" data-region="lowlands" d="${path(GB_LOWLANDS)} Z"/>
		<path class="land region" data-region="north" d="${path(GB_NORTH_ENGLAND)} Z"/>
		<path class="land region" data-region="wales" d="${path(GB_WALES)} Z"/>
		<path class="land region" data-region="south" d="${path(GB_SOUTH_ENGLAND)} Z"/>
		<path class="land region" data-region="ireland" d="${path(IRELAND_ISLAND)} Z"/>
		<text class="region-name" text-anchor="middle" x="298" y="92">Highlands</text>
		<text class="region-name" text-anchor="middle" x="304" y="150">Lowlands</text>
		<text class="region-name" text-anchor="middle" x="322" y="216">North England</text>
		<text class="region-name" text-anchor="middle" x="242" y="242">Wales</text>
		<text class="region-name" text-anchor="middle" x="348" y="256">South &amp; East</text>
		<text class="region-name" text-anchor="middle" x="86" y="252">Ireland</text>
	</g>
	<g data-map-layer="waters" class="water-labels">
		<text x="382" y="108">North Sea</text>
		<text x="16" y="34">Atlantic</text>
		<text text-anchor="middle" x="184" y="190">Irish Sea</text>
		<text x="292" y="370">English Channel</text>
		<text x="424" y="24">N ↑</text>
	</g>
	<g data-map-layer="cities" class="map-cities">${pins(GB_CITIES, ["inverness", "edinburgh", "glasgow", "york", "cardiff", "london", "plymouth"])}</g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Schottland gliedert sich u. a. in die dünn besiedelten Highlands im Norden und den Zentralgürtel (Lowlands) um Glasgow und Edinburgh.</figcaption></figure>${controls([
		["regions", "Regionen"],
		["cities", "Städte"],
		["waters", "Meere"],
	])}`;
}

export function renderStreetMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 520 260" role="img" aria-label="Wegeskizze durch ein Stadtviertel mit Station, Park, Brücke und Museum">
	<rect width="520" height="260" rx="16" class="sea"/>
	<rect x="44" y="34" width="140" height="62" rx="10" class="land"/>
	<text x="114" y="68" text-anchor="middle">Tube Station</text>
	<rect x="210" y="34" width="136" height="90" rx="10" class="land region"/>
	<text x="278" y="82" text-anchor="middle">Green Park</text>
	<rect x="372" y="34" width="108" height="62" rx="10" class="land"/>
	<text x="426" y="68" text-anchor="middle">Bookshop</text>
	<path class="river-line" d="M24 156 H496"/>
	<text x="80" y="176" class="region-name">River Thames</text>
	<rect x="248" y="138" width="60" height="36" rx="4" class="land"/>
	<text x="278" y="160" text-anchor="middle">Bridge</text>
	<rect x="348" y="186" width="132" height="52" rx="10" class="land"/>
	<text x="414" y="216" text-anchor="middle">Museum</text>
	<path class="route-line" d="M184 78 H210 M278 124 V138 M278 174 V212 H348" stroke-dasharray="6 4"/>
	</svg><figcaption>Orientierungsskizze: through Green Park · across the bridge · along the river · past the bookshop.</figcaption></figure>`;
}
