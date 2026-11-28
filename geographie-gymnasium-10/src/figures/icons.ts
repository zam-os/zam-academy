/**
 * Consistent inline SVG icons for the 7 Lernbereiche and lesson steps.
 * Uses currentColor so light/dark themes and --stage-hue / --accent apply cleanly.
 */

const STAGE_PATHS: Record<number, string> = {
  // 1 Arbeitstechniken: Kompass / Fadenkreuz
  1: '<circle cx="12" cy="12" r="8"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M14.5 9.5l-1.2 3.8-3.8 1.2 1.2-3.8z"/>',
  // 2 Eine Welt: Globus mit Breiten-/Längengraden
  2: '<circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3.5 9h17M3.5 15h17"/>',
  // 3 Tropen & aride Subtropen: Sonne & Äquator
  3: '<circle cx="12" cy="9" r="3.5"/><path d="M12 2.5v1.5M6.4 4.8l1.1 1.1M17.6 4.8l-1.1 1.1M4 14h16M6 18h12"/>',
  // 4 Klima im Wandel: Thermometer / Kurve
  4: '<path d="M10 4a2 2 0 1 1 4 0v9.2a3.5 3.5 0 1 1-4 0z"/><circle cx="12" cy="16" r="1.3"/><path d="M16 7l3-2M16 11h3"/>',
  // 5 MENA: Oase / Wasser & Stadtbogen
  5: '<path d="M4 20h16M7 20v-7a5 5 0 0 1 10 0v7"/><path d="M12 4v3M9 7c1.5 1 4.5 1 6 0"/>',
  // 6 Afrika südlich der Sahara: Akazienkrone / Savannenprofil
  6: '<path d="M12 19v-7M5 12c0-3.5 3-5.5 7-5.5s7 2 7 5.5H5zM4 19h16"/>',
  // 7 Mittel- und Südamerika: Gebirgsstufen / Anden & Regenwald
  7: '<path d="M3 19l6-11 4 6 3-4 5 9z"/><path d="M9 8l1.5 2.5"/>',
};

const STEP_PATHS: Record<"understand" | "lab" | "quiz" | "workshop" | "writing", string> = {
  understand: '<path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H12v15H6.5A2.5 2.5 0 0 0 4 21zM20 6.5A2.5 2.5 0 0 0 17.5 4H12v15h5.5A2.5 2.5 0 0 1 20 21z"/>',
  lab: '<path d="M9 3h6M10 3v5l-4.5 8.5A2 2 0 0 0 7.2 19h9.6a2 2 0 0 0 1.7-2.5L14 8V3M8 14h8"/>',
  quiz: '<circle cx="12" cy="12" r="9"/><path d="M8.5 12.5l2.5 2.5 4.5-5"/>',
  workshop: '<rect x="3" y="4" width="7" height="7" rx="1.5"/><rect x="14" y="4" width="7" height="7" rx="1.5"/><rect x="8.5" y="13" width="7" height="7" rx="1.5"/>',
  writing: '<path d="M4 20h4l10-10a2 2 0 0 0-4-4L4 16v4zM13 7l4 4"/>',
};

export function stageIconSvg(lb: number, size = 22): string {
  const d = STAGE_PATHS[lb] ?? STAGE_PATHS[1];
  return `<svg class="ui-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
}

export function stepIconSvg(
  step: "understand" | "lab" | "quiz" | "workshop" | "writing",
  size = 16,
): string {
  return `<svg class="ui-icon step-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${STEP_PATHS[step]}</svg>`;
}

export function heroBannerSvg(): string {
  return `<svg class="hero-banner-svg" viewBox="0 0 580 54" role="img" aria-label="Themenband: Globus, Tropen, Wandel, Regionen" xmlns="http://www.w3.org/2000/svg">
    <rect class="geo-banner-bg" x="1" y="1" width="578" height="52" rx="12"/>
    <g transform="translate(26,15)" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${STAGE_PATHS[2]}</g>
    <path class="geo-banner-line" d="M62 27h74"/>
    <g transform="translate(148,15)" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${STAGE_PATHS[3]}</g>
    <path class="geo-banner-line" d="M184 27h74"/>
    <g transform="translate(270,15)" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${STAGE_PATHS[4]}</g>
    <path class="geo-banner-line" d="M306 27h74"/>
    <g transform="translate(392,15)" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${STAGE_PATHS[5]}</g>
    <path class="geo-banner-line" d="M428 27h74"/>
    <g transform="translate(514,15)" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${STAGE_PATHS[7]}</g>
  </svg>`;
}
