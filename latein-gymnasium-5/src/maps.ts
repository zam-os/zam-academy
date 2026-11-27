import { esc } from "./practice";

export interface RomePlace {
	id: string;
	name: string;
	layer: "hills" | "politics" | "games" | "supply";
	x: number;
	y: number;
	labelX: number;
	labelY: number;
	note: string;
}

export const ROME_PLACES: RomePlace[] = [
	{
		id: "kapitol",
		name: "Kapitol (Tempel des Jupiter)",
		layer: "politics",
		x: 236,
		y: 126,
		labelX: 236,
		labelY: 112,
		note: "Kapitol (Capitōlium): Heiliger Burghügel über dem Forum mit dem Haupttempel von Iuppiter, Iūnō und Minerva.",
	},
	{
		id: "forum",
		name: "Forum Romanum",
		layer: "politics",
		x: 318,
		y: 148,
		labelX: 318,
		labelY: 134,
		note: "Forum Rōmānum: Zentrum für Politik (Cūria, Rōstra), Rechtsprechung, Markt und Tempel im Tal zwischen Kapitol und Palatin.",
	},
	{
		id: "palatin",
		name: "Palatin",
		layer: "hills",
		x: 326,
		y: 196,
		labelX: 326,
		labelY: 182,
		note: "Palatin (Palātium): Gründungshügel des Romulus; später Standort der Kaiserpaläste (Namensgeber für 'Palast').",
	},
	{
		id: "kolosseum",
		name: "Kolosseum",
		layer: "games",
		x: 422,
		y: 170,
		labelX: 422,
		labelY: 156,
		note: "Kolosseum (Amphitheātrum Flāvium): Ovales Großbauwerk für ca. 50 000 Zuschauer bei Gladiatorenkämpfen und Tierhetzen.",
	},
	{
		id: "konstantinsbogen",
		name: "Konstantinsbogen",
		layer: "politics",
		x: 400,
		y: 204,
		labelX: 432,
		labelY: 220,
		note: "Konstantinsbogen: Dreitoriger Triumphbogen direkt beim Kolosseum zur Erinnerung an den Sieg von 312 n. Chr.",
	},
	{
		id: "circus",
		name: "Circus Maximus",
		layer: "games",
		x: 298,
		y: 232,
		labelX: 298,
		labelY: 218,
		note: "Circus Maximus: Über 600 m lange Rennbahn zwischen Palatin und Aventin für Wagenrennen (Quadrigen).",
	},
	{
		id: "thermen",
		name: "Thermen",
		layer: "games",
		x: 368,
		y: 296,
		labelX: 368,
		labelY: 282,
		note: "Thermen (z. B. Caracallathermen): Öffentliche Badeanlagen mit Kalt-, Lau- und Heißbad, Sportplatz und Bibliotheken.",
	},
	{
		id: "aquaedukt",
		name: "Aquädukt",
		layer: "supply",
		x: 540,
		y: 186,
		labelX: 540,
		labelY: 162,
		note: "Aquädukt (aqua + dūcere): Bogenleitung, die sauberes Quellwasser mit leichtem Gefälle aus den Bergen nach Rom führte.",
	},
	{
		id: "ostia",
		name: "Ostia (Hafen)",
		layer: "supply",
		x: 82,
		y: 274,
		labelX: 98,
		labelY: 256,
		note: "Ostia: Roms Seehafen an der Tibermündung (ca. 25 km südwestlich im Kartenausschnitt), Umschlagplatz für Getreide und Waren.",
	},
];

export const ROME_HILLS: Array<{
	name: string;
	cx: number;
	cy: number;
	rx: number;
	ry: number;
	labelX: number;
	labelY: number;
	showLabel?: boolean;
}> = [
	{ name: "Quirinal", cx: 318, cy: 56, rx: 40, ry: 18, labelX: 318, labelY: 60, showLabel: true },
	{ name: "Viminal", cx: 406, cy: 86, rx: 36, ry: 17, labelX: 406, labelY: 90, showLabel: true },
	{ name: "Esquilin", cx: 482, cy: 122, rx: 46, ry: 20, labelX: 482, labelY: 126, showLabel: true },
	{ name: "Kapitol", cx: 236, cy: 126, rx: 32, ry: 18, labelX: 236, labelY: 146, showLabel: false },
	{ name: "Palatin", cx: 326, cy: 196, rx: 38, ry: 18, labelX: 326, labelY: 200, showLabel: false },
	{ name: "Caelius", cx: 472, cy: 256, rx: 42, ry: 18, labelX: 472, labelY: 260, showLabel: true },
	{ name: "Aventin", cx: 262, cy: 276, rx: 42, ry: 18, labelX: 262, labelY: 280, showLabel: true },
];

export function renderRomeMap(
	activeLayer: "all" | RomePlace["layer"] = "all",
	selectedId = "forum",
): string {
	const selected =
		ROME_PLACES.find((entry) => entry.id === selectedId) ?? ROME_PLACES[1];
	const opacityFor = (layer: RomePlace["layer"]) =>
		activeLayer === "all" || activeLayer === layer ? "1" : "0.2";

	return `<figure class="rome-map">
		<div class="explorer-controls" role="group" aria-label="Kartenebenen filtern">
			<button type="button" data-map-focus="all" aria-pressed="${activeLayer === "all"}">Alle Orte</button>
			<button type="button" data-map-focus="hills" aria-pressed="${activeLayer === "hills"}">7 Hügel &amp; Tiber</button>
			<button type="button" data-map-focus="politics" aria-pressed="${activeLayer === "politics"}">Politik &amp; Kult</button>
			<button type="button" data-map-focus="games" aria-pressed="${activeLayer === "games"}">Spiele &amp; Thermen</button>
			<button type="button" data-map-focus="supply" aria-pressed="${activeLayer === "supply"}">Aquädukt &amp; Ostia</button>
		</div>
		<svg viewBox="0 0 640 340" role="img" aria-label="Schematische Karte des antiken Rom mit den sieben Hügeln, dem Tiber, Bauwerken und dem Hafen Ostia">
			<rect x="0" y="0" width="640" height="340" rx="12" fill="var(--rome-land)"/>
			<g data-map-layer="hills" style="opacity:${opacityFor("hills")}">
				<path d="M138 14 C166 56, 128 96, 162 132 C194 166, 206 184, 174 214 C146 240, 152 288, 176 328" fill="none" stroke="var(--rome-water)" stroke-width="20" stroke-linecap="round"/>
				<path d="M138 14 C166 56, 128 96, 162 132 C194 166, 206 184, 174 214 C146 240, 152 288, 176 328" fill="none" stroke="#2f7fbf" stroke-width="2.5" stroke-dasharray="10 6" opacity="0.55"/>
				<ellipse cx="182" cy="172" rx="10" ry="5" fill="var(--rome-hill)" stroke="var(--v-line)" stroke-width="1"/>
				<text x="116" y="176" text-anchor="end" class="rome-label-halo">Tiberinsel</text>
				<text x="116" y="88" text-anchor="end" class="rome-label-halo">Tiber (Tiberis)</text>
				${ROME_HILLS.map(
					(hill) =>
						`<ellipse cx="${hill.cx}" cy="${hill.cy}" rx="${hill.rx}" ry="${hill.ry}" fill="var(--rome-hill)" stroke="var(--line-strong)" stroke-width="1.2"/>${hill.showLabel !== false ? `<text x="${hill.labelX}" y="${hill.labelY}" text-anchor="middle" class="rome-label-halo">${esc(hill.name)}</text>` : ""}`,
				).join("")}
			</g>
			<g data-map-layer="supply" style="opacity:${opacityFor("supply")}">
				<rect x="14" y="218" width="146" height="106" rx="10" class="v-paper"/>
				<rect x="18" y="222" width="44" height="98" rx="6" fill="var(--rome-water)"/>
				<text x="40" y="308" text-anchor="middle" font-size="9" font-weight="700">Meer</text>
				<path d="M154 274 C122 276, 94 272, 62 274" fill="none" stroke="#2f7fbf" stroke-width="6" stroke-linecap="round"/>
				<text x="87" y="238" text-anchor="middle" font-size="10" font-weight="700">Ausschnitt (25 km SW)</text>
				<path d="M510 190 L618 168" fill="none" stroke="var(--v-blue)" stroke-width="4" stroke-dasharray="7 5"/>
				<line x1="518" y1="188" x2="518" y2="202" stroke="var(--v-blue)" stroke-width="3"/>
				<line x1="546" y1="182" x2="546" y2="196" stroke="var(--v-blue)" stroke-width="3"/>
				<line x1="574" y1="177" x2="574" y2="191" stroke="var(--v-blue)" stroke-width="3"/>
				<line x1="602" y1="171" x2="602" y2="185" stroke="var(--v-blue)" stroke-width="3"/>
			</g>
			<g data-map-layer="politics" style="opacity:${opacityFor("politics")}">
				<rect x="290" y="138" width="56" height="22" rx="6" class="v-gold-fill"/>
			</g>
			<g data-map-layer="games" style="opacity:${opacityFor("games")}">
				<ellipse cx="422" cy="170" rx="22" ry="13" class="v-coral-fill"/>
				<rect x="268" y="222" width="60" height="18" rx="9" class="v-orange-fill"/>
				<rect x="348" y="286" width="42" height="20" rx="6" class="v-teal-fill"/>
			</g>
			${ROME_PLACES.map((place) => {
				const isSelected = place.id === selected.id;
				const visible = activeLayer === "all" || activeLayer === place.layer;
				return `<g class="visual-part" data-place="${esc(place.id)}" data-map-layer="${place.layer}" style="opacity:${visible ? "1" : "0.2"}" tabindex="0" role="button" aria-label="${esc(place.name)}">
					<circle cx="${place.x}" cy="${place.y}" r="${isSelected ? 8 : 6}" fill="${isSelected ? "var(--stage-color, var(--accent))" : "var(--v-paper)"}" stroke="var(--stage-color, var(--accent))" stroke-width="2.4"/>
					<text x="${place.labelX}" y="${place.labelY}" text-anchor="middle" class="rome-label-halo">${esc(place.name.replace(/ \(.*\)/, ""))}</text>
				</g>`;
			}).join("")}
		</svg>
		<div class="explorer-controls" role="group" aria-label="Bauwerke und Orte auswählen" style="margin-top:0.65rem">
			${ROME_PLACES.map((place) => `<button type="button" data-place-btn="${esc(place.id)}" aria-pressed="${place.id === selected.id}">${esc(place.name.replace(/ \(.*\)/, ""))}</button>`).join("")}
		</div>
		<p id="rome-map-note" class="explorer-readout" role="status" aria-live="polite"><strong>${esc(selected.name)}:</strong> ${esc(selected.note)}</p>
	</figure>`;
}
