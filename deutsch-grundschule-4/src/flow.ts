// The flow of a lesson: one step at a time instead of one long page, and
// "Verstehen" in small pieces. A German lesson needs more text than a maths
// lesson, so the text is not shortened but handed out piece by piece: the
// paragraphs, then the example, then the Merksatz that Tinto writes, then
// the terms as cards to turn over. Every piece stays in the page (hidden
// until it is shown), so nothing is lost for search, print or screen readers.
import { esc } from "./format";
import type { Stars } from "./storage/progress";
import type { ReadyLesson } from "./types";

export type Step = 1 | 2 | 3 | 4 | 5;

export type Piece =
	| { kind: "text"; text: string }
	| { kind: "example" }
	| { kind: "merke" }
	| { kind: "terms" };

export const STEP_LABELS: Record<Step, string> = {
	1: "Verstehen",
	2: "Schnellcheck",
	3: "Werkstatt",
	4: "Üben",
	5: "Schreibtisch",
};

/** The steps a lesson has; the Schreibtisch only where the lesson offers free writing. */
export const stepsOf = (l: ReadyLesson): Step[] => (l.desk ? [1, 2, 3, 4, 5] : [1, 2, 3, 4]);

export const isStep = (l: ReadyLesson, n: number): n is Step => (stepsOf(l) as number[]).includes(n);

export function learnPieces(l: ReadyLesson): Piece[] {
	return [
		...l.paragraphs.map((text): Piece => ({ kind: "text", text })),
		{ kind: "example" },
		{ kind: "merke" },
		{ kind: "terms" },
	];
}

function pieceHtml(l: ReadyLesson, piece: Piece): string {
	switch (piece.kind) {
		case "text":
			return `<p>${esc(piece.text)}</p>`;
		case "example":
			return `<div class="example"><h3>🔎 ${esc(l.example.title)}</h3><ul>${l.example.lines
				.map((x, k) => `<li style="--k:${k}">${esc(x)}</li>`)
				.join("")}</ul></div>`;
		case "merke":
			// Screen readers get the whole sentence at once; the inked copy is what Tinto writes.
			return `<div class="merke"><strong>✍️ Merke</strong><p><span class="sr-only">${esc(l.takeaway)}</span><span class="ink" aria-hidden="true">${esc(l.takeaway)}</span></p></div>`;
		case "terms":
			return `<h3>🃏 Fachbegriffe zum Umdrehen</h3>
<p class="small">Überlege zuerst, was der Begriff bedeutet. Dann dreh die Karte um und vergleiche.</p>
<ul class="flip-cards">${l.terms.map((t) => `<li>${flipCard(t.term, t.meaning)}</li>`).join("")}</ul>
${l.wordbook ? `<details class="wordbook"><summary>Alle Wörter dieser Lektion</summary>${l.wordbook.groups.map((g) => `<h3>${esc(g.title)}</h3><p>${esc(g.words)}</p>`).join("")}<p class="small">${esc(l.wordbook.note)}</p></details>` : ""}`;
	}
}

export function flipCard(term: string, meaning: string, turned = false): string {
	return `<button type="button" class="flip${turned ? " turned" : ""}" data-action="flip" aria-pressed="${turned}" aria-label="${esc(turned ? `${term}: ${meaning}` : `${term}. Karte umdrehen`)}" data-term="${esc(term)}" data-meaning="${esc(meaning)}"><span class="flip-inner"><span class="flip-face flip-front">${esc(term)}<small>umdrehen ↻</small></span><span class="flip-face flip-back">${esc(meaning)}</span></span></button>`;
}

/** The pieces of "Verstehen"; the first `shown` are visible. */
export function learnHtml(l: ReadyLesson, shown: number): string {
	return `<div class="pieces">${learnPieces(l)
		.map(
			(piece, i) =>
				`<div class="piece piece-${piece.kind}" data-piece="${i}" tabindex="-1"${i < shown ? "" : " hidden"}>${pieceHtml(l, piece)}</div>`,
		)
		.join("")}</div>`;
}

export function learnNextHtml(shown: number, total: number): string {
	return shown < total
		? `<span class="piece-count" aria-hidden="true">${shown} / ${total}</span><button type="button" class="text-button" data-action="learn-all">Alles auf einmal zeigen</button><button type="button" class="button" data-action="learn-more">Weiter lesen ↓</button>`
		: `<button type="button" class="button" data-action="step" data-step="2">Weiter: Schnellcheck →</button>`;
}

function starsOf(n: Step, s: Stars): boolean[] {
	if (n === 2) return [s.quiz];
	if (n === 3) return [s.workshop];
	if (n === 4) return [s.level1, s.level2];
	return [];
}

/** The path through the lesson; every step stays reachable. */
export function stepperHtml(l: ReadyLesson, current: Step, s: Stars): string {
	return `<ol>${stepsOf(l)
		.map((n) => {
			const earned = starsOf(n, s);
			const done = earned.length > 0 && earned.every(Boolean);
			const label = `${STEP_LABELS[n]}${earned.length ? `, ${earned.filter(Boolean).length} von ${earned.length} ${earned.length === 1 ? "Stern" : "Sternen"}` : ""}`;
			return `<li><button type="button" class="stepper-item${n === current ? " current" : ""}${done ? " done" : ""}" data-action="step" data-step="${n}" aria-label="${label}"${n === current ? ' aria-current="step"' : ""}><span class="step" aria-hidden="true">${done ? "✓" : n}</span><span class="stepper-label" aria-hidden="true">${STEP_LABELS[n]}</span>${earned.length ? `<span class="stepper-stars" aria-hidden="true">${earned.map((on) => `<span class="star${on ? " on" : ""}">★</span>`).join("")}</span>` : ""}</button></li>`;
		})
		.join("")}</ol>`;
}
