/**
 * Line icons and the illustration of the start page, drawn inline: no icon
 * font, no image file, no request. Icons are decoration and stay hidden
 * from assistive technology; the text beside them carries the meaning.
 */
const icon = (shapes: string): string =>
  `<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">${shapes}</svg>`;

export const ICONS = {
  circuit: icon(
    `<path d="M3 5h18v14H3zM10 5l3-3M10 8l3-3"/><path d="M8 15v-4m-2 2h4m4 0h4"/>`,
  ),
  lens: icon(
    `<path d="M12 2q-8 10 0 20q8-10 0-20zM2 7h8m4 0l8 5m-20 5h8m4 0l8-5"/>`,
  ),
  force: icon(`<path d="M3 20h17M5 18L20 3M13 3h7v7"/>`),
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
  pencil: icon(
    `<path d="M4 20l1-4.5L16.5 4a2.1 2.1 0 0 1 3 0l.5.5a2.1 2.1 0 0 1 0 3L8.5 19zM14.5 6l3.5 3.5M4 20h16"/>`,
  ),
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
  [ICONS.circuit, ICONS.lens, ICONS.force, ICONS.solar][lb - 1] ??
  ICONS.circuit;

/** Each scene previews one of the three common lab drawing types. */
export const HERO_ART = `<svg class="hero-art" viewBox="0 0 420 190" aria-hidden="true">
<g fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
<rect x="14" y="24" width="120" height="137" rx="15" stroke="#799fff" opacity=".45"/>
<rect x="150" y="24" width="120" height="137" rx="15" stroke="#ffd891" opacity=".45"/>
<rect x="286" y="24" width="120" height="137" rx="15" stroke="#5fe1bd" opacity=".45"/>
<path d="M39 89V61H109V125H39V105M30 89h18m-14 16h10" stroke="#91b8ff"/>
<path d="M63 61h5l4-6 6 12 6-12 5 6h8" stroke="#ffd891"/>
<path d="M174 76h34l40 21m-74 21h34l40-21" stroke="#ffd891"/>
<path d="M208 46q26 51 0 102q-26-51 0-102Z" stroke="#91b8ff"/>
<path d="M309 132h74m-60-8 46-55m-17 0h17v17m-46 38h51m-7-7 7 7-7 7" stroke="#5fe1bd"/>
<path d="M323 124V87m-6 7 6-7 6 7" stroke="#ff9eab"/>
</g></svg>`;
