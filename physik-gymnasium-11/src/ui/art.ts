/**
 * Line icons and the illustration of the start page, drawn inline: no icon
 * font, no image file, no request. Icons are decoration and stay hidden
 * from assistive technology; the text beside them carries the meaning.
 */
const icon = (shapes: string): string =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${shapes}</svg>`;

export const ICONS = {
  /** Lernbereich 1: a body on its orbit. */
  orbit: icon(
    `<circle cx="12" cy="12" r="2.6" class="solid"/><ellipse cx="12" cy="12" rx="10" ry="4.6" transform="rotate(-28 12 12)"/><circle cx="19.6" cy="6.4" r="1.7" class="solid"/>`,
  ),
  /** Lernbereich 2: a wave. */
  wave: icon(`<path d="M2 12c2.2-6.5 4.4-6.5 6.6 0s4.4 6.5 6.6 0 4.4-6.5 6.6 0"/>`),
  /** Lernbereich 3: a ringed planet among stars. */
  cosmos: icon(
    `<circle cx="11" cy="13" r="4.2"/><path d="M3.2 17.2c2.4 1.6 8.6-.4 13.2-4 3-2.4 4.6-4.8 3.8-6"/><path d="M19 15.5v3M17.5 17h3M5 4.5v2M4 5.5h2"/>`,
  ),
  /** Lernbereich 4: the sun over a solar module. */
  solar: icon(
    `<circle cx="7" cy="7" r="2.6"/><path d="M7 1.8v1.4M7 10.8v1.4M1.8 7h1.4M10.8 7h1.4M3.3 3.3l1 1M9.7 9.7l1 1M10.7 3.3l-1 1"/><path d="M9.5 14.5h11l1.5 7h-14zM14.5 14.5l-.6 7M11.2 18h10"/>`,
  ),
  book: icon(
    `<path d="M3 5.5c3-1.2 6-1.2 9 .5 3-1.7 6-1.7 9-.5v13c-3-1.2-6-1.2-9 .5-3-1.7-6-1.7-9-.5zM12 6v13"/>`,
  ),
  quiz: icon(
    `<circle cx="12" cy="12" r="9.2"/><path d="M9.3 9.4a2.8 2.8 0 1 1 4 2.5c-.9.5-1.3 1.1-1.3 2.1"/><circle cx="12" cy="17" r="0.9" class="solid"/>`,
  ),
  lab: icon(
    `<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>`,
  ),
  workshop: icon(
    `<rect x="3" y="4" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="4" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="14" width="7.5" height="6.5" rx="1.6"/><path d="M14 17.3h6.5M17.2 14.2l3.3 3.1-3.3 3.1"/>`,
  ),
  calculator: icon(
    `<rect x="4.5" y="2.5" width="15" height="19" rx="2.5"/><path d="M8 7h8"/><circle cx="8.5" cy="12" r="0.9" class="solid"/><circle cx="12" cy="12" r="0.9" class="solid"/><circle cx="15.5" cy="12" r="0.9" class="solid"/><circle cx="8.5" cy="16.5" r="0.9" class="solid"/><circle cx="12" cy="16.5" r="0.9" class="solid"/><circle cx="15.5" cy="16.5" r="0.9" class="solid"/>`,
  ),
  pencil: icon(`<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 19zM14.5 6l3.5 3.5M4 20h16"/>`),
  bulb: icon(
    `<path d="M8.5 15.5c-1.7-1.1-2.8-3-2.8-5.2a6.3 6.3 0 0 1 12.6 0c0 2.2-1.1 4.1-2.8 5.2v2h-7zM9.5 21h5"/>`,
  ),
  flask: icon(
    `<path d="M9 3h6M10 3v6.2L4.6 18.4A1.8 1.8 0 0 0 6.2 21h11.6a1.8 1.8 0 0 0 1.6-2.6L14 9.2V3M7.3 15h9.4"/>`,
  ),
  cards: icon(
    `<rect x="3" y="7" width="13" height="13" rx="2.2"/><path d="M8 7V5.6a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-3M6.5 14l2.2 2.2 4-4.4"/>`,
  ),
  play: icon(`<path d="M7 4.5v15l12-7.5z" class="solid"/>`),
} as const;

/** The icon of a Lernbereich, used on its card, its lessons and its formulas. */
export const stageIcon = (lb: number): string =>
  [ICONS.orbit, ICONS.wave, ICONS.cosmos, ICONS.solar][lb - 1] ?? ICONS.orbit;

/**
 * Start page illustration: an orbit, a pendulum, a wave train in the colours
 * of the spectrum. Purely decorative, so hidden from assistive technology.
 */
export const HERO_ART = `<svg class="hero-art" viewBox="0 0 420 190" aria-hidden="true">
<defs><linearGradient id="hero-spectrum" x1="0" x2="1"><stop offset="0" stop-color="#8b5cf6"/><stop offset="0.25" stop-color="#3b82f6"/><stop offset="0.5" stop-color="#22c55e"/><stop offset="0.75" stop-color="#f59e0b"/><stop offset="1" stop-color="#ef4444"/></linearGradient>
<radialGradient id="hero-sun"><stop offset="0" stop-color="#ffe9a3"/><stop offset="0.6" stop-color="#f5b301"/><stop offset="1" stop-color="#f5b301" stop-opacity="0"/></radialGradient></defs>
<g fill="#fff"><circle cx="24" cy="22" r="1.4"/><circle cx="96" cy="12" r="1"/><circle cx="188" cy="30" r="1.2"/><circle cx="262" cy="14" r="1"/><circle cx="342" cy="38" r="1.4"/><circle cx="398" cy="16" r="1"/><circle cx="308" cy="92" r="1"/><circle cx="34" cy="118" r="1"/></g>
<circle cx="122" cy="78" r="34" fill="url(#hero-sun)"/>
<ellipse cx="150" cy="78" rx="118" ry="50" fill="none" stroke="#7fa8ff" stroke-width="2" stroke-dasharray="3 6"/>
<path d="M150 78L253 54" stroke="#55d6a6" stroke-width="2.5"/>
<path d="M253 54l-14-52" stroke="#8ab4ff" stroke-width="3.5" stroke-linecap="round"/><path d="M239 2l-3.5 12 9-2.4z" fill="#8ab4ff"/>
<path d="M253 54L212 64" stroke="#ff9a94" stroke-width="3.5" stroke-linecap="round"/><path d="M204 66l10.5-6.5 1.8 8.8z" fill="#ff9a94"/>
<circle cx="253" cy="54" r="9" fill="#5b8cff" stroke="#101733" stroke-width="2.5"/>
<path d="M356 44L330 116" stroke="#cfd6f3" stroke-width="2"/><path d="M356 44L382 116" stroke="#cfd6f3" stroke-width="2" stroke-dasharray="3 5" opacity="0.6"/>
<circle cx="356" cy="44" r="3" fill="#cfd6f3"/><circle cx="330" cy="116" r="11" fill="#c6adff" stroke="#101733" stroke-width="2.5"/><circle cx="382" cy="116" r="11" fill="none" stroke="#c6adff" stroke-width="1.5" stroke-dasharray="3 4" opacity="0.7"/>
<path d="M10 160c16-34 32-34 48 0s32 34 48 0 32-34 48 0 32 34 48 0 32-34 48 0 32 34 48 0 32-34 48 0 32 34 48 0" fill="none" stroke="url(#hero-spectrum)" stroke-width="4.5" stroke-linecap="round"/>
</svg>`;
