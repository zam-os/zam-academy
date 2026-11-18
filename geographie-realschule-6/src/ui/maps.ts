import { EUROPEAN_STATES } from "../data/europe";
import countries from "../data/countries.json";
import { esc } from "../workshop";

type Bounds = readonly [
	west: number,
	east: number,
	south: number,
	north: number,
];
type Coordinate = readonly [lon: number, lat: number];
type Place = readonly [name: string, lon: number, lat: number, note: string];
type Route = {
	label: string;
	points: Coordinate[];
	kind: "river" | "ridge" | "transport" | "cable";
	arrow?: boolean;
};
type MapScene = {
	title: string;
	note: string;
	places: Place[];
	routes?: Route[];
	bounds?: Bounds;
};
const EUROPE: Bounds = [-25, 69, 32, 72];
const ALPS: Bounds = [5, 18, 44, 50];
const EUROPE_WITH_ASIA: Bounds = [-25, 77, 32, 72];
const CRETE: Bounds = [23.3, 26.5, 34.85, 36];
const NORTH_SEA: Bounds = [-2, 17, 51, 62];
const REGIONAL: Bounds = [-2, 23, 42, 57];
const eastBound: Bounds = [10, 50, 33, 62];

const CITY_WEST: Place[] = [
	["Dublin", -6.3, 53.3, "Irland"],
	["London", -0.1, 51.5, "Vereinigtes Königreich"],
	["Paris", 2.35, 48.9, "Frankreich"],
	["Oslo", 10.75, 59.9, "Norwegen"],
	["Stockholm", 18.1, 59.3, "Schweden"],
	["Helsinki", 24.94, 60.2, "Finnland"],
	["Reykjavík", -21.94, 64.15, "Island"],
];
const CITY_CENTRAL: Place[] = [
	["Lissabon", -9.1, 38.7, "Portugal"],
	["Madrid", -3.7, 40.4, "Spanien"],
	["Rom", 12.5, 41.9, "Italien"],
	["Athen", 23.73, 38, "Griechenland"],
	["Wien", 16.37, 48.2, "Österreich"],
	["Berlin", 13.4, 52.5, "Deutschland"],
	["Warschau", 21, 52.2, "Polen"],
];
const lookups: Record<string, Record<string, MapScene>> = {
	europa: {
		relief: {
			title: "Europas Großlandschaften, Flüsse und Meere",
			note: "Die Donau läuft überwiegend ostwärts, der Rhein überwiegend nordwärts. Die Spanne vom Atlantik bis zum Ural hilft bei der Orientierung. Gebirgszüge und Flussläufe sind vereinfacht.",
			places: [
				["Atlantik", -17, 45, "Westlich Europas"],
				["Mittelmeer", 15, 35, "Südlich von Italien"],
				[
					"Schwarzes Meer",
					35,
					43.2,
					"Die Donau erreicht das Meer im Donaudelta an der Nordwestküste.",
				],
				[
					"Nordsee",
					2,
					56.3,
					"Der Rhein erreicht das Meer an der niederländischen Küste.",
				],
			],
			routes: [
				{
					label: "Donau",
					kind: "river",
					points: [
						[8.5, 48],
						[11.5, 48.8],
						[13.45, 48.57],
						[16.4, 48.2],
						[19, 47.5],
						[21.3, 44.8],
						[25.5, 43.7],
						[28, 44.2],
						[29.7, 45.15],
					],
				},
				{
					label: "Rhein",
					kind: "river",
					points: [
						[9.5, 46.7],
						[7.6, 47.6],
						[8.2, 49],
						[7.2, 50.4],
						[6.75, 51.3],
						[4, 52],
					],
				},
				{
					label: "Alpen",
					kind: "ridge",
					points: [
						[6, 44.6],
						[7.1, 45.9],
						[9.6, 46.6],
						[12.7, 47.2],
						[15.4, 47.5],
					],
				},
				{
					label: "Pyrenäen",
					kind: "ridge",
					points: [
						[-1.8, 43.1],
						[0.5, 42.7],
						[3, 42.5],
					],
				},
				{
					label: "Skanden",
					kind: "ridge",
					points: [
						[7.5, 61],
						[13, 65],
						[19, 68.4],
					],
				},
				{
					label: "Ural",
					kind: "ridge",
					points: [
						[57, 51.7],
						[59.3, 56.8],
						[59, 62],
						[64, 67],
					],
				},
			],
		},
		west: {
			title: "Ausgewählte Hauptstädte im Norden und Westen",
			note: "Stockholm liegt östlich von Oslo. Vergleiche die Lage der Landeshauptstädte zu Atlantik, Nordsee und Ostsee.",
			places: CITY_WEST,
		},
		central: {
			title: "Ausgewählte Hauptstädte in Mittel- und Südeuropa",
			note: "Rom liegt südlich der Alpen, Berlin und Warschau nördlich davon. Die Teilräume sind Beispiele für eine Einteilung nach Lage.",
			places: CITY_CENTRAL,
		},
		east: {
			title: "Staaten und Städte am Übergang nach Asien",
			note: "Moskau liegt im europäischen Teil Russlands. Ankara liegt in Asien. Istanbul liegt zu beiden Seiten des Bosporus.",
			bounds: eastBound,
			places: [
				["Kyjiw", 30.52, 50.45, "Ukraine"],
				["Moskau", 37.62, 55.75, "Russland"],
				["Ankara", 32.86, 39.93, "Hauptstadt der Türkei"],
				["Istanbul", 28.98, 41.01, "Stadt am Bosporus"],
			],
		},
	},
	verkehr: {
		rhine: {
			title: "Waren auf dem Rhein",
			note: "Rotterdam verbindet Seeschiffe und Binnenverkehr. Bei Basel kann Fracht etwa auf die Bahn wechseln.",
			bounds: REGIONAL,
			places: [
				["Rotterdam", 4.48, 51.92, "Seehafen und Binnenverbindungen"],
				["Basel", 7.59, 47.56, "Hafen am Oberrhein"],
			],
			routes: [
				{
					label: "Rhein",
					kind: "river",
					arrow: true,
					points: [
						[4.48, 51.92],
						[6.7, 51.4],
						[7.4, 50.35],
						[8.2, 49.8],
						[7.59, 47.56],
					],
				},
			],
		},
		freight: {
			title: "Beispiel für Alpentransit",
			note: "Rotterdam und Mailand liegen außerhalb Deutschlands. Eine Verbindung über Deutschland erzeugt dort Durchgangsverkehr.",
			bounds: REGIONAL,
			places: [
				["Rotterdam", 4.48, 51.92, "Start"],
				["München", 11.57, 48.14, "Zwischenpunkt in Deutschland"],
				["Mailand", 9.19, 45.46, "Ziel"],
			],
			routes: [
				{
					label: "Transitroute · Schema",
					kind: "transport",
					arrow: true,
					points: [
						[4.48, 51.92],
						[6.96, 50.94],
						[8.68, 50.11],
						[9.98, 49.79],
						[11.57, 48.14],
						[11.4, 47.27],
						[11.51, 46.53],
						[9.19, 45.46],
					],
				},
			],
		},
		brenner: {
			title: "Brennerpass und Brenner-Basistunnel",
			note: "Der künftige Eisenbahntunnel zwischen Innsbruck und Franzensfeste unterquert die Alpen. Die Karte verbindet Orientierungspunkte; sie zeigt weder genaue Trassen noch Höhenprofile.",
			bounds: [10.1, 12.9, 46.3, 47.9],
			places: [
				["Innsbruck", 11.39, 47.27, "Nordseite (Österreich)"],
				["Brennerpass", 11.51, 47.0, "Pass an der Staatsgrenze"],
				["Franzensfeste", 11.61, 46.79, "Südseite (Italien)"],
			],
			routes: [
				{
					label: "Tunnel (ungefähr)",
					kind: "transport",
					points: [
						[11.39, 47.27],
						[11.61, 46.79],
					],
				},
			],
		},
		air: {
			title: "Ein Flughafen als Knoten",
			note: "Vom Münchner Hauptbahnhof bringt die S-Bahn Reisende zum Flughafen. Flugverbindungen erschließen weiter entfernte Ziele, zum Beispiel Madrid.",
			bounds: [10.5, 12.7, 47.6, 49.2],
			places: [
				["Flughafen München", 11.79, 48.35, "S-Bahn, Straße und Flugverkehr"],
				["München", 11.55, 48.14, "Bahnknoten der Region"],
			],
		},
	},
	industrie: {
		cars: {
			title: "Ausgewählte Standorte der Fahrzeugindustrie",
			note: "Wolfsburg, Dingolfing und Turin liegen in verschiedenen Produktionsräumen. Die Punkte zeigen Beispiele, keine komplette Lieferkette.",
			bounds: REGIONAL,
			places: [
				["Wolfsburg", 10.79, 52.42, "Fahrzeuge"],
				["Dingolfing", 12.49, 48.63, "Fahrzeuge und Komponenten"],
				["Turin", 7.68, 45.07, "Autoindustrie"],
			],
		},
		planes: {
			title: "Ausgewählte Standorte der Luftfahrtindustrie",
			note: "Toulouse und Hamburg sind Beispiele für Standorte der Flugzeugproduktion. Häfen, Schienen und Straßen verbinden Industrieregionen.",
			bounds: [-5, 18, 41, 57],
			places: [
				["Toulouse", 1.44, 43.6, "Flugzeugproduktion"],
				["Hamburg", 9.99, 53.55, "Flugzeugproduktion"],
			],
		},
	},
	energie: {
		sources: {
			title: "Beispiele für Energiequellen",
			note: "Lagerstätten bestimmen die Lage vieler fossiler Förderorte. Wind, Sonne, Gefälle und Wasser bestimmen, welche erneuerbaren Anlagen sich anbieten.",
			places: [
				["Nordsee", 2, 57, "Erdöl, Erdgas und Windenergie"],
				["Südnorwegen", 8, 60, "Wasserkraft"],
				["Südspanien", -4, 37, "Sonnenenergie"],
			],
		},
		wind: nordLink(true),
		water: nordLink(false),
	},
	tourismus: {
		sea: {
			title: "Beispiele für Badeurlaub",
			note: "Die spanische Mittelmeerküste und Kreta ziehen Gäste im Sommer an. Viele Gäste treffen im trockenen Sommer auf einen hohen örtlichen Wasserbedarf.",
			places: [
				["Costa del Sol", -4.44, 36.7, "Badeurlaub in Südspanien"],
				["Kreta", 25.1, 35.2, "Griechische Mittelmeerinsel"],
			],
		},
		mountain: {
			title: "Urlaub in den Alpen",
			note: "Tirol bietet Wintersport und Wandergebiete. Zwischen München und Innsbruck liegen Alpenrand und Täler; die Fahrstrecke folgt dem Verkehrsweg.",
			bounds: ALPS,
			places: [
				["München", 11.57, 48.14, "Ausgangspunkt nördlich der Alpen"],
				["Innsbruck", 11.39, 47.27, "Stadt im Tiroler Inntal"],
				["Ötztal", 10.96, 47.03, "Beispiel für Sommer- und Winterangebote"],
			],
		},
		city: {
			title: "Europäischer Städtetourismus",
			note: "In Barcelona ergänzen sich Kulturangebote und die Küstenlage. In Paris stehen zum Beispiel Museen und historische Bauten im Vordergrund.",
			places: [
				["Barcelona", 2.17, 41.38, "Küste und Stadt"],
				["Paris", 2.35, 48.86, "Museen und Bauten"],
				["Wien", 16.37, 48.2, "Kultur und Stadtverkehr"],
			],
		},
	},
	kreta: {
		overview: {
			title: "Griechenland und Kreta im östlichen Mittelmeer",
			note: "Kreta liegt südlich des griechischen Festlands. Wähle die Ortskarte, um Beispiele aus den Meldungen zu verorten.",
			bounds: [16, 33, 33, 43],
			places: [
				["Athen", 23.73, 38.0, "Griechisches Festland"],
				["Kreta", 25.1, 35.25, "Insel südlich des Festlands"],
			],
		},
		event: {
			title: "Ortsbeispiele aus den Kreta-Meldungen",
			note: "Die gemeldeten Folgen betreffen einzelne Orte. Diese Orientierungskarte zeichnet keine Überflutungsflächen oder überprüften Schadensgrenzen.",
			bounds: CRETE,
			places: [
				[
					"Zoniana",
					24.83,
					35.3,
					"Gemeldete Gebäudeschäden und überflutete Straßen",
				],
				[
					"Iraklio",
					25.13,
					35.34,
					"Gemeldete Überflutungen in Teilen der Stadt",
				],
				["Palaikastro", 26.25, 35.2, "Gemeldete Überflutung eines Parkplatzes"],
			],
		},
	},
};

function nordLink(north: boolean): MapScene {
	const points: Coordinate[] = [
		[9.37, 53.92],
		[8.5, 54.15],
		[5.2, 56.5],
		[5.8, 58.3],
		[6.7, 58.7],
	];
	return {
		title: "NordLink zwischen Deutschland und Norwegen",
		note: north
			? "Beispiel: Bei viel Windangebot kann Deutschland Strom nach Norwegen liefern."
			: "Beispiel: Bei entsprechendem Angebot kann Norwegen Wasserkraftstrom nach Deutschland liefern.",
		bounds: NORTH_SEA,
		places: [
			["Wilster", 9.37, 53.92, "Landanschluss in Deutschland"],
			["Tonstad / Ertsmyra", 6.72, 58.66, "Landanschluss in Norwegen"],
		],
		routes: [
			{
				label: "NordLink · schematischer Verlauf",
				kind: "cable",
				arrow: true,
				points: north ? points : points.reverse(),
			},
		],
	};
}

const WIDTH = 700;
const HEIGHT = 350;
const PAD = 18;

export function mapPoint(
	lon: number,
	lat: number,
	bounds: Bounds,
): [number, number] {
	const [west, east, south, north] = bounds;
	const scaledWidth =
		(east - west) * Math.cos((((south + north) / 2) * Math.PI) / 180);
	const scale = Math.min(
		(WIDTH - 2 * PAD) / scaledWidth,
		(HEIGHT - 2 * PAD) / (north - south),
	);
	const span = scaledWidth * scale;
	return [
		WIDTH / 2 + ((lon - west) / (east - west) - 0.5) * span,
		HEIGHT / 2 + ((north + south) / 2 - lat) * scale,
	];
}

const outlineCache = new Map<Bounds, string>();
function outlines(bounds: Bounds): string {
	const cached = outlineCache.get(bounds);
	if (cached) return cached;
	const [west, east, south, north] = bounds;
	const landed = countries
		.map((country) => {
			const polygons = (
				country.geometry.type === "Polygon"
					? [country.geometry.coordinates]
					: country.geometry.coordinates
			) as number[][][][];
			// Keep polygons whose extent intersects the frame. Clipping also retains polygons
			// whose coast is off-screen while their interior remains visible in the frame.
			const visible = polygons.filter(
				([ring]) =>
					ring.some(([lon]) => lon >= west) &&
					ring.some(([lon]) => lon <= east) &&
					ring.some(([, lat]) => lat >= south) &&
					ring.some(([, lat]) => lat <= north),
			);
			if (!visible.length) return "";
			const d = visible
				.flatMap((polygon) =>
					polygon.map(
						(ring) =>
							ring
								.map(
									([lon, lat], i) =>
										`${i ? "L" : "M"}${mapPoint(lon, lat, bounds)
											.map((value) => value.toFixed(1))
											.join(",")}`,
								)
								.join(" ") + "Z",
					),
				)
				.join(" ");
			return `<path class="map-country" data-map-country="${country.code}" d="${d}"><title>${esc(country.name)}</title></path>`;
		})
		.join("");
	outlineCache.set(bounds, landed);
	return landed;
}
const geoline = (points: Coordinate[], bounds: Bounds): string =>
	points
		.map(([lon, lat]) =>
			mapPoint(lon, lat, bounds)
				.map((n) => n.toFixed(1))
				.join(","),
		)
		.join(" ");

function mapSvg(
	scene: MapScene,
	id: string,
	decorative = false,
	highlight?: string,
): string {
	const bounds = scene.bounds ?? EUROPE;
	const [west, east, south, north] = bounds;
	const [x, y] = mapPoint(west, north, bounds);
	const [right, bottom] = mapPoint(east, south, bounds);
	const frame = `x="${x}" y="${y}" width="${right - x}" height="${bottom - y}"`;
	const routes = (scene.routes ?? [])
		.map((route) => {
			const [lon, lat] =
				route.points[Math.floor((route.points.length - 1) / 2)];
			const [rx, ry] = mapPoint(lon, lat, bounds);
			return `<polyline class="geo-${route.kind}" points="${geoline(route.points, bounds)}" ${route.arrow ? `marker-end="url(#${id}-arrow)"` : ""}/><text class="route-label" x="${Math.min(575, rx + 7)}" y="${ry + (route.kind === "ridge" ? 17 : -7)}">${esc(route.label)}</text>`;
		})
		.join("");
	const marks = scene.places
		.map(([name, lon, lat], i) => {
			const [mx, my] = mapPoint(lon, lat, bounds);
			return `<g class="geo-pin"><circle cx="${mx}" cy="${my}" r="9"/><text x="${mx}" y="${my + 3.9}" text-anchor="middle">${i + 1}</text><title>${esc(name)}</title></g>`;
		})
		.join("");
	return `<svg class="geo-map europa-map" viewBox="0 0 ${WIDTH} ${HEIGHT}" ${decorative ? 'aria-hidden="true"' : `role="img" aria-label="${esc(scene.title)}. Die nummerierten Orte stehen unter der Karte."`}><defs><clipPath id="${id}-clip"><rect ${frame}/></clipPath><marker id="${id}-arrow" markerWidth="8" markerHeight="8" refX="12" refY="5" viewBox="0 0 12 10" orient="auto"><path d="M0 0L12 5L0 10Z" class="geo-arrow"/></marker></defs><rect ${frame} rx="2" class="map-water"/><g clip-path="url(#${id}-clip)">${highlight ? outlines(bounds).replace(`class="map-country" data-map-country="${highlight}"`, `class="map-country selected-country" data-map-country="${highlight}"`) : outlines(bounds)}${routes}${marks}</g><text x="${right - 25}" y="${y + 21}" class="map-north">N ↑</text></svg>`;
}

export function renderMap(kind: string, scenario: string): string {
	const scene = lookups[kind][scenario];
	return `<figure class="geo-figure"><figcaption>${esc(scene.title)}</figcaption><div class="diagram-scroll" tabindex="0" aria-label="Karte, bei Bedarf horizontal verschiebbar">${mapSvg(scene, "lesson-map")}</div><ol class="pin-key">${scene.places.map(([name, , , note]) => `<li><strong>${esc(name)}</strong><span>${esc(note)}</span></li>`).join("")}</ol><p class="small" role="status">${esc(scene.note)}</p><p class="small map-credit">Natural Earth · vereinfachte Übersicht · Grenzen vereinfacht · kein Streckenmaß</p></figure>`;
}

export const renderHeroMap = (): string =>
	mapSvg(
		{ title: "", note: "", places: [], bounds: [-25, 44, 32, 71] },
		"hero-map",
		true,
	);

const additionalContexts: Record<string, string> = {
	CHE: "Bern ist die Bundesstadt der Schweiz.",
	NLD: "Amsterdam ist die Hauptstadt. Regierung und Parlament sitzen in Den Haag.",
	RUS: "Russland liegt in Europa und Asien. Moskau liegt im europäischen Teil.",
	TUR: "Die Türkei liegt in Europa und Asien. Ankara liegt im asiatischen Teil.",
	KOS: "Der Staat Kosovo wird von einem Teil der anderen Staaten anerkannt.",
	CYP: "Zypern liegt im östlichen Mittelmeer und gehört zur Europäischen Union.",
	ARM: "Je nach Fragestellung werden Staaten im Kaukasusraum unterschiedlich zugeordnet.",
	AZE: "Je nach Grenzziehung wird der Kaukasusraum Europa, Asien oder beiden zugeordnet.",
	GEO: "Je nach Grenzziehung wird der Kaukasusraum Europa, Asien oder beiden zugeordnet.",
	KAZ: "Ein kleinerer Teil Kasachstans liegt westlich des Uralflusses. Astana liegt in Asien.",
};

export function renderStateFinder(selected: string): string {
	const [code, name, capital, lon, lat] =
		EUROPEAN_STATES.find(([code]) => code === selected) ?? EUROPEAN_STATES[6];
	const options = [...EUROPEAN_STATES]
		.sort((a, b) => a[1].localeCompare(b[1], "de"))
		.map(
			([value, state]) =>
				`<option value="${value}"${value === code ? " selected" : ""}>${esc(state)}</option>`,
		)
		.join("");
	const title = `${name} · ${capital}`;
	const scene = {
		bounds: EUROPE_WITH_ASIA,
		title,
		note: "",
		places: [[capital, lon, lat, ""]] as Place[],
	};
	return `<figure class="geo-figure"><figcaption>Staat und Hauptstadt verorten</figcaption>
		<label class="state-field" for="country-select">Land oder Gebiet <select id="country-select" data-model-country>${options}</select></label>
		<div class="diagram-scroll" tabindex="0" aria-label="Karte, bei Bedarf horizontal verschiebbar">${mapSvg(scene, "state-map", false, code)}</div>
		<p role="status"><strong>① ${esc(title)}.</strong> ${esc(additionalContexts[code] ?? "Suche ein Nachbarland oder Gewässer zur Orientierung.")}</p>
		<p class="small map-credit">Natural Earth · Kleinere Gebiete erkennst du am Punkt. Grenzen und Küsten sind für diese Übersicht vereinfacht.</p></figure>`;
}
