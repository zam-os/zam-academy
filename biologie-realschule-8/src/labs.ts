import { esc } from "./practice";

export type LabKind = "growth" | "immune" | "selection" | "cycle";
export type Surface = "dark" | "light" | "neutral";
export interface LabState {
	steps: number;
	limited: boolean;
	surface: Surface;
	dark: number;
	response: "first" | "memory" | "passive";
	phase: number;
}
export const freshLab = (): LabState => ({
	steps: 6,
	limited: false,
	surface: "dark",
	dark: 50,
	response: "first",
	phase: 0,
});
const integer = (n: number, max: number): boolean =>
	Number.isInteger(n) && n >= 0 && n <= max;

/** Fictional equal-step model. The cap is a teaching parameter, not a culture protocol. */
export function growthSeries(steps: number, limited: boolean): number[] {
	if (!integer(steps, 8)) throw new Error("Invalid model step");
	const values = [1];
	for (let i = 0; i < steps; i++)
		values.push(Math.min(limited ? 50 : Infinity, values[i] * 2));
	return values;
}

/** Existing heritable variants only; no mutation, drift, migration or target-directed change. */
export function selectionSeries(
	dark: number,
	surface: Surface,
	steps: number,
): number[] {
	if (
		!Number.isFinite(dark) ||
		dark < 0 ||
		dark > 100 ||
		!integer(steps, 8) ||
		!["dark", "light", "neutral"].includes(surface)
	)
		throw new Error("Invalid selection parameters");
	const values = [dark];
	for (let i = 0; i < steps; i++) {
		const p = values[i] / 100;
		const wd = surface === "dark" ? 2 : 1;
		const wl = surface === "light" ? 2 : 1;
		values.push((100 * p * wd) / (p * wd + (1 - p) * wl));
	}
	return values;
}

/** Arbitrary response units and steps, with no real pathogen, dose or protection threshold. */
export function immuneCurve(mode: LabState["response"]): number[] {
	if (!["first", "memory", "passive"].includes(mode))
		throw new Error("Invalid response");
	return Array.from({ length: 13 }, (_, i) => {
		if (mode === "passive") return 100 * 0.8 ** i;
		if (mode === "memory")
			return i < 1 ? 0 : Math.min(90, i * 20) * (i > 8 ? 0.95 ** (i - 8) : 1);
		return i < 3
			? 0
			: Math.min(60, (i - 2) * 10) * (i > 8 ? 0.85 ** (i - 8) : 1);
	});
}
export const CYCLE = [
	{
		title: "Follikelreifung",
		detail:
			"FSH unterstützt die Reifung. Östrogene tragen zum Aufbau der Gebärmutterschleimhaut bei.",
	},
	{
		title: "Eisprung",
		detail:
			"Ein LH-Anstieg löst die Freisetzung der Eizelle aus dem Eierstock aus.",
	},
	{
		title: "Gelbkörperphase",
		detail:
			"Der Gelbkörper bildet unter anderem Progesteron; die Schleimhaut wird umgestaltet und erhalten.",
	},
	{
		title: "Ohne Schwangerschaft",
		detail:
			"Bei Rückbildung des Gelbkörpers sinken Hormonspiegel; die Menstruation folgt. Die zeitlichen Abstände variieren.",
	},
] as const;
const number = (value: number) =>
	new Intl.NumberFormat("de-DE", { maximumFractionDigits: 1 }).format(value);

function chart(values: number[], label: string, fixedMax?: number): string {
	const max = fixedMax ?? Math.max(1, ...values);
	const x = (i: number) => 45 + (i * 540) / Math.max(1, values.length - 1);
	const y = (value: number) => 205 - (155 * value) / max;
	return `<svg class="bio-chart" viewBox="0 0 640 260" role="img" aria-label="${esc(label)}"><text x="45" y="20">${esc(label)}</text><path class="chart-axis" d="M45 40V205H600"/><text x="10" y="55">${number(max)}</text><text x="22" y="210">0</text><polyline class="chart-line" points="${values.map((v, i) => `${x(i)},${y(v)}`).join(" ")}"/>${values.map((v, i) => `<circle class="chart-dot" cx="${x(i)}" cy="${y(v)}" r="4"/><text x="${x(i)}" y="226" text-anchor="middle">${i}</text>`).join("")}<text x="240" y="250">Modellschritt / Generation</text></svg><div class="table-scroll"><table><caption>Werte zum Diagramm</caption><thead><tr><th>Schritt</th><th>${esc(label)}</th></tr></thead><tbody>${values.map((v, i) => `<tr><th scope="row">${i}</th><td>${number(v)}</td></tr>`).join("")}</tbody></table></div>`;
}
function output(kind: LabKind, state: LabState): string {
	if (kind === "cycle") {
		const phase = CYCLE[state.phase];
		return `<ol class="cycle-steps">${CYCLE.map((p, i) => `<li ${i === state.phase ? 'aria-current="step"' : ""}>${esc(p.title)}</li>`).join("")}</ol><h3>${esc(phase.title)}</h3><p>${esc(phase.detail)}</p><p class="small">Allgemeine Stationen ohne feste Tage. Keine persönlichen Zyklusdaten, keine Vorhersage fruchtbarer Tage und kein Verhütungskalender.</p>`;
	}
	if (kind === "growth")
		return `${chart(growthSeries(state.steps, state.limited), "Modellanzahl")}<p class="small">Ein Modell startet bei einer Einheit und verdoppelt je Schritt. Im begrenzten Vergleich wird bei 50 gedeckelt. Diese frei gewählte Grenze, die gleichen Schritte und die Verdopplung sind keine Messdaten und keine Anleitung zur Kultur von Mikroorganismen.</p>`;
	if (kind === "selection")
		return `${chart(selectionSeries(state.dark, state.surface, state.steps), "Dunkle Variante in Prozent", 100)}<p class="small">Erfundene vererbbare Farbvarianten. Auf dunklem Untergrund erhält die dunkle Variante im Modell das doppelte Fortpflanzungsgewicht, auf hellem die helle; neutral sind beide gleich. Keine neue Mutation wird erzeugt. Zufallsdrift, wechselnde Populationen und weitere Evolutionsprozesse fehlen.</p>`;
	return `${chart(immuneCurve(state.response), "Antwort in freien Einheiten", 100)}<p class="small">Fiktive Kurven: Erstkontakt, erneuter Kontakt oder zugeführte Antikörper. Schritte, Mengen und Verlauf sind frei gewählt. Keine reale Krankheit, kein Dosierungsmodell, kein Schutzgrenzwert und keine individuelle Gesundheitsvorhersage.</p>`;
}
const TITLES: Record<LabKind, string> = {
	growth: "Wachstum vergleichen",
	immune: "Abwehrantworten vergleichen",
	selection: "Selektion untersuchen",
	cycle: "Zyklusstationen erkunden",
};
export function renderLab(kind: LabKind, state: LabState): string {
	const steps = `<label>Modellschritte: <output data-value="steps">${state.steps}</output><input type="range" aria-label="Modellschritte" data-lab="steps" min="0" max="8" step="1" value="${state.steps}"></label>`;
	const controls =
		kind === "growth"
			? `${steps}<label><input type="checkbox" data-lab="limited" ${state.limited ? "checked" : ""}>Endlichen Modellplatz vergleichen</label>`
			: kind === "selection"
				? `${steps}<label>Anfangsanteil dunkel: <output data-value="dark">${state.dark}</output> %<input type="range" aria-label="Anfangsanteil dunkel in Prozent" data-lab="dark" min="0" max="100" step="10" value="${state.dark}"></label><label>Untergrund<select data-lab="surface">${[
						["dark", "dunkel"],
						["light", "hell"],
						["neutral", "neutral"],
					]
						.map(
							([v, t]) =>
								`<option value="${v}" ${state.surface === v ? "selected" : ""}>${t}</option>`,
						)
						.join("")}</select></label>`
				: kind === "immune"
					? `<label>Vergleich<select data-lab="response">${[
							["first", "Erstkontakt"],
							["memory", "Erneuter Kontakt"],
							["passive", "Zugeführte Antikörper"],
						]
							.map(
								([v, t]) =>
									`<option value="${v}" ${state.response === v ? "selected" : ""}>${t}</option>`,
							)
							.join("")}</select></label>`
					: `<label>Station<select data-lab="phase">${CYCLE.map((p, i) => `<option value="${i}" ${state.phase === i ? "selected" : ""}>${esc(p.title)}</option>`).join("")}</select></label>`;
	return `<section class="panel lab" id="lab"><div class="eyebrow">Ausprobieren</div><h2>${TITLES[kind]}</h2><p>Vergleiche mindestens zwei Einstellungen. Beschreibe, was sich verändert und was das Modell offenlässt.</p><div class="lab-controls">${controls}</div><div data-lab-output>${output(kind, state)}</div></section>`;
}

export function mountLab(
	host: HTMLElement,
	kind: LabKind,
	state: LabState,
): void {
	host
		.querySelectorAll<HTMLInputElement | HTMLSelectElement>("[data-lab]")
		.forEach((control) => {
			control.addEventListener("input", () => {
				const key = control.dataset.lab;
				if (key === "steps" || key === "dark" || key === "phase")
					state[key] = Number(control.value);
				if (key === "limited" && control instanceof HTMLInputElement)
					state.limited = control.checked;
				if (key === "surface") state.surface = control.value as Surface;
				if (key === "response")
					state.response = control.value as LabState["response"];
				host.querySelector<HTMLElement>("[data-lab-output]")!.innerHTML =
					output(kind, state);
				host
					.querySelectorAll<HTMLOutputElement>("[data-value]")
					.forEach((o) => {
						o.value = String(
							o.dataset.value === "steps" ? state.steps : state.dark,
						);
					});
				// Controls remain mounted, so range input keeps keyboard focus.
			});
		});
}
