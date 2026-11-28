import { MAP_DATA, renderMapSvg, renderSceneSvg, SCENE_DATA } from "./maps";
import { esc } from "./practice";
import type { Lesson, WorkshopPiece, WorkshopVisual } from "./types";

export function workshopPieces(visual: WorkshopVisual): readonly WorkshopPiece[] {
	if (visual.kind === "map") return MAP_DATA[visual.id].places;
	if (visual.kind === "scene") return SCENE_DATA[visual.id].pieces;
	return visual.pieces;
}

function pieceButton(piece: WorkshopPiece, marker = "", language?: "en" | "de"): string {
	return `<button type="button" class="explorer-piece" data-piece="${esc(piece.id)}" aria-pressed="false"${language ? ` lang="${language}"` : ""}>${marker}${esc(piece.label)}</button>`;
}

const marker = (number: number): string => `<span class="piece-marker">${number}</span>`;

function clipText(text: string, max = 20): string {
	return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function boardDiagramSvg(
	kind: "board" | "timeline" | "comparison",
	caption: string,
	pieces: WorkshopPiece[],
): string {
	const xs = [92, 260, 428];
	if (kind === "timeline") {
		return `<svg class="workshop-svg diagram-svg" viewBox="0 0 520 120" role="img" aria-label="${esc(caption)}">
			<line x1="36" y1="68" x2="478" y2="68" class="svg-axis"/>
			<path d="M474 60 L492 68 L474 76 Z" class="svg-axis-head"/>
			<text x="36" y="106" class="svg-axis-label">früher</text>
			<text x="492" y="106" text-anchor="end" class="svg-axis-label">später / jetzt</text>
			${pieces
				.slice(0, 3)
				.map(
					(p, i) => `<g class="svg-hotspot" data-map-marker="${esc(p.id)}">
						<circle cx="${xs[i]}" cy="68" r="14" class="svg-node"/>
						<text x="${xs[i]}" y="73" text-anchor="middle" class="svg-node-num">${i + 1}</text>
						<text x="${xs[i]}" y="34" text-anchor="middle" class="svg-card-sub">${esc(clipText(p.label, 22))}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	if (kind === "comparison") {
		return `<svg class="workshop-svg diagram-svg" viewBox="0 0 520 120" role="img" aria-label="${esc(caption)}">
			<path d="M168 62 H184 M336 62 H352" class="svg-connector"/>
			${pieces
				.slice(0, 3)
				.map(
					(p, i) => `<g class="svg-hotspot" data-map-marker="${esc(p.id)}">
						<rect x="${20 + i * 166}" y="22" width="148" height="78" rx="10" class="svg-card"/>
						<text x="${94 + i * 166}" y="48" text-anchor="middle" class="svg-card-title">${i + 1}</text>
						<text x="${94 + i * 166}" y="72" text-anchor="middle" class="svg-card-sub">${esc(clipText(p.label, 20))}</text>
					</g>`,
				)
				.join("")}
		</svg>`;
	}
	return `<svg class="workshop-svg diagram-svg" viewBox="0 0 520 120" role="img" aria-label="${esc(caption)}">
		<path d="M168 62 H184 M336 62 H352" class="svg-flow-arrow"/>
		${pieces
			.slice(0, 3)
			.map(
				(p, i) => `<g class="svg-hotspot" data-map-marker="${esc(p.id)}">
					<rect x="${20 + i * 166}" y="22" width="148" height="78" rx="10" class="svg-card"/>
					<text x="${94 + i * 166}" y="48" text-anchor="middle" class="svg-card-title">${i + 1}</text>
					<text x="${94 + i * 166}" y="72" text-anchor="middle" class="svg-card-sub">${esc(clipText(p.label, 20))}</text>
				</g>`,
			)
			.join("")}
	</svg>`;
}

function illustrate(visual: WorkshopVisual): string {
	if (visual.kind === "map") {
		const data = MAP_DATA[visual.id];
		return `<figure class="explorer workshop-map" aria-labelledby="workshop-visual-caption">${renderMapSvg(visual.id)}<figcaption id="workshop-visual-caption">${esc(data.caption)} Wähle den passenden Ort auf der Karte oder über die Tasten.</figcaption><div class="explorer-options map-options">${data.places.map((piece, index) => pieceButton(piece, marker(index + 1), "en")).join("")}</div></figure>`;
	}
	if (visual.kind === "scene") {
		const data = SCENE_DATA[visual.id];
		return `<figure class="explorer scene ${visual.id}" aria-labelledby="workshop-visual-caption">${renderSceneSvg(visual.id)}<figcaption id="workshop-visual-caption">${esc(data.caption)}</figcaption><div class="explorer-options scene-pieces">${data.pieces.map((piece, index) => pieceButton(piece, marker(index + 1))).join("")}</div></figure>`;
	}
	return `<figure class="explorer workshop-${visual.kind}" aria-labelledby="workshop-visual-caption">${boardDiagramSvg(visual.kind, visual.caption, visual.pieces)}<figcaption id="workshop-visual-caption">${esc(visual.caption)}</figcaption><div class="explorer-options">${visual.pieces.map((piece, index) => pieceButton(piece, marker(index + 1), visual.language ?? "en")).join("")}</div></figure>`;
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Entdeckerwerkstatt</h2><p id="workshop-question" class="workshop-question" aria-live="polite">${esc(lesson.workshop.goals[0].label)}</p>${illustrate(lesson.workshop.visual)}<p id="workshop-feedback" class="visual-note" role="status"></p><p id="workshop-status" class="workshop-status">0 von 3 Zielen erreicht.</p><button type="button" class="button secondary" id="workshop-restart" hidden>Werkstatt erneut starten</button></section>`;
}

export function bindWorkshop(lesson: Lesson, container: HTMLElement, complete: () => void): void {
	const workshop = lesson.workshop;
	const buttons = [...container.querySelectorAll<HTMLButtonElement>("[data-piece]")];
	const hotspots = [...container.querySelectorAll<HTMLElement | SVGElement>("[data-map-marker]")];
	const pieces = new Map(workshopPieces(workshop.visual).map((piece) => [piece.id, piece]));
	const question = container.querySelector<HTMLElement>("#workshop-question")!;
	const status = container.querySelector<HTMLElement>("#workshop-status")!;
	const feedback = container.querySelector<HTMLElement>("#workshop-feedback")!;
	const restart = container.querySelector<HTMLButtonElement>("#workshop-restart")!;
	let reached = 0;

	function select(id?: string): void {
		for (const button of buttons)
			button.setAttribute("aria-pressed", String(button.dataset.piece === id));
		for (const mark of hotspots)
			mark.dataset.selected = String(mark.dataset.mapMarker === id);
	}

	function activatePiece(id: string): void {
		const piece = pieces.get(id);
		if (!piece) return;
		select(piece.id);
		const goal = workshop.goals[reached];
		if (!goal) {
			feedback.textContent = piece.note;
			return;
		}
		if (piece.id !== goal.answer) {
			feedback.textContent = `${piece.note} Wähle für dieses Ziel ein anderes Feld.`;
			return;
		}
		reached += 1;
		feedback.textContent = `✓ ${goal.explanation}`;
		status.textContent = `${reached} von ${workshop.goals.length} Zielen erreicht.`;
		const next = workshop.goals[reached];
		question.textContent = next?.label ?? "Werkstatt abgeschlossen.";
		if (!next) {
			restart.hidden = false;
			complete();
		}
	}

	for (const button of buttons) {
		button.addEventListener("click", () => {
			activatePiece(button.dataset.piece ?? "");
		});
	}
	for (const mark of hotspots) {
		mark.addEventListener("click", () => {
			activatePiece(mark.dataset.mapMarker ?? "");
		});
	}

	restart.addEventListener("click", () => {
		reached = 0;
		select();
		status.textContent = "0 von 3 Zielen erreicht.";
		question.textContent = workshop.goals[0].label;
		feedback.textContent = "";
		restart.hidden = true;
		buttons[0]?.focus();
	});
}
