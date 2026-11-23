/** Schematic learning maps and scenes. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

/* ---------- Wales (zoomed learning sketch) ---------- */

export const WALES = [
	[158, 64],
	[230, 50],
	[300, 58],
	[318, 90],
	[300, 150],
	[318, 210],
	[300, 260],
	[330, 300],
	[300, 330],
	[240, 330],
	[190, 320],
	[150, 330],
	[90, 320],
	[70, 290],
	[110, 260],
	[150, 200],
	[140, 150],
	[100, 120],
	[140, 100],
] as const satisfies readonly MapPoint[];

export const ANGLESEY = [
	[100, 30],
	[145, 22],
	[152, 48],
	[110, 54],
] as const satisfies readonly MapPoint[];

export const ERYRI = [
	[160, 72],
	[232, 66],
	[242, 140],
	[168, 150],
] as const satisfies readonly MapPoint[];

export const ENGLAND_BORDER = [
	[300, 58],
	[460, 40],
	[460, 400],
	[330, 400],
	[330, 300],
	[300, 260],
	[318, 210],
	[300, 150],
	[318, 90],
] as const satisfies readonly MapPoint[];

export const WALES_PLACES = {
	cardiff: {
		name: "Cardiff (capital)",
		pin: [292, 318],
		labelAt: [292, 302],
		anchor: "middle",
	},
	swansea: {
		name: "Swansea",
		pin: [196, 312],
		labelAt: [184, 346],
		anchor: "middle",
	},
	yrWyddfa: {
		name: "Yr Wyddfa / Snowdon",
		pin: [192, 104],
		labelAt: [200, 122],
		anchor: "start",
	},
	conwy: {
		name: "Conwy",
		pin: [230, 62],
		labelAt: [240, 76],
		anchor: "start",
	},
	caernarfon: {
		name: "Caernarfon",
		pin: [166, 80],
		labelAt: [160, 96],
		anchor: "end",
	},
	harlech: {
		name: "Harlech",
		pin: [150, 150],
		labelAt: [160, 166],
		anchor: "start",
	},
} as const;

/* ---------- USA (schematic regions) ---------- */

export const WEST = [
	[46, 48],
	[252, 48],
	[252, 256],
	[62, 246],
	[46, 140],
] as const satisfies readonly MapPoint[];

export const MIDWEST = [
	[252, 48],
	[446, 48],
	[446, 166],
	[252, 166],
] as const satisfies readonly MapPoint[];

export const SOUTH = [
	[252, 166],
	[524, 166],
	[496, 264],
	[440, 264],
	[340, 286],
	[252, 256],
] as const satisfies readonly MapPoint[];

export const NORTHEAST = [
	[446, 86],
	[536, 86],
	[536, 166],
	[446, 166],
] as const satisfies readonly MapPoint[];

export const NEW_ENGLAND = [
	[536, 42],
	[602, 42],
	[596, 118],
	[536, 118],
] as const satisfies readonly MapPoint[];

export const DESERT_SOUTHWEST = [
	[80, 160],
	[248, 160],
	[248, 252],
	[70, 246],
	[60, 200],
] as const satisfies readonly MapPoint[];

export const COLORADO_RIVER = [
	[206, 84],
	[180, 140],
	[150, 178],
	[112, 196],
	[104, 244],
] as const satisfies readonly MapPoint[];

export const US_PLACES = {
	lasVegas: {
		name: "Las Vegas",
		pin: [94, 182],
		labelAt: [88, 174],
		anchor: "end",
	},
	grandCanyon: {
		name: "Grand Canyon",
		pin: [134, 186],
		labelAt: [128, 208],
		anchor: "middle",
	},
	monumentValley: {
		name: "Monument Valley",
		pin: [178, 172],
		labelAt: [184, 168],
		anchor: "start",
	},
	phoenix: {
		name: "Phoenix",
		pin: [140, 230],
		labelAt: [150, 234],
		anchor: "start",
	},
	santaFe: {
		name: "Santa Fe",
		pin: [218, 206],
		labelAt: [218, 222],
		anchor: "middle",
	},
	boston: {
		name: "Boston",
		pin: [560, 84],
		labelAt: [556, 74],
		anchor: "end",
	},
	plymouth: {
		name: "Plymouth",
		pin: [582, 104],
		labelAt: [578, 128],
		anchor: "middle",
	},
	newYork: {
		name: "New York",
		pin: [522, 138],
		labelAt: [512, 134],
		anchor: "end",
	},
	washington: {
		name: "Washington, D.C.",
		pin: [498, 180],
		labelAt: [488, 182],
		anchor: "end",
	},
	chicago: {
		name: "Chicago",
		pin: [392, 128],
		labelAt: [382, 132],
		anchor: "end",
	},
} as const;

export const MAYFLOWER_ROUTE = "M640 66 C622 70 612 86 590 102";

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

type Place = {
	readonly name: string;
	readonly pin: MapPoint;
	readonly labelAt: MapPoint;
	readonly anchor: string;
};

function pins<T extends Record<string, Place>>(
	places: T,
	ids: (keyof T & string)[],
): string {
	return ids
		.map((id) => {
			const place = places[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="4.5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name}</text>`;
		})
		.join("");
}

function focusButtons(entries: [string, string][]): string {
	return `<div class="map-controls" aria-label="Kartenebenen">${entries
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

const castle = ([x, y]: MapPoint) =>
	`<path class="castle-icon" d="M${x - 7} ${y + 6} V${y - 4} h3 v3 h3 v-3 h2 v3 h3 v-3 h3 V${y + 6} Z"/>`;

export function renderWalesMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 460 400" role="img" aria-label="Lernskizze von Wales. Norden ist oben, nicht maßstäblich. Cardiff liegt im Süden, Eryri mit Yr Wyddfa im Nordwesten, Conwy an der Nordküste, Anglesey als Insel im Nordwesten. Östlich liegt England.">
	<rect width="460" height="400" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land england-land" d="${path(ENGLAND_BORDER)} Z"/>
		<path class="land region wales-land" d="${path(WALES)} Z"/>
		<path class="land region wales-land" d="${path(ANGLESEY)} Z"/>
		<text class="region-name big-name" text-anchor="middle" x="230" y="250">WALES · CYMRU</text>
		<text class="region-name" text-anchor="middle" x="392" y="230">England</text>
		<text class="region-name" text-anchor="middle" x="126" y="16">Anglesey</text>
	</g>
	<g data-map-layer="nature">
		<path class="region-highlight" d="${path(ERYRI)} Z"/>
		<text class="roman-label" text-anchor="start" x="180" y="142">Eryri National Park</text>
		<path class="mountain-peaks" d="M178 112 L192 90 L206 112"/>
	</g>
	<g data-map-layer="castles">${[WALES_PLACES.conwy.pin, WALES_PLACES.caernarfon.pin, WALES_PLACES.harlech.pin, [140, 40] as MapPoint]
		.map((point) => castle([point[0] + 12, point[1] - 8]))
		.join("")}<text class="roman-label" x="160" y="40">Beaumaris</text></g>
	<g data-map-layer="cities" class="map-cities">${pins(WALES_PLACES, ["cardiff", "swansea", "yrWyddfa", "conwy", "caernarfon", "harlech"])}</g>
	<g class="welsh-sign" transform="translate(346 300)">
		<rect width="104" height="58" rx="6"/>
		<text x="52" y="22" text-anchor="middle" lang="cy">Croeso i Gymru</text>
		<text x="52" y="42" text-anchor="middle" lang="en">Welcome to Wales</text>
	</g>
	<g class="uk-locator" transform="translate(352 8)" aria-hidden="true">
		<rect width="96" height="112" rx="8"/>
		<path d="M44 8 L70 8 L80 26 L66 44 L44 44 Z"/>
		<path d="M44 46 L68 46 L84 72 L80 100 L50 104 L52 70 Z"/>
		<path class="locator-wales" d="M34 70 L52 70 L50 92 L32 92 Z"/>
		<text x="48" y="64" text-anchor="middle">UK</text>
	</g>
	<g class="water-labels"><text x="20" y="390">N ↑</text><text x="30" y="210">Cardigan Bay</text><text x="40" y="80">Irish Sea</text><text x="170" y="380">Bristol Channel</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Die vier Burgen Conwy, Caernarfon, Harlech und Beaumaris liegen im Norden; die Hauptstadt Cardiff liegt an der Südküste.</figcaption></figure>
	${focusButtons([
		["nature", "Nationalpark"],
		["castles", "Burgen"],
		["cities", "Orte"],
	])}`;
}

export function renderUsMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 640 360" role="img" aria-label="Lernskizze der USA. Der Desert South-West mit Grand Canyon, Monument Valley, Las Vegas, Phoenix und Santa Fe liegt im Südwesten; New England mit Boston und Plymouth im äußersten Nordosten. Nicht maßstäblich.">
	<rect width="640" height="360" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land region" d="${path(WEST)} Z"/>
		<path class="land region" d="${path(MIDWEST)} Z"/>
		<path class="land region" d="${path(SOUTH)} Z"/>
		<path class="land region" d="${path(NORTHEAST)} Z"/>
		<path class="land region" d="${path(NEW_ENGLAND)} Z"/>
		<text class="region-name" text-anchor="middle" x="108" y="100">West</text>
		<text class="region-name" text-anchor="middle" x="330" y="82">Midwest</text>
		<text class="region-name" text-anchor="middle" x="380" y="222">South</text>
		<text class="region-name" text-anchor="middle" x="490" y="106">Northeast</text>
	</g>
	<g data-map-layer="southwest">
		<path class="region-highlight desert" d="${path(DESERT_SOUTHWEST)} Z"/>
		<path class="river" d="${path(COLORADO_RIVER)}"/>
		<text class="roman-label" text-anchor="middle" x="160" y="250">Desert South-West</text>
		<text class="roman-label" x="186" y="112">Colorado River</text>
		${pins(US_PLACES, ["lasVegas", "grandCanyon", "monumentValley", "phoenix", "santaFe"])}
	</g>
	<g data-map-layer="colonies">
		<path class="region-highlight" d="${path(NEW_ENGLAND)} Z"/>
		<text class="roman-label" text-anchor="middle" x="568" y="56">New England</text>
		<path class="mayflower-route" d="${MAYFLOWER_ROUTE}"/>
		<text class="roman-label" text-anchor="end" x="634" y="18">Mayflower, 1620</text>
		<text class="roman-label" text-anchor="end" x="634" y="32">from Plymouth, England</text>
		${pins(US_PLACES, ["boston", "plymouth"])}
	</g>
	<g data-map-layer="cities" class="map-cities">${pins(US_PLACES, ["newYork", "washington", "chicago"])}</g>
	<g class="water-labels"><text x="16" y="30">N ↑</text><text x="12" y="216">Pacific</text><text x="536" y="248">Atlantic</text><text x="352" y="328">Gulf of Mexico</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Der Desert South-West umfasst vor allem Arizona, New Mexico, Nevada, Utah und Südkalifornien; die Pilgerväter landeten 1620 in New England.</figcaption></figure>
	${focusButtons([
		["southwest", "Desert South-West"],
		["colonies", "New England"],
		["cities", "Großstädte"],
	])}`;
}

export function renderFilmScene(): string {
	return `<figure class="places-map"><svg viewBox="0 0 480 280" role="img" aria-label="Filmstandbild: Regenabend an einer Bushaltestelle. Vorne läuft ein Junge mit rotem Rucksack winkend zum Bus, in der Mitte schließt der Busfahrer die Türen, im Hintergrund leuchtet ein Kino.">
	<rect width="480" height="280" rx="16" class="night-sky"/>
	<g data-scene-zone="background">
		<rect x="300" y="40" width="150" height="90" class="cinema"/>
		<rect x="312" y="52" width="126" height="22" class="cinema-sign"/>
		<text x="375" y="68" text-anchor="middle" class="scene-sign">CINEMA</text>
		<circle cx="318" cy="90" r="5" class="lamp"/><circle cx="340" cy="90" r="5" class="lamp"/><circle cx="362" cy="90" r="5" class="lamp"/><circle cx="384" cy="90" r="5" class="lamp"/><circle cx="406" cy="90" r="5" class="lamp"/><circle cx="428" cy="90" r="5" class="lamp"/>
		<text class="scene-tag" x="300" y="30">in the background: a cinema</text>
	</g>
	<g data-scene-zone="middle">
		<rect x="40" y="110" width="250" height="90" rx="14" class="bus"/>
		<rect x="56" y="124" width="40" height="30" rx="4" class="bus-window"/><rect x="106" y="124" width="40" height="30" rx="4" class="bus-window"/><rect x="156" y="124" width="40" height="30" rx="4" class="bus-window"/>
		<rect x="214" y="124" width="22" height="68" class="bus-door"/><rect x="238" y="124" width="22" height="68" class="bus-door"/>
		<circle cx="270" cy="138" r="8" class="person"/>
		<circle cx="80" cy="206" r="12" class="wheel"/><circle cx="240" cy="206" r="12" class="wheel"/>
		<text class="scene-tag" x="40" y="100">in the middle: the driver is closing the doors</text>
	</g>
	<g data-scene-zone="foreground">
		<rect y="218" width="480" height="62" class="foreground-strip"/>
		<circle cx="380" cy="214" r="10" class="person"/>
		<rect x="372" y="224" width="16" height="26" rx="5" class="person"/>
		<rect x="388" y="226" width="14" height="18" rx="3" class="backpack"/>
		<path d="M372 230 L356 214" class="arm"/>
		<path d="M378 250 L368 270 M384 250 L396 268" class="arm"/>
		<text x="470" y="274" text-anchor="end" class="scene-label">boy with a red backpack, running and waving</text>
	</g>
	<g class="rain" aria-hidden="true"><path d="M20 20 l-6 14 M70 40 l-6 14 M120 18 l-6 14 M170 50 l-6 14 M220 24 l-6 14 M270 60 l-6 14 M460 150 l-6 14 M420 170 l-6 14 M300 160 l-6 14 M340 190 l-6 14"/></g>
	</svg><figcaption>Klicke auf einen Bildbereich, um Vordergrund, Mitte und Hintergrund hervorzuheben.</figcaption></figure>
	<div class="map-controls" aria-label="Bildbereiche">${[
		["foreground", "Vordergrund"],
		["middle", "Mitte"],
		["background", "Hintergrund"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-scene-focus="${key}" aria-pressed="false">${label}</button>`,
		)
		.join("")}</div><p class="small" id="scene-readout" lang="en" aria-live="polite">The picture shows a rainy evening at a bus stop.</p>`;
}

export const SCENE_NOTES: Record<string, string> = {
	foreground:
		"In the foreground a boy with a red backpack is running towards the bus and waving.",
	middle: "In the middle the bus driver is closing the doors.",
	background: "In the background you can see a cinema with bright lights.",
};
