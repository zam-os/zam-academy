import { esc } from "./practice";
import type { Conjugation, Explorer, Lesson, Tone } from "./types";

/** Colour code used across the package; the legend repeats it wherever it appears. */
export const TONE_LABELS: Record<Tone, string> = {
	m: "maskulin",
	f: "feminin",
	pl: "Plural",
	v: "Verbform",
};

function legend(tones: Tone[]): string {
	const unique = [...new Set(tones)];
	if (!unique.length) return "";
	return `<p class="tone-legend small" aria-label="Farbcode">${unique
		.map((tone) => `<span class="tone-chip" data-tone="${tone}">${TONE_LABELS[tone]}</span>`)
		.join("")}</p>`;
}

/** Three linked panels: the first is open at the start, the learner switches freely. */
export function stepExplorer(explorer: Explorer, classes = ""): string {
	const tones = explorer.steps.flatMap((step) => (step.tone ? [step.tone] : []));
	return `<figure class="step-explorer ${classes}" data-explorer>
		<figcaption>${esc(explorer.caption)}</figcaption>
		<div class="step-options" role="group" aria-label="${esc(explorer.caption)}">${explorer.steps
			.map(
				(step, i) =>
					`<button type="button" data-step="${i}" aria-pressed="${i === 0}"${step.tone ? ` data-tone="${step.tone}"` : ""}><span aria-hidden="true">${esc(step.icon)}</span><strong>${esc(step.label)}</strong></button>`,
			)
			.join("")}</div>
		<div class="step-results" aria-live="polite">${explorer.steps
			.map(
				(step, i) =>
					`<div data-step-panel="${i}"${step.tone ? ` data-tone="${step.tone}"` : ""}${i ? " hidden" : ""}><p lang="fr">${esc(step.example)}</p><p class="small">${esc(step.detail)}</p></div>`,
			)
			.join("")}</div>${legend(tones)}</figure>`;
}

/** Stem in ink, ending in the verb colour; irregular forms are marked as a whole. */
export function conjugationTable(table: Conjugation): string {
	return `<figure class="conjugation" data-conjugation>
		<figcaption><strong lang="fr">${esc(table.verb)}</strong> · ${esc(table.meaning)}</figcaption>
		<table><tbody>${table.rows
			.map(
				([subject, stem, ending]) =>
					`<tr><th scope="row" lang="fr">${esc(subject)}</th><td lang="fr">${ending ? `${esc(stem)}<span class="ending" data-tone="v">${esc(ending)}</span>` : `<span class="irregular">${esc(stem)}</span>`}</td></tr>`,
			)
			.join("")}</tbody></table>
		<p class="small">${esc(table.note)}</p></figure>`;
}

export function renderConjugations(lesson: Lesson): string {
	if (!lesson.conjugation?.length) return "";
	return `<div class="conjugations"><div class="conjugation-grid">${lesson.conjugation
		.map(conjugationTable)
		.join("")}</div><p class="tone-legend small"><span class="tone-chip" data-tone="v">Endung</span>${lesson.conjugation.some((table) => table.rows.some(([, , ending]) => !ending)) ? '<span class="tone-chip irregular-chip">unregelmäßige Form</span>' : ""}<button type="button" class="button secondary" data-hide-endings aria-pressed="false">Endungen verdecken und selbst sagen</button></p></div>`;
}

/** Five positions around a table and a box; each preposition moves the cat. */
export const SCENE_POSITIONS = {
	sur: { label: "sur la table", x: 150, y: 96 },
	sous: { label: "sous la table", x: 150, y: 196 },
	devant: { label: "devant la table", x: 92, y: 236 },
	derriere: { label: "derrière la table", x: 214, y: 112 },
	dans: { label: "dans le carton", x: 330, y: 182 },
} as const;
export type ScenePosition = keyof typeof SCENE_POSITIONS;

export function prepositionScene(): string {
	const cat = (id: ScenePosition) => {
		const p = SCENE_POSITIONS[id];
		return `<text class="scene-cat" data-cat="${id}" x="${p.x}" y="${p.y}" text-anchor="middle"${id === "sur" ? "" : ' visibility="hidden"'}>🐈</text>`;
	};
	return `<figure class="prep-scene" data-scene>
		<svg viewBox="0 0 420 270" role="img" aria-labelledby="scene-caption">
			<rect x="0" y="0" width="420" height="200" class="scene-wall"/>
			<rect x="0" y="200" width="420" height="70" class="scene-floor"/>
			<rect x="330" y="40" width="70" height="110" rx="4" class="scene-window"/>
			${cat("derriere")}
			<rect x="70" y="110" width="160" height="14" rx="3" class="scene-table"/>
			<rect x="82" y="124" width="12" height="96" class="scene-table"/>
			<rect x="206" y="124" width="12" height="96" class="scene-table"/>
			${cat("sur")}${cat("sous")}${cat("dans")}
			<path d="M280 160 L380 160 L380 226 L280 226 Z" class="scene-box"/>
			<text x="330" y="214" text-anchor="middle" class="scene-label">carton</text>
			${cat("devant")}
		</svg>
		<figcaption id="scene-caption"><span lang="fr" data-scene-readout>Le chat est sur la table.</span></figcaption>
		<div class="scene-controls" role="group" aria-label="Wo ist die Katze?">${(Object.keys(SCENE_POSITIONS) as ScenePosition[])
			.map(
				(id) =>
					`<button type="button" class="button secondary" data-scene-pos="${id}" aria-pressed="${id === "sur"}" lang="fr">${esc(SCENE_POSITIONS[id].label.split(" ")[0])}</button>`,
			)
			.join("")}</div></figure>`;
}

function routeExplorer(): string {
	return `<figure class="step-explorer route-explorer" data-explorer>
		<figcaption>Wegskizze · Wähle ein Ziel</figcaption>
		<div class="route-grid" aria-label="Der Bahnhof liegt rechts der Kreuzung an der Apotheke, die Post links. Der Start liegt darunter.">
			<button type="button" data-step="0" aria-pressed="true"><span aria-hidden="true">✉</span><strong>La poste</strong></button>
			<span class="route-cafe"><span aria-hidden="true">✚</span> Pharmacie</span>
			<button type="button" data-step="1" aria-pressed="false"><span aria-hidden="true">🚉</span><strong>La gare</strong></button>
			<span class="route-origin"><span aria-hidden="true">↑</span> Départ</span>
		</div>
		<div class="step-results" aria-live="polite">
			<div data-step-panel="0"><p lang="fr">Allez tout droit jusqu’à la pharmacie, puis tournez à gauche.</p><p class="small">Geradeaus bis zur Apotheke, dann links.</p></div>
			<div data-step-panel="1" hidden><p lang="fr">Allez tout droit jusqu’à la pharmacie, puis tournez à droite.</p><p class="small">Geradeaus bis zur Apotheke, dann rechts.</p></div>
		</div></figure>`;
}

export function renderExplorer(lesson: Lesson): string {
	if (lesson.id === "f7-chemin") return routeExplorer();
	return lesson.explorer ? stepExplorer(lesson.explorer) : "";
}

export function bindExplorers(container: HTMLElement): void {
	for (const explorer of container.querySelectorAll<HTMLElement>("[data-explorer]")) {
		const steps = explorer.querySelectorAll<HTMLButtonElement>("[data-step]");
		const panels = explorer.querySelectorAll<HTMLElement>("[data-step-panel]");
		for (const button of steps) {
			button.addEventListener("click", () => {
				for (const step of steps) step.setAttribute("aria-pressed", String(step === button));
				for (const panel of panels) panel.hidden = panel.dataset.stepPanel !== button.dataset.step;
			});
		}
	}
	const hide = container.querySelector<HTMLButtonElement>("[data-hide-endings]");
	hide?.addEventListener("click", () => {
		const hidden = hide.getAttribute("aria-pressed") !== "true";
		hide.setAttribute("aria-pressed", String(hidden));
		hide.textContent = hidden ? "Endungen wieder zeigen" : "Endungen verdecken und selbst sagen";
		for (const figure of container.querySelectorAll<HTMLElement>("[data-conjugation]"))
			figure.classList.toggle("endings-hidden", hidden);
	});
	const scene = container.querySelector<HTMLElement>("[data-scene]");
	if (scene) {
		for (const button of scene.querySelectorAll<HTMLButtonElement>("[data-scene-pos]")) {
			button.addEventListener("click", () => {
				const id = button.dataset.scenePos as ScenePosition;
				for (const other of scene.querySelectorAll("[data-scene-pos]"))
					other.setAttribute("aria-pressed", String(other === button));
				for (const cat of scene.querySelectorAll<SVGTextElement>("[data-cat]"))
					cat.setAttribute("visibility", cat.dataset.cat === id ? "visible" : "hidden");
				scene.querySelector("[data-scene-readout]")!.textContent =
					`Le chat est ${SCENE_POSITIONS[id].label}.`;
			});
		}
	}
}
