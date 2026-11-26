import type { StageIconId } from "./types";

/**
 * Crisp inline SVG icons for every stage and the hero banner.
 * Uses currentColor and --stage-color so every icon adapts cleanly to light
 * and dark themes with zero external requests or icon fonts.
 */
export function stageIconSvg(id: StageIconId): string {
	const paths: Record<StageIconId, string> = {
		nomina:
			'<rect x="4" y="5" width="16" height="14" rx="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><line x1="4" y1="10" x2="20" y2="10" stroke="currentColor" stroke-width="1.6"/><line x1="10" y1="10" x2="10" y2="19" stroke="currentColor" stroke-width="1.6"/>',
		passiv:
			'<path d="M4 9h14m0 0-3.5-3.5M18 9l-3.5 3.5M20 15H6m0 0 3.5-3.5M6 15l3.5 3.5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
		partizip:
			'<path d="M5 7c0-1.5 1-2.5 2.5-2.5h1M5 17c0 1.5 1 2.5 2.5 2.5h1M5 7v10M19 7c0-1.5-1-2.5-2.5-2.5h-1M19 17c0 1.5-1 2.5-2.5 2.5h-1M19 7v10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="12" cy="12" r="2.2" fill="currentColor"/>',
		konjunktiv:
			'<circle cx="12" cy="6" r="2.5" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M12 8.5v3.5m0 0-5 5m5-5 5 5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><circle cx="7" cy="18" r="2" fill="currentColor"/><circle cx="17" cy="18" r="2" fill="none" stroke="currentColor" stroke-width="1.8"/>',
		wortschatz:
			'<path d="M4 6.5C4 5.7 4.7 5 5.5 5H11c1 0 1 1 1 2v12c0-1-1-1.5-2-1.5H5.5c-.8 0-1.5-.7-1.5-1.5V6.5Zm16 0c0-.8-.7-1.5-1.5-1.5H13c-1 0-1 1-1 2v12c0-1 1-1.5 2-1.5h4.5c.8 0 1.5-.7 1.5-1.5V6.5Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>',
		imperium:
			'<circle cx="12" cy="12" r="8.5" fill="none" stroke="currentColor" stroke-width="1.8"/><ellipse cx="12" cy="12" rx="3.8" ry="8.5" fill="none" stroke="currentColor" stroke-width="1.5"/><line x1="3.8" y1="12" x2="20.2" y2="12" stroke="currentColor" stroke-width="1.5"/>',
		respublica:
			'<path d="M3.5 9 12 4.5 20.5 9M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3.5 18h17" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
		mythos:
			'<path d="M7 19c0-5 1.5-9.5 5-13 3.5 3.5 5 8 5 13M4.5 19h15M12 6v13M9 12h6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>',
	};
	return `<svg class="stage-svg" viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">${paths[id]}</svg>`;
}

export function heroBannerSvg(): string {
	return `<svg class="hero-banner-svg" viewBox="0 0 360 120" role="img" aria-label="Stilisierter römischer Tempelgiebel mit den vier Säulen von Latein 7: Formen, Syntax, Kultur und Methodik">
		<rect x="8" y="8" width="344" height="104" rx="14" class="banner-bg"/>
		<polygon points="44,44 180,16 316,44" class="banner-pediment"/>
		<text x="180" y="37" text-anchor="middle" class="banner-motto">L7 · LINGUA LATINA</text>
		<rect x="44" y="44" width="272" height="6" rx="2" class="banner-beam"/>
		<g class="banner-pillars">
			<rect x="58" y="52" width="46" height="44" rx="5"/>
			<rect x="122" y="52" width="46" height="44" rx="5"/>
			<rect x="192" y="52" width="46" height="44" rx="5"/>
			<rect x="256" y="52" width="46" height="44" rx="5"/>
		</g>
		<text x="81" y="78" text-anchor="middle" class="banner-label">Formen</text>
		<text x="145" y="78" text-anchor="middle" class="banner-label">Syntax</text>
		<text x="215" y="78" text-anchor="middle" class="banner-label">Kultur</text>
		<text x="279" y="78" text-anchor="middle" class="banner-label">Methodik</text>
		<rect x="38" y="98" width="284" height="7" rx="3" class="banner-beam"/>
	</svg>`;
}
