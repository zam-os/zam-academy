/** Schematic learning maps (UK cities, USA 50 states & regions, Town directions). Distances are not to scale. */
export type MapPoint = readonly [number, number];

const polyPath = (points: readonly MapPoint[]) =>
	points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

/* ---------- 1. UK & Ireland: Nations and Major Cities ---------- */

export const SCOTLAND_LAND = [
	[240, 20],
	[344, 24],
	[362, 66],
	[342, 92],
	[372, 120],
	[358, 168],
	[270, 174],
	[218, 134],
	[214, 68],
] as const satisfies readonly MapPoint[];

export const ENGLAND_LAND = [
	[270, 174],
	[358, 168],
	[406, 232],
	[454, 294],
	[464, 372],
	[392, 404],
	[296, 412],
	[234, 434],
	[282, 356],
	[296, 292],
	[296, 220],
] as const satisfies readonly MapPoint[];

export const WALES_LAND = [
	[296, 220],
	[296, 292],
	[282, 356],
	[210, 346],
	[204, 256],
	[238, 220],
] as const satisfies readonly MapPoint[];

export const NORTHERN_IRELAND_LAND = [
	[128, 122],
	[210, 126],
	[212, 190],
	[128, 196],
] as const satisfies readonly MapPoint[];

export const REPUBLIC_OF_IRELAND_LAND = [
	[128, 122],
	[128, 196],
	[212, 190],
	[196, 298],
	[122, 346],
	[62, 304],
	[62, 196],
	[96, 134],
] as const satisfies readonly MapPoint[];

export const UK_MAJOR_CITIES = {
	edinburgh: {
		name: "Edinburgh",
		country: "Scotland",
		pin: [338, 146] as MapPoint,
		labelAt: [334, 131] as MapPoint,
		anchor: "middle",
		capital: true,
	},
	glasgow: {
		name: "Glasgow",
		country: "Scotland",
		pin: [266, 152] as MapPoint,
		labelAt: [256, 138] as MapPoint,
		anchor: "middle",
		capital: false,
	},
	belfast: {
		name: "Belfast",
		country: "Northern Ireland",
		pin: [192, 170] as MapPoint,
		labelAt: [164, 174] as MapPoint,
		anchor: "middle",
		capital: true,
	},
	dublin: {
		name: "Dublin",
		country: "Republic of Ireland",
		pin: [182, 240] as MapPoint,
		labelAt: [152, 244] as MapPoint,
		anchor: "middle",
		capital: true,
	},
	manchester: {
		name: "Manchester",
		country: "England",
		pin: [346, 224] as MapPoint,
		labelAt: [338, 210] as MapPoint,
		anchor: "middle",
		capital: false,
	},
	liverpool: {
		name: "Liverpool",
		country: "England",
		pin: [314, 256] as MapPoint,
		labelAt: [348, 260] as MapPoint,
		anchor: "middle",
		capital: false,
	},
	birmingham: {
		name: "Birmingham",
		country: "England",
		pin: [358, 308] as MapPoint,
		labelAt: [358, 294] as MapPoint,
		anchor: "middle",
		capital: false,
	},
	cardiff: {
		name: "Cardiff",
		country: "Wales",
		pin: [262, 326] as MapPoint,
		labelAt: [252, 312] as MapPoint,
		anchor: "middle",
		capital: true,
	},
	london: {
		name: "London",
		country: "England",
		pin: [396, 362] as MapPoint,
		labelAt: [396, 348] as MapPoint,
		anchor: "middle",
		capital: true,
	},
} as const;

export function renderUkCitiesMap(): string {
	return `<figure class="uk-map"><svg viewBox="0 0 600 470" role="img" aria-label="Lernskizze der Britischen Inseln: Großbritannien mit wichtigen Städten (London, Birmingham, Manchester, Liverpool, Edinburgh, Glasgow, Cardiff), Northern Ireland (Belfast) und Republic of Ireland (Dublin).">
	<rect width="600" height="470" rx="18" class="sea"/>
	<g data-map-layer="countries" class="map-islands">
		<path class="land land-uk" d="${polyPath(SCOTLAND_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(ENGLAND_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(WALES_LAND)} Z"/>
		<path class="land land-uk" d="${polyPath(NORTHERN_IRELAND_LAND)} Z"/>
		<path class="land land-ie" d="${polyPath(REPUBLIC_OF_IRELAND_LAND)} Z"/>
		<text class="country-label" x="286" y="76" text-anchor="middle">Scotland</text>
		<text class="country-label" x="336" y="188" text-anchor="middle">England</text>
		<text class="country-label" x="248" y="268" text-anchor="middle">Wales</text>
		<text class="country-label" x="168" y="146" text-anchor="middle">N. Ireland</text>
		<text class="country-label" x="124" y="294" text-anchor="middle">Republic of Ireland</text>
	</g>
	<g data-map-layer="seas" class="water-labels">
		<text x="18" y="88">Atlantic</text>
		<text x="18" y="108">Ocean</text>
		<text x="438" y="140">North Sea</text>
		<text x="218" y="204">Irish Sea</text>
		<text x="330" y="438">English Channel</text>
		<text x="524" y="40">N ↑</text>
	</g>
	<g data-map-layer="cities" class="map-cities">
		${Object.entries(UK_MAJOR_CITIES)
			.map(
				([id, city]) =>
					`<circle data-city="${id}" cx="${city.pin[0]}" cy="${city.pin[1]}" r="${city.capital ? 6 : 4.5}" class="${city.capital ? "city-capital" : "city-major"}"/><text data-city-label="${id}" x="${city.labelAt[0]}" y="${city.labelAt[1]}" text-anchor="${city.anchor}">${city.name}</text>`,
			)
			.join("")}
	</g>
	</svg><figcaption>Lernskizze · Großbritannien und Irland · nicht maßstäblich. Große Kreise markieren Hauptstädte (London, Edinburgh, Cardiff, Belfast, Dublin), kleinere Kreise weitere wichtige Städte (Manchester, Liverpool, Birmingham, Glasgow).</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["cities", "Städte"],
		["countries", "Länder"],
		["seas", "Meere"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

/* ---------- 2. USA: 50 States (Regions + Alaska + Hawaii) & Capital ---------- */

export const US_WEST = [
	[124, 70],
	[224, 70],
	[224, 268],
	[136, 256],
	[110, 176],
] as const satisfies readonly MapPoint[];

export const US_ROCKIES = [
	[224, 70],
	[334, 70],
	[334, 278],
	[224, 268],
] as const satisfies readonly MapPoint[];

export const US_MIDWEST = [
	[334, 70],
	[486, 70],
	[486, 192],
	[334, 192],
] as const satisfies readonly MapPoint[];

export const US_SOUTH = [
	[334, 192],
	[486, 192],
	[486, 202],
	[586, 202],
	[550, 308],
	[508, 312],
	[482, 268],
	[396, 278],
	[364, 308],
	[334, 278],
] as const satisfies readonly MapPoint[];

export const US_MID_ATLANTIC = [
	[476, 146],
	[608, 146],
	[590, 202],
	[476, 202],
] as const satisfies readonly MapPoint[];

export const US_NORTHEAST = [
	[486, 70],
	[616, 60],
	[608, 146],
	[486, 146],
] as const satisfies readonly MapPoint[];

export const US_ALASKA = [
	[24, 36],
	[124, 32],
	[128, 96],
	[28, 100],
] as const satisfies readonly MapPoint[];

export const US_HAWAII = [
	[24, 286],
	[104, 282],
	[108, 332],
	[24, 336],
] as const satisfies readonly MapPoint[];

export const US_CITIES = {
	seattle: {
		name: "Seattle",
		pin: [146, 98] as MapPoint,
		labelAt: [164, 98] as MapPoint,
		anchor: "start",
		region: "west",
		capital: false,
	},
	losAngeles: {
		name: "Los Angeles",
		pin: [142, 224] as MapPoint,
		labelAt: [162, 224] as MapPoint,
		anchor: "start",
		region: "west",
		capital: false,
	},
	denver: {
		name: "Denver",
		pin: [278, 176] as MapPoint,
		labelAt: [278, 162] as MapPoint,
		anchor: "middle",
		region: "rockies",
		capital: false,
	},
	chicago: {
		name: "Chicago",
		pin: [424, 136] as MapPoint,
		labelAt: [424, 122] as MapPoint,
		anchor: "middle",
		region: "midwest",
		capital: false,
	},
	houston: {
		name: "Houston",
		pin: [382, 260] as MapPoint,
		labelAt: [382, 246] as MapPoint,
		anchor: "middle",
		region: "south",
		capital: false,
	},
	miami: {
		name: "Miami",
		pin: [520, 282] as MapPoint,
		labelAt: [518, 268] as MapPoint,
		anchor: "middle",
		region: "south",
		capital: false,
	},
	newYork: {
		name: "New York",
		pin: [558, 118] as MapPoint,
		labelAt: [554, 102] as MapPoint,
		anchor: "middle",
		region: "northeast",
		capital: false,
	},
	washington: {
		name: "Washington, D.C.",
		pin: [542, 186] as MapPoint,
		labelAt: [542, 168] as MapPoint,
		anchor: "middle",
		region: "midAtlantic",
		capital: true,
	},
} as const;

export function renderUsaMap(): string {
	return `<figure class="uk-map usa-map"><svg viewBox="0 0 640 390" role="img" aria-label="Lernskizze der USA: 48 zusammenhängende Staaten plus Alaska (Nordwesten) und Hawaii (Pazifik), insgesamt 50 Staaten und die Hauptstadt Washington, D.C.">
	<rect width="640" height="390" rx="18" class="sea"/>
	<g data-map-layer="waters" class="water-labels">
		<text x="20" y="190">Pacific</text>
		<text x="20" y="210">Ocean</text>
		<text x="588" y="346" text-anchor="end">Atlantic Ocean</text>
		<text x="360" y="42" text-anchor="middle" class="neighbour-label">Canada (north)</text>
		<text x="320" y="346" text-anchor="middle" class="neighbour-label">Mexico (south)</text>
		<text x="596" y="36">N ↑</text>
	</g>
	<g data-map-layer="regions" class="map-islands">
		<path class="land land-uk" d="${polyPath(US_WEST)} Z"/>
		<path class="land land-uk" d="${polyPath(US_ROCKIES)} Z"/>
		<path class="land land-uk" d="${polyPath(US_MIDWEST)} Z"/>
		<path class="land land-uk" d="${polyPath(US_SOUTH)} Z"/>
		<path class="land land-uk" d="${polyPath(US_MID_ATLANTIC)} Z"/>
		<path class="land land-uk" d="${polyPath(US_NORTHEAST)} Z"/>
		<path class="land land-ie" d="${polyPath(US_ALASKA)} Z"/>
		<path class="land land-ie" d="${polyPath(US_HAWAII)} Z"/>
		<text class="country-label" x="74" y="72" text-anchor="middle">Alaska</text>
		<text class="country-label" x="64" y="314" text-anchor="middle">Hawaii</text>
		<text class="country-label" x="174" y="162" text-anchor="middle">West</text>
		<text class="country-label" x="278" y="114" text-anchor="middle">Rockies</text>
		<text class="country-label" x="400" y="96" text-anchor="middle">Midwest</text>
		<text class="country-label" x="442" y="232" text-anchor="middle">South</text>
		<text class="country-label" x="550" y="80" text-anchor="middle">Northeast</text>
	</g>
	<g data-map-layer="cities" class="map-cities">
		${Object.entries(US_CITIES)
			.map(
				([id, city]) =>
					`<circle data-city="${id}" cx="${city.pin[0]}" cy="${city.pin[1]}" r="${city.capital ? 6.5 : 4.5}" class="${city.capital ? "city-capital" : "city-major"}"/><text data-city-label="${id}" x="${city.labelAt[0]}" y="${city.labelAt[1]}" text-anchor="${city.anchor}">${city.name}</text>`,
			)
			.join("")}
	</g>
	</svg><figcaption>Lernskizze · USA (United States of America) · nicht maßstäblich. 48 zusammenhängende Staaten zwischen Kanada und Mexiko plus Alaska und Hawaii = 50 Staaten. Hauptstadt: Washington, D.C. (Federal District).</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["cities", "Städte & Hauptstadt"],
		["regions", "Regionen & Staaten"],
		["waters", "Ozeane & Nachbarn"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}

/* ---------- 3. Town Map: Directions, Services & Prepositions ---------- */

export const TOWN_PLACES = {
	station: { label: "Station", x: 36, y: 42, w: 94, h: 48, kind: "landmark" },
	newsagent: { label: "Newsagent", x: 174, y: 42, w: 102, h: 48, kind: "service" },
	souvenir: { label: "Souvenir Shop", x: 296, y: 42, w: 120, h: 48, kind: "service" },
	museum: { label: "Museum", x: 296, y: 138, w: 120, h: 48, kind: "landmark" },
	hostel: { label: "Youth Hostel", x: 174, y: 198, w: 112, h: 48, kind: "service" },
	busStop: { label: "Bus Stop", x: 174, y: 294, w: 102, h: 44, kind: "landmark" },
	park: { label: "City Park", x: 514, y: 138, w: 92, h: 96, kind: "landmark" },
	bridge: { label: "Bridge", x: 462, y: 248, w: 58, h: 34, kind: "landmark" },
} as const;

export function renderTownMap(): string {
	return `<figure class="uk-map town-map"><svg viewBox="0 0 620 370" role="img" aria-label="Stadtplan-Skizze für Wegerklärungen: Station, Newsagent, Souvenir Shop gegenüber vom Museum, Youth Hostel gegenüber vom Bus Stop sowie Brücke über den Fluss zum Park.">
	<rect width="620" height="370" rx="18" class="town-ground"/>
	<g data-map-layer="streets" class="town-streets">
		<path d="M 484 20 Q 492 140 492 220 T 502 360" class="town-river"/>
		<rect x="20" y="100" width="580" height="28" rx="4" class="town-road"/>
		<rect x="20" y="252" width="580" height="26" rx="4" class="town-road"/>
		<rect x="136" y="24" width="26" height="330" rx="4" class="town-road"/>
		<rect x="432" y="24" width="26" height="330" rx="4" class="town-road"/>
		<circle cx="445" cy="114" r="18" class="town-roundabout"/>
		<text x="236" y="119" text-anchor="middle" class="street-label">High Street</text>
		<text x="292" y="269" text-anchor="middle" class="street-label">River Street</text>
		<text x="149" y="206" text-anchor="middle" transform="rotate(-90 149 206)" class="street-label">Station Lane</text>
		<text x="445" y="200" text-anchor="middle" transform="rotate(-90 445 200)" class="street-label">Park Road</text>
	</g>
	<g data-map-layer="landmarks" class="town-places">
		${Object.entries(TOWN_PLACES)
			.filter(([, p]) => p.kind === "landmark")
			.map(
				([id, p]) =>
					`<g data-town-place="${id}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="8" class="town-building town-landmark"/><text x="${p.x + p.w / 2}" y="${p.y + p.h / 2 + 5}" text-anchor="middle">${p.label}</text></g>`,
			)
			.join("")}
	</g>
	<g data-map-layer="services" class="town-places">
		${Object.entries(TOWN_PLACES)
			.filter(([, p]) => p.kind === "service")
			.map(
				([id, p]) =>
					`<g data-town-place="${id}"><rect x="${p.x}" y="${p.y}" width="${p.w}" height="${p.h}" rx="8" class="town-building town-service"/><text x="${p.x + p.w / 2}" y="${p.y + p.h / 2 + 5}" text-anchor="middle">${p.label}</text></g>`,
			)
			.join("")}
	</g>
	</svg><figcaption>Stadtplan-Lernskizze · nicht maßstäblich. Beispiel: Der Souvenir Shop liegt opposite (gegenüber) dem Museum; das Youth Hostel liegt an der Ecke Station Lane / River Street gegenüber dem Bus Stop.</figcaption></figure>
	<div class="map-controls" aria-label="Planebenen">${[
		["services", "Jugendherberge & Läden"],
		["streets", "Straßen & Fluss"],
		["landmarks", "Bahnhof, Museum & Park"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label} hervorheben</button>`,
		)
		.join("")}</div>`;
}
