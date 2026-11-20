/**
 * Line icons and the illustration of the start page, drawn inline: no icon
 * font, no image file, no request. Icons are decoration and stay hidden
 * from assistive technology; the text beside them carries the meaning.
 */
const icon = (shapes: string): string =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${shapes}</svg>`;

export const ICONS = {
  /** Abschnitt 1.1: a horseshoe magnet. */
  magnet: icon(
    `<path d="M6 3v9a6 6 0 0 0 12 0V3"/><path d="M6 3h4v9a2 2 0 0 0 4 0V3h4"/><path d="M6 7h4M14 7h4"/>`,
  ),
  /** Abschnitt 1.2: the Moon in front of the Sun's rays. */
  light: icon(
    `<circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.5 1.5M17.2 17.2l1.5 1.5M18.7 5.3l-1.5 1.5M6.8 17.2l-1.5 1.5"/>`,
  ),
  /** Abschnitt 1.3: a lightning bolt. */
  bolt: icon(`<path d="M13.5 2.5 5 13.5h6l-1 8 8.5-11h-6z"/>`),
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
  [ICONS.magnet, ICONS.light, ICONS.bolt][lb - 1] ?? ICONS.magnet;

/**
 * Start page illustration: a bar magnet with a compass, a lamp casting a
 * shadow, a moon in two phases and a small circuit. Purely decorative.
 */
export const HERO_ART = `<svg class="hero-art" viewBox="0 0 420 190" aria-hidden="true">
<g fill="#fff"><circle cx="24" cy="22" r="1.4"/><circle cx="96" cy="12" r="1"/><circle cx="262" cy="14" r="1"/><circle cx="398" cy="16" r="1"/><circle cx="34" cy="118" r="1"/></g>
<rect x="24" y="132" width="44" height="26" fill="#e0574f"/><rect x="68" y="132" width="44" height="26" fill="#3fbf7f"/>
<circle cx="150" cy="145" r="20" fill="none" stroke="#cfd6f3" stroke-width="2"/><path d="M150 145l16 0" stroke="#e0574f" stroke-width="4" stroke-linecap="round"/><path d="M150 145l-16 0" stroke="#3fbf7f" stroke-width="4" stroke-linecap="round"/>
<circle cx="60" cy="52" r="14" fill="#f5c542"/><path d="M60 52L250 22M60 52L250 98" stroke="#f5c542" stroke-width="1.5" stroke-dasharray="4 4" opacity="0.8"/>
<rect x="128" y="44" width="10" height="24" fill="#cfd6f3"/><rect x="250" y="20" width="10" height="80" fill="#cfd6f3" opacity="0.35"/><rect x="250" y="40" width="10" height="40" fill="#0b0d14"/>
<circle cx="320" cy="50" r="22" fill="#2b2f45"/><path d="M320 28a22 22 0 0 1 0 44a10 22 0 0 0 0-44z" fill="#f2f2e8"/>
<circle cx="380" cy="50" r="22" fill="#f2f2e8"/>
<path d="M230 170V130H400V170H330M300 170H230" fill="none" stroke="#8ab4ff" stroke-width="2.5"/><circle cx="315" cy="130" r="9" fill="#ffd166"/><path d="M300 170l26-12" stroke="#8ab4ff" stroke-width="2.5"/>
</svg>`;
