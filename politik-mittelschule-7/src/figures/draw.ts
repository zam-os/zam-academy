/**
 * Small SVG helpers shared by the maps and the drawn scenes. Every colour is
 * a CSS class (see the figure block in styles.css), so both themes and the
 * accent of the Lernbereich apply without changing the drawings.
 */
import { esc } from "../workshop";

export const f1 = (n: number): string => (Math.round(n * 10) / 10).toString();

/** A text label with a halo so it stays readable on maps and scenes. */
export function label(
  x: number,
  y: number,
  text: string,
  cls = "lbl",
  anchor: "start" | "middle" | "end" = "middle",
): string {
  return `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${esc(text)}</text>`;
}

/** Multi-line label; lines are separated by "\n". */
export function labels(
  x: number,
  y: number,
  text: string,
  cls = "lbl",
  anchor: "start" | "middle" | "end" = "middle",
  lineHeight = 15,
): string {
  return `<text class="${cls}" x="${f1(x)}" y="${f1(y)}" text-anchor="${anchor}">${text
    .split("\n")
    .map(
      (line, i) =>
        `<tspan x="${f1(x)}" dy="${i === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`,
    )
    .join("")}</text>`;
}

/** A numbered map marker; the workshop asks what the number shows. */
export function marker(x: number, y: number, n: number | string): string {
  return `<g class="marker"><circle cx="${f1(x)}" cy="${f1(y)}" r="11"/><text x="${f1(x)}" y="${f1(y + 4.5)}" text-anchor="middle">${esc(String(n))}</text></g>`;
}

export function dot(x: number, y: number, cls = "city"): string {
  return `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="4.5"/>`;
}

export function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls = "arrow",
): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const h = 9;
  const p1 = [x2 - h * Math.cos(a - 0.45), y2 - h * Math.sin(a - 0.45)];
  const p2 = [x2 - h * Math.cos(a + 0.45), y2 - h * Math.sin(a + 0.45)];
  return `<g class="${cls}"><line x1="${f1(x1)}" y1="${f1(y1)}" x2="${f1(x2)}" y2="${f1(y2)}"/><path d="M${f1(x2)} ${f1(y2)}L${f1(p1[0])} ${f1(p1[1])}L${f1(p2[0])} ${f1(p2[1])}Z"/></g>`;
}

/**
 * A simple person: head and body. `cls` colours the clothes; `arms` raises
 * one arm (voting, waving) or holds it down.
 */
export function person(
  x: number,
  y: number,
  s = 1,
  cls = "cloth-a",
  arms: "down" | "up" | "out" = "down",
): string {
  const head = `<circle class="skin" cx="${f1(x)}" cy="${f1(y - 34 * s)}" r="${f1(7 * s)}"/>`;
  const body = `<path class="${cls}" d="M${f1(x - 9 * s)} ${f1(y)}L${f1(x - 7 * s)} ${f1(y - 24 * s)}Q${f1(x)} ${f1(y - 29 * s)} ${f1(x + 7 * s)} ${f1(y - 24 * s)}L${f1(x + 9 * s)} ${f1(y)}Z"/>`;
  const arm =
    arms === "up"
      ? `<line class="limb" x1="${f1(x + 6 * s)}" y1="${f1(y - 22 * s)}" x2="${f1(x + 12 * s)}" y2="${f1(y - 44 * s)}"/>`
      : arms === "out"
        ? `<line class="limb" x1="${f1(x + 6 * s)}" y1="${f1(y - 21 * s)}" x2="${f1(x + 18 * s)}" y2="${f1(y - 16 * s)}"/>`
        : "";
  return `<g class="person">${body}${head}${arm}</g>`;
}

export function svg(
  width: number,
  height: number,
  title: string,
  body: string,
): string {
  // Narrow maps would otherwise grow to the full column with huge labels.
  return `<svg class="figure-svg" viewBox="0 0 ${width} ${height}" style="max-width:${Math.round(width * 1.35)}px" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

/** A rounded panel for scenes that compare two or more parts. */
export function panel(
  x: number,
  y: number,
  w: number,
  h: number,
  cls = "panel-bg",
): string {
  return `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="14"/>`;
}
