import { esc } from "../workshop";

export const text = (
	x: number,
	y: number,
	value: string,
	cls = "diagram-label",
) =>
	`<text x="${x}" y="${y}" text-anchor="middle" class="${cls}">${esc(value)}</text>`;
export const box = (
	x: number,
	y: number,
	w: number,
	h: number,
	cls = "diagram-box",
) =>
	`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="14" class="${cls}"/>`;
export const arrow = (x: number, y: number, end: number, endY = y) => {
	const a = Math.atan2(endY - y, end - x);
	return `<g class="diagram-arrow"><path d="M${x},${y}L${end},${endY}"/><polygon points="${end},${endY} ${end - 9 * Math.cos(a - 0.5)},${endY - 9 * Math.sin(a - 0.5)} ${end - 9 * Math.cos(a + 0.5)},${endY - 9 * Math.sin(a + 0.5)}"/></g>`;
};
