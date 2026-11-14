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
	let background = "";
	if (kind === "story")
		background =
			'<path d="M70 160C160 160 210 50 300 44S440 150 530 160" class="story-arc"/><path d="M55 190h490" class="diagram-line"/>';
	else if (kind === "timeline")
		background =
			'<path d="M40 125h515l-12-10m12 10-12 10" class="diagram-line"/><text x="300" y="195" text-anchor="middle">vorher → Bezugspunkt → später</text>';
	else if (kind === "scene" && lesson.id === "d5-fabel")
		background =
			'<path d="M440 185V70l18-15 8 15-12 25v90z" fill="#88634b"/><path d="M382 69q-15-38 25-46 14-25 43-13 37-14 55 16 38 4 32 36 14 30-17 46-30 20-61-1-40 12-66-10-17-9-11-28" fill="#729665"/><path d="M451 108h45" class="tree"/><path d="M0 188h600" class="ground"/><ellipse cx="485" cy="98" rx="15" ry="13" class="bird"/><circle cx="497" cy="87" r="9" class="bird"/><circle cx="500" cy="85" r="2" fill="white"/><path d="M503 90l15 5-16 4" class="beak"/><path d="M321 180q-46-4-44-31 35 2 47 19" fill="#be6a42"/><path d="M284 154l16 5-11 10" fill="#faf1dc"/><ellipse cx="342" cy="171" rx="29" ry="13" class="fox"/><path d="M356 169l6-36 11 18 12-17 5 30 20 8-28 12z" class="fox"/><path d="M373 169l28 4-18 8z" fill="#faf1dc"/><circle cx="382" cy="161" r="2"/><path d="M329 179v12m24-12v12" class="diagram-line"/><path d="M496 117l12 20-22 2z" class="cheese"/>';
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
	return `<section class="panel visual-workshop" aria-labelledby="visual-title"><div class="eyebrow">Entdeckerbild · selbst erkunden</div><h2 id="visual-title">${esc(lesson.visual.title)}</h2><p class="small">${model ? "Verändere das Modell mit den drei Tasten. Beobachte, wie Wortformen, Satzteile oder Zeichen sich verändern." : "Wähle einen Teil des Bildes und verfolge, wie er mit den anderen zusammenhängt."}</p><div class="diagram" data-model-container>${model ? renderLanguageModel(lesson) : diagram(lesson)}</div><div class="visual-steps">${lesson.visual.steps.map((step, i) => `<button type="button" class="visual-step" data-visual-step="${i}" aria-pressed="false" aria-controls="visual-detail"><span class="step-label">${i + 1} · ${esc(step.label)}</span><strong>${esc(step.text)}</strong></button>`).join("")}</div><p id="visual-detail" role="status">Wähle oben einen Teil, um ihn genauer zu untersuchen.</p>${model ? renderModelGoals(lesson) : ""}</section>`;
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
				if (lesson.visual.initial) {
					explored.add(index);
					const container = root.querySelector<HTMLElement>(
						"[data-model-container]",
					);
					if (container)
						container.innerHTML = renderLanguageModel(lesson, index);
					const goals = root.querySelector<HTMLElement>("[data-model-goals]");
					if (goals) goals.outerHTML = renderModelGoals(lesson, explored);
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
