import {
	arrow,
	compass,
	globe,
	group,
	house,
	label,
	landscape,
	lines,
	magnifier,
	notebook,
	number,
	panel,
	person,
	tree,
} from "./draw";

export const humanNature = (): string =>
	landscape(
		group(
			1,
			`${tree(80, 145, 1.2)}<path class="v-river" d="M170 160q-50 40 20 110"/>${number(50, 55, 1)}`,
		) +
			group(
				2,
				`${house(340, 157, 1.05)}<path class="v-road" d="M280 226H580"/>${number(350, 63, 2)}`,
			) +
			group(
				3,
				`${arrow(85, 97, 294, 160)}<path class="v-shade" d="M85 170L250 210 80 218Z"/>${person(215, 185)}${number(210, 112, 3)}`,
			),
	);
export const media = (): string =>
	group(
		1,
		`${panel(10, 15, 180, 230)}${globe(100, 108, 60)}${label(100, 225, "Globus")}`,
	) +
	group(
		2,
		`${panel(210, 15, 180, 230)}<path class="v-grass" d="M225 55H375V172H225Z"/><path class="v-road" d="M225 135h150"/><rect class="v-roof" x="258" y="85" width="35" height="28" rx="3"/><path class="v-outline" d="M258 99h35"/><circle class="v-leaf" cx="343" cy="91" r="18"/>${label(300, 225, "Luftbild · Schema")}`,
	) +
	group(
		3,
		`${panel(410, 15, 180, 230)}<rect class="v-paper" x="427" y="52" width="145" height="120" rx="5"/><path class="v-outline thick" d="M430 135h140"/><rect class="v-blue" x="458" y="92" width="32" height="27"/><circle class="v-leaf" cx="544" cy="88" r="17"/>${label(500, 225, "Karte")}`,
	);
export const mapMaking = (): string =>
	group(
		1,
		`${panel(10, 15, 180, 230)}<rect class="v-grass" x="25" y="50" width="150" height="125"/><rect class="v-roof" x="55" y="99" width="52" height="38" rx="3"/><path class="v-outline" d="M55 118h52"/><circle class="v-leaf" cx="148" cy="78" r="15"/><circle class="v-stone" cx="143" cy="160" r="5"/><path class="v-road" d="M25 150H175"/>${label(100, 222, "Details sehen")}`,
	) +
	group(
		2,
		`${panel(210, 15, 180, 230)}<path class="v-outline" d="M230 50H370V175H230Z"/><rect class="v-blue" x="250" y="96" width="50" height="45"/><circle class="v-leaf" cx="345" cy="75" r="14"/><path class="v-road" d="M232 150H368"/>${label(300, 222, "Auswählen")}${arrow(177, 121, 220, 121)}`,
	) +
	group(
		3,
		`${panel(410, 15, 180, 230)}<rect class="v-blue" x="435" y="66" width="24" height="24"/>${label(473, 85, "Schule", "small", "start")}<circle class="v-leaf" cx="447" cy="121" r="13"/>${label(473, 128, "Bäume", "small", "start")}<path class="v-road" d="M435 163h25"/>${label(473, 171, "Weg", "small", "start")}${label(500, 222, "Legende")}${arrow(377, 121, 420, 121)}`,
	);
export const atlas = (): string =>
	group(
		1,
		`${panel(10, 20, 175, 225)}${label(97, 58, "Register")}${label(97, 110, "Bergstadt", "small")}${label(97, 145, "24 · C3")}${label(97, 220, "1 · Nachschlagen")}`,
	) +
	group(
		2,
		`${panel(210, 20, 175, 225)}${notebook(296, 126)}${label(296, 123, "24")}${label(296, 220, "2 · Seite öffnen")}${arrow(185, 130, 211, 130)}`,
	) +
	group(
		3,
		`${panel(410, 20, 180, 225)}<rect class="v-paper" x="428" y="65" width="144" height="120"/>${[1, 2, 3].map((i) => `<path class="v-grid" d="M${428 + i * 36} 65v120M428 ${65 + i * 30}h144"/>`).join("")}<rect class="v-focus" x="500" y="125" width="36" height="30"/>${["A", "B", "C", "D"].map((t, i) => label(446 + i * 36, 57, t, "micro")).join("")}${[1, 2, 3, 4].map((t, i) => label(419, 86 + i * 30, String(t), "micro")).join("")}${label(518, 147, "C3", "small")}${label(500, 220, "3 · Feld finden")}${arrow(386, 130, 411, 130)}`,
	);
export const worldViews = (): string =>
	group(
		1,
		`${panel(10, 15, 230, 235)}${globe(126, 117, 72)}${label(126, 226, "Kugel")}`,
	) +
	group(
		2,
		`${panel(285, 15, 300, 235)}<rect class="v-water" x="305" y="67" width="260" height="105" rx="3"/>${[1, 2, 3, 4, 5].map((i) => `<path class="v-grid" d="M${305 + i * 43} 67v105"/>`).join("")}<path class="v-grid" d="M305 102h260M305 137h260"/><path class="v-continent" d="M329 84l48-5 10 34-35 15ZM435 92l44-14 60 20-18 20-36-7-11 42-24-17Z"/>${label(435, 226, "Ebene Karte")}${arrow(231, 120, 294, 120)}`,
	) +
	group(
		3,
		`<path class="v-coral-line" d="M313 58h244M313 181h244"/>${number(556, 181, 3)}`,
	);
export const grid = (): string =>
	group(
		1,
		`${globe(175, 135, 95)}<path class="v-coral-line" d="M80 135h190"/>${label(175, 258, "0° · Äquator")}`,
	) +
	group(
		2,
		`<ellipse class="v-purple-line" cx="175" cy="135" rx="38" ry="95"/><path class="v-outline" d="M285 43H578V225H285Z"/>${lines(431, 83, "Breite: Nord / Süd\nLänge: Ost / West")}${arrow(270, 135, 312, 135)}`,
	) +
	group(
		3,
		`${panel(323, 140, 225, 65, "v-water")}<circle class="v-coral" cx="343" cy="174" r="6"/>${label(436, 181, "48° N · 11,5° O")}${label(434, 246, "München · gerundet", "small")}`,
	);
export const scale = (): string =>
	group(
		1,
		`${panel(10, 30, 260, 210)}<path class="v-outline thick" d="M45 100h190"/><path class="v-outline" d="M45 88v24M235 88v24"/>${label(140, 75, "Kartenstrecke")}${label(140, 149, "1 cm")}${label(140, 210, "1 : 50 000")}`,
	) +
	group(
		2,
		`${arrow(277, 125, 321, 125)}${panel(330, 30, 260, 210)}<path class="v-road" d="M353 111h213"/>${house(361, 102, 0.4)}${house(558, 102, 0.4)}${label(460, 149, "500 m")}${label(460, 210, "Wirklichkeit")}`,
	) +
	group(
		3,
		`${label(300, 263, "Gleiche Strecke · andere Darstellung", "small")}`,
	);
export const orientation = (): string =>
	group(
		1,
		`${panel(10, 15, 350, 240)}<path class="v-road" d="M125 65v140h160"/>${house(125, 72, 0.45)}${house(125, 198, 0.65)}${label(125, 42, "Bahnhof", "small")}${label(120, 244, "Schule", "small")}`,
	) +
	group(
		2,
		`${tree(290, 192, 0.8)}${label(290, 244, "Park", "small")}${arrow(177, 195, 245, 195)}${arrow(125, 160, 125, 112)}`,
	) +
	group(3, `${compass(478, 132)}`);
export const journeys = (): string =>
	group(
		1,
		`${panel(10, 25, 270, 220)}<path class="v-water" d="M20 155h250v75H20Z"/><path class="v-wood" d="M65 142h145l-18 27H90Z"/><path class="v-outline" d="M132 140V62"/><path class="v-snow" d="M137 67l58 65h-58Z"/>${label(145, 220, "Historische Reise")}`,
	) +
	group(
		2,
		`${panel(320, 25, 270, 220)}<path class="v-ice" d="M330 155l60-12 70 15 60-8 60 10v70H330Z"/><path class="v-coral" d="M412 154l30-55 30 55Z"/>${person(500, 147)}${label(455, 220, "Heutige Forschung")}`,
	) +
	group(3, `${arrow(281, 110, 319, 110)}${number(300, 170, 3)}`);
export const environments = (): string =>
	group(
		1,
		`${panel(10, 15, 280, 230, "v-sky")}<path class="v-ice" d="M20 147l80-43 60 35 70-46 50 54v90H20Z"/>${house(83, 168, 0.55)}${person(219, 161, "v-purple")}${label(150, 225, "Polarer Lebensraum")}`,
	) +
	group(
		2,
		`${panel(310, 15, 280, 230, "v-sand")}<circle class="v-sun" cx="552" cy="62" r="23"/><path class="v-dune" d="M320 177q90-90 170-20t90 0v80H320Z"/>${house(396, 157, 0.6)}<path class="v-shade" d="M461 130h85l-10 8h-65Z"/>${person(503, 171, "v-coral")}${label(450, 225, "Heißer Wüstenraum")}`,
	) +
	group(3, `${number(300, 128, 3)}`);
export const inquiry = (): string =>
	group(
		1,
		`${panel(10, 25, 175, 220)}${globe(95, 115, 52)}${label(95, 219, "Wo? Wann?")}`,
	) +
	group(
		2,
		`${panel(212, 25, 175, 220)}${notebook(300, 118)}${label(300, 219, "Was ändert sich?")}${arrow(184, 130, 211, 130)}`,
	) +
	group(
		3,
		`${panel(415, 25, 175, 220)}${person(470, 130, "v-purple")}${person(537, 130, "v-coral")}${label(500, 219, "Wen betrifft es?")}${arrow(386, 130, 414, 130)}`,
	);
export const sources = (): string =>
	group(
		1,
		`${panel(10, 25, 175, 220)}${notebook(98, 125)}${label(98, 219, "Fachquelle")}`,
	) +
	group(
		2,
		`${panel(212, 25, 175, 220)}<rect class="v-paper" x="237" y="65" width="125" height="115" rx="6"/>${label(300, 97, "Nachricht", "small")}<path class="v-grid" d="M250 115h98M250 135h98M250 155h75"/>${label(300, 219, "Medienbericht")}`,
	) +
	group(
		3,
		`${panel(415, 25, 175, 220)}${magnifier(487, 108)}${label(500, 219, "Vergleichen")}${arrow(180, 130, 210, 130)}${arrow(387, 130, 414, 130)}`,
	);
export const judgement = (): string =>
	group(
		1,
		`${panel(10, 25, 175, 220)}${notebook(98, 125)}${label(98, 219, "Beleg")}`,
	) +
	group(
		2,
		`${panel(212, 25, 175, 220)}<path class="v-outline thick" d="M300 74v105M245 95h110M270 180h60"/><path class="v-sun" d="M237 132h37l-18 20ZM326 132h37l-18 20Z"/><path class="v-outline" d="M255 95v37M345 95v37"/>${label(300, 219, "Abwägen")}`,
	) +
	group(
		3,
		`${panel(415, 25, 175, 220)}<path class="v-purple" d="M448 72h105v82H448Z"/><path class="v-paper" d="M463 91h65v8h-65ZM463 112h44v8h-44Z"/><path class="v-outline" d="M500 154v28M485 182h30"/>${label(500, 219, "Urteil erklären")}`,
	);
