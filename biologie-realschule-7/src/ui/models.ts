import type { Lesson, ModelKind } from "../model/types";
import { MODEL_SCENARIOS } from "../models";
import { esc } from "../workshop";

const HEADINGS: Record<ModelKind, string> = {
	cells: "Drei Zelltypen im Vergleich",
	plant: "Verfolge den Stofftransport",
	photosynthesis: "Was ändert sich mit dem Licht?",
	circulation: "Verfolge eine Runde im Blutkreislauf",
	ear: "Wandere mit dem Schall durchs Ohr",
	hormones: "Teste die Blutzuckerregulation",
};

function cells(id: string): string {
	const animal = id === "animal";
	const leaf = id === "leaf";
	return `
		${animal ? '<path d="M56 96Q40 49 111 31Q163 12 215 49Q268 73 242 118Q223 154 158 154Q93 164 56 96Z" class="diagram-fill"/>' : '<rect x="56" y="24" width="194" height="136" rx="24" class="diagram-wall"/><rect x="64" y="32" width="178" height="120" rx="18" class="diagram-fill"/><rect x="132" y="51" width="93" height="84" rx="24" class="diagram-water"/>'}
		<ellipse cx="109" cy="93" rx="24" ry="21" class="diagram-coral"/>
		<path d="M109 94 78 117 32 117" class="diagram-line"/>
		<text x="16" y="134">Zellkern</text>
		${animal ? '<path d="M222 137 260 151 350 151" class="diagram-line"/><text x="262" y="144">Membran</text>' :
		  '<path d="M243 36 268 31 365 31M206 94 260 104 365 104" class="diagram-line"/><text x="272" y="25">Zellwand</text><text x="271" y="96">Vakuole</text>'}
		${leaf ? '<g class="diagram-green"><ellipse cx="92" cy="52" rx="16" ry="7"/><ellipse cx="129" cy="43" rx="12" ry="6"/><ellipse cx="92" cy="141" rx="15" ry="6"/><ellipse cx="197" cy="143" rx="15" ry="6"/></g><path d="M197 143 243 160 371 160" class="diagram-line"/><text x="251" y="153">Chloroplast</text>' : ""}
	`;
}

function plant(id: string): string {
	const water = id === "water";
	const towardRoot = id === "sugar-store";
	const route = towardRoot ? "M276 66Q220 72 192 105L192 151 161 172" :
		water ? "M161 172 181 151 181 110Q208 80 275 68" : "M161 172 192 151 192 92Q187 59 212 36";
	return `
		<path d="M186 156 184 101 191 51M186 105Q156 72 109 72M187 115Q229 68 275 66" class="diagram-line plant-stem"/>
		<path d="M184 105Q122 110 100 57Q151 51 184 105M187 108Q203 55 292 53Q271 110 187 108M189 72Q178 26 225 26Q230 58 189 72" class="diagram-green"/>
		<path d="M186 147 155 168 130 170M182 155 176 179M189 151 212 168 243 173M157 167l-7 12m65-11 6 11" class="diagram-line"/>
		<path d="${route}" class="diagram-route ${water ? "route-water" : "route-sugar"}" marker-end="url(#model-arrow)"/>
		<text x="16" y="180">Wurzel</text><text x="261" y="44">Laubblatt</text>
		<text x="13" y="29">${water ? "Xylem" : "Phloem"}</text><text x="236" y="140">Sprossachse</text>
	`;
}

function photosynthesis(id: string): string {
	const bright = id === "bright", dark = id === "dark";
	return `
		<text x="15" y="35">Fotosynthese</text><text x="15" y="90">Zellatmung</text>
		<rect x="164" y="17" width="198" height="22" rx="5" class="diagram-track"/>
		<rect x="164" y="72" width="198" height="22" rx="5" class="diagram-track"/>
		${dark ? "" : `<rect x="164" y="17" width="${bright ? 176 : 74}" height="22" rx="5" class="diagram-green"/>`}
		<rect x="164" y="72" width="74" height="22" rx="5" class="diagram-coral"/>
		<text x="15" y="127">Sauerstoff netto</text>
		<text x="15" y="161">${bright ? "Das Blatt gibt Sauerstoff ab." : dark ? "Das Blatt nimmt Sauerstoff auf." : "Aufnahme und Abgabe gleichen sich aus."}</text>
	`;
}

function circulation(id: string): string {
	const positions = { right: [85, 93], lung: [195, 38], left: [305, 93], body: [195, 150] };
	const stops = [
		["right", "Rechtes Herz"], ["lung", "Lunge"], ["left", "Linkes Herz"], ["body", "Körpergewebe"],
	] as const;
	return `
		<path d="M105 72 144 57M155 131 116 114" class="diagram-route route-water" marker-end="url(#model-arrow)"/>
		<path d="M245 57 283 72M277 114 238 131" class="diagram-route route-sugar" marker-end="url(#model-arrow)"/>
		${stops.map(([key, label]) => {
			const [x, y] = positions[key];
			return `<rect x="${x - 66}" y="${y - 16}" width="132" height="32" rx="14" class="${key === id ? "diagram-active" : "diagram-fill"}"/>
			<text x="${x}" y="${y + 5}" text-anchor="middle">${label}</text>`;
		}).join("")}
	`;
}

function ear(id: string): string {
	return `
		<path d="M49 122c-30-10-36-64-6-81 24-15 52 1 44 26-4 13-18 19-16 38l89-6" class="${id === "outer" ? "diagram-route route-water" : "diagram-line"}"/>
		<path d="M159 78l6 42" class="diagram-line"/>
		<path d="M164 99l17-12 17 5 14 15 19-7" class="${id === "middle" ? "diagram-route route-sugar" : "diagram-line"}"/>
		<path d="M231 100c-7-23 14-40 34-37 22 2 32 28 16 43-13 15-38 6-36-10 2-12 19-14 24-3m16 3 72-2m-72 9 72 7" class="${id === "inner" ? "diagram-route route-water" : "diagram-line"}"/>
		<text x="23" y="152">Außenohr</text><text x="158" y="152">Mittelohr</text><text x="255" y="152">Innenohr</text>
		<text x="290" y="77">Hörnerv</text>
	`;
}

function hormones(id: string): string {
	const high = id === "high";
	return `
		<path d="M22 146h344M26 30v116M30 90h335" class="diagram-line" stroke-dasharray="4 4"/>
		<path d="${high ? "M29 90Q59 91 92 49T159 53Q214 95 361 90" : "M29 90Q59 89 92 129T159 126Q214 85 361 90"}" class="diagram-route ${high ? "route-sugar" : "route-water"}"/>
		<text x="28" y="22">Blutzucker</text>
		<text x="254" y="75">${high ? "Insulin senkt" : "Glukagon erhöht"}</text>
		<text x="320" y="173">Zeit →</text>
	`;
}

const DRAW: Record<ModelKind, (id: string) => string> = {
	cells, plant, photosynthesis, circulation, ear, hormones,
};

export function renderModel(lesson: Lesson, explored: string[], id?: string): string {
	const kind = lesson.model!;
	const scenarios = MODEL_SCENARIOS[kind];
	const scenario = scenarios.find((entry) => entry.id === id);
	// The preview shows the first state; recording any goal requires a deliberate selection.
	const diagram = DRAW[kind]((scenario ?? scenarios[0]).id);
	return `<section class="panel exploration" aria-labelledby="model-heading">
		<h2 id="model-heading">${HEADINGS[kind]}</h2>
		<p>Wähle eine Ansicht. Vergleiche das Schaubild und halte fest, was du beobachtest.</p>
		<div class="model-controls" role="group" aria-label="Ansicht">${scenarios.map((entry) => `<button type="button" class="button secondary" aria-pressed="${id === entry.id}" data-model-case="${entry.id}">${esc(entry.label)}</button>`).join("")}</div>
		<figure class="model-figure" data-model="${kind}">
			<svg viewBox="0 0 390 190" role="img" aria-labelledby="model-svg-title">
				<title id="model-svg-title">${esc((scenario ?? scenarios[0]).label)} · vereinfachtes Schaubild</title>
				<defs><marker id="model-arrow" markerWidth="6" markerHeight="6" orient="auto" refX="4" refY="3"><path d="M0 0 6 3 0 6Z" fill="context-stroke"/></marker></defs>
				${diagram}
			</svg>
			<figcaption id="model-observation" tabindex="-1">${scenario ? esc(scenario.observation) : `Vorschau: ${esc(scenarios[0].label)}. Wähle eine Ansicht, um sie zu untersuchen.`}</figcaption>
		</figure>
		<button type="button" class="button secondary" id="record-model" ${!scenario || explored.includes(scenario.id) ? "disabled" : ""}>Beobachtung festhalten</button>
		<ul class="model-goals" aria-label="Modellziele">${scenarios.map((entry) => `<li>${explored.includes(entry.id) ? "✓" : "○"} ${esc(entry.goal)}</li>`).join("")}</ul>
	</section>`;
}
