/**
 * Shared SVG primitives for historical maps, cross-sections, timelines and
 * comparison diagrams. Colours come from CSS classes and variables in
 * styles.css so both themes and the Lernbereich accent apply automatically.
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

/** A numbered map or diagram marker. */
export function marker(x: number, y: number, n: number | string): string {
  return `<g class="marker"><circle cx="${f1(x)}" cy="${f1(y)}" r="11"/><text x="${f1(x)}" y="${f1(y + 4.5)}" text-anchor="middle">${esc(String(n))}</text></g>`;
}

export function dot(x: number, y: number, cls = "city", r = 4.5): string {
  return `<circle class="${cls}" cx="${f1(x)}" cy="${f1(y)}" r="${f1(r)}"/>`;
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

/** Simple person figure; `arms` controls posture (down, up, out). */
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
  return `<svg class="figure-svg" viewBox="0 0 ${width} ${height}" style="max-width:${Math.round(width * 1.35)}px" role="img" aria-label="${esc(title)}" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
}

export function panel(
  x: number,
  y: number,
  w: number,
  h: number,
  cls = "panel-bg",
): string {
  return `<rect class="${cls}" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="14"/>`;
}

export function badgePill(
  x: number,
  y: number,
  w: number,
  text: string,
  fill = "var(--accent)",
): string {
  return `<rect x="${f1(x - w / 2)}" y="${f1(y - 14)}" width="${f1(w)}" height="22" rx="11" fill="${fill}"/><text class="lbl tiny on-dark strong" x="${f1(x)}" y="${f1(y + 1)}" text-anchor="middle">${esc(text)}</text>`;
}

/** Classical Greek or Roman column with base, fluted shaft and capital. */
export function column(
  x: number,
  y: number,
  h = 72,
  style: "doric" | "ionic" | "corinthian" = "doric",
): string {
  const topY = y - h;
  const cap =
    style === "doric"
      ? `<rect class="column" x="${f1(x - 10)}" y="${f1(topY)}" width="20" height="7" rx="1"/>`
      : style === "ionic"
        ? `<rect class="column" x="${f1(x - 10)}" y="${f1(topY)}" width="20" height="6" rx="1"/><circle class="column" cx="${f1(x - 9)}" cy="${f1(topY + 5)}" r="4"/><circle class="column" cx="${f1(x + 9)}" cy="${f1(topY + 5)}" r="4"/>`
        : `<path class="column" d="M${f1(x - 11)} ${f1(topY)}h22l-4 10h-14z"/>`;
  return `<g><rect class="column" x="${f1(x - 6)}" y="${f1(topY + 6)}" width="12" height="${f1(h - 10)}"/><rect class="column" x="${f1(x - 9)}" y="${f1(y - 5)}" width="18" height="5" rx="1"/>${cap}</g>`;
}

/** Imperial crown or laurel-framed badge for rulership diagrams. */
export function crown(x: number, y: number, s = 1): string {
  return `<path d="M${f1(x - 16 * s)} ${f1(y)}L${f1(x - 19 * s)} ${f1(y - 16 * s)}L${f1(x - 7 * s)} ${f1(y - 7 * s)}L${f1(x)} ${f1(y - 20 * s)}L${f1(x + 7 * s)} ${f1(y - 7 * s)}L${f1(x + 19 * s)} ${f1(y - 16 * s)}L${f1(x + 16 * s)} ${f1(y)}Z" fill="var(--f-yellow)" stroke="var(--f-ink)" stroke-width="1.5" stroke-linejoin="round"/>`;
}

/** Pyramid silhouette centered at (cx, baseY). */
export function pyramidShape(
  cx: number,
  baseY: number,
  w: number,
  h: number,
  goldCap = false,
): string {
  const half = w / 2;
  const topY = baseY - h;
  const body = `<polygon class="pyramid-stone" points="${f1(cx - half)},${f1(baseY)} ${f1(cx)},${f1(topY)} ${f1(cx + half)},${f1(baseY)}"/>`;
  if (!goldCap) return body;
  const cw = half * 0.18;
  const ch = h * 0.18;
  return `${body}<polygon class="pyramid-cap" points="${f1(cx - cw)},${f1(topY + ch)} ${f1(cx)},${f1(topY)} ${f1(cx + cw)},${f1(topY + ch)}"/>`;
}

/** Greek trireme silhouette pointing right. */
export function shipTrireme(x: number, y: number, s = 1): string {
  return `<g transform="translate(${f1(x)},${f1(y)}) scale(${s})">
    <path class="hull" d="M-46 0L-34 12H32L50 4L38 -2H-36Z" stroke="var(--f-ink)" stroke-width="1.5"/>
    <path fill="var(--f-red)" d="M44 2L56 3L46 7Z"/>
    <line stroke="var(--f-wood)" stroke-width="3" x1="-2" y1="0" x2="-2" y2="-38"/>
    <path class="sail" d="M-18 -34Q2 -26 22 -34L20 -10Q2 -6 -16 -10Z"/>
    <line stroke="var(--f-ink)" stroke-width="1.3" x1="-22" y1="8" x2="-28" y2="20"/>
    <line stroke="var(--f-ink)" stroke-width="1.3" x1="-10" y1="8" x2="-16" y2="20"/>
    <line stroke="var(--f-ink)" stroke-width="1.3" x1="2" y1="8" x2="-4" y2="20"/>
    <line stroke="var(--f-ink)" stroke-width="1.3" x1="14" y1="8" x2="8" y2="20"/>
    <line stroke="var(--f-ink)" stroke-width="1.3" x1="26" y1="8" x2="20" y2="20"/>
  </g>`;
}

/** North arrow for historical maps. */
export function northArrow(x: number, y: number): string {
  return `<g transform="translate(${f1(x)},${f1(y)})">
    <circle cx="0" cy="0" r="14" class="legend-panel"/>
    <path class="north-arrow" d="M0 -10L4 3L0 0L-4 3Z"/>
    <text class="lbl tiny strong" x="0" y="12" text-anchor="middle">N</text>
  </g>`;
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
  cols = 2,
  width = 620,
): string {
  const gap = 12;
  const w = (width - 16 - gap * (cols - 1)) / cols;
  const lines = Math.max(...items.map((item) => item.body.split("\n").length));
  const h = 48 + lines * 16;
  const rows = Math.ceil(items.length / cols);
  const height = 16 + rows * (h + gap) - gap;
  return svg(
    width,
    height,
    title,
    items
      .map((item, i) => {
        const x = 8 + (i % cols) * (w + gap);
        const y = 8 + Math.floor(i / cols) * (h + gap);
        return `${panel(x, y, w, h, "panel-bg")}<rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="30" rx="10" fill="${item.colour}"/>${label(x + 12, y + 20, `${item.icon ? `${item.icon} ` : ""}${item.head}`, "lbl small on-dark", "start")}${labels(x + 12, y + 48, item.body, "lbl tiny", "start", 16)}`;
      })
      .join(""),
  );
}

/** Boxes joined by arrows, left to right, wrapping cleanly to 2x2 when labels are wide. */
export function chain(
  title: string,
  steps: Card[],
  perRow = 4,
  width = 640,
): string {
  const maxText = Math.max(
    ...steps.flatMap((step) => [
      step.head.length + (step.icon ? 2 : 0),
      ...step.body.split("\n").map((line) => line.length),
    ]),
  );
  const cols = perRow === 4 && steps.length === 4 && maxText > 24 ? 2 : perRow;
  const gap = 26;
  const rowGap = cols === 2 && steps.length > 2 ? 32 : 24;
  const w = (width - 16 - gap * (cols - 1)) / cols;
  const lines = Math.max(...steps.map((step) => step.body.split("\n").length));
  const h = 44 + lines * 15;
  const rows = Math.ceil(steps.length / cols);
  const height = 16 + rows * (h + rowGap) - (rowGap - 6);
  return svg(
    width,
    height,
    title,
    steps
      .map((step, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        const x = 8 + col * (w + gap);
        const y = 8 + row * (h + rowGap);
        let next = "";
        if (i < steps.length - 1) {
          if (col < cols - 1) {
            next = arrow(x + w + 3, y + h / 2, x + w + gap - 3, y + h / 2);
          } else if (cols === 2) {
            const xFrom = x + w / 2;
            const xTo = 8 + w / 2;
            const yTop = y + h + 2;
            const midY = y + h + rowGap / 2 - 2;
            const yNext = 8 + (row + 1) * (h + rowGap);
            next = `<g class="arrow"><polyline points="${f1(xFrom)},${f1(yTop)} ${f1(xFrom)},${f1(midY)} ${f1(xTo)},${f1(midY)}" fill="none"/></g>${arrow(xTo, midY, xTo, yNext - 2)}`;
          } else {
            next = arrow(x + w / 2, y + h + 2, x + w / 2, y + h + 20);
          }
        }
        return `${panel(x, y, w, h, "panel-bg")}<rect x="${f1(x)}" y="${f1(y)}" width="8" height="${f1(h)}" rx="4" fill="${step.colour}"/>${label(x + 16, y + 21, `${step.icon ? `${itemIcon(step.icon)}` : ""}${step.head}`, "lbl small strong", "start")}${labels(x + 16, y + 40, step.body, "lbl tiny", "start", 15)}${next}`;
      })
      .join(""),
  );
}

function itemIcon(icon: string): string {
  return `${icon} `;
}

/** Two columns that compare two things point by point. */
export function compare(
  title: string,
  left: { head: string; colour: string; points: string[] },
  right: { head: string; colour: string; points: string[] },
  width = 620,
): string {
  const n = Math.max(left.points.length, right.points.length);
  const height = 64 + n * 24;
  const col = (x: number, side: typeof left) =>
    `${panel(x, 8, width / 2 - 14, height - 16, "panel-bg")}<rect x="${f1(x)}" y="8" width="${f1(width / 2 - 14)}" height="32" rx="10" fill="${side.colour}"/>${label(x + 12, 29, side.head, "lbl small on-dark", "start")}${side.points.map((p, i) => label(x + 14, 62 + i * 24, `• ${p}`, "lbl tiny", "start")).join("")}`;
  return svg(width, height, title, `${col(8, left)}${col(width / 2 + 6, right)}`);
}
