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
		"klang-wortschatz":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M5 4h11a3 3 0 0 1 3 3v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V4z"/><path d="M9 8h6M9 12h6M9 16h4"/></svg>',
		"nomina-formen":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M4 6h16M6 6v12M12 6v12M18 6v12M3 20h18"/></svg>',
		"verben-zeiten":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/></svg>',
		"satzbau-kasus":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M4 20V11a8 8 0 0 1 16 0v9"/><path d="M8 20v-7a4 4 0 0 1 8 0v7"/></svg>',
		"rom-topografie":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M3 19h18M4 19V8l8-4 8 4v11"/><path d="M8 19v-4a2 2 0 0 1 4 0v4M14 19v-4a2 2 0 0 1 4 0v4"/></svg>',
		"gesellschaft-alltag":
			'<svg class="stage-svg" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/></svg>',
		"religion-mythos":
			'<svg class="stage-svg" viewBox="0 0 24 24"><path d="M12 3v18M7 8c0 4 2 7 5 9M17 8c0 4-2 7-5 9M5 13c2 2 4 3 7 4M19 13c-2 2-4 3-7 4"/></svg>',
		"text-methodik":
			'<svg class="stage-svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><polygon class="solid" points="14.5,9.5 11,11 9.5,14.5 13,13"/></svg>',
	};
	return icons[stageId] ?? icons["klang-wortschatz"];
}

export function renderStageArt(stageId: string): string {
	let body = "";
	switch (stageId) {
		case "klang-wortschatz":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 34, 84, 30, "a-MĪ-cus", "v-orange-fill", "micro")}
				${arrow(102, 49, 124, 49)}
				${pill(128, 34, 78, 30, "am-īc-us", "v-teal-fill", "micro")}
				${arrow(210, 49, 232, 49)}
				${pill(236, 34, 70, 30, "S.P.Q.R.", "v-gold-fill", "micro")}
				${label(160, 18, "Klang · Stamm · Europa", "micro")}`;
			break;
		case "nomina-formen":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 32, 86, 26, "nauta (m.)", "v-blue-fill", "micro")}
				${pill(116, 32, 86, 26, "bonus (m.)", "v-teal-fill", "micro")}
				${pill(218, 32, 88, 26, "I · II · XII", "v-purple-fill", "micro")}
				${label(160, 78, "K · N · G – Deklinationen & Zahlen", "micro")}
				${label(160, 18, "Kasus · Numerus · Genus", "micro")}`;
			break;
		case "verben-zeiten":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(12, 38, 66, 26, "Plusq.", "v-purple-fill", "micro")}
				${pill(84, 38, 68, 26, "Imperf./Pf.", "v-teal-fill", "micro")}
				${pill(158, 38, 62, 26, "Präs.", "v-green-fill", "micro")}
				${pill(226, 38, 82, 26, "Fut. II / I", "v-orange-fill", "micro")}
				${label(160, 18, "Präsensstamm ← Zeitstrahl → Perfektstamm", "micro")}`;
			break;
		case "satzbau-kasus":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 38, 86, 26, "Audiō", "v-blue-fill", "micro")}
				${arrow(102, 51, 122, 51)}
				${pill(126, 38, 92, 26, "[Mārcum]", "v-purple-fill", "micro")}
				${pill(224, 38, 82, 26, "venīre", "v-teal-fill", "micro")}
				${label(160, 18, "Abfrageschema · Kasus · AcI", "micro")}`;
			break;
		case "rom-topografie":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				<path d="M12 72 Q90 50 160 66 T308 58" class="v-outline-thick"/>
				${pill(18, 30, 74, 24, "Kapitol", "v-orange-fill", "micro")}
				${pill(104, 46, 102, 24, "Forum Romanum", "v-gold-fill", "micro")}
				${pill(218, 30, 86, 24, "Kolosseum", "v-coral-fill", "micro")}
				${label(160, 17, "Sieben Hügel · Tiber · Ostia", "micro")}`;
			break;
		case "gesellschaft-alltag":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 34, 88, 28, "Senātus", "v-coral-fill", "micro")}
				${pill(114, 34, 92, 28, "Tria Nomina", "v-blue-fill", "micro")}
				${pill(218, 34, 88, 28, "Iden 13./15.", "v-gold-fill", "micro")}
				${label(160, 82, "pietās · virtūs · tabula · stilus", "micro")}
				${label(160, 18, "Staat · Familie · Schule · Kalender", "micro")}`;
			break;
		case "religion-mythos":
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 36, 84, 26, "Iuppiter", "v-teal-fill", "micro")}
				${arrow(102, 49, 120, 49)}
				${pill(124, 36, 78, 26, "Aenēās", "v-gold-fill", "micro")}
				${arrow(206, 49, 224, 49)}
				${pill(228, 36, 78, 26, "753 v. Chr.", "v-orange-fill", "micro")}
				${label(160, 18, "Olympier · Herkules · Romulus", "micro")}`;
			break;
		default:
			body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}
				${pill(14, 36, 86, 26, "1. Erschließen", "v-blue-fill", "micro")}
				${arrow(104, 49, 120, 49)}
				${pill(124, 36, 82, 26, "2. Prüfen", "v-green-fill", "micro")}
				${arrow(210, 49, 226, 49)}
				${pill(230, 36, 76, 26, "3. Urteilen", "v-gold-fill", "micro")}
				${label(160, 18, "Texterschließung · Methode · Team", "micro")}`;
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
