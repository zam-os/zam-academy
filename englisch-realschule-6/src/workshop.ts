import { esc } from "./practice";
import {
	renderBritainRegionsMap,
	renderLondonMap,
	renderStreetMap,
	renderUsaMap,
} from "./places-map";
import type { Lesson, Workshop } from "./types";

export function workshopGoals(
	workshop: Workshop,
	answers: string[],
): boolean[] {
	return workshop.goals.map((goal, index) => answers[index] === goal.answer);
}

/** Format numbers for German learner text: decimal comma and U+2212 minus. */
export function fmtDe(value: number, decimals = 0): string {
	const rounded = Number(value.toFixed(decimals));
	const normalized = Object.is(rounded, -0) ? 0 : rounded;
	return new Intl.NumberFormat("de-DE", {
		minimumFractionDigits: decimals,
		maximumFractionDigits: decimals,
	})
		.format(normalized)
		.replace(/-/g, "\u2212");
}

export function fahrenheitToCelsius(fahrenheit: number): number {
	return ((fahrenheit - 32) * 5) / 9;
}

export function weatherGuidance(fahrenheit: number): string {
	const f = Math.round(fahrenheit);
	if (f <= 32) return "Freezing! Frost und Schnee (0 °C oder darunter).";
	if (f <= 54) return "Chilly / cool: Jacke oder Pullover einpacken.";
	if (f <= 74) return "Mild und angenehm: ideal für Sport im Freien.";
	return "Warm bis heiß: Sonnenschutz und Wasser nicht vergessen.";
}

export function comparisonSentence(aHeight: number, bHeight: number): {
	en: string;
	de: string;
} {
	const a = Math.round(aHeight);
	const b = Math.round(bHeight);
	if (a === b) {
		return {
			en: "Tower A is as tall as Tower B.",
			de: `Beide Türme sind genau gleich hoch (${a} m).`,
		};
	}
	if (a > b) {
		return {
			en: "Tower A is taller than Tower B. Tower B is not as tall as Tower A.",
			de: `Turm A (${a} m) überragt Turm B (${b} m).`,
		};
	}
	return {
		en: "Tower B is taller than Tower A. Tower A is not as tall as Tower B.",
		de: `Turm B (${b} m) überragt Turm A (${a} m).`,
	};
}

export function timelineLabel(minute: number): {
	time: string;
	en: string;
	de: string;
} {
	const m = Math.max(0, Math.min(60, Math.round(minute)));
	const time =
		m === 60 ? "17:00" : `16:${String(m).padStart(2, "0")}`;
	if (m === 35) {
		return {
			time,
			en: "At 4:35 p.m., her phone rang while Maya was reading.",
			de: "Genau um 16:35 Uhr unterbricht ein kurzes Ereignis (Simple Past: rang) die laufende Handlung (Past Progressive: was reading).",
		};
	}
	if (m < 35) {
		return {
			time,
			en: `At ${time}, Maya was reading in the park (background action).`,
			de: "Vor dem Anruf ist die Handlung schon im Gang: Past Progressive (was reading).",
		};
	}
	return {
		time,
		en: `At ${time}, she was still sitting in the park and talking or reading.`,
		de: "Nach dem kurzen Klingeln läuft das Geschehen im Hintergrund weiter.",
	};
}

function renderWeatherExplorer(): string {
	return `<div class="weather-explorer">
		<label for="weather-slider">Temperatur in den USA einstellen: 14 °F bis 95 °F</label>
		<input id="weather-slider" type="range" min="14" max="95" value="68">
		<p id="weather-readout" aria-live="polite"></p>
		<p id="weather-tip" class="small" aria-live="polite"></p>
	</div>`;
}

function renderCompareExplorer(): string {
	return `<div class="compare-explorer">
		<svg viewBox="0 0 360 150" role="img" aria-label="Vergleich zweier Türme nach Höhe">
			<rect x="64" y="130" width="232" height="4" class="river-line"/>
			<rect id="bar-a" x="92" y="40" width="56" height="90" rx="6" class="compare-bar"/>
			<rect id="bar-b" x="212" y="60" width="56" height="70" rx="6" class="compare-bar-alt"/>
			<text x="120" y="145" text-anchor="middle">Tower A</text>
			<text x="240" y="145" text-anchor="middle">Tower B</text>
		</svg>
		<div class="compare-controls">
			<label for="compare-a">Tower A: <span id="compare-a-val">90 m</span></label>
			<input id="compare-a" type="range" min="40" max="120" step="10" value="90">
			<label for="compare-b">Tower B: <span id="compare-b-val">70 m</span></label>
			<input id="compare-b" type="range" min="40" max="120" step="10" value="70">
			<p id="compare-en" lang="en" aria-live="polite"></p>
			<p id="compare-de" class="small" aria-live="polite"></p>
		</div>
	</div>`;
}

function renderTimelineExplorer(): string {
	return `<div class="timeline-explorer">
		<svg viewBox="0 0 500 120" role="img" aria-label="Zeitstrahl von 16:00 bis 17:00 Uhr: Past Progressive als Hintergrund und Simple Past als kurzer Punkt">
			<text x="250" y="24" text-anchor="middle">was reading (16:00–17:00)</text>
			<line x1="40" y1="68" x2="460" y2="68" class="timeline-axis"/>
			<rect x="75" y="44" width="350" height="14" rx="7" class="compare-bar"/>
			<circle cx="279" cy="68" r="8" class="compare-bar-alt"/>
			<text x="279" y="102" text-anchor="middle">16:35 phone rang</text>
			<line id="timeline-cursor" x1="180" y1="36" x2="180" y2="86" class="timeline-cursor"/>
		</svg>
		<label for="timeline-slider">Zeitpunkt auf dem Zeitstrahl wählen: 16:00 bis 17:00 Uhr</label>
		<input id="timeline-slider" type="range" min="0" max="60" step="5" value="20">
		<p id="timeline-readout" lang="en" aria-live="polite"></p>
		<p id="timeline-note" class="small" aria-live="polite"></p>
	</div>`;
}

function renderMediaChart(): string {
	const items = [
		{ label: "Messaging friends", pct: 80 },
		{ label: "Watching clips", pct: 70 },
		{ label: "School research", pct: 45 },
		{ label: "Sharing location publicly", pct: 10 },
	];
	return `<figure class="places-map"><svg viewBox="0 0 480 185" role="img" aria-label="Beispielumfrage Klasse 6b zur Mediennutzung (erfundene Übungswerte)">
		${items
			.map((item, idx) => {
				const y = 18 + idx * 40;
				const width = Math.round(item.pct * 2.5);
				return `<text x="12" y="${y + 18}" class="region-name">${esc(item.label)}</text>
				<rect x="176" y="${y + 4}" width="${width}" height="20" rx="6" class="compare-bar"/>
				<text x="${184 + width}" y="${y + 18}" class="region-name">${item.pct} %</text>`;
			})
			.join("")}
	</svg><figcaption>Erfundene Beispielumfrage (Klasse 6b · Übungsmaterial, keine echte Statistik): Vergleiche die Balken für Chancen und Risiken.</figcaption></figure>`;
}

function renderComicFrame(): string {
	return `<figure class="places-map"><svg viewBox="0 0 540 160" role="img" aria-label="Dreiteilige Bildergeschichte zu einem verpassten Zug">
		<rect x="10" y="14" width="164" height="128" rx="10" class="land"/>
		<text x="22" y="36" class="region-name">1 · Before the trip</text>
		<text x="22" y="68">Leo packs his bag</text>
		<text x="22" y="92">and checks the app.</text>
		<rect x="188" y="14" width="164" height="128" rx="10" class="land"/>
		<text x="200" y="36" class="region-name">2 · Then at the station</text>
		<text x="200" y="68">“Oh no! The train</text>
		<text x="200" y="92">has just left!”</text>
		<rect x="366" y="14" width="164" height="128" rx="10" class="land"/>
		<text x="378" y="36" class="region-name">3 · So next…</text>
		<text x="378" y="68">They buy two new</text>
		<text x="378" y="92">tickets for 10:15.</text>
	</svg><figcaption>Aufbau einer kurzen Bildergeschichte: zeitliche Reihenfolge (before → then → so) und wörtliche Rede.</figcaption></figure>`;
}

function illustration(lesson: Lesson): string {
	if (lesson.workshop.kind === "usa-map") return renderUsaMap();
	if (lesson.workshop.kind === "london-map") return renderLondonMap();
	if (lesson.workshop.kind === "britain-regions")
		return renderBritainRegionsMap();
	if (lesson.workshop.kind === "street-map") return renderStreetMap();
	if (lesson.workshop.kind === "weather") return renderWeatherExplorer();
	if (lesson.workshop.kind === "compare-scale") return renderCompareExplorer();
	if (lesson.workshop.kind === "timeline") return renderTimelineExplorer();
	if (lesson.workshop.kind === "media-chart") return renderMediaChart();
	if (lesson.workshop.kind === "comic-frame") return renderComicFrame();
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

	const weather = container.querySelector<HTMLInputElement>("#weather-slider");
	if (weather) {
		const update = () => {
			const f = Number(weather.value);
			const c = fahrenheitToCelsius(f);
			container.querySelector("#weather-readout")!.textContent =
				`${fmtDe(f)} °F entsprechen etwa ${fmtDe(c, 1)} °C.`;
			container.querySelector("#weather-tip")!.textContent = weatherGuidance(f);
		};
		weather.addEventListener("input", update);
		update();
	}

	const compareA = container.querySelector<HTMLInputElement>("#compare-a");
	const compareB = container.querySelector<HTMLInputElement>("#compare-b");
	if (compareA && compareB) {
		const update = () => {
			const a = Number(compareA.value);
			const b = Number(compareB.value);
			container.querySelector("#compare-a-val")!.textContent = `${fmtDe(a)} m`;
			container.querySelector("#compare-b-val")!.textContent = `${fmtDe(b)} m`;
			const barA = container.querySelector("#bar-a")!;
			const barB = container.querySelector("#bar-b")!;
			barA.setAttribute("y", String(130 - a));
			barA.setAttribute("height", String(a));
			barB.setAttribute("y", String(130 - b));
			barB.setAttribute("height", String(b));
			const msg = comparisonSentence(a, b);
			container.querySelector("#compare-en")!.textContent = msg.en;
			container.querySelector("#compare-de")!.textContent = msg.de;
		};
		compareA.addEventListener("input", update);
		compareB.addEventListener("input", update);
		update();
	}

	const timeline = container.querySelector<HTMLInputElement>("#timeline-slider");
	if (timeline) {
		const update = () => {
			const minute = Number(timeline.value);
			const x = 75 + (minute / 60) * 350;
			const cursor = container.querySelector("#timeline-cursor")!;
			cursor.setAttribute("x1", String(x));
			cursor.setAttribute("x2", String(x));
			const info = timelineLabel(minute);
			container.querySelector("#timeline-readout")!.textContent =
				`${info.time} · ${info.en}`;
			container.querySelector("#timeline-note")!.textContent = info.de;
		};
		timeline.addEventListener("input", update);
		update();
	}
}
