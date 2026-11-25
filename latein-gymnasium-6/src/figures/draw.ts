export interface ConceptPart {
	label: string;
	note: string;
}

export interface ConceptFigure {
	title: string;
	question: string;
	alt: string;
	caption: string;
	parts: [ConceptPart, ConceptPart, ConceptPart];
	draw: () => string;
}

export const escSvg = (value: string): string =>
	value
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");

export function card(
	x: number,
	y: number,
	w: number,
	h: number,
	cls = "v-paper",
	rx = 10,
): string {
	return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;
}

function splitPillLines(text: string, maxChars: number): [string, string] | null {
	if (text.length <= maxChars) return null;
	const mid = Math.floor(text.length / 2);
	let best = -1;
	let bestDist = Infinity;
	for (let i = 3; i < text.length - 3; i++) {
		if (text[i] === " " || text[i] === "/") {
			const dist = Math.abs(i - mid);
			if (dist < bestDist) {
				best = i;
				bestDist = dist;
			}
		}
	}
	if (best === -1) return null;
	const l1 = (text[best] === "/" ? text.slice(0, best + 1) : text.slice(0, best)).trim();
	const l2 = text.slice(best + 1).trim();
	return l1 && l2 ? [l1, l2] : null;
}

export function pill(
	x: number,
	y: number,
	w: number,
	h: number,
	text: string,
	cls = "v-pill",
	textCls = "small",
): string {
	const textFill =
		cls === "v-blue" ||
		cls === "v-teal" ||
		cls === "v-green" ||
		cls === "v-orange" ||
		cls === "v-coral" ||
		cls === "v-purple" ||
		cls === "v-accent-solid"
			? `${textCls} on-fill`
			: textCls;
	const maxChars = textCls === "micro" ? Math.floor((w - 14) / 5.8) : Math.floor((w - 16) / 6.4);
	const wrapped = h >= 34 ? splitPillLines(text, maxChars) : null;
	const labelHtml = wrapped
		? `<text x="${x + w / 2}" y="${y + h / 2 - 2}" text-anchor="middle" class="visual-label ${textFill}"><tspan x="${x + w / 2}" dy="0">${escSvg(wrapped[0])}</tspan><tspan x="${x + w / 2}" dy="13">${escSvg(wrapped[1])}</tspan></text>`
		: `<text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle" class="visual-label ${textFill}">${escSvg(text)}</text>`;
	return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.round(h / 2)}" class="${cls}"/>${labelHtml}</g>`;
}

export function label(
	x: number,
	y: number,
	text: string,
	cls = "",
	anchor: "start" | "middle" | "end" = "middle",
): string {
	return `<text x="${x}" y="${y}" text-anchor="${anchor}" class="visual-label ${cls}">${escSvg(text)}</text>`;
}

export function arrow(x1: number, y1: number, x2: number, y2: number): string {
	const dx = x2 - x1;
	const dy = y2 - y1;
	const len = Math.hypot(dx, dy) || 1;
	const ux = dx / len;
	const uy = dy / len;
	const tipX = x2;
	const tipY = y2;
	const baseX = x2 - ux * 8;
	const baseY = y2 - uy * 8;
	const px = -uy * 4.5;
	const py = ux * 4.5;
	return `<g class="v-arrow"><line x1="${x1}" y1="${y1}" x2="${baseX.toFixed(1)}" y2="${baseY.toFixed(1)}"/><polygon class="v-arrow-head" points="${tipX},${tipY} ${(baseX + px).toFixed(1)},${(baseY + py).toFixed(1)} ${(baseX - px).toFixed(1)},${(baseY - py).toFixed(1)}"/></g>`;
}

export function badge(x: number, y: number, n: 1 | 2 | 3): string {
	return `<g class="visual-number"><circle cx="${x}" cy="${y}" r="11"/><text x="${x}" y="${y + 4}" text-anchor="middle">${n}</text></g>`;
}

export function partGroup(index: 1 | 2 | 3, body: string): string {
	return `<g class="visual-part" data-part="${index}" tabindex="0" role="button" aria-label="Bildteil ${index}">${body}</g>`;
}

/** Shared helper for crisp 3-column concept cards inside a 600x250 canvas. */
export interface CardColumnSpec {
	badge: string;
	fill: string;
	heading: string;
	lines: string[];
	footer?: string;
}

export function threeColumns(
	banner: string,
	cols: [CardColumnSpec, CardColumnSpec, CardColumnSpec],
	withArrows = false,
): string {
	const xs = [16, 210, 404];
	const w = 180;
	const parts = cols.map((col, idx) => {
		const x = xs[idx];
		const linesHtml = col.lines
			.map((line, lineIdx) =>
				label(
					x + w / 2,
					108 + lineIdx * 21,
					line,
					lineIdx === 0 ? "small" : "micro",
				),
			)
			.join("");
		const footerHtml = col.footer
			? pill(x + 14, 192, w - 28, 28, col.footer, col.fill, "micro")
			: "";
		return partGroup(
			(idx + 1) as 1 | 2 | 3,
			`${card(x, 42, w, 190, "v-paper", 12)}
			${pill(x + 14, 52, w - 28, 28, col.heading, col.fill, "small")}
			${badge(x + 18, 42, (idx + 1) as 1 | 2 | 3)}
			${linesHtml}
			${footerHtml}`,
		);
	});
	const arrowsHtml = withArrows
		? `${arrow(197, 136, 209, 136)}${arrow(391, 136, 403, 136)}`
		: "";
	return `${card(4, 4, 592, 242, "v-banner-bg", 14)}${label(300, 26, banner, "heading")}${parts.join("")}${arrowsHtml}`;
}

export function stageIcon(stageId: string): string {
	const icons: Record<string, string> = {
		"wortschatz-bruecken":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
		"nomina-pronomina-zahlen":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M4 6h16M6 6v12M12 6v12M18 6v12M3 20h18"/></svg>',
		"verben-passiv-konjunktiv":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>',
		"satzlehre-konstruktionen":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M4 20V11a8 8 0 0 1 16 0v9"/><path d="M8 20v-7a4 4 0 0 1 8 0v7"/></svg>',
		"italien-vesuv-pompeji":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M3 20l6-11h6l6 11H3z"/><path d="M9 9c-1-2 1-4 3-4s4 2 3 4"/></svg>',
		"republik-hannibal-gesellschaft":
			'<svg class="stage-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
		"mythen-ovid-unterwelt":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M12 3v18M7 8c0 4 2 7 5 9M17 8c0 4-2 7-5 9M5 13c2 2 4 3 7 4M19 13c-2 2-4 3-7 4"/></svg>',
		"methodik-uebersetzen":
			'<svg class="stage-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon class="solid" points="14.5,9.5 11,11 9.5,14.5 13,13"/></svg>',
	};
	return icons[stageId] ?? icons["wortschatz-bruecken"];
}

export function renderStageArt(stageId: string): string {
	let body = "";
	switch (stageId) {
		case "wortschatz-bruecken":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 34, 84, 30, "agere", "v-orange-fill", "micro")}
				${arrow(102, 49, 124, 49)}
				${pill(128, 34, 84, 30, "trāns-īre", "v-teal-fill", "micro")}
				${arrow(216, 49, 236, 49)}
				${pill(240, 34, 66, 30, "victory", "v-gold-fill", "micro")}
				${label(160, 18, "Kontext · Wortbildung · Englisch (2. FS)", "micro")}`;
			break;
		case "nomina-pronomina-zahlen":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 34, 90, 28, "hic · ille · iste", "v-blue-fill", "micro")}
				${pill(114, 34, 92, 28, "īdem · ipse", "v-purple-fill", "micro")}
				${pill(216, 34, 90, 28, "LXXIX · M", "v-teal-fill", "micro")}
				${label(160, 80, "dīves/vetus (-e/-um) · īre (eō, iī)", "micro")}
				${label(160, 18, "Demonstrativa · Zahlen bis 1000 · īre", "micro")}`;
			break;
		case "verben-passiv-konjunktiv":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(12, 38, 90, 26, "vocātur", "v-green-fill", "micro")}
				${pill(110, 38, 96, 26, "captus est", "v-teal-fill", "micro")}
				${pill(214, 38, 94, 26, "vocāret / -isset", "v-purple-fill", "micro")}
				${label(160, 80, "PPA (-ns/-ntis) · PPP (-tus, -a, -um)", "micro")}
				${label(160, 18, "Passiv · Konjunktiv Prät. · Partizipien", "micro")}`;
			break;
		case "satzlehre-konstruktionen":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 36, 84, 26, "ut / nē / cum", "v-purple-fill", "micro")}
				${arrow(102, 49, 118, 49)}
				${pill(122, 36, 92, 26, "[urbs capta]", "v-blue-fill", "micro")}
				${arrow(218, 49, 234, 49)}
				${pill(238, 36, 68, 26, "AcI pass.", "v-teal-fill", "micro")}
				${label(160, 80, "Prädikativum · Kasus · Irrealis · PC", "micro")}
				${label(160, 18, "Nebensätze · Passiver AcI · PC-Klammer", "micro")}`;
			break;
		case "italien-vesuv-pompeji":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(16, 36, 88, 26, "Pompeji 79", "v-coral-fill", "micro")}
				${pill(114, 36, 96, 26, "Magna Graecia", "v-orange-fill", "micro")}
				${pill(220, 36, 84, 26, "Athen / Syrakus", "v-gold-fill", "micro")}
				${label(160, 80, "Vesuv · Plinius d. J. · Kunst & Archimedes", "micro")}
				${label(160, 18, "Kampanien · Mittelmeer · Griechenland", "micro")}`;
			break;
		case "republik-hannibal-gesellschaft":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 34, 88, 28, "494 / 450", "v-coral-fill", "micro")}
				${pill(112, 34, 96, 28, "Hannibal 218", "v-orange-fill", "micro")}
				${pill(218, 34, 88, 28, "Zama 202", "v-green-fill", "micro")}
				${label(160, 80, "Patrōnus & Cliēns · Volkstribun · Opfer", "micro")}
				${label(160, 18, "Ständekämpfe · Organe · 2. Punischer Krieg", "micro")}`;
			break;
		case "mythen-ovid-unterwelt":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 36, 88, 26, "Daedalus", "v-teal-fill", "micro")}
				${arrow(106, 49, 122, 49)}
				${pill(126, 36, 80, 26, "Orpheus", "v-purple-fill", "micro")}
				${arrow(210, 49, 226, 49)}
				${pill(230, 36, 76, 26, "Odysseus", "v-gold-fill", "micro")}
				${label(160, 80, "Europa · Theseus · Troja · Ovids Metamorphosen", "micro")}
				${label(160, 18, "Mythen · Unterwelt · Bild & Text", "micro")}`;
			break;
		default:
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 36, 86, 26, "1. [PC]-Block", "v-blue-fill", "micro")}
				${arrow(104, 49, 120, 49)}
				${pill(124, 36, 86, 26, "2. Wortblock", "v-green-fill", "micro")}
				${arrow(214, 49, 228, 49)}
				${pill(232, 36, 74, 26, "3. Prüfen", "v-gold-fill", "micro")}
				${label(160, 80, "Fehlerdiagnose · Stammformen · Teamarbeit", "micro")}
				${label(160, 18, "Satzanalyse · Methodik · Projekt", "micro")}`;
			break;
	}
	return `<div class="stage-art" aria-hidden="true"><svg viewBox="0 0 320 96" focusable="false">${body}</svg></div>`;
}

export const STEP_ICONS = {
	read: '<svg class="step-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h6a2 2 0 0 1 2 2v12a2 2 0 0 0-2-2H4zM20 5h-6a2 2 0 0 0-2 2v12a2 2 0 0 1 2-2h6z"/></svg>',
	figure:
		'<svg class="step-svg" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M5 17l4-4 3 3 3-4 4 5"/></svg>',
	voice:
		'<svg class="step-svg" viewBox="0 0 24 24" aria-hidden="true"><polygon points="5,9 9,9 14,5 14,19 9,15 5,15"/><path d="M17 9a4 4 0 0 1 0 6M19.5 6.5a7.5 7.5 0 0 1 0 11"/></svg>',
	writing:
		'<svg class="step-svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20h4l10-10-4-4L4 16v4zM13 7l4 4"/></svg>',
};
