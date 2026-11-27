/** Consistent inline SVG icons for Lernbereiche and learning steps (no icon fonts, no emojis). */
export function stageIcon(lb: number): string {
  if (lb === 1) {
    return `<svg class="stage-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M3.6 9h16.8M3.6 15h16.8"/><path d="M12 3a13 13 0 0 1 0 18M12 3a13 13 0 0 0 0 18"/></svg>`;
  }
  if (lb === 2) {
    return `<svg class="stage-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 3h12M6 21h12"/><path d="M7 3v4c0 3 5 4 5 5s-5 2-5 5v4"/><path d="M17 3v4c0 3-5 4-5 5s5 2 5 5v4"/></svg>`;
  }
  if (lb === 3) {
    return `<svg class="stage-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M2 20h20M12 3l9 5H3l9-5z"/></svg>`;
  }
  return `<svg class="stage-svg" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><circle cx="16" cy="9" r="2.5"/><path d="M3 19c0-3 2.7-5 6-5s6 2 6 5"/><path d="M15 14c2.8 0 5 1.8 5 4.5"/></svg>`;
}
