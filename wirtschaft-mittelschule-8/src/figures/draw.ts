import { esc } from "../workshop";

export interface FigurePart {
  label: string;
  note: string;
}

export interface ConceptFigure {
  title: string;
  question: string;
  alt: string;
  caption: string;
  parts: [FigurePart, FigurePart, FigurePart];
  draw: () => string;
}

export const label = (
  x: number,
  y: number,
  text: string,
  cls = "",
  anchor: "start" | "middle" | "end" = "middle",
): string =>
  `<text x="${x}" y="${y}" class="visual-label${cls ? ` ${cls}` : ""}" text-anchor="${anchor}">${esc(text)}</text>`;

export const lines = (
  x: number,
  y: number,
  text: string,
  cls = "small",
  anchor: "start" | "middle" | "end" = "middle",
  dy = 19,
): string =>
  `<text x="${x}" y="${y}" class="visual-label${cls ? ` ${cls}` : ""}" text-anchor="${anchor}">${text
    .split("\n")
    .map((line, i) => `<tspan x="${x}" dy="${i ? dy : 0}">${esc(line)}</tspan>`)
    .join("")}</text>`;

export const group = (part: 1 | 2 | 3, body: string): string =>
  `<g class="visual-part" data-part="${part}">${body}</g>`;

export const card = (
  x: number,
  y: number,
  w: number,
  h: number,
  cls = "v-panel",
  rx = 14,
): string => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" class="${cls}"/>`;

export const badge = (x: number, y: number, n: 1 | 2 | 3): string =>
  `<g class="visual-number"><circle cx="${x}" cy="${y}" r="13"/><text x="${x}" y="${y + 5}" text-anchor="middle">${n}</text></g>`;

export const pill = (
  x: number,
  y: number,
  w: number,
  h: number,
  text: string,
  cls = "v-pill",
  textCls = "small",
): string =>
  `${card(x, y, w, h, cls, h / 2)}${label(x + w / 2, y + h / 2 + 4.5, text, textCls)}`;

export function arrow(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  cls = "v-arrow",
): string {
  const a = Math.atan2(y2 - y1, x2 - x1);
  const size = 9;
  const p1x = Math.round((x2 - size * Math.cos(a - 0.5)) * 10) / 10;
  const p1y = Math.round((y2 - size * Math.sin(a - 0.5)) * 10) / 10;
  const p2x = Math.round((x2 - size * Math.cos(a + 0.5)) * 10) / 10;
  const p2y = Math.round((y2 - size * Math.sin(a + 0.5)) * 10) / 10;
  return `<g class="${cls}"><line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"/><polygon class="v-arrow-head" points="${x2},${y2} ${p1x},${p1y} ${p2x},${p2y}"/></g>`;
}

/** Stack of euro coins plus a banknote. */
export const coins = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-34" y="-8" width="50" height="28" rx="4" class="v-green"/><circle cx="-9" cy="6" r="7" class="v-paper-thin"/><ellipse cx="20" cy="18" rx="16" ry="5" class="v-gold"/><rect x="4" y="10" width="32" height="8" class="v-gold"/><ellipse cx="20" cy="10" rx="16" ry="5" class="v-gold-light"/><rect x="4" y="2" width="32" height="8" class="v-gold"/><ellipse cx="20" cy="2" rx="16" ry="5" class="v-gold-light"/><text x="20" y="6" text-anchor="middle" class="visual-label micro">€</text></g>`;

/** Market stall / school kiosk icon. */
export const stall = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><polygon points="-36,-10 36,-10 30,-26 -30,-26" class="v-coral"/><rect x="-32" y="-10" width="64" height="10" class="v-paper-thin"/><line x1="-26" y1="0" x2="-26" y2="24" class="v-outline-thick"/><line x1="26" y1="0" x2="26" y2="24" class="v-outline-thick"/><rect x="-34" y="12" width="68" height="14" rx="3" class="v-gold-fill"/><circle cx="-12" cy="6" r="5" class="v-green"/><circle cx="0" cy="6" r="5" class="v-orange"/><circle cx="12" cy="6" r="5" class="v-blue"/></g>`;

/** Workshop / business building icon. */
export const factory = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 24V-12L-14-28V-12L12-28V-12L40-28V24Z" class="v-paper"/><path d="M-40-12L-14-28L12-12L40-28" class="v-accent-stroke"/><rect x="-30" y="2" width="14" height="10" rx="2" class="v-blue"/><rect x="-8" y="2" width="14" height="10" rx="2" class="v-blue"/><rect x="14" y="0" width="18" height="24" rx="2" class="v-teal"/><rect x="28" y="-36" width="8" height="12" class="v-muted-fill"/></g>`;

/** Document sheet (Leittext / Portfolio / Beleg) with ruled rows. */
export const sheetDoc = (
  x: number,
  y: number,
  w: number,
  h: number,
  header: string,
  rows: string[] = [],
): string => {
  const compact = h <= 86;
  const startY = compact ? y + 36 : y + 40;
  const rowStep = compact ? 16 : 19;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="v-paper"/><rect x="${x}" y="${y}" width="${w}" height="22" rx="7" class="v-soft-fill"/>${label(x + w / 2, y + 15, header, "micro")}${rows
    .map((r, i) => label(x + 10, startY + i * rowStep, r, "micro", "start"))
    .join("")}</g>`;
};

/** Protective shield for JArbSchG and worker protection. */
export const shield = (x: number, y: number, s = 1, cls = "v-green"): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0-26L22-17V2C22 17 11 26 0 30C-11 26-22 17-22 2V-17Z" class="${cls}"/><path d="M-8 2l6 6 11-12" class="v-check-line"/></g>`;

/** Minimal stylized person silhouette. */
export const person = (x: number, y: number, cls = "v-blue"): string =>
  `<g transform="translate(${x} ${y})"><circle cx="0" cy="-22" r="8.5" class="${cls}"/><path d="M-13 6c0-10 6-16 13-16s13 6 13 16z" class="${cls}"/></g>`;

/** Clock face for working hours and holiday break rules. */
export const clockIcon = (x: number, y: number, r = 22): string =>
  `<g transform="translate(${x} ${y})"><circle cx="0" cy="0" r="${r}" class="v-paper"/><line x1="0" y1="0" x2="0" y2="${-r * 0.58}" class="v-outline-thick"/><line x1="0" y1="0" x2="${r * 0.52}" y2="0" class="v-accent-stroke"/><circle cx="0" cy="0" r="2.5" class="v-ink-fill"/></g>`;

/** Gear for technical production means. */
export const gear = (x: number, y: number, r = 18, cls = "v-blue"): string => {
  const teeth = Array.from({ length: 8 }, (_, i) => {
    const a = (i * Math.PI) / 4;
    const cx = Math.round((Math.cos(a) * r) * 10) / 10;
    const cy = Math.round((Math.sin(a) * r) * 10) / 10;
    return `<circle cx="${cx}" cy="${cy}" r="${Math.round(r * 0.28 * 10) / 10}" class="${cls}"/>`;
  }).join("");
  return `<g transform="translate(${x} ${y})">${teeth}<circle cx="0" cy="0" r="${r}" class="${cls}"/><circle cx="0" cy="0" r="${Math.round(r * 0.38 * 10) / 10}" class="v-paper"/></g>`;
};

/** Small labelled bar for figures: value of max over a given width. */
export const miniBar = (
  x: number,
  y: number,
  w: number,
  value: number,
  max: number,
  cls: string,
  text: string,
): string => {
  const bw = Math.max(2, Math.round((Math.min(value, max) / max) * w * 10) / 10);
  return `<rect x="${x}" y="${y}" width="${w}" height="16" rx="4" class="v-soft-fill"/><rect x="${x}" y="${y}" width="${bw}" height="16" rx="4" class="${cls}"/>${label(x + w + 6, y + 12, text, "micro", "start")}`;
};

/** Check or cross line for rule figures. */
export const checkLine = (x: number, y: number, text: string, ok: boolean): string =>
  `<circle cx="${x + 8}" cy="${y - 4}" r="8" class="${ok ? "v-green" : "v-coral"}"/>${label(x + 8, y, ok ? "✓" : "✗", "micro")}${label(x + 22, y, text, "micro", "start")}`;

/**
 * Three-panel layout shared by all concept figures: each panel gets a card, a
 * numbered badge and a heading; the body function draws inside x0 … x0 + 224.
 */
export function triptych(panels: Array<[string, (x0: number) => string]>): string {
  const xs = [14, 268, 522];
  return panels
    .map(([heading, body], i) => {
      const x0 = xs[i];
      const n = (i + 1) as 1 | 2 | 3;
      const join = i < 2 ? arrow(x0 + 228, 134, x0 + 250, 134) : "";
      return `${group(n, `${card(x0, 16, 224, 238)}${badge(x0 + 22, 38, n)}${label(x0 + 42, 43, heading, "heading", "start")}${body(x0)}`)}${join}`;
    })
    .join("");
}

/** Home / household appliance icon. */
export const house = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-28" y="-12" width="56" height="42" rx="3" class="v-paper"/><polygon points="-34,-11 0,-38 34,-11" class="v-coral"/><rect x="-18" y="-2" width="12" height="12" rx="2" class="v-blue"/><rect x="6" y="-2" width="12" height="12" rx="2" class="v-blue"/><rect x="-6" y="14" width="12" height="16" rx="2" class="v-gold"/></g>`;

/** Inline step icons shown next to panel eyebrows (purely decorative). */
const icon = (shapes: string): string =>
  `<svg class="step-svg" viewBox="0 0 20 20" aria-hidden="true">${shapes}</svg>`;

export const STEP_ICONS = {
  understand: icon(
    `<path d="M2.5 4.5C5 3.5 7.5 3.5 10 5c2.5-1.5 5-1.5 7.5-.5v11c-2.5-1-5-1-7.5.5-2.5-1.5-5-1.5-7.5-.5zM10 5v11"/>`,
  ),
  figure: icon(
    `<rect x="2.5" y="3.5" width="15" height="13" rx="2.5"/><path d="M5 13.5l3.5-4 3 3 2.2-2.2L15.5 13.5"/><circle cx="7" cy="7.5" r="1.3" class="solid"/>`,
  ),
  lab: icon(
    `<path d="M3 5.5h8M14 5.5h3M3 10h2M8 10h9M3 14.5h9M15 14.5h2"/><circle cx="12.5" cy="5.5" r="1.6"/><circle cx="6.5" cy="10" r="1.6"/><circle cx="13.5" cy="14.5" r="1.6"/>`,
  ),
  quiz: icon(
    `<circle cx="10" cy="10" r="7.5"/><path d="M7.8 7.8a2.3 2.3 0 1 1 3.3 2c-.7.4-1.1.9-1.1 1.7"/><circle cx="10" cy="14" r="0.8" class="solid"/>`,
  ),
  workshop: icon(
    `<rect x="2.5" y="3.5" width="6" height="5.5" rx="1.2"/><rect x="11.5" y="3.5" width="6" height="5.5" rx="1.2"/><rect x="2.5" y="11" width="6" height="5.5" rx="1.2"/><path d="M11.5 13.8h5.5M14.5 11.3l2.5 2.5-2.5 2.5"/>`,
  ),
  practice: icon(
    `<rect x="3.5" y="2.5" width="13" height="15" rx="2"/><path d="M6.5 6h7"/><circle cx="7" cy="10" r="0.8" class="solid"/><circle cx="10" cy="10" r="0.8" class="solid"/><circle cx="13" cy="10" r="0.8" class="solid"/><circle cx="7" cy="13.5" r="0.8" class="solid"/><circle cx="10" cy="13.5" r="0.8" class="solid"/><circle cx="13" cy="13.5" r="0.8" class="solid"/>`,
  ),
  writing: icon(
    `<path d="M3.5 16.5l.8-3.5L13.5 3.8a1.7 1.7 0 0 1 2.4 0l.3.3a1.7 1.7 0 0 1 0 2.4L7 15.7zM12 5.3l2.7 2.7"/>`,
  ),
} as const;

/** Stage icon for each of the 5 Lernbereiche in the sidebar navigation. */
export function stageIcon(lb: number): string {
  const s = (shapes: string) =>
    `<svg class="stage-svg" viewBox="0 0 20 20" aria-hidden="true">${shapes}</svg>`;
  switch (lb) {
    case 1:
      return s(
        `<rect x="3.5" y="3.5" width="13" height="13" rx="2"/><path d="M6.5 8l1.5 1.5 2.5-2.5M11.5 8.5h2M6.5 12.5h7"/>`,
      );
    case 2:
      return s(
        `<circle cx="10" cy="10" r="6.5"/><polygon points="10,5.5 12,10 10,14.5 8,10" class="solid"/>`,
      );
    case 3:
      return s(`<path d="M3 15.5h14M5 15.5V10M10 15.5V7M15 15.5V5"/>`);
    case 4:
      return s(
        `<path d="M10 3l6 2.5v4.5c0 4-2.5 6-6 7-3.5-1-6-3-6-7V5.5z"/><path d="M7.5 10.2l1.8 1.8 3.2-3.5"/>`,
      );
    default:
      return s(
        `<circle cx="10" cy="10" r="3"/><path d="M10 3.5v2M10 14.5v2M3.5 10h2M14.5 10h2M5.4 5.4l1.4 1.4M13.2 13.2l1.4 1.4M14.6 5.4l-1.4 1.4M6.8 13.2l-1.4 1.4"/>`,
      );
  }
}

/** Compact thematic illustration shown in the sidebar for the active Lernbereich. */
export function renderStageArt(lb: number): string {
  let body = "";
  switch (lb) {
    case 1:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${stall(64, 52, 0.9)}${arrow(106, 52, 130, 52)}${sheetDoc(136, 8, 96, 80, "Leittext", ["Informieren", "Entscheiden", "Bewerten"])}${pill(244, 22, 64, 24, "Puffer", "v-gold-fill", "micro")}${pill(244, 54, 64, 24, "Meilenstein", "v-teal-fill", "micro")}`;
      break;
    case 2:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${person(46, 64, "v-orange")}${sheetDoc(80, 8, 92, 80, "Bewerbung", ["Anschreiben", "Lebenslauf", "Zeugnisse"])}${arrow(178, 48, 200, 48)}${factory(250, 56, 0.8)}${label(250, 88, "Praktikum", "micro")}`;
      break;
    case 3:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${coins(54, 54, 0.9)}${pill(104, 20, 92, 24, "Erträge", "v-green-fill", "micro")}${pill(104, 52, 92, 24, "Aufwendungen", "v-orange-fill", "micro")}${arrow(204, 48, 226, 48)}${pill(232, 34, 78, 28, "Gewinn", "v-purple-fill", "micro")}`;
      break;
    case 4:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${shield(56, 48, 0.9, "v-coral")}${clockIcon(140, 48, 24)}${pill(182, 20, 126, 24, "7 Std. · 35 Std.", "v-gold-fill", "micro")}${pill(182, 52, 126, 24, "6 bis 20 Uhr · 5 Tage", "v-teal-fill", "micro")}`;
      break;
    default:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${gear(56, 48, 20, "v-blue")}${factory(140, 56, 0.85)}${pill(198, 20, 110, 24, "80 / 85 dB(A)", "v-gold-fill", "micro")}${pill(198, 52, 110, 24, "Ergonomie", "v-green-fill", "micro")}`;
      break;
  }
  return `<div class="stage-art" aria-hidden="true"><svg viewBox="0 0 320 96" focusable="false">${body}</svg></div>`;
}
