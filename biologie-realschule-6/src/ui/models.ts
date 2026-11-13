import type { Lesson } from "../model/types";
import {
	foodwebPattern,
	germination,
	MODEL_SCENARIOS,
	type ModelState,
	temperaturePattern,
} from "../models";
import { esc } from "../workshop";
export { initialModelState, type ModelState } from "../models";
const toggle = (key: keyof ModelState, label: string, value: boolean) =>
	`<label><input type="checkbox" data-model-toggle="${key}" ${value ? "checked" : ""}> ${label}</label>`;
const flowerTexts = [
	"Längsschnitt einer vereinfachten Blüte: Staubbeutel bilden Pollen; im Fruchtknoten liegen Samenanlagen mit Eizellen.",
	"Bestäubung: Pollen gelangt auf eine passende Narbe. Noch sind keine Keimzellen verschmolzen.",
	"Befruchtung: Ein Pollenschlauch führt männliche Keimzellen zur Samenanlage. Eine männliche Keimzelle verschmilzt mit der Eizelle.",
	"Nach der Befruchtung: Aus Samenanlagen werden Samen, aus dem Fruchtknoten wird die Frucht. Andere Blütenteile können je nach Art beteiligt sein.",
];
function flower(state: ModelState): string {
	const phase = state.phase;
	return `<label for="flower-phase">Entwicklungsschritt <select id="flower-phase" data-model-select="phase">${["Blütenbau", "Bestäubung", "Befruchtung", "Samen und Frucht"].map((label, i) => `<option value="${i}" ${phase === i ? "selected" : ""}>${label}</option>`).join("")}</select></label>
  <svg viewBox="0 0 560 300" role="img" aria-label="${esc(flowerTexts[phase])}"><path class="petal" d="M280 220 Q120 230 130 70 Q245 50 280 165 Q320 40 440 70 Q445 220 280 220"/><path class="stem" d="M280 270V90"/><ellipse class="ovary" cx="280" cy="215" rx="44" ry="35"/><ellipse class="nucleus" cx="280" cy="215" rx="11" ry="17"/><path class="stem" d="M205 205V115 M355 205V115"/><ellipse class="anther" cx="205" cy="110" rx="18" ry="10"/><ellipse class="anther" cx="355" cy="110" rx="18" ry="10"/><path class="stem" d="M261 90h38"/>
  ${phase >= 1 ? '<circle class="pollen" cx="275" cy="83" r="6"/><circle class="pollen" cx="290" cy="83" r="6"/>' : ""}
  ${phase === 2 ? '<path class="pollen-tube" d="M275 85Q262 140 280 210"/>' : ""}
  ${phase === 3 ? '<ellipse class="fruit" cx="280" cy="215" rx="58" ry="45"/><ellipse class="seed" cx="280" cy="215" rx="12" ry="17"/>' : ""}
  <text x="15" y="100">Staubbeutel</text><text x="310" y="65">Narbe</text><text x="305" y="150">Griffel</text><text x="345" y="245">${phase === 3 ? "Frucht mit Samen" : "Fruchtknoten"}</text></svg><p role="status">${flowerTexts[phase]}</p>`;
}
export function renderModel(
	lesson: Lesson,
	explored: string[],
	state: ModelState,
): string {
	const kind = lesson.model!;
	let body = "";
	if (kind === "flower") body = flower(state);
	if (kind === "germination") {
		const result = germination(state);
		body = `<div class="model-controls">${toggle("water", "Wasser vorhanden", state.water)}${toggle("air", "Ausreichend Sauerstoff", state.air)}${toggle("warm", "Geeignete Temperatur", state.warm)}${toggle("light", "Licht vorhanden", state.light)}</div>
    <div class="seed-model" role="img" aria-label="${result.germinates ? "Bohne kann keimen" : "Bedingungen für Keimung nicht vollständig erfüllt"}"><span aria-hidden="true">${result.germinates ? (result.growsGreen ? "🌱" : "◉") : "●"}</span><strong>${result.germinates ? "Keimung im Modell möglich" : "Keimbedingungen unvollständig"}</strong></div><p role="status">${result.germinates ? (result.growsGreen ? "Mit Licht kann die grüne Pflanze anschließend weiterwachsen." : "Die Bohne kann im Dunkeln keimen. Auf Dauer fehlt Licht für grünes Wachstum.") : "Wasser, Sauerstoff und geeignete Temperatur müssen gemeinsam vorhanden sein."}</p><p class="small">Vereinfachtes Modell eines lebensfähigen Bohnensamens; andere Arten und echte Versuche können abweichen.</p>`;
	}
	if (kind === "temperature")
		body = `<div class="model-controls"><label>Tier <select data-model-select="animal"><option value="bird" ${state.animal === "bird" ? "selected" : ""}>Amsel · gleichwarm</option><option value="lizard" ${state.animal === "lizard" ? "selected" : ""}>Eidechse · wechselwarm</option></select></label><label>Außentemperatur: <output>${state.temperature} °C</output><input type="range" min="0" max="35" step="1" value="${state.temperature}" data-model-range="temperature"></label></div><div class="thermal-model" role="img" aria-label="${state.animal === "bird" ? "Vergleichsweise stabile" : "Stärker umgebungsabhängige"} Körpertemperatur"><span aria-hidden="true">${state.animal === "bird" ? "🐦" : "🦎"}</span><span>${state.temperature <= 5 ? "Kühle Umgebung" : state.temperature >= 30 ? "Warme Umgebung" : "Mäßige Umgebung"}</span></div><p role="status">${temperaturePattern(state)}</p><p class="small">Qualitativer Vergleich; keine gemessene Körpertemperatur oder genaue Vorhersage für eine Art.</p>`;
	if (kind === "foodweb")
		body = `<div class="model-controls">${toggle("leaves", "Ausreichendes Blattangebot", state.leaves)}${toggle("alternative", "Weitere Insektennahrung für die Meise", state.alternative)}</div><div class="food-chain" role="img" aria-label="Blatt wird von Raupe gefressen, Raupe von Meise, Meise von Sperber. ${state.alternative ? "Weitere Insekten liefern alternative Nahrung für die Meise." : ""}"><span class="${state.leaves ? "" : "reduced"}">Blatt</span><b>→</b><span>Raupe</span><b>→</b><span>Meise</span><b>→</b><span>Sperber</span></div>${state.alternative ? '<p class="alternative-path">Weitere Insekten → Meise</p>' : ""}<p role="status">${foodwebPattern(state)}</p><p class="small">Die Pfeile zeigen Nahrung → Fresser. Das Netz zeigt mögliche Beziehungen, keine exakten Bestände oder sofortigen Reaktionen.</p>`;
	return `<section class="panel exploration"><span class="eyebrow">ENTDECKEN · VERÄNDERN · VERGLEICHEN</span><h2>Dein biologisches Modell</h2><p>Verändere die Einstellungen und lies die Wirkung. Halte deine Beobachtung fest, sobald du ein Ziel geprüft hast.</p>${body}<button type="button" class="button secondary" id="record-model">Beobachtung festhalten</button><ul class="model-goals">${MODEL_SCENARIOS[kind].map((goal) => `<li>${explored.includes(goal.id) ? "✓" : "○"} ${esc(goal.title)}</li>`).join("")}</ul><p class="small">Die Ziele prüfen gewählte Modellzustände. Ob du die Erklärung verstanden hast, besprichst du mit deiner eigenen Antwort.</p></section>`;
}
