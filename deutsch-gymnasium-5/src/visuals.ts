import { esc } from "./practice";
import type { Lesson } from "./types";

// Diagrams explain relationships. Text and controls stay outside the SVG so
// they reflow at narrow widths and are available to assistive technology.
function diagram(lesson: Lesson): string {
	const kind = lesson.visual.kind;
	if (kind === "chart") {
		return `<svg viewBox="0 0 600 230" role="img" aria-label="Erfundene Buchwahl von zwanzig Kindern: Abenteuer acht, Tiere sechs, Fantasie vier, Sachbuch zwei Stimmen.">
		<path d="M135 15v180h420" class="diagram-line"/>
		${[0, 2, 4, 6, 8].map((n) => `<g><path d="M${145 + n * 45} 20v170" class="chart-grid"/><text x="${145 + n * 45}" y="216" text-anchor="middle">${n}</text></g>`).join("")}
		${["Abenteuer", "Tiere", "Fantasie", "Sachbuch"].map((name, i) => `<g data-chart-bar="${i}"><text x="125" y="${48 + i * 42}" text-anchor="end">${name}</text><rect x="145" y="${27 + i * 42}" width="${(8 - i * 2) * 45}" height="29" rx="5" class="bar bar-${i}"/><text x="${156 + (8 - i * 2) * 45}" y="${48 + i * 42}">${8 - i * 2}</text></g>`).join("")}</svg>`;
	}
	let background = "";
	if (kind === "story")
		background =
			'<path d="M70 160C160 160 210 50 300 44S440 150 530 160" class="story-arc"/><path d="M55 190h490" class="diagram-line"/>';
	else if (kind === "timeline")
		background =
			'<path d="M40 125h515l-12-10m12 10-12 10" class="diagram-line"/><text x="300" y="195" text-anchor="middle">vorher → Bezugspunkt → später</text>';
	else if (kind === "scene" && lesson.id === "d5-fabel")
		background =
			'<path d="M450 170V50m-35 55h80" class="tree"/><path d="M0 188h600" class="ground"/><path d="M470 72q20-34 34 0l-12 17z" class="bird"/><path d="M493 73l17 5-17 5" class="beak"/><path d="M335 168l15-36 17 18 15-18 10 38 27 11-28 11h-44l-38-20z" class="fox"/><path d="M475 110l12 20-22 2z" class="cheese"/>';
	else if (kind === "scene" && lesson.id === "d5-fabelhoeren")
		background =
			'<path d="M175 100q85-100 230-30-25 75-165 60z" fill="#719a6a"/><path d="M380 77l-18 92" class="diagram-line"/><ellipse cx="240" cy="169" rx="42" ry="21" fill="#a38a81"/><circle cx="214" cy="142" r="13" fill="#bd9e96"/><circle cx="209" cy="161" r="3"/><path d="M280 170q32 0 30 21" class="diagram-line"/><ellipse cx="341" cy="179" rx="13" ry="10" fill="#73535b"/><path d="M329 169l-8-7m20 5 7-9" class="diagram-line"/>';
	else if (kind === "scene" && lesson.id === "d5-maerchen")
		background =
			'<path d="M390 180V68h30V47h25v21h40V47h25v21h30v112z" class="castle"/><path d="M446 180v-43q17-28 34 0v43" class="castle-door"/><path d="M30 180q100-70 170 0t170 0" class="story-arc"/><path d="M80 125l13-20 13 20-13 20zM145 80l9-16 9 16-9 16z" class="spark"/>';
	else if (kind === "scene")
		background =
			'<path d="M45 190h510" class="diagram-line"/><path d="M55 25v150l80-35V25M545 25v150l-80-35V25" class="curtain"/><circle cx="265" cy="80" r="18" class="person"/><path d="M265 100v65m0-40-40 10m40-10 36-20m-36 60-22 25m22-25 22 25" class="diagram-line"/><path d="M335 78h80v50h-80z" class="paper"/>';
	else if (kind === "poem")
		background =
			'<path d="M80 45q110-25 220 8 110-33 220-8v132q-110-25-220 8-110-33-220-8z" class="book"/><path d="M300 53v132M110 80h150m-150 28h125m-125 28h150m80-56h150m-150 28h125m-125 28h150" class="diagram-line"/>';
	else if (["word", "sentence", "compare"].includes(kind))
		background = `<path d="M120 120h360" class="diagram-line"/>${[70, 250, 430].map((x, i) => `<rect x="${x - 15}" y="65" width="140" height="100" rx="${kind === "word" ? 25 : 10}" class="diagram-block block-${i}"/>`).join("")}`;
	else
		background =
			'<path d="M100 120h400l-14-12m14 12-14 12" class="diagram-line"/>';
	return `<svg viewBox="0 0 600 230" role="img" aria-label="${esc(lesson.visual.title)}. Die beschrifteten Schritte und ihre Erklärungen stehen direkt unter dem Bild.">${background}${[0, 1, 2].map((i) => `<g data-visual-mark="${i}"><circle cx="${120 + i * 180}" cy="${kind === "story" ? [160, 44, 160][i] : kind === "scene" || kind === "poem" ? 211 : 115}" r="19" class="diagram-marker"/><text x="${120 + i * 180}" y="${kind === "story" ? [166, 50, 166][i] : kind === "scene" || kind === "poem" ? 217 : 121}" text-anchor="middle" class="marker-number">${i + 1}</text></g>`).join("")}</svg>`;
}

export function renderVisual(lesson: Lesson): string {
	return `<section class="panel visual-workshop" aria-labelledby="visual-title"><div class="eyebrow">Entdeckerbild · selbst erkunden</div><h2 id="visual-title">${esc(lesson.visual.title)}</h2><p class="small">Wähle einen Teil des Bildes und verfolge, wie er mit den anderen zusammenhängt.</p><div class="diagram">${diagram(lesson)}</div><div class="visual-steps">${lesson.visual.steps.map((step, i) => `<button type="button" class="visual-step" data-visual-step="${i}" aria-pressed="false" aria-controls="visual-detail"><span class="step-label">${i + 1} · ${esc(step.label)}</span><strong>${esc(step.text)}</strong></button>`).join("")}</div><p id="visual-detail" role="status">Wähle oben einen Teil, um ihn genauer zu untersuchen.</p></section>`;
}

export function bindVisual(root: HTMLElement, lesson: Lesson): void {
	root
		.querySelectorAll<HTMLButtonElement>("[data-visual-step]")
		.forEach((button) => {
			button.addEventListener("click", () => {
				const index = Number(button.dataset.visualStep);
				const step = lesson.visual.steps[index];
				if (!step) return;
				root
					.querySelectorAll<HTMLButtonElement>("[data-visual-step]")
					.forEach(
						(b) => void b.setAttribute("aria-pressed", String(b === button)),
					);
				root
					.querySelectorAll<SVGGElement>("[data-visual-mark]")
					.forEach(
						(mark) =>
							void mark.classList.toggle(
								"is-active",
								Number(mark.dataset.visualMark) === index,
							),
					);
				root
					.querySelectorAll<SVGGElement>("[data-chart-bar]")
					.forEach((bar) => {
						const n = Number(bar.dataset.chartBar);
						bar.style.opacity =
							index === 2 || (index === 0 ? n === 0 : n === 1 || n === 2)
								? "1"
								: "0.25";
					});
				const detail = root.querySelector<HTMLElement>("#visual-detail");
				if (detail) detail.textContent = `${step.label}: ${step.detail}`;
			});
		});
}
