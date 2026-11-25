import { esc } from "./practice";
import {
	aciTransform,
	conjugateVerb,
	declineNoun,
	numeralSpec,
	SYLLABLE_WORDS,
	syllableStress,
	type Casus,
	type NounId,
	type Numerus,
	type TenseId,
	type VerbId,
} from "./latin-models";
import type { Lesson } from "./types";

/** Live SVG bar showing how many of the three workshop goals are reached. */
export function renderGoalProgressSvg(reachedCount: number): string {
	const clamped = Math.max(0, Math.min(3, reachedCount));
	const width = Math.round((clamped / 3) * 240);
	return `<svg class="goal-meter-svg" viewBox="0 0 320 26" role="img" aria-label="Werkstatt-Fortschritt: ${clamped} von 3 Zielen erreicht">
		<rect x="0" y="7" width="240" height="12" rx="6" class="meter-track"/>
		<rect x="0" y="7" width="${width}" height="12" rx="6" class="meter-fill"/>
		<text x="252" y="18" class="meter-label">${clamped} / 3 Ziele</text>
	</svg>`;
}

/** Wrap short SVG card labels into at most `maxLines` balanced lines on whitespace boundaries. */
export function wrapSvgLines(
	text: string,
	maxChars: number,
	maxLines = 2,
): string[] {
	const clean = text.trim().replace(/\s+/g, " ");
	if (clean.length <= maxChars || maxLines <= 1) return [clean];
	const words = clean.split(" ");
	const lines: string[] = [];
	let current = "";
	for (const word of words) {
		const candidate = current ? `${current} ${word}` : word;
		if (candidate.length <= maxChars || !current) current = candidate;
		else {
			lines.push(current);
			current = word;
		}
	}
	if (current) lines.push(current);
	if (lines.length <= maxLines) return lines;
	if (maxLines === 2) {
		const mid = Math.ceil(clean.length / 2);
		let best = -1;
		for (let i = 0; i < clean.length; i++) {
			if (
				clean[i] === " " &&
				(best === -1 || Math.abs(i - mid) < Math.abs(best - mid))
			) {
				best = i;
			}
		}
		if (best > 0) return [clean.slice(0, best), clean.slice(best + 1)];
	}
	return lines;
}

export function renderConceptDiagram(lesson: Lesson): string {
	const nodes = lesson.workshop.nodes;
	if (!nodes) return "";
	const title = lesson.workshop.diagramTitle ?? lesson.title;
	const caption =
		lesson.workshop.diagramCaption ??
		"Klicke auf einen der drei Bausteine im Schaubild, um die Erklärung anzuzeigen.";
	return `<figure class="svg-lab" data-concept-lab>
		<svg viewBox="0 0 660 214" role="img" aria-label="${esc(title)}: dreiteiliges Schaubild">
			<path d="M210 107h20M430 107h20" class="diagram-arrow" marker-end="url(#arrow-head)"/>
			<defs>
				<marker id="arrow-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
					<path d="M0 1L10 5L0 9z" class="diagram-arrowhead"/>
				</marker>
			</defs>
			${nodes
				.map((node, i) => {
					const x = 12 + i * 220;
					const cx = x + 98;
					const titleLines = wrapSvgLines(node.label, 20, 2);
					const detailLines = wrapSvgLines(node.detail, 22, 2);
					const titleSvg =
						titleLines.length === 1
							? `<text x="${cx}" y="74" text-anchor="middle" class="concept-title">${esc(titleLines[0])}</text>`
							: `<text x="${cx}" y="68" text-anchor="middle" class="concept-title">${esc(titleLines[0])}<tspan x="${cx}" dy="15">${esc(titleLines[1])}</tspan></text>`;
					const detailSvg =
						detailLines.length === 1
							? `<text x="${cx}" y="132" text-anchor="middle" class="concept-detail">${esc(detailLines[0])}</text>`
							: `<text x="${cx}" y="122" text-anchor="middle" class="concept-detail">${esc(detailLines[0])}<tspan x="${cx}" dy="18">${esc(detailLines[1])}</tspan></text>`;
					return `<g class="diagram-node" data-diagram-focus="${i}" tabindex="0" role="button" aria-pressed="${i === 0 ? "true" : "false"}">
						<rect x="${x}" y="14" width="196" height="186" rx="14" class="node-box"/>
						<circle cx="${cx}" cy="38" r="12" class="node-badge"/>
						<text x="${cx}" y="42.5" text-anchor="middle" class="node-num">${i + 1}</text>
						${titleSvg}
						<line x1="${x + 28}" y1="96" x2="${x + 168}" y2="96" class="concept-divider"/>
						${detailSvg}
						<text x="${cx}" y="182" text-anchor="middle" class="node-hint">Antippen zum Prüfen</text>
					</g>`;
				})
				.join("")}
		</svg>
		<div class="diagram-controls" role="group" aria-label="Schaubild-Bereiche">
			${nodes
				.map(
					(node, i) =>
						`<button type="button" class="button secondary" data-diagram-btn="${i}" aria-pressed="${i === 0 ? "true" : "false"}">${i + 1} · ${esc(node.label)}</button>`,
				)
				.join("")}
		</div>
		<p class="lab-readout" data-diagram-readout aria-live="polite"><strong>${esc(nodes[0].label)}:</strong> ${esc(nodes[0].explanation)}</p>
		<figcaption>${esc(caption)}</figcaption>
	</figure>`;
}

export function renderSyllableSvg(wordId: string): string {
	const spec = syllableStress(wordId);
	const count = spec.syllables.length;
	const boxW = 112;
	const gap = 16;
	const totalW = count * boxW + (count - 1) * gap;
	const startX = (600 - totalW) / 2;
	const stressX = startX + spec.stressIndex * (boxW + gap) + boxW / 2;
	return `<svg viewBox="0 0 600 175" role="img" aria-label="Silben und Betonung von ${esc(spec.word)}">
		<text x="300" y="30" text-anchor="middle" class="lab-svg-heading">Pänultima-Regel · vorletzte Silbe: ${esc(spec.penultLength)}</text>
		<path d="M${stressX} 46 L${stressX} 68" class="stress-arrow"/>
		<polygon points="${stressX - 6},64 ${stressX + 6},64 ${stressX},74" class="diagram-arrowhead"/>
		${spec.syllables
			.map((syl, idx) => {
				const x = startX + idx * (boxW + gap);
				const isStressed = idx === spec.stressIndex;
				const isPenult = idx === count - 2;
				return `<g class="syllable-box ${isStressed ? "is-stressed" : ""}">
					<rect x="${x}" y="78" width="${boxW}" height="56" rx="12" class="node-box"/>
					<text x="${x + boxW / 2}" y="112" text-anchor="middle" class="syllable-text">${esc(syl)}</text>
					<text x="${x + boxW / 2}" y="156" text-anchor="middle" class="node-hint">${isStressed ? "betont" : isPenult ? "Pänultima" : `Silbe ${idx + 1}`}</text>
				</g>`;
			})
			.join("")}
	</svg>`;
}

export function renderSyllableLab(): string {
	const initial = "amicus";
	return `<div class="svg-lab" data-syllable-lab>
		<div class="lab-controls">
			<label for="syllable-select">Beispielwort wählen</label>
			<select id="syllable-select">
				${Object.values(SYLLABLE_WORDS)
					.map(
						(entry) =>
							`<option value="${entry.id}"${entry.id === initial ? " selected" : ""}>${esc(entry.word)}</option>`,
					)
					.join("")}
			</select>
		</div>
		<div id="syllable-svg">${renderSyllableSvg(initial)}</div>
		<p class="lab-readout" id="syllable-readout" aria-live="polite">${esc(syllableStress(initial).rule)}</p>
	</div>`;
}

export function renderDeclensionSvg(nounId: NounId, numerus: Numerus, casus: Casus): string {
	const res = declineNoun(nounId, numerus, casus);
	const stemW = Math.max(150, Math.min(270, res.stem.length * 26 + 46));
	const endW = Math.max(120, Math.min(200, (res.ending.length || 1) * 26 + 44));
	const total = stemW + 30 + endW;
	const x0 = (600 - total) / 2;
	return `<svg viewBox="0 0 600 160" role="img" aria-label="Deklinationsform ${esc(res.full)}">
		<text x="300" y="28" text-anchor="middle" class="lab-svg-heading">${esc(res.declension)} · ${esc(res.question)}</text>
		<rect x="${x0}" y="48" width="${stemW}" height="68" rx="12" class="node-box"/>
		<text x="${x0 + stemW / 2}" y="88" text-anchor="middle" class="morph-text">${esc(res.stem)}</text>
		<text x="${x0 + stemW / 2}" y="138" text-anchor="middle" class="node-hint">Stamm</text>
		<text x="${x0 + stemW + 15}" y="88" text-anchor="middle" class="morph-plus">+</text>
		<rect x="${x0 + stemW + 30}" y="48" width="${endW}" height="68" rx="12" class="node-box accent-box"/>
		<text x="${x0 + stemW + 30 + endW / 2}" y="88" text-anchor="middle" class="morph-text">${esc(res.ending || "∅")}</text>
		<text x="${x0 + stemW + 30 + endW / 2}" y="138" text-anchor="middle" class="node-hint">Kasusendung</text>
	</svg>`;
}

export function renderDeclensionLab(thirdOnly: boolean): string {
	const nouns: NounId[] = thirdOnly
		? ["rex", "urbs", "nomen", "mare"]
		: ["serva", "amicus", "templum"];
	const initialNoun = nouns[0];
	return `<div class="svg-lab" data-declension-lab>
		<div class="lab-controls three-col">
			<label>Substantiv<select id="decl-noun">${nouns.map((id) => `<option value="${id}">${esc(declineNoun(id, "sg", "nom").label)}</option>`).join("")}</select></label>
			<label>Numerus<select id="decl-num"><option value="sg">Singular</option><option value="pl">Plural</option></select></label>
			<label>Kasus<select id="decl-casus"><option value="nom">Nominativ</option><option value="gen">Genitiv</option><option value="dat">Dativ</option><option value="akk">Akkusativ</option><option value="abl">Ablativ</option></select></label>
		</div>
		<div id="decl-svg">${renderDeclensionSvg(initialNoun, "sg", "nom")}</div>
		<p class="lab-readout" id="decl-readout" aria-live="polite"></p>
	</div>`;
}

export function renderNumeralSvg(value: number): string {
	const spec = numeralSpec(value);
	const barW = Math.round((spec.value / 12) * 340);
	const tokens = spec.parts;
	const chipW = 46;
	const gap = 8;
	const startX = (600 - (tokens.length * chipW + (tokens.length - 1) * gap)) / 2;
	return `<svg viewBox="0 0 600 170" role="img" aria-label="Zahl ${spec.value}: ${spec.roman}, ${spec.cardinal}">
		<text x="300" y="28" text-anchor="middle" class="lab-svg-heading">${spec.value} = ${spec.roman} · ${esc(spec.cardinal)} (${esc(spec.ordinal)})</text>
		${tokens
			.map((tok, i) => {
				const x = startX + i * (chipW + gap);
				const isOp = tok === "+" || tok === "−";
				return isOp
					? `<text x="${x + chipW / 2}" y="76" text-anchor="middle" class="morph-plus">${esc(tok)}</text>`
					: `<rect x="${x}" y="46" width="${chipW}" height="44" rx="10" class="node-box accent-box"/><text x="${x + chipW / 2}" y="75" text-anchor="middle" class="morph-text">${esc(tok)}</text>`;
			})
			.join("")}
		<rect x="130" y="114" width="340" height="16" rx="8" class="meter-track"/>
		<rect x="130" y="114" width="${barW}" height="16" rx="8" class="meter-fill"/>
		<text x="300" y="154" text-anchor="middle" class="node-hint">${esc(spec.rule)} · Maßstab ${spec.value} / 12</text>
	</svg>`;
}

export function renderNumeralLab(): string {
	return `<div class="svg-lab" data-numeral-lab>
		<div class="lab-controls">
			<label for="numeral-slider">Römische Zahl wählen (1 bis 12)</label>
			<input id="numeral-slider" type="range" min="1" max="12" value="4"/>
		</div>
		<div id="numeral-svg">${renderNumeralSvg(4)}</div>
		<p class="lab-readout" id="numeral-readout" aria-live="polite"></p>
	</div>`;
}

export function renderVerbSvg(verbId: VerbId, tense: TenseId, person: number): string {
	const res = conjugateVerb(verbId, tense, person);
	const markerText = res.marker || "∅";
	const boxes = [
		{ title: "Stamm", text: res.stem || "∅", accent: false },
		{ title: "Tempus-/Bindevokal", text: markerText, accent: true },
		{ title: "Personalendung", text: res.ending || "∅", accent: false },
	];
	return `<svg viewBox="0 0 600 165" role="img" aria-label="Verbform ${esc(res.full)}: ${esc(res.translation)}">
		<text x="300" y="28" text-anchor="middle" class="lab-svg-heading">${esc(res.full)} → ${esc(res.translation)}</text>
		${boxes
			.map((box, i) => {
				const x = 22 + i * 194;
				return `<rect x="${x}" y="48" width="168" height="66" rx="12" class="node-box${box.accent ? " accent-box" : ""}"/>
					<text x="${x + 84}" y="88" text-anchor="middle" class="morph-text">${esc(box.text)}</text>
					<text x="${x + 84}" y="138" text-anchor="middle" class="node-hint">${esc(box.title)}</text>`;
			})
			.join("")}
	</svg>`;
}

export function renderVerbLab(mode: "verb" | "tense" | "irregular"): string {
	const verbs: VerbId[] =
		mode === "irregular"
			? ["esse", "posse", "velle", "nolle", "malle", "ire"]
			: ["vocare", "monere", "ducere", "capere", "audire"];
	const tenses: [TenseId, string][] =
		mode === "tense"
			? [
					["plusquamperfekt", "Plusquamperfekt (Vorvergangenheit)"],
					["perfekt", "Perfekt (Vergangenheit)"],
					["imperfekt", "Imperfekt (Dauer/Hintergrund)"],
					["praesens", "Präsens (Gegenwart)"],
					["futur2", "Futur II (Vorzukunft)"],
					["futur1", "Futur I (Zukunft)"],
				]
			: [
					["praesens", "Präsens"],
					["imperfekt", "Imperfekt"],
					["perfekt", "Perfekt"],
					["plusquamperfekt", "Plusquamperfekt"],
					["futur1", "Futur I"],
					["futur2", "Futur II"],
				];
	const initialTense: TenseId = mode === "tense" ? "futur1" : "praesens";
	return `<div class="svg-lab" data-verb-lab>
		<div class="lab-controls three-col">
			<label>Verb<select id="verb-id">${verbs.map((id) => `<option value="${id}">${esc(conjugateVerb(id, "praesens", 0).label)}</option>`).join("")}</select></label>
			<label>Tempus<select id="verb-tense">${tenses.map(([id, label]) => `<option value="${id}"${id === initialTense ? " selected" : ""}>${label}</option>`).join("")}</select></label>
			<label>Person<select id="verb-person"><option value="0">1. Sg. (ich)</option><option value="1">2. Sg. (du)</option><option value="2" selected>3. Sg. (er/sie/es)</option><option value="3">1. Pl. (wir)</option><option value="4">2. Pl. (ihr)</option><option value="5">3. Pl. (sie)</option></select></label>
		</div>
		<div id="verb-svg">${renderVerbSvg(verbs[0], initialTense, 2)}</div>
		<p class="lab-readout" id="verb-readout" aria-live="polite"></p>
	</div>`;
}

export function renderAciSvg(headTense: "praesens" | "perfekt", infTense: "praesens" | "perfekt"): string {
	const res = aciTransform(headTense, infTense);
	return `<svg viewBox="0 0 600 185" role="img" aria-label="AcI-Umformung: ${esc(res.german)}">
		<text x="300" y="26" text-anchor="middle" class="lab-svg-heading">${esc(res.relation)}</text>
		<rect x="18" y="44" width="174" height="58" rx="12" class="node-box"/>
		<text x="105" y="70" text-anchor="middle" class="node-hint">Kopfverb</text>
		<text x="105" y="90" text-anchor="middle" class="node-detail">${esc(res.headLatin)}</text>
		<rect x="213" y="44" width="174" height="58" rx="12" class="node-box accent-box"/>
		<text x="300" y="70" text-anchor="middle" class="node-hint">Subjektsakkusativ</text>
		<text x="300" y="90" text-anchor="middle" class="node-detail">${esc(res.subjAcc)}</text>
		<rect x="408" y="44" width="174" height="58" rx="12" class="node-box accent-box"/>
		<text x="495" y="70" text-anchor="middle" class="node-hint">Infinitiv (Prädikat)</text>
		<text x="495" y="90" text-anchor="middle" class="node-detail">${esc(res.infinitive)}</text>
		<path d="M300 104v18" class="stress-arrow"/>
		<rect x="38" y="124" width="524" height="46" rx="12" class="node-box"/>
		<text x="300" y="153" text-anchor="middle" class="node-detail">${esc(res.german)}</text>
	</svg>`;
}

export function renderAciLab(): string {
	return `<div class="svg-lab" data-aci-lab>
		<div class="lab-controls two-col">
			<label>Tempus des Kopfverbs<select id="aci-head"><option value="praesens">Mārcus videt (Präsens)</option><option value="perfekt">Mārcus vīdit (Vergangenheit)</option></select></label>
			<label>Infinitiv im AcI<select id="aci-inf"><option value="praesens">venīre (Inf. Präsens · gleichzeitig)</option><option value="perfekt">vēnisse (Inf. Perfekt · vorzeitig)</option></select></label>
		</div>
		<div id="aci-svg">${renderAciSvg("praesens", "praesens")}</div>
		<p class="lab-readout" id="aci-readout" aria-live="polite"></p>
	</div>`;
}

export function renderTimelineSvg(): string {
	const epochs = [
		{ id: "mythos", x: 75, year: "Mythos", title: "Aeneas & Troja", text: "Aeneas flieht aus Troja nach Latium; Vergil erzählt diesen Ursprungsmythos in der Aeneis." },
		{ id: "koenige", x: 225, year: "753–509 v. Chr.", title: "Königszeit", text: "Romulus gründet nach der Sage 753 v. Chr. Rom; sieben Könige bis zur Vertreibung des Tarquinius Superbus." },
		{ id: "republik", x: 375, year: "ab 509 v. Chr.", title: "Frühe Republik", text: "Ständekämpfe, Senat, Volksversammlung und Volkstribunat; Rom breitet sich über Mittel- und Unteritalien aus." },
		{ id: "vesuv", x: 525, year: "79 n. Chr.", title: "Vesuvausbruch", text: "Plinius d. J. beschreibt den Ausbruch des Vesuvs; Pompeji und Herkuláneum bleiben unter Asche konserviert." },
	];
	return `<figure class="svg-lab" data-timeline-lab>
		<svg viewBox="0 0 600 175" role="img" aria-label="Zeitleiste Roms vom Gründungsmythos bis 79 n. Chr.">
			<line x1="65" y1="88" x2="535" y2="88" class="timeline-axis"/>
			${epochs
				.map(
					(ep, i) => `<g class="diagram-node" data-timeline-focus="${i}" tabindex="0" role="button" aria-pressed="${i === 0 ? "true" : "false"}">
						<circle cx="${ep.x}" cy="88" r="16" class="node-badge"/>
						<text x="${ep.x}" y="93" text-anchor="middle" class="node-num">${i + 1}</text>
						<text x="${ep.x}" y="52" text-anchor="middle" class="node-title">${ep.year}</text>
						<text x="${ep.x}" y="132" text-anchor="middle" class="node-detail">${ep.title}</text>
					</g>`,
				)
				.join("")}
		</svg>
		<div class="diagram-controls">
			${epochs
				.map(
					(ep, i) =>
						`<button type="button" class="button secondary" data-timeline-btn="${i}" aria-pressed="${i === 0 ? "true" : "false"}">${ep.year}</button>`,
				)
				.join("")}
		</div>
		<p class="lab-readout" data-timeline-readout aria-live="polite"><strong>${epochs[0].title}:</strong> ${epochs[0].text}</p>
	</figure>`;
}

const OLYMPIER_GROUP_LABELS = [
	"Himmel, Meer & Herd",
	"Weisheit, Licht & Jagd",
	"Krieg, Liebe, Bote & Feuer",
] as const;

export const OLYMPIER_GROUPS = [
	[
		{ gr: "Zeus", la: "Iuppiter", domain: "Blitz & Göttervater" },
		{ gr: "Hera", la: "Iūnō", domain: "Ehe & Familie" },
		{ gr: "Poseidon", la: "Neptūnus", domain: "Meer & Erdbeben" },
		{ gr: "Hestia", la: "Vesta", domain: "Herd & Hausfeuer" },
	],
	[
		{ gr: "Athene", la: "Minerva", domain: "Weisheit & Handwerk" },
		{ gr: "Apollon", la: "Apollō", domain: "Musik, Licht & Orakel" },
		{ gr: "Artemis", la: "Diāna", domain: "Jagd & Mond" },
		{ gr: "Demeter", la: "Cerēs", domain: "Fruchtbarkeit & Acker" },
	],
	[
		{ gr: "Ares", la: "Mārs", domain: "Krieg" },
		{ gr: "Aphrodite", la: "Venus", domain: "Liebe & Schönheit" },
		{ gr: "Hermes", la: "Mercurius", domain: "Götterbote & Handel" },
		{ gr: "Hephaistos", la: "Vulcānus", domain: "Feuer & Schmiede" },
	],
];

export function renderOlympierSvg(): string {
	return `<figure class="svg-lab" data-olympier-lab>
		<svg viewBox="0 0 600 185" role="img" aria-label="Griechische und römische Gottheiten im Überblick">
			${OLYMPIER_GROUPS[0]
				.map((c, i) => {
					const x = 14 + i * 146;
					return `<rect x="${x}" y="20" width="134" height="142" rx="12" class="node-box"/>
						<text x="${x + 67}" y="54" text-anchor="middle" class="node-title">${c.gr}</text>
						<text x="${x + 67}" y="82" text-anchor="middle" class="node-detail">${c.la}</text>
						<text x="${x + 67}" y="122" text-anchor="middle" class="node-hint">${c.domain}</text>`;
				})
				.join("")}
		</svg>
		<div class="diagram-controls">
			${OLYMPIER_GROUP_LABELS
				.map(
					(label, i) =>
						`<button type="button" class="button secondary" data-olympier-btn="${i}" aria-pressed="${i === 0 ? "true" : "false"}">${label}</button>`,
				)
				.join("")}
		</div>
		<p class="lab-readout" data-olympier-readout aria-live="polite">Griechische und römische Namen entsprechen sich paarweise (z. B. Zeus = Iuppiter, Athene = Minerva). Hades/Plūtō herrscht über die Unterwelt und zählt nicht zu den zwölf Olympiern.</p>
	</figure>`;
}

export const TIMELINE_EPOCHS = [
	{ year: "Mythos", title: "Aeneas & Troja", text: "Aeneas flieht aus Troja nach Latium; Vergil erzählt diesen Ursprungsmythos in der Aeneis." },
	{ year: "753–509 v. Chr.", title: "Königszeit", text: "Romulus gründet nach der Sage 753 v. Chr. Rom; sieben Könige bis zur Vertreibung des Tarquinius Superbus." },
	{ year: "ab 509 v. Chr.", title: "Frühe Republik", text: "Ständekämpfe, Senat, Volksversammlung und Volkstribunat; Rom breitet sich über Mittel- und Unteritalien aus." },
	{ year: "79 n. Chr.", title: "Vesuvausbruch", text: "Plinius d. J. beschreibt den Ausbruch des Vesuvs; Pompeji und Herkuláneum bleiben unter Asche konserviert." },
];
