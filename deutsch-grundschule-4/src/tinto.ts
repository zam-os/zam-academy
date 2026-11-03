// Tinto, the little ink octopus who writes with eight arms. An original
// drawing in plain SVG so the app needs no image files or requests.
export type Mood = "happy" | "think" | "cheer";

const ARMS_DOWN = [
	"M34 86 q-10 14 -2 24 q6 6 10 -2",
	"M44 92 q-6 16 2 22 q6 2 6 -6",
	"M56 94 q0 16 8 18 q6 -2 2 -10",
	"M68 92 q8 14 16 12 q4 -4 -2 -10",
	"M78 86 q14 8 18 2 q2 -6 -6 -6",
	"M30 80 q-16 4 -18 -4 q0 -6 8 -4",
];
const ARMS_UP = [
	"M30 74 q-18 -10 -14 -24 q4 -6 8 2",
	"M82 74 q18 -10 14 -24 q-4 -6 -8 2",
	"M40 92 q-8 14 0 20 q6 2 6 -6",
	"M56 95 q0 16 8 18 q6 -2 2 -10",
	"M72 92 q8 14 0 20 q-6 2 -6 -6",
	"M34 86 q-12 10 -6 18 q6 4 8 -4",
];

export function tinto(mood: Mood = "happy", label = "Tinto, der kleine Tintenfisch"): string {
	const arms = (mood === "cheer" ? ARMS_UP : ARMS_DOWN)
		.map((d) => `<path d="${d}" class="t-arm"/>`)
		.join("");
	const mouth =
		mood === "think"
			? '<circle cx="62" cy="70" r="3.2" class="t-mouth"/>'
			: mood === "cheer"
				? '<path d="M50 66 q12 14 24 0 z" class="t-mouth"/>'
				: '<path d="M52 67 q10 9 20 0" class="t-line"/>';
	const brows =
		mood === "think"
			? '<path d="M40 40 q6 -5 12 -2" class="t-line"/><path d="M70 36 q6 -2 12 3" class="t-line"/>'
			: "";
	const sparkle =
		mood === "cheer"
			? '<path d="M10 22 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3z M104 14 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2z" class="t-spark"/>'
			: "";
	const pencil =
		mood === "cheer"
			? ""
			: '<g transform="rotate(-35 96 84)"><rect x="90" y="66" width="7" height="30" rx="2" class="t-pencil"/><path d="M90 96 l3.5 8 3.5 -8z" class="t-tip"/></g><path d="M80 84 q12 6 14 -2" class="t-arm"/>';
	return `<svg class="tinto mood-${mood}" viewBox="0 0 120 120" role="img" aria-label="${label}">
${sparkle}${arms}${pencil}
<path d="M60 10 C88 10 96 36 92 58 C90 76 80 90 60 90 C40 90 30 76 28 58 C24 36 32 10 60 10z" class="t-body"/>
<ellipse cx="46" cy="18" rx="9" ry="5" class="t-shine"/>
<circle cx="46" cy="52" r="10" class="t-eye"/><circle cx="76" cy="52" r="10" class="t-eye"/>
<circle cx="48" cy="54" r="5" class="t-pupil"/><circle cx="78" cy="54" r="5" class="t-pupil"/>
<circle cx="50" cy="51" r="1.8" class="t-glint"/><circle cx="80" cy="51" r="1.8" class="t-glint"/>
<ellipse cx="36" cy="66" rx="5" ry="3" class="t-cheek"/><ellipse cx="86" cy="66" rx="5" ry="3" class="t-cheek"/>
${brows}${mouth}
</svg>`;
}
