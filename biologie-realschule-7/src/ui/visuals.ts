import type { Lesson } from "../model/types";
import { esc } from "../workshop";
import { renderAnatomy } from "./anatomy";

export function renderVisual(lesson: Lesson): string {
	const { visual } = lesson;
	return `<figure class="bio-visual" data-kind="${visual.kind}">
		<figcaption>${esc(visual.title)}</figcaption>
		${renderAnatomy(lesson.id)}
		<ol>${visual.steps.map(({ label, detail }) => `<li><strong>${esc(label)}</strong><span>${esc(detail)}</span></li>`).join("")}</ol>
	</figure>`;
}

export function renderHeroArt(): string {
	return `<figure class="bio-hero-art">
	<svg viewBox="0 0 650 375" role="img" aria-labelledby="hero-art-title">
		<title id="hero-art-title">Eine Blattzelle, eine Pflanze und ein Herz als Stationen des Lernpfads</title>
		<rect width="650" height="375" rx="40" fill="#102c32"/>
		<path d="M38 252C145 117 260 348 380 162S562 90 619 162" fill="none" stroke="#608b88" stroke-width="2" stroke-dasharray="5 10"/>
		<circle cx="151" cy="187" r="95" fill="#254348"/><circle cx="326" cy="156" r="113" fill="#1e4241"/><circle cx="525" cy="209" r="91" fill="#403d4c"/>
		<g transform="translate(77 123)">
			<rect width="139" height="124" rx="34" fill="#396a57" stroke="#a1de95" stroke-width="5"/>
			<rect x="9" y="9" width="121" height="106" rx="28" fill="#254843" stroke="#7ccf93" stroke-width="2"/>
			<ellipse cx="88" cy="62" rx="32" ry="33" fill="#77baaf" opacity=".48"/>
			<ellipse cx="45" cy="58" rx="17" ry="20" fill="#e0bad7"/>
			<g fill="#a1de95"><ellipse cx="48" cy="23" rx="13" ry="5" transform="rotate(-11 48 23)"/><ellipse cx="99" cy="23" rx="13" ry="5"/><ellipse cx="42" cy="98" rx="13" ry="5"/><ellipse cx="101" cy="99" rx="13" ry="5" transform="rotate(-10 101 99)"/></g>
		</g>
		<g transform="translate(248 52)">
			<circle cx="125" cy="37" r="24" fill="#ffd18a"/>
			<path d="M76 204Q62 111 81 55M73 155Q42 105 24 99M77 123Q104 84 135 81" fill="none" stroke="#a1de95" stroke-width="7" stroke-linecap="round"/>
			<path d="M73 151Q23 146 10 91Q54 91 73 151M78 119Q91 68 151 70Q139 119 78 119M79 92Q48 62 79 30Q99 60 79 92" fill="#78c595" stroke="#b6e9a9" stroke-width="2"/>
			<path d="M76 204q-20 11-27 29m27-29q6 14 3 33m-3-33q26 8 34 22m-58-3-13 2m56-12 18 4" fill="none" stroke="#d9bb91" stroke-width="4" stroke-linecap="round"/>
		</g>
		<g transform="translate(459 136)">
			<path d="M60 124Q4 97 7 54Q7 27 36 26Q59 28 67 47Q76 23 101 27Q126 31 126 58Q126 87 60 124Z" fill="#bd6371" stroke="#f7b2b4" stroke-width="5"/>
			<path d="M60 46V15Q70 1 89 7V27M43 29V4M64 55Q45 73 62 111" fill="none" stroke="#ffcfbb" stroke-width="5" stroke-linecap="round"/>
			<path d="M16 77h21l10-14 12 29 11-17h46" fill="none" stroke="#fbe1ba" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
		</g>
		<g fill="#cde9d9" font-size="19" font-weight="600" text-anchor="middle" font-family="system-ui, sans-serif">
			<text x="150" y="312">Blattzelle</text><text x="326" y="312">Pflanze</text><text x="525" y="312">Herz</text>
		</g>
	</svg>
	</figure>`;
}
