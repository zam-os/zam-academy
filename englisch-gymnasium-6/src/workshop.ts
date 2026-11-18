import { esc } from "./practice";
import {
	renderPictureScene,
	renderTownMap,
	renderUkRegionsMap,
	renderUsRegionsMap,
	TOWN_ROUTES,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(workshop: Workshop, answers: string[]): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

export type ComparisonAdjective = "fast" | "exciting" | "good";

export function comparisonSentence(
	bikeScore: number,
	trainScore: number,
	adjective: ComparisonAdjective,
): string {
	const a = Math.max(1, Math.min(5, Math.round(bikeScore)));
	const b = Math.max(1, Math.min(5, Math.round(trainScore)));
	const forms: Record<
		ComparisonAdjective,
		{ base: string; comp: string; sup: string }
	> = {
		fast: { base: "fast", comp: "faster", sup: "the fastest" },
		exciting: {
			base: "exciting",
			comp: "more exciting",
			sup: "the most exciting",
		},
		good: { base: "good", comp: "better", sup: "the best" },
	};
	const f = forms[adjective];
	if (a === b) return `The bike is as ${f.base} as the train. (${f.sup})`;
	if (a > b)
		return `The bike is ${f.comp} than the train. The bike has ${f.sup} score here.`;
	return `The train is ${f.comp} than the bike. The train has ${f.sup} score here.`;
}

function renderTimelineExplorer(lessonId: string): string {
	const isProgressive = lessonId === "e6-past-progressive";
	return `<div class="timeline-explorer">
		<div class="map-controls" role="group" aria-label="Zeitform umschalten">
			<button type="button" class="button secondary" data-timeline-mode="primary" aria-pressed="true">${isProgressive ? "Unterbrechung (while + when)" : "Ergebnis jetzt (present perfect)"}</button>
			<button type="button" class="button secondary" data-timeline-mode="secondary" aria-pressed="false">${isProgressive ? "Zwei parallele Handlungen" : "Fester Zeitpunkt (simple past)"}</button>
		</div>
		<svg viewBox="0 0 460 120" role="img" aria-label="Zeitstrahl zum Vergleich der englischen Zeiten">
			<line x1="28" y1="78" x2="432" y2="78" class="timeline-axis"/>
			<polygon points="432,73 444,78 432,83" class="timeline-arrow"/>
			<text x="415" y="102" class="timeline-label">NOW</text>
			<rect id="timeline-span" x="62" y="42" width="180" height="22" rx="11" class="timeline-bar"/>
			<circle id="timeline-point" cx="190" cy="53" r="9" class="timeline-dot"${isProgressive ? "" : " hidden"}/>
			<path id="timeline-bridge" d="M242 53 H415" class="timeline-bridge"${isProgressive ? " hidden" : ""}/>
			<text id="timeline-caption-a" x="152" y="30" text-anchor="middle" class="timeline-text">${isProgressive ? "was walking (länger)" : "have lost my key"}</text>
			<text id="timeline-caption-b" x="285" y="102" text-anchor="middle" class="timeline-text">${isProgressive ? "started to rain (plötzlich)" : "Resultat jetzt sichtbar"}</text>
		</svg>
		<p class="small" id="timeline-readout" lang="en" aria-live="polite">${
			isProgressive
				? "While I was walking home, it started to rain."
				: "I have lost my key, so I cannot open the door now."
		}</p>
	</div>`;
}

function renderComparisonExplorer(): string {
	return `<div class="comparison-explorer">
		<div class="comparison-controls">
			<label for="comp-adj">Adjektivtyp
				<select id="comp-adj">
					<option value="fast">einsilbig: fast → faster → the fastest</option>
					<option value="exciting">mehrsilbig: exciting → more exciting → the most exciting</option>
					<option value="good">unregelmäßig: good → better → the best</option>
				</select>
			</label>
			<label for="comp-bike">Bike (1–5)
				<input id="comp-bike" type="range" min="1" max="5" value="2">
			</label>
			<label for="comp-train">Train (1–5)
				<input id="comp-train" type="range" min="1" max="5" value="4">
			</label>
		</div>
		<p id="comp-readout" lang="en" aria-live="polite"></p>
	</div>`;
}

function renderIntonationGuide(): string {
	return `<div class="sound-guide">
		<div class="sound-card"><strong>Yes/No &amp; unsichere Tags ↗</strong><p lang="en">Are you coming? / It's warm, isn't it? ↗</p></div>
		<div class="sound-card"><strong>Wh-Fragen &amp; sichere Tags ↘</strong><p lang="en">Where are you from? / It's warm, isn't it? ↘</p></div>
		<div class="sound-card"><strong>-ed im Past / Participle</strong><p lang="en">walked /t/ · played /d/ · started /ɪd/</p></div>
	</div>`;
}

function illustration(lesson: Lesson): string {
	if (lesson.workshop.kind === "map-uk") return renderUkRegionsMap();
	if (lesson.workshop.kind === "map-us") return renderUsRegionsMap();
	if (lesson.workshop.kind === "directions") return renderTownMap();
	if (lesson.workshop.kind === "picture") return renderPictureScene();
	if (lesson.workshop.kind === "timeline")
		return renderTimelineExplorer(lesson.id);
	if (lesson.workshop.kind === "comparison") return renderComparisonExplorer();
	if (lesson.workshop.kind === "sound") return renderIntonationGuide();
	return "";
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title"><h2 id="workshop-title">Deine Entdeckerwerkstatt</h2><p>Verbinde die Bausteine. Beobachte, was sich ändert, und erreiche die drei Ziele. Du kannst jede Auswahl ändern.</p>${illustration(lesson)}<div class="construction">${lesson.workshop.goals
		.map((goal, index) => {
			const options = [
				...goal.options.slice(index + 1),
				...goal.options.slice(0, index + 1),
			];
			return `<div class="construction-row" data-goal="${index}"><span class="goal-number" aria-hidden="true">${index + 1}</span><div><label for="workshop-${index}">${esc(goal.label)}</label><div class="word-chain">${goal.before ? `<span class="word-piece" lang="en">${esc(goal.before)}</span><span aria-hidden="true">→</span>` : ""}<select id="workshop-${index}" data-workshop="${index}"><option value="">Baustein wählen…</option>${options.map((option) => `<option lang="en" value="${esc(option)}">${esc(option)}</option>`).join("")}</select>${goal.after ? `<span class="word-piece" lang="en">${esc(goal.after)}</span>` : ""}</div><p class="goal-feedback small" role="status">Ziel noch offen.</p></div></div>`;
		})
		.join("")}</div><p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p></section>`;
}

export function bindWorkshop(
	lesson: Lesson,
	container: HTMLElement,
	complete: () => void,
): void {
	const inputs = [
		...container.querySelectorAll<HTMLSelectElement>("[data-workshop]"),
	];
	for (const input of inputs)
		input.addEventListener("change", () => {
			const reached = workshopGoals(
				lesson.workshop,
				inputs.map((entry) => entry.value),
			);
			container
				.querySelectorAll<HTMLElement>("[data-goal]")
				.forEach((row, index) => {
					row.dataset.reached = String(reached[index]);
					row.querySelector(".goal-feedback")!.textContent = reached[index]
						? `✓ ${lesson.workshop.goals[index].explanation}`
						: inputs[index].value
							? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-map-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			for (const other of container.querySelectorAll("[data-map-focus]"))
				other.setAttribute(
					"aria-pressed",
					String(other === button && selected),
				);
			for (const layer of container.querySelectorAll<SVGGElement>(
				"[data-map-layer]",
			))
				layer.style.opacity =
					selected && layer.dataset.mapLayer !== button.dataset.mapFocus
						? "0.18"
						: "1";
		});

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-route]",
	))
		button.addEventListener("click", () => {
			const key = button.dataset.route as keyof typeof TOWN_ROUTES;
			const route = TOWN_ROUTES[key];
			if (!route) return;
			for (const other of container.querySelectorAll("[data-route]"))
				other.setAttribute("aria-pressed", String(other === button));
			const routePath = container.querySelector<SVGPathElement>("#town-route");
			if (routePath) {
				routePath.setAttribute("d", route.path);
				routePath.removeAttribute("hidden");
			}
			const readout = container.querySelector("#route-readout");
			if (readout) readout.textContent = route.note;
		});

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-scene-focus]",
	))
		button.addEventListener("click", () => {
			const selected = button.getAttribute("aria-pressed") !== "true";
			const zone = button.dataset.sceneFocus;
			for (const other of container.querySelectorAll("[data-scene-focus]"))
				other.setAttribute(
					"aria-pressed",
					String(other === button && selected),
				);
			for (const group of container.querySelectorAll<SVGGElement>(
				"[data-scene-zone]",
			))
				group.style.opacity =
					selected && group.dataset.sceneZone !== zone ? "0.18" : "1";
			const readout = container.querySelector("#scene-readout");
			if (readout) {
				const notes: Record<string, string> = {
					foreground:
						"In the foreground on the left there is a bench; in the middle a girl is walking her dog; on the right two musicians are playing.",
					middle:
						"In the middle ground there is a pond with a bridge, and someone is riding a bike.",
					background:
						"In the background you can see green hills and an old tower.",
				};
				readout.textContent = selected && zone ? notes[zone] : notes.foreground;
			}
		});

	for (const button of container.querySelectorAll<HTMLButtonElement>(
		"[data-timeline-mode]",
	))
		button.addEventListener("click", () => {
			const mode = button.dataset.timelineMode;
			for (const other of container.querySelectorAll("[data-timeline-mode]"))
				other.setAttribute("aria-pressed", String(other === button));
			const isProgressive = lesson.id === "e6-past-progressive";
			const dot = container.querySelector("#timeline-point");
			const bridge = container.querySelector("#timeline-bridge");
			const capA = container.querySelector("#timeline-caption-a");
			const capB = container.querySelector("#timeline-caption-b");
			const readout = container.querySelector("#timeline-readout");
			if (isProgressive) {
				if (mode === "secondary") {
					dot?.setAttribute("hidden", "");
					bridge?.setAttribute("hidden", "");
					if (capA) capA.textContent = "while Tom was cooking";
					if (capB) capB.textContent = "Mia was reading (gleichzeitig)";
					if (readout)
						readout.textContent = "While Tom was cooking, Mia was reading a book.";
				} else {
					dot?.removeAttribute("hidden");
					bridge?.setAttribute("hidden", "");
					if (capA) capA.textContent = "was walking (länger)";
					if (capB) capB.textContent = "started to rain (plötzlich)";
					if (readout)
						readout.textContent = "While I was walking home, it started to rain.";
				}
			} else if (mode === "secondary") {
				dot?.removeAttribute("hidden");
				bridge?.setAttribute("hidden", "");
				if (capA) capA.textContent = "lost my key yesterday";
				if (capB) capB.textContent = "abgeschlossen (yesterday)";
				if (readout)
					readout.textContent = "I lost my key yesterday after football training.";
			} else {
				dot?.setAttribute("hidden", "");
				bridge?.removeAttribute("hidden");
				if (capA) capA.textContent = "have lost my key";
				if (capB) capB.textContent = "Resultat jetzt sichtbar";
				if (readout)
					readout.textContent = "I have lost my key, so I cannot open the door now.";
			}
		});

	const compAdj = container.querySelector<HTMLSelectElement>("#comp-adj");
	const compBike = container.querySelector<HTMLInputElement>("#comp-bike");
	const compTrain = container.querySelector<HTMLInputElement>("#comp-train");
	if (compAdj && compBike && compTrain) {
		const update = () => {
			const adj = compAdj.value as ComparisonAdjective;
			container.querySelector("#comp-readout")!.textContent = comparisonSentence(
				Number(compBike.value),
				Number(compTrain.value),
				adj,
			);
		};
		compAdj.addEventListener("change", update);
		compBike.addEventListener("input", update);
		compTrain.addEventListener("input", update);
		update();
	}
}
