import { type LottaMood, renderLottaSvg } from "./lotta";
import type { StageId } from "../model/types";

// Coordinates on the illustrated map, in percent, in walking order.
const places = [
	{ id: "lb1", name: "Rathausplatz", x: 17, y: 31, stop: 0 },
	{ id: "lb2", name: "Körperzelt", x: 49, y: 25, stop: 3 },
	{ id: "lb3", name: "Waldbach", x: 81, y: 32, stop: 6 },
	{ id: "lb6", name: "Werkstatt", x: 82, y: 76, stop: 9 },
	{ id: "lb5", name: "Kompassgipfel", x: 50, y: 72, stop: 12 },
	{ id: "lb4", name: "Zeitburg", x: 17, y: 76, stop: 15 },
] as const;

const trail = [
	[25, 40],
	[30, 41],
	[38, 33],
	[57, 34],
	[63, 35],
	[73, 43],
	[89, 41],
	[93, 52],
	[89, 65],
	[90, 85],
	[77, 89],
	[68, 81],
	[58, 81],
	[48, 85],
	[35, 82],
	[25, 85],
];

const landmarks: Record<StageId, string> = {
	lb1: `<path fill="#ffedc9" d="M12 77V48l22-14 22 14v29zm42 0V43l27-13 27 13v34z"/>
		<path fill="#bb5e43" d="m7 48 27-20 27 20zm44-5 30-20 32 20z"/>
		<path fill="#f9d997" d="M45 79V28h30v51z"/><path fill="#5e9390" d="m40 29 20-22 21 22z"/>
		<circle cx="60" cy="39" r="7" fill="#fff9da"/><path d="M60 34v5l4 2M60 7V1m0 0 12 3-12 2"/>
		<path fill="#426e71" d="M54 79V65q6-10 12 0v14zM20 54h7v9h-7zm17 0h6v9h-6zm46-5h7v10h-7zm13 0h7v10h-7z"/> `,
	lb2: `<path d="M12 79 54 19l11-1 44 61Z" fill="#e7ab77"/><path d="m21 78 35-58-15 58z" fill="#fff2cf"/>
		<path d="m43 78 17-49 21 49z" fill="#8e694e"/><path d="m60 29 3 49h18z" fill="#faf0c9"/>
		<path d="M60 19V1l17 4-17 5" fill="#bb5247"/><path d="m12 79-8 4m103-4 8 4"/>
		<circle cx="84" cy="51" r="10" fill="#ffefd1"/><path stroke="#a34740" stroke-width="3" d="M84 45v12m-6-6h12"/> `,
	lb3: `<path d="M54 84q41-10 15-18t15-15q-23 10-1 15t-2 18z" fill="#76bed0" stroke="none"/>
		<g fill="#548972"><path d="m8 62 13-22h-6l12-22 14 22h-6l14 22z"/><path d="m31 67 15-25h-6l14-28 15 28h-6l14 25z"/></g>
		<path fill="#386e62" d="m44 58 14-22h-6L66 9l15 27h-6l13 22z"/>
		<path d="M27 62v12m27-7v9m12-18v9" stroke-width="4"/><path fill="#d49d70" d="M77 67q12-12 26 0v7q-12-8-26 0z"/> `,
	lb4: `<path fill="#d8b09c" d="M15 79V37h21v42zm68 0V36h21v43z"/><path fill="#957f9e" d="M9 38 25 12l17 26zm68-1 16-26 17 26z"/>
		<path fill="#f6d8af" d="M34 79V48h7v6h6v-6h8v6h8v-6h8v6h7v-6h7v31z"/>
		<path fill="#806759" d="M51 79V68q8-12 16 0v11z"/><path d="M22 46h5v8h-5zm70-1h5v8h-5z" fill="#517271"/>
		<path d="M25 13V2l11 3-11 2m68 4V3l10 2-10 3" fill="#c0604e"/> `,
	lb5: `<path fill="#819e95" d="m3 77 31-41 15 12 24-35 40 65z"/><path fill="#f8f4d8" d="m55 39 18-26 20 33-15-8-6 6-6-13z"/>
		<path fill="#a8bb9a" d="m9 79 25-34 18 28 23-21 26 29z"/>
		<path d="M58 82q14-10 2-15t6-13" fill="none" stroke="#f0d3a0" stroke-width="4"/>
		<path d="M74 13V1l15 3-15 4" fill="#c55d4e"/> `,
	lb6: `<path fill="#f3cf9c" d="M15 64V36l24-13 27 14v24z"/><path fill="#cc7752" d="m9 36 29-20 34 21z"/>
		<path fill="#547979" d="M23 43h10v11H23zm18 16V42h12v17z"/><circle cx="70" cy="55" r="16" fill="#bf8c60"/>
		<circle cx="70" cy="55" r="11" fill="#edc99a"/><path d="m59 55h22m-11-11v22m-8-19 16 16m-16 0 16-16"/>
		<path d="M9 75q42-17 104-6v9q-61-10-104 5z" fill="#c09366"/><path d="M17 75V64m20 7V61m21 7V59m23 9V58m20 10V60M16 65q42-11 85-4" fill="none"/> `,
};

function landscape(): string {
	return `<svg class="map-paper" viewBox="0 0 800 395" preserveAspectRatio="none" aria-hidden="true">
		<defs>
			<linearGradient id="field-paper" x2=".3" y2="1"><stop stop-color="#e9efce"/><stop offset="1" stop-color="#e6dda9"/></linearGradient>
			<pattern id="furrows" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M1 0v8" stroke="#bea673" stroke-width="2"/></pattern>
			<g id="spruce"><path d="m0 0-5 11h2l-5 9H7l-4-9h2z" fill="#699782"/><path d="M0 19v4" stroke="#785f4c" stroke-width="2"/></g>
		</defs>
		<rect width="800" height="395" fill="url(#field-paper)"/>
		<path d="M0 37Q97-4 181 34T367 30T559 11T800 14V0H0z" fill="#acd0bd"/>
		<path d="M0 62Q113 12 211 52T420 41T634 30T800 35V10Q672 11 590 23T389 23T192 31T0 28z" fill="#c5dab8"/>
		<path d="M0 283q60-39 111-7t96 12l-39 112H0zm531-220q53-31 108-14l-39 60-80-13z" fill="#dbce92"/>
		<path d="M0 283q60-39 111-7t96 12l-39 112H0zm531-220q53-31 108-14l-39 60-80-13z" fill="url(#furrows)" opacity=".68"/>
		<path d="M787-6c-88 60-66 94-150 133s1 68-129 82-90 60-171 75-57 90-113 122" fill="none" stroke="#a4b98c" stroke-width="23"/>
		<path d="M787-6c-88 60-66 94-150 133s1 68-129 82-90 60-171 75-57 90-113 122" fill="none" stroke="#79b9c0" stroke-width="16"/>
		<path d="M787-6c-88 60-66 94-150 133s1 68-129 82-90 60-171 75-57 90-113 122" fill="none" stroke="#c4ece4" stroke-width="2"/>
		${[
			[24, 112],
			[35, 121],
			[51, 110],
			[260, 65],
			[272, 73],
			[535, 42],
			[559, 37],
			[549, 51],
			[745, 141],
			[758, 153],
			[773, 130],
			[54, 292],
			[69, 286],
			[92, 306],
			[550, 316],
			[568, 328],
			[583, 321],
		]
			.map(([x, y]) => `<use href="#spruce" x="${x}" y="${y}"/>`)
			.join("")}
		<g transform="translate(45 42)" fill="#626b56" stroke="#647760"><circle r="15" fill="#f8edcd"/><path d="m0-18 4 15 12 3-13 3-3 15-3-15-12-3 12-3z" fill="#e4d6b0"/><path d="M0-18 4-3 0 0z"/><text y="-21" stroke="none" text-anchor="middle" font-size="11" font-weight="bold">N</text></g>
		<g transform="scale(8 3.95)" fill="none" stroke-linecap="round" stroke-linejoin="round">
			<polyline points="${trail.map((p) => p.join(",")).join(" ")}" vector-effect="non-scaling-stroke" stroke="#f9edcb" stroke-width="7"/>
			<polyline points="${trail.map((p) => p.join(",")).join(" ")}" vector-effect="non-scaling-stroke" stroke="#ad885d" stroke-width="2" stroke-dasharray="2 6"/>
		</g>
	</svg>`;
}

export function renderFieldMap(selected: StageId, mood: LottaMood): string {
	const stop = trail[places.find((p) => p.id === selected)!.stop];
	return `<div class="field-map" role="group" aria-label="Sechs Orte auf der Entdeckerkarte">
		${landscape()}
		${places
			.map(
				(
					p,
				) => `<button class="map-place" type="button" data-action="choose-world" data-world="${p.id}" aria-controls="world-stations" aria-pressed="${selected === p.id}" style="left:${p.x}%;top:${p.y}%">
			<svg viewBox="0 0 120 90" aria-hidden="true"><ellipse cx="60" cy="79" rx="54" ry="8" fill="#a8b78e"/>
			<g stroke="#534f42" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round">${landmarks[p.id]}</g></svg>
			<span>${p.name}</span></button>`,
			)
			.join("")}
		<div class="map-traveller" aria-hidden="true" style="left:${stop[0]}%;top:${stop[1]}%">${renderLottaSvg(mood)}</div>
	</div>`;
}

export function walkToWorld(
	map: HTMLElement,
	from: StageId,
	to: StageId,
	quiet: boolean,
): void {
	const marker = map.querySelector<HTMLElement>(".map-traveller");
	if (!marker) return;
	const start = places.find((p) => p.id === from)!.stop;
	const end = places.find((p) => p.id === to)!.stop;
	const steps = trail.slice(Math.min(start, end), Math.max(start, end) + 1);
	if (start > end) steps.reverse();
	const points = steps.map(([x, y]) => ({ left: x + "%", top: y + "%" }));
	// Keep rapid changes continuous, even halfway down another trail.
	const position = getComputedStyle(marker);
	const current = { left: position.left, top: position.top };
	for (const animation of marker.getAnimations()) animation.cancel();
	Object.assign(marker.style, points[points.length - 1]);
	if (!quiet && start !== end) {
		marker.animate([current, ...points.slice(1)], {
			duration: 230 + 40 * steps.length,
			easing: "ease-in-out",
		});
	}
}
