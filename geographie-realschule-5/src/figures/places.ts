import {
	arrow,
	group,
	house,
	label,
	landscape,
	lines,
	magnifier,
	mountains,
	notebook,
	number,
	panel,
	person,
	tree,
} from "./draw";

export const landUse = (): string =>
	landscape(
		group(
			1,
			`${tree(65, 150)}${tree(115, 145, 0.85)}<path class="v-field" d="M20 206L195 186 215 252H20Z"/><path class="v-field-line" d="M45 204l10 48M85 200l15 52M130 194l16 58M170 190l22 62"/>${number(68, 56, 1)}`,
		) +
			group(
				2,
				`${house(325, 156, 0.9)}<path class="v-road" d="M240 228H580"/><rect class="v-stone" x="420" y="143" width="128" height="60" rx="4"/>${label(482, 181, "Betrieb", "small")}${number(348, 55, 2)}`,
			) +
			group(
				3,
				`<path class="v-river" d="M205 150q45 55 0 120"/><path class="v-leaf-line" d="M231 161q25 50-3 96"/>${number(250, 110, 3)}`,
			),
	);

export const germany = (): string =>
	group(
		1,
		`${panel(15, 20, 570, 230, "v-water")}<rect class="v-paper" x="30" y="35" width="540" height="200" rx="15"/>${label(55, 70, "Deutschland", "", "start")}${label(55, 99, "16 Bundesländer", "small", "start")}<circle class="v-coral" cx="451" cy="63" r="6"/>${label(437, 70, "Berlin", "small", "end")}`,
	) +
	group(
		2,
		`${panel(244, 111, 310, 108, "v-meadow")}${label(267, 145, "Bayern", "", "start")}${label(267, 173, "ein Bundesland", "small", "start")}`,
	) +
	group(
		3,
		`<circle class="v-coral" cx="470" cy="190" r="7"/>${label(455, 199, "München", "small", "end")}`,
	);

export const bavaria = (): string =>
	group(
		1,
		`${panel(10, 15, 270, 235)}${label(145, 54, "Verwaltung")}${Array.from({ length: 7 }, (_, i) => `<rect class="v-purple" x="${40 + (i % 4) * 54}" y="${81 + Math.floor(i / 4) * 49}" width="40" height="33" rx="5"/>`).join("")}${lines(145, 207, "7 Regierungsbezirke\nmit Regierungssitzen")}`,
	) +
	group(
		2,
		`${panel(315, 15, 275, 235)}<path class="v-river" d="M339 172q47 19 76-7t65 6 89-4"/>${arrow(501, 179, 552, 179, "v-water-arrow")}<circle class="v-coral" cx="414" cy="164" r="6"/>${label(442, 220, "Donau · Regensburg", "small")}`,
	) +
	group(
		3,
		`<path class="v-river" d="M553 75q-50 27-93 2t-110 23"/>${arrow(382, 87, 345, 104, "v-water-arrow")}<circle class="v-coral" cx="389" cy="84" r="6"/>${label(442, 50, "Main · Würzburg", "small")}`,
	);

export const relief = (): string =>
	`<rect class="v-sky" width="600" height="270" rx="18"/>${group(1, `<path class="v-meadow" d="M8 163q50-9 113 0l29-5v55H8Z"/>${label(78, 48, "Tiefland", "small")}${label(78, 242, "Hamburg", "small")}`)}${group(2, `<path class="v-leaf-light" d="M150 158l24-30 23 17 28-46 29 47 27-17 19 31v53H150Z"/>${label(225, 73, "Mittelgebirge", "small")}${label(225, 242, "Harz", "small")}`)}${group(3, `<path class="v-sand" d="M300 160q35-30 71-13t79-6v72H300Z"/>${label(370, 48, "Alpenvorland", "small")}${label(370, 242, "München", "small")}`)}${group(4, `<path class="v-mountain" d="M450 141l26-54 28 33 32-90 55 122v61H450Z"/><path class="v-snow" d="M522 62l14-32 20 44-19-13-8 10Z"/>${label(542, 24, "Alpen", "small")}${label(535, 242, "Zugspitze", "small")}`)}<path class="v-outline" d="M8 213H592"/>${label(16, 263, "N", "small", "start")}${label(582, 263, "S", "small", "end")}`;

export const thematic = (): string =>
	group(
		1,
		`${panel(10, 15, 245, 230)}<rect class="v-meadow" x="30" y="65" width="205" height="115"/>${[65, 96, 126, 197].map((x, i) => `<circle class="v-purple" cx="${x}" cy="${i === 3 ? 149 : 105}" r="${i === 3 ? 12 : 16}"/>`).join("")}${label(132, 222, "Siedlung")}`,
	) +
	group(
		2,
		`${panel(345, 15, 245, 230)}<rect class="v-meadow" x="365" y="65" width="205" height="115"/><path class="v-field" d="M380 79h77v38h-77ZM458 138h90v30h-90Z"/>${label(467, 222, "Landwirtschaft")}`,
	) +
	group(
		3,
		`${arrow(262, 125, 337, 125)}${number(300, 182, 3)}${label(300, 40, "Gleicher Raum", "small")}`,
	);

export const protectedPlaces = (): string =>
	group(
		1,
		`${panel(10, 15, 280, 235, "v-meadow")}<path class="v-leaf-light" d="M20 150Q70 46 120 105T280 141V210H20Z"/>${tree(73, 143, 0.85)}${tree(128, 162)}${tree(223, 147, 0.8)}${label(150, 225, "Bayerischer Wald")}`,
	) +
	group(
		2,
		`${panel(310, 15, 280, 235, "v-sky")}<path class="v-sand" d="M320 148q90-23 170 3t90-5v88H320Z"/><path class="v-water" d="M320 103q60 22 120 0t140 0v42q-80 23-140 0t-120 3Z"/><path class="v-water-line" d="M344 177q20-12 42 0t42 0M481 195q20-12 42 0t42 0"/>${label(450, 225, "Wattenmeer")}`,
	) +
	group(3, `${number(300, 132, 3)}`);

export const town = (): string =>
	landscape(
		group(
			1,
			`<ellipse class="v-sand" cx="293" cy="153" rx="94" ry="72"/>${house(270, 135, 0.7)}${house(330, 162, 0.6)}${label(292, 243, "Alter Kern", "small")}`,
		) +
			group(
				2,
				`${house(474, 153, 0.8)}${house(538, 184, 0.55)}${label(490, 243, "Neue Nutzungen", "small")}`,
			) +
			group(
				3,
				`${house(66, 159, 0.65)}${tree(133, 160, 0.8)}${arrow(99, 101, 191, 101)}${arrow(191, 185, 99, 185)}${label(79, 243, "Umland", "small")}`,
			),
	);

export const excursion = (): string =>
	group(
		1,
		`${panel(10, 20, 180, 230)}<path class="v-route" d="M43 170L85 80 145 108 159 164"/>${number(43, 170, 1)}${number(85, 80, 2)}${number(145, 108, 3)}${label(100, 222, "Route planen")}`,
	) +
	group(
		2,
		`${panel(210, 20, 180, 230)}${notebook(300, 120)}${label(300, 222, "Beobachten")}${arrow(183, 130, 211, 130)}`,
	) +
	group(
		3,
		`${panel(410, 20, 180, 230)}${magnifier(479, 106)}${label(500, 222, "Auswerten")}${arrow(386, 130, 411, 130)}`,
	);

export const qualityOfLife = (): string =>
	landscape(
		group(
			1,
			`${tree(86, 108, 1.3)}<path class="v-shade" d="M86 141l107 51-131 9Z"/>${person(157, 178, "v-purple")}${label(100, 247, "Schatten", "small")}`,
		) +
			group(
				2,
				`<path class="v-wood" d="M245 145h100v15H245ZM245 115h100v13H245Z"/><path class="v-outline thick" d="M258 160v32M332 160v32"/>${label(300, 247, "Sitzplatz", "small")}`,
			) +
			group(
				3,
				`<path class="v-road" d="M380 199H580"/><path class="v-purple-line" d="M411 194l105-47h54"/><circle class="v-outline thick" cx="464" cy="140" r="21"/><circle class="v-skin" cx="471" cy="82" r="9"/><path class="v-blue-line" d="M468 99l-6 29h28l15 22h16"/>${label(492, 247, "Stufenlos?", "small")}`,
			),
	);

export const explorer = (): string =>
	landscape(
		`${mountains(452, 130, 0.95)}${tree(55, 168, 1.1)}<path class="v-river" d="M310 155q-90 43-5 115"/><path class="v-route" d="M101 236q50-85 139-40t164-35"/>${person(160, 188, "v-coral")}${notebook(380, 84)}${number(242, 196, 1)}${number(402, 163, 2)}`,
	);
