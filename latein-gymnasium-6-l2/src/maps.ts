/** Schematic learning maps for ancient Rome and Italy. */
export type MapPoint = readonly [number, number];

export const ROME_TIBER: readonly MapPoint[] = [
	[164, 24],
	[192, 92],
	[162, 168],
	[204, 224],
	[172, 304],
	[128, 376],
];

export const ROME_LANDMARKS = {
	kapitol: {
		name: "Kapitol",
		layer: "zentrum",
		pin: [256, 174] as MapPoint,
		labelAt: [214, 146] as MapPoint,
	},
	forum: {
		name: "Forum Romanum",
		layer: "zentrum",
		pin: [306, 198] as MapPoint,
		labelAt: [298, 174] as MapPoint,
	},
	palatin: {
		name: "Palatin",
		layer: "zentrum",
		pin: [296, 250] as MapPoint,
		labelAt: [232, 266] as MapPoint,
	},
	kolosseum: {
		name: "Kolosseum",
		layer: "bauten",
		pin: [414, 206] as MapPoint,
		labelAt: [428, 200] as MapPoint,
	},
	konstantinsbogen: {
		name: "Konstantinsbogen",
		layer: "bauten",
		pin: [376, 240] as MapPoint,
		labelAt: [392, 248] as MapPoint,
	},
	circus: {
		name: "Circus Maximus",
		layer: "bauten",
		pin: [284, 314] as MapPoint,
		labelAt: [298, 326] as MapPoint,
	},
	thermen: {
		name: "Thermen",
		layer: "wasser",
		pin: [426, 324] as MapPoint,
		labelAt: [440, 330] as MapPoint,
	},
} as const;

export const ROME_AQUEDUCT = {
	name: "Aquädukt",
	points: [
		[556, 108] as MapPoint,
		[492, 122] as MapPoint,
		[428, 140] as MapPoint,
	],
	labelAt: [452, 96] as MapPoint,
};

export const ITALY_LAND = [
	[94, 48],
	[176, 38],
	[244, 52],
	[276, 86],
	[310, 142],
	[374, 206],
	[446, 246],
	[462, 272],
	[424, 278],
	[406, 314],
	[376, 332],
	[362, 304],
	[338, 276],
	[292, 260],
	[232, 214],
	[172, 198],
	[142, 142],
	[104, 96],
] as const satisfies readonly MapPoint[];

export const SICILY_LAND = [
	[356, 344],
	[364, 384],
	[304, 372],
	[292, 348],
] as const satisfies readonly MapPoint[];

export const ITALY_PLACES = {
	roma: {
		name: "Rom",
		layer: "staedte",
		pin: [204, 178] as MapPoint,
		labelAt: [112, 174] as MapPoint,
	},
	ostia: {
		name: "Ostia",
		layer: "staedte",
		pin: [182, 196] as MapPoint,
		labelAt: [114, 214] as MapPoint,
	},
	neapolis: {
		name: "Neapolis",
		layer: "staedte",
		pin: [274, 232] as MapPoint,
		labelAt: [176, 238] as MapPoint,
	},
	vesuv: {
		name: "Vesuv",
		layer: "vesuv",
		pin: [306, 242] as MapPoint,
		labelAt: [324, 232] as MapPoint,
	},
	herkulaneum: {
		name: "Herkuláneum",
		layer: "vesuv",
		pin: [292, 254] as MapPoint,
		labelAt: [168, 276] as MapPoint,
	},
	pompeji: {
		name: "Pompeji",
		layer: "vesuv",
		pin: [322, 258] as MapPoint,
		labelAt: [338, 272] as MapPoint,
	},
	syrakus: {
		name: "Syrakus",
		layer: "regionen",
		pin: [352, 372] as MapPoint,
		labelAt: [370, 376] as MapPoint,
	},
} as const;

const path = (points: readonly MapPoint[]) =>
	points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");

export function renderRomeMap(): string {
	const groups = ["zentrum", "bauten", "wasser"] as const;
	const byLayer = (layer: string) =>
		Object.entries(ROME_LANDMARKS).filter(([, item]) => item.layer === layer);
	return `<figure class="latin-map"><svg viewBox="0 0 600 400" role="img" aria-label="Lernskizze der Topografie Roms: Tiber, Kapitol, Forum Romanum, Palatin, Kolosseum, Konstantinsbogen, Circus Maximus, Thermen und Aquädukt. Norden ist oben.">
	<rect width="600" height="400" rx="18" class="map-ground"/>
	<text x="536" y="34" class="map-compass">N ↑</text>
	<g data-map-layer="wasser" class="map-water">
		<path class="tiber" d="${path(ROME_TIBER)}"/>
		<text x="114" y="106" class="water-text">Tiber</text>
		<text x="36" y="352" class="route-text">↙ Ostia (Hafen)</text>
		<path class="aqueduct" d="${path(ROME_AQUEDUCT.points)}"/>
		<text x="${ROME_AQUEDUCT.labelAt[0]}" y="${ROME_AQUEDUCT.labelAt[1]}" class="water-text">${ROME_AQUEDUCT.name}</text>
		${byLayer("wasser")
			.map(
				([id, item]) =>
					`<circle data-landmark="${id}" cx="${item.pin[0]}" cy="${item.pin[1]}" r="6"/><text data-landmark-label="${id}" x="${item.labelAt[0]}" y="${item.labelAt[1]}">${item.name}</text>`,
			)
			.join("")}
	</g>
	${groups
		.filter((layer) => layer !== "wasser")
		.map(
			(layer) =>
				`<g data-map-layer="${layer}" class="map-${layer}">${byLayer(layer)
					.map(
						([id, item]) =>
							`<circle data-landmark="${id}" cx="${item.pin[0]}" cy="${item.pin[1]}" r="6"/><text data-landmark-label="${id}" x="${item.labelAt[0]}" y="${item.labelAt[1]}">${item.name}</text>`,
					)
					.join("")}</g>`,
		)
		.join("")}
	</svg><figcaption>Lernskizze des antiken Rom · nicht maßstäblich. Wähle eine Ebene, um Zentrum, Großbauten oder Wasserversorgung hervorzuheben.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["zentrum", "Hügel & Forum"],
		["bauten", "Großbauten"],
		["wasser", "Tiber, Aquädukt & Thermen"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label}</button>`,
		)
		.join("")}</div>`;
}

export function renderItalyMap(): string {
	const byLayer = (layer: string) =>
		Object.entries(ITALY_PLACES).filter(([, item]) => item.layer === layer);
	return `<figure class="latin-map"><svg viewBox="0 0 600 420" role="img" aria-label="Lernskizze des antiken Italien: Rom, Ostia, Neapolis, Vesuv, Pompeji, Herkuláneum, Syrakus und Magna Graecia. Norden ist oben.">
	<rect width="600" height="420" rx="18" class="sea"/>
	<path class="land" d="${path(ITALY_LAND)} Z"/>
	<path class="land" d="${path(SICILY_LAND)} Z"/>
	<g class="water-labels"><text x="64" y="308">Mare Tyrrhenum</text><text x="364" y="120">Mare Hadriaticum</text><text x="536" y="36">N ↑</text></g>
	<g data-map-layer="regionen" class="map-regionen">
		<text x="410" y="316" class="region-label">Magna Graecia</text>
		${byLayer("regionen")
			.map(
				([id, item]) =>
					`<circle data-place="${id}" cx="${item.pin[0]}" cy="${item.pin[1]}" r="6"/><text data-place-label="${id}" x="${item.labelAt[0]}" y="${item.labelAt[1]}">${item.name}</text>`,
			)
			.join("")}
	</g>
	<g data-map-layer="staedte" class="map-staedte">
		${byLayer("staedte")
			.map(
				([id, item]) =>
					`<circle data-place="${id}" cx="${item.pin[0]}" cy="${item.pin[1]}" r="6"/><text data-place-label="${id}" x="${item.labelAt[0]}" y="${item.labelAt[1]}">${item.name}</text>`,
			)
			.join("")}
	</g>
	<g data-map-layer="vesuv" class="map-vesuv">
		<polygon points="${ITALY_PLACES.vesuv.pin[0]},${ITALY_PLACES.vesuv.pin[1] - 10} ${ITALY_PLACES.vesuv.pin[0] - 9},${ITALY_PLACES.vesuv.pin[1] + 6} ${ITALY_PLACES.vesuv.pin[0] + 9},${ITALY_PLACES.vesuv.pin[1] + 6}" class="volcano" data-place="vesuv"/>
		<text data-place-label="vesuv" x="${ITALY_PLACES.vesuv.labelAt[0]}" y="${ITALY_PLACES.vesuv.labelAt[1]}">${ITALY_PLACES.vesuv.name}</text>
		${byLayer("vesuv")
			.filter(([id]) => id !== "vesuv")
			.map(
				([id, item]) =>
					`<circle data-place="${id}" cx="${item.pin[0]}" cy="${item.pin[1]}" r="5.5"/><text data-place-label="${id}" x="${item.labelAt[0]}" y="${item.labelAt[1]}">${item.name}</text>`,
			)
			.join("")}
	</g>
	</svg><figcaption>Lernskizze Italien und Sizilien · nicht maßstäblich. Am Golf von Neapel liegen Vesuv, Herkuláneum und Pompeji; in Unteritalien und auf Sizilien lag die Magna Graecia.</figcaption></figure>
	<div class="map-controls" aria-label="Kartenebenen">${[
		["staedte", "Rom, Ostia & Neapolis"],
		["vesuv", "Vesuv & Ausgrabungen"],
		["regionen", "Magna Graecia & Syrakus"],
	]
		.map(
			([key, label]) =>
				`<button type="button" class="button secondary" data-map-focus="${key}" aria-pressed="false">${label}</button>`,
		)
		.join("")}</div>`;
}
