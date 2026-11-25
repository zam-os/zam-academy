/** Schematic learning maps and scenes. North is up. Distances are not to scale. */
import { esc } from "./practice";

export type MapPoint = readonly [number, number];

type Place = {
	readonly name: string;
	readonly pin: MapPoint;
	readonly labelAt: MapPoint;
	readonly anchor: string;
};

export interface FocusEntry {
	key: string;
	label: string;
	note: string;
}

const path = (points: readonly MapPoint[]) =>
	`${points.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ")} Z`;

/** Buttons that switch which map items are emphasised (see bindFocusRoot). */
export function focusButtons(
	entries: FocusEntry[],
	active: string,
	label: string,
): string {
	return `<div class="map-controls" role="group" aria-label="${esc(label)}">${entries
		.map(
			(entry) =>
				`<button type="button" class="button secondary" data-focus-key="${esc(entry.key)}" data-note="${esc(entry.note)}" aria-pressed="${entry.key === active}">${esc(entry.label)}</button>`,
		)
		.join("")}</div>`;
}

/** An item belongs to one or more focus keys; the others are dimmed or hidden. */
export const focusItem = (
	keys: string | string[],
	active: string,
	mode: "hide" | "dim",
): string => {
	const list = Array.isArray(keys) ? keys : [keys];
	const on = list.includes(active);
	return `data-focus-item="${esc(list.join(" "))}"${on ? "" : mode === "hide" ? " hidden" : ' data-dim="true"'}`;
};

export function readout(text: string): string {
	return `<p class="explorer-readout" data-focus-readout lang="en" aria-live="polite">${esc(text)}</p>`;
}

function pins<T extends Record<string, Place>>(
	places: T,
	ids: (keyof T & string)[],
): string {
	return ids
		.map((id) => {
			const place = places[id];
			return `<circle data-city="${id}" cx="${place.pin[0]}" cy="${place.pin[1]}" r="4.5"/><text data-city-label="${id}" x="${place.labelAt[0]}" y="${place.labelAt[1]}" text-anchor="${place.anchor}">${esc(place.name)}</text>`;
		})
		.join("");
}

/* ---------- British Isles ---------- */

export const SCOTLAND = [
	[214, 40],
	[262, 22],
	[312, 30],
	[330, 62],
	[306, 96],
	[318, 130],
	[296, 158],
	[262, 166],
	[236, 152],
	[226, 120],
	[204, 104],
	[210, 72],
] as const satisfies readonly MapPoint[];

export const ENGLAND = [
	[262, 166],
	[296, 158],
	[318, 170],
	[336, 210],
	[352, 232],
	[392, 262],
	[402, 300],
	[380, 330],
	[330, 344],
	[276, 350],
	[232, 346],
	[248, 330],
	[282, 318],
	[290, 296],
	[276, 270],
	[282, 236],
	[270, 206],
	[256, 184],
] as const satisfies readonly MapPoint[];

export const WALES = [
	[256, 236],
	[282, 236],
	[276, 270],
	[290, 296],
	[282, 318],
	[248, 330],
	[236, 312],
	[248, 290],
	[232, 268],
	[244, 248],
] as const satisfies readonly MapPoint[];

export const NORTHERN_IRELAND = [
	[150, 150],
	[196, 140],
	[212, 168],
	[196, 196],
	[158, 198],
	[140, 176],
] as const satisfies readonly MapPoint[];

export const REPUBLIC_OF_IRELAND = [
	[150, 150],
	[140, 176],
	[158, 198],
	[196, 196],
	[204, 232],
	[192, 290],
	[150, 318],
	[100, 320],
	[76, 288],
	[82, 240],
	[98, 200],
	[112, 168],
	[128, 148],
] as const satisfies readonly MapPoint[];

export const ISLES_PLACES = {
	london: { name: "London", pin: [356, 300], labelAt: [348, 296], anchor: "end" },
	edinburgh: { name: "Edinburgh", pin: [282, 128], labelAt: [274, 124], anchor: "end" },
	cardiff: { name: "Cardiff", pin: [266, 318], labelAt: [262, 312], anchor: "end" },
	belfast: { name: "Belfast", pin: [190, 170], labelAt: [184, 166], anchor: "end" },
	dublin: { name: "Dublin", pin: [192, 244], labelAt: [184, 240], anchor: "end" },
} as const;

export const ISLES_FOCUS: FocusEntry[] = [
	{ key: "uk", label: "United Kingdom", note: "The United Kingdom: England, Scotland, Wales and Northern Ireland. Its capital is London." },
	{ key: "gb", label: "Great Britain", note: "Great Britain is the big island with England, Scotland and Wales." },
	{ key: "ireland", label: "Ireland (island)", note: "The island of Ireland: Northern Ireland (UK) and the Republic of Ireland (capital: Dublin)." },
	{ key: "capitals", label: "Capitals", note: "Capitals: London (UK and England), Edinburgh, Cardiff, Belfast and Dublin." },
	{ key: "seas", label: "Seas", note: "The Irish Sea lies between Great Britain and Ireland, the North Sea in the east, the English Channel in the south." },
];

export function renderBritishIsles(active = "uk"): string {
	const shape = (points: readonly MapPoint[], keys: string[], cls: string) =>
		`<path class="${cls}" ${focusItem(keys, active, "dim")} d="${path(points)}"/>`;
	return `<div class="isles-explorer" data-focus-root="isles" data-focus-mode="dim">${focusButtons(ISLES_FOCUS, active, "Kartenausschnitt wählen")}<figure class="places-map"><svg viewBox="0 0 460 410" role="img" aria-label="Lernskizze der Britischen Inseln. Norden ist oben, nicht maßstäblich. Auf der Insel Great Britain liegen Scotland, England und Wales; die Insel Ireland teilen sich Northern Ireland und die Republic of Ireland. Dazwischen liegt die Irish Sea.">
	<rect width="460" height="410" rx="16" class="sea"/>
	<g>
		${shape(SCOTLAND, ["uk", "gb", "capitals", "seas"], "land land-scotland")}
		${shape(ENGLAND, ["uk", "gb", "capitals", "seas"], "land land-england")}
		${shape(WALES, ["uk", "gb", "capitals", "seas"], "land land-wales")}
		${shape(NORTHERN_IRELAND, ["uk", "ireland", "capitals", "seas"], "land land-ni")}
		${shape(REPUBLIC_OF_IRELAND, ["ireland", "capitals", "seas"], "land land-roi")}
		<text class="region-name" text-anchor="middle" x="270" y="78">Scotland</text>
		<text class="region-name" text-anchor="middle" x="330" y="262">England</text>
		<text class="region-name" text-anchor="middle" x="262" y="262">Wales</text>
		<text class="region-name" text-anchor="middle" x="176" y="181">Northern</text>
		<text class="region-name" text-anchor="middle" x="176" y="191">Ireland</text>
		<text class="region-name" text-anchor="middle" x="140" y="276">Republic</text>
		<text class="region-name" text-anchor="middle" x="140" y="290">of Ireland</text>
	</g>
	<g class="map-cities" ${focusItem(["capitals", "uk"], active, "dim")}>${pins(ISLES_PLACES, ["london", "edinburgh", "cardiff", "belfast", "dublin"])}</g>
	<g class="water-labels" ${focusItem(["seas"], active, "dim")}><text x="380" y="150">North Sea</text><text x="22" y="60">Atlantic Ocean</text><text text-anchor="middle" x="226" y="214">Irish</text><text text-anchor="middle" x="226" y="228">Sea</text><text x="262" y="390">English Channel</text></g>
	<text class="compass" x="430" y="28">N ↑</text>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Great Britain ist eine Insel, das United Kingdom ein Staat.</figcaption></figure>${readout(ISLES_FOCUS.find((entry) => entry.key === active)!.note)}</div>`;
}

/* ---------- London ---------- */

/** The Thames from west (left) to east (right). */
export const THAMES = [
	[0, 150],
	[90, 170],
	[150, 200],
	[200, 215],
	[240, 190],
	[270, 150],
	[330, 130],
	[400, 140],
	[480, 160],
] as const satisfies readonly MapPoint[];

/** y of the river at x (linear between the points above). */
export function riverY(x: number): number {
	for (let index = 1; index < THAMES.length; index++) {
		const [x1, y1] = THAMES[index - 1];
		const [x2, y2] = THAMES[index];
		if (x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1);
	}
	return THAMES[THAMES.length - 1][1];
}

export const LONDON_SIGHTS = {
	buckingham: { name: "Buckingham Palace", pin: [80, 96], labelAt: [80, 84], anchor: "middle", note: "Buckingham Palace is the King's official home in London. Watch the Changing of the Guard!" },
	trafalgar: { name: "Trafalgar Square", pin: [214, 104], labelAt: [214, 92], anchor: "middle", note: "Trafalgar Square has got Nelson's Column and the National Gallery." },
	parliament: { name: "Parliament · Big Ben", pin: [200, 182], labelAt: [200, 146], anchor: "middle", note: "The Houses of Parliament are next to the river. Big Ben is the great bell in the Elizabeth Tower." },
	eye: { name: "London Eye", pin: [236, 230], labelAt: [244, 244], anchor: "start", note: "The London Eye is a big wheel on the other side of the river, opposite the Houses of Parliament." },
	tower: { name: "Tower of London", pin: [396, 112], labelAt: [396, 100], anchor: "middle", note: "The Tower of London is an old castle. You can see the Crown Jewels there." },
	towerBridge: { name: "Tower Bridge", pin: [430, 147], labelAt: [436, 178], anchor: "middle", note: "Tower Bridge has got two towers. It can open for big ships." },
} as const;

export const LONDON_NORTH: (keyof typeof LONDON_SIGHTS)[] = ["buckingham", "trafalgar", "parliament", "tower"];

export function renderLondonMap(active = "parliament"): string {
	const entries = Object.entries(LONDON_SIGHTS).map(([key, sight]) => ({
		key,
		label: sight.name,
		note: sight.note,
	}));
	const river = THAMES.map(([x, y], index) => `${index ? "L" : "M"}${x} ${y}`).join(" ");
	return `<div class="london-explorer" data-focus-root="london" data-focus-mode="dim">${focusButtons(entries, active, "Sehenswürdigkeit wählen")}<figure class="places-map"><svg viewBox="0 0 480 280" role="img" aria-label="Lernskizze von London an der Themse. Nördlich des Flusses: Buckingham Palace, Trafalgar Square, die Houses of Parliament mit Big Ben und der Tower of London. Südlich, gegenüber dem Parlament: das London Eye. Im Osten überquert die Tower Bridge den Fluss.">
	<rect width="480" height="280" rx="16" class="town-bg"/>
	<rect x="96" y="96" width="86" height="36" rx="12" class="park"/><text class="park-label" x="139" y="118" text-anchor="middle">St James's Park</text>
	<path class="thames" d="${river}"/>
	<text class="water-label" x="300" y="158">River Thames</text>
	<path class="bridge-line" d="M206 198 L226 220"/><text class="small-map-label" x="208" y="250" text-anchor="end">Westminster Bridge</text>
	${(Object.keys(LONDON_SIGHTS) as (keyof typeof LONDON_SIGHTS)[])
		.map((key) => {
			const sight = LONDON_SIGHTS[key];
			const icon =
				key === "eye"
					? `<circle class="eye-wheel" cx="${sight.pin[0]}" cy="${sight.pin[1] - 2}" r="13"/>`
					: key === "parliament"
						? `<rect class="tower-icon" x="${sight.pin[0] - 4}" y="${sight.pin[1] - 26}" width="8" height="26"/>`
						: key === "towerBridge"
							? `<path class="bridge-towers" d="M${sight.pin[0] - 8} ${sight.pin[1] - 22} v34 M${sight.pin[0] + 8} ${sight.pin[1] - 22} v34 M${sight.pin[0] - 8} ${sight.pin[1] - 14} h16"/>`
							: "";
			return `<g class="map-cities sight sight-${key}" ${focusItem(key, active, "dim")}>${icon}${pins(LONDON_SIGHTS, [key])}</g>`;
		})
		.join("")}
	<g class="tube-sign" transform="translate(166 168)"><circle r="9"/><rect x="-12" y="-3" width="24" height="6"/></g><text class="small-map-label" x="152" y="162" text-anchor="end">Westminster</text><g class="tube-sign" transform="translate(28 266)"><circle r="6"/><rect x="-8" y="-2" width="16" height="4"/></g><text class="small-map-label" x="40" y="270">= Tube station (U-Bahn)</text>
	<text class="compass" x="450" y="24">N ↑</text>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich.</figcaption></figure>${readout(LONDON_SIGHTS[active as keyof typeof LONDON_SIGHTS].note)}</div>`;
}

/* ---------- North America ---------- */

export const ALASKA = [
	[40, 50],
	[150, 40],
	[160, 120],
	[140, 140],
	[90, 150],
	[50, 130],
	[30, 90],
] as const satisfies readonly MapPoint[];

export const CANADA = [
	[150, 40],
	[560, 30],
	[600, 70],
	[580, 120],
	[520, 150],
	[470, 160],
	[420, 150],
	[330, 150],
	[200, 150],
	[160, 120],
] as const satisfies readonly MapPoint[];

export const LOWER_48 = [
	[200, 150],
	[330, 150],
	[420, 150],
	[470, 160],
	[520, 150],
	[560, 160],
	[540, 210],
	[520, 240],
	[470, 270],
	[460, 300],
	[430, 280],
	[360, 290],
	[300, 300],
	[240, 280],
	[200, 250],
	[180, 200],
] as const satisfies readonly MapPoint[];

export const MEXICO = [
	[240, 280],
	[300, 300],
	[360, 290],
	[340, 350],
	[300, 370],
	[250, 330],
] as const satisfies readonly MapPoint[];

/** A box around the islands of Hawaii, far out in the Pacific. */
export const HAWAII = [
	[140, 292],
	[204, 292],
	[204, 334],
	[140, 334],
] as const satisfies readonly MapPoint[];

export const NA_PLACES = {
	ottawa: { name: "Ottawa", pin: [490, 135], labelAt: [490, 125], anchor: "middle" },
	toronto: { name: "Toronto", pin: [455, 146], labelAt: [450, 142], anchor: "end" },
	vancouver: { name: "Vancouver", pin: [215, 140], labelAt: [222, 134], anchor: "start" },
	washington: { name: "Washington, D.C.", pin: [500, 205], labelAt: [494, 209], anchor: "end" },
	newYork: { name: "New York", pin: [532, 180], labelAt: [526, 184], anchor: "end" },
	anchorage: { name: "Anchorage", pin: [100, 110], labelAt: [100, 100], anchor: "middle" },
	honolulu: { name: "Honolulu", pin: [176, 314], labelAt: [176, 330], anchor: "middle" },
} as const;

export const NA_FOCUS: FocusEntry[] = [
	{ key: "lower48", label: "Lower 48", note: "The Lower 48 are the 48 states next to each other. The capital, Washington, D.C., and New York are in the east." },
	{ key: "alaska", label: "Alaska", note: "Alaska is a state in the far north-west, next to Canada." },
	{ key: "hawaii", label: "Hawaii", note: "Hawaii is a group of islands in the middle of the Pacific Ocean." },
	{ key: "canada", label: "Canada", note: "Canada is north of the USA. Its capital is Ottawa; people speak English and French." },
];

export function renderNorthAmerica(active = "lower48"): string {
	const islands = [
		[152, 300, 6, 4],
		[166, 306, 5, 3],
		[178, 312, 6, 4],
		[192, 320, 9, 6],
	]
		.map(([x, y, rx, ry]) => `<ellipse class="land land-usa" cx="${x}" cy="${y}" rx="${rx}" ry="${ry}"/>`)
		.join("");
	return `<div class="na-explorer" data-focus-root="na" data-focus-mode="dim">${focusButtons(NA_FOCUS, active, "Teil Nordamerikas wählen")}<figure class="places-map"><svg viewBox="0 0 640 380" role="img" aria-label="Lernskizze von Nordamerika. Norden ist oben, nicht maßstäblich. Kanada liegt im Norden, darunter die Lower 48 der USA. Alaska liegt im Nordwesten neben Kanada, Hawaii als Inselgruppe im Pazifik.">
	<rect width="640" height="380" rx="16" class="sea"/>
	<path class="land land-other" d="${path(MEXICO)}"/><text class="region-name muted-name" x="296" y="336" text-anchor="middle">Mexico</text>
	<g ${focusItem("canada", active, "dim")}><path class="land land-canada" d="${path(CANADA)}"/><text class="region-name" x="380" y="90" text-anchor="middle">CANADA</text><g class="map-cities">${pins(NA_PLACES, ["ottawa", "toronto", "vancouver"])}</g></g>
	<g ${focusItem("lower48", active, "dim")}><path class="land land-usa" d="${path(LOWER_48)}"/><text class="region-name" x="360" y="225" text-anchor="middle">USA · the Lower 48</text><g class="map-cities">${pins(NA_PLACES, ["washington", "newYork"])}</g></g>
	<g ${focusItem("alaska", active, "dim")}><path class="land land-usa" d="${path(ALASKA)}"/><text class="region-name" x="92" y="76" text-anchor="middle">Alaska (USA)</text><g class="map-cities">${pins(NA_PLACES, ["anchorage"])}</g></g>
	<g ${focusItem("hawaii", active, "dim")}>${islands}<text class="region-name" x="172" y="286" text-anchor="middle">Hawaii (USA)</text><g class="map-cities">${pins(NA_PLACES, ["honolulu"])}</g></g>
	<g class="water-labels"><text x="40" y="240">Pacific Ocean</text><text x="560" y="300">Atlantic</text><text x="560" y="314">Ocean</text></g>
	<text class="compass" x="606" y="24">N ↑</text>
	</svg><figcaption>Lernskizze · Norden oben · nicht maßstäblich. Hawaii liegt in Wirklichkeit viel weiter draußen im Pazifik.</figcaption></figure>${readout(NA_FOCUS.find((entry) => entry.key === active)!.note)}</div>`;
}

/* ---------- Washington, D.C. and New York ---------- */

export const DC_SIGHTS = {
	lincoln: { name: "Lincoln Memorial", pin: [40, 150], labelAt: [30, 176], anchor: "start" },
	monument: { name: "Washington Monument", pin: [112, 150], labelAt: [112, 110], anchor: "middle" },
	capitol: { name: "Capitol", pin: [204, 150], labelAt: [204, 192], anchor: "middle" },
	whiteHouse: { name: "White House", pin: [112, 70], labelAt: [112, 56], anchor: "middle" },
} as const;

export const MANHATTAN = [
	[340, 40],
	[372, 30],
	[392, 60],
	[380, 160],
	[352, 216],
	[334, 210],
	[332, 150],
	[336, 80],
] as const satisfies readonly MapPoint[];

export const NY_SIGHTS = {
	centralPark: { name: "Central Park", pin: [360, 96], labelAt: [398, 92], anchor: "start" },
	timesSquare: { name: "Times Square", pin: [356, 140], labelAt: [398, 140], anchor: "start" },
	empire: { name: "Empire State Building", pin: [362, 166], labelAt: [398, 168], anchor: "start" },
	liberty: { name: "Statue of Liberty", pin: [306, 240], labelAt: [306, 258], anchor: "middle" },
} as const;

export const CITY_FOCUS: FocusEntry[] = [
	{ key: "whiteHouse", label: "White House", note: "The White House: the President lives and works here." },
	{ key: "capitol", label: "Capitol", note: "The Capitol with its white dome: Congress meets here." },
	{ key: "mall", label: "National Mall", note: "The National Mall goes from the Capitol to the Lincoln Memorial. The Washington Monument stands in the middle." },
	{ key: "liberty", label: "Statue of Liberty", note: "The Statue of Liberty stands on a small island. It was a present from France." },
	{ key: "empire", label: "Empire State Building", note: "The Empire State Building is a skyscraper in Manhattan. It opened in 1931." },
	{ key: "centralPark", label: "Central Park", note: "Central Park is a big park in the middle of Manhattan." },
	{ key: "timesSquare", label: "Times Square", note: "Times Square is bright and loud, with huge screens." },
];

export function renderTwoCities(active = "whiteHouse"): string {
	return `<div class="cities-explorer" data-focus-root="cities" data-focus-mode="dim">${focusButtons(CITY_FOCUS, active, "Sehenswürdigkeit wählen")}<figure class="places-map"><svg viewBox="0 0 560 280" role="img" aria-label="Zwei Lernskizzen. Links Washington, D.C.: die National Mall vom Lincoln Memorial im Westen über das Washington Monument bis zum Capitol im Osten, das White House nördlich davon. Rechts New York: die schmale Insel Manhattan mit Central Park, Times Square und Empire State Building, die Statue of Liberty auf einer kleinen Insel im Süden.">
	<rect width="560" height="280" rx="16" class="town-bg"/>
	<text class="panel-title" x="122" y="28" text-anchor="middle">Washington, D.C.</text>
	<path class="river" d="M0 236 C22 224 18 196 4 170"/><text class="small-map-label" x="14" y="252">Potomac River</text>
	<g ${focusItem("mall", active, "dim")}><rect class="park" x="40" y="142" width="164" height="16" rx="8"/><text class="small-map-label" x="152" y="138" text-anchor="middle">National Mall</text>${pins(DC_SIGHTS, ["lincoln", "monument"])}<path class="obelisk" d="M108 150 L112 118 L116 150 Z"/></g>
	<g ${focusItem("capitol", active, "dim")}><path class="dome" d="M190 150 a14 12 0 0 1 28 0 Z"/>${pins(DC_SIGHTS, ["capitol"])}</g>
	<g ${focusItem("whiteHouse", active, "dim")}><rect class="house-icon" x="100" y="68" width="24" height="12"/>${pins(DC_SIGHTS, ["whiteHouse"])}</g>
	<line x1="250" y1="16" x2="250" y2="264" class="grid-line"/>
	<text class="panel-title" x="400" y="28" text-anchor="middle">New York City</text>
	<path class="land land-usa" d="${path(MANHATTAN)}"/><text class="small-map-label" x="306" y="64" text-anchor="end">Hudson</text><text class="small-map-label" x="306" y="76" text-anchor="end">River</text><text class="small-map-label" x="364" y="230">Manhattan</text>
	<g ${focusItem("centralPark", active, "dim")}><rect class="park" x="350" y="70" width="22" height="52" rx="3"/>${pins(NY_SIGHTS, ["centralPark"])}</g>
	<g ${focusItem("timesSquare", active, "dim")}><rect class="screen-icon" x="350" y="133" width="12" height="9"/>${pins(NY_SIGHTS, ["timesSquare"])}</g>
	<g ${focusItem("empire", active, "dim")}><path class="skyscraper" d="M359 168 v-22 h2 v-6 h2 v6 h2 v22 Z"/>${pins(NY_SIGHTS, ["empire"])}</g>
	<g ${focusItem("liberty", active, "dim")}><circle class="land land-usa" cx="306" cy="240" r="8"/>${pins(NY_SIGHTS, ["liberty"])}</g>
	<text class="compass" x="534" y="24">N ↑</text>
	</svg><figcaption>Zwei Lernskizzen · Norden oben · nicht maßstäblich.</figcaption></figure>${readout(CITY_FOCUS.find((entry) => entry.key === active)!.note)}</div>`;
}

/* ---------- City and country scene ---------- */

export const SCENE_FOCUS: FocusEntry[] = [
	{ key: "city", label: "In the city", note: "In the city there are a lot of shops, buses and a cinema, but there's a lot of traffic too." },
	{ key: "country", label: "In the country", note: "In the country there are fields, hills, a farm and sheep. It's quiet, but there aren't many buses." },
];

export function renderCityCountry(active = "city"): string {
	return `<div class="scene-explorer" data-focus-root="scene" data-focus-mode="dim">${focusButtons(SCENE_FOCUS, active, "Lebensraum wählen")}<figure class="places-map"><svg viewBox="0 0 480 220" role="img" aria-label="Zwei Hälften: links eine Stadt mit Hochhäusern, Bus, Kino und Autos, rechts das Land mit Hügeln, Bauernhof, Schafen und Fluss.">
	<rect width="480" height="220" rx="16" class="sky"/>
	<g ${focusItem("city", active, "dim")}>
		<rect class="building" x="20" y="60" width="44" height="120"/><rect class="building alt" x="70" y="30" width="40" height="150"/><rect class="building" x="116" y="80" width="50" height="100"/><rect class="building alt" x="172" y="50" width="38" height="130"/>
		<rect class="cinema-front" x="116" y="120" width="50" height="22"/><text class="sign-text" x="141" y="135" text-anchor="middle">CINEMA</text>
		<rect class="road" x="0" y="180" width="230" height="40"/>
		<rect class="bus-red" x="30" y="166" width="70" height="28" rx="5"/><rect class="car" x="120" y="182" width="34" height="14" rx="4"/><rect class="car alt" x="170" y="190" width="34" height="14" rx="4"/>
		<text class="scene-caption" x="115" y="22" text-anchor="middle">city · town</text>
	</g>
	<g ${focusItem("country", active, "dim")}>
		<path class="hill" d="M240 180 Q300 90 360 180 Z"/><path class="hill alt" d="M330 180 Q400 110 480 180 Z"/>
		<rect class="field" x="240" y="180" width="240" height="40"/>
		<path class="river-scene" d="M250 220 C300 200 350 214 400 196 S470 190 480 186"/>
		<rect class="farmhouse" x="380" y="140" width="40" height="30"/><path class="farm-roof" d="M376 140 L400 120 L424 140 Z"/>
		<ellipse class="sheep" cx="290" cy="176" rx="10" ry="6"/><ellipse class="sheep" cx="316" cy="182" rx="10" ry="6"/><ellipse class="sheep" cx="340" cy="174" rx="10" ry="6"/>
		<text class="scene-caption" x="360" y="22" text-anchor="middle">village · countryside</text>
	</g>
	</svg><figcaption>Klicke auf Stadt oder Land und vergleiche.</figcaption></figure>${readout(SCENE_FOCUS.find((entry) => entry.key === active)!.note)}</div>`;
}
