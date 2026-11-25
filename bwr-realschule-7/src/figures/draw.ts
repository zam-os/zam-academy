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
  dy = 18,
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
  `${card(x, y, w, h, cls, h / 2)}${label(x + w / 2, y + h / 2 + 5, text, textCls)}`;

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

/** Family home icon for Haushalt / Familie Weber. */
export const house = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-28" y="-12" width="56" height="42" rx="3" class="v-paper"/><polygon points="-34,-11 0,-38 34,-11" class="v-coral"/><rect x="-18" y="-2" width="12" height="12" rx="2" class="v-blue"/><rect x="6" y="-2" width="12" height="12" rx="2" class="v-blue"/><rect x="-6" y="14" width="12" height="16" rx="2" class="v-gold"/></g>`;

/** Radwerk Brenner factory building with sawtooth shed roof. */
export const factory = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M-40 24V-12L-14-28V-12L12-28V-12L40-28V24Z" class="v-paper"/><path d="M-40-12L-14-28L12-12L40-28" class="v-accent-stroke"/><rect x="-30" y="2" width="14" height="10" rx="2" class="v-blue"/><rect x="-8" y="2" width="14" height="10" rx="2" class="v-blue"/><rect x="14" y="0" width="18" height="24" rx="2" class="v-teal"/><rect x="28" y="-36" width="8" height="12" class="v-muted-fill"/></g>`;

/** Stylized youth bicycle produced at Radwerk Brenner. */
export const bike = (x: number, y: number, s = 1): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><circle cx="-26" cy="14" r="15" class="v-wheel"/><circle cx="26" cy="14" r="15" class="v-wheel"/><circle cx="-26" cy="14" r="2.5" class="v-ink-fill"/><circle cx="26" cy="14" r="2.5" class="v-ink-fill"/><path d="M-26 14L-4 14L14-6L-12-6ZM-4 14L-14-12M14-6L26 14M14-6L10-16" class="v-bike-frame"/><path d="M-19-13h11M5-16h11" class="v-bike-bar"/><circle cx="-4" cy="14" r="5" class="v-gold"/></g>`;

/** Document sheet (Beleg / Bilanz / Inventar) with ruled rows. */
export const receiptDoc = (
  x: number,
  y: number,
  w: number,
  h: number,
  header: string,
  rows: string[] = [],
): string =>
  `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" class="v-paper"/><rect x="${x}" y="${y}" width="${w}" height="22" rx="7" class="v-soft-fill"/>${label(x + w / 2, y + 15, header, "micro")}${rows
    .map((r, i) => label(x + 10, y + 39 + i * 18, r, "micro", "start"))
    .join("")}</g>`;

/** Balance scale beam with two hanging pans. */
export const scaleBeam = (cx: number, cy: number, span = 180): string => {
  const half = span / 2;
  return `<g><line x1="${cx}" y1="${cy}" x2="${cx}" y2="${cy + 56}" class="v-outline-thick"/><rect x="${cx - 26}" y="${cy + 54}" width="52" height="8" rx="4" class="v-accent-solid"/><line x1="${cx - half}" y1="${cy + 6}" x2="${cx + half}" y2="${cy + 6}" class="v-accent-stroke"/><polygon points="${cx},${cy - 4} ${cx - 8},${cy + 8} ${cx + 8},${cy + 8}" class="v-accent-solid"/><path d="M${cx - half} ${cy + 6}l-14 30h28zM${cx + half} ${cy + 6}l-14 30h28z" class="v-pan-line"/><path d="M${cx - half - 22} ${cy + 36}q22 14 44 0z" class="v-blue"/><path d="M${cx + half - 22} ${cy + 36}q22 14 44 0z" class="v-teal"/></g>`;
};

/** Visual T-account box with Soll | Title | Haben layout. */
export const tAccountBox = (
  x: number,
  y: number,
  w: number,
  h: number,
  title: string,
  soll: string[],
  haben: string[],
  cls = "v-paper",
): string => {
  const mid = x + w / 2;
  return `<g>${card(x, y, w, h, cls, 10)}${label(x + 8, y + 18, "S", "micro", "start")}${label(mid, y + 18, title, "small")}${label(x + w - 8, y + 18, "H", "micro", "end")}<line x1="${x + 8}" y1="${y + 26}" x2="${x + w - 8}" y2="${y + 26}" class="v-outline-thick"/><line x1="${mid}" y1="${y + 26}" x2="${mid}" y2="${y + h - 8}" class="v-outline-thick"/>${soll
    .map((line, i) => label(x + 10, y + 44 + i * 17, line, "micro", "start"))
    .join("")}${haben
    .map((line, i) => label(x + w - 10, y + 44 + i * 17, line, "micro", "end"))
    .join("")}</g>`;
};

/** Protective shield for liability, consumer rights, or GoB checks. */
export const shield = (x: number, y: number, s = 1, cls = "v-green"): string =>
  `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0-26L22-17V2C22 17 11 26 0 30C-11 26-22 17-22 2V-17Z" class="${cls}"/><path d="M-8 2l6 6 11-12" class="v-check-line"/></g>`;

/** Minimal stylized person silhouette. */
export const person = (x: number, y: number, cls = "v-blue"): string =>
  `<g transform="translate(${x} ${y})"><circle cx="0" cy="-22" r="8.5" class="${cls}"/><path d="M-13 6c0-10 6-16 13-16s13 6 13 16z" class="${cls}"/></g>`;

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
  const s = (shapes: string) => `<svg class="stage-svg" viewBox="0 0 20 20" aria-hidden="true">${shapes}</svg>`;
  switch (lb) {
    case 1:
      return s(`<path d="M3 9.5L10 3.5l7 6v7a1 1 0 0 1-1 1h-4v-4.5H8v4.5H4a1 1 0 0 1-1-1z"/>`);
    case 2:
      return s(`<path d="M3 16.5V8.5l4.5-3v3l4.5-3v3l5-3v11zM6 12.5h2M10 12.5h2"/>`);
    case 3:
      return s(`<path d="M10 3.5v13M5 6.5h10M5 6.5l-2 5h4zM15 6.5l-2 5h4zM6.5 16.5h7"/>`);
    case 4:
      return s(`<circle cx="5.8" cy="13.5" r="2.8"/><circle cx="14.2" cy="13.5" r="2.8"/><path d="M5.8 13.5L9 8h4l1.2 5.5M9 8L7.5 6.5M12.5 6.5h2.2"/>`);
    default:
      return s(`<rect x="3.5" y="3.5" width="13" height="13" rx="2"/><path d="M6.5 8h7M10 8v5.5M7 11h1.5M11.5 11H13"/>`);
  }
}

/** Compact thematic illustration shown in the sidebar for the active Lernbereich. */
export function renderStageArt(lb: number): string {
  let body = "";
  switch (lb) {
    case 1:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${house(56, 52, 0.85)}${coins(148, 52, 0.9)}<rect x="210" y="54" width="16" height="24" rx="3" class="v-coral"/><rect x="234" y="40" width="16" height="38" rx="3" class="v-blue"/><rect x="258" y="24" width="16" height="54" rx="3" class="v-green"/>${label(242, 16, "Budget & Sparen", "micro")}`;
      break;
    case 2:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${factory(68, 56, 0.95)}${bike(182, 52, 0.95)}${shield(272, 48, 0.72, "v-blue")}${label(182, 17, "Radwerk Brenner", "micro")}`;
      break;
    case 3:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${scaleBeam(86, 22, 110)}${tAccountBox(176, 12, 126, 72, "Konto", ["AB", "+"], ["−", "SB"])}`;
      break;
    case 4:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${pill(14, 34, 72, 28, "AWR–AWB", "v-orange-fill", "micro")}${arrow(88, 48, 112, 48)}${bike(160, 48, 0.85)}${arrow(204, 48, 228, 48)}${pill(232, 34, 74, 28, "UEFE · USt", "v-green-fill", "micro")}${label(160, 17, "Beschaffung → Fertigung → Absatz", "micro")}`;
      break;
    default:
      body = `${card(0, 0, 320, 96, "v-banner-bg", 12)}${pill(16, 36, 70, 28, "GUV", "v-teal-fill", "micro")}${arrow(88, 50, 118, 50)}${pill(122, 36, 76, 28, "EK", "v-gold-fill", "micro")}${arrow(200, 50, 230, 50)}${pill(234, 36, 70, 28, "SBK", "v-blue-fill", "micro")}${label(160, 18, "Jahresabschluss im Zusammenhang", "micro")}`;
      break;
  }
  return `<div class="stage-art" aria-hidden="true"><svg viewBox="0 0 320 96" focusable="false">${body}</svg></div>`;
}
