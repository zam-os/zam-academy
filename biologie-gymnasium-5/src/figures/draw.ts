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

export interface Card {
  head: string;
  /** Lines separated by "\n". */
  body: string;
  colour: string;
  icon?: string;
}

/** A grid of coloured cards; the height grows with the longest body. */
export function cardGrid(
  title: string,
  items: Card[],
  cols = 3,
  width = 600,
): string {
  const gap = 10;
  const w = (width - 16 - gap * (cols - 1)) / cols;
  const lines = Math.max(...items.map((item) => item.body.split("\n").length));
  const h = 46 + lines * 16;
  const rows = Math.ceil(items.length / cols);
  const height = 16 + rows * (h + gap);
  return svg(
    width,
    height,
    title,
    items
      .map((item, i) => {
        const x = 8 + (i % cols) * (w + gap);
        const y = 8 + Math.floor(i / cols) * (h + gap);
        return `${panel(x, y, w, h, "panel-bg")}<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="28" rx="10" fill="${item.colour}"/>${label(x + 12, y + 19, `${item.icon ? `${item.icon} ` : ""}${item.head}`, "lbl small on-dark", "start")}${labels(x + 12, y + 46, item.body, "lbl tiny", "start", 16)}`;
      })
      .join(""),
  );
}

/** Boxes joined by arrows, left to right, wrapping after `perRow`. */
export function chain(
  title: string,
  steps: Card[],
  perRow = 4,
  width = 640,
): string {
  const gap = 26;
  const w = (width - 16 - gap * (perRow - 1)) / perRow;
  const lines = Math.max(...steps.map((step) => step.body.split("\n").length));
  const h = 40 + lines * 15;
  const rows = Math.ceil(steps.length / perRow);
  const height = 16 + rows * (h + 22);
  return svg(
    width,
    height,
    title,
    steps
      .map((step, i) => {
        const row = Math.floor(i / perRow);
        const col = i % perRow;
        const x = 8 + col * (w + gap);
        const y = 8 + row * (h + 22);
        const next =
          i < steps.length - 1
            ? col < perRow - 1
              ? arrow(x + w + 3, y + h / 2, x + w + gap - 3, y + h / 2)
              : arrow(x + w / 2, y + h + 2, x + w / 2, y + h + 20)
            : "";
        return `${panel(x, y, w, h, "panel-bg")}<rect x="${f1(x)}" y="${f1(y)}" width="8" height="${f1(h)}" rx="4" fill="${step.colour}"/>${label(x + 16, y + 20, `${step.icon ? `${step.icon} ` : ""}${step.head}`, "lbl small strong", "start")}${labels(x + 16, y + 38, step.body, "lbl tiny", "start", 15)}${next}`;
      })
      .join(""),
  );
}

/** Two columns that compare two things point by point. */
export function compare(
  title: string,
  left: { head: string; colour: string; points: string[] },
  right: { head: string; colour: string; points: string[] },
  width = 600,
): string {
  const n = Math.max(left.points.length, right.points.length);
  const height = 60 + n * 22;
  const col = (x: number, side: typeof left) =>
    `${panel(x, 8, width / 2 - 14, height - 16, "panel-bg")}<rect x="${f1(x)}" y="8" width="${f1(width / 2 - 14)}" height="30" rx="10" fill="${side.colour}"/>${label(x + 12, 28, side.head, "lbl small on-dark", "start")}${side.points.map((p, i) => label(x + 14, 60 + i * 22, `• ${p}`, "lbl tiny", "start")).join("")}`;
  return svg(width, height, title, `${col(8, left)}${col(width / 2 + 6, right)}`);
}
