/** Consistent inline SVG icons for the eight curriculum stages (no icon fonts). */
const STAGE_ICON_PATHS: Record<string, string> = {
	salve:
		'<path d="M4 18h16M6 18V9l6-4 6 4v9M10 18v-5h4v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
	nomina:
		'<rect x="4" y="5" width="7" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="13" y="5" width="7" height="14" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M6.5 9.5h2M6.5 13h2M15.5 9.5h2M15.5 13h2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	verba:
		'<circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 7.5V12l3.5 2" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
	syntax:
		'<rect x="3.5" y="6" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="15.5" y="6" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><rect x="9.5" y="14" width="5" height="5" rx="1" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8.5 8.5h7M12 11v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
	"aci-methodik":
		'<path d="M4 15c2.5-5 5.5-7 8-7s5.5 2 8 7" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M4 17h16M8 15v2M16 15v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>',
	roma:
		'<path d="M5 19h14M6 19v-7a6 6 0 0 1 12 0v7M9 19v-5a3 3 0 0 1 6 0v5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
	historia:
		'<path d="M7 5h10v14H7z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M7 8H5a1.5 1.5 0 0 0 0 3h2M17 16h2a1.5 1.5 0 0 0 0-3h-2M10 9.5h4M10 13h4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
	mythos:
		'<path d="M12 4l2.2 4.6 5.1.7-3.7 3.6.9 5.1-4.5-2.4-4.5 2.4.9-5.1-3.7-3.6 5.1-.7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>',
};

export function renderStageIcon(stageId: string): string {
	const paths =
		STAGE_ICON_PATHS[stageId] ??
		'<circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="1.8"/>';
	return `<svg class="stage-svg" viewBox="0 0 24 24" width="26" height="26" aria-hidden="true">${paths}</svg>`;
}
