// Tinto, the little ink octopus who writes with eight arms. An original
// drawing in plain SVG so the app needs no image files or requests.
//
// Like a real octopus, Tinto changes colour with his mood: the stylesheet
// gives every `mood-*` class its own body colour and fades between them.
// Arms, eyes and the pencil carry classes so that CSS can animate them
// (blinking, swaying, waving); a calm setting switches all of it off.
export type Mood = "happy" | "think" | "cheer" | "encourage" | "sleep";

export const MOODS: Record<Mood, string> = {
	happy: "Tinto lächelt dich an",
	think: "Tinto denkt nach",
	cheer: "Tinto jubelt mit allen acht Armen",
	encourage: "Tinto kratzt sich am Kopf und macht dir Mut",
	sleep: "Tinto schläft im Tintenfass",
};

/** Where each of the eight arms joins the body; the arm sways around it. */
const ROOTS: [number, number][] = [
	[32, 78],
	[38, 86],
	[47, 90],
	[56, 91],
	[64, 91],
	[73, 90],
	[82, 86],
	[88, 78],
];

/** Arms hanging down and curling at the tips. */
const DOWN = [
	"M32 78 q-16 4 -20 -4 q-2 -6 6 -5",
	"M38 86 q-12 8 -14 18 q0 7 7 4",
	"M47 90 q-5 12 -8 20 q-1 6 5 4",
	"M56 91 q-1 13 -3 21 q0 5 5 2",
	"M64 91 q1 13 3 21 q0 5 -5 2",
	"M73 90 q5 12 8 20 q1 6 -5 4",
	"M82 86 q12 8 14 18 q0 7 -7 4",
	"M88 78 q16 4 20 -4 q2 -6 -6 -5",
];

/** The eighth arm holding the pencil. */
const PENCIL_ARM = "M88 78 q10 2 12 -4";

/** The two outer arms raised high, for cheering. */
const UP_LEFT = "M32 76 q-18 -10 -14 -26 q4 -6 8 2";
const UP_RIGHT = "M88 76 q18 -10 14 -26 q-4 -6 -8 2";
/** The right arm scratching the top of the head. */
const SCRATCH = "M88 70 q24 -26 4 -60 q-6 -6 -14 -2";
/** The right arm curled up to the cheek, thinking. */
const CHIN = "M88 78 q14 -4 10 -18 q-3 -7 -10 -3";

function arms(mood: Mood): string[] {
	const paths = [...DOWN];
	if (mood === "cheer") {
		paths[0] = UP_LEFT;
		paths[7] = UP_RIGHT;
	} else if (mood === "encourage") paths[7] = SCRATCH;
	else if (mood === "think") paths[7] = CHIN;
	else if (mood === "happy") paths[7] = PENCIL_ARM;
	return paths;
}

function eyes(mood: Mood): string {
	if (mood === "sleep")
		return '<path d="M38 54 q8 6 16 0" class="t-line"/><path d="M68 54 q8 6 16 0" class="t-line"/>';
	if (mood === "cheer")
		return '<path d="M38 56 q8 -10 16 0" class="t-line"/><path d="M68 56 q8 -10 16 0" class="t-line"/>';
	// Thinking, Tinto looks up to the right.
	const [dx, dy] = mood === "think" ? [3, -3] : [2, 2];
	return `<circle cx="46" cy="52" r="10" class="t-eye"/><circle cx="76" cy="52" r="10" class="t-eye"/>
<circle cx="${46 + dx}" cy="${52 + dy}" r="5" class="t-pupil"/><circle cx="${76 + dx}" cy="${52 + dy}" r="5" class="t-pupil"/>
<circle cx="${48 + dx}" cy="${49 + dy}" r="1.8" class="t-glint"/><circle cx="${78 + dx}" cy="${49 + dy}" r="1.8" class="t-glint"/>`;
}

function face(mood: Mood): string {
	switch (mood) {
		case "think":
			return '<path d="M38 38 q7 -5 14 -1" class="t-line"/><path d="M70 35 q7 -2 13 3" class="t-line"/><circle cx="65" cy="71" r="3.2" class="t-mouth"/>';
		case "cheer":
			return '<path d="M48 65 q12 16 26 0 z" class="t-mouth"/>';
		case "encourage":
			return '<path d="M38 40 q7 -3 14 0" class="t-line"/><path d="M70 36 q7 -5 13 -1" class="t-line"/><path d="M53 68 q8 6 16 0" class="t-line"/>';
		case "sleep":
			return '<path d="M56 71 q4 2 8 0" class="t-line"/>';
		default:
			return '<path d="M52 67 q10 9 20 0" class="t-line"/>';
	}
}

function extras(mood: Mood): string {
	if (mood === "cheer")
		return '<path d="M10 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z M106 12 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" class="t-spark"/>';
	if (mood === "sleep") return '<text x="88" y="30" class="t-zzz">z</text><text x="98" y="18" class="t-zzz small">z</text>';
	if (mood === "happy")
		// The pencil Tinto writes with, held by the eighth arm.
		return '<g class="t-pen" transform="rotate(-35 100 72)"><rect x="96" y="56" width="7" height="28" rx="2" class="t-pencil"/><path d="M96 84 l3.5 8 3.5 -8z" class="t-tip"/></g>';
	return "";
}

export function tinto(mood: Mood = "happy", label = MOODS[mood]): string {
	const limbs = arms(mood)
		.map(
			(d, i) =>
				`<path d="${d}" class="t-arm arm-${i + 1}" style="transform-origin:${ROOTS[i][0]}px ${ROOTS[i][1]}px"/>`,
		)
		.join("");
	return `<svg class="tinto mood-${mood}" viewBox="0 0 120 120" role="img" aria-label="${label}">
<g class="t-all"><g class="t-extras">${extras(mood)}</g><g class="t-arms">${limbs}</g>
<path d="M60 10 C88 10 96 36 92 58 C90 76 80 90 60 90 C40 90 30 76 28 58 C24 36 32 10 60 10z" class="t-body"/>
<ellipse cx="46" cy="20" rx="9" ry="5" class="t-shine"/>
<circle cx="40" cy="30" r="2.4" class="t-spot"/><circle cx="80" cy="26" r="3" class="t-spot"/><circle cx="86" cy="40" r="2" class="t-spot"/>
<g class="t-eyes">${eyes(mood)}</g>
<ellipse cx="36" cy="66" rx="5" ry="3" class="t-cheek"/><ellipse cx="86" cy="66" rx="5" ry="3" class="t-cheek"/>
<g class="t-face">${face(mood)}</g></g>
</svg>`;
}

/**
 * Change the mood of a Tinto already on the page. The body stays the same
 * element, so its colour fades over to the new mood instead of jumping.
 */
export function morphTinto(svg: SVGSVGElement, mood: Mood): void {
	const template = document.createElement("template");
	template.innerHTML = tinto(mood);
	const fresh = template.content.firstElementChild;
	if (!fresh) return;
	svg.setAttribute("class", `tinto mood-${mood}`);
	svg.setAttribute("aria-label", MOODS[mood]);
	for (const part of ["t-extras", "t-eyes", "t-face"]) {
		const target = svg.querySelector(`.${part}`);
		const source = fresh.querySelector(`.${part}`);
		if (target && source) target.innerHTML = source.innerHTML;
	}
	fresh.querySelectorAll(".t-arm").forEach((arm, i) => {
		svg.querySelectorAll(".t-arm")[i]?.setAttribute("d", arm.getAttribute("d") ?? "");
	});
}
