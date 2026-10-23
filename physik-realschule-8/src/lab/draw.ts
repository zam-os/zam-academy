import type { ReadoutValues } from "../model/types";

/**
 * Drawing helpers shared by all labs. Every lab draws itself as inline SVG
 * from the current slider values and readouts. Colours come from CSS classes
 * (styles.css, "lab-*"), so the drawings follow the light and dark theme.
 */

export const W = 520;
export const H = 300;

export function open(label: string): string {
  return `<svg class="lab-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet">`;
}

export const CLOSE = "</svg>";

export function esc(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function r1(value: number): string {
  return (Math.round(value * 10) / 10).toString();
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function text(
  x: number,
  y: number,
  content: string,
  cls = "lab-text",
  anchor: "start" | "middle" | "end" = "start",
): string {
  return `<text x="${r1(x)}" y="${r1(y)}" class="${cls}" text-anchor="${anchor}">${esc(content)}</text>`;
}

export function line(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls = "lab-axis",
  extra = "",
): string {
  return `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(x2)}" y2="${r1(y2)}" class="${cls}" ${extra} />`;
}

export function rect(
  x: number,
  y: number,
  w: number,
  h: number,
  cls: string,
  extra = "",
): string {
  return `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(Math.max(0, w))}" height="${r1(Math.max(0, h))}" class="${cls}" ${extra} />`;
}

export function circle(cx: number, cy: number, r: number, cls: string, extra = ""): string {
  return `<circle cx="${r1(cx)}" cy="${r1(cy)}" r="${r1(Math.max(0, r))}" class="${cls}" ${extra} />`;
}

export function polygon(points: Array<[number, number]>, cls: string): string {
  return `<polygon points="${points.map(([x, y]) => `${r1(x)},${r1(y)}`).join(" ")}" class="${cls}" />`;
}

export function path(d: string, cls: string): string {
  return `<path d="${d}" class="${cls}" />`;
}

export function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls: string,
  width = 3,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 1) return "";
  const ux = dx / len;
  const uy = dy / len;
  const head = Math.min(12, len / 2);
  const bx = x2 - ux * head;
  const by = y2 - uy * head;
  const px = -uy * head * 0.5;
  const py = ux * head * 0.5;
  return (
    `<line x1="${r1(x1)}" y1="${r1(y1)}" x2="${r1(bx)}" y2="${r1(by)}" class="${cls}" stroke-width="${width}" stroke-linecap="round" />` +
    `<polygon points="${r1(x2)},${r1(y2)} ${r1(bx + px)},${r1(by + py)} ${r1(bx - px)},${r1(by - py)}" class="${cls} lab-arrowhead" />`
  );
}

/** A deterministic pseudo-random position in [0, 1) for particle i. */
export function jitter(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** Blue for cold, red for hot, as a CSS colour. */
export function heatColor(theta: number, min = 0, max = 100): string {
  const t = clamp((theta - min) / (max - min), 0, 1);
  const hue = 215 - 215 * t;
  return `hsl(${Math.round(hue)} 80% 55%)`;
}

export function num(r: ReadoutValues, key: string): number {
  const value = r[key];
  return typeof value === "number" ? value : Number.NaN;
}

export function str(r: ReadoutValues, key: string): string {
  const value = r[key];
  return typeof value === "string" ? value : "";
}

export const DEG = Math.PI / 180;

/** A light ray: a line with a small arrowhead in the middle, so the direction reads at a glance. */
export function ray(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls = "lab-ray",
  head = true,
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  let out = line(x1, y1, x2, y2, cls);
  if (head && len > 40) {
    const ux = dx / len;
    const uy = dy / len;
    const mx = x1 + dx * 0.55;
    const my = y1 + dy * 0.55;
    const size = 7;
    out += `<polygon points="${r1(mx + ux * size)},${r1(my + uy * size)} ${r1(mx - ux * size - uy * size * 0.6)},${r1(my - uy * size + ux * size * 0.6)} ${r1(mx - ux * size + uy * size * 0.6)},${r1(my - uy * size - ux * size * 0.6)}" class="lab-ray-head" />`;
  }
  return out;
}

/** An open curve: a path that is only stroked, never filled. */
export function stroke(d: string, cls: string, extra = ""): string {
  return `<path d="${d}" class="${cls}" fill="none" ${extra} />`;
}
