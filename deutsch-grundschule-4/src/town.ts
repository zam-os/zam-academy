// The Wörterstadt as an illustrated map: seven places on one road, lanterns
// along it and Tinto's harbour. The town changes with the child's work:
// every sticker lights a lantern, a place with a sticker gets lit windows,
// a finished place hoists a flag, and the first finished place starts the
// fountain. All of it is drawn from the stored progress; nothing new is saved.
import { esc } from "./format";
import type { Stage } from "./types";

type StageId = Stage["id"];

export const VIEW = { width: 1000, height: 620 } as const;

/** The foot of each building, in map units. */
export const PLACES: Record<StageId, { x: number; y: number }> = {
	werkstatt: { x: 160, y: 205 },
	bahnhof: { x: 420, y: 160 },
	detektiv: { x: 690, y: 200 },
	woerterschatz: { x: 880, y: 330 },
	lesewerkstatt: { x: 640, y: 420 },
	schreibwerkstatt: { x: 380, y: 440 },
	sprachlabor: { x: 130, y: 470 },
};

/** The road through all places in the order of the lessons. */
export const ROAD: [number, number][] = [
	[30, 250],
	[160, 245],
	[290, 220],
	[420, 200],
	[560, 215],
	[690, 240],
	[820, 285],
	[900, 375],
	[790, 450],
	[640, 460],
	[510, 470],
	[380, 480],
	[255, 495],
	[130, 510],
	[30, 520],
];

/** `count` points spread evenly along the road, each pushed a little to its side. */
export function alongRoad(count: number, side = 17): [number, number][] {
	const lengths = ROAD.slice(1).map((p, i) => Math.hypot(p[0] - ROAD[i][0], p[1] - ROAD[i][1]));
	const total = lengths.reduce((a, b) => a + b, 0);
	const points: [number, number][] = [];
	for (let k = 0; k < count; k += 1) {
		// Leave a margin at both ends of the road.
		let at = total * (0.03 + (0.94 * (k + 0.5)) / count);
		let i = 0;
		while (i < lengths.length - 1 && at > lengths[i]) {
			at -= lengths[i];
			i += 1;
		}
		const [x0, y0] = ROAD[i];
		const [x1, y1] = ROAD[i + 1];
		const t = at / lengths[i];
		const nx = -(y1 - y0) / lengths[i];
		const ny = (x1 - x0) / lengths[i];
		points.push([Math.round(x0 + (x1 - x0) * t - nx * side), Math.round(y0 + (y1 - y0) * t - ny * side)]);
	}
	return points;
}

export interface District {
	id: StageId;
	done: number;
	total: number;
}

export interface TownState {
	districts: District[];
	/** One entry per lesson in course order: does it have its sticker? */
	lanterns: boolean[];
}

export const fountainOn = (town: TownState): boolean => town.districts.some((d) => d.total > 0 && d.done === d.total);

/* Each building is drawn around the foot of its door (0, 0). */
const BUILDINGS: Record<StageId, string> = {
	werkstatt: `<rect x="-62" y="-78" width="124" height="78" class="wall"/>
<path d="M-70 -78 l28 -34 v34 l28 -34 v34 l28 -34 v34 l28 -34 v34 l28 -34 v34z" class="roof"/>
<rect x="-14" y="-40" width="28" height="40" rx="4" class="door"/>
<rect x="-50" y="-60" width="22" height="18" class="win"/><rect x="28" y="-60" width="22" height="18" class="win"/>
<g class="sign-art" transform="translate(0 -96)"><circle r="13" class="gear"/><circle r="5" class="gear-hole"/>${Array.from({ length: 8 }, (_, i) => `<rect x="-3" y="-18" width="6" height="7" class="gear" transform="rotate(${i * 45})"/>`).join("")}</g>`,
	bahnhof: `<rect x="-74" y="-70" width="148" height="70" class="wall"/>
<path d="M-84 -70 L0 -112 L84 -70z" class="roof"/>
<circle cy="-86" r="13" class="clock"/><path d="M0 -86 v-8 M0 -86 h6" class="clock-hand"/>
<path d="M-18 0 v-36 a18 18 0 0 1 36 0 v36z" class="door"/>
<rect x="-60" y="-52" width="24" height="22" class="win"/><rect x="36" y="-52" width="24" height="22" class="win"/>
<path d="M-90 14 h180 M-90 24 h180" class="rail"/>${Array.from({ length: 10 }, (_, i) => `<path d="M${-86 + i * 19} 10 v18" class="sleeper"/>`).join("")}`,
	detektiv: `<rect x="-44" y="-104" width="88" height="104" class="wall"/>
<path d="M-54 -104 L0 -150 L54 -104z" class="roof"/>
<rect x="-12" y="-38" width="24" height="38" rx="3" class="door"/>
<rect x="-32" y="-88" width="20" height="20" class="win"/><rect x="12" y="-88" width="20" height="20" class="win"/>
<g class="sign-art" transform="translate(58 -70) rotate(-30)"><circle r="14" class="lens"/><path d="M0 14 v22" class="lens-handle"/></g>`,
	woerterschatz: `<rect x="-40" y="-112" width="80" height="112" class="wall"/>
<path d="M-46 -112 h92 v-14 h-14 v8 h-14 v-8 h-14 v8 h-14 v-8 h-14 v8 h-14 v-8 h-8z" class="roof"/>
<path d="M-12 0 v-30 a12 12 0 0 1 24 0 v30z" class="door"/>
<rect x="-10" y="-84" width="20" height="26" rx="10" class="win"/>
<g class="sign-art" transform="translate(0 -144)"><path d="M0 -14 L13 -2 L0 16 L-13 -2z" class="gem"/><path d="M-13 -2 h26 M0 -14 L-5 -2 L0 16 L5 -2z" class="gem-line"/></g>
<g transform="translate(56 -2)"><rect x="-18" y="-18" width="36" height="18" class="chest"/><path d="M-18 -18 q18 -16 36 0z" class="chest-lid"/><rect x="-3" y="-14" width="6" height="7" class="chest-lock"/></g>`,
	lesewerkstatt: `<rect x="-70" y="-74" width="140" height="74" class="wall"/>
<path d="M-80 -74 L0 -108 L80 -74z" class="roof"/>
${[-52, -26, 26, 52].map((x) => `<rect x="${x - 5}" y="-70" width="10" height="70" class="column"/>`).join("")}
<rect x="-14" y="-40" width="28" height="40" class="door"/>
<g class="sign-art" transform="translate(0 -88)"><path d="M0 4 q-12 -8 -24 -4 v-14 q12 -4 24 4z M0 4 q12 -8 24 -4 v-14 q-12 -4 -24 4z" class="book"/></g>`,
	schreibwerkstatt: `<rect x="-60" y="-70" width="100" height="70" class="wall"/>
<path d="M-68 -70 L-10 -108 L48 -70z" class="roof"/>
<rect x="-26" y="-40" width="26" height="40" rx="3" class="door"/>
<rect x="8" y="-56" width="20" height="18" class="win"/>
<g class="sign-art" transform="translate(58 0)"><rect x="-12" y="-120" width="24" height="120" class="pencil"/><path d="M-12 -120 L0 -146 L12 -120z" class="pencil-wood"/><path d="M-4 -137 L0 -146 L4 -137z" class="pencil-tip"/><rect x="-12" y="-12" width="24" height="12" class="pencil-end"/></g>`,
	sprachlabor: `<rect x="-62" y="-72" width="124" height="72" class="wall"/>
<path d="M-70 -72 h140 v-10 h-140z" class="roof"/>
<g class="sign-art" transform="translate(30 -82)"><path d="M-8 0 v-22 h16 v22 l14 28 h-44z" class="flask"/><path d="M-14 16 h28 l5 10 h-38z" class="flask-liquid"/></g>
<g transform="translate(-34 -100)"><path d="M-22 -14 h44 a6 6 0 0 1 6 6 v14 a6 6 0 0 1 -6 6 h-30 l-10 10 v-10 h-4 a6 6 0 0 1 -6 -6 v-14 a6 6 0 0 1 6 -6z" class="bubble-sign"/><text y="5" text-anchor="middle" class="bubble-text">Hallo!</text></g>
<rect x="-12" y="-40" width="24" height="40" class="door"/>
<rect x="-50" y="-56" width="22" height="20" class="win"/><rect x="28" y="-56" width="22" height="20" class="win"/>`,
};

const FLAG = '<g class="flag"><path d="M0 0 v-46" class="flag-pole"/><path d="M0 -46 l30 9 l-30 9z" class="flag-cloth"/></g>';
/** Where the flag pole stands on each roof. */
const FLAG_AT: Record<StageId, [number, number]> = {
	werkstatt: [-52, -112],
	bahnhof: [0, -112],
	detektiv: [0, -150],
	woerterschatz: [-36, -126],
	lesewerkstatt: [0, -108],
	schreibwerkstatt: [-10, -108],
	sprachlabor: [-50, -82],
};

function tree(x: number, y: number, s = 1): string {
	return `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-4" y="-16" width="8" height="18" class="trunk"/><circle cy="-30" r="20" class="leaf"/><circle cx="-12" cy="-20" r="13" class="leaf"/><circle cx="12" cy="-22" r="13" class="leaf"/></g>`;
}

/** The whole map as decoration; the places are buttons laid over it in HTML. */
export function townArt(town: TownState): string {
	const lanterns = alongRoad(town.lanterns.length)
		.map(
			([x, y], i) =>
				`<g class="lantern${town.lanterns[i] ? " lit" : ""}" transform="translate(${x} ${y})">${town.lanterns[i] ? '<circle cy="-16" r="11" class="glow"/>' : ""}<path d="M0 0 v-12" class="lantern-post"/><circle cy="-16" r="4.5" class="lamp"/></g>`,
		)
		.join("");
	const road = ROAD.map(([x, y]) => `${x} ${y}`).join(" L");
	const places = town.districts
		.map((d) => {
			const { x, y } = PLACES[d.id];
			const [fx, fy] = FLAG_AT[d.id];
			const complete = d.total > 0 && d.done === d.total;
			return `<g class="place place-${d.id}${d.done ? " started" : ""}${complete ? " complete" : ""}" transform="translate(${x} ${y})"><ellipse cy="4" rx="80" ry="12" class="shadow"/>${BUILDINGS[d.id]}${complete ? `<g transform="translate(${fx} ${fy})">${FLAG}</g>` : ""}</g>`;
		})
		.join("");
	const fountain = fountainOn(town);
	return `<svg class="town-art" viewBox="0 0 ${VIEW.width} ${VIEW.height}" aria-hidden="true" focusable="false">
<rect width="${VIEW.width}" height="${VIEW.height}" class="grass"/>
<path d="M0 90 q160 -60 330 -20 t340 -10 t330 20 V0 H0z" class="hill"/>
<g class="cloud"><ellipse cx="120" cy="50" rx="46" ry="16"/><ellipse cx="150" cy="40" rx="30" ry="16"/></g>
<g class="cloud cloud-2"><ellipse cx="780" cy="40" rx="50" ry="15"/><ellipse cx="810" cy="30" rx="28" ry="14"/></g>
<path d="M700 620 q20 -90 130 -110 t170 -40 V620z" class="water"/>
<path d="M745 590 q30 -8 60 0 M840 560 q30 -8 60 0 M900 600 q25 -6 50 0" class="wave"/>
<path d="M30 ${ROAD[0][1]} L${road}" class="road-edge"/>
<path d="M30 ${ROAD[0][1]} L${road}" class="road"/>
<path d="M30 ${ROAD[0][1]} L${road}" class="road-line"/>
<g class="plaza" transform="translate(520 330)"><ellipse rx="70" ry="26" class="plaza-stone"/><ellipse rx="34" ry="12" class="basin"/><ellipse rx="26" ry="8" class="basin-water"/>${fountain ? '<g class="jets"><path d="M0 -4 q-4 -24 -18 -10 M0 -4 q4 -24 18 -10 M0 -4 v-30"/></g>' : ""}<rect x="-4" y="-12" width="8" height="10" class="basin-post"/></g>
${tree(270, 320)}${tree(300, 335, 0.8)}${tree(560, 120, 0.9)}${tree(820, 150)}${tree(40, 380, 0.9)}${tree(500, 560, 0.85)}${tree(260, 590, 0.7)}
<g class="pier"><path d="M760 520 h90 v10 h-90z" class="pier-wood"/><path d="M770 530 v24 M800 530 v24 M830 530 v24" class="pier-leg"/></g>
<g transform="translate(880 560)"><g class="boat"><path d="M-40 0 h80 l-14 18 h-52z" class="boat-hull"/><path d="M0 0 v-52" class="boat-mast"/><path d="M2 -50 l30 40 h-30z" class="boat-sail"/></g></g>
${lanterns}${places}
</svg>`;
}

export const placeLabel = (title: string, d: District): string =>
	`${title}, ${d.done} von ${d.total} ${d.total === 1 ? "Sticker" : "Stickern"}`;

const pct = (value: number, of: number) => `${((value / of) * 100).toFixed(2)}%`;

/** Map, place buttons, Tinto's figure and the harbour with the game. */
export function townHtml(
	town: TownState,
	stages: Stage[],
	selected: StageId,
	tintoSvg: string,
): string {
	const buttons = town.districts
		.map((d) => {
			const stage = stages.find((s) => s.id === d.id);
			if (!stage) return "";
			const { x, y } = PLACES[d.id];
			return `<button type="button" class="town-place${d.done === d.total ? " complete" : ""}" data-action="district" data-stage="${d.id}" aria-pressed="${d.id === selected}" aria-label="${esc(placeLabel(stage.title, d))}" style="left:${pct(x, VIEW.width)};top:${pct(y - 150, VIEW.height)}"><span class="town-sign" data-stage="${d.id}"><span aria-hidden="true">${stage.icon}</span><span class="town-name">${esc(stage.title)}</span><span class="town-count">${d.done}/${d.total}</span></span></button>`;
		})
		.join("");
	const here = PLACES[selected];
	return `<div class="town-map">${townArt(town)}${buttons}
<div class="town-tinto" id="town-tinto" aria-hidden="true" style="${tintoSpot(here)}">${tintoSvg}</div>
<button type="button" class="town-game" data-action="view" data-target="spiel"><span aria-hidden="true">🐙</span> <span class="town-game-name">Spiel: Acht Arme, acht Wörter</span></button>
</div>`;
}

/** Tinto stands to the right of the door of a place. */
export const tintoSpot = (p: { x: number; y: number }): string =>
	`left:${pct(p.x + 62, VIEW.width)};top:${pct(p.y + 8, VIEW.height)}`;
