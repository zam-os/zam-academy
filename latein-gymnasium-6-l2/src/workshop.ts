import {
	aciTransform,
	conjugateVerb,
	declineNoun,
	numeralSpec,
	syllableStress,
	type Casus,
	type NounId,
	type Numerus,
	type TenseId,
	type VerbId,
} from "./latin-models";
import { renderItalyMap, renderRomeMap } from "./maps";
import { esc } from "./practice";
import {
	OLYMPIER_GROUPS,
	renderAciLab,
	renderAciSvg,
	renderConceptDiagram,
	renderDeclensionLab,
	renderDeclensionSvg,
	renderGoalProgressSvg,
	renderNumeralLab,
	renderNumeralSvg,
	renderOlympierSvg,
	renderSyllableLab,
	renderSyllableSvg,
	renderTimelineSvg,
	renderVerbLab,
	renderVerbSvg,
	TIMELINE_EPOCHS,
} from "./svg-visuals";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, i) => answers[i] === goal.answer);
}

function visualForLesson(lesson: Lesson): string {
	switch (lesson.workshop.kind) {
		case "syllable":
			return renderSyllableLab();
		case "declension":
			return renderDeclensionLab(lesson.id === "l6-dritte-deklination");
		case "numeral":
			return renderNumeralLab();
		case "verb":
			return renderVerbLab("verb");
		case "tense":
			return renderVerbLab("tense");
		case "irregular":
			return renderVerbLab("irregular");
		case "aci":
			return renderAciLab();
		case "rome":
			return renderRomeMap();
		case "italy":
			return renderItalyMap();
		case "timeline":
			return renderTimelineSvg();
		case "olympiers":
			return renderOlympierSvg();
		case "concept":
		default:
			return renderConceptDiagram(lesson);
	}
}

export function renderWorkshop(lesson: Lesson): string {
	return `<section class="panel workshop" aria-labelledby="workshop-title">
		<div class="panel-heading">
			<h2 id="workshop-title">Deine Entdeckerwerkstatt</h2>
			<div id="goal-meter">${renderGoalProgressSvg(0)}</div>
		</div>
		<p>Probiere das interaktive Schaubild aus und verbinde die passenden Bausteine zu allen drei Zielen.</p>
		${visualForLesson(lesson)}
		<div class="construction">${lesson.workshop.goals
			.map(
				(goal, i) => `<div class="construction-row" data-goal="${i}">
					<span class="goal-number" aria-hidden="true">${i + 1}</span>
					<div>
						<label for="workshop-${i}">${esc(goal.label)}</label>
						<div class="word-chain">
							<span class="word-piece" lang="la">${esc(goal.before)}</span>
							<span aria-hidden="true">→</span>
							<select id="workshop-${i}" data-workshop="${i}">
								<option value="">Baustein wählen…</option>
								${[...goal.options.slice(i + 1), ...goal.options.slice(0, i + 1)]
									.map(
										(option) =>
											`<option lang="la" value="${esc(option)}">${esc(option)}</option>`,
									)
									.join("")}
							</select>
							${goal.after ? `<span class="word-piece" lang="la">${esc(goal.after)}</span>` : ""}
						</div>
						<p class="goal-feedback small" role="status">Ziel noch offen.</p>
					</div>
				</div>`,
			)
			.join("")}</div>
		<p id="workshop-status" role="status">0 von 3 Zielen erreicht.</p>
	</section>`;
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
				.forEach((row, i) => {
					row.dataset.reached = String(reached[i]);
					row.querySelector(".goal-feedback")!.textContent = reached[i]
						? `✓ ${lesson.workshop.goals[i].explanation}`
						: inputs[i].value
							? "Noch offen. Vergleiche den Baustein mit der Erklärung und dem Material."
							: "Ziel noch offen.";
				});
			const count = reached.filter(Boolean).length;
			const meter = container.querySelector("#goal-meter");
			if (meter) meter.innerHTML = renderGoalProgressSvg(count);
			container.querySelector("#workshop-status")!.textContent =
				`${count} von 3 Zielen erreicht.${count === 3 ? " Werkstatt gespeichert." : ""}`;
			if (count === 3) complete();
		});

	// Map layer focus toggles (Rome & Italy)
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

	// Concept 3-part SVG diagram interactions
	if (lesson.workshop.nodes) {
		const nodes = lesson.workshop.nodes;
		const readout = container.querySelector("[data-diagram-readout]");
		const focusPart = (index: number) => {
			container
				.querySelectorAll<HTMLElement>("[data-diagram-focus], [data-diagram-btn]")
				.forEach((el) => {
					const idx = Number(
						el.dataset.diagramFocus ?? el.dataset.diagramBtn ?? -1,
					);
					el.setAttribute("aria-pressed", String(idx === index));
					el.classList.toggle("is-active", idx === index);
				});
			if (readout && nodes[index]) {
				readout.innerHTML = `<strong>${esc(nodes[index].label)}:</strong> ${esc(nodes[index].explanation)}`;
			}
		};
		focusPart(0);
		for (const el of container.querySelectorAll<HTMLElement>(
			"[data-diagram-focus], [data-diagram-btn]",
		)) {
			const idx = Number(el.dataset.diagramFocus ?? el.dataset.diagramBtn ?? 0);
			el.addEventListener("click", () => focusPart(idx));
			el.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					focusPart(idx);
				}
			});
		}
	}

	// Syllable explorer
	const sylSelect = container.querySelector<HTMLSelectElement>("#syllable-select");
	if (sylSelect) {
		const update = () => {
			const spec = syllableStress(sylSelect.value);
			container.querySelector("#syllable-svg")!.innerHTML = renderSyllableSvg(
				spec.id,
			);
			container.querySelector("#syllable-readout")!.textContent = spec.rule;
		};
		sylSelect.addEventListener("change", update);
		update();
	}

	// Declension lab
	const declNoun = container.querySelector<HTMLSelectElement>("#decl-noun");
	const declNum = container.querySelector<HTMLSelectElement>("#decl-num");
	const declCasus = container.querySelector<HTMLSelectElement>("#decl-casus");
	if (declNoun && declNum && declCasus) {
		const update = () => {
			const n = declNoun.value as NounId;
			const num = declNum.value as Numerus;
			const c = declCasus.value as Casus;
			const res = declineNoun(n, num, c);
			container.querySelector("#decl-svg")!.innerHTML = renderDeclensionSvg(
				n,
				num,
				c,
			);
			container.querySelector("#decl-readout")!.textContent =
				`${res.full} (${res.meaning}): ${res.question}`;
		};
		declNoun.addEventListener("change", update);
		declNum.addEventListener("change", update);
		declCasus.addEventListener("change", update);
		update();
	}

	// Roman numeral slider
	const numSlider = container.querySelector<HTMLInputElement>("#numeral-slider");
	if (numSlider) {
		const update = () => {
			const n = Number(numSlider.value);
			const spec = numeralSpec(n);
			container.querySelector("#numeral-svg")!.innerHTML = renderNumeralSvg(n);
			container.querySelector("#numeral-readout")!.textContent =
				`${spec.value} = ${spec.roman} · Kardinalzahl: ${spec.cardinal} · Ordinalzahl: ${spec.ordinal}.`;
		};
		numSlider.addEventListener("input", update);
		update();
	}

	// Verb / tense / irregular conjugation lab
	const verbSel = container.querySelector<HTMLSelectElement>("#verb-id");
	const tenseSel = container.querySelector<HTMLSelectElement>("#verb-tense");
	const personSel = container.querySelector<HTMLSelectElement>("#verb-person");
	if (verbSel && tenseSel && personSel) {
		const update = () => {
			const v = verbSel.value as VerbId;
			const t = tenseSel.value as TenseId;
			const p = Number(personSel.value);
			const res = conjugateVerb(v, t, p);
			container.querySelector("#verb-svg")!.innerHTML = renderVerbSvg(v, t, p);
			container.querySelector("#verb-readout")!.textContent =
				`${res.full} = „${res.translation}“ (Stamm: ${res.stem} · Zeichen: ${res.marker || "∅"} · Endung: ${res.ending || "∅"}).`;
		};
		verbSel.addEventListener("change", update);
		tenseSel.addEventListener("change", update);
		personSel.addEventListener("change", update);
		update();
	}

	// AcI transformer lab
	const aciHead = container.querySelector<HTMLSelectElement>("#aci-head");
	const aciInf = container.querySelector<HTMLSelectElement>("#aci-inf");
	if (aciHead && aciInf) {
		const update = () => {
			const h = aciHead.value as "praesens" | "perfekt";
			const inf = aciInf.value as "praesens" | "perfekt";
			const res = aciTransform(h, inf);
			container.querySelector("#aci-svg")!.innerHTML = renderAciSvg(h, inf);
			container.querySelector("#aci-readout")!.textContent =
				`${res.german} — ${res.rule}`;
		};
		aciHead.addEventListener("change", update);
		aciInf.addEventListener("change", update);
		update();
	}

	// Timeline interactive nodes
	const timelineReadout = container.querySelector("[data-timeline-readout]");
	if (timelineReadout) {
		const selectEpoch = (index: number) => {
			const ep = TIMELINE_EPOCHS[index];
			if (!ep) return;
			container
				.querySelectorAll<HTMLElement>("[data-timeline-focus], [data-timeline-btn]")
				.forEach((el) => {
					const idx = Number(
						el.dataset.timelineFocus ?? el.dataset.timelineBtn ?? -1,
					);
					el.setAttribute("aria-pressed", String(idx === index));
					el.classList.toggle("is-active", idx === index);
				});
			timelineReadout.innerHTML = `<strong>${esc(ep.title)} (${esc(ep.year)}):</strong> ${esc(ep.text)}`;
		};
		for (const el of container.querySelectorAll<HTMLElement>(
			"[data-timeline-focus], [data-timeline-btn]",
		)) {
			const idx = Number(el.dataset.timelineFocus ?? el.dataset.timelineBtn ?? 0);
			el.addEventListener("click", () => selectEpoch(idx));
			el.addEventListener("keydown", (event) => {
				if (event.key === "Enter" || event.key === " ") {
					event.preventDefault();
					selectEpoch(idx);
				}
			});
		}
	}

	// Olympier interactive groups
	const olympierReadout = container.querySelector("[data-olympier-readout]");
	const olympierSvg = container.querySelector("[data-olympier-lab] svg");
	if (olympierReadout && olympierSvg) {
		for (const btn of container.querySelectorAll<HTMLButtonElement>(
			"[data-olympier-btn]",
		)) {
			btn.addEventListener("click", () => {
				const idx = Number(btn.dataset.olympierBtn ?? 0);
				const cards = OLYMPIER_GROUPS[idx] ?? OLYMPIER_GROUPS[0];
				for (const other of container.querySelectorAll("[data-olympier-btn]"))
					other.setAttribute("aria-pressed", String(other === btn));
				olympierSvg.innerHTML = cards
					.map((c, i) => {
						const x = 14 + i * 146;
						return `<rect x="${x}" y="20" width="134" height="142" rx="12" class="node-box"/>
							<text x="${x + 67}" y="54" text-anchor="middle" class="node-title">${esc(c.gr)}</text>
							<text x="${x + 67}" y="82" text-anchor="middle" class="node-detail">${esc(c.la)}</text>
							<text x="${x + 67}" y="122" text-anchor="middle" class="node-hint">${esc(c.domain)}</text>`;
					})
					.join("");
				olympierReadout.textContent = cards
					.map((c) => `${c.gr} = ${c.la} (${c.domain})`)
					.join(" · ");
			});
		}
	}
}
