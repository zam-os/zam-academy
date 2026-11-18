/** Schematic learning maps and visual explorers. North is up. Distances are not to scale. */
export type MapPoint = readonly [number, number];

export const SCOTLAND = [
	[245, 24],
	[338, 22],
	[385, 68],
	[342, 126],
	[245, 126],
	[232, 76],
] as const satisfies readonly MapPoint[];

export const ENGLAND = [
	[244, 134],
	[344, 134],
	[396, 206],
	[386, 306],
	[260, 326],
	[198, 366],
	[150, 358],
	[164, 330],
	[224, 302],
	[254, 276],
	[252, 202],
] as const satisfies readonly MapPoint[];

export const WALES = [
	[194, 202],
	[246, 202],
	[246, 276],
	[194, 278],
	[186, 238],
] as const satisfies readonly MapPoint[];

export const CORNWALL = [
	[156, 354],
	[168, 334],
	[210, 320],
	[216, 344],
	[192, 360],
] as const satisfies readonly MapPoint[];

export const LAKE_DISTRICT = [
	[248, 166],
	[282, 166],
	[282, 196],
	[248, 196],
] as const satisfies readonly MapPoint[];

export const HADRIANS_WALL = [
	[248, 154],
	[344, 150],
] as const satisfies readonly MapPoint[];

export const WATLING_STREET = [
	[340, 288],
	[292, 248],
	[256, 214],
] as const satisfies readonly MapPoint[];

export const FOSSE_WAY = [
	[226, 316],
	[270, 294],
	[328, 214],
] as const satisfies readonly MapPoint[];

export const UK_PLACES = {
	edinburgh: {
		name: "Edinburgh",
		pin: [312, 86],
		labelAt: [312, 72],
		anchor: "middle",
		land: "scotland",
	},
	bowness: {
		name: "Bowness-on-Solway",
		pin: [250, 154],
		labelAt: [236, 156],
		anchor: "end",
		land: "england",
	},
	wallsend: {
		name: "Wallsend",
		pin: [342, 150],
		labelAt: [352, 150],
		anchor: "start",
		land: "england",
	},
	manchester: {
		name: "Manchester",
		pin: [292, 208],
		labelAt: [304, 206],
		anchor: "start",
		land: "england",
	},
	chester: {
		name: "Chester",
		pin: [258, 216],
		labelAt: [264, 228],
		anchor: "start",
		land: "england",
	},
	bath: {
		name: "Bath",
		pin: [270, 294],
		labelAt: [272, 280],
		anchor: "middle",
		land: "england",
	},
	london: {
		name: "London",
		pin: [340, 288],
		labelAt: [350, 284],
		anchor: "start",
		land: "england",
	},
	penzance: {
		name: "Cornwall",
		pin: [184, 344],
		labelAt: [184, 330],
		anchor: "middle",
		land: "cornwall",
	},
} as const;

export const WEST = [
	[46, 48],
	[252, 48],
	[252, 256],
	[62, 246],
	[46, 140],
] as const satisfies readonly MapPoint[];

export const ROCKY_MOUNTAINS = [
	[164, 58],
	[228, 58],
	[232, 226],
	[176, 226],
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

export const FLORIDA = [
	[448, 258],
	[484, 258],
	[502, 326],
	[476, 334],
	[454, 284],
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

export const US_PLACES = {
	boston: {
		name: "Boston",
		pin: [568, 94],
		labelAt: [568, 110],
		anchor: "middle",
		land: "new-england",
	},
	newYork: {
		name: "New York",
		pin: [522, 138],
		labelAt: [512, 134],
		anchor: "end",
		land: "northeast",
	},
	washington: {
		name: "Washington, D.C.",
		pin: [498, 180],
		labelAt: [488, 182],
		anchor: "end",
		land: "south",
	},
	chicago: {
		name: "Chicago",
		pin: [392, 128],
		labelAt: [382, 132],
		anchor: "end",
		land: "midwest",
	},
	denver: {
		name: "Denver",
		pin: [214, 152],
		labelAt: [224, 156],
		anchor: "start",
		land: "rockies",
	},
	miami: {
		name: "Miami",
		pin: [488, 314],
		labelAt: [478, 312],
		anchor: "end",
		land: "florida",
	},
} as const;

export const TOWN_ROUTES = {
	cinema: {
		label: "Zum Kino",
		path: "M240 245 V85 H395",
		note: "Go straight up King's Road and turn right into Park Lane. The cinema is on your left.",
	},
	pharmacy: {
		label: "Zur Apotheke",
		path: "M240 245 V165 H115",
		note: "Go straight up King's Road to the traffic lights and turn left into High Street. The pharmacy is opposite the park.",
	},
	museum: {
		label: "Zum Museum",
		path: "M240 245 V165 H390",
		note: "Go straight up King's Road and turn right into High Street. Walk past the crossroads; the museum is on your left.",
	},
} as const;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");

function ukPins(ids: (keyof typeof UK_PLACES)[]): string {
	return ids
		.map((id) => {
			const place = UK_PLACES[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="4.5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name}</text>`;
		})
		.join("");
}

function usPins(ids: (keyof typeof US_PLACES)[]): string {
	return ids
		.map((id) => {
			const place = US_PLACES[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="4.5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${place.name}</text>`;
		})
		.join("");
}

export function renderUkRegionsMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 460 400" role="img" aria-label="Lernskizze zu Regionen und Römerzeit in Großbritannien. Norden ist oben. Nicht maßstäblich. Hadrian's Wall liegt in Nordengland südlich von Schottland.">
	<rect width="460" height="400" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land region" data-land="scotland" d="${path(SCOTLAND)} Z"/>
		<path class="land region" data-land="england" d="${path(ENGLAND)} Z"/>
		<path class="land region" data-land="wales" d="${path(WALES)} Z"/>
		<path class="region-highlight" data-land="lake-district" d="${path(LAKE_DISTRICT)} Z"/>
		<path class="region-highlight" data-land="cornwall" d="${path(CORNWALL)} Z"/>
		<text class="region-name" text-anchor="middle" x="305" y="54">Scotland</text>
		<text class="region-name" text-anchor="middle" x="348" y="256">England</text>
		<text class="region-name" text-anchor="middle" x="218" y="242">Wales</text>
		<text class="region-name" text-anchor="start" x="288" y="184">Lake District</text>
	</g>
	<g data-map-layer="romans">
		<path class="roman-road" d="${path(WATLING_STREET)}"/>
		<path class="roman-road" d="${path(FOSSE_WAY)}"/>
		<path class="hadrian-wall" d="${path(HADRIANS_WALL)}"/>
		<text class="roman-label" text-anchor="middle" x="296" y="145">Hadrian's Wall</text>
		<text class="roman-label" text-anchor="start" x="308" y="242">Watling Street</text>
		<text class="roman-label" text-anchor="start" x="252" y="314">Fosse Way</text>
	</g>
	<g data-map-layer="cities" class="map-cities">${ukPins(["edinburgh", "bowness", "wallsend", "manchester", "chester", "bath", "london", "penzance"])}</g>
	<g class="water-labels"><text x="414" y="26">N ↑</text><text x="382" y="114">North Sea</text><text x="32" y="346">Atlantic</text><text x="278" y="376">English Channel</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Cornwall liegt ganz im Südwesten, der Lake District im Nordwesten Englands. Hadrian's Wall verläuft quer durch Nordengland südlich der schottischen Grenze; Bath und Orte auf -chester/-caster erinnern an die Römerzeit.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["regions", "Regionen"],
		["romans", "Römerzeit"],
		["cities", "Orte"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

export function renderUsRegionsMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 640 360" role="img" aria-label="Lernskizze zu Regionen der USA: New England im Nordosten, Midwest im Norden der Mitte, Florida im Südosten und Rocky Mountains im Westen. Nicht maßstäblich.">
	<rect width="640" height="360" rx="16" class="sea"/>
	<g data-map-layer="regions">
		<path class="land region" data-land="west" d="${path(WEST)} Z"/>
		<path class="land region" data-land="midwest" d="${path(MIDWEST)} Z"/>
		<path class="land region" data-land="south" d="${path(SOUTH)} Z"/>
		<path class="land region" data-land="northeast" d="${path(NORTHEAST)} Z"/>
		<path class="region-highlight" data-land="new-england" d="${path(NEW_ENGLAND)} Z"/>
		<path class="region-highlight" data-land="florida" d="${path(FLORIDA)} Z"/>
		<text class="region-name" text-anchor="middle" x="108" y="128">West</text>
		<text class="region-name" text-anchor="middle" x="312" y="82">Midwest</text>
		<text class="region-name" text-anchor="middle" x="358" y="218">South</text>
		<text class="region-name" text-anchor="middle" x="490" y="106">Northeast</text>
		<text class="region-name" text-anchor="middle" x="568" y="62">New England</text>
		<text class="region-name" text-anchor="end" x="440" y="294">Florida</text>
	</g>
	<g data-map-layer="landforms">
		<path class="region-highlight" data-land="rockies" d="${path(ROCKY_MOUNTAINS)} Z"/>
		<path class="mountain-peaks" d="M180 94 L194 70 L208 94 M184 134 L198 110 L212 134 M188 184 L202 160 L216 184"/>
		<text class="roman-label" text-anchor="middle" x="200" y="206"><tspan x="200">Rocky</tspan><tspan x="200" dy="13">Mountains</tspan></text>
		<ellipse cx="412" cy="88" rx="22" ry="12" class="sea"/>
		<text class="water-labels" text-anchor="middle" x="412" y="68">Great Lakes</text>
	</g>
	<g data-map-layer="cities" class="map-cities">${usPins(["boston", "newYork", "washington", "chicago", "denver", "miami"])}</g>
	<g class="water-labels"><text x="602" y="28">N ↑</text><text x="12" y="216">Pacific</text><text x="536" y="248">Atlantic</text><text x="352" y="328">Gulf of Mexico</text></g>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. New England liegt im äußersten Nordosten, der Midwest zwischen Appalachen und Rocky Mountains, und Florida bildet eine Halbinsel zwischen Atlantik und Golf von Mexiko.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["regions", "Regionen"],
		["landforms", "Landschaften"],
		["cities", "Städte"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

export function renderTownMap(): string {
	return `<figure class="places-map"><svg viewBox="0 0 480 290" role="img" aria-label="Stadtplan für Wegbeschreibungen mit Station, King's Road, Park Lane, High Street, Pharmacy, Museum, Park und Cinema.">
	<rect width="480" height="290" rx="16" class="town-bg"/>
	<g class="town-streets">
		<rect x="40" y="75" width="400" height="20" rx="4"/>
		<rect x="40" y="155" width="400" height="20" rx="4"/>
		<rect x="40" y="235" width="400" height="20" rx="4"/>
		<rect x="110" y="30" width="20" height="240" rx="4"/>
		<rect x="230" y="30" width="20" height="240" rx="4"/>
		<rect x="350" y="30" width="20" height="240" rx="4"/>
	</g>
	<g class="town-buildings">
		<rect x="140" y="30" width="80" height="40" rx="6" class="park-box"/><text x="180" y="54" text-anchor="middle">Park</text>
		<rect x="380" y="30" width="76" height="40" rx="6"/><text x="418" y="54" text-anchor="middle">Cinema</text>
		<rect x="52" y="112" width="84" height="36" rx="6"/><text x="94" y="135" text-anchor="middle">Pharmacy</text>
		<rect x="380" y="112" width="76" height="36" rx="6"/><text x="418" y="135" text-anchor="middle">Museum</text>
		<rect x="52" y="192" width="84" height="36" rx="6"/><text x="94" y="215" text-anchor="middle">Station</text>
		<circle cx="240" cy="165" r="7" class="traffic-light"/>
		<circle cx="240" cy="245" r="8" class="you-pin"/>
		<text x="260" y="250" class="you-label">You are here</text>
	</g>
	<g class="street-names">
		<text x="295" y="89" text-anchor="middle">Park Lane</text>
		<text x="175" y="169" text-anchor="middle">High Street</text>
		<text x="175" y="249" text-anchor="middle">Station Road</text>
		<text x="224" y="212" text-anchor="end">King's Road</text>
	</g>
	<path id="town-route" class="town-route" d="" hidden/>
	</svg><figcaption>Wähle ein Ziel, um den Weg auf der Karte anzuzeigen.</figcaption></figure>
	<div class="map-controls" aria-label="Wegziele">${(
		Object.entries(TOWN_ROUTES) as [keyof typeof TOWN_ROUTES, (typeof TOWN_ROUTES)[keyof typeof TOWN_ROUTES]][]
	)
		.map(
			([key, route]) =>
				`<button type="button" class="button secondary" data-route="${key}" aria-pressed="false">${route.label}</button>`,
		)
		.join("")}</div><p class="small" id="route-readout" lang="en" aria-live="polite">Wähle oben einen Ort für den englischen Weg.</p>`;
}

export function renderPictureScene(): string {
	return `<figure class="places-map"><svg viewBox="0 0 480 280" role="img" aria-label="Bildszene im Park mit Hügeln und Turm im Hintergrund, See und Brücke im Mittelgrund, Bank links, Mädchen mit Hund in der Mitte und zwei Musikern rechts im Vordergrund.">
	<rect width="480" height="280" rx="16" class="sea"/>
	<g data-scene-zone="background">
		<path class="hill" d="M0 115 Q110 60 240 105 T480 95 V140 H0 Z"/>
		<rect x="356" y="42" width="18" height="58" class="land"/>
		<polygon points="354,42 365,24 376,42" class="land"/>
		<text class="scene-tag" x="24" y="28">in the background: hills &amp; tower</text>
	</g>
	<g data-scene-zone="middle">
		<rect y="128" width="480" height="72" class="meadow"/>
		<ellipse cx="272" cy="172" rx="84" ry="18" class="sea"/>
		<path class="bridge" d="M232 162 Q272 142 312 162"/>
		<circle cx="395" cy="158" r="9" class="land"/><circle cx="418" cy="158" r="9" class="land"/><path class="roman-road" d="M395 158 L406 143 L418 158"/>
		<text class="scene-tag" x="24" y="144">in the middle: pond, bridge &amp; bike</text>
	</g>
	<g data-scene-zone="foreground">
		<rect y="198" width="480" height="82" class="foreground-strip"/>
		<rect x="44" y="218" width="74" height="16" rx="4" class="land"/><text x="81" y="252" text-anchor="middle" class="scene-label">bench (on the left)</text>
		<circle cx="235" cy="216" r="10" class="land"/><rect x="228" y="226" width="14" height="22" rx="4" class="land"/><circle cx="262" cy="240" r="7" class="land"/>
		<text x="245" y="266" text-anchor="middle" class="scene-label">girl &amp; dog (in the middle)</text>
		<circle cx="382" cy="216" r="9" class="land"/><circle cx="412" cy="216" r="9" class="land"/>
		<text x="397" y="252" text-anchor="middle" class="scene-label">musicians (on the right)</text>
	</g>
	</svg><figcaption>Klicke auf einen Bildbereich, um Vordergrund, Mittelgrund und Hintergrund hervorzuheben.</figcaption></figure>
	<div class="map-controls" aria-label="Bildbereiche">${[
		["foreground", "Vordergrund"],
		["middle", "Mittelgrund"],
		["background", "Hintergrund"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-scene-focus="${key}" aria-pressed="false">${label}</button>`,
		)
		.join("")}</div><p class="small" id="scene-readout" lang="en" aria-live="polite">In the foreground, a girl is walking her dog.</p>`;
}
