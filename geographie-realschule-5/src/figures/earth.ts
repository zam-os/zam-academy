import {
	arrow,
	globe,
	group,
	house,
	label,
	lines,
	mountains,
	panel,
	tree,
} from "./draw";

export const solarSystem = (): string => {
	const planets: [string, number, number, string][] = [
		["Merkur", 105, 6, "v-stone"],
		["Venus", 160, 10, "v-sand"],
		["Erde", 220, 11, "v-water"],
		["Mars", 280, 8, "v-coral"],
		["Jupiter", 355, 27, "v-orange"],
		["Saturn", 440, 23, "v-sand"],
		["Uranus", 515, 16, "v-ice"],
		["Neptun", 560, 16, "v-blue"],
	];
	return `<rect class="v-space" width="600" height="270" rx="18"/>${group(1, `<circle class="v-sun" cx="-35" cy="120" r="98"/>${label(33, 242, "Sonne", "on-space")}`)}${planets.map(([name, x, r, c], i) => group(i < 4 ? 2 : 3, `${name === "Saturn" ? `<ellipse class="v-ring" cx="${x}" cy="120" rx="37" ry="9"/>` : ""}<circle class="${c}" cx="${x}" cy="120" r="${r}"/>${name === "Erde" ? `<circle class="v-selection" cx="${x}" cy="120" r="${r + 7}"/>` : ""}${label(x, i % 2 ? 202 : 174, name, "on-space small")}`)).join("")}`;
};
export const movements = (): string =>
	group(
		1,
		`${panel(10, 10, 275, 250)}<circle class="v-sun" cx="48" cy="110" r="25"/>${arrow(84, 110, 123, 110)}${globe(195, 110, 53)}<path class="v-night" d="M195 57A53 53 0 0 1 195 163Z"/><path class="v-coral-line" d="M180 45L210 175"/>${arrow(155, 181, 232, 181)}${label(150, 235, "Rotation · Tag und Nacht")}`,
	) +
	group(
		2,
		`${panel(305, 10, 285, 250)}<ellipse class="v-orbit" cx="450" cy="120" rx="110" ry="72"/><circle class="v-sun" cx="450" cy="120" r="25"/>${globe(355, 120, 24)}${globe(545, 120, 24)}<path class="v-coral-line" d="M342 86L368 154M532 86L558 154"/>${label(450, 235, "Umlauf + geneigte Achse")}`,
	);
export const life = (): string =>
	[
		group(
			1,
			`${panel(10, 22, 180, 225)}<path class="v-water" d="M100 62Q40 140 66 164Q100 195 134 164Q160 140 100 62Z"/>${label(100, 225, "Wasser")}`,
		),
		group(
			2,
			`${panel(210, 22, 180, 225)}<circle class="v-sun" cx="300" cy="115" r="41"/>${[
				0, 1, 2, 3, 4, 5, 6, 7,
			]
				.map((i) => {
					const a = (i * Math.PI) / 4;
					return `<path class="v-sun-ray" d="M${300 + 50 * Math.cos(a)} ${115 + 50 * Math.sin(a)}l${16 * Math.cos(a)} ${16 * Math.sin(a)}"/>`;
				})
				.join("")}${label(300, 225, "Energie")}`,
		),
		group(
			3,
			`${panel(410, 22, 180, 225)}${globe(500, 120, 48)}<circle class="v-air-ring" cx="500" cy="120" r="65"/>${label(500, 225, "Atmosphäre")}`,
		),
	].join("");
export const satellites = (): string =>
	group(
		1,
		`${globe(135, 153, 86)}<ellipse class="v-orbit" cx="135" cy="153" rx="115" ry="108"/><g transform="translate(206 68) rotate(-25)"><rect class="v-stone" x="-14" y="-15" width="28" height="30"/><path class="v-blue" d="M-54-20h32v40h-32ZM22-20h32v40h-32Z"/><path class="v-grid" d="M-38-20v40M38-20v40"/></g>${label(130, 263, "Erde beobachten")}`,
	) +
	group(
		2,
		`${panel(307, 30, 270, 100)}${lines(442, 69, "Bilder und Messdaten\n→ Fragen untersuchen")}${arrow(252, 100, 301, 80)}`,
	) +
	group(
		3,
		`${panel(307, 150, 270, 100)}<path class="v-coral" d="M337 178h13v13h-13ZM366 198h8v8h-8Z"/>${lines(467, 191, "Trümmer vermeiden\nMissionsende planen")}`,
	);
export const earthHistory = (): string =>
	group(
		1,
		`<circle class="v-coral" cx="125" cy="132" r="91"/><circle class="v-orange" cx="125" cy="132" r="80"/><circle class="v-sun" cx="125" cy="132" r="42"/><circle class="v-coral" cx="125" cy="132" r="22"/><path class="v-leaf-line" d="M38 108A91 91 0 0 1 212 108"/>${label(125, 259, "Kruste · Mantel · Kern")}`,
	) +
	group(
		2,
		`${panel(262, 25, 323, 215)}${Array.from({ length: 46 }, (_, i) => `<circle class="${i === 45 ? "v-coral" : "v-blue"}" cx="${283 + (i % 12) * 24}" cy="${55 + Math.floor(i / 12) * 35}" r="7"/>`).join("")}${lines(420, 215, "46 Punkte · 100 Millionen Jahre\n≈ 4,6 Milliarden Jahre")}`,
	) +
	group(
		3,
		`<circle class="v-selection" cx="499" cy="160" r="13"/>${arrow(533, 166, 515, 161)}`,
	);
export const plates = (): string =>
	group(
		1,
		`${panel(10, 20, 180, 225)}<path class="v-plate" d="M20 145h65v35h-65ZM115 145h65v35h-65Z"/><path class="v-lava" d="M84 180l16-70 16 70Z"/>${arrow(83, 125, 45, 125)}${arrow(117, 125, 155, 125)}${label(100, 226, "auseinander")}`,
	) +
	group(
		2,
		`${panel(210, 20, 180, 225)}<path class="v-plate" d="M220 167h42l30-50 18 30 15-52 37 72h18v25H220Z"/>${arrow(230, 95, 275, 95)}${arrow(370, 95, 330, 95)}${label(300, 226, "aufeinander zu")}`,
	) +
	group(
		3,
		`${panel(410, 20, 180, 225)}<path class="v-plate" d="M430 80h58v110h-58ZM503 80h58v110h-58Z"/>${arrow(460, 155, 460, 100)}${arrow(532, 100, 532, 155)}${label(500, 226, "aneinander vorbei")}`,
	);
export const rocks = (): string =>
	group(
		1,
		`${panel(10, 20, 180, 230)}<path class="v-lava" d="M49 75q50-35 100 0v45H49Z"/>${lines(100, 183, "Magma erstarrt\n→ Gestein")}`,
	) +
	group(
		2,
		`${panel(210, 20, 180, 230)}<path class="v-sand" d="M245 64h110v65H245Z"/><path class="v-outline" d="M245 86h110M245 108h110"/>${label(300, 166, "Verwitterung", "small")}${label(300, 187, "Transport, Ablagerung", "micro")}${label(300, 208, "Verfestigung", "small")}${label(300, 231, "→ Sedimentgestein", "small")}${arrow(183, 95, 211, 95)}`,
	) +
	group(
		3,
		`${panel(410, 20, 180, 230)}<path class="v-purple" d="M450 64h100v65H450Z"/><path class="v-snow-line" d="M450 83q25-12 50 0t50 0M450 108q25-12 50 0t50 0"/>${lines(500, 183, "Druck und Wärme\n→ Umwandlung")}${arrow(386, 95, 411, 95)}`,
	);
export const erosion = (): string =>
	group(
		1,
		`${panel(10, 25, 180, 220)}${mountains(90, 100, 0.65)}<path class="v-coral-line" d="M105 66l-10 15 9 14-10 16"/>${label(100, 225, "Verwitterung")}`,
	) +
	group(
		2,
		`${panel(210, 25, 180, 220)}<path class="v-river" d="M230 70q130-5 100 60t40 40"/><circle class="v-stone" cx="295" cy="114" r="7"/>${arrow(250, 170, 345, 170)}${label(300, 225, "Transport")}`,
	) +
	group(
		3,
		`${panel(410, 25, 180, 220)}<path class="v-water" d="M420 90q90-10 160 15v80H420Z"/>${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<circle class="v-sand" cx="${440 + i * 17}" cy="${165 - (i % 3) * 13}" r="8"/>`).join("")}${label(500, 225, "Ablagerung")}`,
	);
export const risks = (): string =>
	`<rect class="v-sky" width="600" height="270" rx="18"/>${group(1, `<path class="v-mountain" d="M10 207L153 55 286 207Z"/><path class="v-lava" d="M132 78L153 55 176 81 160 96 149 80 139 99Z"/><path class="v-smoke" d="M145 45q-34-29-3-38q28-9 34 17q38-2 12 28Z"/>${label(147, 241, "Naturprozess")}`)}${group(2, `<path class="v-meadow" d="M230 205H600V270H230Z"/>${house(335, 187, 0.7)}${tree(295, 183, 0.6)}${label(332, 241, "Nutzung")}`)}${group(3, `<path class="v-road" d="M380 210h160"/>${arrow(398, 194, 548, 194)}${label(480, 148, "Vorsorge")}${label(484, 244, "Weg + Warnung", "small")}`)}`;
