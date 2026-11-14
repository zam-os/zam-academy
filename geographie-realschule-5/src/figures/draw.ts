import { esc } from "../workshop";

/** Diagram geometry is authored locally; labels are escaped and colours follow both themes. */
export const label = (
	x: number,
	y: number,
	text: string,
	cls = "",
	anchor = "middle",
): string =>
	`<text x="${x}" y="${y}" class="visual-label ${cls}" text-anchor="${anchor}">${esc(text)}</text>`;
export const lines = (x: number, y: number, text: string): string =>
	`<text x="${x}" y="${y}" class="visual-label" text-anchor="middle">${text
		.split("\n")
		.map((s, i) => `<tspan x="${x}" dy="${i ? 23 : 0}">${esc(s)}</tspan>`)
		.join("")}</text>`;
export const group = (part: number, body: string): string =>
	`<g class="visual-part" data-part="${part}">${body}</g>`;
export const panel = (
	x: number,
	y: number,
	w: number,
	h: number,
	cls = "v-panel",
): string =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" class="${cls}"/>`;
export function arrow(
	x1: number,
	y1: number,
	x2: number,
	y2: number,
	cls = "v-arrow",
): string {
	const a = Math.atan2(y2 - y1, x2 - x1),
		size = 10;
	return `<g class="${cls}"><path d="M${x1} ${y1}L${x2} ${y2}"/><path class="arrow-head" d="M${x2} ${y2}L${x2 - size * Math.cos(a - 0.5)} ${y2 - size * Math.sin(a - 0.5)}L${x2 - size * Math.cos(a + 0.5)} ${y2 - size * Math.sin(a + 0.5)}Z"/></g>`;
}
export const number = (x: number, y: number, n: number): string =>
	`<g class="visual-number"><circle cx="${x}" cy="${y}" r="15"/>${label(x, y + 6, String(n))}</g>`;
export const tree = (x: number, y: number, s = 1): string =>
	`<g transform="translate(${x} ${y}) scale(${s})"><path class="v-trunk" d="M-3 0h6v35h-6z"/><circle class="v-leaf" cy="-5" r="21"/><circle class="v-leaf-light" cx="-12" cy="-12" r="13"/></g>`;
export const house = (x: number, y: number, s = 1, kind = "v-house"): string =>
	`<g transform="translate(${x} ${y}) scale(${s})"><rect class="${kind}" x="-32" y="-16" width="64" height="53" rx="3"/><path class="v-roof" d="M-40-16L0-48 40-16Z"/><rect class="v-window" x="-22" y="-5" width="16" height="16"/><rect class="v-window" x="8" y="-5" width="16" height="16"/><rect class="v-door" x="-6" y="16" width="13" height="21"/></g>`;
export const person = (x: number, y: number, cls = "v-blue"): string =>
	`<g transform="translate(${x} ${y})"><circle class="v-skin" cy="-29" r="10"/><path class="${cls}" d="M-13-12Q0-24 13-12L17 15h-34Z"/><path class="v-limb" d="M-7 15v18M7 15v18"/></g>`;
export const globe = (x: number, y: number, r = 65): string =>
	`<g transform="translate(${x} ${y})"><circle r="${r}" class="v-water"/><ellipse rx="${r * 0.42}" ry="${r}" class="v-grid"/><ellipse rx="${r}" ry="${r * 0.35}" class="v-grid"/><path class="v-grid" d="M${-r} 0H${r}M0 ${-r}V${r}"/><path class="v-continent" d="M${-r * 0.6} ${-r * 0.4}q${r * 0.4} ${-r * 0.3} ${r * 0.6} ${r * 0.1}l${-r * 0.2} ${r * 0.25} ${-r * 0.12} ${r * 0.45} ${-r * 0.25} ${-r * 0.15}z"/></g>`;
export const mountains = (x: number, y: number, s = 1): string =>
	`<g transform="translate(${x} ${y}) scale(${s})"><path class="v-mountain" d="M-100 50L-45-35 0 12 55-80 130 50Z"/><path class="v-snow" d="M34-44L55-80 84-30 59-43 49-34Z"/></g>`;
export const compass = (x: number, y: number): string =>
	`<g transform="translate(${x} ${y})"><circle r="54" class="v-paper"/><path class="v-coral" d="M0-43L13 12 0 0-13 12Z"/><path class="v-blue" d="M0 43L13-12 0 0-13-12Z"/>${label(0, -61, "N")}${label(65, 7, "O")}${label(0, 79, "S")}${label(-65, 7, "W")}</g>`;
export const magnifier = (x: number, y: number): string =>
	`<g transform="translate(${x} ${y})"><circle r="34" class="v-glass"/><path class="v-outline thick" d="M25 25L58 58"/></g>`;
export const notebook = (x: number, y: number): string =>
	`<g transform="translate(${x} ${y})"><rect class="v-paper" x="-40" y="-55" width="80" height="110" rx="8"/><path class="v-grid" d="M-23-25h45M-23-5h45M-23 15h30M-23 35h40"/><path class="v-binding" d="M-46-35h12M-46-10h12M-46 15h12M-46 40h12"/></g>`;
export const landscape = (body = ""): string =>
	`<rect class="v-sky" width="600" height="270" rx="18"/><circle class="v-sun" cx="535" cy="50" r="25"/><path class="v-meadow" d="M0 168Q150 120 300 168T600 160V270H0Z"/>${body}`;
