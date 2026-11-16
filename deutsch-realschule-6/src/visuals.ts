import { esc } from "./practice";
import { renderLanguageModel, renderModelGoals } from "./language-model";
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
	if (kind === "map")
		return `<svg viewBox="0 0 600 265" role="img" aria-label="Wegskizze: Vom Schultor nach oben zum Brunnen, links an der Bücherei vorbei, direkt dahinter rechts zum Jugendzentrum. Oben entspricht Norden."><path d="M475 205V110H120V45" class="diagram-line"/><path d="M475 160l-8 14m8-14 8 14M360 110l14-8m-14 8 14 8M120 65l-8 14m8-14 8 14" class="diagram-line"/><rect x="440" y="198" width="70" height="30" rx="5" class="paper"/><text x="475" y="250" text-anchor="middle">Schultor</text><circle cx="475" cy="110" r="18" class="bar bar-0"/><text x="475" y="80" text-anchor="middle">Brunnen</text><rect x="225" y="135" width="85" height="45" rx="5" class="book"/><text x="267" y="205" text-anchor="middle">Bücherei</text><rect x="83" y="12" width="75" height="36" rx="5" class="castle"/><text x="120" y="225" text-anchor="middle">Jugendzentrum</text><path d="M120 211V50" class="chart-grid"/><text x="35" y="38">N ↑</text>${[
			[475, 205],
			[475, 110],
			[120, 45],
		]
			.map(
				([x, y], i) =>
					`<g data-visual-mark="${i}"><circle cx="${x}" cy="${y}" r="16" class="diagram-marker"/><text x="${x}" y="${y + 6}" text-anchor="middle" class="marker-number">${i + 1}</text></g>`,
			)
			.join("")}</svg>`;
	if (lesson.id === "d6-sagen")
		return `<svg viewBox="0 0 600 250" role="img" aria-label="Drei Sagenschwerpunkte: ein örtlicher Felsen mit Glocke, ein Heldenschild mit Schwert, ein Göttertempel mit Blitz."><rect x="35" y="15" width="170" height="180" rx="18" class="diagram-block block-0"/><rect x="215" y="15" width="170" height="180" rx="18" class="diagram-block block-1"/><rect x="395" y="15" width="170" height="180" rx="18" class="diagram-block block-2"/><path d="M65 155l30-85 28 25 28-35 25 95z" class="castle"/><path d="M112 116v-12q10-16 20 0v12l6 8h-32z" class="cheese"/><circle cx="122" cy="130" r="4" class="beak"/><path d="M267 65h66v48q0 30-33 47-33-17-33-47z" class="paper"/><path d="M300 45v86m-22-12h44m-22-74 9 15h-18z" class="diagram-line"/><path d="M425 95l55-35 55 35zM430 160h100m-90-55v45m27-45v45m27-45v45m27-45v45" class="diagram-line"/><path d="M488 22l-19 26h17l-11 25 32-35h-20l11-16z" class="spark"/>${["Heimat", "Helden", "Götter"].map((label, i) => `<g data-visual-mark="${i}"><circle cx="${120 + i * 180}" cy="215" r="18" class="diagram-marker"/><text x="${120 + i * 180}" y="221" text-anchor="middle" class="marker-number">${i + 1}</text><text x="${120 + i * 180}" y="184" text-anchor="middle">${label}</text></g>`).join("")}</svg>`;
	let background = "";
	if (kind === "story")
		background =
			'<path d="M70 160C160 160 210 50 300 44S440 150 530 160" class="story-arc"/><path d="M55 190h490" class="diagram-line"/>';
	else if (kind === "timeline")
		background =
			'<path d="M40 125h515l-12-10m12 10-12 10" class="diagram-line"/><text x="300" y="195" text-anchor="middle">vorher → Bezugspunkt → später</text>';
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
	const labels = ["flow", "word", "sentence", "compare"].includes(kind)
		? lesson.visual.steps
				.map(
					(step, i) =>
						`<foreignObject x="${45 + i * 180}" y="${kind === "flow" ? 145 : 60}" width="150" height="100"><div xmlns="http://www.w3.org/1999/xhtml" class="diagram-caption">${esc(step.text)}</div></foreignObject>`,
				)
				.join("")
		: "";
	return `<svg viewBox="0 0 600 250" role="img" aria-label="${esc(lesson.visual.title)}. Die beschrifteten Schritte und ihre Erklärungen stehen direkt unter dem Bild.">${background}${[0, 1, 2].map((i) => `<g data-visual-mark="${i}"><circle cx="${120 + i * 180}" cy="${kind === "story" ? [160, 44, 160][i] : kind === "scene" || kind === "poem" ? 211 : ["compare", "word", "sentence"].includes(kind) ? 30 : 115}" r="19" class="diagram-marker"/><text x="${120 + i * 180}" y="${kind === "story" ? [166, 50, 166][i] : kind === "scene" || kind === "poem" ? 217 : ["compare", "word", "sentence"].includes(kind) ? 36 : 121}" text-anchor="middle" class="marker-number">${i + 1}</text></g>`).join("")}${labels}</svg>`;
}

export function renderVisual(lesson: Lesson): string {
	const model = !!lesson.visual.initial;
	return `<section class="panel visual-workshop" aria-labelledby="visual-title"><div class="eyebrow">Entdeckerbild · selbst erkunden</div><h2 id="visual-title">${esc(lesson.visual.title)}</h2><p class="small">${model ? "Verändere das Modell mit den drei Tasten. Beobachte, wie Wortformen, Satzteile oder Zeichen sich verändern." : "Wähle einen Teil des Bildes und verfolge, wie er mit den anderen zusammenhängt."}</p><div class="diagram" data-model-container>${model ? renderLanguageModel(lesson) : diagram(lesson)}</div><div class="visual-steps">${lesson.visual.steps.map((step, i) => `<button type="button" class="visual-step" data-visual-step="${i}" aria-pressed="false" aria-controls="visual-detail"><span class="step-label">${i + 1} · ${esc(step.label)}</span><strong>${esc(step.text)}</strong></button>`).join("")}</div><p id="visual-detail" role="status">Wähle oben einen Teil, um ihn genauer zu untersuchen.</p>${renderModelGoals(lesson)}</section>`;
}

export function bindVisual(root: HTMLElement, lesson: Lesson): void {
	const explored = new Set<number>();
	root
		.querySelectorAll<HTMLButtonElement>("[data-visual-step]")
		.forEach((button) => {
			button.addEventListener("click", () => {
				const index = Number(button.dataset.visualStep);
				const step = lesson.visual.steps[index];
				if (!step) return;
				explored.add(index);
				const goalPanel = root.querySelector<HTMLElement>("[data-model-goals]");
				if (goalPanel) goalPanel.outerHTML = renderModelGoals(lesson, explored);
				if (lesson.visual.initial) {
					const container = root.querySelector<HTMLElement>(
						"[data-model-container]",
					);
					if (container)
						container.innerHTML = renderLanguageModel(lesson, index);
				}
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
