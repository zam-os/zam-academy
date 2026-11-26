/**
 * Shared SVG primitives for Politics & Society diagrams, scales, bar charts,
 * networks, cycles and interactive ExplorerFigures. Colours come from CSS
 * classes and variables in styles.css so both themes and the stage accent apply.
 */
import { esc } from "../workshop";

export const f1 = (n: number): string => (Math.round(n * 10) / 10).toString();

/** A text label with a halo so it stays readable on diagrams. */
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

export interface ExplorerPart {
  label: string;
  detail: string;
}

/** Wraps a clickable/focusable part inside an interactive ExplorerFigure SVG. */
export function expGroup(
  index: number,
  activeIndex: number,
  partLabel: string,
  body: string,
): string {
  const pressed = index === activeIndex;
  return `<g class="exp-part" data-part="${index}" tabindex="0" role="button" aria-label="${esc(partLabel)}" aria-pressed="${pressed}">${body}</g>`;
}

/** Standard SVG colour palette aligned with CSS dark/light variables. */
export const P = {
  teal: "#186477",
  amber: "#a66310",
  plum: "#7c3272",
  blue: "#1f5a92",
  green: "#1e6b4f",
  rust: "#9a4b1f",
  slate: "#37536e",
  red: "#a52a2b",
  olive: "#3d6b26",
} as const;

/** A horizontal bar row at exact proportional scale. */
export function barRow(
  x: number,
  y: number,
  w: number,
  ratio: number,
  fill: string,
  titleText: string,
  valueText: string,
): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  return `${label(x, y - 6, titleText, "lbl tiny strong", "start")}
    ${label(x + w, y - 6, valueText, "lbl tiny strong", "end")}
    <rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="12" rx="6" fill="var(--line)" opacity="0.55"/>
    <rect x="${f1(x)}" y="${f1(y)}" width="${f1(Math.max(4, w * clamped))}" height="12" rx="6" fill="${fill}"/>`;
}

export interface Card {
  head: string;
  body: string;
  colour: string;
}

/** A clean interactive grid of 2–4 clickable cards inside an SVG ExplorerFigure. */
export function explorerCards(
  title: string,
  items: Array<Card & { detail: string }>,
  activeIndex: number,
  cols = 2,
  width = 640,
): { svg: string; parts: ExplorerPart[] } {
  const vw = cols >= 3 && width === 640 ? 780 : width;
  const gap = 14;
  const w = (vw - 20 - gap * (cols - 1)) / cols;
  const maxLines = Math.max(...items.map((item) => item.body.split("\n").length));
  const h = 54 + maxLines * 17;
  const rows = Math.ceil(items.length / cols);
  const height = 20 + rows * (h + gap) - gap;
  const body = items
    .map((item, i) => {
      const x = 10 + (i % cols) * (w + gap);
      const y = 10 + Math.floor(i / cols) * (h + gap);
      return expGroup(
        i,
        activeIndex,
        item.head,
        `<rect class="exp-frame panel-bg" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/>
         <rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="30" rx="10" fill="${item.colour}"/>
         ${label(x + 12, y + 20, item.head, "lbl small on-dark", "start")}
         ${labels(x + 12, y + 48, item.body, "lbl tiny", "start", 16)}`,
      );
    })
    .join("");
  return {
    svg: svg(vw, height, title, body),
    parts: items.map((item) => ({ label: item.head, detail: item.detail })),
  };
}

/** An interactive 3- or 4-step process flow where each box can be clicked. */
export function explorerChain(
  title: string,
  steps: Array<Card & { detail: string }>,
  activeIndex: number,
  width = 640,
): { svg: string; parts: ExplorerPart[] } {
  const cols = steps.length <= 3 ? steps.length : 2;
  const vw = cols >= 3 && width === 640 ? 780 : width;
  const gap = 26;
  const rowGap = 30;
  const w = (vw - 20 - gap * (cols - 1)) / cols;
  const maxLines = Math.max(...steps.map((s) => s.body.split("\n").length));
  const h = 48 + maxLines * 16;
  const rows = Math.ceil(steps.length / cols);
  const height = 20 + rows * (h + rowGap) - (rowGap - 8);
  const body = steps
    .map((step, i) => {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = 10 + col * (w + gap);
      const y = 10 + row * (h + rowGap);
      let next = "";
      if (i < steps.length - 1) {
        if (col < cols - 1) {
          next = arrow(x + w + 3, y + h / 2, x + w + gap - 3, y + h / 2);
        } else {
          const xFrom = x + w / 2;
          const xTo = 10 + w / 2;
          const yTop = y + h + 2;
          const midY = y + h + rowGap / 2 - 2;
          const yNext = 10 + (row + 1) * (h + rowGap);
          next = `<g class="arrow"><polyline points="${f1(xFrom)},${f1(yTop)} ${f1(xFrom)},${f1(midY)} ${f1(xTo)},${f1(midY)}" fill="none"/></g>${arrow(xTo, midY, xTo, yNext - 2)}`;
        }
      }
      return `${expGroup(
        i,
        activeIndex,
        step.head,
        `<rect class="exp-frame panel-bg" x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="12"/>
         <rect x="${f1(x)}" y="${f1(y)}" width="8" height="${f1(h)}" rx="4" fill="${step.colour}"/>
         ${label(x + 18, y + 22, step.head, "lbl small strong", "start")}
         ${labels(x + 18, y + 42, step.body, "lbl tiny", "start", 15)}`,
      )}${next}`;
    })
    .join("");
  return {
    svg: svg(vw, height, title, body),
    parts: steps.map((s) => ({ label: s.head, detail: s.detail })),
  };
}

/** Two-column comparison with clickable/focusable columns. */
export function explorerCompare(
  title: string,
  sides: Array<{ head: string; colour: string; points: string[]; detail: string }>,
  activeIndex: number,
  width = 640,
): { svg: string; parts: ExplorerPart[] } {
  const n = Math.max(...sides.map((s) => s.points.length));
  const height = 68 + n * 24;
  const colW = (width - 28) / 2;
  const body = sides
    .slice(0, 2)
    .map((side, i) => {
      const x = 10 + i * (colW + 8);
      return expGroup(
        i,
        activeIndex,
        side.head,
        `<rect class="exp-frame panel-bg" x="${f1(x)}" y="10" width="${f1(colW)}" height="${f1(height - 20)}" rx="12"/>
         <rect x="${f1(x)}" y="10" width="${f1(colW)}" height="32" rx="10" fill="${side.colour}"/>
         ${label(x + 12, 31, side.head, "lbl small on-dark", "start")}
         ${side.points.map((p, idx) => label(x + 14, 64 + idx * 24, `• ${p}`, "lbl tiny", "start")).join("")}`,
      );
    })
    .join("");
  return {
    svg: svg(width, height, title, body),
    parts: sides.slice(0, 2).map((s) => ({ label: s.head, detail: s.detail })),
  };
}
